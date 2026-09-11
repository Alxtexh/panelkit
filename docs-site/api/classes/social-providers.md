# SocialProviders

`Alxtexh\Panel\Auth\SocialProviders` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Auth/SocialProviders.php#L32)

Which sign-in providers this installation actually has, and what to call them.

## Methods

### `static installed(): bool`

Whether `laravel/socialite` is actually loaded.

### `static showUnconfigured(): bool`

Whether the login UI lists providers that lack client id / secret.

### `static offered(Alxtexh\Panel\Panel $panel = NULL): array`

Providers listed on the login UI for this panel (or the app-wide door).

### `static enabled(Alxtexh\Panel\Panel $panel = NULL): array`

Providers with credentials configured, optionally restricted to one panel.

### `static hasCredentials(string $provider): bool`

### `static isEnabled(string $provider, Alxtexh\Panel\Panel $panel = NULL): bool`

### `static isOffered(string $provider, Alxtexh\Panel\Panel $panel = NULL): bool`

### `static label(string $provider): string`

### `static credentialsHint(string $provider): string`

What to tell an operator who clicks a button with no OAuth keys.

### `static verifiesEmail(string $provider): bool`

AN APPLICATION MAY ADD TO THIS AND MAY NOT REMOVE FROM IT SILENTLY. The

