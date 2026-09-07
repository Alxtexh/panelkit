<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

/**
 * What the command palette asks when somebody types.
 *
 * THE REFERENCE APP HAD THIS AND THE PACKAGE DID NOT, and the demo's version
 * names `Client`, `Router` and `Plan` in its own source - which is exactly why
 * it could not ship. A palette that has to be rewritten per application is one
 * every application writes worse, and the third one has a cross-tenant leak
 * nobody reviews.
 *
 * IT SEARCHES WHAT THE PANEL ALREADY KNOWS. Every registered resource declares
 * its searchable columns for its own list screen; this asks each of them the
 * same question and takes the first few answers. There is no second search
 * implementation to keep in step - if a column is searchable in the table it is
 * searchable here, and if somebody marks a new one tomorrow the palette finds it
 * without being told.
 *
 * A LEAN JSON ENDPOINT, NOT AN INERTIA RENDER. The palette fires on keystrokes,
 * and re-rendering a page shell per keystroke is the cost model this package
 * exists to avoid. This returns the smallest payload that answers the question.
 *
 * PAGES ARE NOT SEARCHED HERE. The client already holds the navigation - the
 * same `panelNav` the sidebar draws - so it filters those locally, in the same
 * frame, with no network at all. Only records need a server.
 */
final class SearchController extends Controller
{
    /** Below this a prefix search matches too much to be worth the round trip. */
    private const MIN_LENGTH = 2;

    /**
     * Resources asked, at most. A panel with forty resources would otherwise
     * make forty queries per keystroke, and nobody reads past the third group.
     */
    private const MAX_RESOURCES = 8;

    public function __invoke(Request $request, PanelManager $panels): JsonResponse
    {
        $term = trim((string) $request->query('q', ''));

        if (mb_strlen($term) < self::MIN_LENGTH) {
            return response()->json(['groups' => []]);
        }

        $panel = $panels->currentPanel();
        $prefix = $panel === null ? '' : rtrim('/'.trim($panel->getPath(), '/'), '/');

        $groups = [];

        /*
         * THE SAME SOURCE THE SIDEBAR READS. `resourcesFor()` answers "what
         * belongs to this panel", falling back to each resource's own
         * declaration - `panelFor()` alone returns only the REGISTRATION
         * override and is null for an ordinary application resource, so
         * filtering on it found nothing at all and the palette returned an
         * empty list for every term.
         */
        /*
         * SORTED BEFORE ANYTHING IS QUERIED, so `MAX_RESOURCES` cuts the LEAST
         * important resources rather than whichever the filesystem listed last.
         * Cutting after the fact would let a resource that declared itself
         * first be dropped because eight others happened to be globbed ahead of
         * it - the ranking and the budget have to agree on the order.
         */
        $searchable = $panels->resourcesFor($panel?->id);

        uasort(
            $searchable,
            static fn (string $a, string $b): int => $a::searchSort() <=> $b::searchSort(),
        );

        foreach ($searchable as $class) {
            if (count($groups) >= self::MAX_RESOURCES) {
                break;
            }

            /** @var class-string<\Alxtexh\Panel\Resources\Resource> $class */
            /*
             * THE SAME ABILITY THE LIST PAGE ASKS FOR.
             *
             * Without this the palette is a way to read a resource somebody was
             * denied - typing part of a name and reading the answer is reading
             * the record, whatever the list screen says. Deny-by-default holds
             * here because `can()` is the resource's own check, not a second
             * one written for this endpoint.
             */
            if (! $class::can('viewAny')) {
                continue;
            }

            $search = $this->search($class, $term, $prefix);

            if ($search['items'] !== []) {
                $groups[] = [
                    'label' => $class::pluralLabel(),
                    'items' => $search['items'],
                    'score' => $search['score'],
                    'sort' => $class::searchSort(),
                ];
            }
        }

        usort($groups, static fn (array $a, array $b): int => match (true) {
            abs((float) $a['score'] - (float) $b['score']) < 0.00001 => $a['sort'] <=> $b['sort'],
            default => $b['score'] <=> $a['score'],
        });

        $payload = array_map(
            static fn (array $g): array => [
                'label' => $g['label'],
                'items' => $g['items'],
            ],
            $groups,
        );

        return response()->json(['groups' => $payload]);
    }

