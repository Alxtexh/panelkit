<?php

declare(strict_types=1);

namespace Alxtexh\Panel;

use Alxtexh\Panel\Resources\Resource;

/**
 * Holds the registered panels.
 *
 * Phase 0 is a placeholder - Panel registration, resource discovery, and schema
 * resolution land in Phases 4 and 7. What matters now is the state discipline,
 * because it is far cheaper to establish than to retrofit.
 *
 * Spec §9: "No mutable static state that holds request or tenant data." The
 * failure mode is tenant A briefly seeing tenant B's data under load, and it
 * does not reproduce on `php artisan serve`, so it will not be caught by hand.
 *
 * The rule this class follows:
 *
 *   - Per-request or per-tenant state lives on the INSTANCE, which is a scoped
 *     binding and therefore reset between requests.
 *   - Only genuinely immutable, tenant-independent data may live in a static -
 *     currently nothing. The discovered class list (Phase 4) will qualify;
 *     anything derived from it that depends on tenant or user will not.
 */
final class PanelManager
{
    /** @var array<string, mixed> Per-request memoization. Instance state, never static. */
    private array $memo = [];

    /**
     * Registered resource classes, keyed by URL segment.
     *
     * Safe as instance state on a scoped binding. Spec S9 permits the
     * DISCOVERED class list to be cached process-wide because it is immutable
     * and tenant-independent; anything derived from it that depends on tenant or
     * user is not, which is why resolved SCHEMAS live in the cache keyed by
     * permissions rather than here.
     *
     * @var array<string, class-string>
     */
    private array $resources = [];

    /**
     * Screens the package itself provides.
     *
     * @var list<class-string<Pages\Page>>
     */
    private const PACKAGE_PAGES = [
        Pages\ChangelogPage::class,
        Pages\EnvironmentPage::class,
        Pages\SitemapPage::class,

        /*
         * WHO IS HERE AND WHAT THEY MAY DO. The roles half was packaged from
         * 0.4 and the people half was not, which made the permission matrix a
         * screen you could reach and not act on: it showed which abilities a
         * role holds and offered nowhere to see who holds it.
         *
         * IT SHOWS THE ROLES EVEN WITH NO USERS RESOURCE REGISTERED, because
         * `UserDirectory` finds that resource by matching the configured auth
         * model rather than requiring a config key - and an application that
         * has not written one should get the half that works, not a 500.
         */
        Pages\UserManagementPage::class,

        /*
         * THE ORGANISATION'S OWN NAME AND LOGO. It needed no de-ISP-ing to
         * move: the controller already named no model, resolving through
         * `TenantContext` like every other tenant-scoped query. It lived in the
         * reference application only because nothing had moved it - so every
         * installation shipped `FileStore`, the upload endpoints and no screen
         * on which to change a company's name.
         */
        Pages\OrganisationPage::class,
        Pages\PaymentSettingsPage::class,
        Pages\MailSettingsPage::class,
        Pages\MailPage::class,
        Pages\ChatPage::class,
        Pages\ApiKeysPage::class,
        Pages\ApiDocsPage::class,
        Pages\LogsPage::class,
        Pages\ShowcasePage::class,
        Pages\InvitePage::class,
        Pages\FeatureFlagsPage::class,
        Pages\OnboardingPage::class,
        Pages\BillingPortalPage::class,
        Pages\WebhookEndpointsPage::class,
    ];

    /** @var array<string, class-string<Pages\Page>> slug => class — first-registered wins; used as fallback when no panel context */
    private array $pages = [];

    /** @var array<string, array<string, class-string<Pages\Page>>> panelId => [slug => class] */
    private array $panelPageMap = [];

    private bool $pagesDiscovered = false;

    private bool $discovered = false;

    /** @var array<string, array<string, class-string>> panelId => [key => class] — populated alongside $resources */
    private array $panelResourceMap = [];

    /**
     * Registered panels, keyed by id.
     *
     * A PANEL IS A ROUTING AND AUTHORIZATION BOUNDARY, not a theme. They differ
     * in guard, in middleware, and - the hard one - in whether tenancy applies.
     *
     * STATIC, WHICH IS THE OPPOSITE OF THE RULE THIS FILE OTHERWISE FOLLOWS, so
     * it needs the argument in full.
     *
     * Every other piece of state here is per-request and must not be static: the
     * failure is one request's data leaking into another's under Octane. A panel
     * DEFINITION is not that. It is declared in a service provider from a
     * literal, is identical for every request and every tenant, never derives
     * from anything a client sends, and never mutates after boot - the same
     * category as a route or a config value, both of which the framework also
     * holds process-wide.
     *
     * IT HAD TO CHANGE BECAUSE SCOPED BINDINGS ARE FLUSHED BETWEEN REQUESTS.
     * Panels are registered once, in a provider's `boot`; the manager holding
     * them was rebuilt on the next request with an empty list, and `UsePanel`
     * threw `Unknown panel [admin]` on the SECOND request of a session while the
     * first worked perfectly. Under Octane that is every request after the
     * first.
     *
     * WHAT STAYS PER-REQUEST IS `$currentPanel` below - which panel is serving
     * THIS request is exactly the thing that must never be shared.
     *
     * @var array<string, Panel>
     */
    private static array $panels = [];

    /**
     * The panel serving the current request.
     *
     * INSTANCE STATE ON A SCOPED BINDING, never static. This is per-request data
     * and spec §9 forbids holding per-request state in a static: the failure is
     * one request's panel leaking into another's under Octane, which would mean
     * a tenant request evaluated in central context - every tenant's data at
     * once, intermittently, and not reproducible on `artisan serve`.
     */
    private ?string $currentPanel = null;

