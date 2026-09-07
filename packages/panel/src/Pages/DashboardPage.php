<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Pages;

use DateTimeImmutable;
use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Alxtexh\Panel\Alerts\Announcement;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\Ability;
use Alxtexh\Panel\Support\DashboardLayout;
use Alxtexh\Panel\Support\OnboardingSteps;
use Alxtexh\Panel\Support\SetupChecklist;
use Alxtexh\Panel\Support\TenantContext;
use Alxtexh\Panel\Widgets\ChartWidget;
use Alxtexh\Panel\Widgets\DashboardFilters;
use Alxtexh\Panel\Widgets\Period;
use Alxtexh\Panel\Widgets\StatWidget;
use Alxtexh\Panel\Widgets\TableWidget;

/**
 * The host `StatWidget` and `ChartWidget` never had.
 *
 * NINE WIDGET CLASSES SHIPPED WITH NOWHERE TO RENDER. They shape data correctly
 * and nothing mounted them: the package routed no dashboard and had no
 * mechanism for a screen that was not a resource, so `StatWidget::make()`
 * composed a value object that would never reach a browser. `Workspace`, the
 * intended host, was referenced exactly once in the whole package - inside a
 * comment.
 *
 * The catalogue in `panel:blueprint` listed all nine as things to build with,
 * which is how the gap got noticed: an agent could have written a dashboard that
 * was clean, tested and invisible.
 *
 * DECLARE THE WIDGETS, GET THE SCREEN. A subclass says which stats and which
 * charts; routing, the navigation entry, the ability, the per-widget permission
 * filtering and the deferred resolution all follow.
 *
 * EVERY WIDGET RESOLVES IN ITS OWN DEFERRED PROP, in its own group. The page
 * arrives immediately with its labels and layout, and each number lands when its
 * query finishes - so one slow aggregate delays itself rather than the screen,
 * and a widget whose query fails reports itself instead of blanking the rest.
 * Resolving them eagerly in one batch would make the dashboard as slow as its
 * worst query, which on real data is the difference between a screen people
 * open and one they avoid.
 *
 * PERMISSIONS ARE APPLIED BEFORE RESOLUTION, not in the browser. A widget the
 * signed-in operator may not see is never queried and never serialised: hiding
 * it client-side would ship the number to somebody forbidden from it and rely on
 * CSS to keep the secret.
 */
abstract class DashboardPage extends Page
{
    /*
     * 'home', NOT 'layout-dashboard' - the latter has no entry in
     * `panelIcons.ts`'s PANEL_ICONS map, so it silently fell back to a
     * generic package/box glyph in the sidebar. 'home' is already mapped
     * (Lucide's House) and matches Filament's own default dashboard icon.
     */
    protected static string $icon = 'home';

    /**
     * NO ABILITY OF ITS OWN, unlike every other page.
     *
     * `Page::ability()` derives `view_dashboard` from the slug, and for a
     * dashboard that is the wrong default twice over. A FRESH INSTALLATION has
     * no permissions defined at all, so the screen sign-in lands on would 403 -
     * the panel would look broken to everybody on the first run. And the real
     * gating here is PER WIDGET: `->ability()` on each stat and chart, which is
     * how somebody can hold the network figures without the commercial ones. An
     * all-or-nothing gate in front of them makes that distinction unreachable.
     *
     * The panel's own auth middleware still applies; this is not a public page.
     * Override it if a dashboard should be narrower than the panel.
     */
    public static function ability(): ?string
    {
        return null;
    }

    /**
     * The filter dimensions this dashboard offers, beside the date range.
     *
     * DECLARED, BECAUSE THE PACKAGE HAS NO OPINION ON WHAT YOU FILTER BY. The
     * reference application filters by router, and for a while `routers` was a
     * property on the packaged filter object - so every panel installed from
     * this package carried an ISP's vocabulary in a base class it could not use
     * or remove.
     *
     * OPTIONS RIDE WITH THE PAGE rather than needing a second request, which is
     * why this returns them rather than an endpoint: these lists are small and
     * tenant-scoped. A dimension with thousands of members does not belong in a
     * multiselect anyway.
     *
     * @return list<array{key: string, label: string, singular?: string|null, placeholder?: string|null, options: list<array{value: int, label: string}>}>
     */
    public static function filterDimensions(): array
    {
        return [];
    }

