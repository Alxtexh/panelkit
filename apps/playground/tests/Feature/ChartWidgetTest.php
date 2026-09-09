<?php

declare(strict_types=1);

namespace Tests\Feature;

use Alxtexh\Panel\Widgets\Bucket;
use Alxtexh\Panel\Widgets\ChartWidget;
use Alxtexh\Panel\Widgets\Period;
use Alxtexh\Panel\Widgets\TimeSeries;
use Alxtexh\Panel\Widgets\Trend;
use App\Demo\Models\Client;
use App\Demo\Models\ClientSession;
use App\Demo\Models\Router;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use DateTimeImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;
use Tests\TestCase;

/**
 * The dashboard chart layer.
 *
 * The cases that matter here are the ones that produce a PLAUSIBLE WRONG
 * ANSWER rather than an error: a gap that renders as a slope, a trend divided
 * by zero, a series that quietly crosses tenants.
 */
final class ChartWidgetTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $tenantA;

    private Tenant $tenantB;

    private User $userA;

    private DateTimeImmutable $now;

    protected function setUp(): void
    {
        parent::setUp();

        $this->now = new DateTimeImmutable('2026-07-27 12:00:00');

        $this->tenantA = Tenant::create(['name' => 'A', 'slug' => 'a']);
        $this->tenantB = Tenant::create(['name' => 'B', 'slug' => 'b']);
        $this->userA = User::factory()->create([
            'tenant_id' => $this->tenantA->id,
            'email_verified_at' => now(),
        ]);

        /*
         * Authenticate for every test in this class.
         *
         * The tenant scope FAILS CLOSED: with no resolvable tenant it matches
         * nothing rather than falling back to every row. So an unauthenticated
         * series legitimately returns zeroes, and a test asserting real counts
         * has to establish a tenant first. That is the scope working, not a
         * fixture problem - the equivalent bug in the opposite direction would
         * be a chart silently aggregating across all tenants.
         */
        $this->actingAs($this->userA);
    }

    /* ---------------------------------------------------------- gap filling */

    /**
     * THE HEADLINE CASE. A day with no rows must come back as an explicit zero.
     *
     * The database returns no row at all for an empty bucket. Plotting that raw
     * draws a straight line from Monday to Wednesday and labels the midpoint
     * Tuesday - a total outage renders as a gentle slope, which is the most
     * expensive kind of wrong a dashboard can be.
     */
    public function test_a_bucket_with_no_rows_is_a_zero_not_a_hole(): void
    {
        $this->seedClientsOn(['2026-07-25' => 3, '2026-07-27' => 5]);

        $series = TimeSeries::of(Client::query())->timestamp('created_at')->count()
            ->resolve(Period::Days7, $this->now);

        // 7 days requested, 7 points returned, whatever the data looks like.
        $this->assertCount(7, $series['points']);

        $byDate = array_column($series['points'], 'value', 'at');

        $this->assertSame(3, $byDate['2026-07-25']);
        $this->assertSame(0, $byDate['2026-07-26'], 'The empty day must be present and zero.');
        $this->assertSame(5, $byDate['2026-07-27']);
        $this->assertSame(8, $series['total']);
    }

    /** Rows outside the window must not leak into the first bucket. */
    public function test_the_series_is_bounded_by_the_period(): void
    {
        $this->seedClientsOn(['2026-06-01' => 9, '2026-07-27' => 2]);

        $series = TimeSeries::of(Client::query())->timestamp('created_at')->count()
            ->resolve(Period::Days7, $this->now);

        $this->assertSame(2, $series['total'], 'June rows are outside a 7-day window.');
    }

    /** N points, ONE query - addendum C1. */
    public function test_a_thirty_point_series_runs_one_query(): void
    {
        $this->seedClientsOn(['2026-07-27' => 4]);

        DB::enableQueryLog();

        TimeSeries::of(Client::query())->timestamp('created_at')->count()
            ->resolve(Period::Days30, $this->now);

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $this->assertCount(1, $queries, 'A 30-day chart must be one GROUP BY, not 30 counts.');
    }

    /**
     * The series is built from an Eloquent builder and `toBase()` is called
     * inside TimeSeries, so the tenant global scope still applies.
     */
    public function test_a_series_never_counts_another_tenants_rows(): void
    {
        $this->seedClientsOn(['2026-07-27' => 4], $this->tenantA);
        $this->seedClientsOn(['2026-07-27' => 11], $this->tenantB);

        $series = TimeSeries::of(Client::query())->timestamp('created_at')->count()
            ->resolve(Period::Days7, $this->now);

        $this->assertSame(4, $series['total'], "Tenant B's 11 rows must not appear.");
    }

    public function test_totals_between_two_moments_ignore_rows_outside_them(): void
    {
        $this->seedClientsOn(['2026-07-20' => 6, '2026-07-27' => 1]);

        $total = TimeSeries::of(Client::query())->timestamp('created_at')->count()
            ->totalBetween(new DateTimeImmutable('2026-07-19'), new DateTimeImmutable('2026-07-21'));

        $this->assertSame(6, $total);
    }

    /** A column name reaching raw SQL is validated, not interpolated blindly. */
    public function test_an_injected_column_name_is_rejected(): void
    {
        $this->expectException(InvalidArgumentException::class);

        TimeSeries::of(Client::query())->timestamp('created_at); DROP TABLE clients;--');
    }

    /* --------------------------------------------------------------- buckets */

    public function test_each_driver_has_its_own_bucketing_expression(): void
    {
        $this->assertStringContainsString('strftime', Bucket::Day->expression('sqlite', 'created_at'));
        $this->assertStringContainsString('DATE_FORMAT', Bucket::Day->expression('mysql', 'created_at'));
        $this->assertStringContainsString('date_trunc', Bucket::Day->expression('pgsql', 'created_at'));
    }

    /**
     * An unknown driver must THROW rather than fall back to a default dialect.
     *
     * A guessed expression does not error - it returns a chart with silently
     * wrong buckets, which is worse than a page that fails loudly.
     */
    public function test_an_unknown_driver_throws_rather_than_guessing(): void
    {
        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('No time series bucketing strategy');

        Bucket::Day->expression('oracle', 'created_at');
    }

    /* ---------------------------------------------------------------- period */

    /**
     * The comparison window must be the same LENGTH, not the same calendar
     * unit - 30 days against a 28-day February manufactures a trend out of the
     * calendar.
     */
    public function test_the_previous_window_is_equal_in_length(): void
    {
        $period = Period::Days30;

        [$previousStart, $previousEnd] = $period->previous($this->now);

        $current = $period->end($this->now)->getTimestamp() - $period->start($this->now)->getTimestamp();
        $previous = $previousEnd->getTimestamp() - $previousStart->getTimestamp();

        $this->assertSame($current, $previous);
        $this->assertEquals($period->start($this->now), $previousEnd, 'The windows must be adjacent.');
    }

    /** A hand-edited query string must not reach a date expression. */
    public function test_an_unknown_period_falls_back_to_the_default(): void
    {
        $this->assertSame(Period::default(), Period::fromRequest("'; DROP TABLE clients;--"));
        $this->assertSame(Period::default(), Period::fromRequest(null));
        $this->assertSame(Period::Days7, Period::fromRequest('7d'));
    }

    public function test_a_day_is_bucketed_by_hour_and_a_year_by_month(): void
    {
        $this->assertSame(Bucket::Hour, Period::Today->bucket());
        $this->assertSame(Bucket::Month, Period::Months12->bucket());
        $this->assertCount(12, TimeSeries::of(Client::query())->timestamp('created_at')->count()
            ->resolve(Period::Months12, $this->now)['points']);
    }

    /**
     * "Today" stops at the current hour - it does NOT pad out the rest of the
     * day with zeroes.
     *
     * Gap filling exists to make a missing bucket visible, and a bucket that
     * has not happened yet is not missing. Filling it would draw every
     * mid-afternoon dashboard as a cliff falling to zero, which reads as an
     * outage in progress.
     */
    public function test_the_series_stops_at_the_current_bucket(): void
    {
        // 12:00 → hours 00:00 through 12:00 inclusive, and nothing after.
        $points = TimeSeries::of(Client::query())->timestamp('created_at')->count()
            ->resolve(Period::Today, $this->now)['points'];

        $this->assertCount(13, $points);
        $this->assertSame('12:00', end($points)['label']);
    }

    /* ----------------------------------------------------------------- trend */

    /** There is no percentage increase from nothing; the answer is "new". */
    public function test_growth_from_zero_is_new_rather_than_infinite(): void
    {
        $trend = Trend::between(500, 0);

        $this->assertNull($trend->percentage);
        $this->assertSame('new', $trend->direction);
    }

    public function test_zero_against_zero_is_flat_not_an_error(): void
    {
        $trend = Trend::between(0, 0);

        $this->assertNull($trend->percentage);
        $this->assertSame('flat', $trend->direction);
    }

    /** A total collapse IS expressible and must survive. */
    public function test_a_drop_to_zero_is_minus_one_hundred_percent(): void
    {
        $trend = Trend::between(0, 100);

        $this->assertSame(-100.0, $trend->percentage);
        $this->assertSame('down', $trend->direction);
    }

    /** A move too small to round must not render as an arrow. */
    public function test_a_negligible_move_is_flat(): void
    {
        $this->assertSame('flat', Trend::between(100_000, 100_001)->direction);
        $this->assertSame('up', Trend::between(110, 100)->direction);
    }

    /* ----------------------------------------------------------- the widget */

    /** One broken chart renders as one broken card, not a 500. */
    public function test_a_failing_chart_reports_itself_without_throwing(): void
    {
        $chart = ChartWidget::make('boom', 'Boom')
            ->data(fn (): array => throw new RuntimeException('nope'));

        $resolved = $chart->resolve(Period::Days7, 'tenant-a', $this->now);

        $this->assertTrue($resolved['error']);
        $this->assertSame([], $resolved['points']);
    }

    /** Structure must never run a query - it ships with the page shell. */
    public function test_describing_a_chart_runs_no_query(): void
    {
        $chart = ChartWidget::make('sessions', 'Sessions')
            ->withPeriods()
            ->data(fn (): array => throw new RuntimeException('must not be called'));

        DB::enableQueryLog();
        $schema = $chart->toArray();
        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $this->assertCount(0, $queries);
        $this->assertCount(5, $schema['periods']);
    }

    public function test_an_unknown_chart_type_is_rejected_at_definition_time(): void
    {
        $this->expectException(InvalidArgumentException::class);

        ChartWidget::make('x', 'X')->type('sunburst');
    }

    /**
     * Catalog tiles and line items are not points. Treating them as a series
     * would invent a total and drop the fields a POS or rental card needs.
     */
    public function test_catalog_and_item_payloads_pass_through_as_items(): void
    {
        $catalog = ChartWidget::make('featured', 'Featured')
            ->type('catalog')
            ->data(fn (): array => [
                'items' => [
                    ['key' => 'a', 'label' => 'Day desk', 'price' => '12.00', 'status' => 'available'],
                ],
            ]);

        $resolved = $catalog->resolve(Period::Days7, 'tenant-a', $this->now);

        $this->assertFalse($resolved['error']);
        $this->assertSame([], $resolved['points']);
        $this->assertNull($resolved['rows']);
        $this->assertSame('Day desk', $resolved['items'][0]['label']);

        $lines = ChartWidget::make('basket', 'Basket')
            ->type('items')
            ->data(fn (): array => [
                'items' => [
                    ['key' => '1', 'label' => 'Filter pack', 'qty' => 2, 'amount' => '13.00', 'status' => 'paid'],
                ],
            ]);

        $this->assertSame('paid', $lines->resolve(Period::Days7, 'tenant-a', $this->now)['items'][0]['status']);
    }

    /** A detailer heading is a row, not a plot point. */
    public function test_table_rows_including_headings_pass_through(): void
    {
        $chart = ChartWidget::make('customers', 'Customers')
            ->type('table')
            ->icon('users')
            ->data(fn (): array => [
                'rows' => [
                    ['key' => 'finance', 'label' => 'Finance', 'heading' => true, 'tone' => 'info'],
                    ['key' => 'never', 'label' => 'Last backup', 'value' => 'Never', 'tone' => 'danger'],
                ],
            ]);

        $this->assertSame('users', $chart->toArray()['icon']);

        $resolved = $chart->resolve(Period::Days7, 'tenant-a', $this->now);

        $this->assertFalse($resolved['error']);
        $this->assertTrue($resolved['rows'][0]['heading']);
        $this->assertSame('Never', $resolved['rows'][1]['value']);
    }

    /* ------------------------------------------------------------- the page */

    public function test_the_dashboard_ships_structure_without_resolving_widgets(): void
    {
        $this->actingAs($this->userA)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('widgets')
                // The day-to-day dashboard, not the full renderer gallery -
                // that moved to its own page (DemoDashboard::galleryCharts()).
                ->has('charts', 8)
                ->has('periods')
                // Deferred props are absent from the first response by design:
                // the shell must paint before any aggregate runs (§10).
                ->missing('chart_sessions')
                ->missing('stat_clients_total'));
    }

    /**
     * Changing one period must reload ONE chart.
     *
     * Without `only:`, a period click re-resolves every deferred prop on the
     * page - seven counters and four charts for one selector - which is the
     * polling-shaped waste the live-update rules exist to avoid.
     */
    public function test_a_period_change_resolves_only_that_chart(): void
    {
        $this->seedClientsOn(['2026-07-27' => 2]);

        $response = $this
            ->withHeaders([
                'X-Inertia' => 'true',
                /*
                 * The REAL asset version, computed the same way the middleware
                 * computes it. A made-up one gets a 409 telling the client to
                 * do a full reload - and a 409 has no props at all, so the
                 * "only this chart resolved" assertions below would have passed
                 * vacuously against an empty response.
                 *
                 * Inertia::getVersion() is not it: the version is set ON the
                 * request by the middleware, so before a request has been
                 * handled it is still empty.
                 */
                'X-Inertia-Version' => (string) app(HandleInertiaRequests::class)->version(request()),
                'X-Inertia-Partial-Component' => 'PanelDashboard',
                'X-Inertia-Partial-Data' => 'chart_signups,periods',
            ])
            ->getJson('/dashboard?period_signups=7d');

        $props = $response->assertOk()->json('props');

        $this->assertArrayHasKey('chart_signups', $props);
        $this->assertSame('7d', $props['periods']['signups']);

        $this->assertArrayNotHasKey('chart_sessions', $props, 'Only the requested chart may resolve.');
        $this->assertArrayNotHasKey('stat_clients_total', $props);
    }

    /* ----------------------------------------------------------------- setup */

    /** @param array<string, int> $counts Date => how many rows on that date. */
    private function seedClientsOn(array $counts, ?Tenant $tenant = null): void
    {
        $tenant ??= $this->tenantA;

        $plan = Plan::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Test Plan',
            'speed_mbps' => 10,
            'price_cents' => 1000,
        ]);

        $router = Router::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Test Router',
            'ip_address' => '10.0.0.1',
            'model' => 'RB750',
            'status' => 'online',
        ]);

        $n = 0;

        foreach ($counts as $date => $count) {
            for ($i = 0; $i < $count; $i++) {
                $at = "{$date} 09:00:00";
                $n++;

                // forceCreate, because Client keeps `tenant_id` OUT of
                // $fillable on purpose (spec target 7 - mass assignment is
                // closed). A plain create() silently drops it and the row
                // fails the NOT NULL constraint.
                Client::withoutGlobalScopes()->forceCreate([
                    'tenant_id' => $tenant->id,
                    'plan_id' => $plan->id,
                    'router_id' => $router->id,
                    'name' => "Client {$tenant->id} {$n}",
                    'phone' => '+2547'.str_pad((string) $n, 8, '0', STR_PAD_LEFT),
                    'access_code' => strtoupper(substr(md5("{$tenant->id}-{$n}"), 0, 8)),
                    'status' => 'active',
                    'plan_type' => 'pppoe',
                    'expiry_date' => '2026-12-31',
                    'created_at' => $at,
                    'updated_at' => $at,
                ]);

                ClientSession::withoutGlobalScopes()->create([
                    'tenant_id' => $tenant->id,
                    'client_id' => Client::withoutGlobalScopes()->latest('id')->value('id'),
                    'router_id' => $router->id,
                    'status' => 'closed',
                    'ip_address' => '10.0.0.2',
                    'bytes_in' => 100,
                    'bytes_out' => 100,
                    'started_at' => $at,
                    'ended_at' => $at,
                ]);
            }
        }
    }
}