    /**
     * Which panel a plugin's resource was registered for.
     *
     * STATIC FOR THE SAME REASON `$panels` IS: this is boot-time configuration,
     * identical for every request, and a scoped binding rebuilt per request
     * would forget it - so a plugin's resource would be discoverable on the
     * first request and belong to no panel on the second.
     *
     * @var array<class-string, string>
     */
    private static array $resourcePanels = [];

    /**
     * Plugins registered globally, by id.
     *
     * KEYED BY ID so registering the same plugin twice - once from its own
     * service provider and once explicitly in a panel, which is an easy mistake
     * - is a no-op rather than a duplicate-key exception naming a RESOURCE.
     *
     * @var array<string, Plugins\PanelPlugin>
     */
    private static array $plugins = [];

    /**
     * Config plugin classes resolved once, keyed by class name.
     *
     * STATIC BECAUSE A PLUGIN DEFINITION IS BOOT-TIME CONFIGURATION: the same
     * class string in `panel.plugins` must resolve to one instance for the
     * process, and resolving it must not run `register()` until a panel that
     * accepts the plugin is actually used.
     *
     * @var array<class-string, Plugins\PanelPlugin>
     */
    private static array $resolvedConfigPlugins = [];

    /**
     * Panels whose plugins have already run, so they run exactly once.
     *
     * PER INSTANCE, NOT STATIC, AND THAT DISTINCTION IS A BUG THAT SHIPPED.
     *
     * It guards `$this->resources`, which is instance state on a SCOPED
     * binding - rebuilt for every request and every test boot. Held in a
     * static, the flag outlived the thing it guards: the first boot in a
     * process ran the plugins and registered their resources, and every boot
     * after it saw "already applied" against an empty registry and registered
     * nothing. A plugin's screens existed on the first request of a worker and
     * 404ed on the second, with the navigation still linking them.
     *
     * It hid for as long as it did because the only plugin resource was also
     * discovered from a directory, so it was registered twice over and the
     * second path covered for the first. `TicketingPlugin` is the first whose
     * classes come from the plugin ALONE, and it failed immediately - the
     * second test in a class could not reach a screen the first one could.
     *
     * A flag must live wherever the state it protects lives.
     */
    private array $pluginsApplied = [];

    /**
     * What plugins contributed, per panel.
     *
     * Instance state for the same reason as `$pluginsApplied`: it describes
     * this boot's registrations, so it has to be rebuilt whenever they are.
     *
     * @var array<string, list<Plugins\PluginContext>>
     */
    private array $pluginContexts = [];

    /**
     * Declared alert conditions, keyed to make re-registration harmless.
     *
     * INSTANCE STATE, unlike `$plugins`. A rule closes over the query it counts,
     * and a static array of closures outlives the test that declared them - so
     * one test's fixture becomes the next test's mysterious extra alert.
     *
     * @var array<string, Alerts\AlertRule>
     */
    private array $alertRules = [];

    public function registerPanel(Panel $panel): void
    {
        self::$panels[$panel->id] = $panel;
    }

    /** @return array<string, Panel> */
    public function panels(): array
    {
        return self::$panels;
    }

    /* ------------------------------------------------------------- plugins */

    /**
     * Install a plugin into every panel that accepts it.
     *
     * CALLED FROM A PACKAGE'S OWN SERVICE PROVIDER, which is what makes
     * `composer require` enough: Laravel discovers the provider, the provider
     * registers the plugin, and the panel picks it up when it applies plugins at
     * boot. Nothing in the application has to be edited, which is the entire
     * difference between a plugin and a README.
     *
     * REGISTERING TWICE IS A NO-OP, keyed by the plugin's id. A package
     * registered globally AND named explicitly in a panel provider is an easy
     * mistake to make and an ugly one to diagnose - without this it surfaces as
     * a duplicate-key exception naming a RESOURCE, several layers from the
     * cause.
     */
    public function plugin(Plugins\PanelPlugin $plugin): void
    {
        self::$plugins[$plugin->id()] = $plugin;
    }

    /** @return array<string, Plugins\PanelPlugin> */
    public function plugins(): array
    {
        return self::$plugins;
    }

    /**
     * Conditions the bell should watch, declared by the application.
     *
     * THE MECHANISM SHIPPED AND THE REGISTRY DID NOT, which is why the reference
     * app declared its rules inside its own notification controller: `AlertRule`
     * and `Alert` were both in the package, and there was nowhere to put one. So
     * every installation that wanted a bell wrote the endpoint too, and the
     * third one has a cross-user leak nobody reviews.
     *
     * KEYED, SO REGISTERING TWICE IS A NO-OP. A rule declared by a plugin AND by
     * the application - the ordinary way a package gets adopted - would
     * otherwise show the same warning twice in the same dropdown.
     */
    public function alertRule(Alerts\AlertRule $rule): void
    {
        $this->alertRules[$rule->key] = $rule;
    }

    /** @return list<Alerts\AlertRule> */
    public function alertRules(): array
    {
        return array_values($this->alertRules);
    }

