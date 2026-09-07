<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Knowledge;

use Illuminate\Support\Facades\DB;
use Alxtexh\Panel\Support\TenantContext;

/**
 * Retrieval over the panel's own content, so the assistant can cite rather than
 * guess.
 *
 * THE PROBLEM IT SOLVES IS CONFIDENT INVENTION. A model asked "what is our
 * suspension policy" answers from nothing, and the answer is plausible, fluent
 * and made up. Retrieval turns that into "the help page says this, and here is
 * the link" - and where nothing matches, into "I do not have that", which is the
 * more valuable half.
 *
 * TWO SEARCH PATHS, ONE SCHEMA. Postgres with pgvector does nearest-neighbour in
 * the database against an index; everything else reads the candidates and scores
 * them in PHP. Requiring pgvector would make this a feature most installations
 * do not get; storing only the native type would make it unportable. The
 * embeddings are JSON either way, so the two cannot disagree about what is
 * stored.
 *
 * EVERY QUERY IS TENANT SCOPED, and here that matters more than usual. Retrieved
 * text goes into a prompt and comes back as prose - a chunk from the wrong
 * organisation is a leak that arrives paraphrased, attributed to the panel
 * itself, with no quotation marks around it.
 *
 * IT NEVER RETURNS A MATCH IT DOES NOT BELIEVE IN. Below a similarity floor the
 * answer is an empty list rather than the least-bad row, because the caller is a
 * language model and the least-bad row is exactly what it will build a confident
 * paragraph from. THE EMBEDDER DECIDES WHERE THAT FLOOR SITS - the scale is a
 * property of the vector space, and a number chosen for a dense model filters
 * out everything a bag of words ever returns.
 */
final class KnowledgeBase
{
    private const TABLE = 'panel_knowledge_chunks';

    public function __construct(private readonly Embedder $embedder) {}

