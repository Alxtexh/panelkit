<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Demo\Models\Router;
use App\Models\Tenant;
use App\Models\User;
use App\Demo\Panel\Resources\RouterResource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Alxtexh\Panel\Forms\Fields\TextField;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Schema\Grid;
use Alxtexh\Panel\Schema\Section;
use Alxtexh\Panel\Schema\Step;
use Alxtexh\Panel\Schema\Wizard;
use Tests\TestCase;

/**
 * A form in ordered steps, and fields that appear only when they apply.
 *
 * THE INTERESTING PART IS NOT THE LAYOUT. A wizard that merely hides steps is
 * tabs with arrows. What matters is that hiding something never changes what is
 * ENFORCED - because "the field was not on screen" has never been a constraint
 * on what a request may contain, and a client that skips a step must not thereby
 * skip a requirement the resource declared.
 */
final class WizardAndConditionalFieldTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $tenant;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Tenant::create(['name' => 'A', 'slug' => 'a']);
        $this->user = User::factory()->create([
            'tenant_id' => $this->tenant->id,
            'email_verified_at' => now(),
        ]);

        $this->actingAs($this->user);
    }

    /* -------------------------------------------------------- the structure */

    /**
     * THE CENTRAL GUARANTEE. A field on step 3 is validated whether or not step
     * 3 was ever rendered - otherwise a required field could be skipped by
     * submitting from step 1, which is a correctness hole wearing a layout
     * costume.
     */
    public function test_every_step_is_validated_even_though_only_one_is_visible(): void
    {
        $rules = RouterResource::formDefinition()->rules();

        // Step 1
        $this->assertArrayHasKey('name', $rules);
        $this->assertArrayHasKey('model', $rules);
        // Step 2
        $this->assertArrayHasKey('ip_address', $rules);
    }

    /** The client is told which steps exist, and what each is for. */
    public function test_the_schema_describes_the_steps(): void
    {
        $schema = RouterResource::schema()['form'];
        $wizard = $schema['nodes'][0];

        $this->assertSame('wizard', $wizard['component']);
        $this->assertSame('Identity', $wizard['children'][0]['label']);
        $this->assertSame('What this device is called', $wizard['children'][0]['description']);
    }

    /**
     * Per-step rules are DERIVED from each step's own fields, not declared
     * again. A second list would drift from the first, and the drift shows up
     * as a step that validates nothing while looking like it does.
     */
    public function test_step_rules_are_derived_from_the_steps_own_fields(): void
    {
        $wizard = Wizard::make()->steps([
            Step::make('One')->schema([TextField::make('a')->required()]),
            Step::make('Two')->schema([TextField::make('b')->required()]),
        ]);

        $rules = $wizard->stepRules();

        $this->assertSame(['a'], array_keys($rules[0]));
        $this->assertSame(['b'], array_keys($rules[1]));
    }

    /** A field nested inside a Section inside a Step is still found. */
    public function test_step_rules_reach_nested_fields(): void
    {
        $wizard = Wizard::make()->steps([
            Step::make('One')->schema([
                Section::make('Group')->schema([
                    TextField::make('deep')->required(),
                ]),
            ]),
        ]);

        $this->assertArrayHasKey('deep', $wizard->stepRules()[0]);
    }

    /* --------------------------------------------------- conditional fields */

    /**
     * THE HEADLINE CASE. A conditional required field becomes `required_if`,
     * not `required` and not `nullable`.
     *
     * `required` on a hidden field means the form can never be submitted - the
     * operator is told to fill in something not on screen. Dropping the rule
     * means a client that omits the field skips a declared requirement. Neither
     * is acceptable, and `required_if` is neither.
     */
    public function test_a_conditional_required_field_uses_required_if(): void
    {
        $field = TextField::make('tax_number')->required()->visibleWhen('kind', 'business');

        $this->assertContains('required_if:kind,business', $field->rules());
        $this->assertNotContains('required', $field->rules());
    }

    /**
     * `nullable` RIDES ALONGSIDE `required_if`, not only on the fully-optional
     * branch. `useForm` never deletes a field just because its condition hid
     * the control, so a request whose condition does NOT match still submits
     * this key as `null` - and `typeRules()` (`string`, `max:255`, ...) reject
     * that `null` outright without `nullable` beside it, which is a rejection
     * the operator has no way to see: the field failing is not on screen.
     */
    public function test_a_required_conditional_field_is_also_nullable(): void
    {
        $field = TextField::make('tax_number')->required()->visibleWhen('kind', 'business');

        $this->assertContains('nullable', $field->rules());
    }

    /**
     * A BOOLEAN CONDITION HAS TO BE WRITTEN THE WAY LARAVEL READS IT. A rule of
     * `required_if:is_business,1` never matches PHP `true` if the value is
     * interpolated raw - the field then silently stops being required, which is
     * the failure direction that matters.
     */
    public function test_a_boolean_condition_is_written_as_laravel_reads_it(): void
    {
        $on = TextField::make('x')->required()->visibleWhen('flag', true);
        $off = TextField::make('y')->required()->visibleWhen('flag', false);

        $this->assertContains('required_if:flag,1', $on->rules());
        $this->assertContains('required_if:flag,0', $off->rules());
    }

    /** An optional conditional field stays nullable - the condition only gates presence. */
    public function test_an_optional_conditional_field_is_still_nullable(): void
    {
        $field = TextField::make('note')->visibleWhen('kind', 'business');

        $this->assertContains('nullable', $field->rules());
    }

    /** The condition travels to the client so the control can be hidden. */
    public function test_the_condition_travels_in_the_schema(): void
    {
        $schema = TextField::make('tax')->visibleWhen('kind', 'business')->toSchema();

        $this->assertSame(['field' => 'kind', 'value' => 'business'], $schema['visibleWhen']);
    }

    /* ------------------------------------------------------------- the write */

    /**
     * THE PATH THAT MATTERS. A request that CLAIMS the condition is met must
     * satisfy the conditional field, whatever the browser displayed.
     */
    public function test_a_request_meeting_the_condition_must_supply_the_conditional_field(): void
    {
        $this->postJson('/routers', [
            'name' => 'Edge',
            'model' => 'other',
            'ip_address' => '10.0.0.9',
            // `model_other` is the conditional field and is deliberately absent.
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('model_other');

        $this->assertSame(0, Router::query()->count());
    }

    /** And when the condition is NOT met, the same field is not demanded. */
    public function test_a_request_not_meeting_the_condition_may_omit_it(): void
    {
        $this->post('/routers', [
            'name' => 'Edge',
            'model' => 'RB750',
            'ip_address' => '10.0.0.9',
        ])->assertSessionHasNoErrors();

        $this->assertSame(1, Router::query()->count());
    }

    /**
     * A FIELD ON A LATER STEP IS STILL REQUIRED. Submitting from step 1 must not
     * be a way to skip step 2 - the whole reason validation walks the tree
     * rather than the visible step.
     */
    public function test_submitting_without_a_later_steps_field_is_refused(): void
    {
        $this->postJson('/routers', ['name' => 'Edge', 'model' => 'RB750'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('ip_address');
    }

    /* ----------------------------------------------------- conditional sections */

    /** The condition travels to the client so the whole section can be hidden. */
    public function test_a_conditional_sections_condition_travels_in_the_schema(): void
    {
        $schema = Section::make('Refund details')->visibleWhen('kind', 'refund')->toSchema();

        $this->assertSame(['field' => 'kind', 'value' => 'refund'], $schema['visibleWhen']);
    }

    /** A section with no condition is unconditionally present, as before. */
    public function test_a_plain_section_carries_no_visibility_condition(): void
    {
        $this->assertNull(Section::make('Always here')->toSchema()['visibleWhen']);
    }

    /**
     * THE CENTRAL GUARANTEE, restated for a whole section rather than one
     * field. A crafted request including a hidden section's key must not
     * reach the write payload just because the key was present - "hidden"
     * has never been a constraint on what a request may contain, so the
     * server has to be the one refusing it rather than trusting the client
     * not to send it.
     */
    public function test_a_hidden_sections_fields_are_omitted_from_the_write_payload(): void
    {
        $form = Form::make()->schema([
            TextField::make('kind'),
            Section::make('Refund details')->visibleWhen('kind', 'refund')->schema([
                TextField::make('refund_reason'),
            ]),
        ]);

        $out = $form->sanitize([
            'kind' => 'purchase',
            // Included anyway, as a crafted request would.
            'refund_reason' => 'Changed my mind',
        ]);

        $this->assertArrayNotHasKey('refund_reason', $out);
        $this->assertSame('purchase', $out['kind']);
    }

    /** And when the submitted data DOES satisfy the condition, the field writes normally. */
    public function test_a_visible_sections_fields_are_written_normally(): void
    {
        $form = Form::make()->schema([
            TextField::make('kind'),
            Section::make('Refund details')->visibleWhen('kind', 'refund')->schema([
                TextField::make('refund_reason'),
            ]),
        ]);

        $out = $form->sanitize([
            'kind' => 'refund',
            'refund_reason' => 'Wrong size',
        ]);

        $this->assertSame('Wrong size', $out['refund_reason']);
    }

    /** A field nested arbitrarily deep inside a hidden section is still omitted. */
    public function test_a_field_nested_inside_a_hidden_section_is_still_omitted(): void
    {
        $form = Form::make()->schema([
            TextField::make('kind'),
            Section::make('Refund details')->visibleWhen('kind', 'refund')->schema([
                Grid::make()->schema([
                    TextField::make('refund_reason'),
                ]),
            ]),
        ]);

        $out = $form->sanitize(['kind' => 'purchase', 'refund_reason' => 'Anything']);

        $this->assertArrayNotHasKey('refund_reason', $out);
    }

    /**
     * A BOOLEAN CONDITION ON A SECTION reads the request the way Laravel's
     * own `required_if` does, for the same reason a field's does - `true`
     * declared in PHP has to match `"1"` arriving on the wire.
     */
    public function test_a_boolean_sections_condition_matches_a_submitted_string(): void
    {
        $form = Form::make()->schema([
            TextField::make('is_business'),
            Section::make('Business details')->visibleWhen('is_business', true)->schema([
                TextField::make('tax_number'),
            ]),
        ]);

        $shown = $form->sanitize(['is_business' => '1', 'tax_number' => '12345']);
        $hidden = $form->sanitize(['is_business' => '0', 'tax_number' => '12345']);

        $this->assertSame('12345', $shown['tax_number']);
        $this->assertArrayNotHasKey('tax_number', $hidden);
    }

    /**
     * NEITHER THE CACHED SCHEMA NOR EXISTING VALUES ARE FILTERED. A hidden
     * section's fields still have to exist in the structural schema (so the
     * client knows the section exists at all) and in a record's current
     * values (so flipping the condition back on shows what was actually
     * stored, not a blank) - only the WRITE path is conditional.
     */
    public function test_the_flat_field_list_and_current_values_ignore_visibility(): void
    {
        $form = Form::make()->schema([
            TextField::make('kind'),
            Section::make('Refund details')->visibleWhen('kind', 'refund')->schema([
                TextField::make('refund_reason'),
            ]),
        ]);

        $this->assertSame(['kind', 'refund_reason'], array_map(
            static fn ($f) => $f->key,
            $form->fields(),
        ));

        $this->assertArrayHasKey('refund_reason', $form->valuesFor(null));
    }

    /* -------------------------------------------------------------- objects */

    public function test_a_wizard_with_no_steps_produces_no_rules(): void
    {
        $this->assertSame([], Wizard::make()->steps([])->stepRules());
    }

    public function test_a_form_can_still_use_plain_fields(): void
    {
        $form = Form::make()->schema([TextField::make('plain')->required()]);

        $this->assertContains('required', $form->rules()['plain']);
    }
}
