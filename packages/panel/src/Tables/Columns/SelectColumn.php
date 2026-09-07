<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Columns;

use InvalidArgumentException;

/**
 * An enum changed directly in the row.
 *
 * THE OPTION LIST IS THE VALIDATION RULE. `castValue()` rejects anything not in
 * it, so the same declaration that draws the dropdown is what a forged request
 * is checked against - there is no second list to forget to update. Most enum
 * columns are plain strings in the database with no CHECK constraint behind
 * them, so without this a crafted request writes `status = 'anything'` and the
 * row becomes unfilterable and unroutable for the rest of its life.
 *
 * OPTIONS ARE A LITERAL ARRAY, NOT A CLOSURE - deliberately narrower than
 * SelectField. A closure here would be tenant data, which cannot live in the
 * cached schema (addendum Part A), and it would run per render. An editable
 * cell is for a short fixed enum; picking from a relation is a job for the edit
 * page, where a searchable field can do it properly.
 */
final class SelectColumn extends EditableColumn
{
    /** @var array<string|int, string> value => label */
    private array $options = [];

    /** @var array<string|int, string> value => semantic colour */
    private array $colors = [];

    public function type(): string
    {
        return 'select';
    }

    /**
     * @param  array<string, string>|list<string>  $options
     */
    public function options(array $options): self
    {
        // A list becomes a map keyed by its own values, so
        // ->options(['active', 'expired']) works like the filters do.
        $this->options = array_is_list($options)
            ? array_combine($options, array_map(
                static fn (string $o): string => str($o)->headline()->value(),
                $options,
            ))
            : $options;

        return $this;
    }

    /** @param array<string|int, string> $colors */
    public function colors(array $colors): self
    {
        $this->colors = $colors;

        return $this;
    }

    public function castValue(mixed $value): string
    {
        $value = is_scalar($value) ? (string) $value : '';

        if (! array_key_exists($value, $this->options)) {
            throw new InvalidArgumentException("[{$value}] is not an allowed option for [{$this->key}].");
        }

        return $value;
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            ...parent::toArray(),
            'options' => $this->options,
            'colors' => $this->colors,
        ];
    }
}
