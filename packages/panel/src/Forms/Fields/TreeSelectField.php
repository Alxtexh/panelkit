<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms\Fields;

use Closure;

/**
 * Hierarchical single-value select.
 *
 *     TreeSelectField::make('category_id')
 *         ->options([
 *             ['value' => 1, 'label' => 'Hardware', 'children' => [
 *                 ['value' => 2, 'label' => 'Routers'],
 *             ]],
 *         ]);
 */
final class TreeSelectField extends Field
{
    /** @var list<array<string, mixed>>|array<string|int, string>|\Closure */
    private array|Closure $options = [];

    private bool $searchable = false;

    public function type(): string
    {
        return 'tree-select';
    }

    /** @param list<array<string, mixed>>|array<string|int, string>|\Closure $options */
    public function options(array|Closure $options): static
    {
        $this->options = $options;

        return $this;
    }

    public function searchable(bool $searchable = true): static
    {
        $this->searchable = $searchable;

        return $this;
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function resolveOptions(): array
    {
        $raw = $this->options instanceof Closure ? ($this->options)() : $this->options;

        if ($raw === []) {
            return [];
        }

        if (array_is_list($raw) && isset($raw[0]) && is_array($raw[0]) && array_key_exists('label', $raw[0])) {
            return $raw;
        }

        $out = [];

        foreach ($raw as $value => $label) {
            $out[] = ['value' => $value, 'label' => (string) $label];
        }

        return $out;
    }

    protected function typeRules(): array
    {
        return [];
    }

    public function toSchema(): array
    {
        return [
            ...parent::toSchema(),
            'options' => $this->resolveOptions(),
            'searchable' => $this->searchable,
        ];
    }
}
