# TenantResourcePolicy

`Alxtexh\Panel\Policies\TenantResourcePolicy` &middot; `abstract-class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Policies/TenantResourcePolicy.php#L54)

Base policy for tenant-owned records.

## Methods

### `viewAny(Illuminate\Contracts\Auth\Authenticatable&Illuminate\Contracts\Auth\Access\Authorizable $user): bool`

### `view(Illuminate\Contracts\Auth\Authenticatable&Illuminate\Contracts\Auth\Access\Authorizable $user, Illuminate\Database\Eloquent\Model $record = NULL): bool`

Record-level abilities take a NULLABLE record.

### `create(Illuminate\Contracts\Auth\Authenticatable&Illuminate\Contracts\Auth\Access\Authorizable $user): bool`

### `update(Illuminate\Contracts\Auth\Authenticatable&Illuminate\Contracts\Auth\Access\Authorizable $user, Illuminate\Database\Eloquent\Model $record = NULL): bool`

### `delete(Illuminate\Contracts\Auth\Authenticatable&Illuminate\Contracts\Auth\Access\Authorizable $user, Illuminate\Database\Eloquent\Model $record = NULL): bool`

### `restore(Illuminate\Contracts\Auth\Authenticatable&Illuminate\Contracts\Auth\Access\Authorizable $user, Illuminate\Database\Eloquent\Model $record = NULL): bool`

Restoring is not editing.

### `forceDelete(Illuminate\Contracts\Auth\Authenticatable&Illuminate\Contracts\Auth\Access\Authorizable $user, Illuminate\Database\Eloquent\Model $record = NULL): bool`

Permanent deletion is the one act with no undo, so it is separate from

