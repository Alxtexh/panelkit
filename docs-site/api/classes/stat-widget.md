# StatWidget

`Alxtexh\Panel\Widgets\StatWidget` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Widgets/StatWidget.php#L33)

A single number on the dashboard.

**Uses:** `Alxtexh\Panel\Widgets\CanPoll`, `Alxtexh\Panel\Widgets\HasLayout`

## Methods

### `static make(string $key, string $label): self`

### `value(Closure $value): self`

### `description(string $description): self`

### `trend(Closure $trend): self`

A comparison against the preceding window: "▲ 4% vs previous 30 days".

### `sparkline(Closure $sparkline): self`

The miniature series drawn behind the number.

### `cache(int $ttl): self`

TTL is a backstop for a missed invalidation, never the mechanism.

### `invalidatedBy(array $events): self`

### `ability(string $ability): self`

An ability required to SEE this widget at all, or null for everyone.

### `visibleTo(?mixed $user): bool`

Whether `$user` may see this widget.

### `toArray(): array`

### `resolve(string $tenantKey): array`

Resolve the value. Never throws - a broken widget reports itself.

### `poll(string|int|null $interval = 15): static`

Seconds as an int, or a string like `10s`. Null disables polling.

### `live(string $channel): static`

Echo / Reverb channel. Prefer this over poll when `window.Echo` exists.

### `pollInterval(): ?int`

### `liveChannel(): ?string`

### `span(array|int $span): static`

### `sort(int $sort): static`

Lower sorts first. Ties keep declaration order.

### `sortOrder(): int`

