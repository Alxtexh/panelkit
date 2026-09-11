<!-- alxtexhpanel:blueprint:start -->

# Building in this panel

This application uses Alxtexhpanel: administration screens are declared as PHP
classes and rendered by Inertia and Vue. `PanelKit` is the application; the
panel is the framework it is built with.

Read this before adding a screen. It describes the conventions that are not
visible in a single file, and the mistakes that return HTTP 200.

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

## Where things live

Panels registered in this application:

- `admin` - mounted at `/`, guard `web`, tenant context
- `platform` - mounted at `/platform`, guard `web`, central context
- `reseller` - mounted at `/reseller`, guard `web`, tenant context
- `superadmin` - mounted at `/superadmin`, guard `superadmins`, central context
- `client` - mounted at `/client`, guard `customers`, tenant context
- `authfixture` - mounted at `/authfixture`, guard `web`, tenant context

Resources are discovered from:

- `app/Panel/Resources` → `App\Panel\Resources`
- `app/Demo/Panel/Resources` → `App\Demo\Panel\Resources`

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

## What you can build with

Every name below is a real class in the installed package. If something
you want is not here it does not exist - do not invent a field type, and do
not hand-roll one in Vue. Ask for it, or compose what is here.

EXISTING AND BEING MOUNTABLE ARE DIFFERENT CLAIMS, so each group says how it
is used. Read that line before planning around anything below.

**Form fields** (36): `BarcodeField` `BuilderField` `CheckboxField` `CheckboxListField` `CodeField` `ColourField` `CountryField` `DateField` `DiffField` `Field` `FileUploadField` `HasAffixes` `HasChoices` `HiddenField` `IconPickerField` `KeyValueField` `MapField` `MarkdownField` `MultiSelectField` `NumberField` `PasswordField` `PhoneField` `QrCodeField` `RadioField` `RatingField` `RepeaterField` `RichEditorField` `SelectField` `SliderField` `TagsField` `TextField` `TextareaField` `ToggleButtonsField` `ToggleField` `TreeSelectField` `VisualSelectField`
_How to use them: name them in `form()`._
**Table columns** (19): `BadgeColumn` `CheckboxColumn` `CodeColumn` `ColourColumn` `Column` `ColumnGroup` `DateColumn` `EditableColumn` `IconColumn` `ImageColumn` `InlineWritableColumn` `KeyValueColumn` `MoneyColumn` `RatingColumn` `SelectColumn` `TagsColumn` `TextColumn` `TextInputColumn` `ToggleColumn`
_How to use them: name them in `table()`._
**Table filters** (10): `BooleanFilter` `DateRangeFilter` `Filter` `HasOptions` `Indicator` `MultiSelectFilter` `NumberRangeFilter` `QueryBuilderFilter` `SelectFilter` `TrashedFilter`
_How to use them: name them in `table()`._
**Actions** (13): `Action` `ActionGroup` `ActionStep` `BulkAction` `BulkCheckpoint` `BulkResult` `BulkRunner` `ExportedFile` `ImpersonateAction` `JobStatus` `ModalFooterAction` `RecordAction` `ReplicateAction`
_How to use them: name them in `table()` or the resource's actions._
**Schema (form layout)** (14): `Callout` `Card` `Column` `Columns` `Component` `Fieldset` `Flex` `Grid` `Renderable` `Section` `Step` `Tab` `Tabs` `Wizard`
_How to use them: wrap fields with them inside `form()`._
**Dashboard widgets** (18): `BarcodeWidget` `Bucket` `CalendarWidget` `CanPoll` `ChartWidget` `DashboardFilters` `HasLayout` `LogTailWidget` `MapWidget` `Period` `Rollup` `StatWidget` `TableWidget` `TimeSeries` `Trend` `WidgetBudget` `WidgetSet` `Window`
_How to use them: **declare them on a `DashboardPage`, which is what draws them, or drop a factory under a directory the panel passed to `discoverWidgets()`.** `php artisan make:panel-page Overview --dashboard` writes one; its `stats()`, `charts()` and `tables()` return these classes and the packaged `PanelDashboard` screen renders them, each as its own deferred prop. `TableWidget::make('recent')->resource(OrderResource::class)->limit(5)` renders the existing DataTable with a capped list query. `->live('dashboard.stats')` prefers Echo/Reverb when `window.Echo` exists; `->poll('10s')` on `StatWidget`, `TableWidget` or `ChartWidget` is the HTTP fallback (pauses while the tab is hidden; never both at runtime). Redis is not a UI transport. `Panel::make('admin')->discoverWidgets(app_path('Panel/Widgets'))` is the normal path (namespace is optional when the directory is under `app_path()`). A widget built anywhere else is a value object nothing mounts - correct, tested and invisible. Before 0.3.0 that was true of every widget, which is why this line exists._
**Pages (screens that are not resources)** (32): `ApiDocsPage` `ApiKeysPage` `BillingPortalPage` `CatalogBrowserPage` `CatalogItemPage` `CatalogRegisterPage` `ChangelogPage` `ChatPage` `DashboardPage` `DevicePreviewPage` `EmailTemplatePage` `EnvironmentPage` `FeatureFlagsPage` `InvitePage` `LogsPage` `MailPage` `MailSettingsPage` `MediaLibraryPage` `OnboardingPage` `OrganisationPage` `Page` `PageLayout` `PaymentSettingsPage` `PlanCatalogPage` `PlanSetupPage` `ShowcasePage` `SignatureStudioPage` `SitemapPage` `TillPage` `UserManagementPage` `WebhookEndpointsPage` `Workspace`
_How to use them: extend `Page` (or `DashboardPage` / `PlanSetupPage` / `TillPage` / `DevicePreviewPage` / `MailPage` / `ChatPage`) in `app/Panel/Pages` and discovery routes it - `php artisan make:panel-page ServerHealth` writes the class and its Vue file. Flags: `--dashboard`, `--plan-setup`, `--till`, `--catalog`, `--catalog-item`, `--register`, `--signatures`, `--device-preview`. `make:panel-page BillingPlans --plan-setup` writes an empty page (import PlanGrid). `ChangelogPage` and `EnvironmentPage` are the package's OWN screens rather than things to extend: each appears only once configured (`panel.changelog`, `panel.env.editable`) and is absent entirely otherwise, so check those keys before concluding the capability is missing._
**Ticketing** (3): `MyTicketResource` `TicketResource` `TicketingPlugin`
_How to use them: do not name these directly - `TicketingPlugin` mounts them from `panel.ticketing.operator` / `.opener`. See the recipe._
**Client-side components** (`@alxtexh-enterprise/panel`, no PHP equivalent): `StatStrip`
`MiniStatCard` `SegmentedBar` `HeatmapChart` `ComboChart` `PolarAreaChart`
`RadarChart` `SetupChecklist` `CatalogCard` `PlanCard` `PlanGrid` `PlanEditor` `CatalogGrid` `CatalogTill` `CatalogBrowser` `CatalogRegister` `LineItems` `CartPanel`
`PkQtyStepper` `PkStatusBadge` `PkSignaturePad` `PaymentGateways`
_How to reach them: import them into YOUR OWN Vue page. A `CatalogBrowserPage` or
`PlanSetupPage` is optional routing, not a requirement to draw the widget.
`DashboardPage` renders `StatCard` and `ChartCard` only, so a `StatWidget` cannot produce
a `StatStrip` - if you want one card split into four windows of the same
metric, that screen is hand-written today. `ChartWidget::type('catalog')`
and `type('items')` do mount `CatalogGrid` / `LineItems` on a dashboard._

