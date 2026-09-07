<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Commands;

use Alxtexh\Panel\Alerts;
use Alxtexh\Panel\Documents;
use Alxtexh\Panel\Knowledge;
use Alxtexh\Panel\Live\LiveConfig;
use Alxtexh\Panel\Pages\Page;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Plugins\PanelPlugin;
use Alxtexh\Panel\Plugins\Plugin;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Support\AppearancePrepaintWiring;
use Alxtexh\Panel\Support\BackupStatus;
use Alxtexh\Panel\Support\Contrast;
use Alxtexh\Panel\Support\CriticalStylesheetBlocks;
use Alxtexh\Panel\Support\Discovery;
use Alxtexh\Panel\Support\InertiaLayoutWiring;
use Alxtexh\Panel\Support\KitAssets;
use Alxtexh\Panel\Support\PanelLayoutShell;
use Alxtexh\Panel\Support\PanelPages;
use Alxtexh\Panel\Support\SemanticStatusTokens;
use Alxtexh\Panel\Support\TenantContext;
use Alxtexh\Panel\Support\ThemeChromeTokens;
use Alxtexh\Panel\Support\TicketTables;
use Alxtexh\Panel\Support\VendoredCopy;
use Alxtexh\Panel\Support\WebSharePanelProps;
use Alxtexh\Panel\Ticketing\TicketingPlugin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\PermissionRegistrar;
/**
 * Check for the configurations that are wrong in ways nothing else reports.
 *
 * EVERY CHECK HERE EXISTS BECAUSE THE FAILURE IS SILENT. A misconfiguration that
 * throws is already reported by the exception; this command is for the other
 * kind - the settings that produce a working panel serving wrong or unprotected
 * data, where every page returns 200 and every test passes.
 *
 * Most of them were found the hard way in this project:
 *
 *   - `BROADCAST_CONNECTION=log` makes channel authorisation INERT. The log
 *     broadcaster never consults the callbacks, so every channel authorises,
 *     including for a guest.
 *   - A tenant-led index in a dedicated database cannot serve any query, because
 *     the panel drops the tenant predicate there - 20 to 60 times slower, with
 *     correct results.
 *   - A session limit with a cookie store silently does nothing.
 *   - A resource with no policy is denied entirely, which looks like a
 *     permissions bug rather than a missing file.
 *
 * IT DISTINGUISHES A PROBLEM FROM A NOTE. Everything is not equally wrong, and a
 * report where every line is a warning trains people to read none of them.
 */
use Throwable;

final class DoctorCommand extends Command
{
    protected $signature = 'panel:doctor {--profile=default : Doctor profile to run (default, production)} {--json : Emit a machine-readable report}';

    protected $description = 'Check for configuration that is silently wrong';

    /** @var list<array{level: string, title: string, detail: string, suggested?: string}> */
    private array $findings = [];

