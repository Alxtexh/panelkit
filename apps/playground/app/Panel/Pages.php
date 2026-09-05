<?php

declare(strict_types=1);

namespace App\Panel;

use Alxtexh\Panel\PanelManager;

/**
 * Every screen that is NOT a resource, and where it belongs in the navigation.
 *
 * THIS EXISTS BECAUSE PAGES KEPT DISAPPEARING. Resources are discovered from the
 * filesystem and place themselves in the sidebar automatically; anything else -
 * the mail screen, the API reference, the backup monitor - had to be added to a
 * TypeScript array by hand. So a page shipped, worked, was tested, and appeared
 * in no menu at all: backups and logs reachable only from the account popup, the
 * workspace reachable from nowhere whatever.
 *
 * NOTHING FAILED WHEN THAT HAPPENED, which is the actual problem. A page with no
 * route into it is indistinguishable from a page nobody has written yet.
 *
 * DECLARED HERE, ON THE SERVER, so that a TEST CAN SEE IT. That is the whole
 * reason this is PHP rather than another entry in `usePanelNav.ts`:
 * `NavigationCoverageTest` renders every authenticated screen and fails on any
 * one that is neither a resource, nor listed here, nor excluded below WITH A
 * REASON. The rule is enforced rather than remembered.
 *
 * NOTHING HERE MAY ALSO BE IN THE ACCOUNT MENU. One destination, one place to
 * find it: a link that appears twice teaches nobody where it lives and makes the
 * shorter of the two lists longer for no gain. Backups, Logs and User management
 * are reached from the account menu and are therefore listed in
 * `intentionallyUnlinked()` rather than here - the coverage test still accounts
 * for them, it just accounts for them as somebody else's entry.
 */
final class Pages
{
    /**
     * Pages, filtered to the panel that should show them.
     *
     * EVERY PAGE HERE IS ROUTED AT THE ROOT, which is what makes the filter
     * necessary rather than tidy. A generated portal was showing Mail, the API
     * reference and the error previews in its sidebar - all links OUT of the
     * portal, into the operator application, with no way back except the browser
     * button. The resources were scoped per panel from the start; the pages were
     * not, and nothing failed because every one of those links resolves.
     *
     * DECLARED PER PAGE rather than assumed, because an application may
     * genuinely want a screen in two portals - and a page with no declaration
     * belongs to the default panel, which is where every one of these lives.
     *
     * @return list<array{title: string, href: string, icon: string, group: string}>
     */
    public static function forPanel(?string $panelId = null): array
    {
        $panelId ??= app(PanelManager::class)->currentPanel()?->id
            ?? (string) config('panel.default', 'admin');

        return array_values(array_filter(
            self::all(),
            static fn (array $page): bool => ($page['panel'] ?? config('panel.default', 'admin')) === $panelId,
        ));
    }

