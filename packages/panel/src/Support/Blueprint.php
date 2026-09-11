<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Alxtexh\Panel\Alerts;
use Alxtexh\Panel\Documents;
use Alxtexh\Panel\PanelManager;
use Illuminate\Support\Facades\Artisan;

/**
 * The instructions an AI agent needs to build in this panel without guessing.
 *
 * WHAT IT IS FOR. An agent asked to "add an invoices screen" will otherwise
 * invent a controller, a route and a Blade view - all of which work, none of
 * which is how this panel does anything, and every one of which quietly skips
 * the tenant scope and the policy. The cost is not the wasted attempt; it is
 * that the result LOOKS right. A resource with no policy is invisible; a query
 * that forgets the scope returns another organisation's rows and a 200.
 *
 * SO IT LEADS WITH THE RULES THAT FAIL SILENTLY, not with a feature tour.
 * Anything an agent can discover by reading a class - method names, options - is
 * left out; what goes in is the part that is invisible in the code and expensive
 * to get wrong.
 *
 * IT IS GENERATED, NOT WRITTEN DOWN TWICE. The resource list, the commands, the
 * field types and the panel layout all come from the running application, so an
 * instruction file that named a resource somebody deleted last week cannot
 * happen. That matters more here than in ordinary documentation: a person
 * notices a stale claim, and an agent acts on it.
 *
 * IT IS MARKDOWN because that is what every agent already reads - `AGENTS.md`,
 * `CLAUDE.md`, a pasted prompt - and because a human has to be able to check it.
 */
final class Blueprint
{
    public static function markdown(): string
    {
        return implode("\n\n", array_filter([
            self::heading(),
            self::officialDocs(),
            self::dayZero(),
            self::rules(),
            self::shape(),
            self::recipes(),
            self::catalogue(),
            self::assistant(),
            self::inventory(),
            self::operatorOwned(),
            self::commands(),
            self::verification(),
        ]))."\n";
    }

    /**
     * WHAT THERE IS TO BUILD WITH - read off the source tree, never listed.
     *
     * THE REST OF THIS FILE TELLS AN AGENT HOW TO BEHAVE and never told it what
     * exists. That gap has one failure mode and it is expensive: an agent that
     * does not know `ColourField` is there writes a `TextField` with a hex
     * validation rule, or invents `ImageField` because it sounds like it should
     * exist and gets a fatal on a name nothing defines. Both look like
     * reasonable code in review.
     *
     * DERIVED FROM THE DIRECTORIES, so it cannot drift. A hand-written list is
     * accurate the day it is written and wrong at the next release - and wrong
     * here means an agent building against a field that was renamed, which is
     * exactly the drift `panel:blueprint` exists to avoid. Adding a field type
     * adds a line here by existing.
     */
    /** Said once, because it is the sentence that stops a wasted week. */
    /**
     * WHAT MOUNTS A WIDGET, stated because for two releases nothing did.
     *
     * `StatWidget` and `ChartWidget` shipped from the beginning and the package
     * routed no dashboard, so `StatWidget::make()` composed a correct value
     * object that nothing rendered. This line used to say exactly that, and it
     * was the honest answer until 0.3.0 gave them a host.
     *
     * IT IS STILL A CAVEAT, because the failure it prevents did not go away: a
     * widget declared anywhere other than a `DashboardPage` is still a value
     * object nothing draws. The host is the sentence that matters, not the
     * class list.
     */
    private const WIDGET_CAVEAT = '**declare them on a `DashboardPage`, which is what draws '
        .'them, or drop a factory under a directory the panel passed to `discoverWidgets()`.** '
        .'`php artisan make:panel-page Overview --dashboard` writes one; its '
        .'`stats()`, `charts()` and `tables()` return these classes and the packaged `PanelDashboard` '
        .'screen renders them, each as its own deferred prop. `TableWidget::make(\'recent\')->resource(OrderResource::class)->limit(5)` '
        .'renders the existing DataTable with a capped list query. '
        .'`->live(\'dashboard.stats\')` prefers Echo/Reverb when `window.Echo` exists; '
        .'`->poll(\'10s\')` on `StatWidget`, `TableWidget` or `ChartWidget` is the HTTP fallback '
        .'(pauses while the tab is hidden; never both at runtime). Redis is not a UI transport. '
        .'`Panel::make(\'admin\')->discoverWidgets(app_path(\'Panel/Widgets\'))` is the normal path '
        .'(namespace is optional when the directory is under `app_path()`). A widget built anywhere else '
        .'is a value object nothing mounts - correct, tested and invisible. Before 0.3.0 '
        .'that was true of every widget, which is why this line exists';

    /**
     * TWO OF THESE ARE THE PACKAGE'S OWN SCREENS, not base classes, and saying
     * so is the difference between enabling one and reimplementing it. Both are
     * absent until configured - so an agent that finds no `/whats-new` concludes
     * the package has no changelog, and writes a second one.
     */
    /**
     * The Vue side, which this catalogue cannot see.
     *
     * EVERY GROUP ABOVE IS GENERATED by scanning `packages/panel/src`, so it
     * lists PHP and only PHP. `@alxtexh-enterprise/panel` ships components with no PHP
     * counterpart at all - and an agent reading a guide that never names them
     * hand-rolls a worse version, which is the same failure the catalogue was
     * built to prevent, one package over.
     *
     * NAMED BY HAND, therefore, and deliberately short: only the ones somebody
     * planning a screen would otherwise reinvent.
     */
    private const CLIENT_ONLY = <<<'MD'
        **Client-side components with no PHP constructor at all** (`@alxtexh-enterprise/panel`):
        `StatStrip` `MiniStatCard` `CatalogCard` `PlanCard` `PlanGrid` `PlanEditor` `CatalogGrid`
        `CatalogTill` `CatalogBrowser` `CatalogRegister` `LineItems` `CartPanel`
        `PkQtyStepper` `PkStatusBadge` `PkSignaturePad` `PaymentGateways`
        _How to reach them: import them into YOUR OWN Vue page. A `CatalogBrowserPage` or
        `PlanSetupPage` is optional routing, not a requirement to draw the widget.
        `DashboardPage` renders `StatCard` and `ChartCard` only, so a `StatWidget` cannot produce
        a `StatStrip` - if you want one card split into four windows of the same
        metric, that screen is hand-written today. `ChartWidget::type('catalog')`
        and `type('items')` do mount `CatalogGrid` / `LineItems` on a dashboard._

        **Chart renderers already reachable from PHP - do not hand-roll a Vue chart for these:**
        `SegmentedBar` (`ChartWidget::type('segments')`), `HeatmapChart` (`type('heatmap')`),
        `ComboChart` (`type('combo')`), `PolarAreaChart` (`type('polarArea')`), `RadarChart`
        (`type('radar')`). These were previously (and incorrectly) listed above as having no PHP
        equivalent; `ChartWidget::TYPES` has dispatched to all five since before this file was
        first written, and `ChartBody.vue` wires each one directly to its named type.
        MD;

    private const PAGE_HOW = 'extend `Page` (or `DashboardPage` / `PlanSetupPage` / `TillPage` / '
        .'`DevicePreviewPage` / `MailPage` / `ChatPage`) in `app/Panel/Pages` and '
        .'discovery routes it - `php artisan make:panel-page ServerHealth` writes the class '
        .'and its Vue file. Flags: `--dashboard`, `--plan-setup`, `--till`, `--catalog`, '
        .'`--catalog-item`, `--register`, `--signatures`, `--device-preview`. '
        .'`make:panel-page BillingPlans --plan-setup` writes an empty page (import PlanGrid). '
        .'`ChangelogPage` and `EnvironmentPage` are the package\'s OWN '
        .'screens rather than things to extend: each appears only once configured '
        .'(`panel.changelog`, `panel.env.editable`) and is absent entirely otherwise, so '
        .'check those keys before concluding the capability is missing';

