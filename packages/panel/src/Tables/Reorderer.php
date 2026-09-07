<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

/**
 * Applies a new display order to the rows of ONE page.
 *
 * THE POSITIONS ARE RECYCLED, NOT RECALCULATED, and that single decision is
 * what makes this cheap and permanent.
 *
 * The obvious implementations both go wrong at scale:
 *
 *   RENUMBER EVERYTHING - assign 1..n across the table after each drag. One
 *   drag becomes an UPDATE per row, so reordering an 80-row catalogue is 80
 *   writes and reordering a large one is unusable.
 *
 *   MIDPOINTS - give the moved row a value between its new neighbours. Cheap
 *   at one write, and it runs out: integers between 100 and 101 do not exist,
 *   so eventually a drag has nowhere to go and the table needs a rebalancing
 *   pass nobody remembers to write until it fails in production.
 *
 * Recycling avoids both. The set of positions the page already holds is
 * unchanged - only which row holds which one moves. So:
 *
 *   - rows OUTSIDE the page are untouched, because no value leaves the page's
 *     range;
 *   - collisions are impossible, because the values were already distinct;
 *   - gaps never run out, because none are consumed;
 *   - and the write cost is bounded by the page size, not the table.
 *
 * ONLY ROWS THAT ACTUALLY MOVED ARE WRITTEN. Dragging the last row up one place
 * changes two rows, not ten.
 */
final class Reorderer
{
    public function __construct(
        private readonly string $column,
        private readonly string $keyColumn = 'id',
    ) {
        if (preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $column) !== 1) {
            throw new InvalidArgumentException("[{$column}] is not a valid position column.");
        }
    }

    /**
     * Reassign positions so the given ids appear in the given order.
     *
     * THE QUERY IS THE AUTHORITY ON WHICH ROWS EXIST. It arrives already
     * tenant-scoped and policy-checked, and only ids it returns are touched -
     * so a request naming another organisation's row reorders nothing, rather
     * than reordering something it should not be able to see.
     *
     * @param  Builder<covariant Model>  $query
     * @param  list<int|string>  $orderedIds  The page's ids, in their new order.
     * @return int How many rows were actually written.
     */
    public function apply(Builder $query, array $orderedIds): int
    {
        if ($orderedIds === []) {
            return 0;
        }

        /*
         * Read the page's current positions, keyed by id.
         *
         * `whereIn` on the SCOPED query rather than a bare `whereKey`: this is
         * the step that silently drops any id the caller was not entitled to,
         * and it does so before anything is written.
         */
        $current = $query->clone()
            ->whereIn($this->keyColumn, $orderedIds)
            ->pluck($this->column, $this->keyColumn)
            ->all();

        // Ids the query did not return are not ours to move.
        $ids = array_values(array_filter(
            $orderedIds,
            static fn (int|string $id): bool => array_key_exists($id, $current),
        ));

        if ($ids === []) {
            return 0;
        }

        /*
         * The positions this page occupies, sorted. Handing them out in the new
         * row order is the whole algorithm - the multiset is invariant, only
         * the assignment changes.
         */
        $positions = array_values($current);
        sort($positions, SORT_NUMERIC);

        $written = 0;

        foreach ($ids as $index => $id) {
            $target = $positions[$index];

            // Unchanged rows are skipped: a drag near the end of a page must
            // not rewrite the rows before it.
            if ((int) $current[$id] === (int) $target) {
                continue;
            }

            $query->clone()->whereKey($id)->toBase()->update([$this->column => $target]);

            $written++;
        }

        return $written;
    }
}
