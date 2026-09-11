# Plugin

`Alxtexh\Panel\Plugins\Plugin` &middot; `abstract-class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Plugins/Plugin.php#L28)

A starting point for a plugin, with the boring half already answered.

**Implements:** `Alxtexh\Panel\Plugins\PanelPlugin`

## Methods

### `id(): string`

The class name, unless overridden.

### `appliesTo(Alxtexh\Panel\Panel $panel): bool`

### `static panelIds(): ?array`

Panel ids this plugin may apply to, without constructing the plugin.

### `getVersion(): string`

Compatibility metadata for `panel:doctor`.

### `dependencies(): array`

Optional runtime dependencies expressed as class or interface names.

### `health(): array`

Optional host/plugin health findings for `panel:doctor`.

### `configKey(): ?string`

The config key whose value is validated by configRules(), if any.

### `configRules(): array`

Optional Laravel validation rules for plugin configuration.

### `register(Alxtexh\Panel\Plugins\PluginContext $context): void`

Register this plugin into the provided panel.

### `registerResources(Alxtexh\Panel\Panel $panel): void`

Plugin hook for panel resource registration.

### `registerPages(Alxtexh\Panel\Panel $panel): void`

Plugin hook for panel Page-class registration.

### `registerWidgets(Alxtexh\Panel\Panel $panel): void`

Plugin hook for dashboard widget registration.

### `registerMenuItems(Alxtexh\Panel\Panel $panel): void`

Plugin hook for sidebar navigation entries that are not Page classes.

### `registerRenderHooks(Alxtexh\Panel\Panel $panel): void`

Plugin hook for render hooks to named positions.

