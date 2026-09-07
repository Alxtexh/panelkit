<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables;

use InvalidArgumentException;

/**
 * A footer aggregate for one column - a sum, an average, a count.
 *
 * OVER THE FILTERED SET, NOT THE PAGE. This is the entire point and the thing
 * that is easy to get wrong: summing the ten rows on screen produces a number
 * that changes when you turn the page, which is worse than no number at all
 * because it looks authoritative. A filtered list of invoices with no total is
 * half an answer; one with the wrong total is a wrong answer.
 *
 * SO IT IS DEFERRED. Aggregating a tenant's 200,000 rows is the same cost class
 * as the total count, and §10 forbids either in front of the rows. The rows
 * paint, the footer fills in.
 *
 * THE COLUMN IS AN IDENTIFIER, VALIDATED HERE. It is interpolated into a SELECT
 * - `SUM(price_cents)` - which no binding can parameterise, exactly like the
 * ORDER BY allowlist. A summariser is declared in a resource class rather than
 * chosen by a request, but "not currently reachable from input" is a property
 * of today's callers, not of this class.
 */
final class Summarizer
{
    public const SUM = 'sum';

    public const AVERAGE = 'avg';

    public const MIN = 'min';

    public const MAX = 'max';

    public const COUNT = 'count';

    private function __construct(
        public readonly string $kind,
        public readonly ?string $column,
        public readonly ?string $label,
        public readonly ?string $prefix,
        public readonly ?string $suffix,
        /** Divide before display - cents to currency, bytes to megabytes. */
        public readonly ?float $divideBy,
        public readonly int $decimals,
    ) {}

    private static function make(
        string $kind,
        ?string $column,
        ?string $label,
        ?string $prefix,
        ?string $suffix,
        ?float $divideBy,
        int $decimals,
    ): self {
        if ($column !== null && preg_match('/^[a-zA-Z_][a-zA-Z0-9_.]*$/', $column) !== 1) {
            throw new InvalidArgumentException("[{$column}] is not a valid column identifier for a summary.");
        }

        if ($divideBy !== null && $divideBy == 0.0) {
            // Would produce INF or NAN and render as "∞" in a total column.
            throw new InvalidArgumentException('A summary divisor cannot be zero.');
        }

        return new self($kind, $column, $label, $prefix, $suffix, $divideBy, $decimals);
    }

    public static function sum(
        ?string $column = null,
        ?string $label = 'Total',
        ?string $prefix = null,
        ?string $suffix = null,
        ?float $divideBy = null,
        int $decimals = 0,
    ): self {
        return self::make(self::SUM, $column, $label, $prefix, $suffix, $divideBy, $decimals);
    }

    public static function average(
        ?string $column = null,
        ?string $label = 'Average',
        ?string $prefix = null,
        ?string $suffix = null,
        ?float $divideBy = null,
        int $decimals = 1,
    ): self {
        return self::make(self::AVERAGE, $column, $label, $prefix, $suffix, $divideBy, $decimals);
    }

    public static function min(?string $column = null, ?string $label = 'Lowest'): self
    {
        return self::make(self::MIN, $column, $label, null, null, null, 0);
    }

    public static function max(?string $column = null, ?string $label = 'Highest'): self
    {
        return self::make(self::MAX, $column, $label, null, null, null, 0);
    }

    /** Rows matching the filters - the same number the total shows. */
    public static function count(?string $label = 'Records'): self
    {
        return self::make(self::COUNT, null, $label, null, null, null, 0);
    }

    /**
     * The SQL aggregate expression, aliased for retrieval.
     *
     * `$alias` is derived from the column KEY by the caller, never from input.
     */
    public function expression(string $alias, string $fallbackColumn): string
    {
        $column = $this->column ?? $fallbackColumn;

        return match ($this->kind) {
            self::COUNT => "COUNT(*) as {$alias}",
            self::SUM => "SUM({$column}) as {$alias}",
            self::AVERAGE => "AVG({$column}) as {$alias}",
            self::MIN => "MIN({$column}) as {$alias}",
            self::MAX => "MAX({$column}) as {$alias}",
            default => "COUNT(*) as {$alias}",
        };
    }

    /**
     * Whether the aggregate reads a JOINED column.
     *
     * Used to decide whether the summary query can drop the table's join, the
     * same question the counts ask.
     */
    public function readsColumn(): ?string
    {
        return $this->kind === self::COUNT ? null : $this->column;
    }

    /** Presentation hints only - the client decides what they look like (§6.1). */
    /** @return array<string, mixed> */
    public function toSchema(): array
    {
        return [
            'kind' => $this->kind,
            'label' => $this->label,
            'prefix' => $this->prefix,
            'suffix' => $this->suffix,
            'divideBy' => $this->divideBy,
            'decimals' => $this->decimals,
        ];
    }
}
