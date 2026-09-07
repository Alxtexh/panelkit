<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Panel\Pages;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\RedirectResponse;

/** Renders the one configured landing document at the host application's root. */
final class LandingPageController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $configuration = Pages::landingConfiguration();
        $previewSlug = (string) $request->query('preview', '');
        $selectedSlug = $configuration['selected'];

        if ($previewSlug !== '' && in_array($previewSlug, array_column(Pages::landingTemplates(), 'slug'), true)) {
            $selectedSlug = $previewSlug;
        }

        $href = collect(Pages::landingTemplates())
            ->firstWhere('slug', $selectedSlug)['href'] ?? null;

        if ($href === null) {
            return redirect('/dashboard');
        }

        $path = (string) parse_url($href, PHP_URL_PATH);

        if (! preg_match('#^/panelkit/landings/([a-z0-9-]+)/(.*)$#', $path, $matches)) {
            return redirect('/dashboard');
        }

        $template = $matches[1];
        $relative = ltrim($matches[2], '/');

        $base = realpath(public_path("panelkit/landings/{$template}/app"))
            ?: realpath(public_path("panelkit/landings/{$template}"));

        if ($base === false) {
            return redirect('/dashboard');
        }

        if (str_starts_with($relative, 'app/')) {
            $relative = ltrim(substr($relative, 4), '/');
        }

        $candidate = realpath($base.DIRECTORY_SEPARATOR.$relative);

        if ($candidate !== false && is_dir($candidate)) {
            $candidate = realpath($candidate.DIRECTORY_SEPARATOR.'index.html') ?: false;
        }

        if ($candidate === false || ! is_file($candidate)) {
            $candidate = realpath($base.DIRECTORY_SEPARATOR.'index.html');
        }

        if ($candidate === false || ! is_file($candidate)) {
            return redirect('/dashboard');
        }

        return app(LandingAssetController::class)->renderPublicFrame(
            $href,
            $configuration['publishedPages'][$selectedSlug] ?? $configuration['published'],
        );
    }
}
