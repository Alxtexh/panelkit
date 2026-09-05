<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Forms\Fields\TextField;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Imports\Importer;
use Alxtexh\Panel\Tests\TestCase;
use InvalidArgumentException;

/**
 * Turning somebody's spreadsheet into records, or refusing to.
 *
 * THE MAPPING IS THE SECURITY BOUNDARY. A file arrives with arbitrary column
 * names and the operator says which column feeds which FIELD - so an importer
 * that accepted a mapping to anything would let a spreadsheet write
 * `tenant_id`, `is_admin` or any other column the form deliberately does not
 * expose. Mapping to an undeclared field is REFUSED rather than ignored,
 * because ignoring it imports cleanly, silently drops the column, and reads as
 * success.
 *
 * REQUIRED FIELDS ARE CHECKED ON THE MAPPING, NOT PER ROW. Only mapped fields
 * have their rules applied - otherwise a file that legitimately omits an
 * optional column fails on every row. That is right for optional fields and
 * silently wrong for required ones: an unmapped required field is simply never
 * validated, and thousands of rows import with a value the form considers
 * impossible.
 *
 * BAD ROWS DO NOT STOP GOOD ONES. An import is somebody's afternoon; refusing
 * the whole file for one malformed line means fixing it blind and running it
 * again. Failures are collected WITH their row numbers and the rest is
 * prepared.
 */
final class ImporterTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists(Importer::class)) {
            $this->markTestSkipped('Importer tests require panel-operations.');
        }
    }

    private function form(): Form
    {
        return Form::make()->schema([
            TextField::make('title')->required(),
            TextField::make('status'),
        ]);
    }

    public function test_it_prepares_rows_through_the_mapping(): void
    {
        $importer = new Importer($this->form(), ['Heading' => 'title', 'State' => 'status']);

        $result = $importer->process([
            ['Heading' => 'First', 'State' => 'draft'],
            ['Heading' => 'Second', 'State' => 'published'],
        ]);

        $this->assertSame(2, $result->importable());
        $this->assertSame(0, $result->failed());
        $this->assertSame(
            [['title' => 'First', 'status' => 'draft'], ['title' => 'Second', 'status' => 'published']],
            array_map(static fn ($row) => $row->data, $result->prepared),
        );
        // +2: the header is line 1, so the first data row is line 2.
        $this->assertSame([2, 3], array_map(static fn ($row) => $row->line, $result->prepared));
    }

    /**
     * A COLUMN NOT IN THE MAPPING IS NOT IMPORTED.
     *
     * The spreadsheet may carry anything - an exported `id`, an internal note,
     * a `tenant_id` from the system it came out of. Only what the operator
     * mapped is written.
     */
    public function test_an_unmapped_column_is_not_imported(): void
    {
        $importer = new Importer($this->form(), ['Heading' => 'title']);

        $result = $importer->process([
            ['Heading' => 'First', 'tenant_id' => '999', 'is_admin' => '1'],
        ]);

        $this->assertSame(['title' => 'First'], $result->prepared[0]->data);
    }

    /**
     * MAPPING TO AN UNDECLARED FIELD IS REFUSED AT CONSTRUCTION.
     *
     * Loudly, and before a single row is read - the alternative silently drops
     * the column and reports success, which is the failure shape this whole
     * project exists to avoid.
     */
    public function test_a_mapping_to_an_undeclared_field_is_refused(): void
    {
        $this->expectException(InvalidArgumentException::class);

        new Importer($this->form(), ['Anything' => 'tenant_id']);
    }

    public function test_an_unmapped_required_field_is_refused_at_construction(): void
    {
        $this->expectException(InvalidArgumentException::class);

        // `title` is required and nothing maps to it.
        new Importer($this->form(), ['State' => 'status']);
    }

    /**
     * A BAD ROW FAILS ALONE, AND SAYS WHICH ROW IT WAS.
     *
     * Row numbers are the difference between "fix line 4,182" and "something
     * in your file is wrong".
     */
    public function test_a_failing_row_does_not_stop_the_others(): void
    {
        $importer = new Importer($this->form(), ['Heading' => 'title']);

        $result = $importer->process([
            ['Heading' => 'Fine'],
            ['Heading' => ''],
            ['Heading' => 'Also fine'],
        ]);

        $this->assertSame(2, $result->importable());
        $this->assertSame(1, $result->failed());
        $this->assertNotEmpty($result->failures);
    }

    public function test_the_result_serialises_for_the_client(): void
    {
        $importer = new Importer($this->form(), ['Heading' => 'title']);

        $array = $importer->process([['Heading' => 'Fine'], ['Heading' => '']])->toArray();

        $this->assertArrayHasKey('failures', $array);
        $this->assertIsArray($array['failures']);
    }

    public function test_an_empty_file_prepares_nothing_without_failing(): void
    {
        $importer = new Importer($this->form(), ['Heading' => 'title']);

        $result = $importer->process([]);

        $this->assertSame(0, $result->importable());
        $this->assertSame(0, $result->failed());
    }
}
