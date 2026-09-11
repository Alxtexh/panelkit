# MultiSelectFilter

`Alxtexh\Panel\Tables\Filters\MultiSelectFilter` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Filters/MultiSelectFilter.php#L22)

Multiple values at once: status IN (expired, suspended).

**Extends:** `Alxtexh\Panel\Tables\Filters\Filter`

**Implements:** `Alxtexh\Panel\Tables\Filters\HasOptions`

## Methods

### `options(Closure|array $options): static`

### `resolvedOptions(): array`

### `normalise(?mixed $raw): ?array`

### `apply(Illuminate\Database\Query\Builder $query, ?mixed $value): void`

### `toQueryValue(?mixed $value): string`

### `toArray(): array`

