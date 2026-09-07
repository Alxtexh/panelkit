<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;

/**
 * The snapshots themselves: naming one safely, and removing one.
 *
 * SEPARATE FROM `BackupStatus` BECAUSE THIS HALF CAN DESTROY THINGS. Status
 * answers "is the backup healthy", is read-only, and is rendered on a page
 * anybody with `view_operations` can open. This one deletes files. Keeping them
 * in one class meant every change to the display logic sat next to the code that
 * removes the last copy of a database, and reviewers stop looking after a while.
 *
 * THE PATH FROM THE BROWSER IS NEVER A PATH. It is a name that is looked up in
 * the list of real snapshots and either matches one exactly or is refused. This
 * is the same guard as `LogReader::tail`, for the same reason: the obvious
 * version of "delete the file the user picked" concatenates a string into a disk
 * root and will happily accept `../../.env`. Validating the STRING - rejecting
 * `..`, forcing a prefix - is the version that keeps almost working; matching
 * against the enumerated set is the version that cannot be talked around.
 *
 * IT WILL NOT LEAVE ZERO SNAPSHOTS. Deleting the last backup is a request that
 * is always a mistake and never recoverable, and the moment it is made is
 * exactly when nobody is thinking clearly. Spatie's own cleanup strategy holds
 * the same line for the same reason.
 */
final class BackupArchive
{
    public function __construct(
        private readonly ?string $disk = null,
    ) {}

    public function diskName(): string
    {
        return $this->disk ?? (string) (config('backup.backup.destination.disks')[0] ?? 'local');
    }

    private function filesystem(): Filesystem
    {
        return Storage::disk($this->diskName());
    }

    /** The directory Spatie writes into: the backup name, not a path we choose. */
    public function directory(): string
    {
        return (string) config('backup.backup.name', config('app.name', 'laravel-backup'));
    }

    /**
     * Every snapshot on this disk, newest first.
     *
     * @return list<array{path: string, bytes: int, at: string}>
     */
    public function all(): array
    {
        $disk = $this->filesystem();

        $rows = collect($disk->files($this->directory()))
            ->filter(fn (string $path): bool => str_ends_with($path, '.zip'))
            ->map(fn (string $path): array => [
                'path' => $path,
                'bytes' => $disk->size($path),
                'at' => date(DATE_ATOM, $disk->lastModified($path)),
            ])
            ->sortByDesc('at')
            ->values()
            ->all();

        $backups = [];
        foreach ($rows as $row) {
            $backups[] = $row;
        }

        return $backups;
    }

    /** @return list<string> */
    public function paths(): array
    {
        return array_column($this->all(), 'path');
    }

    /**
     * The requested path, or null if it is not a snapshot on this disk.
     *
     * NULL RATHER THAN AN EXCEPTION, so the caller decides between a 404 and a
     * 422 - and so that a bulk request can report which of several names it did
     * not recognise instead of failing on the first.
     */
    public function resolve(string $requested): ?string
    {
        return in_array($requested, $this->paths(), true) ? $requested : null;
    }

    public function exists(string $requested): bool
    {
        return $this->resolve($requested) !== null;
    }

    /**
     * Remove snapshots, refusing to empty the directory.
     *
     * @param  list<string>  $requested
     * @return array{deleted: list<string>, refused: list<string>, reason: string|null}
     */
    public function delete(array $requested): array
    {
        $existing = $this->paths();

        $valid = array_values(array_filter(
            array_unique($requested),
            static fn (string $path): bool => in_array($path, $existing, true),
        ));

        $refused = array_values(array_diff(array_unique($requested), $valid));

        if ($valid === []) {
            return ['deleted' => [], 'refused' => $refused, 'reason' => 'No matching snapshot.'];
        }

        /*
         * THE CHECK IS ON WHAT WOULD REMAIN, not on how many were asked for.
         * Counting the request would let two overlapping bulk deletes each pass
         * and jointly empty the disk; and selecting every row on the page is
         * one click, which is how this happens in practice rather than in
         * theory.
         */
        if (count($valid) >= count($existing)) {
            return [
                'deleted' => [],
                'refused' => $valid,
                'reason' => 'That would delete every snapshot. At least one must remain.',
            ];
        }

        $disk = $this->filesystem();
        $deleted = [];

        foreach ($valid as $path) {
            if ($disk->delete($path)) {
                $deleted[] = $path;
            } else {
                $refused[] = $path;
            }
        }

        return [
            'deleted' => $deleted,
            'refused' => array_values(array_unique($refused)),
            'reason' => $refused === [] ? null : 'Some snapshots could not be removed.',
        ];
    }
}
