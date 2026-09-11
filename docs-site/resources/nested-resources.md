# Nested resources

A nested resource is a **full, independent `Resource`** that only answers
under its parent's URL — distinct from a [RelationManager](/relation-managers/),
which is a tab on the parent's own page. Reach for a nested resource when the
child only makes sense inside one parent record; reach for a RelationManager
when you want a glance at related rows from the parent's own page.

```php
final class ClientSessionResource extends Resource
{
    protected static string $model = ClientSession::class;
    protected static ?string $parent = ClientResource::class;

    // HasMany: foreign key defaults to {parent-key-singular}_id, override with $parentColumn
    // BelongsToMany: protected static ?string $relationship = 'tags';
}
```

## Why the flat URL doesn't route

`ClientSessionResource` only answers at `/clients/{id}/sessions` — never at a
bare `/sessions`. The parent segment **is** the authorization context: every
request resolves the parent through its own tenant-scoped model, checks
`view` on that parent, constrains the child list to its rows, and stamps the
foreign key on create from the URL — never from the submitted form body. A
nested resource with `$parent` set is automatically excluded from the
sidebar (`showsInNavigation()` returns false whenever `$parent` is set),
since it has no URL of its own to link to.

Another tenant's parent id resolves to a 404, not a 403 — the distinction
matters: a 403 confirms the record exists but is forbidden; PanelKit's nested
resources refuse to confirm existence at all for a record outside the
tenant's ownership.

## HasMany vs. BelongsToMany

For a HasMany child (the common case — `ClientSession belongsTo Client`),
`$parentColumn` defaults to `{parent-key-singular}_id` and rarely needs
overriding.

For a BelongsToMany nested resource, set `$relationship` to the method name
on the parent model instead:

```php
protected static ?string $relationship = 'tags';
```

The nested index lists attached rows; `/{parent}/{id}/{child}/attach` picks
existing records to attach; detach is a row action. Extra columns that live
on the pivot table itself (a role, an `expires_at`) are declared via
`pivotColumns()`.

## Dedicated pages, never a modal

Nested resources get the same page-first CRUD as top-level resources: list,
create, edit, and view are all real routes under
`/{parent}/{id}/{child}/...`, never a Livewire-style modal.
