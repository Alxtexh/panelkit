<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Middleware;

use Closure;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Alxtexh\Panel\Auth\Impersonation;
use Alxtexh\Panel\Auth\SocialLoginPayload;
use Alxtexh\Panel\Panel;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\EditableContent;
use Alxtexh\Panel\Support\SettingsIndex;
use Alxtexh\Panel\Support\Ability;
use Alxtexh\Panel\Support\ModuleRegistry;
use Alxtexh\Panel\Support\OperationsNav;
use Alxtexh\Panel\Support\Locale;
use Alxtexh\Panel\Support\PanelAccess;
use Alxtexh\Panel\Support\EnvironmentBanner;
use Alxtexh\Panel\Support\PanelNavigation;
use Alxtexh\Panel\Support\PanelQuickCreate;
use Alxtexh\Panel\Support\Presence;
use Alxtexh\Panel\Support\PanelHome;
use Alxtexh\Panel\Support\PanelIdleActivity;
use Alxtexh\Panel\Support\Tenants;
use Alxtexh\Panel\Trash\TrashBin;
use Symfony\Component\HttpFoundation\Response;

/**
 * The props every panel screen needs, shared once.
 *
 * WHY THIS IS IN THE PACKAGE NOW. `panelPages()` and the resource registry have
 * always existed server-side and nothing handed them to Inertia, so every
 * consuming application wrote its own `HandleInertiaRequests` - rebuilding the
 * sidebar, the prefixing and the ability filter, each differently. The
 * reference app's version was a hundred-line closure that worked; a port that
 * copies two thirds of it has a menu that advertises screens the reader cannot
 * open, or omits ones they can.
 *
 * SHARED LAZILY, WHICH IS NOT A DETAIL. Each value is a closure, so a partial
 * reload that asks for one prop does not walk the whole registry and run an
 * ability check per resource. On a panel with thirty resources that is the
 * difference between a filter change costing one query and costing thirty.
 *
 * STABLE CHROME IS ALSO `Inertia::once`. Nav, i18n, settings index and the
 * panel chrome object change only when the person, tenant, panel or locale
 * changes. Marking them once means a page-to-page visit does not re-resolve or
 * re-send those kilobytes; the client keeps the first payload and the server
 * skips the work. Volatile keys (toast, notification count, auth, impersonation)
 * stay ordinary closures so they stay fresh every hop.
 *
 * IT DOES NOT REPLACE AN APPLICATION'S OWN MIDDLEWARE. Inertia merges shared
 * data, and an application sharing `panelNav` itself wins - the reference app
 * still does, because its sidebar carries screens the package knows nothing
 * about. This is the floor, not the ceiling. Hosts that share chrome themselves
 * should prefer `Inertia::once` too, or they reintroduce the per-click cost.
 */
