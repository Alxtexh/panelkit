<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Support\Facades\Storage;
use Spatie\Backup\BackupDestination\BackupDestination;

/**
 * What the backups look like right now.
 *
 * READ-ONLY, AND DELIBERATELY SO. Nothing in this class deletes, runs or
 * restores anything - those live in `BackupArchive`, `RunBackupNow` and
 * `RestoreBackup`, each with its own guards. The split is not tidiness: this is
 * the class rendered on a page anybody with `view_operations` can open, and
 * keeping it incapable of destroying a file means changes to how the status is
 * displayed can never quietly become changes to what the screen can destroy.
 *
 * IT DEGRADES RATHER THAN DEPENDS. `spatie/laravel-backup` is not a requirement
 * of the panel - an installation may back up with something else entirely, or
 * nothing - so an absent package reports "not configured" instead of fataling on
 * a page that is otherwise fine.
 *
 * THE HEALTH QUESTION IS "HOW OLD", not "does a file exist". A backup directory
 * full of snapshots from March looks identical to a healthy one until somebody
 * reads the dates, which is exactly when it is too late. So age is computed and
 * compared against a threshold, and a stale set is reported as a PROBLEM rather
 * than shown as a list for the reader to work out.
 */
final class BackupStatus
{
    public function __construct(
        /** Backups older than this are reported as stale. */
        private readonly int $staleAfterHours = 26,
    ) {}

    /**
     * @return array{
     *     configured: bool,
     *     disk: string|null,
     *     healthy: bool|null,
     *     newestAt: string|null,
     *     ageHours: float|null,
     *     totalBytes: int,
     *     backups: list<array{path: string, bytes: int, at: string}>,
     *     problem: string|null,
     * }
     */
    public function summary(): array
    {
        $empty = [
            'configured' => false,
            'disk' => null,
            'healthy' => null,
            'newestAt' => null,
            'ageHours' => null,
            'totalBytes' => 0,
            'backups' => [],
            'problem' => null,
        ];

        if (! class_exists(BackupDestination::class)) {
            return [...$empty, 'problem' => 'spatie/laravel-backup is not installed.'];
        }

        $disk = (string) (config('backup.backup.destination.disks')[0] ?? '');
        $name = (string) config('backup.backup.name', config('app.name'));

        if ($disk === '') {
            return [...$empty, 'problem' => 'No backup destination disk is configured.'];
        }

        try {
            $files = collect(Storage::disk($disk)->files($name))
                ->filter(fn (string $path): bool => str_ends_with($path, '.zip'))
                ->map(fn (string $path): array => [
                    'path' => $path,
                    'bytes' => Storage::disk($disk)->size($path),
                    'at' => date(DATE_ATOM, Storage::disk($disk)->lastModified($path)),
                ])
                // Newest first: the only one anybody looks at first is the last.
                ->sortByDesc('at')
                ->values();
        } catch (\Throwable $e) {
            report($e);

            return [...$empty, 'disk' => $disk, 'problem' => 'The backup disk could not be read.'];
        }

        if ($files->isEmpty()) {
            return [
                ...$empty,
                'configured' => true,
                'disk' => $disk,
                'healthy' => false,
                'problem' => 'No snapshots yet.',
            ];
        }

        $newest = $files->first();
        $backups = [];

        foreach ($files->take(20) as $file) {
            $backups[] = $file;
        }

        $ageHours = round((time() - strtotime($newest['at'])) / 3600, 1);
        $stale = $ageHours > $this->staleAfterHours;

        return [
            'configured' => true,
            'disk' => $disk,
            'healthy' => ! $stale,
            'newestAt' => $newest['at'],
            'ageHours' => $ageHours,
            'totalBytes' => (int) $files->sum('bytes'),
            'backups' => $backups,
            'problem' => $stale
                ? "The newest backup is {$ageHours} hours old; the scheduler may not be running."
                : null,
        ];
    }
}
