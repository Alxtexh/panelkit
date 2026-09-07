<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Commands;

use Closure;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\Budgets;
use Alxtexh\Panel\Support\TenantContext;
use Alxtexh\Panel\Tables\Filters\BooleanFilter;
use Alxtexh\Panel\Tables\Filters\Filter;
use Alxtexh\Panel\Tables\Filters\HasOptions;
use Alxtexh\Panel\Tables\Table;

/**
 * Times the panel's own surfaces, warm, and reports medians.
 *
 * WARM RUNS AND A MEDIAN, NEVER A SINGLE COLD ONE. A first run measures opcache,
 * a cold query planner and an empty schema cache - none of which the application
 * pays twice. This project has already produced two false findings that way: a
 * query guard that "improved" from 3 queries to 2 because the first request
 * populated a cache, and a list that looked 4x slower than recorded because the
 * dev server was running beside it. The methodology is not ceremony.
 *
 * THE MEDIAN, NOT THE MEAN. One sample landing on a background write skews an
 * average and cannot move a median. What is being measured is the typical
 * request, and the mean is not that.
 *
 * IT MEASURES QUERY SHAPE, NOT A MACHINE. Every figure is paired with a query
 * COUNT, because a page that got slower and fired the same number of queries has
 * a different problem from one that fired forty more - and only one of those two
 * is a regression somebody can fix from the panel code.
 *
 * `--json` MAKES IT COMPARABLE OVER TIME. A table is for reading now; a build
 * that can gate on last week's numbers needs a machine-readable one.
 */
final class BenchmarkCommand extends Command
{
    protected $signature = 'panel:benchmark
                            {--tenant= : Tenant key or slug to measure. Required outside a tenant request}
                            {--runs=3 : Measured runs per surface, after a warm-up}
                            {--budget=300 : Milliseconds a surface may take}
                            {--json : Emit a machine-readable report instead of a table}';

    protected $description = 'Time the panel\'s list surfaces, warm, and report medians';

    public function handle(PanelManager $panels, TenantContext $context): int
    {
        $runs = max(1, (int) $this->option('runs'));
        $budget = (float) $this->option('budget');
        $json = (bool) $this->option('json');

        /*
         * A TENANT MUST BE RESOLVED, and the command refuses without one rather
         * than measuring whatever an unscoped query returns.
         *
         * A benchmark of the wrong query shape is worse than no benchmark: it
         * produces a number that looks authoritative and describes nothing the
         * application does. An unscoped list on a shared database also reads
         * EVERY tenant's rows, so the figure is both meaningless and slower than
         * anything real.
         *
         * A console command has no request and therefore no tenant, so
         * `--tenant` is how one is chosen. It is deliberately not optional-with-
         * a-default: "measure whichever tenant happens to be first" is exactly
         * the kind of convenience that produces a number nobody can reproduce.
         */
        if (! $this->initialiseTenant()) {
            return self::FAILURE;
        }

        $results = [];

        foreach ($panels->resources() as $key => $class) {
            $definition = $class::definition();

            /*
             * A RESOURCE MAY DECLARE ITS OWN CEILING. Most do not and take the
             * command's - a generated list has one query shape, so one number
             * describes them all. The ones that differ differ for a reason
             * somebody wrote down next to the screen.
             */
            $resourceBudget = $class::budgetMs() ?? $budget;

            foreach ($this->surfaces($class, $definition) as $label => $work) {
                $results[] = $this->measure("{$key}: {$label}", $work, $runs, $resourceBudget);
            }
        }

        /*
         * AND THE SCREENS SOMEBODY WROTE - roadmap 7.6.
         *
         * Until this loop the benchmark covered what the panel GENERATES and
         * nothing an application built: the dashboard, the designer, a bulk
         * send. Those are the ones that get slow, because a generated list has
         * one query shape and a hand-written screen has however many somebody
         * added. See `Budgets`, which is where a screen states its promise.
         */
        foreach (Budgets::all() as $label => $declared) {
            $results[] = $this->measure($label, $declared['work'], $runs, (float) $declared['budget']);
        }

        if ($results === []) {
            $this->components->error('No resources are registered, so there is nothing to measure.');

            return self::FAILURE;
        }

        return $json ? $this->emitJson($results, $budget) : $this->emitTable($results, $budget);
    }

