# SelectFilter

`Alxtexh\Panel\Tables\Filters\SelectFilter` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Filters/SelectFilter.php#L22)

Single-choice equality filter backed by an allowlist.

**Extends:** `Alxtexh\Panel\Tables\Filters\Filter`

**Implements:** `Alxtexh\Panel\Tables\Filters\HasOptions`

## Methods

### `options(Closure|array $options): static`

### `relationship(string $model, string $titleAttribute, Closure $modifyQuery = NULL): static`

Options from a related Eloquent model (BelongsTo-style FK filter).

### `resolvedOptions(): array`

### `allowedValues(): array`

### `normalise(?mixed $raw): ?string`

### `apply(Illuminate\Database\Query\Builder $query, ?mixed $value): void`

### `toArray(): array`