    /**
     * Run every applicable plugin against `$panel`, once.
     *
     * IDEMPOTENT BY PANEL, because this is called from route registration and
     * from anything that needs the resulting pages - and running a plugin twice
     * would register its resources twice, which throws.
     *
     * PLUGINS FROM CONFIG TOO. `panel.plugins` is how an installation adds one
     * whose package does not register itself, and how it can be turned off
     * without uninstalling anything.
     */
    public function applyPlugins(Panel $panel): void
    {
        if (isset($this->pluginsApplied[$panel->id])) {
            return;
        }

        // Marked BEFORE the loop: a plugin that resolves something which itself
        // asks for the panel's pages would otherwise recurse forever.
        $this->pluginsApplied[$panel->id] = true;

        $contexts = [];
        $widgets = [];

        foreach ($this->pluginCandidates($panel) as $plugin) {
            $context = new Plugins\PluginContext($panel, $this);

            $plugin->register($context);

            $contexts[] = $context;
            $widgets = [...$widgets, ...$context->registeredWidgets()];
        }

        if ($widgets !== []) {
            $panel->widgets($widgets);
        }

        $this->pluginContexts[$panel->id] = $contexts;
    }

    /**
     * Whether plugins have already run for a panel this request.
     *
     * TESTS ONLY. The flag is the guard that makes repeated calls to
     * `resourcesFor`, `pagesFor`, `panelPages` and `pluginRoutes` cheap.
     */
    public function pluginsAppliedFor(string $panelId): bool
    {
        return isset($this->pluginsApplied[$panelId]);
    }

    /**
     * Plugins that apply to `$panel`, deduplicated by id.
     *
     * Config entries are class strings until `appliesTo` passes, so a plugin
     * aimed at one portal is not constructed when another portal boots first.
     *
     * @return list<Plugins\PanelPlugin>
     */
    private function pluginCandidates(Panel $panel): array
    {
        $seen = [];
        $plugins = [];

        foreach ($this->pluginSources($panel) as $source) {
            $plugin = $this->resolvePluginForPanel($source, $panel);

            if ($plugin === null) {
                continue;
            }

            $id = $plugin->id();

            if (isset($seen[$id])) {
                continue;
            }

            if (! $plugin->appliesTo($panel)) {
                continue;
            }

            $seen[$id] = true;
            $plugins[] = $plugin;
        }

        return $plugins;
    }

    /**
     * Every legitimate plugin source, in registration order.
     *
     * EXPLICIT ONLY: global registry, per-panel list, then `panel.plugins`.
     * There is no filesystem scan and no marketplace hook at boot.
     *
     * @return list<Plugins\PanelPlugin|class-string<Plugins\PanelPlugin>>
     */
    private function pluginSources(Panel $panel): array
    {
        $sources = [];

        foreach (self::$plugins as $plugin) {
            $sources[] = $plugin;
        }

        foreach ($panel->getPlugins() as $plugin) {
            $sources[] = $plugin;
        }

        foreach ((array) config('panel.plugins', []) as $class) {
            if (is_string($class) && $class !== '') {
                $sources[] = $class;
            }
        }

        return $sources;
    }

    /**
     * Resolve a plugin instance for `$panel`, caching config classes after first use.
     */
    private function resolvePluginForPanel(Plugins\PanelPlugin|string $source, Panel $panel): ?Plugins\PanelPlugin
    {
        if ($source instanceof Plugins\PanelPlugin) {
            self::$plugins[$source->id()] = $source;

            return $source->appliesTo($panel) ? $source : null;
        }

        if (! class_exists($source)) {
            return null;
        }

        if (! $this->configPluginMayApply($source, $panel)) {
            return null;
        }

        if (isset(self::$resolvedConfigPlugins[$source])) {
            $plugin = self::$resolvedConfigPlugins[$source];

            return $plugin->appliesTo($panel) ? $plugin : null;
        }

        $instance = app($source);

        if (! $instance instanceof Plugins\PanelPlugin) {
            return null;
        }

        if (! $instance->appliesTo($panel)) {
            return null;
        }

        self::$resolvedConfigPlugins[$source] = $instance;
        self::$plugins[$instance->id()] = $instance;

        return $instance;
    }

    /**
     * Whether a config plugin class might apply to `$panel` without constructing it.
     *
     * @param  class-string<Plugins\PanelPlugin>  $class
     */
    private function configPluginMayApply(string $class, Panel $panel): bool
    {
        if (! is_subclass_of($class, Plugins\PanelPlugin::class)) {
            return false;
        }

        $ids = $class::panelIds();

        if ($ids === null) {
            return true;
        }

        return in_array($panel->id, $ids, true);
    }

