<?php

declare(strict_types=1);

namespace App\Demo\Panel;

use App\Demo\Models\Client;
use App\Demo\Models\ClientSession;
use App\Models\Plan;
use App\Demo\Models\Router;
use DateTimeImmutable;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use App\Panel\Pages\DashboardPage;
use Alxtexh\Panel\Support\TenantContext;
use Alxtexh\Panel\Widgets\Bucket;
use Alxtexh\Panel\Widgets\ChartWidget;
use Alxtexh\Panel\Widgets\DashboardFilters;
use Alxtexh\Panel\Widgets\Period;
use Alxtexh\Panel\Widgets\Rollup;
use Alxtexh\Panel\Widgets\StatWidget;
use Alxtexh\Panel\Widgets\TimeSeries;
use Alxtexh\Panel\Widgets\Trend;
use Alxtexh\Panel\Widgets\Window;

/**
 * The dashboard.
 *
 * EVERY WIDGET IS DEFERRED. Spec §10: the page shell must paint before any
 * widget query runs, and no widget may block first paint. Each is its own
 * deferred prop in its own group, so they arrive INDEPENDENTLY - one slow
 * counter does not hold up the other five.
 *
 * antipatterns §3.2 is the caution here: deferred loading applied GLOBALLY made
 * things worse on render-bound pages, because it adds a round trip and a
 * re-hydration to a page that was never query-bound. It is right here
 * specifically because these are aggregates over large tables, and wrong as a
 * blanket policy - which is why the resource tables are not deferred.
 *
 * PERIODS ARE PER CHART, carried as `?period_<key>=7d`. One dashboard-wide
 * period would mean changing the sessions window also re-runs the signup and
 * breakdown queries, so a click costs four scans instead of one. Per-chart
 * params let the page reload exactly one prop with `only:`.
 */
final class DemoDashboard
{

    /*
     * SORTED TO THE TOP. It is where signing in lands, so it is where the
     * navigation should start; without this it sorts alphabetically into the
     * middle of the resource list.
     */

    /*
     | THE TWO SLICES OF THIS DASHBOARD THAT NOT EVERYBODY SHOULD SEE.
     |
     | Named constants rather than literals scattered across thirty widget
     | definitions, because a mistyped ability string does not fail - it produces
     | a widget nobody can see, on a page that still renders, with no error
     | anywhere. `Abilities::all()` rejects unknown names for the same reason.
     |
     | TWO GROUPS, NOT THIRTY. One ability per widget would be honest and
     | unusable: a permission matrix with thirty dashboard checkboxes is one
     | nobody reads, and an unread matrix is ticked wholesale. These are the two
     | cuts an ISP actually makes - who may see the commercial picture, and who
     | may see the network's.
     |
     | Declared with their labels in `config/panel.php`; nothing here invents an
     | ability name that the permission system does not know about.
     */
    private const COMMERCIAL = 'view_commercial_widgets';

    private const NETWORK = 'view_network_widgets';

    /** @return list<ChartWidget> */
    public static function charts(): array
    {
        $filters = DashboardPage::filters();

        return [
            /*
             * DETAILERS FIRST. They are glanceable facts, not plots, and they
             * used to sit under fifteen charts so nobody ever saw them.
             */
            ChartWidget::make('system_status', 'System status')
                ->type('table')
                ->icon('gauge')
                ->description('This host, right now')
                ->data(fn (): array => ['rows' => self::systemStatusRows()])
                ->ability(self::NETWORK),

            ChartWidget::make('customer_summary', 'Customers')
                ->type('table')
                ->icon('users')
                ->description('Subscriber counts, at a glance')
                ->data(fn (): array => ['rows' => self::customerSummaryRows($filters)])
                ->ability(self::COMMERCIAL),

            ChartWidget::make('sessions', 'Sessions over time')
                ->type('area')
                ->description('When subscribers connect')
                ->withPeriods()
                ->span(2)
                ->data(fn (Period $p, ?DateTimeImmutable $now): array => self::sessionSeries($filters)
                    ->resolveWindow($filters->windowFor($p, $now ?? new DateTimeImmutable)))
                ->trend(fn (Period $p, ?DateTimeImmutable $now): Trend => self::trendFor(
                    self::sessionSeries($filters),
                    $filters->windowFor($p, $now ?? new DateTimeImmutable),
                ))
                ->ability(self::NETWORK),

            /*
             * A CONSUMER FOR THE SCATTER CHART, which shipped without one.
             *
             * `ScatterChart.vue` was tested and exported, `scatter` was not in
             * `ChartWidget::TYPES` so declaring one THREW, and the dashboard
             * had no branch to draw it. Three halves of a feature and no way
             * to reach it - so this line is what makes the type real.
             *
             * BOTH AXES ARE MEASURED here, which is the point of the type:
             * speed against price, so the gaps between plans carry meaning.
             * A line chart would space them evenly and say nothing.
             */
            ChartWidget::make('plan_value', 'Speed against price')
                ->type('scatter')
                ->description('Where each plan sits on value')
                ->data(fn (): array => ['xy' => Plan::query()
                    ->select(['name', 'speed_mbps', 'price_cents'])
                    ->orderBy('speed_mbps')
                    ->limit(50)
                    ->get()
                    ->map(fn (Plan $plan): array => [
                        'x' => (int) $plan->speed_mbps,
                        'y' => (int) $plan->price_cents / 100,
                        'label' => (string) $plan->name,
                    ])
                    ->all()])
                ->ability(self::NETWORK),

            ChartWidget::make('signups', 'New subscribers')
                ->type('line')
                ->description('Sign-ups per bucket')
                ->withPeriods()
                ->span(2)
                ->data(fn (Period $p, ?DateTimeImmutable $now): array => self::signupSeries($filters)
                    ->resolveWindow($filters->windowFor($p, $now ?? new DateTimeImmutable)))
                ->trend(fn (Period $p, ?DateTimeImmutable $now): Trend => self::trendFor(
                    self::signupSeries($filters),
                    $filters->windowFor($p, $now ?? new DateTimeImmutable),
                ))
                ->ability(self::COMMERCIAL),

            // Categorical, so no period selector - a current-state breakdown
            // has only one sensible reading.
            ChartWidget::make('status', 'Clients by status')
                ->type('doughnut')
                ->data(fn (): array => self::groupedCount('status', $filters)),

            ChartWidget::make('plan_type', 'Clients by plan type')
                ->type('doughnut')
                ->data(fn (): array => self::groupedCount('plan_type', $filters))
                ->ability(self::COMMERCIAL),
        ];
    }

