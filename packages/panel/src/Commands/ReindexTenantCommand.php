<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Alxtexh\Panel\Support\TenantContext;

/**
 * Give a dedicated tenant database indexes that match how it is actually queried.
 *
 * THE PROBLEM THIS EXISTS FOR, stated plainly: moving a tenant to their own
 * database made every one of their pages 20 to 60 times SLOWER, and nothing
 * anywhere said so.
 *
 * The mechanism is simple once seen. A column-scoped schema indexes
 * `(tenant_id, created_at, id)`, `(tenant_id, name, id)`, and so on - every index
 * leads with the tenant column, which is correct, because every query in that
 * mode carries `where tenant_id = ?`. In a dedicated database the panel correctly
 * DROPS that predicate: the connection already isolates, and constraining by
 * column would be redundant. But an index on `(tenant_id, created_at, id)` cannot
 * serve `ORDER BY created_at DESC, id DESC` when nothing constrains the leading
 * column, so SQLite falls back to `SCAN clients` plus `USE TEMP B-TREE FOR ORDER
 * BY` - a full table scan and a full sort, on every page, for a table that has
 * six perfectly good indexes it is not allowed to use.
 *
 * MEASURED, NOT REASONED. Two tenants of exactly 25,000 subscribers: the shared
 * one loads its first page in 0.45 ms, the dedicated one in 9.65 ms, and a
 * status filter goes from 0.44 ms to 29.62 ms. Same schema, same rows, same
 * code - the only difference is which index the planner is permitted to use.
 *
 * This is the failure mode that matters most in the whole tenancy design,
 * because of WHO it hits. A tenant gets their own database when they are the
 * largest, or when isolation was promised in a contract - which is to say the
 * upgrade is sold partly as a performance improvement, and it delivered the
 * exact opposite to the customer least able to absorb it.
 *
 * THE FIX IS SIBLING INDEXES, NOT REPLACEMENTS. For each index leading with the
 * tenant column, this creates one on the remaining columns. The originals are
 * left in place: they cost disk and nothing else, they are still correct, and
 * dropping them would make this command destructive and one-way for the sake of
 * a few megabytes. Re-running is safe - every statement is `IF NOT EXISTS`.
 *
 * It REFUSES to run against a shared database, because there the tenant-led
 * indexes are the right ones and these siblings would be dead weight that the
 * planner has to consider on every query.
 */
final class ReindexTenantCommand extends Command
{
    protected $signature = 'panel:reindex-tenant
                            {--pretend : Print the statements instead of running them}';

    protected $description = 'Add indexes suited to a dedicated tenant database, where the tenant column is redundant';

    public function handle(TenantContext $context): int
    {
        if ($context->shouldScopeByColumn()) {
            $this->components->error(
                'This connection is column-scoped, where the existing tenant-led indexes are '
                .'already the right ones. Initialise a tenant that has its own database first.'
            );

            return self::FAILURE;
        }

        $column = $context->column();
        $pretend = (bool) $this->option('pretend');
        $made = 0;

        foreach ($this->tables() as $table) {
            foreach ($this->tenantLedIndexes($table, $column) as $name => $columns) {
                // Everything after the tenant column. An index that is ONLY the
                // tenant column has no useful remainder - in a dedicated database
                // that column holds a single value, so an index on it is a list
                // of every row in no helpful order.
                $rest = array_values(array_filter($columns, static fn (string $c): bool => $c !== $column));

                if ($rest === []) {
                    continue;
                }

                $new = $name.'_nt';
                $sql = sprintf(
                    'create index if not exists "%s" on "%s" ("%s")',
                    $new,
                    $table,
                    implode('", "', $rest),
                );

                if ($pretend) {
                    $this->line("  {$sql}");
                } else {
                    DB::statement($sql);
                    $this->components->task("  {$table}: ".implode(', ', $rest), fn () => true);
                }

                $made++;
            }
        }

        if ($made === 0) {
            $this->components->info('Nothing to do - no tenant-led indexes found.');

            return self::SUCCESS;
        }

        $this->components->info(
            $pretend
                ? "{$made} index(es) would be created."
                : "{$made} index(es) created. Re-run panel:benchmark to confirm the plans changed."
        );

        return self::SUCCESS;
    }

    /** @return list<string> */
    private function tables(): array
    {
        $tables = [];

        foreach (DB::select("select name from sqlite_master where type = 'table' and name not like 'sqlite_%'") as $row) {
            $tables[] = $row->name;
        }

        return $tables;
    }

    /**
     * Indexes on `$table` whose FIRST column is the tenant column.
     *
     * Only the first matters. An index with the tenant column in the middle is
     * already usable by a query that does not mention it, up to the point where
     * it appears - so rebuilding it would buy nothing.
     *
     * @return array<string, list<string>>
     */
    private function tenantLedIndexes(string $table, string $column): array
    {
        $out = [];

        foreach (DB::select('pragma index_list("'.$table.'")') as $index) {
            // Auto-indexes back UNIQUE constraints and cannot be reproduced by a
            // CREATE INDEX; a sibling would not carry the constraint anyway.
            if (str_starts_with($index->name, 'sqlite_autoindex')) {
                continue;
            }

            $columns = [];

            foreach (DB::select('pragma index_info("'.$index->name.'")') as $row) {
                $columns[] = $row->name;
            }

            if (($columns[0] ?? null) === $column) {
                $out[$index->name] = $columns;
            }
        }

        return $out;
    }
}
