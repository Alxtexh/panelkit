<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

/**
 * The help centre's content, which the package cannot write for you.
 *
 * THE SCREEN IS GENERIC AND THE WORDS ARE NOT. A searchable help centre is
 * framework work - the search, the categories, the deep link to one article, the
 * empty state - and every panel needs it. What goes IN it is the application's:
 * the reference app explains fibre plans and routers, which is no use to a
 * veterinary practice, and shipping those articles would be shipping somebody
 * else's business as though it were a feature.
 *
 * SO THE PACKAGE SHIPS THE SHELF AND SOME BOOKS. The defaults below describe
 * only what the PANEL does - search, tables, filters, saved views, the trash,
 * roles, the account screens - because those are true of every installation and
 * a help centre that opens empty on a fresh install reads as broken rather than
 * as unconfigured. An application adds its own with `add()`, and may drop the
 * defaults entirely with `replace()`.
 *
 * HELD IN THE CONTAINER, NOT IN A STATIC, and that is not a style preference.
 * `PanelRoutes` learned this the expensive way: a static list is appended to
 * every time the application boots and never cleared, so across a suite that
 * boots a thousand times it grew a thousand copies. Nothing failed - the tests
 * just got slower, which reads as "the tests got slower" rather than as a leak.
 * A container binding is rebuilt with the application.
 */
final class HelpCentre
{
    private const KEY = 'alxtexhpanel.help';

    private const FAQ_KEY = 'alxtexhpanel.help.faq';

    /** Named, replaceable contributions - see `source()`. */
    private const SOURCE_KEY = 'alxtexhpanel.help.sources';

    /**
     * Add articles, keeping the packaged ones.
     *
     * @param  list<array<string, mixed>>  $articles
     */
    public static function add(array $articles): void
    {
        app()->instance(self::KEY, [...self::registered(), ...$articles]);
    }

    /**
     * Contribute under a NAME, replacing whatever that name contributed before.
     *
     * `add()` AND `addQuestions()` APPEND, WHICH IS RIGHT FOR A PROVIDER and
     * wrong for anything that runs per request. A provider registers once per
     * process, so appending is exactly once; a middleware registers on every
     * request, and in a container that outlives one - Octane, or a test making
     * two requests - the same questions stack up, duplicating on screen with
     * every request served. Nothing errors; the FAQ simply grows.
     *
     * A named source is idempotent by construction: registering `content`
     * twice leaves one contribution, and re-registering after an edit replaces
     * the stale copy rather than sitting beside it. Sources are read alongside
     * the appended registrations, so both styles coexist.
     *
     * LAZY BY DESIGN: the resolver runs when a screen actually reads help
     * content, not when the source is registered. A source registered from
     * middleware runs on EVERY panel request - including the live-updates diff
     * endpoint, whose entire contract is one bounded query - so resolving
     * eagerly turns "register content" into a query on the hottest path in the
     * panel. Registration is now free; only the FAQ, help and What's-new
     * screens pay for it.
     *
     * @param  \Closure(): array{articles?: list<array<string, mixed>>, questions?: list<array{title: string, items: list<array{q: string, a: string}>}>}  $resolver
     */
    public static function source(string $name, \Closure $resolver): void
    {
        app()->instance(self::SOURCE_KEY, [...self::sources(), $name => $resolver]);

        // The memo belongs to the previous set of resolvers. Keeping it would
        // serve the last request's content in any container that outlives one
        // request, which is the exact staleness this whole path has already
        // been bitten by once.
        app()->forgetInstance(self::SOURCE_KEY.'.resolved');
    }

    /**
     * Registered resolvers, run once each and memoised for this request.
     *
     * ONCE, NOT PER READ. `articles()` and `categories()` are both called
     * while rendering the help centre, and `categories()` derives its tabs
     * from `articles()` - so an un-memoised resolver would run the same query
     * two or three times on one screen.
     *
     * @return array<string, array{articles?: list<mixed>, questions?: list<mixed>}>
     */
    private static function sources(): array
    {
        return app()->bound(self::SOURCE_KEY) ? (array) app(self::SOURCE_KEY) : [];
    }

    /** @return array<string, array{articles?: list<mixed>, questions?: list<mixed>}> */
    private static function resolvedSources(): array
    {
        if (app()->bound(self::SOURCE_KEY.'.resolved')) {
            return (array) app(self::SOURCE_KEY.'.resolved');
        }

        $resolved = [];

        foreach (self::sources() as $name => $resolver) {
            $resolved[$name] = $resolver instanceof \Closure ? (array) $resolver() : (array) $resolver;
        }

        app()->instance(self::SOURCE_KEY.'.resolved', $resolved);

        return $resolved;
    }

