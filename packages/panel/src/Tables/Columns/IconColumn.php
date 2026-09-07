<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tables\Columns;

/**
 * A value rendered as an icon rather than text.
 *
 * The case this exists for is BOOLEANS. A badge reading "Yes"/"No" down a column
 * of forty rows is forty words to read; a tick or a cross is scannable at a
 * glance, and a table is a scanning surface before it is a reading one.
 *
 * ICON NAMES ARE SEMANTIC, exactly like colours (antipatterns §6.1). This emits
 * `check` and `success`, never an SVG path or a CSS class - the client owns the
 * icon set, so swapping icon libraries never touches PHP, and nothing here can
 * be purged by a CSS scanner that does not read PHP.
 *
 * An ICON WITHOUT A LABEL IS AMBIGUOUS, so every icon carries a tooltip and an
 * aria-label derived from its value. A column that renders only shapes is
 * unreadable to a screen reader and merely guessable to everyone else.
 */
final class IconColumn extends Column
{
    /** @var array<int|string, string> value => icon name */
    private array $icons = [];

    /** @var array<int|string, string> value => semantic colour */
    private array $colors = [];

    /** @var array<int|string, string> value => tooltip/aria text */
    private array $labels = [];

    private string $defaultIcon = 'dot';

    private string $defaultColor = 'neutral';

    public function type(): string
    {
        return 'icon';
    }

    /**
     * The common case: true is a tick, false is a cross.
     *
     * Keyed by '1' and '' because a boolean column arrives from the database as
     * an integer on some drivers and a boolean on others, and the client
     * normalises both to those two strings before looking up.
     */
    public function boolean(string $trueLabel = 'Yes', string $falseLabel = 'No'): self
    {
        $this->icons = ['1' => 'check', '' => 'x'];
        $this->colors = ['1' => 'success', '' => 'danger'];
        $this->labels = ['1' => $trueLabel, '' => $falseLabel];

        return $this;
    }

    /** @param array<int|string, string> $icons value => icon name */
    public function icons(array $icons): self
    {
        $this->icons = $icons;

        return $this;
    }

    /** @param array<int|string, string> $colors value => success|danger|warning|neutral */
    public function colors(array $colors): self
    {
        $this->colors = $colors;

        return $this;
    }

    /** @param array<int|string, string> $labels value => accessible text */
    public function labels(array $labels): self
    {
        $this->labels = $labels;

        return $this;
    }

    public function defaultIcon(string $icon): self
    {
        $this->defaultIcon = $icon;

        return $this;
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            ...parent::toArray(),
            'icons' => $this->icons,
            'colors' => $this->colors,
            'labels' => $this->labels,
            'defaultIcon' => $this->defaultIcon,
            'defaultColor' => $this->defaultColor,
        ];
    }
}