    /**
     * @return array{score: float, items: list<array{id: mixed, title: string, subtitle: ?string, href: string}>}
     */
    private function search(string $class, string $term, string $prefix): array
    {
        $definition = $class::definition();

        $limit = max(1, min(25, $class::searchResultLimit()));

        /*
         * A SUB-REQUEST, so the resource's own state reader applies. `search`
         * is the parameter its list screen uses, and `run()` is the method that
         * turns it into the word-prefix match, the tenant scope and the joins -
         * all of which this endpoint would otherwise reimplement slightly
         * differently, which is how two searches disagree about what exists.
         *
         * `modifyEloquent` is the one seam that is the PALETTE'S rather than
         * the list's: `modifySearchQuery` runs before scopes resolve, so a
         * resource can narrow or eager-load for this endpoint without its list
         * screen changing underneath it.
         */
        $result = $definition
            ->toListQuery($class::model())
            ->modifyEloquent(static function ($query) use ($class, $term): void {
                $class::modifySearchQuery($query, $term);
            })
            ->run(Request::create('/', 'GET', ['search' => $term, 'per_page' => $limit]));

        $key = 'id';
        $title = $this->titleColumn($result->records);
        $subtitle = $this->subtitleColumn($class, $result->records, $title);

        $words = $this->words($term);
        $weight = (float) $class::searchWeight();

        $scored = array_map(
            static fn (array $row): array => [
                'row' => $row,
                'titleValue' => (string) ($row[$title] ?? $row[$key] ?? ''),
                'subtitleValue' => $subtitle !== null && ($row[$subtitle] ?? '') !== ''
                    ? (string) $row[$subtitle]
                    : null,
                'score' => 0.0,
            ],
            array_slice($result->records, 0, $limit),
        );

        foreach ($scored as &$entry) {
            $text = $entry['titleValue'];

            if ($entry['subtitleValue'] !== null) {
                $text .= ' '.$entry['subtitleValue'];
            }

            $entry['score'] = $this->relevanceScore($text, $words) * $weight;
        }

        unset($entry);

        usort($scored, static fn (array $a, array $b): int => match (true) {
            abs((float) $a['score'] - (float) $b['score']) < 0.00001 => strcasecmp($a['titleValue'], $b['titleValue']),
            default => $b['score'] <=> $a['score'],
        });

        $resourceScore = 0.0;

        foreach ($scored as $entry) {
            $resourceScore = max($resourceScore, (float) $entry['score']);
        }

        $items = array_map(
            static fn (array $entry) => [
                'id' => $entry['row'][$key] ?? null,
                'title' => (string) $entry['titleValue'],
                'subtitle' => $entry['subtitleValue'],
                'href' => $prefix.'/'.$class::key().'/'.($entry['row'][$key] ?? ''),
            ],
            $scored,
        );

        return [
            'score' => $resourceScore,
            'items' => $items,
        ];
    }

    /**
     * @return list<string>
     */
    private function words(string $term): array
    {
        $normalised = preg_replace('/\s+/u', ' ', mb_strtolower(trim($term))) ?? '';

        if ($normalised === '') {
            return [];
        }

        $parts = preg_split('/\s+/u', $normalised, flags: PREG_SPLIT_NO_EMPTY);

        if ($parts === false) {
            return [];
        }

        return array_values(array_filter($parts, static fn (string $p): bool => trim($p) !== ''));
    }

