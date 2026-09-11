# TenantScope

`Alxtexh\Panel\Models\Scopes\TenantScope` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Models/Scopes/TenantScope.php#L47)

**Implements:** `Illuminate\Database\Eloquent\Scope`

## Methods

### `apply(Illuminate\Database\Eloquent\Builder $builder, Illuminate\Database\Eloquent\Model $model): void`

`Builder<Model>`, THE WIDEST HONEST TYPE. A global scope is applied to

### `static currentTenantId(): string|int|null`

Convenience for application code that needs the current tenant key.