    /**
     * Dashboard shortcut catalog. Empty means the widget is not drawn.
     *
     * OPT-IN. A POS names till and catalog; a rental names units and leases.
     * `catalog` is the picker; `defaults` are ids shown before the operator
     * edits; `storageKey` is localStorage unless you persist another way.
     *
     * @return array{catalog?: list<array{id: string, label: string, href: string, icon: string}>, defaults?: list<string>, storageKey?: string|null}
     */
    public static function shortcuts(): array
    {
        return [];
    }

    /**
     * The strip of windows above the widgets - today, the week, the month.
     *
     * NULL MEANS NO STRIP, and the prop is then absent rather than empty: the
     * screen keys its skeleton off the prop's PRESENCE, so an empty array would
     * leave somebody watching a placeholder that was never going to fill.
     *
     * @return (callable(DashboardFilters, DateTimeImmutable, string): list<array<string, mixed>>)|null
     */
    public static function strip(): ?callable
    {
        return null;
    }

    /**
     * The ability required to see the strip, or null for everybody.
     *
     * IT NEEDS ITS OWN GATE. The strip is four aggregates over the same data the
     * widgets show, so a dashboard split by permission that left this ungated
     * would put the numbers back on the wire for exactly the person the split
     * was made for.
     */
    public static function stripAbility(): ?string
    {
        return null;
    }

    /**
     * MORE THAN ONE STRIP, when one is not enough.
     *
     * BOTH FORMS EXIST ON PURPOSE, and neither replaces the other. `strip()`
     * is the single row above the widgets and is what almost every dashboard
     * wants; this is for the dashboard that needs a SECOND set of windows over
     * different figures - sessions across four periods AND revenue across the
     * same four, which is two rows of four rather than one row of eight.
     *
     * KEYED, BECAUSE EACH GETS ITS OWN DEFERRED PROP. The key becomes
     * `strip_{key}` and its own group, so one slow strip does not gate the
     * other - and a partial reload can refresh one without the rest.
     *
     * EACH CARRIES ITS OWN ABILITY through `stripsAbility()`, because two
     * strips on one screen are usually two different sensitivities: that is
     * most of why somebody wants a second one rather than more segments.
     *
     * PER-SEGMENT `sensitive` STILL APPLIES INSIDE EACH. The two mechanisms
     * compose - a strip is which FIGURES belong together, `sensitive` is which
     * of them are covered - and asking somebody to choose between them would
     * be asking the wrong question.
     *
     * @return array<string, array{label?: string, ability?: string, resolve: callable}>
     */
    public static function strips(): array
    {
        return [];
    }

    /**
     * The ability required to see the installation's setup checklist.
     *
     * SAME GATE AS MONITORING, deliberately. The card surfaces `panel:doctor`
     * findings - a resource with no policy, an inert broadcast channel - which
     * is installation-health detail, not something every tenant user should see
     * about the installation they happen to be signed in to.
     */
    public static function checklistAbility(): ?string
    {
        return 'view_operations';
    }

    /**
     * The filters this request is under.
     *
     * READ BY `stats()` AND `charts()`, which take no arguments - so a widget
     * closure reads the filter here rather than having it passed in. That keeps
     * the signature a subclass overrides identical to the one it has always
     * been, and there is still only ONE filter object per request: every widget
     * closes over the same instance, so a chart cannot quietly ignore it.
     *
     * MEMOISED ON THE REQUEST ITSELF, not in a static and not on the container.
     * Both outlive the request - a static under Octane, a container binding
     * across two calls in one test - and the failure is the worst shape there
     * is: the SECOND request gets the FIRST one's filter, so an unfiltered
     * dashboard silently answers with somebody else's narrowed numbers. That is
     * not hypothetical; it is what this returned before, and the test that
     * filters twice in one case is what caught it.
     */
    public static function filters(): DashboardFilters
    {
        $request = request();
        $key = 'alxtexhpanel.dashboard_filters.'.static::class;

        if (! $request->attributes->has($key)) {
            $request->attributes->set($key, DashboardFilters::fromRequest(
                $request,
                new DateTimeImmutable,
                array_column(static::filterDimensions(), 'key'),
            ));
        }

        return $request->attributes->get($key);
    }