    /**
     * @return list<array{title: string, href: string, icon: string, group: string}>
     */
    public static function all(): array
    {
        return [
            /*
             * App screens are a GROUP, not top-level items. They are not
             * resources - no table, no policy, no model behind a registry entry
             * - so grouping them keeps the top level for the things the panel
             * actually administers.
             */
            ['title' => 'Mail', 'href' => '/apps/mail', 'icon' => 'mail', 'group' => 'Apps'],
            ['title' => 'Chat', 'href' => '/apps/chat', 'icon' => 'chat', 'group' => 'Apps'],

            /*
             * The billing preferences SINGULAR (roadmap 4.3) - one record,
             * settings-shaped. It joins the Configuration group the Custom
             * fields resource already created, because both are knobs the
             * organisation turns once rather than screens worked in all day.
             */
            ['title' => 'Billing', 'href' => '/billing-settings', 'icon' => 'sliders', 'group' => 'Configuration'],

            /*
             * IN "APPS" RATHER THAN A SETTINGS GROUP, because designing an
             * invoice is a thing an operator DOES rather than a preference they
             * set. It sits beside Mail and Chat for the same reason those do:
             * they are all screens somebody opens to produce something, not
             * knobs somebody turns once.
             */
            [
                'title' => 'Documents',
                'href' => '/documents',
                'icon' => 'file-text',
                'group' => 'Apps',

                /*
                 * THE LINK FOLLOWS THE ABILITY, now that the screen has one.
                 *
                 * `DocumentTemplateController` had no authorisation at all -
                 * any authenticated operator could rewrite the templates every
                 * invoice prints from - and gating the controller without
                 * gating the entry would leave everybody else a menu item that
                 * answers 403. Hiding a link is not a control, but showing one
                 * that cannot be opened is a bug report waiting to be filed.
                 */
                'ability' => 'manage_documents',
            ],
            /*
             * Development surfaces, kept apart from the operator's screens. A
             * device workbench is for whoever is BUILDING the panel; listing it
             * beside Clients would put something an operator never needs into
             * the column they use all day. API docs mount via Panel::apiDocs()
             * under Developer, not here.
             */
            ['title' => 'Device preview', 'href' => '/screens/devices', 'icon' => 'smartphone', 'group' => 'Building'],

            /*
             * The states a panel has but cannot normally be shown.
             *
             * An error page is by definition something you cannot summon on
             * demand, so it is the screen that ships broken and stays broken -
             * nobody sees a 500 until a customer does. Putting them in the
             * navigation makes them ordinary pages that get looked at.
             */
            ['title' => 'Verification', 'href' => '/screens/verify', 'icon' => 'key', 'group' => 'Screens'],
            ['title' => 'Lock screen', 'href' => '/screens/locked', 'icon' => 'lock', 'group' => 'Screens'],
            /*
             * A TRIGGER, NOT A LINK - which is what the leading `#` marks.
             *
             * Session expiry is handled as a dialog over whatever page you were
             * on, so it has no page of its own to navigate to. The client posts
             * to `screens.expireSession` and gets a real 419 back, which its
             * transport hook then notices exactly as it would in production.
             * Anything else here would be a drawing of the dialog rather than
             * the dialog.
             */
            ['title' => 'Session expired', 'href' => '#session-expired', 'icon' => 'timer-off', 'group' => 'Screens'],
            /*
             * NESTED UNDER "Screens/Errors" rather than sitting flat in
             * "Screens" alongside Lock screen and Verification - five error
             * states are their own cluster, and the sidebar's nested-group
             * support (a `/` in the group string) exists so a section can
             * hold both plain links and a dropdown, matching the pattern.
             */
            ['title' => 'Access denied', 'href' => '/screens/error/403', 'icon' => 'shield-alert', 'group' => 'Screens/Errors'],
            ['title' => 'Not found', 'href' => '/screens/error/404', 'icon' => 'file-question', 'group' => 'Screens/Errors'],
            ['title' => 'Rate limited', 'href' => '/screens/error/429', 'icon' => 'gauge', 'group' => 'Screens/Errors'],
            ['title' => 'Server error', 'href' => '/screens/error/500', 'icon' => 'server-crash', 'group' => 'Screens/Errors'],
            ['title' => 'Maintenance', 'href' => '/screens/error/503', 'icon' => 'wrench', 'group' => 'Screens/Errors'],

            /*
             * Auth design families (shadcn-vue block patterns, kit AuthLayout).
             * One family couples login + register + OTP. Nested groups keep the
             * five compositions scannable without mixing them into Screens.
             */
            ['title' => 'Login', 'href' => '/screens/auth/centered/login', 'icon' => 'lock', 'group' => 'Auth samples/Centered'],
            ['title' => 'Register', 'href' => '/screens/auth/centered/register', 'icon' => 'user-check', 'group' => 'Auth samples/Centered'],
            ['title' => 'OTP', 'href' => '/screens/auth/centered/otp', 'icon' => 'key', 'group' => 'Auth samples/Centered'],
            ['title' => 'Login', 'href' => '/screens/auth/muted/login', 'icon' => 'lock', 'group' => 'Auth samples/Muted'],
            ['title' => 'Register', 'href' => '/screens/auth/muted/register', 'icon' => 'user-check', 'group' => 'Auth samples/Muted'],
            ['title' => 'OTP', 'href' => '/screens/auth/muted/otp', 'icon' => 'key', 'group' => 'Auth samples/Muted'],
            ['title' => 'Login', 'href' => '/screens/auth/showcase/login', 'icon' => 'lock', 'group' => 'Auth samples/Showcase'],
            ['title' => 'Register', 'href' => '/screens/auth/showcase/register', 'icon' => 'user-check', 'group' => 'Auth samples/Showcase'],
            ['title' => 'OTP', 'href' => '/screens/auth/showcase/otp', 'icon' => 'key', 'group' => 'Auth samples/Showcase'],
            ['title' => 'Login', 'href' => '/screens/auth/split/login', 'icon' => 'lock', 'group' => 'Auth samples/Split'],
            ['title' => 'Register', 'href' => '/screens/auth/split/register', 'icon' => 'user-check', 'group' => 'Auth samples/Split'],
            ['title' => 'OTP', 'href' => '/screens/auth/split/otp', 'icon' => 'key', 'group' => 'Auth samples/Split'],
            ['title' => 'Login', 'href' => '/screens/auth/card/login', 'icon' => 'lock', 'group' => 'Auth samples/Card'],
            ['title' => 'Register', 'href' => '/screens/auth/card/register', 'icon' => 'user-check', 'group' => 'Auth samples/Card'],
            ['title' => 'OTP', 'href' => '/screens/auth/card/otp', 'icon' => 'key', 'group' => 'Auth samples/Card'],

            /*
             * Sidebar design families (shadcn-vue block patterns, kit AppSidebar).
             * Live shell previews rearrange nav chrome; nested groups sit beside
             * Auth samples.
             */
            ['title' => 'Inset', 'href' => '/screens/sidebar/inset', 'icon' => 'panel-left', 'group' => 'Sidebar samples'],
            ['title' => 'Edge', 'href' => '/screens/sidebar/sidebar', 'icon' => 'square', 'group' => 'Sidebar samples'],
            ['title' => 'Floating', 'href' => '/screens/sidebar/floating', 'icon' => 'layers', 'group' => 'Sidebar samples'],
            ['title' => 'Icon rail', 'href' => '/screens/sidebar/icon', 'icon' => 'panel-left-close', 'group' => 'Sidebar samples'],
            ['title' => 'Site header', 'href' => '/screens/sidebar/header', 'icon' => 'app-window', 'group' => 'Sidebar samples'],
            ['title' => 'Accordion', 'href' => '/screens/sidebar/accordion', 'icon' => 'chevrons-up-down', 'group' => 'Sidebar samples'],
            ['title' => 'File tree', 'href' => '/screens/sidebar/file-tree', 'icon' => 'folder-tree', 'group' => 'Sidebar samples'],
            ['title' => 'Calendar', 'href' => '/screens/sidebar/calendar', 'icon' => 'calendar', 'group' => 'Sidebar samples'],
            ['title' => 'Dialog', 'href' => '/screens/sidebar/dialog', 'icon' => 'app-window-mac', 'group' => 'Sidebar samples'],
        ];
    }

