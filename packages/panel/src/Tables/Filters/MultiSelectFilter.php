<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Filters;

use Closure;
use Illuminate\Database\Query\Builder;

/**
 * Multiple values at once: status IN (expired, suspended).
 *
 * The single-select filter cannot express the most common real question an
 * operator has - "show me everything that is not healthy" - so they filtered
 * twice and compared by eye.
 *
 * Every submitted value is checked against the allowlist INDIVIDUALLY and the
 * unknown ones dropped, rather than rejecting the whole filter. A stale
 * bookmarked URL then still does something sensible instead of silently showing
 * an unfiltered list.
 */
final class MultiSelectFilter extends Filter implements HasOptions
{
    /** @var list<string>|Closure(): list<string> */
    private array|Closure $options = [];

    /** @var list<string>|null */
    private ?array $resolved = null;

    /** @param list<string>|Closure(): list<string> $options */
    public function options(array|Closure $options): static
    {
        $this->options = $options;

        return $this;
    }

    /** @return list<string> */
    public function resolvedOptions(): array
    {
        return $this->resolved ??= ($this->options instanceof Closure ? ($this->options)() : $this->options);
    }

    /**
     * @return list<string>|null
     */
    public function normalise(mixed $raw): ?array
    {
        // Arrives as a comma-joined string so the URL stays readable and
        // shareable - ?status=expired,suspended rather than status[]=… twice.
        $values = is_array($raw) ? $raw : (is_string($raw) && $raw !== '' ? explode(',', $raw) : []);

        $allowed = array_values(array_intersect($values, $this->resolvedOptions()));

        return $allowed === [] ? null : $allowed;
    }

    public function apply(Builder $query, mixed $value): void
    {
        $query->whereIn($this->resolvedColumn(), (array) $value);
    }

    public function toQueryValue(mixed $value): string
    {
        return implode(',', (array) $value);
    }

    protected function schemaType(): string
    {
        return 'multiselect';
    }

    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'label' => $this->resolvedLabel(),
            'type' => 'multiselect',
            'options' => $this->resolvedOptions(),
        ];
    }
}