    /**
     * Add articles, dropping the packaged ones.
     *
     * FOR THE APPLICATION THAT HAS WRITTEN ITS OWN VERSION of "how do I search",
     * in its own voice. Two answers to one question, one of them in the
     * package's words, is worse than either alone.
     *
     * @param  list<array<string, mixed>>  $articles
     */
    public static function replace(array $articles): void
    {
        app()->instance(self::KEY, $articles);
        app()->instance(self::KEY.'.replaced', true);
    }

    /**
     * Everything the help screen should show.
     *
     * @return list<array<string, mixed>>
     */
    public static function articles(): array
    {
        $replaced = app()->bound(self::KEY.'.replaced');

        return $replaced
            ? self::registered()
            : [...self::defaults(), ...self::registered()];
    }

    /**
     * The category tabs, derived from the articles that actually exist.
     *
     * DERIVED, NOT DECLARED, because a hardcoded list is the thing that made
     * this screen ISP-specific: the reference app's tabs read "Getting started,
     * Subscribers, Data & exports, The panel", and "Subscribers" is meaningless
     * to a veterinary practice and empty in every panel that has none. A tab
     * with nothing behind it is worse than a missing tab - somebody clicks it.
     *
     * LABELS COME FROM `panel.help.categories` where an application has named
     * them, and are otherwise title-cased from the key. Icons cannot travel in
     * JSON, so the screen maps the keys it knows and falls back to a generic
     * one; a category the package has never heard of still gets a tab.
     *
     * @return list<array{key: string, label: string}>
     */
    public static function categories(): array
    {
        $named = (array) config('panel.help.categories', []);

        $keys = [];

        foreach (self::articles() as $article) {
            $key = (string) ($article['category'] ?? 'panel');

            if (! in_array($key, $keys, true)) {
                $keys[] = $key;
            }
        }

        return array_map(static fn (string $key): array => [
            'key' => $key,
            'label' => $named[$key] ?? ucfirst(str_replace(['-', '_'], ' ', $key)),
        ], $keys);
    }

    /**
     * Add question groups to the FAQ.
     *
     * @param  list<array{title: string, items: list<array{q: string, a: string}>}>  $groups
     */
    public static function addQuestions(array $groups): void
    {
        app()->instance(self::FAQ_KEY, [...self::registeredQuestions(), ...$groups]);
    }

    /**
     * @return list<array{title: string, items: list<array{q: string, a: string}>}>
     */
    public static function questions(): array
    {
        return [...self::defaultQuestions(), ...self::registeredQuestions()];
    }

    /**
     * Appended registrations, then every named source.
     *
     * SOURCES COME LAST so a per-request contribution (database content) is
     * seen after a provider's, which matters only for ordering and is the
     * order somebody would expect: what an operator edited most recently sits
     * after what shipped.
     *
     * @return list<array<string, mixed>>
     */
    private static function registered(): array
    {
        $appended = self::normaliseArticles(app()->bound(self::KEY) ? app(self::KEY) : []);

        $fromSources = [];

        foreach (self::resolvedSources() as $source) {
            $fromSources = [...$fromSources, ...self::normaliseArticles($source['articles'] ?? [])];
        }

        return [...$appended, ...$fromSources];
    }

    /** @return list<array{title: string, items: list<array{q: string, a: string}>}> */
    private static function registeredQuestions(): array
    {
        $appended = self::normaliseQuestions(app()->bound(self::FAQ_KEY) ? app(self::FAQ_KEY) : []);

        $fromSources = [];

        foreach (self::resolvedSources() as $source) {
            $fromSources = [...$fromSources, ...self::normaliseQuestions($source['questions'] ?? [])];
        }

        return [...$appended, ...$fromSources];
    }

    /** @return list<array<string, mixed>> */
    private static function normaliseArticles(mixed $articles): array
    {
        $out = [];

        foreach (is_array($articles) ? $articles : [] as $article) {
            if (! is_array($article)) {
                continue;
            }

            $normalised = [];

            foreach ($article as $key => $value) {
                if (is_string($key)) {
                    $normalised[$key] = $value;
                }
            }

            $out[] = $normalised;
        }

        return $out;
    }

    /** @return list<array{title: string, items: list<array{q: string, a: string}>}> */
    private static function normaliseQuestions(mixed $groups): array
    {
        $out = [];

        foreach (is_array($groups) ? $groups : [] as $group) {
            if (! is_array($group) || ! is_string($group['title'] ?? null) || ! is_array($group['items'] ?? null)) {
                continue;
            }

            $items = [];

            foreach ($group['items'] as $item) {
                if (is_array($item) && is_string($item['q'] ?? null) && is_string($item['a'] ?? null)) {
                    $items[] = ['q' => $item['q'], 'a' => $item['a']];
                }
            }

            $out[] = ['title' => $group['title'], 'items' => $items];
        }

        return $out;
    }