    /**
     * The counters across the top.
     *
     * @return list<StatWidget>
     */
    public static function stats(): array
    {
        return [];
    }

    /**
     * The charts below them (includes MapWidget / CalendarWidget via unwrap).
     *
     * @return list<ChartWidget|\Alxtexh\Panel\Widgets\MapWidget|\Alxtexh\Panel\Widgets\CalendarWidget>
     */
    public static function charts(): array
    {
        return [];
    }

    /**
     * Capped resource lists below the charts.
     *
     * EMPTY BY DEFAULT, like stats() and charts(). A fresh install stays an
     * empty canvas. discoverWidgets() is the normal way these appear; this
     * method is for a dashboard that wants a specific table on this page.
     *
     * @return list<TableWidget>
     */
    public static function tables(): array
    {
        return [];
    }

    /**
     * Optional contextual guidance shown in the shell's right-side info panel.
     *
     * The content is server-provided so it can describe the current panel,
     * tenant, permissions, or workflow without putting sensitive detail in a
     * client-only registry.
     *
     * @return array{title: string, description?: string|null, sections?: list<array{heading: string, body: string}>}|null
     */
    public static function infoPanel(): ?array
    {
        return null;
    }

    /**
     * The packaged screen that draws them.
     *
     * OVERRIDABLE, because a dashboard is the screen most likely to want its own
     * arrangement. Point it at your own component and the declarations, the
     * filtering and the deferred props still apply - what changes is the layout.
     */
    public static function component(): string
    {
        return 'PanelDashboard';
    }

    /**
     * Dashboard visual family. The widget contract stays identical across
     * skins, so applications can change the composition without rewriting
     * their PHP widget declarations.
     *
     * @return list<string>
     */
    public static function designs(): array
    {
        return ['operations', 'analytics', 'commerce', 'minimal', 'executive'];
    }

    public static function design(): string
    {
        $configured = (string) config('panel.dashboard.design', 'operations');

        return in_array($configured, static::designs(), true) ? $configured : 'operations';
    }

