<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Columns;

use InvalidArgumentException;

/**
 * A value rendered as a badge, coloured by a SEMANTIC name.
 *
 * `->colors(['active' => 'success'])` maps a value to an intent, never to a CSS
 * class. Vue owns what "success" looks like - antipatterns §6.1 makes that a
 * hard boundary, because a class string authored in PHP is invisible to the CSS
 * scanner and gets purged without an error.
 *
 * The map is a plain array, not a closure: it must serialise into the cached
 * schema, and a closure cannot. Anything genuinely dynamic belongs in the data
 * payload rather than the schema.
 *
 * A RESOLVER IS OPT-IN. A badge is display by default. `->resolver()` (or
 * `->inlineUpdate()`) turns the pill into a shortcut: click it, pick from the
 * same colour-keyed options, PATCH the cell. Without that call the column is
 * not writable, even though it looks like a status.
 */
final class BadgeColumn extends Column implements InlineWritableColumn
{
    /** @var array<string|int, string> value => semantic intent */
    private array $colors = [];

    private string $default = 'neutral';

    /** @var array<string|int, string> */
    private array $labels = [];

    private bool $resolver = false;

    /** @var array<string|int, string> value => label, when the picker is on */
    private array $options = [];

    /** @param array<string|int, string> $colors */
    public function colors(array $colors): static
    {
        $this->colors = $colors;

        return $this;
    }

    /**
     * What each value READS as, when the stored value is not the words.
     *
     * A boolean column has no text of its own - `1` and `0` are not labels -
     * and the client used to fall back to the column's own label for true and
     * "not <label>" for false. That worked only while the label happened to be
     * an adjective: renaming the column to "Status" made every active row read
     * "Status" and every retired one "Not status".
     *
     * Saying it explicitly removes the guess, and lets false be "Retired"
     * rather than the negation of whatever the heading says.
     *
     * @param  array<string|int, string>  $labels
     */
    public function labels(array $labels): static
    {
        $this->labels = $labels;

        return $this;
    }

    public function defaultColor(string $intent): static
    {
        $this->default = $intent;

        return $this;
    }

    /**
     * Click the badge to change the value without opening the record.
     *
     * OFF BY DEFAULT. The option list is the validation rule, same as
     * SelectColumn: a forged request cannot write a status the column never
     * named. Options default to the colour map's keys (headlined), or an
     * explicit `->options()` / `->labels()` map.
     */
    public function resolver(bool $on = true): static
    {
        $this->resolver = $on;

        return $this;
    }

    /** Alias of `resolver()`. */
    public function inlineUpdate(bool $on = true): static
    {
        return $this->resolver($on);
    }

    /**
     * @param  array<string, string>|list<string>  $options
     */
    public function options(array $options): static
    {
        $this->options = array_is_list($options)
            ? array_combine($options, array_map(
                static fn (string $o): string => str($o)->headline()->value(),
                $options,
            ))
            : $options;

        return $this;
    }

    public function isResolver(): bool
    {
        return $this->resolver;
    }

    public function isInlineWritable(): bool
    {
        return $this->resolver;
    }

    public function castValue(mixed $value): string
    {
        $value = is_scalar($value) ? (string) $value : '';

        if (! array_key_exists($value, $this->resolvedOptions())) {
            throw new InvalidArgumentException("[{$value}] is not an allowed option for [{$this->key}].");
        }

        return $value;
    }

    public function writableColumn(): string
    {
        $column = $this->resolvedDatabaseColumn() ?? $this->key;

        return str_contains($column, '.') ? substr($column, (int) strrpos($column, '.') + 1) : $column;
    }

    public function type(): string
    {
        return 'badge';
    }

    public function toArray(): array
    {
        $payload = array_filter([
            ...parent::toArray(),
            'colors' => $this->colors,
            'defaultColor' => $this->default,
            'labels' => $this->labels === [] ? null : $this->labels,
        ], static fn (mixed $v): bool => $v !== null);

        if (! $this->resolver) {
            return $payload;
        }

        $options = $this->resolvedOptions();

        if ($options === []) {
            throw new InvalidArgumentException(
                "BadgeColumn [{$this->key}] cannot resolve without options or a colour map.",
            );
        }

        return [
            ...$payload,
            'resolver' => true,
            'editable' => true,
            'options' => $options,
        ];
    }

    /** @return array<string, string> */
    private function resolvedOptions(): array
    {
        if ($this->options !== []) {
            $out = [];

            foreach ($this->options as $value => $label) {
                $out[(string) $value] = $label;
            }

            return $out;
        }

        $keys = array_keys($this->colors);

        if ($keys === []) {
            $keys = array_keys($this->labels);
        }

        $out = [];

        foreach ($keys as $value) {
            $key = (string) $value;
            $out[$key] = $this->labels[$value] ?? $this->labels[$key] ?? str($key)->headline()->value();
        }

        return $out;
    }
}
