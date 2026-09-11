# 1. Install

## Distribution policy (GitHub only)

PanelKit installs from GitHub via a Composer VCS repository. There is no
Packagist package and no npm registry package for installers to fetch.

| What | How installers get it |
|---|---|
| PHP package | `composer require alxtexh-enterprise/panel` from the GitHub VCS repo |
| Kit CSS/JS | Shipped inside the Composer package; `panel:install` copies to `public/vendor/panel` |
| Vue screens (optional) | `file:` dependency on `vendor/.../resources/client` when you run your own Vite build |

Host applications do **not** need npm for the kit UI. npm is optional, only when
you customise Vue and run `npm run build` for your app. The monorepo uses npm
internally to build the playground demo; that is not part of the installer path.

## GitHub names (two repos)

| Repository | Role |
|---|---|
| `Alxtexh/panelkit` | Monorepo for development (PHP package + Vue kit + playground) |
| `Alxtexh/panel` | **Consumer artifact.** Composer VCS target for `alxtexh-enterprise/panel` |

Vue for consumers is built in the monorepo (`packages/ui`), mirrored with
`make sync-client` into `packages/panel/resources/client`, and ships inside
`Alxtexh/panel`. Host apps never need a separate UI dependency. There is no
Packagist release and no npm registry package for kit consumers.

A third name, `Alxtexh/panel-ui`, used to be documented here as an "optional
mirror" of `packages/ui`. It was never created - `git ls-remote` against it
returns "Repository not found" - and nothing in the installer path, this
monorepo's remotes, or `scripts/split.sh`'s actual usage needs it to exist.
Removed rather than left as a repo somebody might go looking for.

## GitHub only install (VCS composer repository)

Develop in **panelkit**; install from **Alxtexh/panel**. This installer flow
avoids any Packagist or npm registry account. Add the VCS repository to your
application's `composer.json`:

```json
"repositories": [
    { "type": "vcs", "url": "https://github.com/Alxtexh/panel", "no-api": true }
]
```

Then require **^1.0**:

```bash
composer require alxtexh-enterprise/panel:^1.0
php artisan panel:install
```

`panel:install` does not run `composer install`. Run the installer after
`composer require`, and it will publish config, scaffold panel plumbing, and
write front-end wiring based on the version Composer already installed.

> **Testing a local fork or an unreleased branch?** A Composer `path`
> repository pointed at a local checkout (instead of the `vcs` repository
> above) has no version tag to satisfy `^1.0` against, and Composer will only
> offer `dev-main` (or whichever branch you have checked out). Require that
> constraint explicitly instead: `composer require alxtexh-enterprise/panel:@dev`
> (no `-W` needed for a path repository). This applies only to local
> path-repository testing - a normal install from the `vcs` repository above
> uses `^1.0` exactly as documented.



**AI: read `AGENTS.md` first.** Install writes that file (Day 0 do/don't at the
top). Claude Code: `php artisan panel:blueprint --file=CLAUDE.md`. Cursor: if
`.cursor/rules` already exists, install also writes `panelkit.mdc`.

Optional flags:

```bash
# If you already have a login (starter kit, Fortify, etc.)
php artisan panel:install --no-auth

# If you want to create the first Administrator yourself
php artisan panel:install --no-user
php artisan panel:make-user
```

## Post-install setup checklist

After `panel:install`, run an optional doctor-backed checklist for the settings
most hosts configure next:

```bash
php artisan panel:setup
```

It reports whether mail, the application key (needed for MFA), tenancy, and
Turnstile look ready, then lists any open `panel:doctor` problems. Use
`--json` when you want machine-readable output for scripts or CI.

The dashboard SetupChecklist card uses the same doctor findings over time; this
command is the terminal equivalent right after install.

## Page width (do not centre admin screens)

