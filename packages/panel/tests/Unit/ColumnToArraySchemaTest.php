<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Unit;

use Alxtexh\Panel\Tables\Columns\CodeColumn;
use Alxtexh\Panel\Tables\Columns\KeyValueColumn;
use Alxtexh\Panel\Tables\Columns\MoneyColumn;
use Alxtexh\Panel\Tables\Columns\RatingColumn;
use Alxtexh\Panel\Tests\TestCase;

/**
 * `Column::toSchema()` is a plain alias - `return $this->toArray();` - kept so
 * a caller that treats every schema node uniformly can call one method name.
 * `Table.php`'s actual column-serialisation loop always calls `->toArray()`
 * directly, twice, never `->toSchema()`. Four columns (Money, Code, KeyValue,
 * Rating) had their extra fields on an override of `toSchema()` instead - code
 * that compiled, looked correct on a read, and never once ran: a list column
 * silently fell back to its bare default (no currency symbol, no language
 * hint, generic key/value labels, the default star count) regardless of what
 * was configured. Locking in `->toArray()` specifically, not `->toSchema()`,
 * is the point of every assertion below - `toSchema()` would pass these
 * trivially even if the underlying bug came back.
 */
final class ColumnToArraySchemaTest extends TestCase
{
    public function test_money_column_carries_currency_and_major_through_to_array(): void
    {
        $schema = MoneyColumn::make('credit_limit')->currency('USD')->major()->toArray();

        self::assertSame('USD', $schema['currency']);
        self::assertTrue($schema['major']);
    }

    public function test_money_column_currency_from_survives_to_array(): void
    {
        $schema = MoneyColumn::make('amount')->currencyFrom('currency_code')->toArray();

        self::assertSame('currency_code', $schema['currencyColumn']);
    }

    public function test_code_column_language_survives_to_array(): void
    {
        $schema = CodeColumn::make('payload')->language('json')->toArray();

        self::assertSame('json', $schema['language']);
    }

    public function test_key_value_column_labels_survive_to_array(): void
    {
        $schema = KeyValueColumn::make('meta')->labels('Field', 'Content')->toArray();

        self::assertSame('Field', $schema['keyLabel']);
        self::assertSame('Content', $schema['valueLabel']);
    }

    public function test_rating_column_max_survives_to_array(): void
    {
        $schema = RatingColumn::make('score')->max(10)->toArray();

        self::assertSame(10, $schema['max']);
    }
}
