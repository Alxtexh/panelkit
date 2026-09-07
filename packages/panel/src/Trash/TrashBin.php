<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Trash;

use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Support\PanelSettings;
use Alxtexh\Panel\Tables\Cursor;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;

/**
 * Everything this person has deleted, across every resource, in one place.
 *
 * IT EXISTS BECAUSE A DELETE HAD NOWHERE TO GO. Soft deletes, restore and
 * force-delete were all built and all reachable only by adding a `?trashed=`
 * option to one table's filter - so a deleted subscriber sat in the same list as
 * the live ones under a filter nobody opens, and the endpoint that could bring
 * it back had no button anywhere in the panel. The mechanism worked; there was
 * no way to use it.
 *
 * DELETED RECORDS LEAVE THE LIST ENTIRELY. That is the other half. A table that
 * can show deleted rows is a table where every count, every filter and every
 * export has to be read twice - "is this 43 live, or 43 including the ones
 * somebody removed?" - and the answer depends on a control most people never
 * touch. Gone means gone from the list, and here instead.
 *
 * EVERY QUERY GOES THROUGH THE MODEL, so the tenant scope applies exactly as it
 * does everywhere else. `onlyTrashed()` lifts the soft-delete scope and nothing
 * else: another organisation's deleted records are as unreachable as their live
 * ones, which matters more here than usual because a trash bin is where somebody
 * looks for something they cannot otherwise find.
 *
 * IT IS BOUNDED PER RESOURCE. A bin holding 200,000 rows is not a screen, and
 * loading it to render the first twenty is how a maintenance page becomes the
 * slowest one in the panel. The count is exact; the list is a page of it.
 */
final class TrashBin
{
    /** How many rows one page of one resource's bin holds. */
    public const PER_PAGE = 25;

    /**
     * The tabs: one per resource with something in it, and its exact count.
     *
     * COUNTS ONLY, NO RECORDS - roadmap 5.2. This used to return a page of
     * rows for EVERY resource, of which the screen showed one tab's worth, so
     * a nine-resource panel read and described 225 records to render 25. The
     * rows now come from `records()` for the resource actually on screen.
     *
     * @return list<array{key: string, label: string, icon: string, total: int}>
     */
    public function groups(?string $panelId = null): array
    {
        $groups = [];

        foreach ($this->resources($panelId) as $key => $class) {
            /*
             * THE PERMISSION GATE IS THE RESOURCE'S OWN. A trash bin that showed
             * records from a resource somebody cannot list would be a way to
             * read - names, ids, when they were removed - through the back door
             * of a maintenance screen.
             */
            if (! $class::can('viewAny')) {
                continue;
            }

            $deletedAt = $this->deletedColumn($class::model());

            $total = $class::model()::query()
                ->withoutGlobalScope(SoftDeletingScope::class)
                ->whereNotNull($deletedAt)
                ->count();

            if ($total === 0) {
                continue;
            }

            $groups[] = [
                'key' => $key,
                'label' => $class::pluralLabel(),
                'icon' => $class::icon(),
                'total' => $total,
            ];
        }

        return $groups;
    }

