<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Closure;
use DateTimeInterface;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

/**
 * A sitemap.xml for the ONE part of an admin panel that is public: whatever
 * marketing or informational pages the installation puts in front of the
 * panel itself.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO, because Alxtexhpanel is not a website
 * builder. Every general-purpose sitemap tool - the one Google itself ships
 * for WordPress, the Laravel packages, the Filament plugins - is built to
 * crawl or enumerate a multi-page PUBLIC site: a blog, a product catalogue,
 * a documentation tree. An admin panel is the opposite shape: nearly every
 * screen sits behind `auth`, and putting one of them in a public sitemap
 * would be inviting a search engine to index a login-gated URL it can never
 * actually read, which helps nobody and tells a crawler this feed cannot be
 * trusted.
 *
 * So there is no crawler, no model integration, and no per-resource sitemap
 * columns to declare. There is a REGISTRY an application adds its own public
     * URLs to. Public pages belong to the host application, so this package
     * never invents a marketing URL or assumes that `/` is public.
 *
 * GOOGLE'S PING ENDPOINT IS DELIBERATELY ABSENT. Every competing tool still
 * calls it, and it does nothing: Google deprecated it in June 2023 and it has
 * 404'd since - a shipped feature quietly doing nothing is worse than no
 * feature, because nobody notices it stopped working. Google, Bing and Yandex
 * each have their own webmaster console for direct submission instead, which
 * needs that installation's own account and cannot be automated from here.
 *
 * THE `Sitemap:` LINE IN `robots.txt` IS WHAT ACTUALLY REACHES EVERYONE -
 * Google, Bing, Yandex, DuckDuckGo (which has no console of its own and
 * leans on Bing's index plus its own light crawler), and the AI crawlers
 * whose own published guidance says the same thing. `write()` appends it to
 * an EXISTING `robots.txt` if one is not already there for this file -
 * appends, never creates, never rewrites. Creating a `robots.txt` from
 * nothing is a bigger decision than this package should make for an
 * application it does not run - the file can just as easily read
 * `Disallow: /`.
 *
 * INDEXNOW IS THE MECHANISM GOOGLE'S DEAD ENDPOINT USED TO BE. Unlike the
 * ping, this one is alive: Bing, Yandex, Naver and Seznam all still honour
 * one notification. Off until `panel.sitemap.indexnow.key` names a key,
 * because it is a real outbound HTTP call this class should not make on
 * every installation's behalf by default.
 *
 * IMAGES, VIDEOS AND A SEPARATE NEWS FEED ARE ALSO ABSENT. Every one of those
 * assumes a content site with a content TYPE to describe, which nothing here
 * has an opinion about. `source()` is the escape hatch: an installation that
 * grows a public blog or catalogue can build any URL set it likes and hand it
 * to this class as a closure. What Alxtexhpanel ships is the mechanism and the
 * one entry it can prove; what an application is FOR is not its business.
 */
final class Sitemap
{
    /**
     * The protocol's own ceiling - sitemaps.org: 50,000 URLs, 50MB per file.
     * Below it in practice, because the byte limit is reached first for
     * almost any real payload; the count is what determines whether an
     * index is needed at all.
     */
    public const MAX_URLS_PER_FILE = 50_000;

    /** @var list<array{loc: string, lastmod: ?DateTimeInterface, changefreq: ?string, priority: ?float}> */
    private static array $entries = [];

    /** @var list<Closure(): iterable> */
    private static array $sources = [];

    private const CHANGEFREQS = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

    /**
     * Register one public URL directly - the common case for a host app.
     */
    public static function add(
        string $loc,
        ?DateTimeInterface $lastmod = null,
        ?string $changefreq = null,
        ?float $priority = null,
    ): void {
        self::$entries[] = compact('loc', 'lastmod', 'changefreq', 'priority');
    }

    /**
     * Register a SOURCE OF URLS rather than a URL - a closure called only when
     * the sitemap is actually resolved.
     *
     * WHY A CLOSURE AND NOT AN EAGER LIST. A public blog with a thousand posts
     * should not query them at every request that happens to load this class -
     * `urls()` is called once, at generation time or when the admin screen
     * renders, and nowhere else. Registering the QUERY rather than its result
     * is what keeps that true regardless of how many closures a plugin adds.
     *
     * Each yielded item is either a plain URL string or the same shape
     * `add()` takes as an array: `['loc' => ..., 'lastmod' => ..., 'changefreq' => ..., 'priority' => ...]`.
     *
     * @param  Closure(): iterable<string|array{loc: string, lastmod?: ?DateTimeInterface, changefreq?: ?string, priority?: ?float}>  $resolver
     */
    public static function source(Closure $resolver): void
    {
        self::$sources[] = $resolver;
    }

