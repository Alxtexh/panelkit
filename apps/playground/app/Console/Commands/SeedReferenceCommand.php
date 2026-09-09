<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\SuperadminUser;
use App\Support\DemoData;
use App\Support\LandingSeoSettings;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * The reference estate: five tenants of deliberately different sizes.
 *
 * WHY NOT FIVE TENANTS OF THE SAME SIZE. The demo seeder spreads its total
 * evenly, which is the right shape for a raw throughput number and the wrong one
 * for finding bugs. A uniform estate hides every scale-dependent fault at once:
 * an N+1 is invisible when every tenant is slow, a "no results" state is never
 * seen when no tenant is small, and pagination that assumes more than one page
 * is never contradicted. The five sizes below span four orders of magnitude for
 * that reason - 250,000 down to 200 - so one run exercises the index strategy,
 * the empty-ish list, and everything between.
 *
 * ONE TENANT HAS A DATABASE OF ITS OWN, which is the arrangement a real SaaS
 * reaches: most tenants share, and the few large or contractually-isolated ones
 * do not. It is here because hybrid mode was previously only provable in a unit
 * test - `setInternal()` in process - and a mode that has never survived a
 * request boundary is a claim, not a feature.
 *
 * RESUMABLE, BY COUNTING. Each tenant is brought TO its target rather than
 * seeded from zero: an interrupted run is resumed by running it again, and a
 * changed target is applied by running it again. Deterministic row generation is
 * what makes that safe - row `n` of a tenant is always the same row, so topping
 * up from 100,000 to 250,000 produces exactly what a fresh run to 250,000 would.
 * Without that, resuming would duplicate access codes and quietly corrupt the
 * uniqueness the panel's lookups depend on.
 */
final class SeedReferenceCommand extends Command
{
    protected $signature = 'panel:seed-reference
                            {--tenant= : Shape one tenant only, by slug}
                            {--fresh : Delete existing subscribers first rather than topping up}';

    protected $description = 'Seed the five-tenant reference estate used by panel:benchmark';

    /**
     * ROWS PER INSERT, AND SQLITE DECIDES THE CEILING.
     *
     * A MULTI-ROW INSERT BINDS ONE PARAMETER PER COLUMN PER ROW, and SQLite
     * caps a statement's parameters - 999 on builds before 3.32, 32,766 after.
     * At eleven columns, 5,000 rows is 55,000 bindings, so this command died
     * with "too many SQL variables" partway through the estate on any SQLite
     * a developer is likely to have. MySQL and Postgres never complained,
     * which is why it survived: the default development database is the one
     * that cannot run it.
     *
     * 500 IS THE LARGEST SAFE FIGURE FOR THE WIDEST TABLE HERE and still one
     * statement per five hundred rows, which is not the bottleneck.
     */
    private const CHUNK = 500;

    /**
     * The estate.
     *
     * `db` marks the one tenant isolated by connection rather than by column.
     * `domain` is what a hostname resolver would match; `.localhost` resolves to
     * 127.0.0.1 without touching /etc/hosts, and the one deliberate exception is
     * a custom vanity domain, because "tenant on their own domain" is a distinct
     * routing case from "tenant on a subdomain of ours" and the two are easy to
     * conflate until one of them is present.
     */
    private const ESTATE = [
        ['slug' => 'nairobi-fibre', 'name' => 'Nairobi Fibre', 'clients' => 250_000, 'plans' => 60, 'routers' => 40, 'domain' => 'nairobi-fibre.localhost', 'db' => false],
        ['slug' => 'coastline-isp', 'name' => 'Coastline ISP', 'clients' => 25_000, 'plans' => 24, 'routers' => 16, 'domain' => 'coastline-isp.localhost', 'db' => false],
        ['slug' => 'rift-valley-net', 'name' => 'Rift Valley Net', 'clients' => 2_500, 'plans' => 12, 'routers' => 8, 'domain' => 'rift-valley-net.localhost', 'db' => false],
        ['slug' => 'lakeside-broadband', 'name' => 'Lakeside Broadband', 'clients' => 200, 'plans' => 4, 'routers' => 2, 'domain' => 'portal.lakeside.test', 'db' => false],
        ['slug' => 'highland-connect', 'name' => 'Highland Connect', 'clients' => 25_000, 'plans' => 24, 'routers' => 16, 'domain' => 'highland-connect.localhost', 'db' => true],
    ];