    /**
     * Navigation entries contributed by plugins, plus the panel's own.
     *
     * ONE LIST FOR THE APPLICATION TO MERGE. The alternative - the app asking
     * for plugin pages, then for the trash entry, then for whatever comes next -
     * means every new panel-provided screen needs a line in every application
     * that ever installed this package, which is precisely the disappearing-page
     * failure the declared-pages test exists to catch.
     *
     * @return list<array{title: string, href: string, icon: string, group: string|null}>
     */
    public function panelPages(?string $panelId = null): array
    {
        $panel = $panelId === null ? $this->currentPanel() : $this->panel($panelId);

        if ($panel === null) {
            return [];
        }

        $this->applyPlugins($panel);

        $pages = [];

        /*
         * SETTINGS HUB FIRST so it seeds the Settings group ahead of
         * Environment/Sitemap (and any host pages that reuse that group name).
         * The client walks panelPages in order and does not re-sort by `sort`,
         * so appending the hub last put it under those rows and made the group
         * look like it only held tooling pages. Hosts opt out with
         * `->sidebarSettings(false)`.
         */
        foreach (Support\SettingsNav::pages($panel) as $entry) {
            $pages[] = $entry;
        }

        /*
         * THE BIN IS NO LONGER IN THIS LIST, and the reason is what the list is
         * FOR. `panelPages` becomes the sidebar - the column of things this
         * panel administers. A bin of records deleted from those screens is
         * about the installation rather than about the subject matter, and it
         * was the only member of a group called Platform, so one entry created a
         * whole heading of its own.
         *
         * It moved to the account menu, beside the backups and the logs, which
         * are the other screens about the installation. The entry itself is
         * still described by the package - see `TrashBin::navigationEntry` - so
         * an application does not have to know a bin exists, or where it lives,
         * or whether this portal has one at all.
         */
        foreach ($this->pluginContexts[$panel->id] ?? [] as $context) {
            foreach ($context->registeredPages() as $page) {
                $pages[] = $page;
            }
        }

        /*
         * DECLARED PAGES PLACE THEMSELVES, exactly as resources do.
         *
         * This list used to hold only what plugins contributed, so an
         * application's own non-resource screens had to be typed into a second
         * array by hand - and a screen that shipped, worked and was tested could
         * still appear in no menu at all. Nothing failed when that happened,
         * which is what made it keep happening.
         */
        foreach ($this->pagesFor($panel->id) as $class) {
            if (! $class::shouldShowInNavigation()) {
                continue;
            }

            if (! $class::isAccessible()) {
                continue;
            }

            $pages[] = $class::navigationEntry($panel->getPath());
        }

        return $pages;
    }

    /**
     * Markup plugins put at a named position - roadmap 4.4.
     *
     * FILTERED BY SCREEN HERE, not in the browser. A hook scoped to
     * `invoices` must not travel to the clients page at all: shipping every
     * plugin's every hook to every screen and hiding the wrong ones with
     * `v-if` is a payload that grows with the plugin list and leaks what a
     * plugin does on screens it has nothing to do with.
     *
     * @param  string|null  $resource  The resource key being rendered, when there is one.
     * @return list<array{position: string, component: string, props: array<string, mixed>}>
     */
    public function renderHooks(?string $resource = null, ?string $panelId = null): array
    {
        $panel = $panelId === null ? $this->currentPanel() : $this->panel($panelId);

        if ($panel === null) {
            return [];
        }

        $this->applyPlugins($panel);

        $out = [];

        foreach ($this->pluginContexts[$panel->id] ?? [] as $context) {
            foreach ($context->registeredRenders() as $hook) {
                $scoped = $hook['resources'];

                if ($scoped !== null && ($resource === null || ! in_array($resource, $scoped, true))) {
                    continue;
                }

                // A hook built against a future position contract must not be
                // rendered with today's props shape. Keep it available through
                // the compatibility report so operators can diagnose the
                // plugin instead of silently mounting a broken component.
                if (! Plugins\RenderHooks::isCompatible($hook['position'], $hook['version'])) {
                    continue;
                }

                $out[] = [
                    'position' => $hook['position'],
                    'component' => $hook['component'],
                    'props' => $hook['props'],
                    'version' => $hook['version'],
                ];
            }
        }

        return $out;
    }

    /**
     * Report render hooks that cannot be safely mounted by this Panel build.
     *
     * @return list<array{position: string, component: string, version: int, expectedVersion: int, compatible: bool}>
     */
    public function renderHookCompatibility(?string $resource = null, ?string $panelId = null): array
    {
        $panel = $panelId === null ? $this->currentPanel() : $this->panel($panelId);

        if ($panel === null) {
            return [];
        }

        $this->applyPlugins($panel);
        $out = [];

        foreach ($this->pluginContexts[$panel->id] ?? [] as $context) {
            foreach ($context->registeredRenders() as $hook) {
                $scoped = $hook['resources'];

                if ($scoped !== null && ($resource === null || ! in_array($resource, $scoped, true))) {
                    continue;
                }

                $expected = Plugins\RenderHooks::positionVersion($hook['position']);
                $out[] = [
                    'position' => $hook['position'],
                    'component' => $hook['component'],
                    'version' => $hook['version'],
                    'expectedVersion' => $expected,
                    'compatible' => $hook['version'] === $expected,
                ];
            }
        }

        return $out;
    }

    /**
     * Route callbacks contributed by plugins, for `PanelRoutes` to mount.
     *
     * @return list<\Closure>
     */
    public function pluginRoutes(string $panelId): array
    {
        $panel = $this->panel($panelId);

        if ($panel === null) {
            return [];
        }

        $this->applyPlugins($panel);

        $routes = [];

        foreach ($this->pluginContexts[$panelId] ?? [] as $context) {
            foreach ($context->registeredRoutes() as $callback) {
                $routes[] = $callback;
            }
        }

        return $routes;
    }

    /**
     * Forget every plugin. TESTS ONLY.
     *
     * The plugin registry is static - boot-time configuration, like the panel
     * list - so a test that installs a plugin would otherwise leave it
     * installed for every test after it, in a suite that passes in order and
     * fails alone.
     *
     * WHAT HAS ALREADY RUN IS NOT STATIC (see `$pluginsApplied`), so clearing
     * it means reaching the live instance. Forgetting the registry without
     * clearing that flag would leave the panels marked as applied with nothing
     * left to apply - the same shape as the bug that made the flag an instance
     * member in the first place.
     */
    public static function forgetPlugins(): void
    {
        self::$plugins = [];
        self::$resolvedConfigPlugins = [];

        $manager = app(self::class);

        $manager->pluginsApplied = [];
        $manager->pluginContexts = [];
    }

