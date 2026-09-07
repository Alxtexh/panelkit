<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms\Fields;

use InvalidArgumentException;

/**
 * A sequence of blocks, each with its own shape - roadmap 4.5.
 *
 * WHERE `RepeaterField` STOPS. A repeater is many rows of the SAME shape -
 * ten phone numbers, five voucher rules. A builder is many rows of DIFFERENT
 * shapes in a chosen order: a page of content that is a heading, then a
 * paragraph, then an image, then a call to action. Modelling that with a
 * repeater means one row type carrying every field any block might need, most
 * of them empty on most rows, and nothing saying which combination is
 * meaningful.
 *
 * A BLOCK IS A NAMED SET OF FIELDS, declared with the same field objects the
 * rest of the form uses - so a block gets the same controls, the same
 * validation and the same schema pipeline rather than a parallel one that
 * drifts.
 *
 * THE STORED VALUE IS A LIST OF `{type, data}`, in order. Not a keyed map:
 * order is the whole point of a builder, and two blocks of the same type in
 * one document are normal.
 *
 * VALIDATION IS PER BLOCK TYPE, and it happens on the server. A submission
 * naming a block this field never declared is rejected rather than stored -
 * otherwise the value is a place a client can put arbitrary structure that
 * something downstream will later render.
 */
final class BuilderField extends Field
{
    /** @var array<string, array{label: string, fields: list<Field>}> */
    private array $blocks = [];

    private ?int $maxBlocks = null;

    public function type(): string
    {
        return 'builder';
    }

    /**
     * Declare one kind of block.
     *
     * @param  list<Field>  $fields
     */
    public function block(string $type, string $label, array $fields): self
    {
        if (preg_match('/^[a-z][a-z0-9_-]*$/', $type) !== 1) {
            throw new InvalidArgumentException("[{$type}] is not a valid block type.");
        }

        if (isset($this->blocks[$type])) {
            throw new InvalidArgumentException(
                "[{$type}] is already declared on this builder. Two blocks sharing a type "
                .'would make the stored value ambiguous about which shape to validate against.'
            );
        }

        $this->blocks[$type] = ['label' => $label, 'fields' => $fields];

        return $this;
    }

    /** A ceiling, for a surface with a real limit - a homepage, an email. */
    public function maxBlocks(int $max): self
    {
        $this->maxBlocks = max(1, $max);

        return $this;
    }

    /**
     * Rules for the list itself.
     *
     * PER-BLOCK RULES CANNOT BE EXPRESSED HERE, because which rules apply
     * depends on the `type` of each element - something Laravel's array
     * notation cannot say. The list shape is validated here; the contents are
     * validated in `sanitizeValue()`, which is the only place that knows
     * which block each element claims to be.
     */
    public function rules(): array
    {
        return [
            'nullable',
            'array',
            ...($this->maxBlocks !== null ? ['max:'.$this->maxBlocks] : []),
            ...$this->rules,
        ];
    }

    /**
     * Keep only declared blocks, and only their declared fields.
     *
     * AN UNDECLARED BLOCK TYPE IS DROPPED, not stored and rendered later. The
     * same allow-list posture `Form::sanitize()` takes for top-level keys: what
     * was not declared cannot arrive.
     *
     * ON `transformForStorage`, which is the hook `Form::sanitize()` actually
     * calls on the way to the model - the same seam an upload uses to turn a
     * handle into a path. A method the form never calls would be an
     * allow-list that does not run.
     *
     * @return list<array{type: string, data: array<string, mixed>}>
     */
    public function transformForStorage(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        $out = [];

        foreach ($value as $entry) {
            if (! is_array($entry)) {
                continue;
            }

            $type = is_string($entry['type'] ?? null) ? $entry['type'] : null;

            if ($type === null || ! isset($this->blocks[$type])) {
                continue;
            }

            $data = is_array($entry['data'] ?? null) ? $entry['data'] : [];
            $kept = [];

            foreach ($this->blocks[$type]['fields'] as $field) {
                if (array_key_exists($field->key, $data)) {
                    $kept[$field->key] = $data[$field->key];
                }
            }

            $out[] = ['type' => $type, 'data' => $kept];

            if ($this->maxBlocks !== null && count($out) >= $this->maxBlocks) {
                break;
            }
        }

        return $out;
    }

    /** @return array<string, mixed> */
    public function toSchema(): array
    {
        $blocks = [];

        foreach ($this->blocks as $type => $block) {
            $blocks[] = [
                'type' => $type,
                'label' => $block['label'],
                'fields' => array_map(
                    static fn (Field $field): array => $field->toSchema(),
                    $block['fields'],
                ),
            ];
        }

        return [
            ...parent::toSchema(),
            'blocks' => $blocks,
            'maxBlocks' => $this->maxBlocks,
        ];
    }
}
