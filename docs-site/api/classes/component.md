# Component

`Alxtexh\Panel\Schema\Component` &middot; `abstract-class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Schema/Component.php#L29)

A node in a form or view schema.

## Methods

### `component(): string`

### `visibilityCondition(): Closure|array|null`

### `isVisible(array $values): bool`

Whether this node's own condition is met against $values - NOT whether

### `visibleWhen(string $field, ?mixed $value): static`

Show this WHOLE NODE only when another field holds a given value - the

### `visible(Closure $condition): static`

The same thing `visibleWhen()` does, for a condition a `[field, value]`

### `schema(array $children): static`

### `children(): array`

### `toSchema(): array`

### `static collectFields(array $nodes): array`

Every Field anywhere beneath this node, at any depth.

### `static collectEntries(array $nodes): array`

Every Entry anywhere beneath these nodes, at any depth - the infolist

### `static collectConditionalNodes(array $nodes): array`

Every layout node anywhere beneath these, keyed by the same id its own

### `static visibleFields(array $nodes, array $values): array`

Every Field beneath this node whose enclosing chain of conditions is

