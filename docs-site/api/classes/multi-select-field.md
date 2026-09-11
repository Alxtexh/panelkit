# MultiSelectField

`Alxtexh\Panel\Forms\Fields\MultiSelectField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/MultiSelectField.php#L29)

A field holding SEVERAL values from a fixed list.

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `presentValue(?mixed $value): mixed`

Turn whatever the record holds into option values.

### `optionAttribute(string $attribute): self`

Which attribute of a related model the options are keyed by.

### `type(): string`

### `options(Closure|array $options): self`

### `max(int $max): self`

Cap how many may be chosen.

### `resolveOptions(): array`

Options in the transport shape every other field uses.

### `additionalRules(): array`

EVERY MEMBER, not just the array.

### `toSchema(): array`

