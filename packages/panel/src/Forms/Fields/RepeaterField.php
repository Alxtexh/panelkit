<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms\Fields;

use InvalidArgumentException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * A repeating group of fields, stored as a JSON array of objects.
 *
 * FOR THE ONE-TO-MANY THAT DOES NOT DESERVE A TABLE. A client's several contact
 * numbers, the two or three notes attached to an installation - data that is
 * always read with its parent, never queried on its own, and never counted.
 * Give it a table and every read becomes a join for rows nobody searches.
 *
 * THE HONEST LIMIT, stated once: anything you will ever FILTER, SORT, COUNT or
 * report on belongs in a table. A JSON array cannot be indexed usefully, so the
 * moment somebody asks "how many clients have a secondary contact" this was the
 * wrong choice - and it will be a migration to undo. Use a relation manager
 * instead; that is what it is for.
 *
 * EVERY CHILD FIELD VALIDATES ITSELF, at `key.*.child`. This is the whole point
 * of composing real Field objects rather than accepting a shape: `array` on the
 * outside proves nothing about what is inside, and a repeater is precisely a
 * place where arbitrary nested input arrives from a browser.
 *
 * CHILDREN ARE LEAVES ONLY. A repeater inside a repeater is a data model
 * pretending to be a form: the validation keys become `a.*.b.*.c`, the UI needs
 * two levels of add/remove, and what is actually being described is a table
 * with a foreign key. Refused at declaration time rather than discovered later.
 */
final class RepeaterField extends Field
{
    /** @var list<Field> */
    private array $children = [];

    private ?int $minItems = null;

    private ?int $maxItems = null;

    private ?string $itemLabel = null;

    private bool $collapsible = false;

    private bool $addable = true;

    private bool $deletable = true;

    private bool $cloneable = false;

    private bool $table = false;

    private ?string $relationship = null;

    public function type(): string
    {
        return 'repeater';
    }

    /**
     * The shape of one row.
     *
     * @param  list<mixed>  $fields
     */
    public function schema(array $fields): self
    {
        $validated = [];

        foreach ($fields as $field) {
            if (! $field instanceof Field) {
                throw new InvalidArgumentException('A repeater schema may only contain fields.');
            }

            if ($field instanceof self || $field instanceof KeyValueField) {
                throw new InvalidArgumentException(
                    "[{$field->key}] cannot be nested inside a repeater. A repeating group of "
                    .'repeating groups is a table with a foreign key - use a relation manager.'
                );
            }

            $validated[] = $field;
        }

        $this->children = $validated;

        return $this;
    }

    /** Store rows in a declared parent relation instead of a JSON column. */
    public function relationship(string $name): self
    {
        if (preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $name) !== 1) {
            throw new InvalidArgumentException("Invalid repeater relationship [{$name}].");
        }

        $this->relationship = $name;

