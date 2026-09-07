<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Alxtexh\Panel\Models\Role;
use Alxtexh\Panel\Support\Abilities;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

/**
 * Reconcile every tenant's roles against the abilities that actually exist.
 *
 * A RECONCILIATION, NOT A GENERATOR. Ability names are derived from the resource
 * registry, so the interesting work is not creating them - it is PRUNING the ones
 * that no longer correspond to anything. When a resource is renamed or removed,
 * the old names linger on every role, and a role showing forty granted abilities
 * of which six name nothing looks fully configured and grants less than it
 * claims.
 *
 * ON SPATIE NOW, and the shape barely changed - which is the argument for having
 * had one place that knew about abilities. Permissions are global rows;
 * ROLES and ASSIGNMENTS carry the tenant, via Spatie's teams feature. That split
 * is correct: `update_client` means the same thing everywhere, and duplicating it
 * per tenant would produce thousands of identical rows and a cache to match.
 *
 * IT IS IDEMPOTENT. Provisioning re-runs and deploys re-run; a command that is
 * only safe the first time is one somebody will run twice.
 */
final class PermissionsCommand extends Command
{
    protected $signature = 'panel:permissions
                            {action=sync : sync|list|grant}
                            {--email= : With `grant`, the account to make an Administrator}
                            {--prune : Also remove granted abilities that no longer exist}
                            {--dry-run : Report what would change without changing it}';

    protected $description = 'Reconcile roles and permissions against the registered resources';

    public function handle(): int
    {
        $known = Abilities::all();

        if ($this->argument('action') === 'grant') {
            return $this->grant();
        }

        if ($this->argument('action') === 'list') {
            foreach (Abilities::grouped() as $label => $abilities) {
                $this->components->twoColumnDetail(
                    "<fg=cyan>{$label}</>",
                    implode(' ', array_column($abilities, 'action')),
                );
            }

            $this->newLine();
            $this->components->info(count($known).' abilities across '.count(Abilities::grouped()).' resources.');

            return self::SUCCESS;
        }

        $dry = (bool) $this->option('dry-run');
        $guard = config('auth.defaults.guard', 'web');

        $this->ensurePermissionsExist($known, $guard, $dry);

        foreach ($this->tenants() as $tenant) {
            $this->reconcile($tenant, $known, $guard, $dry);
        }

        // Spatie caches the permission map; a sync that does not clear it leaves
        // every process answering from the state before the change.
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $this->newLine();
        $this->components->info($dry ? 'Dry run: nothing was written.' : 'Permissions reconciled.');

        return self::SUCCESS;
    }

    /**
     * The organisations to reconcile, which the package cannot name for itself.
     *
     * A PANEL DOES NOT OWN THE TENANT MODEL - it is the consumer's, with their
     * columns and their relations - so `panel.tenancy.model` names it and this
     * asks that. Configured as null, a SINGLE-TENANT INSTALLATION still gets one
     * pass with a null team id, which is the shape `SetPermissionsTeam` sets when
     * nothing resolved and therefore the shape those roles are stored under.
     * Returning nothing instead would make the command silently do nothing at
     * all, which reads as "already reconciled".
     *
     * @return iterable<Model|null>
     */
    private function tenants(): iterable
    {
        $model = config('panel.tenancy.model');

        if (! is_string($model) || ! class_exists($model)) {
            return [null];
        }

        return $model::query()->orderBy((new $model)->getKeyName())->get();
    }

    /** The tenant's key, or null in a single-tenant installation. */
    private function keyFor(?Model $tenant): int|string|null
    {
        return $tenant?->getKey();
    }

    /**
     * What to call this organisation in the console.
     *
     * `slug` IS A CONVENTION, NOT A CONTRACT. The reference app has one; a
     * consumer's tenant model may not, and reading a missing attribute to build a
     * progress line would fail the whole reconciliation over a label.
     */
    private function labelFor(?Model $tenant): string
    {
        if ($tenant === null) {
            return 'default';
        }

        foreach (['slug', 'name'] as $attribute) {
            $value = $tenant->getAttribute($attribute);

            if (is_string($value) && $value !== '') {
                return $value;
            }
        }

        return (string) $tenant->getKey();
    }

    /** The application's authenticatable, which `model_has_roles` stores by name. */
    private function userModel(): string
    {
        return (string) config('auth.providers.users.model');
    }

