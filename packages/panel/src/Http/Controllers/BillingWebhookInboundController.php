<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Alxtexh\Panel\Billing\GenericInboundBillingMapper;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\BillingStateStore;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;

final class BillingWebhookInboundController extends Controller
{
    public function __invoke(Request $request, ?string $adapter = null): JsonResponse
    {
        abort_unless(class_exists(GenericInboundBillingMapper::class), 503, 'The optional Panel billing module is not installed.');

        $panel = app(PanelManager::class)->currentPanel();

        abort_if($panel === null, 404);

        $rawBody = (string) $request->getContent();
        $payload = $request->json()->all();

        $verifier = $panel->billingWebhookVerifierUsing();
        $verified = $verifier === null
            ? true
            : (bool) app()->call($verifier, [
                'request' => $request,
                'panel' => $panel,
                'adapter' => $adapter,
                'payload' => $payload,
                'rawBody' => $rawBody,
            ]);

        abort_if(! $verified, 401, 'Webhook verification failed.');

        $mapper = $panel->billingWebhookMapperUsing();
        $mapped = $mapper === null
            ? GenericInboundBillingMapper::map($payload, $request)
            : app()->call($mapper, [
                'request' => $request,
                'panel' => $panel,
                'adapter' => $adapter,
                'payload' => $payload,
                'rawBody' => $rawBody,
            ]);

        if (! is_array($mapped) || ! isset($mapped['billable_key'], $mapped['status'])) {
            return response()->json(['ok' => true, 'applied' => false], 202);
        }

        $eventKey = $this->eventKey($request, $payload, $rawBody, $adapter, $panel->id);
        $response = Cache::lock($eventKey.':lock', 10)->block(5, function () use ($eventKey, $mapped): JsonResponse {
            if (Cache::has($eventKey)) {
                return response()->json(['ok' => true, 'applied' => false, 'duplicate' => true], 202);
            }

            $transition = BillingStateStore::upsert(
                (string) ($mapped['billable_type'] ?? 'tenant'),
                (string) $mapped['billable_key'],
                (string) $mapped['status'],
                is_string($mapped['period_end_at'] ?? null) ? $mapped['period_end_at'] : null,
                is_string($mapped['grace_ends_at'] ?? null) ? $mapped['grace_ends_at'] : null,
                is_string($mapped['provider_ref'] ?? null) ? $mapped['provider_ref'] : null,
            );

            Cache::put($eventKey, true, now()->addDay());

            return response()->json(['ok' => true, 'applied' => true, 'transition' => $transition], 202);
        });

        return $response;
    }

    /**
     * Prefer a provider event id, but safely deduplicate identical deliveries
     * when a provider omitted one. The panel and adapter are part of the key so
     * two portals or webhook adapters cannot suppress one another's events.
     *
     * @param  array<string, mixed>  $payload
     */
    private function eventKey(Request $request, array $payload, string $rawBody, ?string $adapter, string $panelId): string
    {
        $provided = $request->header('X-Webhook-Id')
            ?: $request->header('X-Event-Id')
            ?: $request->header('Idempotency-Key')
            ?: ($payload['event_id'] ?? $payload['id'] ?? null);
        $identity = is_string($provided) && trim($provided) !== ''
            ? trim($provided)
            : hash('sha256', $rawBody);

        return 'panel:webhook:'.hash('sha256', implode('|', [$panelId, (string) $adapter, $identity]));
    }
}
