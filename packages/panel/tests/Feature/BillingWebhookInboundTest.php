<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Billing\BillingState;
use Alxtexh\Panel\Billing\GenericBillingWebhookAdapter;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

final class BillingWebhookInboundTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists(GenericBillingWebhookAdapter::class)) {
            $this->markTestSkipped('Billing webhook tests require panel-billing.');
        }
    }

    public function test_generic_inbound_webhook_maps_and_persists_billing_state(): void
    {
        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);

        User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        app(PanelManager::class)->panel('admin')
            ->billingWebhookVerifier(static fn (): bool => true);

        $this->postJson('/billing/webhooks/generic', [
            'billable_type' => 'tenant',
            'billable_key' => (string) $tenant->id,
            'status' => 'past_due',
            'grace_ends_at' => now()->addDay()->toIso8601String(),
            'provider_ref' => 'ref-100',
        ])->assertAccepted();

        $state = BillingState::query()->firstOrFail();

        $this->assertSame('tenant', $state->billable_type);
        $this->assertSame((string) $tenant->id, $state->billable_key);
        $this->assertSame('past_due', $state->status);
        $this->assertSame('ref-100', $state->provider_ref);
    }

    public function test_inbound_webhook_rejects_when_signature_verifier_fails(): void
    {
        app(PanelManager::class)->panel('admin')
            ->billingWebhookVerifier(static fn (): bool => false);

        $this->postJson('/billing/webhooks/generic', [
            'billable_type' => 'tenant',
            'billable_key' => '1',
            'status' => 'active',
        ])->assertStatus(401);

        $this->assertSame(0, BillingState::query()->count());
    }

    public function test_repeated_delivery_is_applied_only_once(): void
    {
        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);

        app(PanelManager::class)->panel('admin')
            ->billingWebhookVerifier(static fn (): bool => true);

        $payload = [
            'billable_type' => 'tenant',
            'billable_key' => (string) $tenant->id,
            'status' => 'active',
        ];

        $this->withHeaders(['X-Webhook-Id' => 'evt-100'])
            ->postJson('/billing/webhooks/generic', $payload)
            ->assertAccepted()
            ->assertJsonPath('duplicate', null);

        $this->withHeaders(['X-Webhook-Id' => 'evt-100'])
            ->postJson('/billing/webhooks/generic', $payload)
            ->assertAccepted()
            ->assertJsonPath('duplicate', true)
            ->assertJsonPath('applied', false);

        $this->assertSame(1, BillingState::query()->count());
    }

    public function test_signed_header_adapter_accepts_a_matching_hmac(): void
    {
        $secret = 'test-secret';

        app(PanelManager::class)->panel('admin')
            ->billingWebhookVerifier(GenericBillingWebhookAdapter::verifier($secret));

        $payload = [
            'billable_type' => 'tenant',
            'billable_key' => '1',
            'status' => 'active',
        ];

        $this->withHeaders([
            'X-Webhook-Signature' => hash_hmac('sha256', json_encode($payload), $secret),
        ])->postJson('/billing/webhooks/generic', $payload)->assertAccepted();
    }

    public function test_signed_header_adapter_rejects_a_bad_signature(): void
    {
        app(PanelManager::class)->panel('admin')
            ->billingWebhookVerifier(GenericBillingWebhookAdapter::verifier('test-secret'));

        $this->withHeaders(['X-Webhook-Signature' => 'nope'])
            ->postJson('/billing/webhooks/generic', [
                'billable_type' => 'tenant',
                'billable_key' => '1',
                'status' => 'active',
            ])
            ->assertStatus(401);
    }
}