Panel pages fill the main content area with normal padding
(`PAGE_SHELL` / `PAGE_SHELL_STACK` / `PAGE_SHELL_COMPACT` from
`@alxtexh-enterprise/panel`). Create, edit, and view resource pages are
full-bleed by default; wrap fields in left-aligned `FORM_MEASURE`
(`max-w-7xl`, no `mx-auto`) when a reading measure helps. Do **not** wrap
settings, resources, or `make:panel-page` screens in `max-w-*` + `mx-auto`
unless the screen is intentionally narrow (login, onboarding, marketing).
Appearance `contentLayout: 'centered'` is the opt-in for hosts who want a
reading measure; it is not the kit default. See [14. Design layout](14-design-layout.md)
for the freeze checklist (`PAGE_SHELL`, `FORM_MEASURE`, one-card `TableShell`).

## What we shipped recently

These changes matter during installation and first login:

- Email OTP MFA as a second factor at the login door.
- Optional required-enrol wall after login (enrol TOTP, email OTP, or passkey before reaching the dashboard).
- Registration plus email verification flow for self-service sign-up.
- Tenant scoping foundation and the tenant switcher admin UI once tenancy is configured.
- Notification toasts with action buttons, plus the bell/inbox stored through the database channel.
- Table UX improvements: range selection, toggleable columns, and global search.

First visit uses **published kit CSS/JS** at `public/vendor/panel`. There is no
white page and no `npm run build` required. `npm install && npm run build` is
optional, only if you customise Vue. The default root view loads kit dist when
`public/build/manifest.json` is missing, and `@vite` only when that manifest
exists.

Maintainers: the playground demo must match that published kit. Run
`make sync-client`, rebuild playground assets when needed, then
`make release-check` before tagging. See [14. Design layout](14-design-layout.md).

**`"no-api": true` is load-bearing.** Without it Composer calls GitHub's API for
a VCS repository and authenticates even for a public one, failing with
`Could not authenticate against github.com`, which reads as the repository
being private. With it, Composer clones and no credential is involved.

On a **fresh Laravel 12 or 13** app that already locked `guzzlehttp/guzzle` 8.x,
`composer require alxtexh-enterprise/panel` may need `-W` so Telegram's
`^7.8` Guzzle constraint can resolve. Path and VCS installs both hit this
(confirmed on a Laravel 13.29 skeleton via a fresh-install smoke test).

**There is no npm registry install for the kit.** The Vue screens ship *inside*
the Composer package at `resources/client`. If you later customise Vue,
`panel:install` points your `package.json` at them with a `file:` dependency (not
`npm install @alxtexh-enterprise/panel`). One source, one version, and the two
halves cannot drift apart.

## What first visit looks like

A fresh install is **chrome plus an empty canvas**, not the Nairobi Fibre ISP
demo. After sign-in you should see:

- the dashboard (no sample revenue or orders)
- Settings in the **Settings** sidebar group (primary path; opt out with `->sidebarSettings(false)`)
- the user menu (Profile, Log out; Settings only when the sidebar opt-out is on)
- a **Get started** card with kit chrome steps

Create and edit stay **dedicated pages**. They are not Livewire modals.

`apps/playground` in this monorepo is a **demo application** (an ISP back office)
for design reference. It is not the kit default and not what `panel:install`
writes.

## What `panel:install` does

It is idempotent and never overwrites a file you have edited. Running it twice
leaves `package.json` byte-identical.

Auth is **on by default** (login exists), matching `filament:install --panels`.
Pass `--no-auth` to skip. After install it prompts for `panel:make-user` and
grants **Administrator** (`grants_all`) so the sidebar is not empty. Pass
`--no-user` to skip. It also runs `panel:permissions sync`, appends
`SharePanelProps` to the `web` middleware group, and sets tenancy to `none`
when the users table has no `tenant_id`.

