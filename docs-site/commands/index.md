# Command reference

Every command below is a real `$signature` read directly from
`packages/panel/src/Commands/*.php`. If a flag isn't listed here, it doesn't
exist — don't guess one into existence.

## Install & upgrade

### `php artisan panel:install`

```
panel:install
    {--auth}            Kept for older docs; auth is on by default
    {--no-auth}         Skip scaffolding sign-in
    {--no-user}         Skip creating the first Administrator
    {--name=}           First Administrator name (with --email and --password)
    {--email=}
    {--password=}       Non-interactive; prefer the interactive prompt instead
    {--force}           Overwrite previously published config and page files
```

Publishes config, scaffolds auth, creates the first Administrator, syncs
permissions, and prints next steps. Idempotent — running it twice never
overwrites a file you've edited unless `--force` is passed. Does **not** run
`composer install`. See [Installation](/getting-started/installation).

### `php artisan panel:update`

```
panel:update {--force}   Replace page files you've edited
```

Run after `composer update alxtexh-enterprise/panel`. Reconciles page files,
repoints stale `@source` lines in your CSS, appends missing design tokens,
reports (never runs) pending migrations, reports (never writes) plugins the
new version ships that your published config's `plugins` list is missing, and
refreshes `AGENTS.md`. Exits with `panel:doctor`'s own exit code, so a doctor
regression fails a deploy step that runs this command.

## Generators

### `php artisan make:panel {id}`

```
make:panel {id}
    {--path=}            URL prefix. Defaults to the id
    {--guard=web}
    {--new-guard}         Create that guard in config/auth.php
    {--guard-model=App\Models\User}
    {--central}           A platform panel: no tenant scoping
    {--auth}              Also generate sign-in/out/password-reset for this panel
    {--force}
```

Creates a provider, a resource directory, and an isolation test asserting the
new panel doesn't leak into others.

### `php artisan make:panel-resource {model}`

```
make:panel-resource {model}
    {--panel=}   Defaults to the first registered panel
    {--generate}  Introspect the table and pre-fill columns and fields
    {--force}
```

The model must already exist. Always writes a policy stub (extending
`TenantResourcePolicy`), a factory stub, and a contract test alongside the
resource. `--generate` reads the table's actual columns via
`Schema::getColumns()` and infers column/field/filter types — see
[Creating resources](/resources/) for exactly what it infers and when.

### `php artisan make:panel-page {name}`

One of 17 mode flags (`--dashboard`, `--plan-setup`, `--till`, `--catalog`,
`--catalog-item`, `--register`, `--signatures`, `--device-preview`,
`--api-keys`, `--api-docs`, `--invites`, `--feature-flags`, `--webhooks`,
`--billing-portal`, `--email-templates`, `--onboarding`, `--media-library`),
plus `--panel=` and `--force`. Passing more than one mode flag is an error.
With no mode flag, writes a plain page extending `Page` with an empty Vue
canvas.

### `php artisan make:panel-relation-manager {parent} {related}`

```
make:panel-relation-manager {parent} {related}
    {--panel=}
    {--force}
```

Generates nested relation pages — a dedicated list/create/edit, never a
modal. This is the exact, confirmed command name; it is **not**
`make:relation-manager`. See [Relation Managers](/relation-managers/).

::: warning Unlike `make:panel-resource`, this has no `--generate`
The generated child `Resource`'s columns/fields are a generic starting
template, not introspected from the related table's actual schema — it can
reference a column that doesn't exist on your migration. Check the
generated file against the real table before running it, the same way
you'd review a generated policy.
:::

### `php artisan make:panel-module {key}`

```
make:panel-module {key}
    {--resource}   Write a resource stub instead of a page (needs a same-named model)
    {--panel=}
    {--force}
```

Scaffolds a plan-gated screen (`protected static ?string $module = '{key}'`)
and prints the `Module::make()` registration snippet you still need to add to
a panel provider yourself.

### `php artisan make:panel-recipe {name}` (alias `panel:recipe`)

```
make:panel-recipe {name}
    {--panel=}
    {--migrate}   Run the written migration
    {--seed}      Insert a few fake rows (default: empty table)
    {--force}
```

Writes the official starter: one resource, its model, policy and migration,
using kit Vue with no custom pages. This is the recommended first thing to
run after `panel:install` — see [Quick start](/getting-started/quick-start).

### `php artisan make:panel-widget {name}`

```
make:panel-widget {name}
    {--chart}   ChartWidget instead of StatWidget
    {--panel=}
    {--force}
```

### `php artisan make:panel-importer {resource}`

```
make:panel-importer {resource}
    {--panel=}
    {--force}
```

