<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Alxtexh\Panel\PanelManager;

/**
 * One screen listing the settings screens, so somebody can find them.
 *
 * IT USED TO BE `Route::redirect('settings', 'settings/profile')`, which is the
 * shape that looks harmless and answers the wrong question: somebody typing
 * "settings" is asking what there is, and a redirect tells them there is exactly
 * one thing and it is their own name.
 *
 * EVERY ENTRY IS DERIVED FROM A ROUTE THAT EXISTS. The list is not declared and
 * then hoped for - each candidate is included only if `Route::has` says the
 * current panel registered it. That is what makes it correct across panels that
 * dropped screens with `->without()`, across an application that kept its own
 * `/settings/profile` so the packaged one never registered, and across a
 * single-tenant installation with no organisation screens at all.
 *
 * OMITTED, NOT DISABLED, when somebody may not open it. A greyed-out row tells
 * an operator that a thing exists which they cannot have, which is information
 * they can do nothing with and a question for whoever they ask about it.
 *
 * APPLICATIONS ADD THEIR OWN with `add()`. The reference application's assistant
 * settings arrive that way; the package has no business knowing about them.
 */
final class SettingsIndex
{
    private const KEY = 'alxtexhpanel.settings-index';

    /**
     * Add entries of your own.
     *
     * Each is `['key', 'title', 'description', 'href']`, and optionally
     * `'ability'` - a permission name, checked the same way the packaged ones
     * are, so an entry nobody may open is simply absent.
     *
     * `href` MAY BE A CLOSURE, and usually should be. Applications register
     * these from a service provider's `boot`, which runs BEFORE routes are
     * registered - so calling `route()` eagerly throws `Route [...] not
     * defined` from a provider, which reads as the route being missing rather
     * than as it being asked for too early. A closure is resolved when the
     * screen is rendered, by which time everything is registered.
     *
     * `order` PLACES AN ENTRY AMONG THE PACKAGED ONES rather than after them.
     * An application that kept its own `/settings/profile` - so the packaged
     * route never registered - has to supply that row itself, and appending it
     * would list somebody's own name below the organisation's logo. Omit it and
     * the entry lands at the end, which is right for anything genuinely extra.
     *
     * @param  list<array<string, mixed>>  $entries
     */
    public static function add(array $entries): void
    {
        app()->instance(self::KEY, [...self::registered(), ...$entries]);
    }

    /**
     * Whether a URL belongs to the panel serving this request.
     *
     * A PANEL AT THE ROOT OWNS EVERYTHING NOT CLAIMED BY A LONGER PATH, which
     * is why this asks the registry rather than doing a prefix test: the demo
     * mounts its operator panel at `/`, and a plain `str_starts_with` would
     * have it own `/superadmin/...` too.
     */
    private static function insideCurrentPanel(string $href): bool
    {
        $panels = app(PanelManager::class);
        $current = $panels->currentPanel();

        if ($current === null || $href === '') {
            return true;
        }

        $path = '/'.ltrim((string) parse_url($href, PHP_URL_PATH), '/');
        $owner = null;
        $longest = -1;

        foreach ($panels->panels() as $candidate) {
            $prefix = '/'.trim($candidate->getPath(), '/');

            $matches = $prefix === '/'
                || $path === $prefix
                || str_starts_with($path, rtrim($prefix, '/').'/');

            if ($matches && strlen($prefix) > $longest) {
                $owner = $candidate;
                $longest = strlen($prefix);
            }
        }

        return $owner === null || $owner->id === $current->id;
    }

