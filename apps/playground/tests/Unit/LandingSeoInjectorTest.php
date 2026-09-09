<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Support\LandingSeoInjector;
use App\Support\LandingSeoSettings;
use Tests\TestCase;

/**
 * `LandingSeoInjector` exists because an imported landing document is a
 * static file on disk, not a Blade view - see its own docblock. This tests
 * it against fixtures shaped like the actual compiled output it runs
 * against, not a hand-simplified stand-in, because the RSC flight-payload
 * escaping is exactly the part a simplified fixture would fail to catch.
 */
final class LandingSeoInjectorTest extends TestCase
{
    private function seo(): LandingSeoSettings
    {
        return new LandingSeoSettings(
            title: 'Nairobi Fibre — Fast, Reliable Fiber Internet in Nairobi',
            description: 'Fast, reliable fiber internet plans for homes and businesses in Nairobi.',
            businessName: 'Nairobi Fibre',
            locale: 'en_KE',
        );
    }

    public function test_it_replaces_the_static_title_and_description(): void
    {
        $html = '<head><title>Next SaaS</title><meta name="description" content="Change this"/></head>';

        $result = LandingSeoInjector::apply($html, $this->seo());

        $this->assertStringContainsString(
            '<title>Nairobi Fibre — Fast, Reliable Fiber Internet in Nairobi</title>',
            $result,
        );
        $this->assertStringContainsString(
            '<meta name="description" content="Fast, reliable fiber internet plans for homes and businesses in Nairobi."/>',
            $result,
        );
        $this->assertStringNotContainsString('Next SaaS', $result);
        $this->assertStringNotContainsString('Change this', $result);
    }

    public function test_it_injects_open_graph_twitter_canonical_and_json_ld(): void
    {
        $result = LandingSeoInjector::apply('<head><title>x</title></head>', $this->seo());

        $this->assertStringContainsString('property="og:title" content="Nairobi Fibre', $result);
        $this->assertStringContainsString('property="og:site_name" content="Nairobi Fibre"', $result);
        $this->assertStringContainsString('name="twitter:card" content="summary"', $result);
        $this->assertStringContainsString('rel="canonical" href="/"', $result);

        $jsonLd = [];
        if (preg_match('#<script type="application/ld\+json">(.*?)</script>#', $result, $m)) {
            $jsonLd = json_decode($m[1], true);
        }

        $this->assertSame('Organization', $jsonLd['@type'] ?? null);
        $this->assertSame('Nairobi Fibre', $jsonLd['name'] ?? null);
    }

    public function test_it_does_not_duplicate_open_graph_tags_the_template_already_declares(): void
    {
        $html = '<head><title>x</title><meta property="og:title" content="Already set"/></head>';

        $result = LandingSeoInjector::apply($html, $this->seo());

        $this->assertSame(1, substr_count($result, 'property="og:title"'));
        $this->assertStringContainsString('Already set', $result);
    }

    /**
     * THE REGRESSION THIS PINS: Next's App Router embeds a second,
     * JSON-serialised copy of `<title>`/`<meta name="description">` in a
     * `self.__next_f.push(...)` flight payload, which React reads on
     * hydration and uses to reconcile the head it manages - overwriting the
     * static tags right back to the template's own values in a real
     * browser, seconds after the correct ones painted. See
     * `LandingSeoInjector::patchFlightPayload()`.
     */
    public function test_it_patches_the_next_js_flight_payload_duplicate(): void
    {
        $html = 'x<script>self.__next_f.push([1,"11:null\n15:[[\"$\",\"title\",\"0\",{\"children\":\"Next SaaS\"}],'
            .'[\"$\",\"meta\",\"1\",{\"name\":\"description\",\"content\":\"Change this\"}]]\n"])</script>';

        $result = LandingSeoInjector::apply($html, $this->seo());

        $this->assertStringContainsString(
            '\"children\":\"Nairobi Fibre \\\\u2014 Fast, Reliable Fiber Internet in Nairobi\"',
            $result,
        );
        $this->assertStringContainsString(
            '\"content\":\"Fast, reliable fiber internet plans for homes and businesses in Nairobi.\"',
            $result,
        );
        $this->assertStringNotContainsString('Next SaaS', $result);
        $this->assertStringNotContainsString('Change this', $result);
    }

    public function test_a_document_with_no_matching_flight_payload_is_left_alone(): void
    {
        $html = '<head><title>Next SaaS</title><meta name="description" content="Change this"/></head>';

        $result = LandingSeoInjector::apply($html, $this->seo());

        // No exception, no mangled output - just no flight payload to patch.
        $this->assertStringContainsString('Nairobi Fibre', $result);
    }
}
