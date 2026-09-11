# 9. Authorization

Full reference: [Authorization guide](/authorization/).

## Never merely hide a UI control

Hiding a button client-side is not authorization. Every destructive or
sensitive operation must be enforced **server-side**, in a policy —
PanelKit's own `RecordAction`/`BulkAction` re-check `authorize()` on the
server before running, independent of whatever the client chose to render;
your own custom logic (a controller, a job, a console command) must do the
same, explicitly.

## A resource with no policy is invisible, not open

This is PanelKit's deny-by-default design, not a bug to work around. If a
resource shows nothing, **check for a missing policy first**
(`php artisan panel:doctor` names every resource without one) before
assuming a routing or query problem.

```php
final class InvoicePolicy extends TenantResourcePolicy {}
Gate::policy(Invoice::class, InvoicePolicy::class);
```

## Writing a policy: extend the base, never hand-roll

```php
public function delete(Authenticatable&Authorizable $user, ?Model $record = null): bool
{
    if ($record instanceof Invoice && $record->isPaid()) {
        return false;
    }

    return parent::delete($user, $record);
}
```

**Use the exact base-class parameter type** —
`Authenticatable&Authorizable $user`, never your own model class. PHP
forbids narrowing a parameter type in an override; a policy that tries
throws a fatal error the instant the class loads (a blank page in a
browser, "Premature end of PHP process" under PHPUnit — a startling failure
mode for something that looks like a type hint improvement). Narrow inside
the method body with `instanceof` instead.

## Relation managers and nested resources

- A **resource-backed** RelationManager gets its own independent policy.
- A **simple** RelationManager has none — it checks a single ability
  against the *parent* record.
- A nested `Resource` checks `view` on the resolved parent before touching
  any child rows, and a foreign parent id is a 404 (not a 403) — it never
  confirms a record exists for a tenant that doesn't own it.

See [Relation managers](/ai/relation-managers) if you're not sure which
shape you're building.

## Safe querying

- **Avoid N+1 queries** — eager-load or join via `Table::query(Closure)`,
  never fetch a relation inside a per-row loop.
- **`Table::query()` is for joins/eager-loading only** — a `where` there is
  silently absent from every count. Use `Table::constrain()` for an actual
  predicate.
- **Deterministic sorting and pagination** — PanelKit's keyset pagination
  needs a stable sort; don't override `defaultSort()` with a non-deterministic
  expression.
- **Tenant scoping is not automatic on every model** — the `TenantScope`
  global scope must be attached per model (e.g. `#[ScopedBy(TenantScope::class)]`).
  Don't assume a new Eloquent model is tenant-scoped just because
  `panel.tenancy.mode` is set — check whether the scope is actually
  attached. See [Tenancy](/ai/tenancy).
- **Never concatenate untrusted input into `fromRaw()`.** It compiles
  straight into SQL with nothing bound, and there is no runtime protection
  against misuse — the safety here is "never given user input," full stop,
  not "sanitized before use."
