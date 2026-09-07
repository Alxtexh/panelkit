<?php

declare(strict_types=1);

namespace App\Demo\Ai\Tools;

use App\Demo\Models\Client;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Approvals\Approval;
use Laravel\Ai\Concerns\InteractsWithApprovals;
use Laravel\Ai\Contracts\Approvable;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Alxtexh\Panel\Ai\PanelTool;

/**
 * Suspend a subscriber's service.
 *
 * THIS IS THE TOOL THAT JUSTIFIES THE WHOLE APPROACH. It cuts somebody's
 * internet off. A language model decided to call it, from a sentence a human
 * typed, and the sentence may have been ambiguous, or mistyped, or about a
 * different person with a similar name.
 *
 * SO IT PAUSES AND ASKS - through the SDK's approval flow, not through a prompt
 * instruction. "Only suspend when the user clearly asks" is a request, and the
 * entire premise of a language model is that its output is not guaranteed. An
 * approval gate is a mechanism: the run stops, a human sees exactly which
 * subscriber and why, and nothing happens until they say so.
 *
 * AND IT IS AUTHORISED ANYWAY, before the approval is even offered. Approval and
 * permission answer different questions - "did you mean this" versus "may you do
 * this" - and a tool that only asked for confirmation would let a read-only role
 * suspend anybody willing to click yes.
 *
 * THE APPROVAL REASON NAMES THE SUBSCRIBER. A prompt reading "Approve
 * suspend_subscriber?" is one somebody clicks through; one reading "Suspend
 * Amina Otieno (+254700000001)?" is one they read.
 */
final class SuspendSubscriber extends PanelTool implements Approvable, Tool
{
    use InteractsWithApprovals;

    public function description(): string
    {
        return 'Suspend a subscriber, cutting off their service. Requires human approval.';
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()
                ->description('The subscriber id, as returned by find_subscriber.')
                ->required(),
            'reason' => $schema->string()
                ->description('Why they are being suspended.')
                ->required(),
        ];
    }

    public function isDestructive(): bool
    {
        return true;
    }

    /**
     * Always ask, and say who it is about.
     *
     * The subscriber is looked up here - through the tenant scope - so the
     * question a human answers names a real person in their own organisation. A
     * lookup that finds nothing still asks, because "approve suspending
     * subscriber 91827, who does not appear to exist" is exactly the prompt
     * somebody should see before the tool reports the same thing.
     */
    public function shouldRequestApproval(Request $request): Approval
    {
        $client = Client::query()->whereKey($request['id'])->first();

        $who = $client === null
            ? "subscriber #{$request['id']} (not found in this organisation)"
            : "{$client->name} ({$client->phone})";

        return Approval::required("Suspend {$who}? Reason given: ".$request['reason']);
    }

    public function handle(Request $request): string
    {
        $client = Client::query()->whereKey($request['id'])->first();

        /*
         * NOT FOUND IS CHECKED BEFORE THE PERMISSION, because the scope has
         * already applied: a subscriber belonging to another organisation is
         * simply absent here, and saying "you do not have permission" about a
         * record that is not theirs would confirm it exists.
         */
        if ($client === null) {
            return 'There is no subscriber with that id in this organisation.';
        }

        // The SAME gate the suspend button uses - see PanelTool.
        if ($refusal = $this->authorise('update', 'clients', $client)) {
            return $refusal;
        }

        if ($client->status === 'suspended') {
            return "{$client->name} is already suspended.";
        }

        $client->status = 'suspended';
        $client->save();

        /*
         * The change is now in the audit trail, attributed to the signed-in
         * user - which is correct: they approved it. `AuditRecorder` reads
         * `auth()->user()`, and the approval flow runs inside their request.
         */
        return "Suspended {$client->name}. The change is recorded in their history.";
    }
}
