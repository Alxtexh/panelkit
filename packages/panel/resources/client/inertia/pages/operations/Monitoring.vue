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
 * How this installation is DOING, and - underneath - what it is running.
 *
 * THE PAGE THIS REPLACES WAS THE WRONG ANSWER TO THE RIGHT QUESTION. It listed
 * versions, drivers and the tenancy mode: a deploy-time question somebody asks
 * once. The question an operator has while something feels wrong is whether the
 * disk is filling, the queue is backing up, anything has failed and the database
 * is still quick - and none of that was anywhere in the panel.
 *
 * THE NUMBERS THAT CHANGE COME FIRST, and they refresh on their own. A
 * monitoring screen you have to reload is one people leave open showing figures
 * from twenty minutes ago, which is worse than no screen because it looks
 * current.
 *
 * THE POLL IS BOUNDED AND STOPS WHEN THE TAB IS HIDDEN. §8 forbids UNNECESSARY
 * polling, not all of it: somebody watching a queue drain is holding a question
 * the answer keeps changing. A tab in the background is not, and the metrics
 * endpoint is deliberately small so a tick costs one short JSON response rather
 * than a whole Inertia page.
 *
 * WHAT IT CANNOT SEE, IT SAYS. Load averages do not exist on every platform,
 * `/proc` is Linux, a Redis queue has no table to count, and a managed database
 * may refuse its own size. Every one of those renders as "unavailable" rather
 * than as a plausible zero - and zero is also what a healthy queue looks like,
 * which is exactly why a guess would be dangerous.
 *
 * IT MEASURES THIS HOST. There is no agent and nothing to configure; what the
 * PHP process can see is what appears. That limit is on the page, because a
 * monitor that implies it is watching a cluster while reading one container is
 * actively misleading.
 */
import { Head } from '@inertiajs/vue3'
import {
    Activity,
    CircleCheck,
    Clock,
    Cpu,
    Database,
    HardDrive,
    Layers,
    MemoryStick,
    RefreshCw,
    Server,
    TriangleAlert,
} from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { MiniStatCard } from '@alxtexh-enterprise/panel'

interface Health {
    cpu: {
        available: boolean
        one?: number
        five?: number
        fifteen?: number
        cores?: number
        percent?: number | null
    }
    memory: {
        available: boolean
        total?: number
        free?: number
        used?: number
        percent?: number
        process: { current: number; peak: number; limit: number | null }
    }
    disk: {
        available: boolean
        path?: string
        total?: number
        free?: number
        used?: number
        percent?: number
    }
    database: {
        available: boolean
        driver?: string
        latency_ms?: number
        size?: number | null
        error?: string
    }
    queue: {
        connection: string
        available: boolean
        failed: number | null
        pending?: number
        reserved?: number
        oldest_seconds?: number | null
    }
    cache: {
        store: string
        available: boolean
        latency_ms?: number
        error?: string
    }
    scheduler: {
        running: boolean
        last: string | null
        seconds_ago: number | null
    }
    process: {
        php: string
        sapi: string
        uptime: number | null
        storage_writable: boolean
        default_disk: string
    }
    at: string
}

const props = defineProps<{
    application: {
        name: string
        environment: string
        debug: boolean
        url: string
        php: string
        laravel: string
        timezone: string
        locale: string
    }
    drivers: {
        database: {
            connection: string
            driver: string
            host: string
            version: string | null
        }
        cache: string
        queue: string
        session: string
        mail: string
        filesystem: string
        live: string
        broadcast: string
    }
    tenancy: { mode: string; meaning: string; resources: number }
    scheduler: { lastRunAt: string | null; healthy: boolean }
    findings: { level: string; title: string; detail: string }[]
    health: Health
    /** Roadmap 5.3: one row per scheduler tick, oldest first, last 24h. */
    history: {
        cpu_pct: number | null
        memory_pct: number | null
        disk_pct: number | null
        queue_waiting: number | null
        failed_jobs: number | null
        db_ms: number | null
        created_at: string
    }[]
    thresholds: Record<string, number>
    routes?: { metrics?: string }
}>()

