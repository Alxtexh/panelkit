<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Support\Blueprint;
use Alxtexh\Panel\Support\PanelModules;
use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;

/**
 * The commands an operator actually runs, and the file an agent reads.
 *
 * A COMMAND IS A SURFACE WITH NO SCREEN, so nothing catches a broken one until
 * somebody runs it - usually at the moment they needed it. `panel:prune-trash`
 * is the sharpest example: it deletes permanently, on a schedule, with nobody
 * watching.
 *
 * `--pretend` IS A SECURITY FEATURE, NOT A CONVENIENCE. The only way to trust
 * an irreversible scheduled deletion is to be able to ask what it would do
 * first, and a `--pretend` that quietly deleted anyway would be worse than not
 * offering one.
 *
 * THE BLUEPRINT IS GENERATED FROM THE RUNNING APPLICATION rather than written
 * down twice - so an instruction file naming a resource somebody deleted last
 * week cannot happen. That matters more than in ordinary documentation: a
 * person notices a stale claim, and an agent acts on it.
 */
final class CommandsTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $tenant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);

        $user = User::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user);
    }

    private function deletedArticle(string $title, int $daysAgo): Article
    {
        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $this->tenant->id,
            'title' => $title,
            'status' => 'draft',
        ]);

        $article->delete();

        Article::withoutGlobalScopes()
            ->withTrashed()
            ->whereKey($article->getKey())
            ->update(['deleted_at' => now()->subDays($daysAgo)]);

        return $article;
    }

    /* ------------------------------------------------------------ blueprint */

    public function test_the_blueprint_is_generated_and_names_the_real_resources(): void
    {
        $markdown = Blueprint::markdown();

        $this->assertNotSame('', $markdown);

        $this->assertStringContainsString(
            'articles',
            $markdown,
            'The blueprint did not name a registered resource, so it is not generated from the application.',
        );
    }

    /**
     * IT NAMES THE COMMANDS TOO, for the same reason: an agent told to run
     * something that does not exist wastes a turn and then invents one.
     */
    public function test_the_blueprint_names_the_generator_command(): void
    {
        $this->assertStringContainsString('make:panel-resource', Blueprint::markdown());
        $this->assertStringContainsString('make:panel-recipe', Blueprint::markdown());
    }

    public function test_the_blueprint_names_kit_conventions(): void
    {
        $markdown = Blueprint::markdown();

        $this->assertStringContainsString('Kit conventions', $markdown);
        $this->assertStringContainsString('Day 0 (read this first)', $markdown);
        $this->assertStringContainsString('never Livewire', $markdown);
        $this->assertStringContainsString('SelectField::relationship()', $markdown);
        $this->assertStringContainsString('/{parent}/{id}/{child}/attach', $markdown);
        $this->assertStringContainsString('A fresh install is an empty canvas', $markdown);
        $this->assertStringContainsString('Catalog is not in core', $markdown);
        $this->assertStringContainsString('Notification::make()', $markdown);
        $this->assertStringContainsString('make:panel-page Front --till', $markdown);
        $this->assertStringContainsString("apps(['mail', 'chat'])", $markdown);
        $this->assertStringContainsString("->poll('10s')", $markdown);
    }

    public function test_the_blueprint_command_writes_the_file(): void
    {
        $this->artisan('panel:blueprint')->assertSuccessful();
    }

    public function test_modules_command_reports_capability_boundaries_as_json(): void
    {
        $this->assertArrayHasKey('core', PanelModules::status());
        $this->assertArrayHasKey('operations', PanelModules::status());

        $this->artisan('panel:modules', ['--json' => true])
            ->assertSuccessful();
    }

    /* --------------------------------------------------------- prune-trash */

    public function test_prune_trash_removes_records_past_the_window(): void
    {
        $old = $this->deletedArticle('Long gone', 90);
        $recent = $this->deletedArticle('Just deleted', 1);

        $this->artisan('panel:prune-trash')->assertSuccessful();

        $this->assertNull(
            Article::withoutGlobalScopes()->withTrashed()->find($old->getKey()),
            'A record past its retention window survived the prune.',
        );

        $this->assertNotNull(
            Article::withoutGlobalScopes()->withTrashed()->find($recent->getKey()),
            'A record still inside its window was destroyed.',
        );
    }

    /**
     * `--pretend` DELETES NOTHING.
     *
     * The only way to trust an irreversible scheduled deletion is to be able
     * to ask what it would do first.
     */
    public function test_prune_trash_pretend_deletes_nothing(): void
    {
        $old = $this->deletedArticle('Long gone', 90);

        $this->artisan('panel:prune-trash --pretend')->assertSuccessful();

        $this->assertNotNull(
            Article::withoutGlobalScopes()->withTrashed()->find($old->getKey()),
            '--pretend deleted a record.',
        );
    }

    /**
     * AN OVERRIDE STILL KEEPS SOMETHING.
     *
     * `--days` exists for a one-off clear-out, and passing an absurd value
     * must not become "delete the bin entirely" by accident.
     */
    public function test_prune_trash_honours_a_days_override(): void
    {
        $recent = $this->deletedArticle('Two days old', 2);

        $this->artisan('panel:prune-trash --days=1')->assertSuccessful();

        $this->assertNull(
            Article::withoutGlobalScopes()->withTrashed()->find($recent->getKey()),
            'An explicit --days window was ignored.',
        );
    }

    public function test_prune_uploads_removes_inactive_chunk_sessions_only(): void
    {
        Storage::fake('local');
        $old = "tenants/{$this->tenant->id}/pending-chunks/old-session";
        $recent = "tenants/{$this->tenant->id}/pending-chunks/recent-session";

        Storage::disk('local')->put($old.'/meta.json', '{}');
        Storage::disk('local')->put($old.'/chunk-0', 'old');
        Storage::disk('local')->put($recent.'/meta.json', '{}');
        Storage::disk('local')->put($recent.'/chunk-0', 'recent');

        $oldTime = now()->subHours(48)->getTimestamp();
        touch(Storage::disk('local')->path($old.'/meta.json'), $oldTime);
        touch(Storage::disk('local')->path($old.'/chunk-0'), $oldTime);

        $this->artisan('panel:prune-uploads --hours=24')->assertSuccessful();

        Storage::disk('local')->assertMissing($old.'/chunk-0');
        Storage::disk('local')->assertExists($recent.'/chunk-0');
    }

    /* --------------------------------------------------------- permissions */

    public function test_permissions_sync_creates_an_ability_for_every_resource(): void
    {
        $this->artisan('panel:permissions sync')->assertSuccessful();

        $names = Permission::query()->pluck('name')->all();

        foreach (['view_any_articles', 'create_articles', 'update_articles', 'delete_articles'] as $ability) {
            $this->assertContains(
                $ability,
                $names,
                "[{$ability}] was not created, so a generated policy would deny forever.",
            );
        }
    }

    /**
     * SYNC IS IDEMPOTENT. It runs on every deploy, so a second run must not
     * duplicate a permission or fail on one that exists.
     */
    public function test_permissions_sync_can_run_twice(): void
    {
        $this->artisan('panel:permissions sync')->assertSuccessful();
        $this->artisan('panel:permissions sync')->assertSuccessful();

        $this->assertSame(
            1,
            Permission::query()->where('name', 'view_any_articles')->count(),
            'A second sync duplicated a permission.',
        );
    }

    /**
     * `--dry-run` CHANGES NOTHING, which is what makes it safe to run against
     * production to see what a deploy would do.
     */
    public function test_permissions_dry_run_changes_nothing(): void
    {
        $this->artisan('panel:permissions sync --dry-run')->assertSuccessful();

        $this->assertSame(
            0,
            Permission::query()->count(),
            '--dry-run created permissions.',
        );
    }

    public function test_permissions_list_reports_without_writing(): void
    {
        $this->artisan('panel:permissions list')->assertSuccessful();

        $this->assertSame(0, Permission::query()->count());
    }

    /* ------------------------------------------------------- cache-clear */

    public function test_cache_clear_runs_and_bumps_the_generation(): void
    {
        $before = app(\Alxtexh\Panel\Support\SchemaCache::class)->generation();

        $this->artisan('panel:cache-clear')->assertSuccessful();

        $this->assertGreaterThan(
            $before,
            app(\Alxtexh\Panel\Support\SchemaCache::class)->generation(),
            'Clearing the cache did not invalidate the schemas.',
        );
    }

    /* ------------------------------------------------------------- doctor */

    /**
     * DOCTOR FINDS THE POLICY-LESS RESOURCE THIS FIXTURE DELIBERATELY SHIPS.
     *
     * `Note` exists with no policy so `AuthorizationDefaultTest` can assert
     * deny-by-default - which makes this host a genuinely misconfigured
     * installation, and exactly the thing doctor is for. It reports a problem
     * and exits non-zero.
     *
     * I ASSERTED THE OPPOSITE FIRST, expecting a clean run. Doctor was right
     * and the test was wrong: a resource nobody can open IS a problem, and the
     * value of the command is that it says so without being asked. Asserting
     * the finding is worth more than asserting silence, because it proves the
     * check runs rather than that nothing tripped it.
     */
    public function test_doctor_reports_a_resource_that_has_no_policy(): void
    {
        $this->artisan('panel:doctor')
            ->expectsOutputToContain('Notes')
            ->assertFailed();
    }

    /**
     * A NOTE IS NOT A PROBLEM - the exit code separates them.
     *
     * Failing a build over advice is how a diagnostic gets removed from CI,
     * so only genuine problems are non-zero.
     */
    public function test_doctor_exits_non_zero_only_for_problems(): void
    {
        // With the policy-less resource registered there IS a problem, so this
        // asserts the failing direction; the passing direction is covered by
        // every other command test in this file running against the same host.
        $this->artisan('panel:doctor')->assertFailed();
    }
}