    /**
     * EVERY RENDERER THE PANEL SHIPS, on real data - a reference gallery, not
     * the dashboard. This used to sit inline in `charts()`, appended straight
     * onto the actual day-to-day dashboard: seven glanceable widgets followed
     * by thirteen more whose job is showing what a chart TYPE looks like, not
     * telling an ISP operator anything they check daily. Several of these
     * intentionally render the SAME underlying numbers a different way
     * (`plan_status`/`plan_status_grouped`/`plan_radar` are all
     * `crossTab('plan_type', 'status')`; `status`/`status_pie` in `charts()`
     * are both `groupedCount('status')`) - exactly right for "compare how a
     * stacked bar reads against a radar", exactly wrong for a screen someone
     * opens every morning to see whether renewals are piling up.
     *
     * Hosted on its own page (`App\Demo\Panel\Pages\ChartGalleryPage`) rather than
     * folded back onto the dashboard, the same reasoning `ShowcasePage`
     * already states for fields and columns: a panel author picking a chart
     * type wants to see every option against their own numbers before
     * choosing, in one place built for that, not mixed into the screen an
     * operator actually works from.
     *
     * @return list<ChartWidget>
     */
    public static function galleryCharts(): array
    {
        $filters = DashboardPage::filters();

        return [
            ChartWidget::make('sessions_bars', 'Sessions by day')
                ->type('bar')
                ->description('Vertical bars')
                ->data(fn (Period $p, ?DateTimeImmutable $now): array => self::sessionSeries($filters)->resolve(Period::Days7, $now))
                ->ability(self::NETWORK),

            ChartWidget::make('routers_load', 'Busiest routers')
                ->type('horizontalBar')
                ->description('Horizontal bars - long labels stay readable')
                ->data(fn (): array => self::clientsPerRouter($filters))
                ->ability(self::NETWORK),

            ChartWidget::make('plan_status', 'Plan type by status')
                ->type('stackedBar')
                ->description('Stacked bars - parts of each total')
                ->span(2)
                ->data(fn (): array => self::crossTab('plan_type', 'status', $filters))
                ->ability(self::COMMERCIAL),

            ChartWidget::make('plan_status_grouped', 'Plan type by status, side by side')
                ->type('bar')
                ->description('Grouped bars - the same data, compared rather than summed')
                ->span(2)
                ->data(fn (): array => self::crossTab('plan_type', 'status', $filters))
                ->ability(self::COMMERCIAL),

            ChartWidget::make('sessions_vs_signups', 'Sessions against sign-ups')
                ->type('combo')
                ->description('Bars and a line together')
                ->span(2)
                ->data(fn (Period $p, ?DateTimeImmutable $now): array => self::comboSeries($now, $filters)),

            ChartWidget::make('load_vs_growth', 'Load against growth')
                ->type('multiAxis')
                ->description('Two scales - sessions in thousands beside sign-ups in tens')
                ->span(2)
                ->data(fn (Period $p, ?DateTimeImmutable $now): array => self::multiAxisSeries($now, $filters)),

            ChartWidget::make('today_hourly', 'Connections today')
                ->type('steppedLine')
                ->description('Stepped - a reading holds until the next one')
                ->span(2)
                ->data(fn (Period $p, ?DateTimeImmutable $now): array => self::sessionSeries($filters)->resolve(Period::Today, $now))
                ->ability(self::NETWORK),

            ChartWidget::make('status_pie', 'Status share')
                ->type('pie')
                ->description('Pie - parts of a whole')
                ->data(fn (): array => self::groupedCount('status', $filters)),

            ChartWidget::make('routers_polar', 'Router distribution')
                ->type('polarArea')
                ->description('Polar area - magnitudes that need not sum')
                ->data(fn (): array => self::clientsPerRouter($filters))
                ->ability(self::NETWORK),

            /*
             | RANKED, WORST FIRST. The point of this shape is that the reader
             | never has to read a number: the red end IS the answer. Pinned to
             | 100 so a percentage is measured against the full scale rather
             | than against whichever router happened to score highest.
             */
            ChartWidget::make('router_health', 'Service area performance (lowest 15)')
                ->type('rankedBar')
                ->description('Share of subscribers currently active, per router')
                ->span(2)
                ->thresholds([40 => 'danger', 70 => 'warning'], max: 100)
                ->data(fn (): array => self::routerHealth($filters))
                ->ability(self::NETWORK),

            // A hundred routers against three statuses: too many for bars, and
            // an ordering a line chart would imply does not exist.
            ChartWidget::make('status_heatmap', 'Subscribers by service area')
                ->type('heatmap')
                ->description('Subscriber status across every router')
                ->span(2)
                ->data(fn (): array => self::statusByRouter($filters))
                ->ability(self::NETWORK),

            ChartWidget::make('plan_radar', 'Plan mix by status')
                ->type('radar')
                ->description('Radar - the same axes compared across groups')
                ->data(fn (): array => self::crossTab('plan_type', 'status', $filters))
                ->ability(self::COMMERCIAL),

            // A proportional bar rather than a plot: three buckets of one
            // quantity read better side by side than as three points.
            ChartWidget::make('renewals', 'Renewals due')
                ->type('segments')
                ->description('Subscriptions reaching their expiry date')
                ->span(2)
                ->data(fn (Period $p, ?DateTimeImmutable $now): array => self::renewalBuckets($now, $filters))
                ->ability(self::COMMERCIAL),
        ];
    }

