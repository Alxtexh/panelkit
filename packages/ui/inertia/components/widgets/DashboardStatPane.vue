<script setup lang="ts">
/**
 * One stat tile, with optional Echo or poll of its deferred prop.
 *
 * Reverb when `window.Echo` and `widget.live` are set: push, no periodic HTTP.
 * Poll when Echo is absent: works everywhere, pauses while the tab is hidden.
 * Never both. Redis is not the UI transport.
 */
import { Deferred, router } from '@inertiajs/vue3'
import { PkBoundary, StatCard } from '@alxtexh-enterprise/panel'
import { useWidgetPoll } from '../../composables/useWidgetPoll'
import type { StatDefinition, StatValue } from './types'

const props = defineProps<{
    prefix: string
    widget: StatDefinition
    value?: StatValue
}>()

const dataKey = `${props.prefix}_stat_${props.widget.key}`

function retry() {
    router.reload({ only: [dataKey], preserveState: true, preserveScroll: true })
}

useWidgetPoll(
    () => [dataKey],
    () => props.widget.poll ?? null,
    () => props.widget.live ?? null,
)
</script>

<template>
    <PkBoundary :label="widget.label" fill>
        <Deferred :data="`${prefix}_stat_${widget.key}`">
            <template #fallback>
                <StatCard :label="widget.label" :description="widget.description" loading />
            </template>

            <template #default>
                <StatCard
                    :label="widget.label"
                    :description="widget.description"
                    :value="value?.value"
                    :trend="value?.trend"
                    :sparkline="value?.sparkline"
                    :error="value?.error"
                    retryable
                    @retry="retry"
                />
            </template>
        </Deferred>
    </PkBoundary>
</template>
