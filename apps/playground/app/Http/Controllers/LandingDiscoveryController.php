<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Support\LandingSeoSettings;
use Alxtexh\Panel\Support\Sitemap;
use Illuminate\Http\Response;

/** Public discovery documents for search engines and answer engines. */
final class LandingDiscoveryController
{
    /**
     * Built from `Sitemap::urls()` rather than a hand-rolled XML string, so
     * this goes through the same normalisation, `noindex` filtering and
     * escaping every other installation's sitemap does.
     *
     * REGISTERED HERE, NOT IN A SERVICE PROVIDER'S `boot()`. `Sitemap::$entries`
     * is a static, process-lifetime registry - registering on every boot
     * means every OTHER feature test that boots this application adds this
     * URL to a registry it never asked about, which is exactly the kind of
     * cross-test pollution `Sitemap::forget()` exists to undo and this
     * class's own tests do not expect. Registering it only when this action
     * actually runs keeps that blast radius to "a request for the sitemap",
     * which is the only place a duplicate registration matters - and it does
     * not even there: `Sitemap::urls()` keys by `loc`, so requesting this
     * twice replaces the same entry rather than growing the list.
     */
    public function sitemap(): Response
    {
        Sitemap::add(url('/'), changefreq: 'weekly', priority: 1.0);

        return response(Sitemap::toXml(), 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    /**
     * Describes the BUSINESS the landing page is for, from
     * `LandingSeoSettings` - the same source `LandingSeoInjector` rewrites
     * the page's own `<head>` from - rather than this application's own
     * name and the design template's filename, which said nothing an LLM
     * crawler reading this document would actually want to know.
     */
    public function llms(): Response
    {
        $seo = LandingSeoSettings::load();

        $body = "# {$seo->businessName}\n\n"
            ."## About\n\n"
            ."{$seo->description}\n\n"
            ."## Primary page\n\n"
            .'- URL: '.url('/')."\n\n"
            ."## Actions\n\n"
            .'- Sign in: '.url('/login')."\n"
            .'- Dashboard: '.url('/dashboard')."\n";

        return response($body, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }
}
