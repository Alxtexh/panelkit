<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { iconPath } from '../primitives/icons'
import PkSkeleton from '../primitives/PkSkeleton.vue'
/**
 * The frame around a chart: title, period selector, trend, and the chart slot.
 *
 * IT DOES NOT FETCH. Selecting a period emits `update:period` and nothing else
 * - the page decides that this means an Inertia partial reload of one prop.
 * That is package rule 2 (§4), and it is what lets the same card work outside
 * Inertia later.
 *
 * THE CARD IS THE ONLY FRAME. The chart inside draws no border and no heading
 * of its own; nesting a bordered chart inside a bordered card is the wrapper
 * stack the layout renderer already avoids.
 *
 * The body height is FIXED across loading, error and loaded states unless
 * `fitBody` is set. A skeleton shorter than the chart makes the whole
 * dashboard jump when six cards resolve at slightly different times. A
 * detailer (label/value rows) sizes to its content instead.
 *
 * COLLAPSE IS LOCAL AND EPHEMERAL. Hide is the page's job: this card emits
 * `hide` and stays mounted until the parent stops rendering it. The body
 * uses `v-if`, not `v-show`: a hidden plot with min-height still reserved
 * a white hole, and a grid neighbour could stretch the card around it.
 * Unmounting the body leaves a thin header; the plot remounts on expand,
 * the same as a widget that was hidden and restored.
 */
const props = withDefaults(
    defineProps<{
        label: string
        description?: string | null
        /** Omit to hide the selector entirely. */
        periods?: { value: string; label: string }[] | null
        period?: string
        loading?: boolean
        error?: boolean
        /** Offer an in-place retry action when the series failed. */
        retryable?: boolean
        bodyHeight?: number
        /** Size the body to its content once loaded. */
        fitBody?: boolean
        /** Offer the collapse control at all. */
        collapsible?: boolean
        defaultCollapsed?: boolean
        /** Offer a hide control. The parent decides what hiding means. */
        hideable?: boolean
        /** Semantic icon name from `iconPath`. The `icon` slot wins if given. */
        icon?: string | null
    }>(),
    {
        description: null,
        periods: null,
        loading: false,
        error: false,
        retryable: false,
        bodyHeight: 220,
        fitBody: false,
        collapsible: true,
        defaultCollapsed: false,
        hideable: false,
        icon: null,
    },
)

defineEmits<{
    (e: 'update:period', value: string): void
    (e: 'hide'): void
    (e: 'retry'): void
}>()

const slots = useSlots()
const collapsed = ref(props.defaultCollapsed)
const showNamedIcon = computed(() => Boolean(props.icon) && !slots.icon)

const bodyStyle = computed(() => {
    if (props.fitBody && !props.loading && !props.error) {
        return undefined
    }

    return { minHeight: `${props.bodyHeight}px` }
})
</script>

<template>
    <div
        class="@container/card bg-card flex w-full flex-col self-start rounded-lg border"
        :class="collapsed ? 'px-4 py-2' : 'gap-3 p-4'"
        data-slot="chart-card"
        :data-collapsed="collapsed ? 'true' : 'false'"
        :aria-busy="loading ? 'true' : undefined"
    >
        <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="flex min-w-0 items-start gap-2">
                <slot name="icon">
                    <svg
                        v-if="showNamedIcon"
                        class="text-muted-foreground mt-0.5 size-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path :d="iconPath(icon)" />
                    </svg>
                </slot>

                <div class="min-w-0">
                    <p class="text-sm font-medium">{{ label }}</p>
                    <p v-if="description" class="text-muted-foreground mt-0.5 text-xs">
                        {{ description }}
                    </p>

                    <!-- Trend sits under the title, where it reads as a property
                         of the metric rather than of the selected period. -->
                    <slot name="trend" />
                </div>
            </div>

            <div class="flex shrink-0 items-center gap-1.5">
                <slot name="actions" />

                <div
                    v-if="periods && periods.length"
                    class="bg-muted/60 flex items-center gap-0.5 rounded-md p-0.5"
                    role="group"
                    aria-label="Period"
                >
                    <button
                        v-for="option in periods"
                        :key="option.value"
                        type="button"
                        class="rounded px-2 py-1 text-xs transition-colors"
                        :class="
                            period === option.value
                                ? 'bg-background text-foreground font-medium shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        "
                        :aria-pressed="period === option.value"
                        @click="$emit('update:period', option.value)"
                    >
                        {{ option.label }}
                    </button>
                </div>

                <!--
                    THE CHEVRON, NOT A SHOW/HIDE WORD - the header stays a fixed
                    width whichever state it is in, which a two-state label
                    would not.
                -->
                <button
                    v-if="collapsible"
                    type="button"
                    class="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors"
                    :aria-expanded="!collapsed"
                    :aria-label="collapsed ? `Expand ${label}` : `Collapse ${label}`"
                    :title="collapsed ? 'Expand' : 'Collapse'"
                    @click="collapsed = !collapsed"
                >
                    <svg
                        class="size-4 transition-transform"
                        :class="collapsed ? '' : 'rotate-180'"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>

                <button
                    v-if="hideable"
                    type="button"
                    class="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors"
                    :aria-label="`Hide ${label}`"
                    title="Hide"
                    @click="$emit('hide')"
                >
                    <svg
                        class="size-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path :d="iconPath('eye-off')" />
                    </svg>
                </button>
            </div>
        </div>

        <div
            v-if="!collapsed"
            :style="bodyStyle"
            class="flex flex-col justify-center"
            data-slot="chart-card-body"
        >
            <PkSkeleton v-if="loading" variant="block" :height="bodyHeight" />

            <p
                v-else-if="error"
                class="text-destructive flex flex-col items-center justify-center gap-3 text-sm"
                :style="{ height: `${bodyHeight}px` }"
                role="alert"
            >
                Could not load
                <button
                    v-if="retryable"
                    type="button"
                    class="text-foreground hover:bg-accent rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
                    @click="$emit('retry')"
                >
                    Try again
                </button>
            </p>

            <slot v-else />
        </div>
    </div>
</template>