    /**
     * One page of one resource's bin, newest deletion first.
     *
     * KEYSET, NOT OFFSET - roadmap 5.2, and the same reason §10 gives for
     * every other list: `OFFSET 5000` makes the database walk five thousand
     * rows to skip them, so the last page of a bin costs more than the first.
     * Seeking on `(deleted_at, id)` costs the same at any depth. It also
     * cannot skip or repeat a row when something is restored between pages,
     * which OFFSET can - and on this screen restoring things IS what the
     * person is doing while they page.
     *
     * `id` IS THE TIEBREAKER because `deleted_at` is not unique: a bulk delete
     * stamps every row in the batch with the same timestamp, and forty rows
     * sharing one ordering value is precisely where a cursor without a
     * tiebreaker loops on the same page forever.
     *
     * @return array{
     *     records: list<array{id: int|string, title: string, deletedAt: string, purgesAt: string, canRestore: bool, canForceDelete: bool}>,
     *     nextCursor: string|null,
     * }
     */
    public function records(string $resource, ?string $cursor = null, ?string $panelId = null): array
    {
        $class = $this->resources($panelId)[$resource] ?? null;

        if ($class === null || ! $class::can('viewAny')) {
            return ['records' => [], 'nextCursor' => null];
        }

        $model = $class::model();
        $deletedAt = $this->deletedColumn($model);
        $key = (new $model)->getKeyName();

        $query = $model::query()
            ->withoutGlobalScope(SoftDeletingScope::class)
            ->whereNotNull($deletedAt)
            // Most recently deleted first: the thing somebody is looking for
            // is almost always the thing they just removed.
            ->orderByDesc($deletedAt)
            ->orderByDesc($key);

        $decoded = Cursor::decode($cursor);

        if ($decoded !== null) {
            $query->where(function (Builder $seek) use ($deletedAt, $key, $decoded): void {
                $seek->where($deletedAt, '<', $decoded->value())
                    ->orWhere(function (Builder $tie) use ($deletedAt, $key, $decoded): void {
                        $tie->where($deletedAt, '=', $decoded->value())
                            ->where($key, '<', $decoded->id);
                    });
            });
        }

        // One extra row, discarded: the only way to know a further page exists
        // without a second COUNT over the same predicate.
        $rows = $query->limit(self::PER_PAGE + 1)->get();

        $hasMore = $rows->count() > self::PER_PAGE;
        $page = $rows->take(self::PER_PAGE);
        $last = $page->last();

        return [
            'records' => array_values($page->map(
                fn (Model $record): array => $this->describe($class, $record)
            )->all()),
            'nextCursor' => $hasMore && $last !== null
                ? Cursor::encode((string) $last->{$deletedAt}, (int) $last->getKey())
                : null,
        ];
    }

    /**
     * The Trash entry for a panel's navigation, or null when it has no bin.
     *
     * THE PACKAGE ADVERTISES IT, not the application. The bin is a panel
     * feature: `make:panel` routes it, so a generated portal would otherwise
     * have a working Trash screen that nothing links to - the same
     * disappearing-page problem that put backups and the assistant behind
     * nothing at all. A portal gets the entry because it has the route, not
     * because somebody remembered to add it to a list.
     *
     * NULL WHERE NOTHING SOFT-DELETES, because a bin that can never contain
     * anything is a menu entry that teaches somebody the panel keeps deleted
     * records when it does not.
     *
     * @return array{title: string, href: string, icon: string, group: string|null}|null
     */
    public function navigationEntry(?string $panelId = null): ?array
    {
        $manager = app(PanelManager::class);
        $panel = $panelId === null ? $manager->currentPanel() : $manager->panel($panelId);

        if ($this->resources($panel?->id) === []) {
            return null;
        }

        $prefix = rtrim('/'.trim((string) ($panel?->getPath() ?? ''), '/'), '/');

        return [
            'title' => 'Trash',
            'href' => $prefix.'/trash',
            'icon' => 'trash',
            /*
             * NO GROUP, because it is no longer in the sidebar to be grouped.
             *
             * It used to sit under a heading called Platform, of which it was
             * the only member - so one entry produced a whole section, and a
             * column meant to list what the panel ADMINISTERS ended with a
             * heading about the panel itself. It is in the account menu now,
             * beside the backups and the logs, which are the other screens
             * about the installation rather than about the subject matter.
             *
             * The entry is still described HERE rather than by the application,
             * because whether a portal has a bin at all depends on which of its
             * resources soft-delete - a question the application should not have
             * to ask, per portal, to render a menu.
             */
            'group' => null,
        ];
    }

    /**
     * Resolve a resource model's soft-delete column for a companion write.
     *
     * Controllers must use the same model metadata as the bin reader. Keeping
     * this lookup here avoids assuming the conventional `deleted_at` name
     * when a consumer has customised the model's soft-delete column.
     *
     * @param class-string<Model> $model
     */
    public function deletedColumnFor(string $model): string
    {
        return $this->deletedColumn($model);
    }

