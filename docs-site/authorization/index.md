# Authorization

Two independent gates, and both must pass on every request: **tenancy** asks
*is this yours*, **permission** asks *may you do this to it*. Full
permissions still can't reach another organisation's record; being in the
right organisation still can't delete without the `delete_*` ability.

## Policies

```php
final class InvoicePolicy extends TenantResourcePolicy {}
```

`make:panel-resource` writes this stub for you — review it, because an
unreviewed stub is a real grant. `TenantResourcePolicy` combines both gates
in a fixed order, checked in `allows()` on every ability:

1. **Tenancy first**: if the current request resolves no tenant, deny —
   regardless of ability.
2. **Ownership second**: if a record is being checked and it doesn't belong
   to the current tenant, deny.
3. **Then, and only then, permission**: does the resource have a matching
   ability, and does the user hold it?

```php
final class InvoicePolicy extends TenantResourcePolicy
{
    public function delete(Authenticatable&Authorizable $user, ?Model $record = null): bool
    {
        if ($record instanceof Invoice && $record->isPaid()) {
            return false;
        }

        return parent::delete($user, $record);
    }
}
```

Override a method to add a rule, and use the **base class's exact parameter
type** — never narrow `Authenticatable&Authorizable $user` to your own model
class. PHP forbids narrowing a parameter in an override, so a policy that
tries throws a fatal error the moment the class loads (a blank page in a
browser, "Premature end of PHP process" under PHPUnit). Reach for your model
*inside* the method with `instanceof` instead.

If your policy doesn't live in the conventional `App\Policies` namespace
matching `App\Models\X`, name the model explicitly — `modelFor()` otherwise
derives it from the policy's own class name and silently guards the wrong
class.

## Permissions

Ability names are **derived, never stored** — `view_any_invoices`,
`update_invoices`, `force_delete_invoices` — computed from the resource's
key, because a separately-stored `permissions` table would be a second copy
that can disagree with the registry, and it disagrees in the dangerous
direction: a renamed resource leaves a role that looks fully populated but
grants nothing.

```bash
php artisan panel:permissions list                        # every ability, from the registry
php artisan panel:permissions sync                         # reconcile roles
php artisan panel:permissions sync --prune                  # also remove names nothing corresponds to
php artisan panel:permissions grant --email=you@example.com # the unlock path when nobody can sign in
```

`sync` creates any missing `Permission` rows, creates an `Administrator` role
holding every ability (`grants_all`) if a tenant has none yet, tops up an
existing `grants_all` role with newly-added abilities, and — with `--prune`
— removes granted names that no longer correspond to a registered resource.
`grants_all` marks a role as holding every ability **including ones invented
later**; inferring that from "currently holds all of them" would turn a role
into a superuser the instant somebody ticked the last box by hand.

Panel-wide (non-resource) abilities exist too: `manage_roles`,
`impersonate_users`, `view_operations`, `manage_backups`, `manage_documents`,
and others declared under `config('panel.abilities')`.

## Deny-by-default

A resource with **no policy registered is invisible to everyone** — not a
misconfiguration error, a deliberate deny. The check that produces this,
`Resource::can()`, denies specifically when `Gate::getPolicyFor($model)` is
null, and logs a warning every time it does:

```php
public static function can(string $ability, Model|string|null $record = null): bool
{
    $model = static::model();

    if (Gate::getPolicyFor($model) === null) {
        Log::warning('Panel resource denied an ability because no policy is registered.', [/* ... */]);
        return false;
    }

    return Gate::allows($ability, $record ?? $model);
}
```

`php artisan panel:doctor` reports every resource missing a policy — run it
after adding a resource, before wondering why the list is empty.

## Panel access is a separate question from signing in

Authenticating with a guard isn't the same as being allowed to *use* a given
panel:

```php
final class User extends Authenticatable implements CanAccessPanel
{
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_staff;
    }
}

// or, on the panel itself:
Panel::make('admin')->canAccess(fn ($user) => $user->is_staff);
```

Returning `false` is a 403, not a broken-looking empty shell. A signed-in
user who's allowed into the panel but holds no grants sees a dashboard that
says so explicitly (`panelEmptyGrants`/`panelEmptyGrantsHint` shared props) —
`panel:install` grants the first user `Administrator` precisely so a fresh
install doesn't land here by default; `--no-user` skips that and this honest
empty state is what you'll see instead.

## Tenancy

Four modes, configured once:

```php
// config/panel.php
'tenancy' => [
    'mode' => 'column',              // column | database | hybrid | none
    'resolver' => fn () => auth()->user()?->tenant_id,
],
```

| Mode | Isolation |
|---|---|
| `column` | One shared database; every tenant-owned query gets a `tenant_id` predicate via a global `Scope` |
| `database` | A dedicated database per tenant, isolated by connection (needs `stancl/tenancy`) |
| `hybrid` | Resolved **per tenant**, not globally — most share a database, large ones get their own |
| `none` | Single-tenant; no scoping applied. This is the framework's own default. |

**A null tenant key is always a deny, never "all tenants"** — every branch
fails closed, which is why an unconfigured multi-tenant panel shows nothing
rather than everything.

PanelKit ships a real, tested, fail-closed `TenantScope` (an Eloquent global
scope with no console-testing escape hatch, on purpose — a prior version's
`runningInConsole()` exemption silently disabled scoping for an entire test
run) and a `TenantContext` resolver supporting all four modes above. Two
things worth knowing before assuming this is fully automatic:

- **The scope must be attached per model** (typically `#[ScopedBy(TenantScope::class)]`)
  — it is not retroactively applied to every Eloquent model just by setting
  `tenancy.mode`.
- **`database` and `hybrid` modes depend on the optional `stancl/tenancy`
  package** for the actual connection-switching; PanelKit provides the mode
  abstraction and fails closed around it, but doesn't reimplement
  multi-database tenancy itself.

`TenantResourcePolicy::owns()` re-checks tenant ownership at the policy layer
even when the global scope is attached, specifically because
`withoutGlobalScopes()` anywhere in application code can bypass a scope —
this is belt-and-braces, not reliance on the scope alone.

With Spatie permission teams enabled (required for per-tenant roles):

```php
// config/permission.php
'teams' => true,
'column_names' => ['team_foreign_key' => 'tenant_id'],
```

Spatie's own default for `teams` is `false`, and that default **fails
open** here — a role would grant across every organisation with no error and
nothing in a log. `panel:doctor` reports this misconfiguration explicitly.

::: warning Reindex after moving a tenant to a dedicated database
Every index in a column-scoped schema leads with `tenant_id`; database mode
correctly drops that predicate, so no existing index can serve an `ORDER BY`
and every page becomes a full scan — measured at 20–60× on identical data.
Run `php artisan panel:reindex-tenant` inside the tenant after migrating it.
:::

## Nested resources & relation managers

- A [nested resource](/resources/nested-resources) resolves its parent
  through the parent's own tenant-scoped model and checks `view` on it
  *before* touching the child rows — a foreign parent id is a 404, not a
  403, so the child endpoint never confirms whether the parent even exists
  for another tenant.
- A **resource-backed** [RelationManager](/relation-managers/resource-backed)
  gets its own independent policy, checked per record, entirely separate
  from the parent resource's policy.
- A **simple** [RelationManager](/relation-managers/simple) has no policy of
  its own — it authorizes against a single ability checked on the *parent*
  record (`authorize()`, default `'view'`), which is part of why it can't
  express per-record child permissions the way a resource-backed one can.
