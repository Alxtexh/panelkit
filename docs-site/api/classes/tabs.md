# Tabs

`Alxtexh\Panel\Schema\Tabs` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Schema/Tabs.php#L16)

Tabbed sections, for a form or a view page.

**Extends:** `Alxtexh\Panel\Schema\Component`

## Methods

### `static make(): self`

### `tabs(array $tabs): self`

### `component(): string`

### `persistInQueryString(string $key = 'tab'): self`

Remember which tab was open in the URL, so a refresh or a back-button

### `toSchema(): array`

