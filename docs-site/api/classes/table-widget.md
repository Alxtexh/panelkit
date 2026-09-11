# TableWidget

`Alxtexh\Panel\Widgets\TableWidget` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Widgets/TableWidget.php#L26)

A capped resource list on a dashboard, drawn with the same DataTable.

**Uses:** `Alxtexh\Panel\Widgets\CanPoll`, `Alxtexh\Panel\Widgets\HasLayout`

## Methods

### `static make(string $key, string $label = NULL): self`

### `resource(string $resource): self`

### `limit(int $limit): self`

### `label(string $label): self`

### `description(string $description): self`

### `ability(string $ability): self`

### `visibleTo(?mixed $user): bool`

Visible when the ability is held, or (with no ability) when the resource

### `toArray(): array`

### `resolve(): array`

The capped list. Never throws: a broken query is one broken card.

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