    /**
     * Everything the index should list, in reading order.
     *
     * ORDERED FROM YOURS OUTWARD - your account, then your organisation, then
     * the people in it, then whatever the application added. Somebody opening
     * settings is far more often after their own password than after the
     * organisation's logo.
     *
     * @return list<array<string, mixed>>
     */
    public static function entries(Request $request): array
    {
        $user = $request->user();

        $candidates = [
            [
                'key' => 'profile',
                'routes' => ['profile', 'settings.profile'],
                'title' => 'Profile',
                'description' => 'Your name and email. Security is a tab in this layout, not a separate account-menu item.',
            ],
            [
                'key' => 'security',
                'routes' => ['security', 'settings.security'],
                'title' => 'Security',
                'description' => 'Password, two-factor authentication, passkeys and signed-in devices.',
            ],
            [
                'key' => 'notifications',
                'routes' => ['settings.notifications'],
                'title' => 'Notifications',
                'description' => 'Control toast notifications and digest delivery by category.',
            ],
            [
                'key' => 'organisation',
                'routes' => ['pages.organisation'],
                'title' => 'Organisation',
                'description' => 'The name and logo everyone in this organisation sees.',
            ],
            [
                'key' => 'payments',
                'routes' => ['pages.payment-settings'],
                'title' => 'Payment gateways',
                'description' => 'How this organisation takes money.',
            ],
            [
                'key' => 'smtp',
                'routes' => ['pages.mail-settings'],
                'title' => 'SMTP',
                'description' => 'The mail server this installation sends through, and a way to test it.',
                'ability' => 'manage_mail_settings',
            ],
            [
                'key' => 'workspaces',
                'routes' => ['settings.workspaces'],
                'title' => 'Workspaces',
                'description' => 'The organisations you belong to; switch between them or start a new one.',
            ],
            /*
             * USER MANAGEMENT IS NOT LISTED HERE, and that is the point.
             *
             * It is a screen of its own - who is in the organisation and what
             * each role may do - reached from the account menu, from a role, or
             * by searching. Listing it among Profile, Security, Organisation
             * and Workspaces filed a first-class destination under a heading it
             * does not belong to, and the settings shell it inherited from that
             * gave it a second title and a back-link to somewhere it had never
             * been.
             *
             * `Roles` stays: the bare permission matrix genuinely is a
             * configuration screen, and user management embeds it as a tab.
             */
            [
                'key' => 'roles',
                'routes' => ['roles'],
                'title' => 'Roles',
                'description' => 'The permission matrix, on its own.',
                'ability' => 'manage_roles',
            ],
        ];

        $entries = [];

        foreach ($candidates as $candidate) {
            $href = null;

            foreach ($candidate['routes'] as $routeSuffix) {
                $href = self::urlFor((string) $routeSuffix);

                if ($href !== null) {
                    break;
                }
            }

            /*
             * NO ROUTE, NO ENTRY. A panel that dropped the screen with
             * `->without()`, or an application whose own `/settings/profile`
             * meant the packaged route never registered, should not be offered
             * a link into a 404 - and this is the only check that catches both.
             */
            if ($href === null) {
                continue;
            }

            if (isset($candidate['ability']) && ! Ability::allows($user, (string) $candidate['ability'])) {
                continue;
            }

            /*
             * WORKSPACES NEEDS AN ORGANISATION TO SWITCH BETWEEN, and
             * `Tenants::available()` is false for `PANEL_TENANCY_MODE=none` -
             * the default every fresh install starts on. `Route::has()` above
             * cannot catch this: the route stays registered on purpose (see
             * the `settings/workspaces` route) so a direct link degrades to "not
             * available here" instead of 404 - which means every single-tenant
             * install listed a settings screen that could never do anything,
             * found on an actual fresh install where nothing else pointed at
             * it either.
             */
            if ($candidate['key'] === 'workspaces' && ! Tenants::available()) {
                continue;
            }

            unset($candidate['routes'], $candidate['ability']);

            $entries[] = $candidate + ['href' => $href];
        }

        /*
         * A PACKAGED ROW ALREADY LISTED WINS, AND THE APPLICATION'S COPY OF IT
         * IS DROPPED.
         *
         * `SettingsIndex::add()` IS GLOBAL AND THE PACKAGED ROWS ARE PER
         * PANEL, which is the whole bug. An application whose own panel keeps
         * `/settings/profile` - Fortify's, Breeze's - has to register that row
         * itself, because the packaged route never registered THERE. It then
         * appeared on EVERY portal, including the ones where the packaged
         * route registers perfectly well: the superadmin settings screen
         * listed Profile twice and Security twice, one pair pointing at its
         * own `/superadmin/settings/profile` and the other at the operator
         * panel's.
         *
         * Two rows with the same name and different destinations is worse than
         * either alone - it reads as a duplicate and behaves as a portal leak.
         *
         * DEDUPED BY KEY, PACKAGED FIRST, because the packaged row is the one
         * that is panel-correct: it exists only where its route registered, so
         * it always points inside the portal being viewed. The application's
         * entry survives wherever the packaged route is absent, which is
         * exactly the case it was written for.
         */
        $listed = array_column($entries, 'key');

        foreach (self::registered() as $entry) {
            if (in_array($entry['key'] ?? null, $listed, true)) {
                continue;
            }

            if (isset($entry['ability']) && ! Ability::allows($user, (string) $entry['ability'])) {
                continue;
            }

            unset($entry['ability']);

            if (($entry['href'] ?? null) instanceof \Closure) {
                $entry['href'] = ($entry['href'])();
            }

            /*
             * AN ENTRY POINTING OUT OF THIS PORTAL IS NOT LISTED IN IT.
             *
             * `add()` IS GLOBAL, so an application entry resolves ONE url -
             * whichever panel owned the route it names - and then offers it
             * from every portal. The superadmin settings screen listed
             * "Assistant" linking to `/settings/assistant`, the OPERATOR
             * panel's screen, on a guard that holds no session there: a row
             * that reads as this portal's own and lands you at somebody
             * else's sign-in.
             *
             * It is also how a portal's `->without()` gets quietly undone.
             * Superadmin drops `assistant-settings` deliberately, and a global
             * entry put the link back.
             *
             * THE TEST IS THE PANEL'S PATH, not a list of exceptions, so this
             * holds for any entry any application registers - including ones
             * written after this rule.
             */
            if (! self::insideCurrentPanel((string) ($entry['href'] ?? ''))) {
                continue;
            }

            $entries[] = $entry;
        }

        /*
         * A STABLE SORT ON `order`, with the packaged rows keeping their
         * declared positions. `usort` is not stable across every PHP build for
         * equal keys, so the index is folded in as a tie-break - two entries
         * with no `order` must not swap between requests.
         */
        $ordered = [];

        foreach ($entries as $index => $entry) {
            $ordered[] = [$entry['order'] ?? ($index + 100), $index, $entry];
        }

        usort($ordered, static fn (array $a, array $b): int => [$a[0], $a[1]] <=> [$b[0], $b[1]]);

        return array_map(static function (array $row): array {
            unset($row[2]['order']);

            return $row[2];
        }, $ordered);
    }

    /**
     * A panel-qualified route's URL, or null when it is not registered.
     *
     * THE CURRENT PANEL, NOT A HARDCODED PREFIX. Route names carry the panel id,
     * and an application with several panels has several of each of these - so
     * the right one is whichever panel is serving this request. Reading a fixed
     * `panel.` prefix is how a settings index inside `/platform` ends up linking
     * into the admin panel.
     */
    private static function urlFor(string $suffix): ?string
    {
        $panel = app(PanelManager::class)->currentPanel();

        if ($panel === null) {
            return null;
        }

        /*
         * `getRouteName()`, NOT `$panel->id.'.'`. A panel may override its
         * route-name prefix - the reference application's `admin` panel is
         * named `panel.` so that URLs written before panels existed keep
         * working - and assuming the id silently produces null for every one of
         * these, which renders as a settings index missing half its rows.
         */
        $name = $panel->getRouteName().$suffix;

        return Route::has($name) ? route($name) : null;
    }

    /** @return list<array<string, mixed>> */
    private static function registered(): array
    {
        return app()->bound(self::KEY) ? (array) app(self::KEY) : [];
    }
}
