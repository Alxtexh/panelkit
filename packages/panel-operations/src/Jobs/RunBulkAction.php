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

    public int $tries = 1;

    /**
     * ITS OWN BUDGET, rather than whatever the worker was launched with.
     *
     * Without this the job inherits the `queue:work` default of 60 seconds -
     * a number that lives in a deploy script or a supervisor config this
     * package cannot see. A bulk action over a few thousand records crosses
     * it, and with `$tries = 1` the kill is final: the mutation is applied to
     * the records processed so far, to none of the rest, and nothing anywhere
     * says which. Its siblings already declare theirs; this one was missed.
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
    ) {}

    public function handle(BulkRunner $runner): void
    {
        try {
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

            $affected = $runner->run(
                $action,
                $list->matching($request, $this->ids === [] ? null : $this->ids),
                $class::model(),
                $list->keyColumnName(),
                function (int $done): bool {
                    JobStatus::progress($this->token, $done);

                    return ! JobStatus::isCanceled($this->token);
                },
                $this->data,
                $action->authorizesIndividualRecords()
                    ? static fn (Model $record): bool => $class::can($action->getAbility(), $record)
                    : null,
            );

            if (JobStatus::isCanceled($this->token)) {
                return;
            }

            JobStatus::finish($this->token, ['done' => $affected]);

            $this->notifyActor(
                'Bulk action finished',
                number_format($affected).' records updated by "'.$this->actionKey.'".',
                "/{$this->resource}",
            );
        } catch (Throwable $e) {
            // Recorded for the operator watching the progress bar, then
            // rethrown so it reaches failed_jobs and the logs like any other
            // job failure. Swallowing it would leave the UI saying "failed"
            // with nothing anywhere explaining why.
            JobStatus::fail($this->token, $e->getMessage());

            $this->notifyActor('Bulk action failed', $e->getMessage(), "/{$this->resource}", 'danger');

            throw $e;
        }
    }

    public function failed(Throwable $e): void
    {
        JobStatus::fail($this->token, $e->getMessage());
    }
}
