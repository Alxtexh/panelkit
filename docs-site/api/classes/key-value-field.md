# KeyValueField

`Alxtexh\Panel\Forms\Fields\KeyValueField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/KeyValueField.php#L34)

Arbitrary labelled values, stored as one JSON object.

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `type(): string`

### `maxPairs(int $max): self`

### `labels(string $key, string $value): self`

What the two columns are called, when "Key" and "Value" are not the words.

### `reserved(array $keys): self`

Keys this field refuses.

### `additionalRules(): array`

EVERY VALUE, and every KEY.

### `transformForStorage(?mixed $value): mixed`

Stored as an object, edited as a LIST of pairs.

### `toSchema(): array`

