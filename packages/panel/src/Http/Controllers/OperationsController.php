<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Alxtexh\Panel\Alerts\Telegram;
use Alxtexh\Panel\Audit\AuditRecorder;
use Alxtexh\Panel\Jobs\RestoreBackup;
use Alxtexh\Panel\Jobs\RunBackupNow;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\Ability;
use Alxtexh\Panel\Support\BackupArchive;
use Alxtexh\Panel\Support\BackupDestinationProbe;
use Alxtexh\Panel\Support\BackupSettings;
use Alxtexh\Panel\Support\BackupStatus;
use Alxtexh\Panel\Support\OperationStatus;
use Alxtexh\Panel\Support\DatabaseInspector;
use Alxtexh\Panel\Support\HealthReport;
use Alxtexh\Panel\Support\InstallationState;
use Alxtexh\Panel\Support\LogReader;
use Alxtexh\Panel\Support\MonitorSampler;
use Alxtexh\Panel\Support\PanelSettings;
use Alxtexh\Panel\Support\PlatformReport;
use Alxtexh\Panel\Support\Tenants;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * The installation's own health: backups and logs.
 *
 * MOVED FROM THE REFERENCE APP. Every service it leans on was already in this
 * package - `BackupStatus`, `BackupArchive`, `BackupSettings`, `LogReader`,
 * `MonitorSampler` - and only the two jobs were not, so an installation had all
 * the machinery and no screens to reach it from.
 *
 * IT NAMES NO ROUTES. Every redirect is `back()`, and every URL the screens post
 * to arrives as a prop, built from the CURRENT PANEL'S PATH - which is what lets
 * a second portal mount these under its own prefix and get screens that post
 * back to themselves rather than into the first portal.
 *
 * THE ABILITIES ARE NOT RESOURCE POLICIES. Nothing here belongs to an
 * organisation - the backup covers every tenant at once and a stack trace
 * routinely names records from several - so the usual per-resource
 * authorisation would be answering the wrong question.
 *
 * TWO OF THEM, NOT ONE. `view_operations` opens these screens; `manage_backups`
 * is what deletes a snapshot, changes the schedule or restores over the live
 * database. Everyone on an operations rota needs the first, and a much smaller
 * circle should have the second - which a single ability makes impossible to
 * express.
 *
 * EVERY DESTRUCTIVE ACTION IS AUDITED, and audited with the acting user rather
 * than after the fact. A snapshot that vanished with nothing recording who
 * removed it is indistinguishable from a snapshot that was never taken.
 */
final class OperationsController
{
    /**
     * The URLs the screens post to, resolved from this controller's own routes.
     *
     * WHY THE CLIENT IS TOLD RATHER THAN ASKED TO KNOW. A packaged screen has
     * no Wayfinder output to import - a consuming application's route names are
     * its own - so every URL it needs travels with the page. That also means an
     * installation may mount these anywhere: change the route and the screen
     * follows, with nothing else edited.
     *
     * `back()` IS THE ONLY REDIRECT anywhere in this class, for the same reason.
     *
     * @return array<string, string>
     */
    private function backupRoutes(): array
    {
        return [
            'run' => $this->at('operations/backups/run'),
            'delete' => $this->at('operations/backups'),
            'restore' => $this->at('operations/backups/restore'),
            'download' => $this->at('operations/backups/download'),
            'configure' => $this->at('operations/backups/settings'),
        ];
    }

    /**
     * A URL under the panel these screens are mounted in.
     *
     * THE PREFIX COMES FROM THE PANEL RATHER THAN THE REQUEST, because the two
     * disagree exactly where it matters: an application that mounts this
     * controller itself, outside any panel, has no prefix at all - and reading
     * one off the request would then borrow whatever segment happened to be
     * first.
     */
    private function at(string $path): string
    {
        $prefix = app(PanelManager::class)->currentPanel()?->getPath() ?? '';

        return url(trim($prefix.'/'.$path, '/'));
    }