    /**
     * CPU, memory, swap and disk for the host this request is running on.
     *
     * READ, NEVER SAMPLED. A real CPU-percent needs two /proc/stat reads a
     * beat apart, which has no honest place inside one request - so this
     * reports load average against core count instead of pretending to a
     * precision it cannot have, and every figure here degrades to "not
     * available" rather than a guess when `/proc` does not exist.
     *
     * @return list<array<string, mixed>>
     */
    private static function systemStatusRows(): array
    {
        $cores = self::cpuCores();
        $load = function_exists('sys_getloadavg') ? sys_getloadavg() : null;
        $mem = self::procMeminfo();

        $rows = [
            ['key' => 'cores', 'label' => 'CPU cores', 'value' => (string) ($cores ?? 'Unknown')],
        ];

        if ($load !== null && $load !== false) {
            $rows[] = [
                'key' => 'load',
                'label' => 'Load average (1, 5, 15 min)',
                'value' => implode(', ', array_map(static fn (float $v): string => number_format($v, 2), $load)),
            ];

            if ($cores !== null) {
                $percent = min(100, round(($load[0] / $cores) * 100, 2));

                $rows[] = [
                    'key' => 'cpu',
                    'label' => 'CPU usage',
                    'value' => number_format($percent, 2).' %',
                    'tone' => $percent >= 90 ? 'danger' : ($percent >= 70 ? 'warning' : 'neutral'),
                    'bar' => [
                        'segments' => [
                            ['label' => 'Used', 'value' => $percent, 'tone' => 'warning'],
                            ['label' => 'Free', 'value' => max(0, 100 - $percent), 'tone' => 'success'],
                        ],
                        'total' => 100,
                    ],
                ];
            }
        }

        if ($mem !== null) {
            $rows[] = self::usageRow('Memory', $mem['total'], $mem['free']);
        }

        $swap = self::procMeminfo(swap: true);

        if ($swap !== null && $swap['total'] > 0) {
            $rows[] = self::usageRow('Swap', $swap['total'], $swap['free']);
        }

        $diskTotal = @disk_total_space('/');
        $diskFree = @disk_free_space('/');

        if ($diskTotal !== false && $diskFree !== false) {
            $rows[] = self::usageRow('Disk', (int) ($diskTotal / 1024), (int) ($diskFree / 1024));
        }

        $rows[] = [
            'key' => 'backup',
            'label' => 'Last backup',
            'value' => 'Never',
            'tone' => 'danger',
        ];

        return $rows;
    }

    /** A "5.2 GB (Free 38%)" row with a used/free bar - Memory, Swap and Disk share this shape. */
    /** @return array<string, mixed> */
    private static function usageRow(string $label, int $totalKb, int $freeKb): array
    {
        $usedKb = max(0, $totalKb - $freeKb);
        $freePercent = $totalKb > 0 ? round(($freeKb / $totalKb) * 100, 2) : 0;
        $usedPercent = 100 - $freePercent;

        return [
            'key' => strtolower($label),
            'label' => $label,
            'value' => sprintf('%.2f GB (Free %s%%)', $totalKb / 1024 / 1024, number_format($freePercent, 2)),
            'tone' => $usedPercent >= 90 ? 'danger' : ($usedPercent >= 75 ? 'warning' : 'neutral'),
            'bar' => [
                'segments' => [
                    ['label' => 'Used', 'value' => $usedKb, 'tone' => 'warning'],
                    ['label' => 'Free', 'value' => $freeKb, 'tone' => 'success'],
                ],
                'total' => $totalKb,
            ],
        ];
    }

    private static function cpuCores(): ?int
    {
        if (! is_readable('/proc/cpuinfo')) {
            return null;
        }

        $count = substr_count((string) file_get_contents('/proc/cpuinfo'), 'processor');

        return $count > 0 ? $count : null;
    }

    /** @return array{total: int, free: int}|null Kilobytes. */
    private static function procMeminfo(bool $swap = false): ?array
    {
        if (! is_readable('/proc/meminfo')) {
            return null;
        }

        $lines = (string) file_get_contents('/proc/meminfo');
        $totalKey = $swap ? 'SwapTotal' : 'MemTotal';
        $freeKey = $swap ? 'SwapFree' : 'MemAvailable';

        if (! preg_match('/^'.$totalKey.':\s+(\d+)/m', $lines, $t)
            || ! preg_match('/^'.$freeKey.':\s+(\d+)/m', $lines, $f)) {
            return null;
        }

        return ['total' => (int) $t[1], 'free' => (int) $f[1]];
    }

