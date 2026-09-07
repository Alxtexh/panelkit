<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Widgets;

use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Alxtexh\Panel\Support\Ability;
use RuntimeException;
use Throwable;

/**
 * A single number on the dashboard.
 *
 * THREE RULES, each from a real incident:
 *
 * 1. THE VALUE IS A CLOSURE, resolved only when the deferred prop is requested.
 *    antipatterns §3.3: three eager `->options(...)` calls in definitions took a
 *    page down for every tenant, because definitions evaluate at render time.
 *
 * 2. A WIDGET FAILURE DEGRADES THAT WIDGET ONLY. One broken query must not take
 *    the dashboard down - the operator directive after that incident was
 *    literally "even if the user has no router just show the pages". A failed
 *    widget returns an error state and the other five still render.
 *
 * 3. A CACHED VALUE MUST NAME ITS INVALIDATION EVENTS. antipatterns §4.1: in
 *    billing, accuracy beats caching, and TTL is a self-healing backstop rather
 *    than the mechanism. A cache with no invalidation path is a bug, so
 *    `cache()` without `invalidatedBy()` throws rather than shipping.
 */
final class StatWidget
{
    use CanPoll;
    use HasLayout;

    private ?Closure $value = null;

    private ?Closure $trend = null;

    private ?Closure $sparkline = null;

    private ?string $description = null;

    private ?int $ttl = null;

    /** @var list<class-string> */
    private array $invalidatedBy = [];

    private ?string $ability = null;

    private function __construct(public readonly string $key, private string $label) {}

    public static function make(string $key, string $label): self
    {
        return new self($key, $label);
    }

    /** @param Closure(): (int|string) $value */
    public function value(Closure $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function description(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * A comparison against the preceding window: "▲ 4% vs previous 30 days".
     *
     * Resolved in the SAME deferred pass as the value, not as a second prop.
     * Splitting them would let a card paint its number and then visibly grow a
     * second line under it, which is the layout shift §10 puts at zero.
     *
     * @param  Closure(): Trend  $trend
     */
    public function trend(Closure $trend): self
    {
        $this->trend = $trend;

        return $this;
    }

    /**
     * The miniature series drawn behind the number.
     *
     * @param  Closure  $sparkline
     */
    public function sparkline(Closure $sparkline): self
    {
        $this->sparkline = $sparkline;

        return $this;
    }

    /** TTL is a backstop for a missed invalidation, never the mechanism. */
    public function cache(int $ttl): self
    {
        $this->ttl = $ttl;

        return $this;
    }

    /** @param list<class-string> $events */
    public function invalidatedBy(array $events): self
    {
        $this->invalidatedBy = $events;

        return $this;
    }

    /** @return array<string, mixed> */
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

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'label' => $this->label,
            'description' => $this->description,
            ...$this->layoutToArray(),
            ...$this->refreshToArray(),
        ];
    }

    /**
     * Resolve the value. Never throws - a broken widget reports itself.
     *
     * The trend and sparkline resolve in their OWN try blocks, so a broken
     * decoration cannot take down the number it decorates. Wrapping all three
     * together would mean a failed sparkline query blanks a working counter,
     * which inverts the importance of the two.
     *
     * @return array{
     *     value: int|string|null,
     *     trend: array<string, mixed>|null,
     *     sparkline: list<array{label: string, value: int|float}>|null,
     *     error: bool
     * }
     */
    public function resolve(string $tenantKey): array
    {
        $value = $this->resolveValue($tenantKey);

        return [
            ...$value,
            'trend' => $value['error'] ? null : $this->resolveSafely($this->trend, 'trend', $tenantKey)?->toArray(),
            'sparkline' => $value['error'] ? null : $this->resolveSparkline($tenantKey),
        ];
    }

    /**
     * @return list<array{label: string, value: int|float}>|null
     */
    private function resolveSparkline(string $tenantKey): ?array
    {
        $resolved = $this->resolveSafely($this->sparkline, 'sparkline', $tenantKey);

        if ($resolved === null) {
            return null;
        }

        return array_values($resolved['points'] ?? $resolved);
    }

    /**
     * Run one optional closure, reporting a failure without raising it.
     */
    private function resolveSafely(?Closure $closure, string $part, string $tenantKey): mixed
    {
        if ($closure === null) {
            return null;
        }

        try {
            return $closure();
        } catch (Throwable $e) {
            Log::error('Panel widget decoration failed to resolve.', [
                'component' => 'StatWidget',
                'operation' => $part,
                'widget' => $this->key,
                'tenant' => $tenantKey,
                'exception' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /** @return array{value: int|string|null, error: bool} */
    private function resolveValue(string $tenantKey): array
    {
        if ($this->value === null) {
            return ['value' => null, 'error' => true];
        }

        if ($this->ttl !== null && $this->invalidatedBy === []) {
            throw new RuntimeException(
                "Widget [{$this->key}] is cached but declares no invalidation events. "
                .'A cache with no invalidation path is a bug, not an optimisation.'
            );
        }

        try {
            $resolve = $this->value;

            if ($this->ttl === null) {
                return ['value' => $resolve(), 'error' => false];
            }

            // The tenant is part of the key AND the builder cannot read ambient
            // state - antipatterns §1.4, where a deferred rebuild lost tenancy
            // and wrote one tenant's answer into every tenant's cache entry.
            $key = "panel:widget:{$this->key}:{$tenantKey}";

            return ['value' => Cache::remember($key, $this->ttl, $resolve), 'error' => false];
        } catch (Throwable $e) {
            // Loudly, never swallowed. No bare empty catch exists in this package.
            Log::error('Panel widget failed to resolve.', [
                'component' => 'StatWidget',
                'operation' => 'resolve',
                'widget' => $this->key,
                'tenant' => $tenantKey,
                'exception' => $e->getMessage(),
            ]);

            return ['value' => null, 'error' => true];
        }
    }
}
