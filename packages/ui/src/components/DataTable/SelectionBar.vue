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
        class="border-primary/20 bg-primary/[0.06] flex min-h-12 flex-wrap items-center gap-2.5 rounded-lg border px-3 py-2 text-sm sm:gap-3 sm:px-3.5"
        role="status"
        aria-live="polite"
        aria-label="Selection actions"
    >
        <span
            class="bg-primary/10 text-primary inline-flex size-8 shrink-0 items-center justify-center rounded-md"
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

        <div class="min-w-0 flex-1 basis-[9rem]">
            <p class="text-foreground truncate text-sm font-semibold leading-5 tabular-nums">
                {{ selectionSummary }}
            </p>
            <p class="text-muted-foreground hidden text-xs leading-4 sm:block">
                {{ allMatching ? 'Every matching record is included' : 'Ready for a bulk action' }}
            </p>
        </div>

        <button
            v-if="!allMatching && total !== undefined && total > count"
            type="button"
            class="border-primary/25 bg-background text-primary hover:bg-primary/10 inline-flex min-h-9 items-center rounded-md border px-3 text-sm font-medium transition-colors"
            @click="emit('select-all-matching')"
        >
            Select all {{ format(total) }}
        </button>

        <!-- Desktop bulk actions stay inline. -->
        <div class="hidden items-center gap-2 md:flex">
            <slot name="actions" />
        </div>

        <!-- Mobile: collapse bulk actions into a bottom drawer. -->
        <div class="md:hidden">
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

        <div class="ml-auto flex items-center gap-1">
            <button
                type="button"
                class="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors"
                aria-label="Clear selection"
                @click="emit('clear')"
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
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                <span class="hidden sm:inline">Clear</span>
            </button>
        </div>
    </div>
</template>
