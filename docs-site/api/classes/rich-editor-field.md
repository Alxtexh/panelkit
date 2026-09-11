# RichEditorField

`Alxtexh\Panel\Forms\Fields\RichEditorField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/RichEditorField.php#L46)

Formatted prose, stored as HTML.

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `type(): string`

### `toolbar(array $controls): self`

Which controls the toolbar offers.

### `maxLength(int $max): self`

A ceiling on the stored markup, in characters.

### `transformForStorage(?mixed $value): mixed`

Parse, walk, and rebuild from the allowlist.

### `static sanitize(string $html): string`

The sanitiser, public so it can be tested directly and reused.

### `toSchema(): array`

