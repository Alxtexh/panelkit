<script setup lang="ts">
/**
 * The bar that appears when rows are selected.
 *
 * §8 requires "select-all-matching-filter, not just select-all-on-page", and the
 * distinction is the whole point: the header checkbox selects the ten rows you
 * can see, while the operator's intent is usually "all 3,243 expired clients".
 * Offering only the first silently under-applies a bulk action - it reports
 * success having done a fraction of the work.
 *
 * So the bar always states WHICH of the two is selected, and offers the other
 * explicitly. "Select all N" and "Deselect all" sit together, because someone
 * who over-selects needs the way back to be as obvious as the way in.
 *
 * PLAIN TEXT AND LINKS, NOT A CARD. This used to be its own tinted, bordered
 * banner with an icon badge and a subtitle line - a component that visually
 * outweighed the toolbar it replaces, for a state (some rows are ticked) that
 * is common rather than exceptional. Filament's own table states this with a
 * count, two plain links, and the actions trigger, all at the same visual
 * weight as the rest of the toolbar row. This now does the same: no border, no
 * background, no icon, sized like `TableToolbar` so swapping between the two
 * on select/deselect does not jump the layout.
 *
 * Actions come through the slot. This owns the selection surface, never what an
 * action does - it does not fetch (spec §4 rule 2).
 */
import { computed, ref } from 'vue'
import Sheet from '../shadcn/sheet/Sheet.vue'
import SheetContent from '../shadcn/sheet/SheetContent.vue'

const props = withDefaults(
    defineProps<{
        count: number
        /** True when the selection means "everything matching the filters". */
        allMatching: boolean
        /** Deferred - undefined until the count lands. */
        total?: number
    }>(),
    {},
)

const emit = defineEmits<{
    (e: 'select-all-matching'): void
    (e: 'clear'): void
}>()

const mobileActionsOpen = ref(false)

const format = (n: number) => new Intl.NumberFormat().format(n)

const selectionSummary = computed(() => {
    if (props.allMatching) {
        return props.total !== undefined
            ? `All ${format(props.total)} matching records`
            : 'All matching records'
    }

    return `${format(props.count)} selected`
})
</script>

<template>
    <div
        data-slot="selection-bar"
        class="flex min-h-9 flex-wrap items-center gap-x-4 gap-y-2 text-sm"
        role="status"
        aria-live="polite"
        aria-label="Selection actions"
    >
        <span class="text-foreground font-medium tabular-nums">
            {{ selectionSummary }}
        </span>

        <button
            v-if="!allMatching && total !== undefined && total > count"
            type="button"
            class="text-primary font-medium hover:underline"
            @click="emit('select-all-matching')"
        >
            Select all {{ format(total) }}
        </button>

        <button
            type="button"
            class="text-destructive font-medium hover:underline"
            @click="emit('clear')"
        >
            Deselect all
        </button>

        <!-- Desktop bulk actions stay inline. -->
        <div class="ml-auto hidden items-center gap-2 md:flex">
            <slot name="actions" />
        </div>

        <!-- Mobile: collapse bulk actions into a bottom drawer. -->
        <div class="ml-auto md:hidden">
            <button
                type="button"
                dusk="mobile-bulk-actions"
                class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium shadow-sm transition-colors"
                @click="mobileActionsOpen = true"
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
                    <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                Actions
            </button>

            <Sheet :open="mobileActionsOpen" @update:open="mobileActionsOpen = $event">
                <SheetContent side="bottom" class="max-h-[70vh] gap-0 overflow-hidden p-0">
                    <div class="border-b px-4 py-4">
                        <div class="flex items-start gap-3">
                            <span
                                class="bg-primary/10 text-primary inline-flex size-9 shrink-0 items-center justify-center rounded-lg"
                                aria-hidden="true"
                            >
                                <svg
                                    class="size-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="m5 12 4 4L19 6" />
                                </svg>
                            </span>
                            <div>
                                <p class="text-foreground text-base font-semibold">Bulk actions</p>
                                <p class="text-muted-foreground text-sm font-normal">
                                    {{ selectionSummary }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 overflow-y-auto p-4">
                        <slot name="actions" />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    </div>
</template>
