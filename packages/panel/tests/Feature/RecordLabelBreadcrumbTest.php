<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * `ResourceController::recordLabel()` - the breadcrumb and the Edit page's
 * record chip used to check `$record->name ?? "#{id}"` literally, never
 * `Resource::recordTitle()`. `articles` has a `title` column, not `name` -
 * so this was already reproducible on an EXISTING fixture, not only on the
 * Order resource a docs-only fresh-developer test caught it on live: the
 * View page's own H1 correctly read the article's title (via
 * `record._title`, wired separately), while the breadcrumb one line above
 * it, and the Edit page's record chip, both still showed a raw `#id`.
 */
final class RecordLabelBreadcrumbTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_view_pages_breadcrumb_uses_record_title_not_a_raw_id(): void
    {
        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);
        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);
        $this->actingAs($user);

        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'A Genuinely Titled Article',
            'status' => 'draft',
        ]);

        $breadcrumbs = $this->get("/articles/{$article->getKey()}")
            ->assertOk()
            ->viewData('page')['props']['breadcrumbs'] ?? [];

        $leaf = end($breadcrumbs);

        $this->assertSame('A Genuinely Titled Article', $leaf['title'] ?? null);
        $this->assertNotSame("#{$article->getKey()}", $leaf['title'] ?? null);
    }

    public function test_the_edit_pages_record_chip_uses_record_title_not_a_raw_id(): void
    {
        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);
        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);
        $this->actingAs($user);

        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Another Titled Article',
            'status' => 'draft',
        ]);

        $record = $this->get("/articles/{$article->getKey()}/edit")
            ->assertOk()
            ->viewData('page')['props']['record'] ?? [];

        $this->assertSame('Another Titled Article', $record['label'] ?? null);
        $this->assertNotSame("#{$article->getKey()}", $record['label'] ?? null);
    }
}
