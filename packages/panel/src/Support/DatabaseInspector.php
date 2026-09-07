<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Throwable;

/**
 * Read-only look at configured SQL connections: tables, row counts, storage.
 *
 * NOT AN EDITOR. No UPDATE, no DROP, no cell preview that would tempt one.
 * Operators open this to see which table is growing, not to change a row.
 *
 * CONNECTIONS THAT ARE NOT THERE ARE SKIPPED. `config/database.php` ships
 * mysql, pgsql and sqlsrv stubs; probing each would hang the backups page
 * on a machine that only has sqlite. The default connection, sqlite files
 * that exist, and Spatie's backup source list are the ones worth opening.
 */
final class DatabaseInspector
{
    /** @var list<string> */
    private const SQL_DRIVERS = ['sqlite', 'mysql', 'mariadb', 'pgsql', 'sqlsrv'];

    /**
     * @return list<array{
     *     name: string,
     *     driver: string,
     *     database: string|null,
     *     available: bool,
     *     error: string|null,
     *     tableCount: int,
     *     rowCount: int,
     *     bytes: int|null,
     *     tables: list<array{name: string, rows: int, bytes: int|null}>
     * }>
     */
    public function connections(): array
    {
        $out = [];

        foreach ($this->candidateNames() as $name) {
            $out[] = $this->inspect($name);
        }

        return $out;
    }

    /**
     * @return list<string>
     */
    private function candidateNames(): array
    {
        $configured = array_keys((array) config('database.connections', []));
        $default = (string) config('database.default');
        $sources = array_map('strval', (array) config('backup.backup.source.databases', []));

        $names = [];

        foreach ($configured as $name) {
            $name = (string) $name;
            $driver = (string) config("database.connections.{$name}.driver");

            if (! in_array($driver, self::SQL_DRIVERS, true)) {
                continue;
            }

            if ($name === $default || in_array($name, $sources, true) || $this->sqliteFileExists($name, $driver)) {
                $names[] = $name;
            }
        }

        return array_values(array_unique($names));
    }

    private function sqliteFileExists(string $name, string $driver): bool
    {
        if ($driver !== 'sqlite') {
            return false;
        }

        $path = config("database.connections.{$name}.database");

        return is_string($path) && $path !== '' && $path !== ':memory:' && is_file($path);
    }

    /**
     * @return array{
     *     name: string,
     *     driver: string,
     *     database: string|null,
     *     available: bool,
     *     error: string|null,
     *     tableCount: int,
     *     rowCount: int,
     *     bytes: int|null,
     *     tables: list<array{name: string, rows: int, bytes: int|null}>
     * }
     */
    private function inspect(string $name): array
    {
        $driver = (string) config("database.connections.{$name}.driver");
        $database = config("database.connections.{$name}.database");
        $databaseLabel = is_scalar($database) ? (string) $database : null;

        try {
            $connection = DB::connection($name);
            $connection->select('select 1');
        } catch (Throwable $e) {
            return [
                'name' => $name,
                'driver' => $driver,
                'database' => $databaseLabel,
                'available' => false,
                'error' => $e->getMessage(),
                'tableCount' => 0,
                'rowCount' => 0,
                'bytes' => null,
                'tables' => [],
            ];
        }

        $tables = [];
        $totalRows = 0;
        $totalBytes = 0;
        $sawBytes = false;

        foreach ($this->tableNames($name) as $table) {
            $rows = $this->rowCount($name, $table);
            $bytes = $this->tableBytes($name, $driver, $table);
            $totalRows += $rows;

            if ($bytes !== null) {
                $totalBytes += $bytes;
                $sawBytes = true;
            }

            $tables[] = [
                'name' => $table,
                'rows' => $rows,
                'bytes' => $bytes,
            ];
        }

        usort($tables, static fn (array $a, array $b): int => $b['rows'] <=> $a['rows']);

        return [
            'name' => $name,
            'driver' => $driver,
            'database' => $databaseLabel,
            'available' => true,
            'error' => null,
            'tableCount' => count($tables),
            'rowCount' => $totalRows,
            'bytes' => $sawBytes ? $totalBytes : $this->databaseBytes($name, $driver),
            'tables' => $tables,
        ];
    }

    /**
     * @return list<string>
     */
    private function tableNames(string $connection): array
    {
        try {
            return array_values(array_filter(
                Schema::connection($connection)->getTableListing(),
                static fn (string $table): bool => $table !== '',
            ));
        } catch (Throwable) {
            return [];
        }
    }

    private function rowCount(string $connection, string $table): int
    {
        try {
            return (int) DB::connection($connection)->table($table)->count();
        } catch (Throwable) {
            return 0;
        }
    }

    private function tableBytes(string $connection, string $driver, string $table): ?int
    {
        try {
            return match ($driver) {
                'mysql', 'mariadb' => (int) (DB::connection($connection)->selectOne(
                    'select data_length + index_length as size from information_schema.tables where table_schema = database() and table_name = ?',
                    [$table],
                )->size ?? 0) ?: 0,
                'pgsql' => (int) (DB::connection($connection)->selectOne(
                    'select pg_total_relation_size(?::regclass) as size',
                    [$table],
                )->size ?? 0) ?: 0,
                default => null,
            };
        } catch (Throwable) {
            return null;
        }
    }

    private function databaseBytes(string $connection, string $driver): ?int
    {
        try {
            return match ($driver) {
                'sqlite' => $this->sqliteBytes($connection),
                'mysql', 'mariadb' => (int) (DB::connection($connection)->selectOne(
                    'select sum(data_length + index_length) as size from information_schema.tables where table_schema = database()'
                )->size ?? 0) ?: null,
                'pgsql' => (int) (DB::connection($connection)->selectOne(
                    'select pg_database_size(current_database()) as size'
                )->size ?? 0) ?: null,
                default => null,
            };
        } catch (Throwable) {
            return null;
        }
    }

    private function sqliteBytes(string $connection): ?int
    {
        $path = DB::connection($connection)->getDatabaseName();

        if (! is_file($path)) {
            return null;
        }

        $size = @filesize($path);

        return $size === false ? null : $size;
    }
}
