<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Demo\Models\Client;
use App\Models\Tenant;
use App\Models\User;
use App\Panel\Reseller\Resources\PlanResource;
use App\Demo\Panel\Resources\ClientResource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Alxtexh\Panel\Http\Middleware\UsePanel;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Table;
use Tests\TestCase;

/**
 * Two portals, built by command, that cannot reach into each other.
 *
 * THE PROMISE IS "RUN A COMMAND AND GET A PORTAL", and the only honest way to
 * check it is to look at what the commands actually produced. The platform
 * panel in this application was not written by hand: `make:panel platform
 * --central` wrote the provider, `make:panel-resource Tenant --panel=platform`
 * wrote the resource, and nothing edited a route file. What follows asserts that
 * the result works and, more importantly, that it is SEPARATE.
 *
 * SEPARATION IS THE WHOLE POINT AND IT FAILS SILENTLY. A shared `{resource}`
 * pattern would let `/tenants` resolve the platform's resource from inside a
 * tenant-scoped request; a missing `UsePanel` would leave a central portal
 * running with tenant scoping on. Neither errors. The first leaks every
 * organisation's records to an operator, and the second shows a platform
 * administrator one organisation and calls it all of them - which reads as
 * "there is only one tenant" rather than as a bug.
 *
 * `UsePanel` WAS EXACTLY THAT: written, documented, and attached to nothing.
 */
