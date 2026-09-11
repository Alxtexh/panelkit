<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Alxtexh\Panel\CustomFields\CustomField;
use Alxtexh\Panel\CustomFields\CustomFieldFactory;
use Alxtexh\Panel\CustomFields\CustomFieldStorage;
use Alxtexh\Panel\Forms\DraftStore;
use Alxtexh\Panel\Forms\Fields\Field;
use Alxtexh\Panel\Forms\Fields\SelectField;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Http\NestedContext;
use Alxtexh\Panel\Http\NestedRelation;
use Alxtexh\Panel\Live\LiveConfig;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Schema\Component;
use Alxtexh\Panel\Widgets;
use Alxtexh\Panel\Workflow\WorkflowHistory;
use Alxtexh\Panel\Workflow\WorkflowOverride;
use Illuminate\Contracts\Database\Query\Expression as QueryExpression;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Serves every resource list. One controller, not one per screen.
 *
 * The transport split is visible here and is the whole architecture:
 *
 *   `schema` is sent on the FIRST load only. Every subsequent interaction is a
 *   partial reload whose `only:` list omits it, so filtering, sorting and paging
 *   move rows and nothing else. That is the difference from a server-rendered
 *   panel, where the whole component tree re-renders per interaction
 *   (antipatterns §3.1: 500-950 ms per page, of which 1-16 ms was the database).
 *
 *   `filterOptions` travels WITH the data, not inside the schema, because a
 *   tenant's routers are tenant data (addendum Part A).
 */
final class ResourceController extends Controller
{
    /**
     * Options for a searchable select.
     *
     * Lean JSON, capped, and tenant-scoped by whatever model the field's query
     * touches. This is what lets a relation with 100k rows be pickable at all -
     * the alternative was shipping every row to the browser as an option
     * element, which is a correctness problem rather than a slow one.
     */
    public function fieldOptions(Request $request, string $resource): JsonResponse
    {
        $class = $this->guard($resource);

        abort_unless($class::can('create') || $class::can('update'), 403);

        $key = (string) $request->query('field', '');
        $term = trim((string) $request->query('q', ''));
        $form = $request->query('form', $request->input('form', []));
        $values = is_string($form) ? (json_decode($form, true) ?: []) : (array) $form;

        /*
         * THE RECORD FORM'S FIELDS AND EVERY ACTION FORM'S.
         *
         * Actions were missing when `form()` landed, and it worked anyway in
         * the one place it was tried - because that action's select happened to
         * share a key with a field on the record form. An action asking for
         * something the form does not have would have returned an empty list
         * and rendered a searchable select that finds nothing, with no error.
         *
         * ORDER IS DELIBERATE: the record form wins a shared key. Both declare
         * the same searchable select in practice, and preferring the form keeps
         * the answer identical to what it was before actions could ask.
         */
        foreach ($this->searchableFields($class) as $field) {
            if ($field->key !== $key) {
                continue;
            }

            // Only a field that OPTED IN may be queried this way. Otherwise the
            // endpoint becomes a way to enumerate any option list on demand.
            if (! $field instanceof SelectField || ! $field->isSearchable()) {
                break;
            }

            return response()->json(['options' => array_slice($field->search($term, $values), 0, 25)]);
        }

        return response()->json(['options' => []]);
    }

    /**
     * Create a related option without leaving the form.
     *
     * The field opted in with `SelectField::createOption()`. Resource CRUD
     * stays on dedicated pages; this is only the picker shortcut.
     */
    public function createFieldOption(Request $request, string $resource): JsonResponse
    {
        $class = $this->guard($resource);

        abort_unless($class::can('create') || $class::can('update'), 403);

        $key = (string) $request->input('field', '');
        $values = (array) $request->input('values', []);

        foreach ($this->searchableFields($class) as $field) {
            if ($field->key !== $key || ! $field instanceof SelectField) {
                continue;
            }

            abort_unless($field->canCreateOption(), 404);

            return response()->json(['option' => $field->createRelated($values)]);
        }

        abort(404);
    }

    /**
     * Re-resolve options and schema from the current form values.
     *
     * `live()` contract: the client POSTs `{ field, values }`. This returns
     * `{ options, schema, values }` so afterStateUpdated-style server logic
     * can hide, disable, or replace fields. `visibleWhen` stays a client-side
     * hide. There is no Livewire round-trip.
     */
    public function formState(Request $request, string $resource): JsonResponse
    {
        $class = $this->guard($resource);

        abort_unless($class::can('create') || $class::can('update'), 403);

        $values = (array) $request->input('values', []);
        $changed = (string) $request->input('field', '');
        $form = $class::formDefinition();

        foreach ($form->fields() as $field) {
            if ($changed !== '' && $field->key === $changed && $field->isLive()) {
                $values = $field->applyAfterStateUpdated($values);
            }
        }

        return response()->json($this->formStatePayload($class, $form, $values));
    }

    /** Save a version-checked server draft for a create form. */
    public function saveDraft(Request $request, string $resource): JsonResponse
    {
        return $this->writeDraft($request, $resource, null);
    }

    /** Save a version-checked server draft for an edit form. */
    public function saveRecordDraft(Request $request, string $resource, string $id): JsonResponse
    {
        return $this->writeDraft($request, $resource, $id);
    }

    public function draft(Request $request, string $resource, ?string $id = null): JsonResponse
    {
        $class = $this->guard($resource);
        $validated = $request->validate(['draftKey' => ['required', 'string', 'max:80']]);
        $record = $this->draftRecord($request, $class, $id ?? $request->input('id'));

        abort_unless($record === null ? $class::can('create') : $class::can('update', $record), 403);

        $draft = DraftStore::get((string) $request->user()->getAuthIdentifier(), $class::key(), $validated['draftKey']);

        if ($draft === null) {
            return response()->json(['draft' => null]);
        }

        $current = $this->updatedAt($record);

        return response()->json([
            'draft' => $draft,
            'stale' => $record !== null && $draft['version'] !== $current,
            'currentVersion' => $current,
        ], $record !== null && $draft['version'] !== $current ? 409 : 200);
    }

    public function forgetDraft(Request $request, string $resource, ?string $id = null): JsonResponse
    {
        $class = $this->guard($resource);
        $validated = $request->validate(['draftKey' => ['required', 'string', 'max:80']]);
        $record = $this->draftRecord($request, $class, $id ?? $request->input('id'));

        abort_unless($record === null ? $class::can('create') : $class::can('update', $record), 403);
        DraftStore::forget((string) $request->user()->getAuthIdentifier(), $class::key(), $validated['draftKey']);

        return response()->json(['ok' => true]);
    }

