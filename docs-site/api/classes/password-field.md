# PasswordField

`Alxtexh\Panel\Forms\Fields\PasswordField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/PasswordField.php#L28)

A password, hashed on the way in and never sent on the way out.

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `type(): string`

### `omitsFromStorage(?mixed $value): bool`

### `transformForStorage(?mixed $value): mixed`

### `presentValue(?mixed $value): mixed`

Never round-trips the stored hash to the client.

