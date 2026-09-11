# Plugins

A `PanelPlugin` bundles resources, pages, widgets, navigation entries, and
render-hook markup into one reusable, installable unit — for your own
first-party packages shared across projects, not a third-party marketplace.
Most features should be built directly in the application; reach for a
plugin only once the same screens need to exist in more than one project.

```bash
php artisan make:panel-plugin Acme/Billing
```

## The contract

```php
final class BillingPlugin extends Plugin
{
    public function id(): string
    {
        return 'acme/billing';
    }

    public function register(PluginContext $context): void
    {
        $context->resources([InvoiceResource::class]);
        $context->pageClasses([BillingSettingsPage::class]);
        $context->render(RenderHooks::VIEW_AFTER, 'BillingSummary', [], ['invoices']);
    }
}
```

Extending `Plugin` (rather than implementing the narrower `PanelPlugin`
interface directly) gives you `registerResources()`, `registerPages()`,
`registerWidgets()`, `registerMenuItems()`, `registerRenderHooks()` as
separate override points instead of one `register()` method, plus
`dependencies()` and `health()` hooks `panel:doctor` reads to report a
plugin's own configuration problems.

**A plugin can only add.** `PluginContext` is deliberately add-only — it
never hands back the `Panel` object itself, so a plugin cannot change a
host's guard, tenancy mode, or middleware out from under it.

## Registering it

```php
// config/panel.php
'plugins' => [
    \App\Plugins\Acme\BillingPlugin::class,
],
```

```php
// or, scoped to one panel provider:
Panel::make('admin')->plugins([new \App\Plugins\Acme\BillingPlugin()]);
```

Both paths produce identical registration — pick whichever fits how broadly
the plugin should apply.

## Scoping a plugin to certain panels

```php
public function appliesTo(Panel $panel): bool
{
    return $panel->id === 'admin';
}
```

Default (inherited from `Plugin`): applies to every tenant-context panel.
Override `appliesTo()` for anything narrower — a plugin meant for exactly
one named panel, or gated behind a config flag (see the built-in
`AnnouncementsPlugin`, which checks both a config flag and that it's
running on the default panel, after an earlier version shipped checking only
one of the two and mounted itself on every install).

## Adding markup to a screen you don't own

See [Vue extension points](/extending/vue-extension-points#render-hooks) for
`PluginContext::render()` and the full list of named positions — this is how
a plugin adds a component to an existing screen without forking it.

## Built-in plugins, as worked examples

PanelKit ships three first-party plugins built exactly this way —
`AnnouncementsPlugin`, `TicketingPlugin` (the most structurally complex
example: it coordinates **two** panels, an operator side and a customer
side, and refuses to boot if only one is configured), and `WebhooksPlugin`
(an opt-in "kit app" gated behind `Panel::webhooks()`). Reading any of them
is a faster way to understand the contract than reading only its
description.

## Compatibility

`Plugin::CONTRACT_VERSION` is checked by `panel:doctor` against each
registered plugin's own `getVersion()` — a plugin built against an older
contract version is reported by name rather than failing silently or
crashing at boot.