    private static function catalogue(): string
    {
        $out = ["## What you can build with\n"];
        $out[] = "Every name below is a real class in the installed package. If something\n"
            ."you want is not here it does not exist - do not invent a field type, and do\n"
            ."not hand-roll one in Vue. Ask for it, or compose what is here.\n\n"
            ."EXISTING AND BEING MOUNTABLE ARE DIFFERENT CLAIMS, so each group says how it\n"
            ."is used. Read that line before planning around anything below.\n";

        /*
         * THE SECOND ELEMENT IS THE HONEST PART, and it is here because the
         * first version of this catalogue failed in the exact way the catalogue
         * was written to prevent.
         *
         * It listed `Widgets` beside `Forms/Fields` under one sentence - every
         * name below is a real class - which is true and useless. A field is
         * mounted by naming it in `form()`. A WIDGET HAS NO HOST: the package
         * routes no dashboard and has no mechanism for a non-resource page, so
         * `StatWidget::make()` composes a value object that nothing will render.
         * Nothing in the list distinguished those two, so an agent could write a
         * dashboard that was clean, tested and invisible.
         *
         * Being on disk is not being usable. Where it is not, this says so.
         */
        $groups = [
            'Form fields' => ['Forms/Fields', 'name them in `form()`'],
            'Table columns' => ['Tables/Columns', 'name them in `table()`'],
            'Table filters' => ['Tables/Filters', 'name them in `table()`'],
            'Actions' => ['Actions', 'name them in `table()` or the resource\'s actions'],
            'Schema (form layout)' => ['Schema', 'wrap fields with them inside `form()`'],
            'Dashboard widgets' => ['Widgets', self::WIDGET_CAVEAT],
            'Pages (screens that are not resources)' => ['Pages', self::PAGE_HOW],
            'Ticketing' => ['Ticketing', 'do not name these directly - `TicketingPlugin` '
                .'mounts them from `panel.ticketing.operator` / `.opener`. See the recipe'],
        ];

        foreach ($groups as $label => [$dir, $how]) {
            $names = self::classesIn($dir);

            if ($names === []) {
                continue;
            }

            /*
             * THE CLASS NAME IS PRINTED EXACTLY, suffix included, because that
             * is how it is written in a schema. `TextField::make()` is the
             * class; an agent copying a tidied-up `Text` from a list would write
             * a name that does not resolve.
             */
            $out[] = "**{$label}** (".count($names).'): `'.implode('` `', $names).'`'
                ."\n_How to use them: {$how}._";
        }

        $out[] = self::CLIENT_ONLY;

        $out[] = "\nAbstract bases and traits appear in those lists - `Field`, `Column`,\n"
            ."`HasChoices` - because they are what you extend when a genuinely new one is\n"
            .'needed. Everything else is `::make()` and chained.';

        return implode("\n", $out);
    }

    /**
     * The class names in one of the package's directories.
     *
     * READ FROM THE INSTALLED PACKAGE, not from a constant, so this reports what
     * the consumer actually has rather than what this file remembers.
     *
     * @return list<string>
     */
    private static function classesIn(string $directory): array
    {
        $path = dirname(__DIR__).'/'.$directory;

        if (! is_dir($path)) {
            return [];
        }

        $names = [];

        foreach ((array) scandir($path) as $entry) {
            if (! is_string($entry) || ! str_ends_with($entry, '.php')) {
                continue;
            }

            $names[] = substr($entry, 0, -4);
        }

        sort($names);

        return $names;
    }

    /**
     * The assistant's charter, for an agent EXTENDING it - E.3.
     *
     * An agent asked to "add a tool to the assistant" without this section
     * writes a tool that queries models directly, which is an endpoint with
     * no authorisation reachable by asking politely. The charter here is the
     * builder's half; the operator's half is a help article the assistant
     * itself retrieves and cites.
     */
    private static function assistant(): string
    {
        return <<<'MD'
        ## The assistant, if you extend it

        The assistant is `laravel/ai` behind three hard rules. Break any of
        them and you have built a data leak that answers politely:

        1. **Every tool that touches records extends `PanelTool` and calls
           `$this->authorise(action, resourceKey, $record)` first.** That is
           the SAME `Resource::can()` gate the buttons use - not a similar
           one, and never a prompt instruction. A tool refuses with a
           returned sentence, not an exception.
        2. **Anything destructive declares `isDestructive(): true`** and
           pauses for human approval before running.
        3. **Retrieval is tenant-scoped by construction.** `KnowledgeBase`
           refuses to search without a tenant; a new `KnowledgeSource` that
           indexes RECORDS (not public help text) must also gate retrieval
           per-asker with `authorise()`, because then it answers questions
           the screen would refuse.

        Credentials are BYOK: `AiCredentials` (panel settings, encrypted)
        layered over `.env`. Never read or log the key; `apply()` at the
        entry point is all any caller needs. With no key at all the
        assistant degrades to a setup sentence - keep it that way.

        What the assistant may do is documented for operators in the help
        centre (`assistant-charter`); if you add a capability, update that
        article in the same change so the assistant keeps citing the truth
        about itself.
        MD;
    }

    private static function heading(): string
    {
        $name = (string) config('app.name');

        return <<<MD
        # Building in this panel

        This application uses Alxtexhpanel: administration screens are declared as PHP
        classes and rendered by Inertia and Vue. `{$name}` is the application; the
        panel is the framework it is built with.

        Read this before adding a screen. It describes the conventions that are not
        visible in a single file, and the mistakes that return HTTP 200.
        MD;
    }

    /**
     * Routes to the deeper, human-maintained references this file cannot
     * replace - everything below is deliberately terse.
     *
     * WHY THIS EXISTS SEPARATELY FROM dayZero(). The rest of this file is
     * generated, versionless prose - it describes conventions, not the
     * verified, per-class API surface. An agent that needs a method's exact
     * signature, or the reasoning behind a rule rather than the rule itself,
     * belongs in the documentation site's generated API reference or the
     * longer AI Blueprint modules, not in a longer version of this file.
     */
    private static function officialDocs(): string
    {
        return <<<'MD'
        ## Official documentation

        This file is a fast, generated summary. Neither of these ships inside
        this Composer package or renders as a website yet - both live as
        Markdown source in the `alxtexh-enterprise/panelkit` development
        repository, readable directly on GitHub:

        - **Human guides and the generated API reference**:
          https://github.com/Alxtexh/panelkit/tree/main/docs-site
        - **AI Blueprint** (a router to focused, per-topic modules - forms, money,
          relation managers, tenancy, and more):
          https://github.com/Alxtexh/panelkit/blob/main/AI_BLUEPRINT.md
          Read the Money and Relation Managers modules before touching either -
          they are the two most expensive-to-get-wrong parts of this framework,
          and both fail silently.

        This application's own resources, panels and commands are listed further
        below - that inventory is generated from what is actually registered here
        and cannot go stale the way the linked documentation theoretically could.
        MD;
    }

