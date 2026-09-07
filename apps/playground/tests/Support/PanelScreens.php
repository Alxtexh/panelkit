<?php

declare(strict_types=1);

namespace Tests\Support;

use Alxtexh\Panel\PanelManager;
use Illuminate\Support\Facades\Route;

/**
 * Every screen in the application, derived from the router.
 *
 * ONE LIST, READ BY TWO TESTS, and the reason is that they ask different
 * questions about the same set:
 *
 *   - `EveryScreenRespondsTest` (fast, server-side) asks DOES IT ANSWER. It
 *     catches a route that 404s or 500s, which is how a link to a page nobody
 *     had ever clicked survived in this repository for months.
 *   - `EveryScreenRendersTest` (slow, a real browser) asks DID IT DRAW. It
 *     catches a screen that answers 200 with a component that renders nothing,
 *     which no server-side assertion can see.
 *
 * Neither subsumes the other. A blank page is a 200; a 404 renders plenty of
 * text. Keeping the list here means a screen cannot be covered by one and
 * missed by the other, which is precisely what would happen to two hand-copied
 * arrays within about a month.
 *
 * DERIVED, NOT TYPED OUT. A hand-written list covers what somebody remembered
 * on the day they wrote it. The browser suite used to name fifteen URLs while
 * the application had more than fifty screens, and every defect found in the
 * last four sessions lived in the difference. Reading the router means a new
 * screen is covered the moment it is routed, and the only way out is an
 * explicit entry below with a reason attached.
 */
final class PanelScreens
{
    /**
     * Routed URIs that are not screens, each with the reason it is not one.
     *
     * EVERY ENTRY IS A LIABILITY. This is the only way for a URL to escape
     * both tests, so anything here should be genuinely not a screen - not
     * merely awkward to open. A URL that is hard to open in a browser is
     * usually a URL that is hard to open.
     *
     * @var list<string>
     */
    public const NOT_SCREENS = [
        // Health, auth ceremony and machine endpoints: these answer JSON or a
        // challenge and have no markup to draw.
        '/up',
        '/broadcasting/auth',
        '/panel-search',
        '/platform/panel-search',
        '/reseller/panel-search',
        '/.well-known/passkey-endpoints',
        '/passkeys/login/options',
        '/passkeys/confirm/options',
        '/user/passkeys/options',
        '/user/confirmed-password-status',
        '/user/two-factor-qr-code',
        '/user/two-factor-recovery-codes',
        '/user/two-factor-secret-key',
        '/auth/magic-link/consume',
        '/apps/assistant/conversations',
        '/operations/monitoring/metrics',
        '/notifications',
        '/platform/notifications',
        '/reseller/notifications',

        // `TicketStatsController` returns a `JsonResponse` - the numbers behind
        // the cards on `/tickets/analysis`, which IS a screen and is covered.
        '/tickets/stats',

        // Files and documents, served as a download or as JSON.
        '/docs/blueprint.md',
        '/docs/guide.md',
        '/docs/llms.txt',
        '/docs/openapi.json',
        '/about/building/search',
        '/settings/organisation/logo',
        '/operations/backups/download',

        /*
         * SETUP-WIZARD ROUTES, ON EVERY PANEL THAT DOES NOT OFFER ONE. They
         * register unconditionally - `RedirectToSetupWizard`'s own docblock
         * explains why: the same shape as onboarding's dismiss/reset routes,
         * evaluated live inside the controller rather than baked into route
         * registration. Only `AdminPanelProvider` calls `Panel::
         * setupWizard()` in this demo, so these four panels' own copies 404
         * on purpose - not a broken link, a feature this portal never opted
         * into.
         */
        '/client/setup-wizard',
        '/client/setup-wizard/complete',
        '/platform/setup-wizard',
        '/platform/setup-wizard/complete',
        '/reseller/setup-wizard',
        '/reseller/setup-wizard/complete',
        '/superadmin/setup-wizard',
        '/superadmin/setup-wizard/complete',
    ];