    /**
     * The "Customers" card - counts a support desk actually reaches for,
     * from tables this demo already has, so it costs nothing beyond the
     * declaration itself.
     *
     * @return list<array<string, mixed>>
     */
    private static function customerSummaryRows(DashboardFilters $filters): array
    {
        $now = new DateTimeImmutable;
        $startOfToday = $now->setTime(0, 0);
        $base = fn (): Builder => self::scoped(Client::query(), $filters);

        $startOfMonth = $startOfToday->modify('first day of this month');
        $startOfLastMonth = $startOfToday->modify('first day of last month');

        return [
            ['key' => 'overview', 'label' => 'Overview', 'heading' => true],
            ['key' => 'total', 'label' => 'Total', 'value' => number_format($base()->count())],
            [
                'key' => 'new',
                'label' => 'New',
                'value' => number_format($base()->where('created_at', '>=', $startOfToday->modify('-29 days'))->count()),
            ],
            [
                'key' => 'active',
                'label' => 'Active',
                'value' => number_format($base()->where('status', 'active')->count()),
                'tone' => 'success',
            ],
            [
                'key' => 'online',
                'label' => 'Online',
                'value' => number_format(self::scoped(ClientSession::query(), $filters)->whereNull('ended_at')->count()),
                'tone' => 'success',
            ],
            [
                'key' => 'suspended',
                'label' => 'Blocked',
                'value' => number_format($base()->where('status', 'suspended')->count()),
                'tone' => 'danger',
            ],
            [
                'key' => 'expired',
                'label' => 'Inactive',
                'value' => number_format($base()->where('status', 'expired')->count()),
            ],
            ['key' => 'finance', 'label' => 'Finance', 'heading' => true, 'tone' => 'info'],
            [
                'key' => 'added_month',
                'label' => 'Current month',
                'value' => number_format($base()->where('created_at', '>=', $startOfMonth)->count()),
                'tone' => 'info',
            ],
            [
                'key' => 'added_last',
                'label' => 'Last month',
                'value' => number_format($base()->where('created_at', '>=', $startOfLastMonth)
                    ->where('created_at', '<', $startOfMonth)->count()),
                'tone' => 'warning',
            ],
            [
                'key' => 'added_year',
                'label' => 'Added last year',
                'value' => number_format($base()->whereYear('created_at', (int) $now->modify('-1 year')->format('Y'))->count()),
            ],
        ];
    }

    /** Current window against the equally-long window before it. */
    private static function trendFor(TimeSeries $series, Window $window): Trend
    {
        return Trend::between($series->totalIn($window), $series->totalIn($window->previous()));
    }

    /**
     * The session series, narrowed by the dashboard filter.
     *
     * The router constraint is applied to the QUERY, not to the result: filtering
     * afterwards would still scan and aggregate every router's rows and then
     * throw most of them away.
     */
    /**
     * Sessions across four windows, as one strip.
     *
     * READ FROM THE ROLLUP, plus today live. Each of these is a COUNT over a
     * span of a 1M-row table - the 90-day one alone was a second - and they are
     * exactly the shape the rollup exists for: complete days are stored, and
     * only the day still accumulating has to be counted.
     *
     * THE WINDOWS ARE ALL BOUNDED, deliberately. "All time" is the obvious
     * fourth entry and is the one figure this cannot honestly give: the rollup
     * knows what was backfilled, not what exists, so an unbounded question
     * would quietly return "all time that happens to have been aggregated" with
     * no way for the reader to tell.
     *
     * THE ROLLUP IS SKIPPED WHEN A ROUTER FILTER IS ACTIVE, for the same reason
     * the charts skip it: buckets are stored per tenant, so a filtered heading
     * over unfiltered numbers would be wrong rather than merely stale.
     *
     * @return list<array{key: string, label: string, value: int, caption: string}>
     */
    /**
     * Sign-ups across the same four windows - the second strip's figures.
     *
     * COUNTED FROM `clients.created_at`, not from a rollup, because the
     * subscriber table is the source of truth for when somebody joined and
     * these four windows are cheap index scans on a single column.
     *
     * THE SAME `sensitive` SPLIT as the session strip: the two glanceable
     * windows stay legible and the two rolling ones are covered. Consistency
     * matters more than the individual choice here - a reader who learns that
     * dots mean "click me" on one row should not have to relearn it on the
     * next.
     *
     * @return list<array<string, mixed>>
     */
    private static function signupStrip(string $tenantKey, DateTimeImmutable $now, DashboardFilters $filters): array
    {
        $startOfToday = $now->setTime(0, 0);

        $windows = [
            ['key' => 'today', 'label' => 'Today', 'from' => $startOfToday, 'caption' => 'so far', 'sensitive' => true],
            ['key' => 'week', 'label' => 'Last 7 days', 'from' => $startOfToday->modify('-6 days'), 'caption' => 'rolling window', 'sensitive' => true],
            ['key' => 'month', 'label' => 'This month', 'from' => $startOfToday->modify('first day of this month'), 'caption' => 'since the 1st', 'sensitive' => true],
            ['key' => 'quarter', 'label' => 'Last 90 days', 'from' => $startOfToday->modify('-89 days'), 'caption' => 'rolling window', 'sensitive' => true],
        ];

        $out = [];

        foreach ($windows as $window) {
            $out[] = [
                'key' => $window['key'],
                'label' => $window['label'],
                'value' => Client::query()->where('created_at', '>=', $window['from'])->count(),
                'caption' => $window['caption'],
                'sensitive' => $window['sensitive'],
            ];
        }

        return $out;
    }

