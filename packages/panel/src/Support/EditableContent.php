<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Alxtexh\Panel\Models\ContentEntry;
use Throwable;

/**
 * The bridge from `panel_content_entries` to the screens that show it.
 *
 * THE SCREENS NEVER LEARNED THE TABLE EXISTS. `HelpCentre` and `Changelog`
 * already have registration seams - the same ones a plugin uses - so database
 * rows are simply another caller: FAQ rows arrive through `addQuestions()`,
 * articles through `add()`, releases through `set()`. If this class were
 * deleted tomorrow, every screen would still render its config-and-default
 * content exactly as before; that is the test of a bridge as opposed to a
 * rewrite.
 *
 * IT FAILS TO SILENCE, DELIBERATELY, IN EXACTLY ONE CASE: the table not
 * existing. A fresh checkout that has not migrated, a unit test with no
 * database, `package:discover` running mid-install - all of those hit this
 * code before any migration has run, and the right behaviour is the empty
 * default, not an exception during boot that takes the whole application
 * down before anything could render an error page.
 */
final class EditableContent
{
    /** The name this class contributes under - see `HelpCentre::source()`. */
    private const SOURCE = 'content-entries';

    /**
     * REGISTERED AS ONE NAMED SOURCE, NOT AS TWO APPENDS.
     *
     * This runs on every panel request, and `add()`/`addQuestions()` append -
     * fine for a provider that runs once per process, duplicating on screen
     * for anything that runs per request in a container that outlives one
     * (Octane, or a test making two requests). A named source replaces its own
     * previous contribution, so registering twice leaves one copy and an edit
     * replaces the stale row rather than sitting beside it.
     */
    public static function register(): void
    {
        /*
         * NOTHING IS QUERIED HERE. This runs on every panel request, and most
         * of them never render help, FAQ or What's-new - the live-updates diff
         * endpoint among them, whose entire contract is one bounded query and
         * which this made cost two. Both registrations take a closure now, so
         * registering is free and the query happens on the screens that read
         * the content.
         */
        HelpCentre::source(self::SOURCE, static function (): array {
            $rows = self::rows();

            return [
                'articles' => self::articles($rows[ContentEntry::KIND_ARTICLE] ?? []),
                'questions' => self::faqGroups($rows[ContentEntry::KIND_FAQ] ?? []),
            ];
        });

        Changelog::set(static function (): array {
            $rows = self::rows();
            $releases = self::releases($rows[ContentEntry::KIND_RELEASE] ?? []);

            foreach (is_array(config('panel.changelog', [])) ? config('panel.changelog', []) : [] as $release) {
                if (! is_array($release)) {
                    continue;
                }

                $normalised = [];

                foreach ($release as $key => $value) {
                    if (is_string($key)) {
                        $normalised[$key] = $value;
                    }
                }

                $releases[] = $normalised;
            }

            return $releases;
        });
    }

    /**
     * Published rows, grouped by kind. ONE QUERY, NOT CACHED - deliberately.
     *
     * THIS WAS CACHED AND INVALIDATED ON WRITE, AND IT SERVED STALE CONTENT
     * TWICE OVER. First by a missed invalidation: the edit landed, the key was
     * forgotten, and the next request still found a populated key. Then by a
     * version-keyed rewrite, which failed for a subtler reason worth writing
     * down - `updated_at` has SECOND precision, so a row created and corrected
     * inside the same second produces an identical count-and-timestamp key,
     * and the correction is invisible until the clock moves on.
     *
     * Both fixes were defending a cache that was never earning its place.
     * This table holds help articles, FAQ answers and release notes - tens of
     * rows, written by hand, read only on requests that render a panel. One
     * indexed SELECT is cheaper than the COUNT/MAX aggregate the versioned key
     * needed, and it cannot be stale. Cache this again only with a number that
     * measures the query, and then use a generation counter rather than a
     * clock.
     *
     * @return array<string, list<array<string, mixed>>>
     */
    private static function rows(): array
    {
        try {
            return ContentEntry::query()
                ->where('published', true)
                ->orderBy('sort')
                ->orderBy('id')
                ->get()
                ->groupBy('kind')
                ->map(static fn ($group) => $group->map(static fn (ContentEntry $e): array => [
                    'id' => $e->id,
                    'category' => $e->category,
                    'title' => $e->title,
                    'body' => (string) $e->body,
                    'meta' => (array) ($e->meta ?? []),
                ])->values()->all())
                ->all();
        } catch (Throwable) {
            // No table yet - a fresh install mid-migration, or a test with no
            // database. The screens fall back to config, which is the same
            // thing they showed before this table existed.
            return [];
        }
    }

    /**
     * FAQ rows become question groups: `category` is the group title, rows
     * sharing one are one group, insertion order within it is `sort`.
     *
     * @param  list<array<string, mixed>>  $rows
     * @return list<array{title: string, items: list<array{q: string, a: string}>}>
     */
    private static function faqGroups(array $rows): array
    {
        $groups = [];

        foreach ($rows as $row) {
            $groups[(string) ($row['category'] ?? 'General')][] = [
                'q' => (string) $row['title'],
                'a' => (string) $row['body'],
            ];
        }

        return array_map(
            static fn (string $title, array $items): array => ['title' => $title, 'items' => $items],
            array_keys($groups),
            $groups,
        );
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @return list<array<string, mixed>>
     */
    private static function articles(array $rows): array
    {
        return array_map(static fn (array $row): array => [
            'id' => 'db-'.$row['id'],
            'category' => (string) ($row['category'] ?? 'panel'),
            'title' => (string) $row['title'],
            'body' => (string) $row['body'],
            'keywords' => (string) ($row['meta']['keywords'] ?? ''),
        ], $rows);
    }

    /**
     * Releases go FIRST - the newest note belongs at the top of What's new,
     * and the rows are what an operator wrote most recently - with the
     * config-declared history kept after them by the caller rather than
     * replaced.
     *
     * @param  list<array<string, mixed>>  $rows
     * @return list<array<string, mixed>>
     */
    private static function releases(array $rows): array
    {
        return array_map(static fn (array $row): array => [
            'version' => (string) $row['title'],
            'date' => (string) ($row['category'] ?? ''),
            'highlight' => ($row['body'] ?? '') !== '' ? (string) $row['body'] : null,
            'added' => array_values(array_map(strval(...), (array) ($row['meta']['added'] ?? []))),
            'changed' => array_values(array_map(strval(...), (array) ($row['meta']['changed'] ?? []))),
            'fixed' => array_values(array_map(strval(...), (array) ($row['meta']['fixed'] ?? []))),
        ], $rows);
    }
}
