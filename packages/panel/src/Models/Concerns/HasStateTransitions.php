<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Models\Concerns;

use Alxtexh\Panel\Workflow\WorkflowOverride;
use Illuminate\Validation\ValidationException;

/**
 * Guarded status changes on an Eloquent model.
 *
 * Declare allowed edges once on the model. Pair with
 * `RecordAction::transitionTo()` so row actions refuse disallowed hops at
 * execution time, and opt into `Auditable` so each hop lands in the audit trail.
 *
 * When a DB workflow override exists for a resource whose model uses this
 * trait, the overlay's transitions map wins over the PHP property. This keeps
 * runtime hops consistent with the board the admin just saved.
 */
trait HasStateTransitions
{
    /** @return string Column that holds the workflow state. */
    public function stateColumn(): string
    {
        if (property_exists($this, 'stateColumn') && is_string($this->stateColumn)) {
            return $this->stateColumn;
        }

        return 'status';
    }

    /**
     * Allowed transitions keyed by the current state.
     *
     * Checks for a DB workflow override first. When one exists its
     * transitions map is authoritative; the PHP `$transitions` property
     * serves as fallback only.
     *
     * @return array<string, list<string>>
     */
    public function stateTransitions(): array
    {
        $overlay = $this->overlayTransitionsMap();

        if ($overlay !== null) {
            return $overlay;
        }

        return $this->transitions;
    }

    public function currentState(): string
    {
        return (string) $this->getAttribute($this->stateColumn());
    }

    public function canTransitionTo(string $to, ?string $column = null): bool
    {
        $column = $column ?? $this->stateColumn();
        $from = (string) $this->getAttribute($column);
        $allowed = $this->stateTransitions()[$from] ?? [];

        return in_array($to, $allowed, true);
    }

    /**
     * @param  array<string, mixed>  $attributes  Row attributes from a list query.
     */
    public static function canTransitionFromAttributes(array $attributes, string $to, ?string $column = null): bool
    {
        $instance = new static;
        $column = $column ?? $instance->stateColumn();
        $from = (string) ($attributes[$column] ?? '');
        $allowed = $instance->stateTransitions()[$from] ?? [];

        return in_array($to, $allowed, true);
    }

    public function assertCanTransitionTo(string $to, ?string $column = null): void
    {
        if ($this->canTransitionTo($to, $column)) {
            return;
        }

        $column = $column ?? $this->stateColumn();

        throw ValidationException::withMessages([
            $column => ["Cannot move from [{$this->currentState()}] to [{$to}]."],
        ]);
    }

    /**
     * Build a transitions map from the DB workflow override, if one exists
     * for any resource that uses this model class.
     *
     * @return array<string, list<string>>|null
     */
    private function overlayTransitionsMap(): ?array
    {
        $resourceKey = $this->resolveResourceKeyForOverlay();

        if ($resourceKey === null) {
            return null;
        }

        try {
            $override = WorkflowOverride::forResource($resourceKey);
        } catch (\Throwable) {
            return null;
        }

        if ($override === null) {
            return null;
        }

        $map = [];

        foreach ($override->states as $stateKey => $_) {
            $map[$stateKey] = [];
        }

        foreach ($override->transitions as $t) {
            $sources = $t['from'] ?? [];
            $to = $t['to'];

            if ($to === '') {
                continue;
            }

            if ($sources === []) {
                foreach (array_keys($map) as $state) {
                    $map[$state][] = $to;
                }
            } else {
                foreach ($sources as $from) {
                    $map[$from][] = $to;
                }
            }
        }

        foreach ($map as $key => $targets) {
            $map[$key] = array_values(array_unique($targets));
        }

        return $map;
    }

    /**
     * Find the resource key that references this model, for overlay lookup.
     *
     * Walks registered panel resources and returns the key of the first one
     * whose `model()` matches and that declares a `workflow()`. Returns null
     * when no match is found (safe fallback: use PHP property).
     */
    private function resolveResourceKeyForOverlay(): ?string
    {
        $manager = app(\Alxtexh\Panel\PanelManager::class);
        $modelClass = static::class;

        foreach ($manager->resources() as $resourceClass) {
            if ($resourceClass::model() === $modelClass && $resourceClass::workflow() !== null) {
                return $resourceClass::key();
            }
        }

        return null;
    }
}
