<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

/**
 * CSS custom properties for the root view's blocking pre-paint script.
 *
 * Keep the oklch tables in lockstep with packages/ui `useAppearance.ts`
 * (`PRIMARY_COLORS`, `SURFACE_TINTS`, `appearanceVars`). The Blade head must
 * apply the SAME tokens the client would, or the first paint still flashes the
 * stylesheet's hsl defaults before the Vite bundle runs.
 *
 * @phpstan-type AppearanceArray array<string, mixed>
 */
final class AppearancePrepaint
{
    /** @var array<string, array{value: string, foreground: string}> */
    private const PRIMARY = [
        'slate' => ['value' => 'oklch(0.24 0.02 260)', 'foreground' => 'oklch(0.98 0 0)'],
        'emerald' => ['value' => 'oklch(0.60 0.14 163)', 'foreground' => 'oklch(0.99 0 0)'],
        'green' => ['value' => 'oklch(0.63 0.17 145)', 'foreground' => 'oklch(0.99 0 0)'],
        'lime' => ['value' => 'oklch(0.72 0.18 130)', 'foreground' => 'oklch(0.20 0 0)'],
        'orange' => ['value' => 'oklch(0.68 0.18 45)', 'foreground' => 'oklch(0.99 0 0)'],
        'amber' => ['value' => 'oklch(0.75 0.15 75)', 'foreground' => 'oklch(0.20 0 0)'],
        'yellow' => ['value' => 'oklch(0.82 0.16 95)', 'foreground' => 'oklch(0.20 0 0)'],
        'teal' => ['value' => 'oklch(0.62 0.11 190)', 'foreground' => 'oklch(0.99 0 0)'],
        'cyan' => ['value' => 'oklch(0.68 0.12 215)', 'foreground' => 'oklch(0.20 0 0)'],
        'sky' => ['value' => 'oklch(0.63 0.15 240)', 'foreground' => 'oklch(0.99 0 0)'],
        'blue' => ['value' => 'oklch(0.55 0.20 262)', 'foreground' => 'oklch(0.99 0 0)'],
        'indigo' => ['value' => 'oklch(0.51 0.22 277)', 'foreground' => 'oklch(0.99 0 0)'],
        'violet' => ['value' => 'oklch(0.56 0.24 295)', 'foreground' => 'oklch(0.99 0 0)'],
        'fuchsia' => ['value' => 'oklch(0.63 0.26 320)', 'foreground' => 'oklch(0.99 0 0)'],
        'pink' => ['value' => 'oklch(0.63 0.22 355)', 'foreground' => 'oklch(0.99 0 0)'],
        'rose' => ['value' => 'oklch(0.62 0.22 15)', 'foreground' => 'oklch(0.99 0 0)'],
    ];

    /** @var array<string, array{hue: float, chroma: float}> */
    private const SURFACE = [
        'neutral' => ['hue' => 0.0, 'chroma' => 0.0],
        'slate' => ['hue' => 260.0, 'chroma' => 0.012],
        'gray' => ['hue' => 250.0, 'chroma' => 0.006],
        'zinc' => ['hue' => 280.0, 'chroma' => 0.006],
        'stone' => ['hue' => 60.0, 'chroma' => 0.008],
        'warm' => ['hue' => 40.0, 'chroma' => 0.014],
        'cool' => ['hue' => 220.0, 'chroma' => 0.014],
        'sand' => ['hue' => 80.0, 'chroma' => 0.016],
    ];

    /** @var array<string, string> */
    private const ROW_PADDING = [
        'compact' => '0.25rem',
        'comfortable' => '0.5rem',
        'spacious' => '0.875rem',
    ];

    /** @var array<string, string> */
    private const FORM_GAP = [
        'compact' => '0.75rem',
        'comfortable' => '1rem',
        'spacious' => '1.5rem',
    ];

    /**
     * @param  AppearanceArray|null  $appearance
     * @return array{
     *     dark: bool,
     *     theme: string,
     *     vars: array<string, string>,
     *     sidebar: string,
     *     contentLayout: string
     * }
     */
    public static function payload(?array $appearance): array
    {
        $merged = self::merge($appearance);
        $dark = ($merged['theme'] ?? 'light') === 'dark';

        return [
            'dark' => $dark,
            'theme' => (string) ($merged['theme'] ?? 'light'),
            'vars' => self::vars($merged),
            'sidebar' => (string) ($merged['sidebarSide'] ?? 'left'),
            'contentLayout' => (string) ($merged['contentLayout'] ?? 'full'),
        ];
    }

