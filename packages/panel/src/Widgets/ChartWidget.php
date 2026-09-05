<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Widgets;

use Closure;
use DateTimeImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Alxtexh\Panel\Support\Ability;
use RuntimeException;
use Throwable;

/**
 * A chart on the dashboard.
 *
 * Deliberately the same shape as StatWidget, and for the same reasons:
 *
 * 1. THE DATA IS A CLOSURE, resolved only when its deferred prop is requested,
 *    never at definition time (antipatterns §3.3).
 *
 * 2. A FAILURE IS CONTAINED. One chart whose query throws renders as one broken
 *    card; the other five still paint. `resolve()` does not propagate.
 *
 * 3. THE CLOSURE RECEIVES THE PERIOD. Charts are not point-in-time, so the
 *    window has to reach the query - a widget that resolves its own period
 *    internally cannot be re-asked for a different one, which is what the
 *    period selector does on every click.
 *
 * The TYPE is semantic (`line`, `pie`), never a class name or a colour. PHP
 * emitting presentation is antipatterns §6.1; the renderer owns how a line
 * looks, and a tenant theme therefore applies without touching this file.
 */
final class ChartWidget
{
    use CanPoll;
    use HasLayout;

    /*
     * `segments` is a single proportional bar rather than a plot - a limit or a
     * breakdown. It lives here rather than in its own widget class because the
     * declaration, the deferral and the failure isolation are identical; only
     * the renderer differs.
     *
     * `table` IS THE SAME REASONING APPLIED TO A ROW LIST - a "System status"
     * or "Customers" card is not a plot at all, but it wants the exact same
     * deferred-closure, one-failure-one-card, ability-gated shape every other
     * chart already has. Giving it its own widget class would mean duplicating
     * `resolve()`'s try/catch and `WidgetSet`'s aggregation for a difference
     * that is entirely in the renderer.
     *
     * `catalog` AND `items` ARE THAT AGAIN, FOR THINGS RATHER THAN METRICS.
     * A featured product, a vacant unit, a cart line — not a time series, but
     * they still want one deferred prop and one broken card. The payloads are
     * `['items' => [...]]`; the renderer chooses a grid of cards or a line list.
     */
    private const TYPES = [
        'line', 'area', 'steppedLine', 'multiAxis',
        'bar', 'horizontalBar', 'stackedBar', 'combo',
        'pie', 'doughnut', 'polarArea', 'radar',
        'rankedBar', 'heatmap', 'segments', 'table',
        'catalog', 'items',
        // Both axes measured rather than one being a category. `bubble` is
        // `scatter` with a size channel, the same way `doughnut` is `pie`.
        'scatter', 'bubble',
        // Developer toolkit: Leaflet map card and month schedule (v1.0.76+).
        'map', 'calendar',
        // Barcode strip and log tail (field/page already existed; widgets in v1.4.1+).
        'barcode', 'logtail',
    ];

    private string $type = 'line';

    private ?Closure $data = null;

    private ?Closure $trend = null;

    private ?string $description = null;

    private ?string $icon = null;

    private bool $periodSelector = false;

    private ?string $ability = null;

    private ?Closure $format = null;

    private ?int $ttl = null;

    /** @var list<class-string> */
    private array $invalidatedBy = [];

    /** @var list<array{max: int|float, color: string}> */
    private array $thresholds = [];

    private int|float|null $maxValue = null;

    private function __construct(public readonly string $key, private readonly string $label) {}

    public static function make(string $key, string $label): self
    {
        return new self($key, $label);
    }

    public function type(string $type): self
    {
        if (! in_array($type, self::TYPES, true)) {
            throw new InvalidArgumentException(
                "[{$type}] is not a chart type. Available: ".implode(', ', self::TYPES).'.'
            );
        }

        $this->type = $type;

        return $this;
    }

