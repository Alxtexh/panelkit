<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Alxtexh\Panel\Pages\SitemapPage;
use Alxtexh\Panel\Support\Sitemap;
use Tests\TestCase;

/**
 * A sitemap.xml for the one part of an admin panel that is public.
 *
 * WHY THIS FILE EXISTS BEYOND ASSERTING THE MECHANISM. It was built after
 * researching every competing tool - Filament plugins, the Laravel packages,
 * the protocol itself - and DELIBERATELY leaving out what they all ship: a
 * crawler, model integration, images/video/news, and a ping to Google that
 * has 404'd since 2023. What is here is the part an admin panel actually
 * needs, and the tests below are as much a record of that scope as of the
 * code.
 *
 * Relative registrations are made absolute before writing, so the protocol
 * cannot silently receive an unusable `<loc>`.
 */
final class SitemapTest extends TestCase
{
    use RefreshDatabase;

    private const TEST_INDEXNOW_KEY = 'test1234test1234test1234test1234';

    private string $originalRobotsTxt;

    protected function setUp(): void
    {
        parent::setUp();

        /*
         * CAPTURED, NOT ASSUMED. `robots.txt` is on by default now, and every
         * `write()` call in this file touches the REAL file at
         * `public_path()` - the same one the repository tracks. Restoring
         * from a captured original in `tearDown()`, rather than deleting the
         * file or hand-writing a fixed string back, is what keeps a test run
         * from leaving a diff in a file this class did not create.
         */
        $this->originalRobotsTxt = File::get(public_path('robots.txt'));
    }

    protected function tearDown(): void
    {
        Sitemap::forget();
        config([
            'panel.sitemap.robots_txt' => true,
            'panel.sitemap.indexnow.key' => null,
        ]);

        File::put(public_path('robots.txt'), $this->originalRobotsTxt);
        File::delete(public_path(Sitemap::filename()));
        File::delete(public_path(self::TEST_INDEXNOW_KEY.'.txt'));

        for ($i = 1; $i <= 3; $i++) {
            File::delete(public_path("sitemap-{$i}.xml"));
        }

        parent::tearDown();
    }

    private function operator(): User
    {
        return User::factory()->roleless()->create(['tenant_id' => $this->tenantId()]);
    }

    /** @param  list<string>  $abilities */
    private function operatorWith(array $abilities): User
    {
        return User::factory()->withAbilities($abilities)->create(['tenant_id' => $this->tenantId()]);
    }

    private function tenantId(): int|string|null
    {
        return User::query()->whereNotNull('tenant_id')->value('tenant_id')
            ?? Tenant::create(['name' => 'Acme', 'slug' => 'sitemap-acme'])->getKey();
    }

    /* ------------------------------------------------------- registration */

    public function test_it_is_empty_with_nothing_registered(): void
    {
        $this->assertTrue(Sitemap::isEmpty());
        $this->assertSame([], Sitemap::urls());
    }

    public function test_add_registers_one_url_directly(): void
    {
        Sitemap::add('https://example.test/pricing');

        $this->assertSame(['https://example.test/pricing'], array_column(Sitemap::urls(), 'loc'));
    }

    /**
     * A relative path given to `add()` is made absolute before writing.
     */
    public function test_a_relative_registration_is_made_absolute(): void
    {
        Sitemap::add('/blog/hello-world');

        $this->assertSame(url('/blog/hello-world'), Sitemap::urls()[0]['loc']);
    }

    /**
     * A SOURCE IS RESOLVED ONLY WHEN `urls()` IS CALLED, not at registration
     * time - the whole point of accepting a closure rather than a list.
     */
    public function test_a_source_closure_is_not_called_until_urls_is_resolved(): void
    {
        config(['panel.landing.route' => false]);

        $calls = 0;

        Sitemap::source(function () use (&$calls) {
            $calls++;

            return ['https://example.test/from-source'];
        });

        $this->assertSame(0, $calls, 'The closure ran at registration time rather than at resolution time.');

        Sitemap::urls();

        $this->assertSame(1, $calls);
    }

    /** A source may yield plain strings or the full entry shape. */
    public function test_a_source_may_yield_full_entries(): void
    {
        config(['panel.landing.route' => false]);

        Sitemap::source(fn () => [
            ['loc' => 'https://example.test/a', 'priority' => 0.3, 'changefreq' => 'weekly'],
        ]);

        $url = Sitemap::urls()[0];

        $this->assertSame(0.3, $url['priority']);
        $this->assertSame('weekly', $url['changefreq']);
    }

    /* ------------------------------------------------------ normalisation */

    public function test_an_empty_loc_is_dropped(): void
    {
        config(['panel.landing.route' => false]);

        Sitemap::add('   ');

        $this->assertSame([], Sitemap::urls());
    }

