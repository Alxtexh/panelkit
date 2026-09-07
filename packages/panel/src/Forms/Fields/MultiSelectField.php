<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms\Fields;

use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/**
 * A field holding SEVERAL values from a fixed list.
 *
 * THE OPTION LIST IS THE VALIDATION RULE, exactly as it is for SelectField:
 * every submitted value must be one of the declared options. Without that a
 * multi-select is a way to write an arbitrary array into a column, and the
 * column is usually JSON with no constraint of its own to catch it.
 *
 * THE VALIDATION IS TWO RULES, not one. `array` guards the field itself and
 * `key.*` guards each MEMBER - a rule set that only validates the array accepts
 * `['active', 'anything']` because the array is, indeed, an array. That is the
 * mistake this field exists to make impossible to repeat.
 *
 * Options may be a closure, resolved when the data payload is assembled and
 * never while building the cached schema - a tenant's routers are tenant data
 * (addendum Part A) and a definition-time query takes the page down for
 * everyone (antipatterns §3.3).
 */
final class MultiSelectField extends Field
{
    private string $optionAttribute = 'name';

    /** @var array<string|int, string>|Closure|null */
    private array|Closure|null $options = null;

    private ?int $max = null;

    /**
     * Turn whatever the record holds into option values.
     *
     * A MANY-TO-MANY FIELD READS A RELATION, and a relation returns MODELS. The
     * base implementation passes the value through untouched, so the form
     * received a Collection of `Role` objects and the browser rendered each one
     * as `[object Object]` - a control that cannot show what is selected and
     * therefore cannot be trusted to save it either.
     *
     * MAPPED TO THE SAME KEY THE OPTIONS USE, which is what makes the token
     * match an entry in the list. `optionAttribute` names it, defaulting to
     * `name`: options are usually `name => label` for a relation, and a field
     * whose options are keyed by id can say so.
     *
     * Scalars and plain arrays pass through unchanged, so a multiselect over a
     * JSON column behaves exactly as before.
     */
    public function presentValue(mixed $value): mixed
    {
        if ($value instanceof Collection) {
            return $value
                ->map(fn (mixed $item): mixed => $item instanceof Model
                    ? $item->getAttribute($this->optionAttribute)
                    : $item)
                ->values()
                ->all();
        }

        return $value;
    }

    /**
     * Which attribute of a related model the options are keyed by.
     *
     * `name` covers the ordinary case. An id-keyed option list declares it.
     */
    public function optionAttribute(string $attribute): self
    {
        $this->optionAttribute = $attribute;

        return $this;
    }

    public function type(): string
    {
        return 'multiselect';
    }

    /** @param array<string|int, string>|Closure $options */
    public function options(array|Closure $options): self
    {
        $this->options = $options;

        return $this;
    }

    /** Cap how many may be chosen. */
    public function max(int $max): self
    {
        $this->max = $max;

        return $this;
    }

    /**
     * The raw value => label map. The ONLY place the closure runs.
     *
     * @return array<string|int, string>
     */
    private function optionMap(): array
    {
        return $this->options instanceof Closure ? (array) ($this->options)() : ($this->options ?? []);
    }

    /**
     * Options in the transport shape every other field uses.
     *
     * Same shape as SelectField, so the client renders one control for both and
     * a field type is never a special case in the form renderer.
     *
     * @return list<array{value: mixed, label: string}>
     */
    public function resolveOptions(): array
    {
        $out = [];

        foreach ($this->optionMap() as $value => $label) {
            $out[] = ['value' => $value, 'label' => (string) $label];
        }

        return $out;
    }

    /** @return list<mixed> */
    protected function typeRules(): array
    {
        return array_values(array_filter([
            'array',
            $this->max !== null ? "max:{$this->max}" : null,
        ]));
    }

    /**
     * EVERY MEMBER, not just the array.
     *
     * `['active', 'god_mode']` satisfies an `array` rule perfectly well - the
     * array is an array. Only a rule on `key.*` looks inside it.
     *
     * @return array<string, list<mixed>>
     */
    public function additionalRules(): array
    {
        $keys = array_map(static fn (int|string $k): string => (string) $k, array_keys($this->optionMap()));

        return ["{$this->key}.*" => $keys === [] ? ['string'] : ['in:'.implode(',', $keys)]];
    }

    /** @return array<string, mixed> Structure only; never resolves options. */
    public function toSchema(): array
    {
        return [
            ...parent::toSchema(),
            'multiple' => true,
            'max' => $this->max,
        ];
    }
}
