<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Tests\TestCase;

/**
 * `ResourceView.vue`'s page header and its infolist Sections used to be
 * direct siblings with NO gap mechanism between them at all - not merely
 * tight, absent: a live measurement on a Product View page with three
 * Sections (Details/Pricing & stock/Media & description) showed each
 * card's border-box touching the next with zero pixels between, relying
 * entirely on each card's own shadow/ring to read as separate. Meanwhile
 * the page's OWN header-to-first-section gap used a hardcoded Tailwind
 * `gap-4`, ignoring the user's chosen density - unlike `RecordForm.vue`
 * (Create/Edit), which already wrapped its equivalent stack in the shared,
 * density-aware `pk-form-stack` class (`--pk-form-gap`, protected by
 * `StylesheetParityTest`).
 *
 * A SOURCE ASSERTION, not a rendered-DOM one, because `ResourceView.vue`
 * is a client-hydrated Inertia page - the server returns only the JSON
 * props, never the rendered section markup, so there is nothing a PHP
 * feature test can inspect over HTTP. This instead proves the fix is
 * WIRED: the template applies the shared token in both places a plain
 * revert (a bare `<template>`, or `gap-4` typed back in) would silently
 * undo.
 */
final class ResourceViewSectionRhythmTest extends TestCase
{
    private function source(): string
    {
        $path = dirname(__DIR__, 4).'/packages/ui/inertia/pages/ResourceView.vue';

        $source = file_get_contents($path);
        $this->assertNotFalse($source, "Missing file: {$path}");

        return $source;
    }

    public function test_the_page_header_stack_uses_the_density_aware_gap(): void
    {
        $this->assertStringContainsString(
            "[PAGE_SHELL_COMPACT, 'pk-form-stack']",
            $this->source(),
            'The page header/body stack must use pk-form-stack (--pk-form-gap), not a hardcoded gap-4 - '
            .'see this class\'s own docblock for the live-measured bug this replaced.',
        );
    }

    public function test_multiple_infolist_sections_share_a_real_gap_wrapper(): void
    {
        $source = $this->source();

        $this->assertStringContainsString(
            '<div v-if="hasLayout" class="pk-form-stack">',
            $source,
            'Multiple root-level infolist Sections need a real gap wrapper - a bare <template v-if> '
            .'leaves adjacent Sections with zero pixels between them (see this file\'s own docblock).',
        );

        $this->assertStringNotContainsString(
            '<template v-if="hasLayout">',
            $source,
            'Reverting to a bare <template> wrapper removes the gap between infolist Sections entirely.',
        );
    }
}
