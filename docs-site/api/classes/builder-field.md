# BuilderField

`Alxtexh\Panel\Forms\Fields\BuilderField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/BuilderField.php#L34)

A sequence of blocks, each with its own shape - roadmap 4.5.

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `type(): string`

### `block(string $type, string $label, array $fields): self`

Declare one kind of block.

### `maxBlocks(int $max): self`

A ceiling, for a surface with a real limit - a homepage, an email.

### `rules(): array`

Rules for the list itself.

### `transformForStorage(?mixed $value): array`

Keep only declared blocks, and only their declared fields.

### `toSchema(): array`

