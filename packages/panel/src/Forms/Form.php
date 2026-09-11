<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms;

use Illuminate\Database\Eloquent\Model;
use Alxtexh\Panel\Forms\Fields\Field;
use Alxtexh\Panel\Forms\Fields\RepeaterField;
use Alxtexh\Panel\Forms\Fields\SelectField;
use Alxtexh\Panel\Schema\Component;
use Alxtexh\Panel\Schema\Renderable;
use Alxtexh\Panel\Schema\Section;

/**
 * Declarative form definition.
 *
 * Two things it exists to guarantee:
 *
 * 1. VALIDATION HAS ONE SOURCE. `rules()` builds the Laravel array the server
 *    enforces, and Precognition replays the same rules for live feedback. The
 *    client never carries its own copy to drift out of step.
 *
 * 2. MASS ASSIGNMENT IS CLOSED BY CONSTRUCTION. `sanitize()` returns only keys
 *    this form declares, so a request cannot write a column the form does not
 *    mention - including `tenant_id`. `$request->all()` never reaches a model.
 *    A `$fillable` list can be forgotten when a column is added; a form that
 *    does not mention a field simply cannot submit it.
 */
final class Form
{
    /**
     * The schema TREE - layout components and fields, mixed and nested.
     *
     * @var list<Component|Renderable>
     */
    private array $nodes = [];

    private int $columns = 1;

    private ?int $autosaveMilliseconds = null;

    public static function make(): self
    {
        return new self;
    }

    /** @param list<Component|Renderable> $nodes */
    public function schema(array $nodes): self
    {
        $this->nodes = $nodes;

        return $this;
    }

    /**
     * Adds fields under their own section rather than replacing the form -
     * roadmap 5.1's custom fields are the only caller today. Grouped under
     * one labelled `Section` rather than dropped in bare: an operator who
     * added five fields to Clients over a year should see them as a
     * recognisable group, not interleaved anonymously among the declared
     * ones with no sign of where they came from.
     *
     * @param  list<Field>  $fields
     */
    public function appendFields(array $fields, string $sectionLabel = 'Custom fields'): self
    {
        if ($fields === []) {
            return $this;
        }

        $this->nodes = [
            ...$this->nodes,
            Section::make($sectionLabel)->schema($fields),
        ];

        return $this;
    }

    public function columns(int $columns): self
    {
        $this->columns = $columns;

        return $this;
    }

    /** Opt into version-aware local draft recovery for this form. */
    public function autosave(int $milliseconds = 1000): self
    {
        if ($milliseconds < 250 || $milliseconds > 60000) {
            throw new \InvalidArgumentException('Form autosave debounce must be between 250 and 60000 milliseconds.');
        }

        $this->autosaveMilliseconds = $milliseconds;

        return $this;
    }

    /**
     * Every field, at any nesting depth.
     *
     * Validation, sanitisation and hydration all use this rather than the top
     * level, so a field inside a collapsed section or an unopened tab behaves
     * exactly like a visible one. Anything else would let a required field be
     * skipped by never opening its tab - a correctness hole, not a layout quirk.
     *
     * @return list<Field>
     */
    public function fields(): array
    {
        return Component::collectFields($this->nodes);
    }

    /**
     * Structure only, safe to cache. Never resolves an option closure.
     *
     * Pass `$values` after a live() round-trip so hidden/disabled closures
     * evaluate against the posted form. Cached schema (no values) leaves those
     * flags off; `visibleWhen` still hides cheaply on the client.
     *
     * @param  array<string, mixed>|null  $values
     * @return array<string, mixed>
     */
    public function toSchema(?array $values = null): array
    {
        $schema = [
            'columns' => $this->columns,
            'autosave' => $this->autosaveMilliseconds !== null,
            'autosaveMilliseconds' => $this->autosaveMilliseconds,
            // The TREE, so the client can render layout. Fields are leaves.
            'nodes' => array_map(
                static fn (Component|Renderable $n): array => $n->toSchema(),
                $this->nodes,
            ),
            // Flat list too: some consumers only need to know which fields
            // exist, and re-walking the tree client-side to find out is waste.
            'fields' => array_map(static fn (Field $f): array => $f->toSchema(), $this->fields()),
        ];

        if ($values !== null) {
            $schema = $this->applyLiveFlags($schema, $values);
        }

        return $schema;
    }

