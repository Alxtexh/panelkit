<?php

declare(strict_types=1);

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Public docs must match what ships.
 */
final class DocsHonestyTest extends TestCase
{
    public function test_readme_is_honest_about_landing_templates(): void
    {
        $readme = (string) file_get_contents(dirname(base_path(), 2).'/docs/README.md');

        $this->assertStringContainsString('no landing templates ship', $readme);
        $this->assertStringNotContainsString('Four built-in landing designs', $readme);
    }

    public function test_fields_catalogue_lists_shipped_field_types(): void
    {
        $fields = (string) file_get_contents(dirname(base_path(), 2).'/docs/03-fields.md');

        foreach (['PhoneField', 'IconPickerField', 'TreeSelectField', 'RatingField'] as $field) {
            $this->assertStringContainsString($field, $fields, "Missing {$field} from docs/03-fields.md");
        }
    }

    public function test_workflows_doc_states_board_is_editable_with_honest_limits(): void
    {
        $workflows = (string) file_get_contents(dirname(base_path(), 2).'/docs/16-workflows.md');

        $this->assertStringContainsString('Edit workflow', $workflows);
        $this->assertStringContainsString('panel_workflow_overrides', $workflows);
        $this->assertStringContainsString('Save layout', $workflows);
        $this->assertStringContainsString('Drag-to-create transitions', $workflows);
        $this->assertStringContainsString('Drag-to-reconnect existing edge', $workflows);
        $this->assertStringContainsString('Light auto-routing', $workflows);
        $this->assertStringContainsString('Delete a selected edge or state on the canvas', $workflows);
        $this->assertStringContainsString('Undo the last canvas change before save', $workflows);
        $this->assertStringNotContainsString('edge create/reconnect by drag is not shipped', $workflows);
        $this->assertStringNotContainsString('not editable in the UI', $workflows);
        $this->assertStringNotContainsString('No freeform drag-and-drop canvas', $workflows);
        $this->assertStringNotContainsString('Deleting a transition by canvas gesture', $workflows);
    }
}