    /**
     * One screen, because a long guide is skipped on a fresh clone.
     */
    private static function dayZero(): string
    {
        return <<<'MD'
        ## Day 0 (read this first)

        PanelKit is Vue + Inertia. It is not Livewire Filament. Training data that
        invents Filament APIs is wrong here: use only classes that this file and the
        package catalogue name.

        **Do**
        - Keep the `layout` callback in `resources/js/app.ts`. That wrap is the sidebar, navbar and footer.
        - Add screens with `php artisan make:panel-resource` / `make:panel-page`.
        - Keep create / edit / view / attach on **dedicated pages** (page-first CRUD).
        - Keep `SharePanelProps` on the `web` middleware group (`bootstrap/app.php`).
        - Use PanelKit APIs only (`Alxtexh\Panel\…`, fields in `form()`, columns in `table()`).
        - Run `php artisan panel:doctor` before you call it done.
        - Keep `resources/css/app.css` status tokens (`--success`, `--warning`, `--info`
          and their `--color-*` `@theme` mappings). Without them, badge variants
          `bg-success` / `bg-warning` / `bg-info` never compile. `panel:update` patches hosts that are missing them.
        - Keep `--pk-form-gap`, `.pk-form-stack`, and landing typography (`.pk-editorial`, `.pk-console`) in sync with the kit stub.

        **Do not**
        - Set `layout: null` on a panel page, or delete the `app.ts` layout callback.
        - Assign `page.default.layout ??= PanelLayout` in resolve. Packaged pages already set layout props; use the `createInertiaApp({ layout: … })` callback instead. `panel:doctor` fails on this pattern.
        - Hand-roll a controller and `Inertia::render` for a panel screen.
        - Strip `PanelShell` from `resources/js/layouts/PanelLayout.vue`.
        - Invent Filament / Livewire verbs: no `Filament\…`, `Forms\Components\…`,
          `CreateAction`, `EditAction`, `ViewAction`, `DeleteAction`, `Tables\Actions\…`,
          or Livewire modals for resource create/edit/view. Those are not PanelKit.

        Claude Code: `php artisan panel:blueprint --file=CLAUDE.md`. Cursor: keep this file; install writes `.cursor/rules/panelkit.mdc` when `.cursor/rules` already exists.
        MD;
    }

    /**
     * The rules that fail silently.
     *
     * ORDERED BY WHAT THE FAILURE COSTS, not by how often it happens. Every one
     * of these produces a working-looking screen, which is exactly why they need
     * saying: an agent has no way to notice that a list is missing a predicate.
     */
    private static function rules(): string
    {
        return <<<'MD'
        ## Rules that fail silently

        1. **Never write a controller for a resource screen.** Declare a `Resource`
           subclass. The panel generates the list, the record pages, the routes, the
           permissions and the navigation entry. A hand-written controller bypasses
           the tenant scope and the policy, and looks perfectly fine doing it.

        2. **A resource with no policy is invisible to everybody.** That is the safe
           default, and it looks identical to a permissions bug. Register one:
           `Gate::policy(Model::class, ModelPolicy::class)`.

        3. **Definitions must not query.** `table()` and `form()` build a cached
           description. A query inside one runs before anybody has asked for a row,
           for every user, and can be cached and served to the wrong tenant. Option
           lists that come from the database are closures.

        4. **A null tenant is a deny, never "all tenants".** Every path fails closed.
           If you add a query that reaches around the model - raw SQL, a join, a
           `withoutGlobalScopes()` - you have taken responsibility for the predicate.

        5. **Validate the members of a multi-value field, not just the array.**
           `['array']` accepts `['email', 'anything']`, because the array is an
           array. Fields that hold several values declare a `key.*` rule.

        6. **Never use `window.confirm`.** It is suppressed in embedded browsers: it
           returns false without showing anything, so a destructive action silently
           does nothing for some people and everything for others. Use `PkModal`.

        7. **Do not put a class name in a schema.** Columns, fields and actions emit
           semantic values - an icon NAME, a colour INTENT, a column count - and the
           client decides what those look like.

        8. **Every screen needs a way in.** A page that is in no menu is
           indistinguishable from one nobody wrote. Resources place themselves;
           anything else goes in `App\Panel\Pages` or the coverage test fails.

        9. **Do not rewrite `resources/js/app.ts` layout wiring.** The shell
           comes from `createInertiaApp({ layout: (name) => … })` returning
           `PanelLayout` (settings nest `SettingsLayout`). Packaged screens
           may set `defineOptions({ layout: { breadcrumbs } })` as layout
           PROPS; without the bootstrap callback those props leave a naked
           page (HTTP 200, no sidebar). Forbidden: removing the callback,
           `layout: null` on a panel page, or hand-rolling controllers /
           bare `Inertia::render`. Use `make:panel-resource` /
           `make:panel-page` instead.

        ## Kit conventions

        Dedicated pages only: create, edit, view, attach and detach are routes,
        never a modal and never Livewire. BelongsTo pickers use
        `SelectField::relationship()` and `SelectField::createOption()` for a
        create-and-pick dialog (JSON, not a Livewire modal; resource CRUD stays
        on dedicated pages). Nested resources live at
        `/{parent}/{id}/{child}`; BelongsToMany attach is
        `/{parent}/{id}/{child}/attach`. A fresh install is an empty canvas.
        Settings appears in a Settings sidebar group by
        default (`->sidebarSettings(false)` opts out). Operations appear in an
        Operations nav group when the panel offers them. Catalog is not in core.
        Do not resurrect dashboard sample widgets. `Notification::make()->title('Saved')->success()->send()`
        is the toast. Infolist entries live on the dedicated view page.
        `InteractsWithPanels` is the test trait (assertFormState, assertNestedAttach,
        assertPanelToast, assertEmptyGrantsHint, assertBillingSuspendedRedirect,
        assertBillingAllows, assertBillingWebhookAccepted, assertSuspendedPageRenders).
        MD;
    }

    private static function shape(): string
    {
        $manager = app(PanelManager::class);

        $panels = [];

        foreach ($manager->panels() as $panel) {
            $path = trim($panel->getPath(), '/');

            $panels[] = sprintf(
                '- `%s` - mounted at `/%s`, guard `%s`, %s context',
                $panel->id,
                $path,
                $panel->getGuard(),
                $panel->getContext(),
            );
        }

        $panelList = implode("\n", $panels) ?: '- (none registered)';

        $discover = [];

        foreach ((array) config('panel.discover', []) as $directory => $namespace) {
            $discover[] = '- `'.str_replace(base_path().'/', '', (string) $directory).'` → `'.$namespace.'`';
        }

        $discoverList = implode("\n", $discover) ?: '- (nothing discovered)';

        return <<<MD
        ## Where things live

        Panels registered in this application:

        {$panelList}

        Resources are discovered from:

        {$discoverList}

        A resource belongs to exactly one panel. Its key is a URL segment and an
        ability name, both globally unique. A second portal needing the same screen
        gets a subclass with its own `key()`.

        - Resources: `app/Panel/Resources`
        - Policies: `app/Policies`, extending the tenant-aware base policy
        - Non-resource pages: declared in `app/Panel/Pages`, rendered from `resources/js/pages`
        - Panel providers: `app/Providers/Panels`

        ## Before reporting that something is missing

        THIS SECTION EXISTS BECAUSE THREE SEPARATE REVIEWS GOT THE SAME ANSWER
        WRONG, each by reading the package's own directory tree and concluding a
        feature was absent. Almost nothing this package ships stays where it is
        written, so the tree is the wrong place to look:

        | You are looking for | It is NOT in | It is in |
        |---|---|---|
        | the root view, `app.ts`, the layout | `vendor/alxtexh-enterprise/panel/resources/views` | `resources/stubs/*.stub`, **published into your app** by `panel:install` |
        | the screens (`ResourceIndex`, `auth/Login`, …) | the PHP package at all | `@alxtexh-enterprise/panel/inertia` in `node_modules`, **mirrored** into `resources/js/pages` |
        | sign-in routes | the package's routes | `routes/panel-*-auth.php` in YOUR app, written by `--auth` |

        **`resources/views` holds one file** - the tenant-suspension wall - and
        that is correct: it is the only thing the package renders itself.
        Everything else is published or mirrored, so that you can edit it.

        THE THREE COMMANDS THAT ANSWER THE QUESTION, in order:

        ```bash
        php artisan panel:doctor    # names what is genuinely missing or wrong
        php artisan panel:update    # writes page files a new version added
        composer show alxtexh-enterprise/panel
        ```

        `panel:doctor` reports a packaged screen with no page file, a resource
        or page nothing registered, and - the one that wastes an afternoon - a
        package composer **copied** instead of symlinking from a `path`
        repository. In that arrangement `vendor/` is a snapshot: the fix you
        made is not the code running, and every symptom looks like the feature
        was never built. If doctor is silent on all three, the installation is
        current and the file is somewhere the table above names.

        AND CHECK THE VERSION BEFORE THE CODE. Features arrive in releases: the
        Inertia bootstrap and the mirrored auth screens in 0.5.0, action stubs
        in generated resources in 0.6.0. "It is not there" and "it is not there
        *yet*" are different reports, and `composer show` distinguishes them.
        MD;
    }

