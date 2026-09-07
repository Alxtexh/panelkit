<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Commands;

use Illuminate\Console\Command;
use Alxtexh\Panel\Trash\TrashBin;

/**
 * Empties the trash of anything past its retention window.
 *
 * THIS IS THE ONLY HARD DELETE THE PANEL PERFORMS UNATTENDED, which is the whole
 * reason it is written the way it is: narrow, dated, and printing what it did.
 * Everything else that removes a record needs a person to press something.
 *
 * WITHOUT IT A SOFT DELETE IS NOT A DELETE. The row stays forever, in the table,
 * in the backups, in every export written before somebody noticed - which is a
 * data-retention position no installation chose deliberately. "Deleted" has to
 * eventually mean deleted.
 *
 * IT WORKS THROUGH THE MODELS, not through raw SQL over every table with a
 * `deleted_at` column. Model events fire, so a resource that cleans up files or
 * rows elsewhere on delete gets its chance - and a table the panel does not
 * manage is not something this should be touching at all.
 *
 * `--days` OVERRIDES THE CONFIGURED WINDOW, and `--pretend` prints without
 * deleting. The second is not a nicety: the first time anybody runs this it is
 * on data they care about, and being able to see the list first is what makes it
 * runnable at all.
 */
final class PruneTrashCommand extends Command
{
    protected $signature = 'panel:prune-trash
                            {--days= : Override the configured retention window}
                            {--pretend : Count what would go, delete nothing}';

    protected $description = 'Permanently delete records that have been in the trash past their retention window';

    public function handle(TrashBin $bin): int
    {
        $days = $this->option('days') !== null
            ? max(1, (int) $this->option('days'))
            : TrashBin::retentionDays();

        $cutoff = now()->subDays($days);
        $pretend = (bool) $this->option('pretend');
        $removed = 0;

        /*
         * EVERY PANEL'S RESOURCES, not just the current one. This runs from a
         * scheduler where no portal is serving a request, and a bin that emptied
         * only for whichever panel happened to be default would leave the others
         * accumulating silently.
         */
        foreach ($bin->resources(null) as $key => $class) {
            $model = $class::model();
            $instance = new $model;

            if (! method_exists($instance, 'getDeletedAtColumn')) {
                continue;
            }

            $column = $instance->getDeletedAtColumn();

            /*
             * WITHOUT THE TENANT SCOPE, and that is deliberate rather than
             * careless. This runs from a scheduler where nobody is signed in, so
             * the scope resolves no tenant and - correctly, everywhere else -
             * matches nothing: the sweep would report success having deleted
             * none of the expired records, forever, in silence.
             *
             * IT IS SAFE HERE BECAUSE THE PREDICATE IS TIME, NOT IDENTITY.
             * Nothing about this query comes from a request or a person; it
             * selects rows every tenant already deleted, past a window every
             * tenant was shown. There is no way to steer it at somebody else's
             * data because there is no input.
             *
             * ONE CONNECTION, THOUGH. Under database-per-tenant this reaches the
             * rows on the CURRENT connection only, so an installation in that
             * mode runs it inside each tenant's context - `tenants:run
             * panel:prune-trash` with stancl. Column and hybrid installations
             * are swept in a single pass.
             */
            $query = $model::query()
                ->withoutGlobalScopes()
                ->whereNotNull($column)
                ->where($column, '<=', $cutoff);

            $count = (clone $query)->count();

            if ($count === 0) {
                continue;
            }

            if (! $pretend) {
                /*
                 * CHUNKED, and re-queried each time because the rows are being
                 * removed as it goes. `chunkById` on a set that is shrinking
                 * from under it skips records - the classic paginate-while-
                 * deleting bug - so this takes a page, deletes it, and asks
                 * again.
                 */
                while (($batch = (clone $query)->limit(200)->get())->isNotEmpty()) {
                    foreach ($batch as $record) {
                        $record->forceDelete();
                    }
                }
            }

            $this->components->twoColumnDetail(
                "  {$key}",
                $pretend ? "{$count} would go" : "{$count} removed",
            );

            $removed += $count;
        }

        $this->components->info(sprintf(
            '%s %d record(s) deleted more than %d day(s) ago.',
            $pretend ? 'Would remove' : 'Removed',
            $removed,
            $days,
        ));

        return self::SUCCESS;
    }
}
