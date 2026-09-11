# Relation Managers

A `RelationManager` is a tab of related records on a parent's own record
page — distinct from a [nested resource](/resources/nested-resources), which
is a full, independently-routed `Resource` reachable only under its parent's
URL. Use a RelationManager for a glance at related rows from the parent's
page; use a nested resource when the child deserves its own dedicated pages.

There is **exactly one** `RelationManager` class, configured two different
ways — not two separate class hierarchies. The choice between them isn't
cosmetic: it decides what the tab can and cannot do.

```php
public static function relations(): array
{
    return [
        // Simple: read a list, optionally create inline
        RelationManager::make('notes', 'Notes')
            ->related(Note::class, 'client_id')
            ->table(fn (Table $table) => $table->columns([
                TextColumn::make('body'),
                DateColumn::make('created_at'),
            ])),

        // Resource-backed: full CRUD, its own routes, its own policy
        RelationManager::make('sessions', 'Sessions')
            ->resource(ClientSessionResource::class),
    ];
}
```

See [Simple RelationManager](/relation-managers/simple),
[Resource-backed RelationManager](/relation-managers/resource-backed), the
[capability comparison](/relation-managers/capability-comparison), and a
[complete worked example](/relation-managers/example-orders).

## Deciding which one you need

- **Only need to show children, maybe with inline create?** → Simple.
- **Need row Edit, Delete, a dedicated View page, independent authorization,
  or a searchable relationship field inside the tab's own form?** →
  Resource-backed.

Reaching for the simple shape when you need the resource-backed one doesn't
silently produce a worse version — PanelKit refuses the specific broken
pattern (a searchable relationship field with nowhere to search) at
schema-build time with an explicit error naming the fix, rather than shipping
a search box that silently returns nothing. See
[Simple RelationManager](/relation-managers/simple) for exactly why.
