# HasQualifiedSource

`Alxtexh\Panel\Support\HasQualifiedSource` &middot; `trait` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Support/HasQualifiedSource.php#L32)

A SQL source for a schema node keyed by `$key` - a plain attribute by

## Methods

### `from(string $column): static`

Qualified database column when it differs from the key.

### `fromRaw(string $expression): static`

A value the DATABASE computes, rather than a column it stores.

### `selectExpression(): Illuminate\Contracts\Database\Query\Expression|string`

How this value appears in the SELECT list - aliased to its own key.

