<script setup lang="ts">
/**
 * MOVED FROM THE REFERENCE APP.
 *
 * TWO SUBSTITUTIONS, and only two. Its Wayfinder route helpers became a
 * `routes` prop, because a package cannot know a consuming application's route
 * names; and `defineOptions({
    // Page props arrive as attributes and this root is a fragment.
    inheritAttrs: false, layout })` is gone, because the layout is the
 * consumer's to apply - `panel:install` writes a one-line page file, and that
 * file's resolver decides the frame.
 */
/**
 * Backup health, and the things an operator needs to do about it.
 *
 * THE HEADLINE IS THE AGE, not the list. A directory full of snapshots from
 * March looks exactly like a healthy one until somebody reads the dates - which
 * is always after they were needed. So the page leads with how old the newest
 * one is and says plainly when that is too old; the file list is supporting
 * detail underneath.
 *
 * IT USED TO BE READ-ONLY, and that was wrong. A screen that lists snapshots and
 * offers nothing to do with them is a fire extinguisher behind glass with no
 * hammer: an operator can see the backup exists and still has to find somebody
 * with a shell to use it. Download, delete, restore and the schedule are all
 * here now.
 *
 * EVERY DESTRUCTIVE ACTION GOES THROUGH `PkModal`, NEVER `window.confirm`. That
 * is not a style preference - `confirm()` is suppressed outright in embedded
 * browsers, so the dialog never appears, the handler never runs, and the button
 * looks broken. It has cost this project three separate bugs.
 *
 * THE CONFIRMATIONS ARE COURTESIES, NOT GUARDS. Every one of these is re-checked
 * on the server: the ability, the snapshot name, the typed confirmation, and the
 * refusal to delete the last remaining copy. A client that skipped this page
 * entirely gets a 403 or a 422, not a deletion.
 */
import { Head, router } from '@inertiajs/vue3'
/*
 * GENERATED FROM THE ROUTES, not typed out.
 *
 * A literal `'/operations/backups/restore'` is a string the compiler cannot
 * check and the router does not know about - so renaming the route leaves this
 * file pointing at a 404 that nothing reports until somebody clicks it. These
 * helpers are regenerated from `route:list` on every build, so the same rename
 * breaks the build instead.
 */
import { Download, RotateCcw, Settings2, Trash2, TriangleAlert } from '@lucide/vue'
import { computed, ref } from 'vue'
import { PkModal, PkStepIndicator } from '@alxtexh-enterprise/panel'
import { PkButton as Button } from '@alxtexh-enterprise/panel'

interface Snapshot {
    path: string
    bytes: number
    at: string
}

interface Settings {
    frequency: string
    time: string
    weekday: number
    dayOfMonth: number
    keepDays: number
    maxMegabytes: number | null
    destinations: string[]
    alertEmail: string | null
    alertTelegramChatId: string | null
    /**
     * ALWAYS NULL ON THE WAY IN. The server redacts it - see `redacted()` - so
     * the field starts empty and an empty submission means "leave it as it is"
     * rather than "clear it".
     */
    alertTelegramToken: string | null
    notifyOnSuccess: boolean
}

/** What the server tells us ABOUT the token, without telling us the token. */
interface SettingsIn extends Settings {
    hasTelegramToken: boolean
    telegramReady: boolean
}