    /**
     * What is true of every panel, whatever it administers.
     *
     * `keywords` EXISTS BECAUSE PEOPLE DO NOT SEARCH FOR THE TITLE. Somebody
     * looking for the command palette types "shortcut" or "ctrl k", never
     * "Finding anything quickly", and a search over titles and bodies alone
     * returns nothing and teaches them the help centre is useless.
     *
     * @return list<array<string, mixed>>
     */
    private static function defaults(): array
    {
        return [
            [
                'id' => 'panel-search',
                'category' => 'panel',
                'title' => 'Finding anything quickly',
                'keywords' => 'search command palette shortcut keyboard ctrl k cmd find lookup jump',
                'body' => [
                    'Press ⌘K (or Ctrl+K) anywhere in the panel to open the command palette.',
                    'It filters pages instantly with no request, because the navigation is already on the page. Typing longer also searches records - each list contributes the columns it marks as searchable, and anything you are not allowed to view is not searched at all.',
                ],
            ],
            [
                'id' => 'panel-tables',
                'category' => 'panel',
                'title' => 'Sorting, filtering and saving a view',
                'keywords' => 'table list filter sort column density saved view reset',
                'body' => [
                    'Click a column heading to sort by it. The filter button opens the filters that list offers; they combine, and the URL updates so a filtered list can be linked or bookmarked.',
                    'Save a combination you keep re-making as a view, and it appears as a tab above the table. Views are yours - saving one does not change what anybody else sees.',
                    'The density control trades row height for rows on screen, and is remembered per list.',
                ],
            ],
            [
                'id' => 'panel-trash',
                'category' => 'panel',
                'title' => 'Recovering something deleted',
                'keywords' => 'trash bin deleted restore recover undo permanently gone retention',
                'body' => [
                    'Deleting does not destroy immediately. Deleted records go to Trash, grouped by what they are, and can be restored from there.',
                    'Trash empties itself on a retention schedule set by an administrator. Once a record leaves Trash it is gone - restore is the only recovery, so act while it is still listed.',
                ],
            ],
            [
                'id' => 'panel-account',
                'category' => 'account',
                'title' => 'Your password, passkeys and signed-in devices',
                'keywords' => 'password change security passkey two factor 2fa mfa authenticator devices sessions sign out',
                'body' => [
                    'Open the account menu from your avatar. Profile changes your name and email address; Security is everything about getting in.',
                    'On Security you can change your password, add a passkey so you can sign in without typing one, and turn on two-factor authentication: an authenticator app, or a one-time code emailed to you. When either is on, signing in with a password asks for that code before the dashboard.',
                    'That screen also lists every browser currently signed in to your account. Sign out anything you do not recognise - it takes effect on that device\'s very next request.',
                ],
            ],
            [
                'id' => 'panel-permissions',
                'category' => 'account',
                'title' => 'Why a page says you cannot see it',
                'keywords' => 'permission denied forbidden 403 role access cannot see missing menu admin',
                'body' => [
                    'What you can open is decided by the role your account holds, and roles are managed per organisation.',
                    'A page you have no permission for is not merely hidden - it refuses to open if you type its address. If something you need is missing, an administrator can grant it on the Roles screen; there is nothing to reinstall or restart.',
                ],
            ],
        ];
    }

    /**
     * @return list<array{title: string, items: list<array{q: string, a: string}>}>
     */
    private static function defaultQuestions(): array
    {
        return [
            [
                'title' => 'Using the panel',
                'items' => [
                    [
                        'q' => 'Can I change where the navigation sits?',
                        'a' => 'Yes. The appearance controls let the menu sit on the left, on the right or across the top, and the rest of the interface mirrors to match. The choice is remembered for your account.',
                    ],
                    [
                        'q' => 'Do lists update on their own?',
                        'a' => 'They stay current without a full page reload. How that happens - polling or a push connection - is a configuration choice, and nothing in the interface changes when it is switched.',
                    ],
                    [
                        'q' => 'Can I export what I am looking at?',
                        'a' => 'Yes, and the export honours the filters currently applied rather than dumping the whole table. Large exports run in the background and arrive as a notification when they are ready.',
                    ],
                ],
            ],
            [
                'title' => 'Access and security',
                'items' => [
                    [
                        'q' => 'I have forgotten my password.',
                        'a' => 'Use the "forgot password" link on the sign-in screen. If your account has a passkey you can sign in with that instead and change the password afterwards from Security.',
                    ],
                    [
                        'q' => 'Somebody else has my password. What now?',
                        'a' => 'Change it from Security. Doing so signs out every other device automatically, so whoever is already signed in loses access at the same moment rather than keeping their session.',
                    ],
                ],
            ],
        ];
    }
}