Abstract bases and traits appear in those lists - `Field`, `Column`,
`HasChoices` - because they are what you extend when a genuinely new one is
needed. Everything else is `::make()` and chained.

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

## Resources in this installation

| Key | Class | Panel |
| --- | --- | --- |
| `tickets` | `TicketResource` | `admin` |
| `announcements` | `AnnouncementResource` | `admin` |
| `plans` | `PlanResource` | `admin` |
| `users` | `UserResource` | `admin` |
| `activities` | `ActivityResource` | `admin` |
| `clients` | `ClientResource` | `admin` |
| `sessions` | `ClientSessionResource` | `admin` |
| `editable-plans` | `EditablePlanResource` | `admin` |
| `routers` | `RouterResource` | `admin` |
| `tenants` | `TenantResource` | `platform` |
| `reseller-plans` | `PlanResource` | `reseller` |
| `content-entries` | `ContentEntryResource` | `superadmin` |
| `all-tickets` | `TicketResource` | `superadmin` |
| `client-plans` | `PlanResource` | `client` |
| `my-tickets` | `MyTicketResource` | `reseller` |

Ability names are derived from the key: `view_any_clients`, `update_clients`,
`restore_clients`, `force_delete_clients`.

## What operators configure

These are edited in the panel, not in code. An agent asked to add or
change one needs the vocabulary below - the variables are the part that
fails silently, because an unrecognised token is printed as written
rather than blanked.

### Document templates

| Kind | Label | Variables a template may use |
| --- | --- | --- |
| `invoice` | Invoice | `@number`, `@customer`, `@due`, `@total` |
| `receipt` | Receipt | `@number`, `@customer`, `@paid`, `@total`, `@method` |
| `voucher` | Voucher | `@code`, `@value`, `@expires`, `@duration` |

A template is a row in `panel_document_templates` scoped to one tenant, edited
through the designer. Register a NEW kind by extending `DocumentKind` and
adding it to `DocumentKinds` from a service provider - registering under an
existing id REPLACES it, which is how an application teaches the package's
invoice about its own records.

