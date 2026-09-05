<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Billing\GenericBillingWebhookAdapter;
use Alxtexh\Panel\Imports\Importer;
use Alxtexh\Panel\Testing\InteractsWithPanels;
use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Tag;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use PHPUnit\Framework\AssertionFailedError;

/**
 * The exported test helpers, used the way somebody else would use them.
 *
 * A helper nobody exercises is a helper that breaks the first time the props
 * are renamed, in THEIR suite, on an upgrade.
 */
final class TestingHelpersTest extends TestCase
{
    use InteractsWithPanels;
    use RefreshDatabase;

    private Tenant $mine;

    private Tenant $theirs;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mine = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);
        $this->theirs = Tenant::create(['name' => 'Theirs', 'slug' => 'theirs']);

        $this->user = User::create([
            'tenant_id' => $this->mine->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($this->user);
        $this->app['config']->set('queue.default', 'sync');
    }

    private function article(Tenant $tenant, string $title): Article
    {
        return Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => $title,
            'status' => 'draft',
        ]);
    }

    public function test_it_keeps_tenant_isolation(): void
    {
        $theirs = $this->article($this->theirs, 'Theirs');

        $this->assertTenantIsolation($this->user, 'articles', $theirs);
    }

    public function test_the_isolation_helper_fails_when_a_record_is_visible(): void
    {
        $mine = $this->article($this->mine, 'Mine');

        try {
            $this->assertTenantIsolation($this->user, 'articles', $mine);
            $this->fail('The isolation helper passed for a visible record.');
        } catch (AssertionFailedError) {
            $this->addToAssertionCount(1);
        }
    }

    public function test_form_state_returns_options_schema_and_values(): void
    {
        $payload = $this->assertFormState($this->user, 'articles', [
            'field' => 'title',
            'values' => ['title' => 'hide-status', 'status' => 'draft'],
        ]);

        $this->assertIsArray($payload['options']);
        $this->assertIsArray($payload['schema']);
        $this->assertIsArray($payload['values']);
    }

    public function test_nested_form_state_uses_the_parent_url(): void
    {
        $article = $this->article($this->mine, 'Parent');

        $payload = $this->assertFormState(
            $this->user,
            'articles',
            ['field' => 'body', 'values' => ['body' => 'Hello']],
            $article->getKey().'/comments/form-state',
        );

        $this->assertArrayHasKey('article_id', $payload['options']);
    }

    public function test_nested_attach_and_detach(): void
    {
        $article = $this->article($this->mine, 'Parent');
        $tag = Tag::withoutGlobalScopes()->create([
            'tenant_id' => $this->mine->id,
            'name' => 'Draft',
        ]);

        $this->assertNestedAttach($this->user, 'articles', $article, 'tags', $tag->getKey());
        $this->assertTrue($article->tags()->whereKey($tag->getKey())->exists());

        $this->assertNestedDetach($this->user, 'articles', $article, 'tags', $tag);
        $this->assertFalse($article->tags()->whereKey($tag->getKey())->exists());
        $this->assertNotNull(Tag::query()->find($tag->getKey()));
    }

    public function test_infolist_action(): void
    {
        $article = $this->article($this->mine, 'Headline');

        $this->assertInfolistAction($this->user, 'articles', $article, 'copy');
        $this->assertSame('copied', $article->fresh()->status);
    }

    public function test_importable_404_vs_csv_and_failures_download(): void
    {
        if (! class_exists(Importer::class)) {
            $this->markTestSkipped('Import helper tests require panel-operations.');
        }

        $this->assertNotImportable($this->user, 'posts');

        $ok = $this->assertPanelImports(
            $this->user,
            'articles',
            "title,status\nImported,draft\n",
            ['title' => 'title', 'status' => 'status'],
            dryRun: true,
        );

        $this->assertSame(1, $ok['importable'] ?? null);
        $this->assertSame(0, Article::query()->where('title', 'Imported')->count());

        $failed = $this->assertPanelImports(
            $this->user,
            'articles',
            "title,status\n,draft\n",
            ['title' => 'title', 'status' => 'status'],
        );

        $this->assertImportFailuresDownload($this->user, 'articles', $failed);
    }

    public function test_empty_grants_hint(): void
    {
        Gate::before(static fn (): bool => false);

        $this->assertEmptyGrantsHint($this->user);
    }

    public function test_billing_helpers_redirect_and_render_the_suspended_screen(): void
    {
        app(PanelManager::class)->panel('admin')
            ->billingState(fn (): array => ['status' => 'suspended']);

        $this->assertBillingSuspendedRedirect($this->user, '/posts', '/account/suspended');
        $this->assertSuspendedPageRenders($this->user);
        $this->assertBillingAllows($this->user, '/account/suspended');
    }

    public function test_billing_allows_when_the_state_is_active(): void
    {
        app(PanelManager::class)->panel('admin')
            ->billingState(fn (): array => ['status' => 'active']);

        $this->assertBillingAllows($this->user, '/posts');
    }

    public function test_billing_webhook_helper_accepts_a_generic_payload(): void
    {
        if (! class_exists(GenericBillingWebhookAdapter::class)) {
            $this->markTestSkipped('Billing webhook helper tests require panel-billing.');
        }

        app(PanelManager::class)->panel('admin')
            ->billingWebhookVerifier(static fn (): bool => true);

        $this->assertBillingWebhookAccepted([
            'billable_type' => 'tenant',
            'billable_key' => (string) $this->mine->id,
            'status' => 'past_due',
        ]);
    }
}
