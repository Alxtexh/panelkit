<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Alxtexh\Panel\Actions\BulkRunner;
use Alxtexh\Panel\Actions\BulkCheckpoint;
use Alxtexh\Panel\Actions\JobStatus;
use RuntimeException;
use Throwable;

/**
 * A bulk action over "everything matching the current filters".
 *
 * QUEUED BECAUSE THE SET IS UNBOUNDED. An explicit selection is bounded by what
 * a person can tick on screen and runs inline; select-all-matching can be every
 * row in the table, and a request that updates 400,000 rows will hit the PHP
 * time limit somewhere in the middle - leaving a partial write with no record
 * of where it stopped.
 *
 * The FILTERS travel, not the ids. Serialising 400,000 identifiers into the
 * jobs table to describe "all of them" is a payload bigger than the work; the
 * query is re-derived from the same parameters the table used.
 *
 * That does mean the set is evaluated when the job RUNS, not when it was
 * queued, so rows created in between are included. For "suspend every expired
 * client" that is the desired reading - and the alternative, freezing a
 * snapshot of hundreds of thousands of ids, is worse in both size and staleness.
 */
final class RunBulkAction implements ShouldQueue
{
    use ActsAsPanelUser;
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /** Retry transient worker/database failures without repeating committed chunks. */
    public int $tries = 3;

    /** Give a busy database time to recover before retrying the next chunk. */
    public array|int $backoff = [30, 120];

    /**
     * ITS OWN BUDGET, rather than whatever the worker was launched with.
     *
     * Without this the job inherits the `queue:work` default of 60 seconds -
     * a number that lives in a deploy script or a supervisor config this
     * package cannot see. A bulk action over a few thousand records crosses
     * it, so the job retries transient failures and resumes from its durable
     * chunk ledger instead of leaving a silent partial write.
     */
    public int $timeout = 900;

    /**
     * @param  array<string, mixed>  $query  The filter parameters from the table.
     */
    public function __construct(
        private readonly string $resource,
        private readonly string $actionKey,
        private readonly array $query,
        private readonly int|string $userId,
        private readonly string $token,

        /**
         * What the action's form collected, ALREADY VALIDATED by the controller
         * that queued this.
         *
         * Re-validating here would be validating twice and reporting the second
         * failure into a worker log, where the person who typed the value never
         * sees it. The queue carries a decision that has already been checked.
         *
         * @var array<string, mixed>
         */
        private readonly array $data = [],

        /**
         * An EXPLICIT selection, when there is one.
         *
         * NORMALLY EMPTY AND THE FILTERS TRAVEL INSTEAD, which is the right
         * shape for "apply to everything matching": the set is re-derived at
         * execution time and a job payload does not carry half a million ids.
         *
         * IT IS NOT THE ONLY SHAPE. A selection that is bounded but still
         * large - see `BulkController`'s queue threshold - has to name its
         * rows, because the filters alone would match a different set. The
         * ids are re-read through the SCOPED query exactly as the inline path
         * reads them, so an id the actor cannot see still matches nothing.
         *
         * @var list<int|string>
         */
        private readonly array $ids = [],

        /** The mounted panel path, retained for links in durable notifications. */
        private readonly string $panelPath = '',
    ) {}

    public function handle(BulkRunner $runner): void
    {
        try {
            $initialState = JobStatus::get($this->token, $this->userId);

            // Queue delivery is at-least-once. A worker can finish the
            // mutation and lose its acknowledgement, so a redelivered job
            // must not start the completed operation again.
            if ($initialState !== null
                && in_array($initialState['status'] ?? null, [JobStatus::DONE, JobStatus::CANCELED], true)) {
                return;
            }

            $class = $this->actAs($this->userId, $this->resource);

            $definition = $class::definition();
            $action = $definition->bulkAction($this->actionKey);

            if ($action === null || ! $action->isRunnable()) {
                throw new RuntimeException("Unknown bulk action [{$this->actionKey}].");
            }

            // Re-checked at execution time, not merely at dispatch.
            if (! $class::can($action->getAbility())) {
                throw new RuntimeException("Not authorized to run [{$this->actionKey}].");
            }

            $list = $definition->toListQuery($class::model());
            $request = Request::create('/', 'GET', $this->query);

            $state = JobStatus::get($this->token, $this->userId) ?? [];
            $startAfter = isset($state['cursor']) && $state['cursor'] !== null
                ? (string) $state['cursor']
                : null;

            $runner->runDetailed(
                $action,
                $list->matching($request, $this->ids === [] ? null : $this->ids),
                $class::model(),
                $list->keyColumnName(),
                function (int $done, int|string|null $cursor): bool {
                    $totals = BulkCheckpoint::totals($this->token);
                    JobStatus::progress($this->token, $totals['affected'] ?: $done);
                    JobStatus::cursor($this->token, $cursor);

                    return ! JobStatus::isCanceled($this->token);
                },
                $this->data,
                $action->authorizesIndividualRecords()
                    ? static fn (Model $record): bool => $class::can($action->getRecordAbility(), $record)
                    : null,
                fn (int|string|null $cursor): bool => BulkCheckpoint::claim($this->token, $cursor),
                function (int|string|null $cursor, array $batch): void {
                    BulkCheckpoint::complete(
                        $this->token,
                        $cursor,
                        (int) $batch['selected'],
                        (int) $batch['authorized'],
                        (int) $batch['affected'],
                    );
                },
                $startAfter,
            );

            if (JobStatus::isCanceled($this->token)) {
                return;
            }

            $totals = BulkCheckpoint::totals($this->token);

            JobStatus::finish($this->token, $totals + ['done' => $totals['affected']]);
            BulkCheckpoint::forget($this->token);

            $this->notifyActor(
                'Bulk action finished',
                number_format($totals['affected']).' records updated by "'.$this->actionKey.'".'
                    .($totals['skipped'] > 0 ? ' '.number_format($totals['skipped']).' skipped by policy.' : ''),
                $this->resourcePath(),
            );
        } catch (Throwable $e) {
            // Let the queue retry transient failures. The final `failed()` hook
            // records the terminal state; marking it failed here would make a
            // still-retryable operation look permanently dead in the UI.
            throw $e;
        }
    }

    public function failed(Throwable $e): void
    {
        JobStatus::fail($this->token, $e->getMessage());
        $this->notifyActor('Bulk action failed', $e->getMessage(), $this->resourcePath(), 'danger');
    }

    private function resourcePath(): string
    {
        return '/'.trim($this->panelPath.'/'.$this->resource, '/');
    }
}
