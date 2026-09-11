# Alxtexhpanel

A Laravel + Inertia + Vue admin panel you install into an app. Filament's
developer experience, SPA transport.

**[Full documentation →](docs-site/index.md)** for every field, column,
filter, action, widget and command, and how to switch each part on — plus a
[generated API reference](docs-site/api/index.md). Not deployed as a site yet;
browse the source directly, or run `make docs-preview` to view it locally.
**[AI Blueprint →](AI_BLUEPRINT.md)** for coding agents building on PanelKit.
**[Changelog →](CHANGELOG.md)** for what changed release to release, including
any breaking change and the fix it needs.

From GitHub only (no Packagist or npm registry). Develop in **panelkit**;
installers consume **Alxtexh/panel**. Vue is vendored into that Composer package
via `make sync-client` (`packages/ui` → `resources/client`) - there is no
separate UI repo.

Add this to your application's `composer.json`:

```json
"repositories": [
    { "type": "vcs", "url": "https://github.com/Alxtexh/panel", "no-api": true }
]
```

Then run:

```bash
composer require alxtexh-enterprise/panel:^1.0
php artisan panel:install
php artisan make:panel-recipe Invoices
```

`panel:install` does not run `composer install`. Run it after `composer require`.

On a fresh Laravel 12/13 app (which already locks `guzzlehttp/guzzle` 8.x), plain
`composer require` fails: Telegram's `^7.8` Guzzle constraint can't resolve
without it, so add `-W` (`composer require alxtexh-enterprise/panel:^1.0 -W`).

