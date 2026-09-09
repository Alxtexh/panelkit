<script setup lang="ts">
import PkSkeleton from '../primitives/PkSkeleton.vue'
/**
 * Status tabs with counts.
 *
 * Rendered as a SEGMENTED CONTROL rather than underlined text. The underline
 * version read as a row of links with grey numbers after them - the counts
 * looked like stray text rather than part of the tab, and nothing said "these
 * are selectable". A filled pill for the active tab and a bordered count badge
 * on every tab makes both facts obvious at a glance.
 *
 * Counts arrive from ONE grouped aggregate query on the server (addendum C1:
 * "N tabs must never produce N queries") and are deferred, so they land after
 * the rows rather than in front of them.
 *
 * While counts are in flight each tab shows a placeholder, not a zero. A zero
 * that later becomes 47 reads as data changing under the operator; a
 * placeholder reads as "still counting", which is the truth.
 */
withDefaults(
    defineProps<{
        tabs: string[]
        active: string | null
        /** Deferred - undefined until the grouped count query resolves. */
        counts?: Record<string, number>
    }>(),
    {},
)

const emit = defineEmits<{ (e: 'select', tab: string | null): void }>()

/** Compact so a six-figure count does not stretch the tab. */
function format(n: number): string {
    if (n >= 1_000_000) {
        return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M'
    }

    if (n >= 10_000) {
        return Math.round(n / 1000) + 'k'
    }

    return new Intl.NumberFormat().format(n)
}
</script>

<template>
    <div
        class="pk-tabs bg-muted/40 flex w-fit max-w-full shrink-0 items-center gap-0.5 overflow-x-auto rounded-lg p-1"
        role="tablist"
        aria-label="Table views"
    >
        <button
            type="button"
            role="tab"
            class="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm capitalize transition-colors"
            :class="
                active === null
                    ? 'bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30'
                    : 'text-muted-foreground hover:text-foreground'
            "
            :aria-current="active === null ? 'page' : undefined"
            :aria-selected="active === null"
            @click="emit('select', null)"
        >
            All
            <span
                v-if="counts"
                class="rounded px-1.5 py-0.5 text-[11px] leading-none tabular-nums"
                :class="
                    active === null
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted-foreground/15'
                "
                :title="new Intl.NumberFormat().format(counts.all ?? 0)"
            >
                {{ format(counts.all ?? 0) }}
            </span>
            <PkSkeleton v-else variant="badge" label="Counting" />
        </button>

        <button
            v-for="tab in tabs"
            :key="tab"
            type="button"
            role="tab"
            class="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm capitalize transition-colors"
            :class="
                active === tab
                    ? 'bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30'
                    : 'text-muted-foreground hover:text-foreground'
            "
            :aria-current="active === tab ? 'page' : undefined"
            :aria-selected="active === tab"
            @click="emit('select', tab)"
        >
            {{ tab }}
            <span
                v-if="counts"
                class="rounded px-1.5 py-0.5 text-[11px] leading-none tabular-nums"
                :class="
                    active === tab ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/15'
                "
                :title="new Intl.NumberFormat().format(counts[tab] ?? 0)"
            >
                {{ format(counts[tab] ?? 0) }}
            </span>
            <PkSkeleton v-else variant="badge" label="Counting" />
        </button>
    </div>
</template>

<style scoped>
/* The strip scrolls sideways when a resource declares many tabs, but must never
   scroll vertically, and the bar itself would be visual noise on a control this
   small. */
.pk-tabs {
    scrollbar-width: none;
    overflow-y: hidden;
}

.pk-tabs::-webkit-scrollbar {
    display: none;
}
</style>
