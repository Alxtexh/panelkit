<?php

declare(strict_types=1);

namespace Alxtexh\Panel;

use Alxtexh\Panel\Auth\Turnstile;
use Alxtexh\Panel\Support\Deprecation;
use Alxtexh\Panel\Resources\ResourceConfigurator;
use Closure;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Auth;
use RuntimeException;

/**
 * A panel: an id, a path, a guard, middleware, and a tenancy context.
 *
 * THE GUARD IS THE POINT. Spec §9 item 6: each panel declares its own guard and
 * users resolve through `Auth::guard($panel->guard())`, never a bare
 * `$request->user()`.
 *
 * antipatterns §2.1 is that failure in production: admin code called
 * `$request->user()` on a panel authenticated with a non-default guard, got
 * null, resolved a per-admin draft key to an empty string, and silently fell
 * back to saved settings. Every unsaved edit was discarded. The page returned
 * 200 and looked correct; only logging the resolved id exposed it.
 *
 * CONTEXT matters too (addendum Part A). A central panel - platform or super
 * admin - must never have tenant scoping applied, and a tenant panel must refuse
 * to boot without a resolved tenant. Conflating them is how a super admin ends
 * up seeing one tenant's data, or an operator sees everyone's.
 */
final class Panel
{
    public const CONTEXT_TENANT = 'tenant';

    public const CONTEXT_CENTRAL = 'central';

    private string $path = 'app';

    private ?string $domain = null;

    private string $guard = 'web';

    private string $context = self::CONTEXT_TENANT;

    /** See `databaseTransactions()` for why this is off by default. */
    private bool $databaseTransactions = false;

    private ?string $routeName = null;

    /** @var list<string> */
    private array $middleware = ['web'];

    /** @var list<string> */
    private ?array $authMiddleware = null;

    /**
     * Extra panel-access check, after authentication.
     *
     * @var Closure(Authenticatable): bool|null
     */
    private ?Closure $canAccess = null;

    /**
     * Plugins named by THIS panel, on top of any registered globally.
     *
     * BOTH ROUTES EXIST BECAUSE THEY ANSWER DIFFERENT QUESTIONS. A package
     * registering itself (`PanelManager::plugin`) means "install wherever you
     * apply", which is what makes `composer require` sufficient. Naming one here
     * means "this portal, specifically" - the reseller portal getting a billing
     * screen the operator portal does not.
     *
     * @var list<Plugins\PanelPlugin>
     */
    private array $plugins = [];

    /** See `widgets()`. Concatenated with whatever the dashboard page declares. */
    private array $widgets = [];

    /**
     * Per-user drag-and-drop widget layout on dashboards. Off by default.
     *
     * When on, `DashboardPage` ships the acting user's saved layout and the
     * packaged `PanelDashboard` offers rearrange, span, and visibility for
     * stats, charts, and table widgets into `users.appearance.dashboardLayout`.
     */
    private bool $userDashboards = false;

    /** Default create/edit/view presentation for resources that do not override. */
    private string $resourceForms = ResourceConfigurator::MODE_PAGE;

    /**
     * Product modules this portal sells access to. See `modules()`.
     *
     * @var list<array{key: string, label: string, description?: string|null}>
     */
    private array $modules = [];

    /** @var array<string, string> See `discoverWidgets()`. */
    private array $widgetDirectories = [];

    /** @var list<array<string, mixed>> See `userMenuItems()`. */
    private array $userMenuItems = [];

    /** @var list<array<string, mixed>> See `navigationItems()`. */
    private array $navigationItems = [];

    /** See `favicon()`. Null keeps whatever the layout ships. */
    private ?string $favicon = null;

    /** @var array<int, array{title: string, body: string|null}> See `registerErrorNotification()`. */
    private array $errorNotifications = [];

    private ?Closure $brandName = null;

    private ?Closure $colors = null;

    /** @var list<string> */
    private array $without = [];

    /**
     * SAME-PAGE EDITING OF HELP, FAQ, WHAT'S NEW AND ABOUT.
     *
     * OFF BY DEFAULT. Those screens are readable everywhere they are mounted;
     * writing them is a portal choice, not a package default. A multi-tenant
     * ISP keeps this on the superadmin (or platform) panel and off the tenant
     * operator panel, so a tenant admin cannot rewrite everybody's FAQ.
     */
    private bool $editableSupport = false;

    /**
     * Payment-gateway settings under `/settings/payments`. Off by default.
     * Pair with `paymentSettings()` and a resolver of gateway cards.
     */
    private bool $paymentSettings = false;

    /**
     * SMTP settings under `/settings/smtp`. Off by default. Pair with
     * `mailSettings()`.
     */
    private bool $mailSettings = false;

    /**
     * Optional empty kit apps (mail, chat). Off by default.
     *
     * @var array<string, bool>
     */
    private array $apps = [];

    /**
     * Absolute or app-relative OpenAPI URL for Scalar when `api-docs` is on.
     * Null means serve the kit-generated document at `{page}/openapi.json`.
     */
    private ?string $openapiUrl = null;

    /**
     * Default log basename for `logTail()` (e.g. `laravel.log`). Null lets the
     * reader pick the newest file in the allow-list.
     */
    private ?string $logTailDefault = null;

    /**
     * Basename allow-list for the log tail screen. Null = every `*.log` under
     * `storage/logs`.
     *
     * @var list<string>|null
     */
    private ?array $logTailAllowlist = null;

    /** In-panel feedback dialog. Off by default. */
    private bool $feedback = false;

    private mixed $feedbackPersister = null;

    /** Full-screen first-run setup wizard. Off by default. */
    private bool $setupWizardEnabled = false;

    private mixed $setupWizardResolver = null;

    /**
     * Host override for first-run setup steps. Null uses kit chrome defaults.
     *
     * @var Closure|null
     */
    private mixed $onboardingStepsResolver = null;

    /**
     * THE FIRST-RUN "GET STARTED" GUIDE. Off by default.
     *
     * FOUND FORCED ON EVERY INSTALL. `chrome()`'s steps carry `'done' =>
     * false` unconditionally - nothing here checks whether organisation,
     * security or the rest are actually configured - so a packaged install
     * with no `onboardingSteps()` override showed this banner to every
     * signed-in person forever, dismissable only by hand. That is a portal
     * deciding every consumer wants a first-run tour; `editableSupport()`
     * just above is the same shape of decision made the other way.
     */
    private bool $onboardingEnabled = false;

    /**
     * PAGE COPYRIGHT FOOTER after every screen. Off by default.
     *
     * The kit is an empty canvas. Hosts that want the packaged
     * `AppPageFooter` on every page call `->pageFooter(true)`. A page can
     * still import the Vue component itself when this is off.
     */
    private bool $pageFooter = false;

    /**
     * Bordered cards on Profile, Security, and the other multi-section
     * settings screens, instead of one flat list. On by default - see
     * `groupedSettingsCards()`.
     */
    private bool $groupedSettingsCards = true;

    /**
     * Settings hub in the sidebar (Settings group). Default on so every install
     * finds Settings without opening the account menu. `->sidebarSettings(false)`
     * keeps the hub under the avatar only.
     */
    private bool $sidebarSettings = true;

    /** @var Closure|null */
    private mixed $paymentGatewaysResolver = null;

    /**
     * Turns a chosen plan into a checkout-session URL to redirect to.
     * Pairs with `planCatalog()`. Null means the app `plan-checkout` was
     * never enabled, or was enabled with no resolver - either 404s on
     * `PlanCatalogPage::checkout()` rather than guessing a processor.
     *
     * @var Closure|null
     */
    private mixed $planCheckoutResolver = null;

    /**
     * Optional GitHub `owner/repo` (or repo URL) used by What's new "sync from
     * GitHub releases". Null means the button is not offered.
     */
    private ?string $supportGithubRepository = null;

    /**
     * Directories THIS panel owns, as `directory => namespace`.
     *
     * @var array<string, string>
     */
    private array $resourceDirectories = [];

    /** @var array<string, string> */
    private array $pageDirectories = [];

    /** See `login()`. Null means this panel has no sign-in of its own. */
    private ?string $loginSlug = null;

    /**
     * Idle lock minutes while the feature is on. See `idleLock()`.
     */
    private int $idleLockMinutes = 15;

    private int $idleLockWarningSeconds = 60;

    /**
     * True after `idleLock(false)`. The only way to turn the lock off when
     * this panel has authentication.
     */
    private bool $idleLockDisabled = false;

    /** True after `idleLock()` was called with a duration, not `false`. */
    private bool $idleLockCustom = false;

    /**
     * Opt-in subscription expiry callback. Null means the wall is off.
     * See `subscriptionGate()`.
     */
    private ?Closure $subscriptionGate = null;

    /**
     * Rich billing state for SaaS access surfaces. Null means no billing state
     * hook was configured and legacy `subscriptionGate()` rules apply.
     */
    private ?Closure $billingState = null;

    /** Use packaged persistence resolver when `billingState()` has no callback. */
    private bool $billingStateUsesDefaultStore = false;

    /** Optional inbound webhook signature verifier. */
    private ?Closure $billingWebhookVerifier = null;

    /** Optional inbound webhook payload mapper. */
    private ?Closure $billingWebhookMapper = null;

    /** Optional billing portal action resolver. */
    private ?Closure $billingPortalActions = null;

    /** Override for the company billing URL. Null uses PlanSetup's URI. */
    private ?string $subscriptionBillingPath = null;

    /** Override for the packaged suspended screen component. */
    private ?string $suspendedPageComponent = null;

    private bool $passwordReset = true;

