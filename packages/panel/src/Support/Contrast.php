<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

/**
 * WCAG 2 contrast between two sRGB colours - the first math a colour picker
 * in this codebase has ever needed. Roadmap 7.1: the operator choosing a
 * document's accent colour sees a swatch on a white background, which says
 * nothing about whether the same colour reads as text on the white PAGE it
 * is about to render on. This is that check, computed once so both the
 * server rule and the live picker warning read the same number.
 *
 * HEX ONLY, matching `ColourField` - a contrast check has no meaning for a
 * value that has not already passed that field's own pattern, so this never
 * has to cope with anything else.
 */
final class Contrast
{
    /** WCAG AA for ordinary text. Large text and non-text UI use 3.0. */
    public const AA_NORMAL = 4.5;

    public const AA_LARGE = 3.0;

    /**
     * The ratio between two colours, from 1 (identical) to 21 (black on white).
     */
    public static function ratio(string $hexA, string $hexB): float
    {
        $lA = self::relativeLuminance($hexA);
        $lB = self::relativeLuminance($hexB);

        $lighter = max($lA, $lB);
        $darker = min($lA, $lB);

        return ($lighter + 0.05) / ($darker + 0.05);
    }

    public static function meets(string $hexA, string $hexB, float $minRatio = self::AA_NORMAL): bool
    {
        return self::ratio($hexA, $hexB) >= $minRatio;
    }

    /**
     * Whether this is a colour this class can measure at all.
     *
     * FOR CALLERS READING STORED SETTINGS, which is a different situation
     * from the field that wrote them. `ColourField` validates on the way in,
     * so anything arriving through a form is already hex - but `panel:doctor`
     * reads a settings blob that may have been written by an import, an older
     * release, or a `settings` key that means something else entirely. Asking
     * first is the difference between skipping a value and dividing by a
     * luminance computed from nonsense.
     */
    public static function isHex(string $value): bool
    {
        return preg_match('/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i', $value) === 1;
    }

    /**
     * Relative luminance per the WCAG 2 definition - linearised sRGB,
     * weighted by how much each channel contributes to perceived brightness.
     */
    private static function relativeLuminance(string $hex): float
    {
        [$r, $g, $b] = self::channels($hex);

        return 0.2126 * self::linearise($r) + 0.7152 * self::linearise($g) + 0.0722 * self::linearise($b);
    }

    private static function linearise(int $channel): float
    {
        $c = $channel / 255;

        return $c <= 0.03928 ? $c / 12.92 : (($c + 0.055) / 1.055) ** 2.4;
    }

    /** @return array{0: int, 1: int, 2: int} */
    private static function channels(string $hex): array
    {
        $hex = ltrim($hex, '#');

        if (strlen($hex) === 3) {
            $hex = $hex[0].$hex[0].$hex[1].$hex[1].$hex[2].$hex[2];
        }

        return [
            (int) hexdec(substr($hex, 0, 2)),
            (int) hexdec(substr($hex, 2, 2)),
            (int) hexdec(substr($hex, 4, 2)),
        ];
    }
}
