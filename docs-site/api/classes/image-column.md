# ImageColumn

`Alxtexh\Panel\Tables\Columns\ImageColumn` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Tables/Columns/ImageColumn.php#L24)

An avatar or logo in a cell.

**Extends:** `Alxtexh\Panel\Tables\Columns\Column`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `type(): string`

### `rounded(bool $rounded = true): self`

Circular for people, square for logos and screenshots.

### `square(): self`

### `size(string $size): self`

sm | md | lg - fixed sizes, never a pixel value from data.

### `fallbackFrom(string $key): self`

Which column supplies the initials when there is no image.

### `fallback(string $fallback): self`

initials | icon | none

### `toArray(): array`