    /**
     * The series - or, for `type('table')`, the rows, or for `catalog`/`items`, the items.
     *
     * A `table` CHART RETURNS `['rows' => [...]]` INSTEAD OF POINTS. Each row is
     * `['key' => string, 'label' => string, 'value' => ?string, 'heading' => ?bool,
     * 'tone' => ?string, 'bar' => ?['segments' => [['label' => string, 'value' =>
     * int|float, 'tone' => ?string], ...], 'total' => ?int|float]]`. A heading
     * row is a subsection label, not a fact. `tone` is semantic
     * (`success`/`warning`/`danger`/`info`/`neutral`), never a colour - the
     * renderer owns what each one looks like, the same rule `thresholds()`
     * follows below.
     *
     * A `catalog` OR `items` CHART RETURNS `['items' => [...]]`. Each item is
     * `['key' => string, 'label' => string, 'caption' => ?string, 'image' => ?string,
     * 'price' => ?string, 'qty' => string|int|null, 'amount' => ?string,
     * 'detail' => ?string, 'status' => ?string, 'tone' => ?string, 'progress' =>
     * ?['value' => int|float, 'total' => ?int|float, 'tone' => ?string]]`. `status`
     * is a stored word (`paid`, `vacant`); `tone` overrides the built-in map.
     *
     * @param  Closure(Period): (array{points: list<array{label: string, value: int|float}>}|array{rows: list<array<string, mixed>>}|array{items: list<array<string, mixed>>}|list<array{label: string, value: int|float}>)  $data
     */
    public function data(Closure $data): self
    {
        $this->data = $data;

        return $this;
    }

    /**
     * The comparison against the preceding window.
     *
     * @param  Closure(Period): Trend  $trend
     */
    public function trend(Closure $trend): self
    {
        $this->trend = $trend;

        return $this;
    }