    /**
     * Overlay hidden/disabled from the current values onto a cached-shaped schema.
     *
     * @param  array<string, mixed>  $schema
     * @param  array<string, mixed>  $values
     * @return array<string, mixed>
     */
    private function applyLiveFlags(array $schema, array $values): array
    {
        $flags = [];

        foreach ($this->fields() as $field) {
            $flags[$field->key] = [
                'hidden' => $field->isHidden($values),
                'disabled' => $field->isDisabled($values),
            ];
        }

        /*
         * SAME IDEA, FOR LAYOUT NODES WHOSE CONDITION IS A CLOSURE - see
         * `Component::visible()`. A node has no `key`, so `conditionId` (set
         * at serialization time, looked up here by the same id) is what
         * finds it again rather than a field name.
         */
        $conditionFlags = [];

        foreach (Component::collectConditionalNodes($this->nodes) as $id => $node) {
            $conditionFlags[$id] = ! $node->isVisible($values);
        }

        $patch = static function (array $node) use (&$patch, $flags, $conditionFlags): array {
            if (($node['component'] ?? null) === 'field' && isset($flags[$node['key'] ?? ''])) {
                $node['hidden'] = $flags[$node['key']]['hidden'] ? true : null;
                $node['disabled'] = $flags[$node['key']]['disabled'] ? true : null;
                $node = array_filter($node, static fn (mixed $v): bool => $v !== null);
            } elseif (isset($node['conditionId'], $conditionFlags[$node['conditionId']])) {
                $node['hidden'] = $conditionFlags[$node['conditionId']] ? true : null;
                $node = array_filter($node, static fn (mixed $v): bool => $v !== null);
            }

            foreach (['children', 'fields'] as $key) {
                if (isset($node[$key]) && is_array($node[$key])) {
                    $node[$key] = array_map($patch, $node[$key]);
                }
            }

            return $node;
        };

        $schema['nodes'] = array_map($patch, $schema['nodes']);
        $schema['fields'] = array_map($patch, $schema['fields']);

        return $schema;
    }

    /**
     * Tenant-varying option lists, for the data payload.
     *
     * @return array<string, list<array{value: mixed, label: string}>>
     */
    public function resolveOptions(): array
    {
        $options = [];

        foreach ($this->fields() as $field) {
            $resolved = $field->resolveOptions();

            if ($resolved !== null) {
                $options[$field->key] = $resolved;
            }

            /*
             * A repeater's CHILD selects need their lists too.
             *
             * Keyed by the child's own key rather than a nested path, because
             * every row of a repeater shares one shape - a per-row list would
             * be the same array repeated once per row, which is exactly the
             * duplication the schema/data split exists to avoid.
             *
             * They resolve here, in the DATA payload, for the same reason every
             * other option list does: a select inside a repeater may be backed
             * by a tenant's own rows, and tenant data never enters the cached
             * schema (addendum Part A).
             */
            if ($field instanceof RepeaterField) {
                foreach ($field->childOptions() as $childKey => $childOptions) {
                    $options[$childKey] = $childOptions;
                }
            }
        }

        return $options;
    }

