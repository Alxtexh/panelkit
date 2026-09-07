<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Alxtexh\Panel\Models\Ticket;
use Alxtexh\Panel\Support\AllowListedQueryExpression;

/**
 * What the queue looks like, in numbers - roadmap H.3.
 *
 * ONE CLASS, ONE PASS OVER THE TABLE, because a strip of five cards written as
 * five queries is five index scans to render one row of a page - and it is the
 * shape that gets copied into the next screen that needs a summary.
 *
 * THE NUMBERS ARE CHOSEN TO BE ACTIONABLE, which is a stronger filter than
 * "available". A count of every ticket ever opened is a number nobody does
 * anything about. What a rota acts on is: how many are waiting on us, how many
 * have been waiting too long, and whether the two are getting worse.
 *
 * MEDIAN, NEVER MEAN, for the response time. One ticket left over a weekend
 * drags an average past every real number in the set, and the person reading
 * it concludes the desk is failing when four out of five were answered in
 * minutes. The median is the typical case, which is the question being asked.
 */
final class TicketStats
{
    /** @return array<string, mixed> */
    public static function for(int $days = 14): array
    {
        $since = Carbon::now()->subDays($days)->startOfDay();

        /*
         * The counts, in ONE grouped query rather than one per status. The
         * same reason the table's tab counts are grouped - see `Tabs`.
         */
        $byStatus = Ticket::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $open = (int) ($byStatus[Ticket::OPEN] ?? 0);
        $pending = (int) ($byStatus[Ticket::PENDING] ?? 0);
        $resolved = (int) ($byStatus[Ticket::RESOLVED] ?? 0);

        return [
            'open' => $open,
            'pending' => $pending,
            'resolved' => $resolved,

            /*
             * UNANSWERED IS NOT THE SAME AS OPEN, and this is the number a
             * desk should be looking at. An open ticket somebody has already
             * replied to is work in progress; an open ticket nobody has
             * answered is a person sitting in silence, and only the second one
             * is an emergency.
             */
            'unanswered' => Ticket::query()
                ->whereNull('first_response_at')
                ->where('status', '!=', Ticket::RESOLVED)
                ->count(),

            'medianFirstResponse' => self::medianFirstResponse($since),
            'volume' => self::volume($days),
        ];
    }

    /**
     * The typical wait before somebody answered, in minutes, or null when
     * nothing in the window has been answered yet.
     *
     * NULL RATHER THAN ZERO. Zero is a claim - "we answer instantly" - and a
     * desk with no answered tickets this fortnight has not achieved that. The
     * card shows an em dash, which is the honest reading of no data.
     */
    private static function medianFirstResponse(Carbon $since): ?int
    {
        /*
         * ORDERED AND SLICED BY THE DATABASE, not hydrated and sorted in PHP.
         *
         * This read every answered ticket in the window into Eloquent models
         * to sort them - which is fine on the playground's four and is the
         * shape that falls over on a tenant with a busy fortnight: thousands
         * of models, each with casts and an attribute bag, built to throw all
         * but one of them away. A summary card must not cost more as the
         * organisation grows; that is the whole difference between a number
         * and a number you can afford to look at.
         *
         * TWO SCALAR QUERIES, whatever the volume: how many, then the middle
         * one or two. The count is needed anyway to know WHICH row is the
         * middle, so there is no cheaper shape than this.
         */
        $base = Ticket::query()
            ->whereNotNull('first_response_at')
            ->where('created_at', '>=', $since);

        $total = (clone $base)->count();

        if ($total === 0) {
            return null;
        }

        $expression = self::minutesBetween();

        /*
         * AN EVEN COUNT HAS NO SINGLE MIDDLE, so both are taken and averaged -
         * which is what a median IS, and what the PHP version did. Getting
         * this wrong shifts the reported figure by one ticket's wait on every
         * even-sized set, which nobody would ever notice.
         */
        $odd = $total % 2 === 1;

        $values = (clone $base)
            ->orderBy(AllowListedQueryExpression::fromValidated($expression))
            ->offset($odd ? intdiv($total, 2) : intdiv($total, 2) - 1)
            ->limit($odd ? 1 : 2)
            ->pluck(DB::raw($expression.' as minutes'))
            ->map(static fn ($m): float => (float) $m)
            ->all();

        if ($values === []) {
            return null;
        }

        return (int) round(array_sum($values) / count($values));
    }

    /**
     * Minutes between opening and the first answer, in this driver's dialect.
     *
     * NO USER INPUT REACHES THIS - both column names are literals written
     * here - so there is nothing to bind. The panel supports three drivers
     * (see the database support matrix) and each spells date arithmetic
     * differently; a single expression that happened to work on SQLite would
     * be a silent wrong answer on the other two rather than an error.
     */
    private static function minutesBetween(): string
    {
        return match (DB::connection()->getDriverName()) {
            'sqlite' => '(julianday(first_response_at) - julianday(created_at)) * 1440',
            'pgsql' => 'extract(epoch from (first_response_at - created_at)) / 60',
            default => 'timestampdiff(minute, created_at, first_response_at)',
        };
    }

    /**
     * Opened and resolved per day, as two series.
     *
     * BOTH LINES, NOT JUST ARRIVALS. A rising volume chart on its own says
     * nothing about whether the desk is coping; opened against resolved says
     * whether the backlog is growing, which is the only reason to look.
     *
     * EVERY DAY IN THE WINDOW APPEARS, including the ones with nothing. A
     * chart that silently omits empty days draws a smooth line over a quiet
     * weekend and makes it look like steady traffic.
     *
     * @return array{labels: list<string>, opened: list<int>, resolved: list<int>}
     */
    private static function volume(int $days): array
    {
        $start = Carbon::now()->subDays($days - 1)->startOfDay();

        $opened = self::countByDay('created_at', $start);
        $resolved = self::countByDay('resolved_at', $start);

        $labels = [];
        $openedSeries = [];
        $resolvedSeries = [];

        for ($i = 0; $i < $days; $i++) {
            $day = $start->copy()->addDays($i);
            $key = $day->toDateString();

            $labels[] = $day->format('j M');
            $openedSeries[] = (int) ($opened[$key] ?? 0);
            $resolvedSeries[] = (int) ($resolved[$key] ?? 0);
        }

        return ['labels' => $labels, 'opened' => $openedSeries, 'resolved' => $resolvedSeries];
    }

    /**
     * @return array<string, int>
     */
    private static function countByDay(string $column, Carbon $start): array
    {
        /*
         * GROUPED IN THE DATABASE, not by pulling rows and counting in PHP.
         * The difference is invisible on the playground's few tickets and is
         * the whole cost on a tenant with fifty thousand.
         *
         * The date expression is per-driver: SQLite and MySQL disagree, and
         * the panel supports both (see the database support matrix). Neither
         * takes user input, so there is nothing here to bind.
         */
        $expression = match (DB::connection()->getDriverName()) {
            'sqlite' => "date({$column})",
            'pgsql' => "to_char({$column}, 'YYYY-MM-DD')",
            default => "date({$column})",
        };

        return Ticket::query()
            ->whereNotNull($column)
            ->where($column, '>=', $start)
            ->select(DB::raw("{$expression} as day"), DB::raw('count(*) as total'))
            ->groupBy('day')
            ->pluck('total', 'day')
            ->all();
    }
}