    public function description(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /** A semantic icon name the client already knows (`gauge`, `users`). */
    public function icon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    /** Show the today/7d/30d selector on this card. */
    public function withPeriods(bool $enabled = true): self
    {
        $this->periodSelector = $enabled;

        return $this;
    }

    /** Cache this chart per tenant and period, with an explicit invalidation contract. */
    public function cache(int $ttl): self
    {
        if ($ttl < 1) {
            throw new InvalidArgumentException('A chart cache TTL must be positive.');
        }

        $this->ttl = $ttl;

        return $this;
    }

    /** @param list<class-string> $events */
    public function invalidatedBy(array $events): self
    {
        $this->invalidatedBy = $events;

        return $this;
    }

    /**
     * Colour bars by their own value - a ranked "worst first" chart.
     *
     * Colours are SEMANTIC names (`danger`, `warning`), never CSS. The client
     * owns what danger looks like, so a tenant theme applies without touching
     * this declaration (§6.1).
     *
     * @param  array<int|float, string>  $thresholds  upper bound => tone
     */
    public function thresholds(array $thresholds, ?int $max = null): self
    {
        ksort($thresholds);

        $this->thresholds = array_map(
            static fn (int|float $bound, string $tone): array => ['max' => $bound, 'color' => $tone],
            array_keys($thresholds),
            array_values($thresholds),
        );

        $this->maxValue = $max;

        return $this;
    }

    /** @return array<string, mixed> The structure. Never runs a query. */
    /**
     * An ability required to SEE this widget at all, or null for everyone.
     *
     * PER WIDGET, BECAUSE A DASHBOARD IS NOT ONE SECRET. The question that
     * prompted this was exact: somebody needs the dashboard but must not see the
     * commercial figures. With visibility all-or-nothing the only answers were
     * "show them the revenue" or "take the dashboard away", and both are wrong
     * for a support rota that needs the connection counts.
     *
     * FILTERING HAPPENS BEFORE THE DEFERRED PROP IS REGISTERED, which is the
     * part that matters. Hiding a card in the browser leaves the number sitting
     * in the page payload for anybody who opens the network tab - and the query
     * still runs, so it is not even cheaper. A widget somebody may not see is
     * never computed.
     */
    public function ability(?string $ability): self
    {
        $this->ability = $ability;

        return $this;
    }

    /**
     * Whether `$user` may see this widget.
     *
     * NO ABILITY MEANS VISIBLE, and the default direction is deliberate. A
     * dashboard whose widgets default to hidden is a dashboard that silently
     * empties itself as widgets are added, and the symptom - a blank screen with
     * no error - reads as a broken page rather than a permissions decision.
     */
    public function visibleTo(mixed $user): bool
    {
        if ($this->ability === null) {
            return true;
        }

        /*
         * THROUGH `Ability`, because the guard this used to have was the wrong
         * one: `method_exists(...) && hasPermission(...)` returns FALSE on a
         * user model that does not define that method - which is every model
         * outside the reference application - so an ability-gated widget was
         * invisible to everybody rather than falling through to `can()`.
         * Silent, unlike the 500 the same assumption caused in the controllers.
         */
        return Ability::allows($user, $this->ability);
    }

    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'label' => $this->label,
            'type' => $this->type,
            'description' => $this->description,
            'icon' => $this->icon,
            'periods' => $this->periodSelector ? Period::options() : null,
            'thresholds' => $this->thresholds === [] ? null : $this->thresholds,
            'maxValue' => $this->maxValue,
            ...$this->layoutToArray(),
            ...$this->refreshToArray(),
        ];
    }

    /**
     * Resolve the series for `$period`. Never throws.
     *
     * @return array{
     *     points: list<array{label: string, value: int|float}>,
     *     series: list<array{name: string, points: list<array{label: string, value: int|float}>}>|null,
     *     rows: list<array<string, mixed>>|null,
     *     items: list<array<string, mixed>>|null,
     *     total: int|float|null,
     *     trend: array<string, mixed>|null,
     *     error: bool
     * }
     */
    public function resolve(Period $period, string $tenantKey, ?DateTimeImmutable $now = null): array
    {
        $empty = [
            'points' => [],
            'series' => null,
            'bars' => null,
            'lines' => null,
            'rows' => null,
            'items' => null,
            'barcodes' => null,
            'file' => null,
            'logLines' => null,
            'truncated' => null,
            'markers' => null,
            'center' => null,
            'zoom' => null,
            'events' => null,
            'total' => null,
            'trend' => null,
            'error' => true,
        ];

        if ($this->data === null) {
            return $empty;
        }

        try {
            if ($this->ttl !== null && $this->invalidatedBy === []) {
                throw new RuntimeException(
                    "Chart [{$this->key}] is cached but declares no invalidation events."
                );
            }

            $resolve = fn (): mixed => ($this->data)($period, $now);
            $resolved = $this->ttl === null
                ? $resolve()
                : Cache::remember(
                    "panel:chart:{$this->key}:{$tenantKey}:{$period->value}",
                    $this->ttl,
                    $resolve,
                );

            /*
             * A `table` CHART SHORT-CIRCUITS HERE. Rows are not points on any
             * axis, so none of the aggregation below applies to them - they
             * pass straight through, the same way a combo's `bars`/`lines`
             * skip the point-array branch two lines down.
             */
            if (array_key_exists('rows', $resolved)) {
                return [
                    'points' => [],
                    'series' => null,
                    'bars' => null,
                    'lines' => null,
                    'rows' => array_values($resolved['rows']),
                    'items' => null,
                    'barcodes' => null,
                    'file' => null,
                    'logLines' => null,
                    'truncated' => null,
                    'total' => null,
                    'trend' => null,
                    'error' => false,
                ];
            }

            /*
             * `catalog` / `items` SHORT-CIRCUIT THE SAME WAY. They are not
             * points on an axis; aggregating them as a series would invent a
             * total nobody asked for and drop the fields the tiles need.
             */
            if (array_key_exists('items', $resolved)) {
                return [
                    'points' => [],
                    'series' => null,
                    'bars' => null,
                    'lines' => null,
                    'rows' => null,
                    'items' => array_values($resolved['items']),
                    'barcodes' => null,
                    'file' => null,
                    'logLines' => null,
                    'truncated' => null,
                    'total' => null,
                    'trend' => null,
                    'error' => false,
                ];
            }

            // Map / calendar cards carry their own shape, not plot points.
            if (array_key_exists('markers', $resolved) || array_key_exists('events', $resolved)) {
                return [
                    'points' => [],
                    'series' => null,
                    'bars' => null,
                    'lines' => null,
                    'rows' => null,
                    'items' => null,
                    'barcodes' => null,
                    'file' => null,
                    'logLines' => null,
                    'truncated' => null,
                    'markers' => isset($resolved['markers']) ? array_values((array) $resolved['markers']) : null,
                    'center' => $resolved['center'] ?? null,
                    'zoom' => $resolved['zoom'] ?? null,
                    'events' => isset($resolved['events']) ? array_values((array) $resolved['events']) : null,
                    'total' => null,
                    'trend' => null,
                    'error' => false,
                ];
            }

            if (array_key_exists('barcodes', $resolved)) {
                return [
                    'points' => [],
                    'series' => null,
                    'bars' => null,
                    'lines' => null,
                    'rows' => null,
                    'items' => null,
                    'barcodes' => array_values((array) $resolved['barcodes']),
                    'file' => null,
                    'logLines' => null,
                    'truncated' => null,
                    'total' => null,
                    'trend' => null,
                    'error' => false,
                ];
            }

            if (array_key_exists('lines', $resolved) && ($this->type === 'logtail' || array_key_exists('file', $resolved))) {
                return [
                    'points' => [],
                    'series' => null,
                    'bars' => null,
                    'lines' => null,
                    'rows' => null,
                    'items' => null,
                    'barcodes' => null,
                    'file' => isset($resolved['file']) ? (string) $resolved['file'] : null,
                    'logLines' => array_values((array) $resolved['lines']),
                    'truncated' => (bool) ($resolved['truncated'] ?? false),
                    'total' => null,
                    'trend' => null,
                    'error' => false,
                ];
            }

            /*
             | THREE PAYLOAD SHAPES, all accepted.
             |
             |   ['points' => [...]]           a TimeSeries envelope
             |   [ {label,value}, … ]          a categorical list
             |   ['series' => [...]]           several named datasets
             |   ['bars' => …, 'lines' => …]   a combo
             |
             | A multi-series chart genuinely has no single `points` list, and
             | forcing one would mean flattening datasets the renderer has to
             | pull apart again - losing which value belonged to which series.
             */
            $series = $resolved['series'] ?? null;
            $bars = $resolved['bars'] ?? null;
            $lines = $resolved['lines'] ?? null;
            $isMulti = $series !== null || $bars !== null;

            $points = $isMulti ? [] : ($resolved['points'] ?? $resolved);
            $total = $resolved['total'] ?? ($isMulti ? null : array_sum(array_column($points, 'value')));

            return [
                'points' => array_values($points),
                'series' => $series,
                'bars' => $bars,
                'lines' => $lines,
                'rows' => null,
                'items' => null,
                'barcodes' => null,
                'file' => null,
                'logLines' => null,
                'truncated' => null,
                'total' => $total,
                'trend' => $this->trend !== null ? ($this->trend)($period, $now)->toArray() : null,
                'error' => false,
            ];
        } catch (Throwable $e) {
            // Widget resolution is also usable in schema/unit contexts where
            // Laravel's logging binding has not been booted yet. A rendering
            // failure should still become the typed empty payload, never a
            // second exception while trying to report the first one.
            if (function_exists('app') && app()->bound('log')) {
                Log::error('Panel chart failed to resolve.', [
                    'component' => 'ChartWidget',
                    'operation' => 'resolve',
                    'widget' => $this->key,
                    'period' => $period->value,
                    'tenant' => $tenantKey,
                    'exception' => $e->getMessage(),
                ]);
            }

            return $empty;
        }
    }
}
