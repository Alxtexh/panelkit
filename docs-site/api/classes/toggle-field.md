# ToggleField

`Alxtexh\Panel\Forms\Fields\ToggleField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/ToggleField.php#L7)

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `type(): string`

### `rules(): array`

`boolean`, and never `required`.

### `presentValue(?mixed $value): mixed`

A toggle has NO NULL STATE. A create form seeds every field with the

### `absentMeans(): mixed`

AN ABSENT KEY MEANS FALSE, for the same reason as `CheckboxField`.

