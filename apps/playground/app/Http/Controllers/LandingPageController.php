<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Panel\Pages;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\Response;

/** Renders the one configured landing document at the host application's root. */
final class LandingPageController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $slug = Pages::selectedLandingSlug((string) $request->query('preview', ''));
        $href = collect(Pages::landingTemplates())->firstWhere('slug', $slug)['href'] ?? null;

        if ($href === null) {
            return redirect('/dashboard');
        }

        $path = (string) parse_url($href, PHP_URL_PATH);

        if (! preg_match('#^/panelkit/landings/([a-z0-9-]+)/(.*)$#', $path, $matches)) {
            return redirect('/dashboard');
        }

        [, $template, $relative] = $matches;

        if (str_starts_with($relative, 'app/')) {
            $relative = substr($relative, 4);
        }

        return app(LandingAssetController::class)($request, $template, $relative);
    }
}
