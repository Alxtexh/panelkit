<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Schema;

/** One tab. Only meaningful inside Tabs. */
final class Tab extends Component
{
    private ?string $icon = null;

    private string|int|null $badge = null;

    private function __construct(private readonly string $label) {}

    public static function make(string $label): self
    {
        return new self($label);
    }

    public function icon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * Show a small count or status value beside the tab label.
     *
     * The value is intentionally a string or integer rather than a Closure:
     * schema output is cached and must stay serialisable. Callers can resolve
     * a live count before building the schema, just like a field's default.
     */
    public function badge(string|int|null $badge): self
    {
        $this->badge = $badge;

        return $this;
    }

    public function component(): string
    {
        return 'tab';
    }

    public function toSchema(): array
    {
        return [
            ...parent::toSchema(),
            'label' => $this->label,
            'icon' => $this->icon,
            'badge' => $this->badge,
        ];
    }
}
