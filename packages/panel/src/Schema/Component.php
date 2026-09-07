<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Schema;

use Closure;
use Alxtexh\Panel\Forms\Fields\Field;

/**
 * A node in a form or view schema.
 *
 * Layout is a TREE, not a flat list. Filament ships 23 layout components and we
 * had none, which is why a twenty-field form was an undifferentiated wall and a
 * view page could not have tabs.
 *
 * Every node serialises with a `component` discriminator so the client can walk
 * the tree without guessing:
 *
 *   {"component": "section", "label": "Identity", "children": [...]}
 *   {"component": "tabs",    "tabs": [{"label": "…", "children": [...]}]}
 *   {"component": "field",   "type": "text", ...}
 *
 * Layout carries NO tenant data and NO CSS classes, exactly like columns and
 * fields - it says `columns: 2` and `collapsible: true`, and Vue decides what
 * that looks like (antipatterns §6.1).
 */
abstract class Component
{
    /** @var list<Component|Renderable> */
    protected array $children = [];

    /**
     * @var array{0: string, 1: mixed}|Closure|null
     *
     * Base-class storage, so `isVisible()`, `toSchema()` and `visibleFields()`
     * below work uniformly over any node kind that exposes a setter for it.
     *
     * TWO SHAPES, evaluated differently on purpose:
     *
     *   `[field, value]` is the CHEAP, CLIENT-SIDE rule - `toSchema()` sends
     *   the raw pair, and the client re-evaluates `values[field] == value`
     *   itself on every keystroke, no round trip.
     *
     *   A CLOSURE cannot travel to the client at all, so it is resolved HERE
     *   and sent across as a plain `hidden: true|null` - the same contract
     *   `Field::hidden(Closure)` already uses. It is only current as of the
     *   last time this schema was built: a cached (no-`$values`) build
     *   evaluates it against `[]`, and it stays that answer until a `live()`
     *   field triggers `Form::applyLiveFlags()` to re-evaluate it for real.
     */
    protected array|Closure|null $visibleWhen = null;

    abstract public function component(): string;

    /** @return array{0: string, 1: mixed}|Closure|null */
    public function visibilityCondition(): array|Closure|null
    {
        return $this->visibleWhen;
    }

    /**
     * Whether this node's own condition is met against $values - NOT whether
     * an ancestor's is. `visibleFields()` below is what makes ancestry matter,
     * by never recursing into a node this returns false for.
     *
     * LOOSE COMPARISON on the tuple form, matching the client's own
     * `conditionMet()` and `Field::presenceRule()`'s boolean handling: a
     * value arriving from a submitted request body is a string ("1") where a
     * resource declared the condition as a native bool (true), and strict
     * equality would silently never match.
     *
     * @param  array<string, mixed>  $values
     */
    public function isVisible(array $values): bool
    {
        if ($this->visibleWhen === null) {
            return true;
        }

        if ($this->visibleWhen instanceof Closure) {
            return (bool) ($this->visibleWhen)($values);
        }

        [$field, $expected] = $this->visibleWhen;

        return array_key_exists($field, $values) && $values[$field] == $expected;
    }

    /**
     * Show this WHOLE NODE only when another field holds a given value - the
     * cheap, client-evaluated rule. See the property note above for how this
     * differs from `visible(Closure)`.
     *
     * `Form::sanitize()` omits every field beneath an unmet node from the
     * write payload entirely (`visibleFields()` below), so a crafted request
     * cannot resurrect a hidden group by including its keys. A field
     * required INSIDE a conditional node should still declare its OWN
     * matching `visibleWhen()` - that relaxes its `required` rule to
     * `required_if` so submitting the form without the group open does not
     * fail validation on a field nobody could see. This method does not do
     * that for you; it only governs what gets written.
     */
    public function visibleWhen(string $field, mixed $value): static
    {
        $this->visibleWhen = [$field, $value];

        return $this;
    }

    /**
     * The same thing `visibleWhen()` does, for a condition a `[field, value]`
     * pair cannot express - two fields, a range, a negation. See the
     * property note above for the real cost: this is resolved server-side,
     * not re-evaluated live in the browser the way `visibleWhen()` is, so it
     * only updates on a `live()` round-trip rather than every keystroke.
     *
     * @param  Closure(array<string, mixed>): bool  $condition
     */
    public function visible(Closure $condition): static
    {
        $this->visibleWhen = $condition;

        return $this;
    }

    /** @param list<Component|Renderable> $children */
    public function schema(array $children): static
    {
        $this->children = $children;

        return $this;
    }

    /** @return list<Component|Renderable> */
    public function children(): array
    {
        return $this->children;
    }

