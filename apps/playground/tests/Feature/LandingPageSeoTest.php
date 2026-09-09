<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Support\LandingSeoSettings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * THE REGRESSION THIS PINS: the landing page's `<title>` and
 * `<meta name="description">` were a literal string baked into the compiled
 * Next.js export - "Next SaaS" / "Change this", never customised for this
 * installation. `LandingPageController` now rewrites them per request from
 * `LandingSeoSettings` - see that class and `LandingSeoInjector` - so this
 * hits the real route and reads the real compiled file off disk rather than
 * unit-testing the injector against a fixture.
 */
final class LandingPageSeoTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_root_response_carries_this_installations_seo_metadata(): void
    {
        (new LandingSeoSettings(
            title: 'Acme Fibre — Home Internet',
            description: 'Home internet for the Acme metro area.',
            businessName: 'Acme Fibre',
            locale: 'en_US',
        ))->save();

        $html = $this->get('/')->assertOk()->getContent();

        $this->assertStringContainsString('<title>Acme Fibre — Home Internet</title>', (string) $html);
        $this->assertStringContainsString(
            '<meta name="description" content="Home internet for the Acme metro area."/>',
            (string) $html,
        );
        $this->assertStringContainsString('property="og:site_name" content="Acme Fibre"', (string) $html);
        $this->assertStringNotContainsString('Next SaaS', (string) $html);
        $this->assertStringNotContainsString('Change this', (string) $html);
    }

    public function test_a_sub_asset_request_is_untouched(): void
    {
        $response = $this->get('/panelkit/landings/benlhachemi/app/illustration.svg');

        $response->assertOk();
        $this->assertStringContainsString('svg', (string) $response->headers->get('Content-Type'));
        $this->assertStringNotContainsString('og:title', (string) $response->getContent());
    }
}