    /**
     * The panel a resource CLASS was registered for, or null if nothing
     * recorded one.
     *
     * NULL RATHER THAN A FALLBACK, deliberately. `Resource::panel()` consults
     * this and returns its own declaration when the answer is null, so the two
     * cannot recurse - and the fallback lives in exactly one place instead of
     * at every call site that needs to know where a resource lives.
     *
     * @param  class-string  $class
     */
    public function panelFor(string $class): ?string
    {
        return self::$resourcePanels[$class] ?? null;
    }

    public function panel(string $id): ?Panel
    {
        return self::$panels[$id] ?? null;
    }

    /**
     * Make a panel current for this request.
     *
     * Called by the panel middleware, once, before anything reads context.
     */
    public function usePanel(string $id): void
    {
        if (! isset(self::$panels[$id])) {
            throw new \RuntimeException("Unknown panel [{$id}].");
        }

        $this->currentPanel = $id;
    }

    /**
     * The panel serving this request.
     *
     * FALLS BACK TO THE DEFAULT PANEL, not to null, and that is deliberate: a
     * null return would force every caller into `?->isCentral() ?? false`, and
     * the moment somebody writes `?? true` by accident, tenant scoping is off.
     * An explicit default keeps the dangerous answer from being reachable by a
     * typo.
     */
    public function currentPanel(): ?Panel
    {
        if ($this->currentPanel !== null) {
            return self::$panels[$this->currentPanel];
        }

        return self::$panels[(string) config('panel.default', 'admin')] ?? null;
    }

    /**
     * Whether the current request runs WITHOUT tenant scoping.
     *
     * The single question the tenant scope asks, expressed once here so the
     * answer cannot differ between call sites. Defaults to FALSE - a panel that
     * was never registered, or a request outside any panel, is treated as
     * tenant-scoped. Deny by default: the cost of being wrong in this direction
     * is an empty list, and the cost of being wrong the other way is a leak.
     */
    public function inCentralContext(): bool
    {
        return $this->currentPanel()?->isCentral() ?? false;
    }

    /**
     * Discover resource classes on disk.
     *
     * Runs once at boot and is immutable thereafter, which spec S9 explicitly
     * permits to be cached - the class LIST is tenant-independent. Anything
     * derived from it that depends on tenant or user is not, which is why
     * resolved schemas live in the cache keyed by permissions instead.
     *
     * Discovery is what makes `make:panel-resource --generate` produce a
     * working screen with no hand editing: without it, every generated class
     * would still need a manual registration line.
     */
    /**
     * @param  string|null  $panelId  The portal that OWNS this directory, if any.
     */
    public function discoverResources(string $directory, string $namespace, ?string $panelId = null): void
    {
        if (! is_dir($directory)) {
            return;
        }

        $classes = [];

        foreach (glob(rtrim($directory, '/').'/*.php') ?: [] as $file) {
            $class = rtrim($namespace, '\\').'\\'.basename($file, '.php');

            // Skip anything that is not a concrete resource: an abstract base
            // or a stray helper in the folder must not become a route.
            if (! class_exists($class)) {
                continue;
            }

            $reflection = new \ReflectionClass($class);

            if ($reflection->isAbstract() || ! $reflection->isSubclassOf(Resources\Resource::class)) {
                continue;
            }

            $classes[] = $class;
        }

        $this->registerResources($classes, $panelId);
    }

