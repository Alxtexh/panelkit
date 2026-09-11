<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Unit;

use Alxtexh\Panel\Tables\ListQuery;
use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use InvalidArgumentException;

/**
 * `sortableByKeyIfUnset()` is deliberately opt-in - see its own docblock.
 * These tests lock in BOTH halves of that decision: a query nobody called it
 * on still throws exactly as before (the guardrail a top-level Resource's
 * List page relies on to catch "forgot every sortable column" is untouched),
 * and a query that DOES call it gets a safe, working default instead.
 */
final class ListQuerySortableTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $tenant;

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
    }

    public function test_a_query_with_no_sortable_columns_still_throws_by_default(): void
    {
        $query = ListQuery::for(Article::class)->select(['id', 'title']);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('A list query must declare at least one sortable column.');

        $query->run(Request::create('/'));
    }

    public function test_sortable_by_key_if_unset_avoids_the_throw_and_sorts_by_the_key(): void
    {
        Article::withoutGlobalScopes()->create(['tenant_id' => $this->tenant->id, 'title' => 'Older', 'status' => 'draft']);
        Article::withoutGlobalScopes()->create(['tenant_id' => $this->tenant->id, 'title' => 'Newer', 'status' => 'draft']);

        $query = ListQuery::for(Article::class)
            ->select(['id', 'title'])
            ->sortableByKeyIfUnset();

        $result = $query->run(Request::create('/'));

        $titles = array_column($result->records, 'title');

        $this->assertSame(['Newer', 'Older'], $titles);
    }

    public function test_sortable_by_key_if_unset_does_not_override_a_real_declaration(): void
    {
        $query = ListQuery::for(Article::class)
            ->select(['id', 'title'])
            ->sortable(['title' => 'title'])
            ->defaultSort('title', 'asc')
            ->sortableByKeyIfUnset();

        Article::withoutGlobalScopes()->create(['tenant_id' => $this->tenant->id, 'title' => 'Bravo', 'status' => 'draft']);
        Article::withoutGlobalScopes()->create(['tenant_id' => $this->tenant->id, 'title' => 'Alpha', 'status' => 'draft']);

        $result = $query->run(Request::create('/'));

        $titles = array_column($result->records, 'title');

        $this->assertSame(['Alpha', 'Bravo'], $titles, 'A real sortable() declaration must win over the key fallback.');
    }
}
