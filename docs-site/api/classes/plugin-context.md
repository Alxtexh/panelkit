# PluginContext

`Alxtexh\Panel\Plugins\PluginContext` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Plugins/PluginContext.php#L32)

What a plugin is allowed to do to a panel.

## Methods

### `resources(array $classes): self`

Register resource classes into this panel.

### `page(string $title, string $href, string $icon = 'dot', string $group = NULL): self`

Add a sidebar navigation entry.

### `pageClasses(array $classes): self`

Register routable Page classes into this plugin's target panel.

### `routes(Closure $routes): self`

Add routes inside this panel's group.

### `widgets(array $widgets): self`

Register widgets into this plugin's target panel.

### `render(string $position, string $component, array $props = array (
), array $resources = NULL, int $version = Alxtexh\Panel\Plugins\RenderHooks::VERSION): self`

Put a component at a named position on screens the panel already owns.

### `registeredResources(): array`

### `registeredPageClasses(): array`

### `registeredRenders(): array`

### `registeredPages(): array`

### `registeredWidgets(): array`

### `registeredRoutes(): array`