    /**
     * Every declared entry, normalised and de-duplicated.
     *
     * @return list<array{loc: string, lastmod: ?DateTimeInterface, changefreq: ?string, priority: ?float}>
     */
    public static function urls(): array
    {
        $raw = self::$entries;

        foreach (self::$sources as $resolver) {
            foreach ($resolver() as $item) {
                $raw[] = is_string($item) ? ['loc' => $item] : $item;
            }
        }

        /*
         * DE-DUPLICATED BY `loc`, LAST REGISTRATION WINS. Two sources naming
         * the same URL is not a conflict worth throwing over - a plugin and
         * the application both declaring the front page, say - and "last
         * wins" means the application's later registration can override the
         * earlier value without needing to know where it came from.
         */
        $normalised = [];

        $enforceNoindex = (bool) config('panel.seo.enforce_noindex', true);

        foreach ($raw as $entry) {
            $loc = trim((string) ($entry['loc'] ?? ''));

            if ($loc === '') {
                continue;
            }

            /*
             * A PAGE THAT ASKS NOT TO BE INDEXED IS NOT LISTED.
             *
             * THE ONE THING NONE OF THE SEO PLUGINS THIS WAS MODELLED ON CAN DO,
             * because each of them ships the metadata half and no sitemap - so
             * `noindex` lands in a meta tag while sitemap.xml, generated by
             * something else entirely, goes on advertising the URL. The engine is
             * then told "index this" by one file and "do not" by the page it
             * fetches, and which wins is a matter of crawl order.
             *
             * DROPPED HERE, IN NORMALISATION, rather than at each registration
             * site. Entries arrive from `add()` and every `source()` resolver;
             * normalising here keeps the rule consistent for both.
             *
             * `enforce_noindex` CAN TURN THIS OFF for an installation whose
             * front end already reconciles the two - but it defaults to on,
             * because the failure it prevents is silent and the cost of
             * preventing it is a boolean check.
             */
            if ($enforceNoindex && ($entry['noindex'] ?? false)) {
                continue;
            }

            /*
             * THE CANONICAL WINS OVER THE URL IT WAS REGISTERED UNDER. A record
             * reachable at two paths should appear once, at the one it names as
             * definitive - listing both is a site competing with itself, which
             * is the exact problem a canonical exists to state.
             */
            $canonical = trim((string) ($entry['canonical'] ?? ''));

            if ($canonical !== '') {
                $loc = $canonical;
            }

            /*
             * A PATH WITH NO SCHEME IS MADE ABSOLUTE, NOT REJECTED.
             *
             * `Sitemap::add('/blog/hello-world')` is the form callers will
             * actually type, and requiring the full
             * `config('app.url').'/blog/hello-world'` from every caller would
             * be asking each of them to get this exact fix right themselves.
             */
            if (parse_url($loc, PHP_URL_SCHEME) === null) {
                $loc = url($loc);
            }

            if (filter_var($loc, FILTER_VALIDATE_URL) === false) {
                continue;
            }

            $changefreq = $entry['changefreq'] ?? null;

            $normalised[$loc] = [
                'loc' => $loc,
                'lastmod' => $entry['lastmod'] ?? null,
                'changefreq' => in_array($changefreq, self::CHANGEFREQS, true) ? $changefreq : null,
                // Clamped to the protocol's own range rather than rejected -
                // a plugin author's typo of `5` (meant as "high") becomes the
                // ceiling `1.0` instead of silently dropping the whole entry.
                'priority' => isset($entry['priority']) ? max(0.0, min(1.0, (float) $entry['priority'])) : null,
            ];
        }

        return array_values($normalised);
    }

    public static function isEmpty(): bool
    {
        return self::urls() === [];
    }

    /** Test-only. Mirrors `Changelog::forget()` for the same reason: static state outlives a test otherwise. */
    public static function forget(): void
    {
        self::$entries = [];
        self::$sources = [];
    }

    /**
     * Where the file lands, resolved once so `write()` and the admin screen
     * agree on the same path without either hardcoding it twice.
     *
     * NULL DISK MEANS THE PROJECT ROOT, DIRECTLY - the ordinary case. A
     * sitemap is expected at the domain root
     * (`https://example.com/sitemap.xml`), and a Laravel disk almost never
     * resolves there: the `public` disk is `storage/app/public`, symlinked
     * to `/storage`, not `/`. Naming a disk is for the installation that
     * genuinely serves static assets from S3 or another origin and has
     * already arranged for that origin to answer at its domain root - this
     * class does not arrange that for them.
     */
    public static function filename(): string
    {
        return (string) config('panel.sitemap.filename', 'sitemap.xml');
    }