    public function handle(): int
    {
        /*
         * LOCAL ONLY, AND THIS SHIPS IN THE PACKAGE.
         *
         * `panel:seed-demo` has refused to run outside local since it was
         * written; this one never did, and it is the more dangerous of the two:
         * it creates operator accounts whose password is the literal string
         * "password", written in this file, which is public. Anybody who
         * installs Alxtexhpanel gets this command in `artisan list`, and running it
         * on a server hands out known credentials to every tenant it invents.
         *
         * Nothing about that fails. The command succeeds, the panel works, and
         * the installation is simply open - which is why the guard has to be
         * here rather than in the documentation.
         */
        if (! app()->environment('local', 'testing')) {
            $this->components->error(
                'panel:seed-reference refuses to run outside the local environment.'
            );

            $this->line(
                '  It creates demo tenants and operator accounts with a fixed, published'
            );
            $this->line(
                '  password. Use panel:install and make your own administrator instead.'
            );

            return self::FAILURE;
        }

        $only = $this->option('tenant');
        $started = hrtime(true);

        foreach (self::ESTATE as $spec) {
            if ($only !== null && $spec['slug'] !== $only) {
                continue;
            }

            $this->shape($spec);
        }

        // Only meaningful once every tenant exists, so it runs after the loop
        // rather than inside it.
        if ($only === null) {
            $this->adoptOrphans();
            $this->superadmin();
            $this->seedLandingSeo();
        }

        $this->newLine();
        $this->components->info(sprintf('Reference estate ready in %.1fs.', (hrtime(true) - $started) / 1e9));

        return self::SUCCESS;
    }

    /**
     * Give a home to any user whose tenant no longer exists.
     *
     * WHY THIS IS NOT HOUSEKEEPING. Re-seeding replaces the tenant rows, and the
     * foreign key nulls `users.tenant_id` on the way past. A null tenant key is
     * a DENY signal throughout this panel - never "all tenants" - so the account
     * survives, logs in successfully, and every single page renders correctly
     * with no rows in it.
     *
     * That is the worst possible failure shape and it happened here: the panel
     * looked like it had leaked or lost 300,000 records, when in fact every row
     * was present and one column was null. Nothing errors, nothing warns, and
     * the natural reading of an empty panel is data loss.
     *
     * So the seeder repairs it rather than leaving a foot-gun for the next
     * person who runs `--fresh`. It only ever touches users with NO tenant -
     * a user pointing at a tenant that exists is left alone, because reassigning
     * those would be the seeder moving people between organisations.
     */
    /**
     * The one account that can open the superadmin portal.
     *
     * A SEPARATE TABLE MEANS A SEPARATE SEED. The superadmin portal
     * authenticates on the `superadmins` guard against `superadmin_users`, so
     * none of the operator accounts above can open it - which is the whole
     * point of the split and also the reason the portal was unreachable the
     * moment the guard changed. Without this, `/superadmin/login` is a form
     * with no valid answer.
     *
     * SAME LOCAL-ONLY PASSWORD AS EVERY OTHER SEEDED ACCOUNT, and guarded by
     * the same refusal at the top of `handle()` - this command declines to run
     * anywhere but a development database.
     */
    private function superadmin(): void
    {
        SuperadminUser::query()->firstOrCreate(
            ['email' => 'superadmin@panel.test'],
            ['name' => 'Superadmin', 'password' => bcrypt('password'), 'abilities' => ['*']],
        );

        $this->components->twoColumnDetail('Superadmin', 'superadmin@panel.test at /superadmin/login');
    }

    /**
     * The public landing page's actual identity - see `LandingSeoSettings`.
     *
     * NAIROBI FIBRE, NOT WHICHEVER TENANT SEEDS LAST. The landing page is not
     * tenant-scoped - an anonymous visitor reaches it before any tenant is
     * resolved - so of the five estates above, this names the one the
     * reference estate is actually built around (`nairobi-fibre.test`
     * accounts, the demo narrative throughout the rest of this command).
     * `--tenant` reseeding a single OTHER estate correctly leaves this alone.
     */
    private function seedLandingSeo(): void
    {
        (new LandingSeoSettings(
            title: 'Nairobi Fibre — Fast, Reliable Fiber Internet in Nairobi',
            description: 'Fast, reliable fiber internet plans for homes and businesses in Nairobi. '
                .'Check coverage and sign up in minutes.',
            businessName: 'Nairobi Fibre',
            locale: 'en_KE',
        ))->save();
    }

