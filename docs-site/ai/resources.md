# 2. Resources

## Canonical recipe: given a model, build the standard screen set

```bash
php artisan make:panel-resource Customer --generate
php artisan panel:permissions sync
php artisan panel:doctor
```

This one command, followed by a policy review, produces: the resource class,
a model factory, a policy stub, a contract test, and (via `--generate`) a
first-draft table and form inferred from the actual database columns — see
[Model the data first](/ai/panelkit-core#model-the-data-first).

## What you still have to do by hand

1. **Review the generated policy.** It extends `TenantResourcePolicy` and
   grants by default once registered — an unreviewed stub is a real grant,
   not a placeholder.
2. **Review the generated columns/fields.** `--generate` is a strong first
   draft, not a final answer — it doesn't know which fields matter most to
   an operator, only what shape each database column has.
3. **Register the policy** if it isn't auto-discovered:
   `Gate::policy(Customer::class, CustomerPolicy::class)`.
4. **Add navigation identity** if the defaults aren't right:
   `$icon`/`$group`/`$sort` — see [Navigation](/ai/navigation).

## The file structure this produces

```
app/Panel/Resources/CustomerResource.php
app/Policies/CustomerPolicy.php
database/factories/CustomerFactory.php
tests/Feature/Panel/CustomerResourceTest.php
```

Nothing is registered anywhere else — no route file, no manual navigation
array, no controller. Discovery is automatic for anything in
`app/Panel/Resources` by default.

## Every standard choice, explained

- **`protected static string $model`** — required, the Eloquent model this
  resource wraps.
- **`table(Table $table): Table`** — abstract, must implement. Builds a
  cached, tenant-independent *description*. See [Tables](/ai/tables).
- **`form(Form $form): Form`** — optional; a resource with no override is
  read-only. See [Forms](/ai/forms).
- **`infolist(): array`** — optional; empty means the View page falls back
  to the table's own columns. See [Infolists](/ai/infolists).
- **`recordTitle(Model $record): ?string`** — override when the base
  class's fallback attribute checks (`name`, `title`, `full_name`,
  `subject`, `number`, `code`, `label`, `email`, checked in that literal
  order) don't identify a record well.

## Never do these

- Never write a controller for a resource screen. A hand-written controller
  bypasses the tenant scope and the policy silently — no error, just an
  unprotected screen that looks correct.
- Never put a query inside `table()`/`form()`/`infolist()` — these build a
  cached description, evaluated before any specific request exists. A query
  there runs once and can serve one tenant's data to every other tenant that
  hits the cache.
- Never add a route to `routes/web.php` for a resource screen.

## Nested resources vs. relation managers

If you're about to build a related-records screen, stop and read
[Relation managers](/ai/relation-managers) first — a nested `Resource` and a
`RelationManager` are two different mechanisms and picking the wrong one for
what you need (e.g. wanting searchable relationship fields inside a simple
RelationManager) fails loudly, but only if you read the error rather than
retrying blindly.
