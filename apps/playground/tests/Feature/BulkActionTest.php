<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Demo\Models\Client;
use App\Models\Plan;
use App\Demo\Models\Router;
use App\Models\Tenant;
use App\Models\User;
use App\Demo\Panel\Resources\ClientResource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Alxtexh\Panel\Actions\BulkAction;
use Alxtexh\Panel\Actions\BulkRunner;
use Alxtexh\Panel\Actions\JobStatus;
use Alxtexh\Panel\Jobs\ExportRecords;
use Alxtexh\Panel\Jobs\RunBulkAction;
use Tests\TestCase;

/**
 * Bulk mutations and exports.
 *
 * A bulk endpoint is the most dangerous surface in a panel: it writes many rows
 * at once, on behalf of a client that can lie about what it selected. The cases
 * below are ordered by what an attacker would try first.
 */
final class BulkActionTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $tenantA;

    private Tenant $tenantB;

    private User $userA;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenantA = Tenant::create(['name' => 'A', 'slug' => 'a']);
        $this->tenantB = Tenant::create(['name' => 'B', 'slug' => 'b']);
        $this->userA = User::factory()->create([
            'tenant_id' => $this->tenantA->id,
            'email_verified_at' => now(),
        ]);
    }

    /* ------------------------------------------------------------- the basics */

    public function test_an_explicit_selection_runs_inline_and_writes(): void
    {
        $ids = $this->seedClients($this->tenantA, 3, 'active');

        $this->actingAs($this->userA)
            ->postJson('/clients/bulk', ['action' => 'suspend', 'ids' => $ids])
            ->assertOk()
            ->assertJson(['status' => JobStatus::DONE, 'affected' => 3]);

        $this->assertSame(
            3,
            Client::withoutGlobalScopes()->whereIn('id', $ids)->where('status', 'suspended')->count(),
        );
    }

    /**
     * A bulk write must move `updated_at`, or the change is invisible to the
     * live-update diff and an open table never learns about it.
     */
    public function test_a_bulk_mutation_touches_the_timestamp(): void
    {
        $ids = $this->seedClients($this->tenantA, 1, 'active');

        Client::withoutGlobalScopes()->whereIn('id', $ids)->update(['updated_at' => '2020-01-01 00:00:00']);

        $this->actingAs($this->userA)
            ->postJson('/clients/bulk', ['action' => 'suspend', 'ids' => $ids])
            ->assertOk();

        $this->assertTrue(
            Client::withoutGlobalScopes()->find($ids[0])->updated_at->isToday(),
            'A row whose updated_at did not move is invisible to the poll driver.',
        );
    }

    /* ------------------------------------------------------------- the attacks */

    /**
     * THE ONE THAT MATTERS MOST. Another tenant's ids are simply not in the
     * scoped set, so they are never selected and never written.
     */
    public function test_another_tenants_ids_are_not_written(): void
    {
        $mine = $this->seedClients($this->tenantA, 2, 'active');
        $theirs = $this->seedClients($this->tenantB, 2, 'active');

        $this->actingAs($this->userA)
            ->postJson('/clients/bulk', ['action' => 'suspend', 'ids' => [...$mine, ...$theirs]])
            ->assertOk()
            // Two, not four: the foreign ids matched nothing.
            ->assertJson(['affected' => 2]);

        $this->assertSame(
            2,
            Client::withoutGlobalScopes()->whereIn('id', $theirs)->where('status', 'active')->count(),
            "Tenant B's rows must be untouched.",
        );
    }

    /**
     * The client names an action; it never describes one. An attribute set in
     * the request body must not reach the update.
     */
    public function test_the_request_cannot_supply_its_own_mutation(): void
    {
        $ids = $this->seedClients($this->tenantA, 1, 'active');

        $this->actingAs($this->userA)
            ->postJson('/clients/bulk', [
                'action' => 'suspend',
                'ids' => $ids,
                // All ignored: only the declared mutation runs.
                'mutate' => ['access_code' => 'HACKED'],
                'attributes' => ['tenant_id' => $this->tenantB->id],
            ])
            ->assertOk();

        $client = Client::withoutGlobalScopes()->find($ids[0]);

        $this->assertNotSame('HACKED', $client->access_code);
        $this->assertSame($this->tenantA->id, $client->tenant_id);
        $this->assertSame('suspended', $client->status);
    }

    public function test_an_unknown_action_is_rejected(): void
    {
        $ids = $this->seedClients($this->tenantA, 1, 'active');

        $this->actingAs($this->userA)
            ->postJson('/clients/bulk', ['action' => 'wipe_everything', 'ids' => $ids])
            ->assertNotFound();
    }

    public function test_guests_cannot_run_bulk_actions(): void
    {
        $this->postJson('/clients/bulk', ['action' => 'suspend', 'ids' => [1]])
            ->assertUnauthorized();
    }

    /** An explicit selection is bounded; the unbounded case is select-all. */
    public function test_an_oversized_explicit_selection_is_rejected(): void
    {
        $this->actingAs($this->userA)
            ->postJson('/clients/bulk', ['action' => 'suspend', 'ids' => range(1, 1001)])
            ->assertStatus(422);
    }

    /* -------------------------------------------------------------- the queue */

    /** Unbounded work is queued rather than run in a web request. */
    public function test_select_all_matching_is_queued(): void
    {
        Bus::fake();
        $this->seedClients($this->tenantA, 3, 'active');

        $response = $this->actingAs($this->userA)
            ->postJson('/clients/bulk?status=active', ['action' => 'suspend', 'all' => true])
            ->assertOk();

        $response->assertJson(['status' => JobStatus::PENDING]);
        $this->assertNotEmpty($response->json('token'));

        Bus::assertDispatched(RunBulkAction::class);
    }

    /**
     * The queued job carries FILTERS, and re-derives the set as the user.
     *
     * A worker has no session, so if the job did not re-establish the actor the
     * tenant scope would resolve nothing and it would silently write zero rows.
     */
    public function test_the_queued_job_applies_the_filters_as_the_user(): void
    {
        $active = $this->seedClients($this->tenantA, 3, 'active');
        $expired = $this->seedClients($this->tenantA, 2, 'expired');
        $other = $this->seedClients($this->tenantB, 4, 'active');

        $token = JobStatus::token();
        JobStatus::start($token, $this->userA->id, 'bulk:suspend');

        // Dispatched synchronously, exactly as the worker would run it.
        (new RunBulkAction('clients', 'suspend', ['status' => 'active'], $this->userA->id, $token))
            ->handle(app(BulkRunner::class));

        $this->assertSame(3, Client::withoutGlobalScopes()->whereIn('id', $active)->where('status', 'suspended')->count());
        $this->assertSame(2, Client::withoutGlobalScopes()->whereIn('id', $expired)->where('status', 'expired')->count(), 'The filter excluded these.');
        $this->assertSame(4, Client::withoutGlobalScopes()->whereIn('id', $other)->where('status', 'active')->count(), 'Another tenant is out of scope.');

        $this->assertSame(JobStatus::DONE, JobStatus::get($token, $this->userA->id)['status']);
    }

    public function test_a_redelivered_completed_bulk_job_is_a_noop(): void
    {
        $ids = $this->seedClients($this->tenantA, 3, 'active');
        $token = JobStatus::token();
        JobStatus::start($token, $this->userA->id, 'bulk:suspend');

        $job = new RunBulkAction('clients', 'suspend', ['status' => 'active'], $this->userA->id, $token);
        $job->handle(app(BulkRunner::class));

        $updatedAt = Client::withoutGlobalScopes()
            ->whereIn('id', $ids)
            ->pluck('updated_at', 'id')
            ->map(static fn ($value): string => (string) $value)
            ->all();

        // Queue delivery is at-least-once; the second delivery must not touch
        // the records again after the first delivery finalized the token.
        $job->handle(app(BulkRunner::class));

        $this->assertSame(
            $updatedAt,
            Client::withoutGlobalScopes()
                ->whereIn('id', $ids)
                ->pluck('updated_at', 'id')
                ->map(static fn ($value): string => (string) $value)
                ->all(),
        );
        $this->assertSame(JobStatus::DONE, JobStatus::get($token, $this->userA->id)['status']);
    }

    /* ------------------------------------------------------------- chunking */

    /**
     * The chunk walk must reach every row even when the mutation invalidates
     * the predicate that selected them.
     *
     * With OFFSET paging this is where half the rows get skipped: the filtered
     * set shrinks as each chunk commits, so page 2 of a shrinking set is not
     * the rows that were on page 2. Small chunks force many iterations, which
     * is what makes the bug visible at this scale.
     */
    public function test_a_shrinking_result_set_is_still_fully_processed(): void
    {
        $ids = $this->seedClients($this->tenantA, 50, 'active');

        $this->actingAs($this->userA);

        $action = BulkAction::make('suspend', 'Suspend')
            ->mutate(['status' => 'suspended'])
            ->chunkSize(5);

        $list = ClientResource::definition()->toListQuery(Client::class);

        $affected = app(BulkRunner::class)->run(
            $action,
            // The predicate the mutation destroys.
            $list->matching(request()->merge(['status' => 'active'])),
            Client::class,
            $list->keyColumnName(),
        );

        $this->assertSame(50, $affected);
        $this->assertSame(
            0,
            Client::withoutGlobalScopes()->whereIn('id', $ids)->where('status', 'active')->count(),
            'Every row must be processed, not every other chunk.',
        );
    }

    /** N records, a bounded number of queries - never one per record. */
    public function test_a_bulk_mutation_does_not_run_one_query_per_record(): void
    {
        $ids = $this->seedClients($this->tenantA, 40, 'active');

        $this->actingAs($this->userA);

        DB::enableQueryLog();
        $this->postJson('/clients/bulk', ['action' => 'suspend', 'ids' => $ids])->assertOk();
        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $this->assertLessThan(
            15,
            count($queries),
            'A 40-record mutation must be a handful of queries, not 40 updates.',
        );
    }

    /* --------------------------------------------------------------- export */

    public function test_an_export_is_queued_and_writes_the_filtered_view(): void
    {
        Storage::fake('local');

        $this->seedClients($this->tenantA, 3, 'active');
        $this->seedClients($this->tenantA, 2, 'expired');
        $this->seedClients($this->tenantB, 5, 'active');

        $token = JobStatus::token();
        JobStatus::start($token, $this->userA->id, 'export');

        (new ExportRecords('clients', ['status' => 'active'], null, $this->userA->id, $token))->handle();

        $state = JobStatus::get($token, $this->userA->id);

        $this->assertSame(JobStatus::DONE, $state['status']);
        $this->assertSame(3, $state['done'], 'Only tenant A\'s active clients.');

        $csv = Storage::disk('local')->get($state['file']);

        $this->assertStringStartsWith("\xEF\xBB\xBF", $csv, 'Excel needs the BOM to read UTF-8.');
        $this->assertStringContainsString('Name', $csv);
        // Header plus three rows plus a trailing newline.
        $this->assertCount(5, explode("\n", $csv));
    }

    /**
     * A stored value beginning with `=` must not become a live formula in the
     * recipient's spreadsheet.
     */
    public function test_a_formula_like_value_is_neutralised(): void
    {
        Storage::fake('local');

        $ids = $this->seedClients($this->tenantA, 1, 'active');
        Client::withoutGlobalScopes()->whereIn('id', $ids)->update(['name' => '=HYPERLINK("http://evil","clickme")']);

        $token = JobStatus::token();
        JobStatus::start($token, $this->userA->id, 'export');

        (new ExportRecords('clients', [], $ids, $this->userA->id, $token))->handle();

        $csv = Storage::disk('local')->get(JobStatus::get($token, $this->userA->id)['file']);

        $this->assertStringContainsString("'=HYPERLINK", $csv);
    }

    /* -------------------------------------------------------- job ownership */

    /** A leaked token is inert: status is owner-checked, not merely unguessable. */
    public function test_another_user_cannot_read_a_job_status(): void
    {
        // A colleague, for the same reason as the download test below.
        $other = User::factory()->create(['tenant_id' => $this->tenantA->id, 'email_verified_at' => now()]);

        $token = JobStatus::token();

        /*
         * WRITTEN INSIDE TENANCY, because that is where it will be read.
         *
         * `JobStatus` lives in the CACHE, and `CacheTenancyBootstrapper` prefixes
         * every cache key with the tenant. Writing the token outside tenancy and
         * reading it inside produces a miss, and the endpoint 404s - which looks
         * exactly like the ownership check passing.
         *
         * That is not hypothetical: this assertion passed for that reason once
         * `InitializeTenancyForUser` landed, and would have gone on "proving" a
         * guard that was never consulted. Setting up in the same context the
         * request runs in is what makes the refusal below mean ownership.
         */
        $this->asTenant($this->tenantA, function () use ($token, $other): void {
            JobStatus::start($token, $this->userA->id, 'export');

            $this->assertNotNull(JobStatus::get($token, $this->userA->id));
            $this->assertNull(JobStatus::get($token, $other->id), 'Owner id is checked, not just the token.');

            // The token IS present in this context, so a 404 here can only mean
            // the ownership check refused it.
            $this->actingAs($other)->getJson("/clients/jobs/{$token}")->assertNotFound();
        });
    }

    public function test_an_export_cannot_be_downloaded_by_another_user(): void
    {
        Storage::fake('local');

        /*
         * A COLLEAGUE, not another tenant - the test is named "another user".
         *
         * It used to be a tenant B user, which refuses for the wrong reason now
         * that permissions exist: their role is invisible under tenant A's scope,
         * so they are stopped at the permission gate with a 403 and the
         * ownership check never runs. That still refuses, but it proves tenancy
         * rather than ownership, and tenancy is already covered elsewhere.
         *
         * The realistic threat is somebody in the SAME organisation who has the
         * token - a URL pasted into chat. They pass every other gate, so a
         * refusal here can only mean the owner id was checked.
         */
        $other = User::factory()->create(['tenant_id' => $this->tenantA->id, 'email_verified_at' => now()]);

        $this->seedClients($this->tenantA, 2, 'active');

        $token = JobStatus::token();

        // Inside tenancy: the job runs there in production (QueueTenancyBootstrapper)
        // and the download request reads there. See the note above.
        $this->asTenant($this->tenantA, function () use ($token, $other): void {
            JobStatus::start($token, $this->userA->id, 'export');
            (new ExportRecords('clients', [], null, $this->userA->id, $token))->handle();

            // The owner CAN download, which is what makes the refusal above a
            // refusal rather than a missing file.
            $this->actingAs($other)->get("/clients/jobs/{$token}/download")->assertNotFound();
            $this->actingAs($this->userA)->get("/clients/jobs/{$token}/download")->assertOk();
        });
    }

    /* ------------------------------------------------- the link has to last */

    /**
     * THE BUG A USER HIT: an export downloaded an hour later was a 404 page.
     *
     * Ownership and the file name lived only in `JobStatus`, which is a cache
     * entry with a one-hour TTL. The CSV lived on disk until something pruned
     * it, and the "your export is ready" NOTIFICATION lives in the database
     * until somebody reads it - so opening that notification the next morning
     * reliably failed, for a file that was still there.
     *
     * Dropping the cache is exactly what an hour, a `cache:clear`, a Redis
     * restart or a deploy does. The download must survive all four.
     */
    public function test_an_export_is_still_downloadable_after_its_job_status_expires(): void
    {
        Storage::fake('local');

        $this->seedClients($this->tenantA, 2, 'active');

        $token = JobStatus::token();

        $this->asTenant($this->tenantA, function () use ($token): void {
            JobStatus::start($token, $this->userA->id, 'export');
            (new ExportRecords('clients', [], null, $this->userA->id, $token))->handle();

            // An hour passes, a worker restarts, somebody clears the cache -
            // all the same thing from here.
            Cache::flush();

            $this->assertNull(JobStatus::get($token, $this->userA->id), 'The premise: the cache is empty.');

            $this->actingAs($this->userA)
                ->get("/clients/jobs/{$token}/download")
                ->assertOk()
                ->assertDownload();
        });
    }

    /** And ownership still holds once the cache is not the thing enforcing it. */
    public function test_ownership_survives_the_cache_too(): void
    {
        Storage::fake('local');

        $other = User::factory()->create(['tenant_id' => $this->tenantA->id, 'email_verified_at' => now()]);

        $this->seedClients($this->tenantA, 2, 'active');

        $token = JobStatus::token();

        $this->asTenant($this->tenantA, function () use ($token, $other): void {
            JobStatus::start($token, $this->userA->id, 'export');
            (new ExportRecords('clients', [], null, $this->userA->id, $token))->handle();

            Cache::flush();

            $this->actingAs($other)->get("/clients/jobs/{$token}/download")->assertNotFound();
            $this->actingAs($this->userA)->get("/clients/jobs/{$token}/download")->assertOk();
        });
    }

    /**
     * PAST ITS RETENTION WINDOW IT IS GONE, even if the file is not.
     *
     * The panel promises to keep an export for a number of days, and the
     * endpoint enforces that itself rather than trusting the pruner to have run
     * - a scheduler that stopped should mean old files linger, not that expired
     * ones stay downloadable.
     */
    public function test_an_expired_export_is_refused(): void
    {
        Storage::fake('local');

        $this->seedClients($this->tenantA, 1, 'active');

        $token = JobStatus::token();

        $this->asTenant($this->tenantA, function () use ($token): void {
            JobStatus::start($token, $this->userA->id, 'export');
            (new ExportRecords('clients', [], null, $this->userA->id, $token))->handle();

            DB::table('panel_exports')->where('token', $token)->update(['expires_at' => now()->subDay()]);

            $this->actingAs($this->userA)->get("/clients/jobs/{$token}/download")->assertNotFound();
        });
    }

    /**
     * PRUNING TAKES THE FILE AND THE ROW TOGETHER.
     *
     * Either one alone is a bug: an orphaned CSV nothing can reach and nothing
     * will collect, or a row promising a download that 404s.
     */
    public function test_pruning_removes_the_record_and_the_file(): void
    {
        Storage::fake('local');

        $this->seedClients($this->tenantA, 1, 'active');

        $token = JobStatus::token();

        $this->asTenant($this->tenantA, function () use ($token): void {
            JobStatus::start($token, $this->userA->id, 'export');
            (new ExportRecords('clients', [], null, $this->userA->id, $token))->handle();

            $path = "panel-exports/{$token}.csv";

            $this->assertTrue(Storage::disk('local')->exists($path));

            DB::table('panel_exports')->where('token', $token)->update(['expires_at' => now()->subDay()]);

            $this->artisan('panel:prune-exports')->assertSuccessful();

            $this->assertFalse(Storage::disk('local')->exists($path), 'The file outlived its record.');
            $this->assertSame(0, DB::table('panel_exports')->where('token', $token)->count());
        });
    }

    /** A live export is not swept up with the expired ones. */
    public function test_pruning_leaves_a_current_export_alone(): void
    {
        Storage::fake('local');

        $this->seedClients($this->tenantA, 1, 'active');

        $token = JobStatus::token();

        $this->asTenant($this->tenantA, function () use ($token): void {
            JobStatus::start($token, $this->userA->id, 'export');
            (new ExportRecords('clients', [], null, $this->userA->id, $token))->handle();

            $this->artisan('panel:prune-exports')->assertSuccessful();

            $this->actingAs($this->userA)->get("/clients/jobs/{$token}/download")->assertOk();
        });
    }

    /**
     * THE LINK CARRIES THE PORTAL IT WAS STARTED FROM.
     *
     * A queued job has no request and cannot know whether the export began at
     * `/clients` or `/reseller/clients`, so the path used to be assembled from
     * the resource key alone - correct in exactly one portal, and written into
     * a permanently stored notification in every other.
     */
    public function test_the_status_response_carries_a_download_url_with_the_panel_prefix(): void
    {
        Storage::fake('local');

        $this->seedClients($this->tenantA, 1, 'active');

        $token = JobStatus::token();

        // The reseller portal serves its own plans resource, not clients - which
        // is exactly why the prefix cannot be inferred from a resource key.
        $this->asTenant($this->tenantA, function () use ($token): void {
            JobStatus::start($token, $this->userA->id, 'export');
            (new ExportRecords('reseller-plans', [], null, $this->userA->id, $token))->handle();

            $this->actingAs($this->userA)
                ->getJson("/reseller/reseller-plans/jobs/{$token}")
                ->assertOk()
                ->assertJsonPath('download', "/reseller/reseller-plans/jobs/{$token}/download");

            // And from the root portal the same token is offered without one.
            $this->actingAs($this->userA)
                ->getJson("/clients/jobs/{$token}")
                ->assertOk()
                ->assertJsonPath('download', "/clients/jobs/{$token}/download");
        });
    }

    /* ---------------------------------------------------------------- setup */

    /**
     * Run `$body` with `$tenant` initialised, exactly as a request would.
     *
     * Needed wherever the test touches the CACHE, because cache keys are
     * tenant-prefixed and a test that sets up outside tenancy is not setting up
     * the state the request will read.
     */
    private function asTenant(Tenant $tenant, callable $body): mixed
    {
        /*
         * EVERYTHING THAT TOUCHES THE CACHE GOES IN ONE BLOCK, including the
         * HTTP calls - this cannot be split into setup-then-request.
         *
         * `CacheTenancyBootstrapper` builds a NEW TenantCacheManager on every
         * initialise, and the suite runs the `array` store, so each rebuild
         * starts empty: anything written in one tenancy block is gone in the
         * next. Every read then misses, every endpoint 404s, and it reads as a
         * broken ownership guard rather than a driver artifact.
         *
         * The store cannot simply be swapped for a persistent one, either:
         * stancl tags its cache entries, and of Laravel's stores only `array`
         * and `redis` support tagging. So `array` it is, and the context has to
         * be held open across the request.
         *
         * That works because `InitializeTenancyForUser` SKIPS when tenancy is
         * already initialised - the request joins the context the test opened
         * rather than starting a new one.
         */
        tenancy()->initialize($tenant);

        try {
            return $body();
        } finally {
            tenancy()->end();
        }
    }

    /** @return list<int> */
    private function seedClients(Tenant $tenant, int $count, string $status): array
    {
        $plan = Plan::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'name' => "Plan {$tenant->id}",
            'speed_mbps' => 10,
            'price_cents' => 1000,
        ]);

        $router = Router::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'name' => "Router {$tenant->id}",
            'ip_address' => '10.0.0.1',
            'model' => 'RB750',
            'status' => 'online',
        ]);

        $ids = [];

        for ($i = 0; $i < $count; $i++) {
            $unique = uniqid((string) $tenant->id, true);

            $ids[] = Client::withoutGlobalScopes()->forceCreate([
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'router_id' => $router->id,
                'name' => "Client {$unique}",
                'phone' => '+254'.substr((string) crc32($unique), 0, 9),
                'access_code' => strtoupper(substr(md5($unique), 0, 10)),
                'status' => $status,
                'plan_type' => 'pppoe',
                'expiry_date' => '2026-12-31',
            ])->id;
        }

        return $ids;
    }
}
