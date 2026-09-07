<script setup lang="ts">
/**
 * ONE MENU that acts on a selection, plus export.
 *
 * IT WAS A ROW OF BUTTONS - Activate, Suspend, Restore, Delete, Export CSV all
 * laid out side by side above the table. That is the same mistake the row
 * actions had: every verb a resource declares competing for attention at equal
 * weight, in a bar that appears the moment a checkbox is ticked and pushes the
 * table down. A resource with eight bulk actions wrapped onto two lines.
 *
 * FILAMENT'S SHAPE, AND FOR ITS REASON: `BulkActionGroup` is a dropdown, and the
 * selection bar carries a count and one trigger. The destructive action is then
 * somewhere deliberate rather than one pixel from "Activate".
 *
 * IT DOES NOT FETCH (§4 rule 2). It emits `run` with an action key and `export`
 * with nothing; the page owns the request, the polling and the reload. That is
 * what keeps this component usable outside Inertia.
 *
 * CONFIRMATION IS RESOLVED HERE, NOT BY THE PAGE, because the copy travels in
 * the schema and belongs to the action. A page-level `confirm()` would mean
 * every consumer reimplements the same dialog, and browser `confirm` blocks the
 * event loop and cannot be styled or tested.
 *
 * A destructive action always confirms - the server sets that default too, so
 * a definition that forgets `requiresConfirmation` still gets one.
 *
 * EXPORT CONFIRMS TOO NOW - roadmap 3.10. It used to skip the dialog on the
 * reasoning that reading needs no confirmation, which is true of the WRITE
 * and beside the point: "how many, and is that what you meant?" is a
 * question about the SELECTION, not about whether the action mutates
 * anything, and it is exactly the select-all-matching case - "everything
 * matching this filter" - where the real number is most likely to surprise
 * whoever clicked it.
 *
 * THE COUNT IS `total`, ALREADY ON THE PAGE - no new request. Every list
 * defers an exact row count for its own pagination text; select-all-matching
 * means "everything `total` counts", so the same number that already answers
 * "how many are showing" also answers "how many would this affect". A
 * second, capped counter fetched just for this dialog would be duplicate
 * infrastructure for a number the page already has.
 */
import { computed, ref } from 'vue'
import PkModal from '../Overlay/PkModal.vue'
import { iconPath, resolveActionIcon } from '../primitives/icons'
import PkDropdown from '../primitives/PkDropdown.vue'

export interface BulkActionSchema {
    key: string
    label: string
    icon: string | null
    destructive: boolean
    confirmation: string | null
    /** Filament's palette: primary | gray | success | warning | danger | info. */
    color?: string | null

    /**
     * Fields to collect before running, sent WITH the action.
     *
     * The page opens the dialog; this component emits `run` either way, so a
     * form action and a plain one look identical from here.
     */
    form?: { nodes: unknown[] } | null

    /**
     * When true, ResourceIndex opens the bulk form in PkSlideover instead of
     * the dense PkModal. Opt-in via BulkAction::slideOver().
     */
    slideOver?: boolean
}

const props = withDefaults(
    defineProps<{
        actions: BulkActionSchema[]
        /** How many records the action would touch, for the confirmation copy. */
        count: number
        allMatching: boolean
        /** The current filtered view's exact row count - deferred, so undefined until it lands. */
        total?: number
        busy?: boolean
        canExport?: boolean
    }>(),
    { busy: false, canExport: true },
)

const emit = defineEmits<{
    (e: 'run', key: string): void
    (e: 'export'): void
}>()

const pending = ref<BulkActionSchema | null>(null)
const exportPending = ref(false)

/**
 * The number the confirm dialog answers "how many?" with.
 *
 * An explicit selection is exact and instant - it is however many rows are
 * ticked, known the moment the dropdown opens. Select-all-matching is
 * exact too, just not always landed yet - `total` until it resolves.
 */
const effectiveCount = computed(() => (props.allMatching ? props.total : props.count))
const countKnown = computed(() => effectiveCount.value !== undefined)
const countIsZero = computed(() => countKnown.value && effectiveCount.value === 0)

/** Same split and the same tones as the row menu - see RecordActions.vue. */
const ordinary = computed(() => props.actions.filter((a) => !a.destructive))
const destructive = computed(() => props.actions.filter((a) => a.destructive))
const actionCount = computed(
    () => ordinary.value.length + destructive.value.length + (props.canExport ? 1 : 0),
)

const TONES: Record<string, string> = {
    primary: 'text-primary',
    gray: 'text-foreground',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-500',
    danger: 'text-destructive',
    info: 'text-sky-600 dark:text-sky-400',
}

function tone(action: BulkActionSchema): string {
    return TONES[action.color ?? 'gray'] ?? TONES.gray
}

function attempt(action: BulkActionSchema) {
    if (action.confirmation) {
        pending.value = action

        return
    }

    emit('run', action.key)
}

function confirm() {
    if (pending.value) {
        emit('run', pending.value.key)
    }

    pending.value = null
}

function confirmExport() {
    exportPending.value = false
    emit('export')
}

const format = (n: number) => new Intl.NumberFormat().format(n)
</script>

