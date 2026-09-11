<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * `ResourceController::show()` used to fetch the View page's data through
 * `table()`'s own query - so an `infolist()` entry for an attribute the list
 * never happened to display rendered `—` even though the value genuinely
 * existed (`SupportTicketResource::description`, from a real docs-only
 * fresh-developer build, was the case that exposed it live). The View page's
 * selection now comes from `infolist()`'s own declared entries
 * (`ResourceController::infolistSelect()`), the same way `table()`'s columns
 * already drove the List page's - see `Entry`/`HasQualifiedSource`.
 *
 * `ArticleResource` is used here rather than a new fixture: `snippet`,
 * `meta`, `accent` and `cover` were ALREADY infolist-only (absent from
 * `table()->columns()`) before this fix landed, and `price`/`tenant_name`
 * were added specifically to exercise the table-shared and joined-relation
 * cases - real gaps this fix closes, not a fixture engineered to order.
 */
final class InfolistDataSelectionTest extends TestCase
{
    use RefreshDatabase;

    private function actingOperator(): Tenant
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

        return $tenant;
    }

    /** Checklist item 1: an infolist-only database attribute reaches the View page. */
    public function test_an_infolist_only_attribute_reaches_the_view_page(): void
    {
        $tenant = $this->actingOperator();

        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Headline',
            'status' => 'published',
            'snippet' => 'A short, real snippet - never shown on the List page.',
        ]);

        $record = $this->get("/articles/{$article->getKey()}")
            ->assertOk()
            ->viewData('page')['props']['record'] ?? [];

        $this->assertSame(
            'A short, real snippet - never shown on the List page.',
            $record['snippet'] ?? null,
        );
    }

    /** Checklist item 2: table() membership does not change View output either way. */
    public function test_table_membership_does_not_affect_whether_a_value_reaches_the_view(): void
    {
        $tenant = $this->actingOperator();

        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Headline',
            'status' => 'published',
            'price' => 12599, // in BOTH table() and infolist()
            'snippet' => 'infolist-only, never a table column',
        ]);

        $record = $this->get("/articles/{$article->getKey()}")
            ->assertOk()
            ->viewData('page')['props']['record'] ?? [];

        // Both reach the View correctly - membership in table() is irrelevant
        // to whether an infolist entry gets its value.
        $this->assertSame(12599, $record['price'] ?? null);
        $this->assertSame('infolist-only, never a table column', $record['snippet'] ?? null);
    }

    /** Checklist item 3: a table-only attribute does not leak into the View's own selection. */
    public function test_a_table_only_attribute_does_not_leak_into_the_view_selection(): void
    {
        $tenant = $this->actingOperator();

        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Headline',
            'status' => 'published',
            'slug' => 'table-only-slug',
        ]);

        $record = $this->get("/articles/{$article->getKey()}")
            ->assertOk()
            ->viewData('page')['props']['record'] ?? [];

        // `slug` is a table() column with no matching infolist entry - the
        // View's own selection must not carry it just because the list does.
        $this->assertArrayNotHasKey('slug', $record);
    }

    /**
     * Checklist item 4: relationship display behaviour matches the documented
     * contract. `TextEntry::make('tenant_name')->from('tenants.name')` is the
     * PanelKit-native mechanism - the same join+`from()` a `Column` already
     * uses - not `TextEntry::make('tenant.name')` dot notation, which
     * PanelKit does not support: see `HasQualifiedSource`'s docblock for why
     * a join stays a join rather than becoming a per-row relation access.
     */
    public function test_a_joined_relationship_value_reaches_the_view_through_from(): void
    {
        $tenant = $this->actingOperator();

        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Headline',
            'status' => 'published',
        ]);

        $record = $this->get("/articles/{$article->getKey()}")
            ->assertOk()
            ->viewData('page')['props']['record'] ?? [];

        $this->assertSame('Mine', $record['tenant_name'] ?? null);
    }

    /**
     * Checklist item 5: null values still reach the View as null, present
     * rather than missing or coerced. The muted-dash RENDERING is
     * `InfoNode.vue`'s concern, unchanged by this fix and not re-tested here
     * - this proves the payload it renders from is correct.
     */
    public function test_a_null_attribute_still_reaches_the_view_as_null(): void
    {
        $tenant = $this->actingOperator();

        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Headline',
            'status' => 'published',
            'accent' => null,
        ]);

        $record = $this->get("/articles/{$article->getKey()}")
            ->assertOk()
            ->viewData('page')['props']['record'] ?? [];

        $this->assertArrayHasKey('accent', $record);
        $this->assertNull($record['accent']);
    }

    /** Checklist item 6: authorization is unaffected by where the View's selection now comes from. */
    public function test_authorization_still_gates_the_view_page(): void
    {
        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);
        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Headline',
            'status' => 'published',
        ]);

        // No actingAs() at all - `auth:web` must still turn this away before
        // `infolistSelect()`, or anything past it, ever runs.
        $this->get("/articles/{$article->getKey()}")->assertRedirect('/login');
    }
}
