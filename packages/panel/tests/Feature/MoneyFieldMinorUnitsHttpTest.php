<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * The HTTP-level twin of `MoneyFieldMinorUnitsTest` - proving the round trip
 * through real Create/Edit requests, not only the field's own `presentValue()`
 * / `transformForStorage()` in isolation. `articles.price` is the same
 * column `MoneyColumn::make('price')` (List) and `MoneyEntry::make('price')`
 * (View) already read in `ArticleResource` - all three now agree it is
 * minor units (cents).
 */
final class MoneyFieldMinorUnitsHttpTest extends TestCase
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

    public function test_creating_a_record_stores_the_typed_major_unit_amount_as_minor_units(): void
    {
        $this->actingOperator();

        $this->post('/articles', [
            'title' => 'New Article',
            'status' => 'draft',
            'price' => '125.00',
        ])->assertRedirect();

        $article = Article::withoutGlobalScopes()->where('title', 'New Article')->firstOrFail();

        $this->assertSame(12500, $article->price);
    }

    public function test_the_edit_form_shows_the_major_unit_amount_not_the_raw_stored_cents(): void
    {
        $tenant = $this->actingOperator();

        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Existing',
            'status' => 'draft',
            'price' => 12500,
        ]);

        $values = $this->get("/articles/{$article->getKey()}/edit")
            ->assertOk()
            ->viewData('page')['props']['values'] ?? [];

        $this->assertSame('125.00', $values['price'] ?? null);
    }

    public function test_submitting_the_edit_form_unchanged_stores_the_same_minor_units(): void
    {
        $tenant = $this->actingOperator();

        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Existing',
            'status' => 'draft',
            'price' => 12500,
        ]);

        $this->put("/articles/{$article->getKey()}", [
            'title' => 'Existing',
            'status' => 'draft',
            'price' => '125.00',
        ])->assertRedirect();

        $this->assertSame(12500, $article->fresh()->price);
    }

    public function test_changing_the_amount_in_the_edit_form_stores_the_new_minor_units(): void
    {
        $tenant = $this->actingOperator();

        $article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Existing',
            'status' => 'draft',
            'price' => 12500,
        ]);

        $this->put("/articles/{$article->getKey()}", [
            'title' => 'Existing',
            'status' => 'draft',
            'price' => '130.50',
        ])->assertRedirect();

        $this->assertSame(13050, $article->fresh()->price);
    }

    /**
     * `MoneyColumn::make('price')->currency('USD')` and
     * `MoneyEntry::make('price')->currency('USD')->divideBy(100)` display the
     * SAME raw stored integer this stores - proving the three don't disagree,
     * not merely that each is individually correct in isolation.
     */
    public function test_the_stored_value_agrees_with_what_moneycolumn_and_moneyentry_display(): void
    {
        $tenant = $this->actingOperator();

        $this->post('/articles', [
            'title' => 'Symmetry Check',
            'status' => 'draft',
            'price' => '199.99',
        ])->assertRedirect();

        $article = Article::withoutGlobalScopes()->where('title', 'Symmetry Check')->firstOrFail();
        $this->assertSame(19999, $article->price);

        $records = $this->get('/articles')
            ->assertOk()
            ->viewData('page')['props']['records'] ?? [];
        $listPrice = collect($records)->firstWhere('id', $article->getKey())['price'] ?? null;

        $viewRecord = $this->get("/articles/{$article->getKey()}")
            ->assertOk()
            ->viewData('page')['props']['record'] ?? [];

        // The raw minor-unit integer, identical everywhere - each screen's
        // OWN `divideBy`/`major` schema flag is what turns it into "$199.99"
        // client-side, not a different server-side value per screen.
        $this->assertSame(19999, $listPrice);
        $this->assertSame(19999, $viewRecord['price'] ?? null);
    }
}