    /**
     * The column Spatie scopes roles by - ASKED, NEVER ASSUMED.
     *
     * It is `tenant_id` here and `team_id` in Spatie's own default, and a
     * consumer who published the config before installing Alxtexhpanel has whichever
     * they chose. Hardcoding the panel's name would write assignments into a
     * column the runtime then never reads: the sync reports success, every role
     * looks correct in the database, and nobody can do anything.
     */
    private function teamColumn(): string
    {
        return (string) config(
            'permission.column_names.team_foreign_key',
            config('panel.tenancy.column', 'tenant_id'),
        );
    }

    /** Likewise the pivot, which a consumer may have renamed. */
    private function pivotTable(): string
    {
        return (string) config('permission.table_names.model_has_roles', 'model_has_roles');
    }

    /**
     * Every ability the registry declares exists as a permission row.
     *
     * @param  list<string>  $known
     */
    private function ensurePermissionsExist(array $known, string $guard, bool $dry): void
    {
        $existing = Permission::query()->where('guard_name', $guard)->pluck('name')->all();
        $missing = array_values(array_diff($known, $existing));

        if ($missing === [] || $dry) {
            if ($missing !== []) {
                $this->components->task('  would create '.count($missing).' permission(s)', fn () => true);
            }

            return;
        }

        foreach ($missing as $name) {
            Permission::findOrCreate($name, $guard);
        }

        $this->components->task('  created '.count($missing).' permission(s)', fn () => true);
    }

    /** @param list<string> $known */
    private function reconcile(?Model $tenant, array $known, string $guard, bool $dry): void
    {
        $key = $this->keyFor($tenant);
        $team = $this->teamColumn();

        app(PermissionRegistrar::class)->setPermissionsTeamId($key);

        $label = $this->labelFor($tenant);
        /*
         * EAGER LOADED, because this command crashed in any application that
         * follows Laravel's own advice.
         *
         * `$role->permissions` a few lines down is a lazy load, and
         * `Model::preventLazyLoading()` - which the framework recommends and
         * every recent starter kit enables outside production - turns that into
         * a thrown exception. So `panel:permissions sync`, the command that
         * reconciles the permission system, failed on any panel in development.
         *
         * NOTHING CAUGHT IT, and the two reasons are worth keeping:
         *
         *   `verify-install.sh` builds a bare `laravel/laravel`, which does NOT
         *   enable strict mode. The harness that exists to prove a real install
         *   is quieter than a real installation.
         *
         *   And a freshly created model is EXEMPT from the check - see
         *   `HasAttributes::handleLazyLoadingViolation`, which returns early
         *   when `wasRecentlyCreated`. Every test here made its roles and then
         *   synced, so the object was always new enough to be excused.
         */
        $roles = Role::query()->with('permissions')->where($team, $key)->get();

        if ($roles->isEmpty()) {
            $this->createAdministrator($tenant, $known, $guard, $dry);
            $roles = Role::query()->with('permissions')->where($team, $key)->get();
        }

        foreach ($roles as $role) {
            /*
             * TOP UP THE SUPERUSER ROLES. Pruning without this is half a
             * reconciliation: it removes names that died and never adds names
             * that were born, so registering a resource leaves every
             * administrator unable to touch it.
             */
            if ($role->grantsEverything()) {
                $missing = array_values(array_diff($known, $role->permissions->pluck('name')->all()));

                if ($missing !== []) {
                    if (! $dry) {
                        $role->syncPermissions($known);
                    }

                    $this->components->task(
                        "  {$label}/{$role->name}: granted ".count($missing).' new abilit(y/ies)',
                        fn () => true,
                    );
                }

                continue;
            }

            $granted = $role->permissions->pluck('name')->all();
            $stale = array_values(array_diff($granted, $known));

            if ($stale === []) {
                continue;
            }

            if (! $this->option('prune')) {
                $this->components->warn(
                    "  {$label}/{$role->name}: ".count($stale)
                    .' granted abilit(y/ies) name nothing - re-run with --prune to remove: '
                    .implode(', ', array_slice($stale, 0, 5))
                );

                continue;
            }

            if (! $dry) {
                $role->syncPermissions(array_values(array_intersect($granted, $known)));
            }

            $this->components->task("  {$label}/{$role->name}: pruned ".count($stale), fn () => true);
        }

        $this->adoptRoleless($tenant, $dry);
    }