    /**
     * Passwordless sign-in by emailed link for this portal.
     *
     * OFF BY DEFAULT. A magic link makes the mailbox a complete account
     * takeover path, so it is a decision an installation makes rather than a
     * default it inherits. Requires `panel.auth.magic_link` / `PANEL_MAGIC_LINK`.
     */
    private bool $passwordless = false;

    /** See `loginComponent()` for why this is not `auth/Login`. */
    private string $loginComponent = 'panel/auth/Login';

    /**
     * Social sign-in for this portal.
     *
     * TRUE (default): every provider with a client id and secret in
     * `config/services.php`. A list narrows that. FALSE hides the buttons even
     * when credentials exist.
     *
     * @var bool|list<string>
     */
    private bool|array $socialite = true;

    /**
     * Turnstile for this portal. Null inherits the env keys. FALSE never
     * challenges here even when `TURNSTILE_SITE_KEY` is set.
     */
    private ?bool $turnstile = null;

    /**
     * Environment colour banner. Null inherits config / non-production default.
     * FALSE hides. TRUE forces on (including production).
     */
    private ?bool $environmentBanner = null;

    /**
     * Header Quick Create menu. ON by default; empty when nothing is creatable.
     */
    private bool $quickCreate = true;

    /**
     * Record presence (who's viewing). OFF by default; opt in with ->presence().
     */
    private ?bool $presence = null;

    /**
     * Challenge TOTP / recovery / email OTP after password when the user has
     * a second factor.
     *
     * ON BY DEFAULT. Enabling a factor on Security is the switch; this flag
     * is only the escape hatch that turns the login-door prompt off.
     */
    private bool $twoFactorChallenge = true;

    /**
     * Force enrolment of some second factor before the dashboard.
     *
     * OFF BY DEFAULT so existing apps do not trap operators who never turned
     * 2FA on. `requireTwoFactor()` / `twoFactorRequired()` is the opt-in.
     */
    private bool $requireTwoFactor = false;

    /** Self-service register slug, or null when this portal does not offer it. */
    private ?string $registrationSlug = null;

    /**
     * Prove the mailbox after register (and on later visits) before the panel.
     *
     * OFF BY DEFAULT. A staff console that invites operators should not wall
     * them on a verification notice they never asked for.
     */
    private bool $emailVerification = false;

    /**
     * Auth design family for every packaged auth screen on this panel.
     *
     * ONE KNOB COUPLES LOGIN, SIGNUP, AND OTP. Prefer `authFamily()`; `authLayout()`
     * is the same setter kept for existing call sites. Unknown names fall back to
     * `centered` so a typo never leaves a panel with a blank sign-in page.
     *
     * | Family     | shadcn-vue blocks (layout pattern)      | Composition                          |
     * |------------|-----------------------------------------|--------------------------------------|
     * | centered   | signup-05, otp-01, otp-05               | Form on plain background (default)   |
     * | muted      | login-03, otp-03                        | Form on muted background             |
     * | showcase   | login-02, signup-02, otp-02             | Form left, full-bleed cover right    |
     * | split      | mirror of showcase                      | Cover left, form right               |
     * | card       | login-04, signup-04, otp-04             | Muted page, inset form|image card    |
     *
     * Patterns are reimplemented in AuthLayout against kit tokens. Hosts do not
     * run `npx shadcn-vue add` into the monorepo for these screens.
     */
    private string $authLayout = 'centered';

    /** @var list<string> */
    private const AUTH_FAMILIES = ['centered', 'muted', 'split', 'showcase', 'card'];

    /**
     * shadcn-vue block ids and short aliases that resolve to a PanelKit family.
     * Picking a login block name selects the matching signup + OTP family too.
     *
     * @var array<string, string>
     */
    private const AUTH_FAMILY_ALIASES = [
        'login-02' => 'showcase',
        'signup-02' => 'showcase',
        'otp-02' => 'showcase',
        'login-03' => 'muted',
        'otp-03' => 'muted',
        'login-04' => 'card',
        'signup-04' => 'card',
        'otp-04' => 'card',
        'signup-05' => 'centered',
        'otp-01' => 'centered',
        'otp-05' => 'centered',
    ];

    /** @var array{quote: string, author: string, role: string|null}|null */
    private ?array $authTestimonial = null;

    /** @var array{src: string, alt: string|null}|null */
    private ?array $authImage = null;

    /**
     * SIDEBAR DESIGN FAMILIES. Prefer `sidebarLayout()`; `sidebarVariant()` is
     * the same setter. Unknown names fall back to `inset` so a typo never
     * blanks the rail. Default `inset` preserves the chrome panels already ship.
     *
     * | Family     | shadcn-vue blocks (layout pattern) | Composition                              |
     * |------------|------------------------------------|------------------------------------------|
     * | inset      | sidebar-08                         | Inset rail + secondary footer nav        |
     * | sidebar    | sidebar-01                         | Edge-flush grouped rail                  |
     * | floating   | sidebar-04                         | Floating card rail                       |
     * | icon       | sidebar-07                         | Collapses to icon rail by default        |
     * | header     | sidebar-16                         | Sticky site header, nav rail, topbar user|
     * | accordion  | sidebar-05 / sidebar-06             | Plus/Minus collapsible nav groups        |
     * | file-tree  | sidebar-11                         | Nested folder / file tree rail           |
     * | calendar   | sidebar-12                         | Mini calendar chrome, user in rail header|
     * | dialog     | sidebar-13                         | Overlay / offcanvas dialog-style rail    |
     *
     * Patterns are reimplemented in AppSidebar / PanelShell against kit tokens.
     * Hosts do not run `npx shadcn-vue add` into the monorepo for these.
     */
    private string $sidebarLayout = 'inset';

    /** @var list<string> */
    private const SIDEBAR_LAYOUTS = [
        'inset',
        'sidebar',
        'floating',
        'icon',
        'header',
        'accordion',
        'file-tree',
        'calendar',
        'dialog',
    ];

    /**
     * shadcn-vue block ids and short aliases that resolve to a PanelKit layout.
     *
     * @var array<string, string>
     */
    private const SIDEBAR_LAYOUT_ALIASES = [
        'sidebar-01' => 'sidebar',
        'sidebar-04' => 'floating',
        'sidebar-05' => 'accordion',
        'sidebar-06' => 'accordion',
        'sidebar-07' => 'icon',
        'sidebar-08' => 'inset',
        'sidebar-11' => 'file-tree',
        'sidebar-12' => 'calendar',
        'sidebar-13' => 'dialog',
        'sidebar-16' => 'header',
        'edge' => 'sidebar',
        'rail' => 'icon',
        'tree' => 'file-tree',
        'dropdown' => 'accordion',
    ];

    /**
     * The shared sign-in path this panel participates in, or null for none.
     *
     * CREDENTIAL-BASED PANEL ROUTING. When two panels declare the same path,
     * one route is registered there and the controller tries each panel's guard
     * in registration order. The first that accepts the credentials determines
     * the destination: the user lands in the panel that owns their account, not
     * on a shared dashboard that would need to know which portal they were aiming
     * at.
     *
     * NULL MEANS EACH PANEL HAS ITS OWN DOOR. The per-panel `login()` and the
     * shared `sharedLogin()` are independent; a panel may have both (its own
     * `/admin/login` plus participates in the shared `/login`) or only one.
     */
    private ?string $sharedLoginPath = null;

    private ?string $passwordBroker = null;

    private function __construct(public readonly string $id) {}

    public static function make(string $id): self
    {
        return new self($id);
    }

    /**
     * Install plugins into this panel.
     *
     * @param  list<Plugins\PanelPlugin>  $plugins
     */
    public function plugins(array $plugins): self
    {
        $this->plugins = [...$this->plugins, ...$plugins];

        return $this;
    }

    /** @return list<Plugins\PanelPlugin> */
    public function getPlugins(): array
    {
        return $this->plugins;
    }

    /**
     * WIDGETS THIS PORTAL SHOWS, REGISTERED RATHER THAN INHERITED.
     *
     * THE ONLY WAY TO ADD ONE USED TO BE A SUBCLASS. `DashboardPage::stats()`
     * and `::charts()` are static methods you override, so a portal wanting one
     * extra counter needed its own page class - and a PACKAGE wanting to
     * contribute one had nowhere to put it at all, because it cannot subclass a
     * page the application has not written yet. That is the difference between
     * an extension point and an inheritance hierarchy: Filament registers
     * widgets on the panel (`->widgets([...])`), which is why a Filament plugin
     * can ship a dashboard card and ours could not.
     *
     * BOTH KINDS GO IN ONE LIST, split by type where they are drawn - the call
     * site should not have to know that a counter and a chart are different
     * classes, only that both are things the dashboard shows.
     *
     * SUBCLASSING STILL WORKS AND STILL COMPOSES. What a page declares and what
     * the panel registers are concatenated, so an application that already has
     * its own dashboard keeps it and a plugin can still add to it.
     *
     * VISIBILITY IS UNCHANGED AND STILL SERVER-SIDE. Every widget from either
     * source passes `visibleTo()` before its deferred prop is registered, so
     * registering one here cannot put a number in the payload for somebody who
     * may not see it.
     *
     * @param  list<Widgets\StatWidget|Widgets\ChartWidget|Widgets\TableWidget|Widgets\MapWidget|Widgets\CalendarWidget|Widgets\BarcodeWidget|Widgets\LogTailWidget>  $widgets
     */
    public function widgets(array $widgets): self
    {
        $normalised = [];

        foreach ($widgets as $widget) {
            if ($widget instanceof Widgets\MapWidget
                || $widget instanceof Widgets\CalendarWidget
                || $widget instanceof Widgets\BarcodeWidget
                || $widget instanceof Widgets\LogTailWidget) {
                $normalised[] = $widget->toChartWidget();

                continue;
            }

            $normalised[] = $widget;
        }

        $this->widgets = [...$this->widgets, ...$normalised];

        return $this;
    }

