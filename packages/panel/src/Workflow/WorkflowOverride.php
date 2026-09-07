<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Workflow;

use Illuminate\Database\Eloquent\Model;

/**
 * A persisted workflow definition that overlays the PHP default.
 *
 * One row per resource key. States, transitions, and optional canvas
 * positions are stored as JSON. States/transitions rebuild into a Workflow
 * via `Workflow::fromStored()`; positions are board-only layout metadata.
 *
 * @property array<string, array{label: string, color: string}> $states
 * @property list<array{key: string, label: string, to: string, from?: list<string>, ability?: string, icon?: string|null, color?: string|null, confirm?: string|null}> $transitions
 * @property array<string, array{x: int|float, y: int|float}>|null $positions
 */
final class WorkflowOverride extends Model
{
    protected $table = 'panel_workflow_overrides';

    protected $guarded = [];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'states' => 'array',
            'transitions' => 'array',
            'positions' => 'array',
        ];
    }

    /**
     * Container binding for the per-request memo, registered scoped (not
     * singleton) in `PanelServiceProvider` - see that registration's own
     * comment, and `Tenants::MEMO_BINDING` for the sibling case this copies.
     */
    public const MEMO_BINDING = 'alxtexhpanel.workflow-override.memo';

    /**
     * MEMOIZED PER RESOURCE KEY, PER REQUEST. `RecordAction::transitionTo()`
     * gates each transition action's visibility with a per-ROW closure
     * (`canTransitionFromAttributes()` -> `stateTransitions()` ->
     * `overlayTransitionsMap()` -> here), and `Workflow::recordActions()`
     * builds one such action per declared transition - so an unmemoized
     * version of this method cost (rows x transitions) identical queries on
     * every list request for a workflow-eligible resource. Found on the
     * ticket queue: 3 transitions, confirmed live as ~3 queries per row
     * (`Performance\QueryCountTest::test_the_tickets_list_does_not_query_per_row`
     * - 16 for 5 tickets, 151 for 50, both roughly 3x row count). The
     * override is admin-edited data, not something expected to change mid
     * request, which is exactly the shape a per-request memo is safe for.
     */
    public static function forResource(string $resourceKey): ?self
    {
        /** @var \ArrayObject<string, self|null> $memo */
        $memo = app(self::MEMO_BINDING);

        if ($memo->offsetExists($resourceKey)) {
            return $memo[$resourceKey];
        }

        $override = self::query()->where('resource_key', $resourceKey)->first();
        $memo[$resourceKey] = $override;

        return $override;
    }
}