    /**
     * @return array<string, mixed>
     */
    public static function data(Request $request): array
    {
        $user = $request->user();

        /*
         * THE FILTERS ARE BUILT BEFORE ANY WIDGET, and once. Every widget
         * closure reads the same instance through `static::filters()`, so there
         * is no second place a range or a selection could be read and forgotten.
         */
        $filters = static::filters();
        $now = new DateTimeImmutable;

        /*
         * FILTERED BEFORE ANYTHING ELSE HAPPENS TO THEM.
         *
         * A widget the operator may not see is not hidden, not blanked, not
         * sent-and-not-drawn - it is dropped here, before its deferred prop is
         * registered. That is the only version that is actually a permission:
         * anything decided in the browser leaves the number in the page payload
         * for whoever opens the network tab, and runs the query anyway.
         */
        /*
         * WHAT THE PAGE DECLARES, PLUS WHAT THE PANEL REGISTERED.
         *
         * `Panel::widgets()` exists because overriding `stats()` was the only
         * way to add one, and a static method on a page class is not something
         * a PACKAGE can extend - it cannot subclass a page the application has
         * not written. Concatenating rather than replacing is what lets an
         * application keep its own dashboard while a plugin adds to it.
         */
        $registered = app(PanelManager::class)->currentPanel()?->getWidgets() ?? [];

        $unwrapChart = static function (mixed $w): ?ChartWidget {
            if ($w instanceof ChartWidget) {
                return $w;
            }

            if ($w instanceof \Alxtexh\Panel\Widgets\MapWidget
                || $w instanceof \Alxtexh\Panel\Widgets\CalendarWidget
                || $w instanceof \Alxtexh\Panel\Widgets\BarcodeWidget
                || $w instanceof \Alxtexh\Panel\Widgets\LogTailWidget) {
                return $w->toChartWidget();
            }

            return null;
        };

        $stats = array_values(array_filter(
            [...static::stats(), ...array_filter($registered, static fn ($w): bool => $w instanceof StatWidget)],
            static fn (StatWidget $w): bool => $w->visibleTo($user),
        ));

        $chartSources = array_values(array_filter(array_map(
            $unwrapChart,
            [...static::charts(), ...$registered],
        )));

        $charts = array_values(array_filter(
            $chartSources,
            static fn (ChartWidget $c): bool => $c->visibleTo($user),
        ));

        $tables = array_values(array_filter(
            [...static::tables(), ...array_filter($registered, static fn ($w): bool => $w instanceof TableWidget)],
            static fn (TableWidget $w): bool => $w->visibleTo($user),
        ));

        $props = [
            // The DECLARATIONS travel with the page: labels, spans and
            // descriptions are what lets the layout render before any number
            // has been counted.
            'widgets' => array_map(static fn (StatWidget $w): array => $w->toArray(), $stats),
            'charts' => array_map(static fn (ChartWidget $c): array => $c->toArray(), $charts),
            'tables' => array_map(static fn (TableWidget $t): array => $t->toArray(), $tables),
            'infoPanel' => static::infoPanel(),

            /*
             * ECHOED BACK rather than left to the client, so a shared or
             * bookmarked URL renders with each selector highlighting the window
             * it is actually showing.
             */
            'periods' => self::selectedPeriods($request, $charts),
            'filters' => $filters->toArray(),
            'filterDimensions' => static::filterDimensions(),
            'heading' => static::label(),
            'design' => static::design(),

            /*
             * THE NOTICES, WHICH ARE THE REASON ANNOUNCEMENTS WORK AT ALL.
             *
             * The package shipped the model, the delivery, the dismissal and -
             * as of this release - the screen that composes one, and had
             * nowhere any of it was READ. The banner lived in the reference
             * app's own dashboard, so every other installation could write an
             * announcement that appeared to nobody.
             *
             * NOT DEFERRED, unlike every widget below. A banner that arrives
             * after the numbers is a banner that pushes the page down under
             * somebody's cursor, and this is one cheap indexed query rather
             * than an aggregate.
             *
             * The prefix travels with them because the dismiss route is mounted
             * inside the panel's group; see the component.
             */
            'announcements' => $user === null ? [] : array_values(
                Announcement::activeFor($user->getAuthIdentifier())
                    ->map(static fn (Announcement $a): array => $a->toBanner($user))
                    ->all(),
            ),
            'prefix' => rtrim((string) app(PanelManager::class)->panel(static::panel())?->getPath(), '/'),
            'userDashboards' => (bool) (app(PanelManager::class)->panel(static::panel())?->hasUserDashboards()),
            'dashboardLayout' => self::dashboardLayoutFor($user),
        ];

        $shortcuts = static::shortcuts();

        if (($shortcuts['catalog'] ?? []) !== []) {
            $props['shortcuts'] = [
                'catalog' => $shortcuts['catalog'],
                'defaults' => $shortcuts['defaults'] ?? [],
                'storageKey' => $shortcuts['storageKey'] ?? 'panel.dashboard.shortcuts',
            ];
        }

        $tenantKey = (string) (app(TenantContext::class)->currentKey() ?? '');
        $now = new DateTimeImmutable;

        $tenantKey = (string) (app(TenantContext::class)->currentKey() ?? '');

        /*
         * ONE DEFERRED PROP FOR THE WHOLE STRIP: four numbers from four cheap
         * reads is a single round trip, not four.
         */
        $strip = static::strip();

        if ($strip !== null && self::allows($user, static::stripAbility())) {
            $props['strip'] = Inertia::defer(
                static fn (): array => $strip($filters, $now, $tenantKey),
                'strip',
            );
        }

        /*
         * ADDITIONAL STRIPS - see `strips()`. Empty for almost every
         * dashboard, and contributing no props at all when it is, so a page
         * that declares none is byte-identical to before.
         *
         * ITS OWN GROUP EACH, so one slow strip does not gate another and a
         * partial reload can refresh one alone. That is the opposite call from
         * the stat widgets, which share a group because they are one row of
         * cheap counts; these are separate rows over different figures.
         *
         * THE DECLARATIONS TRAVEL EAGERLY so each row can draw its labels
         * before any number has been counted, exactly as the first strip does.
         */
        $extra = [];

        foreach (static::strips() as $key => $definition) {
            if (! self::allows($user, $definition['ability'] ?? null)) {
                continue;
            }

            $resolve = $definition['resolve'];

            $extra[] = ['key' => $key, 'label' => $definition['label'] ?? null];

            $props['strip_'.$key] = Inertia::defer(
                static fn (): array => $resolve($filters, $now, $tenantKey),
                'strip-'.$key,
            );
        }

        if ($extra !== []) {
            $props['strips'] = $extra;
        }

        /*
         * FIRST-RUN GUIDE, eager, not ops-gated. An empty dashboard after
         * install still looks guided: ordered chrome steps with a button to
         * the real page. Dismiss or complete persists per person so the next
         * login does not reopen it.
         *
         * DOCTOR FINDINGS WAIT. Both cards use SetupChecklist, so showing the
         * guide and the ops checklist together reads as one feature twice.
         * While the guide is open, skip `checklist`; after dismiss or
         * completion, operators with view_operations see doctor findings only.
         */
        $guide = $user !== null ? OnboardingSteps::dashboardItems($request) : [];

        if ($guide !== []) {
            $panel = app(PanelManager::class)->panel(static::panel())
                ?? app(PanelManager::class)->currentPanel();
            $dismissName = $panel !== null ? $panel->getRouteName().'onboarding.dismiss' : '';

            $props['onboarding'] = $guide;
            $props['onboardingDismiss'] = $dismissName !== '' && \Illuminate\Support\Facades\Route::has($dismissName)
                ? route($dismissName)
                : null;
        } elseif ($user !== null && self::allows($user, static::checklistAbility())) {
            $props['checklist'] = Inertia::defer(
                static fn (): array => app(SetupChecklist::class)->items(),
                'checklist',
            );
        }

        /*
         * ONE GROUP FOR EVERY STAT, NOT ONE GROUP EACH.
         *
         * INERTIA FETCHES DEFERRED PROPS ONE REQUEST PER GROUP. Passing
         * `$widget->key` made every widget its own group, so a dashboard with
         * seven stats and a dozen charts opened with ~20 HTTP requests on
         * first paint - each with its own middleware stack, session read,
         * tenant resolution and permission load, to return a single number.
         * The queries were never the cost; the round trips were.
         *
         * THE TRADE IS REAL AND WORTH NAMING. A group is all-or-nothing: one
         * widget that throws takes its whole group's payload with it, where
         * per-widget groups would have lost only that tile. Stats are cheap
         * aggregate reads of similar cost, so batching them trades a failure
         * mode that shows up as "the numbers are missing" - visible, and no
         * worse than one number missing - for six fewer round trips.
         *
         * CHARTS STAY SEPARATE FROM STATS for the opposite reason: they are
         * slower and their costs differ, so folding them in here would make
         * the numbers wait for the heaviest chart.
         */
        foreach ($stats as $widget) {
            $props["stat_{$widget->key}"] = Inertia::defer(
                static fn (): array => $widget->resolve($tenantKey),
                'stats',
            );
        }

        $hiddenChartKeys = array_flip(self::hiddenWidgetKeys($request));

        foreach ($charts as $chart) {
            /*
             * HIDDEN CHARTS STAY IN `charts` (labels for restore) BUT ARE NOT
             * DEFERRED. Inertia loads every key in the `charts` group on visit,
             * whether Vue mounts `<Deferred>` or not. Skipping the prop is what
             * actually skips the query. The client mirrors ids in the
             * `panel_dashboard_hidden` cookie (unencrypted, like sidebar_state).
             */
            if (isset($hiddenChartKeys[$chart->key])) {
                continue;
            }

            /*
             * THE PERIOD IS PER CHART AND COMES FROM THE QUERY STRING, so
             * changing one chart's window is a partial reload of that chart
             * rather than of the page. `Period::fromRequest` rejects anything
             * it does not recognise instead of trusting the parameter.
             */
            $period = Period::fromRequest($request->query("period_{$chart->key}"));

            /*
             * CHARTS SHARE A GROUP TOO - see the stats loop above for why one
             * group per widget was the wrong default.
             *
             * THE PER-CHART PERIOD STILL WORKS, which is the thing that looks
             * like it should break. A period change is
             * `router.reload({only: ['chart_status']})`, and `only` names the
             * PROP, not the group; groups decide only how the FIRST fetch is
             * batched. So one chart's window still reloads one chart.
             */
            $props["chart_{$chart->key}"] = Inertia::defer(
                static fn (): array => $chart->resolve($period, $tenantKey, $now),
                'charts',
            );
        }

        foreach ($tables as $table) {
            $props["table_{$table->key}"] = Inertia::defer(
                static fn (): array => $table->resolve(),
                'tables',
            );
        }

        return $props;
    }

