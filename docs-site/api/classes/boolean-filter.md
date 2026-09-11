# BooleanFilter

`Alxtexh\Panel\Tables\Filters\BooleanFilter` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Filters/BooleanFilter.php#L21)

Three-state boolean: not applied, true, or false.

**Extends:** `Alxtexh\Panel\Tables\Filters\Filter`

## Methods

### `labels(string $true, string $false): static`

### `normalise(?mixed $raw): ?bool`

### `apply(Illuminate\Database\Query\Builder $query, ?mixed $value): void`

### `toQueryValue(?mixed $value): string`

### `toSchema(): array`

Labels are structure, not tenant data, so they belong in the schema.

### `toArray(): array`