final class SharePanelProps
{
    public function handle(Request $request, Closure $next): Response
    {
        $panels = app(PanelManager::class);

        /*
         * DATABASE-EDITED CONTENT REGISTERS HERE, not at provider boot.
         *
         * Help, FAQ and What's-new only matter on requests that can render
         * them, and every such request passes through this middleware -
         * hanging the bridge here keeps `artisan` boots and queue workers from
         * paying a content query they will never show. Before `$next`, so the
         * controllers see the registered content; cached, so an unedited table
         * costs one cache read. See `EditableContent` for the shape.
         */
        EditableContent::register();

        /*
         * WHAT THE APPLICATION ALREADY SHARED UNDER `auth`, captured before this
         * middleware shares its own.
         *
         * INERTIA MERGES BY TOP-LEVEL KEY ONLY. Two middlewares both sharing
         * `auth` do not combine - the later one REPLACES the earlier array
         * whole. This middleware runs after the application's (it is route
         * middleware; theirs is in the `web` group), so sharing a bare
         * `['user' => ...]` silently deleted every other key an application had
         * put there.
         *
         * The reference app puts `auth.can` there - the panel-level abilities
         * its account menu reads - so five entries (user management, backups,
         * logs, monitoring, activity) vanished from that menu for somebody who
         * genuinely held the permissions. Nothing errored: `can` was undefined,
         * every `v-if` read falsy, and the items were simply absent, which
         * looks exactly like not being allowed to see them.
         */
        $sharedAuth = Inertia::getShared('auth');

        /*
         * SAME GAP AS `name` ABOVE, ONE SEVERITY HIGHER. Inertia's own
         * `Middleware::share()` is what puts `errors` on every page - a
         * `panel:install` app without Breeze/Jetstream has no class extending
         * it, so `page.props.errors` was undefined everywhere, always.
         *
         * `useForm().post()` decides success vs failure by reading THAT prop,
         * not the HTTP status: empty (or absent) means success. A failed
         * validation on this route already redirects back with errors flashed
         * to the session - correctly - but with no `errors` prop to carry them
         * into the response, the client read "no errors" and called onSuccess
         * on a record that was never written. `ResourceForm.vue`'s onSuccess
         * then did exactly what it is supposed to on a REAL success: toasted
         * "created" and navigated to the index. The user typed nothing wrong;
         * the panel told them they had.
         */
        $sharedErrors = Inertia::getShared('errors');

        /*
         * `chrome()` needs the current panel. On the web-group pass that runs
         * before `UsePanel`, the panel is still null and chrome stays a plain
         * closure. The route-middleware pass after `UsePanel` re-shares with
         * `Inertia::once`, which is what page-to-page visits keep.
         *
         * `Tenants::current($request)` MEMOIZES ON THE REQUEST NOW (see its
         * own docblock) - this used to call it once per prop `chrome()`
         * builds a cache key for. Fourteen props sharing through `chrome()`
         * meant fourteen identical `select * from tenants where id = ?`
         * queries on every request - confirmed live via
         * `Performance\ClientsPerformanceTest`, which expects five queries
         * on a warmed-up request and was seeing twenty.
         */
        $chrome = static fn (callable $resolve, string $name) => self::chrome(
            $resolve,
            $request,
            $panels,
            $name,
        );

        Inertia::share([
            /*
             * APP NAME FOR AUTH SCREENS. Stock Breeze shares this from
             * HandleInertiaRequests; a `panel:install` app often has neither
             * Breeze nor that middleware, so AuthLayout fell back to "Panel"
             * while the demo showed APP_NAME. Share it here once so every
             * packaged screen sees the same product name.
             */
            'name' => static fn (): string => (string) config('app.name', 'Panel'),

            /*
             * FILLS THE SAME GAP AS `name`, NOT REPLACES A HOST'S OWN. An app
             * with its own `HandleInertiaRequests` (Breeze/Jetstream, or one
             * `panel:install` wrote itself) already shares this correctly -
             * `$sharedErrors` is non-null there, and this defers to it rather
             * than overwriting an equivalent value with a second one.
             */
            'errors' => $sharedErrors ?? Inertia::always(
                static fn (): object => self::validationErrors($request),
            ),

            /*
             * KIT STRINGS for Vue `t()`. A few kilobytes on first paint so keys
             * never flash. Hosts overlay `lang/{locale}/panel.php`. Once-keyed
             * by locale so a language switch still refreshes the bag.
             */
            'messages' => $chrome(static fn (): array => Locale::messages(), 'messages'),
            'locale' => $chrome(static fn (): array => Locale::shared(), 'locale'),

            /*
             * FLASH TOAST. Controllers already `->with('toast', ...)` and
             * `Inertia::flash('toast', ...)`. Sharing it here is what lets
             * `Notification::make()->send()` reach the packaged Toaster
             * without a Livewire stack and without every host copying
             * playground `flashToast.ts`.
             */
            'toast' => static function (): ?array {
                $toast = session('toast');

                return is_array($toast) ? $toast : null;
            },

            /*
             * THE SIDEBAR. See `PanelNavigation` for why the prefix and the
             * current-panel filter are the two things worth getting right.
             */
            'panelNav' => $chrome(static fn (): array => PanelNavigation::build(), 'panelNav'),

            /*
             * Environment badge prop. Always null: chrome no longer renders it.
             * Key kept so older host code reading the prop does not break.
             */
            'environmentBanner' => $chrome(static fn (): ?array => EnvironmentBanner::for(), 'environmentBanner'),

            /*
             * Creatable resources for the header Quick Create menu. Empty when
             * none, or when the panel opted out with ->quickCreate(false).
             */
            'quickCreate' => $chrome(static fn (): array => PanelQuickCreate::build(), 'quickCreate'),

            /*
             * Record presence. Null when off so the client mounts nothing.
             */
            'presence' => $chrome(static fn (): ?array => Presence::shared(), 'presence'),

            /*
             * DECLARED PAGES, when the application has not already shared them.
             * The command palette and the shell both read this list. Playground
             * merges extra entries first; that share wins. Prefer `Inertia::once`
             * in the host share so page-to-page visits stay cheap.
             */
            'panelPages' => Inertia::getShared('panelPages')
                ?? $chrome(static fn (): array => app(PanelManager::class)->panelPages(), 'panelPages'),

            /*
             * Account appearance, so a second browser adopts the theme on
             * first paint. Null for a guest, or when the user model has no
             * `appearance` attribute.
             */
            'appearance' => Inertia::getShared('appearance')
                ?? static function () use ($request): ?array {
                    $user = $request->user();
                    $value = $user instanceof \Illuminate\Database\Eloquent\Model
                        ? $user->getAttribute('appearance')
                        : null;

                    return is_array($value) ? $value : null;
                },

            /*
             * Shell-only render hooks (`shell.*`). Resource-scoped hooks stay
             * on the page that asked for them.
             */
            'shellHooks' => $chrome(static fn (): array => array_values(array_filter(
                app(PanelManager::class)->renderHooks(null),
                static fn (array $hook): bool => str_starts_with($hook['position'], 'shell.'),
            )), 'shellHooks'),

            'panelEmptyGrants' => static function () use ($panels): bool {
                $panel = $panels->currentPanel();

                return $panel !== null && PanelAccess::emptyGrants($panel, $panel->user());
            },

            'panelEmptyGrantsHint' => static function () use ($panels): ?array {
                $panel = $panels->currentPanel();

                if ($panel === null) {
                    return null;
                }

                return PanelAccess::emptyGrantsHint($panel, $panel->user());
            },

            /*
             * IDLE LOCK, when this panel authenticates. The client timer,
             * warning modal and header padlock read this; `->idleLock(false)`
             * shares null and they stay unmounted.
             */
            'panelIdleLock' => $chrome(static function () use ($panels): ?array {
                $panel = $panels->currentPanel();

                if ($panel === null || ! $panel->hasIdleLock()) {
                    return null;
                }

                $lockUrl = PanelIdleActivity::lockUrl($panel);

                if ($lockUrl === null) {
                    return null;
                }

                return [
                    'idleMinutes' => $panel->idleLockMinutes(),
                    'warningSeconds' => $panel->idleLockWarningSeconds(),
                    'lockUrl' => $lockUrl,
                ];
            }, 'panelIdleLock'),

            /*
             * GROUPS THAT ARE SECTIONS, NOT DROPDOWNS.
             *
             * Every sidebar group used to be a collapsible - the only
             * presentation there was. A name listed here renders as a plain,
             * always-open section instead: heading, items, no chevron, no
             * state. Declared in config because it is an INSTALLATION'S
             * decision about its own information architecture - a group of
             * three ever-used screens earns permanence; a group of twenty
             * resources earns a toggle - and the demo declares one so anybody
             * building on it can see both presentations exist.
             */
            'panelStaticGroups' => $chrome(static fn (): array => array_values(array_filter(array_map(
                'trim',
                (array) config('panel.navigation.static_groups', []),
            ), static fn (string $name): bool => $name !== '')), 'panelStaticGroups'),

            /*
             * THE BIN, for the packaged account menu. The reference app shares
             * this itself; an application that has is left alone (same rule as
             * `auth` below), and one that has not gets the package's own
             * resolution - null when nothing in this panel soft-deletes, which
             * is what keeps a binless portal from offering an empty screen.
             */
            'panelTrash' => Inertia::getShared('panelTrash')
                ?? static fn (): ?array => app(TrashBin::class)->navigationEntry(),

            /*
             * THE SIDEBAR'S OWN "DASHBOARD" ENTRY, separate from `panel.home`
             * above (the logo's click target - `PanelShell.vue`). Both resolve
             * through the same `PanelHome::urlFor`, so they cannot disagree,
             * but `AppSidebar.vue` reads a TOP-LEVEL `panelHome` prop, not
             * `panel.home` - and until this was added, that read always missed,
             * so the client fell back to its own hardcoded `{ href: '/',
             * isDefault: true }`. On a panel mounted at the application's own
             * root that fallback IS the bug this whole class exists to prevent:
             * the sidebar's first, most-clicked entry pointed at Laravel's
             * welcome page instead of the dashboard, silently, because nothing
             * ever threw - a wrong href is not an error.
             *
             * `isDefault` NAMES THE APPLICATION'S DEFAULT PANEL - `config('panel.default')`,
             * mounted at the root - not whether resolution succeeded. A
             * generated portal's home is never the operator panel's, so its
             * support footer falls back to nothing rather than linking out
             * (see `supportNavItems` in `AppSidebar.vue`).
             */
            'panelHome' => $chrome(static function () use ($panels): ?array {
                $panel = $panels->currentPanel();

                if ($panel === null) {
                    return null;
                }

                return [
                    'href' => PanelHome::urlFor($panel),
                    'isDefault' => $panel->id === (string) config('panel.default', 'admin'),
                ];
            }, 'panelHome'),

            'panel' => $chrome(static function () use ($panels): ?array {
                $panel = $panels->currentPanel();

                if ($panel === null) {
                    return null;
                }

                return [
                    'id' => $panel->id,
                    'path' => '/'.trim($panel->getPath(), '/'),

                    /*
                     * WHERE THIS PANEL'S HOME LINK GOES, and it is shared
                     * because the shell cannot work it out.
                     *
                     * The published layout had `href: '/dashboard'` written
                     * into it - a FIXED path in an application that can mount
                     * several portals. So inside `/platform` the sidebar's Home
                     * pointed at the ADMIN panel's dashboard: clicking it left
                     * the portal, silently, and for somebody who may not open
                     * that dashboard it refused. Every generated portal had it,
                     * because the layout is the same file.
                     *
                     * `PanelHome::urlFor` is the same resolution sign-in uses,
                     * so the link and the redirect cannot disagree.
                     */
                    'home' => PanelHome::urlFor($panel),
                    'brand' => $panel->resolveBrandName(),

                    /*
                     * PAGE FOOTER LINKS, not the sidebar's Help/FAQ/What's new
                     * /About. Empty unless the application named some: a
                     * packaged default of /privacy would 404 on a stock
                     * install. Brand for the copyright line is `brand` above,
                     * falling back to `app.name` on the client.
                     */
                    'footerLinks' => array_values(array_filter(
                        array_map(
                            static function (mixed $link): ?array {
                                if (! is_array($link) || ! isset($link['label'], $link['href'])) {
                                    return null;
                                }

                                return [
                                    'label' => (string) $link['label'],
                                    'href' => (string) $link['href'],
                                ];
                            },
                            (array) config('panel.footer.links', []),
                        ),
                    )),
                    /*
                     * WHETHER THE SHELL RENDERS AppPageFooter. Default false:
                     * hosts opt in with Panel::pageFooter(true). Shared so the
                     * Vue shell does not hard-wire chrome the PHP API turned
                     * off.
                     */
                    'pageFooter' => $panel->hasPageFooter(),
                    'authLayout' => $panel->getAuthLayout(),
                    'authTestimonial' => $panel->getAuthTestimonial(),
                    'authImage' => $panel->getAuthImage(),
                    'groupedSettingsCards' => $panel->hasGroupedSettingsCards(),
                    /*
                     * Gallery / preview routes may set request attribute
                     * `forceSidebarLayout` so the shared panel payload matches
                     * the live shell without mutating the registered Panel.
                     */
                    'sidebarLayout' => self::previewSidebarLayout($panel),

                    /*
                     * THE PANEL'S OWN PALETTE, resolved per request because a
                     * portal may wear the signed-in reseller's colours. Empty
                     * for a panel that declared none, which is most of them -
                     * the published layout applies nothing in that case and the
                     * stylesheet's defaults stand.
                     *
                     * `Panel::colors()` was dead code until this line existed:
                     * the builder method and its resolver both shipped and
                     * nothing read either, so configuring a palette did
                     * nothing at all.
                     */
                    'colors' => $panel->resolveColors(),

                    /*
                     * WHERE "SIGN OUT" POSTS, decided by the SERVER because
                     * only the server knows whether this panel scaffolded its
                     * own auth. `--auth` names the route `{id}.logout`; an
                     * application on Breeze or Fortify has a plain `logout`.
                     *
                     * NULL WHEN NEITHER EXISTS, and the packaged shell then
                     * renders no sign-out item at all. A menu entry posting to
                     * a route that does not exist is a 404 on the one action
                     * somebody takes when they want to be safe.
                     */
                    'logout' => match (true) {
                        Route::has($panel->getRouteName().'logout') => route($panel->getRouteName().'logout'),
                        Route::has($panel->id.'.logout') => route($panel->id.'.logout'),
                        Route::has('logout') => route('logout'),
                        default => null,
                    },

                    /*
                     * THE ACCOUNT'S OWN SCREENS, decided the same way and for
                     * the same reason.
                     *
                     * `PanelAccountMenu` HAS TAKEN AN `accountUrl` PROP SINCE
                     * IT WAS WRITTEN and nothing ever passed one, so no
                     * installation's account menu offered a profile link - a
                     * seam with nothing behind it, of exactly the kind these
                     * two screens were missing until 0.8.1.
                     *
                     * NULL WHEN THE ROUTE IS ABSENT, because a panel may opt out
                     * of the packaged screens, and a menu item pointing at a
                     * route that is not registered is a 404 wearing a label.
                     */
                    /*
                     * ENTRIES THIS PORTAL ADDS TO THE ACCOUNT DROPDOWN.
                     *
                     * The core two - profile and sign out - are the
                     * keys around this one and are unconditional, because every
                     * portal authenticates somebody and every one of them must
                     * let that person reach their own account. This is what a
                     * panel adds BESIDE them, and until it existed the dropdown
                     * was a Vue slot only the application could fill: a plugin
                     * had no way in at all.
                     *
                     * `href` IS RESOLVED HERE because panels register in a
                     * provider's `boot`, before routes exist - so a closure is
                     * the only form that can name a route. The ability is
                     * checked server-side, so an entry somebody may not use is
                     * absent rather than disabled.
                     */
                    'menuItems' => collect($panel->getUserMenuItems())
                        ->filter(static fn (array $i): bool => ! isset($i['ability'])
                            || Ability::allows($panel->user(), (string) $i['ability']))
                        ->map(static fn (array $i): array => [
                            'key' => $i['key'] ?? '',
                            'label' => $i['label'] ?? '',
                            'href' => ($i['href'] ?? '') instanceof \Closure ? ($i['href'])() : (string) ($i['href'] ?? ''),
                            'icon' => $i['icon'] ?? null,
                        ])
                        ->values()
                        ->all(),

                    'feedback' => $panel->offersFeedback() && Route::has($panel->getRouteName().'feedback')
                        ? route($panel->getRouteName().'feedback')
                        : null,

                    'account' => $accountUrl = self::namedUrl(
                        $panel,
                        ['profile', 'settings.profile'],
                        ['profile.edit', 'profile', 'settings.profile'],
                    ),
                    /*
                     * SECURITY IS NOT A DROPDOWN ROW when Profile is present.
                     * Profile opens the account area; security is the sibling
                     * tab inside SettingsLayout. A Profile + Security +
                     * Settings triplet was three doors into the same rooms.
                     */
                    'security' => $accountUrl !== null
                        ? null
                        : self::namedUrl(
                            $panel,
                            ['security', 'settings.security'],
                            ['security.edit', 'security', 'settings.security'],
                        ),

                    /*
                     * AND HELP, for the same reason and in the same place. A
                     * help centre reached only by typing `/help` is one nobody
                     * finds; under the avatar is where every application anybody
                     * has used puts it.
                     */
                    'help' => Route::has($panel->getRouteName().'support.help')
                        ? route($panel->getRouteName().'support.help')
                        : null,

                    /*
                     * FAQ AND ABOUT TRAVEL THE SAME WAY, because the sidebar
                     * footer renders them. They used to be hardcoded to `/faq`
                     * and `/about` and therefore suppressed outside the default
                     * panel - on reasoning that predated `HelpController` being
                     * mounted under every panel's prefix. The routes exist per
                     * panel; only the hrefs were stuck at the root, so every
                     * generated portal lost its whole support footer to a
                     * stale guard.
                     */
                    'faq' => Route::has($panel->getRouteName().'support.faq')
                        ? route($panel->getRouteName().'support.faq')
                        : null,
                    'about' => Route::has($panel->getRouteName().'support.about')
                        ? route($panel->getRouteName().'support.about')
                        : null,
                    'whatsNew' => match (true) {
                        Route::has($panel->getRouteName().'support.whats-new') => route($panel->getRouteName().'support.whats-new'),
                        Route::has($panel->getRouteName().'pages.whats-new') => route($panel->getRouteName().'pages.whats-new'),
                        default => null,
                    },

                    /*
                     * EVERYTHING THE ACCOUNT MENU OFFERS, resolved per panel
                     * and null where this panel genuinely lacks the screen.
                     *
                     * The reference app's menu was 299 lines in the app because
                     * every href came from Wayfinder - generated helpers a
                     * consumer does not have. These urls are the same
                     * resolution done server-side, which is the only place
                     * that knows what is actually routed. The packaged menu
                     * renders exactly the items that are non-null, so a portal
                     * without operations offers no Backups rather than a 404,
                     * and nothing is gated on "is this the default panel".
                     */
                    'settings' => Route::has($panel->getRouteName().'settings.index')
                        ? route($panel->getRouteName().'settings.index')
                        : null,
                    /*
                     * WHEN TRUE, Settings lives in the Settings sidebar group and
                     * the account menu omits the duplicate row. Default on;
                     * `->sidebarSettings(false)` flips this and restores the
                     * avatar entry.
                     */
                    'settingsInSidebar' => $panel->hasSidebarSettings()
                        && Route::has($panel->getRouteName().'settings.index'),
                    'userManagement' => Route::has($panel->getRouteName().'pages.user-management')
                        ? route($panel->getRouteName().'pages.user-management', ['tab' => 'users'])
                        : null,
                    'lock' => Route::has($panel->getRouteName().'lock')
                        ? route($panel->getRouteName().'lock')
                        : null,

                    /*
                     * THE ACTIVITY LOG IS A RESOURCE, so its presence is a
                     * registry question rather than a route one - the resource
                     * route is a wildcard that answers for any slug, registered
                     * or not.
                     */
                    'activity' => isset($panels->resourcesFor($panel->id)['activities'])
                        && Route::has($panel->getRouteName().'resource')
                        ? route($panel->getRouteName().'resource', ['resource' => 'activities'])
                        : null,

                    /*
                     * OPERATIONS FALL BACK TO THE ROOT NAMES ONLY FOR THE
                     * DEFAULT PANEL. The reference app opts out of the packaged
                     * mounting (`->without(['operations'])`) and mounts them at
                     * the root itself, so the panel-prefixed names do not exist
                     * there. A NON-default portal must not inherit that
                     * fallback: its operator was deliberately not given a
                     * restore button, and a menu that routes around `without()`
                     * un-decides that.
                     */
                    'operations' => OperationsNav::urls($panel),
                    'modules' => ModuleRegistry::all(),
                    'grantedModules' => ModuleRegistry::granted(),
                ];
            }, 'panel'),

            /*
             * THE SETTINGS SIDEBAR, the same rows as `/settings`. Shared so
             * SettingsLayout does not hardcode Payment gateways on a portal
             * that never opted in.
             */
            'settingsNav' => $chrome(static fn (): array => SettingsIndex::entries($request), 'settingsNav'),

            /*
             * THE SIGNED-IN PERSON, resolved through the PANEL'S GUARD rather
             * than `$request->user()`. That helper reads the default guard and
             * returns null under any other, so a second portal would render its
             * account menu empty while the person was demonstrably signed in.
             */
            'auth' => static function () use ($panels, $request, $sharedAuth): array {
                $guard = $panels->currentPanel()?->getGuard();

                $user = $guard === null
                    ? $request->user()
                    : $request->user($guard);

                /*
                 * MERGED OVER WHAT WAS ALREADY THERE - see the note above. The
                 * application's own keys survive; `user` is still this
                 * package's, because only it knows which guard the current
                 * panel runs on.
                 *
                 * The existing value may itself be a closure, since that is how
                 * a lazily-evaluated shared prop is registered - resolve it
                 * rather than merging a callable into an array of data.
                 */
                $existing = $sharedAuth instanceof Closure ? $sharedAuth() : $sharedAuth;
                $existing = is_array($existing) ? $existing : [];
                $can = is_array($existing['can'] ?? null) ? $existing['can'] : [];

                return array_merge($existing, [
                    'user' => $user === null ? null : [
                        'id' => $user->getAuthIdentifier(),
                        'name' => $user->name ?? null,
                        'email' => $user->email ?? null,
                    ],
                    /*
                     * KIT DEFAULTS for the packaged account menu. A host that
                     * already shared `auth.can` keeps its extra keys; these
                     * two are what Backups / Logs / Monitoring and Roles
                     * check. Ability::allows, not hasPermission(), so a fresh
                     * install without the playground User helper still works.
                     */
                    'can' => array_merge([
                        'manageRoles' => Ability::allows($user, 'manage_roles'),
                        'viewOperations' => Ability::allows($user, 'view_operations'),
                    ], $can),
                ]);
            },

            /*
             * WHAT THE BELL'S BADGE SHOWS BEFORE IT IS OPENED.
             *
             * Sent with the page so the count is right on load with no request
             * at all - the bell itself fetches only when somebody opens it,
             * which is what keeps it off the ambient-polling budget.
             *
             * A CLOSURE, so the query runs only for a response that renders. It
             * is one indexed count on a table the notification system already
             * maintains; guarding it behind `Notifiable` keeps it from throwing
             * on an application whose user model does not use notifications at
             * all.
             */
            'notificationCount' => static function () use ($panels, $request): int {
                $guard = $panels->currentPanel()?->getGuard();

                $user = $guard === null
                    ? $request->user()
                    : $request->user($guard);

                if ($user === null || ! method_exists($user, 'unreadNotifications')) {
                    return 0;
                }

                /*
                 * A MISSING TABLE IS "NOTHING UNREAD", NOT A 500.
                 *
                 * `method_exists` was not enough, and a fresh install proved it
                 * in the worst way: Laravel puts `Notifiable` on the default
                 * User model but does NOT create the `notifications` table -
                 * that migration is opt-in. So the method existed, the query ran
                 * and every panel page died with "no such table: notifications"
                 * on a brand new application.
                 *
                 * CAUGHT RATHER THAN CHECKED, because `Schema::hasTable()` would
                 * be an extra query on every panel response forever to answer a
                 * question that changes once in an application's life.
                 */
                try {
                    return $user->unreadNotifications()->count();
                } catch (QueryException) {
                    return 0;
                }
            },

            /*
             * THE WORKSPACE SWITCHER, for a sidebar that needs it on every
             * page - not only on `settings/workspaces`, which is where this
             * data lived before. `Tenants::switchable()` is false for the
             * ordinary single-tenant panel, and this closure then never
             * queries anything: no membership relation, no organisation
             * model, one key and a `null`.
             *
             * NULL, NOT AN EMPTY ARRAY, when the switch route is not mounted
             * on THIS panel - `$panel->offers('workspaces')` decides that per
             * portal, and a switcher pointing at a route this panel refused
             * would be a control that 404s the moment somebody uses it.
             */
            'workspaces' => static function () use ($panels, $request): ?array {
                if (! Tenants::switchable($request)) {
                    return null;
                }

                $panel = $panels->currentPanel();

                $switchUrl = $panel !== null && Route::has($panel->getRouteName().'settings.workspaces.switch')
                    ? route($panel->getRouteName().'settings.workspaces.switch')
                    : null;

                if ($switchUrl === null) {
                    return null;
                }

                $current = Tenants::current($request);

                return [
                    'current' => $current === null ? null : Tenants::toArray($current),
                    'available' => array_map(Tenants::toArray(...), Tenants::forUser($request)),
                    'switchUrl' => $switchUrl,
                    'manageUrl' => Route::has($panel->getRouteName().'settings.workspaces')
                        ? route($panel->getRouteName().'settings.workspaces')
                        : null,
                ];
            },

            /*
             * WHO IS REALLY DRIVING, when it is not the account on screen.
             *
             * NULL IN THE ORDINARY CASE, so the banner costs one key and no
             * query on every request that is not an impersonation.
             *
             * `Impersonation` HAS BEEN IN THE PACKAGE SINCE v0.2 and nothing
             * packaged ever displayed it - so an installation could switch into
             * somebody's account with no indication anywhere that it had. The
             * reference app wrote its own banner, which is the pattern this
             * release keeps undoing.
             *
             * THE STOP URL IS RESOLVED THE WAY SIGN-OUT IS, and is null when no
             * route answers. The banner still shows in that case: forgetting you
             * are wearing another account is the danger, and a warning with no
             * button is better than no warning.
             */
            /*
             * SOCIAL SIGN-IN PROVIDERS for auth screens and the landing page.
             *
             * Resolved once per request from `Panel::socialite()` and `.env`
             * credentials. Empty when socialite is off, Socialite is missing,
             * or no provider is offered. Auth pages read this through
             * `SocialLoginButtons` rather than each controller rebuilding the
             * list.
             */
            'socialProviders' => $chrome(static function () use ($panels): array {
                return SocialLoginPayload::forPanel($panels->currentPanel());
            }, 'socialProviders'),

            'impersonating' => static function () use ($panels, $request): ?array {
                /*
                 * NO SESSION MEANS NO IMPERSONATION, checked before asking.
                 *
                 * Impersonation is a session fact, and `isActive()` reaches
                 * straight for the store - so on any route that shares these
                 * props without `web` middleware this closure threw "Session
                 * store not set on request" rather than answering "nobody". The
                 * test harness found it first, which is the cheap place to.
                 */
                if (! $request->hasSession()) {
                    return null;
                }

                /*
                 * BUILT FROM *THIS* REQUEST, not resolved from the container.
                 *
                 * `Impersonation` takes a `Request` in its constructor, and the
                 * container hands it whatever instance is bound as `request` at
                 * the moment of resolution - which is not necessarily the one
                 * this middleware is guarding. The guard above then passed while
                 * the object read a DIFFERENT request that had no session, and
                 * every panel whose group omits `StartSession` answered 500.
                 * Three isolation tests caught it; the guard alone did not.
                 */
                $impersonation = new Impersonation($request);

                if (! $impersonation->isActive()) {
                    return null;
                }

                $panel = $panels->currentPanel();

                return [
                    'name' => $impersonation->impersonator()?->name ?? 'Somebody',
                    'stopUrl' => match (true) {
                        $panel !== null && Route::has($panel->id.'.impersonate.stop') => route($panel->id.'.impersonate.stop'),
                        Route::has('impersonate.stop') => route('impersonate.stop'),
                        default => null,
                    },
                ];
            },
        ]);

        return $next($request);
    }

