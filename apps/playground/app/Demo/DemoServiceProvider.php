<?php

declare(strict_types=1);

namespace App\Demo;

use Alxtexh\Panel\Documents\DocumentKinds;
use App\Demo\Documents\ClientInvoiceKind;
use App\Demo\Models\Client;
use App\Demo\Models\ClientSession;
use App\Demo\Models\Router;
use App\Demo\Policies\ClientPolicy;
use App\Demo\Policies\ClientSessionPolicy;
use App\Demo\AlertServiceProvider;
use App\Demo\Console\SeedDemoCommand;
use Alxtexh\Panel\Http\PanelRoutes;
use App\Ai\AssistantTools;
use App\Demo\Ai\Tools\FindSubscriber;
use App\Demo\Ai\Tools\SuspendSubscriber;
use App\Demo\Http\Controllers\InvoiceController;
use App\Demo\Panel\DemoDashboard;
use App\Demo\Policies\RouterPolicy;
use App\Panel\DashboardExtras;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

/**
 * Everything the ISP demonstration owns, in one place that can be deleted.
 *
 * THE README SAYS A NEW DASHBOARD IS MADE BY COPYING THIS APPLICATION AND
 * REPLACING ITS DATA. That instruction was true and expensive: the ISP domain -
 * subscribers, routers, connection sessions - reached into nineteen files, five
 * of them shared with things a starter genuinely needs. "Replace the data" meant
 * reading all of them and guessing which half to keep.
 *
 * SO THE DOMAIN IS FENCED RATHER THAN SCATTERED. Its models, resources,
 * policies, screens, assistant tools, invoice kind and migrations live under
 * `app/Demo` and `database/migrations/demo`, and this provider is the only wire
 * between them and the application. Removing the demo is three steps with
 * nothing to read:
 *
 *   1. delete `app/Demo`
 *   2. delete `database/migrations/demo`
 *   3. remove this provider from `bootstrap/providers.php`
 *
 * WHAT DELIBERATELY STAYS BEHIND: `User`, `Tenant` and `Plan`, with their
 * resources. Those are the Users/Plans/Tenants a SaaS dashboard starts from -
 * `tenants` carries only name, slug, logo and theme, and `plans` is
 * `name`/`price_cents`/`is_active` plus one ISP field. Deleting them would
 * leave a panel that signs in and shows nothing, which is the failure a starter
 * exists to avoid.
 *
 * NOTHING HERE IS REGISTERED CONDITIONALLY. A flag would mean the demo is
 * always present and merely quiet, and a fence you cannot see the far side of
 * is not a fence - the point is that `rm -rf app/Demo` leaves a working panel.
 */
final class DemoServiceProvider extends ServiceProvider
{
    /**
     * THE DEMO'S RESOURCE DIRECTORY, ADDED HERE RATHER THAN IN `config/panel.php`.
     *
     * A config entry would survive the deletion of `app/Demo` - pointing at a
     * directory that no longer exists, which `glob()` tolerates silently and a
     * reader does not. Registering it from the provider means the fence has
     * exactly one wire, and removing the provider removes the discovery with it.
     *
     * IN `register`, BEFORE `boot`, because `PanelManager` reads this config on
     * first access and memoises the result - a panel provider that resolved
     * resources during its own boot would see the list without the demo.
     */
    public function register(): void
    {
        /*
         * THE ALERT RULES ARE THE DEMO'S. What counts as "wrong" here is a
         * router going offline and a subscriber expiring - ISP judgements the
         * packaged bell resolves but does not hold an opinion about. It was a
         * top-level provider; it moves with the domain it describes.
         */
        $this->app->register(AlertServiceProvider::class);

        config([
            'panel.discover' => [
                ...(array) config('panel.discover', []),
                app_path('Demo/Panel/Resources') => 'App\\Demo\\Panel\\Resources',
            ],
        ]);
    }

