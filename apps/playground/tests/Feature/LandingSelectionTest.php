<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use App\Panel\Pages;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/** The single public landing is selected, edited and published safely. */
final class LandingSelectionTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $tenant = Tenant::create(['name' => 'Acme', 'slug' => 'acme']);
        $this->admin = User::factory()->create([
            'tenant_id' => $tenant->id,
            'email_verified_at' => now(),
        ]);
    }

    public function test_a_fresh_demo_has_one_active_public_landing(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('window.__PANELKIT_PUBLIC_LANDING__', false)
            ->assertSee('src="/panelkit/landings/chanseek/app/landing/"', false)
            ->assertSee('<title>PanelKit</title>', false)
            ->assertSee('window.top.location.assign(destination)', false)
            ->assertSee('content.primaryHref', false);

        self::assertSame(
            'chanseek',
            Pages::landingConfiguration()['selected'],
        );
    }

    public function test_selected_landing_is_persisted_and_served_from_public_root(): void
    {
        $slugs = array_column(Pages::landingTemplates(), 'slug');

        $this->actingAs($this->admin)
            ->from('/landing-pages')
            ->post('/landing-pages/save', [
                'selected' => 'hotel',
                'enabled' => $slugs,
                'order' => $slugs,
            ])
            ->assertRedirect('/landing-pages');

        $this->get('/')
            ->assertOk()
            ->assertSee('src="/panelkit/landings/hotel/app/en/"', false);
    }

    public function test_cms_can_preview_any_allowlisted_design_through_the_public_root(): void
    {
        $this->get('/?preview=hotel')
            ->assertOk()
            ->assertSee('src="/panelkit/landings/hotel/app/en/"', false);

        $this->get('/?preview=not-a-real-design')
            ->assertOk()
            ->assertSee('src="/panelkit/landings/chanseek/app/landing/"', false);
    }

    /** Every shipped preset uses the same host-owned CTA bridge at `/`. */
    public function test_every_landing_preset_is_wired_to_the_host_redirects(): void
    {
        $slugs = array_column(Pages::landingTemplates(), 'slug');

        foreach (Pages::landingTemplates() as $template) {
            $this->actingAs($this->admin)
                ->from('/landing-pages')
                ->post('/landing-pages/save', [
                    'selected' => $template['slug'],
                    'enabled' => $slugs,
                    'order' => $slugs,
                ])
                ->assertRedirect('/landing-pages');

            $this->get('/')
                ->assertOk()
                ->assertSee('src="'.$template['href'].'"', false)
                ->assertSee('window.top.location.assign(destination)', false)
                ->assertSee("return '/dashboard';", false)
                ->assertSee("return '/login';", false);
        }
    }

    public function test_disabled_landing_cannot_become_the_public_selection(): void
    {
        $slugs = array_column(Pages::landingTemplates(), 'slug');

        $this->actingAs($this->admin)
            ->from('/landing-pages')
            ->post('/landing-pages/save', [
                'selected' => 'hotel',
                'enabled' => array_values(array_diff($slugs, ['hotel'])),
                'order' => $slugs,
            ])
            ->assertRedirect('/landing-pages')
            ->assertSessionHasErrors('selected');

        $this->get('/')->assertOk();
    }

    public function test_landing_cms_draft_and_publish_are_separate(): void
    {
        $slugs = array_column(Pages::landingTemplates(), 'slug');
        $content = Pages::landingContentDefaults();
        $content['headline'] = 'A draft headline';

        $this->actingAs($this->admin)
            ->from('/landing-pages')
            ->post('/landing-pages/save', [
                'selected' => 'chanseek',
                'enabled' => $slugs,
                'order' => $slugs,
                'content' => $content,
            ])
            ->assertRedirect('/landing-pages');

        self::assertSame(
            Pages::landingContentDefaults()['headline'],
            Pages::landingConfiguration()['published']['headline'],
        );
        self::assertSame('A draft headline', Pages::landingConfiguration()['draft']['headline']);

        $this->actingAs($this->admin)
            ->from('/landing-pages')
            ->post('/landing-pages/publish', [
                'selected' => 'chanseek',
                'enabled' => $slugs,
                'order' => $slugs,
                'content' => $content,
            ])
            ->assertRedirect('/landing-pages');

        self::assertSame('A draft headline', Pages::landingConfiguration()['published']['headline']);
    }

    public function test_published_media_and_visual_overrides_are_applied_to_the_public_document(): void
    {
        $slugs = array_column(Pages::landingTemplates(), 'slug');
        $content = Pages::landingContentDefaults();
        $content['siteName'] = 'Acme Cloud';
        $content['eyebrow'] = 'A better operating system';
        $content['headline'] = 'Ship your work with confidence';
        $content['logoUrl'] = '/storage/landing-media/logo.png';
        $content['heroImageUrl'] = '/storage/landing-media/hero.webp';
        $content['socialImageUrl'] = '/storage/landing-media/social.jpg';
        $content['overrides'] = [[
            'label' => 'Feature title',
            'selector' => '[data-feature-title]',
            'type' => 'text',
            'value' => 'One source of truth',
            'alt' => '',
        ]];

        $this->actingAs($this->admin)
            ->from('/landing-pages')
            ->post('/landing-pages/publish', [
                'selected' => 'chanseek',
                'enabled' => $slugs,
                'order' => $slugs,
                'content' => $content,
            ])
            ->assertRedirect('/landing-pages');

        $this->get('/')
            ->assertOk()
            ->assertSee('Acme Cloud', false)
            ->assertSee('/storage/landing-media/hero.webp', false)
            ->assertSee('[data-feature-title]', false)
            ->assertSee('One source of truth', false);
    }

    public function test_landing_media_upload_returns_a_public_editor_url(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->admin)
            ->post('/landing-pages/media/upload', [
                'file' => UploadedFile::fake()->image('hero.png'),
            ]);

        $response->assertCreated()
            ->assertJsonPath('name', 'hero.png')
            ->assertJsonStructure(['url', 'name', 'size']);

        self::assertCount(1, Storage::disk('public')->allFiles('landing-media'));
    }

    public function test_each_landing_design_keeps_its_own_content_revision(): void
    {
        $slugs = array_column(Pages::landingTemplates(), 'slug');
        $chanseek = Pages::landingContentDefaults();
        $chanseek['headline'] = 'Chanseek headline';
        $hotel = Pages::landingContentDefaults();
        $hotel['headline'] = 'Hotel headline';

        $this->actingAs($this->admin)
            ->from('/landing-pages')
            ->post('/landing-pages/save', [
                'selected' => 'chanseek',
                'enabled' => $slugs,
                'order' => $slugs,
                'content' => $chanseek,
            ])
            ->assertRedirect('/landing-pages');

        $this->actingAs($this->admin)
            ->from('/landing-pages')
            ->post('/landing-pages/save', [
                'selected' => 'hotel',
                'enabled' => $slugs,
                'order' => $slugs,
                'content' => $hotel,
            ])
            ->assertRedirect('/landing-pages');

        self::assertSame('Chanseek headline', Pages::landingConfiguration()['drafts']['chanseek']['headline']);
        self::assertSame('Hotel headline', Pages::landingConfiguration()['drafts']['hotel']['headline']);
    }
}
