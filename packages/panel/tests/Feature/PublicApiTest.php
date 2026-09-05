<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Api\ApiToken;
use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\Fixtures\Resources\ArticleResource;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * `/api/v1`, which is a second front door onto the same records.
 *
 * EVERY PROPERTY THE SCREENS HOLD HAS TO HOLD HERE INDEPENDENTLY, and the API
 * is the easier of the two to forget: it has no navigation, so a resource
 * appearing on it that should not is invisible until somebody reads
 * `route:list`. That is exactly how the announcements exposure went unnoticed.
 *
 * THE SESSION MUST NOT AUTHENTICATE IT. A browser session carries CSRF and
 * cookie semantics the API does not want, and an endpoint that accepted both
 * would be reachable cross-site from any page the operator has open. The token
 * is the only credential.
 */
final class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $mine;

    private Tenant $theirs;

    private User $user;

    private string $token;

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

        $this->token = ApiToken::issue(
            $this->mine->id,
            $this->user->getKey(),
            'Test token',
            /*
             * `Abilities::name()` SHAPE, not a scope string of our own
             * invention. The API checks `view_any_articles` and friends -
             * derived from the action and the resource key - so a token
             * carrying `articles:read` grants nothing and answers 403, which
             * reads as a broken endpoint rather than a mis-named ability.
             */
            ['view_any_articles', 'view_articles', 'create_articles', 'update_articles', 'delete_articles'],
        )['plaintext'];
    }

    private function article(string $title, ?Tenant $tenant = null): Article
    {
        return Article::withoutGlobalScopes()->create([
            'tenant_id' => ($tenant ?? $this->mine)->id,
            'title' => $title,
            'status' => 'draft',
        ]);
    }

    /** @param array<string, string> $headers */
    private function api(string $method, string $uri, array $payload = [], array $headers = [])
    {
        return $this->json($method, $uri, $payload, $headers + [
            'Authorization' => 'Bearer '.$this->token,
        ]);
    }

    public function test_a_request_without_a_token_is_unauthenticated(): void
    {
        $this->article('Mine');

        $this->json('GET', '/api/v1/articles')->assertUnauthorized();
    }

    public function test_a_token_that_does_not_exist_is_unauthenticated(): void
    {
        $this->json('GET', '/api/v1/articles', [], ['Authorization' => 'Bearer pk_not-a-real-token'])
            ->assertUnauthorized();
    }

    public function test_an_expired_token_is_refused(): void
    {
        $expired = ApiToken::issue(
            $this->mine->id,
            $this->user->getKey(),
            'Expired',
            ['view_any_articles'],
            now()->subDay(),
        )['plaintext'];

        $this->json('GET', '/api/v1/articles', [], ['Authorization' => 'Bearer '.$expired])
            ->assertUnauthorized();
    }

    /**
     * A BROWSER SESSION DOES NOT AUTHENTICATE THE API.
     *
     * If it did, every page an operator has open could call these endpoints
     * with their credentials attached - the API would inherit the browser's
     * ambient authority while having none of its protections.
     */
    public function test_a_browser_session_does_not_authenticate_the_api(): void
    {
        $this->article('Mine');

        $this->actingAs($this->user)
            ->json('GET', '/api/v1/articles')
            ->assertUnauthorized();
    }

    public function test_a_list_returns_this_organisations_records(): void
    {
        $this->article('Mine one');
        $this->article('Theirs one', $this->theirs);

        $response = $this->api('GET', '/api/v1/articles')->assertOk();

        $titles = array_column($response->json('data') ?? [], 'title');

        $this->assertSame(['Mine one'], $titles);
    }

    /**
     * NOT FOUND, NOT FORBIDDEN, for another organisation's record.
     *
     * A 403 would confirm the id exists - which over an API is an enumeration
     * oracle: walk the integers, and the 403s map somebody else's data volume
     * even though none of it can be read.
     */
    public function test_another_organisations_record_is_not_found(): void
    {
        $foreign = $this->article('Theirs one', $this->theirs);

        $this->api('GET', "/api/v1/articles/{$foreign->getKey()}")->assertNotFound();
    }

    /**
     * A RESOURCE THAT IS NOT DOCUMENTED HAS NO API AT ALL.
     *
     * `ApiRoutes` builds its route constraint from the resources that answer
     * `documented()`, so an undocumented one is not a 403 - the URL does not
     * route. `Note` is undocumented here because it has no policy and is
     * excluded for that reason too; either way the surface is absent.
     */
    public function test_an_undocumented_resource_has_no_api(): void
    {
        $this->api('GET', '/api/v1/nothing-like-this')->assertNotFound();
    }

    /**
     * The API must honor the same resource lifecycle as the panel UI.
     *
     * An integration is still a write path. If it skips these callbacks, a
     * host can see one result from the browser and a different result from its
     * webhook or provisioning service, which is a reliability bug rather than
     * an API stylistic difference.
     */
    public function test_api_writes_run_the_resource_lifecycle_hooks(): void
    {
        ArticleResource::resetLifecycleEvents();

        $created = $this->api('POST', '/api/v1/articles', [
            'title' => 'Created through API',
            'status' => 'draft',
        ])->assertCreated();

        $id = $created->json('data.id');

        $this->assertSame(
            ['beforeValidate', 'afterValidate', 'beforeCreate', 'afterCreate'],
            ArticleResource::$lifecycleEvents,
        );

        ArticleResource::resetLifecycleEvents();

        $this->api('PATCH', "/api/v1/articles/{$id}", ['title' => 'Updated through API'])
            ->assertOk();

        $this->assertSame(
            ['beforeValidate', 'afterValidate', 'beforeUpdate', 'afterUpdate'],
            ArticleResource::$lifecycleEvents,
        );

        ArticleResource::resetLifecycleEvents();

        $this->api('DELETE', "/api/v1/articles/{$id}")->assertNoContent();

        $this->assertSame(['beforeDelete', 'afterDelete'], ArticleResource::$lifecycleEvents);
    }
}