    /**
     * The paths the ACCOUNT MENU owns, and the sidebar must therefore not.
     *
     * DECLARED SO THE RULE CAN BE CHECKED. "Do not repeat what the account menu
     * offers" was enforced by scraping `href="/..."` out of the Vue component,
     * which worked until those literals became generated route helpers and the
     * check silently found nothing to compare. It caught itself - the test
     * asserts it found links at all - but the lesson is that a rule about two
     * lists should be expressed as two lists.
     *
     * PAIRED WITH THE NAME THE MENU READS, so removing an entry from the menu
     * breaks the test rather than quietly orphaning a screen.
     *
     * THAT NAME IS NOW A SHARED PROP, NOT A ROUTE HELPER. The menu moved into
     * the package and stopped importing Wayfinder helpers this application
     * alone generates; `SharePanelProps` sends a url per panel instead, and the
     * menu reads it. So the value here is the key on `page.props.panel` - which
     * is why `/activities` pairs with `activity`: the resource is plural, the
     * prop the server shares is not.
     *
     * @return array<string, string> path => the shared prop key the menu reads
     */
    public static function inAccountMenu(): array
    {
        return [
            '/user-management' => 'userManagement',
            '/operations/backups' => 'operations.backups',
            '/operations/logs' => 'operations.logs',
            '/operations/monitoring' => 'operations.monitoring',

            /*
             * MOVED OUT OF THE SIDEBAR, because neither is a thing this panel
             * administers. The sidebar lists subscribers, routers and plans -
             * the operator's subject matter. A trail of what the panel did to
             * itself and a bin of what was deleted from it are both about the
             * INSTALLATION, which is what the rest of this list already holds.
             *
             * Profile is the account-area door. Security is a sibling tab
             * inside the settings layout, not a third avatar-menu row.
             */
            '/activities' => 'activity',
            '/trash' => 'trash',
        ];
    }

