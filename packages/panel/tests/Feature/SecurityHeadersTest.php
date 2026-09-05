<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Imports\Importer;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

final class SecurityHeadersTest extends TestCase
{
    use RefreshDatabase;

    public function test_panel_responses_include_browser_security_headers(): void
    {
        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);
        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user)
            ->get('/articles')
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    }

    public function test_a_host_can_enable_a_content_security_policy(): void
    {
        config(['panel.security.content_security_policy' => "default-src 'self'"]);

        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);
        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user)
            ->get('/articles')
            ->assertOk()
            ->assertHeader('Content-Security-Policy', "default-src 'self'");
    }

    public function test_an_oversized_panel_payload_is_rejected_before_controller_work(): void
    {
        if (! class_exists(Importer::class)) {
            $this->markTestSkipped('Import payload tests require panel-operations.');
        }

        config(['panel.security.max_payload_kilobytes' => 1]);

        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);
        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user)
            ->withHeader('Content-Length', '2048')
            ->postJson('/articles/import', ['mapping' => ['title' => str_repeat('x', 2048)]])
            ->assertStatus(413)
            ->assertJsonPath('message', 'The request payload is too large.');
    }
}
