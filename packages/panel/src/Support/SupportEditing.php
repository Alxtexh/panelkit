<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Alxtexh\Panel\Models\ContentEntry;
use Alxtexh\Panel\Panel;
use Alxtexh\Panel\PanelManager;
use Illuminate\Support\Facades\Route;
use Throwable;

/**
 * Same-page additions to Help, FAQ, What's new and About.
 *
 * TWO GATES, BOTH REQUIRED. The panel must have called `editableSupport()`,
 * and the signed-in person must hold `support.update` (or a `grants_all` role
 * once that name is in `panel.abilities`). A portal that never opted in has
 * no write routes at all; an opted-in portal still refuses anyone without
 * the ability. Client and reseller portals typically stay off.
 */
final class SupportEditing
{
    public const ABILITY = 'support.update';

    public static function can(?Panel $panel = null): bool
    {
        $panel ??= app(PanelManager::class)->currentPanel();

        if ($panel === null || ! $panel->isSupportEditable()) {
            return false;
        }

        return Ability::allows($panel->user(), self::ABILITY);
    }

    /**
     * Props the four screens share. Absent entirely when this portal cannot
     * add content, so a tenant help page does not grow an unused payload.
     *
     * @return array<string, mixed>|null
     */
    public static function props(string $kind, ?Panel $panel = null): ?array
    {
        $panel ??= app(PanelManager::class)->currentPanel();

        if ($panel === null || ! self::can($panel)) {
            return null;
        }

        $github = $kind === ContentEntry::KIND_RELEASE
            ? $panel->getSupportGithubRepository()
            : null;

        return [
            'canEdit' => true,
            'kind' => $kind,
            'saveUrl' => Route::has($panel->getRouteName().'support.contents')
                ? route($panel->getRouteName().'support.contents')
                : null,
            'githubUrl' => $github !== null && Route::has($panel->getRouteName().'support.github')
                ? route($panel->getRouteName().'support.github')
                : null,
            'githubRepo' => $github,
            'entries' => self::entries($kind),
        ];
    }

    /**
     * Rows this kind currently stores, including unpublished drafts.
     *
     * @return list<array<string, mixed>>
     */
    public static function entries(string $kind): array
    {
        try {
            $rows = ContentEntry::query()
                ->where('kind', $kind)
                ->orderBy('sort')
                ->orderBy('id')
                ->get()
                ->map(static fn (ContentEntry $entry): array => [
                    'id' => $entry->id,
                    'category' => (string) ($entry->category ?? ''),
                    'title' => $entry->title,
                    'body' => (string) ($entry->body ?? ''),
                    'meta' => (array) ($entry->meta ?? []),
                    'sort' => (int) $entry->sort,
                    'published' => (bool) $entry->published,
                ])
                ->all();

            $entries = [];
            foreach ($rows as $row) {
                $entries[] = $row;
            }

            return $entries;
        } catch (Throwable) {
            return [];
        }
    }

    /**
     * Extra About blocks from the database. They sit AFTER `panel.about`.
     * Packaged name, tagline and description are never replaced from here.
     *
     * @return list<array{title: string, body: string, links: list<array<string, mixed>>}>
     */
    public static function aboutExtras(): array
    {
        try {
            $rows = ContentEntry::query()
                ->where('kind', ContentEntry::KIND_ABOUT)
                ->where('published', true)
                ->orderBy('sort')
                ->orderBy('id')
                ->get();
        } catch (Throwable) {
            return [];
        }

        $extras = [];
        foreach ($rows as $row) {
            $meta = (array) ($row->meta ?? []);
            $links = [];
            foreach ((array) ($meta['links'] ?? []) as $link) {
                if (is_array($link)) {
                    $links[] = $link;
                }
            }

            $extras[] = [
                'title' => $row->title,
                'body' => (string) ($row->body ?? ''),
                'links' => $links,
            ];
        }

        return $extras;
    }
}