    private function writeDraft(Request $request, string $resource, ?string $id): JsonResponse
    {
        $class = $this->guard($resource);
        $form = $class::formDefinition();
        abort_unless($form->toSchema()['autosave'] ?? false, 404);
        $validated = $request->validate([
            'draftKey' => ['required', 'string', 'max:80'],
            'values' => ['required', 'array'],
            'version' => ['nullable', 'string', 'max:64'],
        ]);
        $record = $this->draftRecord($request, $class, $id);

        abort_unless($record === null ? $class::can('create') : $class::can('update', $record), 403);
        $current = $this->updatedAt($record);

        if ($record !== null && $validated['version'] !== $current) {
            return response()->json(['message' => 'The record changed since this draft began.', 'currentVersion' => $current], 409);
        }

        DraftStore::put(
            (string) $request->user()->getAuthIdentifier(),
            $class::key(),
            $validated['draftKey'],
            $form->sanitize($validated['values']),
            $validated['version'] ?? null,
        );

        return response()->json(['ok' => true, 'version' => $current, 'savedAt' => now()->toIso8601String()]);
    }

    /**
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     */
    private function draftRecord(Request $request, string $class, mixed $id): ?Model
    {
        if ($id === null || $id === '') {
            NestedContext::parent($request, $class);

            return null;
        }

        if (! is_int($id) && ! is_string($id)) {
            throw new NotFoundHttpException('The draft record identifier is invalid.');
        }

        $query = $class::model()::query();
        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            NestedRelation::constrain($query, $class, $parent);
        }

