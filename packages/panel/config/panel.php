<?php

declare(strict_types=1);
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Validation\ValidationException;
use Alxtexh\Panel\Alerts\AnnouncementsPlugin;
use Alxtexh\Panel\Knowledge\HashEmbedder;
use Alxtexh\Panel\Ticketing\TicketingPlugin;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return [

    'deprecations' => [
        'warn' => (bool) env('PANEL_DEPRECATION_WARN', true),
        'log' => (bool) env('PANEL_DEPRECATION_LOG', false),
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
    /*
    |---------------------------------------------------------------------------
    | Uploads
    |---------------------------------------------------------------------------
    |
    | THE DISK MUST BE PRIVATE. `local` is, `public` is not - a file under the
    | public disk is served by the web server with whatever handler its
    | extension maps to, and every check the upload path performs is worthless
    | if the deployment hands the result to PHP-FPM. Reads go through
    | UploadController, which authorizes the RECORD before streaming.
    |
    | `max_kilobytes` is the hard ceiling for the whole panel. A field may lower
    | it and may not raise it. Note that PHP's own `upload_max_filesize` and
    | `post_max_size` still apply and are usually smaller - a request over those
    | never reaches Laravel at all, so raising this alone changes nothing.
    |
    */
    'uploads' => [
        'disk' => env('PANEL_UPLOAD_DISK', 'local'),
        'max_kilobytes' => (int) env('PANEL_UPLOAD_MAX_KB', 10240),
        // Optional host callback: fn (UploadedFile $file): bool. Returning
        // false, or throwing, rejects the upload before it reaches storage.
        'scanner' => null,
        'max_chunks' => (int) env('PANEL_UPLOAD_MAX_CHUNKS', 1000),
    ],

    /* Optional because a host may need to add its own Vite/analytics origins. */
    'security' => [
        'content_security_policy' => env('PANEL_CONTENT_SECURITY_POLICY'),
        'max_payload_kilobytes' => (int) env('PANEL_MAX_PAYLOAD_KB', 25600),
    ],

    'drafts' => [
        'ttl' => (int) env('PANEL_DRAFT_TTL', 86400),
    ],

    'pagination' => [
        'default_per_page' => 10,
        'per_page_options' => [10, 25, 50, 100],
        'keyset_threshold' => 10_000,
        'count_strategy' => env('PANEL_COUNT_STRATEGY', 'deferred'), // deferred|approximate|none
    ],

    'widgets' => [
        // Set to 0 to disable query-budget observation.
        'query_budget' => (int) env('PANEL_WIDGET_QUERY_BUDGET', 50),
    ],

    /*
    |---------------------------------------------------------------------------
    | Navigation
    |---------------------------------------------------------------------------
    |
    | `static_groups` names sidebar groups that render as plain, always-open
    | SECTIONS rather than collapsible dropdowns - heading, items, no chevron,
    | no open/closed state to remember. Both presentations exist for a reason:
    | a group of twenty resources earns a toggle, a group of three screens
    | somebody uses all day earns permanence. Empty by default, so every group
    | keeps the collapsible behaviour it has always had.
    |
    | Comma-separated in the env form: PANEL_NAV_STATIC_GROUPS="Screens,Apps".
    | Names must match the group strings resources and pages declare.
    |
    */
    'navigation' => [
        'static_groups' => array_filter(explode(',', (string) env('PANEL_NAV_STATIC_GROUPS', ''))),
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
    |--------------------------------------------------------------------------
    | Where pages live
    |--------------------------------------------------------------------------
    |
    | Directories scanned for `Page` subclasses, as path => namespace - the same
    | shape as `discover` above.
    |
    | A PAGE IS A SCREEN THAT IS NOT A RESOURCE: a settings centre, a health
    | page, a dashboard. It declares its own slug, navigation entry, ability and
    | endpoints, so adding one costs a class rather than a controller, a route,
    | a menu entry and a permission check written separately.
    */
    'discover_pages' => [
        app_path('Panel/Pages') => 'App\\Panel\\Pages',
    ],

    /*
    |---------------------------------------------------------------------------
    | Live updates
    |---------------------------------------------------------------------------
    |
    | driver
    |   'auto'       DEFAULT. Broadcast if this application really has a
    |                broadcaster - a connection that is not `null` or `log`,
    |                and whose key is set - and poll if it does not. One less
    |                thing to remember on the day Reverb goes in, and nothing
    |                to undo on the day it comes out.
    |
    |                CONFIGURED IS NOT RUNNING, which is why the test is
    |                strict: `BROADCAST_CONNECTION=reverb` says a connection is
    |                DEFINED, not that a Reverb process is up. Set the driver
    |                explicitly on any environment where those differ.
    |   'poll'       Zero infrastructure, works on plain PHP-FPM. NOT
    |                the polling the spec warns about: that warning is about
    |                re-rendering a component server-side per viewer per tick.
    |                This asks one bounded indexed question - "which of these
    |                visible ids changed since T" - and usually answers with an
    |                empty array.
    |   'broadcast'  Reverb, Pusher or Ably. True push, constant server cost
    |                regardless of viewer count. Needs a running process, which
    |                is why it is opt-in rather than assumed.
    |   'none'       Off.
    |
    | Moving from poll to broadcast is a config change. No resource, page or
    | component knows which driver is active.
    |
    */
    /*
    |---------------------------------------------------------------------------
    | Alerts
    |---------------------------------------------------------------------------
    |
    | Telegram ships with the panel - `laravel-notification-channels/telegram`
    | is a dependency, and the panel adds a channel on top of it that falls back
    | to a notification's mail representation, so third-party notifications
    | (spatie/laravel-backup's, for one) deliver instead of silently doing
    | nothing.
    |
    | The token and chat id live in `services.telegram`, and the panel's own
    | settings are applied over them at boot. Anything can then say
    |
    |     Alxtexh\Panel\Alerts\Telegram::send('Disk at 94% on db-01.');
    |
    | EXCEPTIONS ARE OPT-IN AND OFF BY DEFAULT. A chat that receives every
    | unhandled exception from an application nobody has tuned yet is a chat
    | somebody mutes in the first week - and a muted alert channel is worse than
    | none, because it looks like coverage. Turn it on once the obvious noise is
    | fixed. See `ReportsToTelegram` for the deduplication that makes it
    | survivable at all.
    |
    */
    'alerts' => [
        'telegram' => [
            'exceptions' => (bool) env('PANEL_ALERT_EXCEPTIONS', false),

            /*
             | Failures that are the framework working correctly. A 404, a
             | validation error and an expired session all arrive as exceptions,
             | and alerting on them makes the channel mostly noise within a day.
             */
            'ignore' => [
                HttpExceptionInterface::class,
                ValidationException::class,
                AuthenticationException::class,
                AuthorizationException::class,
                ModelNotFoundException::class,
                TokenMismatchException::class,
            ],
        ],
    ],

    'live' => [
        'driver' => env('PANEL_LIVE_DRIVER', 'auto'),
        'interval_ms' => (int) env('PANEL_LIVE_INTERVAL', 10_000),
        'batch_ms' => 250,
        'channel' => null,
        'events' => [],
        'pause_when_hidden' => true,
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
    |   'none'     Single-tenant application. THE DEFAULT: a fresh Laravel
    |              app has no tenant_id column, and column mode would deny
    |              every query. Switch to `column` once that column exists.
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
    | Where somebody locked out of the panel should write.
    |
    | Shown on the suspension wall, which is rendered before any session exists
    | - so there is no in-panel way to ask, and an address here is the only
    | route back for whoever hits it.
    */
    'support_email' => env('PANEL_SUPPORT_EMAIL'),

    /*
    |--------------------------------------------------------------------------
    | Billing webhook adapters
    |--------------------------------------------------------------------------
    |
    | Generic inbound billing webhooks post to:
    |   /{panel}/billing/webhooks/{adapter?}
    |
    | The package validates and maps through panel hooks:
    | - Panel::billingWebhookVerifier(...)
    | - Panel::billingWebhookMapper(...)
    |
    | Thin example: Alxtexh\Panel\Billing\GenericBillingWebhookAdapter
    | Recipe: docs/13-billing-adapters.md and examples/generic-billing-webhook.php
    |
    | `events` is informational for host UI and docs, not a locked schema.
    |
    */
    'webhooks' => [
        'events' => [
            'webhook.ping',
            'billing.active',
            'billing.past_due',
            'billing.suspended',
            'billing.canceled',
            'billing.expired',
        ],
    ],

    /*
    | Auth screens.
    |
    | Turnstile is OFF by default and a single switch for every door - sign-in,
    | registration, password reset, OTP and magic link. Protecting some of them
    | protects none.
    |
    | ON WITH NO SECRET REFUSES EVERY REQUEST, deliberately: a check that passes
    | when it cannot run is an open door that reports itself as locked.
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

    /*
    |--------------------------------------------------------------------------
    | Search index nudge
    |--------------------------------------------------------------------------
    |
    | `panel:doctor` notes when searchable tables look this large (approximate
    | planner rows on Postgres / MySQL). Below this, `%term%` search is fine.
    | `panel:search-index` prints the DDL; doctor never applies it.
    |
    */
    'search' => [
        'index_nudge_rows' => (int) env('PANEL_SEARCH_INDEX_NUDGE_ROWS', 10_000),
    ],

    /*
    |--------------------------------------------------------------------------
    | Environment badge (permanently off)
    |--------------------------------------------------------------------------
    |
    | Kept for config/env compatibility. The shell no longer renders a badge;
    | PANEL_ENVIRONMENT_BANNER and Panel::environmentBanner() are no-ops.
    */
    'environment_banner' => [
        'enabled' => env('PANEL_ENVIRONMENT_BANNER'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Record presence (who's viewing)
    |--------------------------------------------------------------------------
    |
    | Off by default. Set PANEL_PRESENCE=true or Panel::presence(). Needs Echo
    | and a presence channel (see Presence::registerChannel()).
    */
    'presence' => [
        'enabled' => env('PANEL_PRESENCE', false),
    ],

    'auth' => [
        /*
        | SIGNING IN TO A GENERATED PANEL - only read by panels made with
        | `make:panel --auth`. An application whose sign-in comes from Breeze,
        | Jetstream or Fortify uses none of these; the two coexist because the
        | packaged routes live under the PANEL'S prefix and never claim
        | `/login`.
        |
        | THE THROTTLE IS KEYED ON ADDRESS AND IP TOGETHER. Address alone lets
        | anybody lock a colleague out by failing to sign in as them; ip alone
        | makes one office share a budget with whoever is behind the same NAT.
        */
        'max_attempts' => 5,
        'decay_seconds' => 60,
        'email_otp' => [
            'lifetime_minutes' => 10,
            'max_sends' => 3,
            'send_decay_seconds' => 60,
        ],

        /*
        | PASSWORDLESS MAGIC LINK.
        |
        | OFF BY DEFAULT. Set `PANEL_MAGIC_LINK=true` and call
        | `Panel::make('admin')->login()->passwordless()` on the portal that
        | should offer "Email me a link". The host owns the token table; see
        | `magic_link_table`. Lifetime is in minutes.
        */
        'magic_link' => env('PANEL_MAGIC_LINK', false),
        'magic_link_lifetime' => (int) env('PANEL_MAGIC_LINK_LIFETIME', 10),
        'magic_link_table' => env('PANEL_MAGIC_LINK_TABLE', 'magic_login_tokens'),

        'session' => [
            /*
            | AN ABSOLUTE CEILING, IN HOURS, MEASURED FROM SIGN-IN.
            |
            | `SESSION_LIFETIME` is an IDLE timer, and this panel defeats it:
            | live updates poll every ten seconds, the bell polls, a dashboard
            | left on a wall reloads its widgets - so a session in constant
            | machine use never idles and never expires. A tab open on an
            | unattended screen stays signed in until somebody closes the
            | browser, which is the whole of the risk the idle timer was set to
            | bound, and nothing warns because the session genuinely is busy.
            |
            | This is the ceiling a poll cannot push back. `0` disables it,
            | which is the default because signing everybody out on a schedule
            | is a policy an installation chooses rather than one a package
            | imposes. Set it to the length of a working day and somebody is
            | re-authenticated daily; set it lower for shared machines.
            */
            'max_hours' => (float) env('PANEL_SESSION_MAX_HOURS', 0),
        ],

        /*
        | SOCIAL SIGN-IN.
        |
        | When `->socialite()` is on, the login UI lists providers that have both
        | a client id and a secret in `config/services.php`. Unconfigured
        | providers stay hidden (and the whole social block, including the
        | "or continue with" divider, is omitted when the list is empty).
        | Set `PANEL_SOCIAL_SHOW_UNCONFIGURED=true` only when you want the
        | full packaged catalogue (muted buttons that explain missing `.env`
        | keys) for a kit showcase or demo.
        |
        | `providers` extends the packaged list for anything Socialite can drive
        | that this package does not name. `verifies_email` is a claim that a
        | provider PROVES an address belongs to whoever holds it, and it decides
        | whether an account that has never been linked may be matched by email
        | at all - adding a provider there without checking is an
        | account-takeover route, so the packaged list is short and deliberate.
        */
        'social' => [
            'table' => 'connected_accounts',
            'settings_url' => '/settings/security',
            'show_unconfigured' => env('PANEL_SOCIAL_SHOW_UNCONFIGURED', false),
            'providers' => [],
            'verifies_email' => [],
        ],

        /*
        | The password broker, or null for the default. A portal whose users
        | live in their own table needs its own broker in `config/auth.php`.
        */
        'broker' => null,

        /*
        | AND PER PANEL, KEYED BY PANEL ID. `make:panel --auth` writes one:
        |
        |   'reseller' => [
        |       'heading' => 'Reseller portal',
        |       'description' => 'Sign in to manage your customers',
        |       'passwords' => true,   // route the reset pair
        |       'prefill' => null,     // local only, refused elsewhere
        |   ],
        */

        /*
        | PASSWORD RENEWAL, OFF BY DEFAULT.
        |
        | Forced rotation is no longer recommended practice - NIST dropped it,
        | because what it reliably produces is `Summer2024!` becoming
        | `Summer2025!` on a card under the keyboard, while a genuinely
        | compromised password is changed the moment anybody notices rather than
        | ninety days later. It is here because some installations are audited
        | against a requirement to have it, and a panel that cannot express that
        | is a panel they cannot use.
        |
        | ZERO MEANS NEVER, and it is the default: switching this on is a
        | decision somebody makes deliberately rather than one they inherit.
        |
        | `refuse_reuse` IS ON REGARDLESS, and is the part worth having whatever
        | the expiry says. A renewal satisfied by re-entering the same password
        | changed nothing while recording that it did.
        */
        'password' => [
            'max_age_days' => (int) env('PANEL_PASSWORD_MAX_AGE_DAYS', 0),
            'refuse_reuse' => env('PANEL_PASSWORD_REFUSE_REUSE', true),
        ],

        /*
        | CLOUDFLARE TURNSTILE.
        |
        | KEYS ARE THE SWITCH. Set `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`
        | and the widget appears on sign-in (and register, reset, the 2FA
        | challenge). Missing either key is off: no widget, no extra HTTP.
        | `PANEL_TURNSTILE=false` forces it off even when keys exist.
        */
        'turnstile' => [
            'enabled' => env('PANEL_TURNSTILE'),
            'site_key' => env('TURNSTILE_SITE_KEY'),
            'secret_key' => env('TURNSTILE_SECRET_KEY'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Extra panel abilities
    |--------------------------------------------------------------------------
    |
    | Panel-level abilities THIS APPLICATION defines, as `name => label`.
    |
    | The package knows about `manage_roles`, `impersonate_users` and the rest,
    | because they guard things the package itself does. It cannot know that this
    | installation wants revenue figures hidden from the support rota - that is a
    | fact about the business, not about the framework, so it is declared here.
    |
    | THE LABEL IS PART OF THE DECLARATION, not an afterthought. These names
    | appear as checkboxes in the permission matrix, and `view_commercial_widgets`
    | as a checkbox label is a question rather than a description. The labels
    | used to be a hardcoded map in the Vue component, which is exactly how an
    | ability added on the server ends up rendering as somebody else's caption.
    |
    | NAMING SOMETHING HERE DOES NOT GRANT OR ENFORCE ANYTHING. It makes the name
    | real - so a superuser role covers it, the matrix offers it, and
    | `panel:permissions sync` stops pruning it. Whatever checks it is what
    | enforces it.
    */
    /*
    |--------------------------------------------------------------------------
    | The default panel
    |--------------------------------------------------------------------------
    |
    | Which portal is "the application" - the one served when nothing has said
    | otherwise, and the one `make:panel-resource` writes into when no `--panel`
    | is given.
    |
    | NAMED RATHER THAN INFERRED FROM PROVIDER ORDER. "First registered" is
    | decided by a file that a generator edits, so creating a portal silently
    | changed which panel was the default - and with it where the next resource
    | landed. A name in config only changes when somebody changes it.
    */
    'default' => env('PANEL_DEFAULT', 'admin'),

    /*
    |--------------------------------------------------------------------------
    | The public API
    |--------------------------------------------------------------------------
    |
    | Requests per minute PER TOKEN, not per address: one customer behind a NAT
    | is one address and many integrations, and a per-IP limit punishes all of
    | them for the noisiest.
    |
    | The limiter is only defined if the application has not defined its own -
    | an installation that has thought about its limits keeps them.
    */
    'api' => [
        'rate_limit' => (int) env('PANEL_API_RATE_LIMIT', 120),
    ],

    /*
    |--------------------------------------------------------------------------
    | Exports
    |--------------------------------------------------------------------------
    |
    | How long a finished export stays downloadable.
    |
    | IT HAS TO OUTLIVE THE NOTIFICATION SOMEBODY WILL OPEN TOMORROW. The link
    | previously lived in a one-hour cache entry while the file sat on disk
    | indefinitely, so the ordinary case - opening "your export is ready" the
    | next morning - was a 404 for a file that existed. Days, not hours.
    |
    | It should also not be forever: an export is a copy of records taken
    | outside the panel's own screens and its own permission checks, and every
    | one that lingers is a copy nobody is looking after.
    */
    'exports' => [
        'disk' => env('PANEL_EXPORT_DISK', 'local'),
        'retention_days' => (int) env('PANEL_EXPORT_RETENTION_DAYS', 7),
    ],

    /*
    |--------------------------------------------------------------------------
    | The trash
    |--------------------------------------------------------------------------
    |
    | How long a soft-deleted record can be restored from the Trash screen
    | before `panel:prune-trash` removes it for good.
    |
    | A BIN IS ONLY USEFUL IF IT HAS A DEADLINE PEOPLE CAN PLAN AROUND. Too
    | short and "I deleted it on Friday" is already unrecoverable on Monday; no
    | limit at all and the panel quietly accumulates every record anybody ever
    | removed, which is a data-retention position nobody chose.
    |
    | THE PRUNE IS A HARD DELETE and runs unattended, so this number is the only
    | thing standing between a mistake and its consequences. The Trash screen
    | shows it, computed from here rather than written in a heading.
    */
    'trash' => [
        'retention_days' => (int) env('PANEL_TRASH_RETENTION_DAYS', 7),
    ],

    /*
    |--------------------------------------------------------------------------
    | Plugins (host-owned, first-party only)
    |--------------------------------------------------------------------------
    |
    | Classes implementing `Plugins\PanelPlugin`, installed into every panel
    | that accepts them. Plugins are for your own first-party packages, not a
    | third-party marketplace. Build features in-app first; extract a plugin
    | only when the same screens belong in more than one project.
    |
    | EXPLICIT ONLY. PanelKit does not scan directories or call marketplace
    | hooks at boot. Name plugins here or on `Panel::plugins()`; nothing else
    | loads. Config classes are constructed lazily when their panel is first
    | used and `appliesTo()` passes.
    |
    | USUALLY EMPTY, AND THAT IS FINE. A host-owned plugin can register itself
    | from its own service provider - `PanelManager::plugin(new BillingPlugin)`.
    | This list is for plugins that do not self-register from a provider, or
    | ones an installation wants to add without touching a panel provider.
    |
    | A PLUGIN CAN ONLY ADD. It never receives the `Panel` itself, so installing
    | a package can never change the guard, the tenancy context or the
    | middleware - which would make "install this" a way to turn off tenant
    | scoping as a side effect.
    */
    'plugins' => [
        /*
        | TICKETING SHIPS REGISTERED AND SWITCHED OFF, which is not a
        | contradiction. It was registered nowhere for a release: the classes
        | were in the package, `composer require` installed them, and a consumer
        | who set `panel.ticketing.operator` got no route and no error - the
        | plugin they were configuring had never been handed to the manager.
        |
        | It is inert until BOTH `panel.ticketing.operator` and `.opener` name a
        | panel. See `TicketingPlugin`: one end without the other is refused
        | loudly rather than half-installed, because a queue nobody can write to
        | and a form nobody reads both return 200.
        */
        TicketingPlugin::class,

        /*
        | ANNOUNCEMENTS, REGISTERED HERE AND GATED IN `announcements.enabled`
        | BELOW.
        |
        | Being in this list is not the same as being on. It used to be: the
        | plugin checked only which panel was default - true of every fresh
        | install's admin panel - so a `composer require` shipped an
        | Announcements CRUD screen, its routes and an `/api/v1` endpoint that
        | nobody had asked for. Ticketing beside it has always had a gate; the
        | two were inconsistent, and the ungated one was the one publishing an
        | API.
        |
        | The banner, the model and the delivery are unaffected either way:
        | they are the package's, not the plugin's. What the flag controls is
        | the screen for WRITING a notice.
        */
        AnnouncementsPlugin::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Announcements
    |--------------------------------------------------------------------------
    |
    | OFF BY DEFAULT, because turning it on adds a resource - and a resource is
    | a URL, an ability name and, unless it opts out, an entry in the public API
    | document. An installation that wants somewhere to write an organisation-
    | wide notice says so; one that never asked gets a panel with nothing extra
    | in it.
    |
    */
    'announcements' => [
        'enabled' => env('PANEL_ANNOUNCEMENTS_ENABLED', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Retrieval, so the assistant can cite instead of inventing
    |--------------------------------------------------------------------------
    |
    | THE DEFAULT EMBEDDER IS LOCAL AND FREE, deliberately. `HashEmbedder` is a
    | bag of words - it matches "suspension" to "suspend" and will never match
    | "turn off their line" - but it needs no key, sends nothing anywhere and
    | costs nothing. The alternative default is an outbound call to a provider
    | nobody configured, which either fails or silently spends money, and a panel
    | should not start paying for something because a feature exists.
    |
    | Point `embedder` at `ProviderEmbedder::class` for real semantic retrieval,
    | and set `dimensions` to what that model actually returns.
    |
    | CHANGING THE EMBEDDER OR THE MODEL MEANS RE-INDEXING. Two models' vectors
    | are not comparable, so the stored ones stop meaning anything - run
    | `panel:knowledge index --fresh`.
    */
    'knowledge' => [
        'embedder' => env('PANEL_EMBEDDER', HashEmbedder::class),

        /*
        | How long the vectors are. THE MIGRATION SIZES THE `vector` COLUMN AND
        | ITS INDEX FROM THIS, so changing it after the fact needs a migration,
        | not just a config edit. Ignored by `HashEmbedder`, which knows its own
        | width; used by `ProviderEmbedder`, which asks the provider for it.
        */
        'dimensions' => (int) env('PANEL_EMBEDDING_DIMENSIONS', 1536),

        // Null uses the application's configured default.
        'provider' => env('PANEL_EMBEDDING_PROVIDER'),
        'model' => env('PANEL_EMBEDDING_MODEL'),

        /*
        | THE SIMILARITY BELOW WHICH A MATCH IS NOT A MATCH - read only by
        | `ProviderEmbedder`, since `HashEmbedder` knows its own scale.
        |
        | Every model puts its noise somewhere different: unrelated text scores
        | around 0.7 on some older models and 0.1 on newer ones, so the same
        | number is a strict filter in one space and a pass-everything in
        | another. Too high loses answers, which somebody reports; too low hands
        | the model an unrelated passage, which produces a confident wrong answer
        | that nobody reports.
        */
        'floor' => (float) env('PANEL_KNOWLEDGE_FLOOR', 0.35),

        /*
        | THE CEILING ON THE PORTABLE SEARCH PATH. Without pgvector every
        | candidate chunk is read and scored in PHP; this is what stops an
        | installation that indexed far more than expected turning a search into
        | a memory incident. Searching a bounded subset beats falling over.
        |
        | Postgres with pgvector ignores this - the database does the work.
        */
        'scan_limit' => (int) env('PANEL_KNOWLEDGE_SCAN_LIMIT', 5000),

        /*
        | Roughly how many characters of text go into one chunk.
        |
        | A WHOLE PAGE AS ONE VECTOR MATCHES EVERYTHING WEAKLY AND NOTHING WELL.
        | Passages of a few hundred words each carry one idea, which is what
        | makes a match mean something - and what makes a citation land on the
        | paragraph that answers the question rather than the document that
        | contains it.
        */
        'chunk_size' => (int) env('PANEL_KNOWLEDGE_CHUNK_SIZE', 1200),

        /*
        | WHAT GETS INDEXED - classes implementing `Knowledge\KnowledgeSource`.
        |
        | EMPTY BY DEFAULT, because the package cannot know which of an
        | installation's text is safe to read back into an answer. Help articles
        | are; the notes an agent writes about a subscriber's payment dispute
        | may very much not be, and a package that decided that on somebody's
        | behalf would be making a data-protection choice it has no standing to
        | make.
        */
        'sources' => [],
    ],

    'abilities' => [],

    /*
    |---------------------------------------------------------------------------
    | Singular resources
    |---------------------------------------------------------------------------
    |
    | One-record, settings-shaped screens (roadmap 4.3) - `SingularResource`
    | subclasses, listed by class. Each mounts at /{key} inside its panel,
    | with PUT /{key}/current as its save. A config list rather than
    | discovery, because a screen with one record is a considered decision.
    */
    'singulars' => [],

    /*
    |--------------------------------------------------------------------------
    | Screens the package mounts for you
    |--------------------------------------------------------------------------
    |
    | Alxtexhpanel routes the permission matrix by default, so an installation has a
    | working roles screen without writing a controller. Set this to false if you
    | mount `RoleController` yourself - two URLs rendering the same screen is how
    | a bookmark comes to disagree with a menu.
    */
    'routes' => [
        'roles' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Release notes
    |--------------------------------------------------------------------------
    |
    | What `ChangelogPage` shows, newest first. THE ORDER GIVEN IS THE ORDER
    | SHOWN - version strings do not sort, and dates are free text because a
    | release note is written for people.
    |
    | Each entry: version, date, an optional highlight, and any of added /
    | changed / fixed. Empty here means the page hides itself rather than
    | offering a menu entry that leads nowhere.
    |
    |   ['version' => '1.4', 'date' => '3 March', 'added' => ['...']],
    */
    'changelog' => [],

    /*
    |--------------------------------------------------------------------------
    | Editable support screens
    |--------------------------------------------------------------------------
    |
    | Off unless a Panel calls `->editableSupport()`. Optional GitHub
    | `owner/repo` (or URL) powers the What's new "Sync from GitHub" button
    | on portals that opted in. A failed fetch keeps locally edited rows.
    |
    | Payment gateway settings are a separate opt-in: `->paymentSettings()`.
    */
    'support' => [
        'github_releases' => env('PANEL_SUPPORT_GITHUB'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Environment keys an operator may change
    |--------------------------------------------------------------------------
    |
    | EMPTY BY DEFAULT, and the screen does not exist until this is not. A
    | framework shipping a browser-reachable way to change an application's
    | secrets, switched on, would be shipping that to everybody who installed it.
    |
    | Name only what an operator legitimately changes without a deploy - a
    | Telegram chat id, a support address, a feature flag. `APP_KEY`, `APP_ENV`,
    | `APP_DEBUG` and every `DB_*` are REFUSED whatever appears here: changing
    | them breaks the running application in a way this screen cannot undo.
    |
    | Keys whose name contains KEY, SECRET, PASSWORD, TOKEN, DSN or CREDENTIAL
    | are never displayed - the form shows whether they are set, and blank means
    | leave alone.
    */
    'env' => [
        'editable' => [],
    ],

    /*
    |--------------------------------------------------------------------------
    | Sitemap
    |--------------------------------------------------------------------------
    |
    | THE SCREEN APPEARS ONLY WHEN THERE IS SOMETHING TO GENERATE - the same
    | rule `changelog` follows above. Register public URLs with `Sitemap::add()`
    | or `Sitemap::source()` from a service provider's `boot()`.
    |
    | `disk` IS NULL BY DEFAULT, meaning the project's `public/` directory
    | directly - a sitemap is expected at the domain root
    | (`https://example.com/sitemap.xml`), which a Laravel disk almost never
    | resolves to. Name a disk only if this installation already serves static
    | files from somewhere else (S3 fronted by the same domain, for instance)
    | and has arranged for that origin to answer at its root.
    |
    | `robots_txt` IS THE ONE MECHANISM EVERY CRAWLER SHARES. Google, Bing and
    | Yandex each have their own webmaster console for direct submission -
    | nothing this package can automate without that installation's own
    | account. DuckDuckGo has no console at all: it leans on Bing's index and
    | its own light crawler, and finds a sitemap the same way every AI
    | crawler's own published guidance says to publish one - a `Sitemap:` line
    | in `robots.txt`. This is the one line that reaches all of them at once,
    | which is why it is on by default while everything else here is off by
    | default.
    |
    | ADDITIVE, NEVER DESTRUCTIVE. The line is appended to an EXISTING
    | `robots.txt` and only if one is not already there for this exact file -
    | never created from nothing, never rewritten. Creating a `robots.txt`
    | is a bigger policy decision (it can just as easily read `Disallow: /`)
    | than this package should make for an application it does not run.
    |
    | `indexnow` IS OFF UNTIL A KEY IS SET, the same rule `env.editable`
    | follows. Unlike the ping endpoint this package deliberately does NOT
    | call - Google's has 404'd since June 2023 - IndexNow is alive: one
    | notification reaches Bing, Yandex, Naver and Seznam. Get a key from
    | https://www.bing.com/indexnow or generate any 32+ character string
    | yourself; either works, because IndexNow verifies OWNERSHIP (the key
    | file at your own domain root), not identity.
    */
    'sitemap' => [
        'disk' => null,
        'filename' => 'sitemap.xml',
        'robots_txt' => true,
        'indexnow' => [
            'key' => env('PANEL_INDEXNOW_KEY'),
        ],
    ],

    /*
    |---------------------------------------------------------------------------
    | Per-record search metadata
    |---------------------------------------------------------------------------
    |
    | WHAT A PAGE TELLS SEARCH ENGINES ABOUT ITSELF, as opposed to the sitemap
    | above, which tells them the page EXISTS. The two are usually shipped
    | separately - and every Filament SEO plugin surveyed for this ships the
    | metadata half and no sitemap at all, which leaves an installation with
    | beautifully described pages nothing has been told to go and look at.
    |
    | `table` IS NAMED HERE for the same reason the ticket tables are: an
    | application may already own `seo_metadata`, and a migration that succeeds
    | against somebody else's table is worse than one that collides.
    |
    | `enforce_noindex` IS THE WHOLE INTEGRATION, and it is the reason these two
    | features belong in one package. A record marked "do not index" that still
    | appears in sitemap.xml is an installation telling an engine two opposite
    | things and hoping it picks the right one. With this on, `Sitemap` drops
    | those URLs; turn it off only if something else in your stack is already
    | reconciling the two.
    */
    'seo' => [
        'table' => 'panel_seo_metadata',
        'enforce_noindex' => true,
    ],

    /*
    |---------------------------------------------------------------------------
    | Ticketing
    |---------------------------------------------------------------------------
    |
    | A ticket has TWO ENDS, and which panel is which is an installation's
    | decision. Hardcoding them would work in exactly one application.
    |
    | `operator` is the desk - the panel that sees the organisation's queue.
    | `opener` is the panel where somebody raises one and sees only their own.
    | Set `opener` to null for a single-panel installation, where the desk is
    | the only side and tickets arrive some other way.
    |
    | THE FEATURE IS ABSENT UNTIL A PANEL IS NAMED. `TicketingPlugin` registers
    | nothing when the operator panel does not exist, so an installation that
    | has not asked for ticketing has no screens to find rather than empty ones.
    */
    'ticketing' => [
        'operator' => env('PANEL_TICKETING_OPERATOR'),
        'opener' => env('PANEL_TICKETING_OPENER'),

        /*
        | WHERE THE ROWS LIVE. Prefixed, because `tickets` is a name an
        | application might already use for something of its own - see
        | `Support\TicketTables`. An installation that had ticketing before it
        | was packaged points these at the tables it already has, which is the
        | whole of that migration.
        */
        'tables' => [
            'tickets' => 'panel_tickets',
            'replies' => 'panel_ticket_replies',
        ],

        /*
        | WHICH PRIORITIES RAISE AN ALERT.
        |
        | URGENT ONLY, and the restraint is what makes the channel worth having.
        | An alert on every ticket is noise inside a week, and a muted channel is
        | worse than no channel: it is one everybody believes is working.
        */
        'alert_priorities' => ['urgent'],

        /*
        | The departments a ticket can be routed to, as value => label. Empty
        | means the panel does not ask - a desk of four people does not need a
        | routing decision on every ticket, and a required field with one real
        | answer is a field that gets a wrong answer.
        */
        'departments' => [],
    ],

    /*
    | Resource comments (`Resource::comments()`). Table name is configurable for
    | installations that already own a comments table under another name.
    */
    'comments' => [
        'table' => env('PANEL_COMMENTS_TABLE', 'panel_comments'),
    ],

    'tenancy' => [
        'mode' => env('PANEL_TENANCY_MODE', 'none'),
        'column' => 'tenant_id',
        'resolver' => null,

        /*
        | The model that holds organisations, for the commands that must visit
        | every one of them - `panel:permissions` reconciles roles per tenant.
        |
        | NULL IS A REAL ANSWER, not an omission: a single-tenant installation
        | has no such model, and those commands then make one pass with a null
        | team id, which is the shape roles are stored under when nothing
        | resolves a tenant.
        */
        'model' => null,

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
    |--------------------------------------------------------------------------
    | Error screens
    |--------------------------------------------------------------------------
    |
    | The panel renders its own 403, 404, 419, 429, 500 and 503 rather than
    | Laravel's defaults - but ONLY for URLs inside a panel. Your application's
    | own error pages are untouched.
    |
    | Set `render` to false to keep Laravel's everywhere. There is no middle
    | setting: a panel that styles some of its errors and not others is more
    | confusing than one that styles none.
    |
    */

    'errors' => [
        'render' => env('PANEL_RENDER_ERRORS', true),
    ],

    /*
    |---------------------------------------------------------------------------
    | Public landing pages belong to the host application. PanelKit does not
    | claim `/` or ship landing templates.
    |---------------------------------------------------------------------------
    |
    | The previous built-in catalog and preview routes were removed. Keep public
    | marketing pages and their configuration in the host application.
    |
    */

    /*
    |---------------------------------------------------------------------------
    | Custom fields
    |---------------------------------------------------------------------------
    |
    | resources
    |   WHICH RESOURCES HAVE A `custom` JSON COLUMN to store one in. Empty means
    |   none, which is the true answer for a fresh installation and the safe
    |   one - the feature declines rather than writing into a column it hopes is
    |   there. Add the column with a migration of your own, then name the
    |   resource key here.
    |
    |   This was hardcoded to the reference application's three tables, in a
    |   class every installation gets.
    |
    */

    'custom_fields' => [
        'resources' => [],
    ],

    /*
    | The chrome at the bottom of every signed-in page: copyright uses the
    | panel brand (or app.name). Extra links are empty by default so a stock
    | install does not grow 404s. This is not the landing footer and not the
    | sidebar support list.
    */
    'footer' => [
        'links' => [],
    ],

    /*
     * Dashboard visual family. Widgets, permissions and deferred data remain
     * identical; this only selects the reusable presentation rhythm.
     */
    'dashboard' => [
        'design' => env('PANEL_DASHBOARD_DESIGN', 'operations'),
    ],

];
