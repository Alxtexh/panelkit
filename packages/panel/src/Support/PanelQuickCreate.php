<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Alxtexh\Panel\PanelManager;

/**
 * Header "Quick create" entries: creatable resources for the current person.
 *
 * EMPTY WHEN NOTHING IS CREATABLE, so the menu costs nothing on a read-only
 * portal. Abilities are checked here; the client never decides who may create.
 *
 * @return list<array{key: string, title: string, href: string, icon: string, group: string|null}>
 */
final class PanelQuickCreate
{
    /** @return list<array{key: string, title: string, href: string, icon: string, group: string|null}> */
    public static function build(?string $panelId = null): array
    {
        $panels = app(PanelManager::class);
        $panel = $panelId !== null
            ? $panels->panel($panelId)
            : $panels->currentPanel();

        if ($panel === null || ! $panel->showsQuickCreate()) {
            return [];
        }

        $panelId = $panel->id;
        $prefix = rtrim('/'.trim((string) $panel->getPath(), '/'), '/');

        return array_values(collect($panels->resourcesFor($panelId))
            ->filter(static fn (string $class): bool => $class::isAccessible())
            ->filter(static fn (string $class): bool => $class::isWritable())
            ->filter(static fn (string $class): bool => $class::can('create'))
            ->map(static fn (string $class): array => [
                'key' => $class::key(),
                'title' => $class::label(),
                'href' => $prefix.'/'.$class::key().'/create',
                'icon' => $class::icon(),
                'group' => $class::group(),
            ])
            ->sortBy([
                // Ungrouped first (null sorts before named groups), then title.
                static fn (array $item): string => $item['group'] ?? '',
                static fn (array $item): string => $item['title'],
            ])
            ->values()
            ->all());
    }
}
