<script setup lang="ts">
import PkSkeleton from '../primitives/PkSkeleton.vue'
/**
 * One number on the dashboard, with an optional trend and sparkline.
 *
 * EVERY STATE IS THE SAME HEIGHT - skeleton, error, and resolved. Six cards
 * resolving independently is the whole point of deferring them; if each one
 * changes height on arrival the page reflows six times and the operator's
 * cursor lands on the wrong card. Cumulative layout shift target is 0 (§10),
 * and that is a property of THIS component, not of the page using it.
 *
 * THE SPARKLINE IS A FULL-BLEED FOOTER, not a background behind the text.
 * Positioning it absolutely under the content looked tidy in isolation and put
 * the curve straight through the trend line - "▲ 13.4% vs previous 30 days"
 * read across a moving graph, which is unreadable at any opacity. Below the
 * content and flush to the card edges, it reads as the card's own texture,
 * which is what makes a row of these scannable.
 *
 * Grid rows stretch, so a card with a series and one without still line up.
 */
import Sparkline from './Sparkline.vue'
import TrendBadge from './TrendBadge.vue'

withDefaults(
    defineProps<{
        label: string
        description?: string | null
        value?: unknown
        trend?: {
            direction: 'up' | 'down' | 'flat' | 'new'
            percentage: number | null
        } | null
        comparison?: string
        sparkline?: { label: string; value: number }[] | null
        loading?: boolean
        error?: boolean
        /** Offer an in-place retry action when the value failed. */
        retryable?: boolean
        /** True when a DECREASE is the good outcome. */
        inverted?: boolean
    }>(),
    {
        description: null,
        trend: null,
        sparkline: null,
        loading: false,
        error: false,
        retryable: false,
        inverted: false,
    },
)

defineEmits<{
    (e: 'retry'): void
}>()

const format = (v: unknown) =>
    typeof v === 'number' ? new Intl.NumberFormat().format(v) : String(v ?? '-')
</script>

<template>
    <div
        class="bg-card flex flex-col overflow-hidden rounded-lg border"
        data-slot="stat-card"
        :aria-busy="loading ? 'true' : undefined"
    >
        <div class="flex flex-1 flex-col gap-1 p-4">
            <p class="text-muted-foreground relative text-xs font-medium">
                {{ label }}
            </p>

            <!-- The `number` shape matches the resolved line exactly, which
                 is what keeps the card from jumping when the value lands. -->
            <PkSkeleton v-if="loading" variant="number" class="my-1" />

            <div
                v-else-if="error"
                class="text-destructive relative flex h-8 items-center gap-3 text-sm"
                role="alert"
            >
                <span>Could not load</span>
                <button
                    v-if="retryable"
                    type="button"
                    class="text-foreground hover:bg-accent rounded-md border px-2 py-1 text-xs font-medium transition-colors"
                    @click="$emit('retry')"
                >
                    Retry
                </button>
            </div>

            <span v-else class="relative flex h-8 items-center text-2xl font-semibold tabular-nums">
                {{ format(value) }}
            </span>

            <TrendBadge
                v-if="trend && !loading && !error"
                class="relative"
                :direction="trend.direction"
                :percentage="trend.percentage"
                :comparison="comparison"
                :inverted="inverted"
            />

            <p v-else-if="description" class="text-muted-foreground relative text-xs">
                {{ description }}
            </p>
        </div>

        <!-- Full bleed: no padding, flush to the bottom edge. -->
        <div
            v-if="sparkline && sparkline.length > 1 && !loading && !error"
            class="-mb-px"
            aria-hidden="true"
        >
            <Sparkline :data="sparkline" :height="44" filled />
        </div>
    </div>
</template>
