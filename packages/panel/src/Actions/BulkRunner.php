<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Actions;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Facades\DB;
use Alxtexh\Panel\Support\Transaction;

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
     * @param  Closure(int, int|string|null): (bool|void)|null  $onProgress  Return false to stop after the current chunk.
     * @param  Closure(Model): bool|null  $authorizeRecord  Optional per-record policy check.
     * @param  Closure(int|string|null): bool|null  $beforeChunk  Return false when a durable chunk has already completed.
     * @param  Closure(int|string|null, array{selected: int, authorized: int, affected: int}): void|null  $afterChunk  Runs in the same transaction as the mutation.
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
        ?Closure $beforeChunk = null,
        ?Closure $afterChunk = null,
    ): int {
        return $this->runDetailed(
            $action, $target, $model, $keyColumn, $onProgress, $data, $authorizeRecord, $beforeChunk, $afterChunk
        )->affected;
    }

    /**
     * Run a selection and retain the distinction between skipped and changed rows.
     *
     * `run()` remains the small backwards-compatible API used by integrations;
     * controllers that need truthful operator feedback use this detailed form.
     *
     * The optional chunk callbacks are for durable queued execution. When they
     * are present, a database transaction always wraps the callback and the
     * mutation, even when the panel has not opted into transactions for normal
     * CRUD. A checkpoint outside that boundary can claim a chunk that was never
     * changed, or miss a chunk that was changed and repeat a non-idempotent
     * handler after a worker crash.
     */
    public function runDetailed(
        BulkAction $action,
        QueryBuilder $target,
        string $model,
        string $keyColumn,
        ?Closure $onProgress = null,
        array $data = [],
        ?Closure $authorizeRecord = null,
        ?Closure $beforeChunk = null,
        ?Closure $afterChunk = null,
        int|string|null $startAfter = null,
    ): BulkResult {
        $selected = 0;
        $affected = 0;
        $authorized = 0;
        $after = $startAfter;
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

            $batch = $this->apply(
                $action,
                $model,
                $keyColumn,
                $chunk,
                $data,
                $authorizeRecord,
                $after,
                $beforeChunk,
                $afterChunk,
            );

            if ($batch['processed']) {
                $selected += count($chunk);
            }

            $authorized += $batch['authorized'];
            $affected += $batch['affected'];

            if ($onProgress !== null) {
                if ($onProgress($affected, $after) === false) {
                    break;
                }
            }

            // A short chunk means the end of the set; asking again costs a
            // round trip to learn nothing.
            if (count($chunk) < $size) {
                break;
            }
        }

        return new BulkResult($selected, $authorized, $affected, $selected - $authorized);
    }

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
        int|string|null $cursor = null,
        ?Closure $beforeChunk = null,
        ?Closure $afterChunk = null,
    ): array
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

        $work = function () use (
            $action,
            $query,
            $model,
            $keyColumn,
            $ids,
            $data,
            $authorizeRecord,
            $cursor,
            $beforeChunk,
            $afterChunk,
        ): array {
            if ($beforeChunk !== null && $beforeChunk($cursor) === false) {
                return ['authorized' => 0, 'affected' => 0, 'processed' => false];
            }

            $authorizedQuery = $query;
            $authorizedCount = count($ids);

            if ($authorizeRecord !== null) {
                $authorizedIds = $query->get()->filter($authorizeRecord)->modelKeys();
                $authorizedCount = count($authorizedIds);

                if ($authorizedIds === []) {
                    $batch = [
                        'selected' => count($ids),
                        'authorized' => 0,
                        'affected' => 0,
                    ];

                    if ($afterChunk !== null) {
                        $afterChunk($cursor, $batch);
                    }

                    return [...$batch, 'processed' => true];
                }

                $authorizedQuery = $model::query()->whereIn($keyColumn, $authorizedIds);
            }

            $handler = $action->getHandler();

            if ($handler !== null) {
                $records = $authorizedQuery->get();

                $handler($records, $data);

                $batch = [
                    'selected' => count($ids),
                    'authorized' => $records->count(),
                    'affected' => $records->count(),
                ];

                if ($afterChunk !== null) {
                    $afterChunk($cursor, $batch);
                }

                return [...$batch, 'processed' => true];
            }

            $attributes = $action->getMutation();

            // Touched explicitly: `update()` on a query builder does not maintain
            // timestamps, and a row whose updated_at did not move is invisible to
            // the live-update diff endpoint - the change would never reach an open
            // table until a full reload.
            $attributes['updated_at'] = now();

            $changed = $authorizedQuery->update($attributes);

            $batch = [
                'selected' => count($ids),
                'authorized' => $authorizedCount,
                'affected' => $changed,
            ];

            if ($afterChunk !== null) {
                $afterChunk($cursor, $batch);
            }

            return [...$batch, 'processed' => true];
        };

        // A durable chunk ledger must share the mutation's commit boundary.
        // Normal inline actions retain the panel's existing transaction policy.
        return ($beforeChunk !== null || $afterChunk !== null)
            ? DB::transaction($work)
            : Transaction::run($work);
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
