<script setup lang="ts">
/**
 * The dashboard - the screen a `DashboardPage` renders.
 *
 * THIS IS THE REFERENCE APPLICATION'S DASHBOARD, MOVED. The package used to have
 * a second, thinner dashboard of its own: no per-widget boundary, no setup
 * checklist, no summary strip, no filters, no trend badges, and eight chart
 * types against the demo's fifteen. It also passed the resolved series to the
 * chart components as `points`, a prop none of them accept - so every chart on
 * every packaged dashboard drew an empty plot, and had since it shipped. Two
 * implementations, one of them broken and the one nobody was looking at.
 *
 * WHAT CHANGED IN THE MOVE IS THE FILTER DIMENSIONS. The panel had a section
 * headed "Routers" because it came from an ISP; here the page declares its
 * dimensions and this draws them. Nothing else was redesigned.
 *
 * EVERY STAT AND CHART IS ITS OWN DEFERRED PROP, so the shell paints immediately
 * and the numbers fill in independently - one slow counter does not hold up the
 * others.
 *
 * CHANGING A PERIOD RELOADS ONE PROP. `only: ['chart_sessions', 'periods']` is
 * the whole point of the per-chart query parameter: the click re-runs one
 * grouped query, not the six counters and two breakdowns that did not change.
 */
import { Deferred, Head, Link, router, usePage } from '@inertiajs/vue3'
import { useMediaQuery } from '@vueuse/core'
import { computed, markRaw, provide, ref, watch } from 'vue'
import {
    DASHBOARD_HIDE_KEY,
    DASHBOARD_HIDDEN_STORAGE_KEY,
    DashboardShortcuts,
    PAGE_SHELL,
    PkBoundary,
    PkSlideover,
    SetupChecklist,
    StatCard,
    StatStrip,
    iconPath,
    mergeLayoutItems,
    packWidgetColumns,
    toPersistedLayout,
    useColumnVisibility,
} from '@alxtexh-enterprise/panel'
import type {
    DashboardHide,
    DashboardLayout,
    LayoutItem,
    SetupChecklistItem,
    StatSegment,
} from '@alxtexh-enterprise/panel'
import AnnouncementBanners from '../components/AnnouncementBanners.vue'
import DashboardFilterPanel from '../components/DashboardFilters.vue'
import EmptyGrantsNotice from '../components/EmptyGrantsNotice.vue'
import RenderHook from '../components/RenderHook.vue'
import DashboardChartPane from '../components/widgets/DashboardChartPane.vue'
import DashboardTablePane from '../components/widgets/DashboardTablePane.vue'
import type { TableWidgetDecl } from '../components/widgets/DashboardTablePane.vue'
import { emptySeries } from '../components/widgets/types'
import type { Chart, Series } from '../components/widgets/types'
import { useWidgetPoll, useWidgetChannels, canUseEcho } from '../composables/useWidgetPoll'
import type { Announcement } from '../types'

interface Widget {
    key: string
    label: string
    description: string | null
    span: number
    poll?: number | null
    live?: string | null
}

/*
 * `Chart`, `Dataset` and `Series` WERE DECLARED HERE, which made this file the
 * only screen that could describe a chart - see `components/widgets/types.ts`.
 * They are imported now, so a renderer added to `ChartWidget::TYPES` is a
 * two-file change rather than a three-file one.
 */

interface AppliedFilters {
    from: string | null
    to: string | null
    selections: Record<string, number[]>
    active: boolean
    label: string | null
}

interface Dimension {
    key: string
    label: string
    /** What one of them is called, for the applied-filter summary. */
    singular?: string | null
    placeholder?: string | null
    options: { value: number; label: string }[]
}

/*
 * EVERY PAGE PROP ARRIVES AS AN ATTRIBUTE, and this page's root is a fragment.
 *
 * Inertia binds the WHOLE page payload onto the page component - the declared
 * props bind as props, and the twenty-odd others (shared props, plus every
 * deferred stat_* and chart_* as it lands) arrive as plain attributes. A
 * fragment root has nowhere to auto-inherit them, so Vue warned - once per
 * deferred prop, on every visit, growing the list each time - which read
 * exactly like the page reloading over and over. It was neither reloading nor
 * broken: the attributes are unused here by design, and this says so.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
    defineProps<{
        /**
         * Notices somebody wrote, addressed to everybody here.
         *
         * INLINE, NOT `Announcement[]`. A type imported into `defineProps` makes
         * the SFC compiler resolve it ACROSS FILES, which it can only do by
         * loading TypeScript from the CONSUMING project - see the drift guard
         * below. Same-file types need no such thing.
         */
        announcements?: {
            id: number
            title: string
            body: string | null
            severity: 'info' | 'success' | 'warning' | 'danger'
            display: 'banner' | 'toast'
            actionLabel: string | null
            actionUrl: string | null
        }[]
        widgets?: Widget[]
        charts?: Chart[]
        periods?: Record<string, string>
        filters?: AppliedFilters
        /** Filter dimensions this dashboard declared, with their options. */
        filterDimensions?: Dimension[]
        heading?: string
        /** Reusable visual family; widget data is independent of the skin. */
        design?: 'operations' | 'analytics' | 'commerce' | 'minimal' | 'executive' | string
        /** Panel path prefix; the dismiss and report routes sit inside it. */
        prefix?: string
        tables?: TableWidgetDecl[]
        shortcuts?: {
            catalog: { id: string; label: string; href: string; icon: string }[]
            defaults?: string[]
            storageKey?: string | null
        } | null
        /** Opt-in via Panel::userDashboards(). */
        userDashboards?: boolean
        dashboardLayout?: DashboardLayout | null
    }>(),
    {
        announcements: () => [],
        widgets: () => [],
        charts: () => [],
        periods: () => ({}),
        filters: () => ({
            from: null,
            to: null,
            selections: {},
            active: false,
            label: null,
        }),
        filterDimensions: () => [],
        heading: 'Dashboard',
        design: 'operations',
        prefix: '',
        tables: () => [],
        shortcuts: null,
        userDashboards: false,
        dashboardLayout: null,
    },
)

