<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Alxtexh\Panel\Imports\Importer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;

/**
 * Opt-in CSV import over HTTP: inspect, queue, failed-row download.
 */
final class ImportHttpTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists(Importer::class)) {
            $this->markTestSkipped('HTTP import tests require panel-operations.');
        }

        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);

        $this->user = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($this->user);
        $this->app['config']->set('queue.default', 'sync');
    }

    public function test_a_resource_that_is_not_importable_is_not_found(): void
    {
        $csv = UploadedFile::fake()->createWithContent('rows.csv', "title\nNope\n");

        $this->post('/posts/import/inspect', ['file' => $csv])->assertNotFound();
        $this->post('/posts/import', [
            'file' => $csv,
            'mapping' => ['title' => 'title'],
        ])->assertNotFound();
    }

    public function test_inspect_returns_headers_and_fields(): void
    {
        $csv = UploadedFile::fake()->createWithContent('rows.csv', "Heading,State\nOne,draft\n");

        $payload = $this->post('/articles/import/inspect', ['file' => $csv])
            ->assertOk()
            ->json();

        $this->assertSame(['Heading', 'State'], $payload['headers']);
        $this->assertContains('title', array_column($payload['fields'], 'key'));
    }

    public function test_a_dry_run_writes_nothing(): void
    {
        $csv = UploadedFile::fake()->createWithContent('rows.csv', "title,status\nImported,draft\n");

        $payload = $this->post('/articles/import', [
            'file' => $csv,
            'mapping' => ['title' => 'title', 'status' => 'status'],
            'dryRun' => '1',
        ])->assertOk()->json();

        $this->assertSame(1, $payload['importable']);
        $this->assertSame(0, $payload['failed']);
        $this->assertSame(0, Article::query()->where('title', 'Imported')->count());
    }

    public function test_a_real_import_writes_rows(): void
    {
        $csv = UploadedFile::fake()->createWithContent('rows.csv', "title,status\nImported,draft\n");

        $payload = $this->post('/articles/import', [
            'file' => $csv,
            'mapping' => ['title' => 'title', 'status' => 'status'],
            'dryRun' => '0',
        ])->assertOk()->json();

        $this->assertSame(1, $payload['written'] ?? null);
        $this->assertSame(1, Article::query()->where('title', 'Imported')->count());
        $this->assertSame($this->user->tenant_id, Article::query()->where('title', 'Imported')->value('tenant_id'));
    }

    /**
     * A UNIQUE-CONSTRAINT VIOLATION IS INVISIBLE TO FORM VALIDATION - it has
     * no query to check against, only a rule like "required" or "max:120".
     * It only surfaces at the actual `save()`, and used to abort the whole
     * job there: `ImportRecords::handle()`'s per-row loop had no try/catch,
     * so one duplicate slug threw an uncaught QueryException that took down
     * every row in the batch (including ones already written) and handed
     * the browser a raw SQLSTATE message. This is `articles.slug`'s real
     * unique constraint, not a validation rule - the only way to reach the
     * code path this test is actually checking.
     */
    public function test_a_duplicate_unique_value_fails_its_own_row_without_a_500(): void
    {
        /*
         * THE FIXTURE `articles` TABLE HAS NO UNIQUE COLUMN OF ITS OWN - a
         * constraint scoped to THIS test, not a migration every other test
         * in this table also runs against, is what proves the code path a
         * validation rule cannot: a duplicate invisible to `Importer`'s
         * validation pass and only caught at `save()`.
         */
        Schema::table('articles', function ($table): void {
            $table->unique('slug');
        });

        Article::withoutGlobalScopes()->create([
            'tenant_id' => $this->user->tenant_id,
            'title' => 'Existing',
            'slug' => 'taken-slug',
            'status' => 'draft',
        ]);

        $csv = UploadedFile::fake()->createWithContent(
            'rows.csv',
            "title,slug,status\nFirst,new-slug,draft\nSecond,taken-slug,draft\n",
        );

        $payload = $this->post('/articles/import', [
            'file' => $csv,
            'mapping' => ['title' => 'title', 'slug' => 'slug', 'status' => 'status'],
            'dryRun' => '0',
        ])->assertOk()->json();

        $this->assertSame(1, $payload['written'] ?? null);
        $this->assertSame(1, $payload['failed'] ?? null);
        $this->assertSame(3, $payload['failures'][0]['line'] ?? null);
        $this->assertStringContainsString('unique', $payload['failures'][0]['messages'][0] ?? '');

        $this->assertSame(1, Article::query()->where('title', 'First')->count());
        $this->assertSame(0, Article::query()->where('title', 'Second')->count());
    }

    public function test_retry_reprocesses_only_the_durable_failed_lines(): void
    {
        Schema::table('articles', function ($table): void {
            $table->unique('slug');
        });

        Article::withoutGlobalScopes()->create([
            'tenant_id' => $this->user->tenant_id,
            'title' => 'Existing',
            'slug' => 'taken-slug',
            'status' => 'draft',
        ]);

        $csv = UploadedFile::fake()->createWithContent(
            'rows.csv',
            "title,slug,status\nFirst,new-slug,draft\nSecond,taken-slug,draft\n",
        );

        $payload = $this->post('/articles/import', [
            'file' => $csv,
            'mapping' => ['title' => 'title', 'slug' => 'slug', 'status' => 'status'],
        ])->assertOk()->json();

        $this->assertSame(1, $payload['failed']);
        $token = $payload['token'];

        Article::withoutGlobalScopes()->where('title', 'Existing')->firstOrFail()->forceDelete();

        $retry = $this->post("/articles/imports/{$token}/retry", [], [
            'Idempotency-Key' => 'retry-'.$token,
        ])->assertOk()->json();

        $this->assertSame('done', $retry['status']);
        $this->assertSame(1, Article::query()->where('title', 'First')->count());
        $this->assertSame(1, Article::query()->where('title', 'Second')->count());
    }

    public function test_failed_rows_are_downloadable(): void
    {
        $csv = UploadedFile::fake()->createWithContent('rows.csv', "title,status\n,draft\n");

        $payload = $this->post('/articles/import', [
            'file' => $csv,
            'mapping' => ['title' => 'title', 'status' => 'status'],
            'dryRun' => '0',
        ])->assertOk()->json();

        $this->assertGreaterThan(0, $payload['failed'] ?? 0);
        $this->assertNotEmpty($payload['failuresDownload'] ?? null);

        $this->get($payload['failuresDownload'])
            ->assertOk()
            ->assertHeader('content-disposition');
    }

    public function test_excel_is_refused_unless_the_resource_opts_in(): void
    {
        $xlsx = UploadedFile::fake()->create('rows.xlsx', 12, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        $this->post('/articles/import/inspect', ['file' => $xlsx])
            ->assertStatus(422);
    }

    public function test_excel_reader_names_the_optional_package_when_missing(): void
    {
        if (class_exists(\PhpOffice\PhpSpreadsheet\IOFactory::class)) {
            $this->markTestSkipped('PhpSpreadsheet is installed; the optional path is available.');
        }

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('phpoffice/phpspreadsheet');

        new \Alxtexh\Panel\Imports\ExcelReader('/tmp/missing.xlsx');
    }
}