<template>
    <PkDropdown>
        <template #trigger>
            <button
                type="button"
                class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-medium shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-60"
                :disabled="busy"
                aria-haspopup="menu"
                :aria-label="busy ? 'Bulk actions are running' : 'Open bulk actions'"
                :aria-busy="busy"
            >
                <svg
                    v-if="busy"
                    class="size-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    aria-hidden="true"
                >
                    <path d="M12 3a9 9 0 1 0 9 9" />
                </svg>
                <svg
                    v-else
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
                <span>{{ busy ? 'Working…' : 'Bulk actions' }}</span>
                <span
                    v-if="!busy && actionCount"
                    class="bg-primary-foreground/15 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums"
                >
                    {{ actionCount }}
                </span>
                <svg
                    v-if="!busy"
                    class="size-4 opacity-80"
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
        </template>

        <template #panel>
            <div class="min-w-[14rem] p-1.5">
                <div
                    v-if="ordinary.length || canExport"
                    class="text-muted-foreground px-2.5 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
                >
                    Actions
                </div>
                <button
                    v-for="action in ordinary"
                    :key="action.key"
                    type="button"
                    role="menuitem"
                    class="hover:bg-accent focus:bg-accent flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    :class="tone(action)"
                    :disabled="busy"
                    @click="attempt(action)"
                >
                    <svg
                        class="size-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path :d="resolveActionIcon(action)" />
                    </svg>
                    <span class="min-w-0 flex-1 truncate">{{ action.label }}</span>
                </button>

                <!--
                    EXPORT SITS WITH THEM because it is a bulk action in every
                    sense that matters to the operator - it acts on the same
                    selection and answers the same "do this to these" question.
                    It confirms too now - see the file note.
                -->
                <button
                    v-if="canExport"
                    type="button"
                    role="menuitem"
                    class="text-foreground hover:bg-accent focus:bg-accent flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    :disabled="busy"
                    @click="exportPending = true"
                >
                    <svg
                        class="size-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path :d="iconPath('download')" />
                    </svg>
                    Export CSV
                </button>

                <!-- Always last, always separated. -->
                <div v-if="destructive.length" class="mt-1 border-t px-0 pt-1">
                    <div
                        class="text-destructive/80 px-2.5 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
                    >
                        Destructive
                    </div>
                    <button
                        v-for="action in destructive"
                        :key="action.key"
                        type="button"
                        role="menuitem"
                        class="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        :disabled="busy"
                        @click="attempt(action)"
                    >
                        <svg
                            class="size-4 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path :d="resolveActionIcon({ ...action, destructive: true })" />
                        </svg>
                        <span class="min-w-0 flex-1 truncate">{{ action.label }}</span>
                    </button>
                </div>
            </div>
        </template>
    </PkDropdown>

    <PkModal
        :open="pending !== null"
        :title="pending?.label ?? ''"
        :description="pending?.confirmation ?? ''"
        @close="pending = null"
    >
        <!--
            THE COUNT IS REAL, NOT A GUESS - roadmap 3.10. "Delete the selected
            records?" used to read the same whether it meant three rows or
            ninety thousand; select-all-matching is exactly where someone is
            most likely to have selected more than they think, so it is the
            case that most needs the real number rather than "every matching
            record".
        -->
        <p class="text-muted-foreground text-sm font-normal">
            This will affect
            <span class="text-foreground font-medium tabular-nums">
                <template v-if="!countKnown">…</template>
                <template v-else
                    >{{ format(effectiveCount!) }} record{{
                        effectiveCount === 1 ? '' : 's'
                    }}</template
                >
            </span>
            .
        </p>

        <!--
            AN EMPTY MATCH BLOCKS, WITH A REASON - the other half of "count
            before commit". A filter that now matches nothing is usually a
            filter changed after select-all was chosen, and running the
            action anyway would silently do nothing while looking like it
            worked.
        -->
        <p v-if="countIsZero" class="text-destructive mt-1 text-xs">
            Nothing matches the current filters - there is nothing to
            {{ pending?.label?.toLowerCase() }}.
        </p>

        <template #footer>
            <button
                type="button"
                class="bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm"
                @click="pending = null"
            >
                Cancel
            </button>
            <button
                type="button"
                class="rounded-md px-3 py-1.5 text-sm font-medium disabled:pointer-events-none disabled:opacity-50"
                :class="
                    pending?.destructive
                        ? 'bg-destructive text-white hover:opacity-90'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                "
                :disabled="!countKnown || countIsZero"
                @click="confirm"
            >
                {{ pending?.label }}
            </button>
        </template>
    </PkModal>

    <PkModal
        :open="exportPending"
        title="Export CSV"
        description="A download link appears once the file is ready."
        @close="exportPending = false"
    >
        <p class="text-muted-foreground text-sm font-normal">
            This will export
            <span class="text-foreground font-medium tabular-nums"
                ><template v-if="!countKnown">…</template
                ><template v-else
                    >{{ format(effectiveCount!) }} record{{
                        effectiveCount === 1 ? '' : 's'
                    }}</template
                ></span
            >.
        </p>

        <p v-if="countIsZero" class="text-destructive mt-1 text-xs">
            Nothing matches the current filters - there is nothing to export.
        </p>

        <template #footer>
            <button
                type="button"
                class="bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm"
                @click="exportPending = false"
            >
                Cancel
            </button>
            <button
                type="button"
                class="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                :disabled="!countKnown || countIsZero"
                @click="confirmExport"
            >
                Export CSV
            </button>
        </template>
    </PkModal>
</template>