    /**
     * @param  list<class-string>  $classes
     * @param  string|null  $panelId  Overrides the class's own `panel()`.
     */
    public function registerResources(array $classes, ?string $panelId = null): void
    {
        foreach ($classes as $class) {
            $key = $class::key();

            /*
             * WHERE A PLUGIN'S RESOURCE LANDS IS DECIDED HERE, not by the class.
             *
             * A resource declares `protected static string $panel = 'admin'`,
             * which is right for an application's own classes and impossible for
             * a package's: a plugin cannot know what an installation called its
             * portals, so a hardcoded `'admin'` lands nowhere on an installation
             * whose operator portal is `'isp'`. Recording the panel the
             * registration happened FOR lets the same class install into
             * whichever panel accepted the plugin.
             */
            if ($panelId !== null) {
                /*
                 * A RESOURCE BELONGS TO EXACTLY ONE PANEL, and a second claim
                 * throws rather than overwriting.
                 *
                 * This is not theoretical: a plugin that applies to two tenant
                 * portals registers its resource for both, the last write wins,
                 * and the FIRST portal ends up with a navigation entry pointing
                 * at a URL its own route constraint refuses - a 404 on a screen
                 * the menu insists exists. Keys are globally unique because they
                 * are URL segments and ability names, so one class genuinely
                 * cannot serve two portals; the fix is a second class with its
                 * own key, exactly as the reseller portal's plans resource does.
                 */
                $existing = self::$resourcePanels[$class] ?? null;

                if ($existing !== null && $existing !== $panelId) {
                    throw new \RuntimeException(
                        "The resource {$class} was registered for the [{$existing}] panel and again for "
                        ."[{$panelId}]. A resource belongs to one panel: its key is a URL segment and an "
                        .'ability name. Register a subclass with its own `key()` for the second portal.'
                    );
                }

                self::$resourcePanels[$class] = $panelId;
            }

            $effectivePanelId = $panelId ?? $class::panel();

            /*
             * A KEY IS UNIQUE WITHIN A PANEL, and a same-panel collision throws
             * rather than overwriting.
             *
             * IT USED TO THROW GLOBALLY. Two portals that naturally share a name
             * - both have a `DashboardPage`, both have a `UserResource` keyed
             * `users` - had to rename one, often to an `admin-`-prefixed slug
             * that served no purpose outside the collision rule. Their URLs are
             * already namespaced by the panel's path prefix (`/admin/users` vs
             * `/client/users`), so there is no actual collision to prevent.
             *
             * THE CHECK IS STILL WITHIN-PANEL: two resources in the SAME portal
             * claiming the same key are two URL segments on the same prefix, and
             * whichever route registers first silently wins. That failure is
             * unchanged and still throws.
             *
             * Ability names, schema-cache keys and audit labels are looked up
             * through the per-panel resource map (see `resourcesFor`), so a key
             * that exists in two panels resolves unambiguously within each.
             */
            $this->panelResourceMap[$effectivePanelId] ??= [];

            if (isset($this->panelResourceMap[$effectivePanelId][$key])
                && $this->panelResourceMap[$effectivePanelId][$key] !== $class) {
                $existing = $this->panelResourceMap[$effectivePanelId][$key];

                throw new \RuntimeException(
                    "Two resources in the [{$effectivePanelId}] panel both use the key [{$key}]: "
                    ."{$existing} and {$class}. "
                    .'Override `public static function key(): string` on one of them.'
                );
            }

            $this->panelResourceMap[$effectivePanelId][$key] = $class;

            /*
             * THE CROSS-CHECK AGAINST PAGES IS PER-PANEL for the same reason:
             * `/admin/roles` (a resource) and `/client/roles` (a page) are
             * different URLs on different prefixes and do not collide. Only a
             * resource and a page in the SAME panel claiming the same segment
             * are actually unreachable from each other.
             */
            if (isset($this->panelPageMap[$effectivePanelId][$key])) {
                throw new \RuntimeException(
                    "The resource {$class} uses the key [{$key}], which is already the slug of the page "
                    .$this->panelPageMap[$effectivePanelId][$key].'. Both are URL segments in the same '
                    .'panel, so one of them would be unreachable. Rename one.'
                );
            }

            // Global flat map: first registration wins (backward-compat fallback
            // for lookup without panel context, e.g. from commands or tests).
            $this->resources[$key] ??= $class;
        }
    }

    /**
     * A resource by key, panel-scoped when a panel is explicitly active.
     *
     * PANEL-CONTEXT FIRST: if `UsePanel` has fired and set `$this->currentPanel`,
     * the lookup checks the current panel's resource map first. This is what lets
     * two panels share a key (e.g. both have a resource keyed `users`) without
     * ambiguity — when a `/admin/users` request is being handled, `users` resolves
     * to the admin panel's class, not the client portal's.
     *
     * GLOBAL FALLBACK when the key is not in the current panel, and for all
     * contexts without an explicit panel (queued jobs, artisan commands). The URL
     * constraint on the route (`whereIn` the panel's keys) is the primary guard
     * against cross-panel access — a request for `/admin/reseller-plans` never
     * matches the route at all, so the controller's `resource()` call is never
     * reached with a foreign key. The per-panel check here is defense-in-depth,
     * not the only line of defence.
     *
     * Note: `currentPanel()` (the method) falls back to the configured default
     * panel even with no active panel — so this method checks `$this->currentPanel`
     * (the field) to distinguish "explicitly set" from "defaulted".
     */
    public function resource(string $key): ?string
    {
        $this->resources(); // ensure discovery and panelResourceMap are populated

        if ($this->currentPanel !== null) {
            $panelResult = $this->panelResourceMap[$this->currentPanel][$key] ?? null;

            if ($panelResult !== null) {
                return $panelResult;
            }
        }

        return $this->resources[$key] ?? null;
    }

    /**
     * Singular resources for one panel - roadmap 4.3.
     *
     * FROM CONFIG, NOT DISCOVERY. There are few of them by nature - a screen
     * with one record is a considered decision, not something generated by
     * the dozen - and a config list keeps "which screens exist" grep-able.
     *
     * @return array<string, class-string<Resources\SingularResource>>
     */
    public function singularsFor(string $panelId): array
    {
        $out = [];

        foreach ((array) config('panel.singulars', []) as $class) {
            if ($class::panel() === $panelId) {
                $out[$class::key()] = $class;
            }
        }

        return $out;
    }

    /** @return class-string<Resources\SingularResource>|null */
    public function singular(string $key, ?string $panelId = null): ?string
    {
        $panelId ??= $this->currentPanel()?->id ?? (string) config('panel.default', 'admin');

        return $this->singularsFor($panelId)[$key] ?? null;
    }

