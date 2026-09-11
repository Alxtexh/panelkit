# Action

`Alxtexh\Panel\Actions\Action` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Actions/Action.php#L34)

A named PHP action. Three homes, one key-from-the-client rule:

## Methods

### `static make(string $key, string $label = NULL): self`

### `label(string $label): self`

### `icon(string $icon): self`

### `destructive(bool $destructive = true): self`

### `confirm(string $message): self`

### `authorize(string $ability): self`

### `mutate(array $attributes): self`

### `handle(Closure $handle): self`

### `action(Closure $callback): self`

Patch form values. `$get('title')` reads, `$set('slug', $value)` writes.

### `url(string $url, bool $shouldOpenInNewTab = false): self`

Client-side href. Toast and bell render this as a button or link.

### `openUrlInNewTab(bool $condition = true): self`

### `method(string $method): self`

HTTP verb for `url()`. `post` hits a named route the way infolist

### `hasFormAction(): bool`

### `runForm(array $values): array`

### `ability(): string`

### `run(Illuminate\Database\Eloquent\Model $record): void`

### `toArray(): array`

### `toAffixSchema(): array`

Schema for a prefix/suffix button. `post: true` tells Vue to POST the

### `toNotificationSchema(): ?array`

Toast and bell payload. URL actions only: a closure cannot leave PHP.

