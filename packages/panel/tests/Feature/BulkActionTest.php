<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\Fixtures\Resources\ArticleResource;
use Alxtexh\Panel\Actions\BulkAction;
use Alxtexh\Panel\Actions\BulkRunner;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Alxtexh\Panel\Jobs\RunBulkAction;

/**
 * One decision applied to many rows.
 *
 * THE DANGEROUS PROPERTY IS THE SELECTION, not the mutation. A record action
 * touches the row in the URL; a bulk action touches whatever list of ids the
 * request supplies, so the ids are attacker-controlled input that names rows
 * directly. Everything below is about what happens when that list contains
 * something it should not.
 *
 * THE OTHER HALF IS THE MUTATION'S ORIGIN. `mutate()` is declared on the
 * action server-side. If the payload could carry columns, "run the action
 * named publish on these forty rows" would become "set any column to anything
 * on any forty rows", which is a different and much larger endpoint.
 */
final class BulkActionTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $mine;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mine = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);

        $this->user = User::create([
            'tenant_id' => $this->mine->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($this->user);
    }

    /** @return list<int> */
    private function makeArticles(int $count, ?Tenant $tenant = null): array
    {
        $ids = [];

        for ($i = 0; $i < $count; $i++) {
            $ids[] = Article::withoutGlobalScopes()->create([
                'tenant_id' => ($tenant ?? $this->mine)->id,
                'title' => "Article {$i}",
                'status' => 'draft',
            ])->getKey();
        }

        return $ids;
    }

    public function test_an_explicit_selection_runs_and_writes(): void
    {
        $ids = $this->makeArticles(3);

        $this->postJson('/articles/bulk', ['action' => 'publish', 'ids' => $ids])
            ->assertSuccessful();

        $this->assertSame(3, Article::query()->where('status', 'published')->count());
    }

    public function test_bulk_runner_can_skip_records_refused_by_individual_authorization(): void
    {
        $ids = $this->makeArticles(3);
        $action = BulkAction::make('publish', 'Publish')
            ->authorizeIndividualRecords()
            ->mutate(['status' => 'published']);
        $list = ArticleResource::definition()->toListQuery(Article::class);

        $affected = app(BulkRunner::class)->run(
            $action,
            $list->matching(request()),
            Article::class,
            $list->keyColumnName(),
            null,
            [],
            static fn (Article $article): bool => $article->getKey() !== $ids[1],
        );

        $this->assertSame(2, $affected);
        $this->assertSame('draft', Article::withoutGlobalScopes()->find($ids[1])->status);
        $this->assertSame(2, Article::query()->where('status', 'published')->count());
    }

    /**
     * THE SELECTION IS FILTERED BY THE SCOPE, not trusted as given.
     *
     * The ids arrive in the body. A runner that took them at face value would
     * let anybody publish, suspend or delete another organisation's rows by
     * guessing integers - and bulk is the worst place for that, because one
     * request reaches many rows.
     */
    public function test_another_tenants_ids_are_not_written(): void
    {
        $theirs = Tenant::create(['name' => 'Theirs', 'slug' => 'theirs']);

        $mine = $this->makeArticles(2);
        $foreign = $this->makeArticles(2, $theirs);

        $this->postJson('/articles/bulk', [
            'action' => 'publish',
            'ids' => [...$mine, ...$foreign],
        ])->assertSuccessful();

        foreach ($foreign as $id) {
            $this->assertSame(
                'draft',
                Article::withoutGlobalScopes()->find($id)->status,
                'A bulk action wrote to another organisation’s row.',
            );
        }

        foreach ($mine as $id) {
            $this->assertSame('published', Article::withoutGlobalScopes()->find($id)->status);
        }
    }

    /**
     * THE REQUEST CANNOT SUPPLY ITS OWN MUTATION.
     *
     * Same property as the row menu, and it matters more here: one accepted
     * payload would rewrite every selected row rather than one.
     */
    public function test_the_request_cannot_supply_its_own_mutation(): void
    {
        $ids = $this->makeArticles(2);

        $this->postJson('/articles/bulk', [
            'action' => 'publish',
            'ids' => $ids,
            'attributes' => ['title' => 'Overwritten'],
            'title' => 'Overwritten',
        ])->assertSuccessful();

        foreach ($ids as $i => $id) {
            $row = Article::withoutGlobalScopes()->find($id);

            $this->assertSame("Article {$i}", $row->title);
            $this->assertSame('published', $row->status);
        }
    }

    public function test_an_unknown_action_is_rejected(): void
    {
        $ids = $this->makeArticles(2);

        // 404, matching the row menu: an action the resource never declared
        // does not exist, rather than being a malformed request.
        $this->postJson('/articles/bulk', ['action' => 'drop-everything', 'ids' => $ids])
            ->assertNotFound();

        $this->assertSame(0, Article::query()->where('status', 'published')->count());
    }

    public function test_guests_cannot_run_bulk_actions(): void
    {
        $ids = $this->makeArticles(2);

        auth()->logout();

        $this->postJson('/articles/bulk', ['action' => 'publish', 'ids' => $ids])
            ->assertUnauthorized();

        $this->assertSame(0, Article::withoutGlobalScopes()->where('status', 'published')->count());
    }

    /**
     * ONE STATEMENT, NOT ONE PER ROW.
     *
     * A bulk action that loaded each model and saved it would be fine at three
     * rows and a timeout at three thousand - and three thousand is exactly when
     * somebody reaches for bulk. The count is asserted rather than the
     * duration, because a timing assertion is a flaky test.
     */
    public function test_a_bulk_mutation_does_not_run_one_query_per_record(): void
    {
        $ids = $this->makeArticles(20);

        DB::enableQueryLog();
        DB::flushQueryLog();

        $this->postJson('/articles/bulk', ['action' => 'publish', 'ids' => $ids])
            ->assertSuccessful();

        $writes = array_filter(
            DB::getQueryLog(),
            static fn (array $q): bool => str_starts_with(strtolower(trim($q['query'])), 'update'),
        );

        DB::disableQueryLog();

        $this->assertLessThanOrEqual(
            2,
            count($writes),
            'A bulk mutation issued one UPDATE per record: '.count($writes).' for 20 rows.',
        );
    }

    public function test_a_queued_bulk_retry_with_the_same_key_dispatches_once(): void
    {
        Queue::fake();
        config(['panel.bulk.queue_threshold' => 1]);
        $ids = $this->makeArticles(2);

        $payload = ['action' => 'publish', 'ids' => $ids, 'idempotencyKey' => 'bulk-retry'];

        $this->postJson('/articles/bulk', $payload)->assertOk();
        $this->postJson('/articles/bulk', $payload)->assertOk();

        Queue::assertPushed(RunBulkAction::class, 1);
    }

    public function test_a_queued_bulk_key_cannot_be_reused_for_different_rows(): void
    {
        Queue::fake();
        config(['panel.bulk.queue_threshold' => 1]);
        $ids = $this->makeArticles(3);

        $this->postJson('/articles/bulk', [
            'action' => 'publish',
            'ids' => [$ids[0], $ids[1]],
            'idempotencyKey' => 'bulk-retry',
        ])->assertOk();

        $this->postJson('/articles/bulk', [
            'action' => 'publish',
            'ids' => [$ids[1], $ids[2]],
            'idempotencyKey' => 'bulk-retry',
        ])->assertStatus(409);

        Queue::assertPushed(RunBulkAction::class, 1);
    }
}