    /**
     * Let each operator rearrange dashboard widgets and persist the layout.
     *
     * OFF BY DEFAULT. Stores order, column span (1 or 2), and optional hide
     * flags under `appearance.dashboardLayout.widgets`. Zero client cost when
     * unused: the packaged dashboard skips drag handles and never reads that
     * key. The appearance endpoint ignores `dashboardLayout` writes while this
     * is off. Reads are gated the same way.
     */
    public function userDashboards(bool $enabled = true): self
    {
        $this->userDashboards = $enabled;

        return $this;
    }

    public function hasUserDashboards(): bool
    {
        return $this->userDashboards;
    }

    /**
     * Default create, edit and view presentation for resources on this panel.
     *
     * Resources may override per operation through `Resource::configure()`.
     * The default stays `page` so existing installations keep dedicated screens.
     */
    public function resourceForms(string $mode): self
    {
        if (! in_array($mode, [ResourceConfigurator::MODE_PAGE, ResourceConfigurator::MODE_MODAL], true)) {
            throw new RuntimeException("[{$mode}] is not a resource form mode. Use 'page' or 'modal'.");
        }

        $this->resourceForms = $mode;

        return $this;
    }

    public function getResourceForms(): string
    {
        return $this->resourceForms;
    }

    /** @return list<Widgets\StatWidget|Widgets\ChartWidget|Widgets\TableWidget> */
    public function getWidgets(): array
    {
        return [...$this->widgets, ...$this->discoveredWidgets()];
    }

    /**
     * Declare product modules this portal's plans may grant.
     *
     * SAME SHAPE AS `widgets()`: the panel is the registration point, the app
     * names keys that mean something in ITS product. Plans later list those
     * keys. `moduleEnabled('devices')` reads the grant resolver, not this list.
     *
     *     Panel::make('admin')->modules([
     *         Support\Module::make('campaigns')->label('Campaigns')->planLimit(kind: 'number'),
     *         ['key' => 'storage', 'label' => 'Storage'],
     *     ]);
     *
     * @param  list<Support\Module|array{key: string, label: string, description?: string|null}>  $modules
     */
    public function modules(array $modules): self
    {
        Support\ModuleRegistry::register($modules);

        $keys = [];

        foreach ($modules as $module) {
            $key = $module instanceof Support\Module
                ? $module->key()
                : (string) ($module['key'] ?? '');

            if ($key !== '') {
                $keys[] = $key;
            }
        }

        foreach (Support\ModuleRegistry::all() as $item) {
            if (in_array($item['key'], $keys, true)) {
                $this->modules[] = $item;
            }
        }

        return $this;
    }

    /**
     * @return list<array{key: string, label: string, description: string|null}>
     */
    public function getModules(): array
    {
        return $this->modules !== [] ? $this->modules : Support\ModuleRegistry::all();
    }

    /**
     * WIDGETS FOUND BY SCANNING, the way resources and pages are found.
     *
     * `widgets([...])` TAKES INSTANCES, which is right for a handful and wrong
     * for a portal with thirty: every one has to be constructed in the provider,
     * so the provider grows to know every widget in the application and adding
     * one means editing a file in a different directory. Filament scans for the
     * same reason it scans resources - discovery is what keeps a provider a
     * DECLARATION rather than a manifest.
     *
     * A CLASS IS FOUND IF IT DECLARES `make(): StatWidget|ChartWidget|TableWidget`.
     * There is no interface to implement because the widgets themselves are
     * final value objects, not a hierarchy - so the contract is the static
     * factory, which is also the thing a reader would look for.
     *
     * THE NAMESPACE IS OPTIONAL. `discoverWidgets(app_path('Panel/Widgets'))`
     * is the normal path: the namespace is `App\Panel\Widgets`. Pass `$for`
     * when the directory is not under `app_path()`.
     */
    public function discoverWidgets(string $in, ?string $for = null): self
    {
        $this->widgetDirectories[$in] = $for ?? $this->namespaceFromDirectory($in);

        return $this;
    }

    /**
     * `App\Panel\Widgets` from `app_path('Panel/Widgets')`.
     *
     * ANY OTHER DIRECTORY MUST NAME ITS NAMESPACE. Guessing `App\` from a path
     * under `tests/` or `vendor/` would load the wrong class, silently, and a
     * dashboard would miss widgets that exist on disk.
     */
    private function namespaceFromDirectory(string $directory): string
    {
        $app = rtrim(str_replace('\\', '/', app_path()), '/');
        $directory = rtrim(str_replace('\\', '/', $directory), '/');

        if ($directory === $app || str_starts_with($directory, $app.'/')) {
            $relative = trim(substr($directory, strlen($app)), '/');
            $base = rtrim($this->appNamespace(), '\\');

            return $relative === ''
                ? $base
                : $base.'\\'.str_replace('/', '\\', $relative);
        }

        throw new RuntimeException(
            "discoverWidgets('{$directory}') needs a namespace. "
            .'Pass the second argument: discoverWidgets($in, $for).'
        );
    }

    private function appNamespace(): string
    {
        return function_exists('app') && method_exists(app(), 'getNamespace')
            ? app()->getNamespace()
            : 'App\\';
    }

    /** @return array<string, string> */
    public function getWidgetDirectories(): array
    {
        return $this->widgetDirectories;
    }

    /**
     * @return list<Widgets\StatWidget|Widgets\ChartWidget|Widgets\TableWidget>
     */
    private function discoveredWidgets(): array
    {
        $out = [];

        foreach ($this->widgetDirectories as $directory => $namespace) {
            if (! is_dir($directory)) {
                continue;
            }

            foreach (glob(rtrim($directory, '/').'/*.php') ?: [] as $file) {
                $class = rtrim($namespace, '\\').'\\'.basename($file, '.php');

                // Skip anything that is not a concrete widget factory: an
                // abstract base or a stray helper must not become a card.
                if (! class_exists($class) || ! method_exists($class, 'make')) {
                    continue;
                }

                $made = $class::make();

                if ($made instanceof Widgets\MapWidget
                    || $made instanceof Widgets\CalendarWidget
                    || $made instanceof Widgets\BarcodeWidget
                    || $made instanceof Widgets\LogTailWidget) {
                    $made = $made->toChartWidget();
                }

                if ($made instanceof Widgets\StatWidget
                    || $made instanceof Widgets\ChartWidget
                    || $made instanceof Widgets\TableWidget) {
                    $out[] = $made;
                }
            }
        }

        return $out;
    }

    /**
     * MENU ENTRIES THIS PORTAL ADDS TO THE ACCOUNT DROPDOWN.
     *
     * THE DROPDOWN WAS A VUE SLOT AND NOTHING ELSE, which meant only the
     * APPLICATION could add to it - a plugin had no way in, and a portal could
     * not differ from its neighbours without the shell knowing about it. The
     * packaged core (profile, security, sign out) is unconditional; this is
     * what a panel adds beside it.
     *
     * `href` MAY BE A CLOSURE, and usually should be: panels are registered in
     * a provider's `boot`, which runs before routes exist, so `route()` called
     * eagerly throws about a route that is merely not registered YET.
     *
     * `ability` IS CHECKED SERVER-SIDE like every other grant - an entry
     * somebody may not use is absent rather than disabled.
     *
     * @param  list<array{key: string, label: string, href: string|Closure, icon?: string, ability?: string}>  $items
     */
    public function userMenuItems(array $items): self
    {
        $this->userMenuItems = [...$this->userMenuItems, ...$items];

        return $this;
    }

    /** @return list<array<string, mixed>> */
    public function getUserMenuItems(): array
    {
        return $this->userMenuItems;
    }

    /**
     * NAVIGATION ENTRIES THAT ARE NOT RESOURCES.
     *
     * THE SIDEBAR WAS ENTIRELY RESOURCE-DERIVED, so anything that was not a
     * resource - an external dashboard, a report, a link to the status page -
     * could not appear in it at all. Pages could, by being pages; a plain link
     * could not, and the workaround was a page that existed only to redirect.
     *
     * Same shape as `userMenuItems()`, same closure and ability rules, for the
     * same reasons.
     *
     * @param  list<array{title: string, href: string|Closure, icon?: string, group?: string, sort?: int, ability?: string}>  $items
     */
    public function navigationItems(array $items): self
    {
        $this->navigationItems = [...$this->navigationItems, ...$items];

        return $this;
    }

    /** @return list<array<string, mixed>> */
    public function getNavigationItems(): array
    {
        return $this->navigationItems;
    }

    /**
     * THE BROWSER-TAB ICON FOR THIS PORTAL.
     *
     * FIVE PORTALS SHARED ONE FAVICON, which is the last place branding leaked
     * between them: the sign-in screen, the colours and the brand name are all
     * per-panel, and every tab still looked identical. That matters most for
     * the portal somebody is least likely to have open on purpose - a
     * superadmin tab indistinguishable from a tenant tab is the one you type
     * into by mistake.
     *
     * A URL, NOT A FILE PATH, because the answer is usually an asset the
     * application already publishes and sometimes a data URI. Null falls back
     * to whatever the layout ships, so a portal that says nothing looks exactly
     * as it did.
     */
    public function favicon(string $url): self
    {
        $this->favicon = $url;

        return $this;
    }

    public function getFavicon(): ?string
    {
        return $this->favicon;
    }

