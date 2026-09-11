# QueryBuilderFilter

`Alxtexh\Panel\Tables\Filters\QueryBuilderFilter` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Filters/QueryBuilderFilter.php#L34)

A nested and/or rule tree the operator composes in the UI.

**Extends:** `Alxtexh\Panel\Tables\Filters\Filter`

## Methods

### `over(array $filters): self`

The sibling filters this may target.

### `normalise(?mixed $raw): ?array`

### `errorsIn(?mixed $tree, int $depth = 0, int $count = 0): array`

Everything wrong with a tree, as messages, or `[]` when it is sound.

### `apply(Illuminate\Database\Query\Builder $query, ?mixed $value): void`

### `toQueryValue(?mixed $value): string`

A TREE TRAVELS AS JSON IN THE QUERY STRING, not as bracketed array

### `toArray(): array`

