# PanelPlugin

`Alxtexh\Panel\Plugins\PanelPlugin` &middot; `interface` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Plugins/PanelPlugin.php#L34)

Modular registration for host-owned panel packages.

## Methods

### `id(): string`

A stable identifier, unique across everything installed.

### `appliesTo(Alxtexh\Panel\Panel $panel): bool`

Whether this plugin belongs in `$panel`.

### `register(Alxtexh\Panel\Plugins\PluginContext $context): void`

Add what this plugin contributes.

### `getVersion(): string`

Compatibility metadata for `panel:doctor`.

### `static panelIds(): ?array`

Panel ids this plugin may apply to, without constructing the plugin.

