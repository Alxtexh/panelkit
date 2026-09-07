<?php

declare(strict_types=1);

namespace Alxtexh\Panel;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Contracts\Http\Kernel as HttpKernel;
use Illuminate\Contracts\Events\Dispatcher as EventsDispatcher;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Notifications\ChannelManager;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/**
 * Phase 0: registration only. Resources, routing, and the schema layer arrive
 * in Phase 4 - the spec is explicit that abstracting before then is guesswork.
 *
 * The two things established here are not deferrable, because retrofitting them
 * is what produces cross-tenant leaks under a long-lived worker (spec §9):
 *
 *   1. PanelManager is bound `scoped`, never `singleton`. Octane resets scoped
 *      bindings between requests; a singleton would carry one tenant's resolved
 *      state into the next tenant's request on the same worker.
 *   2. A flush hook clears package memoization on Octane's RequestReceived.
 */
final class PanelServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergePanelConfig();

        // Scoped, not singleton. See note above - this is load-bearing.
        $this->app->scoped(PanelManager::class, fn () => new PanelManager);

        // Also scoped: it resolves the current tenant, which is per-request
        // state by definition. A singleton here is the classic Octane leak.
        $this->app->scoped(Support\TenantContext::class, fn () => new Support\TenantContext);

        // Same reasoning, for `Tenants::current()`'s own memo - see that
        // method's docblock for why `$request->attributes` could not be used
        // instead (SharePanelProps hands it two genuinely different Request
        // objects across its two passes; the container is what both share).
        $this->app->scoped(Support\Tenants::MEMO_BINDING, fn () => new \ArrayObject());

        // Same reasoning again, for `WorkflowOverride::forResource()` - see
        // that method's own docblock. A per-row `visible()` closure on every
        // declared transition action multiplied this by (rows x transitions)
        // on any workflow-eligible list.
        $this->app->scoped(Workflow\WorkflowOverride::MEMO_BINDING, fn () => new \ArrayObject());

        // Stateless, so a singleton is safe here - it holds no request or tenant
        // data, which is the only thing S9 forbids in a long-lived binding.
        $this->app->singleton(Support\SchemaCache::class);

        /*
         * DOCUMENT KINDS ARE A BOOT-TIME REGISTRY, so a singleton is right: what
         * is registered is decided by which service providers ran, never by who
         * is signed in. The templates themselves are tenant data and live in a
         * table; nothing tenant-scoped is held here.
         *
         * The three that ship are registered in `register()` rather than
         * `boot()` so that an application's own provider - which boots later -
         * can replace one by registering the same id, without having to worry
         * about ordering.
         */
        if (class_exists(Documents\DocumentKinds::class)) {
            $this->app->singleton(Documents\DocumentKinds::class, static function (): Documents\DocumentKinds {
                $kinds = new Documents\DocumentKinds;

                $kinds->register(new Documents\Kinds\InvoiceKind);
                $kinds->register(new Documents\Kinds\ReceiptKind);
                $kinds->register(new Documents\Kinds\VoucherKind);

                return $kinds;
            });
        }

        /*
         * WHERE A DOCUMENT'S LETTERHEAD COMES FROM.
         *
         * Bound to the INTERFACE so an application can supply its own without
         * touching the renderer - which it has to, because the logo is a file on
         * a private disk behind the application's own authenticated route and
         * this package cannot construct that URL.
         *
         * Scoped, not singleton: it reads the CURRENT organisation, so a
         * long-lived binding under Octane would serve one customer's name on
         * another's invoice.
         */
        if (interface_exists(Documents\DocumentBranding::class)) {
            $this->app->scopedIf(Documents\DocumentBranding::class, Documents\TenantBranding::class);
        }

        if (class_exists(Documents\DocumentRenderer::class)) {
            $this->app->singleton(Documents\DocumentRenderer::class);
        }

        /*
         * Scoped, because it memoizes rows it has read. Installation settings
         * are not tenant data, so a leak here would not cross customers - but a
         * singleton under Octane would hold the retention policy as it stood
         * when the worker booted, and an operator who changed it would watch the
         * old one keep running with nothing to explain why.
         */
        $this->app->scoped(Support\PanelSettings::class);

        /*
         * THE EMBEDDER IS RESOLVED FROM CONFIG, not hardcoded, because which
         * model - and whether an outbound call is acceptable at all - is the
         * installation's decision and not the panel's. The default is local and
         * free; see `config/panel.php` and `HashEmbedder`.
         *
         * Bound to the INTERFACE so `KnowledgeBase` never names an
         * implementation, and a test can swap one in without touching config.
         */
        $this->app->bind(Knowledge\Embedder::class, static function ($app): Knowledge\Embedder {
            $class = (string) config('panel.knowledge.embedder', Knowledge\HashEmbedder::class);

            /*
             * `ProviderEmbedder` takes its settings from config, and the
             * container cannot guess them - it would try to autowire an `int`
             * and fail with a message about an unresolvable primitive rather
             * than about embeddings.
             */
            if ($class === Knowledge\ProviderEmbedder::class) {
                return new Knowledge\ProviderEmbedder(
                    (int) config('panel.knowledge.dimensions', 1536),
                    config('panel.knowledge.provider'),
                    config('panel.knowledge.model'),
                );
            }

            return $app->make($class);
        });
    }

    public function boot(): void
    {
        // The suspension wall renders before the session loads, so it cannot be
        // an Inertia page - see the view's own note.
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'panel');

        /*
         * KIT STRINGS, loaded as `panel::*`. Hosts publish and overlay; they do
         * not invent a second i18n stack. Vue reads the same keys from the
         * shared `messages` prop. See `Locale::messages()`.
         */
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'panel');

        /*
         * JS writes this cookie as plaintext, like sidebar_state. Encrypting
         * it would drop the next request's value and reopen the guide.
         */
        EncryptCookies::except([
            Support\OnboardingSteps::COOKIE,
        ]);

        /*
         * LOADED, NOT PUBLISHED. `panel_settings` is the package's own table -
         * an application never edits its columns - so publishing the migration
         * would only create a copy that drifts. Publishing is for things an
         * installation is expected to change; this is not one of them.
         */
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        /*
         * THE PANEL'S OWN ERROR SCREENS. Registered here because the alternative
         * is a closure every consumer pastes into `bootstrap/app.php`, and the
         * failure when they forget is a default error page - which looks like a
         * decision rather than an omission. See `PanelErrors` for why it only
         * takes over inside a panel.
         */
        Http\PanelErrors::register();

        /*
         * COMMANDS ARE REGISTERED ALWAYS, publishing only in console.
         *
         * They were both inside a `runningInConsole()` guard, which reads as
         * correct and is not: `Artisan::call()` from an HTTP request goes
         * through the same registry, so the platform screen asking for
         * `panel:doctor` got "the command does not exist" - on an installation
         * where it exists and works perfectly from a shell. Registration is
         * cheap and has no effect on a web request that never calls one.
         *
         * PUBLISHING STAYS GUARDED, because it genuinely only means something to
         * `vendor:publish`.
         */
        $commands = [
            Commands\BackupCommand::class,
            Commands\BillingCheckCommand::class,
            Commands\BlueprintCommand::class,
            Commands\CacheClearCommand::class,
            Commands\InstallCommand::class,
            Commands\SetupCommand::class,
            Commands\IndexKnowledgeCommand::class,
            Commands\MakeApiTokenCommand::class,
            Commands\MakePageCommand::class,
            Commands\MakeModuleCommand::class,
            Commands\MakePanelCommand::class,
            Commands\MakeRelationManagerCommand::class,
            Commands\MakeWidgetCommand::class,
            Commands\MakePanelPluginCommand::class,
            Commands\MakeImporterCommand::class,
            Commands\SearchIndexCommand::class,
            Commands\MakeUserCommand::class,
            Commands\SitemapGenerateCommand::class,
            Commands\MakeResourceCommand::class,
            Commands\MakeRecipeCommand::class,
            Commands\ReindexTenantCommand::class,
            Commands\DoctorCommand::class,
            Commands\ModulesCommand::class,
            Commands\ValidateCommand::class,
            Commands\SuspendTenantCommand::class,
            Commands\UpdateCommand::class,
            Commands\MonitorSampleCommand::class,
            Commands\PermissionsCommand::class,
            Commands\BenchmarkCommand::class,
            Commands\RefreshRollupsCommand::class,
            Commands\PruneExportsCommand::class,
            Commands\DoctorAlertCommand::class,
            Commands\PruneTrashCommand::class,
            Commands\PruneUploadsCommand::class,
            Commands\NotificationsDigestCommand::class,
        ];

        // Operations are optional; core must still boot without their command.
        if (class_exists('Alxtexh\\Panel\\Commands\\DispatchScheduledReportsCommand')) {
            $commands[] = 'Alxtexh\\Panel\\Commands\\DispatchScheduledReportsCommand';
        }

        $this->commands($commands);

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/panel.php' => config_path('panel.php'),
            ], 'panel-config');

            $this->publishes([
                __DIR__.'/../resources/lang' => $this->app->langPath('vendor/panel'),
            ], 'panel-lang');
        }

        /*
         * EVERY REGISTERED PANEL GETS ITS ROUTES, with no route file to edit.
         *
         * That is what makes `make:panel` produce a working portal rather than a
         * provider somebody then has to wire up. A panel with no resources
         * registers nothing - see `PanelRoutes::register` - so this is free
         * until there is something to route.
         *
         * DEFERRED TO `booted`, WHICH IS NOT A DETAIL. Package providers boot
         * BEFORE application ones, so calling this directly found an empty panel
         * registry - the application's own provider had not run yet - and every
         * resource 404ed while `panel:doctor` and the registry both reported the
         * panels as present. The routes existed nowhere and nothing said so.
         *
         * `booted` runs once every provider has registered, which is the only
         * moment the panel list is complete.
         */
        $this->app->booted(static function (): void {
            Http\PanelRoutes::registerAll();

            /*
             * THE PUBLIC API, mounted once rather than per panel. A panel is how
             * a PERSON reaches data; a token is an integration reading records,
             * and making it choose a portal would leak an interface detail into
             * a contract. See `ApiRoutes`.
             */
            Http\ApiRoutes::register();
        });

        $this->registerTenantUserProvider();
        $this->registerSessionLimit();
        $this->registerPackagedPolicies();
        $this->loadGeneratedAuthRoutes();
        $this->redirectGuestsToTheirPanel();

        $this->app->make(\Illuminate\Routing\Router::class)->aliasMiddleware(
            'panel.module',
            Http\Middleware\EnsureModule::class,
        );

        /*
         * SHELL PROPS ON EVERY WEB REQUEST, not only packaged panel routes.
         *
         * App-owned pages (a host operations screen, `/about`, a lock route
         * the application registered) used to skip SharePanelProps, so the
         * account menu, footer and padlock vanished the moment you left a
         * packaged URL. `panel:install` also writes this into bootstrap/app.php
         * so the host can see it; this registration is the floor if that
         * patch is skipped. Panel route groups still run it AFTER UsePanel.
         */
        $this->sharePanelPropsOnWeb();
        $this->verifyTurnstileOnWeb();

        /*
         * The AI SDK's conversation tables are tenant data and arrive without a
         * tenant. Attached rather than forked, because the package is 0.x and a
         * fork would be silently dropped by the next `composer update`.
         */
        if (class_exists(Ai\TenantScopedConversations::class)) {
            Ai\TenantScopedConversations::attach();
        }
        // Roadmap 5.4: an announcement whose composer chose the bell or
        // Telegram delivers there once, on create.
        Alerts\AnnouncementDelivery::attach();
        $this->registerTelegram();
        $this->registerOctaneFlush();
    }

    /**
     * Share panel chrome on every `web` request.
     *
     * THE HTTP KERNEL, not only the router. `Router::pushMiddlewareToGroup`
     * updates the router's map; Laravel 11+ still dispatches from the kernel's
     * own copy, so a host route whose middleware is the group name `web` never
     * ran SharePanelProps and the shell fell off. The kernel method keeps both
     * in step. Idempotent: `panel:install` may already have appended the class
     * in `bootstrap/app.php`.
     */
    private function sharePanelPropsOnWeb(): void
    {
        $class = Http\Middleware\SharePanelProps::class;
        $kernel = $this->app->make(Kernel::class);
        $groups = $kernel->getMiddlewareGroups();

        if (in_array($class, $groups['web'] ?? [], true)) {
            return;
        }

        if (method_exists($kernel, 'pushMiddlewareToGroup')) {
            $kernel->pushMiddlewareToGroup('web', $class);

            return;
        }

        $this->app->make(\Illuminate\Routing\Router::class)->pushMiddlewareToGroup('web', $class);
    }

    /**
     * Turnstile on every auth write, without the host having to remember it.
     *
     * SAME SHAPE AS `sharePanelPropsOnWeb`. Playground already lists
     * VerifyTurnstile in bootstrap/app.php; a generated portal did not, so the
     * widget on `{panel}/login` posted a token nothing checked.
     */
    private function verifyTurnstileOnWeb(): void
    {
        $class = Http\Middleware\VerifyTurnstile::class;
        $kernel = $this->app->make(Kernel::class);
        $groups = $kernel->getMiddlewareGroups();

        if (in_array($class, $groups['web'] ?? [], true)) {
            return;
        }

        if (method_exists($kernel, 'pushMiddlewareToGroup')) {
            $kernel->pushMiddlewareToGroup('web', $class);

            return;
        }

        $this->app->make(\Illuminate\Routing\Router::class)->pushMiddlewareToGroup('web', $class);
    }

    /**
     * The package's config, merged INTO a published one KEY BY KEY.
     *
     * `mergeConfigFrom` is shallow, so a published `config/panel.php` supplies
     * each top-level array WHOLE and every key a later version added inside one
     * is read as unset - the shape of an absent feature rather than of a
     * missing setting. `ConfigMerge` carries the rule and the reasoning; the
     * short version is that maps are namespaces and lists are values.
     *
     * THE CACHE CHECK IS `mergeConfigFrom`'s OWN and is not optional. A cached
     * config file already holds the merged result, and merging again would
     * quietly reinstate package defaults over an installation that changed them
     * since - the opposite of the bug this method exists to fix.
     */
    private function mergePanelConfig(): void
    {
        if ($this->app->configurationIsCached()) {
            return;
        }

        $config = $this->app->make('config');

        $config->set('panel', Support\ConfigMerge::deep(
            require __DIR__.'/../config/panel.php',
            (array) $config->get('panel', []),
        ));
    }

    /**
     * Cap how many places one account may be signed in at once.
     *
     * Listens rather than wraps the login controller, so it applies to every
     * route into the application - the form, a passkey, a magic link, an
     * impersonation - without each of them remembering to call it.
     */
    private function registerSessionLimit(): void
    {
        if (! $this->app->bound('events')) {
            return;
        }

        $this->app->make(EventsDispatcher::class)->listen(
            Login::class,
            Auth\EnforceSessionLimit::class,
        );

        /*
         * THE PACKAGED ANSWER TO A NEW TICKET, and the only one it ships.
         *
         * Registered here rather than called from the model so an installation
         * can add its own - a webhook, an email to a rota - without editing a
         * vendored class. It alerts on urgent tickets only and never throws:
         * see the listener, where that restraint is the reason the channel
         * stays worth having.
         */
        $this->app->make(EventsDispatcher::class)->listen(
            Events\TicketOpened::class,
            Listeners\AnnounceNewTicket::class,
        );

        $this->app['events']->listen(
            Events\CommentCreated::class,
            Listeners\SendCommentMentionNotifications::class,
        );
    }

    /**
     * SEND AN UNAUTHENTICATED VISITOR TO **THIS PANEL'S** SIGN-IN.
     *
     * Laravel's `Authenticate` middleware redirects to `route('login')`, a name
     * this package deliberately never registers - the whole point of generating
     * sign-in under the panel's own prefix is that a starter kit keeps `/login`.
     * The consequence, until this existed, was that a fresh install with a
     * generated portal answered every guarded page with `Route [login] not
     * defined`: an error about a route nobody said you needed.
     *
     * THE PANEL IS ASKED FIRST, then the application. A second portal has its
     * own guard and its own door, so a guest at `/reseller/clients` belongs at
     * `/reseller/login` rather than at whatever the application calls its main
     * sign-in - sending them there would authenticate them against the wrong
     * guard and bounce them straight back.
     *
     * AN APPLICATION WITH ITS OWN `login` STILL WINS WHERE THERE IS NO PANEL
     * ROUTE. This is a fallback, not a takeover: Breeze, Jetstream and Fortify
     * installations behave exactly as before, because the panel branch simply
     * does not match.
     */
    private function redirectGuestsToTheirPanel(): void
    {
        /*
         * REGISTERED FROM `afterResolving(HttpKernel)`, NOT FROM `boot()`, AND
         * THAT IS THE WHOLE REASON THIS EVER WORKED.
         *
         * IT DID NOT WORK. For every release that shipped it, this method set
         * the callback during `boot()` and the framework then set its own on
         * top: `ApplicationBuilder::withMiddleware()` registers
         * `redirectGuestsTo(fn () => route('login'))` inside
         * `afterResolving(HttpKernel::class)`, which fires when the kernel is
         * resolved to handle a request - after every provider has booted. Last
         * write wins, and it was never ours.
         *
         * SO EVERY PORTAL SHARED THE APPLICATION'S FRONT DOOR. `/client` and
         * `/superadmin` both sent a guest to `//login` with the panel's own
         * sign-in route registered, named and reachable - the redirect simply
         * never consulted it. Nothing errored, the form rendered, and it
         * authenticated against the wrong guard; the only visible symptom was
         * two portals that looked like one.
         *
         * The tests in `SuperadminPanelIsolationTest` assert the redirect
         * TARGET rather than merely that a redirect happened, because the
         * weaker assertion is what let this sit unnoticed.
         */
        $this->app->afterResolving(HttpKernel::class, static function (): void {
            self::redirectUsingThePanel();
        });

        // And once now, for the console and for tests that never resolve an
        // HTTP kernel.
        self::redirectUsingThePanel();
    }

    private static function redirectUsingThePanel(): void
    {
        Authenticate::redirectUsing(static function ($request): ?string {
            $routes = Route::getRoutes();

            $panel = app(PanelManager::class)->currentPanel();

            if ($panel !== null && $routes->getByName("{$panel->id}.login") !== null) {
                return route("{$panel->id}.login");
            }

            /*
             * NULL RATHER THAN A GUESS. Returning `/login` unconditionally would
             * turn a missing route into a 404 loop; null lets the framework
             * raise its own AuthenticationException, which an API client reads
             * as a 401 and a browser as the application's own handling.
             */
            return $routes->getByName('login') === null ? null : route('login');
        });
    }

    /**
     * SIGN-IN ROUTES WRITTEN BY `make:panel --auth`.
     *
     * THE FILE IS THE APPLICATION'S AND LOADING IT IS THE PACKAGE'S, which is
     * the split that makes this work at all. The generator's first version
     * edited `bootstrap/app.php` with a regex looking for a `then:` closure - a
     * stock Laravel application has none, so the routes were written, never
     * loaded, and `route:list` was empty while the command reported success.
     * A glob has nothing to miss.
     *
     * DELETING THE FILE REMOVES THE ROUTES, which is what somebody reading it
     * would expect and the reason this is a glob rather than a config list that
     * could disagree with what is on disk.
     *
     * `web` IS APPLIED HERE, not in the generated file, because these need the
     * session and the CSRF token and forgetting that produces a login form that
     * 419s on submit - an error nobody reads as "the middleware group is
     * missing".
     */
    private function loadGeneratedAuthRoutes(): void
    {
        if (! $this->app->bound('router')) {
            return;
        }

        foreach (glob($this->app->basePath('routes/panel-*-auth.php')) ?: [] as $file) {
            Route::middleware('web')->group($file);
        }
    }

    /**
     * POLICIES FOR THE MODELS THIS PACKAGE OWNS.
     *
     * A model that ships without one is a model the panel DENIES - that is the
     * deliberate posture everywhere else, and applied to the package's own
     * tables it means a feature that installs itself and then refuses every
     * request. `Announcement` spent a release like that in every application
     * except the reference one, which registered the mapping by hand.
     *
     * `Gate::policy` RATHER THAN DISCOVERY, because Laravel's convention maps
     * `App\Models\X` to `App\Policies\XPolicy` and neither half of that is
     * where these live.
     *
     * AN APPLICATION CAN STILL REPLACE IT. This runs in `boot()`, and an
     * application's own provider boots later, so a `Gate::policy` call there
     * wins - which is what somebody with a different idea of who may address
     * the whole organisation should do.
     */
    private function registerPackagedPolicies(): void
    {
        Gate::policy(
            Alerts\Announcement::class,
            Alerts\AnnouncementPolicy::class,
        );
    }

    /**
     * A user provider that looks credentials up WITHIN the resolved tenant.
     *
     * Registered as a driver rather than swapped in silently, so an application
     * opts in by naming it in `config/auth.php`. An authentication path that
     * changed because a package was installed would be the wrong kind of
     * surprise.
     */
    private function registerTenantUserProvider(): void
    {
        if (! $this->app->bound('auth')) {
            return;
        }

        \Illuminate\Support\Facades\Auth::provider(
            'panel-tenant',
            fn ($app, array $config) => new Auth\TenantUserProvider($app['hash'], $config['model']),
        );
    }

    /**
     * Under Octane/Swoole/FrankenPHP the container survives between requests.
     * Anything the package memoized during request N must not be visible in
     * request N+1, which may belong to a different tenant.
     */
    private function registerOctaneFlush(): void
    {
        if (! $this->app->bound('events')) {
            return;
        }

        // Referenced by name so the package does not depend on laravel/octane.
        $this->app['events']->listen(
            'Laravel\Octane\Events\RequestReceived',
            static fn () => PanelManager::flushMemoization(),
        );
    }

    /**
     * Telegram, wired once so everything that alerts can use it.
     *
     * TWO THINGS HAPPEN HERE, and neither is the transport - that is
     * `laravel-notification-channels/telegram`, which ships as a dependency and
     * registers itself.
     *
     * THE CREDENTIALS ARE BRIDGED. The channel resolves its client from
     * `services.telegram.*`; the panel keeps a token and a chat id in its
     * settings, where an administrator can change them without a deploy.
     * Pushing one into the other at boot means every consumer - the backup
     * notifications, the exception reporter, an application's own code - reads
     * the same bot without knowing where it came from.
     *
     * THE CHANNEL IS REPLACED WITH THE PANEL'S SUBCLASS, and this is the part
     * that matters on the night it matters. The package's channel returns null
     * for any notification without a `toTelegram()` method, which is every
     * notification a third-party package ships: `spatie/laravel-backup` defines
     * `toMail`, `toSlack` and `toDiscord` and nothing else. Configuring
     * Telegram for backup failures therefore produced a setup that looked
     * complete and delivered silence. The subclass falls back to the mail
     * representation; anything that speaks Telegram natively is untouched.
     *
     * REGISTERED AFTER THE PACKAGE'S OWN, deliberately: `Notification::resolved`
     * callbacks run in order and the last `extend` for a driver name wins.
     */
    private function registerTelegram(): void
    {
        if (! class_exists(\NotificationChannels\Telegram\Telegram::class)
            || ! class_exists(Alerts\Telegram::class)
            || ! class_exists(Notifications\Channels\TelegramChannel::class)) {
            return;
        }

        Alerts\Telegram::configure();

        Notification::resolved(
            static function (ChannelManager $manager): void {
                $manager->extend(
                    'telegram',
                    static fn ($app) => $app->make(Notifications\Channels\TelegramChannel::class),
                );
            },
        );
    }
}