    /** @return list<array<string, mixed>> */
    private static function sessionStrip(string $tenantKey, DateTimeImmutable $now, DashboardFilters $filters): array
    {
        $series = self::sessionSeries($filters);

        $startOfToday = $now->setTime(0, 0);
        $today = (int) $series->totalBetween($startOfToday, $startOfToday->modify('+1 day'));

        $windows = [
            /*
             * `sensitive` DECIDES WHICH FIGURES THE EYE COVERS, PER SEGMENT.
             *
             * IT USED TO COVER ALL FOUR, because `sensitive` defaults to true
             * and nothing here set it - so the strip was all-or-nothing and the
             * per-segment control the component was built for had no consumer.
             * A strip where everything is dots is one nobody reads; the point
             * of covering a figure is that the ones beside it are still legible.
             *
             * THIS STRIP COVERS ALL FOUR; THE ONE BELOW IT COVERS TWO OF
             * FOUR - deliberately, because those are the two shapes this
             * control has and the reference app should demonstrate both rather
             * than the same one twice. Session counts are the figures somebody
             * screen-shares by accident, so covering the row wholesale and
             * lifting it with a single click on the eye is the right gesture
             * here. Sign-ups below are read one at a time, so there the two
             * glanceable windows stay legible.
             */
            ['key' => 'today', 'label' => 'Today', 'from' => $startOfToday, 'caption' => 'so far', 'sensitive' => false],
            ['key' => 'week', 'label' => 'Last 7 days', 'from' => $startOfToday->modify('-6 days'), 'caption' => 'rolling window', 'sensitive' => true],
            ['key' => 'month', 'label' => 'This month', 'from' => $startOfToday->modify('first day of this month'), 'caption' => 'since the 1st', 'sensitive' => false],
            ['key' => 'quarter', 'label' => 'Last 90 days', 'from' => $startOfToday->modify('-89 days'), 'caption' => 'rolling window', 'sensitive' => true],
        ];

        $rollup = $filters->selected('routers') !== [] ? null : new Rollup('sessions.started');
        $yesterday = $startOfToday->modify('-1 day')->format(Bucket::Day->phpFormat());

        $out = [];

        foreach ($windows as $window) {
            $from = $window['from'];

            $value = $rollup === null
                ? (int) $series->totalBetween($from, $startOfToday->modify('+1 day'))
                : $rollup->sum($tenantKey, Bucket::Day, $from->format(Bucket::Day->phpFormat()), $yesterday) + $today;

            $out[] = [
                'key' => $window['key'],
                'label' => $window['label'],
                // Today's window is the live count on its own; the stored
                // buckets start yesterday.
                'value' => $window['key'] === 'today' ? $today : $value,
                'caption' => $window['caption'],
                'sensitive' => $window['sensitive'],
            ];
        }

        return $out;
    }

    private static function sessionSeries(?DashboardFilters $filters = null): TimeSeries
    {
        return self::withRollup(
            TimeSeries::of(self::scoped(ClientSession::query(), $filters))->timestamp('started_at')->count(),
            'sessions.started',
            $filters,
        );
    }

    private static function signupSeries(?DashboardFilters $filters = null): TimeSeries
    {
        return self::withRollup(
            TimeSeries::of(self::scoped(Client::query(), $filters))->timestamp('created_at')->count(),
            'clients.created',
            $filters,
        );
    }

    /**
     * Read from the rollup, but ONLY when the series is the unfiltered one.
     *
     * A rollup is aggregated per tenant and per bucket and knows nothing about
     * a router filter - serving one for a narrowed series would return the
     * whole tenant's numbers under a filtered heading, which is a wrong answer
     * that looks entirely plausible.
     *
     * So a filtered chart falls back to the live query and pays for it, which
     * is the correct trade: the unfiltered dashboard is what everyone loads,
     * and a deliberately narrowed one is both rarer and expected to think.
     */
    private static function withRollup(TimeSeries $series, string $metric, ?DashboardFilters $filters): TimeSeries
    {
        if ($filters !== null && $filters->selected('routers') !== []) {
            return $series;
        }

        $tenantKey = app(TenantContext::class)->currentKey();

        return $tenantKey === null ? $series : $series->rollup($metric, $tenantKey);
    }

    /**
     * Apply the filter's router set to any query that has a `router_id`.
     *
     * @template TBuilder of \Illuminate\Database\Eloquent\Builder
     *
     * @param  TBuilder  $query
     * @return TBuilder
     */
    private static function scoped(Builder $query, ?DashboardFilters $filters): Builder
    {
        if ($filters !== null && $filters->selected('routers') !== []) {
            $query->whereIn('router_id', $filters->selected('routers'));
        }

        return $query;
    }