`panel:doctor` reports a template using a variable its kind does not declare,
and one whose accent colour fails contrast against white.

### Announcement and report copy

| Token | Means |
| --- | --- |
| `@user` | The reader's name |
| `@organisation` | The organisation this announcement was written for |

One declaration feeds three things: the chip strip in the composer, the
substitution at delivery, and `panel:doctor`'s check. Adding a token means
adding it to `Announcement::variables()` - anywhere else and two of the three
will not know about it.

### When the panel interrupts somebody

| Rule | Where | Currently |
| --- | --- | --- |
| Which ticket priorities page the desk | `panel.ticketing.alert_priorities` | `urgent` |
| How many tickets one person may open | `panel.ticketing.max_per_hour` / `max_per_day` | 10 an hour, 30 a day |
| Monitoring thresholds | Monitoring settings, per tenant | edited in the panel |
| Backup staleness | `BackupStatus`, 26 hours | fixed |
| Doctor's daily report | `panel:doctor-alert`, scheduled | changes only |

EVERY ONE OF THESE IS SET NARROWLY ON PURPOSE. A channel people mute is
worse than no channel - it keeps working and nobody reads it. Widen a
threshold deliberately; do not add a second channel because the first was
too quiet.

## Commands

- `php artisan make:panel-importer` - Create an empty panel importer the resource can name from importable()
- `php artisan make:panel-module` - Create a plan-gated panel module (Module::make snippet plus a $module screen)
- `php artisan make:panel-page` - Create a panel page (a screen that is not a resource)
- `php artisan make:panel-plugin` - Scaffold a host-owned Panel plugin class and README
- `php artisan make:panel-recipe` - Write the official starter recipe: one resource, kit Vue, empty table
- `php artisan make:panel-relation-manager` - Create nested relation pages (dedicated list/create/edit, not a modal)
- `php artisan make:panel-resource` - Create a panel resource
- `php artisan make:panel-widget` - Create a panel widget (empty StatWidget or ChartWidget factory)
- `php artisan make:panel` - Create a panel: a provider, a resource directory, and its routes
- `php artisan panel:api-token` - Issue an API token for the public API
- `php artisan panel:backup` - Run a backup, optionally for one tenant only
- `php artisan panel:benchmark` - Time the panel's list surfaces, warm, and report medians
- `php artisan panel:billing-check` - Apply grace-period billing transitions.
- `php artisan panel:blueprint` - Write the panel conventions an AI agent should follow into the project
- `php artisan panel:cache-clear` - Invalidate every cached panel schema
- `php artisan panel:doctor-alert` - Run panel:doctor and announce changes through Telegram
- `php artisan panel:doctor` - Check for configuration that is silently wrong
- `php artisan panel:install` - Publish config, scaffold auth, create the first Administrator, sync permissions, and print next steps. It does not run `composer install`. Run it after `composer require`.
- `php artisan panel:journey` - Time a full signed-in journey through the panel over real HTTP
- `php artisan panel:knowledge` - Index panel content so the assistant can cite it instead of guessing
- `php artisan panel:make-user` - Create an account that can sign in to the panel
- `php artisan panel:modules` - Inspect Panel capability modules and optional dependencies
- `php artisan panel:monitor-sample` - Record one monitoring sample and alert on any crossed threshold
- `php artisan panel:notifications-digest` - Send grouped notification digests for users that enabled digest delivery
- `php artisan panel:permissions` - Reconcile roles and permissions against the registered resources
- `php artisan panel:prune-exports` - Delete exports past their retention window, file and record together
- `php artisan panel:prune-trash` - Permanently delete records that have been in the trash past their retention window
- `php artisan panel:prune-uploads` - Delete pending uploads that were never saved to a record
- `php artisan panel:recipe` - Write the official starter recipe: one resource, kit Vue, empty table
- `php artisan panel:refresh-rollups` - Pre-aggregate dashboard time series
- `php artisan panel:reindex-tenant` - Add indexes suited to a dedicated tenant database, where the tenant column is redundant
- `php artisan panel:reports-due` - Dispatch any scheduled reports that are due
- `php artisan panel:search-index` - The trigram or fulltext indexes this panel's search would use, for the current engine
- `php artisan panel:seed-demo` - Seed realistic multi-tenant demo data at scale
- `php artisan panel:seed-reference` - Seed the five-tenant reference estate used by panel:benchmark
- `php artisan panel:setup` - Print a post-install setup checklist (mail, MFA, tenancy, Turnstile)
- `php artisan panel:sitemap-generate` - Write sitemap.xml from every registered URL
- `php artisan panel:tenant-suspension` - Suspend a tenant from the panel, or lift a suspension
- `php artisan panel:update` - Reconcile page files, config and the agent guide after upgrading the package
- `php artisan panel:validate` - Validate panel registration, security, and production configuration

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

<!-- alxtexhpanel:blueprint:end -->
