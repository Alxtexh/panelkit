<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Unit;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Alxtexh\Panel\Jobs\ExportRecords;
use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\TestCase;

/**
 * "1 rows exported" - the finished-export notification never agreed with
 * itself on the one count where the grammar is checkable at a glance.
 */
final class ExportRecordsNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        if (! class_exists(ExportRecords::class)) {
            $this->markTestSkipped('Export notification tests require panel-operations.');
        }
    }

    public function test_a_single_row_export_says_row_not_rows(): void
    {
        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);

        $user = User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]);

        Article::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Only one',
            'status' => 'draft',
        ]);

        (new ExportRecords('articles', [], null, $user->id, 'test-token'))->handle();

        $notification = $user->notifications()->first();

        $this->assertNotNull($notification, 'ExportRecords did not notify the actor.');
        $this->assertSame('1 row exported from articles.', $notification->data['body']);
    }
}