    /**
     * The things somebody actually asks for.
     *
     * WHOLE COMMANDS AND WHOLE CLASSES, because a recipe that stops at "then
     * configure the resource" is one an agent finishes by inventing. Each of
     * these is the complete path from nothing to a working screen.
     */
    private static function recipes(): string
    {
        return <<<'MD'
        ## Recipes

        ### Official starter (copy this, do not clone the reference demo)

        After `panel:install`, next is the Get started card **or**:

        ```bash
        php artisan make:panel-recipe Invoices
        # alias: php artisan panel:recipe invoices
        ```

        Writes `InvoiceResource` (number, status, total, dated_at), a model, a
        policy, and a migration. Vue is kit ResourceIndex / ResourceForm /
        ResourceView: do not add a Vue page. Default: no rows (`--seed` for fake
        data, `--migrate` to create the table). Dashboard is already empty.
        Optional packaged wall (not Stripe): uncomment `->apps(['billing-portal'])`
        and `->billingState()` on the panel provider.

        ### MFA at the login door

        `->login()` already honours two-factor from Security. After a correct
        password, a user with TOTP or email OTP confirmed is paused on
        `{panel}/two-factor-challenge` until the code succeeds. Passkeys stay
        a button on the login form. `->twoFactorChallenge(false)` skips the
        pause. `->requireTwoFactor()` (alias `twoFactorRequired()`) is OFF by
        default: when on, a user with no TOTP, email OTP, or passkey is sent
        to Security and cannot reach the dashboard until they enrol.
        `->registration()` / `->emailVerification()` mount register.store and
        the verify notice the way `login()` mounts login. Missing `passkeys`
        table is an empty list, not a 500.

        Social callbacks challenge too: a Google click is not a 2FA bypass.

        ### Social sign-in and Turnstile

        Credentials gate the button list and the OAuth exchange. With
        socialite on, login shows only providers that have both a client id
        and a secret (Google, GitHub, GitLab, Bitbucket, Facebook, LinkedIn,
        Microsoft, Apple, X, Discord, Slack, Twitch when configured). When
        none are configured, the whole social block (including the divider)
        is hidden. `->socialite(['google', 'github'])` narrows the list.
        Without `laravel/socialite` the buttons stay hidden. Microsoft, Apple
        and Discord need a community Socialite driver. Set
        `PANEL_SOCIAL_SHOW_UNCONFIGURED=true` only for a kit showcase that
        wants the full catalogue with muted unconfigured buttons.

        Set `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` for the widget above
        submit. Missing keys: no widget, login works. `->turnstile(false)` opts
        one portal out.

        ### Add a screen for a model

        ```bash
        php artisan make:panel-resource Invoice --generate
        ```

        Then: register a policy, check the columns it guessed, and add filters. The
        route, the navigation entry and the abilities already exist. Nothing needs
        adding to `routes/web.php`.
       
        ### Declare the list itself - columns, filters, tabs

        `--generate` writes a first draft from the table. This is what you edit
        it into. EVERYTHING BELOW IS ONE METHOD - there is no separate place to
        register a filter, wire a tab or add a sort; the schema is the feature.

        ```php
        public static function table(Table $table): Table
        {
            return $table
                ->columns([
                    TextColumn::make('name')->from('routers.name')
                        ->sortable()->searchable()->locked(),

                    // Semantic values, never class names - the client decides
                    // what an icon or a colour intent looks like.
                    IconColumn::make('status')->from('routers.status')->sortable()
                        ->icons(['online' => 'wifi', 'offline' => 'wifi-off'])
                        ->colors(['online' => 'success', 'offline' => 'danger'])
                        ->labels(['online' => 'Online', 'offline' => 'Offline']),

                    DateColumn::make('created_at')->from('routers.created_at')
                        ->sortable()->muted(),
                ])
                ->filters([
                    SelectFilter::make('status')->column('routers.status')
                        ->options(['online', 'degraded', 'offline']),

                    // A CLOSURE for data-derived options, so they resolve per
                    // request against a TENANT-SCOPED query. Building them
                    // eagerly bakes one organisation's values into a schema
                    // every organisation reads.
                    SelectFilter::make('model')->column('routers.model')
                        ->options(fn (): array => Router::query()->toBase()
                            ->select('model')->distinct()->pluck('model')->all()),
                ])
                // The row of counted tabs above the table - "All 40, Online 24,
                // Degraded 8". One line, and the counts are computed for you.
                ->tabs('routers.status', ['online', 'degraded', 'offline'])
                ->keyColumn('routers.id')
                ->defaultSort('created_at', 'desc');
        }
        ```

        Search, sort, pagination, column visibility, density, saved views,
        selection, export and the empty state are NOT in this file because they
        are not optional - they come with the table. What you declare is the
        part that is specific to your data.

        Add `RecordAction` and `BulkAction` to `actions()` and `bulkActions()`;
        every bulk mutation counts before it commits, and long ones queue with a
        `JobStatus`.

        ### Lay a form out - sections, tabs, steps

        Fields go in `form()`, and `Schema` is how they are arranged. Reach for
        `Section` first; `Tabs` when a form is long enough that scrolling loses
        people; `Wizard` ONLY when step two genuinely depends on step one, and
        a form somebody dips into to change one field should never be a wizard.

        ```php
        public static function form(Form $form): Form
        {
            return $form->schema([
                Section::make('Identity')->columns(2)->schema([
                    TextField::make('name')->required(),
                    CountryField::make('country'),
                ]),

                // Shown only when it applies. The condition is declared, not
                // wired up in Vue - the client evaluates it as the form changes.
                Section::make('Billing')
                    ->visibleWhen('plan_type', 'postpaid')
                    ->schema([
                        SelectField::make('cycle')->options(['monthly', 'annual']),
                    ]),
            ]);
        }
        ```

        ### Add a screen that is NOT a list of records

        ```bash
        php artisan make:panel-page ServerHealth
        ```

        A page is one class in `app/Panel/Pages` plus the one-line Vue file the
        command writes. Discovery routes it; the sidebar entry, the ability, the
        permission-matrix row and the page header all follow from the class. Do
        not add a controller and do not touch `routes/web.php` - that is the
        same deal a resource gets, for the same reason.

        ```php
        final class ServerHealthPage extends Page
        {
            public static function component(): string { return 'ServerHealth'; }

            public static function data(Request $request): array
            {
                return ['nodes' => Node::status()];
            }

            // Endpoints this page owns. THE ABILITY IS SEPARATE from the
            // page's own, because seeing a thing and changing it are
            // different grants.
            public static function actions(): array
            {
                return ['restart' => 'restart_nodes'];
            }
        }
        ```

        `uri()` may carry `{parameters}`; the navigation entry uses the path
        with them stripped. A page slug and a resource key share ONE namespace -
        both are URL segments in the same prefix - so a clash throws at boot
        naming both classes rather than leaving one screen unreachable.

        Return `false` from `isEnabled()` for a page that should be ABSENT
        rather than merely hidden. Hidden still routes, and a routed screen the
        menu never shows is how a package quietly takes a URI the application
        was already using.

        ### Add a SaaS plan catalogue

        ```bash
        php artisan make:panel-page BillingPlans --plan-setup
        ```

        `PlanSetupPage` supplies plan data. The generated Vue is empty: import
        `PlanGrid` and `PlanEditor` from `@alxtexh-enterprise/panel`. `modules()`
        and `limits()` default from the panel module registry. Persist to your
        models. Numeric limits use -1 for Unlimited.
        A SaaS MUST set `ModuleRegistry::grants()` from the active plan;
        until that callback is set, every registered module stays enabled.
        A child key (`->requires()` / `->children()`) is enabled only when every
        parent is also granted. `PlanSetupPage::save()` expands parents via
        `ModuleRegistry::applyGrants()`, which also runs `onGrant` once per newly
        granted key. `Panel::subscriptionGate()` is an opt-in expiry wall:
        company (tenant) users go to plan setup; staff on a central panel get 403.
        Discovered screens set `protected static ?string $module = 'campaigns'`
        so an ungranted key 403s and drops out of the sidebar. Hand-written
        routes still use `panel.module:campaigns`. PanelKit itself is not
        locked to a paid SKU.

        ```bash
        php artisan make:panel-module campaigns
        ```

        ```php
        use Alxtexh\Panel\Support\Module;
        use Alxtexh\Panel\Support\ModuleRegistry;

        Panel::make('admin')->modules([
            Module::make('accounting')->label('Accounting')->children(['double-entry']),
            Module::make('double-entry')->label('Double entry')->requires(['accounting']),
            Module::make('campaigns')
                ->label('Campaigns')
                ->description('Outbound campaigns')
                ->planLimit(kind: 'number')
                ->usage(fn (): int => Campaign::query()->count()),
        ]);

        ModuleRegistry::grants(fn (): array => $org->plan->moduleKeys());
        ModuleRegistry::caps(fn (): array => $org->plan->moduleCaps());
        // Opt-in. Leave unset so a playground install is not locked out.
        // Panel::make('admin')->subscriptionGate(fn (): bool => $org->planIsActive());
        ```

        ### Plug a billing webhook adapter

        The inbound contract is provider-agnostic. POST
        `{panel}/billing/webhooks/{adapter?}`. Verify the signature header, then
        map the payload to `billable_key` + `status`. Not a marketplace, not
        locked to one processor.

        ```php
        use Alxtexh\Panel\Billing\GenericBillingWebhookAdapter;
        use Alxtexh\Panel\Panel;

        Panel::make('admin')
            ->apps(['billing-portal'])
            ->billingState()
            ->billingWebhookVerifier(GenericBillingWebhookAdapter::verifier(
                (string) config('services.billing.webhook_secret'),
                'X-Webhook-Signature',
            ))
            ->billingWebhookMapper(GenericBillingWebhookAdapter::mapper());
        ```

        `GenericInboundBillingMapper` already accepts `billable_type`,
        `billable_key`, `status`, `period_end_at`, `grace_ends_at`,
        `provider_ref`. Copy `examples/generic-billing-webhook.php` to map a
        gateway's own event names onto those keys. See docs/13-billing-adapters.md.

        ### Add a dashboard

        ```bash
        php artisan make:panel-page Overview --dashboard
        ```

        A `DashboardPage` can declare `stats()`, `charts()` and `tables()`. The generated Vue
        is an empty canvas: import `StatCard` / `ChartCard`, or return
        `PanelDashboard` from `component()` to use the packaged screen.

        ```php
        final class OverviewPage extends DashboardPage
        {
            public static function stats(): array
            {
                return [
                    StatWidget::make('clients', 'Clients')
                        ->value(fn () => Client::count())
                        ->visibleTo(fn ($user) => $user->can('view_any_clients')),
                ];
            }

            public static function tables(): array
            {
                return [
                    TableWidget::make('recent')->resource(OrderResource::class)->limit(5),
                ];
            }
        }

        Panel::make('admin')->discoverWidgets(app_path('Panel/Widgets'));
        ```

        EVERY WIDGET IS ITS OWN DEFERRED PROP, so the layout is on screen before
        anything has been counted and one slow aggregate delays itself rather
        than the page. `visibleTo` is applied BEFORE resolution - a widget
        somebody may not see is never queried and never serialised, because
        filtering it client-side would ship the number to them and rely on CSS
        to keep the secret.

        `->live('dashboard.stats')` prefers Echo/Reverb when `window.Echo` exists.
        `->poll('10s')` on `StatWidget`, `TableWidget` or `ChartWidget` is the HTTP
        fallback and reloads only that widget. Polling pauses while the tab is hidden.
        Never poll and subscribe for the same widget. Redis is infrastructure,
        not a UI transport.

        ### Add a till, catalog or device preview

        ```bash
        php artisan make:panel-page Front --till
        php artisan make:panel-page Browse --catalog
        php artisan make:panel-page Preview --device-preview
        ```

        `TillPage` / `CatalogBrowserPage` / `DevicePreviewPage` are empty canvases.

        Mail and Chat are opt-in empty apps, not merchandising:

        ```php
        Panel::make('admin')->apps(['mail', 'chat']);
        Panel::make('admin')->apiDocs();
        Panel::make('admin')->kitShowcase();
        Panel::make('admin')->webhooks();
        Panel::make('admin')->apps([
            'api-keys', 'invites', 'billing-portal', 'email-templates',
            'onboarding', 'media-library', 'feature-flags',
        ]);
        ```

        `kitShowcase()` mounts a domain-neutral kit demo (fields, ColumnGroup,
        TagsColumn, widgets) at `{panel}/apps/showcase`. Keep vertical demos
        on separate host pages.

        SaaS stubs include `--webhooks`, `--billing-portal`, `--email-templates`,
        `--onboarding`, `--media-library`. Webhooks live in `packages/panel/src/Webhooks/`.
        Dispatch with `WebhookDispatcher::dispatch('invoice.paid', $payload)`.

        `->without(['mail'])` still drops a screen you enabled. Appearance
        persists on PUT `{panel}/settings/appearance` (users.appearance JSON).
        Feedback is `Panel::feedback($persist)` plus the exported
        `FeedbackDialog`. Ticket analysis is the packaged `TicketAnalysis`
        screen, written on install, mounted by `TicketingPlugin`.

        ### Flash a toast the Filament way

        ```php
        Notification::make()->title('Saved')->success()->send();
        Notification::make()->title('Queued')->body('Export started')->bell()->send();
        Notification::make()
            ->title('Invoice posted')
            ->success()
            ->actions([
                Action::make('view')->url($url),
                Action::make('download')->url($download)->openUrlInNewTab(),
            ])
            ->send();
        ```

        This is the Inertia toast, not a Livewire stack. `bell()` also writes a
        topbar row. Action buttons are hrefs (or `method('post')` to a named
        route). Closures do not travel to Vue.

        ### Infolist on the dedicated view page

        ```php
        public static function infolist(): array
        {
            return [
                TextEntry::make('name'),
                ImageEntry::make('photo'),
                RepeatableEntry::make('lines'),
            ];
        }
        ```

        View is a page. Click POSTs `{ action }` to `{resource}/{id}/infolist-action`.

        ### Group several resources under one sidebar entry

        Write a `Cluster` class and point each member's `$cluster` at it. The
        sidebar shows the cluster's label once; the members become a shared
        sub-navigation on every screen inside, permission-filtered per person.
        Use a cluster for facets of ONE subject; keep an ordinary `$group` for
        peers someone jumps between from anywhere.

        ```php
        final class NetworkCluster extends Cluster
        {
            protected static string $icon = 'router';
        }

        // on each member resource:
        protected static ?string $cluster = NetworkCluster::class;
        ```

        ### Add a one-record settings screen

        A `SingularResource` is a form and two functions - no list, no create,
        no hand-written controller. Declare the form exactly as a resource
        does, say where the one record's values come from and go to, list the
        class in `config('panel.singulars')`, and the screen mounts at
        `/{key}` with `PUT /{key}/current` as its save. Gate it with a
        panel-level ability from `config('panel.abilities')`.

        ```php
        final class BillingSettingsResource extends SingularResource
        {
            public static function form(Form $form): Form { /* fields */ }
            public static function values(): array { /* current state */ }
            public static function save(array $validated): void { /* persist */ }
            public static function ability(): ?string { return 'manage_billing'; }
        }
        ```

        ### Nest a resource under another

        Declare `$parent` and the resource answers ONLY at
        `/clients/{id}/sessions` - the flat URL does not route, because the
        parent segment is the authorisation context: every request resolves
        the parent through its own tenant-scoped model, checks `view` on it,
        constrains the list to its rows, and stamps the foreign key on create
        from the URL, never from the form body. Dedicated pages only, never a
        modal, never Livewire. Use it when the child only makes sense inside
        one parent record; a relation manager remains the right tool for a
        glance on the parent's own page.

        BelongsToMany: set `$relationship` to the parent model's method. The
        nested index lists attached rows; `/{parent}/{id}/{child}/attach` picks
        existing records; detach is a row action. Another tenant's id is a 404,
        not a 403.

        ```php
        final class ClientSessionResource extends Resource
        {
            protected static string $model = ClientSession::class;
            protected static ?string $parent = ClientResource::class;
            // HasMany: foreign key defaults to client_id; override with $parentColumn
            // BelongsToMany: protected static ?string $relationship = 'tags';
        }
        ```

        ### Add markup to a screen you do not own

        A plugin can put a component at a NAMED position on an existing
        screen, instead of forking it. Positions come from `RenderHooks`; a
        typo is refused at registration rather than rendering nowhere. Scope
        it to resource keys, or leave it null for every screen.

        ```php
        $context->render(
            RenderHooks::LIST_BEFORE_TABLE,
            'TrialNotice',                 // resolved by the APP's registry
            ['daysLeft' => 3],
            ['clients'],                   // this resource only
        );
        ```

        The application decides what that name resolves to
        (`registerRenderHookComponent`), because a component name straight
        from the server would let a plugin mount anything in the bundle.

        ### Add a portal

        ```bash
        php artisan make:panel reseller --path=reseller --auth
        ```

        A provider, a resource directory and the routes. `--auth` adds sign-in,
        sign-out and password reset bound to THIS panel's guard, under its own
        prefix - never at `/login`, so a starter kit's own sign-in is untouched.
        Use `--central` only for a portal that must see every organisation at
        once; it turns tenant scoping off.

        DROP THE PACKAGED SCREENS A PORTAL SHOULD NOT HAVE. Trash, the
        permission matrix and the document designer mount on every panel unless
        told otherwise, which for a customer-facing portal means an environment
        for records its readers never delete and a letterhead designer for
        invoices they only receive:

        ```php
        Panel::make('reseller')->without(['trash', 'roles', 'documents'])
        ```

        THE ROUTE GOES, not the menu entry - hiding an entry leaves the URL
        answering, and a bookmark reaches it however the sidebar looks.

        ### Show an amount of money

        `MoneyColumn`, not a `TextColumn` with a prefix and not two columns.

        ```php
        MoneyColumn::make('amount')->currency('KES')->sortable(),

        // ...or, when rows differ:
        MoneyColumn::make('amount')->currencyFrom('currency_code'),
        ```

        MINOR UNITS BY DEFAULT - the stored value is an integer count of the
        smallest unit, because money in a float drifts and a total out by a cent
        is a support ticket nobody can reproduce. Call `->major()` for a column
        that genuinely stores decimals.

        FORMATTED IN THE VIEWER'S LOCALE, in the browser, like dates. Formatting
        on the server prints the SERVER's grouping and decimal separators to
        everybody, which is wrong for most of the world.

        ### Choose the right text field

        - `TextareaField`: plain text, no formatting.
        - `MarkdownField`: prose whose SOURCE you want stored: diffable in an
          audit entry, readable in a database client, renderable to email, PDF
          or plain text later.
        - `RichEditorField`: prose stored as sanitised HTML, when the stored
          value IS the rendering.
        - `CodeField`: config and snippets: monospace, Tab indents, line
          numbers, and `->language('json')` adds a server-side `json` rule.
        - `BuilderField`: blocks of DIFFERENT shapes in a chosen order
          (heading, paragraph, image). A `RepeaterField` is many rows of ONE
          shape; reach for the builder only when the shapes genuinely differ.

        A builder drops any block type or inner field it did not declare, on
        the way to storage - the same allow-list posture as `Form::sanitize()`.

        ### Add a field type

        Subclass `Field`, return a new `type()`, add your keys to `toSchema()`, and
        register a Vue control for that type with `registerFieldControl('your-type',
        Control)`. An option-bearing field must also override `resolveOptions()`, or
        it renders with nothing to choose and reports no error.

        ### Add a permission-gated action

        ```php
        RecordAction::make('suspend')
            ->label('Suspend')->icon('ban')->ability('update')
            ->confirm('Suspend this account? They lose access immediately.')
            ->run(fn (Customer $customer) => $customer->update(['status' => 'suspended']));
        ```

        The ability is checked against THAT record before the button renders and
        again before it runs.

        ### Write a policy - extend the base, do NOT hand-roll one

        `TenantResourcePolicy` ships. It checks tenancy first and the role
        second, both required, and re-asserts ownership on every record-level
        call. `make:panel-resource --generate` already writes this for you.

        ```php
        final class InvoicePolicy extends TenantResourcePolicy {}
        ```

        TO ADD A RULE, override a method - and USE THE BASE CLASS'S PARAMETER
        TYPE EXACTLY:

        ```php
        public function delete(Authenticatable&Authorizable $user, ?Model $record = null): bool
        {
            if ($record instanceof Invoice && $record->isPaid()) {
                return false;
            }

            return parent::delete($user, $record);
        }
        ```

        NOT `delete(User $user, ...)`. PHP forbids narrowing a parameter in an
        override, so your own model class there is a COMPILE-TIME fatal thrown
        while the class loads - reported as "Premature end of PHP process" under
        PHPUnit and a blank page in a browser. Reach for your model INSIDE the
        method with `instanceof`.

        ### Announcements are already there

        A notice addressed to everybody in the organisation: composed on a
        packaged screen, rendered as a banner at the top of any `DashboardPage`,
        dismissed per person into that person's notifications. DO NOT BUILD A
        NOTIFICATIONS BANNER - this is it.

        `AnnouncementsPlugin` is in the package's default `plugins` and needs no
        configuration. If the application has a PUBLISHED `config/panel.php`,
        its `plugins` array replaces the package's whole, so the entry has to be
        added there by hand:

        ```php
        'plugins' => [Alxtexh\Panel\Alerts\AnnouncementsPlugin::class],
        ```

        ### Watch a condition - do NOT write a notifications endpoint

        THE BELL IS ALREADY IN THE TOPBAR, and it already serves both streams
        from `{panel}/notifications`. What is NOT in the package is what YOUR
        business considers wrong, because that names your models. Declare it:

        ```php
        // In a service provider's boot(PanelManager $panels).
        $panels->alertRule(AlertRule::make('unpaid_invoices', function (): ?Alert {
            $count = AlertRule::countUpTo(Invoice::query()->where('status', 'overdue')->toBase());

            return $count === 0 ? null : Alert::make(
                'unpaid_invoices',
                Alert::WARNING,
                AlertRule::describeCount($count).' invoices are overdue',
                'Chase these before the month closes.',
                '/invoices?status=overdue',
                $count,
            );
        }));
        ```

        RETURN `null` WHEN THE CONDITION DOES NOT HOLD. "No alert" is the
        normal, healthy answer, and modelling it as null rather than a
        zero-severity alert saves every caller from filtering non-alerts.

        USE `countUpTo` FOR ANYTHING THAT MIGHT MATCH A LOT. It stops at 500 and
        `describeCount` renders "500+". "84,846 accounts have lapsed" and
        "500+ accounts have lapsed" prompt the same action, and only one of
        them costs a fifth of a second every time somebody opens the bell.

        AN ALERT IS NOT A NOTIFICATION. An alert is what is TRUE NOW: recomputed
        on every open, no read state, gone when the condition clears. A
        notification is what HAPPENED to one person: stored, read-marked,
        deleted when they say so. Write the second with Laravel's own
        `$user->notify()` and a `data` array carrying `title`, `body`, `href`
        and `severity` - that is the shape the bell renders. The badge counts
        unread NOTIFICATIONS only, so a persistent condition never leaves it lit.

        ### Turn on ticketing - do NOT write one

        A support desk ships in the package: two resources over one table, the
        policy that separates the two sides, the thread, departments, unread
        indicators, a first-response stamp and a stats screen. THERE IS NO SLA
        TARGET - `TicketStats` reports how long first replies took, and nothing
        stores how long they were meant to take. Do not write code against a
        `due_at`; there is no such column. AN AGENT ASKED FOR "SUPPORT
        TICKETS" MUST TURN THIS ON RATHER THAN BUILD IT. A hand-rolled one gets
        the two-sided authorisation wrong, and that failure is a customer
        reading another customer's ticket.

        ```php
        // config/panel.php
        'ticketing' => [
            'operator' => 'admin',   // the queue: the organisation's tickets
            'opener' => 'portal',    // a customer's own, and only their own
        ],
        ```

        BOTH OR NEITHER. Naming one and not the other throws at boot, and so
        does naming ONE portal for both ends - the customer side would not be
        mounted at all. Neither key set is off: no route, no navigation entry,
        no error. There is no "internal queue only" configuration; a queue
        nobody can write to has nothing in it.

        The tables are `panel.ticketing.tables` - `panel_tickets` and
        `panel_ticket_replies` by default. An installation that already has
        ticket tables points these at them and migrates nothing.

        `TicketOpened` is the extension point: listen to it for a webhook, an
        email to a rota, a row in your own queue. The packaged listener alerts
        on urgent tickets over Telegram. A LISTENER MUST NOT THROW - a failed
        notification is one somebody misses, a failed save is a complaint that
        vanished.

        ### An action that asks for something first

        Most row actions in a real panel need a value before they can do
        anything - a reason, an amount, a plan, a department. `->form()` collects
        it; do NOT write a screen for this.

        ```php
        RecordAction::make('change-plan', 'Change plan')
            ->authorize('update')
            ->form(fn (Form $form): Form => $form->schema([
                SelectField::make('plan_id')->required()
                    ->searchable(fn (string $t): array => Plan::where('name', 'like', $t.'%')
                        ->limit(25)->pluck('name', 'id')->all())
                    ->rule(ExistsInScope::of(Plan::class)),

                TextareaField::make('note')->rule('max:280'),
            ]))
            ->handle(fn (Client $client, array $data) => $client->moveTo($data['plan_id']));
        ```

        `form()` PAIRS WITH `handle()`, NEVER `mutate()` - a mutation is fixed at
        definition time and has nowhere to put what a person typed. Declaring
        both throws.

        THE FIELDS ARE DECLARED HERE AND THAT IS THE SECURITY PROPERTY. The
        endpoint validates against THIS declaration's rules and drops every key
        it does not name, so a request carrying `status` alongside `plan_id`
        has that key discarded rather than written. Never trust `$data` to
        contain only what you declared by reading it carelessly - it does, and
        the reason it does is here rather than in the handler.

        THE MODAL OPENS WITH NO REQUEST, because the schema travels with the
        action in the list payload.

        THE SAME `->form()` IS ON `BulkAction`, and it asks ONCE for the whole
        selection - which is the entire reason "move these forty to a plan" is
        a bulk action rather than forty clicks:

        ```php
        BulkAction::make('move-plan', 'Move to plan')
            ->authorize('update')
            ->form(fn (Form $form): Form => $form->schema([
                SelectField::make('plan_id')->required()
                    ->rule(ExistsInScope::of(Plan::class)),
            ]))
            ->handle(fn (Collection $records, array $data) => $records
                ->each->update(['plan_id' => $data['plan_id']]));
        ```

        THE HANDLER RUNS ONCE PER CHUNK, not once per record, and receives the
        SAME collected values every time - `BulkRunner` walks the selection in
        keyset chunks. Values are validated BEFORE the job is queued, so a
        select-all-matching run that is going to fail on `plan_id` fails in the
        response the operator is reading rather than in a worker's log.

        ### Optionally, ship it as a host-owned package

        When a feature belongs in more than one project, implement `PanelPlugin`
        and register resources, pages and routes through the `PluginContext`. A
        plugin can only add; it never receives the `Panel`. This is for your own
        first-party packages, not a third-party marketplace. Build features
        in-app first; extract a plugin only when reuse across projects justifies it.
        MD;
    }

