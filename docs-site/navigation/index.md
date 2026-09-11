# Navigation

A resource, page, or cluster's place in the sidebar comes from three static
properties: `$icon`, `$group`, `$sort`.

```php
final class InvoiceResource extends Resource
{
    protected static string $icon = 'file-text';
    protected static ?string $group = 'Billing';
    protected static ?int $sort = 10;
}
```

::: danger Never `$navigationIcon`, `$navigationGroup`, `$navigationSort`
Those are Filament's property names. PanelKit's own `panel:doctor` command
specifically detects a resource that declared `$navigationIcon` by mistake —
its docblock notes this exact error has independently happened to six
different resources in the wild. The correctly-named property is silently
ignored if you also declare the wrong one; nothing errors, the sidebar just
shows a generic fallback icon.
:::

Sidebar entries are built by sorting resources, clusters, and any
panel-declared items by `sort` ascending, then `title` ascending — set
`$sort` when you care about ordering within a group; leave it `null`
otherwise.

## Icons

Navigation icons must come from a curated allowlist of roughly 60 names (a
Lucide subset) — a name outside the list doesn't error, it silently falls
back to a generic `package` icon in the sidebar, which is exactly the kind of
silent failure `panel:doctor` exists to catch:

```
activity, app-window, app-window-mac, archive, book-open, building, calendar,
chat, chevrons-up-down, circle-check, coins, credit-card, faq, file,
file-question, file-text, flag, folder, folder-tree, gauge, help, home,
impersonate, info, key, layers, layout-grid, layout-template, life-buoy,
list, lock, log-in, login, mail, map, megaphone, message-circle, package,
panel-left, panel-left-close, receipt, rocket, router, scroll-text,
server-crash, settings, shield-alert, shopping-bag, shopping-cart, sliders,
smartphone, sparkles, square, timer-off, trash, user, user-check, user-plus,
users, wallet, webhook, wrench
```

::: tip Two separate icon vocabularies — don't conflate them
The list above is for **navigation** (`$icon` on a `Resource`, `Page`, or
`Cluster`), checked by `panel:doctor`. A *different*, smaller icon set
governs action/UI glyphs (`RecordAction::icon()`, `Action::icon()`), checked
by a separate test in the consuming application. An icon name valid for one
is not guaranteed valid for the other.
:::

## Grouping

`$group` is a plain string label. Peer resources someone jumps between from
anywhere share an ordinary `$group`. Use a `Cluster` instead when several
resources are facets of *one* subject and should share a sub-navigation —
see [Creating resources](/resources/#resource-configuration).

## Sidebar behavior

The sidebar's overall chrome family (inset, floating, icon-rail, accordion,
and several others) is a per-panel setting, not a per-resource one:

```php
Panel::make('admin')->sidebarLayout('inset'); // default
```

The collapse/expand interaction itself is a client-side (Vue) mechanic —
choosing a layout family is the PHP-configurable surface. Settings appears in
its own sidebar group by default; `->sidebarSettings(false)` moves it under
the account menu instead.

## `panel:doctor`

```bash
php artisan panel:doctor
```

Run this after any navigation change. Among its checks (33 in the default
profile), two are specifically about navigation:

- A resource declaring Filament's `$navigationIcon` instead of `$icon`.
- A resource's `$icon` holding a name outside the supported allowlist.

Neither of these produces an error page — both produce a working-looking
sidebar with the wrong (or a generic) icon, which is exactly why they need a
dedicated check rather than relying on someone to notice.
