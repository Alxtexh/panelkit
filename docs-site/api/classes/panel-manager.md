# PanelManager

`Alxtexh\Panel\PanelManager` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/PanelManager.php#L28)

Holds the registered panels.

## Methods

### `registerPanel(Alxtexh\Panel\Panel $panel): void`

### `unregisterPanel(string $id): void`

Remove a panel from the process-wide boot registry.

### `panels(): array`

### `plugin(Alxtexh\Panel\Plugins\PanelPlugin $plugin): void`

Install a plugin into every panel that accepts it.

### `plugins(): array`

### `alertRule(Alxtexh\Panel\Alerts\AlertRule $rule): void`

Conditions the bell should watch, declared by the application.

### `alertRules(): array`

### `applyPlugins(Alxtexh\Panel\Panel $panel): void`

Run every applicable plugin against `$panel`, once.

### `pluginsAppliedFor(string $panelId): bool`

Whether plugins have already run for a panel this request.

### `panelPages(string $panelId = NULL): array`

Navigation entries contributed by plugins, plus the panel's own.

### `renderHooks(string $resource = NULL, string $panelId = NULL): array`

Markup plugins put at a named position - roadmap 4.4.

### `renderHookCompatibility(string $resource = NULL, string $panelId = NULL): array`

Report render hooks that cannot be safely mounted by this Panel build.

### `pluginRoutes(string $panelId): array`

Route callbacks contributed by plugins, for `PanelRoutes` to mount.

### `static forgetPlugins(): void`

Forget every plugin. TESTS ONLY.

### `panelFor(string $class): ?string`

The panel a resource CLASS was registered for, or null if nothing

### `panel(string $id): ?Alxtexh\Panel\Panel`

### `usePanel(string $id): void`

Make a panel current for this request.

### `currentPanel(): ?Alxtexh\Panel\Panel`

The panel serving this request.

### `inCentralContext(): bool`

Whether the current request runs WITHOUT tenant scoping.

### `discoverResources(string $directory, string $namespace, string $panelId = NULL): void`

### `registerResources(array $classes, string $panelId = NULL): void`

### `resource(string $key): ?string`

### `singularsFor(string $panelId): array`

Singular resources for one panel - roadmap 4.3.

### `singular(string $key, string $panelId = NULL): ?string`

### `clusterNavFor(string $resourceClass): ?array`

The sub-navigation for one resource's cluster, or null - roadmap 4.1.

### `resourcesFor(string $panelId): array`

Resources belonging to one panel.

### `pages(): array`

Every page this installation declares, keyed by slug.

### `page(string $slug): ?string`

A page by slug, panel-scoped when a panel is explicitly active.

### `pagesFor(string $panelId): array`

Pages belonging to one portal.

### `discoverPages(string $directory, string $namespace): void`

### `registerPages(array $classes, string $panelIdOverride = NULL): void`

### `resources(): array`

### `static flushMemoization(): void`

Cleared by the Octane flush listener in PanelServiceProvider.

### `remember(string $key, Closure $resolve): mixed`