    /**
     * Stable chrome: resolve once per person / tenant / panel / locale.
     *
     * When `UsePanel` has not run yet the panel is null and we return a plain
     * closure so auth and other early shares still work. After the panel is
     * known, `Inertia::once` skips resolve and wire on later visits while the
     * client still holds the first payload.
     *
     * @param  callable(): mixed  $resolve
     */
    private static function chrome(callable $resolve, Request $request, PanelManager $panels, string $name): mixed
    {
        $panel = $panels->currentPanel();

        if ($panel === null) {
            return $resolve;
        }

        $user = $request->user($panel->getGuard());
        $tenant = Tenants::current($request);
        $tenantKey = $tenant === null ? 'central' : (string) $tenant->getKey();

        return Inertia::once($resolve)->as(implode(':', [
            $name,
            $panel->id,
            (string) ($user?->getAuthIdentifier() ?? 'guest'),
            $tenantKey,
            app()->getLocale(),
        ]));
    }

    /**
     * Ported from Inertia's own `Middleware::resolveValidationErrors()` - the
     * client-side contract (a flat `{field: message}` object, or `{bag: {...}}`
     * when a named error bag is requested) is Inertia's, not this package's, so
     * it has to match exactly rather than take the shape this file would
     * otherwise choose.
     */
    private static function validationErrors(Request $request): object
    {
        if (! $request->hasSession() || ! $request->session()->has('errors')) {
            return (object) [];
        }

        /** @var \Illuminate\Support\ViewErrorBag $viewErrorBag */
        $viewErrorBag = $request->session()->get('errors');

        $bags = [];

        foreach ($viewErrorBag->getBags() as $name => $bag) {
            $messages = [];

            foreach ($bag->getMessages() as $field => $fieldMessages) {
                $messages[$field] = $fieldMessages[0];
            }

            $bags[$name] = (object) $messages;
        }

        if (isset($bags['default']) && $request->header('X-Inertia-Error-Bag')) {
            return (object) [(string) $request->header('X-Inertia-Error-Bag') => $bags['default']];
        }

        if (isset($bags['default'])) {
            return $bags['default'];
        }

        return (object) $bags;
    }