/*
 * THE DRIFT GUARD for the announcement shape spelled out above - a field added
 * to `Announcement` and not here fails `vue-tsc`, rather than arriving as a
 * banner prop this screen quietly drops. A type, so it compiles to nothing.
 */
type _AnnouncementMatch = NonNullable<typeof props.announcements>[number] extends Announcement
    ? true
    : never

const page = usePage()
const InertiaLink = markRaw(Link)

/**
 * Read the resolved value from PAGE PROPS, not from the Deferred slot.
 *
 * <Deferred> gates when its default slot renders; it does not hand the value in
 * as a slot prop. Reading `slotProps[key]` looked plausible and silently
 * rendered an em dash for every stat - the numbers were arriving correctly and
 * being thrown away.
 */
/**
 * The window strip, and the shape it holds while it loads.
 *
 * The placeholder carries the real labels rather than blank cells, because the
 * labels are known before the numbers are - showing them immediately means the
 * strip does not change size or wording when the data lands, only its values.
 */
const STRIP_PLACEHOLDER: StatSegment[] = [
    { key: 'today', label: 'Today', value: '', caption: 'so far' },
    { key: 'week', label: 'Last 7 days', value: '', caption: 'rolling window' },
    { key: 'month', label: 'This month', value: '', caption: 'since the 1st' },
    {
        key: 'quarter',
        label: 'Last 90 days',
        value: '',
        caption: 'rolling window',
    },
]

const strip = computed(
    () =>
        ((page.props as Record<string, any>).strip as StatSegment[] | undefined) ??
        STRIP_PLACEHOLDER,
)

/**
 * Absent, not empty, for a user without the ability - the page never adds the
 * prop at all rather than sending an empty array, so somebody without it cannot
 * see from the network tab that the check even ran. `Deferred` below only
 * renders once the key is present either way.
 */
const checklist = computed(
    () => ((page.props as Record<string, any>).checklist as SetupChecklistItem[] | undefined) ?? [],
)

const onboarding = computed(
    () =>
        ((page.props as Record<string, any>).onboarding as SetupChecklistItem[] | undefined) ?? [],
)

const onboardingDismiss = computed(
    () =>
        ((page.props as Record<string, any>).onboardingDismiss as string | null | undefined) ??
        null,
)

function skipOnboarding() {
    const href = onboardingDismiss.value

    if (!href) {
        return
    }

    if (typeof document !== 'undefined') {
        document.cookie = 'panel_onboarding_done=1;path=/;max-age=31536000;SameSite=Lax'
    }

    router.post(href, {}, { preserveScroll: true })
}

/**
 * THE WHOLE STAT ROW AS ONE STRIP - see the template for why this replaced a
 * grid of separate cards, and `StatSegment` for why nothing is lost by it.
 *
 * Refresh: Echo when `window.Echo` and `->live()` are set (push, no periodic
 * HTTP). Poll when they are not. Never both for the same widget. Redis is
 * not a UI transport.
 *
 * `sensitive: false` throughout: a strip masks by default, which is right for
 * figures somebody deliberately put behind an eye and wrong for the counters at
 * the top of a dashboard - those would all arrive covered.
 */
const statKeys = computed(() => props.widgets.map((w) => `stat_${w.key}`))

const pollingStatKeys = computed(() =>
    props.widgets.filter((w) => w.poll && !canUseEcho(w.live)).map((w) => `stat_${w.key}`),
)

const statsPollMs = computed(() => {
    const intervals = props.widgets
        .filter((w) => !canUseEcho(w.live))
        .map((w) => w.poll)
        .filter((n): n is number => typeof n === 'number' && n >= 1000)

    return intervals.length ? Math.min(...intervals) : null
})

useWidgetPoll(pollingStatKeys, statsPollMs)

useWidgetChannels(() =>
    props.widgets.map((w) => ({
        keys: [`stat_${w.key}`],
        channel: w.live,
    })),
)

const statColumns = computed(
    () => Math.min(Math.max(props.widgets.length, 2), 6) as 2 | 3 | 4 | 5 | 6,
)

const statSegments = computed(() =>
    props.widgets.map((widget) => {
        const value = stat(widget.key)

        return {
            key: widget.key,
            label: widget.label,
            value: value?.error ? '-' : ((value?.value as string | number) ?? '-'),
            caption: widget.description,
            comparison: 'vs previous 30 days',
            trend: value?.trend ?? null,
            sparkline: value?.sparkline ?? null,
            error: value?.error,
            sensitive: false,
        }
    }),
)

function stat(key: string) {
    return (page.props as Record<string, any>)[`stat_${key}`] as
        | {
              value: unknown
              error: boolean
              trend: {
                  direction: 'up' | 'down' | 'flat' | 'new'
                  percentage: number | null
              } | null
              sparkline: { label: string; value: number }[] | null
          }
        | undefined
}

