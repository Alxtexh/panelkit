<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Panel\Pages;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

/**
 * Serves an imported landing application's static document and assets.
 *
 * The landing bundles use their own client-side router. A request such as
 * `/app/landing` therefore has no physical directory on disk, but it must
 * receive the bundle's index document rather than PanelKit's Inertia 404.
 * Asset requests still have to resolve to their exact files, and the resolved
 * path is constrained to the selected template directory to prevent traversal.
 */
final class LandingAssetController
{
    /**
     * Keep the imported application at its native basename while presenting
     * it as the host application's public root. The frame is same-origin, so
     * the bridge can promote calls to the host login and dashboard without
     * changing the imported bundle or leaking its internal URL in the address
     * bar.
     *
     * @param array<string, mixed> $content
     */
    public function renderPublicFrame(string $href, array $content): Response
    {
        $src = htmlspecialchars($href, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $title = htmlspecialchars($content['seoTitle'] ?? 'PanelKit', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $payload = json_encode([
            'content' => $content,
            'applyHostContent' => Pages::landingContentIsCustom($content),
        ], JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES);

        $html = <<<HTML
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{$title}</title>
    <style>html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#fff}iframe{display:block;width:100%;height:100%;border:0}</style>
</head>
<body>
    <iframe id="panelkit-public-landing" title="Public landing page" src="{$src}"></iframe>
    <script>
    window.__PANELKIT_PUBLIC_LANDING__={$payload};
    (function () {
        var frame = document.getElementById('panelkit-public-landing');
        var state = window.__PANELKIT_PUBLIC_LANDING__ || {};
        var content = state.content || {};
        var applyHostContent = Boolean(state.applyHostContent);
        var wiredDocument = null;
        var hostPath = function (href) {
            var url = new URL(href, window.location.origin);
            var path = url.pathname;
            if (/\/dashboard(?:\/|$)|\/dashboards(?:\/|$)/i.test(path)) return '/dashboard';
            if (/\/(?:login|register|sign-in|sign-up)(?:\/|$)/i.test(path)) return '/login';
            return null;
        };
        var replaceText = function (element, value) {
            if (!element || !value) return;
            var walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            var textNodes = [];
            var node = walker.nextNode();
            while (node) {
                textNodes.push(node);
                node = walker.nextNode();
            }
            if (textNodes.length) {
                textNodes[0].nodeValue = value;
                textNodes.slice(1).forEach(function (textNode) { textNode.nodeValue = ''; });
            } else {
                element.textContent = value;
            }
        };
        var markEditable = function (document) {
            var counters = { heading: 0, paragraph: 0, link: 0, image: 0 };
            document.querySelectorAll('h1,h2,h3,h4,p,a,img').forEach(function (element) {
                var type = element.matches('h1,h2,h3,h4')
                    ? 'heading'
                    : element.tagName === 'P'
                        ? 'paragraph'
                        : element.tagName === 'A'
                            ? 'link'
                            : 'image';
                if (!element.dataset.panelkitSlot) {
                    element.setAttribute('data-panelkit-slot', type + '-' + counters[type]++);
                }
            });
        };
        var setImage = function (element, value, alt) {
            if (!element || !value) return;
            if (element.tagName === 'SOURCE') {
                element.srcset = value;
                return;
            }
            element.src = value;
            element.removeAttribute('srcset');
            if (alt) element.alt = alt;
        };
        var applyImages = function (document) {
            if (content.logoUrl) {
                document.querySelectorAll('header img, nav img, img[alt*="logo" i], [data-panelkit-logo]').forEach(function (image) {
                    setImage(image, content.logoUrl, content.siteName);
                });
            }

            if (content.heroImageUrl) {
                var heading = document.querySelector('h1');
                var hero = heading && (heading.closest('section') || heading.parentElement);
                var image = hero && hero.querySelector('img, picture source');
                setImage(image, content.heroImageUrl, content.siteName);
            }

            if (content.socialImageUrl) {
                var social = document.querySelector('meta[property="og:image"]');
                var twitter = document.querySelector('meta[name="twitter:image"]');
                if (social) social.setAttribute('content', content.socialImageUrl);
                if (twitter) twitter.setAttribute('content', content.socialImageUrl);
            }
        };
        var applyOverrides = function (document) {
            (content.overrides || []).forEach(function (override) {
                if (!override || !override.selector || !override.value) return;
                try {
                    document.querySelectorAll(override.selector).forEach(function (element) {
                        if (override.type === 'image') {
                            setImage(element, override.value, override.alt);
                        } else if (override.type === 'link') {
                            element.setAttribute('href', override.value);
                        } else {
                            replaceText(element, override.value);
                        }
                    });
                } catch (error) {
                    // An invalid selector in saved CMS data must not break the page.
                }
            });
        };
        var promoteHostNavigation = function () {
            try {
                var childPath = frame.contentWindow.location.pathname;
                var destination = hostPath(childPath);
                if (destination) {
                    window.top.location.assign(destination);
                    return true;
                }
            } catch (error) {
                // A future externally-hosted preset must not break the public shell.
            }
            return false;
        };
        var enhance = function () {
            var document = frame.contentDocument;
            if (!document) return;
            if (promoteHostNavigation()) return;
            if (applyHostContent && content.seoTitle) {
                document.title = content.seoTitle;
            } else if (document.title) {
                // Keep the imported preset's own title visible in the public
                // browser tab until the host actually customises SEO.
                window.document.title = document.title;
            }
            markEditable(document);
            var heading = document.querySelector('h1');
            var brand = document.querySelector('header a, nav a');
            var hero = heading && (heading.closest('section') || heading.parentElement);
            if (applyHostContent) {
                if (brand) replaceText(brand, content.siteName);
                if (heading) replaceText(heading, content.headline);
                var eyebrow = hero && hero.querySelector('span, small');
                if (eyebrow) replaceText(eyebrow, content.eyebrow);
                var paragraph = hero && hero.querySelector('p');
                if (paragraph) replaceText(paragraph, content.description);
                applyImages(document);
            }
            document.querySelectorAll('a[href]').forEach(function (link) {
                var destination = hostPath(link.href);
                if (destination === '/login') {
                    link.href = content.primaryHref || destination;
                    if (applyHostContent) replaceText(link, content.primaryLabel);
                } else if (destination === '/dashboard') {
                    link.href = content.secondaryHref || destination;
                    if (applyHostContent) replaceText(link, content.secondaryLabel);
                }
            });
            applyOverrides(document);
            if (wiredDocument !== document) {
                wiredDocument = document;
                document.addEventListener('click', function (event) {
                    var element = event.target instanceof Element ? event.target : event.target && event.target.parentElement;
                    var link = element && element.closest('a');
                    if (!link) return;
                    var destination = hostPath(link.href);
                    if (!destination) return;
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    window.top.location.assign(destination);
                }, true);
            }
        };
        frame.addEventListener('load', function () {
            enhance();
            // React/Next hydration may replace the server markup after load.
            // Re-apply the host contract once the imported app has mounted.
            window.setTimeout(enhance, 250);
            window.setTimeout(enhance, 1000);
        });
        // Keep the adapter effective for client-side route/render updates.
        window.setInterval(enhance, 500);
        window.setInterval(promoteHostNavigation, 100);
    })();
    </script>
</body>
</html>
HTML;

        return response($html)
            ->header('Content-Type', 'text/html; charset=UTF-8')
            ->header('Cache-Control', 'no-store');
    }

    /** Serve the active document from the public root without redirecting. */
    public function renderPublicDocument(string $candidate, string $template, ?string $publicPath = null): Response
    {
        if (! is_file($candidate)) {
            abort(404);
        }

        return $this->documentResponse($candidate, $template, $publicPath);
    }

    /**
     * Render a CMS preview through Laravel rather than the web server's static
     * file shortcut. This keeps the preview injected with the same editable
     * slots as the published document, even when the imported bundle has an
     * index.html at the same physical path.
     */
    public function preview(string $template): Response
    {
        abort_unless(preg_match('/^[a-z0-9-]+$/', $template) === 1, 404);

        $configured = collect(Pages::landingTemplates())->firstWhere('slug', $template);
        abort_unless(is_array($configured), 404);

        $base = realpath(public_path("panelkit/landings/{$template}/app"))
            ?: realpath(public_path("panelkit/landings/{$template}"));
        abort_unless($base !== false, 404);

        $path = (string) parse_url($configured['href'], PHP_URL_PATH);
        $relative = ltrim((string) preg_replace(
            "#^/panelkit/landings/".preg_quote($template, '#')."/#",
            '',
            $path,
        ), '/');
        $candidate = realpath($base.DIRECTORY_SEPARATOR.$relative);

        if ($candidate !== false && is_dir($candidate)) {
            $candidate = realpath($candidate.DIRECTORY_SEPARATOR.'index.html');
        }

        if ($candidate === false || ! is_file($candidate)) {
            $candidate = realpath($base.DIRECTORY_SEPARATOR.'index.html');
        }

        abort_unless($candidate !== false && is_file($candidate), 404);

        $configuration = Pages::landingConfiguration();

        return $this->documentResponse(
            $candidate,
            $template,
            null,
            $configuration['publishedPages'][$template] ?? Pages::landingContentDefaults(),
        );
    }

    public function __invoke(Request $request, string $template, ?string $path = null): Response
    {
        if (! preg_match('/^[a-z0-9-]+$/', $template)) {
            abort(404);
        }

        /*
         * A standalone landing is a full browser document, not an Inertia
         * page. If an older compiled sidebar still sends an Inertia visit,
         * return Inertia's external-location response so the client performs
         * a real navigation instead of opening the HTML in its error dialog.
         * Direct browser requests continue through to the original document.
         */
        if ($request->header('X-Inertia') && pathinfo((string) $path, PATHINFO_EXTENSION) === '') {
            return Inertia::location($request->fullUrl());
        }

        // Most bundles expose an `app/` root. Next static exports that retain
        // their original route tree (for example `/en/pages/landing/`) expose
        // the compiled document from the template root instead.
        $base = realpath(public_path("panelkit/landings/{$template}/app"))
            ?: realpath(public_path("panelkit/landings/{$template}"));

        if ($base === false) {
            abort(404);
        }

        $relative = $path === null || $path === '' ? 'index.html' : ltrim($path, '/');
        $candidate = realpath($base.DIRECTORY_SEPARATOR.$relative);

        if ($candidate !== false && is_dir($candidate)) {
            $directoryIndex = realpath($candidate.DIRECTORY_SEPARATOR.'index.html');

            if ($directoryIndex !== false) {
                $candidate = $directoryIndex;
            }
        }

        /*
         * Next's static export writes route documents as `en.html`,
         * `en/rooms.html`, etc. The browser still requests the clean route
         * `/en/rooms/`, so resolve its exported sibling before falling back
         * to the app document. This also makes nested navigation work for
         * every imported locale-aware template.
         */
        if ($candidate === false && pathinfo($relative, PATHINFO_EXTENSION) === '') {
            $exportedDocument = realpath(
                $base.DIRECTORY_SEPARATOR.rtrim($relative, '/').'.html',
            );

            if ($exportedDocument !== false) {
                $candidate = $exportedDocument;
            }
        }

        if (
            $candidate === false
            || ! is_file($candidate)
            || ! str_starts_with($candidate, $base.DIRECTORY_SEPARATOR)
        ) {
            // Missing files are real 404s. Only extensionless client-side
            // routes fall back to the app document.
            if (pathinfo($relative, PATHINFO_EXTENSION) !== '') {
                abort(404);
            }

            $candidate = $base.DIRECTORY_SEPARATOR.'index.html';
        }

        if (
            Pages::landingConfiguration()['selected'] === $template
            && strtolower(pathinfo($candidate, PATHINFO_EXTENSION)) === 'html'
        ) {
            return $this->documentResponse($candidate, $template);
        }

        return response()->file($candidate);
    }

    /**
     * Apply the host-owned CMS contract to the active document only.
     *
     * Imported React/Next bundles remain untouched for previews. The selected
     * public document receives safe metadata and a JSON slot contract so a
     * template adapter can progressively render editable content without
     * coupling the host to a framework-specific component tree.
     */
    /**
     * @param array<string, mixed>|null $documentContent
     */
    private function documentResponse(string $candidate, string $template, ?string $publicPath = null, ?array $documentContent = null): Response
    {
        $html = file_get_contents($candidate);

        if (! is_string($html)) {
            abort(404);
        }

        $content = $documentContent ?? Pages::landingConfiguration()['published'];
        $applyHostContent = Pages::landingContentIsCustom($content);

        // A fresh imported preset is the source of truth. Replacing its title
        // or description with the host defaults would make the CMS appear to
        // own content that it has never edited. Only an explicitly changed
        // draft/published record receives host SEO values.
        if ($applyHostContent) {
            $title = e($content['seoTitle']);
            $description = e($content['seoDescription']);

            $html = preg_replace('/<title>.*?<\/title>/is', "<title>{$title}</title>", $html, 1) ?? $html;

            $descriptionTag = '<meta name="description" content="'.$description.'" />';
            $html = preg_replace(
                '/<meta\s+name=["\']description["\'][^>]*>/i',
                $descriptionTag,
                $html,
                1,
            ) ?? $html;
        }

        $payload = json_encode([
            'template' => $template,
            'content' => $content,
            'applyHostContent' => $applyHostContent,
        ], JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES);

        $publicPathJson = $publicPath === null
            ? 'null'
            : json_encode($publicPath, JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);

        $runtime = <<<HTML
<script>
window.__PANELKIT_LANDING__={$payload};
document.documentElement.dataset.panelkitLanding="{$template}";
(function () {
    var publicPath = {$publicPathJson};
    if (publicPath && window.location.pathname === '/') {
        window.history.replaceState({}, document.title, publicPath);
    }
})();
(function () {
    function applyPanelKitContent() {
        var state = window.__PANELKIT_LANDING__;
        var content = state && state.content;
        var applyHostContent = Boolean(state && state.applyHostContent);
        if (!content) return;

        var replaceText = function (element, value) {
            if (!element || !value) return;
            var walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            var textNodes = [];
            var node = walker.nextNode();
            while (node) {
                textNodes.push(node);
                node = walker.nextNode();
            }
            if (textNodes.length) {
                textNodes[0].nodeValue = value;
                textNodes.slice(1).forEach(function (textNode) { textNode.nodeValue = ''; });
            } else {
                element.textContent = value;
            }
        };
        var markEditable = function () {
            var counters = { heading: 0, paragraph: 0, link: 0, image: 0 };
            document.querySelectorAll('h1,h2,h3,h4,p,a,img').forEach(function (element) {
                var type = element.matches('h1,h2,h3,h4')
                    ? 'heading'
                    : element.tagName === 'P'
                        ? 'paragraph'
                        : element.tagName === 'A'
                            ? 'link'
                            : 'image';
                if (!element.dataset.panelkitSlot) {
                    element.setAttribute('data-panelkit-slot', type + '-' + counters[type]++);
                }
            });
        };
        var setImage = function (element, value, alt) {
            if (!element || !value) return;
            if (element.tagName === 'SOURCE') {
                element.srcset = value;
                return;
            }
            element.src = value;
            element.removeAttribute('srcset');
            if (alt) element.alt = alt;
        };
        var applyImages = function () {
            if (content.logoUrl) {
                document.querySelectorAll('header img, nav img, img[alt*="logo" i], [data-panelkit-logo]').forEach(function (image) {
                    setImage(image, content.logoUrl, content.siteName);
                });
            }

            if (content.heroImageUrl) {
                var heroHeading = document.querySelector('h1');
                var hero = heroHeading && (heroHeading.closest('section') || heroHeading.parentElement);
                setImage(hero && hero.querySelector('img, picture source'), content.heroImageUrl, content.siteName);
            }

            if (content.socialImageUrl) {
                var social = document.querySelector('meta[property="og:image"]');
                var twitter = document.querySelector('meta[name="twitter:image"]');
                if (social) social.setAttribute('content', content.socialImageUrl);
                if (twitter) twitter.setAttribute('content', content.socialImageUrl);
            }
        };
        var applyOverrides = function () {
            (content.overrides || []).forEach(function (override) {
                if (!override || !override.selector || !override.value) return;
                try {
                    document.querySelectorAll(override.selector).forEach(function (element) {
                        if (override.type === 'image') {
                            setImage(element, override.value, override.alt);
                        } else if (override.type === 'link') {
                            element.setAttribute('href', override.value);
                        } else {
                            replaceText(element, override.value);
                        }
                    });
                } catch (error) {
                    // Invalid saved selectors are ignored rather than breaking the page.
                }
            });
        };

        var heading = document.querySelector('h1');
        markEditable();
        var brand = document.querySelector('header a, nav a');
        var hero = heading && (heading.closest('section') || heading.parentElement);
        if (applyHostContent) {
            if (brand) replaceText(brand, content.siteName);
            if (heading) replaceText(heading, content.headline);
            var eyebrow = hero && hero.querySelector('span, small');
            if (eyebrow) replaceText(eyebrow, content.eyebrow);
            var paragraph = hero && hero.querySelector('p');
            if (paragraph && content.description) replaceText(paragraph, content.description);
            applyImages();
        }

        document.querySelectorAll('a[href]').forEach(function (link) {
            var path = link.getAttribute('href') || '';
            if (/\/(login|register|sign-in|sign-up)(\/|$)/i.test(path)) {
                link.setAttribute('href', content.primaryHref);
                if (applyHostContent) replaceText(link, content.primaryLabel);
            } else if (/\/(dashboard|dashboards)(\/|$)/i.test(path)) {
                link.setAttribute('href', content.secondaryHref);
                if (applyHostContent) replaceText(link, content.secondaryLabel);
            }
        });
        applyOverrides();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPanelKitContent, { once: true });
    } else {
        applyPanelKitContent();
    }
    window.setTimeout(applyPanelKitContent, 250);
    window.setInterval(applyPanelKitContent, 500);
})();
</script>
HTML;

        if (stripos($html, '</head>') !== false) {
            $html = preg_replace('/<\/head>/i', $runtime.'</head>', $html, 1) ?? $html;
        }

        return response($html)
            ->header('Content-Type', 'text/html; charset=UTF-8')
            ->header('Cache-Control', 'no-store');
    }
}