    /**
     * The sub-navigation for one resource's cluster, or null - roadmap 4.1.
     *
     * BUILT PER REQUEST, NEVER CACHED WITH THE SCHEMA. The items are filtered
     * by what THIS person may open (`can('viewAny')`), and a schema is cached
     * across people; baking a permission-filtered list into it would show the
     * first visitor's abilities to everyone after them.
     *
     * A CLUSTER OF ONE STILL SHOWS ITS STRIP when the cluster declares pages -
     * the strip is how those pages are reached - and shows nothing when the
     * only content is the screen already open: a sub-navigation whose every
     * entry is "where you are" is decoration.
     *
     * @param  class-string  $resourceClass
     * @return array{key: string, label: string, items: list<array{title: string, href: string, current: bool}>}|null
     */
    public function clusterNavFor(string $resourceClass): ?array
    {
        $cluster = $resourceClass::cluster();

        if ($cluster === null) {
            return null;
        }

        $prefix = rtrim('/'.trim((string) $this->currentPanel()?->getPath(), '/'), '/');

        $items = [];

        foreach ($this->resourcesFor($resourceClass::panel()) as $class) {
            if ($class::cluster() !== $cluster || ! $class::can('viewAny')) {
                continue;
            }

            $items[] = [
                'title' => $class::pluralLabel(),
                'href' => $prefix.'/'.$class::key(),
                'current' => $class === $resourceClass,
                'sort' => $class::navigationSort(),
            ];
        }

        usort($items, static fn (array $a, array $b): int => [$a['sort'], $a['title']] <=> [$b['sort'], $b['title']]);

        $items = array_map(static function (array $item): array {
            unset($item['sort']);

            return $item;
        }, $items);

        foreach ($cluster::pages() as $page) {
            $items[] = [
                'title' => $page['title'],
                'href' => $page['href'],
                'current' => false,
            ];
        }

        if (count($items) < 2) {
            return null;
        }

        return [
            'key' => $cluster::key(),
            'label' => $cluster::label(),
            'items' => $items,
        ];
    }

    /**
     * Resources belonging to one panel.
     *
     * WHY THIS EXISTS RATHER THAN ONE FLAT LIST: the super admin's Tenants
     * resource and the tenant admin's Clients resource must not appear in each
     * other's navigation, and - far more importantly - must not be REACHABLE
     * from each other's routes. A single registry with a shared `{resource}`
     * route segment would let a tenant-panel URL resolve a central-panel
     * resource, which is a central-context query reached from a tenant request.
     *
     * @return array<string, class-string>
     */
    public function resourcesFor(string $panelId): array
    {
        /*
         * PLUGINS RUN BEFORE THE LIST IS READ, and this is where it has to
         * happen rather than at boot.
         *
         * The application computes its route keys from this method while its
         * route file loads - earlier than any hook a plugin could use - so a
         * plugin's resource was registered AFTER the `whereIn` constraint had
         * already been built from a list that did not contain it. The screen
         * existed, the navigation linked it, and the URL 404ed.
         *
         * Applying here means every caller - routes, navigation, the trash bin,
         * the API - sees the same set, whichever runs first. It is idempotent
         * per panel, so this costs one array lookup after the first call.
         */
        $panel = $this->panel($panelId);

        if ($panel !== null) {
            $this->applyPlugins($panel);
        }

        // Trigger discovery so panelResourceMap is populated.
        $this->resources();

        return $this->panelResourceMap[$panelId] ?? [];
    }

    /**
     * Registered resources, discovering on first access.
     *
     * LAZY on purpose. Discovering during a provider's boot() looks tidier and
     * is order-dependent: route files are loaded by the framework's routing
     * bootstrapper, which can run before the application provider boots, so the
     * registry was empty exactly when the routes needed it and every resource
     * 404ed. Resolving on demand cannot be sequenced wrongly.
     *
     * @return array<string, class-string>
     */
    /**
     * Every page this installation declares, keyed by slug.
     *
     * DISCOVERED LAZILY AND ONCE, exactly as resources are - the directories
     * come from `panel.discover_pages`, so an application says where its pages
     * live in the same breath as where its resources do.
     *
     * @return array<string, class-string<Pages\Page>>
     */
    public function pages(): array
    {
        if (! $this->pagesDiscovered) {
            $this->pagesDiscovered = true;

            /*
             * THE PACKAGE'S OWN PAGES FIRST, because discovery cannot find them.
             *
             * `discover_pages` scans the APPLICATION's directory - which is
             * right, and meant `ChangelogPage` and `EnvironmentPage` shipped
             * into a namespace nothing scanned. Both were exported, both had
             * page files written by `panel:install`, and neither was ever
             * routed: a screen that exists in every sense except the one that
             * matters.
             *
             * That is the third time this shape has shipped here - widgets with
             * no host, a roles route with no page file - so these are registered
             * the way commands and routes are, by the package that owns them.
             * Each still hides itself until configured.
             */
            $this->registerPages(self::PACKAGE_PAGES);

            /* A portal's own screens, as `Panel::discoverPages()` declared them. */
            foreach (self::$panels as $panel) {
                foreach ($panel->getPageDirectories() as $directory => $namespace) {
                    $this->discoverPages($directory, $namespace);
                }
            }

            foreach ((array) config('panel.discover_pages', []) as $directory => $namespace) {
                $this->discoverPages($directory, $namespace);
            }
        }

        return $this->pages;
    }

    /**
     * A page by slug, panel-scoped when a panel is explicitly active.
     *
     * Two panels may share a slug (e.g. both have a `DashboardPage` slugged
     * `dashboard`). When `UsePanel` has fired, the current panel's map is checked
     * first — this is what ensures `/admin/dashboard` and `/client/dashboard`
     * resolve to their respective page classes rather than whichever registered
     * last. The global flat map is the fallback for all other contexts.
     *
     * See `resource()` for the rationale on checking `$this->currentPanel` (the
     * field) instead of `currentPanel()` (the method that defaults to a panel).
     *
     * @return class-string<Pages\Page>|null
     */
    public function page(string $slug): ?string
    {
        $this->pages(); // ensure discovery and panelPageMap are populated

        if ($this->currentPanel !== null) {
            $panelResult = $this->panelPageMap[$this->currentPanel][$slug] ?? null;

            if ($panelResult !== null) {
                return $panelResult;
            }
        }

        return $this->pages[$slug] ?? null;
    }

