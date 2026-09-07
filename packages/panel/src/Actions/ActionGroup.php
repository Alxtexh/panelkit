<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Actions;

use InvalidArgumentException;

/**
 * A labelled section of record actions.
 *
 * A ROW MENU WITH TWELVE FLAT ITEMS IS NOT A MENU, it is a list you read every
 * time. Grouping is what turns it back into something scannable: the two or
 * three things done daily stay at the top level, and everything else - state
 * changes, exports, dangerous operations - sits under a heading that says what
 * kind of thing it is.
 *
 * A GROUP IS A SECTION, NOT A SUBMENU. Nested flyouts in a table row are a
 * pointing exercise: the trigger is small, the row may be near the bottom of
 * the viewport, and the submenu opens over the rows you were comparing. A
 * heading with items beneath it costs one line of height and no aiming.
 *
 * IT CARRIES NO AUTHORIZATION OF ITS OWN, deliberately. Every action inside
 * declares its own ability and is filtered individually, so a group cannot
 * accidentally widen or narrow what its members allow. A group that ends up
 * empty after filtering does not render at all - a heading over nothing reads
 * as something failing to load.
 */
final class ActionGroup
{
    /** @var list<RecordAction> */
    private array $actions = [];

    private ?string $icon = null;

    private function __construct(public readonly string $label) {}

    public static function make(string $label): self
    {
        return new self($label);
    }

    /** @param list<mixed> $actions */
    public function actions(array $actions): self
    {
        $validated = [];

        foreach ($actions as $action) {
            if (! $action instanceof RecordAction) {
                throw new InvalidArgumentException('An action group may only contain record actions.');
            }

            $validated[] = $action;
        }

        $this->actions = $validated;

        return $this;
    }

    public function icon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    /** @return list<RecordAction> */
    public function getActions(): array
    {
        return $this->actions;
    }

    /**
     * The group as the client sees it, already filtered for this record.
     *
     * @param  array<string, mixed>  $attributes
     * @param  callable(RecordAction): bool  $allows
     * @return array<string, mixed>|null Null when nothing inside survived.
     */
    public function toArrayFor(array $attributes, callable $allows): ?array
    {
        $items = [];

        foreach ($this->actions as $action) {
            if (! $action->appliesTo($attributes) || ! $allows($action)) {
                continue;
            }

            $entry = $action->toArray();

            if ($action->isLink()) {
                $entry['url'] = $action->urlFor($attributes);
            }

            $items[] = $entry;
        }

        if ($items === []) {
            return null;
        }

        return array_filter([
            'label' => $this->label,
            'icon' => $this->icon,
            'actions' => $items,
        ], static fn (mixed $v): bool => $v !== null);
    }
}
