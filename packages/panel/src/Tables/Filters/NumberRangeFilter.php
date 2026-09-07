<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Filters;

use Illuminate\Database\Query\Builder;

/**
 * A numeric from–to filter, as `min..max` in the query string.
 *
 * THE SAME SHAPE AS `DateRangeFilter`'s explicit pair, without presets: rent,
 * price, beds, a count. Either bound may be empty (`100..` or `..500`). A
 * value that is not numeric is ignored rather than applied — the query string
 * is attacker-controlled, and `1e999` is not a rent.
 *
 * Not offered as a Query Builder field. That editor is typed from the sibling
 * filters' kinds, and adding a third range flavour there is a rewrite this
 * filter does not need.
 */
final class NumberRangeFilter extends Filter
{
    /** @return array{from: float|int|null, to: float|int|null}|null */
    public function normalise(mixed $raw): ?array
    {
        if (is_array($raw)) {
            $from = $this->number($raw['from'] ?? $raw[0] ?? null);
            $to = $this->number($raw['to'] ?? $raw[1] ?? null);
        } elseif (is_string($raw) && $raw !== '' && str_contains($raw, '..')) {
            [$fromRaw, $toRaw] = array_pad(explode('..', $raw, 2), 2, '');
            $from = $this->number($fromRaw);
            $to = $this->number($toRaw);
        } else {
            return null;
        }

        if ($from === null && $to === null) {
            return null;
        }

        if ($from !== null && $to !== null && $from > $to) {
            [$from, $to] = [$to, $from];
        }

        return ['from' => $from, 'to' => $to];
    }

    public function apply(Builder $query, mixed $value): void
    {
        if (! is_array($value)) {
            return;
        }

        if ($value['from'] !== null) {
            $query->where($this->resolvedColumn(), '>=', $value['from']);
        }

        if ($value['to'] !== null) {
            $query->where($this->resolvedColumn(), '<=', $value['to']);
        }
    }

    public function toQueryValue(mixed $value): string
    {
        if (! is_array($value)) {
            return (string) $value;
        }

        $from = $value['from'] ?? '';
        $to = $value['to'] ?? '';

        return "{$from}..{$to}";
    }

    protected function schemaType(): string
    {
        return 'numberrange';
    }

    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'label' => $this->resolvedLabel(),
            'type' => 'numberrange',
        ];
    }

    private function number(mixed $raw): int|float|null
    {
        if (is_int($raw) || is_float($raw)) {
            return is_finite((float) $raw) ? $raw : null;
        }

        if (! is_string($raw)) {
            return null;
        }

        $raw = trim($raw);

        if ($raw === '' || ! is_numeric($raw)) {
            return null;
        }

        $number = str_contains($raw, '.') ? (float) $raw : (int) $raw;

        return is_finite((float) $number) ? $number : null;
    }
}
