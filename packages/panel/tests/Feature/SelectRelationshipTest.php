<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Forms\Fields\SelectField;
use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * BelongsTo options from the related model, plus live form-state over JSON.
 */
final class SelectRelationshipTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $mine;

    private Tenant $theirs;

    private User $user;

    private Article $article;

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

        $this->article = Article::withoutGlobalScopes()->create([
            'tenant_id' => $this->mine->id,
            'title' => 'Mine article',
            'status' => 'draft',
        ]);

        Article::withoutGlobalScopes()->create([
            'tenant_id' => $this->theirs->id,
            'title' => 'Theirs article',
            'status' => 'draft',
        ]);
    }

    public function test_relationship_search_is_tenant_scoped(): void
    {
        $field = SelectField::make('article_id')->relationship(Article::class, 'title');

        $labels = array_column($field->search('article'), 'label');

        $this->assertContains('Mine article', $labels);
        $this->assertNotContains('Theirs article', $labels);
    }

    public function test_relationship_search_matches_the_title(): void
    {
        $field = SelectField::make('article_id')->relationship(Article::class, 'title');

        $this->assertSame(['Mine article'], array_column($field->search('Mine'), 'label'));
        $this->assertSame([], $field->search('Theirs'));
    }

    public function test_field_options_endpoint_uses_the_relationship(): void
    {
        $options = $this->getJson(
            "/articles/{$this->article->getKey()}/comments/field-options?field=article_id&q=Mine",
        )->assertOk()->json('options');

        $this->assertSame(['Mine article'], array_column($options, 'label'));
    }

    public function test_form_state_returns_option_patches(): void
    {
        $payload = $this->postJson("/articles/{$this->article->getKey()}/comments/form-state", [
            'field' => 'body',
            'values' => ['body' => 'Hello'],
        ])->assertOk()->json();

        $this->assertArrayHasKey('article_id', $payload['options'] ?? []);
        $this->assertSame(['Mine article'], array_column($payload['options']['article_id'], 'label'));
    }

    public function test_live_is_on_the_form_schema(): void
    {
        $props = $this->get("/articles/{$this->article->getKey()}/comments/create")
            ->assertOk()
            ->viewData('page')['props'];

        $fields = $props['schema']['form']['fields'] ?? [];
        $keys = array_column($fields, 'key');

        $this->assertContains('article_id', $keys);
        $article = collect($fields)->firstWhere('key', 'article_id');

        $this->assertTrue($article['live'] ?? false);
        $this->assertTrue($article['searchable'] ?? false);
        $this->assertNotEmpty($article['createOption'] ?? []);
    }

    public function test_create_option_inserts_a_related_row_and_returns_the_pick(): void
    {
        $response = $this->postJson("/articles/{$this->article->getKey()}/comments/field-options", [
            'field' => 'article_id',
            'values' => [
                'title' => 'Created from picker',
                'status' => 'draft',
            ],
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('option.label', 'Created from picker');

        $created = Article::query()->find($response->json('option.value'));

        $this->assertNotNull($created);
        $this->assertSame($this->mine->id, $created->tenant_id);
        $this->assertSame('Created from picker', $created->title);
    }

    public function test_create_option_validates_required_fields(): void
    {
        $this->postJson("/articles/{$this->article->getKey()}/comments/field-options", [
            'field' => 'article_id',
            'values' => [
                'status' => 'draft',
            ],
        ])->assertStatus(422);
    }

    public function test_create_option_schema_can_carry_dialog_labels(): void
    {
        $field = SelectField::make('article_id')
            ->relationship(Article::class, 'title')
            ->createOption([
                \Alxtexh\Panel\Forms\Fields\TextField::make('title')->required(),
            ])
            ->createOptionLabel('Add article')
            ->createOptionActionLabel('New article');

        $schema = $field->toSchema();

        $this->assertSame('Add article', $schema['createOptionLabel']);
        $this->assertSame('New article', $schema['createOptionActionLabel']);
    }

    /**
     * WITHOUT THIS, an Edit page for any `relationship()` field showed the
     * raw foreign key instead of the related record's name until you opened
     * the search and picked the same value again - `chosenLabel` on the
     * client only ever learns a label from `pick()`, never from the value a
     * record already has. `ResourceController::edit()` now resolves that
     * one label via `Form::currentValueOptions()` and folds it into
     * `formOptions`; this is the HTTP-level proof it actually reaches the
     * page. See `SelectField::resolveCurrentOption()`'s own docblock.
     */
    public function test_edit_page_resolves_the_current_relationship_value_to_a_label(): void
    {
        $comment = \Alxtexh\Panel\Tests\Fixtures\Models\Comment::create([
            'tenant_id' => $this->mine->id,
            'article_id' => $this->article->getKey(),
            'body' => 'Existing comment',
        ]);

        $props = $this->get("/articles/{$this->article->getKey()}/comments/{$comment->getKey()}/edit")
            ->assertOk()
            ->viewData('page')['props'];

        $options = $props['formOptions']['article_id'] ?? [];

        $this->assertSame([[
            'value' => $this->article->getKey(),
            'label' => 'Mine article',
        ]], $options);
    }

    public function test_another_tenants_id_fails_relationship_validation(): void
    {
        $foreign = Article::withoutGlobalScopes()
            ->where('tenant_id', $this->theirs->id)
            ->first();

        $this->from("/articles/{$this->article->getKey()}/comments/create")
            ->post("/articles/{$this->article->getKey()}/comments", [
                'body' => 'Nope',
                'article_id' => $foreign->getKey(),
            ])
            ->assertSessionHasErrors('article_id');

        $this->assertSame(
            0,
            \Alxtexh\Panel\Tests\Fixtures\Models\Comment::query()->where('body', 'Nope')->count(),
        );
    }
}