    /**
     * Each searchable relationship field's CURRENT value, resolved to a
     * label - see `SelectField::resolveCurrentOption()`'s own docblock for
     * why this exists as a separate pass rather than folded into
     * `resolveOptions()` above: that method has no record to resolve
     * against (it also serves the Create page, which has none), and every
     * OTHER caller of it - `SingularController`, `DocumentTemplateController`,
     * `SetupWizardController`, `BenchmarkCommand` - has no reason to pay for
     * a lookup it would never use. Callable only where a record already
     * exists (`ResourceController::edit()`), with the SAME values array the
     * page's `values` prop is built from, so it stays one relationship-row
     * lookup per searchable field, not a query per option.
     *
     * @param  array<string, mixed>  $values
     * @return array<string, list<array{value: mixed, label: string}>>
     */
    public function currentValueOptions(array $values): array
    {
        $options = [];

        foreach ($this->fields() as $field) {
            if (! $field instanceof SelectField) {
                continue;
            }

            $resolved = $field->resolveCurrentOption($values[$field->key] ?? null);

            if ($resolved !== null) {
                $options[$field->key] = [$resolved];
            }
        }

        return $options;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        $rules = [];

        foreach ($this->fields() as $field) {
            $rules[$field->key] = $field->rules();

            // Fields that validate more than their own key - a multi-select
            // has to constrain each MEMBER, not merely assert an array.
            foreach ($field->additionalRules() as $key => $extra) {
                $rules[$key] = $extra;
            }
        }

        return $rules;
    }

    /**
     * Reduce request input to the fields this form declares.
     *
     * `Component::visibleFields($this->nodes, $input)`, NOT `$this->fields()`.
     * A field inside a `Section` whose own `visibleWhen` condition the
     * SUBMITTED input does not satisfy is dropped before it ever reaches the
     * loop below - the same source of truth the client used to decide
     * whether to draw the section, evaluated here to decide whether a
     * crafted request gets to write it anyway.
     *
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    public function sanitize(array $input): array
    {
        $out = [];

        foreach (Component::visibleFields($this->nodes, $input) as $field) {
            if ($field->isHidden($input)) {
                continue;
            }
            if (! array_key_exists($field->key, $input)) {
                /*
                 * AN ABSENT KEY USUALLY MEANS "LEAVE IT ALONE" - a blank
                 * password keeps the current one, an untouched upload keeps the
                 * current file - and a field may say otherwise.
                 *
                 * A TICK BOX SAYS OTHERWISE. Unticking a checkbox submits
                 * nothing at all, so under the default rule the value silently
                 * stays as it was: the operator unticks "Available to sell",
                 * saves, is told it saved, and the plan is still on sale. See
                 * `Field::absentMeans()`.
                 */
                $absent = $field->absentMeans();

                if ($absent !== Field::ABSENT_MEANS_NOTHING) {
                    $out[$field->key] = $field->transformForStorage($absent);
                }

                continue;
            }

            if ($field instanceof RepeaterField && $field->isRelationship()) {
                // Relationship rows are persisted after the parent exists.
                // Keeping them out of the parent mass-assignment payload makes
                // it impossible to accidentally write them into a JSON column.
                continue;
            }

            // Declared keys only - nothing else reaches the model - and each
            // one passed through its own field, so a value that is not what the
            // column stores (an upload handle, say) becomes what it should be
            // here rather than in every caller.
            // A field may decline to be written at all - see omitsFromStorage().
            // Omission is not the same as writing null: one keeps the stored
            // value, the other destroys it.
            if ($field->omitsFromStorage($input[$field->key])) {
                continue;
            }

            $expanded = $field->expandStorage($input[$field->key]);

            if ($expanded !== null) {
                foreach ($expanded as $column => $stored) {
                    $out[$column] = $stored;
                }

                continue;
            }

            $out[$field->key] = $field->transformForStorage($input[$field->key]);
        }

        return $out;
    }

    /**
     * Current values for editing.
     *
     * @return array<string, mixed>
     */
    public function valuesFor(?Model $record): array
    {
        $values = [];

        foreach ($this->fields() as $field) {
            foreach ($field->valuesFrom($record) as $key => $value) {
                // Dates serialise to ISO so the client can parse them without
                // guessing a format; a locale-formatted string here would be
                // unparseable and is a localisation trap (addendum D2).
                $values[$key] = $value instanceof \DateTimeInterface
                    ? $value->format(str_contains($field->type(), 'time') ? 'Y-m-d\TH:i' : 'Y-m-d')
                    : $value;
            }
        }

        return $values;
    }
}
