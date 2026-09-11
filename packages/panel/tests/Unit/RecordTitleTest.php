<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Unit;

use Alxtexh\Panel\Tests\Fixtures\Resources\ArticleResource;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Database\Eloquent\Model;

/**
 * `Resource::recordTitle()` - the View page's title used to fall back to a
 * literal `record.name ?? "#{id}"` on the CLIENT, checking only one attribute
 * name. A model whose display field was `full_name`, `title`, or `label`
 * (never `name`) showed its raw numeric ID as the page title instead, which
 * reads as an accident rather than a design choice - see ResourceView.vue's
 * `title` computed and ResourceController::show()'s `_title` key.
 */
final class RecordTitleTest extends TestCase
{
    private function modelWith(array $attributes): Model
    {
        $model = new class extends Model
        {
            protected $guarded = [];

            public $timestamps = false;
        };

        $model->forceFill($attributes);

        return $model;
    }

    public function test_prefers_name_when_present(): void
    {
        $record = $this->modelWith(['name' => 'Acme Fibre', 'title' => 'Should not win']);

        self::assertSame('Acme Fibre', ArticleResource::recordTitle($record));
    }

    public function test_falls_back_through_title_full_name_subject_number_code_label_email_in_order(): void
    {
        self::assertSame('A Title', ArticleResource::recordTitle(
            $this->modelWith(['title' => 'A Title', 'full_name' => 'Not this'])
        ));

        self::assertSame('Jaylan Jast', ArticleResource::recordTitle(
            $this->modelWith(['full_name' => 'Jaylan Jast', 'subject' => 'Not this'])
        ));

        self::assertSame('A Subject Line', ArticleResource::recordTitle(
            $this->modelWith(['subject' => 'A Subject Line', 'number' => 'Not this'])
        ));

        self::assertSame('INV-0001', ArticleResource::recordTitle(
            $this->modelWith(['number' => 'INV-0001', 'code' => 'Not this'])
        ));

        self::assertSame('SKU-42', ArticleResource::recordTitle(
            $this->modelWith(['code' => 'SKU-42', 'label' => 'Not this'])
        ));

        self::assertSame('A Label', ArticleResource::recordTitle(
            $this->modelWith(['label' => 'A Label', 'email' => 'not-this@example.test'])
        ));

        self::assertSame('someone@example.test', ArticleResource::recordTitle(
            $this->modelWith(['email' => 'someone@example.test'])
        ));
    }

    /**
     * `subject`/`number`/`code` are the same literal, safe candidates
     * `MakeResourceCommand::inferTitleAttribute()` already trusts to guess a
     * RELATED model's display attribute - added here after a six-resource
     * consistency pass found a Ticket-shaped resource (a plain `subject`
     * column, no `name`/`title`/`full_name`) showing `#id` with zero code
     * changed.
     */
    public function test_recognises_subject_number_and_code_as_display_attributes(): void
    {
        self::assertSame('Server is down', ArticleResource::recordTitle(
            $this->modelWith(['subject' => 'Server is down'])
        ));

        self::assertSame('ORD-1001', ArticleResource::recordTitle(
            $this->modelWith(['number' => 'ORD-1001'])
        ));

        self::assertSame('WID-42', ArticleResource::recordTitle(
            $this->modelWith(['code' => 'WID-42'])
        ));
    }

    /**
     * DELIBERATELY LITERAL, NOT SUFFIX-MATCHED - a `phone_number` was never
     * meant to identify the record, and must not become its title just
     * because it ends in `number`.
     */
    public function test_does_not_pattern_match_a_prefixed_column_like_phone_number(): void
    {
        self::assertNull(ArticleResource::recordTitle(
            $this->modelWith(['phone_number' => '+1 555 0100'])
        ));
    }

    public function test_returns_null_when_no_candidate_attribute_exists(): void
    {
        self::assertNull(ArticleResource::recordTitle($this->modelWith(['status' => 'draft'])));
    }

    public function test_returns_null_for_blank_or_whitespace_only_values(): void
    {
        self::assertNull(ArticleResource::recordTitle($this->modelWith(['name' => '   '])));
        self::assertNull(ArticleResource::recordTitle($this->modelWith(['name' => ''])));
    }

    /**
     * Overridability itself is a PHP guarantee (the method is public static,
     * not final) rather than something to assert on a fixture - ArticleResource
     * is declared `final class`, same as every generated resource, so a
     * real override lives on a HOST's own resource class, not a fixture here.
     */
    public function test_record_title_is_not_final_and_can_be_overridden_by_a_resource(): void
    {
        $method = new \ReflectionMethod(ArticleResource::class, 'recordTitle');

        self::assertFalse($method->isFinal());
    }
}