    private function adoptOrphans(): void
    {
        $home = DB::table('tenants')->orderBy('id')->value('id');

        if ($home === null) {
            return;
        }

        $orphans = DB::table('users')->whereNull('tenant_id')->count();

        if ($orphans === 0) {
            return;
        }

        DB::table('users')->whereNull('tenant_id')->update(['tenant_id' => $home]);

        $this->components->warn(
            "  adopted {$orphans} user(s) with no tenant - they would have seen an empty panel"
        );
    }

    /** @param array<string, mixed> $spec */
    private function shape(array $spec): void
    {
        $this->components->info("{$spec['name']} - target {$spec['clients']} subscribers");

        // The tenant RECORD and its domain are central facts, so they are
        // written before any connection switch - a tenant that only exists
        // inside its own database is a tenant nothing can resolve.
        $tenantId = $this->tenant($spec);

        $this->admin($tenantId, $spec);

        $seed = function () use ($tenantId, $spec): void {
            $plans = $this->topUp('plans', $tenantId, $spec['plans'], fn (int $n): array => $this->planRow($tenantId, $n));
            $routers = $this->topUp('routers', $tenantId, $spec['routers'], fn (int $n): array => $this->routerRow($tenantId, $n));

            $this->clients($tenantId, $spec['clients'], $plans, $routers);
        };

        if (! $spec['db']) {
            $seed();

            return;
        }

        $this->withOwnDatabase($tenantId, $seed);
    }

    /**
     * Run `$seed` inside the tenant's OWN database, creating it if needed.
     *
     * THE DATABASE MUST EXIST BEFORE ANYTHING RESOLVES THIS TENANT. stancl's
     * bootstrapper throws `TenantDatabaseDoesNotExistException` on the first
     * request in a local environment, so a tenant marked database-isolated but
     * never provisioned takes down every page that touches it - including the
     * central tenant list, which loads it to render a name.
     *
     * MIGRATIONS RUN ON THE TENANT CONNECTION, not the central one. Skipping
     * this is the failure that looks like success: `tenancy()->initialize()`
     * switches the connection happily to an EMPTY database, the seeder's first
     * insert fails on a missing table, and the obvious reading is that tenancy
     * is broken rather than that nothing has been migrated.
     */
    private function withOwnDatabase(int $tenantId, callable $seed): void
    {
        $model = config('tenancy.tenant_model');
        $tenant = $model::query()->findOrFail($tenantId);

        if (! $tenant->database()->manager()->databaseExists($tenant->database()->getName())) {
            $this->components->task('  creating its database', fn (): bool => (bool) $tenant->database()->manager()->createDatabase($tenant));
        }

        tenancy()->initialize($tenant);

        try {
            $this->components->task('  migrating it', function (): bool {
                $this->callSilent('migrate', ['--force' => true, '--database' => 'tenant']);

                return true;
            });

            $this->mirrorTenantRow($tenant);

            $seed();

            /*
             * INDEXES LAST, and they are not optional.
             *
             * Every index in the shared schema leads with `tenant_id`, which is
             * exactly right there and useless here - the panel drops that
             * predicate in database mode, so none of them can serve an ORDER BY
             * and every page becomes a full scan plus a temp sort. Measured on
             * this very estate: 0.45 ms on the shared 25k tenant against 9.65 ms
             * on the dedicated one, for identical data.
             *
             * After seeding rather than before, because building an index on an
             * empty table and then inserting 25,000 rows through it is slower
             * than building it once at the end.
             */
            $this->call('panel:reindex-tenant');
        } finally {
            // ALWAYS end tenancy, even if seeding threw. Leaving the connection
            // pointed at one tenant's database means the NEXT tenant in the loop
            // writes its subscribers there - a cross-tenant corruption caused by
            // an unrelated error, which is the hardest kind to trace back.
            tenancy()->end();
        }
    }

