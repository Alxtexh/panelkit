# Customization

PanelKit ships a small, deliberately frozen set of layout tokens. Screens
that look inconsistent are almost always screens that invented a second
layout system instead of reaching for the shared one.

## Design tokens

| Token | Meaning |
|---|---|
| `PAGE_SHELL` | Full-bleed content padding inside the main pane. Default for list, view, settings, and `make:panel-page` screens. |
| `PAGE_SHELL_STACK` | `PAGE_SHELL` plus vertical rhythm between sections. |
| `PAGE_SHELL_COMPACT` | Tighter padding for dense chrome (record view). |
| `FORM_MEASURE` | An optional **left-aligned** field column (`max-w-7xl`, no `mx-auto`) for create/edit/view **pages**. |
| `OVERLAY_FORM_MEASURE` | The equivalent field column inside a slide-over or dense modal — never use page `FORM_MEASURE` inside an overlay. |
| `SLIDEOVER_WIDTH` / `SLIDEOVER_BODY` | Shared width presets and default body padding for `PkSlideover`. |
| `MODAL_PANEL` / `MODAL_PANEL_FORM` | Dense centred modal shell sizes (`confirm` vs `form`). |
| `CATALOGUE_CONTAINER` | `@container` ancestor for catalogue/settings card grids — column counts come from container queries, not viewport breakpoints. |

Import these from `@alxtexh-enterprise/panel` (`pageShell.ts`,
`catalogueGrid.ts`) rather than reinventing padding/width values inline.

::: warning Forbidden by default
- Wrapping admin pages in `mx-auto` + `max-w-*` (a skinny centred column).
- A second page-width system alongside `PAGE_SHELL`/`FORM_MEASURE`.
- Page `FORM_MEASURE` inside a slide-over or dense modal — use `OVERLAY_FORM_MEASURE`.
- Stacking sibling bordered cards for toolbar + table + pager — lists share **one** `TableShell` card.

A CI gate (`make check-page-shell`) scans for the `mx-auto` + `max-w-*`
pattern and fails the build if it finds one outside the allow-listed screens
(auth, onboarding, landing, print, errors, and a few named exceptions).
:::

Login, onboarding, marketing pages, and intentional dialogs are the
exceptions where a narrow, centred layout is correct — `contentLayout: 'centered'`
is an opt-in appearance preference for those, never the kit default for
ordinary CRUD.

## Density

Two settings, chosen by the account, not per-screen:

- **Comfortable** (default)
- **Compact** — tightens `--pk-row-padding` (table rows) and `--pk-form-gap`
  (form stacks)

Reach for those CSS custom properties over hard-coded spacing utilities
(`gap-4`, `py-2.5`) when adding new chrome, so it respects the account's
density choice automatically.

## Sidebar chrome families

```php
Panel::make('admin')->sidebarLayout('inset'); // default; alias: sidebarVariant()
```

Nine families are available: `inset` (default), `sidebar`, `floating`,
`icon`, `header`, `accordion`, `file-tree`, `calendar`, `dialog`. Every
family renders the same primary navigation and the same footer support links
(Help, FAQ, What's new, About) — only the chrome around them changes. The
`header` family is the one that meaningfully changes structure: it adds a
sticky site header with the account menu and search, and the rail becomes
navigation-only.

## Secondary navigation is always `PkSubNav`

Any screen showing a vertical list of links to sibling screens — Settings
today, a cluster's own sub-navigation — uses `PkSubNav`, never a hand-rolled
`<aside>` of links. This isn't a style preference: `PkSubNav` collapses to a
dropdown below the `md` breakpoint, and a hand-rolled sidebar that skips that
collapse ships a screen a phone has to scroll past to reach any content.

## Auth screen families and images

See [Authentication](/authentication/#auth-design-families) for
`authFamily()`, `authImage()`, and `authTestimonial()` — the same
tokens-over-hand-rolled-layout principle applies there too.

## Status colour tokens

`PkBadge` variants `success`/`warning`/`info` need matching CSS variables in
`resources/css/app.css` (`--success`, `--warning`, `--info` and their
`@theme` `--color-*` mappings) — without them, Tailwind v4 never emits
`bg-success` and friends, and schema-driven badges silently render as
unstyled text. Fresh installs get these from the published stub;
`php artisan panel:update` patches an older host that's missing them.

## Branding

```php
Panel::make('admin')
    ->brandName(fn () => config('app.name'))
    ->favicon('/images/favicon.svg')
    ->colors(fn () => ['primary' => '#2563eb']);
```

Per-panel branding is a closure, not a static string, so a multi-tenant
install can resolve it from the current tenant rather than hard-coding one
brand for every organisation.
