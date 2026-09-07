<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Widgets;

use DateTimeImmutable;
use Illuminate\Contracts\Database\Query\Builder as BuilderContract;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use InvalidArgumentException;

/**
 * Rows over time, as ONE grouped query.
 *
 * FOUR PROPERTIES, in the order they matter.
 *
 * 1. ONE QUERY, ALWAYS. addendum C1: N points must never mean N queries. A
 *    30-day chart is one `GROUP BY`, not thirty `COUNT(*)`s in a loop - the
 *    loop is invisible in dev with a 500-row table and catastrophic at 2M.
 *
 * 2. BOUNDED BY THE PERIOD. Every series carries `WHERE ts >= ? AND ts < ?`, so
 *    an index on the timestamp column is usable and the scan is proportional to
 *    the window rather than to the table. This is the difference between a
 *    dashboard that stays fast at 2M sessions and one that degrades with age.
 *
 * 3. GAP-FILLED IN PHP. A day with no rows returns NO ROW, not a zero. Plotting
 *    the raw result draws a straight line from Tuesday to Thursday and labels
 *    it Wednesday - an outage renders as a gentle slope. Missing buckets are
 *    materialised as explicit zeroes before the data leaves this class.
 *
 * 4. THE SCOPES SURVIVE. The builder is Eloquent on the way in and `toBase()`
 *    is called HERE, which applies global scopes before dropping to the query
 *    builder. Handing this a raw query builder skips tenant isolation, so that
 *    is rejected rather than accepted.
 *
 * TIMEZONE. Buckets are computed by the database from stored timestamp strings
 * and compared against PHP dates. Laravel stores timestamps in the app timezone
 * and PHP's default timezone is set from the same config, so the two agree. If
 * an application stores UTC while running in another zone, pass a `$now` in the
 * storage zone or the labels shift by the offset.
 */
final class TimeSeries
{
    private string $timestamp = 'created_at';

    private string $aggregate = 'count';

    /** Set to read pre-aggregated buckets before falling back to a live scan. */
    private ?Rollup $rollup = null;

    private int|string|null $rollupTenant = null;

    private ?string $aggregateColumn = null;

    /** @param EloquentBuilder<covariant Model> $query */
    private function __construct(private readonly EloquentBuilder $query) {}

    /**
     * @param  EloquentBuilder<covariant Model>  $query  Eloquent, so global scopes still apply.
     */
    public static function of(EloquentBuilder $query): self
    {
        return new self($query);
    }

    /** The timestamp column the series is bucketed and bounded by. */
    public function timestamp(string $column): self
    {
        $this->timestamp = $this->validateIdentifier($column);

        return $this;
    }

    /**
     * Read this series from the rollup table where possible.
     *
     * Only counts are pre-aggregated: a stored SUM is still a sum and would be
     * correct, but an AVERAGE of averages is NOT the average, and offering a
     * rollup that is silently wrong for one aggregate is worse than offering
     * none. Widen this deliberately, per aggregate, if ever needed.
     */
    public function rollup(string $metric, int|string $tenantKey): self
    {
        $this->rollup = new Rollup($metric);
        $this->rollupTenant = $tenantKey;

        return $this;
    }

    public function count(): self
    {
        $this->aggregate = 'count';
        $this->aggregateColumn = null;

        return $this;
    }

    public function sum(string $column): self
    {
        $this->aggregate = 'sum';
        $this->aggregateColumn = $this->validateIdentifier($column);

        return $this;
    }

    public function average(string $column): self
    {
        $this->aggregate = 'avg';
        $this->aggregateColumn = $this->validateIdentifier($column);

        return $this;
    }

    /**
     * Run the series for `$period`.
     *
     * @return array{
     *     points: list<array{label: string, value: int|float, at: string}>,
     *     total: int|float,
     *     period: string,
     *     bucket: string
     * }
     */
    public function resolve(Period $period, ?DateTimeImmutable $now = null): array
    {
        return $this->resolveWindow(Window::fromPeriod($period, $now ?? new DateTimeImmutable), $period->value);
    }

