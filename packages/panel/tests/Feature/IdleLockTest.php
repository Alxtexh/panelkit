<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Http\Middleware\EnforcePanelIdleLock;
use Alxtexh\Panel\Http\Middleware\EnsurePanelIsUnlocked;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\PanelIdleActivity;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Native idle lock, including the three traps an app-level copy hit.
 *
 * A: a lock flag with no user must not trap on the lock screen. Login 200s
 *    and the flag is cleared.
 * B: Inertia partial polls must get a quiet 423, not 409 Location.
 * C: unlock must reset the idle timestamp or the next request re-locks.
 */
final class IdleLockTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);

        $this->user = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'correct-horse',
            'email_verified_at' => now(),
        ]);
    }

    public function test_idle_lock_is_appended_idle_then_unlock(): void
    {
        $stack = app(PanelManager::class)->panel('second')->getMiddleware();

        $idle = array_search(EnforcePanelIdleLock::class, $stack, true);
        $unlock = array_search(EnsurePanelIsUnlocked::class, $stack, true);

        $this->assertNotFalse($idle);
        $this->assertNotFalse($unlock);
        $this->assertLessThan($unlock, $idle);
    }

    public function test_a_panel_that_opts_out_does_not_share_idle_lock(): void
    {
        $props = $this->actingAs($this->user)
            ->get('/posts')
            ->assertOk()
            ->viewData('page')['props'];

        $this->assertNull($props['panelIdleLock'] ?? null);
        $this->assertFalse(in_array(
            EnforcePanelIdleLock::class,
            app(PanelManager::class)->panel('admin')->getMiddleware(),
            true,
        ));
    }

    public function test_login_enables_idle_lock_without_calling_idle_lock(): void
    {
        $props = $this->actingAs($this->user)
            ->get('/second/reports')
            ->assertOk()
            ->viewData('page')['props'];

        $this->assertSame(15, $props['panelIdleLock']['idleMinutes']);
        $this->assertSame(60, $props['panelIdleLock']['warningSeconds']);
        $this->assertSame(url('/second/lock'), $props['panelIdleLock']['lockUrl']);
        /*
         * A DIFFERENT ROUTE FROM `lockUrl`, ON PURPOSE. `lockUrl` is POST-only
         * (`lockNow()` submits there); a client-side hard navigation needs a
         * GET-navigable target, which is this one - the password prompt itself.
         */
        $this->assertSame(
            url('/second/screens/locked'),
            $props['panelIdleLock']['screenUrl'],
        );
        $this->assertTrue(in_array(
            EnforcePanelIdleLock::class,
            app(PanelManager::class)->panel('second')->getMiddleware(),
            true,
        ));
    }

    public function test_the_lock_screen_offers_no_passkey_when_the_user_has_none(): void
    {
        $props = $this->actingAs($this->user)
            ->withSession([PanelIdleActivity::LOCKED_AT => time()])
            ->get('/second/screens/locked')
            ->assertOk()
            ->viewData('page')['props'];

        $this->assertNull($props['passkeys'] ?? null);
    }

    public function test_the_lock_screen_is_ok_when_the_passkeys_table_is_missing(): void
    {
        \Illuminate\Support\Facades\Schema::dropIfExists('passkeys');

        $this->assertFalse(\Alxtexh\Panel\Auth\Passkeys::tableExists());

        $this->actingAs($this->user)
            ->withSession([PanelIdleActivity::LOCKED_AT => time()])
            ->get('/second/screens/locked')
            ->assertOk();
    }

    public function test_the_lock_screen_redirects_home_when_not_locked(): void
    {
        $this->actingAs($this->user)
            ->get('/second/screens/locked')
            ->assertRedirect('/second');
    }

    /**
     * After auth, url.intended must not send the user back to the lock screen.
     */
    public function test_login_does_not_redirect_to_the_lock_screen_from_url_intended(): void
    {
        $this->withSession([
            'url.intended' => url('/second/screens/locked'),
            PanelIdleActivity::LOCKED_AT => time(),
        ])
            ->post('/second/login', [
                'email' => $this->user->email,
                'password' => 'correct-horse',
            ])
            ->assertRedirect('/second')
            ->assertSessionMissing('url.intended');

        $this->assertFalse(session()->has(PanelIdleActivity::LOCKED_AT));
        $this->get('/second/screens/locked')->assertRedirect('/second');
    }

    public function test_logout_clears_the_lock_flag(): void
    {
        $this->actingAs($this->user)
            ->withSession([PanelIdleActivity::LOCKED_AT => time()])
            ->post('/second/logout')
            ->assertRedirect();

        $this->assertFalse(session()->has(PanelIdleActivity::LOCKED_AT));
    }

    public function test_locking_redirects_to_the_lock_screen(): void
    {
        $this->actingAs($this->user)
            ->post('/second/lock')
            ->assertRedirect('/second/screens/locked');

        $this->actingAs($this->user)
            ->get('/second/reports')
            ->assertRedirect('/second/screens/locked');
    }

    /**
     * Bug A: lock flag, no authenticated user, GET login is 200 and the flag
     * is gone. Redirecting to the lock screen here traps forever: unlock has
     * no user to check a password against.
     */
    public function test_a_locked_session_with_no_user_does_not_trap_on_login(): void
    {
        $this->withSession([
            PanelIdleActivity::LOCKED_AT => time(),
        ])
            ->get('/second/login')
            ->assertOk();

        $this->assertFalse(session()->has(PanelIdleActivity::LOCKED_AT));
    }

    /**
     * Bug B: a background Inertia poll must not receive 409 Location.
     */
    public function test_a_background_inertia_poll_gets_423_not_409_location(): void
    {
        $this->actingAs($this->user)->post('/second/lock');

        $this->actingAs($this->user)
            ->withHeaders([
                'X-Inertia' => 'true',
                'X-Inertia-Partial-Data' => 'panelNav',
                'Accept' => 'text/html, application/xhtml+xml',
            ])
            ->get('/second/reports')
            ->assertStatus(423)
            ->assertHeaderMissing('X-Inertia-Location');
    }

    public function test_a_full_inertia_visit_may_409_to_the_lock_screen(): void
    {
        $this->actingAs($this->user)->post('/second/lock');

        $this->actingAs($this->user)
            ->withHeaders([
                'X-Inertia' => 'true',
                'Accept' => 'text/html, application/xhtml+xml',
            ])
            ->get('/second/reports')
            ->assertStatus(409)
            ->assertHeader('X-Inertia-Location');
    }

    /**
     * Bug C: unlock touches the idle clock so the next request does not
     * immediately lock again from the stale timestamp.
     */
    public function test_unlock_resets_idle_so_the_next_request_does_not_re_lock(): void
    {
        $this->actingAs($this->user)
            ->withSession([
                PanelIdleActivity::ACTIVITY_AT => now()->subMinutes(30)->getTimestamp(),
                PanelIdleActivity::LOCKED_AT => time(),
            ])
            ->post('/second/unlock', ['password' => 'correct-horse'])
            ->assertRedirect();

        $this->assertFalse(session()->has(PanelIdleActivity::LOCKED_AT));

        $this->actingAs($this->user)
            ->get('/second/reports')
            ->assertOk();

        $this->assertFalse(session()->has(PanelIdleActivity::LOCKED_AT));
    }

    public function test_the_wrong_password_does_not_unlock(): void
    {
        $this->actingAs($this->user)->post('/second/lock');

        $this->actingAs($this->user)
            ->post('/second/unlock', ['password' => 'not-the-password'])
            ->assertSessionHasErrors('password');

        $this->actingAs($this->user)
            ->get('/second/reports')
            ->assertRedirect('/second/screens/locked');
    }

    public function test_a_stale_idle_timestamp_locks_on_the_next_page(): void
    {
        $this->actingAs($this->user)
            ->withSession([
                PanelIdleActivity::ACTIVITY_AT => now()->subMinutes(30)->getTimestamp(),
            ])
            ->get('/second/reports')
            ->assertRedirect('/second/screens/locked');

        $this->assertTrue(session()->has(PanelIdleActivity::LOCKED_AT));
    }
}
