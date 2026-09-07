<?php

declare(strict_types=1);

namespace App\Demo\Ai\Tools;

use App\Demo\Models\Client;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Alxtexh\Panel\Ai\PanelTool;

/**
 * Look a subscriber up by access code, phone or name.
 *
 * READ-ONLY, AND STILL AUTHORISED. It is tempting to treat reads as harmless and
 * skip the check - but this returns a person's phone number and their service
 * status, and the panel already decided who may see that. A tool that answers a
 * question the screen would refuse is the same leak through a different pipe.
 *
 * THE TENANT SCOPE DOES THE HEAVY LIFTING. `Client::query()` carries the global
 * scope, so a subscriber belonging to another organisation cannot be found here
 * whatever the model asks for - the authorisation check above it is about
 * whether this person may read subscribers at all.
 */
final class FindSubscriber extends PanelTool implements Tool
{
    public function description(): string
    {
        return 'Find a subscriber in this organisation by access code, phone number, or name. '
            .'Returns their current status and plan.';
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'query' => $schema->string()
                ->description('An access code, phone number, or part of a name.')
                ->required(),
        ];
    }

    public function handle(Request $request): string
    {
        if ($refusal = $this->authorise('viewAny', 'clients')) {
            return $refusal;
        }

        $term = trim((string) $request['query']);

        if ($term === '') {
            return 'I need something to search for - an access code, a phone number, or a name.';
        }

        /*
         * BOUNDED, and deliberately small. A tool result is fed back into the
         * model as context, so an unbounded query is both a cost and a way to
         * push everything else out of the window. Five is enough to say "did you
         * mean one of these" and not enough to be a data export.
         */
        $matches = Client::query()
            ->where(function ($q) use ($term): void {
                $q->where('access_code', $term)
                    ->orWhere('phone', $term)
                    ->orWhere('name', 'like', $term.'%');
            })
            ->limit(5)
            ->get(['id', 'name', 'phone', 'access_code', 'status']);

        if ($matches->isEmpty()) {
            return "No subscriber here matches \"{$term}\".";
        }

        return $matches
            ->map(fn (Client $c): string => sprintf(
                '#%s %s (%s) - %s, access code %s',
                $c->id, $c->name, $c->phone, $c->status, $c->access_code,
            ))
            ->implode("\n");
    }
}
