# Table

`Alxtexh\Panel\Tables\Table` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Table.php#L41)

Declarative table definition. Produces the schema, and configures ListQuery.

## Methods

### `static make(): self`

### `columns(array $columns): self`

### `appendColumns(array $columns): self`

Adds to the declared columns rather than replacing them - roadmap

### `getColumns(): array`

Leaf columns only. ColumnGroup is layout; queries and cells never see it.

### `filters(array $filters): self`

### `splitsSearchTerms(bool $split = true): self`

Whether a multi-word search term is split and ANDed, or taken whole.

### `searchMode(string $mode): self`

Select prefix, exact, or relevance-ranked global search.

### `searchesRelation(string $relation, array $columns): self`

Search THROUGH a relation - an invoice found by its customer's name.

### `bulkActions(array $actions): self`

Actions applied to a selection.

### `getBulkActions(): array`

### `groupBy(Alxtexh\Panel\Tables\Grouping\Group|string $column, string $label = NULL): self`

Cluster rows under headings.

### `defaultGroup(Alxtexh\Panel\Tables\Grouping\Group|string|null $group): self`

Filament's name for the default grouping. {@see groupBy()}.

### `groups(array $groups): self`

Groupings the operator may pick between, shown in the existing toolbar.

### `collapsedGroupsByDefault(bool $collapsed = true): self`

Collapse every heading when the table first loads.

### `getGroupBy(): ?string`

### `reorderable(string $column = 'position'): self`

Let rows be dragged into a stored order.

### `getReorderColumn(): ?string`

### `largestPage(): int`

The largest page this table serves.

### `recordActions(array $actions): self`

Per-record actions for the row menu, flat or grouped.

### `inlineRecordActions(bool $inline = true): self`

Opt-in: bare actions render inline (Filament's default) instead of

### `getRecordActions(): array`

### `recordAction(string $key): ?Alxtexh\Panel\Actions\RecordAction`

One declared record action by key, searching inside groups too.

### `recordActionList(): array`

Every declared record action, flattened out of its groups.

### `bulkAction(string $key): ?Alxtexh\Panel\Actions\BulkAction`

### `tabs(string $column, array $values, Closure $configure = NULL): self`

the fluent chain here

### `query(Closure $query): self`

Eager loading / joins. Applied to the Eloquent builder, never executed here.

### `dataProvider(Alxtexh\Panel\Tables\DataProvider $provider): self`

Configure a read-only non-Eloquent source for this table.

### `constrain(Closure $constrain): self`

A predicate that defines what this table lists.

### `defaultSort(string $key, string $direction = 'desc'): self`

### `perPage(int $perPage): self`

### `perPageOptions(array $options): self`

### `keyColumn(string $column): self`

### `transform(Closure $transform): self`

### `prepareRows(Closure $prepare): self`

Prepare once for the whole page, before per-row action visibility runs.

### `alsoSelect(array $columns): self`

### `appendSelect(array $columns): self`

Adds to the raw SELECT list rather than replacing it - roadmap 5.1's

### `getQueryModifier(): ?Closure`

The declared join/scope closure, if any.

### `getFilters(): array`

### `rowClick(string $mode = 'view'): self`

Make the row body open the record.

### `striped(bool $striped = true): self`

Alternate row wash for dense ops tables.

### `stickyFirstColumn(bool $sticky = true): self`

Pin the first visible data column while scrolling horizontally.

### `resizableColumns(bool $resizable = true): self`

Enable drag-resize on columns (persisted client-side / saved views).

### `layouts(array $layouts): self`

Offer table and/or card layouts on the resource index.

### `toSchema(): array`

### `resolveFilterOptions(): array`

Filter option lists, resolved NOW because they are tenant data.

### `model(string $model): self`

### `getModel(): string`

### `toListQuery(string $model, array $valueSelect = NULL): Alxtexh\Panel\Tables\ListQuery`

### `searchableColumns(): array`

The qualified columns this table searches, for anything that needs to

