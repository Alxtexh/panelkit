<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Support\Collection;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Support\Ability;

/**
 * The sidebar, built from the registry.
 *
 * PROMOTED FROM THE REFERENCE APP'S `HandleInertiaRequests`, where it had been
 * a hundred-line closure - which meant every consuming application rebuilt it,
 * and rebuilt the parts that are easy to get wrong: the panel PREFIX, the
 * cluster collapse, and the ability filter.
 *
 * THE PREFIX IS THE ONE THAT BITES. The operator portal usually sits at the
 * root, so a bare `/clients` link works and nothing looks wrong; a generated
 * portal is mounted under its own path, where the same link points at a route
 * that does not exist. Worse in the other direction: without filtering by the
 * CURRENT panel, a reseller's screens appear in the operator's sidebar, linking
 * to paths this portal does not route. Nothing fails - the menu simply starts
 * advertising other people's screens.
 *
 * ABILITIES ARE APPLIED HERE, not in the component. A menu filtered in Vue is a
 * menu whose hidden entries were still sent, which tells anybody reading the
 * payload exactly which screens exist and relies on CSS to keep the rest.
 */
final class PanelNavigation
{
    /**
     * @return list<array<string, mixed>>
     */
    public static function build(?string $panelId = null): array
    {
        $panels = app(PanelManager::class);

        $panelId ??= $panels->currentPanel()?->id ?? (string) config('panel.default', 'admin');

        $prefix = rtrim('/'.trim((string) $panels->panel($panelId)?->getPath(), '/'), '/');

        $visible = collect($panels->resourcesFor($panelId))
            ->filter(static fn (string $class): bool => $class::showsInNavigation())
            ->filter(static fn (string $class): bool => $class::isAccessible())
            ->filter(static fn (string $class): bool => $class::can('viewAny'));

        return array_values(self::resources($visible, $prefix)
            ->merge(self::clusters($visible, $prefix))
            ->merge(self::declared($panels->panel($panelId)))
            ->sortBy([['sort', 'asc'], ['title', 'asc']])
            ->values()
            ->all());
    }

    /**
     * ENTRIES THE PANEL DECLARED THAT ARE NOT RESOURCES.
     *
     * THE SIDEBAR WAS ENTIRELY RESOURCE-DERIVED, so a link to a report, an
     * external dashboard or a status page could not appear in it - and the
     * workaround was a page that existed only to redirect somewhere else.
     *
     * `href` IS RESOLVED HERE, not at declaration. Panels register in a
     * provider's `boot`, which runs before routes exist, so a `route()` call
     * at declaration time throws about a route that is merely not registered
     * YET - an error that reads as the route being missing.
     *
     * THE ABILITY IS CHECKED SERVER-SIDE, like everything else in this file:
     * an entry somebody may not open is ABSENT, not greyed out. A menu that
     * lists what you cannot have is a menu that leaks what exists.
     *
     * @return Collection<int, array<string, mixed>>
     */
    private static function declared(?\Alxtexh\Panel\Panel $panel): Collection
    {
        $user = request()->user();

        return collect($panel?->getNavigationItems() ?? [])
            ->filter(static fn (array $item): bool => ! isset($item['ability'])
                || Ability::allows($user, (string) $item['ability']))
            ->map(static function (array $item): array {
                $href = $item['href'] ?? '';

                return self::item(
                    $item['key'] ?? str($item['title'] ?? '')->slug()->value(),
                    $item['title'] ?? '',
                    $href instanceof \Closure ? (string) $href() : (string) $href,
                    $item['icon'] ?? 'link',
                    $item['group'] ?? null,
                    $item['sort'] ?? 100,
                );
            })
            ->values();
    }

    /**
     * @param  Collection<string, class-string<Resource>>  $visible
     * @return Collection<int, array<string, mixed>>
     */
    private static function resources(Collection $visible, string $prefix): Collection
    {
        return $visible
            ->filter(static fn (string $class): bool => $class::cluster() === null)
            ->map(static fn (string $class): array => self::item(
                $class::key(),
                $class::pluralLabel(),
                $prefix.'/'.$class::key(),
                $class::icon(),
                $class::group(),
                $class::navigationSort(),
            ))
            ->values();
    }

    /**
     * CLUSTERS COLLAPSE TO ONE ENTRY EACH - roadmap 4.1. The entry wears the
     * cluster's own name and icon and links to the first member this person may
     * open; the members are reached from the sub-navigation on every cluster
     * screen.
     *
     * `members` CARRIES EVERY HREF THE ENTRY STANDS FOR, so a coverage test can
     * see that a collapsed resource is still linked - through the cluster -
     * rather than lost.
     *
     * @param  Collection<string, class-string<Resource>>  $visible
     * @return Collection<int, array<string, mixed>>
     */
    private static function clusters(Collection $visible, string $prefix): Collection
    {
        return $visible
            ->filter(static fn (string $class): bool => $class::cluster() !== null)
            ->groupBy(static fn (string $class): string => $class::cluster())
            ->map(static function (Collection $classes, string $cluster) use ($prefix): array {
                $sorted = $classes->sortBy([
                    static fn (string $class): int => $class::navigationSort(),
                    static fn (string $class): string => $class::pluralLabel(),
                ])->values();

                $hrefs = $sorted
                    ->map(static fn (string $class): string => $prefix.'/'.$class::key())
                    ->merge(array_column($cluster::pages(), 'href'));

                $members = [];
                foreach ($hrefs->values()->all() as $href) {
                    $members[] = $href;
                }

                return self::item(
                    $cluster::key(),
                    $cluster::label(),
                    $prefix.'/'.$sorted->first()::key(),
                    $cluster::icon(),
                    $cluster::group(),
                    $cluster::navigationSort(),
                    $members,
                );
            })
            ->values();
    }

    /**
     * @param list<mixed>|null $members
     * @return array<string, mixed>
     */
    private static function item(
        mixed $key,
        mixed $title,
        string $href,
        mixed $icon,
        mixed $group,
        mixed $sort,
        ?array $members = null,
    ): array {
        $item = [
            'key' => $key,
            'title' => $title,
            'href' => $href,
            'icon' => $icon,
            'group' => $group,
            'sort' => $sort,
        ];

        if ($members !== null) {
            $item['members'] = $members;
        }

        return $item;
    }
}
