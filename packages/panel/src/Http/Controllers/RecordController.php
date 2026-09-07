<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\CustomFields\CustomField;
use Alxtexh\Panel\CustomFields\CustomFieldFactory;
use Alxtexh\Panel\Forms\Fields\RepeaterField;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Http\NestedContext;
use Alxtexh\Panel\Http\NestedRelation;
use Alxtexh\Panel\Http\Requests\RecordFormRequest;
use Alxtexh\Panel\Models\Scopes\TenantScope;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Support\TenantContext;
use Alxtexh\Panel\Support\Transaction;
use Alxtexh\Panel\Tables\Columns\InlineWritableColumn;
use Alxtexh\Panel\Tables\Reorderer;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Create, update and delete for every resource.
 *
 * FOUR GUARANTEES, each guarding a failure that is otherwise silent:
 *
 * 1. AUTHORIZE ON EVERY WRITE. The schema's permission booleans only hide UI
 *    (spec §9 item 3). A client that lies gets a 403, not a mutation.
 *
 * 2. MASS ASSIGNMENT CLOSED. Only keys the form declares survive `sanitize()`,
 *    so a request cannot write `tenant_id` and move a record into another
 *    tenant. `$request->all()` never reaches a model.
 *
 * 3. THE TENANT IS SET FROM CONTEXT, NEVER FROM INPUT. It is not a form field
 *    and cannot be one.
 *
 * 4. OPTIMISTIC CONCURRENCY. The form carries the record's `updated_at`; the
 *    save compares it and rejects a stale write with 409 rather than
 *    last-write-wins (addendum C). Two admins editing one client is normal in an
 *    ISP back office, and silent overwrite loses real work with no trace.
 */
final class RecordController extends Controller
{
    /**
     * `RecordFormRequest` RATHER THAN `Request`, and the type-hint is the fix.
     *
     * A precognitive request never enters this method - Laravel's dispatcher
     * resolves the parameters and aborts 204 - so authorisation and validation
     * have to happen where a parameter is resolved. Both live in the form
     * request now, and both still run on an ordinary request exactly as they
     * did when they were the first two statements here. See that class.
     */
    public function store(RecordFormRequest $request, string $resource): RedirectResponse
    {
        $class = $this->resolve($resource);

        $form = $class::formDefinition();
        abort_if($form->fields() === [], 404, "Resource [{$resource}] has no form.");

        // The single source of validation truth. The client holds no copy, so
        // the two cannot drift apart.
        $validated = $request->validated();

        $model = $class::model();
        $record = new $model;

        // Only declared keys. Nothing else can reach the model.
        $record->forceFill($this->foldCustomFields($class::key(), $form->sanitize($validated), $record));

        // From context, never from input.
        $this->applyTenant($record);

        /*
         * NESTED - roadmap 4.2: the parent comes from the URL, resolved and
         * authorised in NestedContext, and is stamped AFTER the form data so
         * a request body claiming a different parent is overwritten rather
         * than honoured. Same posture as the tenant, for the same reason.
         */
        $parent = NestedContext::parent($request, $class);

        if ($parent !== null && ! NestedRelation::belongsToMany($class)) {
            $record->setAttribute($class::parentColumn(), $parent->getKey());
        }

        $class::beforeCreate($record, $validated);

        Transaction::run(function () use ($class, $record, $parent, $validated): void {
            $this->save($record);

            $this->syncRelationshipRepeaters($class, $record, $validated);

            if ($parent !== null && NestedRelation::belongsToMany($class)) {
                NestedRelation::of($parent, $class)->syncWithoutDetaching([$record->getKey()]);
            }

            $class::afterCreate($record, $validated);
        });

        return back()->with('success', $class::label().' created.');
    }

    /** See `store()` on why this takes a form request. */
    public function update(RecordFormRequest $request, string $resource, string $id): RedirectResponse
    {
        $class = $this->resolve($resource);

        $record = $this->findScoped($class, $id);

        $form = $class::formDefinition();
        $validated = $request->validated();

        $this->assertNotStale($request, $record);

        $record->forceFill($this->foldCustomFields($class::key(), $form->sanitize($validated), $record));

        /*
         * NESTED PARENT IS THE URL, ON UPDATE TOO. Create already stamped it.
         * Without this, a nested form that includes the foreign key (a
         * relationship select, a hidden input) could move the row under a
         * different parent while the address still named the old one.
         */
        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            NestedRelation::restamp($class, $parent, $record);
        }