    /**
     * Put the named tenant into context, or explain why we cannot.
     *
     * Uses stancl when it is installed, because it is what actually switches
     * connections in database mode - setting a key ourselves would produce the
     * right constraint against the wrong database.
     */
    private function initialiseTenant(): bool
    {
        $context = app(TenantContext::class);
        $name = $this->option('tenant');

        if ($name === null) {
            // Already inside a tenant context - an Octane worker, a test, a
            // tinker session that initialised one. Nothing to do.
            if ($context->currentKey() !== null || ! $context->shouldScopeByColumn()) {
                return true;
            }

            $this->components->error(
                'No tenant is resolved, so every query would run unscoped. '
                .'Pass --tenant=<key> to choose one.'
            );

            return false;
        }

        if (! function_exists('tenancy')) {
            $this->components->error('--tenant needs stancl/tenancy installed.');

            return false;
        }

        $model = config('tenancy.tenant_model');
        $tenant = $model::query()->find($name)
            ?? $model::query()->where('slug', $name)->first();

        if ($tenant === null) {
            $this->components->error("No tenant matches [{$name}].");

            return false;
        }

        tenancy()->initialize($tenant);

        $this->components->info("Measuring tenant [{$name}].");

        return true;
    }

    /**
     * The query shapes every list page actually makes.
     *
     * DERIVED FROM THE RESOURCE, not written per application. A resource that
     * declares no search is not measured for search - a fabricated figure for a
     * thing the screen cannot do is worse than a gap in the table.
     *
     * @param  class-string  $class
     * @return array<string, Closure|SurfaceWork>
     */
    private function surfaces(string $class, Table $definition): array
    {
        $out = [
            'first page' => fn (): mixed => $this->page($class, $definition),
        ];

        // The count is measured separately because it is DEFERRED in the panel:
        // it never sits in front of the rows, so folding it into the page figure
        // would report a cost the user does not wait for.
        $out['total (deferred)'] = new SurfaceWork(
            // The list runs OUTSIDE the timed region. `data()` returns the rows
            // AND the unresolved total, so timing the whole call would charge the
            // count with the page's cost and report 2 queries for a 1-query
            // surface - which is what the first version of this command did.
            setup: fn (): mixed => $class::data($this->request(), $definition)->total,
            work: static fn (mixed $total): mixed => is_callable($total) ? $total() : $total,
        );

        foreach ($definition->getFilters() as $filter) {
            $sample = $this->sampleFor($filter);

            // NO REPRESENTATIVE VALUE MEANS NO ROW. A filter benchmarked with
            // `null` is not filtered at all - the panel discards the parameter
            // and the figure silently duplicates the unfiltered page. That is
            // exactly what happened here: the sampler called `resolveOptions()`,
            // which does not exist, got null for every filter, and produced four
            // rows of a measurement nobody had made.
            if ($sample === null) {
                continue;
            }

            // The value is in the LABEL, so a sample that matches nothing is
            // visible in the output instead of hiding inside a fast number.
            $out["filter: {$filter->key}={$sample}"] = fn (): mixed => $this->page(
                $class,
                $definition,
                [$filter->key => $sample],
            );

            // One filter is enough to prove the shape; measuring every filter on
            // every resource turns a benchmark into a test suite.
            break;
        }

        foreach ($definition->getColumns() as $column) {
            if ($column->isSortable()) {
                $out["sort: {$column->key}"] = fn (): mixed => $this->page(
                    $class,
                    $definition,
                    ['sort' => $column->resolvedSortKey(), 'direction' => 'asc'],
                );

                break;
            }
        }

        foreach ($definition->getColumns() as $column) {
            if ($column->isSearchable()) {
                $out['search (prefix)'] = fn (): mixed => $this->page($class, $definition, ['search' => 'a']);

                break;
            }
        }

        return $out;
    }

    /**
     * One list request, through the SAME entry point the controller uses.
     *
     * `Resource::data()` rather than a hand-built query, because a benchmark
     * that assembles its own query measures a query the application never makes
     * - and would keep reporting green after the real path grew an eager load or
     * lost an index hint.
     *
     * @param  class-string  $class
     * @param  array<string, mixed>  $query
     */
    private function page(string $class, Table $definition, array $query = []): mixed
    {
        return $class::data($this->request($query), $definition)->records;
    }

    /**
     * A request the panel's own code will accept.
     *
     * Bound into the container because `run()` and its filters reach for the
     * current request in places - leaving the console's empty request in there
     * would silently measure an unfiltered page.
     *
     * @param  array<string, mixed>  $query
     */
    private function request(array $query = []): Request
    {
        $request = Request::create('/', 'GET', $query);

        app()->instance('request', $request);

        return $request;
    }