final class PortalGenerationTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $acme;

    private User $operator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->acme = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);
        Tenant::create(['name' => 'Rival', 'slug' => 'rival']);

        $this->operator = User::factory()->create([
            'tenant_id' => $this->acme->id,
            'email_verified_at' => now(),
        ]);
    }

    /* ------------------------------------------------------- registration */

    public function test_all_three_panels_are_registered(): void
    {
        $panels = app(PanelManager::class)->panels();

        // The operator portal, a central platform portal, and a second
        // tenant-scoped one - each produced by `make:panel`.
        $this->assertArrayHasKey('admin', $panels);
        $this->assertArrayHasKey('platform', $panels);
        $this->assertArrayHasKey('reseller', $panels);
    }

    /**
     * A KEY COLLISION WITHIN THE SAME PANEL THROWS RATHER THAN OVERWRITING.
     *
     * The old rule was installation-wide: two resources anywhere claiming the
     * same key threw. The new rule is per-panel: two resources in DIFFERENT
     * panels may share a key (`/admin/users` and `/client/users` are different
     * URLs), but two resources in the SAME panel still cannot.
     *
     * This test proves both directions: a cross-panel collision is allowed,
     * and a within-panel collision throws.
     */
    public function test_two_resources_cannot_share_a_key_in_the_same_panel(): void
    {
        $manager = app(PanelManager::class);

        // Cross-panel: `clients` in reseller vs `clients` in admin — allowed now.
        $manager->registerResources([CollidingClientResource::class]);

        // Within-panel: a second class claiming `clients` in the reseller panel
        // where `CollidingClientResource` just took it.
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessageMatches('/both use the key/');

        $manager->registerResources([IntraPanelCollidingResource::class]);
    }

    /**
     * A GENERATED PORTAL SHIPS WITH ITS OWN PROOF - roadmap 7.7.
     *
     * Multi-panel scoping is the structural claim this package makes, and a
     * claim proved by a test somebody has to go and find is a claim that
     * quietly stops being true. `make:panel` writes the isolation matrix
     * pointed at the new portal, so adding one adds its own evidence - and,
     * more usefully, the day somebody adds a resource to that portal without
     * a policy or without a tenant column, the portal's OWN test says so.
     *
     * THE GENERATED TEST MUST ENUMERATE, NOT LIST. A generated file containing
     * a hand-written list of resources is correct on the day the portal was
     * made and wrong from the first resource after it - the exact failure the
     * isolation matrix exists to avoid - so that property is asserted here
     * rather than trusted.
     */
    public function test_make_panel_writes_an_isolation_test_for_the_new_portal(): void
    {
        $provider = app_path('Providers/Panels/DisposablePanelProvider.php');
        $test = base_path('tests/Feature/DisposablePanelIsolationTest.php');
        $resources = app_path('Panel/Disposable');

        try {
            $this->artisan('make:panel', ['id' => 'disposable', '--path' => 'disposable'])
                ->assertSuccessful();

            $this->assertFileExists($test, 'A generated portal must arrive with its isolation test.');

            $written = (string) file_get_contents($test);

            $this->assertStringContainsString(
                'resourcesFor',
                $written,
                'The generated test must ENUMERATE the registry, not name resources.',
            );

            $this->assertStringContainsString('has no policy', $written);
            $this->assertStringContainsString('refuses_a_request_with_no_tenant', $written);

            // It has to be valid PHP, not just plausible text.
            $this->assertSame(
                0,
                $this->lint($test),
                'The generated isolation test does not parse.',
            );
        } finally {
            @unlink($provider);
            @unlink($test);

            /*
             * THE `.gitkeep` HAD TO GO FIRST, and forgetting it left the whole
             * tree behind: `rmdir` refuses a directory that is not empty, and
             * `make:panel` writes a `.gitkeep` into the resource directory so
             * an empty portal survives a checkout.
             *
             * Both calls were silenced with `@`, so the failure was invisible -
             * and `app/Panel/Disposable/` accumulated from every run. A later
             * suite then found a panel nobody had declared and reported a screen
             * reachable from no menu, which reads as a navigation bug in the
             * application rather than as debris from a generator test.
             */
            if (is_dir($resources.'/Resources')) {
                @unlink($resources.'/Resources/.gitkeep');
                @rmdir($resources.'/Resources');
                @rmdir($resources);
            }

            $this->removeProviderRegistration('DisposablePanelProvider');
        }
    }

    private function lint(string $path): int
    {
        exec(escapeshellcmd(PHP_BINARY).' -l '.escapeshellarg($path).' 2>&1', $out, $code);

        return $code;
    }

    /** `make:panel` registers the provider; this test must not leave it behind. */
    private function removeProviderRegistration(string $class): void
    {
        $path = base_path('bootstrap/providers.php');

        $contents = (string) file_get_contents($path);

        file_put_contents($path, (string) preg_replace(
            '/^.*'.preg_quote($class, '/').'::class,\n/m',
            '',
            $contents,
        ));
    }

    /** And the generated reseller resource has one of its own. */
    public function test_the_second_portals_resource_has_a_distinct_key(): void
    {
        $reseller = app(PanelManager::class)->resourcesFor('reseller');

        $this->assertArrayHasKey('reseller-plans', $reseller);
        $this->assertArrayNotHasKey('plans', $reseller);
    }

    /**
     * A PORTAL'S SCHEMA CARRIES THAT PORTAL'S PATH, and until now it did not.
     *
     * THE BUG, WHICH MADE EVERY GENERATED PORTAL A ONE-SCREEN PORTAL. The
     * routes in a resource schema were built from the key alone -
     * `/reseller-plans/create`, `/reseller-plans/{id}` - which is correct in
     * exactly one panel: the one mounted at the root. Everywhere else the
     * index rendered perfectly and every link off it went to a URL that panel
     * does not serve. New, each row, the form's own submit target, the upload
     * endpoint and the field-options lookup are ALL built from
     * `routes.index` on the client, so all of them missed.
     *
     * IT SURVIVED BECAUSE THE INDEX IS THE ONE SCREEN THAT NEEDS NO LINK, and
     * the index is what anybody opens to check whether a generated portal
     * works. `make:panel` looked like it produced a working portal because the
     * first thing you look at is the one thing that was fine.
     *
     * This is the export download's bug one layer up - see the note on that
     * one about assembling a path from a resource key - so the assertion is
     * the same shape: the prefix comes from the PANEL, and the root panel gets
     * none rather than a special case.
     */
    public function test_a_portals_resource_routes_carry_its_path(): void
    {
        $reseller = PlanResource::schema('reseller')['routes'];

        $this->assertSame('/reseller/reseller-plans', $reseller['index']);
        $this->assertSame('/reseller/reseller-plans/{id}', $reseller['update']);

        // And a panel mounted at the root gets no prefix rather than a slash.
        $admin = ClientResource::schema('admin')['routes'];

        $this->assertSame('/clients', $admin['index']);
        $this->assertSame('/clients/{id}', $admin['update']);
    }

    /**
     * THE CONTEXTS DIFFER, which is the fact everything else depends on.
     * A central panel applies no tenant scoping; a tenant panel refuses to
     * operate without one.
     */
    public function test_the_platform_panel_is_central_and_the_admin_panel_is_not(): void
    {
        $panels = app(PanelManager::class)->panels();

        $this->assertTrue($panels['platform']->isCentral());
        $this->assertFalse($panels['admin']->isCentral());
    }

    /**
     * ROUTES CAME FROM THE PACKAGE, not from a route file somebody edited.
     * That is what makes a third portal a command rather than a copy.
     */
    public function test_the_generated_portal_has_its_whole_resource_surface(): void
    {
        $names = collect(Route::getRoutes())
            ->map(fn ($route): string => (string) $route->getName())
            ->filter(fn (string $name): bool => str_starts_with($name, 'platform.'))
            ->values();

        foreach (['resource', 'create', 'show', 'edit', 'store', 'update', 'destroy', 'bulk'] as $action) {
            $this->assertTrue(
                $names->contains("platform.{$action}"),
                "The generated portal has no `{$action}` route.",
            );
        }
    }

    /** And they are mounted under its own path, not at the root. */
    public function test_the_generated_portal_lives_at_its_own_path(): void
    {
        $uris = collect(Route::getRoutes())
            ->filter(fn ($route): bool => str_starts_with((string) $route->getName(), 'platform.'))
            ->map(fn ($route): string => $route->uri());

        $this->assertNotEmpty($uris);

        foreach ($uris as $uri) {
            /*
             * `platform` ITSELF IS ALLOWED - that is the portal's own home,
             * which exists because a portal whose root 404s makes the first
             * thing anybody does with a freshly generated one an error page.
             */
            $this->assertTrue(
                $uri === 'platform' || str_starts_with($uri, 'platform/'),
                "{$uri} is not under the portal's path.",
            );
        }
    }

    /* --------------------------------------------------------- separation */

    /**
     * THE ADMIN PORTAL CANNOT ADDRESS THE PLATFORM'S RESOURCE.
     *
     * Not "is refused" - is not routable. A shared resource pattern would make
     * `/tenants` resolve the platform's Tenants resource from inside a
     * tenant-scoped request, which is a central-context query reached through a
     * tenant URL. Being unroutable means no policy has to be right for this to
     * hold.
     */
    public function test_a_platform_resource_is_not_reachable_from_the_admin_portal(): void
    {
        $this->actingAs($this->operator)->get('/tenants')->assertNotFound();
    }

    /** And the reverse: a tenant resource is not addressable from the platform. */
    public function test_an_admin_resource_is_not_reachable_from_the_platform_portal(): void
    {
        $this->actingAs($this->operator)->get('/platform/clients')->assertNotFound();
    }

    /**
     * EACH PORTAL'S NAVIGATION HOLDS ONLY ITS OWN RESOURCES.
     *
     * The menu is built from `resourcesFor`, so a resource appearing in the
     * wrong portal's sidebar is the same registry mistake that would make it
     * routable there - visible earlier and much easier to notice.
     */
    public function test_each_portal_lists_only_its_own_resources(): void
    {
        $manager = app(PanelManager::class);

        $admin = array_keys($manager->resourcesFor('admin'));
        $platform = array_keys($manager->resourcesFor('platform'));

        $this->assertContains('clients', $admin);
        $this->assertNotContains('tenants', $admin);

        $this->assertContains('tenants', $platform);
        $this->assertNotContains('clients', $platform);

        // Neither list may be empty, or the assertions above are vacuous.
        $this->assertNotEmpty($admin);
        $this->assertNotEmpty($platform);
    }

    /**
     * THE SIDEBAR SHOWS ONLY THIS PORTAL'S RESOURCES.
     *
     * It showed all of them. The navigation prop was built from the whole
     * registry, which was the same list while one portal existed - and with
     * three, the platform portal's Tenants and the reseller's Plans appeared in
     * the operator's sidebar, ungrouped, at the top level, linking to paths this
     * portal does not route. Nothing failed. The menu simply started advertising
     * other people's screens.
     */
    public function test_the_navigation_shows_only_this_portals_resources(): void
    {
        $nav = $this->actingAs($this->operator)->get('/dashboard')
            ->viewData('page')['props']['panelNav'];

        $keys = array_column($nav, 'key');

        $this->assertContains('clients', $keys);
        $this->assertNotContains('tenants', $keys, 'Another portal\'s resource is in this sidebar.');
        $this->assertNotContains('reseller-plans', $keys);
    }

    /* ------------------------------------------------------------ context */

    /**
     * THE CENTRAL PORTAL REALLY RUNS WITHOUT TENANT SCOPING.
     *
     * This is the assertion `UsePanel` exists for, and it was attached to
     * nothing until now - so every route ran as the DEFAULT panel and a central
     * portal would have been silently tenant-scoped. The symptom is a platform
     * administrator seeing one organisation and reading it as "there is only
     * one".
     */
    public function test_opening_the_platform_portal_switches_off_tenant_scoping(): void
    {
        $manager = app(PanelManager::class);

        $this->assertFalse($manager->inCentralContext(), 'The default context is not tenant-scoped.');

        Route::middleware([UsePanel::class.':platform'])
            ->get('/probe-platform-context', fn (): string => app(PanelManager::class)->inCentralContext() ? 'central' : 'tenant');

        $this->assertSame('central', $this->get('/probe-platform-context')->getContent());
    }

    /** And the admin portal does not. */
    public function test_the_admin_portal_stays_tenant_scoped(): void
    {
        Route::middleware([UsePanel::class.':admin'])
            ->get('/probe-admin-context', fn (): string => app(PanelManager::class)->inCentralContext() ? 'central' : 'tenant');

        $this->assertSame('tenant', $this->get('/probe-admin-context')->getContent());
    }

    /**
     * THE GENERATED PORTAL WORKS, END TO END, AND SEES ACROSS ORGANISATIONS.
     *
     * This is the assertion the whole feature reduces to: open a portal that was
     * created by two commands, and it lists every tenant rather than the one the
     * operator belongs to. If `UsePanel` were not attached, or the context were
     * wrong, this returns ONE row and looks entirely reasonable - "there is only
     * one organisation" is not a sentence anybody questions.
     */
    public function test_the_platform_portal_lists_every_organisation(): void
    {
        $props = $this->actingAs($this->operator)
            ->get('/platform/tenants')
            ->assertOk()
            ->viewData('page')['props'];

        $names = array_column($props['records'], 'name');

        $this->assertContains('Acme', $names);
        $this->assertContains('Rival', $names, 'The central portal was tenant-scoped after all.');
    }

    /** And its navigation links into its own path, not the root. */
    public function test_the_generated_portals_navigation_points_at_its_own_path(): void
    {
        $nav = $this->actingAs($this->operator)
            ->get('/platform/tenants')
            ->viewData('page')['props']['panelNav'];

        $this->assertSame(['tenants'], array_column($nav, 'key'));
        $this->assertSame(['/platform/tenants'], array_column($nav, 'href'));
    }

    /* ------------------------------------------------------ home and extras */

    /**
     * A GENERATED PORTAL ANSWERS AT ITS OWN ROOT.
     *
     * It 404ed. `make:panel platform` produced `/platform/tenants` and nothing
     * at `/platform`, so the first thing anybody did with a portal they had just
     * created was hit an error page - which reads as "the generator did not
     * work" rather than as "there is no landing page".
     */
    public function test_a_generated_portal_answers_at_its_root(): void
    {
        // One resource is not a choice, so the home redirects straight to it
        // rather than showing a page whose only content is a single link.
        $this->actingAs($this->operator)
            ->get('/platform')
            ->assertRedirect('/platform/tenants');
    }

    /** The package never claims the host application's public root. */
    public function test_the_root_portal_does_not_register_a_package_landing_page(): void
    {
        $names = collect(Route::getRoutes())
            ->filter(fn ($route): bool => $route->uri() === '/')
            ->map(fn ($route): string => (string) $route->getName());

        $this->assertNotContains('panel.landing', $names->all());
        $this->assertNotContains('panel.home', $names->all());
    }

    /**
     * APP-LEVEL EXTRAS EXIST IN EVERY PORTAL, not only the first.
     *
     * Import, saved views and the audit trail hang off a resource and are
     * answered by controllers in the APPLICATION, so the package cannot declare
     * them - and while they were declared inline in `web.php` they existed for
     * one portal. A generated portal got the resource screens and silently lost
     * Import: the button was simply absent, with nothing to say why.
     */
    public function test_every_portal_gets_the_applications_own_extras(): void
    {
        $names = collect(Route::getRoutes())
            ->map(fn ($route): string => (string) $route->getName());

        foreach (['panel', 'platform', 'reseller'] as $prefix) {
            foreach (['import', 'views.store', 'audit'] as $extra) {
                $this->assertTrue(
                    $names->contains("{$prefix}.{$extra}"),
                    "The [{$prefix}] portal has no `{$extra}` route.",
                );
            }
        }
    }

    /**
     * AND AN EXTRA THAT NAMES A SPECIFIC RESOURCE ONLY EXISTS WHERE IT IS.
     *
     * The invoice route assumes a `clients` resource. A portal without one must
     * not get a route pointing at a controller that would 500 on the first
     * request rather than 404 on the URL.
     */
    public function test_a_resource_specific_extra_is_not_added_to_portals_without_it(): void
    {
        $names = collect(Route::getRoutes())
            ->map(fn ($route): string => (string) $route->getName());

        $this->assertTrue($names->contains('panel.invoice'));
        $this->assertFalse($names->contains('platform.invoice'));
        $this->assertFalse($names->contains('reseller.invoice'));
    }

    /**
     * REGISTERING AN EXTENSION TWICE DOES NOT REGISTER ITS ROUTES TWICE.
     *
     * THIS WAS A REAL LEAK AND ITS ONLY SYMPTOM WAS TIME. The extension list
     * lived in a static, so every application boot appended another copy of the
     * same closure and none were ever cleared - across a suite that boots a
     * thousand times it grew to a thousand duplicates, each registering the same
     * routes for each of three panels. Nothing failed and nothing was wrong on
     * screen; the suite went from forty-eight seconds to four minutes, which
     * reads as "the tests got slower".
     *
     * The list is held in the container now, so a fresh application gets a fresh
     * one. What this asserts is the consequence: the route count for a panel is
     * the same after a second boot as after the first.
     */
    public function test_route_extensions_do_not_accumulate_across_boots(): void
    {
        $count = fn (): int => collect(Route::getRoutes())
            ->filter(fn ($route): bool => str_starts_with((string) $route->getName(), 'platform.'))
            ->count();

        $before = $count();

        $this->assertGreaterThan(0, $before);

        // A second boot, exactly as the next test in a suite would produce.
        $this->refreshApplication();

        $this->assertSame($before, $count(), 'Panel routes were registered more than once.');
    }

    /**
     * AN UNKNOWN PANEL THROWS RATHER THAN FALLING BACK.
     *
     * A typo in a route must not quietly serve the default panel - which, for a
     * route intended to be central, means tenant scoping switching itself on
     * with no error anywhere.
     */
    public function test_an_unknown_panel_id_is_refused(): void
    {
        $this->expectException(\RuntimeException::class);

        app(PanelManager::class)->usePanel('no-such-panel');
    }

    /**
     * EVERY PORTAL'S HOME LINK STAYS INSIDE THAT PORTAL.
     *
     * The published layout had `href: '/dashboard'` written into it - a FIXED
     * path in an application that mounts three portals. So inside `/platform`
     * the sidebar's Home pointed at the ADMIN panel's dashboard: clicking it
     * left the portal silently, and for an operator who may not open that
     * screen it refused with a bare "Forbidden". Every generated portal had it,
     * because they all render the same layout.
     *
     * ASSERTED ON THE SHARED PROP, which is what the layout reads, so this
     * fails if the server stops sending it rather than only if the markup
     * changes.
     */
    public function test_each_portal_shares_its_own_home_link(): void
    {
        $this->actingAs($this->operator)
            ->get('/platform/tenants')
            ->assertInertia(fn ($page) => $page->where('panel.home', '/platform'));

        /*
         * AND THE ROOT PANEL'S HOME IS ITS DASHBOARD, not `/` - a root-mounted
         * panel does not claim the application's front page, so its home is the
         * screen sign-in lands on.
         */
        $this->actingAs($this->operator)
            ->get('/clients')
            ->assertInertia(fn ($page) => $page->where('panel.home', '/dashboard'));
    }
}