    /**
     * What this installation actually contains.
     *
     * GENERATED FROM THE REGISTRY, which is the whole reason this file is a
     * command rather than a document somebody maintains. An agent told about a
     * resource that was deleted last week will confidently write code against it.
     */
    private static function inventory(): string
    {
        $manager = app(PanelManager::class);

        $rows = [];

        foreach ($manager->resources() as $key => $class) {
            $rows[] = sprintf(
                '| `%s` | `%s` | `%s` |',
                $key,
                class_basename($class),
                $manager->panel($class::panel()) !== null ? $class::panel() : 'unregistered',
            );
        }

        if ($rows === []) {
            return '';
        }

        $table = implode("\n", $rows);

        return <<<MD
        ## Resources in this installation

        | Key | Class | Panel |
        | --- | --- | --- |
        {$table}

        Ability names are derived from the key: `view_any_clients`, `update_clients`,
        `restore_clients`, `force_delete_clients`.
        MD;
    }

    /**
     * WHAT OPERATORS OWN, not what developers wrote - roadmap 7.4.
     *
     * Everything above this describes the code: resources, panels, recipes for
     * adding one. That was enough while an agent's only job was "add a screen
     * for a model". Once operators own document TEMPLATES, announcement COPY
     * and alert RULES, an agent asked to "add a receipt template matching our
     * invoice" is working with a vocabulary nothing tells it - and the failure
     * is silent in the specific way this whole codebase is written against: an
     * unknown variable is printed as written, so the receipt reads `@expiry`
     * where a date belongs and renders perfectly.
     *
     * GENERATED FROM THE SAME REGISTRIES THE PANEL READS, which is the only
     * reason this is worth doing at all. A hand-written list of variables is a
     * list that drifts, and an agent writing against a drifted list produces
     * something that looks right and prints wrong. Nobody else can generate
     * this: it needs a registry of what exists, which the schema layer already
     * is.
     */
    private static function operatorOwned(): string
    {
        $sections = array_filter([
            self::documentVocabulary(),
            self::announcementVocabulary(),
            self::alertRules(),
        ]);

        if ($sections === []) {
            return '';
        }

        return "## What operators configure\n\n"
            ."These are edited in the panel, not in code. An agent asked to add or\n"
            ."change one needs the vocabulary below - the variables are the part that\n"
            ."fails silently, because an unrecognised token is printed as written\n"
            ."rather than blanked.\n\n"
            .implode("\n\n", $sections);
    }

