# Simple RelationManager

```php
RelationManager::make('notes', 'Notes')
    ->related(Note::class, 'client_id')
    ->table(fn (Table $table) => $table->columns([
        TextColumn::make('body'),
        DateColumn::make('created_at'),
    ]))
    ->form(fn (Form $form) => $form->schema([
        TextareaField::make('body')->required(),
    ]))
    ->authorize('view');
```

`related()` names the child model and its foreign key column. `table()` and
`form()` each take a closure, exactly like a `Resource`'s own `table()`/
`form()` methods. `authorize()` checks an ability **on the parent record**
before the list serves at all — the default is `'view'`.

## What it can do

- Read a list of related rows, paginated the same keyset way the main table is.
- Optionally create a new related row inline, if `form()` is set and the
  actor can (`createAbility()`, default `'create'`).
- Optionally edit inline, similarly gated by `updateAbility()` (default
  `'update'`) — set `->readOnly()` to drop inline create/edit entirely and
  keep the tab purely a read list.

## What it cannot do

- **No dedicated Edit or View page** — everything happens inline, on the
  parent's own page.
- **No independent policy** — authorization is checked against the parent
  record's own ability, not a separate policy for the related model.
- **No searchable relationship field inside its form.** If a field inside
  `form()` is a `SelectField` with `searchable()` (including the implicit
  searchable set by `relationship()`), PanelKit refuses to build the schema
  and throws immediately, naming the offending field:

  > `SelectField [plan_id] uses relationship search inside RelationManager
  > [notes], but this relation has no ->resource() and therefore no
  > field-options endpoint to search against — the dropdown would open with
  > a search box that silently returns nothing. Either call ->options([...])
  > on [plan_id] for a small, fixed related table, or add
  > ->resource(SomeResource::class) to RelationManager::make('notes', ...)
  > to give this relation dedicated pages and a working search endpoint.`

  This is a deliberate fail-fast, not a bug: the `{resource}/field-options`
  search endpoint is only ever mounted for a routable `Resource` — a bare
  `RelationManager::make()` has no route of its own for that search to reach.
  If the related field's option set is genuinely small and fixed, use
  `->options([...])` instead of `searchable()`. If it needs real search,
  reach for a [resource-backed RelationManager](/relation-managers/resource-backed).

## Reading and constraining further

```php
RelationManager::make('notes', 'Notes')
    ->related(Note::class, 'client_id')
    ->query(fn ($query) => $query->where('is_internal', false))
    ->icon('sticky-note');
```

`query()` layers an additional constraint on top of the relation's own
foreign-key scoping — it narrows, it never replaces the base relationship.
