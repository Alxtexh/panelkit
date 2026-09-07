<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Alxtexh\Panel\Api\ApiToken;
use Alxtexh\Panel\Support\Abilities;

/**
 * Mint an API token: `php artisan panel:api-token ops@example.com "Billing sync"`.
 *
 * A COMMAND RATHER THAN A SCREEN, for now and deliberately. A token is a
 * credential that bypasses the sign-in flow, and the first version of anything
 * that mints one should be reachable only by somebody with server access. A
 * screen can follow once there is a reason for one; a screen that came first
 * would be a way to create standing access from a browser session, which is the
 * thing an API token is usually issued to avoid.
 *
 * THE PLAINTEXT IS PRINTED ONCE AND NEVER STORED. Everything after this is a
 * hash, so a lost token is reissued rather than recovered - which is the
 * property that makes the table survivable in a backup.
 *
 * ABILITIES ARE CHECKED AGAINST THE REGISTRY. A token naming an ability that
 * does not exist grants nothing while looking fully configured, and the moment
 * somebody notices is the moment an integration is already failing.
 */
final class MakeApiTokenCommand extends Command
{
    protected $signature = 'panel:api-token
        {email : The account the token acts as}
        {name : What it is for, e.g. "Billing sync"}
        {--ability=* : Abilities to grant. Repeatable. Defaults to * (everything the account may do)}
        {--days= : Expire after this many days. Omitted means never}';

    protected $description = 'Issue an API token for the public API';

    public function handle(): int
    {
        $model = (string) config('auth.providers.users.model', User::class);

        $user = $model::query()->where('email', $this->argument('email'))->first();

        if ($user === null) {
            $this->components->error("No account with email [{$this->argument('email')}].");

            return self::FAILURE;
        }

        if ($user->tenant_id === null) {
            /*
             * THE TOKEN IS THE TENANT CONTEXT. An account with no organisation
             * would produce a token that resolves to none - and "no
             * organisation" must never be readable as "all of them".
             */
            $this->components->error('That account belongs to no organisation, so a token for it would be unscoped.');

            return self::FAILURE;
        }

        $abilities = [];
        foreach ((array) $this->option('ability') as $ability) {
            if (is_string($ability) && $ability !== '') {
                $abilities[] = $ability;
            }
        }

        if ($abilities === []) {
            /*
             * `*` IS THE DEFAULT AND IS STILL BOUNDED. It means "everything this
             * account may do", intersected with the account's real permissions
             * on every request - not "everything". The alternative is asking
             * somebody to enumerate forty ability names, which produces a list
             * that is wrong within a month.
             */
            $abilities = ['*'];
        }

        $unknown = array_diff($abilities, ['*', ...Abilities::all()]);

        if ($unknown !== []) {
            $this->components->error('Unknown abilit(y/ies): '.implode(', ', $unknown));
            $this->line('  Run `php artisan panel:permissions sync` if a resource was added recently.');

            return self::FAILURE;
        }

        $days = $this->option('days');

        $issued = ApiToken::issue(
            tenantId: $user->tenant_id,
            userId: $user->getKey(),
            name: (string) $this->argument('name'),
            abilities: $abilities,
            expiresAt: $days === null ? null : now()->addDays((int) $days),
        );

        $this->newLine();
        $this->components->info('Token issued. It is shown once and cannot be recovered.');
        $this->newLine();
        $this->line('  '.$issued['plaintext']);
        $this->newLine();

        $this->components->twoColumnDetail('Acts as', (string) $user->email);
        $this->components->twoColumnDetail('Organisation', (string) $user->tenant_id);
        $this->components->twoColumnDetail('Grants', implode(', ', $abilities));
        $this->components->twoColumnDetail('Expires', $days === null ? 'never' : now()->addDays((int) $days)->toDayDateTimeString());

        $this->newLine();
        $this->line('  curl -H "Authorization: Bearer '.$issued['plaintext'].'" \\');
        $this->line('       '.rtrim((string) config('app.url'), '/').'/api/v1/clients');

        return self::SUCCESS;
    }
}
