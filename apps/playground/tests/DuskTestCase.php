<?php

namespace Tests;

use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Illuminate\Support\Collection;
use Laravel\Dusk\Browser;
use Laravel\Dusk\TestCase as BaseTestCase;
use PHPUnit\Framework\Attributes\BeforeClass;

/**
 * The base for browser tests.
 *
 * WHY THESE EXIST AT ALL. Two real bugs shipped in one afternoon that 1,237
 * passing tests could not see: a form bound `@update:model-value` to a component
 * that emits `@change`, which type-checked, built, flipped the radio in the DOM
 * and never told the form; and an invoice rendered a quantity, a unit price and
 * an amount as `1100,000.00100,000.00`, because right-aligned cells had no
 * horizontal padding. Both were obvious the moment somebody looked at a screen,
 * and invisible to every other kind of test we have.
 *
 * THE BROWSER IS RESOLVED, NOT ASSUMED, and this is the part that took the
 * afternoon. `/snap/bin/chromium` is a symlink to `snap`, and ChromeDriver
 * launching a confined snap does not fail - it HANGS, with no output from either
 * process, which is indistinguishable from a suite that is merely slow. So the
 * search order below is explicit, snap is deliberately excluded, and a machine
 * with no usable browser SKIPS with an instruction rather than timing out.
 *
 * @see scripts/dusk.sh - the wrapper that guarantees the dev database is safe.
 */
abstract class DuskTestCase extends BaseTestCase
{
    /**
     * Where to look for a browser, in order.
     *
     * CHROME FOR TESTING FIRST, because it is the only entry whose version we
     * chose: `npx @puppeteer/browsers install chrome@<major>` fetches a build
     * that matches the ChromeDriver Dusk downloaded. Everything after it is
     * whatever the machine happens to have, and a ChromeDriver/Chrome major
     * mismatch is its own confusing failure.
     *
     * SNAP IS NOT IN THIS LIST. See the class note - it hangs rather than fails.
     */
    private const BROWSER_CANDIDATES = [
        // Downloaded into the app directory by scripts/dusk.sh.
        'chrome/*/chrome-linux64/chrome',
        /*
         * THE SAME DOWNLOAD, ON WINDOWS. `@puppeteer/browsers` lays a Windows
         * build down as `chrome/win64-<version>/chrome-win64/chrome.exe`, which
         * the Linux glob above cannot match - so a developer who ran the exact
         * command the skip message tells them to run still got skipped, with
         * the same message, and no way to tell that the browser they had just
         * installed was sitting in the directory being searched.
         */
        'chrome/*/chrome-win64/chrome.exe',
        'chrome/*/chrome-win32/chrome.exe',
        // Ordinary Debian/Ubuntu packages.
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        // Where GitHub Actions' browser setup steps land.
        '/opt/hostedtoolcache/chrome/*/chrome-linux64/chrome',
        '/opt/hostedtoolcache/setup-chrome/chromium/*/chrome-linux64/chrome',
    ];

    #[BeforeClass]
    public static function prepare(): void
    {
        if (static::runningInSail()) {
            return;
        }

        static::startChromeDriver(['--port=9515']);
    }

    /**
     * Prefer the wrapper's runtime URL over cached Laravel configuration.
     *
     * `scripts/dusk.sh` starts an isolated server on `DUSK_PORT` and passes
     * its URL as `DUSK_BASE_URL` to the Dusk process. Dusk's stock implementation
     * reads only `config('app.url')`, however, and a cached config can retain
     * the normal development port. The browser then reports
     * `ERR_CONNECTION_REFUSED` even though the throwaway server is healthy.
     * Reading the process environment first keeps the browser and server on
     * the same port while preserving the normal configured URL elsewhere.
     */
    protected function baseUrl(): string
    {
        $runtimeUrl = $_ENV['DUSK_BASE_URL']
            ?? $_SERVER['DUSK_BASE_URL']
            ?? getenv('DUSK_BASE_URL')
            ?: ($_ENV['APP_URL'] ?? $_SERVER['APP_URL'] ?? getenv('APP_URL') ?: null);

        return rtrim((string) ($runtimeUrl ?: config('app.url')), '/');
    }

