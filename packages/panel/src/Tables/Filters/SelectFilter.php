<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Filters;

use Closure;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use InvalidArgumentException;

/**
 * Single-choice equality filter backed by an allowlist.
 *
 * The allowlist is the security boundary, not a convenience. A submitted value
 * that is not in it is discarded rather than passed to the query - which matters
 * most when the options are data-derived (Routers' hardware models), because the
 * options are resolved from a TENANT-SCOPED query. That makes a crafted value
 * unable to confirm whether another tenant owns equipment you do not.
 */
final class SelectFilter extends Filter implements HasOptions
{
    /**
     * @var array<int|string, string|array{value: string, label: string}>|Closure(): array<int|string, string|array{value: string, label: string}>
     */
    private array|Closure $options = [];

    /**
     * Resolved options, memoized for the lifetime of this instance.
     *
     * The closure was being invoked THREE times per request: once by
     * normalise() validating the submitted value, once by toArray() building
     * the filter schema, and once by resolveFilterOptions() assembling the data
     * payload. For a data-derived filter that is three identical DISTINCT
     * queries where one will do.
     *
     * Instance state, not static - filters are rebuilt per request from the
     * resource definition, so this cannot outlive a request or leak a tenant's
     * options into another's (S9).
     *
     * @var list<string|array{value: string, label: string}>|null
     */
    private ?array $resolved = null;

    /**
     * @param  array<int|string, string|array{value: string, label: string}>|Closure(): array<int|string, string|array{value: string, label: string}>  $options
     */
    public function options(array|Closure $options): static
    {
        $this->options = $options;

        return $this;
    }

    /**
     * Options from a related Eloquent model (BelongsTo-style FK filter).
     *
     * Filament-shaped. Values are primary keys (as strings); labels are
     * `$titleAttribute`. Works with keyset lists: the filter only adds a
     * WHERE on the declared column.
     *
     *     SelectFilter::make('article_id')
     *         ->relationship(Article::class, 'title');
     *
     * @param  class-string<Model>  $model
     * @param  Closure(EloquentBuilder<Model>): void|null  $modifyQuery
     */
    public function relationship(string $model, string $titleAttribute, ?Closure $modifyQuery = null): static
    {
        if (! is_subclass_of($model, Model::class)) {
            throw new InvalidArgumentException("[{$model}] is not an Eloquent model.");
        }

        return $this->options(function () use ($model, $titleAttribute, $modifyQuery): array {
            /** @var Model $blank */
            $blank = new $model;
            $keyName = $blank->getKeyName();

            $query = $model::query()->orderBy($titleAttribute);

            if ($modifyQuery !== null) {
                $modifyQuery($query);
            }

            return array_values($query
                ->get([$keyName, $titleAttribute])
                ->map(static fn (Model $row): array => [
                    'value' => (string) $row->getKey(),
                    'label' => (string) $row->getAttribute($titleAttribute),
                ])
                ->all());
        });
    }

    /** @return list<string|array{value: string, label: string}> */
    public function resolvedOptions(): array
    {
        if ($this->resolved !== null) {
            return $this->resolved;
        }

        $options = $this->options instanceof Closure ? ($this->options)() : $this->options;

        /*
         * NORMALISED HERE, NOT REJECTED. `SelectField::options()` takes a
         * `value => label` map - the natural shape to reach for, since it is
         * the SAME method name on a sibling class in the same package, it is
         * what every documented example in docs/04-columns-and-filters.md
         * shows, and it is the shape Laravel/Filament convention trains a
         * developer to expect. This class used to throw on that shape instead
         * of accepting it, because passing the raw map straight through to
         * `json_encode` turns the string keys into a JS OBJECT, and the
         * client's `(filter.options ?? []).map(...)` would throw
         * "options.map is not a function" - a crash in a browser console,
         * days after the typo that caused it. Rather than force every
         * developer who reaches for the natural shape into an unusual list
         * format, normalise the map into the list-of-{value,label} shape this
         * class has always required internally: the ambiguity concern (an
         * associative map has no unambiguous "the value side" for a security
         * allowlist) does not apply once every key is treated as an allowed
         * value and every value as its label, which is exactly what the map
         * form means.
         */
        if ($options !== [] && ! array_is_list($options)) {
            /*
             * A FOREACH, NOT `array_map` OVER `array_keys()`/`array_values()`.
             * Both express the same loop, but the two-array form loses the
             * per-element pairing between a key and ITS OWN value once they
             * pass through separate `array_keys()`/`array_values()` calls -
             * the declared element type stays the full `string|array{value,
             * label}` union `options()` accepts, with no way to tell the
             * checker that a map's own values are always the label half.
             * Reading `$label` here, element by element, keeps that pairing
             * so `is_string($label)` narrows THIS element only.
             */
            $normalised = [];

            foreach ($options as $value => $label) {
                $normalised[] = [
                    'value' => (string) $value,
                    'label' => is_string($label) ? $label : $label['label'],
                ];
            }

            $options = $normalised;
        }

        return $this->resolved = $options;
    }

    /** @return list<string> */
    public function allowedValues(): array
    {
        $values = [];

        foreach ($this->resolvedOptions() as $option) {
            $values[] = is_array($option)
                ? (string) $option['value']
                : (string) $option;
        }

        return array_values(array_filter($values, static fn (string $v): bool => $v !== ''));
    }

    public function normalise(mixed $raw): ?string
    {
        if (is_int($raw) || is_float($raw)) {
            $raw = (string) $raw;
        }

        if (! is_string($raw)) {
            return null;
        }

        return in_array($raw, $this->allowedValues(), true) ? $raw : null;
    }

    public function apply(Builder $query, mixed $value): void
    {
        $query->where($this->resolvedColumn(), $value);
    }

    protected function schemaType(): string
    {
        return 'select';
    }

    protected function displayValue(mixed $value): string
    {
        foreach ($this->resolvedOptions() as $option) {
            if (is_array($option) && (string) $option['value'] === (string) $value) {
                return $option['label'];
            }
        }

        return parent::displayValue($value);
    }

    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'label' => $this->resolvedLabel(),
            'type' => 'select',
            'options' => $this->resolvedOptions(),
        ];
    }
}
