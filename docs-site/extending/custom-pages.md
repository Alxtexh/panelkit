# Custom pages

Not every screen is a list of records. A `Page` is one PHP class plus a Vue
file, for anything else — a settings screen, an operational dashboard, a
tool.

```bash
php artisan make:panel-page ServerHealth
```

```php
final class ServerHealthPage extends Page
{
    public static function component(): string
    {
        return 'ServerHealth';
    }

    public static function data(Request $request): array
    {
        return ['nodes' => Node::status()];
    }

    // Endpoints this page owns. The ability is separate from the page's
    // own — seeing a thing and changing it are different grants.
    public static function actions(): array
    {
        return ['restart' => 'restart_nodes'];
    }
}
```

Discovery routes it automatically; the sidebar entry, the ability, the
permission-matrix row, and the page header all follow from the class. Don't
add a controller and don't touch `routes/web.php` — a page gets the same
treatment a resource does, for the same reason.

## Route parameters

`uri()` may carry `{parameters}`; the navigation entry uses the path with
them stripped, since a sidebar link can't point at a specific parameter
value.

## Pages and resource keys share one namespace

A page slug and a resource key are both URL segments in the same routing
prefix — a collision between the two throws at boot, naming both classes,
rather than leaving one of them silently unreachable.

## Absent vs. merely hidden

```php
public static function isEnabled(): bool
{
    return false;
}
```

Return `false` from `isEnabled()` for a page that should be **absent**, not
just hidden from the menu. A hidden-but-still-routed page is how a package
quietly keeps answering a URI the host application thought it owned.

## Specialized page bases

Several abstract subclasses of `Page` give you a head start for a common
shape: `DashboardPage` (see [Customization](/customization/) and the widget
classes in the [API reference](/api/all)), `PlanSetupPage` (SaaS plan
catalogue), `SingularResource` (a one-record settings form — technically not
a `Page` subclass, but the same "no list, no hand-written controller"
philosophy). `make:panel-page` has a dedicated flag for several of these
(`--dashboard`, `--plan-setup`, and others) — see the
[command reference](/commands/) for the full list.

## Widgets on a custom page

```php
public static function headerWidgets(): array
{
    return [StatWidget::make('open', 'Open tickets')->value(fn () => Ticket::open()->count())];
}
```

Any `Page` (not just `DashboardPage`) can declare `headerWidgets()`/
`footerWidgets()` — each widget is its own deferred prop, so a slow aggregate
delays only itself, never the rest of the page.