    /**
     * Copy the tenant's own row into its own database.
     *
     * BECAUSE THE SCHEMA IS THE SAME ONE. Alxtexhpanel runs a single set of
     * migrations, so a dedicated database gets `clients.tenant_id` and its
     * foreign key to `tenants` exactly as the shared one does - and its own
     * `tenants` table arrives EMPTY, because the tenant records are central
     * facts written on the central connection. The first insert then fails on a
     * foreign key that points at nothing.
     *
     * The alternative is a separate tenant migration set with no `tenant_id` and
     * no `tenants` table, which is what stancl assumes and what a multi-database-
     * only application should do. It is the wrong trade HERE: the panel's whole
     * proposition is that a resource is written once and runs in either mode, and
     * two schemas means a resource can compile against one and fail against the
     * other. One schema, one redundant column in the dedicated case, and
     * isolation that comes from the connection rather than from the column.
     *
     * So the column stays and is simply true. Mirroring one row is the price.
     */
    private function mirrorTenantRow(object $tenant): void
    {
        /*
         * A STALE MIRROR UNDER A DIFFERENT ID IS DELETED FIRST.
         *
         * `migrate:fresh` REBUILDS THE CENTRAL DATABASE AND NOT THE TENANT
         * FILES. `tenant_*.sqlite` sit on disk and survive it, so the next run
         * hands out new central ids while the old file still holds the tenant
         * under the old one - and the upsert below, keyed on id, tries to
         * INSERT a slug the file already has. The command dies on
         * "UNIQUE constraint failed: tenants.slug" partway through the estate,
         * naming a table the operator did not think they were writing to.
         *
         * The mirror is a copy of a central fact, so the central id wins and
         * the older copy goes.
         */
        DB::table('tenants')
            ->where('slug', $tenant->slug)
            ->where('id', '!=', $tenant->getKey())
            ->delete();

        DB::table('tenants')->updateOrInsert(
            ['id' => $tenant->getKey()],
            [
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                // NOT the db name. Inside its own database this tenant is the
                // only one there is, and a copy of the pointer would be a second
                // source of truth that a rename could put out of step with the
                // central record that actually drives resolution.
                'tenancy_db_name' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );
    }

    /** Create or update the tenant record, its domain, and its isolation mode. */
    private function shapeTenantRow(array $spec): array
    {
        $i = array_search($spec['slug'], array_column(self::ESTATE, 'slug'), true);

        return [
            'name' => $spec['name'],
            'theme_colors' => json_encode(['primary' => sprintf('oklch(0.55 0.20 %d)', 200 + $i * 30)]),
            'features' => json_encode(['clients' => true, 'routers' => true, 'plans' => true]),
            /*
             * The column that makes hybrid mode real. Null for a shared tenant,
             * a database name for an isolated one - read back on every request,
             * which the in-memory `setInternal()` never was.
             */
            'tenancy_db_name' => $spec['db'] ? "tenant_{$spec['slug']}.sqlite" : null,
            'updated_at' => now(),
        ];
    }

    private function tenant(array $spec): int
    {
        $existing = DB::table('tenants')->where('slug', $spec['slug'])->first();
        $row = $this->shapeTenantRow($spec);

        if ($existing !== null) {
            DB::table('tenants')->where('id', $existing->id)->update($row);
            $id = (int) $existing->id;
        } else {
            $id = (int) DB::table('tenants')->insertGetId(
                $row + ['slug' => $spec['slug'], 'logo_url' => null, 'created_at' => now()],
            );
        }

        // The domain is separate because it is a ROUTING fact, and one tenant
        // may hold several. `updateOrInsert` rather than insert so a re-run does
        // not collide with the unique index it depends on.
        if (DB::getSchemaBuilder()->hasTable('domains')) {
            DB::table('domains')->updateOrInsert(
                ['domain' => $spec['domain']],
                ['tenant_id' => $id, 'created_at' => now(), 'updated_at' => now()],
            );
        }

        return $id;
    }

    /**
     * One signed-in-able administrator per tenant.
     *
     * WITHOUT THIS THE ESTATE IS NOT USABLE, only measurable. Every screen in
     * the panel is behind authentication, so a reference application nobody can
     * log into can be benchmarked at the query layer and never opened - and the
     * things that go wrong in a browser are not the things that go wrong in a
     * query.
     *
     * The user lives on the CENTRAL connection with the other tenant records,
     * including for the dedicated tenant: authentication happens before a tenant
     * is resolved, so a user who exists only inside their own tenant database
     * cannot be found by the login that would resolve it. That ordering is easy
     * to get backwards and produces a tenant nobody can ever reach.
     */
    private function admin(int $tenantId, array $spec): void
    {
        $email = "admin@{$spec['slug']}.test";

        DB::table('users')->updateOrInsert(
            ['email' => $email],
            [
                'name' => $spec['name'].' Admin',
                'tenant_id' => $tenantId,
                // A FIXED, OBVIOUSLY-LOCAL password. This is seeded demo data on
                // a development machine; a generated one would have to be printed
                // or stored somewhere, and both are worse habits than a
                // credential that is visibly not a secret.
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );

        $this->components->task("  admin: {$email}", fn () => true);
    }

    /**
     * Bring one table to `$target` rows for this tenant.
     *
     * TOPS UP, TRIMS, OR DOES NOTHING - never re-seeds from zero. Re-seeding
     * would renumber every row, and the subscribers hold foreign keys into these
     * tables; a resumed run would silently repoint a quarter-million clients at
     * plans that no longer mean what they did.
     *
     * @param  callable(int): array<string, mixed>  $row
     * @return list<int>
     */
    private function topUp(string $table, int $tenantId, int $target, callable $row): array
    {
        $query = fn () => DB::table($table)->where('tenant_id', $tenantId);
        $have = $query()->count();

        if ($this->option('fresh') && $have > 0) {
            $query()->delete();
            $have = 0;
        }

        if ($have > $target) {
            // Trim the NEWEST, so the ids the existing subscribers point at
            // survive. Deleting the oldest would orphan the majority.
            $doomed = $query()->orderByDesc('id')->limit($have - $target)->pluck('id');
            DB::table($table)->whereIn('id', $doomed)->delete();
        }

        for ($n = $have; $n < $target; $n++) {
            DB::table($table)->insert($row($n));
        }

        return $query()->orderBy('id')->pluck('id')->all();
    }

    /** @param list<int> $plans */
    private function clients(int $tenantId, int $target, array $plans, array $routers): void
    {
        $query = fn () => DB::table('clients')->where('tenant_id', $tenantId);
        $have = $query()->count();

        if ($this->option('fresh') && $have > 0) {
            $this->components->task('  clearing', fn () => $query()->delete());
            $have = 0;
        }

        if ($have > $target) {
            $this->components->task("  trimming {$have} to {$target}", function () use ($query, $have, $target): bool {
                $doomed = $query()->orderByDesc('id')->limit($have - $target)->pluck('id');
                DB::table('clients')->whereIn('id', $doomed->all())->delete();

                return true;
            });

            return;
        }

        if ($have === $target) {
            $this->components->task("  {$target} subscribers already", fn () => true);

            return;
        }

        $data = new DemoData;
        $nowTs = time();
        $signupWeights = $data->dayWeights(540, $nowTs, 0.6, 0.85);
        $expiryWeights = $data->dayWeights(360, $nowTs, 1.0, 0.0);

        $bar = $this->output->createProgressBar($target - $have);
        $bar->setFormat('  subscribers %current%/%max% [%bar%] %percent:3s%%  %elapsed:6s%');
        $bar->start();

        $buffer = [];

        for ($n = $have; $n < $target; $n++) {
            $buffer[] = $data->clientRow(
                $tenantId,
                $n,
                // The access code must be unique across the whole estate, not
                // just within a tenant - the command palette looks one up
                // without knowing which tenant it belongs to. Mixing the tenant
                // id into the sequence keeps two tenants' row `n` apart.
                $tenantId * 10_000_000 + $n,
                $plans,
                $routers,
                $nowTs,
                $signupWeights,
                $expiryWeights,
            );

            if (count($buffer) >= self::CHUNK) {
                DB::table('clients')->insert($buffer);
                $bar->advance(count($buffer));
                $buffer = [];
            }
        }

        if ($buffer !== []) {
            DB::table('clients')->insert($buffer);
            $bar->advance(count($buffer));
        }

        $bar->finish();
        $this->newLine();
    }

    /** @return array<string, mixed> */
    private function planRow(int $tenantId, int $n): array
    {
        $speed = [5, 10, 20, 40, 100][$n % 5];

        return [
            'tenant_id' => $tenantId,
            'name' => "{$speed}Mbps ".['Home', 'Business', 'Lite'][$n % 3],
            'speed_mbps' => $speed,
            'price_cents' => $speed * 100_000,
            'is_active' => $n % 11 !== 0,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /** @return array<string, mixed> */
    private function routerRow(int $tenantId, int $n): array
    {
        return [
            'tenant_id' => $tenantId,
            'name' => sprintf('RTR-%02d-%03d', $tenantId, $n + 1),
            'ip_address' => sprintf('10.%d.%d.1', $tenantId % 250, $n % 250),
            'model' => ['MikroTik CCR2004', 'MikroTik hEX S', 'Ubiquiti EdgeRouter'][$n % 3],
            'status' => ['online', 'online', 'online', 'degraded', 'offline'][$n % 5],
            'last_seen_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