    /**
     * Run the series over an explicit window.
     *
     * The real implementation; `resolve()` is the named-period shorthand. A
     * dashboard filter produces a window a Period cannot express, and having
     * one path for both is what stops "last 7 days" and "3-9 March" diverging.
     *
     * @return array{
     *     points: list<array{label: string, value: int|float, at: string}>,
     *     total: int|float,
     *     period: string,
     *     bucket: string
     * }
     */
    public function resolveWindow(Window $window, string $periodLabel = 'custom'): array
    {
        $bucket = $window->bucket;
        $start = $window->start;
        $end = $window->end;

        $rows = $this->bucketValues($bucket, $start, $end);

        // Gap fill. Walking the range rather than the result set is what turns
        // "no rows on Wednesday" into an explicit zero instead of a hole.
        $points = [];
        $total = 0;

        for ($at = $start; $at < $end; $at = $bucket->next($at)) {
            $key = $at->format($bucket->phpFormat());
            $value = $rows[$key] ?? 0;

            $points[] = [
                'label' => $bucket->label($at),
                'value' => $value,
                'at' => $key,
            ];

            $total += $value;
        }

        return [
            'points' => $points,
            'total' => $this->aggregate === 'avg' && $points !== []
                ? round($total / count($points), 2)
                : $total,
            'period' => $periodLabel,
            'bucket' => $bucket->value,
        ];
    }

    /**
     * The scalar aggregate over an arbitrary window, for trend comparison.
     *
     * Separate from `resolve()` because a trend needs the PREVIOUS window's
     * total and nothing else - running a full bucketed series to sum it back up
     * would be a second grouped scan for a single number.
     */
    public function totalIn(Window $window): int|float
    {
        return $this->totalBetween($window->start, $window->end);
    }

    public function totalBetween(DateTimeImmutable $start, DateTimeImmutable $end): int|float
    {
        $query = $this->base()->whereBetween($this->timestamp, [
            $start->format('Y-m-d H:i:s'),
            $end->format('Y-m-d H:i:s'),
        ]);

        return match ($this->aggregate) {
            'count' => (int) $query->count(),
            'sum' => (float) ($query->sum($this->aggregateColumn) ?? 0),
            'avg' => (float) ($query->avg($this->aggregateColumn) ?? 0),
            default => 0,
        };
    }

    /**
     * Bucket values, from the rollup where available and live for the rest.
     *
     * A MISSING BUCKET IS COMPUTED, NEVER ASSUMED ZERO. A rollup is a cache of
     * something always recomputable, so a gap means "not yet aggregated" and
     * not "nothing happened" - treating the two the same is what makes a
     * dashboard quietly wrong for the current day, every day.
     *
     * The live fallback is bounded to the uncovered span rather than re-running
     * the whole window: a 30-day chart on a nightly rollup scans one day, not
     * thirty.
     *
     * @return array<string, int|float>
     */
    private function bucketValues(Bucket $bucket, DateTimeImmutable $start, DateTimeImmutable $end): array
    {
        if ($this->rollup === null || $this->aggregate !== 'count' || ! Rollup::supports($bucket)) {
            return $this->rawSeries($bucket, $start, $end);
        }

        $firstKey = $start->format($bucket->phpFormat());
        $lastKey = $bucket->floor($end->modify('-1 second'))->format($bucket->phpFormat());

        $stored = $this->rollup->read($this->rollupTenant, $bucket, $firstKey, $lastKey);

        // Which buckets in the window the rollup did not answer for.
        $missing = [];

        for ($at = $start; $at < $end; $at = $bucket->next($at)) {
            $key = $at->format($bucket->phpFormat());

            if (! array_key_exists($key, $stored)) {
                $missing[$key] = $at;
            }
        }

        if ($missing === []) {
            return $stored;
        }

        // A COARSE BUCKET IS THE SUM OF ITS FINE ONES, so try to build the gap
        // out of stored days before scanning for it.
        //
        // The current bucket is never rolled up, which is right - it is still
        // accumulating. But "the current bucket" for a 12-month chart is a whole
        // MONTH, so the fallback that costs one day's scan on a daily chart
        // costs a month's scan on a monthly one, and that single gap was the
        // entire cost of the view. The daily rollup already holds every complete
        // day of that month; only today is genuinely unknown.
        if ($bucket === Bucket::Month) {
            foreach ($missing as $key => $at) {
                $composed = $this->composeMonthFromDays($at, $end);

                if ($composed !== null) {
                    $stored[$key] = $composed;
                    unset($missing[$key]);
                }
            }

            if ($missing === []) {
                return $stored;
            }
        }

        // One live query over the uncovered span. Contiguous or not, the range
        // between the first and last gap is far smaller than the full window in
        // the normal case - the gap is the current bucket.
        $firstGap = reset($missing);
        $lastGap = end($missing);

        $live = $this->rawSeries($bucket, $firstGap, $bucket->next($lastGap));

        foreach ($missing as $key => $ignored) {
            $stored[$key] = $live[$key] ?? 0;
        }

        return $stored;
    }

