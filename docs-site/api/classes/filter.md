# Filter

`Alxtexh\Panel\Tables\Filters\Filter` &middot; `abstract-class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Filters/Filter.php#L26)

Base for list filters.

## Methods

### `static make(string $key): static`

### `column(string $column): static`

Qualified database column, e.g. `clients.status`. Defaults to the key.

### `label(string $label): static`

### `resolvedColumn(): string`

### `resolvedLabel(): string`

### `indicator(Closure|string $indicator): static`

The chip label when this filter is applied.

### `indicateUsing(Closure $callback): static`

Build the chips from the normalised value.

### `indicators(?mixed $value): array`

Chips for the applied value, or an empty list when the filter is idle.

### `normalise(?mixed $raw): mixed`

Raw request input to a safe value, or null for "not applied".

### `apply(Illuminate\Database\Query\Builder $query, ?mixed $value): void`

### `toArray(): array`

Serialisable description for the frontend.

### `toSchema(): array`

STRUCTURE ONLY, for the cached schema. Must never resolve options.

### `toQueryValue(?mixed $value): string`

How the value appears in a query string.

