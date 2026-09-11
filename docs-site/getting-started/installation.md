# Installation

## Distribution: GitHub only

PanelKit installs from GitHub via a Composer VCS repository. There is no
Packagist package and no npm registry package.

| What | How you get it |
|---|---|
| PHP package | `composer require alxtexh-enterprise/panel` from a GitHub VCS repository |
| Kit CSS/JS | Shipped inside the Composer package; `panel:install` copies it to `public/vendor/panel` |
| Vue screens (optional) | A `file:` dependency on the package's `resources/client`, wired up automatically only if you run your own Vite build |

You do **not** need npm for the kit UI. npm is only needed if you customise
Vue components yourself and run `npm run build`.

## Add the repository and require the package

```json
"repositories": [
    { "type": "vcs", "url": "https://github.com/Alxtexh/panel", "no-api": true }
]
```

::: warning `"no-api": true` is load-bearing
Without it, Composer calls GitHub's API for a VCS repository and authenticates
even for a public repo — failing with `Could not authenticate against
github.com`, which reads like the repository is private. With it, Composer
clones directly and no credential is involved.
:::

```bash
composer require alxtexh-enterprise/panel:^1.0
php artisan panel:install
```

`panel:install` does not run `composer install` for you — run it after
`composer require`. It publishes config, scaffolds the panel plumbing, and
writes front-end wiring based on whatever version Composer already installed.

::: tip Testing a local fork
A Composer `path` repository has no version tag to satisfy `^1.0` against —
Composer will only offer `dev-main`. Require that constraint explicitly:
`composer require alxtexh-enterprise/panel:@dev` (no `-W` needed for a path
repository). A normal install from the `vcs` repository above uses `^1.0`
exactly as shown.
:::

::: tip Guzzle version conflicts on a fresh Laravel 12/13 skeleton
If your app already locked `guzzlehttp/guzzle` 8.x, `composer require` may
need `-W` so a transitive `^7.8` Guzzle constraint can resolve.
:::

## AI agents: read `AGENTS.md` first

`panel:install` writes `AGENTS.md` with a "Day 0" section of do/don't rules at
the top, generated from your actual running application. If you're using
Claude Code, run `php artisan panel:blueprint --file=CLAUDE.md` for the same
content under the name Claude Code looks for. See the [AI Blueprint](/ai/)
for the fuller, framework-level version of this guidance.

## Common flags

```bash
# You already have a login (starter kit, Fortify, etc.)
php artisan panel:install --no-auth

# You want to create the first administrator yourself
php artisan panel:install --no-user
php artisan panel:make-user

# Non-interactive first user
php artisan panel:install --name="Ada" --email=ada@example.com --password=secret

# Overwrite previously published config/page files
php artisan panel:install --force
```

## What `panel:install` actually does

It is idempotent and never overwrites a file you've edited — running it twice
leaves everything byte-identical.

| Step | Result |
|---|---|
| Publishes `config/panel.php` | Every option, commented. Tenancy defaults to `none` |
| Publishes kit language files | `lang/vendor/panel/{en,es,fr}` |
| Publishes kit assets | `public/vendor/panel/{app.css,app.js}` — first visit has styling with no npm build |
| Writes `resources/views/app.blade.php` | Root view; loads kit dist unless a Vite manifest exists |
| Writes `resources/js/app.ts` | Inertia bootstrap with a `layout: (name) => …` callback so `PanelLayout` (and nested `SettingsLayout`) wraps every page, including ones that only set breadcrumb layout props |
| Writes `resources/js/layouts/PanelLayout.vue` | A layout you're meant to replace; forwards breadcrumbs into `PanelShell` |
| Merges `resources/css/app.css` | Points Tailwind at the package's design tokens |
| Wires `vite.config.js` | Adds the Vue plugin if the app has none |
| Appends `SharePanelProps` to the `web` middleware group | Not optional — app-owned routes keep the shell (account menu, footer) |
| Writes core page files | Auth, CRUD, settings, dashboard host, SaaS suspended-access screen |
| Writes an empty `DashboardPage` | No sample data; you fill in `stats()` / `charts()` |
| Scaffolds sign-in | Default; skip with `--no-auth` |
| Syncs permissions and creates the first user | Administrator with `grants_all`; skip with `--no-user` |
| Creates `app/Panel/` | Where your resources live |
| Writes `AGENTS.md` | Generated conventions — see above |

Auth is **on by default**, matching `filament:install --panels`.

## After install

```bash
php artisan migrate
php artisan panel:permissions sync
php artisan panel:doctor
```

Set environment variables as needed:

- `MAIL_*` — required for email OTP and email verification.
- Social provider keys in `config/services.php` — required for any social login button to appear.
- `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` — optional; see [Authentication](/authentication/).

Run the setup checklist any time to confirm mail, the app key (needed for
MFA), tenancy and Turnstile look ready, plus any open `panel:doctor` findings:

```bash
php artisan panel:setup
php artisan panel:setup --json   # machine-readable, for CI
```

## Upgrading

```bash
composer update alxtexh-enterprise/panel
php artisan panel:update
```

`panel:update` reconciles page files, repoints stylesheet `@source` lines if
the package moved, and appends any missing design tokens your `resources/css/app.css`
is missing. `panel:doctor` fails while those tokens are absent.

## Page width — do not centre admin screens

Panel pages fill the main content area (`PAGE_SHELL` / `PAGE_SHELL_STACK` /
`PAGE_SHELL_COMPACT`). Resource list, create, edit and view pages are
full-bleed by default. Don't wrap resource or settings screens in
`max-w-* mx-auto` unless the screen is intentionally narrow (login,
onboarding, a marketing page) — see [Customization](/customization/).
