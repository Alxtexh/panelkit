<?php

declare(strict_types=1);

namespace Tests\Feature;

use Tests\TestCase;

/** Imported landing pages are shipped as isolated, full-document bundles. */
final class LandingPageTest extends TestCase
{
    public function test_no_generic_landing_templates_are_exposed(): void
    {
        $this->get('/landing/chanseek')->assertRedirect('/login');
        self::assertSame(200, $this->get('/panelkit/landings/chanseek/app/landing/')->getStatusCode());
        self::assertStringContainsString(
            '<title>Shadcn Dashboard & Landing Template</title>',
            (string) file_get_contents(public_path('panelkit/landings/chanseek/app/landing/index.html')),
        );
        self::assertSame(200, $this->get('/panelkit/landings/magicui/app/')->getStatusCode());
        self::assertSame(200, $this->get('/panelkit/landings/benlhachemi/app/')->getStatusCode());
        self::assertSame(200, $this->get('/panelkit/landings/benlhachemi/app/panelkit-landing-bridge.js')->getStatusCode());
        self::assertSame(200, $this->get('/panelkit/landings/bilal/app/')->getStatusCode());
        self::assertSame(200, $this->get('/panelkit/landings/qualiora/en/pages/landing/')->getStatusCode());
        self::assertSame(200, $this->get('/panelkit/landings/qualiora/_next/image?url=%2Fimages%2Fmisc%2Fmobile.jpg&w=640&q=75')->getStatusCode());
        self::assertSame(200, $this->get('/panelkit/landings/restaurant/app/')->getStatusCode());
        self::assertSame(200, $this->get('/panelkit/landings/hotel/app/en/')->getStatusCode());
        self::assertSame(200, $this->get('/panelkit/landings/hotel/app/en/rooms')->getStatusCode());
        self::assertSame(200, $this->get('/panelkit/landings/free-landing/app/en/')->getStatusCode());
        self::assertSame(200, $this->get('/panelkit/landings/design/app/en/')->getStatusCode());
        $benlhachemi = file_get_contents(public_path('panelkit/landings/benlhachemi/app/index.html'));
        $qualiora = file_get_contents(public_path('panelkit/landings/qualiora/en/pages/landing/index.html'));

        self::assertIsString($benlhachemi);
        self::assertIsString($qualiora);
        self::assertStringContainsString('href="/panelkit/landings/benlhachemi/app/illustration.svg"', $benlhachemi);
        self::assertStringContainsString('href="/dashboard"', $benlhachemi);
        self::assertStringContainsString('panelkit-landing-bridge.js?v=1', $benlhachemi);
        self::assertStringContainsString('panelkit-landing-bridge.js?v=2', $qualiora);
        self::assertStringNotContainsString('dashboards/analytics', $qualiora);
        self::assertStringNotContainsString('http://localhost:3000/docs', $qualiora);
        self::assertStringContainsString('/panelkit/landings/restaurant/app/_next/', file_get_contents(public_path('panelkit/landings/restaurant/app/index.html')));
        self::assertStringContainsString('/panelkit/landings/hotel/app/_next/', file_get_contents(public_path('panelkit/landings/hotel/app/en.html')));
        self::assertStringContainsString('/panelkit/landings/free-landing/app/_next/', file_get_contents(public_path('panelkit/landings/free-landing/app/en.html')));
        self::assertStringContainsString('/panelkit/landings/design/app/_next/', file_get_contents(public_path('panelkit/landings/design/app/en.html')));
        $this->get('/panelkit/landings/benlhachemi/app/dashboard')->assertRedirect('/dashboard');
        $this->get('/panelkit/landings/chanseek/app/screens/locked')->assertRedirect('/panelkit/landings/chanseek/app/landing/');
        $this->get('/panelkit/landings/qualiora/dashboards/analytics')->assertRedirect('/dashboard');
        $this->get('/panelkit/landings/qualiora/register')->assertRedirect('/login');
        $this->get('/panelkit/landings/qualiora/sign-in')->assertRedirect('/login');
        $this->get('/panelkit/landings/qualiora/en/register')->assertRedirect('/login');
        $this->get('/panelkit/landings/qualiora/en/login')->assertRedirect('/login');
        $this->get('/preview/aurora')->assertNotFound();
        $this->get('/preview/restaurant')->assertNotFound();
        $this->get('/landing/dashboard')->assertNotFound();
        $this->get('/landing-template')->assertNotFound();
        $this->get('/api/landing-template')->assertNotFound();
        $this->withHeader('X-Inertia', 'true')
            ->get('/panelkit/landings/chanseek/app/landing/')
            ->assertStatus(409)
            ->assertHeader('X-Inertia-Location');
    }

    /** The public root serves the default template's own document, unmodified. */
    public function test_the_public_root_serves_the_default_landing(): void
    {
        $this->get('/')->assertOk();
        self::assertStringContainsString(
            'Next SaaS',
            (string) file_get_contents(public_path('panelkit/landings/benlhachemi/app/index.html')),
        );
    }

    /** `?preview=` swaps which shipped design the root serves, for allow-listed slugs only. */
    public function test_the_public_root_can_preview_an_allow_listed_design(): void
    {
        $this->get('/?preview=hotel')->assertOk();

        // An unknown slug is not an error: it falls back to the default.
        $this->get('/?preview=not-a-real-design')->assertOk();
    }
}