**AI: read `AGENTS.md` first** (Day 0 do/don't). Install writes it. Claude Code: `php artisan panel:blueprint --file=CLAUDE.md`.

First visit is **chrome plus an empty canvas**: dashboard, user menu, Get started.
Not Nairobi Fibre, not sample orders. After install, next is that card or the
starter recipe (one Invoice resource, kit Vue, empty table). Create and edit
are dedicated pages.
The default path loads published kit CSS/JS (`public/vendor/panel`), so there
is no white page without npm. Host apps do not install the kit from npm.
`npm run build` is optional, only if you customise Vue in your own Vite pipeline.

`apps/playground` is an **ISP demo application**, not the kit default. Use it to
see a fully dressed vertical. Judge a fresh install from `panel:install`.

Add a screen by writing **one PHP class**. No Vue.

```php
final class ClientResource extends Resource
{
    protected static string $model = Client::class;

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->sortable()->searchable()->locked(),
                BadgeColumn::make('status')->colors(['active' => 'success', 'expired' => 'danger']),
                DateColumn::make('expiry_date')->label('Expires')->sortable(),
            ])
            ->filters([SelectFilter::make('status')->options(['active', 'expired'])])
            ->tabs('clients.status', ['active', 'expired', 'suspended']);
    }
}
```

That produces a list with search, filters, tabs with counts, sortable columns,
column visibility, row selection, keyset pagination, create/edit/delete and row
actions.

---

## Running the ISP demo

The playground is a fully dressed demo, not a starter you copy as the product.
**`public/build/` is committed**, so a clone of this monorepo can run the demo
without Node. `vendor/` is not committed.

```bash
git clone <this-repo> myapp && cd myapp/apps/playground
```

Composer needs a GitHub token to fetch dependencies — **once per machine, not
per project**:

```bash
composer config --global github-oauth.github.com <your-github-token>
```

> **This is about RATE LIMITS, not access.** Every dependency here is public;
> GitHub simply throttles unauthenticated API requests per IP, and Composer
> fetches dist archives through that API. So **a token with no scopes at all
> works** — create one at *Settings → Developer settings → Personal access
> tokens*, tick nothing, and paste it. Without it, `composer install` fails
> with `Could not authenticate against github.com`, which reads as a
> permissions problem and is not one.
>
> **Never commit a token.** It belongs in your global Composer config, which is
> outside the repository. A token in a file that gets pushed is a token that is
> public, and GitHub's secret scanning will revoke it - after everybody who
> cloned in the meantime already has it.

```bash
composer install
```
```bash
cp .env.example .env && php artisan key:generate
```
```bash
php artisan migrate --seed && php artisan panel:permissions sync
```

Then `composer run serve` (or `composer run dev` for PHP + Vite) and
`http://127.0.0.1:8899`. Do not start serve from a Cursor agent terminal; those
sessions abort it. Use a real terminal, or `nohup php artisan serve --host=127.0.0.1 --port=8899`.

**`panel:permissions sync` is not optional.** The panel denies by default, so an
installation with an empty permissions table shows a working sign-in and then an
empty sidebar, an empty account menu and no widgets - everything correct and
everything hidden. That reads as a broken install and is not one.

There is **no `composer require`** for the panel itself: the two packages are
consumed by local path (`../../packages/panel` and `file:../../packages/ui`), so
they resolve inside this tree and were never coming from a registry. Copying the
repo copies the framework.

**You only need Node for the toolchain below** - rebuilding assets, adding a
front-end dependency, running the UI tests. To run what is already here, you do
not.

---

## Running it for development

```bash
scripts/bootstrap-env.sh   # PHP 8.4, Composer, Node 22 - read it first
make install
make seed
make dev
```

Then `http://localhost:8000`. `make help` lists everything.

> **On Windows**: `php` on PATH is often an older build. The application needs
> PHP >= 8.4.1, and anything that shells out to `php` - including Vite's
> `wayfinder:generate` step - must find it. Put the 8.4 directory ahead of the
> others on PATH before starting Vite.

---

## Repository layout

```
packages/panel/    The PHP half: resources, pages, commands, widgets
packages/ui/       The Vue half: shell, tables, charts, form fields
apps/playground/   Demo ISP app (Nairobi Fibre). Not the kit default.
```

The split is a workspace, not a distribution: `apps/playground` consumes both
through a composer `path` repository and an npm `file:` dependency. Nothing is
published anywhere.

Two rules the UI package holds and a test enforces:

1. **Nothing in `packages/ui` imports Inertia.** Components take props and emit
   events; a thin adapter in the consuming app wires Inertia to them. Swapping
   the transport means rewriting one file.
2. **Components never fetch.** Only page-level components trigger data loads.

---

## The architecture, in one table

| Concern | Lives in | Travels | Frequency |
|---|---|---|---|
| **Schema** — which columns, filters, tabs, fields exist | PHP resource class | Once per session, cached | Rare |
| **Data** — the rows, filter options, counts | Eloquent query | Every filter, sort, page change | Often |
| **Rendering** | One generic Vue page | Never — it is in the bundle | Never |

The schema contains **no tenant data**. Filter and select options are tenant
data and ship beside the records, which is why the schema cache key needs no
tenant id: entries collapse from (tenants × resources) to
(permission sets × resources), and an entry holding no tenant data cannot leak
tenant data however badly its key is built.

---

## What it does that most admin panels do not

**Never blocks a list on `COUNT(*)`.** The total is a deferred prop that arrives
after the rows. This is the single largest source of slow admin tables.

**Keyset pagination.** `OFFSET 100000` makes the database walk 100,000 rows it
then discards, so page 2,000 gets steadily slower. A keyset seek uses the index,
so page 2,000 costs what page 1 costs. The trade is no jump-to-arbitrary-page.

**One query for N tabs.** Tab counts come from a single grouped aggregate, never
one `COUNT` per tab.

**Modals open with zero network requests.** Field definitions arrive with the
schema and option lists with the data, so opening a form or a confirmation is
local state.

**Denies by default.** A resource whose model has no policy denies every ability
and logs why. The usual default means forgetting a policy silently grants
everyone everything, and the page renders correctly for whoever forgot.

**Mass assignment closed by construction.** Only keys the form declares can be
written. A `$fillable` list can be forgotten when a column is added; a form that
does not mention a field cannot submit it.

**No CSS classes in PHP.** The schema carries semantic values — `type: 'badge'`,
`color: 'success'`, `muted: true` — and Vue owns presentation. A class string
authored in PHP is invisible to the CSS scanner and gets purged silently, and
*partially*, so one class of a pair survives and the element renders wrong at
some widths with no error anywhere.

---

## Commands

| Command | Does |
|---|---|
| `make:panel-resource {Model} --generate` | Introspects the table and writes a working resource plus a policy stub |
| `make:panel-page {Name} [--dashboard]` | A screen that is not a list of records; `--dashboard` hosts the widgets |
| `panel:doctor` | The checks whose failures are silent — a resource with no policy, a filter with no index, permissions that fail open |
| `panel:seed-demo --scale=large` | Demo data for the reference app |
| `panel:cache-clear` | Invalidates every cached schema by bumping a generation counter |

Adding a screen, end to end:

```bash
php artisan make:model Customer -m
php artisan migrate
php artisan make:panel-resource Customer --generate
```

Then visit `/customers`. Discovery registers the resource; there is no route to
add and no registration line to write.

---

## Keeping the design intact

`scripts/shots.sh` captures every screen at 1400 / 768 / 375 in light and dark,
driving Chrome directly. `scripts/shots-diff.mjs` compares two captures and
fails on anything differing by more than 0.1% of its pixels.

```bash
scripts/shots.sh .shots/current http://127.0.0.1:8000 1
node scripts/shots-diff.mjs .shots/playground .shots/current
```

It needs built assets: stop `npm run dev`, delete `public/hot`, `npm run build`.
Chrome is a Windows exe and Git Bash speaks POSIX, so every path handed to
Chrome goes through `winpath()` in that script.

`.shots/` holds the reference capture of the demo.

---

## Known gaps

Stated rather than implied:

- Live updates: the **poll** driver is the default and is exercised end to end —
  `LiveUpdatesTest` drives the real endpoint, including tenant isolation, the
  bounded id list, one query per poll and a guest refusal. The **socket** is now
  exercised too, by `make verify-broadcast`: it starts Reverb, subscribes over a
  real WebSocket, publishes from the application, and fails if the message does
  not arrive. It is a script rather than a test because it needs a server, a
  port and two processes — a fixture no unit test should own. Run it after
  touching broadcasting; nothing else will tell you, because `useLiveUpdates`
  degrades to polling when the socket is absent, so a broken transport renders
  as a working panel.
- The development database is SQLite, so every performance number here
  demonstrates that the query *shape* is sound rather than transferring to
  Postgres unchanged.
- SSR is **off**, deliberately rather than unfinished. The starter kit ships it
  on with nothing serving it, so every request pays a failed connection to
  13714 before falling back — a page that works and is quietly slower. It does
  render: `/login` with SSR on returns `data-server-rendered`, one `<form>` and
  three `<input>`s; with it off, none of them. `make ssr` turns it on in the
  order that works — **the flag first**, because `inertia:start-ssr` reads the
  config and refuses to start while it is false.

Four entries that used to sit here have been removed, because each was wrong:

- *"`panel:doctor` reports 'nobody can open the panel' on a healthy install."*
  Fixed, and now held there. The check counts the `model_has_roles` pivot
  directly instead of `whereHas('roles')`, which went through Spatie's team
  scoping and counted zero on a console run that resolves no team. It had no
  test, and `whereHas('roles')` is the obvious way to write it — so the fix was
  one tidy-up away from being undone with every test still green.
  `DoctorLockoutTest` pins both directions: quiet when a role is held in a team
  the CLI cannot see, and still loud when nobody holds one. A check silenced
  into never reporting is worse than one that cries wolf.

- *"Precognition is blocked by a peer dependency."* It checked
  `laravel-precognition-vue-inertia`, which this application does not need —
  Inertia v3's own `useForm` ships `withPrecognition()`. Nothing was blocked.
  What was true, and worse than the gap claimed, is that `store` and `update`
  were already inside a `precognitive` route group and **answered every payload
  with `204 Precognition-Success: true`** — including payloads the same endpoint
  rejected with 422 without the header. `PrecognitionControllerDispatcher` never
  calls the controller method; it resolves the parameters and aborts. Validation
  and authorisation lived in the method body, so neither ran. Both now live in
  `RecordFormRequest`, and `PrecognitionTest` covers it — including that a
  denied ability is still denied when the header is present.
- *"Bulk actions have no automatic queue threshold."* They do:
  `BulkController::run` computes `$queued = $all || count($ids) > threshold`,
  the default is `panel.bulk.queue_threshold` at 250 rows, an action may
  override it with `BulkAction::queueThreshold()`, and `BulkQueueThresholdTest`
  covers inline, queued, and the queued job acting on exactly the selected rows.
- *"Turning SSR on is three commands."* The three commands were listed in an
  order that fails at step two.