/**
 * A second resource claiming a key another one already has.
 *
 * A REAL CLASS RATHER THAN AN ANONYMOUS ONE, because the resources it collides
 * with are `final` and an anonymous subclass of a final class is a fatal error -
 * which PHPUnit reports as "premature end of process" rather than as a failing
 * test, and sends whoever reads it looking at the wrong thing entirely.
 */
final class CollidingClientResource extends \Alxtexh\Panel\Resources\Resource
{
    protected static string $model = Client::class;

    protected static string $panel = 'reseller';

    /** The same key `ClientResource` already registered. */
    public static function key(): string
    {
        return 'clients';
    }

    public static function table(Table $table): Table
    {
        return $table->model(Client::class);
    }
}

/**
 * A SECOND resource in the RESELLER panel claiming `clients` — within-panel collision.
 *
 * Used to verify that the new per-panel scope still throws when two resources in
 * the same portal compete for the same key (cross-portal sharing is now allowed;
 * within-portal duplication is still an error).
 */
final class IntraPanelCollidingResource extends \Alxtexh\Panel\Resources\Resource
{
    protected static string $model = Client::class;

    protected static string $panel = 'reseller';

    public static function key(): string
    {
        return 'clients'; // same panel as CollidingClientResource — must throw
    }

    public static function table(Table $table): Table
    {
        return $table->model(Client::class);
    }
}
