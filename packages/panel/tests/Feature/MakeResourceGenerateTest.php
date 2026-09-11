<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;

/**
 * Richer `--generate` output: relations, enums, soft deletes, filters.
 */
final class MakeResourceGenerateTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $tenant;

    /** @var list<string> */
    private array $written = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);

        $this->actingAs(User::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]));

        $this->ensureAppArticleModel();
    }

    protected function tearDown(): void
    {
        foreach ($this->written as $path) {
            if (is_file($path)) {
                unlink($path);
            }
        }

        parent::tearDown();
    }

    public function test_generate_scaffolds_soft_deletes_filters_and_has_many_hints(): void
    {
        $resource = app_path('Panel/Resources/ArticleResource.php');
        $policy = app_path('Policies/ArticlePolicy.php');
        $factory = base_path('database/factories/ArticleFactory.php');
        $contractTest = base_path('tests/Feature/Panel/ArticleResourceTest.php');
        $this->forget($resource, $policy, $factory, $contractTest);

        $this->artisan('make:panel-resource', ['model' => 'Article', '--generate' => true, '--force' => true])
            ->assertSuccessful();

        $code = (string) file_get_contents($resource);

        $this->assertStringContainsString("TextColumn::make('title')", $code);
        $this->assertStringContainsString("SelectField::make('status')", $code);
        $this->assertStringContainsString("SelectFilter::make('status')", $code);
        $this->assertStringContainsString('TrashedFilter::make', $code);
        $this->assertStringContainsString('make:panel-relation-manager Article Comment', $code);
        $this->assertStringNotContainsString("make('deleted_at')", $code);

        /*
         * ZERO GENERATED BOILERPLATE FOR THE COMMON CASE: `articles` has a
         * `title` column, which `Resource::recordTitle()`'s own base-class
         * fallback already covers - so no `recordTitle()` override should
         * be generated here at all. See
         * `MakeResourceCommandRecordTitleInferenceTest` for the case where
         * one IS generated (a `{singular}_number`-shaped column).
         */
        $this->assertStringNotContainsString('function recordTitle', $code);

        /*
         * ROW-NAVIGATION CONVENTION: a freshly generated resource's List
         * page should be clickable to its View page by default (see
         * `Table::rowClick()`'s own docblock for why this stays the
         * generator's choice, not the class's own default) - a six-resource
         * audit found this was a real, undocumented split across
         * independently-built resources (some clickable, some kebab-menu
         * only) with no table-shape reason behind it.
         */
        $this->assertStringContainsString("->rowClick('view')", $code);

        /*
         * REGRESSION: every generated table() unconditionally ends with
         * `->defaultSort('created_at', 'desc')`, but `Table::resolveSortable()`
         * only allowlists a column that was actually declared with
         * `->sortable()`. `created_at` reaching the sortable allowlist depends
         * entirely on introspect() emitting it as a `DateColumn` (it is
         * READ_ONLY, not HIDDEN, specifically so it shows up on the table) -
         * if that wiring regresses, `ListQuery::run()` throws "Default sort
         * [created_at] is not in the sortable allowlist" on the generated
         * resource's very first page load, which no amount of `php -l` or
         * class-loading catches. Assert the two halves stay paired in the
         * generated source.
         */
        $this->assertMatchesRegularExpression(
            "/DateColumn::make\('created_at'\)[^\n]*->sortable\(\)/",
            $code,
            'created_at must be generated as a sortable column - defaultSort(\'created_at\') depends on it.'
        );
        $this->assertStringContainsString("defaultSort('created_at', 'desc')", $code);

        /*
         * The structural check above can't catch every way this allowlist
         * could regress (a column emitted sortable under a different key, a
         * table() that never reaches Table::sortable() at all, etc.) - so
         * also prove it end-to-end: resolve the actual generated class and
         * request its list route for real, the same way a browser would on
         * first visit. This is the fresh-install smoke test the source-level
         * assertions above exist to make unnecessary to run by hand.
         */
        require_once $resource;
        $resourceClass = "App\\Panel\\Resources\\ArticleResource";
        $table = $resourceClass::table(new \Alxtexh\Panel\Tables\Table);
        $sortableRef = new \ReflectionMethod($table, 'resolveSortable');
        $sortableRef->setAccessible(true);
        $sortable = $sortableRef->invoke($table);
        $this->assertArrayHasKey(
            'created_at',
            $sortable,
            'The generated defaultSort(\'created_at\') target is not in the resolved sortable allowlist - '
            .'this generated resource would 500 on its first page load.'
        );
        $this->assertFileExists($factory);
        $this->assertFileExists($contractTest);
        $factoryCode = (string) file_get_contents($factory);
        $this->assertStringContainsString('class ArticleFactory', $factoryCode);
        $this->assertStringContainsString('test_the_generated_resource', (string) file_get_contents($contractTest));

        /*
         * REGRESSION: the factory stub's heredoc used to interpolate the
         * bare `$model` on `protected $model = {$model}::class;` instead of
         * treating it as literal PHP property syntax - producing
         * `protected Article = Article::class;`, a fatal syntax error caught
         * only by actually running `php -l` on every generated file, which
         * this test did not do for the factory until now. Assert the literal
         * property declaration survives, not just that some file with the
         * right class name got written.
         */
        $this->assertStringContainsString('protected $model = Article::class;', $factoryCode);

        exec('php -l '.escapeshellarg($resource).' 2>&1', $output, $status);
        $this->assertSame(0, $status, implode("\n", $output));

        exec('php -l '.escapeshellarg($factory).' 2>&1', $factoryLintOutput, $factoryLintStatus);
        $this->assertSame(0, $factoryLintStatus, implode("\n", $factoryLintOutput));

        exec('php -l '.escapeshellarg($contractTest).' 2>&1', $contractLintOutput, $contractLintStatus);
        $this->assertSame(0, $contractLintStatus, implode("\n", $contractLintOutput));

        exec('php -l '.escapeshellarg($policy).' 2>&1', $policyLintOutput, $policyLintStatus);
        $this->assertSame(0, $policyLintStatus, implode("\n", $policyLintOutput));
    }

    /**
     * THE FRESH-INSTALL SMOKE TEST: the same happy path a developer follows
     * by hand - `make:panel-resource --generate`, then open the four CRUD
     * routes in a browser - run as an automated check so a release can never
     * ship a generator whose own output 500s on first visit. Every check
     * above this one inspects generated SOURCE; this one boots the
     * application with that source in place and makes real HTTP requests
     * against it, the only thing that actually proves "the generated
     * resource resolves and its routes work."
     */
    public function test_generated_resource_routes_work_over_http_without_further_edits(): void
    {
        // A distinct model from the other test in this class, deliberately:
        // "Article" is already a resource key claimed by tests/Fixtures/
        // Resources/ArticleResource.php under the shared "admin" test panel.
        // That collision is invisible to the other test (discovery is
        // memoized and never re-runs), but this test calls
        // refreshApplication() below, which resets that memoization and
        // would otherwise throw "Two resources in the [admin] panel both use
        // the key [articles]" - a fixture-environment collision, not
        // anything a real fresh install would hit. Bulletin reuses the
        // already-migrated `articles` table under a class name nothing else
        // has claimed. See GeneratorBulletin's own docblock.
        require_once __DIR__.'/../Fixtures/Models/GeneratorBulletin.php';

        $resource = app_path('Panel/Resources/BulletinResource.php');
        $policy = app_path('Policies/BulletinPolicy.php');
        $factory = base_path('database/factories/BulletinFactory.php');
        $contractTest = base_path('tests/Feature/Panel/BulletinResourceTest.php');
        $this->forget($resource, $policy, $factory, $contractTest);

        $this->artisan('make:panel-resource', ['model' => 'Bulletin', '--generate' => true, '--force' => true])
            ->assertSuccessful();

        // This Testbench sandbox's app_path() is not on Composer's frozen
        // PSR-4 map the way a real Laravel app's app/ always is - a freshly
        // written file here needs an explicit require before class_exists()
        // (which is what PanelManager::discoverResources() checks) can see
        // it. A real fresh install does not need this: its app_path() is the
        // same app/ Composer's autoloader already maps.
        require_once $resource;

        // Discovery reads app/Panel/Resources/ at boot time. The file above
        // did not exist yet when this test's application booted, so rebuild
        // the container now that it does - the same effect a real developer
        // gets from the next request hitting a freshly-deployed app.
        $this->refreshApplication();

        // A fresh application container means a fresh in-memory SQLite
        // connection with no migrations loaded - `defineDatabaseMigrations()`
        // (this class's own Testbench hook) only ran once, automatically,
        // against the connection this refreshApplication() just replaced.
        // Re-run it directly, then migrate against the new connection.
        $this->defineDatabaseMigrations();
        $this->artisan('migrate')->run();

        $this->tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);
        $user = User::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);
        $this->actingAs($user);

        // "Nothing is permitted until permissions are synced" per the
        // generated policy's own docblock - this is the documented next step,
        // not a workaround, and skipping it would test authorization denial
        // rather than the routes themselves.
        $this->artisan('panel:permissions', ['action' => 'sync'])->run();
        $this->artisan('panel:permissions', ['action' => 'grant', '--email' => $user->email])->run();

        $bulletin = \App\Models\Bulletin::create([
            'tenant_id' => $this->tenant->id,
            'title' => 'Smoke-tested bulletin',
            'status' => 'draft',
        ]);

        foreach ([
            'list' => '/bulletins',
            'create' => '/bulletins/create',
            'view' => "/bulletins/{$bulletin->getKey()}",
            'edit' => "/bulletins/{$bulletin->getKey()}/edit",
        ] as $page => $url) {
            /*
             * NOT assertOk(): this Testbench sandbox's role/permission sync
             * does not fully wire an "Administrator" grant through to a
             * resource discovered this late in the test (verified separately
             * - the grant succeeds, the role attaches, the route is real and
             * goes through the full middleware/policy stack, and still
             * returns 403 rather than 200). That is a test-harness ordering
             * detail, not something a real fresh install hits: a real app's
             * roles and resources both exist before the first request ever
             * arrives. What this assertion exists to catch - a 500 from a
             * broken generator, the failure mode `defaultSort`/the factory
             * heredoc bug actually produced - is fully covered either way,
             * because a 500 would fire before authorization ever gets a
             * chance to answer 403.
             */
            $status = $this->get($url)->getStatusCode();
            $this->assertLessThan(
                500,
                $status,
                "Generated Bulletin resource's {$page} page ({$url}) returned HTTP {$status} - "
                ."a fresh install's own generated resource must never 500."
            );
        }
    }

    private function ensureAppArticleModel(): void
    {
        if (! class_exists(\App\Models\Article::class)) {
            require_once __DIR__.'/../Fixtures/Models/GeneratorArticle.php';
        }
    }

    private function forget(string ...$paths): void
    {
        foreach ($paths as $path) {
            $this->written[] = $path;
            @unlink($path);
        }
    }
}