    /**
     * @return array<string, string>
     */
    private function backupSettingsRoutes(): array
    {
        return [
            'save' => $this->at('operations/backups/settings'),
            'testDestination' => $this->at('operations/backups/destinations/test'),
            'testTelegram' => $this->at('operations/alerts/telegram/test'),
            // `__id__` is substituted client-side; see the screen's prop doc.
            'restoreHistory' => $this->at('operations/backups/settings/history/__id__/restore'),
            'backups' => $this->at('operations/backups'),
        ];
    }

    public function backups(Request $request): Response
    {
        abort_unless(Ability::allows($request->user(), 'view_operations'), 403);

        $settings = BackupSettings::load();

        return Inertia::render('operations/Backups', [
            'routes' => $this->backupRoutes(),
            'status' => (new BackupStatus)->summary(),
            /*
             * THE LAST MANUAL RUN, so the button is not a black hole. A job
             * dispatched with no feedback is worse than no button: the operator
             * believes a backup exists.
             */
            /*
             * READ FROM INSTALLATION STATE, NOT THE CACHE. The scheduler runs
             * `backup:run` with no tenant and cache keys are tenant-prefixed, so
             * a nightly run's outcome was written somewhere this page could
             * never read - the screen simply showed nothing and looked like a
             * backup that had never been started.
             */
            'lastRun' => app(OperationStatus::class)->get(RunBackupNow::STATE_KEY),
            'lastRestore' => app(OperationStatus::class)->get(RestoreBackup::STATE_KEY),

            /*
             * THE MAINTENANCE BYPASS FOR THE RESTORE JUST STARTED.
             *
             * A PROP RATHER THAN A TOAST, because a toast disappears and this is
             * the one string that must not be lost: the restore closes the panel
             * a minute from now, and without this link the operator watches
             * their own restore from a 503 page. It is flashed once, so it is
             * gone on the next navigation - which is correct, because so is the
             * restore.
             */
            'restoreBypass' => $request->session()->get('restoreBypass'),
            // REDACTED, not raw. The Telegram bot token grants full control of
            // the bot; it is stored, applied, and never sent back to a browser.
            'settings' => $settings->redacted(),
            'schedule' => $settings->describe(),
            // Who last changed the policy, and when. The column was written and
            // never read, which made it decoration rather than a record.
            'settingsChangedBy' => app(PanelSettings::class)->provenance(BackupSettings::KEY),
            /*
             * THE DISKS THIS INSTALLATION ACTUALLY HAS. Offering a free-text
             * disk name would let an operator save one that does not exist,
             * and Spatie throws on an unknown disk mid-run with
             * `continue_on_failure` false - so the setting meant to add a
             * second copy would silently stop the first being taken.
             */
            'disks' => array_keys((array) config('filesystems.disks', [])),
            /*
             * WHO HAS DONE WHAT TO THE BACKUPS, ACROSS THE WHOLE INSTALLATION.
             *
             * NOT ON THE ACTIVITY SCREEN, deliberately. That screen is one
             * organisation's own trail and is scoped to it - showing another
             * tenant's operator there would be a leak, however defensible the
             * event. These entries belong to the installation, so they belong on
             * the installation's screen, behind the ability that opens it.
             *
             * A SHORT LIST, NEWEST FIRST. This is a "what just happened" panel,
             * not an archive; the full trail is the table.
             */
            'history' => DB::table('audit_entries')
                ->where('scope', AuditRecorder::SCOPE_INSTALLATION)
                ->orderByDesc('created_at')
                ->limit(15)
                ->get(['event', 'actor_name', 'changes', 'ip_address', 'created_at'])
                ->map(static fn (object $row): array => [
                    'event' => $row->event,
                    'actor' => $row->actor_name,
                    'snapshot' => json_decode((string) $row->changes, true)['snapshot']['to'] ?? null,
                    'ip' => $row->ip_address,
                    'at' => $row->created_at,
                ])
                ->all(),

            'tenants' => array_map(
                static fn ($tenant): array => Tenants::toArray($tenant),
                Tenants::all(),
            ),
            'databases' => (new DatabaseInspector)->connections(),

            'can' => [
                'manage' => (bool) Ability::allows($request->user(), 'manage_backups'),
            ],
        ]);
    }

