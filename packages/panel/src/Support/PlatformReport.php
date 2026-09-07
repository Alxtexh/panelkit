<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Foundation\Application;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Alxtexh\Panel\Live\LiveConfig;
use Alxtexh\Panel\PanelManager;

/**
 * What this installation is actually running.
 *
 * IT EXISTS BECAUSE THE ANSWERS WERE ONLY AVAILABLE FROM A SHELL. Which cache
 * driver, which queue, whether the scheduler has run, whether tenancy is in
 * column or database mode, which live-update transport - every one of those
 * changes how the panel behaves, every one is a common cause of "it works on my
 * machine", and every one required somebody with SSH access and a copy of the
 * config to answer. An operator watching a backup fail could see that it failed
 * and nothing about the environment it failed in.
 *
 * IT REPORTS, IT DOES NOT CHANGE. Nothing here writes: a screen that could edit
 * the queue driver would be a screen that can take the installation down from a
 * browser, and the things worth editing at runtime already have their own homes
 * (backup settings, permissions, branding). Configuration that belongs in a
 * deploy stays in the deploy.
 *
 * NO SECRETS. Driver NAMES, not credentials; hosts only where they are already
 * public knowledge to anybody who can open the page. The obvious version of this
 * screen dumps `config()` and puts the application key on a web page.
 *
 * THE DOCTOR'S FINDINGS ARE BORROWED rather than reimplemented. `panel:doctor`
 * already knows what "silently wrong" looks like, and a second copy of those
 * checks would drift from the first - agreeing while both are new, disagreeing
 * exactly when one of them has been fixed.
 */
final class PlatformReport
{
    /** @return array<string, mixed> */
    public function all(): array
    {
        return [
            'application' => $this->application(),
            'drivers' => $this->drivers(),
            'tenancy' => $this->tenancy(),
            'scheduler' => $this->scheduler(),
            'findings' => $this->findings(),
        ];
    }

    /** @return array<string, mixed> */
    private function application(): array
    {
        return [
            'name' => (string) config('app.name'),
            'environment' => (string) config('app.env'),
            /*
             * DEBUG IS REPORTED BECAUSE IT IS THE ONE THAT MATTERS MOST. Left on
             * in production it puts stack traces, environment variables and
             * database credentials on an error page - and it is invisible until
             * something throws, which is the worst moment to find out.
             */
            'debug' => (bool) config('app.debug'),
            'url' => (string) config('app.url'),
            'php' => PHP_VERSION,
            'laravel' => Application::VERSION,
            'timezone' => (string) config('app.timezone'),
            'locale' => (string) config('app.locale'),
        ];
    }

    /** @return array<string, mixed> */
    private function drivers(): array
    {
        $connection = (string) config('database.default');

        return [
            /*
             * THE DATABASE HOST IS SHOWN and the credentials are not. The host
             * is the fact an operator needs - "am I looking at staging?" is the
             * question a restore makes urgent - and it is not a secret to
             * anybody already holding an operations ability.
             */
            'database' => [
                'connection' => $connection,
                'driver' => (string) config("database.connections.{$connection}.driver"),
                'host' => (string) config("database.connections.{$connection}.host", 'local file'),
                'version' => $this->databaseVersion(),
            ],
            'cache' => (string) config('cache.default'),
            'queue' => (string) config('queue.default'),
            'session' => (string) config('session.driver'),
            'mail' => (string) config('mail.default'),
            'filesystem' => (string) config('filesystems.default'),
            /*
             * RESOLVED AS A STRING, so the screen reports what is RUNNING
             * rather than the question `auto` asks - and without constructing a
             * config, which throws for `broadcast` with no channel. A
             * monitoring page that 500s on a misconfiguration is reporting
             * nothing at the moment it is most needed.
             */
            'live' => LiveConfig::resolveDriver(
                (string) config('panel.live.driver', 'auto'),
            ),
            'broadcast' => (string) config('broadcasting.default', 'null'),
        ];
    }

    /**
     * The version string, or null when the driver will not say.
     *
     * WRAPPED, because this is the one thing here that touches the database and
     * a report that cannot be opened when the database is unwell is a report
     * that is missing exactly when it is wanted.
     */
    private function databaseVersion(): ?string
    {
        try {
            return (string) DB::connection()->getPdo()->getAttribute(\PDO::ATTR_SERVER_VERSION);
        } catch (\Throwable) {
            return null;
        }
    }

    /** @return array<string, mixed> */
    private function tenancy(): array
    {
        $mode = (string) config('panel.tenancy.mode', 'none');

        return [
            'mode' => $mode,
            /*
             * WHAT THE MODE MEANS, in a sentence. "column" and "database" are
             * one word apart and describe completely different isolation
             * guarantees; anybody reading this screen to decide whether a
             * restore is safe needs the difference spelled out rather than
             * remembered.
             */
            'meaning' => match ($mode) {
                'column' => 'One database, separated by a tenant column the panel adds to every query.',
                'database' => 'A database per tenant; isolation is done before the panel sees the request.',
                'hybrid' => 'Some tenants share a database, others have their own.',
                default => 'Single-tenant: no separation is applied.',
            },
            'resources' => count(app(PanelManager::class)->resources()),
        ];
    }

    /**
     * Whether anything is actually running the schedule.
     *
     * THE MOST COMMONLY BROKEN THING IN A LARAVEL DEPLOYMENT, and the one with
     * the quietest failure: no cron entry means no backups, no cleanup and no
     * monitor, and every screen reporting on those looks normal because they
     * simply never ran. `schedule:run` touches a cache key on every tick, so a
     * missing or stale one is the evidence.
     */
    /** @return array{lastRunAt: string|null, healthy: bool} */
    private function scheduler(): array
    {
        /*
         * NOT FROM THE CACHE. Cache keys are tenant-prefixed, so a heartbeat
         * written by cron with no tenant is absent when read inside a tenant
         * request - which reported a healthy scheduler as dead, with nothing to
         * suggest the reading was the broken part. See `InstallationState`.
         */
        $lastRun = app(InstallationState::class)->get('scheduler:last-run');

        return [
            'lastRunAt' => $lastRun,
            /*
             * FIVE MINUTES, not one. The scheduler ticks every minute, but a
             * cron that fires on the minute and a page rendered a moment before
             * it would show "stale" on a healthy installation - and a health
             * indicator that cries wolf is one that gets ignored.
             */
            'healthy' => $lastRun !== null
                && Carbon::parse($lastRun)->diffInMinutes(now()) < 5,
        ];
    }

    /**
     * `panel:doctor`, run in process.
     *
     * BORROWED RATHER THAN REIMPLEMENTED - see the class note. It is a console
     * command, so the output is captured rather than returned; that is the cost
     * of not having two copies of the same checks.
     *
     * @return list<array<string, mixed>>
     */
    private function findings(): array
    {
        try {
            Artisan::call('panel:doctor', ['--json' => true]);

            $decoded = json_decode(Artisan::output(), true);

            return is_array($decoded) ? array_values($decoded) : [];
        } catch (\Throwable $e) {
            report($e);

            /*
             * A FAILED CHECK IS REPORTED AS A FINDING, not swallowed. "The
             * health check could not run" is itself a health problem, and
             * showing an empty list instead would read as a clean bill.
             */
            return [[
                'level' => 'problem',
                'title' => 'Health checks could not run',
                'detail' => $e->getMessage(),
            ]];
        }
    }
}