    /**
     * Every document kind and the variables its templates may use.
     *
     * THE VARIABLES ARE THE POINT. A kind's name an agent could guess; its
     * variable list it cannot, and getting one wrong produces a document that
     * renders with `@total` printed on it.
     */
    private static function documentVocabulary(): string
    {
        if (! class_exists(Documents\DocumentKinds::class)) {
            return '';
        }

        $kinds = app(Documents\DocumentKinds::class)->all();

        if ($kinds === []) {
            return '';
        }

        $rows = [];

        foreach ($kinds as $kind) {
            $variables = array_keys($kind->variables());

            $rows[] = sprintf(
                '| `%s` | %s | %s |',
                $kind->id(),
                $kind->label(),
                $variables === [] ? '_none_' : '`'.implode('`, `', $variables).'`',
            );
        }

        $table = implode("\n", $rows);

        return <<<MD
        ### Document templates

        | Kind | Label | Variables a template may use |
        | --- | --- | --- |
        {$table}

        A template is a row in `panel_document_templates` scoped to one tenant, edited
        through the designer. Register a NEW kind by extending `DocumentKind` and
        adding it to `DocumentKinds` from a service provider - registering under an
        existing id REPLACES it, which is how an application teaches the package's
        invoice about its own records.

        `panel:doctor` reports a template using a variable its kind does not declare,
        and one whose accent colour fails contrast against white.
        MD;
    }