/** The four metrics sampled into history, named once. */
type TrendKey = 'cpu_pct' | 'memory_pct' | 'disk_pct' | 'failed_jobs'

/** One sparkline series per metric, skipping unavailable points. */
function series(metric: TrendKey): { label: string; value: number }[] {
    return props.history
        .filter((row) => row[metric] !== null)
        .map((row) => ({
            label: new Date(row.created_at.replace(' ', 'T')).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
            }),
            value: Number(row[metric]),
        }))
}

/**
 * The most recent sample, formatted with its unit.
 *
 * The block below used to show only a sparkline, so a page headed "Last 24
 * hours" drew the shape of a day and never said what the number is NOW - the
 * first thing anybody opens a monitoring screen to find out.
 */
function latest(metric: TrendKey, unit: string): string {
    const points = series(metric)

    return points.length ? `${points[points.length - 1].value}${unit}` : '—'
}

/**
 * Change from the OLDEST sample in the window to the newest, as a percentage.
 *
 * AGAINST THE START OF THE WINDOW, not against the previous point. A
 * five-minute tick is noise - CPU moving 4% to 6% is a 50% rise that means
 * nothing - and a badge that swings wildly every refresh is one operators stop
 * reading. Across the whole window it answers the question the heading asks:
 * is this worse than it was yesterday.
 *
 * NULL RATHER THAN ZERO when there is nothing to compare, so the card draws no
 * badge at all. A "0%" badge on a metric with one sample is a measurement that
 * was never taken, rendered as a measurement of no change.
 */
function delta(metric: TrendKey): number | null {
    const points = series(metric)

    if (points.length < 2) {
        return null
    }

    const first = points[0].value
    const last = points[points.length - 1].value

    // Dividing by a zero first sample is Infinity, which renders as a badge
    // reading "Infinity%" - true, useless, and alarming.
    if (first === 0) {
        return last === 0 ? 0 : null
    }

    return Math.round(((last - first) / first) * 100)
}

const trendMetrics = [
    { key: 'cpu_pct', label: 'CPU', unit: '%', threshold: null },
    { key: 'memory_pct', label: 'Memory', unit: '%', threshold: 'memory_pct' },
    { key: 'disk_pct', label: 'Disk', unit: '%', threshold: 'disk_pct' },
    {
        key: 'failed_jobs',
        label: 'Failed jobs',
        unit: '',
        threshold: 'failed_jobs',
    },
] as const

const health = ref<Health>(props.health)
const refreshing = ref(false)
const failedRefreshes = ref(0)

const REFRESH_MS = 10_000
/** ~10 minutes of a tab nobody is looking at. */
const MAX_FAILURES = 3

let timer: ReturnType<typeof setInterval> | null = null

async function refresh() {
    if (document.hidden || refreshing.value) {
        return
    }

    refreshing.value = true

    try {
        const response = await fetch(props.routes?.metrics ?? '/operations/monitoring/metrics', {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        })

        if (!response.ok) {
            throw new Error('metrics')
        }

        health.value = await response.json()
        failedRefreshes.value = 0
    } catch {
        /*
         * A FAILING POLL GIVES UP RATHER THAN HAMMERING. If the panel is the
         * thing that is unwell, a monitoring page retrying every ten seconds
         * forever is load on a server that already has a problem.
         */
        failedRefreshes.value += 1

        if (failedRefreshes.value >= MAX_FAILURES && timer) {
            clearInterval(timer)
            timer = null
        }
    } finally {
        refreshing.value = false
    }
}

onMounted(() => {
    timer = setInterval(refresh, REFRESH_MS)
})

onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer)
    }
})

/* -------------------------------------------------------------- formatting */

