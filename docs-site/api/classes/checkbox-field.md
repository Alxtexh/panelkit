# CheckboxField

`Alxtexh\Panel\Forms\Fields\CheckboxField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/CheckboxField.php#L21)

A box you tick.

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `type(): string`

### `rules(): array`

`boolean`, and never `required` - the same reasoning as `ToggleField`.

### `presentValue(?mixed $value): mixed`

A create form has no record, so every field starts null. Rendered from

### `absentMeans(): mixed`

AN ABSENT KEY MEANS FALSE, because that is what unticking sends.

