<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Tests\TestCase;

/**
 * `ResourceIndex.vue`'s `onRowClick()` used to search the row's own ACTION
 * MENU for an entry literally keyed `view`, on the theory the menu would
 * naturally carry one, filtered per-record by policy. It never does -
 * `Resource::definition()` adds no automatic View/Edit row action, only
 * Delete plus whatever a resource explicitly declares - so the lookup
 * always failed. `->rowClick('view')` set `cursor: pointer` on every row
 * correctly (a separate code path, reading `schema.table.rowClick`
 * directly), but clicking a row did nothing: the feature LOOKED wired and
 * was not, exactly the failure class this whole pass exists to close for
 * `SelectField::relationship()` inside a RelationManager. A docs-only
 * fresh-developer test caught it by clicking an actual row in a real
 * browser, not by reading the source.
 *
 * A SOURCE ASSERTION, not a rendered-DOM one, for the same reason
 * `ResourceViewSectionRhythmTest` is: `ResourceIndex.vue` is a
 * client-hydrated Inertia page, so there is nothing a PHP feature test can
 * click over HTTP. This instead proves the fix is WIRED: the handler builds
 * the record URL directly, the way the sibling primary-column `<Link>`
 * elsewhere on the same page already does, rather than searching a menu
 * that was never guaranteed to carry a `view` entry.
 */
final class ResourceIndexRowClickTest extends TestCase
{
    private function source(): string
    {
        $path = dirname(__DIR__, 4).'/packages/ui/inertia/pages/ResourceIndex.vue';

        $source = file_get_contents($path);
        $this->assertNotFalse($source, "Missing file: {$path}");

        return $source;
    }

    public function test_row_click_navigates_to_the_record_url_directly(): void
    {
        $this->assertStringContainsString(
            'router.visit(`${props.schema.routes.index}/${row.id}`)',
            $this->source(),
            'onRowClick() must build the record URL directly - see this file\'s own docblock for why '
            .'searching the row action menu for a "view" entry silently never navigated.',
        );
    }

    public function test_on_row_click_itself_no_longer_searches_the_action_menu(): void
    {
        $source = $this->source();
        $start = strpos($source, 'function onRowClick(');
        $this->assertNotFalse($start, 'onRowClick() not found in ResourceIndex.vue.');

        $end = strpos($source, "\n}\n", $start);
        $body = substr($source, $start, ($end !== false ? $end - $start : 400));

        $this->assertStringNotContainsString(
            'menuFor(row)',
            $body,
            'onRowClick() must not go back to searching the row\'s action menu for a "view" entry - '
            .'no resource in this codebase declares one explicitly, so that lookup always silently failed.',
        );
    }
}