    /**
     * WHAT AN ERROR SCREEN SAYS, PER STATUS CODE.
     *
     * THE PACKAGED SCREENS HAVE FIXED COPY, and for one status that is a real
     * problem: 419. "Page expired" is Laravel's wording for a CSRF token that
     * no longer matches, which an operator reads as nonsense - and this panel
     * now MAKES that happen deliberately, because `EnforceSessionLifetime` ends
     * a session at an absolute ceiling however active it has been. Somebody
     * mid-form gets a page telling them something expired, with no hint that
     * they should sign in again.
     *
     * DELIBERATELY VAGUE BY DEFAULT ON 403, and any override should stay that
     * way: an error naming the missing permission tells whoever probed for it
     * exactly what to ask for next. This exists so an installation can be
     * KINDER, not more specific.
     *
     * @param  string|null  $body  A sentence under the title, or null for none.
     */
    public function registerErrorNotification(int $status, string $title, ?string $body = null): self
    {
        $this->errorNotifications[$status] = ['title' => $title, 'body' => $body];

        return $this;
    }

    /** @return array{title: string, body: string|null}|null */
    public function getErrorNotification(int $status): ?array
    {
        return $this->errorNotifications[$status] ?? null;
    }

    /* --------------------------------------------------- what it is made of */

    /**
     * THE DIRECTORY THIS PORTAL'S RESOURCES LIVE IN, and therefore owns.
     *
     * THE OLD ARRANGEMENT WAS BACKWARDS AND IT SHOWED. Discovery was one
     * global list in `panel.discover`, and which portal a resource landed in
     * came from a `protected static $panel` on the CLASS - so a panel provider
     * could not say what its portal contained without appending to a config
     * array shared by every other portal, and a resource moved between folders
     * stayed where its own property said. "Add a portal" meant editing global
     * state, which is precisely the shape somebody means when they say the
     * panels are all the same thing wearing different paths.
     *
     * OWNERSHIP NOW FOLLOWS THE DIRECTORY. A class found here belongs to this
     * portal whatever its `panel()` says, which is the rule Filament settled
     * on for the same reason. The class property still works and is still the
     * right answer for an application with one portal; this is what makes a
     * SECOND portal a self-contained declaration rather than a diff against
     * everybody else's.
     *
     * NAMED `in:` AND `for:` deliberately - a directory and its namespace are
     * two strings of the same shape, and at a call site with two bare
     * arguments there is nothing to say which way round they go.
     */
    public function discoverResources(string $in, string $for): self
    {
        $this->resourceDirectories[$in] = $for;

        return $this;
    }

    /** As `discoverResources()`, for the portal's non-resource screens. */
    public function discoverPages(string $in, string $for): self
    {
        $this->pageDirectories[$in] = $for;

        return $this;
    }

    /** @return array<string, string> */
    public function getResourceDirectories(): array
    {
        return $this->resourceDirectories;
    }

    /** @return array<string, string> */
    public function getPageDirectories(): array
    {
        return $this->pageDirectories;
    }

    /* ------------------------------------------------------ its own sign-in */

    /**
     * THIS PORTAL GETS ITS OWN SIGN-IN, mounted under its own path.
     *
     * WITHOUT THIS A SECOND PORTAL SHARES THE FIRST ONE'S FRONT DOOR, and
     * that is not a cosmetic complaint. Laravel sends a guest to the route
     * named `login`; a portal that registers none inherits whichever screen
     * the application mounted at the root, so opening `/superadmin` landed on
     * the tenant demo's sign-in - the same form, the same branding, the same
     * guard - and the separation the portal exists for was a URL prefix and
     * nothing else.
     *
     * TURNING IT ON IS ALSO WHAT MAKES A SECOND GUARD USABLE. The redirect
     * hook in `PanelServiceProvider` looks for a route named `{id}.login`, so
     * this one line is the difference between `auth:superadmins` bouncing a
     * guest to somebody else's form and bouncing them to this portal's.
     *
     * THE ROUTES ARE REGISTERED BY THE PACKAGE, not written into
     * `routes/panel-{id}-auth.php` by a generator. Both work and both are
     * supported - a hand-written file is still the escape hatch when a portal
     * needs a sign-in the packaged controller does not do - but a portal
     * should not need a second file to be a portal.
     */
    public function login(bool|string $slug = 'login'): self
    {
        $this->loginSlug = $slug === false ? null : (is_string($slug) ? trim($slug, '/') : 'login');

        return $this;
    }

    public function hasLogin(): bool
    {
        return $this->loginSlug !== null;
    }

    /**
     * Lock this portal after idle minutes, with a client warning first.
     *
     * ON BY DEFAULT WHEN THIS PANEL AUTHENTICATES. `->login()` or
     * `->authMiddleware()` is enough: 15 minutes idle, 60-second warning, lock
     * routes and the header padlock. Apps must not need a second call to get
     * a lock screen that belongs with sign-in.
     *
     * `->idleLock()` still sets a custom duration.
     * `->idleLock(false)` is the escape hatch that turns it off.
     */
    public function idleLock(bool|int $minutes = 15, int $warningSeconds = 60): self
    {
        if ($minutes === false) {
            $this->idleLockDisabled = true;
            $this->idleLockCustom = false;

            return $this;
        }

        $this->idleLockDisabled = false;
        $this->idleLockCustom = true;
        $this->idleLockMinutes = $minutes === true ? 15 : max(1, $minutes);
        $this->idleLockWarningSeconds = max(0, $warningSeconds);

        return $this;
    }

    public function hasIdleLock(): bool
    {
        if ($this->idleLockDisabled) {
            return false;
        }

        if ($this->idleLockCustom) {
            return $this->idleLockMinutes > 0;
        }

        return $this->hasLogin() || $this->authMiddleware !== null;
    }

    /**
     * After a correct password, ask for TOTP, a recovery code, or an email
     * OTP when the account has that factor confirmed.
     *
     * DEFAULT TRUE: the user's Security settings are honoured. Pass `false`
     * only when this portal must not pause at the door (a kiosk that cannot
     * type a code, for example). Passkeys remain an alternative on the login
     * screen; a password sign-in still challenges when a factor is on.
     */
    public function twoFactorChallenge(bool $enabled = true): self
    {
        $this->twoFactorChallenge = $enabled;

        return $this;
    }

    public function hasTwoFactorChallenge(): bool
    {
        return $this->twoFactorChallenge;
    }

    /**
     * After login, send users with no TOTP, email OTP, or passkey to Security
     * until they enrol. Cannot reach the dashboard until then.
     *
     * DEFAULT FALSE. Existing apps must not trap operators. `true` is the
     * Filament-shaped required-enrol wall.
     */
    public function requireTwoFactor(bool $required = true): self
    {
        $this->requireTwoFactor = $required;

        return $this;
    }

    /** Alias of `requireTwoFactor()`. */
    public function twoFactorRequired(bool $required = true): self
    {
        return $this->requireTwoFactor($required);
    }

    public function requiresTwoFactor(): bool
    {
        return $this->requireTwoFactor;
    }

    /**
     * Self-service registration on this portal, the way `login()` mounts
     * sign-in. Off until called: a staff console should not offer a sign-up
     * nobody approved.
     *
     *     Panel::make('admin')->login()->registration();
     */
    public function registration(bool|string $slug = 'register'): self
    {
        $this->registrationSlug = $slug === false ? null : (is_string($slug) ? trim($slug, '/') : 'register');

        return $this;
    }

    public function hasRegistration(): bool
    {
        return $this->registrationSlug !== null;
    }

    public function getRegistrationSlug(): string
    {
        return $this->registrationSlug ?? 'register';
    }

    /**
     * Prove the mailbox before the panel. Mounts the notice, the signed
     * verify link, and resend. Off until called.
     *
     *     Panel::make('admin')->login()->registration()->emailVerification();
     */
    public function emailVerification(bool $enabled = true): self
    {
        $this->emailVerification = $enabled;

        return $this;
    }

    public function hasEmailVerification(): bool
    {
        return $this->emailVerification;
    }

    /**
     * Social buttons on this portal's login.
     *
     * `->socialite()` (or omitting it) lists providers that have credentials.
     * Unconfigured providers stay hidden unless
     * `panel.auth.social.show_unconfigured` is true (kit showcase).
     * `->socialite(['google', 'github'])` narrows the list.
     * `->socialite(false)` offers none.
     *
     *     Panel::make('admin')->login()->socialite(['google', 'github']);
     *
     * @param  bool|list<string>  $providers
     */
    public function socialite(bool|array $providers = true): self
    {
        $this->socialite = $providers;

        return $this;
    }

    /**
     * Null means every configured provider (or the full catalogue when
     * `show_unconfigured` is true). An empty list means none.
     *
     * @return list<string>|null
     */
    public function socialiteAllowlist(): ?array
    {
        if ($this->socialite === false) {
            return [];
        }

        if ($this->socialite === true) {
            return null;
        }

        return array_values(array_filter(
            $this->socialite,
            static fn (mixed $key): bool => is_string($key) && $key !== '',
        ));
    }

    /**
     * Cloudflare Turnstile on this portal's auth writes.
     *
     * KEYS ARE THE SWITCH for the installation: set `TURNSTILE_SITE_KEY` and
     * `TURNSTILE_SECRET_KEY`. This call is the per-panel override.
     * `->turnstile(false)` never challenges here. `->turnstile()` is explicit
     * on, still requiring both keys.
     */
    public function turnstile(bool $enabled = true): self
    {
        $this->turnstile = $enabled;

        return $this;
    }

    public function hasTurnstile(): bool
    {
        if ($this->turnstile === false) {
            return false;
        }

        return Turnstile::enabled();
    }

