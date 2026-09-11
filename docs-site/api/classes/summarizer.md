# Summarizer

`Alxtexh\Panel\Tables\Summarizer` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Summarizer.php#L28)

A footer aggregate for one column - a sum, an average, a count.

## Methods

### `static sum(string $column = NULL, string $label = 'Total', string $prefix = NULL, string $suffix = NULL, float $divideBy = NULL, int $decimals = 0): self`

### `static average(string $column = NULL, string $label = 'Average', string $prefix = NULL, string $suffix = NULL, float $divideBy = NULL, int $decimals = 1): self`

### `static min(string $column = NULL, string $label = 'Lowest'): self`

### `static max(string $column = NULL, string $label = 'Highest'): self`

### `static count(string $label = 'Records'): self`

Rows matching the filters - the same number the total shows.

### `expression(string $alias, string $fallbackColumn): string`

The SQL aggregate expression, aliased for retrieval.

### `readsColumn(): ?string`

Whether the aggregate reads a JOINED column.

### `toSchema(): array`

