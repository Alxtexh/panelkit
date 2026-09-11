# BadgeColumn

`Alxtexh\Panel\Tables\Columns\BadgeColumn` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Columns/BadgeColumn.php#L26)

A value rendered as a badge, coloured by a SEMANTIC name.

**Extends:** `Alxtexh\Panel\Tables\Columns\Column`

**Implements:** `Alxtexh\Panel\Schema\Renderable`, `Alxtexh\Panel\Tables\Columns\InlineWritableColumn`

## Methods

### `colors(array $colors): static`

### `labels(array $labels): static`

What each value READS as, when the stored value is not the words.

### `defaultColor(string $intent): static`

### `resolver(bool $on = true): static`

Click the badge to change the value without opening the record.

### `inlineUpdate(bool $on = true): static`

Alias of `resolver()`.

### `options(array $options): static`

### `isResolver(): bool`

### `isInlineWritable(): bool`

### `castValue(?mixed $value): string`

### `writableColumn(): string`

### `type(): string`

### `toArray(): array`

