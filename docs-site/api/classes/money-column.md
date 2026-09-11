# MoneyColumn

`Alxtexh\Panel\Tables\Columns\MoneyColumn` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Columns/MoneyColumn.php#L33)

An amount of money, formatted client-side in the viewer's locale.

**Extends:** `Alxtexh\Panel\Tables\Columns\Column`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `currency(string $code): static`

A fixed currency for every row, as an ISO 4217 code: `KES`, `EUR`.

### `currencyFrom(string $attribute): static`

Read the currency from another attribute on the same row.

### `major(bool $major = true): static`

The stored value is already in major units - `12.50` rather than `1250`.

### `type(): string`

### `toArray(): array`

THE POSITIVE FLAG IS EMITTED, not the default one.

