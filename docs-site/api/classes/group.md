# Group

`Alxtexh\Panel\Tables\Grouping\Group` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Grouping/Group.php#L23)

How a table clusters its rows.

## Methods

### `static make(string $column): self`

### `key(): string`

The row key, and the query-string value the picker sends.

### `label(string $label): self`

### `resolvedLabel(): string`

### `collapsible(bool $collapsible = true): self`

Let the heading collapse the rows beneath it.

### `isCollapsible(): bool`

### `date(bool $date = true): self`

Cluster by the calendar date, ignoring the time of day.

### `isDate(): bool`

### `titlePrefixedWithLabel(bool $prefixed = true): self`

Whether the heading reads "Status: published" or just "published".

### `titleIsPrefixed(): bool`

### `titleUsing(Closure $callback): self`

The heading text, from the row array the list actually has.

### `getTitleFromRecordUsing(Closure $callback): self`

Filament's name for {@see titleUsing()}. The record is the row array.

### `clusterKey(?mixed $value): string`

The raw clustering key for this row: date string, or the column value.

### `title(array $row): string`

What the heading prints for this row.

### `toSchema(): array`

Structure for the cached schema and the active-group prop.