    /**
     * @param  string  $text  Title + optional subtitle, already cast as string.
     * @param  list<string>  $words
     */
    private function relevanceScore(string $text, array $words): float
    {
        $score = 0.0;
        $lower = mb_strtolower($text);

        foreach ($words as $word) {
            if ($word === '') {
                continue;
            }

            if (str_starts_with($lower, $word)) {
                $score += 2;

                continue;
            }

            $pattern = '/(^|\s)'.preg_quote($word, '/').'($|\s)/u';

            if (preg_match($pattern, $lower) === 1) {
                $score += 1;
            }
        }

        return $score;
    }

    /**
     * The column that tells two same-titled rows apart.
     *
     * FIVE RESULTS ALL READING "100Mbps Business" ARE A LIST NOBODY CAN CHOOSE
     * FROM - the title says which KIND of thing was found and the subtitle says
     * WHICH ONE. The resource may name the column; otherwise the guess is the
     * next sensible text column after the title, under the same no-timestamps
     * rule the title itself follows.
     *
     * @param  list<array<string, mixed>>  $records
     */
    private function subtitleColumn(string $class, array $records, string $title): ?string
    {
        $declared = $class::searchSubtitleColumn();

        if ($declared !== null) {
            // Declared but absent from the select is a misdeclaration, and a
            // silently empty subtitle is how it would stay one. Null keeps the
            // row rendering; the fix belongs in the resource.
            return isset($records[0][$declared]) ? $declared : null;
        }

        foreach (['email', 'reference', 'phone', 'status', 'description'] as $candidate) {
            if ($candidate !== $title && isset($records[0][$candidate])) {
                return $candidate;
            }
        }

        foreach (array_keys($records[0] ?? []) as $column) {
            $value = $records[0][$column] ?? null;

            if ($column === 'id' || $column === $title || ! is_string($value)) {
                continue;
            }

            if (self::looksTemporal((string) $column, $value)) {
                continue;
            }

            return (string) $column;
        }

        return null;
    }

    /**
     * What to call a row, chosen from what came back.
     *
     * NOT HARDCODED TO `name`. A resource may call it `title`, `label`, or
     * nothing of the sort - and a palette listing six rows all reading `4` is
     * worse than no palette. The first string-ish column that is not the key
     * is the honest guess, and the key itself is the fallback so a row is never
     * blank.
     */
    /** @param  list<array<string, mixed>>  $records */
    private function titleColumn(array $records): string
    {
        foreach (['name', 'title', 'label', 'reference', 'subject', 'description', 'email'] as $candidate) {
            if (isset($records[0][$candidate])) {
                return $candidate;
            }
        }

        /*
         * A DATE IS A STRING AND IS NEVER A NAME.
         *
         * "The first string-ish column" picked `created_at` on any resource
         * whose first text column is a timestamp - the activity trail being the
         * one everybody sees - so the palette offered five results all reading
         * `2026-08-08 16:47:41`. They are distinguishable from each other and
         * from nothing else, which is worse than showing the key: at least an
         * id looks like an id and nobody mistakes it for the answer.
         */
        foreach (array_keys($records[0] ?? []) as $column) {
            $value = $records[0][$column] ?? null;

            if ($column === 'id' || ! is_string($value)) {
                continue;
            }

            if (self::looksTemporal((string) $column, $value)) {
                continue;
            }

            return (string) $column;
        }

        return 'id';
    }

    /**
     * A column that holds a moment rather than a name.
     *
     * BOTH THE NAME AND THE VALUE ARE CHECKED, because either alone is wrong
     * often enough to matter: a column called `logged` holds a date under a name
     * that does not say so, and a `description` reading "2026 review" is prose
     * that merely opens with a year.
     */
    private static function looksTemporal(string $column, string $value): bool
    {
        if (preg_match('/(^|_)(at|date|time|on)$/i', $column) === 1) {
            return true;
        }

        return preg_match('/^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2})?/', $value) === 1;
    }
}
