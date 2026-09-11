# Module

`Alxtexh\Panel\Support\Module` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Support/Module.php#L27)

One product module a SaaS panel may sell access to.

## Methods

### `static make(string $key): self`

### `label(string $label): self`

### `description(string $description): self`

### `planLimit(string $kind = 'number', string $label = NULL, int|float|null $step = NULL, string $hint = NULL): self`

How this module appears in the plan editor's perks column.

### `usage(Closure $usage): self`

### `children(array $keys): self`

Child module keys that only make sense when this parent is granted.

### `requires(array $keys): self`

Parent keys that must be granted before this module is enabled.

### `onGrant(Closure $callback): self`

Called once when this key is newly present in `ModuleRegistry::applyGrants()`.

### `key(): string`

### `toDefinition(): array`

key: string,

