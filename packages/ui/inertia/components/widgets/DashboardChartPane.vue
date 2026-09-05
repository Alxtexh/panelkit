<script setup lang="ts">
/**
 * One dashboard chart: boundary, deferred prop, card, plot.
 *
 * EXTRACTED so the masonry columns and a full-width band can render the same
 * frame without copying the Deferred tree. Layout (which column) stays on the
 * page; this is only the card. Echo replaces poll when `chart.live` is set and
 * `window.Echo` exists.
 */
import { Deferred, router } from '@inertiajs/vue3'
import { computed } from 'vue'
import { ChartCard, PkBoundary, TrendBadge } from '@alxtexh-enterprise/panel'
import { useWidgetPoll } from '../../composables/useWidgetPoll'
import ChartBody from './ChartBody.vue'
import type { Chart, Series } from './types'

const props = withDefaults(defineProps<{
    chart: Chart
    series: Series
    periods: { value: string; label: string }[] | null
    period?: string
    comparison?: string
    bodyHeight: number
    /** Namespace used by header/page widget hosts. */
    prefix?: string
}>(), { prefix: '' })

const dataKey = computed(() =>
    props.prefix ? `${props.prefix}_chart_${props.chart.key}` : `chart_${props.chart.key}`,
)

function retry() {
    router.reload({ only: [dataKey.value], preserveState: true, preserveScroll: true })
}

defineEmits<{
    (e: 'update:period', value: string): void
    (e: 'hide'): void
}>()

useWidgetPoll(
    () => [dataKey.value],
    () => props.chart.poll ?? null,
    () => props.chart.live ?? null,
)
</script>

<template>
    <PkBoundary :label="chart.label">
        <Deferred :data="dataKey">
            <template #fallback>
                <ChartCard
                    :label="chart.label"
                    :description="chart.description"
                    :icon="chart.icon"
                    :periods="periods"
                    :period="period"
                    :body-height="bodyHeight"
                    :fit-body="
                        chart.type === 'table' ||
                        chart.type === 'barcode' ||
                        chart.type === 'logtail'
                    "
                    hideable
                    loading
                    @hide="$emit('hide')"
                />
            </template>

            <template #default>
                <ChartCard
                    :label="chart.label"
                    :description="chart.description"
                    :icon="chart.icon"
                    :periods="periods"
                    :period="period"
                    :error="series.error"
                    :body-height="bodyHeight"
                    :fit-body="
                        chart.type === 'table' ||
                        chart.type === 'barcode' ||
                        chart.type === 'logtail'
                    "
                    hideable
                    retryable
                    @update:period="$emit('update:period', $event)"
                    @hide="$emit('hide')"
                    @retry="retry"
                >
                    <template v-if="series.trend" #trend>
                        <TrendBadge
                            class="mt-1"
                            :direction="series.trend.direction"
                            :percentage="series.trend.percentage"
                            :comparison="comparison"
                        />
                    </template>

                    <ChartBody :chart="chart" :data="series" />
                </ChartCard>
            </template>
        </Deferred>
    </PkBoundary>
</template>
