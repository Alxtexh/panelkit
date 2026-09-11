<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms\Fields;

/**
 * A decimal monetary amount - the form-side counterpart to `MoneyColumn`.
 *
 * NOT `NumberField` WITH DECIMALS BOLTED ON. `NumberField` is deliberately
 * integer-only: its own docblock explains why ("How many days should deleted
 * records be kept?" has a handful of real integer answers, and its preset/chip
 * system is built entirely around whole numbers). Loosening its validation to
 * also accept decimals would blur a field that is intentionally narrow rather
 * than close a real gap - a `credit_limit` of 1499.99 is not "a number with a
 * decimal point", it is a different kind of value with its own formatting and
 * validation concerns. A dedicated field keeps both honest about what they are.
 *
 * VALIDATED WITH LARAVEL'S OWN `decimal:min,max` RULE, not a hand-rolled regex
 * - `decimal:0,2` is exactly "up to 2 decimal places", which is the actual
 * constraint a currency amount has, and it is a rule Laravel already ships and
 * documents rather than a pattern this package would need to maintain.
 *
 * RENDERED AS A PLAIN TEXT INPUT WITH A CURRENCY PREFIX, not a themed numeric
 * widget or a native `<input type="number">`. A native number input's
 * scroll-to-change and browser-dependent step behaviour are worse for a
 * currency amount than a plain field, which is exactly why Filament's own
 * `TextInput::make(...)->numeric()->prefix('$')` does the same thing rather
 * than reaching for a dedicated widget - see `HasAffixes`, already on every
 * field, for the prefix.
 *
 *     MoneyField::make('credit_limit')->currency('$')->decimals(2);
 *     MoneyField::make('rate')->currency('KES')->min(0)->max(1_000_000);
 *
 * STORES MINOR UNITS BY DEFAULT, agreeing with `MoneyColumn` and
 * `MoneyEntry` - the same column read by either of those as `12500` /
 * "$125.00" used to round-trip through this field as the literal string
 * "12500", because this field had no concept of a divisor at all. Typing
 * "125.00" into what looked like a normal dollar amount silently wrote
 * 125 into a column meant to hold cents - a two-order-of-magnitude data
 * error with no validation failure to catch it, the write-side twin of the
 * bug `MoneyColumn`'s own docblock describes for an unformatted read.
 *
 * `major()` MATCHES `MoneyColumn::major()`'S NAME because a `MoneyField`
 * and a `MoneyColumn` almost always describe the SAME column on the SAME
 * resource - one for editing, one for listing - so the flag that turns off
 * conversion should read the same in both places. `divideBy()` matches
 * `MoneyEntry::divideBy()` instead, for a currency with other than two
 * decimal places (KWD's three, JPY's zero) where "major or minor" is not
 * the whole story - both setters write the same internal divisor, so
 * either name works and they cannot disagree with each other.
 *
 * THE FORM INPUT ALWAYS SHOWS AND ACCEPTS THE MAJOR-UNIT AMOUNT - "125.00",
 * never "12500" - regardless of divisor. `typeRules()` below validates
 * exactly that major-unit string (unchanged by this), so an invalid amount
 * is still rejected before storage is ever considered; only the STORED
 * representation moves, via `presentValue()` (stored -> shown) and
 * `transformForStorage()` (validated -> stored), the same hook pair every
 * other field with a stored/edited mismatch already uses (see
 * `FileUploadField`).
 */
final class MoneyField extends Field
{
    /*
     * `$` BY DEFAULT, overriding the `HasAffixes` trait's own `null` default
     * for this one field type. `Field::__construct()` is `final` (every field
     * shares one construction path), so a constructor override to call
     * `->prefix('$')` is not available - redeclaring the inherited property's
     * default is the mechanism PHP actually offers here, and it runs
     * regardless of which constructor executes.
     */
    protected ?string $prefix = '$';

    private int $decimals = 2;

    private ?float $min = null;

    private ?float $max = null;

    /** Minor units (cents) by default - see the class docblock for why this matches `MoneyColumn`/`MoneyEntry`. */
    private int $divisor = 100;

    /**
     * The currency symbol shown as the field's prefix.
     *
     * A thin, named wrapper over `->prefix()` (already on every field via
     * `HasAffixes`) rather than a second, competing chrome mechanism - calling
     * `->prefix('KES')` directly works exactly the same way.
     */
    public function currency(string $symbol): static
    {
        $this->prefix($symbol);

        return $this;
    }

    /** How many decimal places the amount may carry. Currency is 2 by default; a rate field might want more. */
    public function decimals(int $decimals): static
    {
        $this->decimals = $decimals;

        return $this;
    }

    public function min(float $min): static
    {
        $this->min = $min;

        return $this;
    }

    public function max(float $max): static
    {
        $this->max = $max;

        return $this;
    }

    /**
     * The stored value is already in major units - `12.50` rather than `1250`.
     *
     * Matches `MoneyColumn::major()`. NOT THE DEFAULT, for the same reason it
     * is not the default there: see the class docblock.
     */
    public function major(bool $major = true): static
    {
        $this->divisor = $major ? 1 : 100;

        return $this;
    }

    /**
     * Divisor between the stored integer and the major-unit amount this
     * field shows and accepts. Default 100 (cents to dollars); `1` is the
     * same as `major(true)`. Matches `MoneyEntry::divideBy()` - set this
     * instead of `major()` for a currency whose minor unit isn't 1/100th
     * (three-decimal KWD is `divideBy(1000)`, zero-decimal JPY is
     * `divideBy(1)` with `decimals(0)`).
     */
    public function divideBy(int $divisor): static
    {
        $this->divisor = $divisor;

        return $this;
    }

    public function type(): string
    {
        return 'text';
    }

    protected function typeRules(): array
    {
        return array_values(array_filter([
            'numeric',
            "decimal:0,{$this->decimals}",
            $this->min !== null ? "min:{$this->min}" : null,
            $this->max !== null ? "max:{$this->max}" : null,
        ]));
    }

    /**
     * Stored minor units -> the major-unit amount the form shows.
     *
     * `12500` -> `"125.00"`. Untouched (not even reformatted) when
     * `divideBy(1)`/`major()` is set - a column that already stores decimals
     * gets no conversion at all, not a conversion by 1.
     */
    public function presentValue(mixed $value): mixed
    {
        if ($this->divisor === 1 || $value === null || ! is_numeric($value)) {
            return $value;
        }

        return number_format(((float) $value) / $this->divisor, $this->decimals, '.', '');
    }

    /**
     * The validated major-unit amount -> what the column should hold.
     *
     * `typeRules()` already validated this as a major-unit decimal (a
     * currency amount, "125.00" - never raw cents), so nothing about
     * validation changes here; only the stored representation does.
     * Rounds to the nearest whole minor unit rather than truncating, so
     * `130.505` (past `decimals()`, but `numeric` alone would still accept
     * it if a caller relaxed `decimals`) does not lose the last cent
     * silently.
     */
    public function transformForStorage(mixed $value): mixed
    {
        if ($this->divisor === 1 || $value === null || $value === '' || ! is_numeric($value)) {
            return $value;
        }

        return (int) round(((float) $value) * $this->divisor);
    }
}
