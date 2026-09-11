# MoneyEntry

`Alxtexh\Panel\Infolists\MoneyEntry` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Infolists/MoneyEntry.php#L14)

A monetary amount on the dedicated view page.

**Extends:** `Alxtexh\Panel\Infolists\Entry`

## Methods

### `type(): string`

### `currency(string $currency): static`

ISO 4217 currency code (e.g. USD, EUR, GBP).

### `divideBy(int $divisor): static`

Divisor for the stored integer amount. Default 100 (cents to dollars).

### `toSchema(): array`