    /**
     * Screens that only exist for a SIGNED-OUT visitor.
     *
     * Both tests sign in, and an authenticated visit to any of these redirects
     * to the dashboard - so including them would assert something true about a
     * redirect rather than anything about the screen.
     *
     * `PackagedLoginRenderTest` opens them properly, as a guest, which is the
     * only context in which they mean anything.
     *
     * @var list<string>
     */
    public const GUEST_ONLY = [
        '/login',
        '/register',
        '/forgot-password',
        '/two-factor-challenge',
        '/email/verify',
        '/user/confirm-password',
        '/password/change',
    ];

    /**
     * Every parameterless GET screen an authenticated operator can open.
     *
     * @return list<string>
     */
    public static function all(): array
    {
        $screens = [];
        $manager = app(PanelManager::class);

        foreach (Route::getRoutes() as $route) {
            if (! in_array('GET', $route->methods(), true)) {
                continue;
            }

            $uri = '/'.ltrim($route->uri(), '/');

            /*
             * A route with a parameter needs a value chosen for it. RECORD
             * pages are somebody else's job - `PackagedScreensRenderTest` and
             * `MoneyAndPermissionsRenderTest` pick a record and open it - but
             * the resource LISTS are filled in below from the registry, because
             * they are the most-used screens in the panel and the router cannot
             * enumerate them.
             */
            if (str_contains($uri, '{')) {
                continue;
            }

            /*
             * GENERATED PANEL ROUTES ARE REMOVED FROM DISK, NOT FROM
             * Laravel's already-built route collection. A generator test can
             * therefore leave a route whose `panel` default names a provider
             * that has already been unregistered. Treating that orphan as a
             * real screen makes a later test request a 404 and makes the
             * parallel suite depend on file order. Only routes belonging to a
             * currently registered panel are part of this inventory.
             *
             * Routes without a panel default are application-owned routes and
             * remain eligible for coverage as before.
             */
            $panelId = $route->defaults['panel'] ?? null;

            if (is_string($panelId) && $manager->panel($panelId) === null) {
                continue;
            }

            if (str_starts_with($uri, '/api/') || str_contains($uri, '_debugbar') || str_contains($uri, 'sanctum')) {
                continue;
            }

            if (in_array($uri, self::NOT_SCREENS, true) || in_array($uri, self::GUEST_ONLY, true)) {
                continue;
            }

            $screens[$uri] = true;
        }

        /*
         * THE RESOURCE LISTS, WHICH THE ROUTER CANNOT NAME.
         *
         * Every resource is served by ONE route - `/{resource}` - so
         * enumerating the router finds a single parameterised entry and none of
         * the twelve screens behind it. Those twelve are the panel: the lists an
         * operator spends the day in, and the screens every table, filter,
         * column and bulk action actually appear on.
         *
         * EACH ONE IS PREFIXED WITH ITS OWN PANEL'S PATH. This application
         * mounts three panels - admin at the root, `platform` and `reseller`
         * under their own prefixes - and the registry returns all of their
         * resources together. Assuming the root gave four 404s on the first
         * run: `/tenants` is a platform screen and only exists at
         * `/platform/tenants`.
         *
         * `Resource::panel()` and `Panel::getPath()` are the same pair the
         * router itself uses to mount them, so this cannot disagree with where
         * the screen really is.
         *
         * `/clients/create` is left out on purpose - a create form is a
         * different shape with different failure modes, and
         * `PackagedScreensRenderTest` opens one properly.
         */
        foreach ($manager->resources() as $slug => $class) {
            /*
             * A NESTED RESOURCE HAS NO TOP-LEVEL URL, and asserting one exists
             * is asserting the opposite of its design. `ClientSessionResource`
             * answers at `/clients/{id}/sessions` and nowhere else - a bare
             * `/sessions` is a 404 on purpose, because a session without the
             * client it belongs to is a list of rows from every client at once.
             *
             * Its screen is reached through the parent's record page, which is
             * a record-page test rather than this one.
             */
            if ($class::parentResource() !== null) {
                continue;
            }

            $path = trim($manager->panel($class::panel())?->getPath() ?? '', '/');

            $screens['/'.ltrim($path.'/'.$slug, '/')] = true;
        }

        $screens = array_keys($screens);
        sort($screens);

        return $screens;
    }
}
