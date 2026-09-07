<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms\Fields;

/**
 * Pick a semantic icon name from a curated list.
 *
 *     IconPickerField::make('icon')->icons(['users', 'router', 'package']);
 *
 * Stores the icon NAME, never an SVG path. The client owns the glyph set.
 */
final class IconPickerField extends Field
{
    /** @var list<string> */
    private array $icons = [
        'users', 'router', 'package', 'activity', 'archive', 'sliders',
        'layout-grid', 'shopping-bag', 'receipt', 'credit-card', 'home',
        'file-text', 'book-open', 'chat', 'help', 'gauge', 'mail', 'key',
        'shield', 'trash', 'settings', 'star', 'heart', 'bell', 'globe',
    ];

    public function type(): string
    {
        return 'icon-picker';
    }

    /** @param list<string> $icons */
    public function icons(array $icons): static
    {
        $this->icons = array_values(array_filter($icons, static fn (string $icon): bool => $icon !== ''));

        return $this;
    }

    protected function typeRules(): array
    {
        return ['string', 'in:'.implode(',', $this->icons)];
    }

    public function toSchema(): array
    {
        return [
            ...parent::toSchema(),
            'icons' => $this->icons,
        ];
    }
}