const props = defineProps<{
    /** Where each control posts. See `OperationsController`. */
    routes: {
        run: string
        delete: string
        restore: string
        download: string
        configure: string
    }
    status: {
        configured: boolean
        disk: string | null
        healthy: boolean | null
        newestAt: string | null
        ageHours: number | null
        totalBytes: number
        backups: Snapshot[]
        problem: string | null
    }
    /** The last manual run, so the button is not a black hole. */
    lastRun: {
        state: string
        message: string
        at: string
        by: string | null
    } | null
    lastRestore: {
        state: string
        message: string
        /**
         * Which of `RESTORE_STEPS` this reached: 0 for the safety backup, 1
         * for the restore itself, 2 (one past the last step) once it
         * succeeded, or null if it never got past the pre-flight checks.
         */
        step: number | null
        at: string
        by: string | null
        snapshot: string
    } | null
    /**
     * A one-time maintenance bypass for the restore that was just started.
     *
     * The restore closes the panel while it swaps the database. Without this
     * link the operator watches their own restore from a 503 page, which is
     * exactly when they most need to see what is happening.
     */
    restoreBypass: string | null
    settings: SettingsIn
    /** A sentence built server-side from the same values the scheduler reads. */
    schedule: string
    /** Who last changed the policy. Null while it is still the shipped default. */
    settingsChangedBy: { by: string | null; at: string } | null
    disks: string[]
    /**
     * What has been done to the backups, across the whole installation.
     *
     * NOT ON THE ACTIVITY SCREEN: that is one organisation's own trail and is
     * scoped to it, so another tenant's operator appearing there would be a
     * leak. These events belong to the installation, so they belong here.
     */
    history: {
        event: string
        actor: string | null
        snapshot: string | null
        ip: string | null
        at: string
    }[]
    tenants?: { id: string | number; name: string; slug?: string | null }[]
    databases?: {
        name: string
        driver: string
        database: string | null
        available: boolean
        error: string | null
        tableCount: number
        rowCount: number
        bytes: number | null
        tables: { name: string; rows: number; bytes: number | null }[]
    }[]
    can: { manage: boolean }
}>()

const starting = ref(false)
const tab = ref<'snapshots' | 'database'>('snapshots')
const tenantId = ref<string>('')

/**
 * Ask for a backup; do not wait for one.
 *
 * The job is queued and locked - a dump plus a zip takes minutes on anything
 * real, and an inline run would hold the request until the browser gave up with
 * no way to tell whether it finished.
 *
 * A TENANT ID, WHEN CHOSEN, LIMITS THE DUMP TO THAT ORGANISATION. Leave it
 * empty for the installation-wide Spatie run.
 */
function backUpNow() {
    starting.value = true

    router.post(props.routes.run, tenantId.value === '' ? {} : { tenant: tenantId.value }, {
        preserveScroll: true,
        onFinish: () => (starting.value = false),
    })
}

/* ------------------------------------------------------------------ *
 * Selection
 * ------------------------------------------------------------------ */

const selected = ref<string[]>([])

const allSelected = computed(
    () => props.status.backups.length > 0 && selected.value.length === props.status.backups.length,
)

/**
 * Indeterminate, not just checked/unchecked.
 *
 * A header box that shows unchecked while four of nine rows are selected tells
 * the operator their selection was lost, and the usual reaction is to click it -
 * which selects everything, one keystroke away from deleting everything.
 */
const someSelected = computed(
    () => selected.value.length > 0 && selected.value.length < props.status.backups.length,
)

function toggleAll() {
    selected.value = allSelected.value ? [] : props.status.backups.map((b) => b.path)
}

function toggle(path: string) {
    selected.value = selected.value.includes(path)
        ? selected.value.filter((p) => p !== path)
        : [...selected.value, path]
}

/**
 * Whether deleting this exact set would empty the directory.
 *
 * MIRRORED FROM THE SERVER, WHICH IS THE AUTHORITY. Computing it here only
 * changes the wording on the dialog and disables a button that would otherwise
 * be refused with an error; `BackupArchive` is what actually holds the line.
 */
const wouldEmpty = computed(
    () =>
        pendingDelete.value.length > 0 && pendingDelete.value.length >= props.status.backups.length,
)

/* ------------------------------------------------------------------ *
 * Delete
 * ------------------------------------------------------------------ */

const pendingDelete = ref<string[]>([])

function askDelete(paths: string[]) {
    pendingDelete.value = paths
}

function confirmDelete() {
    router.delete(props.routes.delete, {
        data: { paths: pendingDelete.value },
        preserveScroll: true,
        onFinish: () => {
            selected.value = selected.value.filter((p) => !pendingDelete.value.includes(p))
            pendingDelete.value = []
        },
    })
}

