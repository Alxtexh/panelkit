<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Unit;

use Alxtexh\Panel\Forms\Fields\MoneyField;
use Alxtexh\Panel\Tests\TestCase;

final class MoneyFieldTest extends TestCase
{
    public function test_defaults_to_a_dollar_prefix_and_two_decimals(): void
    {
        $field = MoneyField::make('credit_limit');

        $schema = $field->toSchema();

        self::assertSame('text', $field->type());
        self::assertSame('$', $schema['prefix']);
        self::assertContains('numeric', $field->rules());
        self::assertContains('decimal:0,2', $field->rules());
    }

    public function test_currency_overrides_the_prefix(): void
    {
        $field = MoneyField::make('rate')->currency('KES');

        self::assertSame('KES', $field->toSchema()['prefix']);
    }

    public function test_decimals_changes_the_validation_rule(): void
    {
        $field = MoneyField::make('rate')->decimals(4);

        self::assertContains('decimal:0,4', $field->rules());
    }

    public function test_min_and_max_are_validated_as_bounds(): void
    {
        $field = MoneyField::make('credit_limit')->min(0)->max(250000);

        self::assertContains('min:0', $field->rules());
        self::assertContains('max:250000', $field->rules());
    }

    public function test_a_developer_can_still_override_the_default_prefix_directly(): void
    {
        // ->prefix() is inherited from HasAffixes, same as every other field -
        // ->currency() is a named convenience, not the only way in.
        $field = MoneyField::make('amount')->prefix('€');

        self::assertSame('€', $field->toSchema()['prefix']);
    }

    public function test_no_bounds_means_no_min_max_rules(): void
    {
        $field = MoneyField::make('amount');

        $rules = $field->rules();

        self::assertFalse((bool) array_filter($rules, static fn (string $r): bool => str_starts_with($r, 'min:')));
        self::assertFalse((bool) array_filter($rules, static fn (string $r): bool => str_starts_with($r, 'max:')));
    }
}
