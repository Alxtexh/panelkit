<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Support\AppearancePrepaint;
use Alxtexh\Panel\Tests\TestCase;

final class AppearancePrepaintTest extends TestCase
{
    public function test_payload_applies_saved_primary_before_any_client_bundle(): void
    {
        $payload = AppearancePrepaint::payload([
            'theme' => 'dark',
            'primary' => 'rose',
            'fontSize' => 18,
        ]);

        $this->assertTrue($payload['dark']);
        $this->assertSame('dark', $payload['theme']);
        $this->assertSame('oklch(0.62 0.22 15)', $payload['vars']['--primary']);
        $this->assertSame('18px', $payload['vars']['--pk-font-size']);
    }

    public function test_defaults_match_the_client_light_slate_baseline(): void
    {
        $payload = AppearancePrepaint::defaults();

        $this->assertFalse($payload['dark']);
        $this->assertSame('light', $payload['theme']);
        $this->assertSame('oklch(0.24 0.02 260)', $payload['vars']['--primary']);
        $this->assertSame('16px', $payload['vars']['--pk-font-size']);
    }

    public function test_css_from_payload_emits_root_custom_properties(): void
    {
        $css = AppearancePrepaint::cssFromPayload(AppearancePrepaint::payload([
            'theme' => 'dark',
            'primary' => 'rose',
        ]));

        $this->assertStringStartsWith(':root {', $css);
        $this->assertStringContainsString('--primary: oklch(0.62 0.22 15);', $css);
        $this->assertStringContainsString('--pk-font-size: 16px;', $css);
    }

    public function test_appearance_prepaint_view_embeds_payload_before_assets_in_stub(): void
    {
        $stub = (string) file_get_contents(
            dirname(__DIR__, 2).'/resources/stubs/app.blade.php.stub'
        );
        $view = (string) file_get_contents(
            dirname(__DIR__, 2).'/resources/views/appearance-prepaint.blade.php'
        );

        $this->assertStringContainsString("@include('panel::appearance-prepaint')", $stub);

        $includePos = strpos($stub, "@include('panel::appearance-prepaint')");
        $assetPos = strpos($stub, "asset('vendor/panel/app.css')");

        $this->assertNotFalse($includePos);
        $this->assertNotFalse($assetPos);
        $this->assertLessThan($assetPos, $includePos, 'Prepaint must run before kit CSS/JS.');

        $this->assertStringContainsString('window.__panelAppearance =', $view);
        $this->assertStringContainsString('window.__panelAppearanceServerVars =', $view);
        $this->assertStringContainsString('window.__panelAppearanceDefaultVars =', $view);
        $this->assertStringContainsString('id="pk-appearance"', $view);
        $this->assertStringContainsString('__panelAppearanceApplied', $view);
        $this->assertStringContainsString('style.setProperty', $view);

        $jsonPos = strpos($view, 'window.__panelAppearance =');
        $stylePos = strpos($view, '<style id="pk-appearance">');
        $applyPos = strpos($view, 'window.__panelAppearanceApplied = true');

        $this->assertNotFalse($jsonPos);
        $this->assertNotFalse($stylePos);
        $this->assertNotFalse($applyPos);
        $this->assertLessThan($stylePos, $jsonPos, 'Account JSON must precede critical CSS.');
        $this->assertLessThan($applyPos, $stylePos, 'Critical CSS must precede the apply script.');
    }
}
