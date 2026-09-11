# ModuleRegistry

`Alxtexh\Panel\Support\ModuleRegistry` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Support/ModuleRegistry.php#L44)

Product modules a SaaS app declares, and which ones the current plan grants.

## Methods

### `static register(array $modules): void`

### `static grants(Closure $resolver): void`

Keys the current actor may use. Return an empty list to grant nothing.

### `static caps(Closure $resolver): void`

Numeric (or 0/1 toggle) caps keyed by module. -1 means Unlimited.

### `static grantsAreSet(): bool`

### `static all(): array`

Catalogue for the client and the plan editor. Closures are stripped.

### `static planLimits(): array`

Perk rows for `PlanSetupPage::limits()`, from modules that declared

### `static granted(): array`

### `static enabled(string $key): bool`

### `static withRequiredParents(array $keys): array`

Add required parents so a plan that ticks a child also grants the parent.

### `static applyGrants(?mixed $org, array $keys, array $previous = array (
)): array`

Expand parents, then run `onGrant` for keys that were not in `$previous`.

### `static has(string $key): bool`

### `static limit(string $key): int|float`

Cap for this module from `caps()`. -1 when no cap is configured (Unlimited).

### `static withinLimit(string $key): bool`

Whether current usage is still under the plan cap.

### `static usage(string $key): int|float|null`

### `static definitions(): array`

