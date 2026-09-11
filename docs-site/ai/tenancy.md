# 10. Tenancy

Full reference: [Authorization guide — Tenancy](/authorization/#tenancy).
Verify against that page (and the running application's actual
`config/panel.php`) before writing anything here from memory — this is a
real, non-trivial subsystem, not a one-line config flag.

## What PanelKit actually provides

A genuine, tested, fail-closed abstraction — not "nothing," and not a
zero-configuration automatic system either:

- Four modes: `column` (shared database, `tenant_id` scoping), `database`
  (dedicated database per tenant), `hybrid` (resolved per tenant), `none`
  (single-tenant, the framework's own default).
- A `TenantScope` Eloquent global scope that fails closed — a null/unresolved
  tenant key denies all rows, it never means "show everything."

## What is still the application's responsibility

- **The scope must be attached per model.** Setting `tenancy.mode` does not
  retroactively scope every Eloquent model — attach `TenantScope`
  explicitly (typically `#[ScopedBy(TenantScope::class)]`) on every
  tenant-owned model.
- **`database`/`hybrid` modes need the optional `stancl/tenancy` package.**
  PanelKit provides the mode abstraction and fails closed around it, but
  delegates actual connection-switching to that package. Don't assume
  multi-database tenancy works with PanelKit alone installed.
- **Spatie permission teams must be turned on separately** for per-tenant
  roles (`'teams' => true` in `config/permission.php`) — Spatie's own
  default is `false`, and that default **fails open**: every role grants
  across every tenant with no error. `panel:doctor` reports this
  misconfiguration if it finds it.

## PanelKit provides vs. application must implement vs. optional external package

| | Provides |
|---|---|
| **PanelKit provides** | Mode abstraction (`TenantContext`), fail-closed global scope class (`TenantScope`), policy-layer ownership re-check, `panel:reindex-tenant` |
| **Application must implement** | Attaching the scope to each tenant-owned model, a `resolver` closure if the default auth-column resolution doesn't fit, Spatie teams config |
| **Optional external package** | `stancl/tenancy` for `database`/`hybrid` connection-switching |

## Never

- Never claim PanelKit provides fully-automatic multi-tenancy with zero
  per-model configuration — it doesn't, and claiming otherwise sets up a
  cross-tenant data leak the first time someone adds a model and assumes
  it's scoped by default.
- Never rely on the global scope alone for a security-critical check — write
  policies that re-verify ownership (the way `TenantResourcePolicy::owns()`
  does), since `withoutGlobalScopes()` anywhere in the codebase can bypass
  the scope.
- Never move a tenant to a dedicated database without running
  `php artisan panel:reindex-tenant` afterward — column-mode indexes lead
  with `tenant_id`, a predicate database mode correctly drops, and every
  query becomes a full scan (measured 20–60× regression) until reindexed.