    /** The tokens an announcement or a scheduled report may contain. */
    private static function announcementVocabulary(): string
    {
        $variables = Alerts\Announcement::variables();

        if ($variables === []) {
            return '';
        }

        $rows = [];

        foreach ($variables as $token => $meaning) {
            $rows[] = sprintf('| `%s` | %s |', $token, $meaning);
        }

        $table = implode("\n", $rows);

        return <<<MD
        ### Announcement and report copy

        | Token | Means |
        | --- | --- |
        {$table}

        One declaration feeds three things: the chip strip in the composer, the
        substitution at delivery, and `panel:doctor`'s check. Adding a token means
        adding it to `Announcement::variables()` - anywhere else and two of the three
        will not know about it.
        MD;
    }

    /**
     * When the panel decides to interrupt somebody, and where that is set.
     *
     * AN AGENT ASKED TO "ALERT US ABOUT X" WILL OTHERWISE ADD A CHANNEL. The
     * useful answer is almost always a threshold in config, because the
     * channel already exists and the hard part of alerting is deciding what
     * is worth saying - see how narrowly each of these is set, and why.
     */
    private static function alertRules(): string
    {
        $ticketing = (array) config('panel.ticketing.alert_priorities', []);

        $ticketRate = sprintf(
            '%s an hour, %s a day',
            (int) config('panel.ticketing.max_per_hour', 0) ?: 'unlimited',
            (int) config('panel.ticketing.max_per_day', 0) ?: 'unlimited',
        );

        $priorities = $ticketing === [] ? '_not configured_' : '`'.implode('`, `', $ticketing).'`';

        return <<<MD
        ### When the panel interrupts somebody

        | Rule | Where | Currently |
        | --- | --- | --- |
        | Which ticket priorities page the desk | `panel.ticketing.alert_priorities` | {$priorities} |
        | How many tickets one person may open | `panel.ticketing.max_per_hour` / `max_per_day` | {$ticketRate} |
        | Monitoring thresholds | Monitoring settings, per tenant | edited in the panel |
        | Backup staleness | `BackupStatus`, 26 hours | fixed |
        | Doctor's daily report | `panel:doctor-alert`, scheduled | changes only |

        EVERY ONE OF THESE IS SET NARROWLY ON PURPOSE. A channel people mute is
        worse than no channel - it keeps working and nobody reads it. Widen a
        threshold deliberately; do not add a second channel because the first was
        too quiet.
        MD;
    }

