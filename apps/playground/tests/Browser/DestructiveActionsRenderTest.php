<?php

declare(strict_types=1);

namespace Tests\Browser;

use App\Demo\Models\Client;
use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTruncation;
use Laravel\Dusk\Browser;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\DuskTestCase;

/**
 * Destructive actions are tested in the browser, not only at the endpoint.
 *
 * A controller test can prove that DELETE soft-deletes a client and that the
 * restore endpoint brings it back. It cannot prove the operator was asked
 * first, that Cancel leaves the record alone, or that the route is actually
 * reachable from the row menu. This is the complete user journey that should
 * stay true when the table, modal, or trash screen is refactored.
 */
final class DestructiveActionsRenderTest extends DuskTestCase
{
    use DatabaseTruncation;

    private int|string|null $operatorId = null;

    private Client $client;

    private function seedOperator(): void
    {
        $tenant = Tenant::create([
            'name' => 'Lakeside Fibre',
            'slug' => 'lakeside-destructive-'.uniqid(),
        ]);

        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
            'email_verified_at' => now(),
        ]);

        $registrar = app(PermissionRegistrar::class);
        $previous = $registrar->getPermissionsTeamId();
        $registrar->setPermissionsTeamId($tenant->id);

        try {
            $user->assignRole(Role::findOrCreate('Administrator', 'web'));
        } finally {
            $registrar->setPermissionsTeamId($previous);
        }

        $this->operatorId = $user->getKey();

        $plan = Plan::withoutGlobalScopes()->forceCreate([
            'tenant_id' => $tenant->id,
            'name' => 'Browser test plan',
            'speed_mbps' => 20,
            'price_cents' => 250_000,
            'position' => 1,
            'is_active' => true,
        ]);

        $this->client = Client::withoutGlobalScopes()->forceCreate([
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'name' => 'Browser delete customer',
            'phone' => '+254700000001',
            'access_code' => 'BROWSER-DELETE',
            'plan_type' => 'pppoe',
            'status' => 'active',
            'expiry_date' => '2026-12-31',
        ]);
    }

    public function test_delete_requires_confirmation_and_trash_restore_completes_the_journey(): void
    {
        $this->seedOperator();

        $this->browse(function (Browser $browser): void {
            $browser->loginAs($this->operatorId)
                ->visit('/clients')
                ->assertPathIs('/clients')
                ->waitForText('Browser delete customer', 15)

                // The destructive action is reachable from the same row menu
                // as the other record actions, but is not executed on click.
                ->click('[aria-label="Actions for Browser delete customer"]')
                ->waitFor('[role="menu"]', 5)
                ->assertPresent('[role="menu"][data-pk-overlay]');

            $menuGeometry = $browser->script(<<<'JS'
                const trigger = document.querySelector('[aria-label="Actions for Browser delete customer"]');
                const menu = document.querySelector('[role="menu"][data-pk-overlay]');
                if (!trigger || !menu) return null;

                const triggerBox = trigger.getBoundingClientRect();
                const menuBox = menu.getBoundingClientRect();
                const style = getComputedStyle(menu);

                return {
                    position: style.position,
                    width: menuBox.width,
                    top: menuBox.top,
                    left: menuBox.left,
                    bottom: menuBox.bottom,
                    right: menuBox.right,
                    triggerTop: triggerBox.top,
                    triggerRight: triggerBox.right,
                    viewportWidth: window.innerWidth,
                    viewportHeight: window.innerHeight,
                };
            JS)[0];

            $this->assertIsArray($menuGeometry, 'the row action menu did not expose measurable geometry');
            $this->assertSame('fixed', $menuGeometry['position']);
            // CSS declares a 10rem floor. Allow the sub-pixel value Chromium
            // can report at a fractional device scale while still rejecting
            // a genuinely narrow action menu.
            $this->assertGreaterThanOrEqual(156, $menuGeometry['width']);
            $this->assertGreaterThanOrEqual(8, $menuGeometry['top']);
            $this->assertGreaterThanOrEqual(8, $menuGeometry['left']);
            $this->assertLessThanOrEqual($menuGeometry['viewportWidth'] - 8, $menuGeometry['right']);
            $this->assertLessThanOrEqual($menuGeometry['viewportHeight'] - 8, $menuGeometry['bottom']);

            $browser
                ->clickAtXPath("//div[@role='menu']//button[@data-menu-item][.//span[normalize-space()='Delete']]")
                ->waitFor('[role="dialog"]', 5)
                ->waitUntilMissing('[role="menu"]', 5)
                ->assertSeeIn('[role="dialog"]', 'This cannot be undone.')
                ->assertSeeIn('[role="dialog"]', 'Browser delete customer')

                ->assertScript(
                    "return [...document.querySelectorAll('[role=\"dialog\"] [data-slot=\"modal-footer\"] button')].every((button) => { const box = button.getBoundingClientRect(); return box.height >= 40 && box.width >= 80; })",
                    true,
                )

                // Cancel is a real safety path: no request and no soft delete.
                ->clickAtXPath("//div[@role='dialog']//button[normalize-space()='Cancel']")
                ->waitUntilMissing('[role="dialog"]', 5);

            $this->assertDatabaseHas('clients', ['id' => $this->client->id, 'deleted_at' => null]);

            $browser->click('[aria-label="Actions for Browser delete customer"]')
                ->waitFor('[role="menu"]', 5)
                ->clickAtXPath("//div[@role='menu']//button[@data-menu-item][.//span[normalize-space()='Delete']]")
                ->waitFor('[role="dialog"]', 5)
                ->clickAtXPath("//div[@role='dialog']//button[normalize-space()='Delete']")
                ->waitUntilMissingText('Browser delete customer', 15)

                // A soft-deleted row is discoverable without knowing its
                // resource-specific restore URL.
                ->visit('/trash')
                ->waitForText('Trash', 15)
                ->waitForText('Browser delete customer', 15)
                ->clickAtXPath("//button[normalize-space()='Restore']")
                ->waitFor('[role="dialog"]', 5)
                ->assertSeeIn('[role="dialog"]', 'Restore deleted record?')
                ->assertSeeIn('[role="dialog"]', 'Browser delete customer')
                ->clickAtXPath("//div[@role='dialog']//button[normalize-space()='Restore']")
                ->waitUntilMissingText('Browser delete customer', 15);
        });

        $this->assertNotSoftDeleted('clients', ['id' => $this->client->id]);
    }
}
