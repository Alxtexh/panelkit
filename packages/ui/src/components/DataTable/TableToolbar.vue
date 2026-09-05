<script setup lang="ts">
/**
 * Search, a filter panel, and a column panel.
 *
 * FILTERS ARE STAGED, NOT INSTANT. Picking a value edits a local draft; nothing
 * reaches the server until Apply. Two reasons, and the second matters more:
 *
 *   1. Choosing four filters used to cost four round trips and four table
 *      repaints, with the list rearranging under the cursor between each one.
 *      Staged, it costs one.
 *   2. Multi-value filters are not expressible one click at a time. "Expired OR
 *      suspended, created this month" is a single question, and applying it in
 *      pieces briefly shows answers to questions nobody asked.
 *
 * Search stays instant and debounced, because typing IS the interaction - there
 * is nothing to batch.
 *
 * Opening either panel makes no network request: the filter schema arrived with
 * the page and option lists with the data (antipatterns §3.0.3).
 *
 * Emits only. Never fetches (spec §4 rule 2).
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { FOCUS_RING } from '../../lib/focusRing'
import PkDropdown from '../primitives/PkDropdown.vue'
import PkMultiSelect from '../primitives/PkMultiSelect.vue'
import Sheet from '../shadcn/sheet/Sheet.vue'
import SheetContent from '../shadcn/sheet/SheetContent.vue'
import PkQueryBuilder from './PkQueryBuilder.vue'
import type { FilterSchema, FilterIndicator, GroupSchema } from './types'

const props = withDefaults(
    defineProps<{
        search: string
        searchPlaceholder?: string
        searchHint?: string
        filterSchema: FilterSchema[]
        filters: Record<string, unknown>
        columns: { key: string; label: string; locked?: boolean }[]
        hidden: Set<string>
        loading?: boolean
        /**
         * Whether this table can be reordered at all. When true, the toolbar
         * offers the reorder MODE as an icon beside Filters and Columns -
         * DESIGN_RULES rule 3: a control that toggles how the table behaves
         * lives with the table, as an icon with a pressed state, never as a
         * word in the page header among actions that navigate and commit.
         */
        reorderable?: boolean
        reordering?: boolean
        /**
         * Groupings the operator may pick. Empty means no picker: a table that
         * only ever clusters one way should not grow a control that does nothing.
         */
        groups?: GroupSchema[]
        /** The grouping currently applied, or null for none. */
        groupBy?: GroupSchema | null
        /** Applied-filter chips from the server. */
        indicators?: FilterIndicator[]
        /**
         * Index layout modes the operator may toggle. Empty means table only
         * (no control). Opt-in via `Table::layouts(['table', 'cards'])`.
         */
        layouts?: Array<'table' | 'cards'>
        /** Current layout mode. */
        layout?: 'table' | 'cards'
    }>(),
    {
        searchPlaceholder: 'Search…',
        loading: false,
        reorderable: false,
        reordering: false,
        groups: () => [],
        groupBy: null,
        indicators: () => [],
        layouts: () => [],
        layout: 'table',
    },
)

const emit = defineEmits<{
    (e: 'update:search', value: string): void
    /** The whole filter set at once, so Apply is one request. */
    (e: 'apply-filters', filters: Record<string, unknown>): void
    (e: 'apply-columns', hidden: string[]): void
    (e: 'clear'): void
    (e: 'toggle-reorder'): void
    (e: 'group', key: string | null): void
    (e: 'clear-filter', key: string): void
    (e: 'clear-filters'): void
    (e: 'layout', mode: 'table' | 'cards'): void
}>()

const mobileDrawerOpen = ref(false)

/* ------------------------------------------------------------------ search */

const local = ref(props.search)

watch(
    () => props.search,
    (value) => {
        if (value !== local.value) {
            local.value = value
        }
    },
)

let timer: ReturnType<typeof setTimeout> | undefined
watch(local, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        if (value !== props.search) {
            emit('update:search', value)
        }
    }, 250)
})

onBeforeUnmount(() => {
    clearTimeout(timer)
})

/* ------------------------------------------------------------------ filters */

/** Local draft. The applied set only changes on Apply. */
const draft = ref<Record<string, unknown>>({ ...props.filters })

// Re-sync when the server echoes a different set back - a back-button
// navigation, or another control clearing everything.
watch(
    () => props.filters,
    (applied) => {
        draft.value = { ...applied }
    },
    { deep: true },
)

