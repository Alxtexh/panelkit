<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers\Api;

use Alxtexh\Panel\Api\ApiToken;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Support\Abilities;
use Alxtexh\Panel\Support\TenantContext;
use Alxtexh\Panel\Support\Transaction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The public API over the resource registry.
 *
 * SEPARATE FROM THE PANEL'S OWN ENDPOINTS, which is the whole point of it
 * existing. Those are session-authenticated, Inertia-shaped, and free to change
 * whenever a screen changes - they are an implementation detail of the interface.
 * This is a contract: versioned in the URL, JSON in and out, and stable.
 *
 * IT REUSES EVERYTHING RATHER THAN REIMPLEMENTING IT. The same table definition
 * builds the query, the same policies decide, the same tenant scope applies. An
 * API with its own query path is an API with its own bugs, and the bug is always
 * the same one - a scope that was applied on the screen and forgotten here.
 *
 * AUTHORIZATION IS THE INTERSECTION OF TWO THINGS: what the token grants and
 * what its owner may do right now. Either alone is wrong. Token-only means a key
 * outlives the permission that justified it; owner-only means a key scoped to
 * reading invoices can delete subscribers.
 *
 * A RECORD BELONGING TO ANOTHER ORGANISATION IS NOT FOUND, never forbidden. A
 * 403 confirms the id exists, which over a numeric range is an enumeration
 * oracle - and the panel's own screens have answered this way from the start.
 */
final class ResourceApiController extends Controller
{
    public function index(Request $request, string $resource): JsonResponse
    {
        $class = $this->resolve($resource);

        $this->authorizeAbility($request, 'viewAny', $resource);

        $result = $class::definition()
            ->toListQuery($class::model())
            ->run($request);

        return response()->json([
            'data' => $result->records,
            /*
             * A CURSOR, NOT A PAGE NUMBER. The panel pages by seek because
             * OFFSET walks every skipped row; an API that offered `?page=5000`
             * would be offering the one access pattern the rest of this system
             * was built to avoid.
             */
            'meta' => [
                'next_cursor' => $result->nextCursor,
                'per_page' => $result->perPage,
            ],
        ]);
    }

    public function show(Request $request, string $resource, int|string $id): JsonResponse
    {
        $class = $this->resolve($resource);

        $record = $this->find($class, $id);

        $this->authorizeAbility($request, 'view', $resource, $record);

        return response()->json(['data' => $this->present($class, $record)]);
    }

    public function store(Request $request, string $resource): JsonResponse
    {
        $class = $this->resolve($resource);

        $this->authorizeAbility($request, 'create', $resource);

        $form = $class::formDefinition();

        // The API is another front door, not another lifecycle. Hosts use
        // these hooks to normalize, audit, and maintain related state, so an
        // integration must not silently bypass the hooks the panel form runs.
        $class::beforeValidate($request);

        /*
         * THE SAME RULES THE FORM ENFORCES. Not "similar rules" - the same
         * declaration, so an API that accepted something the screen refuses
         * cannot exist.
         */
        $validated = $request->validate($form->rules());
        $class::afterValidate($validated);

        $model = $class::model();
        $record = new $model;

        // Only declared keys reach the model - the same sanitiser the panel's
        // own write path uses, so nothing can be set through the API that
        // cannot be set through a form.
        $record->forceFill($form->sanitize($validated));

        // FROM CONTEXT, NEVER FROM INPUT. The token established the tenant; a
        // request that could name one would be a request that could write into
        // another organisation.
        $this->applyTenant($record);

        $class::beforeCreate($record, $validated);

        Transaction::run(static function () use ($class, $record, $validated): void {
            $record->save();
            $class::afterCreate($record, $validated);
        });

        return response()->json(['data' => $this->present($class, $record->fresh())], 201);
    }