    /**
     * Environment badge API (no-op).
     *
     * The shell no longer renders an environment badge. This setter is kept so
     * host `->environmentBanner(...)` calls keep compiling; it does not affect
     * shared props or chrome. Prefer removing the call from panel registration.
     *
     * @deprecated Permanently off; always a no-op.
     */
    public function environmentBanner(bool $enabled = true): self
    {
        Deprecation::warn(__METHOD__, 'remove the call; the environment badge is permanently disabled');
        $this->environmentBanner = $enabled;

        return $this;
    }

    /** @deprecated Permanently off; value is ignored. */
    public function environmentBannerOverride(): ?bool
    {
        Deprecation::warn(__METHOD__, 'remove the call; the environment badge is permanently disabled');
        return $this->environmentBanner;
    }

    /** @deprecated Permanently off; always false for shared props. */
    public function showsEnvironmentBanner(): bool
    {
        Deprecation::warn(__METHOD__, 'remove the call; the environment badge is permanently disabled');
        return false;
    }

    /**
     * Header Quick Create of creatable resources. `->quickCreate(false)` hides
     * the menu even when the operator may create records.
     */
    public function quickCreate(bool $enabled = true): self
    {
        $this->quickCreate = $enabled;

        return $this;
    }

    public function showsQuickCreate(): bool
    {
        return $this->quickCreate;
    }

    /**
     * Put Settings in the sidebar (Settings group). Default on for every install.
     *
     * `->sidebarSettings(false)` keeps the hub reachable but only under the
     * account menu, for hosts that want a quieter rail.
     */
    public function sidebarSettings(bool $enabled = true): self
    {
        $this->sidebarSettings = $enabled;

        return $this;
    }

    public function hasSidebarSettings(): bool
    {
        return $this->sidebarSettings;
    }

    /**
     * Who's viewing a record (Echo presence). Off by default.
     *
     *     Panel::make('admin')->presence();
     */
    public function presence(bool $enabled = true): self
    {
        $this->presence = $enabled;

        return $this;
    }

    public function presenceOverride(): ?bool
    {
        return $this->presence;
    }

    public function hasPresence(): bool
    {
        if ($this->presence === false) {
            return false;
        }

        if ($this->presence === true) {
            return true;
        }

        $flag = config('panel.presence.enabled');

        return $flag === true || $flag === 1 || $flag === '1' || $flag === 'true';
    }

    public function idleLockMinutes(): ?int
    {
        return $this->hasIdleLock() ? $this->idleLockMinutes : null;
    }

    public function idleLockWarningSeconds(): int
    {
        return $this->idleLockWarningSeconds;
    }

    /**
     * Opt-in expiry wall. When the callback returns false, company users on a
     * tenant panel are sent to plan setup (or `$billingPath`). Staff on a
     * central panel get 403. Leave unset so a playground ISP is not locked.
     *
     *     Panel::make('admin')->subscriptionGate(fn (): bool => $org->planIsActive());
     *
     * Plan setup, payment settings, logout, lock, and impersonation-stop stay
     * reachable. Same allow-list idea as `RequirePasswordRenewal`.
     */
    public function subscriptionGate(Closure $isActive, ?string $billingPath = null): self
    {
        $this->subscriptionGate = $isActive;
        $this->subscriptionBillingPath = $billingPath;

        return $this;
    }

    public function hasSubscriptionGate(): bool
    {
        return $this->subscriptionGate instanceof Closure
            || $this->billingState instanceof Closure
            || $this->billingStateUsesDefaultStore;
    }

    public function subscriptionIsActive(): bool
    {
        if ($this->billingState instanceof Closure) {
            return ! Support\BillingAccess::blocks($this);
        }

        if (! $this->subscriptionGate instanceof Closure) {
            return true;
        }

        return (bool) app()->call($this->subscriptionGate, [
            'panel' => $this,
            'user' => $this->user(),
            'request' => request(),
        ]);
    }