function retryWidget(dataKey: string) {
    router.reload({ only: [dataKey], preserveState: true, preserveScroll: true })
}

function series(key: string): Series {
    return (
        ((page.props as Record<string, any>)[`chart_${key}`] as Series | undefined) ?? emptySeries()
    )
}

/**
 * Swap one chart's window.
 *
 * The existing query string is carried forward, so changing the sessions period
 * does not silently reset the signups one - each selector owns exactly its own
 * parameter.
 */
function setPeriod(key: string, value: string) {
    const query = Object.fromEntries(new URLSearchParams(window.location.search))

    router.get(
        window.location.pathname,
        { ...query, [`period_${key}`]: value },
        {
            only: [`chart_${key}`, 'periods'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
        },
    )
}

/**
 * Line-style flags are applied HERE, from the chart type.
 *
 * `steppedLine` is a type in PHP and a per-series flag in the renderer, because
 * the renderer supports mixing a stepped series with a smooth one on the same
 * plot. Translating at the boundary keeps the PHP declaration a single semantic
 * word instead of a bag of style booleans.
 */

/** Cards size to their content: a ranked list is tall, a proportion bar short. */
function bodyHeight(chart: Chart): number {
    if (chart.type === 'segments') {
        return 64
    }

    if (chart.type === 'rankedBar') {
        return 380
    }

    if (chart.type === 'heatmap') {
        return 200
    }

    if (chart.type === 'catalog') {
        return 280
    }

    if (chart.type === 'items') {
        return 160
    }

    if (chart.type === 'table') {
        return 120
    }

    if (chart.type === 'barcode') {
        return 120
    }

    if (chart.type === 'logtail') {
        return 220
    }

    return 220
}

/* ---------------------------------------------------------------------------
 * Dashboard-wide filters
 *
 * Applied filters live in the URL, so a filtered dashboard can be bookmarked or
 * sent to someone. Applying REPLACES the history entry rather than pushing one:
 * otherwise adjusting a range three times leaves three states to walk back
 * through before Back leaves the page.
 * ------------------------------------------------------------------------- */

const filtersOpen = ref(false)

function applyFilters(next: {
    from: string | null
    to: string | null
    selections: Record<string, number[]>
}) {
    const query: Record<string, string> = {}

    if (next.from) {
        query.from = next.from
    }

    if (next.to) {
        query.to = next.to
    }

    for (const [key, ids] of Object.entries(next.selections)) {
        if (ids.length) {
            query[key] = ids.join(',')
        }
    }

    filtersOpen.value = false

    router.get(window.location.pathname, query, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    })
}

function resetFilters() {
    filtersOpen.value = false
    router.get(
        window.location.pathname,
        {},
        { preserveState: true, preserveScroll: true, replace: true },
    )
}

const filterSummary = computed(() => {
    const parts: string[] = []

    if (props.filters.label) {
        parts.push(props.filters.label)
    }

    for (const dimension of props.filterDimensions) {
        const count = (props.filters.selections?.[dimension.key] ?? []).length

        if (count) {
            /*
             * "1 routers" is what a label pluralised by its author reads as
             * when one thing is chosen. The demo said "1 router" because the
             * dimension was hardcoded and could carry its own singular; a
             * declared dimension may name one, and dropping a trailing "s" is
             * the honest fallback rather than a wrong number agreement.
             */
            const label = dimension.label.toLowerCase()

            parts.push(
                `${count} ${count === 1 ? (dimension.singular?.toLowerCase() ?? label.replace(/s$/, '')) : label}`,
            )
        }
    }

    return parts.join(' · ')
})

/**
 * A per-chart period selector is HIDDEN while a global range is applied.
 *
 * Leaving both visible produces a dashboard where one card says "7 days" and
 * another says "March", and no two numbers on the page can be compared. The
 * server ignores the period in that case; hiding the control is what stops the
 * interface implying otherwise.
 */
function periodsFor(chart: Chart) {
    return props.filters.from ? null : chart.periods
}

const comparison: Record<string, string> = {
    today: 'vs yesterday',
    '7d': 'vs previous 7 days',
    '30d': 'vs previous 30 days',
    '90d': 'vs previous 90 days',
    '12m': 'vs previous 12 months',
}

/**
 * A DASHBOARD WITH NOTHING DECLARED SAYS SO. An empty page is
 * indistinguishable from one that failed to load, and this is the first screen
 * a new installation opens on.
 */
const hasAnything = computed(
    () =>
        props.widgets.length > 0 ||
        props.charts.length > 0 ||
        props.tables.length > 0 ||
        onboarding.value.length > 0,
)
const emptyGrants = computed(() => Boolean((page.props as Record<string, any>).panelEmptyGrants))

/**
 * ADDITIONAL STRIPS THE PAGE DECLARED - `DashboardPage::strips()`.
 *
 * READ OFF PAGE PROPS rather than `defineProps`, because the key is absent
 * entirely when a dashboard declares none - which is almost all of them, and
 * the case that must stay byte-identical to before.
 */
const extraStrips = computed(
    () =>
        ((page.props as Record<string, any>).strips ?? []) as {
            key: string
            label?: string | null
        }[],
)

/**
 * Same reasoning as `extraStrips` above: read off page props rather than
 * `defineProps`, since `PageController::show()` sends this to every custom
 * page - the dashboard included - not only this one.
 */
