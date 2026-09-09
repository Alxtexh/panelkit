<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Panel\Pages;
use Illuminate\Http\Response;

/** Public discovery documents for search engines and answer engines. */
final class LandingDiscoveryController
{
    public function robots(): Response
    {
        $body = "User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /admin\nDisallow: /api\nDisallow: /login\nSitemap: /sitemap.xml\n";

        return response($body, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }

    public function sitemap(): Response
    {
        $body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
            ."<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
            .'  <url><loc>'.e(url('/'))."</loc></url>\n"
            ."</urlset>\n";

        return response($body, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    public function llms(): Response
    {
        $template = collect(Pages::landingTemplates())->firstWhere('slug', Pages::selectedLandingSlug());

        $body = "# PanelKit\n\n"
            ."## Primary page\n\n"
            .'- URL: '.url('/')."\n"
            .'- Template: '.($template['title'] ?? Pages::LANDING_DEFAULT)."\n\n"
            ."## Actions\n\n"
            .'- Sign in: '.url('/login')."\n"
            .'- Dashboard: '.url('/dashboard')."\n";

        return response($body, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }
}