    /**
     * Whether the database can do the search itself.
     *
     * ASKED OF THE DATABASE, not of config. An installation can have Postgres
     * and not the extension, or the extension and a table created before it was
     * installed; a config flag would describe an intention and this describes
     * what is actually there.
     */
    public function usesNativeVectors(): bool
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return false;
        }

        try {
            return DB::selectOne(
                "SELECT 1 AS ok FROM information_schema.columns
                 WHERE table_name = ? AND column_name = 'embedding_vector'",
                [self::TABLE],
            ) !== null;
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * Store one passage, replacing whatever that source previously held.
     *
     * KEYED BY SOURCE AND ID rather than appended. Re-indexing a help page that
     * lost a paragraph must lose the paragraph; appending would leave the old
     * text retrievable forever, and the assistant would cite a policy that was
     * removed a year ago.
     */
    public function put(string $source, ?string $sourceId, string $title, string $content, ?string $url = null): void
    {
        $tenant = $this->tenantKey();

        $hash = hash('sha256', $content);

        $existing = DB::table(self::TABLE)
            ->where('tenant_id', $tenant)
            ->where('source', $source)
            ->where('source_id', $sourceId)
            ->first(['id', 'content_hash']);

        /*
         * UNCHANGED CONTENT IS NOT RE-EMBEDDED. Embedding is a paid API call per
         * chunk; re-embedding an unchanged help page every night is a bill for
         * nothing and a rate limit waiting to be hit.
         */
        if ($existing !== null && $existing->content_hash === $hash) {
            return;
        }

        $vector = $this->embedder->embed($content);

        $row = [
            'tenant_id' => $tenant,
            'source' => $source,
            'source_id' => $sourceId,
            'title' => $title,
            'url' => $url,
            'content' => $content,
            'content_hash' => $hash,
            'embedding' => json_encode($vector, JSON_THROW_ON_ERROR),
            'updated_at' => now(),
            'created_at' => now(),
        ];

        if ($this->usesNativeVectors()) {
            // pgvector's text input format, which the driver casts on the way in.
            $row['embedding_vector'] = '['.implode(',', $vector).']';
        }

        if ($existing === null) {
            DB::table(self::TABLE)->insert($row);

            return;
        }

        unset($row['created_at']);

        DB::table(self::TABLE)->where('id', $existing->id)->update($row);
    }

    /**
     * The passages most like `$question`, best first.
     *
     * @return list<array{title: string, content: string, url: string|null, source: string, score: float}>
     */
    public function search(string $question, int $limit = 5): array
    {
        $question = trim($question);

        if ($question === '') {
            return [];
        }

        $vector = $this->embedder->embed($question);

        $matches = $this->usesNativeVectors()
            ? $this->searchNatively($vector, $limit)
            : $this->searchInPhp($vector, $limit);

        /*
         * A FLOOR RATHER THAN A TOP-N, because top-N always returns something.
         * Ask about a subject the panel has never heard of and the nearest chunk
         * is still the nearest - and handing that to a model produces an answer
         * about the wrong topic delivered with complete confidence.
         *
         * THE EMBEDDER SETS IT, because the scale belongs to the vector space
         * and not to the search - see `Embedder::floor()`. Applied identically
         * to both paths, so pgvector and PHP cannot disagree about what counts
         * as a match.
         */
        $floor = $this->embedder->floor();

        return array_values(array_filter(
            $matches,
            static fn (array $match): bool => $match['score'] >= $floor,
        ));
    }

    /**
     * @param  list<float>  $vector
     * @return list<array{title: string, content: string, url: string|null, source: string, score: float}>
     */
    private function searchNatively(array $vector, int $limit): array
    {
        $literal = '['.implode(',', $vector).']';

        /*
         * `<=>` IS COSINE DISTANCE, so similarity is one minus it. Using `<->`
         * (L2) here would still return rows, ranked differently and wrongly for
         * normalised embeddings - and it would silently stop using the index,
         * which was built for cosine.
         */
        $rows = DB::select(
            'SELECT title, content, url, source, 1 - (embedding_vector <=> ?::vector) AS score
             FROM '.self::TABLE.'
             WHERE tenant_id = ? AND embedding_vector IS NOT NULL
             ORDER BY embedding_vector <=> ?::vector
             LIMIT ?',
            [$literal, $this->tenantKey(), $literal, $limit],
        );

        $matches = [];

        foreach ($rows as $row) {
            $matches[] = [
                'title' => (string) $row->title,
                'content' => (string) $row->content,
                'url' => $row->url === null ? null : (string) $row->url,
                'source' => (string) $row->source,
                'score' => (float) $row->score,
            ];
        }

        return $matches;
    }

    /**
     * The portable path: read the candidates and score them here.
     *
     * BOUNDED, because this is the honest cost of not having pgvector. It reads
     * this organisation's chunks and compares each in PHP - fine for the
     * thousands a panel's help content and records produce, and not something to
     * point at a million. The cap is what stops it becoming a memory incident on
     * an installation that indexed far more than expected; it is better to
     * search a bounded subset than to fall over.
     *
     * @param  list<float>  $vector
     * @return list<array{title: string, content: string, url: string|null, source: string, score: float}>
     */
    private function searchInPhp(array $vector, int $limit): array
    {
        $scored = [];

        DB::table(self::TABLE)
            ->where('tenant_id', $this->tenantKey())
            ->orderBy('id')
            ->limit((int) config('panel.knowledge.scan_limit', 5000))
            ->select(['title', 'content', 'url', 'source', 'embedding'])
            ->chunk(500, function ($rows) use ($vector, &$scored): void {
                foreach ($rows as $row) {
                    $stored = json_decode((string) $row->embedding, true);

                    if (! is_array($stored) || $stored === []) {
                        continue;
                    }

                    $embedding = [];

                    foreach ($stored as $component) {
                        if (! is_int($component) && ! is_float($component)) {
                            $embedding = [];
                            break;
                        }

                        $embedding[] = (float) $component;
                    }

                    if ($embedding === []) {
                        continue;
                    }

                    $scored[] = [
                        'title' => (string) $row->title,
                        'content' => (string) $row->content,
                        'url' => $row->url === null ? null : (string) $row->url,
                        'source' => (string) $row->source,
                        'score' => self::cosine($vector, $embedding),
                    ];
                }
            });

        usort($scored, static fn (array $a, array $b): int => $b['score'] <=> $a['score']);

        return array_slice($scored, 0, $limit);
    }

    /**
     * Cosine similarity, computed rather than assumed.
     *
     * NORMALISED HERE RATHER THAN TRUSTED. Providers differ about whether they
     * return unit vectors, and a dot product over unnormalised ones ranks by
     * magnitude - which correlates with passage LENGTH, so the longest chunk
     * wins every search regardless of what it says.
     *
     * @param  list<float>  $a
     * @param  list<float>  $b
     */
    private static function cosine(array $a, array $b): float
    {
        $dot = 0.0;
        $normA = 0.0;
        $normB = 0.0;

        // A mismatched length means two different embedding models in one table.
        // Comparing what overlaps would produce a plausible number from
        // incomparable vectors; refusing is the honest answer.
        if (count($a) !== count($b)) {
            return 0.0;
        }

        foreach ($a as $i => $value) {
            $dot += $value * $b[$i];
            $normA += $value * $value;
            $normB += $b[$i] * $b[$i];
        }

        if ($normA <= 0.0 || $normB <= 0.0) {
            return 0.0;
        }

        return $dot / (sqrt($normA) * sqrt($normB));
    }

    /**
     * Remove everything indexed from one source.
     *
     * SCOPED TO THE TENANT like every other query here, so re-indexing one
     * organisation cannot empty another's.
     */
    public function forget(string $source): void
    {
        DB::table(self::TABLE)
            ->where('tenant_id', $this->tenantKey())
            ->where('source', $source)
            ->delete();
    }

    public function count(): int
    {
        return DB::table(self::TABLE)->where('tenant_id', $this->tenantKey())->count();
    }

    /**
     * NO TENANT IS A REFUSAL, never "all of them".
     *
     * Retrieved text goes into a prompt and comes back as an answer, so an
     * unscoped search is a leak that arrives paraphrased. The same rule the
     * whole panel follows, and the place it matters most.
     */
    private function tenantKey(): int|string
    {
        $key = app(TenantContext::class)->currentKey();

        if ($key === null) {
            throw new \RuntimeException('No tenant resolved; refusing to search unscoped knowledge.');
        }

        return $key;
    }
}
