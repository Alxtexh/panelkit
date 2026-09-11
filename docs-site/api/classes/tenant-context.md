# TenantContext

`Alxtexh\Panel\Support\TenantContext` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Support/TenantContext.php#L43)

Resolves "which tenant is this request for" without binding the package to any

## Methods

### `mode(): string`

### `column(): string`

### `shouldScopeByColumn(): bool`

Whether a query against a tenant-owned model needs a column constraint.

### `currentKey(): string|int|null`

The active tenant key, or null if none could be resolved.

### `isIsolated(): bool`

True when isolation is actually in force right now.

### `isCentralPanel(): bool`

Whether the panel serving this request is deliberately UNSCOPED.

### `features(): array`

Per-tenant feature flags.

### `tenant(): mixed`

The tenant record, loaded at most once per request.

