# Column

`Alxtexh\Panel\Tables\Columns\Column` &middot; `abstract-class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Columns/Column.php#L33)

A column in the resource schema.

**Implements:** `Alxtexh\Panel\Schema\Renderable`

**Uses:** `Alxtexh\Panel\Support\HasQualifiedSource`

## Methods

### `static make(string $key): static`

### `type(): string`

### `label(string $label): static`

### `sortable(bool $sortable = true): static`

### `searchable(bool $searchable = true): static`

### `summarize(Alxtexh\Panel\Tables\Summarizer $summarizer): static`

A footer aggregate for this column.

### `summarizer(): ?Alxtexh\Panel\Tables\Summarizer`

### `copyable(bool $copyable = true): static`

Renders an inline copy affordance on the cell that holds the value.

### `locked(bool $locked = true): static`

Excluded from the column-visibility menu; always rendered.

### `sticky(bool $sticky = true): static`

Pin this column while the table scrolls horizontally.

### `width(int $width): static`

Preferred width in pixels (client may still resize when allowed).

### `resizable(bool $resizable = true): static`

Allow the operator to drag-resize this column.

### `sortAs(string $key): static`

ORDER BY key when it differs from the display key.

### `prefix(string $prefix): static`

Rendered before the value, e.g. a currency code.

### `suffix(string $suffix): static`

Rendered after the value, e.g. a unit of measure.

### `muted(bool $muted = true): static`

### `align(string $align): static`

### `isSortable(): bool`

### `isSearchable(): bool`

### `resolvedSortKey(): string`

### `resolvedDatabaseColumn(): ?string`

The column an ORDER BY may name - never the alias.

### `resolvedLabel(): string`

### `toSchema(): array`

Satisfies Renderable, so a Column can be a leaf in a schema tree and the

### `toArray(): array`

Serialisable description. Must contain no tenant data and no CSS classes.

### `from(string $column): static`

Qualified database column when it differs from the key.

### `fromRaw(string $expression): static`

A value the DATABASE computes, rather than a column it stores.

### `selectExpression(): Illuminate\Contracts\Database\Query\Expression|string`

How this value appears in the SELECT list - aliased to its own key.

