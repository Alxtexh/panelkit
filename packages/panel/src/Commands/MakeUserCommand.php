<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Alxtexh\Panel\Models\Role;
use Alxtexh\Panel\Support\Abilities;
use Spatie\Permission\PermissionRegistrar;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

/**
 * The first account, without which a fresh install cannot be signed into.
 *
 * FOUND BY INSTALLING FILAMENT AND COMPARING. Filament has
 * `make:filament-user`; Alxtexhpanel shipped `panel:permissions sync`, which
 * creates an Administrator ROLE and no person to hold it. So even after the
 * sign-in screen existed, the honest state of a fresh install was: a login form
 * and nobody who can use it. Nobody's bug report caught this, because everybody
 * porting an app already had users.
 *
 * THE PASSWORD IS NEVER AN ARGUMENT. A `--password=` option puts it in the
 * shell history, in `ps` output for as long as the command runs, and in any
 * CI log that echoes its commands. It is prompted for, hidden, and confirmed -
 * and this command refuses to run non-interactively rather than inventing a
 * default, because a printed password is one nobody changes.
 *
 * IT GRANTS EVERYTHING, DELIBERATELY, and says so. The first account exists to
 * make the panel usable; a first administrator who cannot reach the roles
 * screen cannot grant anybody else anything either, so the install would be
 * locked from the inside.
 */