/** `!== null` and not truthiness - `false` is an applied value for a toggle. */
const activeCount = computed(
    () =>
        props.filterSchema.filter(
            (f) => props.filters[f.key] !== null && props.filters[f.key] !== undefined,
        ).length,
)

const draftDiffers = computed(() => JSON.stringify(draft.value) !== JSON.stringify(props.filters))

const hasAnything = computed(() => props.search !== '' || activeCount.value > 0)

const chips = computed(() => {
    if (props.indicators.length) {
        return props.indicators
    }

    return props.filterSchema
        .filter((f) => props.filters[f.key] !== null && props.filters[f.key] !== undefined)
        .map((f) => ({
            key: f.key,
            label: `${f.label}: ${String(props.filters[f.key])}`,
            removable: true,
        }))
})

function setGroup(key: string | null) {
    emit('group', key)
}

/** The mobile drawer's own grouping list: pick, then close the drawer. */
function setGroupMobile(key: string | null) {
    setGroup(key)
    mobileDrawerOpen.value = false
}

/** The desktop dropdown's grouping list: pick, then close the popover. */
function setGroupAndClose(key: string | null, close: () => void) {
    setGroup(key)
    close()
}

function clearChip(key: string) {
    emit('clear-filter', key)
}

function isMulti(filter: FilterSchema): boolean {
    return filter.type === 'multiselect'
}

function draftValues(filter: FilterSchema): unknown[] {
    const value = draft.value[filter.key]

    return Array.isArray(value) ? value : value === null || value === undefined ? [] : [value]
}

/**
 * The same values, narrowed for the token field.
 *
 * `draftValues` is deliberately `unknown[]` because a filter's value may be a
 * boolean or a date range. Only a MULTISELECT reaches the token control, and
 * its options are scalars - so the narrowing happens once, here, rather than
 * being asserted at the call site where nothing checks it.
 */
function multiDraftValues(filter: FilterSchema): (string | number)[] {
    return draftValues(filter).filter(
        (v): v is string | number => typeof v === 'string' || typeof v === 'number',
    )
}

/** Options for the token field, likewise narrowed to what it can render. */
function multiOptionsFor(filter: FilterSchema): { value: string | number; label: string }[] {
    return optionsFor(filter).flatMap((option) =>
        typeof option.value === 'string' || typeof option.value === 'number'
            ? [{ value: option.value, label: option.label }]
            : [],
    )
}

function setValue(filter: FilterSchema, value: unknown) {
    draft.value = { ...draft.value, [filter.key]: value === '' ? null : value }
}

/** Date ranges carry a preset name, or an explicit from..to pair. */
function rangePart(filter: FilterSchema, part: 'from' | 'to'): string {
    const value = draft.value[filter.key] as { raw?: string } | string | null

    if (typeof value !== 'string' || !value.includes('..')) {
        return ''
    }

    const [from, to] = value.split('..')

    return part === 'from' ? (from ?? '') : (to ?? '')
}

function setRangePart(filter: FilterSchema, part: 'from' | 'to', value: string) {
    const from = part === 'from' ? value : rangePart(filter, 'from')
    const to = part === 'to' ? value : rangePart(filter, 'to')

    // Both halves are needed before the range means anything; until then the
    // filter stays unset rather than half-applied.
    draft.value = {
        ...draft.value,
        [filter.key]: from && to ? `${from}..${to}` : null,
    }
}

/** Number ranges may be one-sided: `100..` or `..500`. */
function setNumberRangePart(filter: FilterSchema, part: 'from' | 'to', value: string) {
    const from = part === 'from' ? value : rangePart(filter, 'from')
    const to = part === 'to' ? value : rangePart(filter, 'to')

    draft.value = {
        ...draft.value,
        [filter.key]: from || to ? `${from}..${to}` : null,
    }
}

function applyFilters(close: () => void) {
    emit('apply-filters', { ...draft.value })
    close()
}

/**
 * The tree applies itself, without the panel's Apply button.
 *
 * A QUERY BUILDER OWNS ITS OWN COMMIT. It has an Apply of its own, because a
 * half-written rule - "status is" with no value - is a query for everything,
 * and on a large resource an expensive one nobody asked for. Routing it through
 * the panel's shared button would mean two Applies on screen doing different
 * things.
 */
