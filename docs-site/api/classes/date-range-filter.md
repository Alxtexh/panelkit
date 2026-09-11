# DateRangeFilter

`Alxtexh\Panel\Tables\Filters\DateRangeFilter` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Filters/DateRangeFilter.php#L28)

A date range, with named presets.

**Extends:** `Alxtexh\Panel\Tables\Filters\Filter`

## Methods

### `timezone(string $timezone): static`

Defaults to the application timezone; pass the tenant's when known.

### `normalise(?mixed $raw): ?array`

A preset name, or an explicit `from..to` pair of Y-m-d dates.

### `apply(Illuminate\Database\Query\Builder $query, ?mixed $value): void`

### `toQueryValue(?mixed $value): string`

### `toArray(): array`

### `toSchema(): array`

