<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Imports\CsvReader;
use Alxtexh\Panel\Tests\TestCase;
use RuntimeException;

/**
 * Reading a spreadsheet somebody exported from something else.
 *
 * THE FILE IS NEVER THE SHAPE THE DOCUMENTATION IMAGINES. Real uploads arrive
 * with a byte-order mark from Excel, blank trailing lines, a header row that
 * has a stray space in one cell, and rows shorter than the header because the
 * last few columns were empty when saved. None of those is an error the person
 * uploading can see or fix - the file looks fine to them - so each one has to
 * be absorbed rather than rejected.
 *
 * THE BOM IS THE ONE THAT COSTS AN AFTERNOON. It attaches to the FIRST header
 * only, invisibly, so `id` becomes `\u{FEFF}id` and every mapping against `id`
 * silently misses. The symptom is an import that runs, reports success, and
 * writes nulls into the first column.
 *
 * A GENERATOR, NOT AN ARRAY, and the memory profile is the point: an import is
 * exactly the operation somebody points at a hundred thousand rows, and a
 * reader that materialised them all would exhaust memory on the file that most
 * needed importing.
 */
final class CsvReaderTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists(CsvReader::class)) {
            $this->markTestSkipped('CSV import tests require panel-operations.');
        }
    }

    private string $path;

    protected function tearDown(): void
    {
        if (isset($this->path) && file_exists($this->path)) {
            unlink($this->path);
        }

        parent::tearDown();
    }

    private function file(string $contents): CsvReader
    {
        $this->path = tempnam(sys_get_temp_dir(), 'csv').'.csv';

        file_put_contents($this->path, $contents);

        return new CsvReader($this->path);
    }

    public function test_it_reads_headers_and_rows(): void
    {
        $reader = $this->file("name,email\nAmina,amina@example.test\nBrian,brian@example.test\n");

        $this->assertSame(['name', 'email'], $reader->headers());

        $rows = iterator_to_array($reader->rows());

        $this->assertCount(2, $rows);
        $this->assertSame(['name' => 'Amina', 'email' => 'amina@example.test'], $rows[0]);
    }

    /**
     * THE EXCEL BYTE-ORDER MARK IS STRIPPED FROM THE FIRST HEADER.
     *
     * Without this the first column's name carries three invisible bytes, so
     * mapping against it misses and the import writes nulls into it while
     * reporting success.
     */
    public function test_a_byte_order_mark_does_not_become_part_of_the_first_header(): void
    {
        $reader = $this->file("\u{FEFF}name,email\nAmina,amina@example.test\n");

        $this->assertSame(['name', 'email'], $reader->headers());

        $rows = iterator_to_array($reader->rows());

        $this->assertArrayHasKey('name', $rows[0]);
        $this->assertSame('Amina', $rows[0]['name']);
    }

    public function test_surrounding_whitespace_is_trimmed_from_headers(): void
    {
        $reader = $this->file("  name , email \nAmina,amina@example.test\n");

        $this->assertSame(['name', 'email'], $reader->headers());
    }

    /**
     * A SHORT ROW IS PADDED RATHER THAN MISALIGNED.
     *
     * Spreadsheets omit trailing empty cells. A reader that zipped headers
     * against a short row would shift every later value one column left - which
     * imports cleanly and puts an email address in the phone field.
     */
    public function test_a_row_shorter_than_the_header_is_padded_not_shifted(): void
    {
        $reader = $this->file("name,email,phone\nAmina,amina@example.test\n");

        $rows = iterator_to_array($reader->rows());

        $this->assertSame(
            ['name' => 'Amina', 'email' => 'amina@example.test', 'phone' => null],
            $rows[0],
        );
    }

    public function test_a_row_longer_than_the_header_is_truncated(): void
    {
        $reader = $this->file("name,email\nAmina,amina@example.test,extra,more\n");

        $rows = iterator_to_array($reader->rows());

        $this->assertSame(['name', 'email'], array_keys($rows[0]));
    }

    public function test_blank_lines_are_skipped(): void
    {
        $reader = $this->file("name,email\nAmina,amina@example.test\n\n\nBrian,brian@example.test\n");

        $this->assertCount(2, iterator_to_array($reader->rows()));
    }

    /**
     * AN EMPTY HEADER CELL GETS A POSITIONAL NAME rather than colliding.
     *
     * Two blank headers would otherwise both key on `''`, and the second would
     * overwrite the first - losing a column silently.
     */
    public function test_an_empty_header_cell_is_named_by_position(): void
    {
        $reader = $this->file("name,,email,\nAmina,x,amina@example.test,y\n");

        $headers = $reader->headers();

        $this->assertSame(['name', 'column_1', 'email', 'column_3'], $headers);
        $this->assertCount(4, array_unique($headers), 'Two columns shared a key and one was lost.');
    }

    public function test_an_empty_file_says_so_rather_than_importing_nothing_quietly(): void
    {
        $reader = $this->file('');

        $this->expectException(RuntimeException::class);

        $reader->headers();
    }

    /**
     * ROWS ARRIVE LAZILY. Asserted by type rather than by measuring memory,
     * which would be a flaky test - but the property is the reason an import
     * can be pointed at a file bigger than the process.
     */
    public function test_rows_are_yielded_lazily(): void
    {
        $reader = $this->file("name\nA\nB\n");

        $this->assertInstanceOf(\Generator::class, $reader->rows());
    }
}
