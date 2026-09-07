<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/** Serves local Next Image sources from an exported landing bundle. */
final class LandingImageController
{
    public function __invoke(Request $request, string $template): BinaryFileResponse
    {
        if (! preg_match('/^[a-z0-9-]+$/', $template)) {
            abort(404);
        }

        $base = realpath(public_path("panelkit/landings/{$template}/app"))
            ?: realpath(public_path("panelkit/landings/{$template}"));

        if ($base === false) {
            abort(404);
        }

        $requestedPath = parse_url((string) $request->query('url'), PHP_URL_PATH);

        if (! is_string($requestedPath) || $requestedPath === '') {
            abort(404);
        }

        $bundlePrefix = "/panelkit/landings/{$template}/";
        $relative = str_starts_with($requestedPath, $bundlePrefix)
            ? substr($requestedPath, strlen($bundlePrefix))
            : ltrim($requestedPath, '/');

        if (! str_starts_with($relative, 'images/')) {
            abort(404);
        }

        $candidate = realpath($base.DIRECTORY_SEPARATOR.$relative);

        if (
            $candidate === false
            || ! is_file($candidate)
            || ! str_starts_with($candidate, $base.DIRECTORY_SEPARATOR)
        ) {
            abort(404);
        }

        return response()->file($candidate);
    }
}