        $class::beforeUpdate($record, $validated);

        Transaction::run(function () use ($class, $record, $validated): void {
            $this->save($record);
            $this->syncRelationshipRepeaters($class, $record, $validated);
            $class::afterUpdate($record, $validated);
        });

        return back()->with('success', $class::label().' updated.');
    }

    /**
     * Run ONE declared record action against ONE record.
     *
     * Every gate a form submission passes, and one more that forms do not need:
     *
     *   THE ACTION MUST BE DECLARED ON THIS RESOURCE'S TABLE. The request names
     *   a key, and only a key the table declared resolves - so the endpoint can
     *   never be talked into calling a method the resource did not offer.
     *
     *   THE ABILITY IS THE ACTION'S OWN, checked against THIS record. Replicate
     *   asks for `create`, not `update`: it produces a new row, and somebody who
     *   may edit clients but not add them must not add one through a menu item.
     *
     *   `visible()` IS RE-EVALUATED. It exists to hide "Restore" on a row that
     *   was never deleted, and hiding is not enforcement - a client that skips
     *   the UI and posts the key still has to satisfy it.
     */
    public function runAction(Request $request, string $resource, string $id): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'string', 'max:64'],
            'wizardStep' => ['sometimes', 'integer', 'min:0'],
            'wizardId' => ['sometimes', 'string', 'max:120'],
        ]);

        $class = $this->resolve($resource);
        $record = $this->findScoped($class, $id);

        $action = $class::definition()->recordAction($validated['action']);

        if ($action === null) {
            throw new NotFoundHttpException(
                "No record action [{$validated['action']}] on [{$resource}]."
            );
        }

        abort_unless($class::can($action->ability(), $record), 403);

        abort_unless(
            $action->appliesTo($record->getAttributes()),
            422,
            'That action does not apply to this record.',
        );

        if ($action->hasSteps() && array_key_exists('wizardStep', $validated)) {
            $updates = $this->runWizardStep(
                request: $request,
                resource: $resource,
                record: $record,
                action: $action,
                wizardStep: (int) $validated['wizardStep'],
                wizardId: (string) ($validated['wizardId'] ?? ($id.'.'.$action->key)),
            );

            return $updates;
        }

        $updates = $action->run($record, $this->actionInput($request, $action));

        return response()->json(array_filter([
            'ok' => true,
            'values' => $updates,
            'redirect' => $action->resolveRedirect($record, $updates ?? []),
        ], static fn (mixed $v): bool => $v !== null));
    }

    /**
     * Wizard step handler for declarative multi-step record actions.
     *
     * The server validates only the current step's rules, persists the
     * validated values in session, and executes the action only after the
     * last step succeeds.
     */
    private function runWizardStep(
        Request $request,
        string $resource,
        Model $record,
        RecordAction $action,
        int $wizardStep,
        string $wizardId,
    ): JsonResponse {
        $steps = $action->stepsDefinition();
        $lastIndex = count($steps) - 1;

        if ($wizardStep > $lastIndex) {
            throw ValidationException::withMessages([
                'wizardStep' => ['Unknown step.'],
            ]);
        }

        $sessionKey = "panelkit.record_action_wizards.{$wizardId}";
        $state = $request->session()->get($sessionKey);

        if (! is_array($state)) {
            if ($wizardStep !== 0) {
                throw ValidationException::withMessages([
                    'wizardStep' => ['Wizard must start at step 0.'],
                ]);
            }

            $state = [
                'resource' => $resource,
                'recordId' => (string) $record->getKey(),
                'actionKey' => $action->key,
                'validatedUntil' => -1,
                'valuesByStep' => [],
            ];
        } else {
            if (($state['recordId'] ?? null) !== (string) $record->getKey()) {
                $request->session()->forget($sessionKey);

                throw ValidationException::withMessages([
                    'wizardStep' => ['Wizard state does not match this record.'],
                ]);
            }

            if (($state['actionKey'] ?? null) !== $action->key) {
                $request->session()->forget($sessionKey);

                throw ValidationException::withMessages([
                    'wizardStep' => ['Wizard state does not match this action.'],
                ]);
            }
        }

        $validatedUntil = (int) ($state['validatedUntil'] ?? -1);
        $valuesByStep = is_array($state['valuesByStep'] ?? null) ? $state['valuesByStep'] : [];

        if ($wizardStep > $validatedUntil + 1) {
            throw ValidationException::withMessages([
                'wizardStep' => ['This step is not reachable yet.'],
            ]);
        }

        if ($wizardStep <= $validatedUntil) {
            // Going back: discard any later validated values.
            foreach (array_keys($valuesByStep) as $stepIndex) {
                if ((int) $stepIndex > $wizardStep) {
                    unset($valuesByStep[$stepIndex]);
                }
            }

            $validatedUntil = $wizardStep;
        }

        $step = $steps[$wizardStep];
        $form = $step->formDefinition();
        $input = (array) $request->input('data', []);

        $sanitized = [];

        if ($form !== null) {
            $validatedForStep = validator(
                $input,
                $form->rules(),
            )->validate();

            $sanitized = $form->sanitize($validatedForStep);
        }

        $collected = [];

        for ($i = 0; $i < $wizardStep; $i++) {
            if (array_key_exists($i, $valuesByStep)) {
                $collected = array_merge($collected, $valuesByStep[$i]);
            }
        }

        $collected = array_merge($collected, $sanitized);

        $patch = $step->runValidate($record, $collected);

        if ($patch !== null) {
            $collected = array_merge($collected, $patch);
        }

        $valuesByStep[$wizardStep] = $collected;
        $validatedUntil = max($validatedUntil, $wizardStep);

        if ($wizardStep === $lastIndex) {
            $fullData = $valuesByStep[$lastIndex] ?? $collected;
            $updates = $action->executeWithData($record, $fullData);

            $request->session()->forget($sessionKey);

            return response()->json(array_filter([
                'ok' => true,
                'values' => $updates,
                'redirect' => $action->resolveRedirect($record, $updates ?? []),
            ], static fn (mixed $v): bool => $v !== null));
        }

        $state['validatedUntil'] = $validatedUntil;
        $state['valuesByStep'] = $valuesByStep;
        $request->session()->put($sessionKey, $state);

        return response()->json([
            'ok' => true,
            'values' => $collected,
            'nextStepIndex' => $wizardStep + 1,
        ]);
    }

    /**
     * Run one declared infolist action against one record.
     *
     * Same gates as `runAction`: the key must be declared on this resource's
     * infolist, the ability is checked against this record, and the view page
     * stays a dedicated page. The client POSTs `{ action }`.
     */
    public function runInfolistAction(Request $request, string $resource, string $id): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', 'string', 'max:64'],
        ]);

        $class = $this->resolve($resource);
        $record = $this->findScoped($class, $id);

        $action = $class::infolistAction($validated['action']);

        if ($action === null) {
            throw new NotFoundHttpException(
                "No infolist action [{$validated['action']}] on [{$resource}]."
            );
        }

        abort_unless($class::can($action->ability(), $record), 403);

        $action->run($record);

        return response()->json(['ok' => true]);
    }

    /**
     * Attach existing related records. Dedicated page POST, not a modal.
     */
    public function attach(Request $request, string $resource): RedirectResponse
    {
        $class = $this->resolve($resource);
        $parent = NestedContext::parent($request, $class);

        abort_if($parent === null || ! NestedRelation::belongsToMany($class), 404);
        abort_unless($class::can('update'), 403);

        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:50'],
            'ids.*' => ['required'],
        ]);

        $pivot = $this->attachPivotInput($request, $class);

        NestedRelation::attach($class, $parent, $validated['ids'], $pivot);

        return redirect(NestedContext::base($class, $parent))
            ->with('success', $class::pluralLabel().' attached.');
    }

    /**
     * Pivot-column values for an attach submission, validated and reduced to
     * `pivotColumns()`'s own keys - the same allow-list posture
     * `actionInput()` takes with a record action's form. Empty when the
     * resource declares no pivot columns, so the request body's `pivot` key
     * is never even read in the common case.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @return array<string, mixed>
     */
    private function attachPivotInput(Request $request, string $class): array
    {
        $fields = $class::pivotColumns();

        if ($fields === []) {
            return [];
        }

        $form = Form::make()->schema($fields);

        $validated = validator(
            (array) $request->input('pivot', []),
            $form->rules(),
        )->validate();

        return $form->sanitize($validated);
    }

    /**
     * The values a form action collected, validated and reduced to its own keys.
     *
     * THE DECLARATION IS THE AUTHORITY, not the request. Rules come from the
     * fields the RESOURCE declared, and `sanitize()` drops everything else - so
     * a request that names a column the form never offered has that key
     * discarded rather than passed to `handle()` and written. That is the same
     * allow-list posture the record form takes, and it is the whole reason a
     * form action is not a mass-assignment endpoint with a nicer label.
     *
     * NESTED UNDER `data`, so an action key and a field called `action` cannot
     * collide - which they would, on any resource with an `action` column.
     *
     * AN ACTION WITH NO FORM IGNORES INPUT ENTIRELY. Reading `data` for one
     * would let a caller submit values to an action that declared none, and
     * whether anything came of that would depend on what its `handle()` did
     * with a second argument it never expected.
     *
     * @return array<string, mixed>
     */
    private function actionInput(Request $request, RecordAction $action): array
    {
        if ($action->hasSteps()) {
            $out = [];

            foreach ($action->stepsDefinition() as $step) {
                $form = $step->formDefinition();

                if ($form === null) {
                    continue;
                }

                $validated = validator(
                    (array) $request->input('data', []),
                    $form->rules(),
                )->validate();

                $out = array_merge($out, $form->sanitize($validated));
            }

            return $out;
        }

        $form = $action->formDefinition();

        if ($form === null) {
            return [];
        }

        $validated = validator(
            (array) $request->input('data', []),
            $form->rules(),
        )->validate();

        return $form->sanitize($validated);
    }

    /**
     * Apply a new display order to the rows of one page.
     *
     * THE SCOPED QUERY IS THE AUTHORITY on which rows exist. Ids the caller
     * cannot already see are dropped before anything is written, so a request
     * naming another organisation's row reorders nothing rather than reordering
     * something it should not know about.
     *
     * IT IS AN UPDATE, so it needs `update` - checked once for the resource
     * rather than per row, because a reorder is one act on a set. A per-row
     * policy check here would be N calls to answer a question about a list.
     *
     * BOUNDED BY THE PAGE. The request carries the ids of one page in their new
     * order; anything longer is refused. Reordering is a gesture on what is
     * visible, and accepting an arbitrary list would make this an endpoint for
     * rewriting the whole table's order in one request.
     */
    public function reorder(Request $request, string $resource): JsonResponse
    {
        $class = $this->resolve($resource);

        abort_unless($class::can('update'), 403);

        $table = $class::definition();
        $column = $table->getReorderColumn();

        if ($column === null) {
            throw new NotFoundHttpException("[{$resource}] is not reorderable.");
        }

        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:'.$table->largestPage()],
            'ids.*' => ['required', 'integer'],
        ]);

        $model = $class::model();

        /*
         * SCOPED TO THE PARENT, like every other write here.
         *
         * A bare `$model::query()` let a caller reorder rows under a parent
         * they had not been authorised against, by addressing them through one
         * they had. Only display order, so the impact is small - but it is the
         * same missing constraint as the trashed lookup above, and a reader
         * comparing the two should find them agreeing.
         */
        $query = $model::query();

        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            NestedRelation::constrain($query, $class, $parent);
        }

        $written = (new Reorderer($column))->apply(
            $query,
            $validated['ids'],
        );

        return response()->json(['ok' => true, 'moved' => $written]);
    }

    /**
     * Write ONE cell, from an editable column in the list.
     *
     * A cell edit is a full write with a smaller control, so it goes through
     * every gate a form submission does - scoped lookup, per-record policy
     * check, staleness check - and adds one more that forms do not need:
     *
     *   THE COLUMN MUST BE DECLARED INLINE-WRITABLE ON THIS TABLE. The request
     *   names a column, and only a column the resource opted into writing
     *   (`EditableColumn`, or a badge resolver) is accepted. Without that
     *   check this endpoint writes any attribute on any record the operator
     *   can see, which is a mass-assignment hole wearing an inline-edit
     *   costume.
     *
     * The VALUE is then validated by the column itself: a select accepts only
     * its own options, a toggle only a real boolean. Most enum columns have no
     * database constraint behind them, so this is the only thing standing
     * between a crafted request and a row with an unroutable status.
     *
     * JSON, not a redirect: the row updates in place and the page must not
     * navigate.
     */
    public function updateCell(Request $request, string $resource, string $id): JsonResponse
    {
        $class = $this->resolve($resource);

        $record = $this->findScoped($class, $id);

        abort_unless($class::can('update', $record), 403);

        $validated = $request->validate([
            'column' => ['required', 'string', 'max:64'],
            'value' => ['present'],
        ]);

        $column = null;

        foreach ($class::definition()->getColumns() as $candidate) {
            if (
                $candidate->key === $validated['column']
                && $candidate instanceof InlineWritableColumn
                && $candidate->isInlineWritable()
            ) {
                $column = $candidate;
                break;
            }
        }

        if ($column === null) {
            throw new NotFoundHttpException("[{$validated['column']}] is not an editable column on [{$resource}].");
        }

        try {
            $value = $column->castValue($validated['value']);
        } catch (InvalidArgumentException $e) {
            throw ValidationException::withMessages(['value' => $e->getMessage()]);
        }

        $this->assertNotStale($request, $record);

        // forceFill is safe HERE and only here: the attribute name came from the
        // resource's own column declaration, not from the request. The request
        // chose which declared column, never which attribute.
        $record->forceFill([$column->writableColumn() => $value]);
        $record->save();

        return response()->json([
            'id' => $record->getKey(),
            'column' => $column->key,
            'value' => $value,
            // Echoed so the row's staleness guard stays armed for the next edit
            // without a full reload.
            'updated_at' => $this->updatedAt($record),
        ]);
    }

    /**
     * Move one card on an opt-in Kanban board.
     *
     * THE BOARD DECLARATION IS THE ALLOWLIST. Only `Resource::board()` column
     * values are accepted, so this is not a general attribute writer.
     */
    public function boardMove(Request $request, string $resource): JsonResponse
    {
        $class = $this->resolve($resource);
        $board = $class::board();

        if ($board === null) {
            throw new NotFoundHttpException("[{$resource}] has no board.");
        }

        $validated = $request->validate([
            'id' => ['required', 'integer'],
            'column' => ['required', 'string', 'max:64'],
        ]);

        $allowed = $board->allowedValues();

        if ($allowed === [] || ! in_array($validated['column'], $allowed, true)) {
            throw ValidationException::withMessages([
                'column' => 'That board column is not declared on this resource.',
            ]);
        }

        $record = $this->findScoped($class, (string) $validated['id']);

        abort_unless($class::can('update', $record), 403);

        $record->forceFill([$board->column() => $validated['column']]);
        $record->save();

        return response()->json([
            'ok' => true,
            'id' => $record->getKey(),
            'column' => $board->column(),
            'value' => $validated['column'],
            'updated_at' => $this->updatedAt($record),
        ]);
    }

    public function destroy(Request $request, string $resource, string $id): RedirectResponse
    {
        $class = $this->resolve($resource);

        $record = $this->findScoped($class, $id);

        abort_unless($class::can('delete', $record), 403);

        $class::beforeDelete($record);

        Transaction::run(function () use ($class, $record): void {
            $record->delete();
            $class::afterDelete($record);
        });

        return back()->with('success', $class::label().' deleted.');
    }

    /**
     * Bring a soft-deleted record back.
     *
     * Deliberately its own route rather than a flag on update: restoring is not
     * an edit, it carries a different permission, and it is the one action whose
     * whole purpose is to be reachable after a mistake. Burying it in a form
     * would mean opening the record to undo deleting it.
     */
    public function restore(Request $request, string $resource, string $id): RedirectResponse
    {
        $class = $this->resolve($resource);

        $record = $this->findTrashed($class, $id);

        // `restore` and not `update`: a policy may well let someone edit records
        // without letting them resurrect one.
        abort_unless($class::can('restore', $record), 403);

        Transaction::run(static function () use ($record): void {
            $record->restore();
        });

        return back()->with('success', $class::label().' restored.');
    }

    /**
     * Delete permanently.
     *
     * Separate from destroy() because they are different acts: destroy() is
     * reversible and this is not. Sharing a route would mean one confirmation
     * dialog standing in front of two very different outcomes.
     */
    public function forceDestroy(Request $request, string $resource, string $id): RedirectResponse
    {
        $class = $this->resolve($resource);

        $record = $this->findTrashed($class, $id);

        abort_unless($class::can('forceDelete', $record), 403);

        $record->forceDelete();

        return back()->with('success', $class::label().' permanently deleted.');
    }

    /**
     * Find a record INCLUDING trashed ones, still tenant-scoped.
     *
     * `withTrashed()` lifts only the soft-delete scope; every other global
     * scope - tenancy above all - still applies, so another organisation's
     * deleted record is as unreachable as its live ones.
     */
    /**
     * THE SAME SCOPING AS `findScoped`, WHICH THIS USED TO SKIP.
     *
     * `findScoped`'s own note says the nested parent claim is applied "in here
     * rather than per action, so update, destroy, restore, actions and cell
     * edits all get it from the one place none of them can forget." Restore and
     * force-delete forgot it: they came through here, and here resolved a
     * trashed record by id alone.
     *
     * TWO GUARANTEES WERE LOST, not one. The URL's parent claim was not
     * enforced, and `NestedContext::parent()` - which also runs
     * `abort_unless($parentClass::can('view', $parent), 403)` - was never
     * called, so the parent stopped being the authorisation context at all.
     *
     * Somebody holding `restore` and `forceDelete` on a child resource could
     * therefore address a record under a parent they may not open, by naming a
     * parent they may. The tenant scope still applied, so it is horizontal
     * movement inside one tenant - against `forceDelete`, which is permanent.
     */
    /**
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     */
    private function findTrashed(string $class, string $id): Model
    {
        $model = $class::model();

        abort_unless(
            in_array(SoftDeletes::class, class_uses_recursive($model), true),
            404,
            "Resource [{$class::key()}] does not support soft deletes.",
        );

        $query = $model::query()->withoutGlobalScope(SoftDeletingScope::class);

        $parent = NestedContext::parent(request(), $class);

        if ($parent !== null) {
            NestedRelation::constrain($query, $class, $parent);
        }

        return $query->findOrFail($id);
    }

    /**
     * Rejects a write against a record that changed since the form was opened.
     *
     * Thrown as a validation error rather than a bare 409 so the SPA surfaces it
     * inline with everything else, instead of the frozen-page failure
     * antipatterns §2.2 describes, where a JSON-expecting request took an abort
     * branch and the page simply sat there.
     */
    private function assertNotStale(Request $request, Model $record): void
    {
        $submitted = $request->input('_updated_at');

        $updatedAt = $record->getAttribute('updated_at');

        if ($submitted === null || ! $updatedAt instanceof \DateTimeInterface) {
            return;
        }

        if ($updatedAt->format(DATE_ATOM) === $submitted) {
            return;
        }

        throw ValidationException::withMessages([
            '_conflict' => 'This record was changed by someone else while you were editing. '
                .'Reload to see the current values, or save again to overwrite them.',
        ]);
    }

    /**
     * Return the canonical timestamp used by optimistic concurrency responses.
     *
     * Eloquent models expose attributes dynamically, so this deliberately uses
     * the model's attribute API instead of asking static analysis to assume
     * every model has a concrete `updated_at` property.
     */
    private function updatedAt(Model $record): ?string
    {
        $updatedAt = $record->getAttribute('updated_at');

        return $updatedAt instanceof \DateTimeInterface
            ? $updatedAt->format(DATE_ATOM)
            : null;
    }

    private function applyTenant(Model $record): void
    {
        $context = app(TenantContext::class);

        if (! $context->shouldScopeByColumn()) {
            // Dedicated-database tenancy: the connection is the boundary and the
            // column does not exist. Writing one would throw.
            return;
        }

        /*
         * A RECORD WHOSE OWN TABLE HAS NO TENANT COLUMN IS NOT TENANT DATA,
         * whatever the tenancy mode. `CustomField` (roadmap 5.1) is the
         * first of these - an installation-wide definition, not something a
         * single tenant owns (see the migration's and the model's own
         * notes) - so its table was never given one. Writing it anyway would
         * throw the same way a dedicated-database write would.
         */
        if (! Schema::hasColumn($record->getTable(), $context->column())) {
            return;
        }

        /*
         * A COLUMN IS NOT THE SAME AS A SCOPE, and reading it as one broke the
         * first central resource that shipped.
         *
         * `ContentEntry` has a nullable `tenant_id` where NULL MEANS EVERYBODY
         * - central Help and FAQ, written once and read from every portal -
         * and deliberately carries no `TenantScope`. This method saw the
         * column, demanded a tenant, and the superadmin portal (which resolves
         * none, by design) got 403 on every save: a screen whose permissions
         * were entirely correct, refusing to write the row it exists to write.
         *
         * SO THE QUESTION IS WHETHER THE MODEL IS SCOPED, not whether the
         * table has somewhere to put a key. A model without the scope owns its
         * own meaning for that column, and stamping it would be this
         * controller overruling the model.
         *
         * THE LOUD REFUSAL BELOW STAYS FOR EVERYTHING ELSE, which is the half
         * that matters: a genuinely tenant-scoped record with no tenant
         * resolved is still a write that must not happen.
         */
        if (! $record->hasGlobalScope(TenantScope::class)) {
            return;
        }

        $key = $context->currentKey();

        // No tenant is always a bug in a panel, never a valid state
        // (antipatterns §1.2). Fail loudly rather than write an unowned row.
        abort_if($key === null, 403, 'No tenant resolved; refusing to write an unscoped record.');

        $record->setAttribute($context->column(), $key);
    }

    /**
     * Saves a record, turning a unique-constraint collision into a field
     * error instead of a 500.
     *
     * GENERIC ON PURPOSE - roadmap 5.1 is what needed this first (two custom
     * field definitions both called `notes` on `clients`, caught by the
     * migration's own `unique(['resource', 'key'])`), but nothing about it is
     * specific to that table. Every resource's `store()`/`update()` already
     * runs through here, so any declared unique constraint - present or
     * future - gets the same friendly rejection rather than a stack trace,
     * without every resource needing its own `Rule::unique()` wired up by
     * hand (which would also need `->ignore()` on update, and nothing in the
     * form layer today has the current record's id at schema-build time to
     * give it).
     */
    private function save(Model $record): void
    {
        try {
            /*
             * A CREATE IS RARELY ONE INSERT - custom fields fold into a JSON
             * column, observers write an audit entry, a counter is bumped -
             * so a failure partway through leaves a row saved with its trail
             * missing. `Transaction::run` opens one only where the panel asked
             * for it; everywhere else this is the bare save it always was.
             */
            Transaction::run(static fn () => $record->save());
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages([
                '_conflict' => 'This would duplicate a record that already exists.',
            ]);
        }
    }

    /**
     * Moves each sanitized `custom_{key}` entry into the record's `custom`
     * JSON column, unprefixed - roadmap 5.1.
     *
     * READS THE RECORD'S OWN EXISTING `custom` FIRST, because a definition
     * can be hidden by its own `visibleWhen` (Form::sanitize already dropped
     * it from `$sanitized` in that case) or simply absent from an older
     * client's payload. Starting from `[]` every time would erase a value
     * the operator never had a chance to see, let alone change - the same
     * "declared but not submitted keeps its stored value" guarantee
     * `Form::sanitize()` already gives every real column.
     *
     * FROM `CustomField::forResource()`, NOT the schema's already-serialised
     * `customFields()`: this needs both the prefixed form key (to find the
     * value in `$sanitized`) and the bare stored key (to write into
     * `custom`) for the same definition, and the schema array only kept the
     * prefixed one - re-deriving the bare key by stripping `custom_` would
     * be re-encoding a fact `CustomFieldFactory` already owns.
     *
     * A NO-OP FOR EVERY RESOURCE WITHOUT DEFINITIONS - the common case - so
     * `$sanitized['custom']` is never set, and a model with no `custom`
     * column (nothing has defined one for it yet) is never asked to save
     * one.
     *
     * @param  array<string, mixed>  $sanitized
     * @return array<string, mixed>
     */
    private function foldCustomFields(string $resource, array $sanitized, Model $record): array
    {
        $definitions = CustomField::forResource($resource);

        if ($definitions->isEmpty()) {
            return $sanitized;
        }

        $custom = $record->getAttribute('custom') ?? [];

        foreach ($definitions as $definition) {
            $formKey = CustomFieldFactory::formKey($definition);

            if (! array_key_exists($formKey, $sanitized)) {
                continue;
            }

            $custom[$definition->key] = $sanitized[$formKey];
            unset($sanitized[$formKey]);
        }

        $sanitized['custom'] = $custom;

        return $sanitized;
    }

    /**
     * Persist relationship repeaters after the parent exists.
     *
     * Existing children are resolved through the bound relation, never the
     * child model globally, so a submitted id cannot update or delete a row
     * outside this parent. The parent policy already authorizes the form write;
     * the repeater's child schema is the mass-assignment allowlist.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @param  array<string, mixed>  $validated
     */
    private function syncRelationshipRepeaters(string $class, Model $record, array $validated): void
    {
        foreach ($class::formDefinition()->fields() as $field) {
            if (! $field instanceof RepeaterField || ! $field->isRelationship() || ! array_key_exists($field->key, $validated)) {
                continue;
            }

            $name = $field->relationshipName();

            if ($name === null || ! method_exists($record, $name)) {
                throw new InvalidArgumentException("Repeater relationship [{$name}] does not exist on [{$class}].");
            }

            $relation = $record->{$name}();

            if (! $relation instanceof HasMany && ! $relation instanceof MorphMany) {
                throw new InvalidArgumentException(
                    "Relationship repeater [{$field->key}] requires a HasMany or MorphMany relation."
                );
            }

            $retained = [];
            $existing = $relation->get();

            foreach ($field->rowsForStorage($validated[$field->key]) as $row) {
                $id = $row['_id'] ?? null;
                unset($row['_id']);

                if ($id !== null) {
                    $child = $relation->whereKey($id)->first();

                    if ($child === null) {
                        throw ValidationException::withMessages([
                            $field->key => ['A relationship row is no longer available. Reload and try again.'],
                        ]);
                    }
                } else {
                    $child = $relation->getRelated()->newInstance();
                }

                // A child may carry its own tenant scope. The parent relation
                // constrains ownership, but does not stamp the child column.
                $this->applyTenant($child);
                $child->forceFill($row);
                $relation->save($child);
                $retained[] = $child->getKey();
            }

            // Delete through the relation instance so its parent constraint,
            // morph constraint, and child global scopes are all retained.
            foreach ($existing as $child) {
                if (! in_array($child->getKey(), $retained, false)) {
                    $child->delete();
                }
            }
        }
    }

    /**
     * `isEnabled()` TOO, WHICH THIS ALONE USED TO OMIT.
     *
     * `ResourceController::guard`, `ResourceController::index`, `BulkController`
     * and the trash bin all refuse a resource whose feature flag is off. This
     * did not - so on a tenant without the flag, every READ screen 404ed while
     * all eight write endpoints here kept working: create, update, delete,
     * restore, force-delete, reorder, cell edit and record action.
     *
     * `Resource::isEnabled()` states the rule this was breaking: "a disabled
     * feature hides the resource from navigation AND returns 404 from its
     * routes. Hiding the link alone is not a control." The route constraint
     * cannot cover it - `whereIn('resource', $keys)` is per PANEL, and a
     * feature flag is per TENANT.
     *
     * @return class-string<\Alxtexh\Panel\Resources\Resource>
     */
    private function resolve(string $resource): string
    {
        $class = app(PanelManager::class)->resource($resource);

        if ($class === null || ! $class::isEnabled()) {
            throw new NotFoundHttpException("No panel resource registered for [{$resource}].");
        }

        abort_unless($class::isAccessible(), 403);

        return $class;
    }

    /**
     * The tenant global scope makes this a 404 for another tenant's record,
     * which is the correct answer - confirming existence would itself leak.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     */
    private function findScoped(string $class, string $id): Model
    {
        $model = $class::model();

        $query = $model::query();

        /*
         * NESTED - roadmap 4.2. The URL claims this record belongs to a
         * specific parent, so the FETCH carries the claim: a mismatched
         * pairing is a 404 from `findOrFail`, indistinguishable from a
         * record that does not exist. In here rather than per action, so
         * update, destroy, restore, actions and cell edits all get it from
         * the one place none of them can forget.
         */
        $parent = NestedContext::parent(request(), $class);

        if ($parent !== null) {
            NestedRelation::constrain($query, $class, $parent);
        }

        return $query->findOrFail($id);
    }
}