    /**
     * A two-dimensional breakdown as several named series - ONE grouped query.
     *
     * The pivot happens in PHP over a handful of rows rather than as N queries
     * or a hand-written CASE per series: `GROUP BY a, b` returns every
     * combination that exists, and combinations that do NOT exist are filled
     * with zero here. Without that fill a series would be shorter than the
     * others and every renderer would silently mis-align its bars, because a
     * bar's category comes from its index.
     *
     * @return array{series: list<array{name: string, points: list<array{label: string, value: int}>}>}
     */
    private static function crossTab(string $rowColumn, string $seriesColumn, ?DashboardFilters $filters = null): array
    {
        $rows = self::scoped(Client::query(), $filters)->toBase()
            ->select("{$rowColumn} as row_key", "{$seriesColumn} as series_key")
            ->selectRaw('COUNT(*) as value')
            ->groupBy($rowColumn, $seriesColumn)
            ->get();

        $categories = [];
        $names = [];
        $matrix = [];

        foreach ($rows as $r) {
            $category = (string) $r->row_key;
            $name = (string) $r->series_key;

            $categories[$category] = true;
            $names[$name] = true;
            $matrix[$name][$category] = (int) $r->value;
        }

        $categories = array_keys($categories);
        sort($categories);

        $series = [];

        foreach (array_keys($names) as $name) {
            $series[] = [
                'name' => ucfirst($name),
                'points' => array_map(
                    static fn (string $c): array => ['label' => $c, 'value' => $matrix[$name][$c] ?? 0],
                    $categories,
                ),
            ];
        }

        return ['series' => $series];
    }

    /**
     * Active share per router, worst first - ONE query.
     *
     * Conditional aggregation rather than two grouped queries and a join in
     * PHP: the numerator and the denominator come from the same scan, so they
     * cannot disagree if a row changes between them.
     *
     * Routers with too few subscribers are EXCLUDED. One subscriber who happens
     * to be suspended is a 0% router, and it would occupy the worst slot on the
     * chart every time while telling nobody anything.
     *
     * @return list<array{label: string, value: float}>
     */
    private static function routerHealth(?DashboardFilters $filters = null): array
    {
        $rows = self::scoped(Client::query(), $filters)->toBase()
            ->selectRaw(
                'router_id, COUNT(*) as total,'
                ." SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active"
            )
            ->groupBy('router_id')
            ->havingRaw('COUNT(*) >= 5')
            ->get();

        $names = Router::query()->toBase()
            ->whereIn('id', $rows->pluck('router_id')->filter()->all())
            ->pluck('name', 'id');

        return array_values($rows
            ->map(fn (object $r): array => [
                'label' => sprintf(
                    '%s - %s%% (%d)',
                    $names[$r->router_id] ?? "#{$r->router_id}",
                    round(($r->active / max(1, $r->total)) * 100, 1),
                    (int) $r->total,
                ),
                'value' => round(($r->active / max(1, $r->total)) * 100, 1),
            ])
            ->sortBy('value')
            ->take(15)
            ->values()
            ->all());
    }

    /**
     * Status across every router, as heatmap rows - ONE grouped query.
     *
     * Rows are statuses and columns are routers, not the other way round: a
     * heatmap is read along its rows, and three long rows are scannable where
     * a hundred short ones are not.
     *
     * @return array{series: list<array{name: string, points: list<array{label: string, value: int}>}>}
     */
    private static function statusByRouter(?DashboardFilters $filters = null): array
    {
        $rows = self::scoped(Client::query(), $filters)->toBase()
            ->selectRaw('router_id, status, COUNT(*) as value')
            ->groupBy('router_id', 'status')
            ->get();

        $names = Router::query()->toBase()
            ->whereIn('id', $rows->pluck('router_id')->filter()->unique()->all())
            ->orderBy('name')
            ->pluck('name', 'id');

        $matrix = [];

        foreach ($rows as $r) {
            $matrix[(string) $r->status][(int) $r->router_id] = (int) $r->value;
        }

        $statuses = array_keys($matrix);
        sort($statuses);

        return ['series' => array_map(
            static fn (string $status): array => [
                'name' => ucfirst($status),
                // Every router appears in every row, zero-filled. A row missing
                // a column would shift every cell after it, so a status would
                // be attributed to the wrong router with nothing failing.
                'points' => array_values($names
                    ->map(fn (string $name, int $id): array => [
                        'label' => $name,
                        'value' => $matrix[$status][$id] ?? 0,
                    ])
                    ->values()
                    ->all()),
            ],
            $statuses,
        )];
    }

    /**
     * Clients per router, named.
     *
     * One grouped query plus one lookup of router names, not one query per
     * router - addendum C1 again.
     *
     * @return list<array{label: string, value: int}>
     */
    private static function clientsPerRouter(?DashboardFilters $filters = null): array
    {
        $counts = self::scoped(Client::query(), $filters)->toBase()
            ->selectRaw('router_id, COUNT(*) as value')
            ->groupBy('router_id')
            ->orderByDesc('value')
            ->limit(8)
            ->get();

        $names = Router::query()->toBase()
            ->whereIn('id', $counts->pluck('router_id')->filter()->all())
            ->pluck('name', 'id');

        return array_values($counts
            ->map(fn (object $r): array => [
                'label' => (string) ($names[$r->router_id] ?? "Router #{$r->router_id}"),
                'value' => (int) $r->value,
            ])
            ->all());
    }