final class MakeUserCommand extends Command
{
    protected $signature = 'panel:make-user
                            {--name= : The person\'s name}
                            {--email= : Their email address}
                            {--password= : Password. Non-interactive only; prefer a prompt so it stays out of shell history}
                            {--tenant= : The organisation id, under column-mode tenancy}';

    protected $description = 'Create an account that can sign in to the panel';

    public function handle(): int
    {
        $model = (string) config('auth.providers.users.model', 'App\\Models\\User');

        if (! class_exists($model)) {
            $this->components->error("The configured user model [{$model}] does not exist.");

            return self::FAILURE;
        }

        if (! is_subclass_of($model, Model::class)) {
            $this->components->error("The configured user model [{$model}] must extend Eloquent's Model.");

            return self::FAILURE;
        }

        $name = (string) ($this->option('name') ?: text('Name', required: true));
        $email = (string) ($this->option('email') ?: text('Email address', required: true));

        if ($model::query()->where('email', $email)->exists()) {
            $this->components->error("An account with [{$email}] already exists.");

            return self::FAILURE;
        }

        /*
         * PROMPTED UNLESS `--password` IS SET. A password on the command line
         * lands in shell history and in CI logs; the prompt is the right path.
         * Install and tests need a non-interactive flag, which is why one
         * exists at all.
         */
        $password = $this->option('password');

        if (! is_string($password) || $password === '') {
            if (! $this->input->isInteractive()) {
                $this->components->error(
                    'panel:make-user needs an interactive terminal, or --password=, because it will not '
                    .'invent a default - a printed password is one nobody changes.',
                );

                return self::FAILURE;
            }

            $password = password('Password', required: true);

            if ($password !== password('Confirm password', required: true)) {
                $this->components->error('The passwords do not match.');

                return self::FAILURE;
            }
        }

        $attributes = [
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ];

        /*
         * A TENANT COLUMN IS FILLED IF THERE IS ONE. Under column-mode tenancy
         * every scoped query filters on it, so an account created without one
         * signs in successfully and then sees nothing at all - which reads as a
         * broken panel rather than as a missing field.
         */
        $table = (new $model)->getTable();
        $column = (string) config('panel.tenancy.column', 'tenant_id');

        if (Schema::hasColumn($table, $column)) {
            $tenant = $this->option('tenant');

            if ($tenant === null) {
                $this->components->warn(
                    "[{$table}.{$column}] exists and no --tenant was given. The account will be "
                    .'created without one, and a tenant-scoped panel shows nothing to somebody '
                    .'who belongs to no organisation.',
                );
            }

            $attributes[$column] = $tenant;
        }

        if (Schema::hasColumn($table, 'email_verified_at')) {
            $attributes['email_verified_at'] = now();
        }

        /*
         * `forceFill()`, NOT `create()`. Every key in `$attributes` is decided
         * above by this command, not by outside input - but a consuming app's
         * User model is free to declare a narrow `#[Fillable(...)]` list that
         * does not expect a command to be the one writing `tenant_id`. Mass
         * assignment guarding silently drops the column in that case: the
         * account is created, signs in, and sees nothing - the exact failure
         * the comment above this method exists to prevent, just with the
         * guard itself as the cause instead of a missing `--tenant`.
         */
        $user = new $model;
        $user->forceFill($attributes);
        $user->save();

        $this->grantAdministrator($user);

        $this->components->info("Created [{$email}].");

        $this->warnIfPrefillNowMismatched($email);

        return self::SUCCESS;
    }

    /**
     * `panel:install`'s login-prefill convenience writes a literal email and
     * password into `config/panel.php` so a fresh install can press Log in
     * without typing - see `InstallCommand::writeLocalAuthPrefill()`. That
     * write only happens when `panel:install` itself created the first
     * account (`--email=`/`--password=` passed to install). The install
     * command's OWN output tells a developer who skipped that to run THIS
     * command instead - which is exactly how a fresh install ends up with a
     * login form pre-filled with an email that does not exist, guaranteed to
     * fail on the very first attempt. Found running an actual fresh install,
     * not assumed.
     *
     * A NOTE, NOT A FILE EDIT. `panel:make-user` refuses to accept a password
     * as a plain option specifically so a printed password is never one that
     * lingers - writing the one just typed at a hidden prompt into
     * `config/panel.php`, a file installations commonly commit, would defeat
     * that. Telling the developer the mismatch exists is enough for them to
     * fix it by hand, or ignore it because they always type their own
     * credentials anyway.
     */
    private function warnIfPrefillNowMismatched(string $email): void
    {
        if (! app()->environment('local')) {
            return;
        }

        $panel = (string) config('panel.default', 'admin');
        $prefilled = config("panel.auth.{$panel}.prefill.email");

        if (! is_string($prefilled) || $prefilled === '' || $prefilled === $email) {
            return;
        }

        $this->components->warn(
            "The local sign-in form is still pre-filled with [{$prefilled}], not [{$email}] - "
            .'pressing Log in without typing will fail. Update '
            ."config/panel.php's auth.{$panel}.prefill (or PANEL_DEMO_EMAIL/PANEL_DEMO_PASSWORD "
            .'in .env) to match, or just type this account\'s own credentials.',
        );
    }

    /**
     * Attach a role holding every ability, creating it if `panel:permissions
     * sync` has not run.
     *
     * `grants_all` RATHER THAN A LIST, so the first account keeps working when
     * a later release invents an ability - which is the difference between an
     * administrator and a role that was complete on the day it was made.
     *
     * SILENT WHEN SPATIE IS ABSENT. An installation that has not set the
     * permission layer up yet still gets an account it can sign in with, and
     * `panel:doctor` is what tells them the rest is missing.
     */
    private function grantAdministrator(object $user): void
    {
        if (! class_exists(PermissionRegistrar::class)) {
            return;
        }

        if (! method_exists($user, 'assignRole')) {
            $this->components->warn(
                'The user model has no assignRole(), so no role was attached. Grant one from '
                .'the roles screen, or the panel will deny everything.',
            );

            return;
        }

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

        $this->components->twoColumnDetail(
            'Role',
            "Administrator ({$role->getKey()}) - holds every ability, including ones added later",
        );

        if (Abilities::all() === []) {
            $this->components->warn(
                'No abilities are registered yet, which means no resources are. Run '
                .'`panel:permissions sync` once you have some.',
            );
        }
    }
}