    /**
     * Skip the whole class when there is no browser to drive.
     *
     * A SKIP, NOT A FAILURE. A developer without a browser installed has not
     * broken anything, and a red suite for a missing optional tool is a suite
     * people stop running. The message says exactly what to run.
     */
    protected function setUp(): void
    {
        if (static::browserBinary() === null) {
            $this->markTestSkipped(
                'No usable Chrome found, so the browser tests cannot run. Install one with: '
                .'npx @puppeteer/browsers install chrome@151  (from apps/playground). '
                .'A snap-packaged Chromium will not work - ChromeDriver hangs launching it.'
            );
        }

        parent::setUp();
    }

    protected function driver(): RemoteWebDriver
    {
        $options = (new ChromeOptions)
            /*
             * THE BINARY IS SET EXPLICITLY. Left to itself ChromeDriver searches
             * the PATH, finds the snap wrapper, and hangs - so the one thing this
             * class exists to prevent would happen by default.
             */
            ->setBinary((string) static::browserBinary())
            ->addArguments(collect([
                $this->shouldStartMaximized() ? '--start-maximized' : '--window-size=1400,1000',
                '--disable-search-engine-choice-screen',
                '--disable-smooth-scrolling',
                /*
                 * A FIXED LOCALE.
                 *
                 * The panel formats dates and money through `Intl`, so a browser
                 * on a different locale renders "30/07/2026" where an assertion
                 * expects "2026-07-30" - a test that passes on one machine and
                 * fails on another with nothing to explain why.
                 */
                '--lang=en-GB',
            ])->unless($this->hasHeadlessDisabled(), function (Collection $items) {
                return $items->merge([
                    '--disable-gpu',
                    '--headless=new',
                    /*
                     * `--no-sandbox` is for CI containers, which run as root and
                     * cannot use Chrome's own sandbox. It weakens a boundary
                     * inside a browser that only ever loads our test server, and
                     * it is the difference between a suite that runs in CI and
                     * one that does not.
                     */
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                ]);
            })->all());

        return RemoteWebDriver::create(
            $_ENV['DUSK_DRIVER_URL'] ?? env('DUSK_DRIVER_URL') ?? 'http://localhost:9515',
            DesiredCapabilities::chrome()->setCapability(ChromeOptions::CAPABILITY, $options),
        );
    }

    /**
     * The first browser on disk, or null.
     *
     * `DUSK_CHROME_BINARY` overrides everything, because a machine with an
     * unusual layout should not need this file edited.
     */
    protected static function browserBinary(): ?string
    {
        $explicit = $_ENV['DUSK_CHROME_BINARY'] ?? getenv('DUSK_CHROME_BINARY') ?: null;

        if (is_string($explicit) && is_executable($explicit)) {
            return $explicit;
        }

        foreach (self::BROWSER_CANDIDATES as $candidate) {
            /*
             * `dirname(__DIR__)`, not `base_path()`.
             *
             * This runs from `setUp()` BEFORE `parent::setUp()` boots the
             * application - deliberately, so a machine with no browser skips
             * instead of booting a framework it is about to abandon. At that
             * point the container is a bare `Container` with no `basePath()`,
             * and calling the helper fails with an error about the container
             * rather than about Chrome.
             */
            $pattern = str_starts_with($candidate, '/')
                ? $candidate
                : dirname(__DIR__).'/'.$candidate;

            // Newest first, so an upgrade that leaves an older build in place
            // does not pin the suite to a version ChromeDriver no longer matches.
            $matches = glob($pattern) ?: [];
            rsort($matches);

            foreach ($matches as $match) {
                if (is_executable($match)) {
                    return $match;
                }
            }
        }

        return null;
    }

