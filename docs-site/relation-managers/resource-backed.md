# Resource-backed RelationManager

```php
RelationManager::make('sessions', 'Sessions')
    ->resource(ClientSessionResource::class);
```

`->resource()` points the tab at a **full, independently-routed nested
`Resource`** — see [Nested resources](/resources/nested-resources) for that
class's own `$parent`/`$parentColumn`/`$relationship` configuration. The
RelationManager becomes a thin wrapper: it auto-derives the model and foreign
key from the resource's own configuration if you haven't already set them
via `related()`, and delegates its table, form, and permission checks to
the resource itself rather than to closures passed to `table()`/`form()`.

```php
final class ClientSessionResource extends Resource
{
    protected static string $model = ClientSession::class;
    protected static ?string $parent = ClientResource::class;
}
```

## What it can do that the simple shape can't

- **Dedicated Create, Edit, and View pages** at
  `/{parent}/{id}/sessions/{action}`, not just inline editing on the parent's
  page.
- **Its own policy** — `ClientSessionPolicy`, checked independently of
  `ClientPolicy`.
- **Searchable relationship fields work**, because the nested resource is a
  real routable `Resource` and gets its own `{resource}/field-options`
  search endpoint — this is the entire reason the simple shape refuses this
  pattern and the resource-backed shape doesn't.
- Full CRUD abilities (`view`, `create`, `update`, `delete`) checked
  per-record against the child's own policy, not folded into one ability
  check against the parent.

## When to reach for this instead of the simple shape

As soon as you need any one of: dedicated pages, an independent policy, or a
searchable relationship field inside the related form. See the
[capability comparison](/relation-managers/capability-comparison) for the
full side-by-side, and a [complete Order → OrderItems → Product example](/relation-managers/example-orders)
that uses both shapes together in one realistic screen.