    /**
     * Screens that deliberately appear in NO menu, each with its reason.
     *
     * AN ALLOW-LIST WITH REASONS, not a way to silence the test. Adding a path
     * here is a decision somebody has to write down and another person can
     * disagree with; forgetting to link a page is neither.
     *
     * Most of these are reached from somewhere that is not the sidebar - the
     * topbar bell, the command palette, a sub-navigation, an emailed link - and
     * "reached from somewhere else" is the only reason that belongs here.
     *
     * @return array<string, string>
     */
    public static function intentionallyUnlinked(): array
    {
        return [
            /*
             * THE PACKAGED SHELL, rendered so a browser test can prove it
             * draws. This application has its own chrome, so it is the one
             * place that cannot otherwise demonstrate the chrome the PACKAGE
             * ships - see `PanelShellRenderTest` and the page's own note on why
             * it sits under `errors/`.
             */
            '/shell-preview' => 'A fixture for the packaged shell\'s browser test. Deliberately in no menu.',
            /*
             * `/login-preview` USED TO BE HERE, EXCUSING A PATH THE SWEEP
             * NEVER EXAMINES. `NavigationCoverageTest::candidatePaths()`
             * only walks routes behind `auth` middleware in the first place
             * - `routes/web.php`'s `Route::get('/login-preview', ...)` has
             * none, correctly, since it previews the SIGNED-OUT login
             * screen - so this entry was never protecting anything from a
             * false orphan report; it just sat in the list looking load-
             * bearing. `test_the_allow_list_has_no_stale_entries` caught it.
             */

            '/dashboard' => 'The home screen: the first item in the sidebar and the target of the logo.',
            '/settings' => 'The searchable settings index. Reached from the account menu\'s Settings link.',
            '/settings/profile' => 'Reached from the account menu; settings have their own sub-navigation.',
            '/settings/security' => 'Reached from the settings sub-navigation.',
            '/settings/notifications' => 'Reached from the settings sub-navigation.',
            '/settings/organisation' => 'Reached from the settings sub-navigation.',
            '/settings/payments' => 'Reached from the settings sub-navigation. Platform-wide gateways, not a till.',
            '/kit-payments' => 'Redirects to organisation payment gateway settings.',
            '/settings/assistant' => 'Reached from the settings sub-navigation, for holders of manage_assistant.',
            '/settings/workspaces' => 'Reached from the settings sub-navigation.',
            '/settings/roles' => 'The standalone permission matrix. User management is the linked way in.',

            /*
             * THE ACCOUNT MENU OWNS THESE THREE, and the sidebar deliberately
             * does not repeat them. They were briefly in both, which is worse
             * than either: a destination in two places teaches nobody where it
             * lives, and it lengthens the list people scan all day to duplicate
             * a list they already had.
             */
            '/user-management' => 'Listed in the account menu, next to Settings.',
            '/operations/backups' => 'Listed in the account menu: the installation, not the organisation.',
            '/operations/logs' => 'Listed in the account menu, beside Backups.',
            '/operations/monitoring' => 'Listed in the account menu, beside Backups and Logs.',
            /*
             * THE POLICY BEHIND THE LIST. It used to be a dialog over the
             * backups screen and outgrew one - four unrelated subjects and
             * nineteen controls, with the schedule off screen while somebody
             * typed a bot token. It is reached from the Settings button there,
             * which is the only place it makes sense to enter it from.
             */
            '/operations/backups/settings' => 'Opened from the Settings button on the backups screen.',
            '/activities' => 'Listed in the account menu. What the panel did to itself, not what it administers.',
            '/trash' => 'Listed in the account menu, at the end: what was deleted from this portal.',
            /*
             * THE USERS RESOURCE IS THE SAME SUBJECT AS USER MANAGEMENT, and
             * having both in the sidebar meant two entry points to one thing -
             * with different screens behind them, so whichever somebody clicked
             * became their idea of what the panel can do. The resource is
             * hidden from navigation and reached from the palette, from record
             * links, and from the API.
             */
            '/users' => 'User management in the account menu is the linked way in.',
            /*
             * READ FROM THE BANNER AND THE BELL, WRITTEN FROM THE BELL.
             *
             * An announcement's whole output appears somewhere people already
             * look - the top of the dashboard and the alerts list - and it
             * expires by itself. A permanent sidebar entry for the form that
             * writes one is navigation that earns nothing, so the link sits in
             * the bell beside the thing it produces.
             */
            '/announcements' => 'Written from the bell, read from the dashboard banner and the alerts list.',
            /*
             * A FIXTURE, and it has never been in a menu. It exists so the
             * editable-column path has a screen to exercise; listing it would
             * put a second, worse Plans screen in front of operators.
             */
            '/editable-plans' => 'A fixture for editable columns, opened by its tests and by hand.',
            '/operations/platform' => 'The old path for monitoring; it redirects, and runbooks still point at it.',
            '/user/confirm-password' => 'An interstitial, shown when a screen demands a fresh password.',
            /*
             * DELIBERATELY UNLINKED, and linking it would be a bug. It is where
             * `RequirePasswordRenewal` sends somebody whose password has
             * expired, and it is the ONLY screen they can open until they do -
             * so a permanent menu entry would advertise it to everybody else as
             * an ordinary destination.
             */
            '/password/change' => 'Reached by redirect when a password has expired. Not a destination.',
            '/email/verify' => 'Part of signing up, reached from an emailed link.',
            '/help' => 'Linked from the sidebar footer.',
            '/faq' => 'Linked from the sidebar footer.',
            '/whats-new' => 'Linked from the sidebar footer.',
            '/about' => 'Linked from the sidebar footer.',
            '/about/building' => 'The build guide, linked from About.',
            /*
             * BILLING SUSPENSION WALL. Reached only when a tenant is suspended;
             * a menu entry would advertise a dead end.
             */
            '/account/suspended' => 'Reached by redirect when the tenant is billing-suspended. Not a destination.',
            '/platform/account/suspended' => 'Reached by redirect when the tenant is billing-suspended. Not a destination.',
            '/reseller/account/suspended' => 'Reached by redirect when the tenant is billing-suspended. Not a destination.',
            '/superadmin/account/suspended' => 'Reached by redirect when the tenant is billing-suspended. Not a destination.',
            '/client/account/suspended' => 'Reached by redirect when the tenant is billing-suspended. Not a destination.',
            /*
             * THE SHOWCASE PLAN-CHOOSING PAIR. `PlanCatalogPage` (Choose a
             * plan) and `SubscriptionConfirmedPage` (the confirmation it
             * sends the browser to) link to EACH OTHER from inside their own
             * Vue templates - `SubscriptionConfirmedPage` passes
             * `subscriptionHref` back to the catalog - not from `panelNav`
             * or any settings hub this sweep can see. Neither has a sidebar
             * entry: a customer portal's own dashboard or billing widget is
             * where a real host would put the "Choose a plan" call to
             * action, matching `PlanCatalogPage`'s own docblock describing
             * this closure as a showcase rather than a wired processor.
             */
            '/client/account/subscription' => 'Choose-a-plan showcase; linked from a billing CTA a real host provides, not the sidebar.',
            '/client/subscription-confirmed' => 'Reached by redirect after choosing a plan. Not a destination; links back to the catalog from its own template.',
            /*
             * Reached only by a successful POST /setup-wizard, then offers
             * its own "Go to dashboard" / "Create hotspot" actions - never a
             * menu destination, the same way subscription-confirmed above
             * is reached by redirect rather than a link.
             */
            '/setup-wizard/complete' => 'Reached by redirect after finishing the setup wizard. Not a destination; offers its own dashboard/create actions.',
            /*
             * SETTINGS AND CHANGELOG COPIES PER PORTAL. Same destinations as
             * the operator portal's, mounted under each portal prefix.
             */
            '/platform/settings/notifications' => 'Reached from that portal\'s settings sub-navigation.',
            '/reseller/settings/notifications' => 'Reached from that portal\'s settings sub-navigation.',
            '/superadmin/settings/notifications' => 'Reached from that portal\'s settings sub-navigation.',
            '/client/settings/notifications' => 'Reached from that portal\'s settings sub-navigation.',
            '/platform/whats-new' => 'Each portal routes its own changelog. The operator footer links /whats-new; this copy is the platform portal\'s.',
            '/reseller/whats-new' => 'Each portal routes its own changelog. The operator footer links /whats-new; this copy is the reseller portal\'s.',
            '/client/whats-new' => 'Each portal routes its own changelog. The operator footer links /whats-new; this copy is the client portal\'s.',
            /*
             * A GENERATED PORTAL'S OWN ROOT. It is not in this portal's
             * navigation and must not be: a link to another portal is a link
             * out of this one, and the sidebar is for where you already are.
             * Reached by typing the path or from wherever the installation
             * chooses to link its portals.
             */
            '/platform' => 'A generated portal\'s home. Not part of this portal\'s navigation.',
            '/reseller' => 'A generated portal\'s home. Not part of this portal\'s navigation.',
            /*
             * EACH PORTAL LINKS ITS OWN BIN, from `TrashBin::navigationEntry` -
             * so these are linked, just not from HERE. This portal's sidebar
             * offers this portal's trash and nobody else's, for the same reason
             * it does not offer another portal's subscribers.
             */
            '/platform/trash' => 'The platform portal links its own bin; this portal links its own.',
            '/reseller/trash' => 'The reseller portal links its own bin; this portal links its own.',
            /*
             * THE DESIGNER IS ROUTED IN EVERY PORTAL AND LINKED IN ONE.
             *
             * Panel routes are registered per panel, so the package mounts the
             * document designer wherever a panel exists - which is right: a
             * template is tenant data, and an application may well want a
             * reseller designing their own letterhead.
             *
             * THIS application links it only from the operator portal, because
             * that is where its documents are produced. An application that
             * wants it in a generated portal adds the entry; nothing here
             * prevents that, and the route is already waiting.
             */
            '/platform/documents' => 'Routed in every portal; this application links the designer from the operator portal only.',
            '/reseller/documents' => 'Routed in every portal; this application links the designer from the operator portal only.',
            /*
             * THE SUPERADMIN PORTAL, on the same three counts as the others -
             * its home is its own, its bin is its own, and the designer is
             * routed there because it is routed everywhere. It exists to edit
             * the content every portal reads and to see every tenant's tickets;
             * an operator reaches it by URL or from their own account menu, not
             * from this portal's sidebar.
             */
            '/superadmin' => 'A generated portal\'s home. Not part of this portal\'s navigation.',
            '/superadmin/trash' => 'The superadmin portal links its own bin; this portal links its own.',
            '/superadmin/documents' => 'Routed in every portal; this application links the designer from the operator portal only.',
            '/superadmin/whats-new' => 'Each portal routes its own changelog. The operator footer links /whats-new; this copy is the superadmin portal\'s.',
            /*
             * IDLE LOCK, per portal. The operator portal lists /screens/locked
             * under Screens so the demo can open it. Every other portal mounts
             * the same route because idle lock is on by default for a signed-in
             * panel. A sidebar entry would advertise a padlock as a destination.
             */
            '/platform/screens/locked' => 'Reached by idle lock or the lock action, not from a menu.',
            '/reseller/screens/locked' => 'Reached by idle lock or the lock action, not from a menu.',
            '/superadmin/screens/locked' => 'Reached by idle lock or the lock action, not from a menu.',
            '/client/screens/locked' => 'Reached by idle lock or the lock action, not from a menu.',
        ];
    }
}
