<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Forms\Fields;

use Alxtexh\Panel\Actions\Action;

/**
 * Filament-shaped prefix, suffix, and hint chrome, serialised into Vue schema.
 *
 * No Livewire. The client draws text, icons, and copy/hint actions from JSON.
 * A named `Action` POSTs to `{resource}/form-action` and patches values.
 *
 *     TextField::make('price')->prefix('KES')->suffix('.00');
 *     TextField::make('slug')->suffixAction(['label' => 'Copy', 'copy' => true]);
 *     TextField::make('slug')->suffixAction(
 *         Action::make('generate')->action(fn ($get, $set) => $set('slug', Str::slug($get('title'))))
 *     );
 *     TextField::make('api_key')->hint('Keep this private')->copyable();
 */
trait HasAffixes
{
    protected ?string $prefix = null;

    protected ?string $suffix = null;

    protected ?string $prefixIcon = null;

    protected ?string $suffixIcon = null;

    protected ?string $hint = null;

    protected ?string $hintIcon = null;

    /** @var Action|array{label?: string, icon?: string, copy?: bool, url?: string}|null */
    protected Action|array|null $prefixAction = null;

    /** @var Action|array{label?: string, icon?: string, copy?: bool, url?: string}|null */
    protected Action|array|null $suffixAction = null;

    /** @var Action|array{label?: string, icon?: string, copy?: bool, url?: string}|null */
    protected Action|array|null $hintAction = null;

    public function prefix(?string $prefix): static
    {
        $this->prefix = $prefix;

        return $this;
    }

    public function suffix(?string $suffix): static
    {
        $this->suffix = $suffix;

        return $this;
    }

    public function prefixIcon(?string $icon): static
    {
        $this->prefixIcon = $icon;

        return $this;
    }

    public function suffixIcon(?string $icon): static
    {
        $this->suffixIcon = $icon;

        return $this;
    }

    /**
     * @param  Action|array{label?: string, icon?: string, copy?: bool, url?: string}|null  $action
     */
    public function prefixAction(Action|array|null $action): static
    {
        $this->prefixAction = $action;

        return $this;
    }

    /**
     * @param  Action|array{label?: string, icon?: string, copy?: bool, url?: string}|null  $action
     */
    public function suffixAction(Action|array|null $action): static
    {
        $this->suffixAction = $action;

        return $this;
    }

    public function hint(?string $hint): static
    {
        $this->hint = $hint;

        return $this;
    }

    public function hintIcon(?string $icon): static
    {
        $this->hintIcon = $icon;

        return $this;
    }

    /**
     * @param  Action|array{label?: string, icon?: string, copy?: bool, url?: string}|null  $action
     */
    public function hintAction(Action|array|null $action): static
    {
        $this->hintAction = $action;

        return $this;
    }

    /**
     * A suffix copy action for the current value, like Filament's copyable hint.
     */
    public function copyable(bool $copyable = true): static
    {
        $this->suffixAction = $copyable
            ? ['label' => 'Copy', 'icon' => 'clipboard', 'copy' => true]
            : null;

        return $this;
    }

    /**
     * The named POST action on this field, if the request named one.
     *
     * Copy and URL affixes are arrays, not `Action`, so they never resolve here.
     */
    public function affixAction(string $key): ?Action
    {
        foreach ([$this->prefixAction, $this->suffixAction, $this->hintAction] as $action) {
            if ($action instanceof Action && $action->key === $key) {
                return $action;
            }
        }

        return null;
    }

    /** @return array<string, mixed> */
    protected function affixSchema(): array
    {
        return array_filter([
            'prefix' => $this->prefix,
            'suffix' => $this->suffix,
            'prefixIcon' => $this->prefixIcon,
            'suffixIcon' => $this->suffixIcon,
            'hint' => $this->hint,
            'hintIcon' => $this->hintIcon,
            'prefixAction' => $this->actionSchema($this->prefixAction),
            'suffixAction' => $this->actionSchema($this->suffixAction),
            'hintAction' => $this->actionSchema($this->hintAction),
        ], static fn (mixed $v): bool => $v !== null && $v !== []);
    }

    /**
     * @param  Action|array{label?: string, icon?: string, copy?: bool, url?: string}|null  $action
     * @return array<string, mixed>|null
     */
    private function actionSchema(Action|array|null $action): ?array
    {
        if ($action instanceof Action) {
            return $action->toAffixSchema();
        }

        if ($action === null) {
            return null;
        }

        $schema = array_filter([
            'label' => $action['label'] ?? null,
            'icon' => $action['icon'] ?? null,
            'copy' => ($action['copy'] ?? false) ? true : null,
            'url' => $action['url'] ?? null,
        ], static fn (mixed $v): bool => $v !== null);

        return $schema === [] ? null : $schema;
    }
}
