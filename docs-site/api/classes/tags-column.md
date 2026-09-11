# TagsColumn

`Alxtexh\Panel\Tables\Columns\TagsColumn` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Columns/TagsColumn.php#L16)

A list of labels rendered as chips.

**Extends:** `Alxtexh\Panel\Tables\Columns\Column`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `type(): string`

### `limit(int $limit): static`

Show at most this many chips; the rest collapse to "+N".

### `separator(string $separator): static`

When the stored value is a single string, split on this separator.

### `toArray(): array`

