<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Support\LandingSeoSettings;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * THE REGRESSION THIS SUITE GUARDS AGAINST: the landing page's title and
 * description used to be a literal string baked into a vendored Next.js
 * template's compiled output. Every installation that adopted the template
 * inherited whichever business last edited that file. This is the
 * per-installation source of truth instead - `PanelSettings`-backed, so it
 * survives a template swap and never touches a compiled asset.
 */
final class LandingSeoSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_defaults_are_generic_not_a_placeholder(): void
    {
        $seo = LandingSeoSettings::load();

        $this->assertNotSame('', trim($seo->title));
        $this->assertNotSame('', trim($seo->description));
        $this->assertStringNotContainsString('Change this', $seo->description);
    }

    public function test_a_saved_value_round_trips(): void
    {
        (new LandingSeoSettings(
            title: 'Acme Fibre — Home Internet',
            description: 'Fast home internet, installed this week.',
            businessName: 'Acme Fibre',
            locale: 'en_US',
        ))->save();

        $loaded = LandingSeoSettings::load();

        $this->assertSame('Acme Fibre — Home Internet', $loaded->title);
        $this->assertSame('Fast home internet, installed this week.', $loaded->description);
        $this->assertSame('Acme Fibre', $loaded->businessName);
        $this->assertSame('en_US', $loaded->locale);
    }

    public function test_a_blank_stored_field_falls_back_to_the_default_rather_than_rendering_empty(): void
    {
        $seo = LandingSeoSettings::fromArray(['title' => '', 'businessName' => '   ']);

        $this->assertNotSame('', $seo->title);
        $this->assertNotSame('', trim($seo->businessName));
    }
}