/* ------------------------------------------------------------------ *
 * Restore
 * ------------------------------------------------------------------ */

const pendingRestore = ref<Snapshot | null>(null)
const typedConfirmation = ref('')

const restoreName = computed(() => pendingRestore.value?.path.split('/').pop() ?? '')

/**
 * The name has to be typed out, not clicked past.
 *
 * A DELIBERATE OBSTACLE, and the only one on this page. Restoring overwrites the
 * live database; typing the filename forces a look at WHICH snapshot is about to
 * be applied, which is the mistake actually made under pressure - not "restoring
 * by accident" but "restoring the wrong one". The server checks the same string,
 * so this is a prompt rather than a lock.
 */
const confirmationMatches = computed(
    () => typedConfirmation.value.trim() === restoreName.value && restoreName.value !== '',
)

function askRestore(snapshot: Snapshot) {
    pendingRestore.value = snapshot
    typedConfirmation.value = ''
}

function confirmRestore() {
    if (!pendingRestore.value || !confirmationMatches.value) {
        return
    }

    router.post(
        props.routes.restore,
        {
            path: pendingRestore.value.path,
            confirm: typedConfirmation.value.trim(),
        },
        {
            preserveScroll: true,
            onFinish: () => {
                pendingRestore.value = null
                typedConfirmation.value = ''
            },
        },
    )
}

/* ------------------------------------------------------------------ *
 * Formatting
 * ------------------------------------------------------------------ */

const runTone: Record<string, string> = {
    succeeded: 'text-emerald-600 dark:text-emerald-400',
    running: 'text-sky-600 dark:text-sky-400',
    skipped: 'text-amber-600 dark:text-amber-500',
    refused: 'text-amber-600 dark:text-amber-500',
    failed: 'text-destructive',
}

/**
 * The two phases `RestoreBackup` reports, plus the arrival step - matches
 * `RestoreBackup::STEP_SAFETY_BACKUP` / `STEP_RESTORE` exactly, so a step
 * number from the server always points at the right label here.
 */
const RESTORE_STEPS = [
    {
        label: 'Safety backup',
        description: 'Taken first, so this can be undone',
    },
    { label: 'Restore', description: 'The live database is replaced' },
    { label: 'Done' },
]

/** Where the indicator sits: past every step once succeeded, otherwise the phase last entered. */
const restoreActiveStep = computed(() => props.lastRestore?.step ?? 0)

/** A cross rather than a tick on the phase that failed; later phases read as never reached. */
const restoreFailedStep = computed(() => {
    const restore = props.lastRestore

    if (!restore || restore.step === null) {
        return null
    }

    return restore.state === 'failed' || restore.state === 'refused' ? restore.step : null
})

/** Zero stays zero - a `Math.max(1, …)` floor reported "1 MB" of nothing. */
const mb = (bytes: number) => {
    if (bytes <= 0) {
        return '0 MB'
    }

    if (bytes > 1024 * 1024 * 1024) {
        return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
    }

    return `${Math.max(1, Math.round(bytes / 1024 / 1024))} MB`
}

const when = (iso: string) => new Date(iso).toLocaleString()

const basename = (path: string) => path.split('/').pop() ?? path

/**
 * `backup.restore-started` reads as a log line, not as a sentence.
 *
 * The fallback humanises anything unmapped rather than showing the raw key, so
 * an event added on the server still reads sensibly here.
 */
const EVENT_LABELS: Record<string, string> = {
    'backup.deleted': 'Deleted',
    'backup.downloaded': 'Downloaded',
    'backup.restore-started': 'Restore started',
    'backup.settings-changed': 'Settings changed',
}

const eventLabel = (event: string) =>
    EVENT_LABELS[event] ?? event.replace(/^backup\./, '').replace(/[-_]/g, ' ')

