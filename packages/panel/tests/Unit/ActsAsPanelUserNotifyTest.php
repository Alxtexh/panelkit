<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Alxtexh\Panel\Jobs\ActsAsPanelUser;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;

/**
 * `notifyActor()` used to import `App\Notifications\JobFinished` - a class
 * that only ever existed in `apps/playground`. Every OTHER consumer of this
 * trait (every queued export, import, bulk action) hit "Class
 * App\Notifications\JobFinished not found" the first time a background job
 * finished - caught, logged as a warning, and never surfaced, so a queued
 * job silently never notified anyone on any real install.
 *
 * `playground`'s own NotificationTest covers `JobFinished` the class, by
 * constructing it directly - never through this trait's real code path -
 * which is exactly why a broken import here went unnoticed by a passing
 * suite. This exercises the trait itself, against the bare fixture User,
 * with no app-specific class in reach.
 */
final class ActsAsPanelUserNotifyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! trait_exists(ActsAsPanelUser::class)) {
            $this->markTestSkipped('Queued notification tests require panel-operations.');
        }
    }

    public function test_notify_actor_writes_a_database_notification(): void
    {
        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);

        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        $job = new class {
            use ActsAsPanelUser;

            public function notifyAs(User $user, string $title, string $body): void
            {
                $this->actor = $user;
                $this->notifyActor($title, $body, '/somewhere', 'success');
            }
        };

        $job->notifyAs($user, 'Your export is ready', '5 rows exported.');

        $this->assertSame(1, $user->notifications()->count());

        $notification = $user->notifications()->first();

        $this->assertSame(
            \Alxtexh\Panel\Notifications\JobFinished::class,
            $notification->type,
        );
        $this->assertSame('Your export is ready', $notification->data['title']);
        $this->assertSame('5 rows exported.', $notification->data['body']);
        $this->assertSame('/somewhere', $notification->data['href']);
        $this->assertSame('success', $notification->data['severity']);
    }
}
