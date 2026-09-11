# ChartWidget

`Alxtexh\Panel\Widgets\ChartWidget` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Widgets/ChartWidget.php#L36)

A chart on the dashboard.

**Uses:** `Alxtexh\Panel\Widgets\CanPoll`, `Alxtexh\Panel\Widgets\HasLayout`

## Methods

### `static make(string $key, string $label): self`

### `type(string $type): self`

### `data(Closure $data): self`

The series - or, for `type('table')`, the rows, or for `catalog`/`items`, the items.

### `trend(Closure $trend): self`

The comparison against the preceding window.

### `description(string $description): self`

### `icon(string $icon): self`

A semantic icon name the client already knows (`gauge`, `users`).

### `withPeriods(bool $enabled = true): self`

Show the today/7d/30d selector on this card.

### `cache(int $ttl): self`

Cache this chart per tenant and period, with an explicit invalidation contract.

### `invalidatedBy(array $events): self`

### `thresholds(array $thresholds, int $max = NULL): self`

Colour bars by their own value - a ranked "worst first" chart.

### `ability(string $ability): self`

An ability required to SEE this widget at all, or null for everyone.

### `visibleTo(?mixed $user): bool`

Whether `$user` may see this widget.

### `toArray(): array`

### `resolve(Alxtexh\Panel\Widgets\Period $period, string $tenantKey, DateTimeImmutable $now = NULL): array`

Resolve the series for `$period`. Never throws.

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

