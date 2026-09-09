<?php

declare(strict_types=1);

namespace App\Demo\Console;

use App\Support\DemoData;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * php artisan panel:seed-demo --scale=large|medium|small
 *
 * Spec §2: "Performance claims are meaningless against 50 rows." This seeds at
 * a scale where the database is the bottleneck, which is the only scale at which
 * the §10 budgets mean anything.
 *
 * Spec §2 also mandates bulk insert() in chunks rather than model factories in a
 * loop - factories hydrate and save one model per row, which turns a 90-second
 * job into an overnight one. Nothing here touches an Eloquent model.
 *
 * LOCAL ONLY. Refuses to run outside a local environment, and refuses to run
 * against a non-local database host. Spec §2 hard rules 2 and 4.
 */
final class SeedDemoCommand extends Command
{
    protected $signature = 'panel:seed-demo
                            {--scale=medium : xlarge|large|medium|small}
                            {--fresh : Truncate demo tables first}
                            {--only= : Seed one section only (inbox)}';

    protected $description = 'Seed realistic multi-tenant demo data at scale';

    private const CHUNK = 5_000;

    private const SCALES = [
        'small' => ['tenants' => 2, 'clients' => 5_000,   'sessions' => 20_000,    'plans' => 20,  'routers' => 10],
        'medium' => ['tenants' => 5, 'clients' => 50_000,  'sessions' => 200_000,   'plans' => 200, 'routers' => 50],
        'large' => ['tenants' => 5, 'clients' => 500_000, 'sessions' => 2_000_000, 'plans' => 200, 'routers' => 50],
        /*
         | Deliberately past the point where anything sloppy shows.
         |
         | At 5M sessions a missing index is seconds rather than milliseconds,
         | an OFFSET page is a visible stall, and a COUNT(*) in front of rows is
         | unmissable. Numbers taken at `medium` prove a query SHAPE; numbers
         | taken here prove the shape survives contact with real volume.
         */
        'xlarge' => ['tenants' => 5, 'clients' => 1_000_000, 'sessions' => 5_000_000, 'plans' => 400, 'routers' => 100],
    ];

    public function handle(): int
    {
        if (! $this->guardLocal()) {
            return self::FAILURE;
        }

        $scale = $this->option('scale');

        if (! isset(self::SCALES[$scale])) {
            $this->error("Unknown scale [{$scale}]. Use large, medium, or small.");

            return self::FAILURE;
        }

        $cfg = self::SCALES[$scale];
        $started = microtime(true);

        /*
         * `--only` exists because reseeding is not always the answer.
         *
         * Adding the mailbox after a 5M-row dataset had already been generated
         * meant either twenty minutes of rewriting rows that had not changed,
         * or a one-off script. A named section is neither: the seeding logic
         * stays in one place and can be re-run for the part that is missing.
         */
        if ($this->option('only') === 'inbox') {
            $tenantIds = $this->tenantIds();

            if ($tenantIds === []) {
                $this->components->error('No tenants exist. Run a full seed first.');

                return self::FAILURE;
            }

            DB::table('chat_messages')->delete();
            DB::table('chat_conversations')->delete();
            DB::table('mail_messages')->delete();

            $this->seedInbox($tenantIds);
            $this->components->info('Done in '.round(microtime(true) - $started, 1).'s.');

            return self::SUCCESS;
        }

        if ($this->option('fresh')) {
            $this->truncateDemoTables();
        }

        $this->components->info("Seeding demo data at scale [{$scale}]");

        $tenantIds = $this->seedTenants($cfg['tenants']);
        $planIds = $this->seedPlans($tenantIds, $cfg['plans']);
        $routerIds = $this->seedRouters($tenantIds, $cfg['routers']);
        $this->seedClients($tenantIds, $planIds, $routerIds, $cfg['clients']);
        $this->seedSessions($tenantIds, $cfg['sessions']);
        $this->seedInbox($tenantIds);

        $elapsed = round(microtime(true) - $started, 1);
        $this->newLine();
        $this->components->info("Done in {$elapsed}s");

        // Spec §0 acceptance: the seeder must finish in under 5 minutes.
        if ($elapsed > 300) {
            $this->components->warn(
                "Exceeded the 5 minute Phase 0 budget ({$elapsed}s). Tune chunking before proceeding."
            );
        }

        return self::SUCCESS;
    }