    public function handle(PanelManager $panels, TenantContext $context): int
    {
        $profile = (string) ($this->option('profile') ?? 'default');

        /*
         * EMPTIED FIRST, because the console kernel keeps command INSTANCES.
         *
         * A second run in the same process appended to the first run's
         * findings, so doctor reported every problem twice, then three times.
         * Nothing notices from a terminal - a command exits and the process
         * ends - and everything notices where it matters: an Octane worker
         * serving the dashboard checklist, and `panel:doctor-alert`, whose
         * whole design is comparing this run's findings with the last one's.
         * It announced the same standing problem every day because the SET
         * kept changing.
         *
         * A property initialised at declaration is initialised once per
         * OBJECT, and the object outlives the run.
         */
        $this->findings = [];

        if ($profile === 'production') {
            $this->checkQueueWorker();
            $this->checkCacheAndSessionDrivers();
            $this->checkBroadcastDriver();
            $this->checkStorageLink();
            $this->checkNotificationTable();
            $this->checkMailDefaults();
            $this->checkProductionSecurityBaseline();
            $this->checkTrustedProxyAndHttps();
        } else {
            $this->checkPolicies($panels);
            $this->checkBroadcasting();
            $this->checkQueueIsReal($panels);
            $this->checkSessionLimit();
            $this->checkCacheTagging();
            $this->checkTenancy($context);
            $this->checkIndexes($context);
            $this->checkSearchIndexes($panels);
            $this->checkKnowledge();
            $this->checkDocumentTemplates();
            $this->checkAnnouncementVariables();
            $this->checkTemplateContrast();
            $this->checkBackupFreshness();
            $this->checkViteDevServer();
            $this->checkShippedDefaults();
            $this->checkPermissionTeams($context);
            $this->checkTicketing($panels);
            $this->checkVendoredCopy();
            $this->checkDiscovery($panels);
            $this->checkPageFiles();
            $this->checkInertiaLayoutWiring();
            $this->checkAppearancePrepaintWiring();
            $this->checkSharePanelPropsWiring();
            $this->checkPanelLayoutShell();
            $this->checkDevicesSessionDriver();
            $this->checkQueueWorkerTip();
            $this->checkStylesheet();
            $this->checkClientHalf();
            $this->checkSignInRoute();
            $this->checkUserHoldsRoles();
            $this->checkSomebodyCanOpenThePanel();
        }

        $this->checkPluginCompatibility($panels);
        $this->checkPluginPageRegistration($panels);
        $this->checkPluginPerformance($panels);
        $this->checkPluginHealth($panels);
        $this->checkRenderHookCompatibility($panels);

        if ($this->option('json')) {
            $this->line((string) json_encode($this->findings, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
        } else {
            $profile === 'production'
                ? $this->reportProduction()
                : $this->report();
        }

        // NON-ZERO ONLY FOR PROBLEMS. A note is information; failing a build over
        // one would make people stop running this.
        return $this->has('problem') ? self::FAILURE : self::SUCCESS;
    }

    /* ------------------------------------------------------------- checks */

    /**
     * Production operational preset.
     *
     * This is a smaller, operator-facing checklist intended to be run before
     * putting the panel behind real traffic.
     */
    private function checkQueueWorker(): void
    {
        $queue = (string) config('queue.default', 'sync');

        if ($queue === 'sync') {
            $this->problem(
                'Queue worker is disabled because QUEUE_CONNECTION is [sync]',
                'Bulk actions and exports run inline in the web request. Under load this makes timeouts look like successful jobs, because the panel returns a token for work that has already finished inline.',
                'Set QUEUE_CONNECTION=database or QUEUE_CONNECTION=redis, then run a worker with php artisan queue:work.'
            );

            return;
        }

        $this->note(
            "Queue worker is configured for [$queue]",
            'Make sure you run php artisan queue:work (or queue:listen) with a process supervisor so jobs actually execute.',
        );
    }

    private function checkCacheAndSessionDrivers(): void
    {
        $cache = (string) config('cache.default', '');
        $session = (string) config('session.driver', '');

        $badCache = in_array($cache, ['array', 'file'], true);
        $badSession = in_array($session, ['cookie', 'array', 'file'], true);

        if ($badCache) {
            $this->problem(
                "Cache driver is [{$cache}] and is not production safe",
                'A non-shared cache store breaks cross-process caching and can increase load. Use redis or a shared cache.',
                'Set CACHE_DRIVER=redis (or a shared cache), then run php artisan config:cache.'
            );
        }

        if ($badSession) {
            $this->problem(
                "Session driver is [{$session}] and is not production safe",
                'A client-side session store is fragile under multiple web workers and makes some panel controls unreliable.',
                'Set SESSION_DRIVER=database or SESSION_DRIVER=redis, then run php artisan config:cache.'
            );
        }
    }

    private function checkBroadcastDriver(): void
    {
        // Reuse the existing, severe check about misconfigured broadcast drivers.
        $this->checkBroadcasting();
    }

    private function checkStorageLink(): void
    {
        $path = public_path('storage');

        if (is_link($path) || is_dir($path)) {
            return;
        }

        $this->problem(
            'public/storage is missing',
            'Uploaded files and other storage-backed assets cannot be served until the storage symlink exists.',
            'Run php artisan storage:link.'
        );
    }

    private function checkNotificationTable(): void
    {
        $table = (string) config('database.notifications', 'notifications');

        if (Schema::hasTable($table)) {
            return;
        }

        $this->problem(
            "The notifications table [{$table}] is missing",
            'The bell inbox writes and reads from Laravel notifications. Without the table the notification stream fails at runtime.',
            'Run php artisan notifications:table && php artisan migrate.'
        );
    }

    private function checkMailDefaults(): void
    {
        $default = config('mail.default');
        $from = (string) config('mail.from.address', '');

        if (! is_string($default) || $default === '' || ! is_array(config('mail.mailers'))) {
            $this->problem(
                'mail.default is not configured',
                'No default mailer is selected, so queued mail and other emails cannot deliver.',
                'Set MAIL_MAILER and related mailer config in .env, then run php artisan config:cache.'
            );

            return;
        }

        if ($from === '') {
            $this->problem(
                'mail.from.address is empty',
                'Laravel needs a sender address for outbound emails and password resets.',
                'Set MAIL_FROM_ADDRESS in .env, then run php artisan config:cache.'
            );
        }
    }

    private function checkTrustedProxyAndHttps(): void
    {
        $url = (string) config('app.url', '');
        $production = app()->isProduction() || config('app.env') === 'production';

        if (! $production) {
            return;
        }

        if (str_starts_with($url, 'http://')) {
            $this->problem(
                'APP_URL uses http:// in production',
                'When the panel is behind a TLS-terminating proxy, incorrect scheme detection can break secure cookies and redirects.',
                'Set APP_URL=https://..., and ensure your trusted proxy configuration forwards X-Forwarded-Proto. Then run php artisan config:cache.'
            );
        }
    }

    /**
     * Check the secrets and cookie flags that turn a correctly routed panel
     * into a safely deployable one.
     *
     * Laravel's defaults are deliberately friendly to local development:
     * debug output is useful, an unset session secure flag works over HTTP,
     * and a missing key is only noticed when encryption is first used. Those
     * defaults must not silently cross the production boundary.
     */
    private function checkProductionSecurityBaseline(): void
    {
        $key = config('app.key');
        $keyIsValid = false;

        if (is_string($key) && trim($key) !== '') {
            if (str_starts_with($key, 'base64:')) {
                $decoded = base64_decode(substr($key, 7), true);
                $keyIsValid = is_string($decoded) && strlen($decoded) >= 32;
            } else {
                $keyIsValid = in_array(strlen($key), [16, 24, 32], true);
            }
        }

        if (! $keyIsValid) {
            $this->problem(
                'APP_KEY is missing or too weak for production',
                'Laravel encryption protects sessions, signed values, and panel secrets. A missing or short key can make authentication and stored credentials fail or become unrecoverable.',
                'Run php artisan key:generate --show, set APP_KEY in the production environment, and run php artisan config:cache. Never print the key in logs.',
            );
        }

        if ((bool) config('app.debug', false)) {
            $this->problem(
                'Debug mode is on in production',
                'Laravel error pages can expose stack traces, environment details, database names, and other sensitive diagnostics to an unauthenticated visitor.',
                'Set APP_DEBUG=false, then run php artisan config:cache.',
            );
        }

        $secure = config('session.secure');
        $httpOnly = config('session.http_only', true);
        $sameSite = strtolower((string) config('session.same_site', 'lax'));
        $url = (string) config('app.url', '');

        if (filter_var($url, FILTER_VALIDATE_URL) === false || ! str_starts_with($url, 'https://')) {
            return;
        }

        if ($secure !== true) {
            $this->problem(
                'Session cookies are not marked Secure',
                'The panel is configured for HTTPS but the session cookie may still be sent over an insecure connection after a proxy or browser downgrade.',
                'Set SESSION_SECURE_COOKIE=true and make sure trusted proxy headers are configured.',
            );
        }

        if ($httpOnly !== true) {
            $this->problem(
                'Session cookies are not HttpOnly',
                'Browser JavaScript can read the session cookie, increasing the impact of an XSS defect.',
                'Set SESSION_HTTP_ONLY=true.',
            );
        }

        if (! in_array($sameSite, ['lax', 'strict', 'none'], true)) {
            $this->problem(
                'SESSION_SAME_SITE is invalid',
                "The configured SameSite value [{$sameSite}] is not one of lax, strict, or none, so browser cookie behaviour is undefined across deployments.",
                'Set SESSION_SAME_SITE=lax (or strict where cross-site sign-in is not required).',
            );
        } elseif ($sameSite === 'none' && $secure !== true) {
            $this->problem(
                'SameSite=None is configured without Secure cookies',
                'Browsers reject SameSite=None cookies unless Secure is also set, which can silently log every operator out.',
                'Set SESSION_SECURE_COOKIE=true or use SESSION_SAME_SITE=lax.',
            );
        }

        if ((bool) config('session.partitioned', false) && ($sameSite !== 'none' || $secure !== true)) {
            $this->problem(
                'Partitioned cookies are configured with incompatible flags',
                'Partitioned cookies require SameSite=None and Secure. The current combination will be ignored by modern browsers.',
                'Set SESSION_SAME_SITE=none and SESSION_SECURE_COOKIE=true, or disable SESSION_PARTITIONED_COOKIE.',
            );
        }
    }

    private function checkPolicies(PanelManager $panels): void
    {
        foreach ($panels->resources() as $key => $class) {
            if (Gate::getPolicyFor($class::model()) === null) {
                /*
                 * THE TITLE IS OPERATOR COPY, NOT CONSOLE SHORTHAND. It used
                 * to read "[custom-fields] has no policy" - the bracketed
                 * resource key - which is fine in a terminal and jarring as a
                 * dashboard headline, because the SetupChecklist surfaces
                 * these findings verbatim. One register serves both: the
                 * human label up front, the precise key in the detail where
                 * whoever fixes it needs it.
                 */
                $this->problem(
                    "{$class::pluralLabel()} has no policy - nobody can open it until one exists",
                    "The panel denies every ability when no policy is registered, so [{$key}] "
                    .'is invisible to everybody. That is the safe default and it looks exactly like '
                    .'a permissions bug.',
                );
            }
        }
    }

    private function checkBroadcasting(): void
    {
        /*
         * ONLY WHEN THE PANEL ACTUALLY BROADCASTS.
         *
         * This used to fire on the broadcast driver alone, and Laravel ships
         * `log` by default - so a fresh, correctly configured install reported
         * an ERROR about channel authorisation for a panel whose live driver is
         * `poll` and which registers no channel anybody can reach. An installer
         * whose first diagnostic run says "1 problem found" about something that
         * is not a problem teaches people to ignore the output, which costs more
         * than the check is worth.
         *
         * Under `broadcast` the warning is real and severe, which is why it
         * survives: the log and null broadcasters never consult the channel
         * callbacks, so every channel authorises, including for a guest.
         */
        /*
         * THE RESOLVED DRIVER, not the configured one. `auto` never reaches
         * here as a word - it is answered in `LiveConfig` - and reading the raw
         * config would skip this check for an installation that IS broadcasting
         * because it chose `auto` and has a broadcaster.
         */
        /*
         * RESOLVED AS A STRING, NOT BUILT. `fromConfig()` CONSTRUCTS, and the
         * constructor refuses `broadcast` with no channel by throwing - so
         * building one here made doctor crash on exactly the misconfiguration
         * it exists to report. A diagnostic must survive what it diagnoses.
         */
        if (LiveConfig::resolveDriver((string) config('panel.live.driver', 'auto')) !== 'broadcast') {
            return;
        }

        $driver = config('broadcasting.default');

        if ($driver === 'log' || $driver === 'null') {
            $this->problem(
                "Panel live updates are set to broadcast, but the broadcast driver is [{$driver}]",
                'The log and null broadcasters never consult the channel callbacks - every channel '
                .'authorises, including for a guest. A channel written today can be wrong in every '
                .'way and still appear to work all the way to deploy. Nothing is delivered either, '
                .'so every list is silently static.',
            );
        }
    }

    /**
     * "QUEUED" HAS TO MEAN SOMETHING, AND ON `sync` IT DOES NOT.
     *
     * The panel hands its two unbounded jobs - a bulk mutation over a whole
     * filtered set, and an export of it - to the queue precisely so they do
     * NOT run inside a web request. On the `sync` connection `dispatch()` runs
     * the job inline, so the mutation still holds the request open for as long
     * as it takes, and the response then returns a PENDING token pointing at
     * work that has already finished.
     *
     * THAT IS WORSE THAN NO QUEUE AT ALL, because everything reports success.
     * The operator gets a progress token, polls it once, and is told the job
     * is done - which is true. Nothing anywhere says that the five-hundred-
     * thousand-row update ran in the browser's request and was cut off by the
     * web server's timeout at row two hundred thousand, leaving a partial
     * write. The bounded/unbounded split, the queue threshold and the progress
     * tokens are all correct and all inert.
     *
     * A WORKER IS NOT CHECKED FOR, only the connection. Whether anything is
     * consuming the queue is a question about the host, not the configuration,
     * and `panel:doctor` does not have an honest way to answer it - a check
     * that guessed would either cry wolf on a machine where the worker lives
     * elsewhere or stay quiet on one where it does not exist.
     */
    private function checkQueueIsReal(PanelManager $panels): void
    {
        if (config('queue.default') !== 'sync') {
            return;
        }

        /*
         * `sync` IS THE CORRECT SETTING UNDER TEST, so reporting it there is a
         * false alarm rather than a finding.
         *
         * Laravel's own `phpunit.xml` ships `QUEUE_CONNECTION=sync` because a
         * test that queued its work and then asserted the result would assert
         * nothing. The first version of this check did not know that and
         * turned eleven passing "doctor is quiet" tests red - which is exactly
         * the shape of the `checkSomebodyCanOpenThePanel` bug this command has
         * already paid for once: a check that fires on a healthy installation
         * teaches everybody to ignore the command.
         */
        if (app()->environment('testing')) {
            return;
        }

        $withBulk = [];

        foreach ($panels->resources() as $key => $class) {
            if ($class::definition()->getBulkActions() !== []) {
                $withBulk[] = $key;
            }
        }

        if ($withBulk === []) {
            return;
        }

        $this->problem(
            'The queue connection is [sync], so nothing this panel queues is actually queued',
            'Bulk actions on '.implode(', ', array_slice($withBulk, 0, 5))
            .(count($withBulk) > 5 ? ' and '.(count($withBulk) - 5).' more' : '')
            .' run inside the web request on `sync` - including "select all matching", which can be '
            .'the whole table. The response still returns a progress token, so a run that the web '
            .'server timed out halfway through reports as pending and then as done, with a partial '
            .'write and nothing saying so. Set QUEUE_CONNECTION=database or QUEUE_CONNECTION=redis, '
            .'then supervise `php artisan queue:work` (or queue:listen).',
        );
    }

    private function checkSessionLimit(): void
    {
        $limit = (int) config('panel.security.max_sessions', 0);

        if ($limit > 0 && config('session.driver') !== 'database') {
            $this->problem(
                'A session limit is set but the session store cannot support it',
                'panel.security.max_sessions is '.$limit.' and session.driver is ['
                .config('session.driver').']. There is no server-side record of who is signed in, '
                .'so nothing is counted and nothing is ended - the limit is believed and absent. '
                .'Signed-in devices (other browsers / revoke) also need SESSION_DRIVER=database.',
                'Set SESSION_DRIVER=database, migrate the sessions table, then run php artisan config:cache.',
            );
        }
    }

    /**
     * A tenant-tagged cache needs a store that can tag.
     *
     * stancl's `CacheTenancyBootstrapper` prefixes cache keys per tenant using
     * TAGS, and of Laravel's stores only `array` and `redis` support tagging.
     * With `database` or `file` the bootstrapper cannot isolate - so one
     * tenant's memoized count or cached schema can be served to another, which
     * is a cross-tenant leak through a cache rather than a query.
     *
     * The failure is not silent everywhere - a tagged read throws - but it is
     * silent where it matters, because most cache use in the panel is untagged
     * and works fine right up until the tagged path is reached.
     */
    private function checkCacheTagging(): void
    {
        $store = config('cache.default');

        if (in_array($store, ['redis', 'array', 'memcached'], true)) {
            return;
        }

        if (! class_exists('Stancl\\Tenancy\\Tenancy')) {
            return;
        }

        $bootstrappers = (array) config('tenancy.bootstrappers', []);

        if (! in_array('Stancl\\Tenancy\\Bootstrappers\\CacheTenancyBootstrapper', $bootstrappers, true)) {
            return;
        }

        $this->problem(
            'Tenant cache isolation is configured in a way this cache store cannot honour',
            "stancl's CacheTenancyBootstrapper tags cache entries per tenant, and only redis, "
            ."array and memcached support tagging - the [{$store}] store does not, so a tagged "
            .'read throws and the isolation it promises does not happen. Swap it for '
            .'Alxtexh\\Panel\\Tenancy\\PrefixCacheBootstrapper, which isolates by key prefix '
            .'and works on every store - no Redis required.',
        );
    }

    private function checkTenancy(TenantContext $context): void
    {
        $mode = $context->mode();

        if ($mode === TenantContext::MODE_NONE) {
            $this->note('Tenancy is off', 'Every query is unscoped. Correct for a single-tenant install.');

            return;
        }

        if (! DB::getSchemaBuilder()->hasTable('domains')) {
            $this->note(
                'No domains table',
                'Tenants cannot be identified by hostname, so the panel resolves them from the '
                .'signed-in user. Workable, but every tenant then shares one login page.',
            );
        } elseif (DB::table('domains')->count() === 0) {
            $this->note(
                'No tenant has a domain',
                'Hostname resolution is wired but nothing matches, so every request falls back to '
                .'the signed-in user\'s tenant.',
            );
        }

        if (config('session.domain') !== null) {
            $this->problem(
                'SESSION_DOMAIN is set, which shares one cookie across subdomains',
                'With tenants on subdomains this offers one tenant\'s session cookie to every '
                .'other tenant\'s host. Alxtexhpanel stamps the tenant on the session and refuses a '
                .'mismatch, so this is survivable - but it should be deliberate.',
            );
        }
    }

    /**
     * The index shape that is right in one tenancy mode and useless in the other.
     *
     * Only meaningful inside a DEDICATED database, and only checkable there, so
     * it reports what it looked at rather than silently finding nothing.
     */
    private function checkIndexes(TenantContext $context): void
    {
        if ($context->shouldScopeByColumn()) {
            return;
        }

        /*
         * SINGLE-TENANT INSTALLS HAVE NO TENANT COLUMN TO LEAD WITH, and this
         * check used to fire at them anyway - `shouldScopeByColumn()` is false
         * for `database` mode AND for `none`, and only the first of those is a
         * dedicated database.
         *
         * The result was a fresh, correctly configured single-tenant install
         * reporting an ERROR about "a dedicated database" it does not have, and
         * prescribing `panel:reindex-tenant`, which would do nothing. That is
         * the exact failure this command exists to prevent, produced by this
         * command - and it is the first thing anybody runs after installing.
         *
         * The package's own migrations carry the index, because they are written
         * for the shared-database default. Leaving it in place costs a
         * single-tenant install nothing; it is unused, not wrong.
         */
        if ($context->mode() === 'none') {
            return;
        }

        if (DB::connection()->getDriverName() !== 'sqlite') {
            return;
        }

        $column = $context->column();
        $suspect = [];

        foreach (DB::select("select name from sqlite_master where type = 'table' and name not like 'sqlite_%'") as $table) {
            foreach (DB::select('pragma index_list("'.$table->name.'")') as $index) {
                if (str_starts_with($index->name, 'sqlite_autoindex')) {
                    continue;
                }

                $columns = array_map(
                    static fn (object $r): string => $r->name,
                    DB::select('pragma index_info("'.$index->name.'")'),
                );

                if (($columns[0] ?? null) === $column && count($columns) > 1) {
                    $suspect[] = $index->name;
                }
            }
        }

        if ($suspect !== []) {
            $this->problem(
                count($suspect).' index(es) lead with ['.$column.'] in a dedicated database',
                'The panel omits the tenant predicate here, and an index cannot serve an ORDER BY '
                .'when its leading column is unconstrained - so these indexes are unusable and '
                .'every list falls back to a full scan. Run panel:reindex-tenant.',
            );
        }
    }

    /**
     * Large searchable tables without a confirmed search index plan.
     *
     * Search uses `%term%` per keystroke. That is fine under ~10k rows and the
     * first thing to fall over at millions. `panel:search-index` prints the
     * trigram / FULLTEXT DDL; this note only fires when approximate row counts
     * say the tables are big enough to care. SQLite is skipped: FTS5 needs a
     * shadow table, which is a schema decision the command will not make.
     */
    private function checkSearchIndexes(PanelManager $panels): void
    {
        $driver = DB::connection()->getDriverName();

        if (! in_array($driver, ['pgsql', 'mysql', 'mariadb'], true)) {
            return;
        }

        $threshold = (int) config('panel.search.index_nudge_rows', 10_000);
        $large = [];

        foreach ($panels->resources() as $class) {
            try {
                $searchable = $class::definition()->searchableColumns();
            } catch (Throwable) {
                continue;
            }

            if ($searchable === []) {
                continue;
            }

            try {
                $table = (new ($class::model()))->getTable();
            } catch (Throwable) {
                continue;
            }

            $count = $this->approximateRowCount($table, $driver);

            if ($count !== null && $count >= $threshold) {
                $large[$table] = max($large[$table] ?? 0, $count);
            }
        }

        if ($large === []) {
            return;
        }

        arsort($large);
        $names = array_keys($large);
        $top = number_format((int) reset($large));

        $this->note(
            'Large searchable tables may need panel:search-index',
            count($names).' table(s) declare searchable columns and look large '
            .'(about '.$top.'+ rows on '.$names[0]
            .(count($names) > 1 ? ', plus '.implode(', ', array_slice($names, 1)) : '')
            .'). Run `php artisan panel:search-index` to print trigram (Postgres) or '
            .'FULLTEXT (MySQL) DDL, review which tables are actually big, then apply '
            .'in a quiet hour. Use `--apply` only on a laptop or staging. An index '
            .'nobody needed is write cost and disk for nothing.',
        );
    }

    /**
     * Cheap planner estimate, not an exact COUNT(*).
     *
     * Doctor must stay fast on large installs. Postgres `reltuples` and MySQL
     * `TABLE_ROWS` are approximate and good enough for a nudge threshold.
     */
    private function approximateRowCount(string $table, string $driver): ?int
    {
        try {
            if ($driver === 'pgsql') {
                $row = DB::selectOne(
                    'select coalesce(reltuples::bigint, 0) as estimate
                     from pg_class
                     where relkind = \'r\' and relname = ?',
                    [$table],
                );

                return $row !== null ? max(0, (int) $row->estimate) : null;
            }

            $row = DB::selectOne(
                'select table_rows as estimate
                 from information_schema.tables
                 where table_schema = database() and table_name = ?',
                [$table],
            );

            return $row !== null && $row->estimate !== null
                ? max(0, (int) $row->estimate)
                : null;
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Retrieval that is configured but cannot work.
     *
     * THE FAILURE IS ENTIRELY SILENT, which is the only reason it is worth a
     * check. A vector column sized for one embedder and rows written by another
     * do not error - `KnowledgeBase` refuses to compare vectors of different
     * lengths and scores them zero, so every search returns nothing, forever,
     * and the assistant simply says it has no documentation. Nothing in a log,
     * nothing on a screen, and the feature looks like it was never turned on.
     */
    /**
     * Templates still writing a variable the document no longer has.
     *
     * THE FAILURE THIS CATCHES IS SILENT AND PRINTED. A kind renames `@expiry`
     * to `@expires`; every stored template that used the old token keeps
     * rendering, because an unknown token is left alone rather than blanked. So
     * the voucher comes off the printer reading "Valid until @expiry" - correct
     * everywhere in the panel, wrong on the paper, and discovered by a customer.
     *
     * IT READS EVERY TENANT'S TEMPLATES, which is why the scope is removed
     * explicitly rather than by accident. This is an operator command run from a
     * console with no tenant resolved, and the scope would otherwise deny every
     * row and report a clean bill of health for an installation full of broken
     * templates - the worst possible answer.
     */
    private function checkDocumentTemplates(): void
    {
        if (! class_exists(Documents\DocumentTemplate::class) || ! class_exists(Documents\DocumentKinds::class)) {
            return;
        }

        if (! Schema::hasTable('panel_document_templates')) {
            // The migration has not run. That is a fresh install, not a fault.
            return;
        }

        $kinds = app(Documents\DocumentKinds::class);

        $templates = Documents\DocumentTemplate::query()
            ->withoutGlobalScope('tenant')
            ->get(['id', 'tenant_id', 'kind', 'settings']);

        foreach ($templates as $template) {
            if (! $kinds->has((string) $template->kind)) {
                $this->problem(
                    "A stored template is for the unregistered kind [{$template->kind}]",
                    'Nothing can render it, so whatever used to print this document now prints '
                    .'nothing. Either the plugin that registered the kind was removed, or its '
                    .'service provider is no longer running.',
                );

                continue;
            }

            $known = array_keys($kinds->get((string) $template->kind)->variables());
            $used = [];

            foreach ((array) $template->settings as $value) {
                if (is_string($value)) {
                    preg_match_all('/@[a-z_][a-z0-9_]*/i', $value, $matches);
                    $used = [...$used, ...$matches[0]];
                }
            }

            $unknown = array_values(array_unique(array_diff($used, $known)));

            if ($unknown !== []) {
                $this->problem(
                    sprintf(
                        'The %s template (tenant %s) uses %s, which %s not exist',
                        $template->kind,
                        (string) $template->tenant_id,
                        implode(', ', $unknown),
                        count($unknown) === 1 ? 'does' : 'do',
                    ),
                    'An unknown variable is printed as written rather than blanked, so the '
                    .'document reads "@expiry" where a date belongs. Known variables for this '
                    .'kind: '.(implode(', ', $known) ?: 'none').'.',
                );
            }
        }
    }

    /**
     * The same guard as `checkDocumentTemplates()`, for the other caller
     * `Field::chips()` was generalised for. `Announcement::variables()` is the
     * one declaration all three of the chip strip, the substitution and this
     * check read from - an announcement referencing a token that declaration
     * does not name is exactly as silent in production as an unknown
     * document variable, and for the same reason: `strtr()` and this regex
     * scan both leave an unrecognised token printed as written.
     */
    private function checkAnnouncementVariables(): void
    {
        if (! Schema::hasTable('panel_announcements')) {
            // The migration has not run. That is a fresh install, not a fault.
            return;
        }

        $known = array_keys(Alerts\Announcement::variables());

        $announcements = Alerts\Announcement::query()
            ->withoutGlobalScope('tenant')
            ->get(['id', 'tenant_id', 'body']);

        foreach ($announcements as $announcement) {
            if (! is_string($announcement->body)) {
                continue;
            }

            preg_match_all('/@[a-z_][a-z0-9_]*/i', $announcement->body, $matches);

            $unknown = array_values(array_unique(array_diff($matches[0], $known)));

            if ($unknown !== []) {
                $this->problem(
                    sprintf(
                        'An announcement (tenant %s) uses %s, which %s not exist',
                        (string) $announcement->tenant_id,
                        implode(', ', $unknown),
                        count($unknown) === 1 ? 'does' : 'do',
                    ),
                    'An unknown variable is printed as written rather than substituted, so the '
                    .'banner reads "@user" literally instead of a name. Known variables: '
                    .(implode(', ', $known) ?: 'none').'.',
                );
            }
        }
    }

    private function checkKnowledge(): void
    {
        if ((array) config('panel.knowledge.sources', []) === []) {
            // Nothing configured is not a fault. An installation that has not
            // set retrieval up has not done anything wrong.
            return;
        }

        try {
            $embedder = app(Knowledge\Embedder::class);
        } catch (Throwable $e) {
            $this->problem(
                'The configured embedder cannot be constructed',
                'panel.knowledge.embedder is set to something the container cannot build ('
                .$e->getMessage().'), so every index and every search will throw.',
            );

            return;
        }

        /*
         * WHAT IS STORED versus WHAT WOULD BE ASKED. This compares the length of
         * a passage already in the table against the current embedder, because
         * that is the pair that actually has to match - config only matters
         * where it sized a column.
         *
         * A CHANGED MODEL IS THE CASE THIS CATCHES, and it is the one nobody
         * notices: the rows are all still there, `panel:knowledge status` reports
         * thousands of passages, and every single search returns nothing.
         */
        $stored = $this->storedVectorLength();

        if ($stored !== null && $stored !== $embedder->dimensions()) {
            $this->problem(
                sprintf(
                    'Stored passages are %d-dimensional but the embedder produces %d',
                    $stored,
                    $embedder->dimensions(),
                ),
                'Vectors of different lengths are never compared, so every search returns nothing '
                .'while the passages sit there looking indexed. The embedder or its model changed; '
                .'re-run panel:knowledge index --fresh.',
            );
        }

        if (DB::connection()->getDriverName() === 'pgsql' && ! $this->hasVectorColumn()) {
            $this->note(
                'PostgreSQL is in use but the pgvector column is missing',
                'Retrieval still works - the candidates are read and scored in PHP, capped at '
                .config('panel.knowledge.scan_limit', 5000).' passages - but the database could be '
                .'doing it against an index. Install the vector extension and re-run the migration.',
            );
        }
    }

    /**
     * How long the vectors already in the table are, or null if there are none.
     *
     * ONE ROW, AND ONLY ITS LENGTH. No content is read and nothing is scoped to
     * a tenant, because nothing here looks at what a passage says - `count()` of
     * a decoded array is the entire measurement.
     */
    private function storedVectorLength(): ?int
    {
        try {
            $embedding = DB::table('panel_knowledge_chunks')->value('embedding');
        } catch (Throwable) {
            // The migration has not run. Not a fault - retrieval is simply not
            // in use yet, and the indexer would create nothing to compare.
            return null;
        }

        if ($embedding === null) {
            return null;
        }

        $vector = json_decode((string) $embedding, true);

        return is_array($vector) && $vector !== [] ? count($vector) : null;
    }

    private function hasVectorColumn(): bool
    {
        try {
            return DB::selectOne(
                "SELECT 1 AS ok FROM information_schema.columns
                 WHERE table_name = 'panel_knowledge_chunks' AND column_name = 'embedding_vector'",
            ) !== null;
        } catch (Throwable) {
            return false;
        }
    }

    /**
     * TEMPLATES AN OPERATOR CHOSE THE COLOURS FOR - roadmap 7.3.
     *
     * THE CHECKS ABOVE THIS ONE ARE ABOUT WHAT DEVELOPERS CONFIGURE; this is
     * the first about what OPERATORS configure, and that is the whole point
     * of the item. A missing policy is caught in review by somebody who reads
     * code. A pale yellow accent chosen in a colour picker at 5pm is caught
     * by a customer who cannot read their invoice.
     *
     * A NOTE RATHER THAN A PROBLEM, deliberately. The document still renders
     * and the panel still works; what is wrong is that some people cannot
     * read it. Failing a deploy over a colour would teach people to stop
     * running this, and `panel:doctor` is only useful while it is run.
     *
     * The designer already warns at the moment of choosing (roadmap 7.1) and
     * offers a one-click fix; this catches the templates saved before that
     * existed, and the ones somebody dismissed the warning on.
     */
    private function checkTemplateContrast(): void
    {
        if (! class_exists(Documents\DocumentTemplate::class)) {
            return;
        }

        if (! Schema::hasTable('panel_document_templates')) {
            return;
        }

        $templates = Documents\DocumentTemplate::query()
            ->withoutGlobalScope('tenant')
            ->get(['id', 'tenant_id', 'kind', 'settings']);

        foreach ($templates as $template) {
            $accent = (string) (((array) $template->settings)['accent'] ?? '');

            if ($accent === '' || ! Contrast::isHex($accent)) {
                continue;
            }

            /*
             * AGAINST WHITE, because that is what a document is printed on -
             * not against the panel's background, which is a screen colour and
             * changes with the theme. The paper does not have a dark mode.
             */
            if (! Contrast::meets($accent, '#ffffff')) {
                $this->note(
                    sprintf(
                        'The %s template (tenant %s) uses %s, which is hard to read on paper',
                        $template->kind,
                        (string) $template->tenant_id,
                        $accent,
                    ),
                    sprintf(
                        'Against white it measures %.1f:1, below the 4.5:1 that normal text needs. '
                        .'It renders - it is simply faint for anybody with less than perfect sight, '
                        .'and worse once printed. The designer offers a darker shade of the same '
                        .'hue in one click.',
                        Contrast::ratio($accent, '#ffffff'),
                    ),
                );
            }
        }
    }

    /**
     * A DESTINATION NOBODY HAS WRITTEN TO - roadmap 7.3.
     *
     * `backup:monitor` already reports this DAILY, at nine, through the
     * Telegram channel. This is the same fact asked at a different moment:
     * whenever anybody runs doctor, and on the dashboard checklist, which is
     * where somebody who has just inherited an installation looks.
     *
     * THE FAILURE IT CATCHES is the one with no symptom. A destination full of
     * snapshots from March looks exactly like a healthy one until somebody
     * reads the dates - and the day they read the dates is the day they needed
     * a restore. See `BackupStatus`, which is the one place age is computed.
     *
     * NOT CONFIGURED IS NOT A FAULT. An installation that has deliberately not
     * set backups up is a choice; a configured destination that stopped
     * receiving them is a broken promise, and only the second is reported.
     */
    private function checkBackupFreshness(): void
    {
        $summary = app(BackupStatus::class)->summary();

        if ($summary['configured'] !== true) {
            return;
        }

        /*
         * NEVER BACKED UP IS NOT THE SAME AS STOPPED BACKING UP.
         *
         * A destination with nothing in it is an installation that has not run
         * its first backup - which is the setup checklist's business, and it
         * says so there. Reporting it here would fail the deploy of every
         * brand-new installation on its first day, teaching whoever set it up
         * that this command cries wolf. What is worth failing a deploy over is
         * a destination that USED to receive backups and no longer does.
         */
        if ($summary['backups'] === []) {
            return;
        }

        if ($summary['healthy'] === false || $summary['problem'] !== null) {
            $this->problem(
                'The backup destination has nothing recent in it',
                ($summary['problem'] ?? sprintf(
                    'The newest backup is %.0f hours old.',
                    (float) ($summary['ageHours'] ?? 0),
                )).' A destination full of old snapshots looks identical to a healthy one until '
                .'somebody reads the dates, and that is always the day they needed a restore. '
                .'Check the scheduler is running and that backup:run is not failing.',
            );
        }
    }

    /**
     * A HOT FILE POINTING AT A DEV SERVER THAT IS NOT THERE.
     *
     * THIS ONE COSTS AN AFTERNOON AND PRESENTS AS NOTHING AT ALL. When
     * `public/hot` exists, every asset URL in the page points at the Vite dev
     * server instead of the built manifest. If that server has stopped - or
     * has stopped being able to serve one component, which is the same thing
     * from the browser's side - the page loads, returns 200, contains a
     * complete Inertia payload, and renders a white rectangle. Nothing is
     * logged. `panel:doctor` said "nothing silently wrong" while the panel
     * showed nothing at all, which is exactly the gap this command exists to
     * close.
     *
     * A PROBLEM RATHER THAN A NOTE, because a blank panel is not a degraded
     * panel. The fix is one of two commands and the message says both.
     *
     * IT IS SKIPPED WHEN THERE IS NO HOT FILE, which is every production
     * installation - `npm run build` does not write one and `php artisan
     * serve` does not either. This can only fire where somebody ran the dev
     * server, which is the only place it is a problem.
     */
    private function checkViteDevServer(): void
    {
        $hot = public_path('hot');

        if (! is_file($hot)) {
            return;
        }

        $url = trim((string) file_get_contents($hot));

        $parts = parse_url($url);
        $host = $parts['host'] ?? '127.0.0.1';
        /*
         * PARENTHESISED DELIBERATELY. Written without them, `??` binds tighter
         * than `?:` and the expression becomes
         * `($parts['port'] ?? (scheme === 'https')) ? 443 : 80` - the actual
         * port is never read, the check dials 80 or 443, and it reports a dead
         * dev server on every installation that has a live one. It did exactly
         * that on the first run.
         */
        $port = (int) ($parts['port'] ?? (($parts['scheme'] ?? 'http') === 'https' ? 443 : 80));

        /*
         * A CONNECT, NOT A REQUEST. Whether Vite can COMPILE a given module is
         * not knowable from here and changes per file; whether anything is
         * listening at all is the question that separates "the dev server
         * stopped" from "the dev server is fine". One second is generous for
         * a loopback connection and short enough that a doctor run does not
         * hang on a firewall.
         */
        $socket = @fsockopen($host, $port, $code, $message, 1.0);

        if ($socket !== false) {
            fclose($socket);

            return;
        }

        $this->problem(
            'The panel is pointed at a Vite dev server that is not running',
            "public/hot says assets come from {$url}, and nothing is listening there. Every page "
            .'will load, return 200 with a complete payload, and render blank - no error, nothing '
            .'in the log. Either start the dev server with `npm run dev`, or delete public/hot. '
            .'The default path is public/vendor/panel kit CSS/JS; `npm run build` is only for a Vite customisation.',
        );
    }

    /**
     * A RESOURCE OR PAGE ON DISK THAT NOTHING REGISTERED.
     *
     * Reported from a real port twice, an hour lost each time: `panel.discover`
     * pointed one directory too high, so discovery globbed a tree whose
     * namespaces did not match and registered nothing without saying so; and
     * `discover_pages` was absent from a published config entirely.
     *
     * BOTH LOOK LIKE A 404 ON A SCREEN YOU JUST WROTE - indistinguishable from
     * code you have not finished, so the reasonable next move is to go and read
     * the code, which is not where the fault is.
     *
     * A PROBLEM, NOT A NOTE. A class written and unreachable is not a
     * preference, and unlike most of what is checked here the person affected
     * is actively looking for it.
     */
    private function checkDiscovery(PanelManager $panels): void
    {
        $orphans = [
            'resource' => Discovery::unregistered(
                app_path(),
                app()->getNamespace(),
                Resource::class,
                array_values($panels->resources()),
            ),
            'page' => Discovery::unregistered(
                app_path(),
                app()->getNamespace(),
                Page::class,
                array_values($panels->pages()),
            ),
        ];

        foreach ($orphans as $kind => $classes) {
            if ($classes === []) {
                continue;
            }

            $key = $kind === 'page' ? 'panel.discover_pages' : 'panel.discover';

            $this->problem(
                count($classes)." {$kind}(s) exist and are registered nowhere",
                implode(', ', $classes).' - so nothing routes them and every URL they '
                .'should serve is a 404 that looks like unwritten code. Check '.$key.': the '
                .'directory must be the one the class is IN, and the namespace must be the one '
                .'the file declares. A mismatch registers nothing and reports nothing.',
            );
        }
    }

    /**
     * A PACKAGED SCREEN WITH NO FILE IN `resources/js/pages`.
     *
     * Inertia resolves a page by globbing that directory, so a screen living in
     * `node_modules` cannot be found however correctly it is routed. An upgrade
     * that adds one therefore ships a route that answers, a component that
     * cannot be resolved, and a BLANK PAGE UNDER A WORKING HEADER - no server
     * error, nothing in the log.
     *
     * `panel:update` writes these. This check is for the installation that ran
     * `composer update` and did not, which is the only way to arrive here.
     */
    private function checkPageFiles(): void
    {
        $missing = PanelPages::missing();

        if ($missing === []) {
            return;
        }

        $this->problem(
            count($missing).' packaged screen(s) have no page file',
            implode(', ', $missing).' - the routes answer and Inertia cannot resolve the '
            .'components, so those screens render blank rather than failing. Run '
            .'`php artisan panel:update` to write them, then rebuild.',
        );
    }

    private function checkInertiaLayoutWiring(): void
    {
        $path = resource_path('js/app.ts');

        if (! is_file($path)) {
            return;
        }

        foreach (InertiaLayoutWiring::inspect((string) file_get_contents($path)) as $finding) {
            if ($finding['level'] === 'note') {
                $this->note($finding['title'], $finding['detail']);

                continue;
            }

            $this->problem(
                $finding['title'],
                $finding['detail'],
                $finding['suggested'] ?? null,
            );
        }
    }

    private function checkAppearancePrepaintWiring(): void
    {
        $path = resource_path('views/app.blade.php');

        if (! is_file($path)) {
            return;
        }

        foreach (AppearancePrepaintWiring::inspect((string) file_get_contents($path)) as $finding) {
            $this->problem(
                $finding['title'],
                $finding['detail'],
                $finding['suggested'] ?? null,
            );
        }
    }

    /**
     * Security "devices" needs a listable session store.
     *
     * THE CURRENT DEVICE ALWAYS SHOWS. Other browsers and revoke need
     * SESSION_DRIVER=database and the sessions table. Redis is fine for
     * multi-worker auth cookies, but it is not a roster you can enumerate.
     */
    private function checkDevicesSessionDriver(): void
    {
        if (app()->environment('testing')) {
            return;
        }

        $driver = (string) config('session.driver', '');

        if ($driver === 'database') {
            return;
        }

        $this->note(
            'Signed-in devices list other browsers only with SESSION_DRIVER=database',
            "session.driver is [{$driver}]. Security still shows the current device. "
            .'Other devices and revoke need SESSION_DRIVER=database and a sessions table. '
            .'Redis stores sessions but is not a listable roster.',
        );
    }

    /**
     * Cheap tip when a real queue is configured but nothing says to run a worker.
     */
    private function checkQueueWorkerTip(): void
    {
        if (app()->environment('testing')) {
            return;
        }

        $queue = (string) config('queue.default', 'sync');

        if ($queue === 'sync') {
            return;
        }

        $this->note(
            "Queue connection is [{$queue}]; run a worker",
            'Bulk actions, exports, and digests land on that connection. '
            .'Supervise `php artisan queue:work` (or queue:listen) or jobs sit forever.',
        );
    }

    /**
     * SharePanelProps on the web group, in the file install writes.
     *
     * THE PACKAGE ALSO REGISTERS THIS AT BOOT, so deleting the line from
     * bootstrap/app.php does not always drop the shell today. Doctor still
     * names it: that file is what a person or agent sees, and the next edit
     * that "cleans unused middleware" is how the wiring disappears for real.
     */
    private function checkSharePanelPropsWiring(): void
    {
        $files = array_values(array_filter([
            base_path('bootstrap/app.php'),
            base_path('app/Http/Kernel.php'),
        ], 'is_file'));

        if ($files === []) {
            return;
        }

        foreach ($files as $file) {
            if (WebSharePanelProps::present((string) file_get_contents($file))) {
                return;
            }
        }

        $this->problem(
            'SharePanelProps is not in bootstrap/app.php',
            'panel:install puts SharePanelProps on the web middleware group so app-owned '
            .'routes keep the account menu, footer and padlock. Restore the class even if '
            .'the package also registers it at boot: the file is what the next edit reads.',
            'Keep `SharePanelProps::class` in the web append list in bootstrap/app.php',
        );
    }

    /**
     * PanelLayout.vue must still mount PanelShell.
     *
     * Replacing the published wrapper with a hand-rolled chrome is the other
     * way to ship a 200 with no sidebar. Auth screens use AuthLayout on purpose
     * and are not this file.
     */
    private function checkPanelLayoutShell(): void
    {
        $path = resource_path('js/layouts/PanelLayout.vue');

        if (! is_file($path)) {
            return;
        }

        if (PanelLayoutShell::usesPanelShell((string) file_get_contents($path))) {
            return;
        }

        $this->problem(
            'PanelLayout.vue no longer uses PanelShell',
            'The published layout is a thin wrapper around PanelShell. Dropping that '
            .'import leaves every panel page without sidebar, navbar and footer while '
            .'routes still return 200.',
            'Restore `import { PanelShell } from \'@alxtexh-enterprise/panel/inertia\'` and wrap the slot.',
        );
    }

    /**
     * A STYLESHEET THAT DOES NOT REACH THE PACKAGED COMPONENTS.
     *
     * THE MOST EXPENSIVE SILENT FAILURE THIS PACKAGE HAS SHIPPED, and it looked
     * exactly like the feature never existing. Tailwind 4 scans the project for
     * class names and deliberately does not scan `node_modules`, so without the
     * two `@source` lines every utility used ONLY inside the packaged components
     * is purged. Nothing errors. Every route answers 200. The screens render
     * with correct markup and no styling at all - dark text on a dark
     * background, no card, no spacing - which reads as "the design does not come
     * with the package".
     *
     * IT WENT UNNOTICED BECAUSE THE INSTALLER REFUSED TO OVERWRITE. A stock
     * Laravel application always ships `resources/css/app.css`, so the stub was
     * skipped on every first install and the skip was reported as one line among
     * several. `panel:install` merges now; this is the check that says so when
     * somebody's stylesheet was written before that, or by hand.
     *
     * A PROBLEM RATHER THAN A NOTE, because an unstyled panel is not usable and
     * the person looking at it has no way to tell this from a broken build.
     */
    /**
     * The user model can hold a role, or the panel denies everything.
     *
     * THE QUIETEST FAILURE THIS PACKAGE HAS. The permission tables migrate,
     * `panel:permissions sync` creates every ability and an Administrator role
     * that holds them all, and each of those steps reports success. But a stock
     * `laravel/laravel` `User` has no `HasRoles`, so it has no `assignRole()`
     * and no `hasPermission()`: the role exists and nobody can hold it, and
     * every screen refuses the person who owns the installation. Nothing throws.
     * Nothing logs. There is a panel that says no.
     *
     * `panel:install` ADDS THE TRAIT NOW, so this is for an installation that
     * predates that, or one whose model was replaced since.
     */
    private function checkUserHoldsRoles(): void
    {
        $model = (string) config('auth.providers.users.model', 'App\\Models\\User');

        if (! class_exists($model)) {
            return;
        }

        /*
         * `assignRole()` IS THE REQUIREMENT, and `hasPermission()` is not.
         *
         * The first version of this asked for both and failed a model that was
         * correctly wired: `hasPermission()` is the reference application's own
         * convenience wrapper, not part of Spatie's trait. `Ability::held()`
         * treats it as optional and falls back to `can()`, which reaches Spatie
         * through its `Gate::before` hook. What actually cannot be worked around
         * is a model that cannot be GRANTED a role in the first place.
         */
        if (method_exists($model, 'assignRole')) {
            return;
        }

        $this->problem(
            "{$model} cannot hold a role, so the panel denies everything",
            'Add `use Spatie\\Permission\\Traits\\HasRoles;` to the model and `use HasRoles;` '
            .'inside the class. Until then `panel:permissions sync` creates abilities nobody can '
            .'be granted, and every resource, page and action refuses every operator - including '
            .'whoever owns the installation. `panel:install` does this for you on a fresh app.',
        );
    }

    /**
     * Accounts exist and not one of them holds a role.
     *
     * A PANEL WHERE EVERY SCREEN ANSWERS 403, including the roles screen that
     * would fix it. `panel:permissions sync` creates an Administrator holding
     * every ability and assigns it to NOBODY - correct, because the package has
     * no business choosing who runs your installation - and `panel:make-user`
     * grants it only to an account it creates itself. Register through the
     * sign-in screen first, or install before creating an account, and the
     * result is a locked panel with nothing anywhere saying why.
     *
     * NOT A PROBLEM WHEN THERE ARE NO ACCOUNTS AT ALL. That is a fresh
     * installation waiting for `panel:make-user`, which grants as it creates.
     * Reporting it then would be noise on every first run.
     */
    private function checkSomebodyCanOpenThePanel(): void
    {
        $model = (string) config('auth.providers.users.model', 'App\\Models\\User');

        if (! class_exists($model) || ! method_exists($model, 'roles')) {
            return;
        }

        try {
            $accounts = $model::query()->count();

            if ($accounts === 0) {
                return;
            }

            /*
             * THE PIVOT IS COUNTED DIRECTLY, NOT THROUGH THE RELATION.
             *
             * `whereHas('roles')` goes through Spatie's team scoping, and a
             * console run resolves no team - so the relation was constrained to
             * a null team and counted zero on installations where the pivot
             * plainly held rows. This check reported "nobody can open the
             * panel" seconds after somebody had signed in: a false alarm from
             * the one check that exists to catch silent lockout, which teaches
             * people to ignore the doctor entirely.
             *
             * The question is "does ANY account hold ANY role, in any team or
             * none", and the pivot table answers it without an opinion about
             * which team the CLI happens not to be standing in. Joined back to
             * the accounts table so a row orphaned by a deleted user cannot
             * vouch for a panel nobody can actually open.
             */
            $pivot = (string) config('permission.table_names.model_has_roles', 'model_has_roles');
            $morphKey = (string) config('permission.column_names.model_morph_key', 'model_id');
            $instance = new $model;

            $withRole = DB::table($pivot)
                ->where('model_type', $instance->getMorphClass())
                ->whereIn($morphKey, $model::query()->select($instance->getKeyName()))
                ->count();
        } catch (Throwable) {
            // No users table yet, or a model that cannot be queried here. The
            // migration checks report that; this one has nothing to add.
            return;
        }

        if ($withRole > 0) {
            return;
        }

        $this->problem(
            "{$accounts} account(s) exist and none holds a role, so nobody can open the panel",
            'Every screen answers 403 for every one of them - including the roles screen, which '
            .'is the one that would grant it. Promote somebody: `php artisan panel:permissions '
            .'grant --email=you@example.com`.',
        );
    }

    private function checkStylesheet(): void
    {
        if (! KitAssets::hostViteManifestExists() && is_file(KitAssets::publicPath('app.css'))) {
            return;
        }

        $path = resource_path('css/app.css');

        if (! file_exists($path)) {
            $this->problem(
                'No resources/css/app.css',
                'The packaged screens have no stylesheet at all. Run `php artisan panel:install`.',
            );

            return;
        }

        $css = (string) file_get_contents($path);

        /*
         * THE PACKAGE NAME IS THE MARKER, not the exact `@source` line. An
         * application may glob both packages in one directive, point at a
         * pnpm store, or use a path outside `node_modules` in a monorepo - all
         * of which are correct and none of which match a literal.
         */
        if (! str_contains($css, '@alxtexh-enterprise/panel') && ! str_contains($css, 'packages/ui')) {
            $this->problem(
                'resources/css/app.css does not point Tailwind at the packaged components',
                'Tailwind does not scan node_modules, so every utility used only inside '
                .'@alxtexh-enterprise/panel and @alxtexh-enterprise/panel/inertia is purged and the panel renders unstyled. '
                .'Add: @source \'../../node_modules/@alxtexh-enterprise/panel/dist/**/*.js\'; and '
                .'same for @alxtexh-enterprise/panel/inertia - or re-run `php artisan panel:install`, which '
                .'merges them in.',
            );

            return;
        }

        /*
         * THE TOKENS ARE THE OTHER HALF. The utilities can be generated and the
         * panel still be unreadable if `--background` and friends are undefined,
         * because `bg-background` then resolves to nothing.
         */
        if (! str_contains($css, '--background')) {
            $this->problem(
                'resources/css/app.css defines no design tokens',
                'The packaged components ask for `bg-background`, `text-muted-foreground` and '
                .'`border-border`. Without `--background` and the rest those resolve to nothing '
                .'and the panel renders unreadable. Re-run `php artisan panel:install`.',
            );

            return;
        }

        foreach (SemanticStatusTokens::inspect($css) as $finding) {
            if ($finding['level'] === 'problem') {
                $this->problem(
                    $finding['title'],
                    $finding['detail'],
                    $finding['suggested'] ?? null,
                );
            }
        }

        foreach (CriticalStylesheetBlocks::inspect($css) as $finding) {
            if ($finding['level'] === 'problem') {
                $this->problem(
                    $finding['title'],
                    $finding['detail'],
                    $finding['suggested'] ?? null,
                );
            }
        }

        foreach (ThemeChromeTokens::inspect($css) as $finding) {
            if ($finding['level'] === 'problem') {
                $this->problem(
                    $finding['title'],
                    $finding['detail'],
                    $finding['suggested'] ?? null,
                );
            }
        }
    }

    /**
     * CSS/JS that the first visit actually loads.
     *
     * DEFAULT PATH: published kit at public/vendor/panel (or the package
     * dist/kit copy that panel:install publishes). No npm. A missing
     * node_modules is not a white page on that path.
     *
     * VITE PATH: public/build/manifest.json exists, so the root view uses
     *
     * @vite and then node_modules/@alxtexh-enterprise/panel must exist.
     */
    private function checkClientHalf(): void
    {
        if (KitAssets::hostViteManifestExists()) {
            $installed = base_path('node_modules/@alxtexh-enterprise/panel/package.json');

            if (! is_file($installed)) {
                $this->problem(
                    'Vite is in use but the client half is not in node_modules',
                    'public/build/manifest.json exists, so the root view loads @vite. '
                    .'Run npm install (resolves the file: dependency from the Composer package) '
                    .'and npm run build. Do not install @alxtexh-enterprise/panel from the npm registry.',
                );
            }

            return;
        }

        if (is_file(KitAssets::publicPath('app.js')) && is_file(KitAssets::publicPath('app.css'))) {
            return;
        }

        if (KitAssets::kitBundleExists()) {
            return;
        }

        $this->problem(
            'kit CSS/JS is missing and Vite has not been built - first visit will be a white page',
            'Re-run php artisan panel:install to publish public/vendor/panel. '
            .'Or run npm install && npm run build only if you customise Vue (file: dependency, not npm registry).',
        );
    }

    /**
     * A PANEL BEHIND `auth` WITH NOWHERE TO SEND A GUEST.
     *
     * FOUND BY INSTALLING INTO A STOCK LARAVEL APPLICATION AND OPENING IT.
     * `laravel/laravel` ships no auth scaffolding, so it has no `login` route;
     * Laravel's `Authenticate` middleware redirects an unauthenticated request
     * to `route('login')`; and the result is that EVERY PANEL URL RETURNS 500
     * with `Route [login] not defined` - a message that names neither Alxtexhpanel
     * nor the thing to do about it.
     *
     * Doctor passed that installation. It reported no problems on a panel where
     * nothing at all could be opened, which is the exact failure this command
     * exists to catch: correct-looking configuration, total breakage, no error
     * that points anywhere useful.
     *
     * `panel:install --auth` writes those routes. So does an application's own
     * starter kit, or Fortify, or anything that names a route `login` - which
     * is why this looks for a ROUTE rather than for the flag having been used.
     * A panel whose guest redirect resolves is fine however it got that way.
     */
    private function checkSignInRoute(): void
    {
        $router = app('router');

        foreach (app(PanelManager::class)->panels() as $panel) {
            /*
             * THE PANEL'S OWN FIRST, then the application's. This is the order
             * SocialLoginController resolves in, and two places disagreeing
             * about where sign-in lives is its own bug.
             */
            $candidates = array_filter([
                $panel->getRouteName().'login',
                $panel->id.'.login',
                'login',
            ]);

            foreach ($candidates as $name) {
                if ($router->has($name)) {
                    continue 2;
                }
            }

            $this->problem(
                "the {$panel->id} panel has no sign-in route, so every one of its URLs returns 500",
                'It is behind the `auth` middleware, and an unauthenticated request is '
                .'redirected to a route that does not exist - Laravel throws '
                .'`Route [login] not defined` before any panel code runs, so nothing in the '
                .'panel can be opened at all. Run `php artisan panel:install --auth` to have '
                .'Alxtexhpanel write the sign-in screen and its routes, or point the panel at your '
                .'own by naming a route `login` (or `'.$panel->getRouteName().'login`).',
            );
        }
    }

    /**
     * A PATH-INSTALLED PACKAGE THAT COMPOSER COPIED RATHER THAN SYMLINKED.
     *
     * Reported from a real port, and it costs an afternoon each time: the
     * running code is a SNAPSHOT of the package taken at install time, so a fix
     * made in the source does not happen, `panel:update` writes the previous
     * version's page files, and nothing anywhere says so. `VendoredCopy` holds
     * the reasoning and the rule.
     *
     * A NOTE RATHER THAN A PROBLEM. Nothing is misconfigured - the application
     * runs exactly what it was given - and failing a build over a stale vendor
     * directory would fail every CI run that installs from a path repository
     * and then edits nothing.
     */
    private function checkVendoredCopy(): void
    {
        $manifest = base_path('composer.json');

        if (! is_file($manifest)) {
            return;
        }

        $composer = json_decode((string) file_get_contents($manifest), true);

        if (! is_array($composer)) {
            return;
        }

        $source = VendoredCopy::sourceFor($composer, base_path(), 'alxtexh-enterprise/panel');
        $vendor = base_path('vendor/alxtexh-enterprise/panel');

        if ($source === null || ! VendoredCopy::isStale($source, $vendor)) {
            return;
        }

        $this->note(
            'The vendored copy of alxtexh-enterprise/panel is older than its source',
            "composer COPIED {$source} into vendor/alxtexh-enterprise/panel instead of symlinking it, and the "
            .'source has changed since. The application is running the snapshot: a fix made in the '
            .'package does not happen, and `panel:update` writes page files from the old copy. Run '
            .'`composer update alxtexh-enterprise/panel` after each change, or set `"options": {"symlink": true}` '
            .'on the path repository - composer falls back to copying without failing where symlinks '
            .'do not work.',
        );
    }

    /**
     * The defaults nobody changed, which are how an installation announces it
     * is still somebody's laptop.
     *
     * NONE OF THESE BREAK ANYTHING, and that is exactly why they survive to
     * production: everything works, so nothing prompts anybody to look. They
     * are found by the person who receives an email from "Laravel", or by
     * whoever reads a stack trace on a public error page.
     *
     * THE ONLY ONE THAT IS AN EMERGENCY is debug in production, and it is
     * reported as a problem rather than a note because the failure is not
     * cosmetic: Laravel's error page prints environment variables, and that
     * includes the database password and the application key.
     */
    private function checkShippedDefaults(): void
    {
        $production = app()->isProduction();

        if ($production && config('app.debug') === true) {
            $this->problem(
                'Debug mode is on in production',
                'APP_DEBUG=true makes every uncaught error render a page listing environment '
                .'variables - the database password, the mail credentials and APP_KEY among them - '
                .'to whoever triggered it. Set APP_DEBUG=false.',
            );
        }

        if ((string) config('app.name') === 'Laravel') {
            $this->note(
                'The application is still called "Laravel"',
                'APP_NAME is the shipped default, so it is what page titles, the sign-in screen '
                .'and every notification email say this product is called. Set APP_NAME.',
            );
        }

        /*
         * A `.test` ADDRESS IS A SEED, NOT A COLLEAGUE. The reserved TLD is the
         * signal: nobody receives mail there, so an account holding one was
         * created by a seeder and its password is in the repository. Matching
         * on the domain rather than on a name means a demo account renamed to
         * something plausible is still found.
         */
        [$demo, $total] = $this->demoAccounts();

        if ($demo !== []) {
            $level = $production ? 'problem' : 'note';

            // THE COUNT, NOT JUST A SAMPLE. Five addresses and no total reads as
            // "there are five", and somebody deletes those and believes they are
            // finished.
            $more = $total > count($demo) ? ' and '.($total - count($demo)).' more' : '';

            $detail = 'Seeded accounts sign in with a password that is written in the seeder, '
                ."which is public. {$total} exist; delete them once a real administrator does: "
                .implode(', ', $demo).$more.'.';

            $level === 'problem'
                ? $this->problem('Seeded demo accounts can still sign in', $detail)
                : $this->note('Seeded demo accounts are present', $detail);
        }

        /*
         * AN UNPINNED PACKAGE IS NOT A VERSION. `@dev` resolves to whatever the
         * branch happened to be when composer last ran, so two deploys of "the
         * same" release can differ and neither can be rolled back to. Right for
         * the monorepo that develops the package, wrong for anything serving
         * real traffic.
         */
        if ($production && $this->requiresPanelAtDev()) {
            $this->problem(
                'The panel package is required at @dev',
                'composer.json asks for alxtexh-enterprise/panel at @dev, so the installed code is whatever '
                .'the branch was when composer last ran - not a version anybody can name or roll '
                .'back to. Require a tagged release.',
            );
        }
    }

    /**
     * Accounts on the reserved `.test` TLD, which cannot be real people.
     *
     * @return array{0: list<string>, 1: int} a sample, and how many there are
     */
    private function demoAccounts(): array
    {
        $model = config('auth.providers.users.model');

        if (! is_string($model) || ! class_exists($model)) {
            return [[], 0];
        }

        try {
            $query = $model::query()->withoutGlobalScopes()->where('email', 'like', '%.test');

            return [
                (clone $query)->orderBy('email')->limit(5)->pluck('email')->all(),
                (clone $query)->count(),
            ];
        } catch (Throwable) {
            // No users table yet, or a provider that is not Eloquent. Either way
            // there is nothing to report rather than something to crash over.
            return [[], 0];
        }
    }

    private function requiresPanelAtDev(): bool
    {
        $path = base_path('composer.json');

        if (! is_file($path)) {
            return false;
        }

        $composer = json_decode((string) file_get_contents($path), true);

        $constraint = $composer['require']['alxtexh-enterprise/panel'] ?? null;

        return is_string($constraint) && str_contains($constraint, 'dev');
    }

    /**
     * A tenant-aware panel whose permission package is not team-aware.
     *
     * THE ONE SETTING THAT FAILS OPEN. spatie/laravel-permission ships
     * `teams => false`, and Alxtexhpanel now depends on it - so an installation
     * that never published that config has a `tenant_id` column on every role,
     * `SetPermissionsTeam` dutifully setting a team id on every request, and a
     * permission package IGNORING BOTH.
     *
     * What that produces is not an error. Roles look right in the database and
     * right on the roles screen. `hasPermissionTo` simply considers every
     * tenant's roles at once, so somebody who administers one organisation
     * holds, in effect, the union of their permissions across all of them - and
     * the only way to notice is for the wrong person to open the wrong record.
     *
     * A PROBLEM, NOT A NOTE, and only when tenancy is on: in `mode => none`
     * there are no teams to scope by and the default is correct.
     */
    private function checkPermissionTeams(TenantContext $context): void
    {
        if (! class_exists(PermissionRegistrar::class)) {
            return;
        }

        if ($context->mode() === 'none') {
            return;
        }

        if (config('permission.teams') === true) {
            return;
        }

        $this->problem(
            'Permissions are not tenant-scoped',
            'config/permission.php has teams => false while panel.tenancy.mode is '
            .$context->mode().'. Roles carry a tenant but the permission package '
            .'ignores it, so a role grants across every organisation at once. Set '
            ."teams => true, and column_names.team_foreign_key => '"
            .config('panel.tenancy.column', 'tenant_id')."'.",
        );
    }

    /* ------------------------------------------------------------ plumbing */

    /**
     * TICKETING CONFIGURED AND NOT INSTALLED - the upgrade this check exists for.
     *
     * THE PACKAGE REGISTERS `TicketingPlugin` IN ITS OWN `panel.plugins`, and a
     * fresh install therefore gets it. AN EXISTING INSTALL DOES NOT, and that is
     * the whole problem: `mergeConfigFrom` is SHALLOW, so a published
     * `config/panel.php` supplies its own `plugins` array whole and the packaged
     * default never arrives. Somebody upgrades, sets `panel.ticketing.operator`,
     * reloads, and gets no route, no navigation entry and no error - because the
     * plugin they were configuring was never handed to the manager.
     *
     * `panel:update`'s drift report CANNOT SEE THIS. It walks the two configs
     * for keys the merge will not supply and skips list values deliberately - an
     * application shortening a list has configured it, not lost keys - so a
     * missing entry INSIDE `plugins` is invisible there by design. This check is
     * the compensating one, and it is the reason it exists as its own thing
     * rather than as a line in the drift report.
     *
     * ASKED OF EVERY PLACE A PLUGIN CAN COME FROM, not just config: a plugin may
     * self-register from a service provider or be attached to one panel. Checking
     * only `panel.plugins` would report a correctly installed panel as broken,
     * which is the kind of false alarm that gets a whole command ignored.
     *
     * SILENT WHEN TICKETING IS OFF. Neither key named is the supported state for
     * an installation that never wanted a support desk, and saying anything
     * about it would be noise in a report whose value is that every line matters.
     */
    private function checkTicketing(PanelManager $panels): void
    {
        $operator = config('panel.ticketing.operator');
        $opener = config('panel.ticketing.opener');

        if (! is_string($operator) && ! is_string($opener)) {
            return;
        }

        if ($this->ticketingIsInstalled($panels)) {
            $this->checkTicketTables();

            return;
        }

        $this->problem(
            'Ticketing is configured and its plugin is not installed',
            'panel.ticketing names a portal, so somebody has turned ticketing on - but '
            .TicketingPlugin::class.' is not registered, so no ticket screen exists and '
            .'nothing reports it. The package lists it in its own config/panel.php; a '
            .'published config supplies `plugins` whole, so the default never reaches you. '
            .'Add it to the `plugins` array in your config/panel.php.',
        );
    }

    /** Every place a plugin can legitimately come from, asked in turn. */
    private function ticketingIsInstalled(PanelManager $panels): bool
    {
        $registered = [
            ...array_values((array) config('panel.plugins', [])),
            ...array_values($panels->plugins()),
        ];

        foreach ($panels->panels() as $panel) {
            $registered = [...$registered, ...$panel->getPlugins()];
        }

        return array_any(
            $registered,
            static fn (mixed $p): bool => is_string($p)
                ? is_a($p, TicketingPlugin::class, true)
                : $p instanceof TicketingPlugin,
        );
    }

    /**
     * AND THE TABLES IT WAS POINTED AT, because the second half of the same
     * upgrade is renaming them.
     *
     * An installation that had ticketing before it was packaged sets
     * `panel.ticketing.tables` to the tables it already has - that IS the
     * migration. A typo there is not caught by anything: the packaged migration
     * skips a table it thinks exists under the configured name, so the schema
     * looks complete, and the failure arrives as SQL on the first person to open
     * the queue.
     */
    private function checkTicketTables(): void
    {
        foreach (['tickets' => TicketTables::tickets(), 'replies' => TicketTables::replies()] as $which => $table) {
            if (Schema::hasTable($table)) {
                continue;
            }

            $this->problem(
                "The ticket {$which} table [{$table}] does not exist",
                "Ticketing is installed and panel.ticketing.tables.{$which} names [{$table}], which "
                .'is not in this database. The packaged migration creates the table it is '
                .'CONFIGURED to use, so a name that is wrong here was never created and the queue '
                .'fails on the first query. Correct the name, or run migrate.',
            );
        }
    }

    /**
     * Warn when many plugins are configured, and fail fast on missing classes.
     */
    private function checkPluginPerformance(PanelManager $panels): void
    {
        $configured = (array) config('panel.plugins', []);
        $warnAbove = max(1, (int) config('panel.plugins_warn_above', 8));

        foreach ($configured as $class) {
            if (! is_string($class) || $class === '') {
                continue;
            }

            if (! class_exists($class)) {
                $this->problem(
                    "Plugin class [{$class}] is missing",
                    "config('panel.plugins') names [{$class}], but PHP cannot autoload it. "
                    .'PanelKit does not scan for plugins: every entry must be a class you installed explicitly.',
                    'Remove the entry, fix the namespace, or run composer require for the package that provides it.',
                );
            }
        }

        $unique = [];

        foreach ($this->discoveredPlugins($panels) as $plugin) {
            $unique[$plugin->id()] = true;
        }

        $count = count($unique);

        if ($count <= $warnAbove) {
            return;
        }

        $this->note(
            "Many plugins configured ({$count})",
            'Each plugin adds registration work the first time its panel is used. '
            ."Only register plugins you need in config('panel.plugins') or Panel::plugins(). "
            .'Host Vue components in your app; plugins add routes only when configured.',
        );
    }

    /**
     * Validate optional plugin dependencies and health reports without making
     * them part of the required interface, preserving compatibility for direct
     * PanelPlugin implementations.
     */
    private function checkPluginHealth(PanelManager $panels): void
    {
        foreach ($this->discoveredPlugins($panels) as $plugin) {
            $id = $plugin->id();

            if (method_exists($plugin, 'dependencies')) {
                foreach ((array) $plugin->dependencies() as $dependency) {
                    if (! is_string($dependency) || $dependency === '') {
                        $this->problem(
                            "Plugin [{$id}] declares an invalid dependency",
                            'Plugin dependencies must be non-empty class or interface names.',
                            'Return class-string values from dependencies().',
                        );

                        continue;
                    }

                    if (! class_exists($dependency) && ! interface_exists($dependency)) {
                        $this->problem(
                            "Plugin [{$id}] is missing dependency [{$dependency}]",
                            'The plugin is registered, but one of its declared runtime dependencies cannot be autoloaded.',
                            'Install the dependency or remove the plugin registration.',
                        );
                    }
                }
            }

            if (method_exists($plugin, 'configKey') && method_exists($plugin, 'configRules')) {
                $configKey = $plugin->configKey();
                $rules = $plugin->configRules();

                if ($configKey !== null && $configKey !== '' && $rules !== []) {
                    $validator = validator((array) config($configKey, []), $rules);

                    if ($validator->fails()) {
                        $this->problem(
                            "Plugin [{$id}] has invalid configuration",
                            "Configuration [{$configKey}] does not satisfy the plugin schema: "
                                .implode('; ', $validator->errors()->all()),
                            "Fix config('{$configKey}') before deploying the plugin.",
                        );
                    }
                }
            }

            if (! method_exists($plugin, 'health')) {
                continue;
            }

            try {
                $findings = $plugin->health();
            } catch (Throwable $exception) {
                $this->problem(
                    "Plugin [{$id}] health check failed",
                    $exception->getMessage(),
                    'Fix the plugin health check before deploying it.',
                );

                continue;
            }

            foreach ((array) $findings as $finding) {
                if (! is_array($finding) || ! isset($finding['title'], $finding['detail'])) {
                    $this->problem(
                        "Plugin [{$id}] returned an invalid health finding",
                        'Each health finding must contain title and detail strings.',
                        'Return arrays shaped like ["level" => "problem", "title" => ..., "detail" => ...].',
                    );

                    continue;
                }

                $title = "Plugin [{$id}]: {$finding['title']}";
                $detail = (string) $finding['detail'];

                if ($finding['level'] === 'note') {
                    $this->note($title, $detail);
                } else {
                    $this->problem(
                        $title,
                        $detail,
                        isset($finding['suggested']) ? (string) $finding['suggested'] : null,
                    );
                }
            }
        }
    }

    /**
     * Compare installed plugins against the PanelKit plugin contract version.
     *
     * Explicit registration only: config, global registry, and per-panel lists.
     * A mismatch is a problem because hooks may not exist or may behave differently.
     */
    private function checkPluginCompatibility(PanelManager $panels): void
    {
        $expected = Plugin::CONTRACT_VERSION;
        $byId = [];
        $classesById = [];

        foreach ($this->discoveredPlugins($panels) as $plugin) {
            $id = $plugin->id();
            $class = $plugin::class;

            if (isset($classesById[$id]) && $classesById[$id] !== $class) {
                $this->problem(
                    "Duplicate plugin id [{$id}]",
                    "Both {$classesById[$id]} and {$class} claim this id. Only one plugin may use an id.",
                    'Override id() on one plugin or remove the duplicate registration.',
                );
            } else {
                $classesById[$id] = $class;
            }

            $byId[$id] = $plugin;
        }

        if ($byId === []) {
            $this->note(
                'No Panel plugins registered',
                'Add plugins through config(panel.plugins) or Panel::plugins(). This is informational only.',
            );

            return;
        }

        foreach ($byId as $id => $plugin) {
            $version = $plugin->getVersion();

            if ($version === $expected) {
                continue;
            }

            $this->problem(
                "Host plugin [{$id}] has a contract mismatch",
                get_class($plugin)." reports plugin contract {$version}, but this PanelKit release expects {$expected}.",
                'Update the plugin class to match the current contract version, or pin PanelKit to a compatible release.',
            );
        }
    }

    /** Detect hooks authored for a different position contract before runtime. */
    private function checkRenderHookCompatibility(PanelManager $panels): void
    {
        foreach ($panels->panels() as $panel) {
            foreach ($panels->renderHookCompatibility(panelId: $panel->id) as $hook) {
                if ($hook['compatible']) {
                    continue;
                }

                $this->problem(
                    "Render hook [{$hook['component']}] has an incompatible version",
                    "Position [{$hook['position']}] expects version {$hook['expectedVersion']}, but the hook declares version {$hook['version']}.",
                    'Update the plugin to the current render-hook contract before enabling it.',
                );
            }
        }
    }

    /**
     * Apply plugins and register their Page classes for every panel.
     *
     * Slug collisions throw during registration; doctor turns that into a named
     * problem instead of a boot-time stack trace.
     */
    private function checkPluginPageRegistration(PanelManager $panels): void
    {
        foreach ($panels->panels() as $panel) {
            try {
                $panels->pagesFor($panel->id);
            } catch (\RuntimeException $e) {
                $this->problem(
                    "Plugin page registration failed for panel [{$panel->id}]",
                    $e->getMessage(),
                    'Rename the conflicting page or resource slug, or remove the duplicate plugin registration.',
                );
            }
        }
    }

    /**
     * @return list<PanelPlugin>
     */
    private function discoveredPlugins(PanelManager $panels): array
    {
        /** @var array<string, PanelPlugin> $instances */
        $instances = [];

        foreach ($panels->plugins() as $plugin) {
            $instances[$plugin->id()] = $plugin;
        }

        foreach ((array) config('panel.plugins', []) as $class) {
            if (! is_string($class) || $class === '') {
                continue;
            }

            if (! class_exists($class)) {
                continue;
            }

            try {
                $plugin = app($class);
            } catch (Throwable) {
                continue;
            }

            if ($plugin instanceof PanelPlugin) {
                $instances[$plugin->id()] = $plugin;
            }
        }

        foreach ($panels->panels() as $panel) {
            foreach ($panel->getPlugins() as $plugin) {
                $instances[$plugin->id()] = $plugin;
            }
        }

        return array_values($instances);
    }

    private function problem(string $title, string $detail, ?string $suggested = null): void
    {
        $finding = ['level' => 'problem', 'title' => $title, 'detail' => $detail];

        if ($suggested !== null && $suggested !== '') {
            $finding['suggested'] = $suggested;
        }

        $this->findings[] = $finding;
    }

    private function note(string $title, string $detail): void
    {
        $this->findings[] = ['level' => 'note', 'title' => $title, 'detail' => $detail];
    }

    private function has(string $level): bool
    {
        return array_any(
            $this->findings,
            static fn (array $f): bool => $f['level'] === $level,
        );
    }

    private function report(): void
    {
        $this->newLine();

        if ($this->findings === []) {
            $this->components->info('Nothing silently wrong.');

            return;
        }

        foreach ($this->findings as $finding) {
            $finding['level'] === 'problem'
                ? $this->components->error($finding['title'])
                : $this->components->warn($finding['title']);

            $detail = $finding['detail'];
            if (isset($finding['suggested']) && $finding['suggested'] !== '') {
                $detail = $detail.' Suggested: '.$finding['suggested'];
            }

            $this->line('    '.wordwrap($detail, 90, "\n    "));
            $this->newLine();
        }

        $problems = count(array_filter($this->findings, static fn (array $f): bool => $f['level'] === 'problem'));

        $problems > 0
            ? $this->components->error("{$problems} problem(s) found.")
            : $this->components->info('No problems - the notes above are informational.');
    }

    /**
     * A tighter checklist view for the production preset.
     */
    private function reportProduction(): void
    {
        $this->newLine();

        if ($this->findings === []) {
            $this->components->info('Nothing to fix for the production preset.');

            return;
        }

        foreach ($this->findings as $finding) {
            $severity = $finding['level'] === 'problem' ? 'ERROR' : 'WARN';
            $this->line('- '.$severity.': '.$finding['title']);

            if (isset($finding['suggested']) && $finding['suggested'] !== '') {
                $this->line('  Suggested: '.$finding['suggested']);
            }

            $this->line('  '.wordwrap($finding['detail'], 90, "\n  "));
            $this->newLine();
        }

        $problems = count(array_filter($this->findings, static fn (array $f): bool => $f['level'] === 'problem'));

        $problems > 0
            ? $this->components->error("{$problems} problem(s) found.")
            : $this->components->info('No problems - the checklist items are warnings or notes.');
    }
}
