# Turnstile

`Alxtexh\Panel\Auth\Turnstile` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Auth/Turnstile.php#L33)

Cloudflare Turnstile, verified server-side.

## Methods

### `static configured(): bool`

Both Cloudflare keys are present. That is what makes a widget and a

### `static enabled(): bool`

### `static siteKey(): ?string`

### `verify(string $token, string $ip = NULL): bool`

Is this token good for this visitor?