    public function boot(): void
    {
        /*
         * THE DEMO'S OWN MIGRATIONS. Laravel does not recurse into
         * subdirectories of `database/migrations`, which is what makes a
         * subdirectory a usable fence rather than a naming convention: the
         * files are invisible to `migrate` until this line loads them, and
         * invisible again the moment it is gone.
         */
        $this->loadMigrationsFrom(database_path('migrations/demo'));

        /*
         * THE INVOICE ROUTE, registered through the panel's own extension seam
         * rather than from `routes/web.php`.
         *
         * `PanelRoutes::extend()` runs the closure inside EVERY panel's group
         * with that panel's resource keys - so the route lands in each portal
         * that actually has subscribers, and nowhere else. A portal without
         * `clients` must not get a URL pointing at a controller that assumes
         * one, which is the same guard the route carried when it lived in the
         * application's route file.
         */
        PanelRoutes::extend(static function (array $resources): void {
            if (! in_array('clients', $resources, true)) {
                return;
            }

            \Illuminate\Support\Facades\Route::get('clients/{client}/invoice', [InvoiceController::class, 'show'])
                ->whereNumber('client')
                ->name('invoice');
        });

        /*
         * `panel:seed-demo`, REGISTERED EXPLICITLY.
         *
         * Laravel discovers commands in `app/Console/Commands` and nowhere
         * else, so moving this one behind the fence took it off the list -
         * silently, which is the failure mode a fence has to avoid. Naming it
         * here means the command exists exactly as long as the demo does.
         */
        if ($this->app->runningInConsole()) {
            $this->commands([SeedDemoCommand::class]);
        }

        /*
         * THE DEMO'S POLICIES. The panel denies any ability whose model has no
         * policy, so these are required rather than optional - and they belong
         * here rather than in `AppServiceProvider` for the same reason
         * everything else does: a deleted model must not leave a `Gate::policy`
         * behind pointing at a class that no longer exists.
         */
        Gate::policy(Client::class, ClientPolicy::class);
        Gate::policy(ClientSession::class, ClientSessionPolicy::class);
        Gate::policy(Router::class, RouterPolicy::class);

        /*
         * THE INVOICE KIND. A document template shaped around a subscriber's
         * plan and expiry, which is ISP-specific in a way the document ENGINE
         * is not - the engine stays in the package, its ISP instance goes here.
         */
        app(DocumentKinds::class)->register(new ClientInvoiceKind);

        /*
         * THE ASSISTANT'S ISP TOOLS. Looking a subscriber up and suspending one
         * are questions about this demonstration's domain, not about panels.
         */
        AssistantTools::add([new FindSubscriber, new SuspendSubscriber]);

        /*
         * THE ISP DASHBOARD, CONTRIBUTED RATHER THAN OWNED.
         *
         * Sixteen widgets, the router filter and both strips used to be
         * declared on `App\Panel\Pages\DashboardPage` - which meant the
         * starter's dashboard named `Client`, `Router` and `ClientSession`, and
         * deleting the demo took the screen with it.
         *
         * CLOSURES, SO NOTHING IS BUILT DURING BOOT. Every one of these runs a
         * query; resolving them here would cost every request in the
         * application, including the ones that never open the dashboard.
         */
        DashboardExtras::stats(static fn (): array => DemoDashboard::stats());
        DashboardExtras::charts(static fn (): array => DemoDashboard::charts());
        DashboardExtras::dimensions(static fn (): array => DemoDashboard::dimensions());
        DashboardExtras::addStrips(static fn (): array => DemoDashboard::strips());
        DashboardExtras::shortcutsCatalog(static fn (): array => [
            'defaults' => ['add-customer', 'add-ticket', 'configure', 'routers', 'plans'],
            'storageKey' => 'panel.dashboard.shortcuts',
            'catalog' => [
                ['id' => 'add-customer', 'label' => 'Add customer', 'href' => '/clients/create', 'icon' => 'users'],
                ['id' => 'add-ticket', 'label' => 'Add ticket', 'href' => '/tickets', 'icon' => 'chat'],
                ['id' => 'configure', 'label' => 'Configure system', 'href' => '/settings', 'icon' => 'sliders'],
                ['id' => 'routers', 'label' => 'Routers', 'href' => '/routers', 'icon' => 'router'],
                ['id' => 'plans', 'label' => 'Plans', 'href' => '/plans', 'icon' => 'package'],
                ['id' => 'clients', 'label' => 'Clients', 'href' => '/clients', 'icon' => 'users'],
                ['id' => 'sessions', 'label' => 'Sessions', 'href' => '/sessions', 'icon' => 'activity'],
                ['id' => 'organisation', 'label' => 'Organisation', 'href' => '/settings/organisation', 'icon' => 'home'],
                ['id' => 'monitoring', 'label' => 'Monitoring', 'href' => '/operations/monitoring', 'icon' => 'gauge'],
                ['id' => 'backups', 'label' => 'Backups', 'href' => '/operations/backups', 'icon' => 'archive'],
                ['id' => 'documents', 'label' => 'Documents', 'href' => '/documents', 'icon' => 'file-text'],
                ['id' => 'kit-catalog', 'label' => 'Catalog', 'href' => '/kit-catalog', 'icon' => 'package'],
                ['id' => 'kit-till', 'label' => 'Till', 'href' => '/kit-till', 'icon' => 'star'],
                ['id' => 'kit-leases', 'label' => 'Leases', 'href' => '/kit-leases', 'icon' => 'key'],
            ],
        ]);

        DashboardExtras::useStrip(DemoDashboard::strip(), DemoDashboard::stripAbility());
    }
}