function applyTree(key: string, tree: unknown): void {
    draft.value[key] = tree
    emit('apply-filters', { ...draft.value })
}

function resetFilters() {
    draft.value = Object.fromEntries(props.filterSchema.map((f) => [f.key, null]))
}

function optionsFor(filter: FilterSchema): { value: unknown; label: string }[] {
    if (filter.type === 'boolean') {
        return [
            { value: true, label: filter.trueLabel ?? 'Yes' },
            { value: false, label: filter.falseLabel ?? 'No' },
        ]
    }

    if (filter.type === 'daterange') {
        return Object.entries(filter.presets ?? {}).map(([value, label]) => ({
            value,
            label,
        }))
    }

    return (filter.options ?? []).map((o) =>
        typeof o === 'object' && o !== null && 'value' in o
            ? { value: o.value, label: o.label }
            : { value: o, label: String(o) },
    )
}

/* ------------------------------------------------------------------ columns */

const columnDraft = ref<Set<string>>(new Set(props.hidden))

watch(
    () => props.hidden,
    (hidden) => {
        columnDraft.value = new Set(hidden)
    },
    { deep: true },
)

/** Toggle immediately — no staging, no Apply button. */
function toggleColumn(key: string) {
    const next = new Set(columnDraft.value)

    if (next.has(key)) {
        next.delete(key)
    } else {
        next.add(key)
    }

    columnDraft.value = next
    emit('apply-columns', [...next])
}

function resetColumns() {
    columnDraft.value = new Set()
    emit('apply-columns', [])
}

function applyFiltersMobile() {
    emit('apply-filters', { ...draft.value })
    mobileDrawerOpen.value = false
}

/** Clearing resets the local search box too, or it keeps a stale term. */
function clearEverything() {
    local.value = ''
    emit('clear')
}

function clearEverythingMobile() {
    clearEverything()
    mobileDrawerOpen.value = false
}
</script>