const renderHooks = computed(
    () =>
        ((page.props as Record<string, any>).renderHooks ?? []) as {
            position: string
            component: string
            props: Record<string, unknown>
        }[],
)

/**
 * THE RESOLVED SEGMENTS COME FROM PAGE PROPS, NOT THE `<Deferred>` SLOT.
 *
 * `<Deferred>` gates WHEN its slot renders; it does not hand the value in.
 * Reading `slotProps[key]` looks right and renders an empty strip forever -
 * the same trap already documented on the stats above.
 */
function stripSegments(key: string): StatSegment[] {
    return ((page.props as Record<string, any>)[`strip_${key}`] ?? []) as StatSegment[]
}

/**
 * HIDE UNMOUNTS. Collapse is local to ChartCard (`v-if` on the body). Hide
 * uses `v-if` via `visibleCharts`, so ChartCard / echarts never mount for a
 * hidden key. Inertia still fetches every deferred key in the `charts` group,
 * so the cookie `panel_dashboard_hidden` lets PHP omit those props on the
 * next visit.
 */
const hiddenWidgets = useColumnVisibility(DASHBOARD_HIDDEN_STORAGE_KEY)
const extraLabels = ref<Record<string, string>>({})
const HIDDEN_COOKIE = 'panel_dashboard_hidden'

function writeHiddenCookie(ids: Iterable<string>) {
    if (typeof document === 'undefined') {
        return
    }

    document.cookie = `${HIDDEN_COOKIE}=${encodeURIComponent(JSON.stringify([...ids]))};path=/;max-age=31536000;SameSite=Lax`
}

watch(hiddenWidgets.hidden, (ids) => writeHiddenCookie(ids), { deep: true, immediate: true })

function hideWidget(id: string, label?: string) {
    if (label) {
        extraLabels.value = { ...extraLabels.value, [id]: label }
    }

    hiddenWidgets.hide(id)
    writeHiddenCookie(hiddenWidgets.hidden.value)

    if (props.userDashboards) {
        const layoutId = id.includes(':') ? id : `chart:${id}`
        const next = layoutItems.value.map((item) =>
            item.id === layoutId || item.key === id ? { ...item, hidden: true } : item,
        )
        void persistLayout(next)
    }
}

const dashboardHide: DashboardHide = {
    hidden: hiddenWidgets.hidden,
    hide: hideWidget,
    show: hiddenWidgets.show,
    register: (id, label) => {
        extraLabels.value = { ...extraLabels.value, [id]: label }
    },
    labels: extraLabels,
}

provide(DASHBOARD_HIDE_KEY, dashboardHide)

const hiddenOpen = ref(false)
const selectedHidden = ref<Set<string>>(new Set())

function toggleHiddenSelection(id: string) {
    const next = new Set(selectedHidden.value)

    if (next.has(id)) {
        next.delete(id)
    } else {
        next.add(id)
    }

    selectedHidden.value = next
}

function restoreSelectedHidden() {
    const restored: string[] = []

    for (const id of selectedHidden.value) {
        hiddenWidgets.show(id)
        restored.push(id)
    }

    selectedHidden.value = new Set()
    writeHiddenCookie(hiddenWidgets.hidden.value)

    const missing = restored.filter(
        (id) => (page.props as Record<string, unknown>)[`chart_${id}`] === undefined,
    )

    if (missing.length) {
        router.reload()
    }
}

function restoreAllHidden() {
    hiddenWidgets.reset()
    selectedHidden.value = new Set()
    hiddenOpen.value = false
    writeHiddenCookie([])
    router.reload()
}

const visibleCharts = computed(() =>
    props.charts.filter((chart) => !hiddenWidgets.hidden.value.has(chart.key)),
)

type AnyLayoutItem = LayoutItem<Widget | Chart | TableWidgetDecl>

const layoutItems = computed((): AnyLayoutItem[] => {
    if (!props.userDashboards) {
        return []
    }

    return mergeLayoutItems(props.widgets, props.charts, props.tables, props.dashboardLayout).map(
        (item) => {
            const cookieHidden =
                hiddenWidgets.hidden.value.has(item.key) || hiddenWidgets.hidden.value.has(item.id)

            return {
                ...item,
                hidden: item.hidden || cookieHidden,
            }
        },
    )
})

const visibleLayoutItems = computed(() => layoutItems.value.filter((item) => !item.hidden))

const widgetDragId = ref<string | null>(null)

/**
 * Rearranging the dashboard is a MODE (DESIGN_RULES rule 3), toggled by one
 * icon button rather than a permanent "Drag widgets..." instruction and a
 * text label on every single card. Drag only activates, and Widen/Narrow
 * only render, while this is on.
 */
const rearrangingLayout = ref(false)
const savingLayout = ref(false)
const layoutSaveError = ref(false)

function onWidgetDragStart(id: string, event: DragEvent) {
    if (!props.userDashboards || !rearrangingLayout.value) {
        event.preventDefault()

        return
    }

    widgetDragId.value = id
    event.dataTransfer?.setData('text/plain', id)

    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
    }
}

function onWidgetDragEnd() {
    widgetDragId.value = null
}

