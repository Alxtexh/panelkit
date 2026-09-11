# 6. Relation managers

Full reference: [Relation Managers guide](/relation-managers/), including a
[complete Order → OrderItems → Product example](/relation-managers/example-orders).

## Decision tree

```
Need to show related records on a parent's page?
│
├─ Only a read-only glance, maybe with inline create?
│  └─ Simple RelationManager: ->related($model, $foreignKey)->table(...)
│
├─ Need row Edit, Delete, dedicated pages, an independent policy,
│  or a searchable relationship field in the related form?
│  └─ Resource-backed RelationManager: ->resource(ChildResource::class)
│     (generate with: php artisan make:panel-relation-manager Parent Related)
│
└─ Child only ever makes sense inside ONE parent record, and doesn't need
   a "glance from the parent's page" so much as its own full CRUD?
   └─ Nested Resource ($parent/$parentColumn on the child Resource) —
      often paired with a resource-backed RelationManager, but can exist
      alone with no RelationManager tab at all.
```

## The failure this exists to prevent

A simple RelationManager (`->related()`, no `->resource()`) has **no**
`field-options` search endpoint — that route only exists for a routable
`Resource`. If its `form()` contains a `SelectField` with
`->searchable()` (including the implicit searchable a `->relationship()`
call sets), PanelKit refuses to build the schema and throws immediately,
naming the exact field and telling you to either use a fixed `->options([])`
list or add `->resource()`. Read the exception message — it names the fix.
Do not work around this by disabling search on a field that genuinely needs
it; add `->resource()` instead.

## Never do

- Never assume a bare `RelationManager::make()->related(...)` gets its own
  URL, its own policy, or a Delete action — it has none of the three.
- Never generate the simple shape when you actually need dedicated pages —
  `make:panel-relation-manager` only ever scaffolds the resource-backed
  shape, on purpose; there is no generator for the simple shape because it's
  meant to be a small, hand-written, read-mostly tab.
- Never confuse a nested `Resource`'s `$parent` with a `RelationManager` —
  they're separate mechanisms that happen to compose. A nested resource can
  be fully functional with zero `RelationManager` tabs pointing at it.