| Step | Result |
|---|---|
| Publishes `config/panel.php` | Every option, commented. Tenancy default `none` |
| Publishes kit lang (`panel-lang`) | `lang/vendor/panel/{en,es,fr}` - overlay with `__('panel::...')` |
| Publishes kit assets | `public/vendor/panel/{app.css,app.js}` from package `dist/kit`. First visit has CSS without npm |
| Writes `resources/views/app.blade.php` | Root view. Loads kit dist unless a Vite manifest exists. Head includes `@include('panel::appearance-prepaint')` **before** CSS/JS so the account theme cannot flash |
| Writes `resources/js/app.ts` | Inertia bootstrap with `layout: (name) => …` so `PanelLayout` (and nested `SettingsLayout` for settings) still wraps pages that only set breadcrumb layout props. Do not strip that callback |
| Writes `resources/js/layouts/PanelLayout.vue` | A layout you are meant to replace; forwards breadcrumbs into `PanelShell` |
| Merges `resources/css/app.css` | Points Tailwind at the package. Without this you get a working panel with no styling |
| Wires `vite.config.js` | Adds the Vue plugin if the app has none |
| Appends `SharePanelProps` to `web` | App-owned routes keep the shell (account menu, footer). This is not optional |
| Writes core page files | Auth, CRUD, settings, dashboard host, and the SaaS suspended-access screen. Catalog / PlanSetup / Signatures stay optional (`PanelPages::writeOptional()`) |
| Writes empty `DashboardPage` | No sample revenue or orders; host fills `stats()` / `charts()` |
| Scaffolds sign-in | Default. `--no-auth` to skip |
| Syncs permissions + first user | Administrator with `grants_all`. `--no-user` to skip |
| Creates `app/Panel/` | Where your resources live |
| Writes `AGENTS.md` | Conventions. **AI: read this first.** Day 0 is at the top. `panel:blueprint --file=CLAUDE.md` for Claude Code |

### Appearance FOUC contract (v1.4.12+, hardened in v1.4.13)

Keep `@include('panel::appearance-prepaint')` **above** every stylesheet and Vite/kit script forever. That include:

1. Embeds `window.__panelAppearance` from `auth()->user()?->appearance` (account is the source of truth).
2. Embeds PHP-computed CSS variables matching the client palette (`AppearancePrepaint`).
3. Emits `<style id="pk-appearance">` critical `:root` tokens for first paint.
4. Runs a blocking script that `setProperty`s those tokens on `<html>` (inline styles beat later `app.css` `:root` rules) and rewrites `#pk-appearance`.

Live admin edits call the same client apply path (`applyAppearance` / `appearancePayload`): DOM vars, `#pk-appearance`, `window.__panelAppearance`, and localStorage update immediately; PUT `{panel}/settings/appearance` persists in the background. Inertia navigations sync only when the server appearance **differs** from what is already applied, so page-to-page visits do not remount-flash after a drawer tweak.

If you installed before v1.4.12, replace the old `__panelAppearance` + localStorage-only head scripts with:

```blade
@include('panel::appearance-prepaint')
```

Do not move the include below stylesheets.

Non-interactive first user:

```bash
php artisan panel:install --name="Ada" --email=ada@example.com --password=secret
```

Add `--force` to overwrite the published config and page files.

## Upgrading an existing host

```bash
composer update alxtexh-enterprise/panel
php artisan panel:update
```

`panel:update` reconciles page files, repoints stylesheet `@source` lines when
the package was renamed, and (from v1.4.20) appends missing status colour
tokens (`--success`, `--warning`, `--info` and their `@theme` `--color-*`
mappings) so `bg-success` / `bg-warning` / `bg-info` badges compile. Rebuild
Vite assets if you customise Vue (`npm run build`); kit-only hosts get the
tokens from republished `public/vendor/panel` after install/update when the
package kit CSS is current. `panel:doctor` fails when those tokens are still
missing from `resources/css/app.css`.

## What is next after install

`panel:install` already publishes kit CSS/JS to `public/vendor/panel`. Next:

1. Run migrations, then reconcile permissions if you added new resources:

```bash
php artisan migrate
php artisan panel:permissions sync
```

2. Set environment variables for mail and auth providers:

