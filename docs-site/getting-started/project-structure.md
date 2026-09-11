# Project structure

After `panel:install`, a fresh application gains:

```
app/
  Panel/
    Resources/          # your Resource classes (php artisan make:panel-resource)
    Pages/               # non-resource screens (php artisan make:panel-page)
  Policies/               # one policy per resource, extending TenantResourcePolicy
  Providers/
    Panels/               # one provider per panel/portal (php artisan make:panel)

resources/
  js/
    app.ts                # Inertia bootstrap — do not remove the layout callback
    layouts/
      PanelLayout.vue      # yours to customize; forwards breadcrumbs into PanelShell
    pages/                 # mirrored kit screens, plus your custom Page Vue files
  css/
    app.css                # Tailwind entry pointed at the package's design tokens
  views/
    app.blade.php           # root view

routes/
  panel-admin-auth.php     # written by --auth, one file per panel

config/
  panel.php                 # every option, published and commented

AGENTS.md                   # generated conventions for AI coding agents — regenerate with panel:blueprint
```

## Discovery, not registration

Every directory above (except `AGENTS.md` and config) is a **discovery
target**, not a manually-maintained registry — a class in the right
directory becomes a route, a navigation entry, and a set of permission
abilities automatically. There's no `routes/panel.php` to edit for a new
resource or page.

## Multiple panels

A second portal (`php artisan make:panel reseller --path=reseller --auth`)
gets its own provider, its own resource directory
(`app/Panel/Reseller/Resources`), and its own auth routes file — panels
don't share a resource directory even when they share a codebase.

## Where PanelKit's own code lives

See [Architecture — where PanelKit's own code lives vs. where yours does](/getting-started/architecture#where-panelkit-s-own-code-lives-vs-where-yours-does)
for the table of things people commonly go looking for in `vendor/` that
actually live somewhere else, published into your own application.
