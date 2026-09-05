<script setup lang="ts">
/**
 * A row of widgets, on any screen that hosts them.
 *
 * THE THIRD HOST HAD NOWHERE TO RENDER. `WidgetSet` serialises stats and charts
 * for three hosts - `DashboardPage`, `Resource::headerWidgets()` and
 * `Page::headerWidgets()` - and only the dashboard drew them. `ResourceIndex`
 * drew the stats and dropped the charts on the floor; a custom page received
 * the props and had nothing to draw either with, so `Page::headerWidgets()` was
 * a declared extension point whose output was invisible. This is that renderer,
 * once, for all three.
 *
 * READ OFF PAGE PROPS RATHER THAN `defineProps`, because the server sends NO
 * KEY AT ALL when a screen declares no widgets - which is nearly every screen.
 * `v-if` on the prop, not on its length, is what keeps the common case
 * byte-identical to having no row: an empty array would draw an empty grid with
 * spacing around nothing.
 *
 * THE PREFIX IS THE SEAM. `WidgetSet::props($widgets, $user, $prefix)`
 * namespaces every key it emits, so one screen can host more than one set. The
 * dashboard uses the default `''`-ish keys of its own making; a header row uses
 * `header`. Passing it here is what lets this component serve both without
 * knowing which screen it is on.
 *
 * THE RESOLVED VALUE COMES FROM PAGE PROPS, NOT THE `<Deferred>` SLOT.
 * `<Deferred>` gates WHEN its default slot renders; it does not hand the value
 * in as a slot prop. Reading `slotProps[key]` looks plausible and silently
 * renders an em dash for every card - the numbers arrive correctly and are
 * thrown away. That bug has been paid for twice in this codebase already.
 */
import { Deferred, router, usePage } from '@inertiajs/vue3'
import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'
import { ChartCard, PkBoundary, TrendBadge, packWidgetColumns } from '@alxtexh-enterprise/panel'
import ChartBody from './ChartBody.vue'
import DashboardStatPane from './DashboardStatPane.vue'
import DashboardTablePane from './DashboardTablePane.vue'
import type { TableWidgetDecl } from './DashboardTablePane.vue'
import { emptySeries } from './types'
import type { Chart, Series, StatDefinition, StatValue } from './types'
import WidgetRefresh from './WidgetRefresh.vue'

const props = withDefaults(
    defineProps<{
        /** Matches the `$prefix` given to `WidgetSet::props()` on the server. */
        prefix?: string
    }>(),
    { prefix: 'header' },
)

const page = usePage()

const bag = computed(() => page.props as Record<string, any>)

const stats = computed<StatDefinition[]>(() => bag.value[`${props.prefix}Widgets`] ?? [])

const charts = computed<Chart[]>(() => bag.value[`${props.prefix}Charts`] ?? [])

const tables = computed<TableWidgetDecl[]>(() => bag.value[`${props.prefix}Tables`] ?? [])

function stat(key: string): StatValue | undefined {
    return bag.value[`${props.prefix}_stat_${key}`] as StatValue | undefined
}

function series(key: string): Series {
    return (bag.value[`${props.prefix}_chart_${key}`] as Series | undefined) ?? emptySeries()
}

function retry(dataKey: string) {
    router.reload({ only: [dataKey], preserveState: true, preserveScroll: true })
}

/**
 * How tall the plot area is, per renderer.
 *
 * A RANKED BAR NEEDS ROOM FOR ITS LABELS - it is the one chart whose category
 * axis carries long names, and at the default height they overlap into an
 * unreadable smear.
 */
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

const wideLayout = useMediaQuery('(min-width: 1024px)')
const chartBands = computed(() => packWidgetColumns(charts.value, wideLayout.value ? 2 : 1))
</script>

<template>
    <!--
        THE FALLBACK IS A LOADING CARD, NOT A BLANK. Every value here is
        deferred, so the row draws its labels immediately and fills in.

        `PkBoundary` PER CARD, so one widget throwing loses one tile rather than
        the screen it sits on.
    -->
    <div v-if="stats?.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardStatPane
            v-for="widget in stats"
            :key="widget.key"
            :prefix="prefix"
            :widget="widget"
            :value="stat(widget.key)"
        />
    </div>

    <WidgetRefresh
        v-for="chart in charts"
        :key="`refresh-${chart.key}`"
        :keys="[`${prefix}_chart_${chart.key}`]"
        :poll="chart.poll"
        :live="chart.live"
    />

    <!--
        COLUMN TRACKS, not a shared-row grid: collapsing one card must not
        stretch its neighbour or leave a hole above the next widget.
    -->
    <div v-if="charts?.length" class="flex flex-col gap-4">
        <template v-for="(band, bandIndex) in chartBands" :key="bandIndex">
            <PkBoundary v-if="band.type === 'wide'" :label="band.item.label">
                <Deferred :data="`${prefix}_chart_${band.item.key}`">
                    <template #fallback>
                        <ChartCard
                            :label="band.item.label"
                            :description="band.item.description"
                            :body-height="bodyHeight(band.item)"
                            loading
                        />
                    </template>
                    <template #default>
                        <ChartCard
                            :label="band.item.label"
                            :description="band.item.description"
                            :error="series(band.item.key).error"
                            :body-height="bodyHeight(band.item)"
                            retryable
                            @retry="retry(`${prefix}_chart_${band.item.key}`)"
                        >
                            <template v-if="series(band.item.key).trend" #trend>
                                <TrendBadge
                                    class="mt-1"
                                    :direction="series(band.item.key).trend!.direction"
                                    :percentage="series(band.item.key).trend!.percentage"
                                />
                            </template>
                            <ChartBody
                                :chart="band.item"
                                :data="series(band.item.key)"
                                :item-path="typeof bag.itemPath === 'string' ? bag.itemPath : null"
                            />
                        </ChartCard>
                    </template>
                </Deferred>
            </PkBoundary>
            <div v-else class="flex flex-col items-start gap-4 lg:flex-row">
                <div
                    v-for="(column, columnIndex) in band.columns"
                    :key="columnIndex"
                    class="flex w-full min-w-0 flex-1 flex-col gap-4"
                >
                    <PkBoundary v-for="chart in column" :key="chart.key" :label="chart.label">
                        <Deferred :data="`${prefix}_chart_${chart.key}`">
                            <template #fallback>
                                <ChartCard
                                    :label="chart.label"
                                    :description="chart.description"
                                    :body-height="bodyHeight(chart)"
                                    loading
                                />
                            </template>
                            <template #default>
                                <ChartCard
                                    :label="chart.label"
                                    :description="chart.description"
                                    :error="series(chart.key).error"
                                    :body-height="bodyHeight(chart)"
                                    retryable
                                    @retry="retry(`${prefix}_chart_${chart.key}`)"
                                >
                                    <template v-if="series(chart.key).trend" #trend>
                                        <TrendBadge
                                            class="mt-1"
                                            :direction="series(chart.key).trend!.direction"
                                            :percentage="series(chart.key).trend!.percentage"
                                        />
                                    </template>
                                    <ChartBody
                                        :chart="chart"
                                        :data="series(chart.key)"
                                        :item-path="
                                            typeof bag.itemPath === 'string' ? bag.itemPath : null
                                        "
                                    />
                                </ChartCard>
                            </template>
                        </Deferred>
                    </PkBoundary>
                </div>
            </div>
        </template>
    </div>

    <div v-if="tables.length" class="flex flex-col gap-4">
        <DashboardTablePane
            v-for="table in tables"
            :key="table.key"
            :table="table"
            :data-key="`${prefix}_table_${table.key}`"
        />
    </div>
</template>