    /**
     * The backup policy, on a page of its own.
     *
     * IT WAS A DIALOG, AND IT HAD OUTGROWN ONE. Nineteen controls across four
     * unrelated subjects - when it runs, how long copies live, where they go,
     * who is told - inside a box that scrolls independently of the page behind
     * it. A dialog is for one decision you can hold in your head while the thing
     * underneath stays visible and relevant; none of that was true here. The
     * page behind it was a list of snapshots nobody was reading, and the
     * scheduling half was off screen while somebody typed a bot token.
     *
     * A PAGE ALSO GIVES THE SETTINGS A URL, which a dialog cannot. "Send me the
     * retention screen" and a bookmark both work now, and the back button means
     * what it says.
     *
     * THE SAME PROPS AS THE LIST, deliberately. Both screens describe one
     * policy, and a second shape for the same data is a second thing to keep in
     * step.
     */
    public function backupSettings(Request $request): Response
    {
        abort_unless(Ability::allows($request->user(), 'view_operations'), 403);

        $settings = BackupSettings::load();

        return Inertia::render('operations/BackupSettings', [
            'routes' => $this->backupSettingsRoutes(),
            // Redacted: the bot token is stored, applied, and never sent back.
            'settings' => $settings->redacted(),
            'schedule' => $settings->describe(),
            'settingsChangedBy' => app(PanelSettings::class)->provenance(BackupSettings::KEY),
            'history' => $this->settingsHistory(),
            'disks' => array_keys((array) config('filesystems.disks', [])),
            'can' => [
                'manage' => (bool) Ability::allows($request->user(), 'manage_backups'),
            ],
        ]);
    }

    /**
     * The policy's own timeline - roadmap 7.2.
     *
     * DESCRIBED, NOT DUMPED. Each entry is the same one-sentence summary the
     * screen already shows for the current policy (`describe()`), read
     * through the same redaction the current one gets, rather than a raw
     * JSON diff nobody not already fluent in this schema could act on.
     *
     * @return list<array{id: int, description: string, by: string|null, at: string}>
     */
    private function settingsHistory(): array
    {
        return array_map(
            static fn (array $entry): array => [
                'id' => $entry['id'],
                'description' => BackupSettings::fromArray((array) $entry['value'])->describe(),
                'by' => $entry['by'],
                'at' => $entry['at'],
            ],
            app(PanelSettings::class)->history(BackupSettings::KEY),
        );
    }

    /**
     * Take a backup now.
     *
     * QUEUED AND LOCKED - see `RunBackupNow`. This endpoint only asks; it never
     * waits.
     */
    public function runBackup(Request $request): RedirectResponse
    {
        abort_unless(Ability::allows($request->user(), 'view_operations'), 403);

        $tenantId = $request->input('tenant');

        if ($tenantId !== null && $tenantId !== '') {
            abort_unless(Tenants::find(is_numeric($tenantId) ? $tenantId : (string) $tenantId) !== null, 422, 'No such tenant.');
        }

        RunBackupNow::dispatch(
            $request->user()?->name,
            $tenantId === null || $tenantId === '' ? null : $tenantId,
        );

        return back()->with('toast', [
            'type' => 'success',
            'message' => $tenantId
                ? 'Tenant backup started. This page will show the outcome.'
                : 'Backup started. This page will show the outcome.',
        ]);
    }