    /**
     * Chart keys the browser asked not to compute.
     *
     * @return list<string>
     */
    private static function hiddenWidgetKeys(Request $request): array
    {
        $raw = $request->cookie('panel_dashboard_hidden');

        if (! is_string($raw) || $raw === '') {
            $query = $request->query('hidden_widgets');
            $raw = is_string($query) ? $query : '';
        }

        if ($raw === '') {
            return [];
        }

        $decoded = json_decode($raw, true);

        if (! is_array($decoded)) {
            $decoded = explode(',', $raw);
        }

        $keys = [];

        foreach ($decoded as $key) {
            if (! is_string($key) || $key === '' || ! preg_match('/^[a-z0-9_-]+$/i', $key)) {
                continue;
            }

            $keys[] = $key;
        }

        return array_values(array_unique($keys));
    }

    /**
     * Per-user widget layout when `Panel::userDashboards()` is on.
     *
     * @return array{widgets: list<array{id: string, span: int, hidden: bool}>}|null
     */
    private static function dashboardLayoutFor(mixed $user): ?array
    {
        $panel = app(PanelManager::class)->panel(static::panel());

        if ($panel === null || ! $panel->hasUserDashboards() || $user === null) {
            return null;
        }

        $appearance = is_array($user->appearance ?? null) ? $user->appearance : [];

        return DashboardLayout::normalize($appearance['dashboardLayout'] ?? null);
    }

    /**
     * The period currently selected for each chart.
     *
     * @param  list<ChartWidget>  $charts
     * @return array<string, string>
     */
    private static function selectedPeriods(Request $request, array $charts): array
    {
        $out = [];

        foreach ($charts as $chart) {
            $out[$chart->key] = Period::fromRequest($request->query("period_{$chart->key}"))->value;
        }

        return $out;
    }

    /**
     * A null ability means everybody, which is not the same as `can(null)`.
     *
     * A guest reaching a dashboard with no gate declared must still see it - a
     * generated portal's home before any permission exists is exactly that case
     * - so the absence of an ability is answered here rather than handed to the
     * authorisation layer, which would refuse it.
     */
    private static function allows(mixed $user, ?string $ability): bool
    {
        if ($ability === null) {
            return true;
        }

        return $user instanceof Authenticatable
            && $user instanceof Authorizable
            && Ability::held($user, $ability);
    }
}
