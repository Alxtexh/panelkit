<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Unit;

use Alxtexh\Panel\Forms\Fields\MoneyField;
use Alxtexh\Panel\Tests\TestCase;

/**
 * `MoneyColumn` and `MoneyEntry` both stored minor units (cents) by default;
 * `MoneyField` had no equivalent concept at all - the raw stored value WAS
 * the edited value, so a `credit_limit` column holding `12500` showed "12500"
 * in the edit form, and typing "125.00" (a perfectly reasonable-looking
 * dollar amount) wrote `125` back - two orders of magnitude wrong, with no
 * validation error to catch it. See `MoneyField`'s class docblock for the
 * full account.
 */
final class MoneyFieldMinorUnitsTest extends TestCase
{
    public function test_defaults_to_minor_units_matching_moneycolumn_and_moneyentry(): void
    {
        $field = MoneyField::make('amount');

        // 12500 minor units -> "125.00" major units, the value the form shows.
        self::assertSame('125.00', $field->presentValue(12500));
        // The validated major-unit string the form submits -> what is stored.
        self::assertSame(12500, $field->transformForStorage('125.00'));
    }

    public function test_unchanged_edit_round_trips_to_the_same_stored_value(): void
    {
        $field = MoneyField::make('amount');

        $shown = $field->presentValue(12500);
        self::assertSame('125.00', $shown);

        self::assertSame(12500, $field->transformForStorage($shown));
    }

    public function test_changing_the_amount_stores_the_new_minor_units(): void
    {
        $field = MoneyField::make('amount');

        self::assertSame(13050, $field->transformForStorage('130.50'));
    }

    public function test_zero_round_trips_correctly(): void
    {
        $field = MoneyField::make('amount');

        self::assertSame('0.00', $field->presentValue(0));
        self::assertSame(0, $field->transformForStorage('0.00'));
    }

    public function test_null_passes_through_unconverted(): void
    {
        $field = MoneyField::make('amount');

        self::assertNull($field->presentValue(null));
        self::assertNull($field->transformForStorage(null));
    }

    public function test_negative_amounts_round_trip_correctly(): void
    {
        $field = MoneyField::make('amount');

        self::assertSame('-50.00', $field->presentValue(-5000));
        self::assertSame(-5000, $field->transformForStorage('-50.00'));
    }

    public function test_a_fraction_of_a_cent_rounds_rather_than_truncates(): void
    {
        $field = MoneyField::make('amount');

        // A pathological input past the field's own `decimals()` validation
        // rule - proving the transform itself does not silently drop it.
        self::assertSame(13051, $field->transformForStorage('130.505'));
    }

    public function test_major_mode_stores_and_shows_the_value_unconverted(): void
    {
        $field = MoneyField::make('amount')->major();

        self::assertSame(125.5, $field->presentValue(125.5));
        self::assertSame('125.50', $field->transformForStorage('125.50'));
    }

    public function test_major_false_restores_the_minor_unit_default(): void
    {
        $field = MoneyField::make('amount')->major()->major(false);

        self::assertSame('125.00', $field->presentValue(12500));
    }

    public function test_divide_by_matches_major_for_a_divisor_of_one(): void
    {
        $viaMajor = MoneyField::make('a')->major();
        $viaDivideBy = MoneyField::make('a')->divideBy(1);

        self::assertSame($viaMajor->presentValue('125.50'), $viaDivideBy->presentValue('125.50'));
        self::assertSame($viaMajor->transformForStorage('125.50'), $viaDivideBy->transformForStorage('125.50'));
    }

    /** A three-decimal currency (KWD-shaped), matching `MoneyEntry::divideBy()`'s own vocabulary. */
    public function test_divide_by_supports_a_non_cents_minor_unit(): void
    {
        $field = MoneyField::make('amount')->divideBy(1000)->decimals(3);

        self::assertSame('125.500', $field->presentValue(125500));
        self::assertSame(125500, $field->transformForStorage('125.500'));
    }

    public function test_non_numeric_values_pass_through_unconverted(): void
    {
        $field = MoneyField::make('amount');

        self::assertSame('not-a-number', $field->presentValue('not-a-number'));
        self::assertSame('not-a-number', $field->transformForStorage('not-a-number'));
    }
}
