# JobStatus

`Alxtexh\Panel\Actions\JobStatus` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Actions/JobStatus.php#L26)

Progress for a queued bulk action or export.

## Methods

### `static token(): string`

### `static startFor(string|int $ownerId, string $kind, string $idempotencyKey = NULL, callable $onStarted = NULL, string $fingerprint = NULL): string`

Start work once for an owner, operation kind, and optional retry key.

### `static start(string $token, string|int $ownerId, string $kind, string $fingerprint = NULL): void`

### `static progress(string $token, int $done, int $total = NULL): void`

### `static checkpoint(string $token, array $processed): void`

Persist a resumable execution checkpoint alongside normal progress.

### `static cursor(string $token, string|int|null $cursor): void`

Persist the last committed cursor for a resumable keyset scan.

### `static finish(string $token, array $extra = array (
)): void`

### `static fail(string $token, string $message): void`

### `static cancel(string $token, string|int $ownerId): bool`

Cancel a live job only when the caller owns its status record.

### `static isCanceled(string $token): bool`

### `static get(string $token, string|int $ownerId): ?array`

The status, but only for the user who started it.