Writes an empty importer a resource's `importable()` can name. Requires the
optional `alxtexh-enterprise/panel-operations` package to actually import
anything — see [Actions](/actions/).

### `php artisan make:panel-plugin {name}`

```
make:panel-plugin {name}   e.g. Acme/Billing
    {--force}
```

Scaffolds a host-owned `PanelPlugin` class and a README — see
[Extending PanelKit](/extending/).

## Users & permissions

### `php artisan panel:make-user`

```
panel:make-user
    {--name=}
    {--email=}
    {--password=}   Non-interactive only; prefer the interactive prompt
```

### `php artisan panel:permissions {action=sync}`

```
panel:permissions {action=sync}   sync | list | grant
    {--email=}     With `grant`, the account to make an Administrator
    {--prune}      Also remove granted abilities that no longer exist
    {--dry-run}    Report what would change without changing it
```

`sync` creates any missing `Permission` rows for registered resources, creates
an `Administrator` role holding every ability if a tenant has none, and (with
`--prune`) removes granted abilities that no longer correspond to any
resource. `grant --email=` is the unlock path when nobody can sign in at all.
See [Permissions](/authorization/#permissions).

## Health

### `php artisan panel:doctor`

```
panel:doctor
    {--profile=default}   default | production
    {--json}
```

Runs 33 configuration checks in the default profile (missing policies, the
`$navigationIcon` mistake, unsupported icon names, tenancy misconfiguration,
stale CSS tokens, unregistered resources, and more), plus 8 additional checks
under `--profile=production` (queue/cache/session drivers, cookie security
flags, `APP_KEY` strength, debug mode). Five plugin-compatibility checks run
under both profiles. Exit code is non-zero only when a finding is a
`problem`, not a `note`. See [panel:doctor](/navigation/#panel-doctor) and
[Troubleshooting](/troubleshooting/).

### `php artisan panel:setup`

```
panel:setup {--json}
```

A shorter, install-time-focused checklist (mail, MFA readiness, tenancy,
Turnstile) plus every `problem`-level `panel:doctor` finding, surfaced as
unchecked items. The dashboard's SetupChecklist widget renders the same data
over time.

### `php artisan panel:validate`

```
panel:validate
    {--profile=default}
    {--json}
```

## Maintenance & operations

| Command | Purpose |
|---|---|
| `panel:cache-clear` | Invalidate every cached panel schema |
| `panel:backup {--tenant=}` | Run a backup, optionally for one tenant only |
| `panel:prune-exports` | Delete exports past their retention window, file and record together |
| `panel:prune-trash {--days=} {--pretend}` | Permanently delete records past their trash retention window |
| `panel:prune-uploads {--hours=24} {--dry-run}` | Delete pending uploads never saved to a record |
| `panel:refresh-rollups {--days=2} {--backfill=} {--period=day}` | Pre-aggregate dashboard time series |
| `panel:reindex-tenant {--pretend}` | Add indexes suited to a dedicated tenant database |
| `panel:search-index {--apply}` | Report (or create) the trigram/fulltext indexes your search engine would use |
| `panel:sitemap-generate` | Write `sitemap.xml` from every registered URL |
| `panel:tenant-suspension {slug} {--lift} {--reason=}` | Suspend a tenant, or lift a suspension |
| `panel:billing-check` | Apply grace-period billing transitions |
| `panel:notifications-digest {--frequency=daily}` | Send grouped notification digests |
| `panel:monitor-sample` | Record one monitoring sample; alert on a crossed threshold |
| `panel:benchmark {--tenant=} {--runs=3} {--budget=300} {--json}` | Time the panel's list surfaces and report medians |
| `panel:modules {--json}` | Inspect capability modules and their optional-package dependencies |
| `panel:doctor-alert {--force}` | Run `panel:doctor` and announce changes via Telegram |
| `panel:knowledge {action=index} {--tenant=} {--source=*} {--fresh}` | Index panel content so the in-app assistant can cite it |
| `panel:api-token {email} {name} {--ability=*} {--days=}` | Issue an API token for the public API |
| `panel:blueprint {--file=} {--print}` | Write (or reprint) the generated `AGENTS.md` conventions file |

::: tip Coverage note
`panel:update`, `make:panel-module`, and most of the maintenance/operations
commands above are documented and shipped, but — per direct inspection of
`packages/panel/tests/` — have thinner or no dedicated command-level test
coverage compared to `panel:install`, `make:panel-resource`, `panel:doctor`
and `panel:permissions`. That doesn't make them unsupported; it's a fact
worth knowing if one behaves unexpectedly on your data.
:::