    private static function commands(): string
    {
        $lines = [];

        foreach (Artisan::all() as $name => $command) {
            if (! str_starts_with($name, 'panel:') && ! str_starts_with($name, 'make:panel')) {
                continue;
            }

            $lines[] = '- `php artisan '.$name.'` - '.$command->getDescription();
        }

        sort($lines);

        $list = implode("\n", $lines);

        return <<<MD
        ## Commands

        {$list}
        MD;
    }

    /**
     * How to know it worked.
     *
     * THE MOST VALUABLE SECTION FOR AN AGENT, because the failure modes here are
     * invisible: a screen that renders is not a screen that is scoped, and a
     * suite that passes is not a suite that covered the new resource.
     */
    private static function verification(): string
    {
        return <<<'MD'
        ## Before you call it done

        ```bash
        php artisan panel:doctor        # configuration that is silently wrong
        php artisan test                # the suite
        npx vue-tsc --noEmit            # the client half
        ```

        For a new resource, write these three assertions first. They are the
        failures that return 200:

        ```php
        use Alxtexh\Panel\Testing\InteractsWithPanels;

        $this->assertResourceRegistered('invoices');
        $this->assertTenantIsolation($this->operator, 'invoices', $foreignRecord);
        $this->assertResourceRefuses($this->stranger, 'invoices');
        ```

        `assertTenantIsolation` checks the record URL as well as the list. The list
        is the obvious half; the record URL is the half people forget, and the one
        an attacker uses.

        Also assert the HTTP surfaces that are easy to skip: `assertFormState`
        (`{ options, schema, values }`), nested `assertNestedAttach` /
        `assertNestedDetach`, `assertInfolistAction`, `assertNotImportable` vs
        `assertPanelImports` plus `assertImportFailuresDownload`,
        `assertPanelToast` / `assertEmptyGrantsHint` for a signed-in account with
        no abilities, `assertBillingSuspendedRedirect` / `assertBillingAllows` /
        `assertBillingWebhookAccepted` / `assertSuspendedPageRenders` for the
        packaged billing wall, and `assertResourceRegistered`.
        MD;
    }
}
