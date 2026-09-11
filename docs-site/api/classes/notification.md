# Notification

`Alxtexh\Panel\Notifications\Notification` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Notifications/Notification.php#L33)

Filament-shaped flash, mapped onto the kit's Inertia toast.

## Methods

### `static make(): self`

### `title(string $title): self`

### `body(string $body): self`

### `href(string $href): self`

### `category(string $category): self`

### `actions(array $actions): self`

Buttons on the toast and, with `bell()`, the inbox row.

### `success(): self`

### `info(): self`

### `warning(): self`

### `danger(): self`

### `error(): self`

### `duration(int $milliseconds): self`

How long the toast stays, in milliseconds. Ignored once `persistent()` is on.

### `persistent(bool $persistent = true): self`

Stays until dismissed by hand - for something the operator must act on, not glance past.

### `iconColor(string $color): self`

Recolour the toast icon independently of `type` - a `warning()` toast

### `bell(): self`

Also write the topbar bell. The toast still fires.

### `toToast(): self`

### `toDatabase(): self`

### `toBoth(): self`

### `channels(array $channels): self`

Route this notification through named channels.

### `persist(): self`

Also persist to the database (the bell inbox) for the current user.

### `send(): void`

### `sendToDatabase(Illuminate\Contracts\Auth\Authenticatable $recipient): void`

Send this notification directly to another user's database inbox.

### `toArray(): array`

