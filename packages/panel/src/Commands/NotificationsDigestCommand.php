<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Commands;

use Alxtexh\Panel\Notifications\BellText;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

final class NotificationsDigestCommand extends Command
{
    protected $signature = 'panel:notifications-digest {--frequency=daily : daily or weekly}';

    protected $description = 'Send grouped notification digests for users that enabled digest delivery';

    public function handle(): int
    {
        if (! Schema::hasTable('panel_notification_preferences')) {
            $this->info('No panel_notification_preferences table exists.');

            return self::SUCCESS;
        }

        $frequency = (string) ($this->option('frequency') ?? 'daily');

        $allowed = ['general', 'exports', 'actions'];
        $categories = (array) config('panel.notifications.categories', $allowed);

        $userIds = DB::table('panel_notification_preferences')
            ->where('digest_enabled', true)
            ->distinct()
            ->pluck('user_id')
            ->all();

        $usersModel = (string) config('auth.providers.users.model', 'App\\Models\\User');

        if (! class_exists($usersModel) || $userIds === []) {
            $this->info('No users with digest enabled.');

            return self::SUCCESS;
        }

        $type = BellText::class;
        $table = (string) config('database.notifications', 'notifications');

        foreach ($userIds as $userId) {
            $user = $usersModel::query()->find($userId);

            if (! $user) {
                continue;
            }

            $unread = DB::table($table)
                ->where('notifiable_type', $user->getMorphClass())
                ->where('notifiable_id', $user->getKey())
                ->where('type', $type)
                ->whereNull('read_at')
                ->limit(200)
                ->get();

            if ($unread->isEmpty()) {
                continue;
            }

            $grouped = [];

            foreach ($unread as $row) {
                $data = is_array($row->data) ? $row->data : (json_decode((string) $row->data, true) ?: []);
                $category = (string) ($data['category'] ?? 'general');

                if (str_starts_with($category, 'digest:')) {
                    continue;
                }

                if (! in_array($category, $categories, true)) {
                    continue;
                }

                $grouped[$category][] = $row;
            }

            foreach ($grouped as $category => $rows) {
                $count = count($rows);

                $firstTitles = array_slice(
                    array_map(static fn (object $r): string => (string) ((is_array($r->data) ? ($r->data)['title'] : (json_decode((string) $r->data, true) ?: []))['title'] ?? 'Notification'), $rows),
                    0,
                    3,
                );

                $body = 'You have '.$count.' new notifications in '.$category.'.';

                $body .= ' Latest: '.implode(', ', $firstTitles).'.';

                $user->notify(new BellText(
                    'Notification digest',
                    $body,
                    null,
                    'info',
                    [],
                    'digest:'.$category,
                ));

                $ids = array_map(static fn (object $r): mixed => $r->id, $rows);

                DB::table($table)->whereIn('id', $ids)->update(['read_at' => now()]);
            }
        }

        $this->info('Notification digests queued.');

        return self::SUCCESS;
    }
}
