<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Unit;

use Alxtexh\Panel\Commands\MakeResourceCommand;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Support\Facades\Schema;
use ReflectionMethod;

/**
 * `MakeResourceCommand::inferRecordTitleColumn()` - the generator-side half
 * of the recordTitle() convention: a generated resource should carry an
 * explicit override ONLY when the base class's own fallback
 * (`Resource::recordTitle()`) would not already find something, so the
 * common case (a plain `name`/`title`/`subject`/`code`/... column) needs
 * zero generated code.
 */
final class MakeResourceCommandRecordTitleInferenceTest extends TestCase
{
    private function infer(string $table): ?string
    {
        $method = new ReflectionMethod(MakeResourceCommand::class, 'inferRecordTitleColumn');
        $method->setAccessible(true);

        return $method->invoke(app(MakeResourceCommand::class), $table);
    }

    public function test_returns_null_when_the_base_class_fallback_already_covers_the_table(): void
    {
        Schema::create('scratch_widgets', function ($table): void {
            $table->id();
            $table->string('name');
        });

        try {
            $this->assertNull($this->infer('scratch_widgets'));
        } finally {
            Schema::drop('scratch_widgets');
        }
    }

    /**
     * THE ONE ADDITIONAL PATTERN: `{singular}_number` on its own matching
     * table - `crates` -> `crate_number` (the real-world case this exists
     * for is `invoices` -> `invoice_number`, `orders` -> `order_number`) -
     * which the base class's literal `name`/`title`/.../`number` check
     * cannot find, because it is prefixed.
     */
    public function test_infers_a_prefixed_number_column_when_nothing_else_matches(): void
    {
        Schema::create('crates', function ($table): void {
            $table->id();
            $table->string('crate_number');
            $table->decimal('total', 10, 2);
        });

        try {
            $this->assertSame('crate_number', $this->infer('crates'));
        } finally {
            Schema::drop('crates');
        }
    }

    /**
     * DELIBERATELY NARROW: a `_number` column that does NOT match
     * `{singular(table)}_number` is left alone rather than guessed at - a
     * `tracking_number` on a `crates` table is not the crate's own
     * identity just because it also ends in `_number`.
     */
    public function test_does_not_infer_an_unrelated_number_shaped_column(): void
    {
        Schema::create('crates', function ($table): void {
            $table->id();
            $table->string('tracking_number');
            $table->decimal('total', 10, 2);
        });

        try {
            $this->assertNull($this->infer('crates'));
        } finally {
            Schema::drop('crates');
        }
    }

    public function test_returns_null_when_no_candidate_exists_at_all(): void
    {
        Schema::create('scratch_totals', function ($table): void {
            $table->id();
            $table->decimal('amount', 10, 2);
        });

        try {
            $this->assertNull($this->infer('scratch_totals'));
        } finally {
            Schema::drop('scratch_totals');
        }
    }
}