    /**
     * Rich subscription state for packaged SaaS access flows.
     *
     * The callback may return:
     * - `['status' => 'active'|'past_due'|'suspended'|'canceled'|'expired']`
     * - optional copy: `title`, `body`, `reason`, `dueMessage`, `renewalMessage`
     * - optional plan: `plan` as a string or `['name' => ..., 'price' => ..., 'interval' => ...]`
     * - optional routing: `billingHref` or `actions.billing.href`
     * - optional `blocksAccess` override, defaulting to true for suspended/canceled/expired
     *
     * Leave unset for non-billable panels.
     */
    public function billingState(?Closure $state = null, ?string $billingPath = null): self
    {
        $this->billingState = $state;
        $this->billingStateUsesDefaultStore = $state === null;

        if ($billingPath !== null) {
            $this->subscriptionBillingPath = $billingPath;
        }

        return $this;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function billingStateData(): ?array
    {
        if ($this->billingStateUsesDefaultStore) {
            return Support\BillingStateStore::forCurrentContext($this);
        }

        if (! $this->billingState instanceof Closure) {
            return null;
        }

        $state = app()->call($this->billingState, [
            'panel' => $this,
            'user' => $this->user(),
            'request' => request(),
        ]);

        return is_array($state) ? $state : null;
    }

    /**
     * @return array<string, mixed>
     */
    public function resolveBillingState(): array
    {
        if ($this->billingState instanceof Closure || $this->billingStateUsesDefaultStore) {
            return Support\BillingAccess::normalize($this->billingStateData(), $this);
        }

        if ($this->subscriptionGate instanceof Closure && ! $this->subscriptionIsActive()) {
            return Support\BillingAccess::normalize(['status' => 'expired'], $this);
        }

        return Support\BillingAccess::normalize(['status' => 'active'], $this);
    }

    /**
     * Optional signature verifier for inbound billing webhooks.
     *
     * Provider-agnostic. Use `GenericBillingWebhookAdapter::verifier($secret)`
     * for HMAC of the raw body against a named header, or supply your own.
     */
    public function billingWebhookVerifier(?Closure $verifier): self
    {
        $this->billingWebhookVerifier = $verifier;

        return $this;
    }

    public function billingWebhookVerifierUsing(): ?Closure
    {
        return $this->billingWebhookVerifier;
    }

    /**
     * Optional payload mapper for inbound billing webhooks.
     *
     * Map any gateway payload onto `billable_key` + `status`. The packaged
     * `GenericInboundBillingMapper` / `GenericBillingWebhookAdapter::mapper()`
     * accept those keys directly.
     */
    public function billingWebhookMapper(?Closure $mapper): self
    {
        $this->billingWebhookMapper = $mapper;

        return $this;
    }

    public function billingWebhookMapperUsing(): ?Closure
    {
        return $this->billingWebhookMapper;
    }

    /**
     * Optional billing portal action resolver.
     */
    public function billingPortalActions(?Closure $actions): self
    {
        $this->billingPortalActions = $actions;

        return $this;
    }

    /**
     * @return array<string, array{label: string, href: string|null}>
     */
    public function resolveBillingPortalActions(): array
    {
        if (! $this->billingPortalActions instanceof Closure) {
            return Support\BillingAccess::defaultPortalActions();
        }

        $resolved = app()->call($this->billingPortalActions, [
            'panel' => $this,
            'user' => $this->user(),
            'request' => request(),
            'defaults' => Support\BillingAccess::defaultPortalActions(),
        ]);

        return Support\BillingAccess::normalizePortalActions(is_array($resolved) ? $resolved : []);
    }

    public function subscriptionBillingPath(): string
    {
        if ($this->subscriptionBillingPath !== null && $this->subscriptionBillingPath !== '') {
            $path = $this->subscriptionBillingPath;

            return str_starts_with($path, '/') ? $path : '/'.$path;
        }

        $prefix = trim($this->getPath(), '/');
        $uri = trim(Pages\PlanSetupPage::uri(), '/');

        return ($prefix === '' ? '' : '/'.$prefix).'/'.$uri;
    }

    /**
     * Which component the packaged suspended route renders.
     */
    public function suspendedPage(?string $component = 'BillingSuspended'): self
    {
        $this->suspendedPageComponent = $component === null || trim($component) === ''
            ? null
            : trim($component);

        return $this;
    }

    public function getSuspendedPageComponent(): string
    {
        return $this->suspendedPageComponent ?? 'BillingSuspended';
    }

    /**
     * THE COMPONENT THIS PORTAL'S SIGN-IN RENDERS.
     *
     * DEFAULTS TO THE PACKAGED SCREEN, and it has to. Inertia resolves a page
     * name against the APPLICATION's `resources/js/pages` first, so rendering
     * `auth/Login` gave a portal whatever the host starter kit happened to
     * have under that name - a component written for the application's own
     * controller, with its own prop contract. The reference app's expects
     * `socialProviders` as a `key => label` map where the packaged controller
     * sends a list of objects, so the superadmin sign-in rendered a button
     * captioned with raw JSON and dropped the heading the panel configured.
     * Nothing errored; it simply looked like somebody else's screen.
     *
     * `panel/auth/Login` IS A NAME NO APPLICATION OWNS, so the packaged
     * controller and the packaged component are guaranteed to agree and a new
     * portal gets a working, panel-branded sign-in without the host having to
     * supply one.
     *
     * OVERRIDE IT TO REPLACE THE SCREEN ENTIRELY - the equivalent of
     * Filament's `->login(MyLogin::class)`. The name must be one the
     * application's resolver can find, and the props are the packaged
     * controller's.
     */
    public function loginComponent(string $component): self
    {
        $this->loginComponent = $component;

        return $this;
    }

    public function getLoginComponent(): string
    {
        return $this->loginComponent;
    }

    /**
     * Prefer `authFamily()`. Kept as an alias so existing panels keep compiling.
     *
     * @param  string  $layout  Family name or shadcn block alias (see AUTH_FAMILY_ALIASES).
     */
    public function authLayout(string $layout): self
    {
        return $this->authFamily($layout);
    }

    /**
     * Pick the auth design family for login, register, OTP, and related screens.
     *
     * Accepts a PanelKit family (`centered`, `muted`, `split`, `showcase`, `card`)
     * or a shadcn-vue block id such as `login-04` / `signup-02` / `otp-02`. Block
     * ids resolve to the matching family so choosing a login template auto-selects
     * the coupled signup and OTP layouts.
     */
    public function authFamily(string $family): self
    {
        $resolved = self::AUTH_FAMILY_ALIASES[$family] ?? $family;

        $this->authLayout = in_array($resolved, self::AUTH_FAMILIES, true)
            ? $resolved
            : 'centered';

        return $this;
    }

    /** @return 'centered'|'muted'|'split'|'showcase'|'card' */
    public function getAuthLayout(): string
    {
        return $this->authLayout;
    }

    /** @return 'centered'|'muted'|'split'|'showcase'|'card' */
    public function getAuthFamily(): string
    {
        return $this->authLayout;
    }

    /** @return list<string> */
    public static function authFamilies(): array
    {
        return self::AUTH_FAMILIES;
    }

    /**
     * A short quote beside the `showcase` auth layout's preview panel.
     *
     * TEXT, NOT A COMPONENT - the same rule `brandName()` follows. An
     * installation states what the quote says and who said it; the renderer
     * owns how that looks. Call it or do not: a `showcase` panel with none
     * shows a preview panel with no quote under it rather than a placeholder
     * attributed to nobody, which would read as a bug pretending to be copy.
     */
    public function authTestimonial(string $quote, string $author, ?string $role = null): self
    {
        $this->authTestimonial = ['quote' => $quote, 'author' => $author, 'role' => $role];

        return $this;
    }

    /** @return array{quote: string, author: string, role: string|null}|null */
    public function getAuthTestimonial(): ?array
    {
        return $this->authTestimonial;
    }

    /**
     * A real image for the `card`, `showcase` and `split` auth layouts'
     * `#image` panel, in place of the SVG placeholder.
     *
     * A PROP, NOT A SLOT, because these layouts render behind a packaged
     * `panel/auth/*` page name that Inertia resolves by string - there is no
     * template position to pass slot content into without forking the page
     * component wholesale. An installation that wants its own image states
     * the URL; the renderer owns the markup. An explicit `#image` slot still
     * wins for a consumer rendering `AuthLayout` directly from its own page.
     */
    public function authImage(string $src, ?string $alt = null): self
    {
        $this->authImage = ['src' => $src, 'alt' => $alt];

        return $this;
    }

    /** @return array{src: string, alt: string|null}|null */
    public function getAuthImage(): ?array
    {
        return $this->authImage;
    }

    /**
     * Prefer `sidebarLayout()`. Alias kept for call sites that say "variant".
     *
     * @param  string  $variant  Layout name or shadcn block alias (see SIDEBAR_LAYOUT_ALIASES).
     */
    public function sidebarVariant(string $variant): self
    {
        return $this->sidebarLayout($variant);
    }

    /**
     * Pick the sidebar chrome family for AppSidebar / PanelShell.
     *
     * Accepts a PanelKit name (`inset`, `sidebar`, `floating`, `icon`, `header`,
     * `accordion`, `file-tree`, `calendar`, `dialog`) or a shadcn-vue block id
     * such as `sidebar-08` / `sidebar-05`. Unknown names fall back to `inset`
     * (the historical default).
     */
    public function sidebarLayout(string $layout): self
    {
        $resolved = self::SIDEBAR_LAYOUT_ALIASES[$layout] ?? $layout;

        $this->sidebarLayout = in_array($resolved, self::SIDEBAR_LAYOUTS, true)
            ? $resolved
            : 'inset';

        return $this;
    }

    /** @return 'inset'|'sidebar'|'floating'|'icon'|'header'|'accordion'|'file-tree'|'calendar'|'dialog' */
    public function getSidebarLayout(): string
    {
        return $this->sidebarLayout;
    }

    /** @return 'inset'|'sidebar'|'floating'|'icon'|'header'|'accordion'|'file-tree'|'calendar'|'dialog' */
    public function getSidebarVariant(): string
    {
        return $this->sidebarLayout;
    }

    /** @return list<string> */
    public static function sidebarLayouts(): array
    {
        return self::SIDEBAR_LAYOUTS;
    }

    /**
     * Opt this panel into a shared sign-in page at `$path`.
     *
     * When two or more panels declare the same path, the package registers ONE
     * route there. POST to that route tries each participating panel's guard in
     * registration order; the first that accepts the credentials decides where
     * the user lands.
     *
     * THE DEFAULT PATH IS `login`, WHICH IS WHERE FORTIFY AND BREEZE PUT THEIR
     * OWN SIGN-IN. `PanelRoutes` skips a path that is already claimed - so if
     * the application already owns `/login`, the shared route does not replace
     * it. The declaration remains in code and is ready once the conflict is
     * resolved.
     *
     * @param  non-empty-string  $path
     */
    public function sharedLogin(string $path = 'login'): self
    {
        $this->sharedLoginPath = $path;

        return $this;
    }

    public function getSharedLoginPath(): ?string
    {
        return $this->sharedLoginPath;
    }

    public function getLoginSlug(): string
    {
        return $this->loginSlug ?? 'login';
    }

    /**
     * A "FORGOT PASSWORD?" LINK LEADING NOWHERE IS WORSE THAN NO LINK,
     * because somebody waits for a message. Off for any portal whose accounts
     * are provisioned rather than self-served.
     */
    public function passwordReset(bool $enabled = true): self
    {
        $this->passwordReset = $enabled;

        return $this;
    }

    public function hasPasswordReset(): bool
    {
        return $this->passwordReset;
    }

    /**
     * Email a one-time sign-in link on this portal's login screen.
     *
     *     Panel::make('admin')->login()->passwordless();
     *
     * Alias: `magicLink()`. Also set `PANEL_MAGIC_LINK=true` and migrate the
     * `magic_login_tokens` table (see `panel.auth.magic_link_table`).
     */
    public function passwordless(bool $enabled = true): self
    {
        $this->passwordless = $enabled;

        return $this;
    }

    /** Alias of `passwordless()`. */
    public function magicLink(bool $enabled = true): self
    {
        return $this->passwordless($enabled);
    }

    public function hasPasswordless(): bool
    {
        return $this->passwordless;
    }

    /** Panel opt-in and config must both be on for magic link to run. */
    public function passwordlessActive(): bool
    {
        return $this->passwordless
            && filter_var(config('panel.auth.magic_link', false), FILTER_VALIDATE_BOOLEAN);
    }

    /**
     * THE BROKER THIS PORTAL RESETS THROUGH, and it must match the guard.
     *
     * A BROKER IS A PROVIDER, WHICH MEANS A TABLE. `Password::broker('users')`
     * looks an address up among OPERATORS whatever portal asked, so a customer
     * requesting a reset on the client portal had their address matched
     * against `users` - finding nobody on a good day, and on a bad one mailing
     * a reset link for an operator account that happens to share the address.
     * Two guards and one broker is not a configuration detail.
     *
     * Null falls back to `panel.auth.broker`, which is correct for the portal
     * that runs on the default guard and wrong for every other one.
     */
    public function passwordBroker(string $broker): self
    {
        $this->passwordBroker = $broker;

        return $this;
    }

    public function getPasswordBroker(): ?string
    {
        return $this->passwordBroker ?? config('panel.auth.broker');
    }

    public function path(string $path): self
    {
        $this->path = trim($path, '/');

        return $this;
    }

    /**
     * Restrict this panel to requests arriving on a specific hostname.
     *
     * When set, the panel's routes are wrapped in `Route::domain($pattern)`,
     * so `isp.example.com` and `admin.example.com` can each host a separate
     * portal at the same path (e.g. both at `/`) without one swallowing the
     * other's URLs.
     *
     * The pattern follows Laravel's route-domain syntax: a plain hostname
     * (`isp.example.com`) or a pattern with a `{wildcard}` capture
     * (`{tenant}.example.com`).
     */
    public function domain(string $domain): self
    {
        $this->domain = $domain;

        return $this;
    }

    public function getDomain(): ?string
    {
        return $this->domain;
    }

    public function guard(string $guard): self
    {
        $this->guard = $guard;

        return $this;
    }

    /** @param list<string> $middleware */
    public function middleware(array $middleware): self
    {
        $this->middleware = $middleware;

        return $this;
    }

    /** @param list<string> $middleware */
    public function authMiddleware(array $middleware): self
    {
        $this->authMiddleware = $middleware;

        return $this;
    }

    /**
     * First-class panel access hook, after the guard authenticates.
     *
     * Combined with `CanAccessPanel` on the user. Either returning false is a
     * 403, not an empty broken shell.
     *
     * @param  Closure(Authenticatable): bool|null  $callback  Pass null to clear.
     */
    public function canAccess(?Closure $callback): self
    {
        $this->canAccess = $callback;

        return $this;
    }

    public function accessUsing(): ?Closure
    {
        return $this->canAccess;
    }

    public function context(string $context): self
    {
        if (! in_array($context, [self::CONTEXT_TENANT, self::CONTEXT_CENTRAL], true)) {
            throw new RuntimeException("Unknown panel context [{$context}].");
        }

        $this->context = $context;

        return $this;
    }

    /** Resolved lazily - branding is tenant data and must not be cached. */
    public function brandName(Closure $brandName): self
    {
        $this->brandName = $brandName;

        return $this;
    }

    /**
     * PACKAGED SCREENS THIS PANEL DOES NOT WANT.
     *
     * REPORTED FROM A REAL PORT: `Changelog`, `Environment`, `Trash` and the
     * document designer mount on EVERY panel, so a customer portal grew an
     * environment editor and a bin for records its readers never delete. There
     * was one global switch - `panel.routes.roles` - and no way to say "not on
     * this one".
     *
     * NAMED HERE RATHER THAN IN CONFIG, beside the guard and the middleware,
     * because which screens a portal offers is the same KIND of decision as
     * which guard it authenticates with: a property of the panel rather than of
     * the installation. A config list keyed by panel id would be a second place
     * to look and a second place to forget.
     *
     * THE ROUTE GOES, NOT JUST THE MENU ENTRY. Hiding an entry leaves the URL
     * answering, and a bookmarked `/portal/environment` would still edit the
     * application's environment file for somebody the panel meant to keep out.
     *
     * @param  list<string>  $screens  any of: operations, roles, trash, documents, help
     */
    public function without(array $screens): self
    {
        $this->without = array_values(array_unique([...$this->without, ...$screens]));

        return $this;
    }

    /**
     * Opt this portal into editing Help, FAQ, What's new and About on those
     * pages themselves. Default off. Pair with the `support.update` ability.
     */
    public function editableSupport(bool $enabled = true): self
    {
        $this->editableSupport = $enabled;

        return $this;
    }

    public function isSupportEditable(): bool
    {
        return $this->editableSupport;
    }

    /**
     * Render `AppPageFooter` after every page in this panel's shell.
     *
     * OFF BY DEFAULT. The copyright bar is chrome the host opts into, not
     * something the kit injects. `true` is panel-wide; a single screen still
     * imports the Vue component when this stays false.
     */
    public function pageFooter(bool $enabled): self
    {
        $this->pageFooter = $enabled;

        return $this;
    }

    public function hasPageFooter(): bool
    {
        return $this->pageFooter;
    }

    /**
     * Bordered cards on the multi-section settings screens (Profile,
     * Security, Workspaces, Organisation, Notifications, Assistant, SMTP)
     * instead of one flat list.
     *
     * ON BY DEFAULT. Security and Profile are rendered directly by their own
     * controllers under fixed page names, so there is no template position
     * for a host to pass a prop into without forking the page - this travels
     * through `SharePanelProps` instead, the same route `authTestimonial()`
     * takes to reach `AuthLayout`. `->groupedSettingsCards(false)` returns
     * every one of them to one flat list, for a host that wants the plainer
     * chrome.
     */
    public function groupedSettingsCards(bool $enabled = true): self
    {
        $this->groupedSettingsCards = $enabled;

        return $this;
    }

    public function hasGroupedSettingsCards(): bool
    {
        return $this->groupedSettingsCards;
    }

    /**
     * Opt this portal into `/settings/payments`. Default off.
     *
     * `$gateways` is a closure returning the card list (`key`, `label`,
     * `caption`, `mark`, `color`, `connected`, `mode`, `methods`). Persist
     * elsewhere; the Vue half keeps a browser showcase unless you wire saves.
     */
    public function paymentSettings(?Closure $gateways = null): self
    {
        $this->paymentSettings = true;
        $this->paymentGatewaysResolver = $gateways;

        return $this;
    }

    public function offersPaymentSettings(): bool
    {
        return $this->paymentSettings;
    }

    public function paymentGatewaysResolver(): ?Closure
    {
        return $this->paymentGatewaysResolver;
    }

    /**
     * Opt this portal into `/settings/smtp` - the outgoing mail server this
     * installation sends through, saved and testable from the panel rather
     * than only `.env`. Default off. See `MailSettingsPage`.
     */
    public function mailSettings(): self
    {
        $this->mailSettings = true;

        return $this;
    }

    public function offersMailSettings(): bool
    {
        return $this->mailSettings;
    }

    /**
     * Opt this portal into `PlanCatalogPage` - a customer browses the plan
     * catalogue and picks one. Default off.
     *
     * `$createCheckoutSession` receives `panel`, `user`, `request`, `planId`
     * (matched by name via `app()->call()`, the same convention every other
     * billing hook here uses) and must return the URL to redirect the
     * browser to - a Stripe Checkout Session, a Paddle transaction link,
     * whatever the host's processor issues. PanelKit ships no payment
     * processor (see docs/13-billing-adapters.md): this is the purchase-side
     * equivalent of `billingWebhookMapper()`, which already takes the same
     * "the vendor is yours, the shape is a closure" posture for the inbound
     * half of the same story.
     */
    public function planCatalog(Closure $createCheckoutSession): self
    {
        $this->apps(['plan-checkout']);
        $this->planCheckoutResolver = $createCheckoutSession;

        return $this;
    }

    public function planCheckoutResolver(): ?Closure
    {
        return $this->planCheckoutResolver;
    }

    /**
     * Opt this portal into empty kit apps: `mail`, `chat`, `api-keys`, `invites`,
     * `feature-flags`, `api-docs`, `logs`, `showcase`.
     *
     * Each is an empty canvas or thin wrapper. Fill hooks on a subclass, or live
     * with empty lists. `without(['mail'])` still drops a screen you enabled.
     *
     * @param  list<string>  $names
     */
    public function apps(array $names): self
    {
        foreach ($names as $name) {
            $this->apps[$name] = true;
        }

        return $this;
    }

    /**
     * Shorthand for `->apps(['webhooks'])`.
     */
    public function webhooks(): self
    {
        return $this->apps(['webhooks']);
    }

    /**
     * Built-in Scalar API docs (nav, page, OpenAPI). Shorthand for
     * `->apps(['api-docs'])`.
     *
     * Pass `$openapiUrl` to point Scalar at an existing document instead of the
     * kit-generated `{panel}/apps/api-docs/openapi.json`.
     */
    public function apiDocs(?string $openapiUrl = null): self
    {
        $this->apps(['api-docs']);

        if (is_string($openapiUrl) && $openapiUrl !== '') {
            $this->openapiUrl = $openapiUrl;
        }

        return $this;
    }

    /**
     * Read-only log tail (`apps/logs`). Shorthand for `->apps(['logs'])`.
     *
     * @param  string|null  $defaultFile  Basename such as `laravel.log`
     * @param  list<string>|null  $allowlist  Basename allow-list; null = all `*.log` in storage/logs
     */
    public function logTail(?string $defaultFile = 'laravel.log', ?array $allowlist = null): self
    {
        $this->apps(['logs']);

        if (is_string($defaultFile) && $defaultFile !== '') {
            $this->logTailDefault = basename($defaultFile);
        }

        if ($allowlist !== null) {
            $this->logTailAllowlist = array_values(array_map(
                static fn (string $name): string => basename($name),
                $allowlist,
            ));
        }

        return $this;
    }

    /**
     * Kit-only showcase of fields, columns, and widgets. Shorthand for
     * `->apps(['showcase'])`. Domain-neutral sample data; keep vertical demos
     * on separate host pages.
     */
    public function kitShowcase(): self
    {
        return $this->apps(['showcase']);
    }

    public function getLogTailDefault(): ?string
    {
        return $this->logTailDefault;
    }

    /**
     * @return list<string>|null
     */
    public function getLogTailAllowlist(): ?array
    {
        return $this->logTailAllowlist;
    }

    /**
     * OpenAPI URL for the Scalar screen, or null to use the generated route.
     */
    public function getOpenapiUrl(): ?string
    {
        return $this->openapiUrl;
    }

    public function offersApp(string $name): bool
    {
        return ($this->apps[$name] ?? false) && $this->offers($name);
    }

    /**
     * Opt this portal into in-panel feedback (`POST {panel}/feedback`).
     *
     * `$persist` receives the validated payload and the acting user. Without
     * it the request still succeeds (toast only). Mount `FeedbackDialog` on
     * What's new. Do not put Send feedback in the account menu or the shell.
     */
    public function feedback(?Closure $persist = null): self
    {
        $this->feedback = true;
        $this->feedbackPersister = $persist;

        return $this;
    }

    public function offersFeedback(): bool
    {
        return $this->feedback && $this->offers('feedback');
    }

    public function feedbackPersister(): ?Closure
    {
        return $this->feedbackPersister instanceof Closure ? $this->feedbackPersister : null;
    }

    /**
     * Opt this portal into a full-screen first-run setup wizard, separate
     * from the dashboard checklist `onboarding()` enables.
     *
     * $resolver RETURNS THE WIZARD rather than being handed one to fill in,
     * matching `feedback()`'s single-call shape rather than the split
     * `onboarding()`/`onboardingSteps()` pair: there is no framework-wide
     * default step list a setup wizard could fall back to the way
     * `OnboardingSteps::chrome()` supplies kit chrome for the checklist -
     * every step here collects real, host-specific data, so a host that
     * calls this always supplies its own steps.
     *
     * ENABLING THIS ON AN EXISTING INSTALL REDIRECTS EVERY CURRENT USER TO
     * IT ON THEIR NEXT LOGIN. `SetupWizardState::isDone()` defaults to false
     * for everyone, the same as any other first-run flag flipped after
     * people already exist - backfill `appearance.setupWizardDone = true`
     * for existing users in the migration/seeder that turns this on.
     *
     * TWO THINGS A HOST STILL HAS TO DO ITSELF, because they live in the
     * application, not the package: exempt `panel_setup_wizard_done` from
     * `EncryptCookies` in `bootstrap/app.php` (`SetupWizardState`'s own
     * docblock explains why an encrypted copy of that cookie is unreadable
     * to itself), and make the `SetupWizard` page name resolve to no layout
     * in `createInertiaApp({ layout: ... })` - it draws its own full-screen
     * card and is reached by a forced redirect before anyone has seen the
     * sidebar, the same reasoning `LockScreen`/`VerifyOtp` already get.
     *
     * @param  Closure(): \Alxtexh\Panel\Support\SetupWizard  $resolver
     */
    public function setupWizard(Closure $resolver): self
    {
        $this->setupWizardEnabled = true;
        $this->setupWizardResolver = $resolver;

        return $this;
    }

    public function setupWizardResolver(): ?Closure
    {
        return $this->setupWizardResolver instanceof Closure ? $this->setupWizardResolver : null;
    }

    public function offersSetupWizard(): bool
    {
        return $this->setupWizardEnabled && $this->offers('setup-wizard');
    }

    /**
     * Replace or wrap the default first-run setup steps shown on the dashboard.
     *
     * The closure receives the kit chrome steps (organisation, settings,
     * security, and so on) and returns the list to render. Each step needs
     * `key`, `label`, `done`, and `href` to a real panel route.
     *
     * @param  Closure(list<array<string, mixed>>): list<array<string, mixed>>  $resolver
     */
    public function onboardingSteps(Closure $resolver): self
    {
        $this->onboardingStepsResolver = $resolver;

        return $this;
    }

    public function onboardingStepsResolver(): ?Closure
    {
        return $this->onboardingStepsResolver instanceof Closure ? $this->onboardingStepsResolver : null;
    }

    /**
     * Opt this portal into the first-run "Get started" guide. Default off.
     *
     * A CALL, NOT A CONFIG DEFAULT, matching `editableSupport()`: whether new
     * arrivals see a setup tour is a property of THIS portal, not something
     * every packaged install inherits until somebody notices and turns it
     * off. Pair with `onboardingSteps()` to mark steps done from real state
     * instead of the kit defaults' permanent "not done".
     */
    public function onboarding(bool $enabled = true): self
    {
        $this->onboardingEnabled = $enabled;

        return $this;
    }

    public function offersOnboarding(): bool
    {
        return $this->onboardingEnabled;
    }

    /**
     * Optional source for What's new: GitHub releases for this repository.
     *
     * Accepts `owner/repo` or a github.com URL. Sync is a button, not a
     * background job; a failed fetch leaves locally edited rows alone.
     */
    public function supportGithubRepository(?string $repository): self
    {
        $this->supportGithubRepository = $repository === null || $repository === ''
            ? null
            : $repository;

        return $this;
    }

    public function getSupportGithubRepository(): ?string
    {
        return $this->supportGithubRepository
            ?? (is_string(config('panel.support.github_releases'))
                ? (string) config('panel.support.github_releases')
                : null);
    }

    /** Whether a packaged screen is mounted on this panel. */
    public function offers(string $screen): bool
    {
        return ! in_array($screen, $this->without, true);
    }

    /**
     * PER-PANEL COLOUR TOKENS, applied as CSS variables on every screen.
     *
     * A CLOSURE, NOT AN ARRAY, because the answer may depend on the request -
     * a reseller portal wearing the reseller's own colours has to read who is
     * signed in, and a value computed at boot would serve the first visitor's
     * brand to everybody on that worker.
     *
     * KEYS ARE TOKEN NAMES WITHOUT THE DASHES: `['primary' => 'oklch(...)']`
     * becomes `--primary`. That is the variable the stylesheet's `@theme` block
     * resolves, which is why components read `bg-primary` and never a literal.
     * The prefixed form `--color-primary` is what Tailwind COMPILES TO and
     * writing that instead sets a property nothing reads - a whole release
     * shipped with per-tenant branding doing exactly that.
     *
     * THIS WAS DEAD CODE UNTIL v0.5.0. The method existed, `resolveColors()`
     * existed, and nothing called either - so an installation could configure
     * a panel's palette and watch nothing happen, which is worse than the
     * method being absent. It is read by `SharePanelProps` now.
     *
     * @param  Closure(): array<string, string>  $colors
     */
    public function colors(Closure $colors): self
    {
        $this->colors = $colors;

        return $this;
    }

    /**
     * The prefix every route in this panel is named with.
     *
     * IT DEFAULTS TO THE PANEL ID AND IS OVERRIDABLE, because two panels both
     * naming a route `resource` would have the second silently overwrite the
     * first - and every generated URL in the first portal would then point into
     * the second. The override exists for a panel that was mounted before there
     * were panels: renaming its routes would break every link that already
     * names them.
     */
    public function routeName(string $prefix): self
    {
        $this->routeName = rtrim($prefix, '.').'.';

        return $this;
    }

    public function getRouteName(): string
    {
        return $this->routeName ?? $this->id.'.';
    }

    public function getPath(): string
    {
        return $this->path;
    }

    public function getGuard(): string
    {
        return $this->guard;
    }

    public function getContext(): string
    {
        return $this->context;
    }

    public function isCentral(): bool
    {
        return $this->context === self::CONTEXT_CENTRAL;
    }

    /**
     * Wrap every write this panel performs in a database transaction.
     *
     * WHAT THIS BUYS IS THE ABSENCE OF HALF A RECORD. A create is rarely one
     * INSERT: custom fields fold into a JSON column, observers write an audit
     * entry, a relation is attached, a counter is bumped. Something failing
     * partway through leaves the row saved and the audit trail missing, or the
     * parent written and the children not - and the operator sees an error
     * page and retries, producing the duplicate the first attempt half-made.
     *
     * OFF BY DEFAULT, AND THAT IS NOT TIMIDITY. A transaction changes what
     * happens on failure everywhere at once, including in application code
     * this package has never seen: an action that dispatches a job or calls an
     * external service mid-save now does so inside a transaction that may roll
     * back, so the job runs for a record that no longer exists. Turning this on
     * is a decision about YOUR actions, which is why it is a panel's to make.
     */
    public function databaseTransactions(bool $enabled = true): self
    {
        $this->databaseTransactions = $enabled;

        return $this;
    }

    public function hasDatabaseTransactions(): bool
    {
        return $this->databaseTransactions;
    }

    /** @return list<string> */
    /**
     * THE GATE DEFAULTS TO THIS PANEL'S OWN GUARD, DERIVED RATHER THAN TYPED.
     *
     * IT USED TO DEFAULT TO BARE `['auth']`, and bare `auth` means THE DEFAULT
     * GUARD - not this panel's. Every portal that declared `guard('customers')`
     * and forgot to also write `authMiddleware(['auth:customers'])` therefore
     * authenticated operators and read the customer guard for everything
     * afterwards: a portal that lets the wrong people in and then finds nobody,
     * failing open in ways that answer 200.
     *
     * Nothing caught it because the default panel's guard IS the default
     * guard, so the mistake is invisible on the only panel most tests exercise.
     *
     * DERIVING IT MAKES THE MISTAKE UNREPRESENTABLE rather than merely
     * detectable - which is the difference between this and a `panel:doctor`
     * check. `authMiddleware()` still overrides, for a portal that genuinely
     * wants something else in front of the guard.
     *
     * @return list<string>
     */
    public function getMiddleware(): array
    {
        $stack = [...$this->middleware, ...($this->authMiddleware ?? ['auth:'.$this->guard])];
        $stack[] = Http\Middleware\EnsureCanAccessPanel::class;
        $stack = $this->withIdleLockMiddleware($stack);
        $stack[] = Http\Middleware\EnsurePanelEmailIsVerified::class;
        $stack[] = Http\Middleware\RequireTwoFactorEnrolment::class;
        $stack[] = Http\Middleware\RedirectToSetupWizard::class;
        $stack[] = Http\Middleware\EnforceSubscriptionGate::class;

        return $stack;
    }

    /**
     * The panel's middleware WITHOUT the part that demands a session.
     *
     * FOR THE ROUTES A GUEST HAS TO REACH. Social sign-in is the case that
     * needed it: the callback is where somebody BECOMES signed in, so
     * registering it inside the authenticated group redirects every attempt
     * back to the login screen it came from - a loop that looks like the
     * provider refusing.
     *
     * @return list<string>
     */
    public function getGuestMiddleware(): array
    {
        /*
         * UNLOCK-CHECK ON THE GUEST STACK TOO. Login is registered outside
         * `auth`, and a stale lock flag with no user must still be cleared
         * there or `/login` bounces to a lock screen nobody can unlock.
         */
        return $this->withIdleLockMiddleware($this->middleware);
    }

    /**
     * Idle-check, then unlock-check. Order is load-bearing: the first decides
     * to lock, the second holds the lock. Apps must not have to remember this.
     *
     * @param  list<string>  $stack
     * @return list<string>
     */
    private function withIdleLockMiddleware(array $stack): array
    {
        if (! $this->hasIdleLock()) {
            return $stack;
        }

        $stack[] = Http\Middleware\EnforcePanelIdleLock::class;
        $stack[] = Http\Middleware\EnsurePanelIsUnlocked::class;

        return $stack;
    }

    /**
     * The acting user, resolved through THIS panel's guard.
     *
     * Never `auth()->user()` or `$request->user()`. Both read the default guard,
     * which returns null under a non-default one and fails open in confusing
     * ways - see the class docblock.
     */
    public function user(): ?Authenticatable
    {
        return Auth::guard($this->guard)->user();
    }

    public function resolveBrandName(): ?string
    {
        if ($this->brandName === null) {
            return null;
        }

        $name = ($this->brandName)();

        if ($name === null) {
            return null;
        }

        // Em dashes and en dashes render inconsistently across system fonts and
        // look wrong inside interface strings. Strip them at the source so no
        // brand name can carry one into the UI regardless of what the closure returns.
        return (string) preg_replace('/\s*[—–]\s*/', ' - ', $name);
    }

    /** @return array<string, string> */
    public function resolveColors(): array
    {
        return $this->colors === null ? [] : ($this->colors)();
    }
}