    /**
     * A query-string value this filter will actually act on.
     *
     * Taken from the filter's OWN declared options, because a filter benchmarked
     * with a value that matches nothing measures an empty result set - which is
     * fast for the wrong reason and reads as a pass.
     *
     * Returns null when the filter has no single representative value. A date
     * range has no natural sample (any range invents a distribution), and
     * inventing one would measure a query the application never runs.
     */
    private function sampleFor(Filter $filter): ?string
    {
        if ($filter instanceof BooleanFilter) {
            return '1';
        }

        if ($filter instanceof HasOptions) {
            $options = $filter->resolvedOptions();

            if ($options === []) {
                return null;
            }

            $first = reset($options);
            $value = is_array($first) ? $first['value'] : $first;

            return $value === null ? null : (string) $value;
        }

        return null;
    }

    /**
     * Warm up, then time `$runs` times, and report the median.
     *
     * @return array{surface: string, ms: float, queries: int, samples: list<float>}
     */
    private function measure(string $surface, Closure|SurfaceWork $work, int $runs, float $budget): array
    {
        $setup = $work instanceof SurfaceWork ? $work->setup : static fn (): mixed => null;
        $run = $work instanceof SurfaceWork ? $work->work : static fn (mixed $_) => $work();

        // Discarded. See the class docblock - this is the run that measures the
        // caches rather than the application.
        $run($setup());

        $samples = [];

        for ($i = 0; $i < $runs; $i++) {
            // Setup is OUTSIDE the clock. It is the work a surface depends on
            // but does not pay for - the list a deferred count is resolved
            // against, which the user is already looking at by then.
            $state = $setup();

            $started = hrtime(true);

            $run($state);

            $samples[] = (hrtime(true) - $started) / 1_000_000;
        }

        // The query count is taken on its OWN run, because enabling the log
        // costs something and would be included in every timing above.
        $state = $setup();
        DB::flushQueryLog();
        DB::enableQueryLog();
        $run($state);
        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();

        sort($samples);

        return [
            'surface' => $surface,
            'ms' => round($samples[intdiv(count($samples), 2)], 2),
            // Carried with the measurement, so the verdict travels with the
            // number rather than being recomputed by whoever reads it.
            'budget' => $budget,
            'queries' => $queries,
            'samples' => array_map(static fn (float $s): float => round($s, 2), $samples),
        ];
    }

    /** @param list<array<string, mixed>> $results */
    private function emitTable(array $results, float $budget): int
    {
        $breached = [];

        $this->newLine();
        $this->components->info('Median of '.count($results[0]['samples']).' warm runs');

        /*
         * THE BUDGET IS A COLUMN NOW, because it is no longer one number. A
         * report that says "! 340 ms" without saying what was promised leaves
         * the reader to guess whether that is a regression or a screen that
         * always cost that.
         */
        $this->table(
            ['Surface', 'Median', 'Budget', 'Queries', 'Samples'],
            array_map(static function (array $r) use (&$breached): array {
                $over = $r['ms'] > $r['budget'];

                if ($over) {
                    $breached[] = $r['surface'];
                }

                return [
                    $r['surface'],
                    sprintf('%s%.2f ms', $over ? '! ' : '  ', $r['ms']),
                    sprintf('%.0f ms', $r['budget']),
                    $r['queries'],
                    implode(' / ', $r['samples']),
                ];
            }, $results),
        );

        if ($breached !== []) {
            $this->components->error(
                count($breached).' surface(s) over their budget: '
                .implode(', ', $breached)
            );

            // A NON-ZERO EXIT, so this can gate a build. A benchmark that always
            // succeeds is a report nobody reads.
            return self::FAILURE;
        }

        $this->components->info('Every surface is within its budget.');

        return self::SUCCESS;
    }

    /** @param list<array<string, mixed>> $results */
    private function emitJson(array $results, float $budget): int
    {
        $breached = array_values(array_filter(
            $results,
            static fn (array $r): bool => $r['ms'] > $r['budget'],
        ));

        $this->line((string) json_encode([
            // The command's DEFAULT. Each surface carries the budget it was
            // actually judged against, which may be its own.
            'defaultBudgetMs' => $budget,
            'runs' => count($results[0]['samples']),
            'surfaces' => $results,
            'breached' => array_column($breached, 'surface'),
        ], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));

        return $breached === [] ? self::SUCCESS : self::FAILURE;
    }
}
