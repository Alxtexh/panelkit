<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Support\LandingSeoSettings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Alxtexh\Panel\Support\Sitemap;
use Tests\TestCase;

/**
 * The three discovery documents a crawler - human search, AI answer engine,
 * or otherwise - reaches before ever signing in: `/robots.txt` (a real
 * static file, see `apps/playground/public/robots.txt`, not covered here),
 * `/sitemap.xml` and `/llms.txt`.
 */
final class LandingDiscoveryTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Sitemap::forget();

        parent::tearDown();
    }

    public function test_sitemap_lists_the_landing_page(): void
    {
        $xml = $this->get('/sitemap.xml')
            ->assertOk()
            ->headers->get('Content-Type');

        $this->assertStringContainsString('application/xml', (string) $xml);

        $body = $this->get('/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>'.url('/').'</loc>', (string) $body);
    }

    /**
     * `Sitemap::add()` is called from inside the controller action, not a
     * service provider's `boot()` - see `LandingDiscoveryController::sitemap()`'s
     * own docblock for why. Requesting it twice must not grow the registry.
     */
    public function test_requesting_the_sitemap_twice_does_not_duplicate_the_entry(): void
    {
        $this->get('/sitemap.xml')->assertOk();
        $this->get('/sitemap.xml')->assertOk();

        $this->assertCount(1, Sitemap::urls());
    }

    public function test_llms_describes_the_configured_business_not_the_application(): void
    {
        (new LandingSeoSettings(
            title: 'Acme Fibre',
            description: 'Home internet for the Acme metro area.',
            businessName: 'Acme Fibre',
            locale: 'en_US',
        ))->save();

        $body = $this->get('/llms.txt')->assertOk()->getContent();

        $this->assertStringContainsString('# Acme Fibre', (string) $body);
        $this->assertStringContainsString('Home internet for the Acme metro area.', (string) $body);
        $this->assertStringNotContainsString('PanelKit', (string) $body);
    }
}