    /**
     * Resources whose records can be in the bin at all.
     *
     * A RESOURCE WITHOUT SOFT DELETES IS NOT AN ERROR AND NOT SHOWN. Deleting
     * there is immediate and always was; listing an empty section for it would
     * suggest a recovery that does not exist.
     *
     * @return array<string, class-string<\Alxtexh\Panel\Resources\Resource>>
     */
    public function resources(?string $panelId = null): array
    {
        $manager = app(PanelManager::class);

        $panelId ??= $manager->currentPanel()?->id;

        $resources = $panelId === null ? $manager->resources() : $manager->resourcesFor($panelId);

        return array_filter(
            $resources,
            static function (string $class): bool {
                if (! $class::isEnabled() || ! $class::isAccessible()) {
                    return false;
                }

                return in_array(
                    SoftDeletes::class,
                    class_uses_recursive($class::model()),
                    true,
                );
            },
        );
    }

    /**
     * When a deleted record stops being recoverable.
     *
     * A REAL DATE RATHER THAN "SOON". The whole promise of a bin is that there
     * is time to change your mind, and a promise without a deadline is one
     * nobody can plan around - somebody has to be able to look at this and know
     * whether it will still be here on Monday.
     */
    public function purgesAt(Model $record): Carbon
    {
        $deleted = $record->{$record->getDeletedAtColumn()};

        return Carbon::parse($deleted)->addDays(self::retentionDays());
    }

    /** The shortest and longest a bin may keep something. */
    public const MINIMUM_DAYS = 7;

    public const MAXIMUM_DAYS = 30;

    /**
     * How long a deleted record is kept.
     *
     * THE SETTING WINS OVER CONFIG, because this is an operational decision
     * rather than a deployment one: whoever runs the panel knows how long their
     * people take to notice a mistake, and that answer should not need a deploy.
     * Config remains the default for an installation that never opens the
     * screen.
     *
     * CLAMPED BETWEEN SEVEN AND THIRTY DAYS, and both ends are deliberate.
     * Below a week, "I deleted it on Friday" is already unrecoverable on Monday
     * - which is the exact case a bin exists for. Above a month it stops being a
     * bin and becomes a second copy of the database that nobody is looking
     * after, holding personal data long after anybody meant to keep it.
     *
     * THE CLAMP IS HERE, NOT ONLY IN THE FORM. A value that arrives from a
     * hand-edited request, an older release or a config file still lands inside
     * the range, because this is the one function both the screen and the pruner
     * read.
     */
    public static function retentionDays(): int
    {
        $configured = app(PanelSettings::class)->get(
            'trash.retention_days',
            config('panel.trash.retention_days', self::MINIMUM_DAYS),
        );

        return max(self::MINIMUM_DAYS, min(self::MAXIMUM_DAYS, (int) $configured));
    }

    /**
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @return array{id: int|string, title: string, deletedAt: string, purgesAt: string, canRestore: bool, canForceDelete: bool}
     */
    private function describe(string $class, Model $record): array
    {
        return [
            'id' => $record->getKey(),
            'title' => $this->titleFor($class, $record),
            'deletedAt' => (string) $record->{$record->getDeletedAtColumn()},
            'purgesAt' => $this->purgesAt($record)->toIso8601String(),
            /*
             * ASKED PER RECORD, not per resource. A policy may allow restoring
             * one's own records and not somebody else's, and a button that is
             * rendered and then refused is worse than one that was never there.
             */
            'canRestore' => $class::can('restore', $record),
            'canForceDelete' => $class::can('forceDelete', $record),
        ];
    }

    /**
     * Something to call the record.
     *
     * THE FIRST COLUMN OF ITS OWN TABLE, because that is what the resource
     * already decided identifies a row - it is the column somebody reads down
     * when scanning the list. Falling back to the key means a record with an
     * empty first column is still actionable rather than a blank line.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     */
    private function titleFor(string $class, Model $record): string
    {
        foreach ($class::definition()->getColumns() as $column) {
            $value = $record->getAttribute($column->key);

            if (is_scalar($value) && (string) $value !== '') {
                return (string) $value;
            }
        }

        return '#'.$record->getKey();
    }

    /** @param  class-string<Model>  $model */
    private function deletedColumn(string $model): string
    {
        return (new $model)->getDeletedAtColumn();
    }
}
