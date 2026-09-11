# Wizard

`Alxtexh\Panel\Schema\Wizard` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Schema/Wizard.php#L32)

A form broken into ordered steps.

**Extends:** `Alxtexh\Panel\Schema\Component`

## Methods

### `static make(): self`

### `steps(array $steps): self`

### `component(): string`

### `persistInQueryString(string $key = 'step'): self`

Remember the current step in the URL - see `Tabs::persistInQueryString()`

### `toSchema(): array`

### `stepRules(): array`

The validation rules belonging to each step, in order.

