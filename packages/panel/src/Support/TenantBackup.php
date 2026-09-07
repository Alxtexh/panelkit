<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;
use ZipArchive;

/**
 * A snapshot of one organisation, not the whole installation.
 *
 * SPATIE'S `backup:run` DUMPS EVERY CONNECTION IT IS TOLD ABOUT. That is the
 * right nightly job. A SaaS operator who needs Nairobi Fibre's database, and
 * only that database, cannot use it without taking everyone else's data with
 * it. This writes a zip of that tenant's rows (column-scoped) or of the
 * tenant connection (dedicated database) onto the same disk the list already
 * reads.
 *
 * READ, THEN ZIP. Nothing here restores; putting a tenant dump back is a
 * different, destructive job.
 */
final class TenantBackup
{
    /**
     * @return array{path: string, bytes: int}
     */
    public function write(Model $tenant): array
    {
        $archive = new BackupArchive;
        $slug = Str::slug((string) ($tenant->slug ?? $tenant->getKey()));
        $filename = 'tenant-'.$slug.'-'.now()->format('Y-m-d-His').'.zip';
        $relative = trim($archive->directory().'/'.$filename, '/');

        $tmp = tempnam(sys_get_temp_dir(), 'panel-tenant-backup-');

        if ($tmp === false) {
            throw new \RuntimeException('Could not create a temporary backup file.');
        }

        $zip = new ZipArchive;

        if ($zip->open($tmp, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException('Could not open a zip for the tenant backup.');
        }

        $payload = $this->dump($tenant);

        $zip->addFromString('manifest.json', json_encode([
            'kind' => 'panel-tenant-backup',
            'tenant' => Tenants::toArray($tenant),
            'at' => now()->toIso8601String(),
            'tables' => array_map(
                static fn (array $table): array => [
                    'name' => $table['name'],
                    'rows' => count($table['rows']),
                ],
                $payload['tables'],
            ),
            'connection' => $payload['connection'],
            'scope' => $payload['scope'],
        ], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));

        foreach ($payload['tables'] as $table) {
            $zip->addFromString(
                'tables/'.$table['name'].'.json',
                json_encode($table['rows'], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR),
            );
        }

        $zip->close();

        $contents = file_get_contents($tmp);
        @unlink($tmp);

        if ($contents === false) {
            throw new \RuntimeException('The tenant backup zip could not be read.');
        }

        Storage::disk($archive->diskName())->put($relative, $contents);

        return [
            'path' => $relative,
            'bytes' => strlen($contents),
        ];
    }

    /**
     * @return array{
     *     connection: string,
     *     scope: string,
     *     tables: list<array{name: string, rows: list<array<string, mixed>>}>
     * }
     */
    private function dump(Model $tenant): array
    {
        if (method_exists($tenant, 'hasOwnDatabase') && $tenant->hasOwnDatabase() && method_exists($tenant, 'run')) {
            return $tenant->run(function () : array {
                $name = (string) config('database.default');

                return [
                    'connection' => $name,
                    'scope' => 'database',
                    'tables' => $this->dumpConnection($name, tenantId: null),
                ];
            });
        }

        $name = (string) config('database.default');
        $column = Tenants::column();

        return [
            'connection' => $name,
            'scope' => 'column:'.$column,
            'tables' => $this->dumpConnection($name, $tenant->getKey(), $column),
        ];
    }

    /**
     * @return list<array{name: string, rows: list<array<string, mixed>>}>
     */
    private function dumpConnection(string $connection, mixed $tenantId, ?string $column = null): array
    {
        $out = [];

        foreach (Schema::connection($connection)->getTableListing() as $table) {
            if ($table === '') {
                continue;
            }

            try {
                $query = DB::connection($connection)->table($table);

                if ($tenantId !== null && $column !== null && Schema::connection($connection)->hasColumn($table, $column)) {
                    $query->where($column, $tenantId);
                } elseif ($tenantId !== null && $column !== null) {
                    continue;
                }

                $rows = [];
                foreach ($query->limit(50_000)->get() as $row) {
                    $rows[] = (array) $row;
                }
            } catch (Throwable) {
                continue;
            }

            $out[] = [
                'name' => $table,
                'rows' => $rows,
            ];
        }

        return $out;
    }
}
