<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Rewrites an imported landing document's `<head>` with this installation's
 * actual SEO metadata, at request time.
 *
 * WHY REQUEST TIME AND NOT BUILD TIME. The imported bundles under
 * `public/panelkit/landings/*` are pre-built, static exports - `next build`
 * ran once, on somebody else's machine, before this installation's business
 * name existed. There is no server-side templating step for them the way
 * there is for a Blade view, so the only place left to make their metadata
 * reflect THIS installation is here: read the compiled document, rewrite the
 * few tags that matter, serve the result. The asset files around it (JS,
 * CSS, images) are untouched and still served byte-for-byte.
 *
 * ONLY `<title>`, `<meta name="description">`, and a best-effort pass over
 * Next's React Server Component flight payload are touched. Everything else
 * in the document - the actual page content - is the template's own, and
 * rewriting THAT is a content-authoring decision an installation makes for
 * itself, not something this class can respond to safely.
 */
final class LandingSeoInjector
{
    public static function apply(string $html, LandingSeoSettings $seo): string
    {
        $html = self::replaceTitle($html, $seo->title);
        $html = self::replaceDescription($html, $seo->description);
        $html = self::patchFlightPayload($html, $seo->title, $seo->description);
        $html = self::injectHeadTags($html, $seo);

        return $html;
    }

    private static function replaceTitle(string $html, string $title): string
    {
        $result = preg_replace('/<title>[^<]*<\/title>/', '<title>'.e($title).'</title>', $html, 1);

        return $result ?? $html;
    }

    private static function replaceDescription(string $html, string $description): string
    {
        $result = preg_replace(
            '/<meta name="description" content="[^"]*"\s*\/?>/',
            '<meta name="description" content="'.e($description).'"/>',
            $html,
            1,
        );

        return $result ?? $html;
    }

    /**
     * Next's App Router embeds a second, JSON-serialised copy of `<title>`
     * and `<meta name="description">` in a `self.__next_f.push(...)` script,
     * which React reads on hydration and uses to reconcile the `<head>` it
     * manages - overwriting the static tags above right back to the
     * template's own values the moment client JS runs, in a real browser,
     * seconds after the correct one painted.
     *
     * BEST EFFORT, NOT GUARANTEED. This shape is an implementation detail of
     * Next's flight protocol, not a public contract, and nine vendored
     * templates were not all built by the same Next.js minor version. A
     * failed match here costs nothing: the tags a search engine actually
     * reads are already correct from `replaceTitle()`/`replaceDescription()`
     * above, which run against plain server-rendered HTML those two methods
     * do not depend on this one at all.
     */
    private static function patchFlightPayload(string $html, string $title, string $description): string
    {
        $html = preg_replace_callback(
            '/(\\\\"title\\\\",\\\\"\d+\\\\",\{\\\\"children\\\\":\\\\")[^"\\\\]*(\\\\"\})/',
            static fn (array $m): string => $m[1].self::escapeForFlightPayload($title).$m[2],
            $html,
            1,
        ) ?? $html;

        return preg_replace_callback(
            '/(\\\\"meta\\\\",\\\\"\d+\\\\",\{\\\\"name\\\\":\\\\"description\\\\",\\\\"content\\\\":\\\\")[^"\\\\]*(\\\\"\})/',
            static fn (array $m): string => $m[1].self::escapeForFlightPayload($description).$m[2],
            $html,
            1,
        ) ?? $html;
    }

    /** Matches how Next serialises this payload: valid JSON, then `\"`-escaped for the surrounding JS string. */
    private static function escapeForFlightPayload(string $value): string
    {
        // json_encode gives valid JSON-string escaping (unicode, quotes); the
        // surrounding JS string literal needs every backslash doubled again.
        $jsonEscaped = trim(json_encode($value) ?: '', '"');

        return str_replace('\\', '\\\\', $jsonEscaped);
    }

    private static function injectHeadTags(string $html, LandingSeoSettings $seo): string
    {
        if (str_contains($html, 'property="og:title"') || ! str_contains($html, '</head>')) {
            return $html;
        }

        $title = e($seo->title);
        $description = e($seo->description);
        $siteName = e($seo->businessName);

        $jsonLd = json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => $seo->businessName,
            'description' => $seo->description,
        ]);

        $tags = '<meta property="og:title" content="'.$title.'"/>'
            .'<meta property="og:description" content="'.$description.'"/>'
            .'<meta property="og:type" content="website"/>'
            .'<meta property="og:site_name" content="'.$siteName.'"/>'
            .'<meta property="og:locale" content="'.e($seo->locale).'"/>'
            .'<meta name="twitter:card" content="summary"/>'
            .'<meta name="twitter:title" content="'.$title.'"/>'
            .'<meta name="twitter:description" content="'.$description.'"/>'
            .'<link rel="canonical" href="/"/>'
            .'<script type="application/ld+json">'.$jsonLd.'</script>';

        return str_replace('</head>', $tags.'</head>', $html);
    }
}
