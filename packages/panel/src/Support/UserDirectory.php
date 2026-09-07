<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Alxtexh\Panel\Models\Role;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Who is here, and what they may do - the data behind one screen.
 *
 * THE TWO HALVES WERE TWO SCREENS AND THAT WAS WRONG. Roles lived under settings
 * and users under the resource routes, so granting somebody access meant knowing
 * that two screens in different sections had to agree. They are one job.
 *
 * THE USERS TAB EMBEDS A RESOURCE rather than reimplementing it. Whichever
 * resource the application registered for its user model already owns the
 * columns, the tenant constraint, the policy and the forms; a second users table
 * here would be a second set of all four - free to write, expensive the first
 * time they disagree.
 *
 * FOUND BY MODEL, NOT NAMED IN CONFIG. The package asks the registry for the
 * resource whose model is `auth.providers.users.model`, which is a question with
 * exactly one right answer and no key to keep in step. An application that has
 * not written one gets the roles half and an honest note in place of the table,
 * rather than a screen that half-renders.
 */
final class UserDirectory
{
    /** The application's user model, as Laravel already knows it. */
    public static function model(): ?string
    {
        $model = config('auth.providers.users.model');

        return is_string($model) && class_exists($model) ? $model : null;
    }

    /**
     * The resource that lists users, if the application registered one.
     *
     * @return class-string<\Alxtexh\Panel\Resources\Resource>|null
     */
    public static function resource(): ?string
    {
        $model = self::model();

        if ($model === null) {
            return null;
        }

        foreach (app(PanelManager::class)->resources() as $resource) {
            /*
             * `is_a` RATHER THAN `===`, so an application that registered a
             * resource for a SUBCLASS of the configured user model - a common
             * shape where a panel user extends a base account - is still
             * recognised. The reverse would be wrong, which is why the
             * arguments are this way round.
             */
            if (is_a($resource::model(), $model, true)) {
                return $resource;
            }
        }

        return null;
    }

    /**
     * Every role in the acting user's organisation, with a headcount.
     *
     * SCOPED BY HAND, and that is not belt-and-braces - it is the only scoping
     * there is. Spatie's teams feature confines PERMISSION CHECKS to a tenant
     * through the registrar; it puts no global scope on the Role model, so a
     * bare `Role::query()` returns every organisation's roles. A global scope is
     * not the fix either: the permission registrar eager-loads roles through
     * Permission and caches the result for every tenant at once, so a scoped
     * load would poison a shared cache with whichever tenant warmed it.
     *
     * THE HEADCOUNT IS A DECLARED SUBQUERY, not `withCount('users')`. Spatie's
     * `users()` relation filters the pivot by whatever team id the registrar
     * happens to be holding, so the number depends on middleware having run -
     * and when it has not, every role reports zero people and the screen quietly
     * lies. Naming the tenant here makes the count depend on nothing but this
     * query, and collapses a per-role query into one.
     *
     * @return list<array<string, mixed>>
     */
    public static function roles(Request $request): array
    {
        $model = self::model();
        $column = self::teamColumn();
        $tenant = $request->user()?->{config('panel.tenancy.column', 'tenant_id')} ?? null;

        $rows = Role::query()
            ->select('roles.*')
            ->where($column, $tenant)
            ->with('permissions:id,name')
            ->addSelect(['user_count' => DB::table('model_has_roles')
                ->selectRaw('count(*)')
                ->whereColumn('model_has_roles.role_id', 'roles.id')
                ->where('model_has_roles.model_type', $model)
                ->where('model_has_roles.'.$column, $tenant),
            ])
            ->orderBy('id')
            ->get()
            ->map(static fn (Role $role, int $index): array => [
                'id' => $role->id,
                'name' => $role->name,
                'grantsAll' => $role->grantsEverything(),
                /*
                 * THE FIRST ROLE IS PROTECTED. It is the Administrator the
                 * installer created, and an organisation that deletes it has
                 * nobody who can grant anything back - a lockout with no route
                 * out but the database.
                 */
                'isProtected' => $index === 0,
                'permissions' => $role->permissions->pluck('name')->all(),
                'userCount' => (int) $role->getAttribute('user_count'),
            ])
            ->values()
            ->all();

        $roles = [];
        foreach ($rows as $row) {
            $roles[] = $row;
        }

        return $roles;
    }

    /**
     * The column `roles` and `model_has_roles` are actually scoped by, ASKED
     * of Spatie rather than assumed.
     *
     * `tenant_id` is this project's name for the concept; `team_id` is
     * Spatie's own default column, and it is the one a plain `panel:install`
     * ends up with - nothing here publishes `config/permission.php` to rename
     * it. This used to hardcode `'tenant_id'` directly, which happened to
     * match neither: querying `model_has_roles.tenant_id` on a table whose
     * real column is `team_id` 500'd the User Management page on the exact
     * install that never touched that config, which is every one of them.
     * See `RoleController::teamColumn()` for the identical resolution this
     * mirrors.
     */
    private static function teamColumn(): string
    {
        return (string) config(
            'permission.column_names.team_foreign_key',
            config('panel.tenancy.column', 'tenant_id'),
        );
    }
}
