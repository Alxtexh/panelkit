<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Schema\Card;
use Alxtexh\Panel\Schema\Column;
use Alxtexh\Panel\Schema\Columns;
use Alxtexh\Panel\Schema\Grid;
use Alxtexh\Panel\Schema\Section;
use Alxtexh\Panel\Schema\Tab;
use Alxtexh\Panel\Tests\Fixtures\Models\Tenant;
use Alxtexh\Panel\Tests\Fixtures\Models\User;
use Alxtexh\Panel\Tests\Fixtures\Pages\LayoutDemoPage;
use Alxtexh\Panel\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

final class PageLayoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $tenant = Tenant::create(['name' => 'Mine', 'slug' => 'mine']);

        $this->actingAs(User::create([
            'tenant_id' => $tenant->id,
            'name' => 'Operator',
            'email' => 'operator@example.test',
            'password' => 'password',
            'email_verified_at' => now(),
        ]));
    }

    public function test_layout_blocks_serialize_to_json_schema(): void
    {
        $schema = LayoutDemoPage::layoutSchema();

        $this->assertIsArray($schema);
        $this->assertCount(2, $schema['nodes']);

        $section = $schema['nodes'][0];
        $this->assertSame('section', $section['component']);
        $this->assertSame('Overview', $section['label']);

        $columns = $schema['nodes'][1];
        $this->assertSame('columns', $columns['component']);
        $this->assertSame('column', $columns['children'][0]['component']);
        $this->assertSame('card', $columns['children'][0]['children'][0]['component']);
        $this->assertSame('Left', $columns['children'][0]['children'][0]['title']);

        $this->assertSame(
            ['headline', 'left_note', 'right_note'],
            collect($schema['fields'])->pluck('key')->all(),
        );
    }

    public function test_card_column_and_columns_classes_emit_discriminators(): void
    {
        $card = Card::make('Billing')->schema([])->toSchema();
        $column = Column::make()->span(2)->schema([])->toSchema();
        $columns = Columns::make([Column::make()->schema([])])->toSchema();

        $this->assertSame('card', $card['component']);
        $this->assertSame('column', $column['component']);
        $this->assertSame(2, $column['span']);
        $this->assertSame('columns', $columns['component']);
    }

    public function test_grid_accepts_a_responsive_column_map(): void
    {
        $grid = Grid::make([
            'default' => 1,
            'sm' => 2,
            'lg' => 4,
        ])->schema([])->toSchema();

        $this->assertSame('grid', $grid['component']);
        $this->assertSame([
            'default' => 1,
            'sm' => 2,
            'lg' => 4,
        ], $grid['columns']);
    }

    public function test_grid_rejects_unknown_breakpoints_and_invalid_counts(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        Grid::make(['phone' => 2]);
    }

    public function test_tabs_serialize_badges_for_form_and_view_renderers(): void
    {
        $schema = Tab::make('Invoices')->badge(7)->schema([])->toSchema();

        $this->assertSame('tab', $schema['component']);
        $this->assertSame('Invoices', $schema['label']);
        $this->assertSame(7, $schema['badge']);
    }

    public function test_a_layout_page_renders_page_layout_props(): void
    {
        $response = $this->get('/layout-demo');

        $response->assertOk();

        $page = $response->viewData('page')['props'];

        $this->assertArrayHasKey('pageLayout', $page);
        $this->assertSame('section', $page['pageLayout']['nodes'][0]['component'] ?? null);
        $this->assertSame('Demo', $page['values']['headline'] ?? null);
        $this->assertSame(route('panel.pages.layout-demo.save'), $page['saveHref'] ?? null);
        $this->assertSame('put', $page['saveMethod'] ?? null);
    }

    public function test_a_layout_page_save_persists_declared_fields(): void
    {
        $this->put('/layout-demo', [
            'headline' => 'Updated headline',
            'left_note' => 'New left',
            'right_note' => 'New right',
        ])->assertRedirect();

        $response = $this->get('/layout-demo');

        $response->assertOk();

        $page = $response->viewData('page')['props'];

        $this->assertSame('Updated headline', $page['values']['headline'] ?? null);
        $this->assertSame('New left', $page['values']['left_note'] ?? null);
        $this->assertSame('New right', $page['values']['right_note'] ?? null);
    }

    /**
     * A CUSTOM PAGE GETS THE SAME WIDGET ROW A RESOURCE DOES, AT BOTH ENDS -
     * `Page::headerWidgets()`/`footerWidgets()`, wired through the same
     * `WidgetSet::props()` a resource's index and the dashboard already use,
     * namespaced under `header`/`footer` so the two rows never collide.
     */
    public function test_a_page_declares_both_header_and_footer_widgets(): void
    {
        $page = $this->get('/layout-demo')->assertOk()->viewData('page')['props'];

        $this->assertContains('demo-header', array_column($page['headerWidgets'] ?? [], 'key'));
        $this->assertContains('demo-footer', array_column($page['footerWidgets'] ?? [], 'key'));
        $this->assertNotContains('demo-footer', array_column($page['headerWidgets'] ?? [], 'key'));
    }
}
