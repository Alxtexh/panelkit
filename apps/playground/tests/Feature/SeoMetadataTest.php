<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Seo\HasSeo;
use Alxtexh\Panel\Seo\Seo;
use Alxtexh\Panel\Seo\SeoAnalyser;
use Alxtexh\Panel\Seo\SeoMetadata;
use Alxtexh\Panel\Seo\SeoSchema;
use Alxtexh\Panel\Support\Sitemap;
use Tests\TestCase;

/**
 * Per-record search metadata, and the one integration it exists for.
 *
 * THE INTEGRATION IS THE POINT, and it is what the three Filament SEO plugins
 * this was modelled on cannot do: each stores metadata and none generates a
 * sitemap, so `noindex` reaches a meta tag while sitemap.xml keeps advertising
 * the URL. The cases below that matter most are the last three - a noindexed
 * record must not be listed, and a canonical must replace the URL it was
 * registered under.
 *
 * THE ANALYSER IS PINNED TO ITS THRESHOLDS rather than to a score, because a
 * score is a summary and summaries drift. Asserting "a 74-character title warns"
 * fails when somebody changes the rule; asserting "the score is 90" fails when
 * anybody adds any rule at all, which trains people to update the number.
 */
final class SeoMetadataTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A table that exists only for these tests.
     *
     * NOT THE DEMO'S `plans`, DELIBERATELY. Borrowing a real table couples this
     * suite to columns it does not care about - the first attempt failed on
     * `tenant_id`, then on `speed_mbps`, and would have failed again on whatever
     * is added next. What is under test is a polymorphic relationship, an
     * analyser and a sitemap filter; none of them has an opinion about fibre
     * speeds, so the fixture carries exactly one column.
     */
    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('seo_fixtures', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
        });
    }

    protected function tearDown(): void
    {
        Sitemap::forget();
        Schema::dropIfExists('seo_fixtures');

        parent::tearDown();
    }

    private function metadata(array $attributes = []): SeoMetadata
    {
        return new SeoMetadata($attributes);
    }

    private function plan(string $name): SeoPlan
    {
        return SeoPlan::query()->create(['name' => $name]);
    }

    public function test_the_trait_returns_an_unsaved_instance_rather_than_null(): void
    {
        $plan = $this->plan('Fibre 20');

        $metadata = $plan->seoOrNew();

        $this->assertInstanceOf(SeoMetadata::class, $metadata);
        $this->assertFalse($metadata->exists, 'Reading SEO must not write a row.');
        $this->assertSame($plan->getKey(), $metadata->seoable_id);
    }

    /**
     * READING MUST NOT WRITE. A list screen resolving SEO for twenty rows would
     * otherwise insert twenty rows by being looked at, and fail outright against
     * a read replica.
     */
    public function test_reading_seo_inserts_nothing(): void
    {
        $plan = $this->plan('Fibre 20');

        $plan->seoOrNew();
        $plan->seoOrNew();

        $this->assertSame(0, SeoMetadata::query()->count());
    }

    public function test_writing_creates_the_row_then_updates_it(): void
    {
        $plan = $this->plan('Fibre 20');

        $plan->writeSeo(['title' => 'Fibre 20 Mbps']);
        $this->assertSame(1, SeoMetadata::query()->count());

        $plan->writeSeo(['title' => 'Fibre 20 Mbps home broadband']);

        $this->assertSame(1, SeoMetadata::query()->count());
        $this->assertSame('Fibre 20 Mbps home broadband', $plan->seo->title);
    }

    /**
     * THE PAYLOAD IS A REQUEST BODY, so it is filtered. `$guarded = []` on the
     * model means an unfiltered fill would let a form reassign the row to another
     * record entirely by posting `seoable_id`.
     */
    public function test_writing_cannot_reassign_the_row_to_another_record(): void
    {
        $plan = $this->plan('Fibre 20');
        $other = $this->plan('Fibre 50');

        $plan->writeSeo(['title' => 'Mine', 'seoable_id' => $other->getKey()]);

        $this->assertSame($plan->getKey(), $plan->seo->seoable_id);
    }

    public function test_keywords_are_normalised_on_read(): void
    {
        $metadata = $this->metadata(['keywords' => ['  fibre ', '', 'broadband', '   ']]);

        $this->assertSame(['fibre', 'broadband'], $metadata->keywordList());
    }

    /** A row can exist and say nothing - see `SeoMetadata::isEmpty()`. */
    public function test_an_existing_but_blank_row_is_empty(): void
    {
        $this->assertTrue($this->metadata()->isEmpty());
        $this->assertFalse($this->metadata(['title' => 'Something'])->isEmpty());
    }

    public function test_a_force_delete_removes_the_metadata(): void
    {
        $plan = $this->plan('Fibre 20');
        $plan->writeSeo(['title' => 'Fibre 20 Mbps']);

        $plan->delete();

        $this->assertSame(0, SeoMetadata::query()->count());
    }

    /* ---------------------------------------------------------------------
     * The analyser
     * ------------------------------------------------------------------ */

    public function test_a_missing_title_and_description_are_problems(): void
    {
        $result = SeoAnalyser::analyse($this->metadata());

        $severities = array_column($result['findings'], 'severity', 'key');

        $this->assertSame(SeoAnalyser::SEVERITY_PROBLEM, $severities['title']);
        $this->assertSame(SeoAnalyser::SEVERITY_PROBLEM, $severities['description']);
        $this->assertLessThan(50, $result['score']);
    }

    public function test_an_overlong_title_warns_rather_than_failing(): void
    {
        $result = SeoAnalyser::analyse($this->metadata([
            'title' => str_repeat('a', SeoAnalyser::TITLE_MAX + 14),
        ]));

        $severities = array_column($result['findings'], 'severity', 'key');

        $this->assertSame(SeoAnalyser::SEVERITY_WARNING, $severities['title']);
    }

    public function test_a_well_formed_page_scores_full_marks(): void
    {
        $result = SeoAnalyser::analyse($this->metadata([
            'title' => 'Fibre 20 Mbps home broadband, installed free',
            'description' => 'Unlimited 20 Mbps fibre for homes in Nairobi, with free installation and a router included. No contract, cancel any time.',
            'keywords' => ['fibre', 'broadband', 'nairobi'],
            'og_image' => 'https://example.test/card.png',
            'canonical' => 'https://example.test/plans/fibre-20',
        ]));

        $this->assertSame(100, $result['score']);

        foreach ($result['findings'] as $finding) {
            $this->assertSame(SeoAnalyser::SEVERITY_GOOD, $finding['severity'], $finding['key']);
        }
    }

    /**
     * ABSENT KEYWORDS ARE NOT A FAULT. Google has ignored the tag for over a
     * decade; flagging it would send an operator to spend time on the field with
     * the least evidence behind it.
     */
    public function test_absent_keywords_produce_no_finding(): void
    {
        $result = SeoAnalyser::analyse($this->metadata(['title' => 'A perfectly reasonable page title here']));

        $this->assertArrayNotHasKey('keywords', array_column($result['findings'], 'severity', 'key'));
    }

    public function test_repeated_keywords_are_reported(): void
    {
        $result = SeoAnalyser::analyse($this->metadata(['keywords' => ['fibre', 'Fibre']]));

        $severities = array_column($result['findings'], 'severity', 'key');

        $this->assertSame(SeoAnalyser::SEVERITY_WARNING, $severities['keywords']);
    }

    /* ---------------------------------------------------------------------
     * Head tags
     * ------------------------------------------------------------------ */

    public function test_tags_carry_open_graph_and_twitter_alongside_the_plain_name(): void
    {
        $tags = Seo::tags($this->metadata([
            'title' => 'Fibre 20',
            'description' => 'Fast fibre.',
            'og_image' => 'https://example.test/card.png',
        ]));

        $this->assertSame('Fibre 20', $tags['title']);
        $this->assertSame('Fibre 20', $tags['og:title']);
        $this->assertSame('Fibre 20', $tags['twitter:title']);

        // Without a card type the image is ignored and the link renders bare.
        $this->assertSame('summary_large_image', $tags['twitter:card']);
    }

    /** `robots: index` is every engine's default, so emitting it says nothing. */
    public function test_the_robots_tag_appears_only_when_noindex_is_set(): void
    {
        $this->assertArrayNotHasKey('robots', Seo::tags($this->metadata(['title' => 'x'])));
        $this->assertSame('noindex, nofollow', Seo::tags($this->metadata(['noindex' => true]))['robots']);
    }

    /* ---------------------------------------------------------------------
     * The integration none of the plugins has
     * ------------------------------------------------------------------ */

    public function test_a_noindexed_record_is_left_out_of_the_sitemap(): void
    {
        $listed = $this->plan('Listed');
        $hidden = $this->plan('Hidden');

        $listed->writeSeo(['title' => 'Listed']);
        $hidden->writeSeo(['title' => 'Hidden', 'noindex' => true]);

        Sitemap::source(fn (): array => [
            Seo::entry($listed, '/plans/listed'),
            Seo::entry($hidden, '/plans/hidden'),
        ]);

        $locs = array_column(Sitemap::urls(), 'loc');

        $this->assertContains(url('/plans/listed'), $locs);
        $this->assertNotContains(url('/plans/hidden'), $locs);
    }

    public function test_a_canonical_replaces_the_url_it_was_registered_under(): void
    {
        $plan = $this->plan('Fibre 20');
        $plan->writeSeo(['canonical' => 'https://example.test/plans/fibre-20']);

        Sitemap::source(fn (): array => [Seo::entry($plan, '/plans/47?ref=email')]);

        $locs = array_column(Sitemap::urls(), 'loc');

        /* Assert by containment because applications may register additional
         * public URLs through the sitemap extension point. */
        $this->assertContains('https://example.test/plans/fibre-20', $locs);
        $this->assertNotContains(url('/plans/47?ref=email'), $locs);
    }

    /**
     * TURNING THE ENFORCEMENT OFF LEAVES THE URL LISTED, which is the escape
     * hatch for an installation whose front end already reconciles the two.
     */
    public function test_enforcement_can_be_turned_off(): void
    {
        config(['panel.seo.enforce_noindex' => false]);

        $hidden = $this->plan('Hidden');
        $hidden->writeSeo(['noindex' => true]);

        Sitemap::source(fn (): array => [Seo::entry($hidden, '/plans/hidden')]);

        $this->assertContains(url('/plans/hidden'), array_column(Sitemap::urls(), 'loc'));
    }

    /* ---------------------------------------------------------------------
     * The form
     * ------------------------------------------------------------------ */

    /**
     * THE KEYS ARE PREFIXED, and that is not cosmetic: a resource almost always
     * has a `title` of its own, and two fields sharing one key in a single form
     * is a silent overwrite.
     */
    public function test_the_schema_prefixes_every_key(): void
    {
        $children = SeoSchema::make()->toSchema()['children'];

        $keys = array_column($children, 'key');

        $this->assertSame([
            'seo_preview',
            'seo_title',
            'seo_description',
            'seo_keywords',
            'seo_og_image',
            'seo_canonical',
            'seo_noindex',
        ], $keys);
    }

    /** The preview leads, above the inputs it describes - see `SeoSchema`. */
    public function test_the_preview_comes_first_and_watches_the_right_fields(): void
    {
        $preview = SeoSchema::make()->toSchema()['children'][0];

        $this->assertSame('seo-preview', $preview['type']);
        $this->assertSame(
            ['title' => 'seo_title', 'description' => 'seo_description'],
            $preview['watch'],
        );
    }

    /**
     * THE THRESHOLDS TRAVEL FROM THE ANALYSER, so the colour the operator sees
     * and the severity the server reports cannot drift apart.
     */
    public function test_the_preview_carries_the_analysers_own_limits(): void
    {
        $preview = SeoSchema::make()->toSchema()['children'][0];

        $this->assertSame(SeoAnalyser::TITLE_MAX, $preview['limits']['titleMax']);
        $this->assertSame(SeoAnalyser::DESCRIPTION_MAX, $preview['limits']['descriptionMax']);
    }

    /**
     * THE PREVIEW STORES NOTHING. It has no column, so a payload carrying its
     * key must not reach the model - `omitsFromStorage` is the existing hook and
     * this pins that it is honoured.
     */
    public function test_the_preview_never_reaches_the_write_payload(): void
    {
        $form = Form::make()->schema([SeoSchema::make()]);

        $written = $form->sanitize([
            'seo_preview' => 'anything at all',
            'seo_title' => 'Fibre 20',
        ]);

        $this->assertArrayNotHasKey('seo_preview', $written);
        $this->assertSame('Fibre 20', $written['seo_title']);
    }

    /** The prefix goes on for the form and comes off again for the row. */
    public function test_form_payloads_round_trip_through_the_prefix(): void
    {
        $plan = $this->plan('Fibre 20');

        $plan->writeSeo(Seo::fromForm([
            'name' => 'ignored, not an SEO key',
            'seo_title' => 'Fibre 20 Mbps',
            'seo_noindex' => true,
        ]));

        $this->assertSame('Fibre 20 Mbps', $plan->seo->title);
        $this->assertTrue($plan->seo->noindex);

        $filled = Seo::toForm($plan->seo);

        $this->assertSame('Fibre 20 Mbps', $filled['seo_title']);
        $this->assertTrue($filled['seo_noindex']);
    }

    /**
     * A RECORD WITH NO METADATA FILLS THE FORM WITH BLANKS, not with nulls that
     * a toggle would render as indeterminate.
     */
    public function test_a_record_without_metadata_still_fills_the_form(): void
    {
        $filled = Seo::toForm(null);

        $this->assertNull($filled['seo_title']);
        $this->assertSame([], $filled['seo_keywords']);
        $this->assertFalse($filled['seo_noindex']);
    }

    /**
     * A MODEL WITHOUT THE TRAIT ANSWERS "no metadata" rather than fatalling. This
     * is called from application code, where a plain model is an ordinary
     * mistake and a fatal is a worse outcome than a true, survivable null.
     */
    public function test_a_model_without_the_trait_is_tolerated(): void
    {
        $this->assertNull(Seo::of(new Plan(['name' => 'Plain'])));
    }
}

/**
 * The trait under test, on the fixture table created in `setUp()`.
 *
 * ITS OWN MODEL AND ITS OWN TABLE. `Plan` is `final` - rightly - and borrowing
 * it would also mean these rows share a morph type with real application data.
 */
final class SeoPlan extends Model
{
    use HasSeo;

    protected $table = 'seo_fixtures';

    protected $guarded = [];

    public $timestamps = false;
}