    /**
     * Sidebar layout for shared `panel` props.
     *
     * Preview routes set `forceSidebarLayout` on the request so the shared
     * payload matches `forceSidebarLayout` page props without calling
     * `Panel::sidebarLayout()` on the registered singleton (which would stick
     * for the rest of the worker).
     */
    private static function previewSidebarLayout(Panel $panel): string
    {
        $forced = request()->attributes->get('forceSidebarLayout');

        if (is_string($forced) && in_array($forced, Panel::sidebarLayouts(), true)) {
            return $forced;
        }

        return $panel->getSidebarLayout();
    }

    /**
     * First matching named route, panel-prefixed then (for the default panel)
     * the application's own names.
     *
     * THE REFERENCE APP CLAIMS `/settings/profile` as `profile.edit`, so the
     * packaged `panel.settings.profile` is never registered. Looking only at
     * the prefixed name left Profile out of the account menu on every screen
     * that actually received these props.
     *
     * @param  list<string>  $suffixes
     * @param  list<string>  $defaultFallbacks
     */
    private static function namedUrl(\Alxtexh\Panel\Panel $panel, array $suffixes, array $defaultFallbacks = []): ?string
    {
        foreach ($suffixes as $suffix) {
            $name = $panel->getRouteName().$suffix;

            if (Route::has($name)) {
                return route($name);
            }
        }

        if ($panel->id !== (string) config('panel.default', 'admin')) {
            return null;
        }

        foreach ($defaultFallbacks as $name) {
            if (Route::has($name)) {
                return route($name);
            }
        }

        return null;
    }

}
