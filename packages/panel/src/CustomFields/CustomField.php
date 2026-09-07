<?php

declare(strict_types=1);

namespace Alxtexh\Panel\CustomFields;

use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

/**
 * One field an installation has added to a resource - roadmap 5.1.
 *
 * NO TENANT COLUMN, deliberately - see the migration's own note. This is a
 * structural decision the installation makes once, read inside the CACHED
 * schema closure (`Resource::customFields()`), the same as any other part
 * of a resource's declared shape.
 *
 * @property int $id
 * @property string $resource
 * @property string $key
 * @property string $type
 * @property string $label
 * @property bool $required
 * @property array<string, string>|null $options
 * @property int $sort
 */
final class CustomField extends Model
{
    protected $table = 'panel_custom_fields';

    protected $guarded = [];

    protected $casts = [
        'required' => 'boolean',
        'options' => 'array',
        'sort' => 'integer',
    ];

    /** Memoized `Schema::hasTable` result - see `tableExists()`. */
    private static ?bool $tableExists = null;

    /** @var Collection<string, EloquentCollection<int, self>> Memoized definitions grouped by resource. */
    private static ?Collection $byResource = null;

    /**
     * Drops the process-level memos.
     *
     * Called by the Octane flush listener (`PanelManager::flushMemoization`)
     * and by the test suite's own `setUp`, both for the same reason: a
     * long-lived process may outlive the schema it memoized. A worker holds
     * these for one request; `RefreshDatabase` recreates the table between
     * tests in one process.
     */
    public static function flushMemoization(): void
    {
        self::$tableExists = null;
        self::$byResource = null;
    }

    /**
     * A saved or deleted definition must be visible to the NEXT read in the
     * same process, or an operator adds a field and the form it should appear
     * on does not have it until something restarts.
     */
    protected static function booted(): void
    {
        self::saved(static fn (): mixed => self::$byResource = null);
        self::deleted(static fn (): mixed => self::$byResource = null);
    }

    /**
     * Every field an installation has added to one resource, in display order.
     *
     * @return Collection<int, self>
     */
    public static function forResource(string $resource): Collection
    {
        return self::byResource()->get($resource) ?? new Collection;
    }

    /**
     * The whole table, grouped by resource, read at most once per process.
     *
     * ONE QUERY FOR EVERY RESOURCE, NOT ONE PER RESOURCE. `Resource::
     * definition()` calls `forResource()` on every list, form-options and
     * record-write request - not only on a schema-cache miss, because a
     * `Table`/`Form` carries closures and cannot itself be cached. Read
     * per-resource that was six queries in one list request, which is what
     * `ClientsPerformanceTest` caught. This table is operator-authored and
     * tiny (dozens of rows), so fetching all of it and grouping in PHP costs
     * one query and answers for every resource that asks afterwards.
     *
     * A PROCESS MEMO RATHER THAN THE CACHE, and that is not the lazy choice -
     * the cache was tried first and does nothing here. `stancl/tenancy`'s
     * `CacheTenancyBootstrapper` (registered in `config/tenancy.php`) swaps
     * the cache manager for the duration of a tenant request and restores it
     * afterwards, so an entry written inside one request is not there for the
     * next. Worse, it would be keyed per TENANT - and these definitions are
     * installation-wide, so every organisation would warm its own copy of the
     * same rows. A static is the honest shape for installation-wide data.
     *
     * @return Collection<string, EloquentCollection<int, self>>
     */
    private static function byResource(): Collection
    {
        if (self::$byResource instanceof Collection) {
            return self::$byResource;
        }

        if (! self::tableExists()) {
            return self::$byResource = new Collection;
        }

        $grouped = self::query()
            ->orderBy('sort')->orderBy('id')->get()
            ->groupBy('resource');

        return self::$byResource ??= new Collection($grouped->all());
    }

    /**
     * Whether the definitions table has been migrated yet.
     *
     * A FRESH INSTALL HAS NO TABLE, and reaching this before the migration is
     * ordinary rather than exceptional: `Resource::definition()` is called by
     * `panel:doctor`, by the route registration that runs at boot, and by
     * anything that builds a schema - all against a database this package's
     * own migration may not have been applied to. "No definitions" is the
     * honest answer, not an error.
     *
     * MEMOIZED, because `Schema::hasTable()` IS A QUERY - it asks
     * `sqlite_master`/`information_schema` every time - and it sits in front
     * of a memo whose whole purpose is to cost no queries at all. Left
     * un-memoized it undid that entirely: six of these in one list request,
     * one per resource whose definition was built.
     */
    private static function tableExists(): bool
    {
        return self::$tableExists ??= Schema::hasTable('panel_custom_fields');
    }
}