    /**
     * axe-core's bundled source, read once and reused across every call.
     *
     * READ FROM DISK, NOT SHIPPED AS A ROUTE OR A PUBLIC ASSET. The suite is
     * the only consumer, so giving it a URL of its own would be adding a
     * surface to the application for a tool that only ever runs in a test
     * process - the file is loaded straight into the page instead, the same
     * way a `<script>` tag would, just without needing one to exist.
     */
    private static ?string $axeSource = null;

    /**
     * Run axe-core against the current page and fail on serious violations.
     *
     * `executeAsyncScript`, NOT `$browser->script()`. axe-core's `axe.run()`
     * returns a Promise - Selenium's synchronous script execution has no way
     * to wait on one, so calling it through `$browser->script()` would return
     * before the scan finished. The async variant is given a callback as its
     * last argument and the scan calls it when done, which is what actually
     * blocks this method until axe has an answer.
     *
     * MODERATE AND BELOW ARE NOT ASSERTED ON, DELIBERATELY. A moderate finding
     * is real and worth reading, but axe reports some against markup this
     * project does not control (third-party icon SVGs, browser-native form
     * chrome) - failing the build on those teaches people to silence the
     * check rather than read it. Serious and critical are the ones that block
     * a real user, and the ones the previous manual audit's own findings
     * (§Stage 11: missing skip link, silent SPA navigation) would have landed
     * in.
     */
    protected function assertNoSeriousAccessibilityViolations(Browser $browser, string $context = ''): void
    {
        self::$axeSource ??= file_get_contents(base_path('node_modules/axe-core/axe.min.js'));

        $browser->driver->manage()->timeouts()->setScriptTimeout(30);

        $violations = $browser->driver->executeAsyncScript(
            self::$axeSource.<<<'JS'
                var callback = arguments[arguments.length - 1];

                axe.run(document, { resultTypes: ['violations'] }).then(function (results) {
                    callback(results.violations
                        .filter(function (v) { return v.impact === 'serious' || v.impact === 'critical'; })
                        .map(function (v) {
                            return {
                                id: v.id,
                                impact: v.impact,
                                help: v.help,
                                // `failureSummary` is where the number lives -
                                // "insufficient color contrast of 3.96 ...
                                // Expected contrast ratio of 4.5:1" - the
                                // difference between a message that names a
                                // selector and one that says what to fix.
                                nodes: v.nodes.map(function (n) {
                                    var target = n.target.join(' ');
                                    var element = null;

                                    try {
                                        element = document.querySelector(n.target[0]);
                                    } catch (ignore) {
                                        // Some axe targets use a shadow-root path.
                                    }

                                    var style = element ? window.getComputedStyle(element) : null;

                                    return {
                                        target: target,
                                        summary: n.failureSummary,
                                        computed: style ? {
                                            color: style.color,
                                            backgroundColor: style.backgroundColor,
                                            fontSize: style.fontSize,
                                            fontWeight: style.fontWeight,
                                            opacity: style.opacity,
                                            parentOpacity: element.parentElement
                                                ? window.getComputedStyle(element.parentElement).opacity
                                                : null,
                                            className: element.className,
                                        } : null,
                                    };
                                }),
                            };
                        }));
                }, function (err) {
                    callback([{ id: 'axe-run-failed', impact: 'critical', help: String(err), nodes: [] }]);
                });
                JS
        );

        $description = collect($violations)
            ->map(fn (array $v) => sprintf(
                "[%s] %s (%s):\n%s",
                $v['impact'],
                $v['id'],
                $v['help'],
                collect($v['nodes'])
                    ->map(fn (array $n) => '  '.$n['target']
                        ."\n    ".str_replace("\n", "\n    ", (string) $n['summary'])
                        .(isset($n['computed']) && is_array($n['computed'])
                            ? "\n    Computed: ".json_encode($n['computed'], JSON_UNESCAPED_SLASHES)
                            : ''))
                    ->implode("\n"),
            ))
            ->implode("\n");

        $this->assertEmpty(
            $violations,
            ($context !== '' ? $context.': ' : '')."axe found serious/critical accessibility violations:\n".$description,
        );
    }
}
