# BillingStateStore

`Alxtexh\Panel\Support\BillingStateStore` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Support/BillingStateStore.php#L12)

## Methods

### `static forCurrentContext(Alxtexh\Panel\Panel $panel): ?array`

### `static upsert(string $billableType, string|int $billableKey, string $status, DateTimeInterface|string|null $periodEndAt = NULL, DateTimeInterface|string|null $graceEndsAt = NULL, string $providerRef = NULL): array`

### `static suspendIfPastDueBeyondGrace(string $billableType, string|int $billableKey): array`

Suspend only when current status is past_due and grace has passed.

### `static reactivate(string $billableType, string|int $billableKey, DateTimeInterface|string|null $periodEndAt = NULL, string $providerRef = NULL): array`

### `static cancelAtPeriodEnd(string $billableType, string|int $billableKey, DateTimeInterface|string|null $periodEndAt = NULL, string $providerRef = NULL): array`

### `static resolveBillableTarget(Alxtexh\Panel\Panel $panel): ?array`

