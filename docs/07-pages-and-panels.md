# 7. Pages and panels

## A custom page

```bash
php artisan make:panel-page Reports
php artisan make:panel-page Overview --dashboard   # a widget host
php artisan make:panel-page Front --till
```

Mail and Chat are empty apps, not default routes:

```php
Panel::make('admin')->apps(['mail', 'chat']);
```

API docs (Scalar) is the same opt-in shape:

```php
Panel::make('admin')->apiDocs();
// or: ->apps(['api-docs'])
// or: ->apiDocs('/docs/openapi.json')  // use your own OpenAPI URL
```

That mounts Developer → API docs at `/apps/api-docs`, serves OpenAPI at
`/apps/api-docs/openapi.json`, and writes an `ApiDocs.vue` stub via
`panel:install` / `panel:update` so Vite never misses the page. After Composer
install from GitHub (`alxtexh-enterprise/panel`), run `panel:update` so the
optional screen file exists before you enable the app.

Feedback is `Panel::feedback($persist)` plus `FeedbackDialog`. Appearance
persists at `PUT {panel}/settings/appearance`.

```php
final class Reports extends Page
{
    protected static string $panel = 'admin';
    protected static ?string $group = 'Insights';
    protected static ?string $ability = 'view_reports';

    public static function props(): array
    {
        return ['rows' => Report::all()];
    }
}
```

A page declares its own ability. If that name is not in the registry it is not
in the permission matrix, `grants_all` never tops it up, and
`panel:permissions --prune` deletes it as unknown — so declare extra abilities
in `config/panel.php` under `abilities`.

## Several portals

```bash
php artisan make:panel reseller --guard=resellers --new-guard --auth
```

That writes a provider, a resource directory, a discovery entry, a line in
`bootstrap/providers.php`, an isolation test, and with `--new-guard` the guard,
provider, password broker in `config/auth.php`, plus a model and migration when
`--guard-model` is not already on disk.

**`--new-guard` matters.** Without it, naming a guard that does not exist
produces a portal that generates cleanly, reports success, and answers its first
request with `Auth guard [resellers] is not defined.` The command now warns even
when you do not pass the flag.

The provider it writes is ordinary readable PHP, meant to be edited:

```php
Panel::make('reseller')
    ->path('reseller')
    ->guard('resellers')
    ->authMiddleware(['auth:resellers'])
    ->brandName(fn (): string => config('app.name').' - Reseller')
    ->without(['operations', 'documents'])
    ->login();
```

**Central versus tenant is asked, never guessed.** A central panel must never
have tenant scoping applied; a tenant panel must refuse to boot without a
resolved tenant. Getting it wrong is how an operator sees everyone's data, and
neither shows a symptom until somebody looks closely at a list they had no
reason to distrust. Each generated portal ships with an isolation test that
enumerates the registry, so a resource added tomorrow is covered without editing
it.

## Navigation

Entries come from resources and pages automatically. Sort and group with
`$group`, `$sort` and `$icon`.

**Groups nest** with a slash:

```php
protected static ?string $group = 'Building/Reference';
```

Declare entries that are not resources on the panel:

```php
Panel::make('admin')->navigationItems([
    [
        'title' => 'Documentation',
        'href' => static fn (): string => route('docs'),
        'icon' => 'book-open',
        'group' => 'Building/Reference',
        'sort' => 90,
        'ability' => 'view_docs',   // optional; hides when absent
    ],
]);
```

`href` may be a closure so it resolves per request.

## The shell

`PanelShell` reads what the server already shares — navigation, brand, colours,
the account menu — so a layout is three lines:

```vue
<script setup lang="ts">
import { PanelShell } from '@alxtexh-enterprise/panel/inertia';
</script>

<template>
    <PanelShell><slot /></PanelShell>
</template>
```

Slots: `#topbar` for a heading or breadcrumbs, `#actions` for trailing controls,
`#userMenu` to replace the account menu entirely. To replace the shell, stop
importing it and write your own. The props are all on the page.

Per-panel colours are applied as CSS variables, resolved per request, so a
portal can wear the signed-in reseller's brand.

`AppLogo` (the mark in the sidebar) renders `page.props.panelLogo` — a plain
URL string, not fetched by this package. Share it from your own Inertia
middleware however your application stores logos: a database column, a
config value, a disk path. `page.props.panelLogoDark` is the same, read for
the panel's dark theme; set only `panelLogo` and the mark simply does not
change between themes. With no logo shared at all, the sidebar shows the
tenant's name instead of a placeholder mark, per `brandName()` above.

## Environment badge

Removed from chrome. The top bar no longer shows a LOCAL / staging badge (it
congested the header next to breadcrumbs). `Panel::environmentBanner()` and
`PANEL_ENVIRONMENT_BANNER` remain as no-ops so existing host registration does
not break; shared `environmentBanner` is always `null`. Do not restore a
full-width strip.

## Sidebar design families

Set **one layout when you register the panel** so each system looks visually
distinct. This is the admin's design choice at bootstrap, not a runtime toggle:

```php
$panels->registerPanel(
    Panel::make('reseller')
        ->path('reseller')
        ->sidebarLayout('floating')  // inset (default), sidebar, icon, header, accordion, …
        ->discoverResources(...)
);
```

Shorter form when chaining on `Panel::make()`:

```php
Panel::make('admin')
    ->sidebarLayout('floating')  // or 'inset' (default), 'sidebar', 'icon', 'header', …
    // ->sidebarLayout('sidebar-07')  // same as 'icon'
    // ->sidebarLayout('sidebar-05')  // same as 'accordion'
```

`AppSidebar` / `PanelShell` rearrange chrome from `sidebarLayout()`. Prefer
`sidebarLayout()`. `sidebarVariant()` is the same setter. You may also pass a
shadcn-vue block id (`sidebar-08`, `sidebar-07`, …); it resolves to the PanelKit
name. Default is `inset`, which preserves the rail panels already ship.

| PanelKit | shadcn-vue | Composition |
| --- | --- | --- |
| `inset` | sidebar-08 | Inset rail + secondary footer nav (default) |
| `sidebar` | sidebar-01 | Edge-flush grouped rail (`edge` alias) |
| `floating` | sidebar-04 | Floating card rail |
| `icon` | sidebar-07 | Icon rail by default (`rail` alias) |
| `header` | sidebar-16 | Sticky site header (brand, search, lock, user), nav-only rail |
| `accordion` | sidebar-05 / sidebar-06 | Plus/Minus collapsible groups (`dropdown` alias) |
| `file-tree` | sidebar-11 | Nested folder / file tree (`tree` alias) |
| `calendar` | sidebar-12 | Mini calendar chrome, user in rail header |
| `dialog` | sidebar-13 | Overlay / offcanvas dialog-style rail |

Patterns are reimplemented against kit tokens; do not run `npx shadcn-vue add`
into the monorepo for these.

Playground demos: **Sidebar samples** in the nav, at `/screens/sidebar/{layout}`
(live shell, not screenshots). Auth samples stay under `/screens/auth/...`.

## Routes yield to yours

If your application already answers `GET /settings/profile`, the package does
not mount its own. Laravel indexes routes by method and URI, so a second
registration would **replace** yours and every `route('profile.edit')` in your
codebase would throw — from a package you installed for its screens. Skipping is
the safe direction, and it is per URL: claiming profile does not cost you the
security screen.