    public function test_priority_is_clamped_to_the_protocols_range(): void
    {
        config(['panel.landing.route' => false]);

        Sitemap::add('https://example.test/a', priority: 5.0);
        Sitemap::add('https://example.test/b', priority: -3.0);

        $priorities = array_column(Sitemap::urls(), 'priority');

        $this->assertSame([1.0, 0.0], $priorities);
    }

    /** A changefreq outside the protocol's fixed set is dropped rather than written literally. */
    public function test_an_invalid_changefreq_is_dropped_to_null(): void
    {
        config(['panel.landing.route' => false]);

        Sitemap::add('https://example.test/a', changefreq: 'constantly');

        $this->assertNull(Sitemap::urls()[0]['changefreq']);
    }

    public function test_a_valid_changefreq_survives(): void
    {
        config(['panel.landing.route' => false]);

        Sitemap::add('https://example.test/a', changefreq: 'daily');

        $this->assertSame('daily', Sitemap::urls()[0]['changefreq']);
    }

    /**
     * DUPLICATE `loc`s COLLAPSE TO ONE ENTRY, LAST REGISTRATION WINNING - so an
     * application registering the same URL the built-in landing entry already
     * covers overrides it rather than producing two `<url>` blocks for one
     * address, which every sitemap validator flags.
     */
    public function test_duplicate_locations_collapse_with_the_last_one_winning(): void
    {
        config(['panel.landing.route' => false]);

        Sitemap::add('https://example.test/a', priority: 0.1);
        Sitemap::add('https://example.test/a', priority: 0.9);

        $urls = Sitemap::urls();

        $this->assertCount(1, $urls);
        $this->assertSame(0.9, $urls[0]['priority']);
    }

    public function test_isempty_reflects_normalisation_not_raw_registration(): void
    {
        config(['panel.landing.route' => false]);

        Sitemap::add('   ');

        $this->assertTrue(Sitemap::isEmpty(), 'A registration that normalises to nothing must count as nothing.');
    }

    /* -------------------------------------------------------------- write */

    public function test_write_produces_a_valid_urlset(): void
    {
        config(['panel.landing.route' => false, 'app.url' => 'https://example.test']);

        Sitemap::add('https://example.test/pricing', changefreq: 'weekly', priority: 0.8);

        $result = Sitemap::write();

        $this->assertSame(['sitemap.xml'], $result['files']);
        $this->assertSame(1, $result['count']);

        $xml = simplexml_load_file(public_path('sitemap.xml'));

        $this->assertNotFalse($xml, 'The written file is not valid XML.');
        $this->assertSame(
            'http://www.sitemaps.org/schemas/sitemap/0.9',
            $xml->getNamespaces()[''],
        );
        $this->assertCount(1, $xml->url);
        $this->assertSame('https://example.test/pricing', (string) $xml->url[0]->loc);
        $this->assertSame('weekly', (string) $xml->url[0]->changefreq);
        $this->assertSame('0.8', (string) $xml->url[0]->priority);
    }

    /**
     * `&` IN A URL IS ESCAPED, not written literally - `XMLWriter` does this,
     * and the assertion exists so replacing it with string concatenation
     * someday fails loudly rather than shipping a sitemap that does not parse.
     */
    public function test_special_characters_in_a_url_are_escaped(): void
    {
        config(['panel.landing.route' => false]);

        Sitemap::add('https://example.test/search?a=1&b=2');
        Sitemap::write();

        $raw = File::get(public_path('sitemap.xml'));

        $this->assertStringContainsString('&amp;', $raw);
        $this->assertStringNotContainsString('a=1&b=2<', $raw);

        // And it round-trips back to the real value when parsed.
        $xml = simplexml_load_file(public_path('sitemap.xml'));
        $this->assertSame('https://example.test/search?a=1&b=2', (string) $xml->url[0]->loc);
    }

    public function test_exists_and_generated_at_are_false_and_null_before_any_write(): void
    {
        config(['panel.landing.route' => false]);

        $this->assertFalse(Sitemap::exists());
        $this->assertNull(Sitemap::generatedAt());
    }

    public function test_exists_and_generated_at_reflect_a_real_write(): void
    {
        config(['panel.landing.route' => false]);

        Sitemap::add('https://example.test/a');
        Sitemap::write();

        $this->assertTrue(Sitemap::exists());
        $this->assertNotNull(Sitemap::generatedAt());
        $this->assertEqualsWithDelta(time(), Sitemap::generatedAt()->getTimestamp(), 5);
    }

