<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Alxtexh\Panel\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
            /*
             * A FACTORY USER IS A USER WHO HAS ALREADY BEEN THROUGH SETUP,
             * unless a test says otherwise. `RedirectToSetupWizard` sends
             * anyone without this to `/setup-wizard` before anywhere else -
             * correct for a real first login, and exactly wrong as the
             * default for the thousands of tests that create a user to
             * exercise something else entirely. `SetupWizardTest` itself
             * overrides this back to unset where the wizard is the thing
             * under test.
             */
            'appearance' => ['setupWizardDone' => true],
        ];
    }

    /**
     * A factory user is a NORMALLY-PROVISIONED user, which means it has a role.
     *
     * WHY THIS IS HERE RATHER THAN IN 129 TESTS. `hasPermission()` denies when a
     * user has no role - the correct posture, and the one that made every
     * existing suite fail the moment the permission gate landed, because none of
     * them had any reason to think about roles. Assigning one here says what was
     * already meant: these tests are about exports and reordering and uploads,
     * by somebody allowed to do them.
     *
     * THE RISK THIS CREATES, AND WHAT COVERS IT. A factory that always grants
     * everything means no ordinary test would notice if the permission check
     * stopped being consulted at all - the gate could be deleted and 650 tests
     * would still pass. `RolePermissionTest` is the answer: it builds users with
     * deliberately narrow roles and asserts the refusals, so the guard has tests
     * that fail when it is removed rather than tests that merely never exercise
     * it.
     *
     * `roleless()` opts out, for the tests that are about the absence itself.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (User $user): void {
            if ($user->tenant_id === null || $user->roles()->exists()) {
                return;
            }

            $this->attach($user, $this->administratorFor($user->tenant_id));
        });
    }

    /** A user with no roles at all - denied everything, by design. */
    public function roleless(): static
    {
        return $this->afterCreating(function (User $user): void {
            /*
             * DELETED THROUGH THE PIVOT, not `$user->roles()->detach()`.
             *
             * Spatie's relation is team-scoped, so `detach()` outside a team
             * context removes nothing at all and returns quietly - the user
             * keeps every role and the test asserting they have none passes for
             * the wrong reason, or fails confusingly. Writing the pivot directly
             * does not depend on ambient state.
             */
            DB::table('model_has_roles')
                ->where('model_type', User::class)
                ->where('model_id', $user->getKey())
                ->delete();

            $user->unsetRelation('roles');
            app(PermissionRegistrar::class)->forgetCachedPermissions();
        });
    }

    /**
     * A user whose role grants exactly `$abilities` and nothing else.
     *
     * @param  list<string>  $abilities
     */
    public function withAbilities(array $abilities, ?string $name = null): static
    {
        return $this->afterCreating(function (User $user) use ($abilities, $name): void {
            // UNIQUE PER CALL by default. `(name, guard, tenant)` is unique, so
            // two users given narrow roles in one test collided on it.
            $name ??= 'Role '.str()->random(8);

            $this->withTeam($user->tenant_id, function () use ($user, $abilities, $name): void {
                $created = Role::create([
                    'name' => $name,
                    'guard_name' => config('auth.defaults.guard', 'web'),
                    'tenant_id' => $user->tenant_id,
                ]);

                if (! $created instanceof Role) {
                    throw new \UnexpectedValueException('The configured role model did not create a panel role.');
                }

                $role = $created;

                foreach ($abilities as $ability) {
                    Permission::findOrCreate($ability, config('auth.defaults.guard', 'web'));
                }

                $role->syncPermissions($abilities);

                DB::table('model_has_roles')
                    ->where('model_type', User::class)
                    ->where('model_id', $user->getKey())
                    ->delete();

                $this->attach($user, $role);
            });
        });
    }

    /**
     * The tenant's superuser role, created on demand.
     *
     * A factory user is a NORMALLY-PROVISIONED user, which means it has a role.
     * `hasPermission()` denies a user with no roles - the correct posture, and
     * the reason every existing suite failed the moment permissions landed.
     * Assigning one here says what those tests already meant.
     *
     * `RolePermissionTest` is what covers the risk this creates: it builds users
     * with deliberately narrow roles and asserts the refusals, so the guard has
     * tests that fail when it is removed rather than tests that never reach it.
     */
    private function administratorFor(int|string $tenantId): Role
    {
        return $this->withTeam($tenantId, function () use ($tenantId): Role {
            $role = Role::query()
                ->where('tenant_id', $tenantId)
                ->where('name', 'Administrator')
                ->first();

            if (! $role instanceof Role) {
                $created = Role::create([
                    'name' => 'Administrator',
                    'guard_name' => config('auth.defaults.guard', 'web'),
                    'tenant_id' => $tenantId,
                ]);

                if (! $created instanceof Role) {
                    throw new \UnexpectedValueException('The configured role model did not create a panel role.');
                }

                $role = $created;

                $role->forceFill(['grants_all' => true])->save();
            }

            return $role;
        });
    }

    /**
     * Attach a role directly through the pivot.
     *
     * `$user->assignRole()` goes through Spatie's team resolution, which depends
     * on the ambient team id - and in a factory there is usually none, so the
     * assignment lands with a null tenant and is invisible afterwards. Writing
     * the pivot with the tenant explicit avoids depending on ambient state,
     * which is the same rule the rest of this codebase follows for guards.
     */
    private function attach(User $user, Role $role): void
    {
        DB::table('model_has_roles')->updateOrInsert([
            'role_id' => $role->getKey(),
            'model_type' => User::class,
            'model_id' => $user->getKey(),
            'tenant_id' => $user->tenant_id,
        ], []);

        $user->unsetRelation('roles');
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /** Run `$body` with Spatie's team id set, then restore it. */
    private function withTeam(int|string|null $tenantId, callable $body): mixed
    {
        $registrar = app(PermissionRegistrar::class);
        $previous = $registrar->getPermissionsTeamId();

        $registrar->setPermissionsTeamId($tenantId);

        try {
            return $body();
        } finally {
            $registrar->setPermissionsTeamId($previous);
        }
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }
}
