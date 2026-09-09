<?php

declare(strict_types=1);

namespace App\Http\Controllers;

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

        return response()->file($candidate);
    }
}
