# Architecture

## The request lifecycle for a resource screen

1. **Discovery.** A `Resource` subclass sitting in a discovered directory
   (`app/Panel/Resources` by default) is found at boot — nothing is
   registered by hand.
2. **Schema.** `table()`/`form()`/`infolist()` build a cached, tenant-independent
   *description* of the screen: which columns, which fields, which
   validation rules. This is built once and never queries the database
   itself.
3. **Data.** On an actual request, `data()` runs the tenant-scoped,
   uncached row fetch — filtered, sorted, and paginated per the schema
   the request asked for.
4. **Transport.** The schema and data are sent to the browser as Inertia
   props — one JSON payload per navigation, not a persistent server-side
   component tree.
5. **Render.** The Vue kit reads the schema and renders the appropriate
   controls — a `'money'` column becomes the `MoneyColumn` display
   component, a `'select'` field becomes the select control, and so on.
   PHP never emits markup or CSS classes, only semantic type names and data.

## Why schema and data are split

Splitting "what a screen looks like" from "what's currently in it" is what
makes definitions cacheable and safe to build without a live query — and
it's the reason a filter's *option list* is explicitly data (resolved once
per request from a closure), never schema (which could be cached and served
to the wrong tenant).

## The three layers

| Layer | Technology | Responsibility |
|---|---|---|
| Backend | Laravel | Resources, policies, tenancy, the schema/data contract |
| Transport | Inertia | Moves schema + data to the browser as page props, handles navigation without a full reload |
| Frontend | Vue 3 | Renders the schema — tables, forms, infolists, widgets — as real, bookmarkable pages |

Nothing here is Livewire, and no PanelKit screen keeps server-side component
state between requests the way a Livewire component does — every
interaction is a normal Inertia request/response, just like clicking a link.

## Where PanelKit's own code lives vs. where yours does

Almost nothing PanelKit ships stays in `vendor/` where you'd expect to find
it — this trips people up often enough that `panel:doctor`'s own
documentation calls it out explicitly:

| You're looking for | It is **not** in | It is in |
|---|---|---|
| The root view, `app.ts`, the layout | `vendor/.../resources/views` | `resources/stubs/*.stub`, published into your app by `panel:install` |
| The screens (ResourceIndex, auth pages, …) | The PHP package at all | `@alxtexh-enterprise/panel/inertia` in `node_modules`, mirrored into `resources/js/pages` |
| Sign-in routes | The package's own routes | `routes/panel-*-auth.php`, written into **your** app by `--auth` |

Everything is published or mirrored specifically so you can edit it — the
one thing the package renders directly from `vendor/` is the tenant-suspension
wall, and that's deliberate: it's the one screen with no reason for a host
to customize its markup.
