# Abilities

`Alxtexh\Panel\Support\Abilities` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Support/Abilities.php#L30)

The canonical list of ability names, derived from the registered resources.

## Methods

### `static extra(): array`

Panel abilities the APPLICATION declares, as `name => label`.

### `static panelLabelled(): array`

Every panel-level ability with its label, the package's and the app's.

### `static all(): array`

`{action}_{resource}` for every registered resource.

### `static grouped(): array`

Grouped by resource, for rendering.

### `static name(string $action, string $resourceKey): string`

The ability name for an action on a resource key.

### `static forModel(string $action, Illuminate\Database\Eloquent\Model|string $model): ?string`

The ability name for an action on a MODEL, or null if nothing registers it.

