<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Panel\Pages;
use App\Support\LandingSeoInjector;
use App\Support\LandingSeoSettings;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
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

        $response = app(LandingAssetController::class)($request, $template, $relative);

        return $this->withSeo($response);
    }

    /**
     * Rewrites this installation's actual SEO metadata into the served
     * document - see `LandingSeoInjector` for why that has to happen here
     * rather than in the template. Only the primary HTML document
     * qualifies: a sub-asset request (a `.js` chunk, a stylesheet, an image)
     * still returns exactly what `LandingAssetController` resolved, read
     * into memory here for nothing this class could use.
     */
    private function withSeo(Response $response): Response
    {
        if (! $response instanceof BinaryFileResponse) {
            return $response;
        }

        $file = $response->getFile();

        if (strtolower($file->getExtension()) !== 'html') {
            return $response;
        }

        $html = LandingSeoInjector::apply(
            file_get_contents($file->getPathname()) ?: '',
            LandingSeoSettings::load(),
        );

        return response($html, $response->getStatusCode(), ['Content-Type' => 'text/html; charset=UTF-8']);
    }
}
