<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http;

use Alxtexh\Panel\Resources\Resource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/**
 * The parent record of a nested-resource request - roadmap 4.2.
 *
 * ONE CHOKE POINT, because the parent IS the authorisation context. A nested
 * resource answers only at `{parent}/{parentId}/{resource}`, and every method
 * that serves it must agree on three things before touching a row:
 *
 *   1. THE PAIRING IS DECLARED. The `{parent}` segment must be the key of the
 *      resource this one actually nests under - the route constraint admits
 *      any parent key in the panel, so a crafted `/routers/3/sessions` must
 *      404 here rather than resolve a router as a session's client.
 *
 *   2. THE PARENT RECORD EXISTS FOR THIS REQUEST. Fetched through the parent
 *      resource's own model, global scopes and all, so another organisation's
 *      parent id is indistinguishable from a missing one.
 *
 *   3. THIS PERSON MAY VIEW IT. `view` on the parent, before any child row is
 *      considered - you cannot browse the invoices of a client you may not
 *      open.
 *
 * MEMOIZED PER REQUEST on the request's own attribute bag, because index()
 * resolves the parent for the constraint and again for the breadcrumbs, and
 * the second lookup should not be a second query - while anything longer-lived
 * than the request would be the S9 leak.
 */
final class NestedContext
{
    private const ATTRIBUTE = 'alxtexhpanel.nested-parent';

    /**
     * The resolved, authorised parent record - or null on a flat request.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class  The (child) resource being served.
     */
    public static function parent(Request $request, string $class): ?Model
    {
        // Set by MountNestedResource, which pocketed the prefix's parameters
        // and forgot them from the route so controller signatures stay clean.
        $segment = $request->attributes->get(Middleware\MountNestedResource::PARENT_KEY);

        if ($segment === null) {
            /*
             * A NESTED RESOURCE HAS NO FLAT SPELLING. The routes already
             * refuse this - nested keys are excluded from the flat mount -
             * so this guard exists for callers outside the router: a test
             * hitting the controller directly, a future route someone adds
             * without reading `PanelRoutes`.
             */
            abort_if($class::parentResource() !== null, 404);

            return null;
        }

        if ($request->attributes->has(self::ATTRIBUTE)) {
            return $request->attributes->get(self::ATTRIBUTE);
        }

        $parentClass = $class::parentResource();

        abort_if($parentClass === null || $parentClass::key() !== $segment, 404);

        // The parent resource's own model, so its global scopes decide what
        // "exists" means. Another tenant's id 404s exactly like a made-up one.
        $parent = $parentClass::model()::query()->findOrFail(
            (string) $request->attributes->get(Middleware\MountNestedResource::PARENT_ID),
        );

        abort_unless($parentClass::can('view', $parent), 403);

        $request->attributes->set(self::ATTRIBUTE, $parent);

        return $parent;
    }

    /**
     * The URL base every child screen lives under: `/clients/5/sessions`.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     */
    public static function base(string $class, Model $parent): string
    {
        $parentClass = $class::parentResource();

        return rtrim($parentClass::baseUrl(), '/').'/'.$parent->getKey().'/'.$class::key();
    }

    /**
     * The cached schema, re-addressed to this parent.
     *
     * The schema is cached across parents - it describes the SCREEN, and the
     * screen is identical for every client - so its routes are the flat
     * template. Overlaying them per request is what lets one cache entry
     * serve `/clients/5/sessions` and `/clients/9/sessions` alike.
     *
     * @param  array<string, mixed>  $schema
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @return array<string, mixed>
     */
    public static function schema(array $schema, string $class, Model $parent): array
    {
        $base = self::base($class, $parent);

        $hasBoard = ($schema['board'] ?? null) !== null
            || ($schema['routes']['board'] ?? null) !== null;

        $schema['routes'] = [
            'index' => $base,
            'store' => $base,
            'create' => $base.'/create',
            'show' => $base.'/{id}',
            'edit' => $base.'/{id}/edit',
            'update' => $base.'/{id}',
            'destroy' => $base.'/{id}',
        ];

        /*
         * Board URLs stay nested when the child declared `board()`. Leaving
         * them flat would send ResourceKanban to `/comments/board-move` while
         * the list lives under `/articles/5/comments`.
         */
        if ($hasBoard) {
            $schema['routes']['board'] = $base.'/board';
            $schema['routes']['boardMove'] = $base.'/board-move';
        }

        if (NestedRelation::belongsToMany($class)) {
            $schema['routes']['attach'] = $base.'/attach';
        }

        return $schema;
    }

    /**
     * Breadcrumbs that walk in through the parent.
     *
     * @param  class-string<\Alxtexh\Panel\Resources\Resource>  $class
     * @return list<array{title: string, href: string}>
     */
    public static function breadcrumbs(string $class, Model $parent): array
    {
        $parentClass = $class::parentResource();

        // The best name the record offers; the id when it offers none. Same
        // fallback order the audit trail uses for its labels.
        $title = (string) ($parent->name ?? $parent->title ?? $parent->email ?? ('#'.$parent->getKey()));

        $parentBase = rtrim($parentClass::baseUrl(), '/');

        return [
            ['title' => $parentClass::pluralLabel(), 'href' => $parentBase],
            ['title' => $title, 'href' => $parentBase.'/'.$parent->getKey()],
            ['title' => $class::pluralLabel(), 'href' => self::base($class, $parent)],
        ];
    }
}
