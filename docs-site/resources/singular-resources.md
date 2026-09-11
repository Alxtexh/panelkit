# Singular resources

A `SingularResource` is a form and two functions — no list, no create screen,
no hand-written controller. Use it for a "one record, no list" screen: a
settings page, a company profile, anything where there's exactly one row and
listing it would be meaningless.

```php
final class BillingSettingsResource extends SingularResource
{
    public static function form(Form $form): Form
    {
        return $form->schema([
            SelectField::make('plan_id')->relationship(Plan::class, 'name'),
        ]);
    }

    public static function values(): array
    {
        return ['plan_id' => Tenant::current()->plan_id];
    }

    public static function save(array $validated): void
    {
        Tenant::current()->update($validated);
    }

    public static function ability(): ?string
    {
        return 'manage_billing';
    }
}
```

Register it in `config('panel.singulars')`. It mounts at `/{key}` with
`PUT /{key}/current` as its save endpoint — `key()` is derived from the class
name the same way `Resource::key()` is, but **kebab-cased without
pluralizing** (`BillingSettingsResource` → `billing-settings`, not
`billing-settingss`).

## What it has instead of a policy

There's no model here, so there's no `TenantResourcePolicy` to extend.
`ability(): ?string` is the gate instead — a plain panel-level ability
(declared under `config('panel.abilities')` the same way any other
panel-wide ability is), checked once for the whole screen rather than
per-record.

## The three methods you implement

| Method | Purpose |
|---|---|
| `form(Form $form): Form` | Same as `Resource::form()` — the field schema |
| `values(): array` | The current state, shaped for the form |
| `save(array $validated): void` | Persist a validated submission — you decide where it goes, since there's no `$model` |

## Configuration properties

Same navigation identity properties as `Resource`, minus `$sort`: `$icon`
(default `'sliders'`), `$group`, `$purpose`, `$panel`.

## `links()`

```php
public static function links(): array
{
    return [
        ['label' => 'View invoices', 'href' => '/invoices'],
        ['label' => 'Stripe dashboard', 'href' => 'https://dashboard.stripe.com', 'external' => true],
    ];
}
```

Places to go *from* this screen — `external: true` opens in a new tab. Purely
a navigation convenience; it has no effect on `values()`/`save()`.