    private static function disk(): ?string
    {
        $disk = config('panel.sitemap.disk');

        return is_string($disk) && $disk !== '' ? $disk : null;
    }

    /** Whether a file exists at the configured destination right now. */
    public static function exists(): bool
    {
        $disk = self::disk();

        return $disk !== null
            ? Storage::disk($disk)->exists(self::filename())
            : File::exists(public_path(self::filename()));
    }

    /** When the file at the configured destination was last written, if it exists. */
    public static function generatedAt(): ?DateTimeInterface
    {
        if (! self::exists()) {
            return null;
        }

        $disk = self::disk();

        $timestamp = $disk !== null
            ? Storage::disk($disk)->lastModified(self::filename())
            : File::lastModified(public_path(self::filename()));

        return \DateTimeImmutable::createFromFormat('U', (string) $timestamp) ?: null;
    }

    /**
     * Whether `robots.txt` currently references this sitemap - a read-only
     * check the settings screen uses to show status BEFORE anybody clicks
     * Regenerate, which is when `updateRobotsTxt()` actually runs.
     */
    public static function robotsTxtReferencesIt(): bool
    {
        $path = public_path('robots.txt');

        return File::exists($path) && str_contains(File::get($path), 'Sitemap: '.url('/'.self::filename()));
    }

    /** Whether IndexNow has a key configured - not whether the last call succeeded. */
    public static function indexNowConfigured(): bool
    {
        $key = config('panel.sitemap.indexnow.key');

        return is_string($key) && $key !== '';
    }

    /**
     * Build the XML, write it to disk, splitting into an index once the
     * declared count exceeds the protocol's per-file limit, then do the two
     * things that make the result actually reachable: reference it from
     * `robots.txt` and, if configured, notify IndexNow.
     *
     * `XMLWriter` OVER STRING CONCATENATION, for the same reason every
     * exporter in this package uses a streaming writer rather than building a
     * string in memory: escaping is the library's job, not a `str_replace`
     * chain somebody has to get right for `&`, `<`, `>` and quotes every
     * time a new field is added.
     *
     * @return array{files: list<string>, count: int, robotsTxtUpdated: bool, indexNow: string}
     */
    public static function write(): array
    {
        $urls = self::urls();
        $chunks = array_chunk($urls, self::MAX_URLS_PER_FILE);
        $written = [];

        if (count($chunks) <= 1) {
            self::put(self::filename(), self::urlset($chunks[0] ?? []));
            $written[] = self::filename();
        } else {
            /*
             * MORE THAN ONE FILE'S WORTH: THE MAIN FILENAME BECOMES AN INDEX.
             * `sitemap.xml` no longer holds URLs itself - it points at
             * `sitemap-1.xml`, `sitemap-2.xml`, ... which do. This is the
             * shape `sitemaps.org` itself specifies for exceeding the
             * per-file limit, and it is the only place in this class larger
             * than a landing page and a handful of registered URLs is likely
             * to reach.
             */
            $base = pathinfo(self::filename(), PATHINFO_FILENAME);
            $ext = pathinfo(self::filename(), PATHINFO_EXTENSION) ?: 'xml';

            $parts = [];

            foreach ($chunks as $i => $chunk) {
                $name = sprintf('%s-%d.%s', $base, $i + 1, $ext);
                self::put($name, self::urlset($chunk));
                $written[] = $name;
                $parts[] = $name;
            }

            self::put(self::filename(), self::sitemapIndex($parts));
            $written[] = self::filename();
        }

        return [
            'files' => $written,
            'count' => count($urls),
            'robotsTxtUpdated' => self::updateRobotsTxt(),
            'indexNow' => self::pingIndexNow($urls),
        ];
    }

    /**
     * Append a `Sitemap:` line to an EXISTING `robots.txt`, and only if this
     * exact file is not already referenced there.
     *
     * IDEMPOTENT ACROSS REPEATED GENERATION. `panel:sitemap-generate` may run
     * nightly on a schedule; writing a new line every time would mean a
     * `robots.txt` that grows by one line per day forever.
     *
     * NEVER CREATES THE FILE. A missing `robots.txt` is the application's
     * choice, not an oversight this class should correct - some hosts serve
     * a default of their own, and inventing one here could as easily produce
     * `Disallow: /` as `Disallow:`.
     *
     * @return bool whether a line was actually added this call
     */
    private static function updateRobotsTxt(): bool
    {
        if (config('panel.sitemap.robots_txt', true) !== true) {
            return false;
        }

        $path = public_path('robots.txt');

        if (! File::exists($path)) {
            return false;
        }

        $line = 'Sitemap: '.url('/'.self::filename());
        $current = File::get($path);

        if (str_contains($current, $line)) {
            return false;
        }

        // A trailing blank line before it, so it reads as its own paragraph
        // rather than glued to whatever the last `Disallow:` rule was.
        File::put($path, rtrim($current)."\n\n{$line}\n");

        return true;
    }