    /**
     * Rebuild one month from the daily rollup, live-scanning only the tail.
     *
     * Coverage must be a CONTIGUOUS PREFIX of the month. A hole in the middle
     * would make the sum quietly too small, and a wrong number is worse than a
     * slow one - so a gap anywhere before the tail returns null and the caller
     * falls back to scanning the month, exactly as before.
     *
     * Returns null rather than 0 when nothing is covered, so "no daily rollup
     * either" stays distinguishable from "a month in which nothing happened".
     */
    private function composeMonthFromDays(DateTimeImmutable $monthStart, DateTimeImmutable $windowEnd): ?int
    {
        $monthEnd = min(Bucket::Month->next($monthStart), $windowEnd);

        $days = $this->rollup->read(
            $this->rollupTenant,
            Bucket::Day,
            $monthStart->format(Bucket::Day->phpFormat()),
            Bucket::Day->floor($monthEnd->modify('-1 second'))->format(Bucket::Day->phpFormat()),
        );

        $total = 0;
        $at = $monthStart;

        for (; $at < $monthEnd; $at = Bucket::Day->next($at)) {
            $key = $at->format(Bucket::Day->phpFormat());

            if (! array_key_exists($key, $days)) {
                break;
            }

            $total += $days[$key];
        }

        if ($at <= $monthStart) {
            return null;
        }

        // Whatever the daily rollup had not reached yet - normally today alone.
        return $at >= $monthEnd
            ? $total
            : $total + (int) $this->totalBetween($at, $monthEnd);
    }

    /**
     * The grouped query, keyed by bucket string.
     *
     * @return array<string, int|float>
     */
    private function rawSeries(Bucket $bucket, DateTimeImmutable $start, DateTimeImmutable $end): array
    {
        $query = $this->base();

        $driver = $query->getConnection()->getDriverName();
        $expression = $bucket->expression($driver, $this->timestamp);

        $value = match ($this->aggregate) {
            'count' => 'COUNT(*)',
            'sum' => "SUM({$this->aggregateColumn})",
            'avg' => "AVG({$this->aggregateColumn})",
            default => 'COUNT(*)',
        };

        /*
         * `whereBetween` on the bare column, NOT on the bucket expression.
         * Filtering on `strftime(...)` would make the index unusable and turn
         * every chart into a full scan - the exact shape antipatterns §2 warns
         * about, where a wrapped column silently disables the index it was
         * created for.
         */
        $rows = $query
            ->selectRaw("{$expression} as pk_bucket, {$value} as pk_value")
            ->whereBetween($this->timestamp, [
                $start->format('Y-m-d H:i:s'),
                $end->format('Y-m-d H:i:s'),
            ])
            ->groupBy('pk_bucket')
            ->get();

        $out = [];

        foreach ($rows as $row) {
            // Postgres pads `to_char` output; MySQL and SQLite do not.
            $out[trim((string) $row->pk_bucket)] = $this->aggregate === 'count'
                ? (int) $row->pk_value
                : (float) $row->pk_value;
        }

        return $out;
    }

    /**
     * A fresh base query with global scopes applied.
     *
     * Cloned each call: `resolve()` and `totalBetween()` both add a `where` on
     * the same column, and sharing one builder would compound them into a range
     * that matches nothing.
     */
    private function base(): QueryBuilder|BuilderContract
    {
        return (clone $this->query)->toBase();
    }

    private function validateIdentifier(string $column): string
    {
        if (preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $column) !== 1) {
            throw new InvalidArgumentException("[{$column}] is not a valid column identifier.");
        }

        return $column;
    }
}
