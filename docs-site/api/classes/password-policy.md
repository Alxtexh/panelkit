# PasswordPolicy

`Alxtexh\Panel\Auth\PasswordPolicy` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Auth/PasswordPolicy.php#L35)

How old a password may get, and what it may not be changed to.

## Methods

### `static fromConfig(): self`

### `static complexityHint(object $rule): ?string`

The Apple `passwordrules` attribute hint, when the running Laravel

### `expiryEnabled(): bool`

### `maxAgeDays(): int`

### `mustChange(Illuminate\Contracts\Auth\Authenticatable $user): bool`

Whether this account must change its password before doing anything else.

### `daysUntilExpiry(Illuminate\Contracts\Auth\Authenticatable $user): ?int`

Days until this password expires, or null when nothing will expire.

### `isReused(Illuminate\Contracts\Auth\Authenticatable $user, string $plain): bool`

Whether `$plain` is one this account has used recently.

### `recordChange(Illuminate\Database\Eloquent\Model $user): void`

Record that the password just changed, keeping the old one on the list.