<template>
    <!--
        THE WHOLE GROUP SITS AT THE TRAILING EDGE, which is where the page
        header's actions already are - so a screen has one vertical line that
        controls hang off rather than two competing ones. Search, Filters and
        Columns are things you REACH FOR; the rows are what you read, and the
        reading starts on the left.

        `justify-end` on the row, and the search box keeps `flex-1` only until
        `sm`, where it becomes a fixed width - on a phone a right-aligned
        stub of a search field would be worse than a full-width one.
    -->
    <div data-slot="table-toolbar" class="flex flex-col gap-2">
        <!-- Mobile: search plus a bottom drawer for filters, columns, and grouping. -->
        <div class="flex items-center gap-2 md:hidden">
            <div class="relative min-w-0 flex-1">
                <svg
                    class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                    v-model="local"
                    type="search"
                    :placeholder="searchPlaceholder"
                    :title="searchHint"
                    :aria-label="searchHint ?? searchPlaceholder"
                    :class="[
                        'border-input bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors',
                        FOCUS_RING,
                    ]"
                />
            </div>

            <button
                type="button"
                dusk="mobile-table-tools"
                class="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-3 text-sm"
                @click="mobileDrawerOpen = true"
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
                Tools
                <span
                    v-if="activeCount"
                    class="bg-primary text-primary-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px]"
                >
                    {{ activeCount }}
                </span>
            </button>

            <Sheet :open="mobileDrawerOpen" @update:open="mobileDrawerOpen = $event">
                <SheetContent side="bottom" class="max-h-[85vh] gap-0 overflow-hidden p-0">
                    <div class="flex max-h-[85vh] flex-col">
                        <div class="border-b px-4 py-3">
                            <p class="text-sm font-semibold">Table tools</p>
                            <p class="text-muted-foreground text-xs font-normal">
                                Filters, columns, and grouping
                            </p>
                        </div>

                        <div class="flex-1 overflow-y-auto px-4 py-3">
                            <div v-if="filterSchema.length" class="mb-4 flex flex-col gap-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium">Filters</span>
                                    <button
                                        class="text-destructive text-xs hover:underline"
                                        @click="resetFilters"
                                    >
                                        Reset
                                    </button>
                                </div>
                                <div
                                    v-for="filter in filterSchema"
                                    :key="`mobile-${filter.key}`"
                                    class="flex flex-col gap-1.5"
                                >
                                    <label class="text-xs font-medium">{{ filter.label }}</label>
                                    <select
                                        v-if="
                                            filter.type !== 'multiselect' &&
                                            filter.type !== 'querybuilder' &&
                                            filter.type !== 'daterange' &&
                                            filter.type !== 'numberrange' &&
                                            filter.type !== 'boolean'
                                        "
                                        :value="(draft[filter.key] as string) ?? ''"
                                        class="border-input bg-background h-9 rounded-md border px-3 text-sm"
                                        @change="
                                            setValue(
                                                filter,
                                                ($event.target as HTMLSelectElement).value,
                                            )
                                        "
                                    >
                                        <option value="">All</option>
                                        <option
                                            v-for="opt in optionsFor(filter)"
                                            :key="String(opt.value)"
                                            :value="opt.value"
                                        >
                                            {{ opt.label }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="mb-4">
                                <p class="mb-2 text-sm font-medium">Columns</p>
                                <div class="flex flex-col gap-1">
                                    <button
                                        v-for="col in columns"
                                        :key="`mobile-col-${col.key}`"
                                        type="button"
                                        class="hover:bg-accent flex items-center gap-2 rounded px-2 py-1.5 text-sm"
                                        :disabled="col.locked"
                                        @click="toggleColumn(col.key)"
                                    >
                                        <span>{{ col.label }}</span>
                                        <span
                                            v-if="!columnDraft.has(col.key)"
                                            class="text-primary ml-auto text-xs"
                                            >On</span
                                        >
                                    </button>
                                </div>
                            </div>

                            <div v-if="groups.length" class="mb-4">
                                <p class="mb-2 text-sm font-medium">Grouping</p>
                                <div class="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        class="hover:bg-accent rounded px-2 py-1.5 text-left text-sm"
                                        @click="setGroupMobile(null)"
                                    >
                                        No grouping
                                    </button>
                                    <button
                                        v-for="option in groups"
                                        :key="option.key"
                                        type="button"
                                        class="hover:bg-accent rounded px-2 py-1.5 text-left text-sm"
                                        @click="setGroupMobile(option.key)"
                                    >
                                        {{ option.label }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="border-t p-4">
                            <button
                                v-if="filterSchema.length"
                                type="button"
                                class="bg-primary text-primary-foreground hover:bg-primary/90 mb-2 h-9 w-full rounded-md text-sm font-medium disabled:opacity-50"
                                :disabled="!draftDiffers"
                                @click="applyFiltersMobile"
                            >
                                Apply filters
                            </button>
                            <button
                                v-if="hasAnything"
                                type="button"
                                class="text-muted-foreground hover:text-foreground w-full text-xs underline-offset-2 hover:underline"
                                @click="clearEverythingMobile"
                            >
                                Clear search and filters
                            </button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>

        <div class="hidden flex-wrap items-center justify-end gap-2 md:flex">
            <!-- Geometry deliberately identical to the topbar search: two search
             boxes that are almost-but-not-quite alike read as inconsistency. -->
            <div class="relative min-w-0 flex-1 sm:w-72 sm:flex-none">
                <svg
                    class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                    v-model="local"
                    type="search"
                    :placeholder="searchPlaceholder"
                    :title="searchHint"
                    :aria-label="searchHint ?? searchPlaceholder"
                    :class="[
                        'border-input bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors',
                        FOCUS_RING,
                    ]"
                />
                <button
                    v-if="local"
                    type="button"
                    class="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                    aria-label="Clear search"
                    @click="local = ''"
                >
                    <svg
                        viewBox="0 0 24 24"
                        class="size-3.5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                    >
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Filters -->
            <!--
            THE FILTER PANEL IS A FORM, so a click inside it is never "done".
            It has an explicit Apply button, and dismissing on any stray click
            discarded a half-built filter draft - see PkDropdown's prop note.
        -->
            <PkDropdown v-if="filterSchema.length" width="w-80" :dismiss-on-panel-click="false">
                <template #trigger>
                    <button
                        type="button"
                        dusk="filters-trigger"
                        class="border-input bg-background hover:bg-accent hover:text-accent-foreground relative inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors"
                        :class="activeCount ? 'border-primary text-primary' : ''"
                        :aria-label="activeCount ? `Filters (${activeCount} active)` : 'Filters'"
                        title="Filters"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            class="size-4"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                        >
                            <path d="M3 5h18M6 12h12M10 19h4" />
                        </svg>
                        <span
                            v-if="activeCount"
                            class="bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums"
                        >
                            {{ activeCount }}
                        </span>
                    </button>
                </template>

                <template #panel="{ close }">
                    <div class="flex items-center justify-between px-1 pt-1 pb-2">
                        <span class="text-sm font-semibold">Filters</span>
                        <button
                            class="text-destructive text-xs hover:underline"
                            @click="resetFilters"
                        >
                            Reset
                        </button>
                    </div>

                    <p class="text-muted-foreground px-1 pb-3 text-xs">
                        Select one or more - all chosen filters must match.
                    </p>

                    <div class="flex max-h-96 flex-col gap-4 overflow-y-auto px-1 pb-3">
                        <div
                            v-for="filter in filterSchema"
                            :key="filter.key"
                            class="flex flex-col gap-1.5"
                        >
                            <label class="text-xs font-medium">{{ filter.label }}</label>

                            <!--
                            A TOKEN FIELD, not a row of toggle chips.
                            
                            The chip row showed every option all the time, which
                            is fine at three and unusable at forty: the chosen
                            ones are scattered through the list and the only way
                            to see what you picked is to read all of them. A
                            token field answers "what have I chosen" directly,
                            and moves the rest behind a searchable list.
                        -->
                            <PkMultiSelect
                                v-if="isMulti(filter)"
                                :model-value="multiDraftValues(filter)"
                                :options="multiOptionsFor(filter)"
                                :placeholder="`Any ${filter.label.toLowerCase()}`"
                                @update:model-value="
                                    (value) => (draft[filter.key] = value.length ? value : null)
                                "
                            />

                            <!--
                            THE QUERY BUILDER, WHICH HAD NO BRANCH HERE AT ALL.

                            `QueryBuilderFilter` shipped with a working server
                            half - twelve tests, an allow-list derived from the
                            sibling filters, a tenant-scope guard - and a Vue
                            component that NOTHING MOUNTED. A resource declaring
                            one rendered a label and nothing under it: the
                            feature existed in the package and did not exist for
                            an operator.

                            The exact failure this codebase keeps naming, made
                            once more in the commit that closed the last gap.
                        -->
                            <template v-else-if="filter.type === 'querybuilder'">
                                <PkQueryBuilder
                                    :model-value="(draft[filter.key] as any) ?? null"
                                    :fields="(filter as any).fields ?? {}"
                                    :operators="(filter as any).operators ?? {}"
                                    :max-depth="(filter as any).maxDepth ?? 5"
                                    @apply="(tree: unknown) => applyTree(filter.key, tree)"
                                />
                            </template>

                            <!-- Date range: presets plus an explicit pair. -->
                            <template v-else-if="filter.type === 'daterange'">
                                <select
                                    :value="
                                        typeof draft[filter.key] === 'string' &&
                                        !String(draft[filter.key]).includes('..')
                                            ? draft[filter.key]
                                            : ''
                                    "
                                    class="border-input bg-background h-9 rounded-md border px-3 text-sm"
                                    @change="
                                        setValue(filter, ($event.target as HTMLSelectElement).value)
                                    "
                                >
                                    <option value="">Any time</option>
                                    <option
                                        v-for="opt in optionsFor(filter)"
                                        :key="String(opt.value)"
                                        :value="opt.value"
                                    >
                                        {{ opt.label }}
                                    </option>
                                </select>

                                <div class="grid grid-cols-2 gap-2">
                                    <input
                                        type="date"
                                        :value="rangePart(filter, 'from')"
                                        aria-label="From"
                                        class="border-input bg-background h-9 rounded-md border px-2 text-xs"
                                        @change="
                                            setRangePart(
                                                filter,
                                                'from',
                                                ($event.target as HTMLInputElement).value,
                                            )
                                        "
                                    />
                                    <input
                                        type="date"
                                        :value="rangePart(filter, 'to')"
                                        aria-label="To"
                                        class="border-input bg-background h-9 rounded-md border px-2 text-xs"
                                        @change="
                                            setRangePart(
                                                filter,
                                                'to',
                                                ($event.target as HTMLInputElement).value,
                                            )
                                        "
                                    />
                                </div>
                            </template>

                            <template v-else-if="filter.type === 'numberrange'">
                                <div class="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        :value="rangePart(filter, 'from')"
                                        aria-label="From"
                                        placeholder="From"
                                        class="border-input bg-background h-9 rounded-md border px-2 text-xs"
                                        @change="
                                            setNumberRangePart(
                                                filter,
                                                'from',
                                                ($event.target as HTMLInputElement).value,
                                            )
                                        "
                                    />
                                    <input
                                        type="number"
                                        :value="rangePart(filter, 'to')"
                                        aria-label="To"
                                        placeholder="To"
                                        class="border-input bg-background h-9 rounded-md border px-2 text-xs"
                                        @change="
                                            setNumberRangePart(
                                                filter,
                                                'to',
                                                ($event.target as HTMLInputElement).value,
                                            )
                                        "
                                    />
                                </div>
                            </template>

                            <!-- Boolean: a real toggle, since three states as a
                             dropdown reads worse than a switch plus "Any". -->
                            <div
                                v-else-if="filter.type === 'boolean'"
                                class="flex items-center gap-2"
                            >
                                <button
                                    type="button"
                                    role="switch"
                                    :aria-checked="draft[filter.key] === true"
                                    class="relative h-5 w-9 shrink-0 rounded-full transition-colors"
                                    :class="
                                        draft[filter.key] === true
                                            ? 'bg-primary'
                                            : 'bg-muted-foreground/30'
                                    "
                                    @click="
                                        setValue(filter, draft[filter.key] === true ? null : true)
                                    "
                                >
                                    <span
                                        class="bg-background absolute top-0.5 size-4 rounded-full transition-all"
                                        :class="
                                            draft[filter.key] === true ? 'left-4.5' : 'left-0.5'
                                        "
                                    />
                                </button>
                                <span class="text-xs">{{ filter.trueLabel ?? 'Yes' }}</span>

                                <button
                                    type="button"
                                    class="text-muted-foreground ml-auto text-xs hover:underline"
                                    :class="
                                        draft[filter.key] === false
                                            ? 'text-primary font-medium'
                                            : ''
                                    "
                                    @click="
                                        setValue(filter, draft[filter.key] === false ? null : false)
                                    "
                                >
                                    {{ filter.falseLabel ?? 'No' }} only
                                </button>
                            </div>

                            <!-- Single choice. -->
                            <select
                                v-else
                                :value="(draft[filter.key] as string) ?? ''"
                                class="border-input bg-background h-9 rounded-md border px-3 text-sm capitalize"
                                @change="
                                    setValue(filter, ($event.target as HTMLSelectElement).value)
                                "
                            >
                                <option value="">All</option>
                                <option
                                    v-for="opt in optionsFor(filter)"
                                    :key="String(opt.value)"
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="bg-primary text-primary-foreground hover:bg-primary/90 mt-1 h-9 w-full rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                        :disabled="!draftDiffers"
                        @click="applyFilters(close)"
                    >
                        Apply filters
                    </button>
                </template>
            </PkDropdown>

            <!-- Columns -->
            <PkDropdown :dismiss-on-panel-click="false">
                <template #trigger>
                    <button
                        type="button"
                        class="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors"
                        aria-label="Toggle columns"
                        title="Columns"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            class="size-4 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M9 4v16M15 4v16" />
                        </svg>
                    </button>
                </template>

                <template #panel>
                    <p class="text-muted-foreground px-3 pt-2.5 pb-1 text-xs font-medium">
                        Toggle columns
                    </p>

                    <div class="flex max-h-80 flex-col overflow-y-auto py-1">
                        <button
                            v-for="col in columns"
                            :key="col.key"
                            type="button"
                            class="hover:bg-accent flex items-center gap-2 px-3 py-1.5 text-sm"
                            :class="col.locked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
                            :disabled="col.locked"
                            @click="toggleColumn(col.key)"
                        >
                            <!-- Checkmark when visible; blank spacer when hidden. -->
                            <svg
                                v-if="!columnDraft.has(col.key)"
                                viewBox="0 0 24 24"
                                class="size-4 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span v-else class="size-4 shrink-0" aria-hidden="true" />
                            {{ col.label }}
                        </button>
                    </div>

                    <div class="border-t">
                        <button
                            type="button"
                            class="hover:bg-accent flex w-full items-center gap-2 px-3 py-1.5 text-sm"
                            @click="resetColumns"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                class="size-4 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                            Reset
                        </button>
                    </div>
                </template>
            </PkDropdown>

            <!-- Layout: table vs cards. Opt-in only when the table declared layouts. -->
            <div
                v-if="layouts.length > 1"
                class="border-input inline-flex shrink-0 overflow-hidden rounded-md border"
                role="group"
                aria-label="Index layout"
            >
                <button
                    v-for="mode in layouts"
                    :key="mode"
                    type="button"
                    class="hover:bg-accent inline-flex size-9 items-center justify-center transition-colors"
                    :class="layout === mode ? 'bg-accent text-foreground' : 'text-muted-foreground'"
                    :aria-pressed="layout === mode"
                    :aria-label="mode === 'cards' ? 'Card layout' : 'Table layout'"
                    :title="mode === 'cards' ? 'Cards' : 'Table'"
                    @click="emit('layout', mode)"
                >
                    <svg
                        v-if="mode === 'table'"
                        viewBox="0 0 24 24"
                        class="size-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M3 5h18M3 12h18M3 19h18" />
                    </svg>
                    <svg
                        v-else
                        viewBox="0 0 24 24"
                        class="size-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                </button>
            </div>

            <!-- Reorder: a MODE, so an icon with a pressed state (rule 3). -->
            <button
                v-if="reorderable"
                type="button"
                class="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors"
                :class="reordering ? 'border-primary text-primary' : ''"
                :aria-pressed="reordering"
                :aria-label="reordering ? 'Finish reordering' : 'Reorder records'"
                :title="reordering ? 'Finish reordering' : 'Reorder records'"
                @click="emit('toggle-reorder')"
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

            <PkDropdown v-if="groups.length" align="end">
                <template #trigger>
                    <button
                        type="button"
                        dusk="group-picker"
                        class="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors"
                        :class="groupBy ? 'border-primary text-primary' : ''"
                        :aria-label="groupBy ? `Grouped by ${groupBy.label}` : 'Group records'"
                        :title="groupBy ? `Grouped by ${groupBy.label}` : 'Group records'"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            class="size-4"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                        >
                            <path d="M4 6h16M4 12h10M4 18h7" />
                        </svg>
                    </button>
                </template>
                <template #panel="{ close }">
                    <div class="flex flex-col gap-0.5 p-1">
                        <button
                            type="button"
                            class="hover:bg-accent rounded px-2 py-1.5 text-left text-sm"
                            :class="!groupBy ? 'text-primary font-medium' : ''"
                            @click="setGroupAndClose(null, close)"
                        >
                            No grouping
                        </button>
                        <button
                            v-for="option in groups"
                            :key="option.key"
                            type="button"
                            class="hover:bg-accent rounded px-2 py-1.5 text-left text-sm"
                            :class="groupBy?.key === option.key ? 'text-primary font-medium' : ''"
                            @click="setGroupAndClose(option.key, close)"
                        >
                            {{ option.label }}
                        </button>
                    </div>
                </template>
            </PkDropdown>

            <button
                v-if="hasAnything"
                type="button"
                class="text-muted-foreground hover:text-foreground shrink-0 text-xs underline-offset-2 hover:underline"
                @click="clearEverything"
            >
                Clear
            </button>

            <span v-if="loading" class="text-muted-foreground shrink-0 text-xs">Loading…</span>
        </div>

        <div
            v-if="chips.length"
            class="flex flex-wrap items-center gap-1.5"
            dusk="filter-indicators"
        >
            <span
                v-for="chip in chips"
                :key="chip.key + chip.label"
                class="border-input bg-muted/60 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs"
                :dusk="`filter-indicator-${chip.key}`"
            >
                {{ chip.label }}
                <button
                    v-if="chip.removable !== false"
                    type="button"
                    class="hover:text-foreground text-muted-foreground"
                    :aria-label="`Clear ${chip.label}`"
                    @click="clearChip(chip.key)"
                >
                    <svg
                        viewBox="0 0 24 24"
                        class="size-3"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                    >
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            </span>
            <button
                v-if="chips.length > 1"
                type="button"
                class="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
                dusk="clear-all-filters"
                @click="emit('clear-filters')"
            >
                Clear all
            </button>
        </div>
    </div>
</template>