        return $this;
    }

    public function isRelationship(): bool
    {
        return $this->relationship !== null;
    }

    public function relationshipName(): ?string
    {
        return $this->relationship;
    }

    public function minItems(int $min): self
    {
        $this->minItems = $min;

        return $this;
    }

    public function maxItems(int $max): self
    {
        $this->maxItems = $max;

        return $this;
    }

    /** What one row is called, for the add button and the row headings. */
    public function itemLabel(string $label): self
    {
        $this->itemLabel = $label;

        return $this;
    }

    /**
     * Let a row fold down to one line - its ordinal, and the first child's
     * value if it has one - showing only the field being worked on rather
     * than every row's full set of inputs at once. Off by default: a
     * repeater short enough to not need this is the common case, and a
     * fold state nobody asked for is one more thing to notice is there.
     */
    public function collapsible(bool $collapsible = true): self
    {
        $this->collapsible = $collapsible;

        return $this;
    }

    /**
     * Hide the "Add" control. A row count that only ever shrinks - an
     * approval trail, a log of past addresses - has no honest use for a
     * button that grows it.
     *
     * UI ONLY, same as `deletable()` below: nothing here is a server-side
     * bound. `minItems()`/`maxItems()` are the ones that get enforced in
     * `typeRules()` - this only decides which buttons a legitimate form
     * offers, exactly as `itemLabel()` decides what they say.
     */
    public function addable(bool $addable = true): self
    {
        $this->addable = $addable;

        return $this;
    }

    /**
     * Hide each row's own remove control. An append-only history - once a
     * note is added it stays - has no honest use for a per-row delete.
     *
     * Pairs with `addable(false)` for something that starts with rows already
     * present and never changes at all, or stands alone for something that
     * only ever grows.
     */
    public function deletable(bool $deletable = true): self
    {
        $this->deletable = $deletable;

        return $this;
    }

    /**
     * Offer a "duplicate this row" control next to remove/reorder. For the
     * row that is mostly the same as the last one - another phone number for
     * the same person, another line item at the same rate - starting from a
     * copy beats retyping every field. Off by default: most repeaters hold
     * rows different enough from each other that a clone button would sit
     * unused.
     */
    public function cloneable(bool $cloneable = true): self
    {
        $this->cloneable = $cloneable;

        return $this;
    }

    /**
     * Render rows as a `<table>` - one column per child field, one row per
     * item - instead of the stacked one-field-per-line layout every other
     * repeater uses.
     *
     * FOR SEVERAL SHORT FIELDS, NOT ONE LONG ONE. A line item - description,
     * quantity, unit price - wastes most of a screen's width wrapping to a
     * new line per field, the way the stacked layout does; the same three
     * values read as one glance across a row. A single-child repeater, or
     * one whose fields are long-form (a textarea, a rich editor), has
     * nothing to gain here and should stay stacked.
     *
     * NO SEPARATE COLUMN-LABEL API, unlike Filament's `TableColumn::make()`.
     * Each child field already has a `label()` - a second place to spell the
     * same heading is a second place for it to drift from the first. The
     * header row reads straight off `children()`, in schema order.
     *
     * NOT COMBINED WITH `collapsible()`. Folding a table row has no honest
     * rendering here - a summary line replacing an ordinal badge and one
     * input is a fold; replacing a full row of cells is a different control
     * this does not build. The client renders no collapse affordance at all
     * while this is on, whatever `collapsible()` says - not an error, since
     * nothing about the two is structurally incompatible, only rendered.
     */
    public function table(bool $table = true): self
    {
        $this->table = $table;

        return $this;
    }

    /** @return list<Field> */
    public function children(): array
    {
        return $this->children;
    }

    /** @return list<mixed> */
    protected function typeRules(): array
    {
        return array_values(array_filter([
            'array',
            $this->minItems !== null ? "min:{$this->minItems}" : null,
            $this->maxItems !== null ? "max:{$this->maxItems}" : null,
        ]));
    }

    /**
     * Each child's own rules, applied to every row.
     *
     * @return array<string, list<mixed>>
     */
    public function additionalRules(): array
    {
        $rules = [];

        if ($this->relationship !== null) {
            $rules["{$this->key}.*._id"] = ['nullable'];
        }

        foreach ($this->children as $child) {
            $rules["{$this->key}.*.{$child->key}"] = $child->rules();

            /*
             * A child's own additional rules are rebased under the wildcard.
             *
             * A multi-select inside a repeater needs `contacts.*.tags.*`, and
             * the child only knows to ask for `tags.*` - it has no idea it is
             * nested. Rewriting the prefix here is what lets a child field be
             * written once and used at either level.
             */
            foreach ($child->additionalRules() as $key => $extra) {
                $rules["{$this->key}.*.".$key] = $extra;
            }
        }

        return $rules;
    }

    /**
     * Keep only declared child keys, and drop rows that are entirely empty.
     *
     * THE FILTER IS THE SANITISER. Without it a request can attach any key it
     * likes to a row and have it stored verbatim in the JSON - this column is
     * the one place in the form layer where a caller could otherwise write a
     * shape the resource never declared.
     *
     * Empty rows are dropped because "add" creates one before it is filled in,
     * and saving with a blank row at the bottom should not persist a blank row.
     */
    public function transformForStorage(mixed $value): mixed
    {
        return $this->rowsForStorage($value, preserveIds: false) ?: null;
    }

    /** @return list<array<string, mixed>> */
    public function rowsForStorage(mixed $value, bool $preserveIds = true): array
    {
        if (! is_array($value)) {
            return [];
        }

        $out = [];

        foreach ($value as $row) {
            if (! is_array($row)) {
                continue;
            }

            $clean = [];
            $hasValue = false;

            if ($preserveIds && array_key_exists('_id', $row) && $row['_id'] !== null && $row['_id'] !== '') {
                $clean['_id'] = (string) $row['_id'];
            }

            foreach ($this->children as $child) {
                $entry = $row[$child->key] ?? null;
                $clean[$child->key] = $child->transformForStorage($entry);

                if ($entry !== null && $entry !== '' && $entry !== []) {
                    $hasValue = true;
                }
            }

            if ($hasValue || isset($clean['_id'])) {
                $out[] = $clean;
            }
        }

        return $out;
    }

    /** Hydrate a relationship into the same row shape the client submits. */
    public function valuesFrom(?Model $record): array
    {
        if ($this->relationship === null || $record === null || ! method_exists($record, $this->relationship)) {
            return parent::valuesFrom($record);
        }

        $relation = $record->{$this->relationship}();

        if (! $relation instanceof Relation) {
            throw new InvalidArgumentException("Repeater relationship [{$this->relationship}] is not an Eloquent relation.");
        }

        $rows = [];

        foreach ($relation->get() as $child) {
            $row = ['_id' => (string) $child->getKey()];

            foreach ($this->children as $field) {
                $row[$field->key] = $field->presentValue($child->getAttribute($field->key));
            }

            $rows[] = $row;
        }

        return [$this->key => $rows];
    }

    /** @return array<string, mixed> Structure only; children as their own schema. */
    public function toSchema(): array
    {
        return [
            ...parent::toSchema(),
            'itemLabel' => $this->itemLabel ?? 'Item',
            'minItems' => $this->minItems,
            'maxItems' => $this->maxItems,
            'collapsible' => $this->collapsible,
            'addable' => $this->addable,
            'deletable' => $this->deletable,
            'cloneable' => $this->cloneable,
            'table' => $this->table,
            'relationship' => $this->relationship,
            'children' => array_map(static fn (Field $f): array => $f->toSchema(), $this->children),
        ];
    }

    /**
     * Child option lists, resolved when the DATA payload is assembled.
     *
     * Same rule as everywhere else: a select inside a repeater may be backed by
     * a tenant's own rows, and tenant data never enters the cached schema.
     *
     * @return array<string, list<array{value: mixed, label: string}>>
     */
    public function childOptions(): array
    {
        $out = [];

        foreach ($this->children as $child) {
            $options = $child->resolveOptions();

            if ($options !== null) {
                $out[$child->key] = $options;
            }
        }

        return $out;
    }
}
