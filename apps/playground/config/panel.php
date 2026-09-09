<?php

declare(strict_types=1);
use Alxtexh\Panel\Alerts\AnnouncementsPlugin;
use Alxtexh\Panel\Ticketing\TicketingPlugin;
use App\Knowledge\GuideSource;
use App\Knowledge\HelpSource;
use App\Models\SavedView;
use App\Models\Tenant;
use App\Panel\Singulars\BillingSettingsResource;

return [

    /*
    |---------------------------------------------------------------------------
    | Extra panel abilities
    |---------------------------------------------------------------------------
    |
    | Panel-level abilities this ISP back-office defines, as `name => label`.
    |
    | THESE EXIST BECAUSE A DASHBOARD IS NOT ONE SECRET. The support rota needs
    | the connection counts and must not see what the business is earning; the
    | finance desk is the other way round. Without a name for that distinction
    | the only choices were "show everybody the revenue" or "take the dashboard
    | away", and both are the wrong answer to a real question.
    |
    | TWO, NOT THIRTY. One ability per widget would be honest and unusable - a
    | permission matrix with thirty dashboard checkboxes is one nobody reads, and
    | an unread matrix gets ticked wholesale, which grants more than a coarse one
    | ever would. These are the two cuts this business actually makes.
    |
    | The labels live here because they are what appears on the matrix, and a
    | checkbox reading `view_commercial_widgets` is a question rather than a
    | description. See `DashboardController::COMMERCIAL`, which is what tags the
    | widgets, and `Abilities::extra()`, which is what makes the names real.
    */
    'abilities' => [
        'view_commercial_widgets' => 'Dashboard: sign-ups, plans and renewals',
        'view_network_widgets' => 'Dashboard: sessions, routers and service areas',
        /*
         * A SEPARATE ABILITY, not folded into manage_roles: whoever holds
         * this configures which AI provider reads the organisation's
         * questions and pays that provider's bill. That is an act worth
         * being able to grant and withhold on its own.
         */
        'manage_assistant' => 'Configure the AI assistant and its provider key',
        // Gates the billing preferences singular (roadmap 4.3): whoever holds
        // it decides what every invoice says about money.
        'manage_billing' => 'Set the currency, tax rate and due window invoices use',
        // Part G.4: with the dedicated screen removed, defining a custom
        // field is one dialog on the record forms, gated by one grant.
        'manage_custom_fields' => 'Add custom fields to records from their forms',
        'support.update' => 'Edit Help, FAQ, What\'s new and About',
    ],

    /*
     | THE THREE TABLES THIS APPLICATION'S OWN MIGRATION gave a `custom` column
     | to - see `reserve_custom_field_storage`. The package no longer assumes
     | them; an installation declares what its schema actually has.
     */
    'custom_fields' => [
        'resources' => ['clients', 'routers', 'plans'],
    ],

    /*
    |---------------------------------------------------------------------------
    | Sidebar navigation
    |---------------------------------------------------------------------------
    |
    | Every group in the sidebar defaults to a collapsible dropdown - the only
    | presentation there was until `static_groups` existed. A name listed here
    | renders instead as a plain, always-open SECTION: a small-caps heading with
    | its items underneath, no chevron, nothing to open or close.
    |
    | WHICH GROUPS EARN THAT IS AN INSTALLATION'S CALL, not the component's -
    | `SharePanelProps` reads this list rather than deciding for every panel.
    | The two named here are the ones a support conversation is almost always
    | about: the subscriber themselves, and the audit trail of who did what to
    | their account. Everything else - Building, Apps, Configuration, Screens -
    | is reached rarely enough that a collapsed-by-default dropdown is the
    | right amount of visual weight.
    |
    | "Network" is deliberately NOT here - it is a CLUSTER (see
    | `RouterResource::$cluster`), a different sidebar mechanism with its own
    | always-expanded presentation, not a `group` string this list matches.
    */
    'navigation' => [
        'static_groups' => ['Subscribers', 'Organisation'],
    ],

    /*
    |---------------------------------------------------------------------------
    | Singular resources
    |---------------------------------------------------------------------------
    |
    | One-record, settings-shaped screens - roadmap 4.3. Each mounts at /{key}
    | inside its panel with PUT /{key}/current as its save, and renders through
    | the same form page every resource edit screen uses.
    */
    /* Public marketing pages are owned by this application, not PanelKit. */
    'singulars' => [
        BillingSettingsResource::class,
    ],

    /*
    |---------------------------------------------------------------------------
    | Demonstration switches
    |---------------------------------------------------------------------------
    |
    | Things this reference app can show that a real installation should not.
    |
    | `broken_widget` puts a permanently failing card on the dashboard, which is
    | how the failure-isolation behaviour is DEMONSTRATED - one widget throwing
    | must not take the page down. It shipped enabled for a long time, and a
    | permanently red card teaches every reader to ignore red cards. The
    | behaviour is proved by a test now; this only makes it visible on request.
    */
    'demo' => [
        'broken_widget' => env('PANEL_DEMO_BROKEN_WIDGET', false),
    ],

    /*
    |---------------------------------------------------------------------------
    | Role templates
    |---------------------------------------------------------------------------
    |
    | Starting points for a new role, on top of the generic ones the package
    | ships (read only, editor, manager).
    |
    | THESE ARE THE BUSINESS'S ROLES, which is why they are here and not in the
    | package. "Support" means something specific at an ISP - see everything,
    | correct a subscriber's details, never touch billing or permissions - and a
    | framework guessing at that would ship a confidently wrong default.
    |
    | A TEMPLATE ONLY FILLS THE MATRIX. What comes out is an ordinary role,
    | editable afterwards, with nothing recording where it came from - see
    | `RoleTemplates` for why keeping that link would be a second permission
    | system.
    |
    | `resources` names resource KEYS; unregistered ones are skipped, and each
    | action is intersected with what that resource actually supports.
    */
    'role_templates' => [
        'support' => [
            'name' => 'Support desk',
            'description' => 'Sees everything, fixes subscriber details, sees the network but not the money.',
            'actions' => ['viewAny', 'view', 'update'],
            'resources' => ['clients', 'routers', 'plans', 'activities'],
            'panel' => ['view_network_widgets'],
        ],

        'finance' => [
            'name' => 'Finance',
            'description' => 'Subscribers and plans with the commercial figures; no network internals.',
            'actions' => ['viewAny', 'view', 'create', 'update'],
            'resources' => ['clients', 'plans', 'editable-plans'],
            'panel' => ['view_commercial_widgets'],
        ],

        'network' => [
            'name' => 'Network operations',
            'description' => 'Routers and connections, plus the operations screens. No customer edits.',
            'actions' => ['viewAny', 'view', 'create', 'update'],
            'resources' => ['routers'],
            /*
             | `view_operations` WITHOUT `manage_backups`. Everyone on an
             | operations rota should be able to see whether last night's backup
             | ran; deleting a snapshot and restoring over the live database is a
             | much smaller circle, and a template is exactly where that
             | distinction gets quietly collapsed.
             */
            'panel' => ['view_network_widgets', 'view_operations'],
        ],
    ],

    /*
    |---------------------------------------------------------------------------
    | Schema cache
    |---------------------------------------------------------------------------
    |
    | The resource schema travels once per session and is cached. Spec §9 item 2:
    | the cache key MUST include the tenant id and a permission fingerprint. A
    | key of `panel:schema:clients` serves one tenant's schema to another, and
    | one role's actions to a role that lacks them.
    |
    | Key shape: panel:schema:{panelId}:{resource}:{tenantId}:{permissionsHash}:{appVersion}
    |
    */
    'schema_cache' => [
        /*
        | OFF in local by default.
        |
        | The key carries an app version, not a hash of the definition, so
        | editing a resource class does NOT invalidate its cached schema. In
        | production that is correct - a deploy changes the version. In
        | development it means every schema edit appears to do nothing until
        | someone remembers to clear the cache, which is antipatterns S4.2
        | ("poisoned keys outlive the fix") reproduced daily.
        |
        | It caught us within minutes of the cache going in: a column suffix was
        | added and the table kept rendering the old schema.
        */
        'enabled' => env('PANEL_SCHEMA_CACHE', env('APP_ENV') !== 'local'),
        'store' => env('PANEL_SCHEMA_CACHE_STORE'), // null = default store
        'ttl' => 3600,
    ],

    /*
    |---------------------------------------------------------------------------
    | Pagination
    |---------------------------------------------------------------------------
    |
    | Spec §10: never block a list response on COUNT(*). Above `keyset_threshold`
    | rows a resource uses keyset pagination and exposes "load more" rather than
    | page numbers, because OFFSET 100000 forces the database to walk 100,000
    | rows while WHERE (sort_col, id) < (?, ?) uses the index.
    |
    */
    'pagination' => [
        'default_per_page' => 10,
        'per_page_options' => [10, 25, 50, 100],
        'keyset_threshold' => 10_000,
        'count_strategy' => env('PANEL_COUNT_STRATEGY', 'deferred'), // deferred|approximate|none
    ],

    /*
    |---------------------------------------------------------------------------
    | Table rendering
    |---------------------------------------------------------------------------
    */
    'table' => [
        'virtualize_above' => 200,
    ],

    /*
    |---------------------------------------------------------------------------
    | Resource discovery
    |---------------------------------------------------------------------------
    |
    | directory => namespace. Scanned lazily on first access, so a generated
    | resource is routable with no registration line - which is what makes
    | `make:panel-resource --generate` produce a working screen untouched.
    |
    */
    'discover' => [
        app_path('Panel/Resources') => 'App\\Panel\\Resources',
    ],

    /*
    |---------------------------------------------------------------------------
    | Page discovery
    |---------------------------------------------------------------------------
    |
    | directory => namespace. The disposable portal tree is included so any
    | page `make:panel` tests leave behind is registered, not reported as an
    | orphan by `panel:doctor`.
    |
    */
    'discover_pages' => [
        app_path('Panel/Pages') => 'App\\Panel\\Pages',
        app_path('Panel/Client/Pages') => 'App\\Panel\\Client\\Pages',
        app_path('Panel/Disposable/Pages') => 'App\\Panel\\Disposable\\Pages',
        // 100% demo content - deleting app/Demo leaves this pointed at a
        // directory that no longer exists, which discoverPages() already
        // no-ops on rather than erroring.
        app_path('Demo/Panel/Pages') => 'App\\Demo\\Panel\\Pages',
    ],

    /*
    |---------------------------------------------------------------------------
    | Tenancy
    |---------------------------------------------------------------------------
    |
    | mode
    |   'column'   Shared / single database. Every tenant's rows live in one
    |              database separated by a tenant_id column, and the panel adds
    |              that constraint to every query. This is stancl/tenancy's
    |              single-database tenancy.
    |
    |   'database' Dedicated / multi database. stancl/tenancy switches the
    |              connection during bootstrapping and the rows carry no tenant
    |              column, so the panel must NOT add one - isolation is already
    |              done by the time the panel sees the request.
    |
    |   'hybrid'   BOTH, decided per tenant. A tenant with a database of its own
    |              is isolated by connection; every other tenant shares the
    |              central database and is scoped by column. This is the shape a
    |              real SaaS ends up in - most tenants share, and the few large
    |              or contractually-isolated ones do not - and it requires
    |              Alxtexhpanel's ConditionalDatabaseBootstrapper, because stancl's
    |              own switches the connection for every tenant unconditionally.
    |
    |   'none'     Single-tenant application.
    |
    | resolver
    |   null       Auto-detect: use stancl/tenancy if it is installed and
    |              initialised, otherwise the authenticated user's tenant column.
    |   'stancl'   Force stancl/tenancy.
    |   'auth'     Force the authenticated user's tenant column.
    |   Closure    Resolve it yourself; return int|string|null.
    |
    | A null tenant key is always a DENY signal, never "all tenants".
    |
    */
    /*
    |---------------------------------------------------------------------------
    | Security
    |---------------------------------------------------------------------------
    |
    | max_sessions
    |   How many places one account may be signed in at once. 0 is unlimited,
    |   which is the default: a limit is a policy decision with real consequences
    |   for anybody legitimately using a laptop, a desktop and a phone, and a
    |   framework that imposed one silently would have every installation
    |   discover it as a bug report.
    |
    |   When the limit is reached the OLDEST session ends, never the new one.
    |   Refusing the login instead would lock somebody out on behalf of a session
    |   they cannot reach - a laptop at the office, a phone that was reset.
    |
    |   Requires the `database` session driver. There is nothing to count with a
    |   cookie-only store; `panel:doctor` reports that combination.
    |
    */
    /*
    |---------------------------------------------------------------------------
    | Assistant
    |---------------------------------------------------------------------------
    |
    | prompts_per_hour
    |   How many prompts one ORGANISATION may send in an hour. 0 disables the
    |   limit.
    |
    |   Keyed by tenant rather than by user or IP: a per-user limit is widened by
    |   adding colleagues, and an IP limit punishes a whole office behind one NAT
    |   address while missing somebody on a home connection. The unit that pays
    |   the bill is the unit that is limited.
    |
    */
    'ai' => [
        'prompts_per_hour' => env('PANEL_AI_PROMPTS_PER_HOUR', 120),
    ],

    /*
    |---------------------------------------------------------------------------
    | Authentication
    |---------------------------------------------------------------------------
    |
    | password_reset
    |   'link'  email a signed URL - the Laravel default.
    |   'otp'   email a short numeric code the person types in.
    |
    |   Both are offered because the right answer depends on the audience, not on
    |   which is better. A link is fewer steps and fails badly where mail is read
    |   on a different device from the browser, which is common on shared office
    |   machines. A code survives that and is easier to phish, since a person can
    |   be talked into reading six digits aloud.
    |
    | magic_link
    |   Passwordless sign-in by emailed link. OFF BY DEFAULT and deliberately so:
    |   it makes the mailbox a complete account takeover path, with no second
    |   factor between an intercepted email and a session. Turn it on knowing
    |   that.
    |
    | otp_lifetime / magic_link_lifetime
    |   Minutes. Short, because these are credentials sitting in an inbox.
    |
    */
    /*
    |--------------------------------------------------------------------------
    | Bulk actions
    |--------------------------------------------------------------------------
    |
    | HOW MANY EXPLICITLY-SELECTED ROWS STILL RUN INSIDE THE WEB REQUEST.
    |
    | A bulk action over a set the operator ticked on screen is bounded, and
    | bounded is not the same as small. Past this many rows the selection is
    | handed to a worker with a progress token instead of holding a request
    | open until the web server's timeout kills it halfway - which leaves a
    | partial write and a 504 that says nothing about how far it got.
    |
    | DELIBERATELY BELOW the thousand-row cap on what a client may send, so
    | the queued path is reachable from an ordinary selection rather than only
    | from "select all matching". A threshold nobody crosses is a threshold
    | nobody has tested.
    |
    | An individual action may override it - `BulkAction::queueThreshold()` -
    | and anything doing per-row network work should.
    |
    */

    'bulk' => [
        'queue_threshold' => (int) env('PANEL_BULK_QUEUE_THRESHOLD', 250),
    ],

    'auth' => [

        /*
        | Per-portal sign-in copy, read by `PanelAuthController::showLogin`.
        |
        | THE SUPERADMIN FORM SAYS WHICH BUILDING YOU ARE IN. Two sign-in
        | screens that read the same are two screens somebody types the wrong
        | password into - and the one being confused here is the door to every
        | tenant's data.
        */
        'superadmin' => [
            'heading' => 'Superadmin',
            'description' => 'This portal administers the installation itself. Tenant operators sign in at the main panel.',

            /*
            | The seeded superadmin, filled in ready to submit.
            |
            | SAME SWITCH AS THE DEMO'S OWN LOGIN, deliberately - one setting
            | for "this machine is a demo", not one per portal that somebody
            | turns on for the operator panel and forgets here.
            |
            | TWO INDEPENDENT LOCKS, AND NEITHER IS THIS FILE. `DemoLogin`
            | checks `App::environment('local')` in CODE, and
            | `PanelAuthController` checks it again before sending the prop -
            | so no value written here can fill in a password anywhere that
            | matters. That belt-and-braces exists because this is a password
            | in a config file, and the account it belongs to can rewrite the
            | content every tenant reads.
            |
            | IT NEVER INVENTS AN ACCOUNT. If `panel:seed-reference` has not
            | run, this address does not exist and the form fails the way it
            | should.
            */
            'prefill' => env('DEMO_PREFILL_LOGIN', false) && env('APP_ENV') === 'local'
                ? ['email' => 'superadmin@panel.test', 'password' => 'password']
                : null,
        ],

        'password_reset' => env('PANEL_PASSWORD_RESET', 'link'),
        'magic_link' => env('PANEL_MAGIC_LINK', false),
        'otp_lifetime' => 10,
        'magic_link_lifetime' => 10,

        /*
        | Cloudflare Turnstile on the auth screens.
        |
        | KEYS ARE THE SWITCH. Set TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY
        | to show the widget and verify on POST. PANEL_TURNSTILE=false forces
        | it off even when keys exist.
        |
        | ON WITH BOTH KEYS, Cloudflare down still refuses. See the
        | `Turnstile` class.
        */
        'turnstile' => [
            'enabled' => env('PANEL_TURNSTILE'),
            'site_key' => env('TURNSTILE_SITE_KEY'),
            'secret_key' => env('TURNSTILE_SECRET_KEY'),
        ],
    ],

    'security' => [
        'max_sessions' => env('PANEL_MAX_SESSIONS', 0),
    ],

    /*
    | What the assistant is allowed to look things up in.
    |
    | THE HELP CENTRE ONLY, and that limit is the point. Indexing subscriber
    | records here would put a person's account details into a prompt to answer
    | a question about how exporting works - `FindSubscriber` exists for the
    | cases that genuinely need a record, and it checks the same policy the
    | screen does before returning one.
    |
    | Everything else - which embedder, how wide the vectors are, how big a
    | chunk is - stays at the package defaults, which are local and free. See
    | `packages/panel/config/panel.php`.
    */
    /*
    | PLUGINS.
    |
    | A published plugin registers itself from its own service provider, so this
    | list is usually empty and `composer require` is the whole installation.
    | The announcements plugin lives in this application rather than in a
    | package - the playground is one repository - so it is named here, which is
    | the other supported way in.
    */
    'plugins' => [
        TicketingPlugin::class,

        /*
        | LISTED EVEN THOUGH THE PACKAGE DEFAULTS TO IT, because a LIST does not
        | merge. `ConfigMerge` fills in settings the package added inside an
        | array this file publishes, but a list is a value, not a namespace -
        | unioning this one would reinstall a plugin somebody deliberately
        | removed. So this array replaces the package's whole, anything the
        | package adds to its own `plugins` never arrives, and `panel:update`
        | reports it by name. The demo makes that upgrade by hand rather than
        | pretending the default reaches it.
        */
        AnnouncementsPlugin::class,
    ],

    /*
    |---------------------------------------------------------------------------
    | Announcements
    |---------------------------------------------------------------------------
    |
    | ON HERE, OFF IN THE PACKAGE, and this block exists precisely because of
    | that difference. The plugin is gated behind this flag so a fresh install
    | does not get a CRUD screen and an `/api/v1` endpoint nobody asked for;
    | this application is the demonstration, so it says yes.
    |
    | IT HAS TO BE WRITTEN OUT. `ConfigMerge::deep()` fills in keys this file
    | omits from the package's defaults - so leaving it absent would inherit
    | `false` and quietly remove a screen the demo is meant to show.
    |
    */
    'announcements' => [
        'enabled' => true,
    ],

    /*
    |---------------------------------------------------------------------------
    | Ticketing
    |---------------------------------------------------------------------------
    |
    | WHICH TWO PORTALS THE TWO ENDS OF A TICKET LIVE IN.
    |
    | A ticket is the one record two sides read under different rules, so it
    | needs both: `operator` gets the queue - the whole organisation's tickets,
    | with assignment and resolution - and `opener` gets the screen where
    | somebody raises one and follows their own.
    |
    | NAMED HERE RATHER THAN HARDCODED because a package cannot know what an
    | installation called its portals. An operator portal keyed `isp` is
    | perfectly ordinary, and a plugin that assumed `admin` would install into
    | nothing on that installation while looking installed.
    |
    | `TicketingPlugin` REFUSES TO INSTALL ONE END WITHOUT THE OTHER, and names
    | the missing panel when it does. A queue nobody can write to and a form
    | nobody reads are both worse than the feature being absent.
    */
    'ticketing' => [
        'operator' => env('PANEL_TICKETING_OPERATOR', 'admin'),
        'opener' => env('PANEL_TICKETING_OPENER', 'reseller'),

        /*
        | THE TABLES THIS APP ALREADY HAS, which is the whole of its migration
        | to the packaged ticketing.
        |
        | The package defaults to `panel_tickets` / `panel_ticket_replies`,
        | because `tickets` is a name an application might already be using -
        | this one is. Naming them here is what lets four years of support
        | history stay where it is: no rename on a live table, no data copy, no
        | downtime.
        |
        | THESE ARE A CHOICE, NOT A WORKAROUND. `ConfigMerge` would supply the
        | package's `tables` key into this published `ticketing` array on its
        | own - it did not, while the merge was shallow, which sent every query
        | to a table that does not exist - but the defaults are the wrong names
        | for this application, so it names the two it has.
        */
        'tables' => [
            'tickets' => 'tickets',
            'replies' => 'ticket_replies',
        ],

        /*
        | WHICH PRIORITIES REACH TELEGRAM - roadmap 6.5.
        |
        | URGENT ONLY, and the restraint is what makes the channel worth
        | having. An alert on every ticket is noise inside a week, and a muted
        | channel is worse than no channel: it is one everybody believes is
        | working. Widen this deliberately, per installation.
        */
        'alert_priorities' => ['urgent'],

        /*
        | HOW MANY TICKETS ONE PERSON MAY OPEN - roadmap H.6.
        |
        | NOT SPAM FILTERING. Every ticket here is raised by somebody signed
        | into an organisation, so keyword and IP blocking would be theatre -
        | there is no anonymous submitter to block. What this guards against
        | is the real failure: a broken integration, or somebody hammering the
        | form because nothing seemed to happen, filling a queue nobody can
        | then work through.
        |
        | DELIBERATELY GENEROUS. A person having a bad day with their
        | connection may legitimately open several; the limit is set where
        | only a machine reaches it.
        */
        'max_per_hour' => 10,
        'max_per_day' => 30,

        /*
        | THE DESKS A TICKET CAN BE ROUTED TO - roadmap H.5.
        |
        | A CONFIGURED LIST, NOT A TABLE, deliberately. A `departments` table
        | buys names an operator can edit at runtime and costs a second CRUD
        | screen, a foreign key, a join on every queue render and the question
        | "what happens to tickets when a department is deleted" - all to model
        | a list that changes about once a year. The column stores the KEY, so
        | the day this genuinely needs to be per-tenant it becomes a table
        | without anything stored having to change.
        |
        | THESE ARE AN ISP'S DESKS, which is why they are here and not in the
        | package. A framework guessing at them would ship a confidently wrong
        | default, the same reason the role templates live here.
        */
        'departments' => [
            'support' => 'Support',
            'network' => 'Network operations',
            'billing' => 'Billing',
        ],
    ],

    'knowledge' => [
        /*
         * STATIC TEXT ONLY, DELIBERATELY - roadmap 5.5. All three sources
         * are documentation every signed-in person can already read, so
         * retrieval needs no per-asker gate. Resource RECORDS stay out of
         * this list: record questions go through the assistant's TOOLS
         * (FindSubscriber and friends), which call the same policy the
         * screen does per request - putting records in RAG would answer
         * questions the screen refuses. See SearchKnowledge's own note.
         */
        /*
         * THE BLUEPRINT IS NOT IN THIS LIST, and that is a correction.
         *
         * `AGENTS.md` is written for an agent WRITING the panel - recipes for
         * declaring a table, laying out a form, adding a portal. The assistant
         * answers somebody USING the panel. Indexing one into the other put
         * developer recipes in the same ranking as operator help, and the
         * corpus is searched by a hash embedder that ranks on crude similarity.
         *
         * So the guide simply grew, and "how do I export a filtered list"
         * started returning cluster recipes: the three passages the tool
         * returns were a testing page and two blueprint chunks, and the
         * exporting help was pushed out of the results entirely. Nobody
         * changed retrieval - the corpus got bigger and the answer got worse,
         * which is what happens every time the guide is improved.
         *
         * `BlueprintSource` still exists and is still generated. It is read
         * from disk by whoever is building, which is its audience.
         */
        'sources' => [
            HelpSource::class,
            GuideSource::class,
        ],
    ],

    /*
    | Where somebody locked out of the panel should write.
    |
    | Shown on the suspension wall, which is rendered before any session exists
    | - so there is no in-panel way to ask, and an address here is the only
    | route back for whoever hits it.
    */
    'support_email' => env('PANEL_SUPPORT_EMAIL'),

    // Mounted at /settings/roles in routes/web.php, where operators look for it.
    'routes' => [
        'roles' => false,
    ],

    /*
    |---------------------------------------------------------------------------
    | Environment editor
    |---------------------------------------------------------------------------
    |
    | ONE LIST IS THE WHOLE FEATURE. `EnvironmentPage` does not exist until this
    | is non-empty - absent, not hidden, so an installation that has not thought
    | about it has no screen to find rather than a locked one to wonder about.
    |
    | THE DEMO SHIPPED WITH IT EMPTY, which meant the panel carried a working
    | environment editor that nobody could see, and there was no way to tell
    | that from the outside. A feature only demonstrated in its own tests is one
    | people conclude does not exist.
    |
    | These are the keys somebody running THIS panel might genuinely change
    | without a deploy. `APP_KEY`, `APP_ENV`, `APP_DEBUG` and everything `DB_*`
    | are refused by `EnvFile` whatever appears here - listing them by mistake
    | still cannot reach them.
    |
    | `MAIL_PASSWORD` IS DELIBERATE. It is the one secret in this list, and it
    | is here to show what the screen does with one: the value is never sent to
    | the browser, the field arrives blank, and saving blank leaves it alone. A
    | real installation should still ask whether a credential belongs on a web
    | form at all - the answer is often no, and the answer being "no" is why the
    | allowlist exists rather than an "edit anything" screen.
    */
    'env' => [
        'editable' => [
            'MAIL_HOST',
            'MAIL_FROM_ADDRESS',
            'MAIL_FROM_NAME',
            'MAIL_PASSWORD',
            'BACKUP_NOTIFY_EMAIL',
            'LOG_LEVEL',
        ],
    ],

    'tenancy' => [
        'mode' => env('PANEL_TENANCY_MODE', 'column'),
        'column' => 'tenant_id',
        'resolver' => null,
        'model' => Tenant::class,

        /*
        | Per-tenant feature flags, as name => bool. A Closure, or null to read
        | them from the acting user's tenant relation.
        |
        | An ABSENT flag means disabled. A flag that defaults to on is not a
        | flag, it is a comment.
        */
        'features' => null,
    ],

    /*
    |---------------------------------------------------------------------------
    | Exports
    |---------------------------------------------------------------------------
    |
    | Where a queued export writes its CSV. Local by default: an export contains
    | whatever the operator could already see, but writing it to a public disk
    | would put that behind a guessable URL instead of behind the download
    | endpoint's ownership check.
    |
    */
    'exports' => [
        'disk' => env('PANEL_EXPORT_DISK', 'local'),

        /*
        | How long a finished export stays downloadable. It must outlive the
        | notification announcing it - that notification is stored until
        | somebody reads it, and a link that expires within the hour turns
        | "your export is ready" into a 404 page the next morning.
        */
        'retention_days' => (int) env('PANEL_EXPORT_RETENTION_DAYS', 7),
    ],

    /*
    |--------------------------------------------------------------------------
    | Saved views
    |--------------------------------------------------------------------------
    |
    | A named set of table settings, saved by one person for one resource.
    |
    | OPTIONAL, and null disables it cleanly. The panel offers saved views; it
    | does not require them, so an application that has not created the table
    | gets an empty list rather than an error on every resource page.
    |
    | The MODEL rather than a table name, because the model carries the tenant
    | global scope - reaching for the table directly would be the one place the
    | kit queried tenant data without it.
    */
    'saved_views' => [
        'model' => SavedView::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Release notes, shown in the panel at /whats-new
    |--------------------------------------------------------------------------
    |
    | THE PACKAGE SHIPS THE SCREEN; THE CONTENT IS THIS APPLICATION'S. A
    | framework that shipped its own release notes would put Alxtexhpanel's version
    | history on somebody else's operations screen - true of the framework and
    | meaningless to the person reading it.
    |
    | WHY THIS BLOCK EXISTS AT ALL. `ChangelogPage::isEnabled()` returns false
    | when there are no releases, which is right - a menu entry to an empty page
    | reads as a broken screen. But this application declared none, so the
    | packaged page was never routed, and the only thing at `/whats-new` was a
    | redirect to a `/changelog` that no route served. A packaged screen with
    | no consumer, and a link to a 404, in the same URL. Neither failed a test
    | until a browser opened every route in the application.
    |
    | Written as an operator would read it: what changed, grouped by kind, most
    | recent first. Not a commit log.
    */
    /*
    | Playground is a path install, so Composer reports `dev-main` rather than
    | a product tag. Pin the current release here so About matches consumers.
    */
    'about' => [
        'version' => '1.0.10',
    ],

    'changelog' => [
        [
            'version' => '2.4',
            'date' => 'August 2026',
            'highlight' => 'Advanced filtering, and money that reads the same everywhere.',
            'added' => [
                'Build a nested condition with Advanced query in the filter panel - group rules with match all or match any, up to five levels deep.',
                'Scatter and bubble charts on the dashboard, for comparing two measures against each other rather than one over time.',
            ],
            'changed' => [
                'A record page now shows every column at the same formatting as the list it came from.',
            ],
            'fixed' => [
                'Amounts on a record page showed unformatted values - 250000 where the list correctly showed 2,500.00.',
            ],
        ],
        [
            'version' => '2.3',
            'date' => 'July 2026',
            'highlight' => 'Tickets, end to end.',
            'added' => [
                'Raise a ticket, reply to it, and keep internal notes that the person who opened it never sees.',
                'Departments, so a ticket reaches the team that handles it rather than everybody.',
                'A first-response clock and an SLA due time on every open ticket.',
            ],
            'fixed' => [
                'Deleting many records at once now tells you how many will go before it commits anything.',
            ],
        ],
        [
            'version' => '2.2',
            'date' => 'June 2026',
            'highlight' => 'Everything you deleted is in one place.',
            'added' => [
                'Trash collects removed records from every screen, with restore and permanent delete.',
                'Saved views: keep a set of filters, columns and sorting under a name you choose.',
            ],
            'changed' => [
                'The sidebar moved rarely-used entries into the account menu.',
            ],
        ],
    ],
];