    public function update(Request $request, string $resource, int|string $id): JsonResponse
    {
        $class = $this->resolve($resource);

        $record = $this->find($class, $id);

        $this->authorizeAbility($request, 'update', $resource, $record);

        $form = $class::formDefinition();

        $class::beforeValidate($request);

        /*
         * ONLY THE ATTRIBUTES SENT ARE VALIDATED AND WRITTEN. A PUT that
         * demanded every field would make changing one thing a read-modify-write
         * with a race in the middle, and callers would send stale values for
         * everything they did not mean to touch.
         */
        $rules = array_intersect_key($form->rules(), $request->all());

        $validated = $request->validate($rules);
        $class::afterValidate($validated);

        $record->forceFill($form->sanitize($validated));
        $class::beforeUpdate($record, $validated);

        Transaction::run(static function () use ($class, $record, $validated): void {
            $record->save();
            $class::afterUpdate($record, $validated);
        });

        return response()->json(['data' => $this->present($class, $record->fresh())]);
    }

    public function destroy(Request $request, string $resource, int|string $id): JsonResponse
    {
        $class = $this->resolve($resource);

        $record = $this->find($class, $id);

        $this->authorizeAbility($request, 'delete', $resource, $record);

        $class::beforeDelete($record);

        Transaction::run(static function () use ($class, $record): void {
            $record->delete();
            $class::afterDelete($record);
        });

        return response()->json(null, 204);
    }

    /**
     * The tenant column, from context.
     *
     * THE TOKEN ESTABLISHED IT - see `AuthenticateApiToken`. A request that
     * could name a tenant would be a request that could write into another
     * organisation, so this reads context and never input.
     */
    private function applyTenant(Model $record): void
    {
        $context = app(TenantContext::class);

        if (! $context->shouldScopeByColumn()) {
            // Dedicated-database tenancy: the connection is the boundary and the
            // column does not exist. Writing one would throw.
            return;
        }

        $key = $context->currentKey();

        // No tenant is always a bug, never a valid state. Fail loudly rather
        // than write an unowned row.
        abort_if($key === null, 403, 'No tenant resolved; refusing to write an unscoped record.');

        $record->setAttribute($context->column(), $key);
    }

    /* ------------------------------------------------------------ plumbing */

    /** @return class-string<\Alxtexh\Panel\Resources\Resource> */
    private function resolve(string $resource): string
    {
        $class = app(PanelManager::class)->resource($resource);

        if ($class === null || ! $class::documented()) {
            /*
             * AN UNDOCUMENTED RESOURCE IS NOT AN API SURFACE. The same flag that
             * keeps the activity trail out of the reference keeps it out of the
             * API - a resource nobody should integrate against should not be
             * reachable by guessing its key either.
             */
            throw new NotFoundHttpException("No such resource [{$resource}].");
        }

        return $class;
    }

    private function find(string $class, int|string $id): Model
    {
        $model = $class::model();

        // The tenant scope is what makes this a 404 rather than a 403 for
        // another organisation's record: the row is simply not in the query.
        $record = $model::query()->find($id);

        if ($record === null) {
            throw new NotFoundHttpException('No such record.');
        }

        return $record;
    }

    /**
     * The token AND the user must both permit it.
     *
     * TWO CHECKS, NOT ONE. The token narrows; the policy decides. Skipping the
     * first makes every key a full-access key; skipping the second lets a key
     * outlive the permission that justified it.
     */
    private function authorizeAbility(Request $request, string $action, string $resource, ?Model $record = null): void
    {
        $token = $request->attributes->get('panel.api_token');

        $ability = Abilities::name($action, $resource);

        if (! $token instanceof ApiToken || ! $token->allows($ability)) {
            abort(403, "This token does not grant [{$ability}].");
        }

        $class = app(PanelManager::class)->resource($resource);

        if (! $class::can($action, $record)) {
            abort(403, 'Not permitted.');
        }
    }

    /**
     * One record, shaped like the list shapes them.
     *
     * THE SAME COLUMNS, so a caller reading a list and a caller reading one
     * record see the same field names. Returning the raw model instead would
     * expose whatever the table happens to have - including columns the panel
     * deliberately never shows.
     *
     * @return array<string, mixed>
     */
    private function present(string $class, Model $record): array
    {
        $out = ['id' => $record->getKey()];

        foreach ($class::definition()->getColumns() as $column) {
            $out[$column->key] = $record->getAttribute($column->key);
        }

        return $out;
    }
}