function bytes(value: number | null | undefined): string {
    if (value === null || value === undefined) {
        return '—'
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = value
    let unit = 0

    while (size >= 1024 && unit < units.length - 1) {
        size /= 1024
        unit += 1
    }

    return `${size.toFixed(unit > 1 ? 1 : 0)} ${units[unit]}`
}

function duration(seconds: number | null | undefined): string {
    if (seconds === null || seconds === undefined) {
        return '—'
    }

    if (seconds < 60) {
        return `${Math.round(seconds)}s`
    }

    if (seconds < 3600) {
        return `${Math.round(seconds / 60)}m`
    }

    if (seconds < 86_400) {
        return `${Math.round(seconds / 3600)}h`
    }

    return `${Math.round(seconds / 86_400)}d`
}

/**
 * Amber at 75%, red at 90%.
 *
 * A GAUGE THAT IS ONLY EVER GREEN OR RED gives no warning; the amber band is
 * the difference between noticing a disk filling and finding out when a write
 * fails.
 */
function tone(percent: number | null | undefined): string {
    if (percent === null || percent === undefined) {
        return 'bg-muted-foreground/30'
    }

    if (percent >= 90) {
        return 'bg-destructive'
    }

    if (percent >= 75) {
        return 'bg-amber-500'
    }

    return 'bg-emerald-500'
}

const problems = computed(() => props.findings.filter((f) => f.level === 'problem'))

const debugInProduction = computed(
    () => props.application.debug && props.application.environment !== 'local',
)

const updated = computed(() => new Date(health.value.at).toLocaleTimeString())

const when = (iso: string | null) => (iso === null ? 'never' : new Date(iso).toLocaleString())
</script>

<template>
    <Head title="Monitoring" />

    <div class="flex flex-col gap-6 p-4">
        <header class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="text-xl font-semibold">Monitoring</h1>
                <p class="text-sm text-muted-foreground font-normal">
                    This host, measured from inside the application. Refreshes every
                    {{ REFRESH_MS / 1000 }} seconds while this tab is open.
                </p>
            </div>

            <button
                type="button"
                class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                @click="refresh"
            >
                <RefreshCw class="size-3.5" :class="refreshing ? 'animate-spin' : ''" />
                Updated {{ updated }}
            </button>
        </header>

        <!-- The scheduler first: no cron means no backups, no cleanup and no
             monitoring, and every screen reporting on those looks normal. -->
        <div
            v-if="!health.scheduler.running"
            class="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"
        >
            <TriangleAlert class="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
                <p class="font-medium">The scheduler does not appear to be running.</p>
                <p class="text-muted-foreground">
                    Last tick: {{ when(health.scheduler.last) }}. Without it there are no backups,
                    no cleanup and no scheduled reports - and every screen reporting on those will
                    look normal.
                </p>
            </div>
        </div>

        <div
            v-if="debugInProduction"
            class="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"
        >
            <TriangleAlert class="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
                <p class="font-medium">Debug mode is on outside local.</p>
                <p class="text-muted-foreground">
                    Any unhandled error will show stack traces, environment variables and database
                    credentials to whoever triggered it.
                </p>
            </div>
        </div>

        <div
            v-for="(finding, i) in problems"
            :key="`problem-${i}`"
            class="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"
        >
            <TriangleAlert class="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
                <p class="font-medium">{{ finding.title }}</p>
                <p class="text-muted-foreground">{{ finding.detail }}</p>
            </div>
        </div>

        <!-- ------------------------------------------------------- gauges -->

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <!-- CPU -->
            <div class="flex flex-col gap-2 rounded-lg border bg-card p-4">
                <div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Cpu class="size-3.5" />
                    CPU load
                </div>

                <template v-if="health.cpu.available">
                    <p class="text-2xl font-semibold tabular-nums">{{ health.cpu.percent }}%</p>
                    <div class="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                            class="h-full rounded-full transition-all"
                            :class="tone(health.cpu.percent)"
                            :style="{ width: `${health.cpu.percent}%` }"
                        />
                    </div>
                    <p class="text-xs text-muted-foreground font-normal">
                        {{ health.cpu.one }} / {{ health.cpu.five }} /
                        {{ health.cpu.fifteen }} across {{ health.cpu.cores }} core(s)
                    </p>
                </template>

                <p v-else class="text-sm text-muted-foreground font-normal">
                    Not available on this platform.
                </p>
            </div>

            <!-- Memory -->
            <div class="flex flex-col gap-2 rounded-lg border bg-card p-4">
                <div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <MemoryStick class="size-3.5" />
                    Memory
                </div>

                <template v-if="health.memory.available">
                    <p class="text-2xl font-semibold tabular-nums">{{ health.memory.percent }}%</p>
                    <div class="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                            class="h-full rounded-full transition-all"
                            :class="tone(health.memory.percent)"
                            :style="{ width: `${health.memory.percent}%` }"
                        />
                    </div>
                    <p class="text-xs text-muted-foreground font-normal">
                        {{ bytes(health.memory.used) }} of {{ bytes(health.memory.total) }} used
                    </p>
                </template>

                <p v-else class="text-sm text-muted-foreground font-normal">
                    Host memory is not readable here.
                </p>

                <p class="border-t pt-2 text-xs text-muted-foreground">
                    This process:
                    {{ bytes(health.memory.process.current) }} now, peak
                    {{ bytes(health.memory.process.peak) }}
                    <span v-if="health.memory.process.limit">
                        of {{ bytes(health.memory.process.limit) }}
                    </span>
                </p>
            </div>

            <!-- Disk -->
            <div class="flex flex-col gap-2 rounded-lg border bg-card p-4">
                <div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <HardDrive class="size-3.5" />
                    Disk
                </div>

                <template v-if="health.disk.available">
                    <p class="text-2xl font-semibold tabular-nums">{{ health.disk.percent }}%</p>
                    <div class="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                            class="h-full rounded-full transition-all"
                            :class="tone(health.disk.percent)"
                            :style="{ width: `${health.disk.percent}%` }"
                        />
                    </div>
                    <p class="text-xs text-muted-foreground font-normal">
                        {{ bytes(health.disk.free) }} free of
                        {{ bytes(health.disk.total) }}
                    </p>
                    <!-- Measured where the application WRITES, which on a real
                         deployment is often not the root filesystem. -->
                    <p
                        class="truncate font-mono text-[11px] text-muted-foreground"
                        :title="health.disk.path"
                    >
                        {{ health.disk.path }}
                    </p>
                </template>

                <p v-else class="text-sm text-muted-foreground font-normal">Not readable.</p>
            </div>

            <!-- Database -->
            <div class="flex flex-col gap-2 rounded-lg border bg-card p-4">
                <div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Database class="size-3.5" />
                    Database
                </div>

                <template v-if="health.database.available">
                    <p class="text-2xl font-semibold tabular-nums">
                        {{ health.database.latency_ms
                        }}<span class="text-base font-normal">ms</span>
                    </p>
                    <p class="text-xs text-muted-foreground font-normal">
                        {{ health.database.driver }} · {{ bytes(health.database.size) }} on disk
                    </p>
                </template>

                <template v-else>
                    <p class="text-sm font-medium text-destructive">Not answering</p>
                    <p class="text-xs text-muted-foreground font-normal">
                        {{ health.database.error }}
                    </p>
                </template>
            </div>

            <!-- Queue -->
            <div class="flex flex-col gap-2 rounded-lg border bg-card p-4">
                <div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Layers class="size-3.5" />
                    Queue
                </div>

                <template v-if="health.queue.available">
                    <p class="text-2xl font-semibold tabular-nums">
                        {{ health.queue.pending }}
                    </p>
                    <p class="text-xs text-muted-foreground font-normal">
                        waiting · {{ health.queue.reserved }} in flight
                        <template v-if="health.queue.oldest_seconds">
                            · oldest {{ duration(health.queue.oldest_seconds) }}
                        </template>
                    </p>
                </template>

                <template v-else>
                    <p class="text-sm text-muted-foreground font-normal">
                        Depth is not countable on the
                        <span class="font-mono">{{ health.queue.connection }}</span>
                        queue.
                    </p>
                </template>

                <!-- FAILED JOBS ARE THE HEADLINE: a backlog drains, a failure
                     does not, and each one is work somebody believes happened. -->
                <p
                    class="border-t pt-2 text-xs"
                    :class="
                        health.queue.failed
                            ? 'font-medium text-destructive'
                            : 'text-muted-foreground'
                    "
                >
                    {{ health.queue.failed ?? '—' }} failed job(s)
                </p>
            </div>

            <!-- Cache -->
            <div class="flex flex-col gap-2 rounded-lg border bg-card p-4">
                <div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Activity class="size-3.5" />
                    Cache
                </div>

                <template v-if="health.cache.available">
                    <p class="text-2xl font-semibold tabular-nums">
                        {{ health.cache.latency_ms }}<span class="text-base font-normal">ms</span>
                    </p>
                    <p class="text-xs text-muted-foreground font-normal">
                        {{ health.cache.store }} · write and read back
                    </p>
                </template>

                <template v-else>
                    <p class="text-sm font-medium text-destructive">Not answering</p>
                    <p class="text-xs text-muted-foreground font-normal">
                        {{ health.cache.store }} · {{ health.cache.error }}
                    </p>
                </template>
            </div>
        </div>

        <!-- ------------------------------------------------- process facts -->

        <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-lg border bg-card">
                <p class="border-b px-4 py-2.5 text-sm font-medium">Scheduler</p>
                <dl class="divide-y text-sm">
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Status</dt>
                        <dd class="flex items-center gap-1.5 font-medium">
                            <CircleCheck
                                v-if="health.scheduler.running"
                                class="size-3.5 text-emerald-600"
                            />
                            <TriangleAlert v-else class="size-3.5 text-destructive" />
                            {{ health.scheduler.running ? 'Ticking' : 'Not running' }}
                        </dd>
                    </div>
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Last tick</dt>
                        <dd class="font-mono text-xs">
                            {{
                                health.scheduler.seconds_ago === null
                                    ? 'never'
                                    : duration(health.scheduler.seconds_ago) + ' ago'
                            }}
                        </dd>
                    </div>
                </dl>
            </div>

            <div class="rounded-lg border bg-card">
                <p class="border-b px-4 py-2.5 text-sm font-medium">Process</p>
                <dl class="divide-y text-sm">
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">PHP</dt>
                        <dd class="font-mono text-xs">
                            {{ health.process.php }} · {{ health.process.sapi }}
                        </dd>
                    </div>
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Host uptime</dt>
                        <dd class="font-mono text-xs">
                            {{ duration(health.process.uptime) }}
                        </dd>
                    </div>
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Storage</dt>
                        <dd class="font-mono text-xs">
                            {{ health.process.storage_writable ? 'writable' : 'NOT writable' }}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>

        <!-- ------------------------------------------------ last 24 hours -->

        <!--
            Roadmap 5.3: yesterday, visible. One point per scheduler tick;
            crossings of the thresholds shown here also went to Telegram at
            the moment they happened.
        -->
        <div class="rounded-lg border bg-card">
            <div class="flex items-baseline justify-between border-b px-4 py-2.5">
                <p class="text-sm font-medium">Last 24 hours</p>
                <p v-if="history.length" class="text-xs text-muted-foreground font-normal">
                    {{ history.length }} samples, every 5 minutes
                </p>
            </div>

            <p v-if="!history.length" class="px-4 py-6 text-sm text-muted-foreground">
                No samples yet. History appears once the scheduler has run
                <code class="font-mono text-xs">panel:monitor-sample</code>, every five minutes when
                cron is ticking.
            </p>

            <!--
                `MiniStatCard`, WHICH IS WHAT THIS BLOCK WAS BEFORE IT WAS ONE.

                The markup here used to be a hand-rolled label, a threshold
                caption and a bare `Sparkline` - a four-across metric card
                assembled by hand, inside the package that EXPORTS a four-across
                metric card. The changelog even predicted this exact mistake:
                the component was listed in the agent catalogue precisely so
                that "an agent asked for a four-window metric card would not
                hand-roll a worse one", and the package went on to hand-roll a
                worse one.

                It WAS worse, in a way nobody noticed while it was only a
                sparkline: the old block never showed the CURRENT VALUE. A
                screen headed "Last 24 hours" drew the shape of CPU over a day
                and never said what CPU is now, which is the first thing anybody
                opens a monitoring page to find out.

                `MiniStatCard` had no consumer anywhere - exported, documented,
                recommended to agents, and never once rendered.
            -->
            <div class="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4" v-else>
                <MiniStatCard
                    v-for="metric in trendMetrics"
                    :key="metric.key"
                    :label="metric.label"
                    :value="latest(metric.key, metric.unit)"
                    :caption="
                        metric.threshold
                            ? `alerts at ${thresholds[metric.threshold]}${metric.unit}`
                            : null
                    "
                    :delta="delta(metric.key)"
                    :series="series(metric.key).length > 1 ? series(metric.key) : null"
                    inverted
                />
            </div>
        </div>

        <!-- --------------------------------------------- what it is running -->

        <div>
            <h2 class="flex items-center gap-1.5 text-sm font-medium">
                <Server class="size-4" />
                What this installation is running
            </h2>
            <p class="mt-0.5 text-sm text-muted-foreground">
                Configuration, not health. Nothing here can be changed from this page - it comes
                from the deploy.
            </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-lg border bg-card">
                <p class="border-b px-4 py-2.5 text-sm font-medium">Application</p>
                <dl class="divide-y text-sm">
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Environment</dt>
                        <dd class="font-mono text-xs">
                            {{ application.environment }}
                        </dd>
                    </div>
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Debug</dt>
                        <dd
                            class="font-mono text-xs"
                            :class="debugInProduction ? 'text-destructive' : ''"
                        >
                            {{ application.debug ? 'on' : 'off' }}
                        </dd>
                    </div>
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Laravel</dt>
                        <dd class="font-mono text-xs">
                            {{ application.laravel }}
                        </dd>
                    </div>
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Timezone</dt>
                        <dd class="font-mono text-xs">
                            {{ application.timezone }}
                        </dd>
                    </div>
                </dl>
            </div>

            <div class="rounded-lg border bg-card">
                <p class="border-b px-4 py-2.5 text-sm font-medium">Drivers</p>
                <dl class="divide-y text-sm">
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Database</dt>
                        <dd class="font-mono text-xs">
                            {{ drivers.database.driver }}
                            {{ drivers.database.version }}
                        </dd>
                    </div>
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Cache</dt>
                        <dd class="font-mono text-xs">{{ drivers.cache }}</dd>
                    </div>
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Queue</dt>
                        <dd class="font-mono text-xs">{{ drivers.queue }}</dd>
                    </div>
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Session</dt>
                        <dd class="font-mono text-xs">{{ drivers.session }}</dd>
                    </div>
                    <div class="flex items-center justify-between px-4 py-2.5">
                        <dt class="text-muted-foreground">Live updates</dt>
                        <dd class="font-mono text-xs">{{ drivers.live }}</dd>
                    </div>
                </dl>
            </div>
        </div>

        <div class="rounded-lg border bg-card p-4">
            <p class="text-sm font-medium">Tenancy</p>
            <p class="mt-1 text-sm">
                <span class="font-mono">{{ tenancy.mode }}</span> —
                {{ tenancy.meaning }}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
                {{ tenancy.resources }} registered resource(s).
            </p>
        </div>

        <p class="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock class="size-3.5" />
            Measured from inside this application, on this host. There is no agent and nothing to
            configure - what the PHP process can see is what appears here.
        </p>
    </div>
</template>