    /** @return array<string, mixed> */
    public function toSchema(): array
    {
        return [
            'component' => $this->component(),
            /*
             * A HINT, NOT A RULE - see `visibleWhen()`. The tuple form lets
             * the client re-evaluate itself; the closure form is resolved
             * right here, against no values, so a cached (values-less) build
             * still carries SOME answer rather than none. `Form::sanitize()`
             * is the actual enforcement either way, from the same
             * declaration on this object.
             */
            'visibleWhen' => is_array($this->visibleWhen) ? [
                'field' => $this->visibleWhen[0],
                'value' => $this->visibleWhen[1],
            ] : null,
            'hidden' => $this->visibleWhen instanceof Closure && ! $this->isVisible([]) ? true : null,
            /*
             * ONLY WHEN THE CONDITION IS A CLOSURE. `Form::applyLiveFlags()`
             * looks this id up after a `live()` round-trip to re-evaluate
             * `hidden` for real - a layout node has no `key` the way a
             * `Field` does, so this is the only handle a flat lookup table
             * has to find THIS node again in the tree.
             */
            'conditionId' => $this->visibleWhen instanceof Closure ? spl_object_id($this) : null,
            'children' => array_map(
                static fn (Component|Renderable $child): array => $child->toSchema(),
                $this->children,
            ),
        ];
    }

    /**
     * Every Field anywhere beneath this node, at any depth.
     *
     * Validation, sanitisation and value hydration all need the flat field list
     * regardless of how deeply layout nests them. Walking the tree in one place
     * is what stops a field inside a tab being silently unvalidated - which is
     * the failure that would make layout a security problem rather than a
     * presentation one.
     *
     * @param  list<Component|Renderable>  $nodes
     * @return list<Field>
     */
    public static function collectFields(array $nodes): array
    {
        $fields = [];

        foreach ($nodes as $node) {
            if ($node instanceof Field) {
                $fields[] = $node;

                continue;
            }

            if (! $node instanceof self) {
                continue;
            }

            $fields = [...$fields, ...self::collectFields($node->children())];
        }

        return $fields;
    }

    /**
     * Every layout node anywhere beneath these, keyed by the same id its own
     * serialized `conditionId` carries - the flat lookup table
     * `Form::applyLiveFlags()` re-evaluates after a `live()` round-trip.
     *
     * Walks INTO every node regardless of its own visibility, the same way
     * `collectFields()` does: a node nested inside a currently-hidden parent
     * still needs a correct answer the moment the parent's condition flips
     * back on, not a stale one left over from before it was hidden.
     *
     * @param  list<Component|Renderable>  $nodes
     * @return array<int, self>
     */
    public static function collectConditionalNodes(array $nodes): array
    {
        $found = [];

        foreach ($nodes as $node) {
            if ($node instanceof Field) {
                continue;
            }

            if (! $node instanceof self) {
                continue;
            }

            if ($node->visibilityCondition() instanceof Closure) {
                $found[spl_object_id($node)] = $node;
            }

            /*
             * `+`, NEVER SPREAD, TO MERGE THIS. `[...$a, ...$b]` renumbers
             * INTEGER keys from zero the way `array_merge()` does - and
             * `spl_object_id()` IS an integer key, so a spread here would
             * silently throw away the very ids this method exists to
             * preserve. `+` keeps both sides' keys untouched; a collision
             * cannot happen because every id is unique to one object.
             */
            $found += self::collectConditionalNodes($node->children());
        }

        return $found;
    }

    /**
     * Every Field beneath this node whose enclosing chain of conditions is
     * met against $values.
     *
     * NOT `collectFields()` filtered afterwards. A node this method never
     * recurses into contributes NO fields at any depth, rather than fields
     * with relaxed rules - the difference between a hidden section's fields
     * being absent from what `sanitize()` ever considers and merely being
     * optional. `collectFields()` itself is untouched and still walks
     * everything unconditionally: the cached schema and `valuesFor()` both
     * need every field regardless of any section's condition, so that
     * flipping the condition back on shows the record's real stored value
     * rather than a blank.
     *
     * @param  list<Component|Renderable>  $nodes
     * @param  array<string, mixed>  $values
     * @return list<Field>
     */
    public static function visibleFields(array $nodes, array $values): array
    {
        $fields = [];

        foreach ($nodes as $node) {
            if ($node instanceof Field) {
                $fields[] = $node;

                continue;
            }

            if (! $node instanceof self) {
                continue;
            }

            if (! $node->isVisible($values)) {
                continue;
            }

            $fields = [...$fields, ...self::visibleFields($node->children(), $values)];
        }

        return $fields;
    }
}