    /**
     * Send a snapshot to the browser.
     *
     * STREAMED, NOT READ. A snapshot is hundreds of megabytes; `->get()` would
     * hold all of it in memory per concurrent download, and the first person to
     * click twice takes the worker down.
     *
     * THE NAME IS RESOLVED AGAINST THE REAL LIST, never concatenated - see
     * `BackupArchive`. `?path=../../.env` is the whole reason this method does
     * not simply trust its input.
     */
    public function downloadBackup(Request $request): StreamedResponse
    {
        abort_unless(Ability::allows($request->user(), 'view_operations'), 403);

        $archive = new BackupArchive;
        $path = $archive->resolve((string) $request->query('path', ''));

        abort_if($path === null, 404, 'No such snapshot.');

        $this->audit($request, 'backup.downloaded');

        return Storage::disk($archive->diskName())->download($path, basename($path));
    }

    /**
     * Remove one or more snapshots.
     *
     * THE GUARD THAT MATTERS - never leaving zero - lives in `BackupArchive`,
     * not here, because this endpoint is not the only way in and a rule enforced
     * at one entrance is not enforced.
     */
    public function deleteBackups(Request $request): RedirectResponse
    {
        abort_unless(Ability::allows($request->user(), 'manage_backups'), 403);

        $validated = $request->validate([
            'paths' => ['required', 'array', 'min:1', 'max:100'],
            'paths.*' => ['required', 'string'],
        ]);

        $result = (new BackupArchive)->delete($validated['paths']);

        if ($result['deleted'] === []) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => $result['reason'] ?? 'Nothing was deleted.',
            ]);
        }

        $this->audit($request, 'backup.deleted', $result['deleted']);

        $count = count($result['deleted']);

        return back()->with('toast', [
            'type' => 'success',
            'message' => $count === 1
                ? 'Snapshot deleted.'
                : "{$count} snapshots deleted.",
        ]);
    }

    /**
     * Restore the database from a snapshot.
     *
     * THE TYPED CONFIRMATION IS CHECKED HERE, on the server. A dialog that only
     * enables its button once the right text is typed is a courtesy to somebody
     * paying attention and no obstacle at all to a mis-aimed request - and this
     * is the one action on the screen that cannot be undone by clicking again.
     */
    public function restoreBackup(Request $request): RedirectResponse
    {
        abort_unless(Ability::allows($request->user(), 'manage_backups'), 403);

        $validated = $request->validate([
            'path' => ['required', 'string'],
            'confirm' => ['required', 'string'],
        ]);

        $archive = new BackupArchive;
        $path = $archive->resolve($validated['path']);

        abort_if($path === null, 404, 'No such snapshot.');

        if ($validated['confirm'] !== basename($path)) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'The confirmation did not match the snapshot name. Nothing was restored.',
            ]);
        }

        $this->audit($request, 'backup.restore-started', [$path]);

        /*
         * THE BYPASS IS MINTED HERE, NOT IN THE JOB.
         *
         * The restore closes the panel while it swaps the database - without
         * that, everybody still working keeps writing to the file about to be
         * renamed away, and those writes vanish with it. But the operator who
         * pressed this is the one person who needs the panel while it runs, and
         * by the time the worker picks the job up everybody is already looking
         * at a 503. So the secret exists before the doors close, and it is
         * handed over in the same response that says the restore started - the
         * last moment anything can be read.
         *
         * SINGLE USE, because `up` invalidates it. It is not a standing key.
         */
        $bypass = bin2hex(random_bytes(16));

        RestoreBackup::dispatch($path, $request->user()?->name, $bypass);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Restore started. A safety backup is taken first.',
        ])->with('restoreBypass', $bypass);
    }

    /**
     * Save the schedule, retention, destinations and alerts.
     *
     * VALIDATED AGAINST WHAT EXISTS, not against a shape. A disk name is checked
     * against the configured disks and a frequency against the supported set,
     * because the failure mode of a plausible-but-wrong value here is a backup
     * that stops being taken - which nothing notices until a restore.
     */
    public function saveBackupSettings(Request $request): RedirectResponse
    {
        abort_unless(Ability::allows($request->user(), 'manage_backups'), 403);

        $validated = $request->validate([
            'frequency' => ['required', 'string', 'in:'.implode(',', BackupSettings::FREQUENCIES)],
            'time' => ['required', 'string', 'regex:/^([01]\d|2[0-3]):[0-5]\d$/'],
            'weekday' => ['required', 'integer', 'between:1,7'],
            // 28 IS THE CEILING, not 31. The 29th, 30th and 31st do not exist in
            // every month and the schedule simply does not fire when the day is
            // absent, so "the 31st" would silently skip five months a year.
            'dayOfMonth' => ['required', 'integer', 'between:1,28'],
            'keepDays' => ['required', 'integer', 'between:1,3650'],
            'maxMegabytes' => ['nullable', 'integer', 'min:100'],
            'destinations' => ['required', 'array', 'min:1'],
            'destinations.*' => ['required', 'string', 'in:'.implode(',', array_keys((array) config('filesystems.disks', [])))],
            'alertEmail' => ['nullable', 'email'],
            'alertTelegramChatId' => ['nullable', 'string', 'max:64'],
            'alertTelegramToken' => ['nullable', 'string', 'max:128'],
            'notifyOnSuccess' => ['required', 'boolean'],
        ]);

        /*
         * AN ABSENT TOKEN MEANS "LEAVE IT ALONE", never "clear it".
         *
         * The screen is never sent the stored token, so the field it posts back
         * is empty unless somebody typed a new one. Taking that at face value
         * would make editing the retention period silently delete a working
         * credential - a setting that breaks itself when an unrelated one is
         * changed.
         */
        if (($validated['alertTelegramToken'] ?? null) === null || $validated['alertTelegramToken'] === '') {
            $validated['alertTelegramToken'] = BackupSettings::load()->alertTelegramToken;
        }

        // Round-tripped through the value object so what is stored is what will
        // be read back - clamped, deduplicated, and with `local` guaranteed.
        $settings = BackupSettings::fromArray($validated);

        /*
         * A DESTINATION IS PROVED BEFORE IT IS SAVED.
         *
         * Validating that a disk is CONFIGURED is not the same as knowing it
         * works, and the gap between them is the worst kind: an `s3` entry with
         * empty credentials passes every check a form can make, saves happily,
         * and fails on the first nightly run. `continue_on_failure` is false, so
         * that failure takes the whole backup with it - adding an off-site copy
         * silently removes the local one, and nobody finds out until a restore.
         *
         * REFUSED, NOT WARNED. A warning on a settings screen is a warning
         * somebody dismisses, and the consequence here is having no backups at
         * all. The operator can still reach the destination they wanted; they
         * just have to fix it first.
         */
        $broken = array_values(array_filter(
            (new BackupDestinationProbe)->checkAll($settings->destinations),
            static fn (array $result): bool => ! $result['ok'],
        ));

        if ($broken !== []) {
            return back()->withErrors([
                'destinations' => 'Nothing was saved. '.implode(' ', array_map(
                    static fn (array $r): string => "{$r['disk']}: {$r['message']}",
                    $broken,
                )),
            ]);
        }

        app(PanelSettings::class)->put(
            BackupSettings::KEY,
            $settings->toArray(),
            $request->user()?->name,
        );

        $this->audit($request, 'backup.settings-changed');

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Backup settings saved. '.$settings->describe().'.',
        ]);
    }

    /**
     * Put a past version of the policy back - roadmap 7.2.
     *
     * THE SAME PATH AS SAVING, not a shortcut around it. A restore is "load
     * an old value, then do exactly what Save does": round-tripped through
     * `BackupSettings::fromArray()` so a value that predates a validation
     * rule cannot resurrect it, and through the destination probe so
     * restoring a policy whose off-site disk credentials rotated out from
     * under it fails loudly here rather than on the next scheduled run.
     *
     * A NEW HISTORY ROW, NOT A REWIND. `put()` appends; restoring writes the
     * old value as a new entry with today's date, so the timeline still
     * reads top-to-bottom as what actually happened, in order - a restore
     * is itself a change, and un-does nothing that cannot itself be undone
     * the same way.
     */
    public function restoreBackupSettingsHistory(Request $request, int $history): RedirectResponse
    {
        abort_unless(Ability::allows($request->user(), 'manage_backups'), 403);

        $entry = app(PanelSettings::class)->historyEntry(BackupSettings::KEY, $history);

        abort_if($entry === null, 404, 'That version of the settings no longer exists.');

        $settings = BackupSettings::fromArray((array) $entry['value']);

        $broken = array_values(array_filter(
            (new BackupDestinationProbe)->checkAll($settings->destinations),
            static fn (array $result): bool => ! $result['ok'],
        ));

        if ($broken !== []) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Nothing was restored. '.implode(' ', array_map(
                    static fn (array $r): string => "{$r['disk']}: {$r['message']}",
                    $broken,
                )),
            ]);
        }

        app(PanelSettings::class)->put(
            BackupSettings::KEY,
            $settings->toArray(),
            $request->user()?->name,
        );

        $this->audit($request, 'backup.settings-restored');

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Restored: '.$settings->describe().'.',
        ]);
    }

    /**
     * Try a destination without committing to it.
     *
     * SEPARATE FROM SAVING, because the two questions are asked at different
     * moments. Saving refuses a broken disk, which is right and is also the
     * worst time to find out - the operator has a half-filled form and an error
     * they cannot investigate from there. This answers "is this bucket right"
     * while they still have the credentials open in another tab.
     *
     * THROTTLED, because it makes an outbound request per call and the button is
     * next to a text field somebody is editing.
     */
    public function testBackupDestination(Request $request): RedirectResponse
    {
        abort_unless(Ability::allows($request->user(), 'manage_backups'), 403);

        $validated = $request->validate([
            'disk' => ['required', 'string', 'in:'.implode(',', array_keys((array) config('filesystems.disks', [])))],
        ]);

        $result = (new BackupDestinationProbe)->check($validated['disk']);

        return back()->with('toast', [
            'type' => $result['ok'] ? 'success' : 'error',
            'message' => "{$result['disk']}: {$result['message']} ({$result['ms']}ms)",
        ]);
    }

    /**
     * Send a real message to the alert chat, and report what happened.
     *
     * A SEND, NOT A CREDENTIAL CHECK. Validating the token proves the bot
     * exists and proves nothing about whether the chat id is right, whether the
     * bot was ever added to that group, or whether somebody removed it last
     * week - and all three fail the same way at three in the morning: silence.
     * This walks the whole path the next real alert will take.
     *
     * IT USES WHAT IS IN THE FORM, not only what is saved, so a token can be
     * tested before it is committed. That is the sequence somebody actually
     * performs: paste, test, save.
     */
    public function testTelegram(Request $request): RedirectResponse
    {
        abort_unless(Ability::allows($request->user(), 'manage_backups'), 403);

        $validated = $request->validate([
            'token' => ['nullable', 'string', 'max:200'],
            'chat_id' => ['nullable', 'string', 'max:100'],
        ]);

        /*
         * APPLIED FOR THIS REQUEST ONLY. `config()` is per-process, and this
         * process ends with the response - nothing is persisted, so a test with
         * a mistyped token cannot leave the installation alerting through it.
         */
        if (($validated['token'] ?? null) !== null && trim((string) $validated['token']) !== '') {
            config(['services.telegram.token' => trim((string) $validated['token'])]);
        }

        $result = Telegram::test($validated['chat_id'] ?? null);

        return back()->with('toast', [
            'type' => $result['ok'] ? 'success' : 'error',
            'message' => $result['message'],
        ]);
    }

    /**
     * What this installation is actually running.
     *
     * READ-ONLY, AND THAT IS THE DESIGN. Nothing here writes: a screen that
     * could change the queue driver is a screen that can take the installation
     * down from a browser, and the settings that genuinely belong at runtime
     * already have their own homes. Configuration that belongs in a deploy stays
     * in the deploy.
     *
     * `view_operations` RATHER THAN `manage_backups`, because looking at the
     * environment changes nothing - and the person diagnosing a problem is
     * usually not the person allowed to restore over the database.
     */
    /**
     * How the installation is DOING, not what it is configured as.
     *
     * THE PAGE WAS THE WRONG ANSWER TO THE RIGHT QUESTION. `PlatformReport`
     * lists versions, drivers and the tenancy mode - a deploy-time question
     * somebody asks once. The question an operator has at three in the afternoon
     * is whether the disk is filling, the queue is backing up, anything has
     * failed and the database is still quick, and none of that was anywhere.
     *
     * BOTH ARE HERE, in that order: the health first, because it changes and it
     * is why somebody opened the page; the configuration below it, because it is
     * still the fastest way to answer "what is this actually running".
     */
    public function monitoring(Request $request): Response
    {
        abort_unless(Ability::allows($request->user(), 'view_operations'), 403);

        return Inertia::render('operations/Monitoring', [
            ...(new PlatformReport)->all(),
            'health' => (new HealthReport)->all(),
            'routes' => [
                'metrics' => $this->at('operations/monitoring/metrics'),
            ],
            /*
             * Roadmap 5.3: yesterday, visible. One compact row per scheduler
             * tick; empty until `panel:monitor-sample` has run, and the page
             * says so rather than drawing an empty chart.
             */
            'history' => app(MonitorSampler::class)->history(),
            'thresholds' => MonitorSampler::thresholds(),
        ]);
    }

    /**
     * The same numbers, as JSON, for the page to poll.
     *
     * SEPARATE FROM THE RENDER so a refresh costs one small response rather than
     * a whole Inertia page with its schema, navigation and shared props. The
     * configuration half does not change between ticks, so it is not resent.
     */
    public function metrics(Request $request): JsonResponse
    {
        abort_unless(Ability::allows($request->user(), 'view_operations'), 403);

        return response()->json((new HealthReport)->all());
    }

    public function logs(Request $request): Response
    {
        abort_unless(Ability::allows($request->user(), 'view_operations'), 403);

        $reader = new LogReader;

        /*
         * THE FILE IS CHOSEN BY NAME AND VALIDATED AGAINST THE LIST inside the
         * reader - never concatenated into a path here. See `LogReader::tail`:
         * the naive version of this endpoint reads any file on the server.
         */
        return Inertia::render('operations/Logs', [
            'routes' => ['logs' => $this->at('operations/logs')],
            'files' => $reader->files(),
            'tail' => $reader->tail(
                $request->query('file') === null ? null : (string) $request->query('file'),
                needle: (string) $request->query('q', ''),
            ),
            'query' => (string) $request->query('q', ''),
        ]);
    }

    /**
     * Record who did this, against the acting user.
     *
     * AGAINST THE USER, NOT THE SNAPSHOT, because the audit trail is
     * model-and-tenant shaped and a zip file on a disk is neither. What matters
     * is preserved either way: the person, the time, the address, and which
     * files it was.
     *
     * @param  list<string>  $paths
     */
    private function audit(Request $request, string $event, array $paths = []): void
    {
        $user = $request->user();

        if ($user === null) {
            return;
        }

        app(AuditRecorder::class)->record(
            $user,
            $event,
            $paths === [] ? [] : ['snapshot' => implode(', ', array_map('basename', $paths))],
            /*
             * INSTALLATION SCOPE, not the actor's organisation.
             *
             * A snapshot covers every tenant at once. Filing this under
             * whichever one the operator happened to be signed into said
             * something true - where they were standing - and hid something
             * truer: that the effect did not stop there, and that no other
             * organisation could see it had happened. `tenant_id` still records
             * the first fact; this records the second.
             */
            AuditRecorder::SCOPE_INSTALLATION,
        );
    }
}