    /**
     * Notify IndexNow, if a key is configured. Bing, Yandex, Naver and
     * Seznam all treat one call as a submission to every one of them.
     *
     * SILENT ABOUT NETWORK FAILURES, THE WAY GENERATING THE FILE ITSELF NEVER
     * IS. Writing `sitemap.xml` is this method's job and must succeed or the
     * caller needs to know; notifying a third party about it is a courtesy,
     * and a courtesy that can fail the whole command over a timeout on
     * somebody else's API is a worse trade than the notification being late.
     *
     * ONLY THIS APPLICATION'S OWN HOST IS SUBMITTED. IndexNow requires every
     * URL in one call to share the host the key file is served from; a
     * A URL pointing at a different domain would make the whole request
     * invalid rather than merely inaccurate, so it is filtered out here.
     *
     * @param  list<array{loc: string, lastmod: ?DateTimeInterface, changefreq: ?string, priority: ?float}>  $urls
     * @return string one of: 'skipped', 'empty', 'notified', 'failed'
     */
    private static function pingIndexNow(array $urls): string
    {
        $key = config('panel.sitemap.indexnow.key');

        if (! is_string($key) || $key === '') {
            return 'skipped';
        }

        $host = parse_url(url('/'), PHP_URL_HOST);

        $ownHost = array_values(array_filter(
            array_column($urls, 'loc'),
            static fn (string $loc): bool => parse_url($loc, PHP_URL_HOST) === $host,
        ));

        if ($ownHost === []) {
            return 'empty';
        }

        /*
         * THE VERIFICATION FILE, WRITTEN EVERY CALL. IndexNow proves
         * ownership by serving `{key}.txt` containing the key at the domain
         * root - not by any credential this class holds - so the file has to
         * exist before the notification means anything, and keeping it in
         * step with the configured key costs nothing to redo.
         */
        self::put("{$key}.txt", $key);

        try {
            $response = Http::timeout(10)->post('https://api.indexnow.org/IndexNow', [
                'host' => $host,
                'key' => $key,
                'keyLocation' => url("/{$key}.txt"),
                'urlList' => $ownHost,
            ]);

            return $response->successful() ? 'notified' : 'failed';
        } catch (\Throwable) {
            return 'failed';
        }
    }

    private static function put(string $name, string $contents): void
    {
        $disk = self::disk();

        if ($disk !== null) {
            Storage::disk($disk)->put($name, $contents);

            return;
        }

        File::put(public_path($name), $contents);
    }

    /** @param  list<array{loc: string, lastmod: ?DateTimeInterface, changefreq: ?string, priority: ?float}>  $urls */
    private static function urlset(array $urls): string
    {
        $writer = new \XMLWriter;
        $writer->openMemory();
        $writer->setIndent(true);
        $writer->startDocument('1.0', 'UTF-8');
        $writer->startElement('urlset');
        $writer->writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        foreach ($urls as $url) {
            $writer->startElement('url');
            $writer->writeElement('loc', $url['loc']);

            if ($url['lastmod'] !== null) {
                $writer->writeElement('lastmod', $url['lastmod']->format(DateTimeInterface::W3C));
            }

            if ($url['changefreq'] !== null) {
                $writer->writeElement('changefreq', $url['changefreq']);
            }

            if ($url['priority'] !== null) {
                // `number_format`, not the float directly - `1.0` cast to
                // string is `"1"`, which a strict XML validator has flagged
                // as not matching the schema's decimal pattern before now.
                $writer->writeElement('priority', number_format($url['priority'], 1));
            }

            $writer->endElement();
        }

        $writer->endElement();
        $writer->endDocument();

        return $writer->outputMemory();
    }

    /** @param  list<string>  $parts */
    private static function sitemapIndex(array $parts): string
    {
        $writer = new \XMLWriter;
        $writer->openMemory();
        $writer->setIndent(true);
        $writer->startDocument('1.0', 'UTF-8');
        $writer->startElement('sitemapindex');
        $writer->writeAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        $base = rtrim((string) config('app.url'), '/').'/';

        foreach ($parts as $part) {
            $writer->startElement('sitemap');
            $writer->writeElement('loc', $base.$part);
            $writer->writeElement('lastmod', now()->toAtomString());
            $writer->endElement();
        }

        $writer->endElement();
        $writer->endDocument();

        return $writer->outputMemory();
    }
}
