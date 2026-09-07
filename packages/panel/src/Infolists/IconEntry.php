<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Infolists;

final class IconEntry extends Entry
{
    /** @var array<int|string, string> */
    private array $icons = [];

    /** @var array<int|string, string> */
    private array $colors = [];

    /** @var array<int|string, string> */
    private array $labels = [];

    private string $defaultIcon = 'dot';

    public function type(): string
    {
        return 'icon';
    }

    /** @param array<int|string, string> $icons value => icon name */
    public function icons(array $icons): static
    {
        $this->icons = $icons;

        return $this;
    }

    /** @param array<int|string, string> $colors value => success|danger|warning|neutral */
    public function colors(array $colors): static
    {
        $this->colors = $colors;

        return $this;
    }

    /** @param array<int|string, string> $labels value => accessible text */
    public function labels(array $labels): static
    {
        $this->labels = $labels;

        return $this;
    }

    public function defaultIcon(string $icon): static
    {
        $this->defaultIcon = $icon;

        return $this;
    }

    public function boolean(string $trueLabel = 'Yes', string $falseLabel = 'No'): static
    {
        $this->icons = ['1' => 'check', '' => 'x'];
        $this->colors = ['1' => 'success', '' => 'danger'];
        $this->labels = ['1' => $trueLabel, '' => $falseLabel];

        return $this;
    }

    public function toSchema(): array
    {
        return [
            ...parent::toSchema(),
            'icons' => $this->icons,
            'colors' => $this->colors,
            'labels' => $this->labels,
            'defaultIcon' => $this->defaultIcon,
        ];
    }
}