    /**
     * Sessions as bars, with their own rolling average as the line.
     *
     * BOTH HALVES ARE IN THE SAME UNIT, which is what a combo chart is for: the
     * line is a reading OF the bars, not a second quantity beside them. The
     * first attempt put sign-ups (tens) against sessions (hundreds) on a shared
     * scale, and the line rendered flat along the baseline - technically
     * correct and completely unreadable. Two units on one plot is the
     * multi-axis chart's job instead.
     *
     * @return array{bars: list<array<string, mixed>>, lines: list<array<string, mixed>>}
     */
    private static function comboSeries(?DateTimeImmutable $now, ?DashboardFilters $filters = null): array
    {
        $points = self::sessionSeries($filters)->resolve(Period::Days30, $now)['points'];

        return [
            'bars' => [['name' => 'Sessions', 'points' => $points]],
            'lines' => [['name' => '7-day average', 'points' => self::rollingAverage($points, 7)]],
        ];
    }

    /**
     * A trailing mean over `$window` points.
     *
     * Trailing, not centred: a centred average would need points from the
     * future for the most recent days, which do not exist - so the line would
     * stop short of the last bar and look truncated.
     *
     * @param  list<array{label: string, value: int|float}>  $points
     * @return list<array{label: string, value: float}>
     */
    private static function rollingAverage(array $points, int $window): array
    {
        $out = [];

        foreach ($points as $i => $point) {
            $slice = array_slice($points, max(0, $i - $window + 1), min($i + 1, $window));
            $values = array_column($slice, 'value');

            $out[] = [
                'label' => $point['label'],
                'value' => round(array_sum($values) / max(1, count($values)), 1),
            ];
        }

        return $out;
    }

    /**
     * Two series that genuinely need two scales.
     *
     * Sessions run in the hundreds and sign-ups in the tens; on a shared axis
     * the sign-up line is pressed flat against the baseline and reads as zero.
     */
    /** @return array{series: list<array<string, mixed>>} */
    private static function multiAxisSeries(?DateTimeImmutable $now, ?DashboardFilters $filters = null): array
    {
        return ['series' => [
            ['name' => 'Sessions', 'points' => self::sessionSeries($filters)->resolve(Period::Days30, $now)['points']],
            [
                'name' => 'Sign-ups',
                'axis' => 'right',
                'dashed' => true,
                'points' => self::signupSeries($filters)->resolve(Period::Days30, $now)['points'],
            ],
        ]];
    }

    /**
     * Upcoming renewals in three windows, as ONE query.
     *
     * Conditional aggregation rather than three counts: the alternative reads
     * more clearly and costs three scans of the same index for one card. The
     * bounds are parameters, never interpolated dates.
     *
     * @return list<array{label: string, value: int}>
     */
    private static function renewalBuckets(?DateTimeImmutable $now, ?DashboardFilters $filters = null): array
    {
        $now ??= new DateTimeImmutable;

        $at = static fn (string $modify): string => $now->modify($modify)->format('Y-m-d H:i:s');
        $today = $now->format('Y-m-d H:i:s');

        $row = self::scoped(Client::query(), $filters)->toBase()
            ->selectRaw(
                'SUM(CASE WHEN expiry_date >= ? AND expiry_date < ? THEN 1 ELSE 0 END) AS week,'
                .' SUM(CASE WHEN expiry_date >= ? AND expiry_date < ? THEN 1 ELSE 0 END) AS month,'
                .' SUM(CASE WHEN expiry_date >= ? AND expiry_date < ? THEN 1 ELSE 0 END) AS quarter',
                [$today, $at('+7 days'), $at('+7 days'), $at('+30 days'), $at('+30 days'), $at('+90 days')],
            )
            ->first();

        return [
            ['label' => 'Next 7 days', 'value' => (int) ($row->week ?? 0)],
            ['label' => '8-30 days', 'value' => (int) ($row->month ?? 0)],
            ['label' => '31-90 days', 'value' => (int) ($row->quarter ?? 0)],
        ];
    }

    /**
     * One grouped query, every slice.
     *
     * addendum C1 applies here as much as to tabs: N categories must never mean
     * N queries.
     *
     * @return list<array{label: string, value: int}>
     */
    private static function groupedCount(string $column, ?DashboardFilters $filters = null): array
    {
        return array_values(self::scoped(Client::query(), $filters)->toBase()
            ->select("{$column} as label")
            ->selectRaw('COUNT(*) as value')
            ->groupBy($column)
            ->orderByDesc('value')
            ->get()
            ->map(fn (object $r): array => ['label' => (string) $r->label, 'value' => (int) $r->value])
            ->all());
    }

