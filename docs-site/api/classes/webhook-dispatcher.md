# WebhookDispatcher

`Alxtexh\Panel\Webhooks\WebhookDispatcher` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Webhooks/WebhookDispatcher.php#L15)

Dispatch kit webhook deliveries. Sync by default; queue when configured.

## Methods

### `dispatch(string $event, array $payload, string|int|null $tenantId = NULL): void`

### `retry(Alxtexh\Panel\Webhooks\WebhookDelivery $delivery): void`

### `ping(Alxtexh\Panel\Webhooks\WebhookEndpoint $endpoint, string|int|null $tenantId = NULL): void`

Send a test delivery to one endpoint (bypasses event subscription filter).