    /**
     * Spec §2 hard rules: never point at a remote database, never run
     * destructive commands against anything but the local database.
     */
    private function guardLocal(): bool
    {
        if (! app()->environment('local', 'testing')) {
            $this->error('panel:seed-demo refuses to run outside the local environment.');

            return false;
        }

        $connection = config('database.default');
        $host = config("database.connections.{$connection}.host");

        $localHosts = ['127.0.0.1', 'localhost', '::1', 'db', 'postgres', 'mysql', 'mariadb', null, ''];

        if (! in_array($host, $localHosts, true)) {
            $this->error("Refusing to seed: DB host [{$host}] is not local.");

            return false;
        }

        return true;
    }

    private function truncateDemoTables(): void
    {
        $this->components->warn('Truncating demo tables (local database only)');

        // Child-first, so foreign keys stay satisfied without disabling checks.
        foreach (['chat_messages', 'chat_conversations', 'mail_messages', 'client_sessions', 'clients', 'routers', 'plans', 'tenants'] as $table) {
            if (Schema::hasTable($table)) {
                DB::table($table)->delete();
            }
        }
    }

    /** @return list<int> */
    private function tenantIds(): array
    {
        $tenantIds = [];

        foreach (DB::table('tenants')->orderBy('id')->pluck('id') as $tenantId) {
            $tenantIds[] = (int) $tenantId;
        }

        return $tenantIds;
    }

