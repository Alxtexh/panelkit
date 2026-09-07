<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Alxtexh\Panel\Models\Role;
use Alxtexh\Panel\Support\Abilities;
use Alxtexh\Panel\Support\Ability;
use Alxtexh\Panel\Support\RoleTemplates;
use Spatie\Permission\Models\Permission;

/**
 * The permission matrix: which roles hold which abilities.
 *
 * THIS SCREEN CAN GRANT ITSELF ANYTHING, which is the fact that shapes every
 * decision below. Whoever reaches it can edit the role they are standing on, so
 * the guard is not "are you an administrator" - it is a specific `manage_roles`
 * ability that can be withheld from someone who otherwise has full access to
 * every subscriber. Operations and administration are different jobs.
 *
 * THE SUBMITTED ABILITIES ARE INTERSECTED WITH THE REGISTRY, never stored as
 * sent. The form is a list of checkboxes, so a crafted request can name anything
 * at all - and an ability that does not exist is not harmless: it sits in the
 * role looking granted, survives every future save, and would silently become
 * live the day a resource with that name is registered. Intersecting means only
 * names the panel currently defines can ever be stored.
 */
final class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authoriseManagement($request);

        return Inertia::render('settings/Roles', [
            /*
             * SCOPED AND COUNTED BY HAND - see UserManagementController::index
             * for why neither can be left to Spatie. In short: the Role model
             * carries no team global scope, and the `users()` relation counts
             * through a pivot filter that depends on the registrar's ambient
             * team id rather than on anything stated here.
             */
            'roles' => Role::query()
                ->select('roles.*')
                ->where($this->teamColumn(), $this->tenantOf($request))
                ->with('permissions:id,name')
                ->addSelect(['user_count' => DB::table('model_has_roles')
                    ->selectRaw('count(*)')
                    ->whereColumn('model_has_roles.role_id', 'roles.id')
                    ->where('model_has_roles.model_type', $this->userModel())
                    ->where('model_has_roles.'.$this->teamColumn(), $this->tenantOf($request)),
                ])
                ->orderBy('id')
                ->get()
                ->map(fn (Role $role, int $index): array => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'grantsAll' => $role->grantsEverything(),
                    'isProtected' => $index === 0,
                    'permissions' => $role->permissions->pluck('name')->all(),
                    'userCount' => (int) $role->getAttribute('user_count'),
                ])->values(),

            /*
             * WHERE THIS SCREEN LIVES, told to the screen.
             *
             * The page used to reach for Wayfinder's generated route table,
             * which is the APPLICATION's - not something a packaged component
             * can import, and wrong for anybody who mounted the screen at a
             * path of their own. The route knows its own URL; it passes it on.
             */
            'endpoint' => $request->url(),

            // Grouped by resource so the matrix has rows to render, and derived
            // from the registry so a new resource appears without a migration.
            'groups' => Abilities::grouped(),

            /*
             * NAME AND LABEL TOGETHER, from the server.
             *
             * The labels were a hardcoded map inside the Vue component, which
             * was correct while `manage_roles` was the only panel ability and
             * became wrong the moment a second existed: every checkbox rendered
             * under the caption the component happened to have, so granting one
             * looked exactly like granting another. An ability declared in PHP
             * now arrives with the words that describe it.
             */
            'panelAbilities' => Abilities::panelLabelled(),

            /*
             * Starting points for a new role - see `RoleTemplates`. An empty
             * matrix is dozens of boxes to tick correctly from memory, and the
             * mistakes it produces are silent in the dangerous direction.
             */
            'templates' => RoleTemplates::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authoriseManagement($request);

        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:80',
                Rule::unique('roles', 'name')
                    ->where($this->teamColumn(), $this->tenantOf($request)),
            ],
            /*
             * ONLY THE KEY IS ACCEPTED, never a list of abilities.
             *
             * The screen is sent each template's abilities so it can say how
             * many a template grants; posting them back would let a crafted
             * request name ANY ability under cover of a template, which is
             * precisely what a permission endpoint must not take on trust. The
             * key is looked up server-side and resolved against the registry.
             */
            'template' => ['nullable', 'string', 'in:'.implode(',', array_column(RoleTemplates::all(), 'key'))],
        ]);

        /*
         * THE NAME IS THE KEY in Spatie - unique per (name, guard, tenant) - so
         * there is no separate slug to derive or collide on. A duplicate name is
         * refused by validation above rather than silently suffixed, because two
         * roles called "Support" in one organisation is a mistake somebody wants
         * to know about, not something to paper over.
         */
        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => config('auth.defaults.guard', 'web'),
            $this->teamColumn() => $this->tenantOf($request),
        ]);

        /*
         * A NEW ROLE GRANTS NOTHING UNLESS A TEMPLATE WAS CHOSEN, and the
         * template is resolved here rather than trusted from the request.
         *
         * Creating a role and choosing what it may do were deliberately
         * separate steps, so a half-finished role could not be assigned and turn
         * out to hold more than intended. A template does not weaken that: the
         * abilities it fills in are visible on the matrix immediately, editable,
         * and named on the screen that offered it - the operator chose a known
         * set rather than an unknown one.
         *
         * INTERSECTED WITH THE REGISTRY, like every other write on this screen.
         * A template naming an ability this installation does not define
         * contributes nothing rather than an unusable row.
         */
        $abilities = ($validated['template'] ?? null) === null
            ? []
            : array_values(array_intersect(
                RoleTemplates::abilitiesFor($validated['template']),
                Abilities::all(),
            ));

        foreach ($abilities as $ability) {
            Permission::findOrCreate($ability, config('auth.defaults.guard', 'web'));
        }

        $role->syncPermissions($abilities);

        return back()->with('toast', [
            'type' => 'success',
            'message' => $abilities === []
                ? "{$role->name} created. Tick what it may do, then save."
                : "{$role->name} created with ".count($abilities).' permission(s). Adjust and save.',
        ]);
    }

    public function destroy(Request $request, Role $role): RedirectResponse
    {
        $this->authoriseManagement($request);
        $this->authoriseTenant($request, $role);

        /*
         * A ROLE IN USE CANNOT BE DELETED, and this is the important refusal.
         *
         * Deleting an assigned role would succeed and leave those people with
         * NO role - which means they can
         * still sign in and every page renders empty. Nothing errors. That
         * failure has already been observed in this project from a different
         * cause, and it reads as data loss rather than as a permissions change.
         */
        $holders = $role->users()->count();

        if ($holders > 0) {
            return back()->withErrors([
                'role' => "{$role->name} is held by {$holders} ".($holders === 1 ? 'person' : 'people')
                    .'. Move them to another role first - deleting it would leave them able to sign in and do nothing.',
            ]);
        }

        /*
         * THE FIRST ROLE SURVIVES EVERYTHING. See Role::isProtected() - it is
         * the one role guaranteed to exist, so it is the one that can always be
         * assigned when everything else has been misconfigured.
         */
        if ($role->isProtected()) {
            return back()->withErrors([
                'role' => 'This is the first role in the organisation and cannot be deleted. It is what remains assignable if every other role is misconfigured.',
            ]);
        }

        // The superuser role is the way back in if another role is misconfigured.
        if ($role->grantsEverything()) {
            return back()->withErrors([
                'role' => 'This role grants every ability and is the way back in if another role is misconfigured. It cannot be deleted here.',
            ]);
        }

        $name = $role->name;
        $role->delete();

        return back()->with('toast', ['type' => 'success', 'message' => "{$name} deleted."]);
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $this->authoriseManagement($request);
        $this->authoriseTenant($request, $role);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            // `present` rather than `required`: clearing every box is a
            // legitimate edit, and `required` rejects an empty array - the same
            // trap saved views hit.
            'permissions' => ['present', 'array'],
            'permissions.*' => ['string'],
        ]);

        /*
         * A SUPERUSER ROLE CANNOT BE EDITED ABILITY BY ABILITY.
         *
         * `grants()` returns true for everything when `grants_all` is set, so
         * accepting a permissions array here would let the screen show boxes
         * being unticked while the role went on granting them - a permission
         * editor that lies about permissions. Refusing is the honest answer, and
         * the UI disables the boxes for the same reason.
         */
        /*
         * THE FIRST ROLE IS NOT EDITABLE EITHER.
         *
         * It was already undeletable, on the grounds that it is the one role
         * guaranteed to exist and therefore the way back in when everything else
         * is misconfigured. Leaving it EDITABLE undoes that entirely: stripping
         * its abilities produces a role that exists, cannot be removed, and
         * grants nothing - the same lockout, reached by a different door and
         * with no error along the way.
         */
        abort_if(
            $role->isProtected(),
            422,
            'This is the first role in the organisation. It cannot be changed, because it is what remains assignable if every other role is misconfigured.',
        );

        abort_if($role->grantsEverything(), 422, 'This role grants every ability by design and cannot be edited here.');

        $role->name = $validated['name'];

        /*
         * INTERSECTED, and `permissions` is not fillable - see the model. This
         * is the whole security payload of the request, so it is the one thing
         * that must never be taken as given.
         */
        $role->save();

        /*
         * INTERSECTED with the registry, always. This is the whole security
         * payload of the request, so it is the one thing that must never be
         * taken as given - a name the panel does not define would sit in the
         * role looking granted and become live the day a resource of that name
         * is registered.
         */
        $wanted = array_values(array_intersect($validated['permissions'], Abilities::all()));

        /*
         * MATERIALISE THE PERMISSION ROWS FIRST. `syncPermissions` throws
         * `PermissionDoesNotExist` for a name with no row, and the registry is
         * the definition of what exists - so an ability declared in code but not
         * yet synced is a gap to close here, not a 500 on a form submit.
         *
         * Safe because `$wanted` has already been intersected with the registry:
         * nothing a request supplied can create a permission.
         */
        foreach ($wanted as $name) {
            Permission::findOrCreate($name, config('auth.defaults.guard', 'web'));
        }

        $role->syncPermissions($wanted);

        return back()->with('toast', [
            'type' => 'success',
            'message' => "{$role->name} updated.",
        ]);
    }

    /**
     * Refuse anybody without `manage_roles`.
     *
     * A 403 rather than a redirect, because this is reached from navigation that
     * should already have been hidden - arriving here without the ability means
     * the URL was typed or the UI is wrong, and both deserve to be told plainly.
     */
    /**
     * A role belonging to another organisation does not exist here.
     *
     * EXPLICIT NOW, because Spatie's `Role` carries no tenant global scope - the
     * package scopes by team id at QUERY time, and route-model binding resolves
     * by primary key, which bypasses that entirely. The hand-rolled model had a
     * scope and this check was implicit; it is not any more.
     *
     * A 404 rather than a 403: confirming that a role id exists somewhere is
     * itself information.
     */
    private function authoriseTenant(Request $request, Role $role): void
    {
        abort_unless(
            (string) $role->getAttribute($this->teamColumn()) === (string) $this->tenantOf($request),
            404,
        );
    }

    private function authoriseManagement(Request $request): void
    {
        abort_unless(Ability::allows($request->user(), 'manage_roles'), 403);
    }

    /* --------------------------------------------------- what is not ours */

    /**
     * The column roles are scoped by, ASKED rather than assumed.
     *
     * `tenant_id` is this project's name for it and `team_id` is Spatie's own
     * default, so a consumer who published that config before installing
     * Alxtexhpanel has whichever they chose. Hardcoding one would scope a query by a
     * column the permission package never reads - every role visible to every
     * organisation, with no error anywhere.
     */
    private function teamColumn(): string
    {
        return (string) config(
            'permission.column_names.team_foreign_key',
            config('panel.tenancy.column', 'tenant_id'),
        );
    }

    /** The application's authenticatable, which `model_has_roles` stores by name. */
    private function userModel(): string
    {
        return (string) config('auth.providers.users.model');
    }

    /**
     * Which organisation this request belongs to.
     *
     * READ FROM THE USER, not from `TenantContext`, and deliberately: a role is
     * created for the organisation the person creating it belongs to, and an
     * operator impersonating across tenants must not thereby write a role into
     * the tenant the hostname resolved.
     */
    private function tenantOf(Request $request): int|string|null
    {
        return $request->user()?->getAttribute(config('panel.tenancy.column', 'tenant_id'));
    }
}