    /**
     * Pages belonging to one portal.
     *
     * @return array<string, class-string<Pages\Page>>
     */
    public function pagesFor(string $panelId): array
    {
        /*
         * PLUGINS RUN BEFORE THE LIST IS READ, and this is where it has to
         * happen rather than at boot.
         *
         * Plugin Page classes registered through `registerPages()` / `pageClasses()`
         * must be in the map when `PanelRoutes` mounts page routes. Applying
         * here means boot-time registration and every later caller see the same
         * set, whichever runs first. It is idempotent per panel, so this costs
         * one array lookup after the first call.
         */
        $panel = $this->panel($panelId);

        if ($panel !== null) {
            $this->applyPlugins($panel);
        }

        $this->pages(); // ensure discovery and panelPageMap are populated

        return $this->panelPageMap[$panelId] ?? [];
    }

    public function discoverPages(string $directory, string $namespace): void
    {
        if (! is_dir($directory)) {
            return;
        }

        $classes = [];

        foreach (glob(rtrim($directory, '/').'/*.php') ?: [] as $file) {
            $class = rtrim($namespace, '\\').'\\'.basename($file, '.php');

            if (! class_exists($class)) {
                continue;
            }

            $reflection = new \ReflectionClass($class);

            // An abstract base or a helper sitting in the folder must not
            // become a route, for the same reason it must not become a resource.
            if ($reflection->isAbstract() || ! $reflection->isSubclassOf(Pages\Page::class)) {
                continue;
            }

            $classes[] = $class;
        }

        $this->registerPages($classes);
    }

    /**
     * @param  list<class-string<Pages\Page>>  $classes
     */
    /**
     * @param  list<class-string<Pages\Page>>  $classes
     * @param  string|null  $panelIdOverride  Overrides the class `panel()` declaration.
     */
    public function registerPages(array $classes, ?string $panelIdOverride = null): void
    {
        foreach ($classes as $class) {
            /*
             * A DISABLED PAGE IS NOT REGISTERED, so it routes nothing and
             * collides with nothing - see `Page::isEnabled()` for the screen
             * this rule exists to have not replaced.
             */
            if (! $class::isEnabled()) {
                continue;
            }

            $slug = $class::slug();
            $panelId = $panelIdOverride ?? $class::panel();

            $this->panelPageMap[$panelId] ??= [];

            /*
             * SLUG AND KEY COLLISIONS ARE NOW PER-PANEL. Two portals can both
             * have a `DashboardPage` (slug `dashboard`) because `/admin/dashboard`
             * and `/client/dashboard` are different URLs. Only a page and a
             * resource in the SAME panel on the SAME slug are an actual conflict.
             */
            if (isset($this->panelResourceMap[$panelId][$slug])) {
                throw new \RuntimeException(
                    "The page {$class} uses the slug [{$slug}], which is already the key of the resource "
                    .$this->panelResourceMap[$panelId][$slug].'. Both are URL segments in the same panel, '
                    .'so one of them would be unreachable. Rename one.'
                );
            }

            if (isset($this->panelPageMap[$panelId][$slug]) && $this->panelPageMap[$panelId][$slug] !== $class) {
                throw new \RuntimeException(
                    "Two pages in the [{$panelId}] panel claim the slug [{$slug}]: "
                    .$this->panelPageMap[$panelId][$slug]." and {$class}."
                );
            }

            $this->panelPageMap[$panelId][$slug] = $class;

            // Global flat map: first registration wins (backward-compat fallback).
            $this->pages[$slug] ??= $class;
        }
    }

    public function resources(): array
    {
        if (! $this->discovered) {
            $this->discovered = true;

            foreach ((array) config('panel.discover', []) as $directory => $namespace) {
                $this->discoverResources($directory, $namespace);
            }

            /*
             * A PORTAL'S OWN DIRECTORIES, so ownership follows the folder
             * rather than the class property - see
             * `Panel::discoverResources()`. The two passes coexist because
             * only this one records an OWNER; the global pass records none and
             * leaves that decision alone, so a directory in both lists still
             * belongs to the panel that claimed it.
             *
             * AFTER THE GLOBAL LIST, NOT BEFORE, AND REGISTRATION ORDER IS
             * LOAD-BEARING. `Abilities::forModel()` resolves a model to the
             * FIRST registered resource that owns it, so the order decides
             * which ability name a shared-model policy checks. Running these
             * first moved `Plan` from `editable-plans` to the client portal's
             * resource and turned an authorised screen into a 403 - see
             * `ClusterTest`, which documents the dependency and is what
             * caught it. Panel directories used to be appended to
             * `panel.discover` by their providers, which put them last; they
             * stay last.
             */
            foreach (self::$panels as $panel) {
                foreach ($panel->getResourceDirectories() as $directory => $namespace) {
                    $this->discoverResources($directory, $namespace, $panel->id);
                }
            }
        }

        return $this->resources;
    }

    /**
     * Cleared by the Octane flush listener in PanelServiceProvider.
     *
     * Static because the listener has no instance to reach. Nothing
     * TENANT-derived is permitted in a static in the first place - what
     * belongs here is process-level state about the INSTALLATION, which a
     * long-lived worker may outlive.
     */
    public static function flushMemoization(): void
    {
        CustomFields\CustomField::flushMemoization();
    }

    public function remember(string $key, \Closure $resolve): mixed
    {
        return $this->memo[$key] ??= $resolve();
    }
}