- Mail: set `MAIL_*` in `.env` for email OTP and email verification.
- Auth providers: set any provider keys used by `config/services.php`.
- Turnstile (optional): set `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.

3. Create your first Administrator:

- Default install: follow the installer prompt after `panel:install`.
- If you used `--no-user`: run `php artisan panel:make-user`.

4. Verify demo vs production differences:

A fresh install is an empty canvas. Confirm tenancy settings match your
production schema, and do not rely on the repo's demo data layout.

## Host-owned plugins (modular registration)

Plugins let you organise resources, routable Page classes, widgets, sidebar
entries, and render hooks into a reusable unit. They are for first-party,
host-owned packages: code you write and maintain yourself. There is no
marketplace, no third-party plugin track, and no auto-discovery.

Most features should be built directly in the application. Reach for a plugin
only when you need the same screens in more than one project, or when a clean
boundary helps a large codebase.

Register explicitly in published config:

```php
// config/panel.php
'plugins' => [
    \App\Plugins\Acme\BillingPlugin::class,
],
```

Or on one portal in your panel provider:

```php
Panel::make('admin')->plugins([
    new \App\Plugins\Acme\BillingPlugin(),
]);
```

Optionally scaffold a host-owned plugin:

```bash
php artisan make:panel-plugin Acme/Billing
```

`registerPages()` with `pageClasses()` mounts routes when the panel boots and
adds sidebar navigation from the Page class. `registerMenuItems()` with
`menuItem()` adds a sidebar link only: pair it with `PluginContext::routes()`
for custom controllers, or prefer `pageClasses()` for full pages.

`PluginContext::render($position, $component, $props, $resources)` puts a
component at a named position on a screen the panel already owns, so a
plugin can add one sentence to an existing screen without forking it. Every
position, from `Alxtexh\Panel\Plugins\RenderHooks`:

| Constant | Position | Where |
| --- | --- | --- |
| `LIST_BEFORE_HEADER` | `list.before-header` | Above the page title on a resource list |
| `LIST_BEFORE_TABLE` | `list.before-table` | Between the list header and the table |
| `LIST_AFTER_TABLE` | `list.after-table` | Below the table |
| `LIST_ROW_ACTIONS_BEFORE` | `list.row-actions-before` | Beside a row's own action menu, before it - per RECORD, not per page; the component receives that row as a `row` prop |
| `LIST_ROW_ACTIONS_AFTER` | `list.row-actions-after` | Beside a row's own action menu, after it |
| `FORM_BEFORE` | `form.before` | Above a record's create/edit form |
| `FORM_AFTER` | `form.after` | Below the form, above the save bar |
| `VIEW_BEFORE` | `view.before` | Above a record's read-only detail |
| `VIEW_AFTER` | `view.after` | Below the detail - where `TicketingPlugin` mounts a conversation |
| `DASHBOARD_BEFORE` | `dashboard.before` | Top of the dashboard, above the widgets |
| `DASHBOARD_AFTER` | `dashboard.after` | Bottom of the dashboard |
| `SHELL_FEEDBACK` | `shell.feedback` | Panel-wide chrome, not tied to one screen |

`$resources` limits a hook to named resource keys; `null` means every screen
that mounts that position. An unresolved position or component name renders
nothing, silently - markup a plugin's own package never shipped must not
become an error on somebody else's screen.

Vue/Inertia components referenced by render hooks or Page classes live in the
**host application**, not inside the plugin package.

Run `php artisan panel:doctor` to confirm plugin contract compatibility and
catch duplicate page slugs before boot.

### Plugin performance

PanelKit does not scan for plugins. Only classes you list in
`config('panel.plugins')` or `Panel::plugins()` load, and only when their panel
is first used on a request. There is no marketplace hook and no filesystem
auto-discovery. Register only what you need, host Vue components in your app,
and run `panel:doctor --profile=production` for a lightweight plugin count note
and missing-class checks.

## Checking your work

```bash
php artisan panel:doctor
```

Every check in `panel:doctor` exists because the failure is otherwise **silent**,
a working panel serving wrong or unprotected data, where every page returns 200
and every test passes. Run it first on any new installation.

## Requirements

PHP 8.4, Laravel 12 or 13, Inertia 2 or 3, Vue 3.5. Multi-database tenancy
additionally needs `stancl/tenancy` ^3.10.