    /**
     * MORE THAN 50,000 DECLARED URLS SPLITS INTO PARTS BEHIND AN INDEX - the
     * shape `sitemaps.org` itself specifies for exceeding the per-file limit.
     *
     * A closure source rather than 50,001 calls to `add()`: the count is what
     * matters here, not the content, and generating it as an array literal
     * would make this test itself the slow thing in the suite.
     */
    public function test_more_than_the_per_file_limit_splits_into_an_index(): void
    {
        config(['panel.landing.route' => false, 'app.url' => 'https://example.test']);

        Sitemap::source(function () {
            for ($i = 0; $i < Sitemap::MAX_URLS_PER_FILE + 5; $i++) {
                yield "/p/{$i}";
            }
        });

        $result = Sitemap::write();

        $this->assertSame(Sitemap::MAX_URLS_PER_FILE + 5, $result['count']);
        $this->assertSame(['sitemap-1.xml', 'sitemap-2.xml', 'sitemap.xml'], $result['files']);

        $index = simplexml_load_file(public_path('sitemap.xml'));
        $this->assertSame('sitemapindex', $index->getName());
        $this->assertCount(2, $index->sitemap);

        $part1 = simplexml_load_file(public_path('sitemap-1.xml'));
        $part2 = simplexml_load_file(public_path('sitemap-2.xml'));

        $this->assertCount(Sitemap::MAX_URLS_PER_FILE, $part1->url);
        $this->assertCount(5, $part2->url);
    }

    public function test_write_with_nothing_registered_still_produces_a_valid_empty_urlset(): void
    {
        config(['panel.landing.route' => false]);

        $result = Sitemap::write();

        $this->assertSame(0, $result['count']);

        $xml = simplexml_load_file(public_path('sitemap.xml'));
        $this->assertCount(0, $xml->url);
    }

    /* -------------------------------------------------------------- page */

    public function test_the_page_is_stable_when_nothing_is_public(): void
    {
        $this->assertTrue(SitemapPage::isEnabled());
    }

    public function test_the_page_appears_once_a_public_url_is_registered(): void
    {
        Sitemap::add('/');

        $this->assertTrue(SitemapPage::isEnabled());
    }

    public function test_seeing_and_generating_are_separate_abilities(): void
    {
        $this->assertSame('view_sitemap', SitemapPage::ability());
        $this->assertSame(['generate' => 'manage_sitemap'], SitemapPage::actions());
    }

    /** Viewing the screen shows what is declared, without requiring the file to exist. */
    public function test_the_page_renders_with_the_declared_urls(): void
    {
        Sitemap::add('/');

        $props = $this->actingAs($this->operatorWith(['view_sitemap']))
            ->get('/sitemap')
            ->assertOk()
            ->viewData('page')['props'];

        $this->assertCount(1, $props['urls']);
        $this->assertSame(url('/'), $props['urls'][0]['loc']);
        $this->assertFalse($props['exists']);
        $this->assertNull($props['generatedAt']);
    }

    /** Viewing it is refused without the ability - the mechanism, not a controller guard. */
    public function test_viewing_the_page_is_refused_without_the_ability(): void
    {
        Sitemap::add('/');

        $this->actingAs($this->operator())
            ->get('/sitemap')
            ->assertForbidden();
    }

    /**
     * GENERATING WRITES THE FILE, THROUGH THE REAL HTTP ENDPOINT - not a direct
     * call to `Sitemap::write()`, because this is the path that proves the
     * ability gate, the route and the handler all agree with each other.
     */
    public function test_generating_writes_the_file_through_the_real_endpoint(): void
    {
        Sitemap::add('/');

        $this->actingAs($this->operatorWith(['view_sitemap', 'manage_sitemap']))
            ->post('/sitemap/generate')
            ->assertRedirect();

        $this->assertTrue(Sitemap::exists());

        $xml = simplexml_load_file(public_path('sitemap.xml'));
        $this->assertSame(url('/'), (string) $xml->url[0]->loc);
    }

    /**
     * SEEING THE SCREEN DOES NOT MEAN BEING ABLE TO REWRITE THE FILE THE WEB
     * SERVER HANDS TO THE PUBLIC INTERNET - the same reasoning `EnvironmentPage`
     * and `OrganisationPage` apply to their own write actions.
     */
    public function test_generating_is_refused_to_an_operator_who_can_only_view(): void
    {
        Sitemap::add('/');

        $this->actingAs($this->operatorWith(['view_sitemap']))
            ->post('/sitemap/generate')
            ->assertForbidden();

        $this->assertFalse(Sitemap::exists());
    }

    /** The action sits on the page's own address, exactly as `OrganisationPage::update()` does. */
    public function test_the_generate_route_is_a_post_to_the_pages_own_address(): void
    {
        $this->assertSame(['generate' => 'post'], SitemapPage::actionMethods());
        $this->assertSame(['generate' => 'generate'], SitemapPage::actionUris());
    }
}