    /**
     * Panel defaults when the visitor is a guest or has never saved appearance.
     *
     * @return array{
     *     dark: bool,
     *     theme: string,
     *     vars: array<string, string>,
     *     sidebar: string,
     *     contentLayout: string
     * }
     */
    public static function defaults(): array
    {
        return self::payload(null);
    }

    /**
     * Critical CSS for `<style id="pk-appearance">`.
     *
     * Same tokens as `payload()` / the client `appearanceVars()`. Inline
     * `setProperty` still wins over later app.css `:root` rules; this sheet
     * keeps a single DOM node the client can rewrite on live edits, and gives
     * a correct first paint when JS is delayed.
     *
     * @param  array{
     *     dark?: bool,
     *     theme?: string,
     *     vars: array<string, string>,
     *     sidebar?: string,
     *     contentLayout?: string
     * }  $payload
     */
    public static function cssFromPayload(array $payload): string
    {
        $vars = $payload['vars'] ?? [];
        $parts = [];

        foreach ($vars as $name => $value) {
            if (! is_string($name) || ! is_string($value)) {
                continue;
            }

            $parts[] = $name.': '.$value.';';
        }

        return ':root { '.implode(' ', $parts).' }';
    }

    /**
     * @param  AppearanceArray|null  $appearance
     * @return AppearanceArray
     */
    private static function merge(?array $appearance): array
    {
        $defaults = [
            'theme' => 'light',
            'density' => 'comfortable',
            'fontSize' => 16,
            'sidebarSide' => 'left',
            'cardStyle' => 'transparent',
            'radius' => 0.5,
            'contentLayout' => 'full',
            'menuStyle' => 'collapsible',
            'primary' => 'slate',
            'primaryChosen' => false,
            'surface' => 'neutral',
        ];

        if ($appearance === null) {
            return $defaults;
        }

        return array_merge($defaults, $appearance);
    }

    /**
     * @param  AppearanceArray  $next
     * @return array<string, string>
     */
    private static function vars(array $next): array
    {
        $primaryKey = is_string($next['primary'] ?? null) ? (string) $next['primary'] : 'slate';
        $accent = self::PRIMARY[$primaryKey] ?? self::PRIMARY['slate'];

        $surfaceKey = is_string($next['surface'] ?? null) ? (string) $next['surface'] : 'neutral';
        $tint = self::SURFACE[$surfaceKey] ?? self::SURFACE['neutral'];
        $c = $tint['chroma'];
        $h = $tint['hue'];
        // Keep the default neutral canvas cool-grey rather than introducing a
        // pink cast just because neutral has hue 0 and needs a tiny chroma.
        $canvasChroma = $c > 0 ? $c : 0.006;
        $canvasHue = $c > 0 ? $h : 250;
        $dark = ($next['theme'] ?? 'light') === 'dark';
        $filled = ($next['cardStyle'] ?? 'transparent') === 'filled';

        $surfaces = $dark
            ? [
                '--background' => "oklch(0.15 {$c} {$h})",
                '--card' => 'oklch('.($filled ? '0.19' : '0.15')." {$c} {$h})",
                '--popover' => "oklch(0.18 {$c} {$h})",
                '--muted' => "oklch(0.24 {$c} {$h})",
                '--accent' => "oklch(0.24 {$c} {$h})",
                '--border' => "oklch(0.27 {$c} {$h})",
                '--input' => "oklch(0.27 {$c} {$h})",
            ]
            : [
                '--background' => "oklch(0.975 {$canvasChroma} {$canvasHue})",
                '--card' => 'oklch('.($filled ? '0.985' : '1')." {$c} {$h})",
                '--popover' => 'oklch(1 0 0)',
                '--muted' => "oklch(0.965 {$c} {$h})",
                '--muted-foreground' => 'oklch(0.28 0 0)',
                '--accent' => "oklch(0.965 {$c} {$h})",
                '--border' => "oklch(0.925 {$c} {$h})",
                '--input' => "oklch(0.90 {$c} {$h})",
            ];

        $density = is_string($next['density'] ?? null) ? (string) $next['density'] : 'comfortable';
        $fontSize = is_numeric($next['fontSize'] ?? null) ? (float) $next['fontSize'] : 16.0;
        $radius = is_numeric($next['radius'] ?? null) ? (float) $next['radius'] : 0.5;

        return [
            '--primary' => $accent['value'],
            '--primary-foreground' => $accent['foreground'],
            '--ring' => $accent['value'],
            ...$surfaces,
            '--pk-font-size' => $fontSize.'px',
            '--radius' => $radius.'rem',
            '--pk-row-padding' => self::ROW_PADDING[$density] ?? self::ROW_PADDING['comfortable'],
            '--pk-form-gap' => self::FORM_GAP[$density] ?? self::FORM_GAP['comfortable'],
        ];
    }
}
