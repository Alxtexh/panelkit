<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Workflow;

use Illuminate\Database\Eloquent\Model;
use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\Models\Concerns\HasStateTransitions;

/**
 * One allowed hop in a resource workflow.
 */
final class Transition
{
    private string $to = '';

    /** @var list<string> */
    private array $from = [];

    private string $ability = 'update';

    private ?string $icon = null;

    private ?string $color = null;

    private ?string $confirm = null;

    public function __construct(
        public readonly string $key,
        public readonly string $label,
    ) {}

    public static function make(string $key, string $label): self
    {
        return new self($key, $label);
    }

    public function to(string $state): self
    {
        $this->to = $state;

        return $this;
    }

    /** @param list<string> $states */
    public function from(array $states): self
    {
        $this->from = $states;

        return $this;
    }

    public function authorize(string $ability): self
    {
        $this->ability = $ability;

        return $this;
    }

    public function icon(string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function color(string $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function confirm(string $message): self
    {
        $this->confirm = $message;

        return $this;
    }

    public function destination(): string
    {
        return $this->to;
    }

    /** @return list<string> */
    public function sources(): array
    {
        return $this->from;
    }

    public function ability(): string
    {
        return $this->ability;
    }

    public function appliesFrom(?string $state): bool
    {
        if ($this->from === []) {
            return true;
        }

        return in_array((string) $state, $this->from, true);
    }

    /** @param class-string<Model>|null $model */
    public function toRecordAction(string $column, ?string $model): RecordAction
    {
        $action = RecordAction::make($this->key, $this->label)
            ->authorize($this->ability)
            ->transitionTo($this->to, $column, $model);

        if ($this->icon !== null) {
            $action->icon($this->icon);
        }

        if ($this->color !== null) {
            $action->color($this->color);
        }

        if ($this->confirm !== null) {
            $action->confirm($this->confirm);
        }

        if ($model !== null
            && in_array(HasStateTransitions::class, class_uses_recursive($model), true)
            && method_exists($model, 'canTransitionFromAttributes')) {
            $to = $this->to;
            $action->visible(static function (array $row) use ($model, $column, $to): bool {
                return $model::canTransitionFromAttributes($row, $to, $column);
            });
        } elseif ($this->from !== []) {
            $from = $this->from;
            $columnKey = str_contains($column, '.')
                ? substr($column, (int) strrpos($column, '.') + 1)
                : $column;
            $action->visible(static fn (array $row): bool => in_array((string) ($row[$columnKey] ?? ''), $from, true));
        }

        return $action;
    }

    /** @return array<string, mixed> */
    public function toSchema(): array
    {
        return array_filter([
            'key' => $this->key,
            'label' => $this->label,
            'to' => $this->to,
            'from' => $this->from === [] ? null : $this->from,
            'ability' => $this->ability,
            'icon' => $this->icon,
            'color' => $this->color,
            'confirm' => $this->confirm,
        ], static fn (mixed $value): bool => $value !== null);
    }
}