    /** @return list<int> */
    private function seedTenants(int $count): array
    {
        $names = ['Nairobi Fibre', 'Coastline ISP', 'Rift Valley Net', 'Lakeside Broadband', 'Highland Connect'];
        $now = now();
        $rows = [];

        for ($i = 0; $i < $count; $i++) {
            $name = $names[$i] ?? "Demo Tenant {$i}";
            $rows[] = [
                'name' => $name,
                'slug' => str($name)->slug()->value(),
                'logo_url' => null,
                'theme_colors' => json_encode(['primary' => sprintf('oklch(0.55 0.20 %d)', 200 + $i * 30)]),
                'features' => json_encode(['clients' => true, 'routers' => true, 'plans' => true]),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('tenants')->insert($rows);
        $this->components->task("  {$count} tenants", fn () => true);

        $ids = [];

        foreach (DB::table('tenants')->orderBy('id')->pluck('id') as $id) {
            $ids[] = (int) $id;
        }

        return $ids;
    }

    /**
     * @param list<int> $tenantIds
     * @return array<int, list<int>> tenantId => planIds
     */
    private function seedPlans(array $tenantIds, int $total): array
    {
        $now = now();
        $rows = [];
        $perTenant = max(1, intdiv($total, count($tenantIds)));

        foreach ($tenantIds as $tenantId) {
            for ($i = 0; $i < $perTenant; $i++) {
                $speed = [5, 10, 20, 40, 100][$i % 5];
                $rows[] = [
                    'tenant_id' => $tenantId,
                    'name' => "{$speed}Mbps ".['Home', 'Business', 'Lite'][$i % 3],
                    'speed_mbps' => $speed,
                    'price_cents' => $speed * 100_000,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        foreach (array_chunk($rows, self::CHUNK) as $chunk) {
            DB::table('plans')->insert($chunk);
        }

        $this->components->task('  '.count($rows).' plans', fn () => true);

        $planIds = [];

        foreach (DB::table('plans')->orderBy('id')->get(['id', 'tenant_id']) as $plan) {
            $tenantId = (int) $plan->tenant_id;
            $planIds[$tenantId] ??= [];
            $planIds[$tenantId][] = (int) $plan->id;
        }

        return $planIds;
    }

    /**
     * @param list<int> $tenantIds
     * @return array<int, list<int>> tenantId => routerIds
     */
    /**
     * Real Nairobi neighbourhoods, so the network coverage map lands on
     * actual service areas instead of a null island of zeroed coordinates.
     *
     * @return list<array{lat: float, lng: float}>
     */
    private static function nairobiAreas(): array
    {
        return [
            ['lat' => -1.2864, 'lng' => 36.8172], // CBD
            ['lat' => -1.2673, 'lng' => 36.8055], // Westlands
            ['lat' => -1.3193, 'lng' => 36.7076], // Karen
            ['lat' => -1.2921, 'lng' => 36.7820], // Kilimani
            ['lat' => -1.2789, 'lng' => 36.8494], // Eastleigh
            ['lat' => -1.2270, 'lng' => 36.8963], // Kasarani
            ['lat' => -1.3226, 'lng' => 36.8946], // Embakasi
            ['lat' => -1.3568, 'lng' => 36.7523], // Langata
            ['lat' => -1.3000, 'lng' => 36.7667], // Ngong Road
            ['lat' => -1.2007, 'lng' => 36.7833], // Ruaka
        ];
    }

    private function seedRouters(array $tenantIds, int $total): array
    {
        $now = now();
        $rows = [];
        $perTenant = max(1, intdiv($total, count($tenantIds)));
        $areas = self::nairobiAreas();

        foreach ($tenantIds as $t => $tenantId) {
            for ($i = 0; $i < $perTenant; $i++) {
                $area = $areas[$i % count($areas)];
                // A small deterministic scatter so routers sharing an area
                // do not stack on the exact same pin.
                $jitter = (($i % 7) - 3) * 0.006;

                $rows[] = [
                    'tenant_id' => $tenantId,
                    'name' => sprintf('RTR-%02d-%03d', $t + 1, $i + 1),
                    'ip_address' => sprintf('10.%d.%d.1', $t + 1, $i + 1),
                    'location' => json_encode([
                        'lat' => round($area['lat'] + $jitter, 6),
                        'lng' => round($area['lng'] - $jitter, 6),
                    ]),
                    'model' => ['MikroTik CCR2004', 'MikroTik hEX S', 'Ubiquiti EdgeRouter'][$i % 3],
                    'status' => ['online', 'online', 'online', 'degraded', 'offline'][$i % 5],
                    'last_seen_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        foreach (array_chunk($rows, self::CHUNK) as $chunk) {
            DB::table('routers')->insert($chunk);
        }

        $this->components->task('  '.count($rows).' routers', fn () => true);

        $routerIds = [];

        foreach (DB::table('routers')->orderBy('id')->get(['id', 'tenant_id']) as $router) {
            $tenantId = (int) $router->tenant_id;
            $routerIds[$tenantId] ??= [];
            $routerIds[$tenantId][] = (int) $router->id;
        }

        return $routerIds;
    }

    /**
     * @param list<int> $tenantIds
     * @param array<int, list<int>> $planIds
     * @param array<int, list<int>> $routerIds
     */
    private function seedClients(array $tenantIds, array $planIds, array $routerIds, int $total): void
    {
        $bar = $this->output->createProgressBar($total);
        $bar->setFormat('  clients  %current%/%max% [%bar%] %percent:3s%%  %elapsed:6s%');
        $bar->start();

        $data = new DemoData;
        $nowTs = time();
        $tenantCount = count($tenantIds);

        // 540 days of history, strongly weighted towards recent sign-ups, so
        // the list has depth to page through and the chart has a growth curve.
        $signupWeights = $data->dayWeights(540, $nowTs, 0.6, 0.85);
        $expiryWeights = $data->dayWeights(360, $nowTs, 1.0, 0.0);

        $buffer = [];

        for ($i = 0; $i < $total; $i++) {
            $tenantId = $tenantIds[$i % $tenantCount];

            // `$total` is spread evenly across tenants here, so a tenant's own
            // row number is the loop counter divided by the tenant count. The
            // reference seeder gives each tenant a DIFFERENT size and counts per
            // tenant directly - which is why DemoData takes `$n` rather than
            // working this out itself.
            $buffer[] = $data->clientRow(
                $tenantId,
                intdiv($i, $tenantCount),
                $i,
                $planIds[$tenantId] ?? [null],
                $routerIds[$tenantId] ?? [null],
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

    /** @param list<int> $tenantIds */
    private function seedSessions(array $tenantIds, int $total): void
    {
        // Pull the client id range per tenant once, rather than joining per row.
        $ranges = DB::table('clients')
            ->selectRaw('tenant_id, MIN(id) AS min_id, MAX(id) AS max_id, COUNT(*) AS n')
            ->groupBy('tenant_id')
            ->get()
            ->keyBy('tenant_id');

        if ($ranges->isEmpty()) {
            $this->components->warn('  no clients seeded, skipping sessions');

            return;
        }

        $routers = DB::table('routers')->orderBy('id')->get(['id', 'tenant_id'])
            ->groupBy('tenant_id')->map->pluck('id')->map->all()->all();

        $bar = $this->output->createProgressBar($total);
        $bar->setFormat('  sessions %current%/%max% [%bar%] %percent:3s%%  %elapsed:6s%');
        $bar->start();

        $nowTs = time();
        $tenantCount = count($tenantIds);
        $buffer = [];

        $data = new DemoData;
        $sessionWeights = $data->dayWeights(90, $nowTs, 0.45, 0.45);

        for ($i = 0; $i < $total; $i++) {
            $tenantId = $tenantIds[$i % $tenantCount];
            $range = $ranges[$tenantId] ?? null;

            if ($range === null) {
                continue;
            }

            $span = max(1, (int) $range->max_id - (int) $range->min_id + 1);
            $clientId = (int) $range->min_id + (($i * 7) % $span);
            $tenantRouters = $routers[$tenantId] ?? [null];

            $startedOffset = $data->offsetFor($i, $sessionWeights, 29);
            // One session in six is still live, which gives the Phase 8 live
            // view something to patch without needing a generator process.
            $isLive = ($i % 6) === 0;

            $buffer[] = [
                'tenant_id' => $tenantId,
                'client_id' => $clientId,
                'router_id' => $tenantRouters[$i % count($tenantRouters)],
                'status' => $isLive ? 'online' : 'offline',
                'ip_address' => sprintf('100.%d.%d.%d', ($i % 250) + 1, (intdiv($i, 250) % 250) + 1, ($i % 253) + 2),
                'bytes_in' => ($i * 104_729) % 50_000_000_000,
                'bytes_out' => ($i * 15_485_863) % 20_000_000_000,
                'started_at' => date('Y-m-d H:i:s', $nowTs - $startedOffset),
                'ended_at' => $isLive ? null : date('Y-m-d H:i:s', $nowTs - $startedOffset + 3600),
                'created_at' => date('Y-m-d H:i:s', $nowTs - $startedOffset),
                'updated_at' => date('Y-m-d H:i:s', $nowTs - $startedOffset),
            ];

            if (count($buffer) >= self::CHUNK) {
                DB::table('client_sessions')->insert($buffer);
                $bar->advance(count($buffer));
                $buffer = [];
            }
        }

        if ($buffer !== []) {
            DB::table('client_sessions')->insert($buffer);
            $bar->advance(count($buffer));
        }

        $bar->finish();
        $this->newLine();
    }

    /**
     * Mail and chat for every panel USER, not every tenant.
     *
     * These screens are per person: an inbox belongs to whoever is signed in,
     * so seeding per tenant would leave the demo user with an empty mailbox
     * whenever they were not the first user of their tenant - which is exactly
     * how a seeded feature ends up looking broken.
     *
     * Small on purpose. Mail and chat are not the volume story; clients and
     * sessions are. A million rows here would slow every reseed for no
     * additional confidence.
     */
    /** @param list<int> $tenantIds */
    private function seedInbox(array $tenantIds): void
    {
        $users = DB::table('users')->whereIn('tenant_id', $tenantIds)->get(['id', 'tenant_id', 'name', 'email']);

        if ($users->isEmpty()) {
            $this->components->warn('  no panel users, skipping mail and chat');

            return;
        }

        $senders = [
            ['Amina Achieng', 'amina.achieng@example.co.ke'],
            ['Felix Mwangi', 'felix.mwangi@example.co.ke'],
            ['Patience Ekwaro', 'p.ekwaro@example.co.ke'],
            ['Kevin Peters', 'kevin.peters@example.co.ke'],
            ['Network Operations', 'noc@example.co.ke'],
            ['Billing', 'billing@example.co.ke'],
        ];

        /*
         * Subject, body, and the LABEL it carries.
         *
         * The category is a property of the message rather than of the sender:
         * the same person raises a billing query one week and a fault the next,
         * and deriving the label from the sender would make every one of their
         * messages the same colour - which reads as a rule the user cannot see.
         */
        $subjects = [
            ['Connection dropping in the evenings', 'Since Tuesday the line drops around 8pm and comes back after a few minutes.', 'Support'],
            ['Upgrade to 20Mbps?', 'We would like to move up a plan before the end of the month.', 'Sales'],
            ['Invoice query', 'The last invoice shows two months. Could you check?', 'Finance'],
            ['Router replacement', 'The unit at the Kiambaa site is showing a red light.', 'Support'],
            ['Scheduled maintenance', 'Fibre splicing on the north route, Sunday 02:00 to 05:00.', 'System'],
            ['New installation request', 'A neighbour has asked about coverage on our street.', 'Sales'],
            ['Payment confirmation', 'Transfer sent this morning, reference 88213.', 'Finance'],
            ['Speed test results', 'Attached are the results from this week, as requested.', 'Update'],
            ['Unusual sign-in on your account', 'We noticed a sign-in from a new device. Review it if this was not you.', 'Security'],
            ['Team appreciation lunch', 'Mark your calendars for Friday. Everyone on the ops rota is invited.', 'HR'],
        ];

        /* The reply that turns a message into a thread. */
        $replies = [
            'Thanks for flagging this - I have logged it and someone will be on site tomorrow.',
            'Noted. I have queued the change so it takes effect at the start of the next cycle.',
            'Checked, and you are right. A credit note is going out this afternoon.',
            'Confirmed on our side. Let me know if anything else looks off.',
        ];

        $folders = ['inbox', 'inbox', 'inbox', 'inbox', 'archived', 'sent', 'spam'];

        $mail = [];
        $now = time();
        $n = 0;

        /*
         * THREAD IDS ARE ASSIGNED BEFORE INSERT, which means they cannot be the
         * root's real primary key here - a bulk insert does not hand ids back.
         * A counter offset well past any seeded id keeps them unique without a
         * second pass to rewrite them, and the read path only ever groups by the
         * column, never joins it to `id`.
         */
        $thread = 1_000_000;

        foreach ($users as $user) {
            for ($i = 0; $i < 40; $i++) {
                [$name, $email] = $senders[$n % count($senders)];
                [$subject, $body, $category] = $subjects[$n % count($subjects)];
                $offset = ($n * 7717) % (86400 * 21);
                $n++;
                $thread++;

                $at = $now - $offset;
                $folder = $folders[$i % count($folders)];

                $mail[] = [
                    'user_id' => $user->id,
                    'tenant_id' => $user->tenant_id,
                    'folder' => $folder,
                    'thread_id' => $thread,
                    'from_name' => $name,
                    'from_email' => $email,
                    'to_name' => $user->name,
                    'to_email' => $user->email,
                    'subject' => $subject,
                    'category' => $category,
                    'preview' => mb_substr($body, 0, 90),
                    'body' => $body."\n\n".'Thanks,'."\n".$name,
                    'is_read' => $i % 3 !== 0,
                    'is_starred' => $i % 7 === 0,
                    'is_important' => $i % 6 === 0,
                    'has_attachment' => $i % 5 === 0,
                    'received_at' => date('Y-m-d H:i:s', $at),
                    'created_at' => date('Y-m-d H:i:s', $at),
                    'updated_at' => date('Y-m-d H:i:s', $at),
                ];

                // Every third thread has an answer, so the detail view has
                // something to be a THREAD of rather than one message with a
                // count of one under it.
                if ($i % 3 !== 0) {
                    continue;
                }

                $repliedAt = $at + 1260;

                $mail[] = [
                    'user_id' => $user->id,
                    'tenant_id' => $user->tenant_id,
                    'folder' => $folder,
                    'thread_id' => $thread,
                    // The reply runs the other way: the signed-in user answered.
                    'from_name' => $user->name,
                    'from_email' => $user->email,
                    'to_name' => $name,
                    'to_email' => $email,
                    'subject' => $subject,
                    'category' => $category,
                    'preview' => mb_substr($replies[$n % count($replies)], 0, 90),
                    'body' => $replies[$n % count($replies)],
                    'is_read' => true,
                    'is_starred' => false,
                    'is_important' => false,
                    'has_attachment' => false,
                    'received_at' => date('Y-m-d H:i:s', $repliedAt),
                    'created_at' => date('Y-m-d H:i:s', $repliedAt),
                    'updated_at' => date('Y-m-d H:i:s', $repliedAt),
                ];
            }
        }

        foreach (array_chunk($mail, self::CHUNK) as $chunk) {
            DB::table('mail_messages')->insert($chunk);
        }

        $contacts = ['Amina Achieng', 'Felix Mwangi', 'Patience Ekwaro', 'Kevin Peters', 'Rose Simiyu', 'Moses Otieno'];
        $statuses = ['online', 'away', 'offline'];
        $lines = [
            'Is the line back up on your side?',
            'Thanks, that fixed it.',
            'Can someone come out on Thursday?',
            'Invoice received, payment going out today.',
            'The router is blinking red again.',
            'All good now, appreciate the quick help.',
        ];

        $c = 0;

        foreach ($users as $user) {
            foreach ($contacts as $contact) {
                $last = $now - (($c * 5407) % (86400 * 3));

                $conversationId = DB::table('chat_conversations')->insertGetId([
                    'user_id' => $user->id,
                    'tenant_id' => $user->tenant_id,
                    'contact_name' => $contact,
                    'contact_email' => str($contact)->lower()->replace(' ', '.')->value().'@example.co.ke',
                    'status' => $statuses[$c % 3],
                    'last_message' => $lines[$c % count($lines)],
                    'last_message_at' => date('Y-m-d H:i:s', $last),
                    'unread_count' => $c % 4 === 0 ? ($c % 3) + 1 : 0,
                    'created_at' => date('Y-m-d H:i:s', $last),
                    'updated_at' => date('Y-m-d H:i:s', $last),
                ]);

                $thread = [];

                for ($m = 0; $m < 12; $m++) {
                    $at = $last - ((12 - $m) * 900);

                    $thread[] = [
                        'conversation_id' => $conversationId,
                        'tenant_id' => $user->tenant_id,
                        'direction' => $m % 2 === 0 ? 'incoming' : 'outgoing',
                        'body' => $lines[($c + $m) % count($lines)],
                        'sent_at' => date('Y-m-d H:i:s', $at),
                        'created_at' => date('Y-m-d H:i:s', $at),
                        'updated_at' => date('Y-m-d H:i:s', $at),
                    ];
                }

                DB::table('chat_messages')->insert($thread);
                $c++;
            }
        }

        $this->components->info('  mail and chat seeded for '.$users->count().' users');
    }
}