async function persistLayout(items: readonly { id: string; span: number; hidden: boolean }[]) {
    if (savingLayout.value) {
        return
    }

    const href = props.prefix ? `/${props.prefix}/settings/appearance` : '/settings/appearance'
    const body = toPersistedLayout(items)

    savingLayout.value = true
    layoutSaveError.value = false

    try {
        const response = await fetch(href, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN':
                    (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)
                        ?.content ?? '',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ dashboardLayout: body }),
        })

        if (!response.ok) {
            throw new Error(`Layout save failed (${response.status})`)
        }

        router.reload({ only: ['dashboardLayout', 'widgets', 'charts', 'tables'] })
    } catch {
        layoutSaveError.value = true
    } finally {
        savingLayout.value = false
    }
}

async function onWidgetDrop(targetId: string, event: DragEvent) {
    event.preventDefault()

    const from = widgetDragId.value
    widgetDragId.value = null

    if (!props.userDashboards || savingLayout.value || !from || from === targetId) {
        return
    }

    const items = [...layoutItems.value]
    const fromIndex = items.findIndex((item) => item.id === from)
    const toIndex = items.findIndex((item) => item.id === targetId)

    if (fromIndex < 0 || toIndex < 0) {
        return
    }

    const [moved] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, moved)

    await persistLayout(items)
}

async function toggleWidgetSpan(id: string) {
    if (!props.userDashboards) {
        return
    }

    const items = layoutItems.value.map((item) =>
        item.id === id ? { ...item, span: item.span >= 2 ? 1 : 2 } : item,
    )

    await persistLayout(items)
}

const wideLayout = useMediaQuery('(min-width: 1024px)')
const chartBands = computed(() => packWidgetColumns(visibleCharts.value, wideLayout.value ? 2 : 1))
const layoutBands = computed(() =>
    packWidgetColumns(visibleLayoutItems.value, wideLayout.value ? 2 : 1),
)

const hiddenEntries = computed(() => {
    const entries: { id: string; label: string }[] = []
    const seen = new Set<string>()

    const push = (id: string, label: string) => {
        if (seen.has(id)) {
            return
        }

        seen.add(id)
        entries.push({ id, label })
    }

    if (props.userDashboards) {
        for (const item of layoutItems.value) {
            if (item.hidden) {
                const label =
                    'label' in item.source && typeof item.source.label === 'string'
                        ? item.source.label
                        : item.key
                push(item.id, label)
            }
        }
    }

    for (const chart of props.charts) {
        if (hiddenWidgets.hidden.value.has(chart.key)) {
            push(chart.key, chart.label)
        }
    }

    for (const [id, label] of Object.entries(extraLabels.value)) {
        if (hiddenWidgets.hidden.value.has(id)) {
            push(id, label)
        }
    }

    return entries
})

function layoutLabel(item: AnyLayoutItem): string {
    if ('label' in item.source && typeof item.source.label === 'string') {
        return item.source.label
    }

    return item.key
}
</script>