const downloadUrl = (path: string) => `${props.routes.download}?path=${encodeURIComponent(path)}`
</script>

<template>
    <Head title="Backups" />

    <div class="flex flex-col gap-6 p-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="text-xl font-semibold">Backups</h1>
                <p class="text-sm text-muted-foreground font-normal">
                    {{ props.schedule }}, kept for {{ props.settings.keepDays }} days.
                </p>
            </div>

            <div class="flex items-center gap-2">
                <!--
                    A LINK, NOT A DIALOG. The policy outgrew a box that scrolled
                    over this list: four unrelated subjects, nineteen controls,
                    and the schedule off screen while somebody typed a bot token.
                    It has a page and a URL now.
                -->
                <Button
                    v-if="props.can.manage"
                    variant="outline"
                    size="sm"
                    as="a"
                    :href="props.routes.configure"
                >
                    <Settings2 class="size-4" />
                    Settings
                </Button>

                <Button size="sm" :disabled="starting" @click="backUpNow">
                    {{ starting ? 'Starting…' : tenantId ? 'Back up tenant' : 'Back up now' }}
                </Button>
            </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <button
                type="button"
                class="rounded-md px-3 py-1.5 text-sm"
                :class="
                    tab === 'snapshots'
                        ? 'bg-accent font-medium'
                        : 'text-muted-foreground hover:bg-accent'
                "
                @click="tab = 'snapshots'"
            >
                Snapshots
            </button>
            <button
                type="button"
                class="rounded-md px-3 py-1.5 text-sm"
                :class="
                    tab === 'database'
                        ? 'bg-accent font-medium'
                        : 'text-muted-foreground hover:bg-accent'
                "
                @click="tab = 'database'"
            >
                Database
            </button>

            <label
                v-if="tab === 'snapshots' && (props.tenants?.length ?? 0) > 0"
                class="ml-auto flex items-center gap-2 text-sm"
            >
                <span class="text-muted-foreground">Tenant</span>
                <select
                    v-model="tenantId"
                    class="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                >
                    <option value="">All organisations</option>
                    <option
                        v-for="tenant in props.tenants"
                        :key="tenant.id"
                        :value="String(tenant.id)"
                    >
                        {{ tenant.name }}
                    </option>
                </select>
            </label>
        </div>

        <template v-if="tab === 'database'">
            <p class="text-sm text-muted-foreground font-normal">
                Read-only inspect of configured SQL connections: table names, row counts and
                storage. Nothing here can change a row.
            </p>

            <div
                v-for="db in props.databases ?? []"
                :key="db.name"
                class="rounded-lg border bg-card"
            >
                <div class="flex flex-wrap items-baseline justify-between gap-2 border-b px-4 py-3">
                    <div>
                        <h2 class="text-sm font-medium">
                            {{ db.name }}
                            <span class="ml-1 font-normal text-muted-foreground"
                                >({{ db.driver }})</span
                            >
                        </h2>
                        <p class="text-xs text-muted-foreground font-normal">
                            {{ db.database ?? 'unnamed database' }}
                        </p>
                    </div>
                    <p v-if="db.available" class="text-xs text-muted-foreground font-normal">
                        {{ db.tableCount }} tables · {{ db.rowCount.toLocaleString() }} rows
                        <template v-if="db.bytes !== null"> · {{ mb(db.bytes) }}</template>
                    </p>
                    <p v-else class="text-xs text-destructive">{{ db.error ?? 'Unavailable' }}</p>
                </div>

                <div v-if="db.available && db.tables.length" class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="px-4 py-2 text-left font-medium">Table</th>
                                <th class="px-4 py-2 text-right font-medium">Rows</th>
                                <th class="px-4 py-2 text-right font-medium">Storage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="table in db.tables" :key="table.name" class="border-t">
                                <td class="px-4 py-2 font-mono text-xs">{{ table.name }}</td>
                                <td class="px-4 py-2 text-right tabular-nums">
                                    {{ table.rows.toLocaleString() }}
                                </td>
                                <td class="px-4 py-2 text-right tabular-nums text-muted-foreground">
                                    {{ table.bytes === null ? 'n/a' : mb(table.bytes) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <p v-if="!props.databases?.length" class="text-sm text-muted-foreground font-normal">
                No SQL connections were available to inspect.
            </p>
        </template>

        <template v-if="tab === 'snapshots'">
            <!--
            THE OUTCOME OF THE LAST MANUAL RUN. A button that dispatches a job
            and says nothing afterwards is worse than no button: the operator
            believes a backup exists.
        -->
            <div v-if="props.lastRun" class="rounded-lg border p-3 text-sm">
                <span class="font-medium" :class="runTone[props.lastRun.state] ?? ''">
                    Last manual run: {{ props.lastRun.state }}
                </span>
                <span class="text-muted-foreground"> - {{ props.lastRun.message }}</span>
                <span class="block text-xs text-muted-foreground">
                    {{ when(props.lastRun.at)
                    }}<template v-if="props.lastRun.by">
                        · started by {{ props.lastRun.by }}</template
                    >
                </span>
            </div>

            <!--
            THE BYPASS LINK, SHOWN ONCE AND PROMINENTLY.

            The panel goes down within the minute. This is the only way back in
            while it does, it is flashed rather than stored, and there is no
            second chance to read it - so it sits above the fold in its own
            block rather than in a toast that fades.
        -->
            <div
                v-if="props.restoreBypass"
                class="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-sm"
            >
                <p class="font-medium">The panel will close while the database is restored.</p>
                <p class="mt-1 text-xs text-muted-foreground">
                    Everyone else sees a maintenance page, so nothing is written to the database
                    being replaced. Open this link first - it is shown once and stops working when
                    the restore finishes.
                </p>
                <a
                    :href="`/${props.restoreBypass}`"
                    class="mt-2 inline-block font-mono text-xs underline"
                    target="_blank"
                    rel="noopener"
                    >/{{ props.restoreBypass }}</a
                >
            </div>

            <!-- A restore is reported separately and permanently: it is the one
             action here whose outcome somebody may need to account for. -->
            <div v-if="props.lastRestore" class="rounded-lg border p-3 text-sm">
                <span class="font-medium" :class="runTone[props.lastRestore.state] ?? ''">
                    Last restore: {{ props.lastRestore.state }}
                </span>
                <span class="text-muted-foreground"> - {{ props.lastRestore.message }}</span>
                <span class="block text-xs text-muted-foreground">
                    {{ when(props.lastRestore.at) }}
                    <template v-if="props.lastRestore.by">
                        · started by {{ props.lastRestore.by }}</template
                    >
                </span>

                <!--
                ONLY WHEN A PHASE WAS ACTUALLY ENTERED. A refusal or a
                missing snapshot is rejected before either phase starts, and
                a step strip on a restore that never ran would claim it got
                somewhere it did not.
            -->
                <PkStepIndicator
                    v-if="props.lastRestore.step !== null"
                    class="mt-3"
                    :steps="RESTORE_STEPS"
                    :active-step="restoreActiveStep"
                    :failed-step="restoreFailedStep"
                    :interactive="false"
                />
            </div>

            <div
                class="rounded-lg border p-4"
                :class="
                    props.status.problem
                        ? 'border-destructive/40 bg-destructive/5'
                        : 'border-emerald-500/40 bg-emerald-500/5'
                "
            >
                <p class="text-sm font-medium">
                    <template v-if="props.status.problem">{{ props.status.problem }}</template>
                    <template v-else-if="props.status.ageHours !== null">
                        Newest backup is {{ props.status.ageHours }} hours old.
                    </template>
                    <template v-else>Backups look healthy.</template>
                </p>

                <p v-if="props.status.configured" class="mt-1 text-xs text-muted-foreground">
                    Disk <span class="font-mono">{{ props.status.disk }}</span> ·
                    {{ props.status.backups.length }} snapshot(s) ·
                    {{ mb(props.status.totalBytes) }} total
                </p>
            </div>

            <div v-if="props.status.backups.length" class="flex flex-col gap-2">
                <!--
                THE BULK BAR SITS ABOVE THE TABLE, not inside it as a row. A
                toolbar wedged into the table body shifts every row down the
                moment something is ticked, and the row under the pointer is no
                longer the row that was about to be clicked.
            -->
                <div
                    v-if="selected.length"
                    class="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm"
                >
                    <span>{{ selected.length }} selected</span>

                    <div class="flex items-center gap-2">
                        <Button variant="ghost" size="sm" @click="selected = []">Clear</Button>
                        <Button
                            v-if="props.can.manage"
                            variant="destructive"
                            size="sm"
                            @click="askDelete(selected)"
                        >
                            <Trash2 class="size-4" />
                            Delete selected
                        </Button>
                    </div>
                </div>

                <div class="overflow-x-auto rounded-lg border">
                    <table class="w-full text-sm">
                        <thead class="bg-muted/50">
                            <tr>
                                <th class="w-10 px-3 py-2 text-left">
                                    <input
                                        type="checkbox"
                                        class="size-4 align-middle"
                                        aria-label="Select every snapshot"
                                        :checked="allSelected"
                                        :indeterminate.prop="someSelected"
                                        @change="toggleAll"
                                    />
                                </th>
                                <th class="px-3 py-2 text-left font-medium">Snapshot</th>
                                <th class="px-3 py-2 text-left font-medium">Taken</th>
                                <th class="px-3 py-2 text-right font-medium">Size</th>
                                <th class="w-px px-3 py-2 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="b in props.status.backups"
                                :key="b.path"
                                class="border-t hover:bg-muted/30"
                            >
                                <td class="px-3 py-2">
                                    <input
                                        type="checkbox"
                                        class="size-4 align-middle"
                                        :aria-label="`Select ${basename(b.path)}`"
                                        :checked="selected.includes(b.path)"
                                        @change="toggle(b.path)"
                                    />
                                </td>
                                <td class="px-3 py-2 font-mono text-xs">
                                    {{ b.path }}
                                </td>
                                <td class="px-3 py-2 whitespace-nowrap">
                                    {{ when(b.at) }}
                                </td>
                                <td class="px-3 py-2 text-right tabular-nums">
                                    {{ mb(b.bytes) }}
                                </td>
                                <td class="px-3 py-2">
                                    <div class="flex items-center justify-end gap-1">
                                        <!--
                                        A REAL ANCHOR, not a router call. The
                                        response is a file stream, and Inertia
                                        would try to parse it as a page.
                                    -->
                                        <a
                                            :href="downloadUrl(b.path)"
                                            class="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
                                            :title="`Download ${basename(b.path)}`"
                                            :aria-label="`Download ${basename(b.path)}`"
                                        >
                                            <Download class="size-4" />
                                        </a>

                                        <button
                                            v-if="props.can.manage"
                                            type="button"
                                            class="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
                                            :title="`Restore from ${basename(b.path)}`"
                                            :aria-label="`Restore from ${basename(b.path)}`"
                                            @click="askRestore(b)"
                                        >
                                            <RotateCcw class="size-4" />
                                        </button>

                                        <button
                                            v-if="props.can.manage"
                                            type="button"
                                            class="inline-flex size-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10"
                                            :title="`Delete ${basename(b.path)}`"
                                            :aria-label="`Delete ${basename(b.path)}`"
                                            @click="askDelete([b.path])"
                                        >
                                            <Trash2 class="size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <p
                v-else-if="props.status.configured"
                class="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground"
            >
                No snapshots yet.
            </p>
            <!--
            THE TRAIL, UNDER THE LIST IT DESCRIBES.

            A snapshot that vanished with nothing recording who removed it is
            indistinguishable from a snapshot that was never taken - and the
            moment somebody asks is the moment the answer matters.
        -->
            <div v-if="props.history.length" class="flex flex-col gap-2">
                <h2 class="text-sm font-medium">Recent backup activity</h2>

                <ul class="divide-y rounded-lg border text-sm">
                    <li
                        v-for="(entry, i) in props.history"
                        :key="i"
                        class="flex flex-wrap gap-x-2 px-3 py-2"
                    >
                        <span class="font-medium">{{ eventLabel(entry.event) }}</span>
                        <span v-if="entry.snapshot" class="self-center font-mono text-xs">
                            {{ entry.snapshot }}
                        </span>
                        <span class="ml-auto text-xs text-muted-foreground">
                            {{ entry.actor ?? 'somebody'
                            }}<template v-if="entry.ip"> · {{ entry.ip }}</template> ·
                            {{ when(entry.at) }}
                        </span>
                    </li>
                </ul>
            </div>
        </template>
    </div>

    <!-- Delete ------------------------------------------------------- -->
    <PkModal
        :open="pendingDelete.length > 0"
        :title="
            pendingDelete.length === 1
                ? `Delete ${basename(pendingDelete[0])}?`
                : `Delete ${pendingDelete.length} snapshots?`
        "
        description="The files are removed from the backup disk. This cannot be undone."
        @close="pendingDelete = []"
    >
        <p v-if="wouldEmpty" class="flex items-start gap-2 text-sm text-destructive">
            <TriangleAlert class="mt-0.5 size-4 shrink-0" />
            <span>
                That is every snapshot there is. The server will refuse this - at least one backup
                must always remain.
            </span>
        </p>

        <ul v-else class="max-h-40 space-y-1 overflow-y-auto text-xs text-muted-foreground">
            <li v-for="path in pendingDelete" :key="path" class="font-mono">
                {{ basename(path) }}
            </li>
        </ul>

        <template #footer>
            <Button variant="outline" @click="pendingDelete = []">Cancel</Button>
            <Button variant="destructive" :disabled="wouldEmpty" @click="confirmDelete">
                {{ pendingDelete.length === 1 ? 'Delete snapshot' : 'Delete snapshots' }}
            </Button>
        </template>
    </PkModal>

    <!-- Restore ------------------------------------------------------ -->
    <PkModal
        :open="pendingRestore !== null"
        title="Restore the database?"
        description="A safety backup is taken first, so this can be undone."
        size="form"
        @close="pendingRestore = null"
    >
        <div class="flex flex-col gap-3 text-sm">
            <PkStepIndicator :steps="RESTORE_STEPS" :active-step="0" :interactive="false" />

            <p class="flex items-start gap-2 text-destructive">
                <TriangleAlert class="mt-0.5 size-4 shrink-0" />
                <span>
                    Every record in the live database is replaced with the contents of this
                    snapshot. Anything created since it was taken is lost.
                </span>
            </p>

            <!--
                SAYING WHAT IT DOES NOT DO IS AS IMPORTANT AS SAYING WHAT IT
                DOES. An operator who assumes uploaded files come back too will
                not go looking for them.
            -->
            <p class="text-xs text-muted-foreground font-normal">
                Only the database is restored. Application files and uploaded documents are left
                exactly as they are - download the snapshot if you need those.
            </p>

            <label class="flex flex-col gap-1">
                <span class="text-xs font-medium">
                    Type <span class="font-mono">{{ restoreName }}</span> to confirm
                </span>
                <input
                    v-model="typedConfirmation"
                    type="text"
                    class="rounded-md border border-input bg-background px-3 py-1.5 font-mono text-xs"
                    autocomplete="off"
                    spellcheck="false"
                />
            </label>
        </div>

        <template #footer>
            <Button variant="outline" @click="pendingRestore = null">Cancel</Button>
            <Button
                variant="destructive"
                size="sm"
                :disabled="!confirmationMatches"
                @click="confirmRestore"
            >
                Restore database
            </Button>
        </template>
    </PkModal>

    <!-- Settings ----------------------------------------------------- -->
</template>
