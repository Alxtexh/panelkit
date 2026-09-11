# MoneyField

`Alxtexh\Panel\Forms\Fields\MoneyField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/MoneyField.php#L62)

A decimal monetary amount - the form-side counterpart to `MoneyColumn`.

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `currency(string $symbol): static`

The currency symbol shown as the field's prefix.

### `decimals(int $decimals): static`

How many decimal places the amount may carry. Currency is 2 by default; a rate field might want more.

### `min(float $min): static`

### `max(float $max): static`

### `major(bool $major = true): static`

The stored value is already in major units - `12.50` rather than `1250`.

### `divideBy(int $divisor): static`

Divisor between the stored integer and the major-unit amount this

### `type(): string`

### `presentValue(?mixed $value): mixed`

Stored minor units -> the major-unit amount the form shows.

### `transformForStorage(?mixed $value): mixed`

The validated major-unit amount -> what the column should hold.

