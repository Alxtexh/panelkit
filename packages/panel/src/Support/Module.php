<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Closure;
use InvalidArgumentException;

/**
 * One product module a SaaS panel may sell access to.
 *
 * Register on the panel (arrays still work):
 *
 *     Panel::make('admin')->modules([
 *         Module::make('accounting')->label('Accounting')->children(['double-entry']),
 *         Module::make('double-entry')->label('Double entry')->requires(['accounting']),
 *         Module::make('campaigns')
 *             ->label('Campaigns')
 *             ->planLimit(kind: 'number')
 *             ->usage(fn (): int => Campaign::query()->count()),
 *     ]);
 *
 * Then set `ModuleRegistry::grants()` from the subscriber plan. Without
 * grants(), every registered module is treated as enabled.
 */
final class Module
{
    private ?string $label = null;

    private ?string $description = null;

    private ?string $limitKind = null;

    private ?string $limitLabel = null;

    private float|int|null $limitStep = null;

    private ?string $limitHint = null;

    private ?Closure $usage = null;

    /** @var list<string> */
    private array $children = [];

    /** @var list<string> */
    private array $requires = [];

    private ?Closure $onGrant = null;

    private function __construct(private readonly string $key) {}

    public static function make(string $key): self
    {
        return new self($key);
    }

    public function label(string $label): self
    {
        $this->label = $label;

        return $this;
    }

    public function description(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * How this module appears in the plan editor's perks column.
     *
     * `number` is a cap (-1 = Unlimited). `toggle` is included or not.
     *
     * @param  string  $kind
     */
    public function planLimit(string $kind = 'number', ?string $label = null, float|int|null $step = null, ?string $hint = null): self
    {
        if (! in_array($kind, ['number', 'toggle'], true)) {
            throw new InvalidArgumentException("planLimit kind must be 'number' or 'toggle', got [{$kind}].");
        }

        $this->limitKind = $kind;
        $this->limitLabel = $label;
        $this->limitStep = $step;
        $this->limitHint = $hint;

        return $this;
    }

    /** @param  Closure(): (int|float)  $usage */
    public function usage(Closure $usage): self
    {
        $this->usage = $usage;

        return $this;
    }

    /**
     * Child module keys that only make sense when this parent is granted.
     *
     * `ModuleRegistry::enabled($child)` is false unless every parent is also
     * in the grant list. Declaring children here is enough; the child may also
     * call `requires()`.
     *
     * @param  list<string>  $keys
     */
    public function children(array $keys): self
    {
        $this->children = array_values(array_unique(array_map('strval', $keys)));

        return $this;
    }

    /**
     * Parent keys that must be granted before this module is enabled.
     *
     * @param  list<string>  $keys
     */
    public function requires(array $keys): self
    {
        $this->requires = array_values(array_unique(array_map('strval', $keys)));

        return $this;
    }

    /**
     * Called once when this key is newly present in `ModuleRegistry::applyGrants()`.
     *
     * PlanSetupPage::save() calls that hook after expanding required parents.
     * Apps that persist plans themselves should call `applyGrants()` too.
     *
     * @param  Closure(mixed): void  $callback
     */
    public function onGrant(Closure $callback): self
    {
        $this->onGrant = $callback;

        return $this;
    }

    public function key(): string
    {
        return $this->key;
    }

    /**
     * @return array{
     *     key: string,
     *     label: string,
     *     description: string|null,
     *     limitKind: string|null,
     *     limitLabel: string|null,
     *     limitStep: float|int|null,
     *     limitHint: string|null,
     *     usage: Closure|null,
     *     children: list<string>,
     *     requires: list<string>,
     *     onGrant: Closure|null
     * }
     */
    public function toDefinition(): array
    {
        return [
            'key' => $this->key,
            'label' => $this->label ?? str($this->key)->headline()->value(),
            'description' => $this->description,
            'limitKind' => $this->limitKind,
            'limitLabel' => $this->limitLabel,
            'limitStep' => $this->limitStep,
            'limitHint' => $this->limitHint,
            'usage' => $this->usage,
            'children' => $this->children,
            'requires' => $this->requires,
            'onGrant' => $this->onGrant,
        ];
    }
}