<template>
    <Head :title="heading" />

    <div
        :class="[PAGE_SHELL, '@container/main pk-dashboard flex flex-col gap-4', `pk-dashboard-${design}`]"
        data-slot="dashboard-page"
    >
        <RenderHook position="dashboard.before" :hooks="renderHooks" />

        <!--
            ABOVE EVERYTHING, because a notice below the fold is a notice nobody
            read - which is exactly what the dedicated Announcements page turned
            out to be.
        -->
        <AnnouncementBanners :announcements="announcements" :prefix="prefix" />

        <PkBoundary v-if="'onboarding' in page.props && onboarding.length" label="Get started">
            <SetupChecklist
                :items="onboarding"
                variant="onboarding"
                heading="Get started"
                skip-label="Skip remaining"
                :link-component="InertiaLink"
                @skip="skipOnboarding"
            />
        </PkBoundary>

        <!--
            GUARDED ON THE PROP'S PRESENCE, not just its resolved value. The page
            never registers `checklist` at all for a user without the ability -
            unlike `strip` below, which is given a <Deferred> whenever it is
            offered and would otherwise sit on its loading skeleton forever for
            somebody who was never going to receive it.
        -->
        <PkBoundary v-if="'checklist' in page.props" label="The setup checklist">
            <Deferred data="checklist">
                <template #fallback>
                    <div class="h-24 animate-pulse rounded-lg border bg-muted/30" />
                </template>

                <template #default>
                    <SetupChecklist
                        :items="checklist"
                        :report-href="`${prefix}/operations/monitoring`"
                    />
                </template>
            </Deferred>
        </PkBoundary>

        <div
            class="flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-4"
            data-slot="dashboard-header"
        >
            <div class="min-w-0">
                <h1 class="text-lg font-semibold tracking-tight sm:text-xl">
                    {{ heading }}
                </h1>
                <p v-if="filterSummary" class="truncate text-xs text-muted-foreground">
                    {{ filterSummary }}
                </p>
            </div>

            <div
                v-if="filterDimensions.length || charts.length || hiddenEntries.length"
                class="flex items-center gap-2"
            >
                <button
                    v-if="hiddenEntries.length"
                    type="button"
                    class="relative inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                    aria-label="Hidden widgets"
                    @click="hiddenOpen = true"
                >
                    <svg
                        viewBox="0 0 24 24"
                        class="size-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path :d="iconPath('eye-off')" />
                    </svg>
                    Hidden widgets
                    <span class="ml-0.5 rounded-full bg-muted px-1.5 text-[10px] font-semibold">
                        {{ hiddenEntries.length }}
                    </span>
                </button>
                <button
                    v-if="filters.active"
                    type="button"
                    class="text-xs text-muted-foreground font-normal hover:text-foreground hover:underline"
                    @click="resetFilters"
                >
                    Clear
                </button>
                <button
                    type="button"
                    class="relative inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                    @click="filtersOpen = true"
                >
                    <svg
                        viewBox="0 0 24 24"
                        class="size-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M3 5h18M6 12h12M10 19h4" />
                    </svg>
                    Filters
                    <span
                        v-if="filters.active"
                        class="ml-0.5 rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground"
                    >
                        on
                    </span>
                </button>
            </div>
        </div>

        <DashboardFilterPanel
            :open="filtersOpen"
            :from="filters.from"
            :to="filters.to"
            :selections="filters.selections ?? {}"
            :dimensions="filterDimensions"
            @close="filtersOpen = false"
            @apply="applyFilters"
            @reset="resetFilters"
        />

        <PkSlideover
            :open="hiddenOpen"
            title="Hidden widgets"
            description="Restore cards you hid from this dashboard"
            size="sm"
            @close="hiddenOpen = false"
        >
            <div class="flex flex-col gap-1">
                <label
                    v-for="entry in hiddenEntries"
                    :key="entry.id"
                    class="hover:bg-muted/60 flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm"
                >
                    <input
                        type="checkbox"
                        class="size-4 accent-primary"
                        :checked="selectedHidden.has(entry.id)"
                        @change="toggleHiddenSelection(entry.id)"
                    />
                    <span class="min-w-0 truncate">{{ entry.label }}</span>
                </label>
            </div>
            <template #footer>
                <button
                    type="button"
                    class="rounded-md border bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
                    @click="restoreAllHidden"
                >
                    Restore all
                </button>
                <button
                    type="button"
                    class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    :disabled="selectedHidden.size === 0"
                    @click="restoreSelectedHidden"
                >
                    Restore selected
                </button>
            </template>
        </PkSlideover>

        <!--
            HERE, NOT IN `PanelShell`. It lived in the shell first, which put
            it above the toolbar on every single page - Settings, a resource
            list, wherever somebody clicked next, following them around long
            after they had seen it. It answers exactly one question ("why is
            my sidebar empty"), and the dashboard is the one screen actually
            answering that question, not narration for a page the person is
            trying to use for something else.
        -->
        <EmptyGrantsNotice v-if="emptyGrants" />
        <p v-else-if="!hasAnything" class="text-sm text-muted-foreground font-normal">
            This dashboard has no widgets yet. Declare them in <code>stats()</code> and
            <code>charts()</code> on the page class, or
            <code>discoverWidgets(app_path('Panel/Widgets'))</code>.
        </p>

        <!--
            One strip, four windows on the same metric. Separate cards would say
            "four things"; the shared container says "one thing, measured four
            ways", which is what these are.
        -->
        <!--
            EVERY WIDGET IS ITS OWN BOUNDARY, and that is the whole point of the
            pattern on this page: a dashboard is twenty independent queries, and
            one of them failing must cost one rectangle rather than the page.
            Wrapping the grid once instead would trade a broken widget for a
            broken dashboard, which is the trade this exists to refuse.
        -->
        <PkBoundary v-if="'strip' in page.props" label="The summary strip">
            <Deferred data="strip">
                <template #fallback>
                    <StatStrip :segments="STRIP_PLACEHOLDER" loading />
                </template>

                <template #default>
                    <StatStrip :segments="strip" />
                </template>
            </Deferred>
        </PkBoundary>

        <!--
            ADDITIONAL STRIPS - `DashboardPage::strips()`.

            THE SAME COMPONENT, RENDERED AGAIN. A second row of windows over
            different figures is not a different kind of thing, so it is not a
            different component - and per-segment `sensitive` keeps working
            inside each because nothing here knows or cares about it.

            ONE `PkBoundary` AND ONE `Deferred` EACH, so a strip that throws or
            that is slow costs only its own row.

            THE PLACEHOLDER IS GENERIC HERE. The first strip knows its four
            window labels ahead of time; these are declared by the application,
            so the loading state carries the row's shape without pretending to
            know its wording.
        -->
        <PkBoundary
            v-for="extra in extraStrips"
            :key="extra.key"
            :label="extra.label ?? 'A summary strip'"
        >
            <Deferred :data="`strip_${extra.key}`">
                <template #fallback>
                    <StatStrip :segments="STRIP_PLACEHOLDER" loading />
                </template>

                <template #default>
                    <StatStrip :segments="stripSegments(extra.key)" />
                </template>
            </Deferred>
        </PkBoundary>

        <!--
            Classic path (userDashboards off): one StatStrip for the whole row.
            Custom layout path: stats, charts, and tables share one DnD grid.
        -->
        <PkBoundary v-if="!userDashboards && widgets.length" label="Statistics">
            <Deferred :data="statKeys">
                <template #fallback>
                    <StatStrip
                        :segments="
                            widgets.map((w) => ({
                                key: w.key,
                                label: w.label,
                                value: '',
                                sensitive: false,
                            }))
                        "
                        :columns="statColumns"
                        :maskable="false"
                        loading
                    />
                </template>
                <template #default>
                    <StatStrip :segments="statSegments" :columns="statColumns" :maskable="false" />
                </template>
            </Deferred>
        </PkBoundary>

        <div
            v-if="
                userDashboards &&
                (visibleLayoutItems.length ||
                    $slots['before-charts'] ||
                    (shortcuts?.catalog?.length ?? 0) > 0)
            "
            class="flex flex-col gap-3"
            data-slot="dashboard-layout"
        >
            <slot name="before-charts">
                <DashboardShortcuts
                    v-if="shortcuts?.catalog?.length"
                    :catalog="shortcuts.catalog"
                    :defaults="shortcuts.defaults ?? []"
                    :storage-key="shortcuts.storageKey ?? 'panel.dashboard.shortcuts'"
                />
            </slot>
            <div v-if="visibleLayoutItems.length" class="flex items-center justify-end">
                <!-- Rearrange: a MODE, so an icon with a pressed state (DESIGN_RULES rule 3). -->
                <button
                    type="button"
                    class="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors"
                    :class="rearrangingLayout ? 'border-primary text-primary' : ''"
                    :aria-pressed="rearrangingLayout"
                    :aria-label="rearrangingLayout ? 'Done rearranging' : 'Rearrange widgets'"
                    :title="rearrangingLayout ? 'Done rearranging' : 'Rearrange widgets'"
                    :disabled="savingLayout"
                    @click="rearrangingLayout = !rearrangingLayout"
                >
                    <svg
                        viewBox="0 0 24 24"
                        class="size-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="m3 16 4 4 4-4M7 20V4m14 4-4-4-4 4m4-4v16" />
                    </svg>
                </button>
                <span v-if="savingLayout" class="text-muted-foreground text-xs" role="status">
                    Saving layout…
                </span>
                <span v-else-if="layoutSaveError" class="text-destructive text-xs" role="alert">
                    Layout could not be saved. Try moving a widget again.
                </span>
            </div>
            <template v-for="(band, bandIndex) in layoutBands" :key="`layout-${bandIndex}`">
                <div
                    v-if="band.type === 'wide'"
                    data-slot="dashboard-widget"
                    :draggable="rearrangingLayout"
                    :class="widgetDragId === band.item.id ? 'opacity-40' : ''"
                    @dragstart="onWidgetDragStart(band.item.id, $event)"
                    @dragend="onWidgetDragEnd"
                    @dragover.prevent
                    @drop="onWidgetDrop(band.item.id, $event)"
                >
                    <div
                        v-if="rearrangingLayout"
                        class="mb-1 flex items-center justify-between gap-2"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            class="text-muted-foreground size-3.5 cursor-grab"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <title>Drag to reorder</title>
                            <circle cx="9" cy="6" r="1" />
                            <circle cx="15" cy="6" r="1" />
                            <circle cx="9" cy="12" r="1" />
                            <circle cx="15" cy="12" r="1" />
                            <circle cx="9" cy="18" r="1" />
                            <circle cx="15" cy="18" r="1" />
                        </svg>
                        <button
                            type="button"
                            class="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-6 shrink-0 items-center justify-center rounded border transition-colors"
                            :aria-label="band.item.span >= 2 ? 'Narrow' : 'Widen'"
                            title="Column span"
                            :disabled="savingLayout"
                            @click.stop="toggleWidgetSpan(band.item.id)"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                class="size-3.5"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M3 12h18" />
                                <template v-if="band.item.span >= 2">
                                    <path d="M6 8l4 4-4 4" />
                                    <path d="M18 8l-4 4 4 4" />
                                </template>
                                <template v-else>
                                    <path d="M7 8 3 12l4 4" />
                                    <path d="M17 8l4 4-4 4" />
                                </template>
                            </svg>
                        </button>
                    </div>
                    <template v-if="band.item.kind === 'stat'">
                        <PkBoundary :label="layoutLabel(band.item)" fill>
                            <Deferred :data="`stat_${band.item.key}`">
                                <template #fallback
                                    ><StatCard :label="layoutLabel(band.item)" loading
                                /></template>
                                <template #default>
                                    <StatCard
                                        :label="layoutLabel(band.item)"
                                        :description="(band.item.source as Widget).description"
                                        :value="stat(band.item.key)?.value"
                                        :trend="stat(band.item.key)?.trend"
                                        :sparkline="stat(band.item.key)?.sparkline"
                                        :error="stat(band.item.key)?.error"
                                        retryable
                                        @retry="retryWidget(`stat_${band.item.key}`)"
                                    />
                                </template>
                            </Deferred>
                        </PkBoundary>
                    </template>
                    <DashboardChartPane
                        v-else-if="band.item.kind === 'chart'"
                        :chart="band.item.source as Chart"
                        :series="series(band.item.key)"
                        :periods="periodsFor(band.item.source as Chart)"
                        :period="periods[band.item.key]"
                        :comparison="comparison[periods[band.item.key]]"
                        :body-height="bodyHeight(band.item.source as Chart)"
                        @update:period="(value: string) => setPeriod(band.item.key, value)"
                        @hide="hideWidget(band.item.id, layoutLabel(band.item))"
                    />
                    <DashboardTablePane
                        v-else
                        :table="band.item.source as TableWidgetDecl"
                        :data-key="`table_${band.item.key}`"
                    />
                </div>
                <div
                    v-else
                    class="w-full"
                    :class="band.columns.length > 1 ? 'flex flex-col items-start gap-3 @lg/main:flex-row' : ''"
                    data-slot="dashboard-widget-columns"
                >
                    <div
                        v-for="(column, columnIndex) in band.columns"
                        :key="columnIndex"
                        class="flex w-full min-w-0 flex-1 flex-col gap-3"
                    >
                        <div
                            v-for="item in column"
                            :key="item.id"
                            data-slot="dashboard-widget"
                            :draggable="rearrangingLayout"
                            :class="widgetDragId === item.id ? 'opacity-40' : ''"
                            @dragstart="onWidgetDragStart(item.id, $event)"
                            @dragend="onWidgetDragEnd"
                            @dragover.prevent
                            @drop="onWidgetDrop(item.id, $event)"
                        >
                            <div
                                v-if="rearrangingLayout"
                                class="mb-1 flex items-center justify-between gap-2"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    class="text-muted-foreground size-3.5 cursor-grab"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                >
                                    <title>Drag to reorder</title>
                                    <circle cx="9" cy="6" r="1" />
                                    <circle cx="15" cy="6" r="1" />
                                    <circle cx="9" cy="12" r="1" />
                                    <circle cx="15" cy="12" r="1" />
                                    <circle cx="9" cy="18" r="1" />
                                    <circle cx="15" cy="18" r="1" />
                                </svg>
                                <button
                                    type="button"
                                    class="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-6 shrink-0 items-center justify-center rounded border transition-colors"
                                    aria-label="Widen"
                                    title="Column span"
                                    :disabled="savingLayout"
                                    @click.stop="toggleWidgetSpan(item.id)"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        class="size-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="M3 12h18" />
                                        <path d="M7 8 3 12l4 4" />
                                        <path d="M17 8l4 4-4 4" />
                                    </svg>
                                </button>
                            </div>
                            <template v-if="item.kind === 'stat'">
                                <PkBoundary :label="layoutLabel(item)" fill>
                                    <Deferred :data="`stat_${item.key}`">
                                        <template #fallback
                                            ><StatCard :label="layoutLabel(item)" loading
                                        /></template>
                                        <template #default>
                                            <StatCard
                                                :label="layoutLabel(item)"
                                                :description="(item.source as Widget).description"
                                                :value="stat(item.key)?.value"
                                                :trend="stat(item.key)?.trend"
                                                :sparkline="stat(item.key)?.sparkline"
                                                :error="stat(item.key)?.error"
                                                retryable
                                                @retry="retryWidget(`stat_${item.key}`)"
                                            />
                                        </template>
                                    </Deferred>
                                </PkBoundary>
                            </template>
                            <DashboardChartPane
                                v-else-if="item.kind === 'chart'"
                                :chart="item.source as Chart"
                                :series="series(item.key)"
                                :periods="periodsFor(item.source as Chart)"
                                :period="periods[item.key]"
                                :comparison="comparison[periods[item.key]]"
                                :body-height="bodyHeight(item.source as Chart)"
                                @update:period="(value: string) => setPeriod(item.key, value)"
                                @hide="hideWidget(item.id, layoutLabel(item))"
                            />
                            <DashboardTablePane
                                v-else
                                :table="item.source as TableWidgetDecl"
                                :data-key="`table_${item.key}`"
                            />
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <div
            v-if="
                !userDashboards &&
                (visibleCharts.length ||
                    $slots['before-charts'] ||
                    (shortcuts?.catalog?.length ?? 0) > 0)
            "
            class="flex flex-col gap-3"
            data-slot="dashboard-charts"
        >
            <slot name="before-charts">
                <DashboardShortcuts
                    v-if="shortcuts?.catalog?.length"
                    :catalog="shortcuts.catalog"
                    :defaults="shortcuts.defaults ?? []"
                    :storage-key="shortcuts.storageKey ?? 'panel.dashboard.shortcuts'"
                />
            </slot>
            <template v-for="(band, bandIndex) in chartBands" :key="bandIndex">
                <div v-if="band.type === 'wide'" class="w-full" data-slot="dashboard-widget">
                    <DashboardChartPane
                        :chart="band.item"
                        :series="series(band.item.key)"
                        :periods="periodsFor(band.item)"
                        :period="periods[band.item.key]"
                        :comparison="comparison[periods[band.item.key]]"
                        :body-height="bodyHeight(band.item)"
                        @update:period="(value: string) => setPeriod(band.item.key, value)"
                        @hide="hideWidget(band.item.key, band.item.label)"
                    />
                </div>
                <div
                    v-else
                    class="w-full"
                    :class="band.columns.length > 1 ? 'flex flex-col items-start gap-3 @lg/main:flex-row' : ''"
                    data-slot="dashboard-widget-columns"
                >
                    <div
                        v-for="(column, columnIndex) in band.columns"
                        :key="columnIndex"
                        class="flex w-full min-w-0 flex-1 flex-col gap-3"
                    >
                        <div v-for="chart in column" :key="chart.key" data-slot="dashboard-widget">
                            <DashboardChartPane
                                :chart="chart"
                                :series="series(chart.key)"
                                :periods="periodsFor(chart)"
                                :period="periods[chart.key]"
                                :comparison="comparison[periods[chart.key]]"
                                :body-height="bodyHeight(chart)"
                                @update:period="(value: string) => setPeriod(chart.key, value)"
                                @hide="hideWidget(chart.key, chart.label)"
                            />
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <div
            v-if="!userDashboards && tables.length"
            class="flex flex-col gap-3"
            data-slot="dashboard-tables"
        >
            <DashboardTablePane
                v-for="table in tables"
                :key="table.key"
                :table="table"
                :data-key="`table_${table.key}`"
            />
        </div>

        <RenderHook position="dashboard.after" :hooks="renderHooks" />
    </div>
</template>
