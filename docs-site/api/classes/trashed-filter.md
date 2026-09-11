# TrashedFilter

`Alxtexh\Panel\Tables\Filters\TrashedFilter` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Filters/TrashedFilter.php#L27)

Show live records, deleted records, or both.

**Extends:** `Alxtexh\Panel\Tables\Filters\Filter`

**Implements:** `Alxtexh\Panel\Tables\Filters\HasOptions`

## Methods

### `deletedColumn(string $column): self`

The qualified `deleted_at` column, when the list joins.

### `resolvedOptions(): array`

### `normalise(?mixed $value): ?string`

### `apply(Illuminate\Database\Query\Builder $query, ?mixed $value): void`

### `toArray(): array`

The options are STATIC - three fixed views - so unlike a select they are