    /**
     * @return list<StatWidget>
     *
     * A NUMBER, ITS TREND AND ITS SPARKLINE MUST ALL MEASURE THE SAME THING.
     *
     * The first cut hung a signups trend off the cumulative client total, so
     * the card read "100,000 ▼ 4.3%" - which any operator reads as having lost
     * 4.3% of their subscribers, when signups had merely slowed. A footnote in
     * the source does not reach the person looking at the card.
     *
     * So a cumulative total and a point-in-time gauge carry NO trend, and the
     * period-over-period measures get their own cards where the arrow refers to
     * the number printed above it.
     */
    public static function stats(): array
    {
        $filters = DashboardPage::filters();
        $now = new DateTimeImmutable;

        $period = Period::Days30;

        // The filter's range wins over the stat cards' fixed 30-day window, so
        // a filtered dashboard's counters describe the same period as its
        // charts rather than quietly reporting a different one.
        $window = $filters->windowFor($period, $now);

        return [
            StatWidget::make('clients_total', 'Total clients')
                ->value(fn (): int => self::scoped(Client::query(), $filters)->count())
                ->description('All subscribers'),

            // The growth card. Value, trend and sparkline are all "sign-ups in
            // the window", so the arrow means what it appears to mean.
            StatWidget::make('clients_new', 'New subscribers')
                ->value(fn (): int => (int) self::signupSeries($filters)->totalIn($window))
                ->trend(fn (): Trend => self::trendFor(self::signupSeries($filters), $window))
                ->sparkline(fn (): array => self::signupSeries($filters)->resolveWindow($window))
                ->ability(self::COMMERCIAL),

            StatWidget::make('clients_active', 'Active')
                ->value(fn (): int => self::scoped(Client::query(), $filters)->where('status', 'active')->count()),

            StatWidget::make('clients_expired', 'Expired')
                ->value(fn (): int => self::scoped(Client::query(), $filters)->where('status', 'expired')->count()),

            // A gauge, not a series: there is no stored history of how many
            // sessions were live an hour ago, so there is nothing honest to
            // compare against.
            StatWidget::make('sessions_live', 'Live sessions')
                ->value(fn (): int => self::scoped(ClientSession::query(), $filters)->whereNull('ended_at')->count())
                ->description('Currently online')
                ->ability(self::NETWORK),

            StatWidget::make('sessions_window', 'Sessions in range')
                ->value(fn (): int => (int) self::sessionSeries($filters)->totalIn($window))
                ->trend(fn (): Trend => self::trendFor(self::sessionSeries($filters), $window))
                ->sparkline(fn (): array => self::sessionSeries($filters)->resolveWindow($window))
                ->ability(self::NETWORK),

            StatWidget::make('routers_online', 'Routers online')
                ->value(fn (): int => Router::query()
                    ->when($filters->selected('routers') !== [], fn ($q) => $q->whereIn('id', $filters->selected('routers')))
                    ->where('status', 'online')
                    ->count())
                ->ability(self::NETWORK),

            /*
             * DELIBERATELY BROKEN, AND NO LONGER ON BY DEFAULT.
             *
             * One widget that throws must not take the dashboard down -
             * antipatterns §3.3, and the operator directive after that incident
             * was "even if the user has no router just show the pages". Proving
             * it needs a widget that fails, and for a long time this one shipped
             * enabled: a permanently red card on the reference dashboard, which
             * teaches every reader to ignore a red card.
             *
             * THE ISOLATION IS PROVED BY A TEST, which is where a proof belongs.
             * The card stays available behind a flag for anybody who wants to
             * see the behaviour on a real screen.
             */
            ...(config('panel.demo.broken_widget', false) ? [
                StatWidget::make('deliberately_broken', 'Failure isolation')
                    ->value(fn (): int => throw new \RuntimeException('This widget always fails, on purpose.'))
                    ->description('Proves one broken widget does not break the page'),
            ] : []),
        ];
    }

    /**
     * WHAT THIS DASHBOARD FILTERS BY, which is the ISP-specific part.
     *
     * The dimension used to be built into the packaged filter object as a
     * `routers` property, so every panel installed from this package carried an
     * ISP's vocabulary. It is declared here, where it is true.
     *
     * @return list<array{key: string, label: string, singular?: string|null, placeholder?: string|null, options: list<array{value: int, label: string}>}>
     */
    public static function dimensions(): array
    {
        return [
            [
                'key' => 'routers',
                'label' => 'Routers',
                'singular' => 'router',
                'placeholder' => 'All routers',
                // Small and tenant-scoped, so the options ride with the page
                // rather than needing a second request.
                'options' => array_values(Router::query()->orderBy('name')->limit(200)
                    ->get(['id', 'name'])
                    ->map(fn (Router $r): array => ['value' => $r->id, 'label' => $r->name])
                    ->all()),
            ],
        ];
    }

    /** The four windows above the widgets. */
    public static function strip(): Closure
    {
        return static fn (DashboardFilters $filters, DateTimeImmutable $now, string $tenantKey): array => self::sessionStrip($tenantKey, $now, $filters);
    }

    /**
     * GATED LIKE THE WIDGETS IT SITS ABOVE. It is session data - today, the last
     * seven days, the month - and it was reaching a commercial-only role while
     * every individual session widget was being filtered out. Splitting a screen
     * by permission and leaving one prop ungated is the same as not splitting
     * it: the numbers are still on the wire.
     */
    public static function stripAbility(): string
    {
        return self::NETWORK;
    }

    /**
     * A SECOND STRIP, over subscribers rather than sessions.
     *
     * BOTH FORMS ARE EXERCISED HERE ON PURPOSE. `strip()` above is the single
     * row almost every dashboard wants; this is the other shape - a second set
     * of windows over DIFFERENT figures, which is two rows of four rather than
     * one row of eight. A capability with no consumer in the reference app is
     * one nobody has looked at, and this project has paid for that repeatedly.
     *
     * ITS OWN ABILITY, WHICH IS MOST OF THE POINT. Sessions are network data
     * and sign-ups are commercial: the support rota sees one and the finance
     * desk the other, and that is exactly the cut a second strip exists to
     * make. A wider single row could not.
     *
     * `sensitive` COMPOSES INSIDE IT - the two halves are which figures belong
     * together and which of them are covered.
     */
    /** @return array<string, array{label: string, ability: string, resolve: callable}> */
    public static function strips(): array
    {
        return [
            'signups' => [
                'label' => 'New subscribers',
                'ability' => self::COMMERCIAL,
                'resolve' => static fn (DashboardFilters $filters, DateTimeImmutable $now, string $tenantKey): array => self::signupStrip($tenantKey, $now, $filters),
            ],
        ];
    }
}
