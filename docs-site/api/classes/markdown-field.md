# MarkdownField

`Alxtexh\Panel\Forms\Fields\MarkdownField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/MarkdownField.php#L32)

Prose stored as MARKDOWN, not as HTML - roadmap 4.5.

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `type(): string`

### `rows(int $rows): self`

### `toolbar(array $toolbar): self`

Which shortcuts the editor offers.

### `rules(): array`

Markdown is text, so the rules are text rules.

### `toSchema(): array`

