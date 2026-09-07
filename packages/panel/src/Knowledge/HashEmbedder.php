<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Knowledge;

/**
 * A deterministic embedder with no network, no key and no cost.
 *
 * IT IS NOT A LANGUAGE MODEL AND DOES NOT PRETEND TO BE. It hashes words into
 * buckets - a bag-of-words vector - so "suspend an account" and "account
 * suspension" land close together because they share words, and nothing at all
 * is understood. It will not match "turn off a line" to "suspend", which a real
 * embedding does, and that is the whole difference between this and the thing it
 * stands in for.
 *
 * SO WHY SHIP IT. Two reasons, and both are about the retrieval layer rather
 * than the quality of the matches.
 *
 *   IT MAKES THE FEATURE TESTABLE. Storage, tenant scoping, the similarity
 *   floor, the two search paths and the citation format are all exercised end to
 *   end against this, deterministically, with no API key and no bill. A
 *   retrieval layer that could only be tested against a paid endpoint is one
 *   that would not be tested.
 *
 *   IT MAKES THE FEATURE AVAILABLE. An installation that cannot send subscriber
 *   text to a third party gets keyword-grade retrieval rather than none, which
 *   for "find the help page about suspension" is most of the value.
 *
 * IT IS THE DEFAULT, DELIBERATELY. The alternative default is an outbound call
 * to a provider nobody configured, which either fails or silently spends money -
 * and a panel should not start paying for something because a feature exists.
 */
final class HashEmbedder implements Embedder
{
    /**
     * Small on purpose.
     *
     * A hashed bag of words gains nothing from more room - the vector is already
     * sparse - and a smaller one keeps the JSON column and the in-PHP comparison
     * cheap. A real provider's 1536 would be mostly zeros here.
     */
    private const DIMENSIONS = 256;

    public function dimensions(): int
    {
        return self::DIMENSIONS;
    }

    /**
     * LOW, BECAUSE A BAG OF WORDS SCORES LOW EVEN WHEN IT IS RIGHT.
     *
     * "How do exports work" against a passage about exports shares one word out
     * of eleven, which is cosine 0.19 - a strong match by this embedder's
     * standards and well under any threshold chosen for a dense model. Meanwhile
     * a genuinely unrelated question shares NO words and scores exactly zero, so
     * a low floor here is not the risk it would be elsewhere: the noise in this
     * space sits at 0, not at 0.3.
     *
     * It is not zero, though. One incidental word in common - "panel", "account"
     * - would otherwise be enough to hand the model a passage about the wrong
     * subject, and a long passage sharing one word scores below this.
     */
    public function floor(): float
    {
        return 0.1;
    }

    public function embed(string $text): array
    {
        $vector = array_fill(0, self::DIMENSIONS, 0.0);

        foreach ($this->words($text) as $word) {
            /*
             * A STABLE BUCKET PER WORD. `crc32` rather than a random hash so the
             * same word lands in the same place across processes and machines -
             * PHP's string hashing is randomised per process, which would make
             * every stored embedding meaningless after a restart.
             */
            $bucket = crc32($word) % self::DIMENSIONS;

            /*
             * COUNTED, not set. A word appearing five times says more about a
             * passage than one appearing once, and a binary vector throws that
             * away.
             */
            $vector[$bucket] += 1.0;
        }

        return array_values($vector);
    }

    /**
     * Words worth indexing.
     *
     * THE STOP LIST IS SHORT AND UNAPOLOGETIC. In a bag of words, "the" is in
     * every passage and therefore distinguishes none of them - it is pure noise
     * in a bucket that other words also land in. A longer list would start
     * discarding things that matter in this domain.
     *
     * @return list<string>
     */
    private function words(string $text): array
    {
        $stop = [
            'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
            'be', 'been', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'by',
            'from', 'as', 'it', 'this', 'that', 'these', 'those',
        ];

        $words = preg_split('/[^\p{L}\p{N}]+/u', mb_strtolower($text), -1, PREG_SPLIT_NO_EMPTY) ?: [];

        return array_values(array_filter(
            $words,
            // Single characters carry no signal and collide constantly.
            static fn (string $word): bool => mb_strlen($word) > 1 && ! in_array($word, $stop, true),
        ));
    }
}
