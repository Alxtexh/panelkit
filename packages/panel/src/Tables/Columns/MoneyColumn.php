<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Columns;

/**
 * An amount of money, formatted client-side in the viewer's locale.
 *
 * REPORTED FROM A REAL PORT: an amount and its currency had to be split into
 * two columns, so an invoice list read `1250.00 | KES` across two headings
 * instead of `KSh 1,250.00` in one. Not fatal, and the sort of thing every
 * consuming application then solves privately with a `->formatUsing()` closure
 * that gets the grouping separator wrong for half the world.
 *
 * FORMATTING IS NOT DONE HERE, which is the same rule `DateColumn` follows and
 * for the same reason. `Intl.NumberFormat` in the browser knows the viewer's
 * locale; PHP on the server knows the server's. Formatting here would print a
 * comma decimal separator to somebody who reads a full stop, and a schema
 * carrying a formatted string could not be cached across tenants either.
 *
 * MINOR UNITS ARE THE DEFAULT, because storing money in a float is the older
 * and worse of the two common mistakes: `0.1 + 0.2` is not `0.3` in binary
 * floating point, and an invoice total that is out by a cent is a support
 * ticket nobody can reproduce. An integer count of the smallest unit has no
 * such problem. Call `->major()` for a column that genuinely stores decimals.
 *
 * THE CURRENCY MAY COME FROM ANOTHER COLUMN, which is the half the report was
 * actually asking for. A single-currency installation names it once; a
 * multi-currency one points at the row's own currency column, and the client
 * reads it per row.
 */
final class MoneyColumn extends Column
{
    private ?string $currency = null;

    private ?string $currencyColumn = null;

    private bool $minorUnits = true;

    /** A fixed currency for every row, as an ISO 4217 code: `KES`, `EUR`. */
    public function currency(string $code): static
    {
        $this->currency = strtoupper($code);
        $this->currencyColumn = null;

        return $this;
    }

    /**
     * Read the currency from another attribute on the same row.
     *
     * THE COLUMN NEED NOT BE VISIBLE. A currency shown in its own column beside
     * the amount is the arrangement this class exists to replace - what matters
     * is that the value reaches the payload, which it does because the row is
     * serialised from the record rather than from the visible columns.
     */
    public function currencyFrom(string $attribute): static
    {
        $this->currencyColumn = $attribute;
        $this->currency = null;

        return $this;
    }

    /**
     * The stored value is already in major units - `12.50` rather than `1250`.
     *
     * NOT THE DEFAULT, deliberately. See the class note: a decimal money column
     * is usually a mistake somebody has not noticed yet, and making it the
     * default would make the mistake invisible.
     */
    public function major(bool $major = true): static
    {
        $this->minorUnits = ! $major;

        return $this;
    }

    public function type(): string
    {
        return 'money';
    }

    /**
     * THE POSITIVE FLAG IS EMITTED, not the default one.
     *
     * `Column::toArray()` strips nulls AND `false` from the payload, so
     * `'minorUnits' => false` would vanish and the client would read its
     * absence as the default - which is `true`. Sending `major` instead means
     * the value that survives is the one that differs from the default, which
     * is what the filter is for.
     *
     * OVERRIDES `toArray()`, NOT `toSchema()`. `Column::toSchema()` is an
     * alias - `return $this->toArray();` - kept only so a caller that treats
     * every schema node the same way (layout, entries, columns) can call one
     * method name; the table-rendering pipeline itself always calls
     * `->toArray()` directly (`Table.php`'s column-serialisation loop, twice).
     * An override on `toSchema()` here never ran: `currency`, `currencyColumn`
     * and `major` never reached the client, and a list column rendered a bare
     * `10,000.00` with no `$` regardless of `->currency('USD')`.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            ...parent::toArray(),
            'currency' => $this->currency,
            'currencyColumn' => $this->currencyColumn,
            'major' => ! $this->minorUnits,
        ], static fn (mixed $v): bool => $v !== null && $v !== false);
    }
}