        return $query->findOrFail($id);
    }

    /**
     * Run a named prefix/suffix Action against the posted form values.
     *
     * The client POSTs `{ field, action, values }`. Only an `Action` declared
     * on that field is runnable. Copy and URL affixes never reach this.
     * Returns `{ options, schema, values }` like `form-state`. No Livewire.
     */
    public function formAction(Request $request, string $resource): JsonResponse
    {
        $class = $this->guard($resource);

        abort_unless($class::can('create') || $class::can('update'), 403);

        $validated = $request->validate([
            'field' => ['required', 'string', 'max:64'],
            'action' => ['required', 'string', 'max:64'],
            'values' => ['nullable', 'array'],
        ]);

        $values = (array) ($validated['values'] ?? []);
        $form = $class::formDefinition();
        $action = null;

        foreach ($form->fields() as $field) {
            if ($field->key !== $validated['field']) {
                continue;
            }

            $action = $field->affixAction($validated['action']);
            break;
        }

        if ($action === null || ! $action->hasFormAction()) {
            throw new NotFoundHttpException(
                "No affix action [{$validated['action']}] on [{$validated['field']}]."
            );
        }

        $values = $action->runForm($values);

        return response()->json($this->formStatePayload($class, $form, $values));
    }

    /**
     * Table-backed picker. A dedicated page, not a modal.
     *
     * Reuses ListQuery of the related resource. The form field opted in with
     * `SelectField::tableSelect()`. Choosing a row returns to the form.
     */
    public function picker(Request $request, string $resource, string $field): Response
    {
        $class = $this->guard($resource);
        abort_unless($class::can('create') || $class::can('update'), 403);

        $select = $this->tableSelectField($class, $field);
        $related = $select->pickerResource();

        abort_if($related === null, 404);
        abort_unless($related::isEnabled() && $related::isAccessible(), 404);
        abort_unless($related::can('viewAny'), 403);

        $result = $related::definition()->toListQuery($related::model())->run($request);
        $return = $this->safeReturnUrl($request, $class);

        return Inertia::render('ResourcePicker', [
            'schema' => $related::schema(),
            'field' => $field,
            'formResource' => $class::key(),
            'chooseBase' => $this->pickerChooseBase($request, $class, $field),
            'returnUrl' => $return,
            'breadcrumbs' => [
                ...($this->formTrail($request, $class)),
                ['title' => 'Choose '.$related::label(), 'href' => '#'],
            ],
            ...$result->toProps(),
        ]);
    }

    /**
     * Stamp the chosen id onto the return URL. The related row must be visible
     * to this tenant; another organisation's id is a 404.
     */
    public function choose(Request $request, string $resource, string $field, string $id): RedirectResponse
    {
        $class = $this->guard($resource);
        abort_unless($class::can('create') || $class::can('update'), 403);

        $select = $this->tableSelectField($class, $field);
        $related = $select->pickerResource();

        abort_if($related === null, 404);

        $record = $related::model()::query()->find($id);

        abort_if($record === null, 404);
        abort_unless($related::can('view', $record), 404);

        $return = $this->safeReturnUrl($request, $class);
        $separator = str_contains($return, '?') ? '&' : '?';

        return redirect($return.$separator.http_build_query([$field => $record->getKey()]));
    }

    /**
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     */
    private function tableSelectField(string $class, string $field): SelectField
    {
        foreach ($class::formDefinition()->fields() as $candidate) {
            if ($candidate instanceof SelectField && $candidate->key === $field && $candidate->pickerResource() !== null) {
                return $candidate;
            }
        }

        throw new NotFoundHttpException("No table-select field [{$field}] on [{$class::key()}].");
    }

    /**
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     */
    private function safeReturnUrl(Request $request, string $class): string
    {
        $return = (string) $request->query('return', '');

        if ($return !== '' && str_starts_with($return, '/') && ! str_starts_with($return, '//')) {
            return $return;
        }

        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            return NestedContext::schema($class::schema(), $class, $parent)['routes']['index'].'/create';
        }

        return $class::baseUrl('create');
    }

    /**
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     */
    private function pickerChooseBase(Request $request, string $class, string $field): string
    {
        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            $index = NestedContext::schema($class::schema(), $class, $parent)['routes']['index'] ?? $class::baseUrl();

            return rtrim((string) $index, '/').'/pick/'.$field;
        }

        return $class::baseUrl('pick/'.$field);
    }

    /**
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @return list<array{title: string, href: string}>
     */
    private function formTrail(Request $request, string $class): array
    {
        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            return NestedContext::breadcrumbs($class, $parent);
        }

        return $this->trail($class, 'New');
    }

    /**
     * Rows that changed, for the poll driver.
     *
     * Lean JSON, never an Inertia render. The whole point is that staying fresh
     * costs an indexed lookup rather than a page render - antipatterns S3.1
     * measured the system being replaced at 500-950ms per page of which 1-16ms
     * was the database, and repeating that on a timer is what makes polling a
     * bad word.
     *
     * Returns 204 when nothing changed, which is the common case, so the
     * client does no work and the response is empty.
     */
    public function updates(Request $request, string $resource): JsonResponse
    {
        $class = $this->guard($resource);

        abort_unless($class::can('viewAny'), 403);

        $ids = array_filter(explode(',', (string) $request->query('ids', '')));
        $since = (string) $request->query('since', '');

        if ($ids === [] || $since === '') {
            return response()->json(['records' => [], 'at' => now()->toIso8601String()]);
        }

        // Bounded: a caller cannot ask about more ids than a page can hold.
        $max = (int) config('panel.pagination.per_page_options.3', 100);
        $ids = array_slice($ids, 0, $max);

        $changed = $class::definition()->toListQuery($class::model())->changedSince($ids, $since);

        return response()->json([
            'records' => $changed,
            // The server's clock, not the client's - a client whose clock is
            // slow would otherwise re-request the same window forever, and one
            // whose clock is fast would skip changes entirely.
            'at' => now()->toIso8601String(),
        ]);
    }

    /**
     * Create form. A REAL PAGE, not a modal.
     *
     * Filament routes create, view and edit as their own pages, and the reasons
     * are practical rather than stylistic: a page is linkable, survives a
     * refresh, gets its own browser-history entry, and has room for a form that
     * a dialog cannot hold. The modal remains for quick inline actions, which is
     * what a modal is actually good at.
     */
    public function create(Request $request, string $resource): Response
    {
        $class = $this->guard($resource);

        abort_unless($class::can('create'), 403);
        abort_if($class::formDefinition()->fields() === [], 404, "Resource [{$resource}] has no form.");

        $parent = NestedContext::parent($request, $class);

        return Inertia::render('ResourceForm', [
            'schema' => $parent === null
                ? $class::schema()
                : NestedContext::schema($class::schema(), $class, $parent),
            'record' => null,
            'values' => $class::formDefinition()->valuesFor(null),
            'formOptions' => $class::formDefinition()->resolveOptions(),
            'breadcrumbs' => $parent === null
                ? $this->trail($class, 'New')
                : [...NestedContext::breadcrumbs($class, $parent), ['title' => 'New', 'href' => '#']],
            'customFieldSupport' => $this->customFieldSupport($class),
            'renderHooks' => app(PanelManager::class)->renderHooks($class::key()),
        ]);
    }

    /**
     * Pick existing related records. A dedicated page, not a modal.
     *
     * BelongsToMany only. HasMany creates new children; this attaches rows
     * that already exist. `/attach` is a fixed segment beside `/create`.
     */
    public function attachForm(Request $request, string $resource): Response
    {
        $class = $this->guard($resource);
        $parent = NestedContext::parent($request, $class);

        abort_if($parent === null || ! NestedRelation::belongsToMany($class), 404);
        abort_unless($class::can('update'), 403);

        $pivotColumns = $class::pivotColumns();

        return Inertia::render('ResourceAttach', [
            'schema' => NestedContext::schema($class::schema(), $class, $parent),
            'options' => NestedRelation::attachableOptions($parent, $class),
            'pivotForm' => $pivotColumns === [] ? null : Form::make()->schema($pivotColumns)->toSchema(),
            'breadcrumbs' => [
                ...NestedContext::breadcrumbs($class, $parent),
                ['title' => 'Attach', 'href' => '#'],
            ],
        ]);
    }

    /** Read-only detail page. */
    public function show(Request $request, string $resource, string $id): Response
    {
        $class = $this->guard($resource);

        $record = $class::model()::query()->findOrFail($id);

        abort_unless($class::can('view', $record), 403);

        // Nested: the record must actually belong to the parent in the URL. A
        // mismatched pairing 404s - the URL is making a claim about ownership,
        // and serving the record anyway would let the address lie.
        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            abort_unless(self::childBelongs($class, $parent, $record), 404);
        }

        /*
         * FETCHED THROUGH THE TABLE'S SELECT AND JOINS BY DEFAULT, so joined
         * columns like plan_name are present - the raw model carries only its
         * own attributes, and a missing joined value renders as an em dash
         * that reads like real data rather than an omission.
         *
         * A RESOURCE WHOSE `infolist()` DECLARES ITS OWN ENTRIES DRIVES ITS
         * OWN SELECTION FROM THOSE INSTEAD (`infolistSelect()` below), not
         * from `table()->columns()` - an entry for an attribute the list
         * happens not to display used to render `—` even though the value
         * existed, because the View's query was really the List's.
         */
        $row = $class::definition()
            ->toListQuery($class::model(), $this->infolistSelect($class))
            ->find($id) ?? $record->toArray();

        $relationFormOptions = [];

        foreach ($class::relations() as $manager) {
            if (! $manager->canInlineCreate($class, $record)) {
                continue;
            }

            $form = $manager->formDefinition();

            if ($form !== null) {
                $relationFormOptions[$manager->key] = $form->resolveOptions();
            }
        }

        return Inertia::render('ResourceView', [
            'schema' => $parent === null
                ? $class::schema()
                : NestedContext::schema($class::schema(), $class, $parent),
            'record' => [...$row, 'id' => $record->getKey(), '_title' => $class::recordTitle($record)],
            'can' => $class::permissions(),
            'workflow' => self::workflowContext($class, $row, $record),
            'comments' => self::commentsContext($class, $record, $request),
            'relationFormOptions' => $relationFormOptions,

            /*
             * PLUGIN MARKUP ON THE RECORD PAGE TOO - roadmap 4.4.
             *
             * The list had these from the start and the record page did not,
             * which made the whole mechanism half a feature: the interesting
             * things a plugin wants to add to a screen - a conversation, a
             * payment history, a device's live status - all belong ON a
             * record, not above a table of them.
             */
            'renderHooks' => app(PanelManager::class)->renderHooks($class::key()),

            // The transport, so the client knows how to stay fresh without any
            // page or component knowing which driver is configured.
            'live' => LiveConfig::fromConfig()->toArray(),
            'breadcrumbs' => $parent === null
                ? $this->trail($class, $this->recordLabel($class, $record))
                : [...NestedContext::breadcrumbs($class, $parent), ['title' => $this->recordLabel($class, $record), 'href' => '#']],
        ]);
    }

    /**
     * Rows for one related list.
     *
     * LEAN JSON, and fetched on demand. The alternative - eager-loading the
     * relation with the parent - reads every related row to render the twenty
     * a person looks at, which is fine for the client the developer tested with
     * and ruinous for the one with 40,000 sessions.
     *
     * Authorized against the PARENT record, because that is what the operator
     * is looking at: permission to view a client is what grants sight of that
     * client's sessions, and a separate policy per relation would be a second
     * place to forget.
     */
    public function relation(Request $request, string $resource, string $id, string $relation): JsonResponse
    {
        $class = $this->guard($resource);

        $record = $class::model()::query()->findOrFail($id);

        $manager = $class::relation($relation);

        if ($manager === null) {
            throw new NotFoundHttpException("No relation [{$relation}] on [{$resource}].");
        }

        abort_unless($class::can($manager->getAbility(), $record), 403);

        $result = $manager->rows($request, $record->getKey());

        return response()->json([
            'records' => $result->records,
            // Keyset, like every other list: page 40 of a client's sessions
            // costs what page 1 costs. No total - a related list does not need
            // a blocking count in front of its rows any more than a table does.
            'nextCursor' => $result->nextCursor,
            'perPage' => $result->perPage,
            // Same filter contract as ResourceIndex: search + filter keys on
            // the query string, options and chips on the payload so the
            // relation TableShell can reuse TableToolbar without a second trip.
            'search' => $result->state['search'],
            'filters' => $result->state['filters'],
            'filterOptions' => $manager->definition()->resolveFilterOptions(),
            'indicators' => $result->indicators,
        ]);
    }

    /**
     * Create a related row from the parent record page without leaving it.
     *
     * Edit and view stay on the nested resource's dedicated pages. The parent
     * key is stamped from the URL, never from the form body.
     */
    public function storeRelation(Request $request, string $resource, string $id, string $relation): JsonResponse
    {
        $class = $this->guard($resource);

        $parent = $class::model()::query()->findOrFail($id);

        $manager = $class::relation($relation);

        if ($manager === null) {
            throw new NotFoundHttpException("No relation [{$relation}] on [{$resource}].");
        }

        abort_unless($class::can($manager->getAbility(), $parent), 403);
        abort_unless($manager->canInlineCreate($class, $parent), 403);

        $form = $manager->formDefinition();

        abort_if($form === null, 404);

        $rules = $form->rules();
        $parentColumn = $manager->stampedParentColumn();

        if ($parentColumn !== null) {
            unset($rules[$parentColumn]);
        }

        $validated = $request->validate($rules);

        $record = $manager->store($class, $parent, $validated);

        $rows = $manager->rows($request, $parent->getKey())->records;

        $row = collect($rows)->first(
            static fn (array $candidate): bool => (string) ($candidate['id'] ?? '') === (string) $record->getKey(),
        );

        return response()->json([
            'record' => $row ?? ['id' => $record->getKey()],
        ], 201);
    }

    /** Edit form. A real page, for the same reasons as create. */
    public function edit(Request $request, string $resource, string $id): Response
    {
        $class = $this->guard($resource);

        $record = $class::model()::query()->findOrFail($id);

        abort_unless($class::can('update', $record), 403);

        // Nested: the record must belong to the parent named in the URL.
        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            abort_unless(self::childBelongs($class, $parent, $record), 404);
        }

        $form = $class::formDefinition();
        abort_if($form->fields() === [], 404, "Resource [{$resource}] has no form.");

        $values = [
            ...$form->valuesFor($record),
            // `valuesFor()` read `custom_{key}` as a plain attribute and
            // found nothing - the value actually lives unprefixed inside
            // `custom`. Overriding those keys here, after the spread, is
            // cheaper than teaching the generic form layer about one
            // resource-specific storage convention (see
            // RecordController::foldCustomFields()'s own note).
            ...$this->customFieldValues($class::key(), $record),
            // Carried so a stale save is rejected rather than silently
            // overwriting another admin (addendum C).
            '_updated_at' => $this->updatedAt($record),
        ];

        return Inertia::render('ResourceForm', [
            'schema' => $parent === null
                ? $class::schema()
                : NestedContext::schema($class::schema(), $class, $parent),
            'record' => ['id' => $record->getKey(), 'label' => $this->recordLabel($class, $record)],
            'values' => $values,
            /*
             * `currentValueOptions()` AFTER `resolveOptions()`, spread order
             * matters: a searchable relationship field is present in
             * `resolveOptions()`'s own output too, as `[]` ("ships no
             * options, the client searches") - this fills in the one entry
             * that matters for an Edit page, the record's own existing
             * value, so `FormFieldControl.vue` has a label instead of the
             * raw foreign key on first paint. See both methods' docblocks.
             */
            'formOptions' => [...$form->resolveOptions(), ...$form->currentValueOptions($values)],
            'breadcrumbs' => $parent === null
                ? $this->trail($class, 'Edit')
                : [...NestedContext::breadcrumbs($class, $parent), ['title' => 'Edit', 'href' => '#']],
            'customFieldSupport' => $this->customFieldSupport($class),
            'renderHooks' => app(PanelManager::class)->renderHooks($class::key()),
        ]);
    }

    /**
     * Modal create payload. Same authorization and shape as `create()`, JSON only.
     */
    public function modalCreate(Request $request, string $resource): JsonResponse
    {
        $class = $this->guard($resource);

        abort_unless($class::can('create'), 403);
        abort_if($class::formDefinition()->fields() === [], 404, "Resource [{$resource}] has no form.");

        return response()->json($this->modalFormPayload($class, null));
    }

    /** Modal edit payload. */
    public function modalEdit(Request $request, string $resource, string $id): JsonResponse
    {
        $class = $this->guard($resource);

        $record = $class::model()::query()->findOrFail($id);

        abort_unless($class::can('update', $record), 403);

        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            abort_unless(self::childBelongs($class, $parent, $record), 404);
        }

        $form = $class::formDefinition();
        abort_if($form->fields() === [], 404, "Resource [{$resource}] has no form.");

        return response()->json($this->modalFormPayload($class, $record));
    }

    /** Modal view payload. */
    public function modalView(Request $request, string $resource, string $id): JsonResponse
    {
        $class = $this->guard($resource);

        $record = $class::model()::query()->findOrFail($id);

        abort_unless($class::can('view', $record), 403);

        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            abort_unless(self::childBelongs($class, $parent, $record), 404);
        }

        $row = $class::definition()->toListQuery($class::model())->find($id) ?? $record->toArray();

        return response()->json([
            'mode' => 'view',
            'record' => [...$row, 'id' => $record->getKey()],
            'can' => [
                'update' => $class::can('update', $record),
                'delete' => $class::can('delete', $record),
            ],
        ]);
    }

    /**
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @return array<string, mixed>
     */
    private function modalFormPayload(string $class, ?Model $record): array
    {
        $form = $class::formDefinition();

        return [
            'mode' => $record === null ? 'create' : 'edit',
            'record' => $record === null
                ? null
                : ['id' => $record->getKey(), 'label' => $this->recordLabel($class, $record)],
            'values' => $record === null
                ? $form->valuesFor(null)
                : [
                    ...$form->valuesFor($record),
                    ...$this->customFieldValues($class::key(), $record),
                    '_updated_at' => $this->updatedAt($record),
                ],
            'formOptions' => $form->resolveOptions(),
        ];
    }

    /**
     * Whether THIS form offers "+ Add a field to every {resource}", and what
     * the dialog needs if it does.
     *
     * The operator adding "one more thing we track" is LOOKING AT the record
     * form when the thought occurs - a definition screen under Configuration
     * is where definitions are managed, not where the need arises. So the
     * form itself carries the entry point, and this decides whether it may:
     * null - no affordance at all - unless the resource has custom-field
     * storage AND a CustomField resource is registered AND this user may
     * create definitions. A user who cannot define fields must not see the
     * button; hiding is not enforcement (the write path re-authorizes), but
     * offering a control that can only 403 teaches people the panel lies.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @return array{resource: string, labelPlural: string, types: list<string>, endpoint: string}|null
     */
    /**
     * Every field this resource could legitimately be asked to search.
     *
     * THE RECORD FORM'S AND EVERY ACTION FORM'S. Actions were missing when
     * `RecordAction::form()` landed, and it worked anyway in the one place it
     * was tried - because that action's select happened to share a key with a
     * field on the record form. An action asking for something the form does
     * not have would have rendered a searchable select that finds nothing, with
     * no error anywhere.
     *
     * ORDER IS DELIBERATE: the record form wins a shared key, which keeps the
     * answer identical to what it was before actions could ask.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @return list<Field>
     */
    private function searchableFields(string $class): array
    {
        $fields = $class::formDefinition()->fields();

        foreach ($class::definition()->recordActionList() as $action) {
            $form = $action->formDefinition();

            if ($form !== null) {
                $fields = [...$fields, ...$form->fields()];
            }
        }

        return $fields;
    }

    /**
     * Shared `{ options, schema, values }` body for live() and affix POST.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @param  array<string, mixed>  $values
     * @return array{options: array<string, mixed>, schema: array<string, mixed>, values: array<string, mixed>}
     */
    private function formStatePayload(string $class, Form $form, array $values): array
    {
        $options = [];

        foreach ($this->searchableFields($class) as $field) {
            if (! $field instanceof SelectField || ! $field->isSearchable()) {
                continue;
            }

            $options[$field->key] = array_slice($field->search('', $values), 0, 25);
        }

        return [
            'options' => $options,
            'schema' => $form->toSchema($values),
            'values' => $values,
        ];
    }

    /** @return array{resource: string, label: string, types: list<string>, endpoint: string}|null */
    private function customFieldSupport(string $class): ?array
    {
        if (! in_array($class::key(), CustomFieldStorage::resources(), true)) {
            return null;
        }

        /*
         * THE GATE, NOT A RESOURCE - Part G.4. The dedicated definitions
         * screen is gone, so there is no resource class to ask; the dialog
         * is the whole surface, and whether it appears is exactly whether
         * this person may create a definition.
         */
        if (! Gate::allows('create', CustomField::class)) {
            return null;
        }

        return [
            'resource' => $class::key(),
            // Singular, for "every client" - "every clients" is what plural
            // copy reads as, and the operator will read this sentence at the
            // exact moment they are deciding whether to commit a schema
            // change.
            'label' => $class::label(),
            'types' => CustomFieldFactory::types(),
            'endpoint' => '/custom-fields',
        ];
    }

    /**
     * Current custom field values for one record, keyed by their PREFIXED
     * form key so the result drops straight into the form's `values` payload.
     *
     * @return array<string, mixed>
     */
    private function customFieldValues(string $resource, Model $record): array
    {
        $definitions = CustomField::forResource($resource);

        if ($definitions->isEmpty()) {
            return [];
        }

        $custom = $record->getAttribute('custom') ?? [];

        return $definitions
            ->mapWithKeys(static fn (CustomField $d): array => [
                CustomFieldFactory::formKey($d) => $custom[$d->key] ?? null,
            ])
            ->all();
    }

    /**
     * The human label a breadcrumb or record chip shows for one record.
     *
     * `$record->name ?? "#{id}"` was the literal check before `recordTitle()`
     * existed, and four call sites (`show()`'s and `edit()`'s breadcrumbs,
     * `edit()`'s own record chip, and `modalFormPayload()`'s) never moved onto
     * it once it did - so a resource whose `recordTitle()` correctly drove
     * the View page's own H1 (Invoices, Tickets, Orders - anything identified
     * by `invoice_number`/`subject`/`order_number` rather than a literal
     * `name` column) still showed a raw `#102` in its OWN breadcrumb one line
     * above that title, and again as the Edit page's record chip. Confirmed
     * live: an Order's breadcrumb read "Orders > #2" directly under a page
     * titled "ORD-1002".
     *
     * @param  class-string<Resource>  $class
     */
    private function recordLabel(string $class, Model $record): string
    {
        return $class::recordTitle($record) ?? "#{$record->getKey()}";
    }

    /**
     * The View page's own value selection, when `infolist()` declares one.
     *
     * NULL MEANS "use the table's own select" - `infolist()` returning `[]`
     * is the resource's own documented fallback (see `Resource::infolist()`'s
     * docblock: "Empty means the view falls back to table columns"), and this
     * preserves that literally rather than reimplementing it here.
     *
     * `Entry::dependsOn()` folds in - `ImageEntry::fallbackFrom()` is the
     * reason it exists: a key read for rendering that is not the entry's own.
     *
     * THE WORKFLOW'S STATE COLUMN IS ALWAYS INCLUDED, when the resource has
     * one, regardless of whether an infolist entry happens to also show it.
     * `workflowContext()` below reads `$row[$workflow->rowKey()]`
     * unconditionally to resolve the current state and its transitions - a
     * resource whose infolist doesn't separately declare a `BadgeEntry` for
     * that same column would otherwise lose its workflow badge silently the
     * moment `infolist()` first gained any entries at all.
     *
     * @param  class-string<Resource>  $class
     * @return list<string|QueryExpression>|null
     */
    private function infolistSelect(string $class): ?array
    {
        $entries = Component::collectEntries($class::infolist());

        if ($entries === []) {
            return null;
        }

        $select = [];

        foreach ($entries as $entry) {
            $select[] = $entry->selectExpression();

            foreach ($entry->dependsOn() as $dependency) {
                $select[] = $dependency;
            }
        }

        $workflow = $class::resolvedWorkflow();

        if ($workflow !== null) {
            $select[] = $workflow->rowKey();
        }

        // Same split-then-rejoin `array_unique` cannot do directly over a mix
        // of strings and `Expression` objects - see `Table::resolveSelect()`.
        $strings = array_values(array_unique(array_filter($select, 'is_string')));
        $expressions = array_values(array_filter($select, static fn ($c): bool => ! is_string($c)));

        return [...$strings, ...$expressions];
    }

    /**
     * THE CRUMB BACK TO THE LIST, in the panel this screen belongs to.
     *
     * Taken from the schema's own `routes.index` rather than rebuilt from the
     * key, which is the whole reason that route carries the panel's path now.
     * Assembling `'/'.$class::key()` here was correct in one portal and wrong
     * in every other - a breadcrumb that navigates out of the portal you are
     * standing in.
     *
     * @return list<array{title: string, href: string}>
     */
    private function trail(string $class, string $leaf): array
    {
        return [
            ['title' => $class::pluralLabel(), 'href' => $class::schema()['routes']['index']],
            ['title' => $leaf, 'href' => '#'],
        ];
    }

    /** Return the model version used by the draft conflict contract. */
    private function updatedAt(?Model $record): ?string
    {
        $updatedAt = $record?->getAttribute('updated_at');

        return $updatedAt instanceof \DateTimeInterface
            ? $updatedAt->format(DATE_ATOM)
            : null;
    }

    /** @return class-string<\Alxtexh\Panel\Resources\Resource> */
    private function guard(string $resource): string
    {
        $class = app(PanelManager::class)->resource($resource);

        if ($class === null) {
            throw new NotFoundHttpException("No panel resource registered for [{$resource}].");
        }

        if (! $class::isEnabled()) {
            throw new NotFoundHttpException("Resource [{$resource}] is not enabled for this tenant.");
        }

        abort_unless($class::isAccessible(), 403);

        return $class;
    }

    /**
     * Whether this child row belongs to the URL parent.
     *
     * HasMany compares the foreign key. BelongsToMany checks the pivot.
     * A miss is a 404, never a 403: confirming the row exists would leak.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     */
    private static function childBelongs(string $class, Model $parent, Model $record): bool
    {
        if (NestedRelation::belongsToMany($class)) {
            return NestedRelation::of($parent, $class)->whereKey($record->getKey())->exists();
        }

        return (string) $record->getAttribute($class::parentColumn()) === (string) $parent->getKey();
    }

    public function index(Request $request, string $resource): Response
    {
        $class = app(PanelManager::class)->resource($resource);

        if ($class === null) {
            throw new NotFoundHttpException("No panel resource registered for [{$resource}].");
        }

        // A disabled feature 404s, it does not merely hide its link. Spec S9
        // item 5 - a hidden link is not a control, the URL is still typeable.
        if (! $class::isEnabled()) {
            throw new NotFoundHttpException("Resource [{$resource}] is not enabled for this tenant.");
        }

        abort_unless($class::isAccessible(), 403);

        abort_unless($class::can('viewAny'), 403);

        /** @var class-string<\Alxtexh\Panel\Resources\Resource> $class */
        // Built ONCE and reused for both the query and the option lists.
        $definition = $class::definition();

        $lens = $class::resolveLens($request->query('lens'));

        if ($lens !== null) {
            $definition = $lens->applyTable($definition);
        }

        /*
         * NESTED - roadmap 4.2. The parent is resolved, tenant-scoped and
         * authorised in NestedContext; what remains here is the constraint:
         * every query this list runs, counts included, carries the foreign
         * key. The schema is the cached flat one re-addressed per request,
         * because the screen is identical for every parent.
         */
        $parent = NestedContext::parent($request, $class);

        /*
         * PIVOT COLUMNS NEED THIS SPECIFIC PARENT, so they are layered onto
         * `$definition` here rather than in `Resource::table()` - that method
         * runs once per resource, with no parent to correlate a value
         * against, and `$class::schema()` below is cached across every
         * parent this resource is ever nested under. See
         * `NestedRelation::appendPivotColumns()`.
         */
        $hasPivotColumns = $parent !== null
            && NestedRelation::belongsToMany($class)
            && $class::pivotColumns() !== [];

        if ($hasPivotColumns) {
            NestedRelation::appendPivotColumns($definition, $parent, $class);
        }

        $query = $definition->toListQuery($class::model());

        if ($lens !== null) {
            $query->modifyEloquent(static function ($eloquent) use ($lens): void {
                $lens->applyQuery($eloquent);
            });
        }

        if ($parent !== null) {
            $query->constrain(static fn ($q) => NestedRelation::constrain($q, $class, $parent));
        }

        $result = $query->run($request);

        $schema = $class::schema();

        if ($parent !== null) {
            $schema = NestedContext::schema($schema, $class, $parent);
        }

        if ($lens !== null || $hasPivotColumns) {
            $schema = [
                ...$schema,
                'table' => $definition->toSchema(),
            ];
        }

        return Inertia::render('ResourceIndex', [
            // Cached, tenant-independent, sent once per session.
            'schema' => $schema,

            // A generic page cannot declare its breadcrumb statically the way a
            // bespoke page did, so it comes from the schema instead. A nested
            // list walks in through its parent.
            'breadcrumbs' => $parent === null
                ? [['title' => $schema['labelPlural'], 'href' => $schema['routes']['index']]]
                : NestedContext::breadcrumbs($class, $parent),

            /*
             * The cluster sub-navigation, when this resource belongs to one -
             * roadmap 4.1. Per request rather than in the schema, because the
             * items are filtered by what THIS person may open and the schema
             * is cached across people.
             */
            'cluster' => app(PanelManager::class)->clusterNavFor($class),

            /*
             * PLUGIN MARKUP AT NAMED POSITIONS - roadmap 4.4. Scoped to this
             * resource server-side, so a hook meant for invoices never
             * travels to the clients page.
             */
            'renderHooks' => app(PanelManager::class)->renderHooks($class::key()),

            ...$result->toProps(),

            // Tenant data, so it rides with the records rather than the schema.
            // This is also the ONLY place filter option closures run - never at
            // definition time (antipatterns §3.3).
            'filterOptions' => $definition->resolveFilterOptions(),

            // Form option lists are tenant data too, and resolving them HERE is
            // what lets a modal open with no network request at all
            // (antipatterns S3.0.3 - a Filament action modal fetches its form on
            // open, so a confirmation dialog has latency in front of it).
            'formOptions' => $class::formDefinition()->resolveOptions(),

            // UI hints only. Every write re-authorizes server-side (S9 item 3).
            'can' => $class::permissions(),

            /*
             * WIDGETS ABOVE THE LIST - see `Resource::headerWidgets()`.
             *
             * SPREAD, BECAUSE THE SET CONTRIBUTES NO KEYS WHEN IT IS EMPTY.
             * A screen draws its widget row only if the prop is there, so an
             * empty array would render a container with spacing around
             * nothing - and the overwhelmingly common case is a resource with
             * no widgets at all.
             *
             * The permission check and the single deferred group both live in
             * `WidgetSet`, shared with every other host rather than re-derived
             * here.
             */
            ...Widgets\WidgetSet::props($class::resolvedIndexWidgets(), $request->user()),

            /*
             * WIDGETS BELOW THE LIST - see `Resource::footerWidgets()`. Same
             * rules as the header row, namespaced under `footer` so the two
             * never collide.
             */
            ...Widgets\WidgetSet::props($class::footerWidgets(), $request->user(), 'footer'),

            'lens' => $request->query('lens'),

            /*
             * This person's saved views for this resource.
             *
             * NOT DEFERRED, and not cached with the schema. Not deferred because
             * it is a handful of rows on one indexed key and the picker is part
             * of the toolbar rather than something that fills in later. Not in
             * the schema because it is per USER - the schema is shared across
             * everyone with the same permissions, which is most of why it can be
             * cached at all.
             */
            'savedViews' => $this->savedViewsFor($resource),

            // The transport, so the client knows how to stay fresh without any
            // page or component knowing which driver is configured.
            'live' => LiveConfig::fromConfig()->toArray(),

            // Deferred: neither the total nor the tab counts may sit in front of
            // the rows (§10, addendum C1).
            'total' => Inertia::defer($result->total),

            /*
             * Deferred for the same reason the total is: aggregating a tenant's
             * 200,000 rows must not sit in front of the ten on screen.
             *
             * AND IN THE SAME GROUP AS THE TOTAL, which is the part that was
             * wrong. Inertia fetches deferred props ONE REQUEST PER GROUP, so
             * naming a group here bought a second round trip and nothing else:
             * `total` is a COUNT over the filtered set, `tabCounts` is one
             * query for every tab over the filtered set, and this is one query
             * of aggregate expressions over the SAME filtered set. Three
             * aggregates of the same cost class over the same rows belong in
             * one request.
             *
             * (Contrast the dashboard, where `stats` and `charts` are kept
             * apart on purpose - there the costs genuinely differ, and folding
             * them together would make the numbers wait for the heaviest
             * chart.)
             */
            ...($result->summary ? ['summary' => Inertia::defer($result->summary)] : []),
            ...($result->tabCounts ? ['tabCounts' => Inertia::defer($result->tabCounts)] : []),
        ]);
    }

    /**
     * Kanban board for a resource that opted in via `Resource::board()`.
     *
     * Cards are capped so a board cannot become a full-table dump. Move writes
     * go through `RecordController::boardMove`, not this action.
     */
    public function board(Request $request, string $resource): Response
    {
        $class = app(PanelManager::class)->resource($resource);

        if ($class === null) {
            throw new NotFoundHttpException("No panel resource registered for [{$resource}].");
        }

        if (! $class::isEnabled()) {
            throw new NotFoundHttpException("Resource [{$resource}] is not enabled for this tenant.");
        }

        abort_unless($class::isAccessible(), 403);
        abort_unless($class::can('viewAny'), 403);

        $board = $class::board();

        if ($board === null) {
            throw new NotFoundHttpException("[{$resource}] has no board.");
        }

        $schema = $class::schema();
        $boardSchema = $board->toSchema();
        $column = $board->column();
        $title = $boardSchema['title'];
        $description = $boardSchema['description'];

        $modelClass = $class::model();
        $parent = NestedContext::parent($request, $class);

        /*
         * Same list path as index: table `constrain` / `query` (join) via
         * `toListQuery()`, plus nested FK when under a parent. Tenant scopes
         * still apply through Eloquent before `toBase()`.
         */
        $list = $class::definition()->toListQuery($modelClass);

        if ($parent !== null) {
            $list->constrain(static fn ($q) => NestedRelation::constrain($q, $class, $parent));
            $schema = NestedContext::schema($schema, $class, $parent);
        }

        $table = (new $modelClass)->getTable();
        $keyName = (new $modelClass)->getKeyName();
        $select = array_values(array_unique(array_filter([
            "{$table}.{$keyName}",
            "{$table}.{$column}",
            "{$table}.{$title}",
            $description !== null ? "{$table}.{$description}" : null,
        ])));

        $query = $list->matching($request)
            ->select($select)
            ->orderBy("{$table}.{$title}");

        /*
         * matching() already returns a base Query\Builder (via toBase), so count
         * with getCountForPagination() directly. Do not call toBase() again.
         */
        $totalMatching = (clone $query)->getCountForPagination();

        $cardCap = 500;
        $rows = $query->limit($cardCap)->get();
        $capped = $totalMatching > $cardCap;

        $buckets = [];

        foreach ($boardSchema['columns'] as $col) {
            $buckets[$col['value']] = [];
        }

        foreach ($rows as $row) {
            $value = (string) ($row->{$column} ?? '');

            if (! array_key_exists($value, $buckets)) {
                continue;
            }

            $card = [
                'id' => $row->{$keyName},
                'title' => (string) ($row->{$title} ?? ''),
                'column' => $value,
            ];

            if ($description !== null) {
                $card['description'] = $row->{$description} !== null
                    ? (string) $row->{$description}
                    : null;
            }

            $buckets[$value][] = $card;
        }

        $columns = [];

        foreach ($boardSchema['columns'] as $col) {
            $columns[] = [
                'value' => $col['value'],
                'label' => $col['label'],
                'cards' => $buckets[$col['value']] ?? [],
            ];
        }

        $indexUrl = (string) ($schema['routes']['index'] ?? $class::baseUrl());
        $boardUrl = (string) ($schema['routes']['board'] ?? ($indexUrl.'/board'));
        $moveUrl = (string) ($schema['routes']['boardMove'] ?? ($indexUrl.'/board-move'));

        return Inertia::render('ResourceKanban', [
            'schema' => $schema,
            'board' => $boardSchema,
            'columns' => $columns,
            'can' => $class::permissions(),
            'moveUrl' => $moveUrl,
            'indexUrl' => $indexUrl,
            'cardCap' => $cardCap,
            'capped' => $capped,
            'totalMatching' => $totalMatching,
            'breadcrumbs' => $parent === null
                ? [
                    ['title' => $schema['labelPlural'], 'href' => $indexUrl],
                    ['title' => 'Board', 'href' => $boardUrl],
                ]
                : [
                    ...NestedContext::breadcrumbs($class, $parent),
                    ['title' => 'Board', 'href' => $boardUrl],
                ],
        ]);
    }

    /**
     * Visual board for a resource that declared `Resource::workflow()`.
     *
     * Shows the resolved workflow (DB override when present, PHP default
     * otherwise). When the user has `update` permission the page renders an
     * editor form alongside the diagram.
     */
    public function workflow(Request $request, string $resource): Response
    {
        $class = app(PanelManager::class)->resource($resource);

        if ($class === null) {
            throw new NotFoundHttpException("No panel resource registered for [{$resource}].");
        }

        if (! $class::isEnabled()) {
            throw new NotFoundHttpException("Resource [{$resource}] is not enabled for this tenant.");
        }

        abort_unless($class::isAccessible(), 403);
        abort_unless($class::can('viewAny'), 403);

        $workflow = $class::resolvedWorkflow();

        if ($workflow === null) {
            throw new NotFoundHttpException("[{$resource}] has no workflow.");
        }

        $schema = $class::schema();
        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            $schema = NestedContext::schema($schema, $class, $parent);
        }

        $indexUrl = (string) ($schema['routes']['index'] ?? $class::baseUrl());
        $workflowUrl = (string) ($schema['routes']['workflow'] ?? ($indexUrl.'/workflow'));

        $positions = [];

        try {
            $override = WorkflowOverride::forResource($class::key());
            $positions = is_array($override?->positions) ? $override->positions : [];
        } catch (\Throwable) {
            $positions = [];
        }

        return Inertia::render('ResourceWorkflow', [
            'schema' => $schema,
            'workflow' => $workflow->toSchema(),
            'graph' => $workflow->toGraph(),
            'positions' => $positions,
            'indexUrl' => $indexUrl,
            'canEdit' => $class::can('update'),
            'saveUrl' => $workflowUrl,
            'breadcrumbs' => $parent === null
                ? [
                    ['title' => $schema['labelPlural'], 'href' => $indexUrl],
                    ['title' => 'Workflow', 'href' => $workflowUrl],
                ]
                : [
                    ...NestedContext::breadcrumbs($class, $parent),
                    ['title' => 'Workflow', 'href' => $workflowUrl],
                ],
        ]);
    }

    /**
     * Persist workflow state/transition edits to the database.
     *
     * Validates that every transition references declared states, then
     * upserts a WorkflowOverride row. The PHP definition supplies column and
     * model; only states/transitions/group/positions come from the request.
     *
     * Positions are optional canvas layout metadata. When the key is absent the
     * existing positions are kept so a form-only save cannot wipe a layout.
     */
    public function updateWorkflow(Request $request, string $resource): RedirectResponse
    {
        $class = app(PanelManager::class)->resource($resource);

        if ($class === null) {
            throw new NotFoundHttpException("No panel resource registered for [{$resource}].");
        }

        if (! $class::isEnabled()) {
            throw new NotFoundHttpException("Resource [{$resource}] is not enabled for this tenant.");
        }

        abort_unless($class::isAccessible(), 403);
        abort_unless($class::can('update'), 403);

        $base = $class::workflow();

        if ($base === null) {
            throw new NotFoundHttpException("[{$resource}] has no workflow.");
        }

        $validated = $request->validate([
            'group_label' => ['nullable', 'string', 'max:64'],
            'states' => ['required', 'array', 'min:1'],
            'states.*.label' => ['required', 'string', 'max:64'],
            'states.*.color' => ['required', 'string', 'max:32'],
            'transitions' => ['present', 'array'],
            'transitions.*.key' => ['required', 'string', 'max:64'],
            'transitions.*.label' => ['required', 'string', 'max:128'],
            'transitions.*.to' => ['required', 'string', 'max:64'],
            'transitions.*.from' => ['present', 'array'],
            'transitions.*.from.*' => ['string', 'max:64'],
            'transitions.*.ability' => ['nullable', 'string', 'max:64'],
            'transitions.*.icon' => ['nullable', 'string', 'max:64'],
            'transitions.*.color' => ['nullable', 'string', 'max:32'],
            'transitions.*.confirm' => ['nullable', 'string', 'max:256'],
            'positions' => ['nullable', 'array'],
            'positions.*.x' => ['required_with:positions', 'numeric'],
            'positions.*.y' => ['required_with:positions', 'numeric'],
        ]);

        $stateKeys = array_keys($validated['states']);

        foreach ($validated['transitions'] as $index => $t) {
            if (! in_array($t['to'], $stateKeys, true)) {
                throw ValidationException::withMessages([
                    "transitions.{$index}.to" => "Transition target \"{$t['to']}\" is not a declared state.",
                ]);
            }

            foreach ($t['from'] as $fromIndex => $from) {
                if (! in_array($from, $stateKeys, true)) {
                    throw ValidationException::withMessages([
                        "transitions.{$index}.from.{$fromIndex}" => "Transition source \"{$from}\" is not a declared state.",
                    ]);
                }
            }
        }

        $positions = null;

        if (array_key_exists('positions', $validated)) {
            $positions = [];

            foreach ($validated['positions'] ?? [] as $key => $point) {
                if (! in_array((string) $key, $stateKeys, true)) {
                    continue;
                }

                $positions[(string) $key] = [
                    'x' => (float) $point['x'],
                    'y' => (float) $point['y'],
                ];
            }
        }

        $attributes = [
            'column' => $base->column(),
            'group_label' => $validated['group_label'] ?? $base->groupLabel(),
            'states' => $validated['states'],
            'transitions' => array_map(static fn (array $t): array => [
                'key' => $t['key'],
                'label' => $t['label'],
                'to' => $t['to'],
                'from' => $t['from'],
                'ability' => $t['ability'] ?? 'update',
                'icon' => $t['icon'] ?? null,
                'color' => $t['color'] ?? null,
                'confirm' => $t['confirm'] ?? null,
            ], $validated['transitions']),
        ];

        if ($positions !== null) {
            $attributes['positions'] = $positions;
        }

        WorkflowOverride::query()->updateOrCreate(
            ['resource_key' => $class::key()],
            $attributes,
        );

        return redirect()->back()->with('success', 'Workflow saved.');
    }

    /**
     * The acting user's views, newest first with the default pinned on top.
     *
     * Returns an empty list when the host application has no `saved_views`
     * table, because saved views are an APPLICATION feature the panel offers
     * rather than one it requires. A kit that hard-failed on a missing optional
     * table would make its own optional features mandatory.
     *
     * @return list<array<string, mixed>>
     */
    private function savedViewsFor(string $resource): array
    {
        $model = config('panel.saved_views.model');

        if ($model === null || ! class_exists($model)) {
            return [];
        }

        return $model::query()
            ->where('user_id', Auth::id())
            ->where('resource', $resource)
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get(['id', 'name', 'state', 'is_default'])
            ->map(static fn ($view): array => [
                'id' => $view->id,
                'name' => $view->name,
                'state' => $view->state,
                'isDefault' => (bool) $view->is_default,
            ])
            ->all();
    }

    /**
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @param  array<string, mixed>  $row
     * @return array<string, mixed>|null
     */
    private static function workflowContext(string $class, array $row, Model $record): ?array
    {
        $workflow = $class::resolvedWorkflow();

        if ($workflow === null) {
            return null;
        }

        $current = (string) ($row[$workflow->rowKey()] ?? '');
        $state = $workflow->stateDefinition($current);
        $schema = $class::schema();
        $diagramUrl = (string) ($schema['routes']['workflow'] ?? ($class::baseUrl().'/workflow'));

        return [
            ...$workflow->toSchema(),
            'current' => $current,
            'currentLabel' => $state['label'] ?? $current,
            'currentColor' => $state['color'] ?? 'neutral',
            'diagramUrl' => $diagramUrl,
            'history' => WorkflowHistory::for($record),
            'actions' => $workflow->actionsForRecord(
                $row,
                static fn (string $ability): bool => $class::can($ability, $record),
            ),
        ];
    }

    /**
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @return array<string, mixed>|null
     */
    private static function commentsContext(string $class, Model $record, Request $request): ?array
    {
        $config = $class::comments();

        if ($config === null) {
            return null;
        }

        $panel = app(PanelManager::class)->panel($class::panel());
        $prefix = rtrim('/'.trim($panel?->getPath() ?? '', '/'), '/');
        $parent = NestedContext::parent($request, $class);

        if ($parent !== null) {
            $parentKey = $class::parentResource()::key();
            $base = "{$prefix}/{$parentKey}/{$parent->getKey()}/{$class::key()}/{$record->getKey()}/record-comments";
        } else {
            $base = "{$prefix}/{$class::key()}/{$record->getKey()}/record-comments";
        }

        return [
            ...$config->toSchema(),
            'url' => $base,
            'canCreate' => $class::canComment($record),
        ];
    }
}
