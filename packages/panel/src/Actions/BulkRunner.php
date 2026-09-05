<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Actions;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * Applies a BulkAction across a selection, in chunks.
 *
 * THE CHUNKING IS KEYSET, AND THAT IS A CORRECTNESS REQUIREMENT RATHER THAN A
 * PERFORMANCE ONE.
 *
 * A bulk action usually invalidates the predicate that selected its own rows -
 * "suspend every active client" stops matching `status = active` the moment the
 * first chunk commits. Paging that with OFFSET means the result set shrinks
 * underneath the cursor and every other chunk is skipped: page 2 of a shrinking
 * set is not the rows that were on page 2. The operator sees "50,000 updated"
 * and half of them are untouched, which is a silent partial write.
 *
 * Seeking on `id > lastSeen` is immune to it. Rows already handled are excluded
 * by id, not by position, so a set that shrinks mid-run still walks cleanly to
 * the end.
 *
 * The identifiers are read through the SCOPED query, so a row the operator
 * cannot see is never in a chunk in the first place. That, not a check on the
 * incoming id list, is what makes a forged id harmless: it simply matches
 * nothing.
 */
final class BulkRunner
{
    /**
     * @param  QueryBuilder  $target  The filtered, tenant-scoped set.
     * @param  class-string<Model>  $model
     * @param  Closure(int): (bool|void)|null  $onProgress  Return false to stop after the current chunk.
     * @param  Closure(Model): bool|null  $authorizeRecord  Optional per-record policy check.
     * @return int How many records were actually written.
     */
    public function run(
        BulkAction $action,
        QueryBuilder $target,
        string $model,
        string $keyColumn,
        ?Closure $onProgress = null,
        array $data = [],
        ?Closure $authorizeRecord = null,
    ): int {
        $affected = 0;
        $after = null;
        $size = $action->getChunkSize();
        $qualified = $this->qualify($target, $keyColumn);

        while (true) {
            $chunk = (clone $target)
                ->when($after !== null, fn (QueryBuilder $q): QueryBuilder => $q->where($qualified, '>', $after))
                ->orderBy($qualified)
                ->limit($size)
                ->pluck($qualified)
                ->all();

            if ($chunk === []) {
                break;
            }

            $after = end($chunk);

            $affected += $this->apply($action, $model, $keyColumn, $chunk, $data, $authorizeRecord);

            if ($onProgress !== null) {
                if ($onProgress($affected) === false) {
                    break;
                }
            }

            // A short chunk means the end of the set; asking again costs a
            // round trip to learn nothing.
            if (count($chunk) < $size) {
                break;
            }
        }

        return $affected;
    }

    /**
     * @param  list<int|string>  $ids
     */
    /**
     * @param  list<int|string>  $ids
     * @param  array<string, mixed>  $data  Values the action's form collected,
     *                                      already validated and reduced to
     *                                      declared keys by the caller. THE SAME
     *                                      VALUES FOR EVERY CHUNK - collected
     *                                      once, which is what makes this one
     *                                      decision rather than one per batch.
     */
    private function apply(
        BulkAction $action,
        string $model,
        string $keyColumn,
        array $ids,
        array $data = [],
        ?Closure $authorizeRecord = null,
    ): int
    {
        /*
         * Through the MODEL, not the raw builder handed in.
         *
         * The incoming query may carry joins from the table definition, and an
         * UPDATE against a joined query is dialect-specific - it works on MySQL
         * and fails on Postgres. Re-entering through the model also re-applies
         * the tenant global scope, so the write is scoped independently of how
         * the read was built. Two locks on the same door, deliberately.
         */
        $query = $model::query()->whereIn($keyColumn, $ids);

        if ($authorizeRecord !== null) {
            $authorizedIds = $query->get()->filter($authorizeRecord)->modelKeys();

            if ($authorizedIds === []) {
                return 0;
            }

            $query = $model::query()->whereIn($keyColumn, $authorizedIds);
        }

        $handler = $action->getHandler();

        if ($handler !== null) {
            $records = $query->get();

            $handler($records, $data);

            return $records->count();
        }

        $attributes = $action->getMutation();

        // Touched explicitly: `update()` on a query builder does not maintain
        // timestamps, and a row whose updated_at did not move is invisible to
        // the live-update diff endpoint - the change would never reach an open
        // table until a full reload.
        $attributes['updated_at'] = now();

        return $query->update($attributes);
    }

    /**
     * Qualify the key with its table when the query joins.
     *
     * An unqualified `id` in a joined query is ambiguous, and the error it
     * produces names the column rather than the join, so it reads like a typo.
     */
    private function qualify(QueryBuilder $query, string $keyColumn): string
    {
        if (str_contains($keyColumn, '.')) {
            return $keyColumn;
        }

        $from = $query->from;

        return is_string($from) ? "{$from}.{$keyColumn}" : $keyColumn;
    }
}