    /** @param list<string> $known */
    /**
     * Give an existing account the Administrator role.
     *
     * THE FRESH INSTALL WAS LOCKED, and this is the missing key. `sync` creates
     * an Administrator role holding every ability and assigns it to NOBODY -
     * correct, because the package has no business deciding who runs your
     * installation. `panel:make-user` grants it, but only to an account it
     * creates. So anybody who registered through the sign-in screen first, or
     * who ran the installer before creating an account, had a panel where every
     * screen answered 403 - including the roles screen, which is the one that
     * would have fixed it. The screen that grants permissions required the
     * permission it grants.
     *
     * A DELIBERATE ACT AT A SHELL, not a first-user-wins rule. "Whoever
     * registers first becomes an administrator" is a race on a public
     * registration form; somebody with the server is somebody entitled to
     * decide.
     *
     * IT NAMES WHO, rather than guessing. Granting to "the only account" is
     * fine until an installation has two, and then it is a coin toss with
     * administrator rights on it.
     */
    private function grant(): int
    {
        $email = (string) ($this->option('email') ?? '');

        if ($email === '') {
            $this->components->error(
                'Which account? panel:permissions grant --email=you@example.com'
            );

            return self::FAILURE;
        }

        $model = (string) config('auth.providers.users.model', 'App\\Models\\User');

        if (! class_exists($model)) {
            $this->components->error("The configured user model [{$model}] does not exist.");

            return self::FAILURE;
        }

        $user = $model::query()->where('email', $email)->first();

        if ($user === null) {
            $this->components->error(
                "No account with the email {$email}. Create one with panel:make-user."
            );

            return self::FAILURE;
        }

        if (! method_exists($user, 'assignRole')) {
            $this->components->error(
                "{$model} has no assignRole(), so it cannot hold a role. Add `use "
                .'Spatie\\Permission\\Traits\\HasRoles;` to the model - `panel:install` does '
                .'this on a fresh application, and `panel:doctor` reports it.'
            );

            return self::FAILURE;
        }

        /*
         * THE TEAM IS THE ACCOUNT'S OWN, because a role is scoped to one
         * organisation under team mode - granting under the wrong team creates a
         * role nobody holds and reports success.
         */
        $team = config('permission.column_names.team_foreign_key', 'tenant_id');
        $tenant = $user->{$team} ?? null;

        app(PermissionRegistrar::class)->setPermissionsTeamId($tenant);

        $role = Role::query()->firstOrCreate(
            [
                'name' => 'Administrator',
                'guard_name' => config('auth.defaults.guard', 'web'),
                ...(config('permission.teams') ? [$team => $tenant] : []),
            ],
            ['grants_all' => true],
        );

        $user->assignRole($role);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $this->components->info("{$email} is now an Administrator.");
        $this->components->twoColumnDetail(
            'Role',
            "Administrator ({$role->getKey()}) - holds every ability, including ones added later",
        );

        return self::SUCCESS;
    }

    /** @param list<string> $known */
    private function createAdministrator(?Model $tenant, array $known, string $guard, bool $dry): void
    {
        $label = $this->labelFor($tenant);

        if ($dry) {
            $this->components->task("  {$label}: would create Administrator", fn () => true);

            return;
        }

        $role = Role::create([
            'name' => 'Administrator',
            'guard_name' => $guard,
            $this->teamColumn() => $this->keyFor($tenant),
        ]);

        // The administrator role is the one that must never fall behind the
        // registry - see Role::grantsEverything().
        $role->forceFill(['grants_all' => true])->save();
        $role->syncPermissions($known);

        $this->components->task("  {$label}: created Administrator with ".count($known).' abilities', fn () => true);
    }

    /**
     * Anybody with no role at all gets the default one.
     *
     * `hasPermission()` denies a user with no roles, which is the correct posture
     * and also means introducing roles to a running panel locks out every
     * existing account at once. A silent, total lockout looks like the panel is
     * broken rather than like a provisioning step was missed.
     */
    private function adoptRoleless(?Model $tenant, bool $dry): void
    {
        $key = $this->keyFor($tenant);
        $team = $this->teamColumn();
        $label = $this->labelFor($tenant);
        $users = $this->userModel();

        $default = Role::query()->where($team, $key)->orderBy('id')->first();

        if ($default === null) {
            return;
        }

        $held = DB::table($this->pivotTable())
            ->where('model_type', $users)
            ->where($team, $key)
            ->pluck('model_id');

        $table = (new $users)->getTable();

        $roleless = DB::table($table)
            ->where(config('panel.tenancy.column', 'tenant_id'), $key)
            ->whereNotIn('id', $held)
            ->pluck('id');

        if ($roleless->isEmpty()) {
            return;
        }

        if (! $dry) {
            foreach ($roleless as $userId) {
                DB::table($this->pivotTable())->updateOrInsert([
                    'role_id' => $default->getKey(),
                    'model_type' => $users,
                    'model_id' => $userId,
                    $team => $key,
                ], []);
            }
        }

        $this->components->task(
            "  {$label}: gave {$roleless->count()} user(s) the {$default->name} role",
            fn () => true,
        );
    }
}
