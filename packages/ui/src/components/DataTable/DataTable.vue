<script setup lang="ts">
/**
 * The generic list table.
 *
 * TWO RULES this component exists to honour (spec §4):
 *
 *   1. It does not import Inertia. It has no idea how data arrives.
 *   2. It never fetches. Props in, events out. The consuming page decides what
 *      a sort click or a selection means.
 *
 * Everything §8 requires of the table lives here once, so no screen can forget:
 * sticky header, frozen actions column, rows keyed by record id, dim-don't-
 * unmount on reload, distinct empty states, and row selection.
 *
 * Per-cell rendering is a SLOT (`cell:<key>`), not a format enum. Three screens
 * needed badges, formatted dates, currency and units, and an enum would have
 * grown a case per screen forever.
 */
import { computed, ref, useId, watch } from 'vue'
import PkEmptyState from '../primitives/PkEmptyState.vue'
import PkSkeleton from '../primitives/PkSkeleton.vue'
import type { SortDirection, TableColumn } from './types'

const props = withDefaults(
    defineProps<{
        columns: TableColumn[]
        rows: Record<string, any>[]
        /**
         * Cluster rows under headings, by this row key.
         *
         * The rows arrive already ORDERED by it - grouping is an ordering, not
         * an aggregation - so all that happens here is inserting a heading
         * wherever the value changes. Nothing is re-sorted or bucketed on the
         * client, which is what keeps this free on a page of any size.
         *
         * `__group` / `__groupTitle` on the row, when present, are the
         * clustering key and the heading the server already composed (a date
         * group, a custom title). Fall back to the column value for older
         * payloads that only sent `groupBy.key`.
         */
        groupBy?: {
            key: string
            label: string
            collapsible?: boolean
            date?: boolean
            titlePrefixed?: boolean
        } | null
        /** When true, collapsible headings start closed. */
        collapsedGroupsByDefault?: boolean
        /**
         * Whether the table is CURRENTLY in reorder mode.
         *
         * A MODE, NOT A PERMANENT AFFORDANCE. Handles on every row all the time
         * are clutter on a table nobody reorders daily, and they turn an
         * ordinary list into something that looks half-editable. Filament gets
         * this right: reordering is entered deliberately, and while you are in
         * it the table stops being a list you read and becomes a thing you
         * arrange.
         *
         * The PAGE owns the flag, because entering the mode also suppresses
         * selection and sorting - decisions that belong with the toolbar rather
         * than with the rows.
         */
        reordering?: boolean
        /**
         * Whether a click on the row body opens the record.
         *
         * The PAGE decides what "opens" means and whether the operator may -
         * this component only reports that a row was clicked somewhere that was
         * not another control. Declared server-side per resource; see
         * `Table::rowClick()`.
         */
        rowClickable?: boolean
        rowKey?: string
        sort?: string
        direction?: SortDirection
        loading?: boolean
        hidden?: Set<string>
        selectable?: boolean
        /** Ids selected on the current page. */
        selected?: Set<string | number>
        /** Distinguishes "nothing here" from "nothing matches your filters". */
        filtered?: boolean
        emptyTitle?: string
        emptyHint?: string
        /** Semantic icon for the empty catalogue state. */
        emptyIcon?: string
        /**
         * Footer aggregate DEFINITIONS, keyed by column key - how to render.
         * Structure travels with the schema; the values arrive separately.
         */
        summaries?: Record<
            string,
            {
                kind: string
                label: string | null
                prefix: string | null
                suffix: string | null
                divideBy: number | null
                decimals: number
            }
        > | null
        /** The computed values, once the deferred prop lands. */
        summaryValues?: Record<string, number | null> | null
        /**
         * Whether the table draws its own border and rounding.
         *
         * False inside a `TableShell`, which owns the ONE border around
         * tabs, toolbar, rows and pagination together (DESIGN_RULES rule
         * 4) - a second border here would draw a box inside the box. True
         * by default so a bare table dropped anywhere still looks finished.
         */
        framed?: boolean
        /**
         * Alternate row wash for dense ops tables. Off by default so most
         * lists stay calm; hover still applies either way.
         */
        striped?: boolean
        /**
         * Pin the first visible data column (and the checkbox column when
         * selectable). Off by default: zero cost when unused.
         */
        stickyFirst?: boolean
        /**
         * Offer drag-resize handles on resizable columns. Widths come from
         * `columnWidths` (and each column's schema `width` as a fallback).
         */
        resizable?: boolean
        /** Operator-chosen widths in pixels, keyed by column key. */
        columnWidths?: Record<string, number>
    }>(),
    {
        rowKey: 'id',
        direction: 'desc',
        loading: false,
        filtered: false,
        selectable: false,
        summaries: null,
        summaryValues: null,
        emptyTitle: 'Nothing here yet',
        emptyIcon: 'package',
        framed: true,
        striped: false,
        collapsedGroupsByDefault: false,
        stickyFirst: false,
        resizable: false,
        columnWidths: () => ({}),
    },
)

/**
 * Whether this row opens a new group.
 *
 * TRUE FOR THE FIRST ROW OF EVERY PAGE, deliberately. A group can span a page
 * boundary - the page size is fixed and the groups are whatever size they are -
 * so page 2 may open mid-group, and it needs a heading saying which one or the
 * rows underneath have no label at all.
 */
function clusterKey(row: Record<string, any> | undefined): string {
    if (!row || !props.groupBy) {
        return ''
    }

    if (row.__group !== undefined && row.__group !== null) {
        return String(row.__group)
    }

    const value = row[props.groupBy.key]

    return value === null || value === undefined || value === '' ? '' : String(value)
}

function startsGroup(index: number): boolean {
    if (!props.groupBy) {
        return false
    }

    if (index === 0) {
        return true
    }

    return clusterKey(props.rows[index]) !== clusterKey(props.rows[index - 1])
}

/** The heading text: the server's title, the row's own value, or a placeholder. */
function groupValue(row: Record<string, any>): string {
    if (row.__groupTitle) {
        return String(row.__groupTitle)
    }

    const value = props.groupBy ? row[props.groupBy.key] : null
    const text = value === null || value === undefined || value === '' ? 'None' : String(value)

    if (!props.groupBy || props.groupBy.titlePrefixed === false) {
        return text
    }

    return `${props.groupBy.label}: ${text}`
}

const collapsed = ref<Set<string>>(new Set())
const touched = ref<Set<string>>(new Set())

function isCollapsed(key: string): boolean {
    if (!props.groupBy?.collapsible) {
        return false
    }

    return collapsed.value.has(key)
}

function toggleGroup(key: string) {
    if (!props.groupBy?.collapsible) {
        return
    }

    const nextTouched = new Set(touched.value)
    nextTouched.add(key)
    touched.value = nextTouched

    const next = new Set(collapsed.value)

    if (next.has(key)) {
        next.delete(key)
    } else {
        next.add(key)
    }

    collapsed.value = next
}

function rowVisible(index: number): boolean {
    if (!props.groupBy?.collapsible) {
        return true
    }

    return !isCollapsed(clusterKey(props.rows[index]))
}

watch(
    () => props.rows,
    (rows) => {
        if (!props.groupBy?.collapsible || !props.collapsedGroupsByDefault) {
            return
        }

        const next = new Set(collapsed.value)

        for (const row of rows) {
            const key = clusterKey(row)

            if (key !== '' && !touched.value.has(key)) {
                next.add(key)
            }
        }

        collapsed.value = next
    },
    { immediate: true },
)

/* ------------------------------------------------------------- reordering */

/** The row index currently being dragged, or null. */
const dragging = ref<number | null>(null)

/** The index it would drop into, for the insertion line. */
const dragOver = ref<number | null>(null)

function onDragStart(index: number, event: DragEvent) {
    dragging.value = index

    // Required for Firefox to start a drag at all, and the payload is unused -
    // the indices live in component state, not in the drag data.
    event.dataTransfer?.setData('text/plain', String(index))

    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
    }
}

/**
 * Where the dragged row would land, as an insertion line.
 *
 * Drawn on the edge the row would enter from - above when moving up, below when
 * moving down - because a line on a fixed edge is ambiguous about which side of
 * the hovered row you are dropping onto.
 */
/** Clears the drag state however the gesture ends, including a cancelled one. */
function onDragEnd() {
    dragging.value = null
    dragOver.value = null
}

function dropEdge(index: number): string {
    if (dragging.value === null || dragOver.value !== index) {
        return ''
    }

    return dragging.value > index ? 'border-primary border-t-2' : 'border-primary border-b-2'
}

function onDragOver(index: number, event: DragEvent) {
    if (dragging.value === null) {
        return
    }

    event.preventDefault()
    dragOver.value = index
}

function onDrop(index: number) {
    const from = dragging.value

    dragging.value = null
    dragOver.value = null

    if (from === null || from === index) {
        return
    }

    /*
     * The reordered ids are emitted; the PAGE owns the rows.
     *
     * Splicing them here would mean this component mutated a prop, and the
     * optimistic update and the request would then live in different places -
     * so a failed save could leave the table showing an order the server never
     * accepted.
     */
    const ids = props.rows.map((row) => row[props.rowKey])
    const [moved] = ids.splice(from, 1)

    ids.splice(index, 0, moved)

    emit('reorder', ids)
}

const emit = defineEmits<{
    (e: 'sort', key: string): void
    (e: 'toggle-row', id: string | number): void
    (e: 'toggle-page', select: boolean): void
    /** The page's ids in their new order, after a drop. */
    (e: 'reorder', ids: (string | number)[]): void
    /**
     * Right-click on a row, with the raw event so a menu can open at the cursor.
     *
     * The DEFAULT IS NOT PREVENTED HERE. A table that swallows the browser's own
     * context menu whether or not it has anything to offer takes away Copy and
     * Inspect and gives back nothing. The listener decides - it prevents the
     * default only once it knows the row actually has actions.
     */
    (e: 'row-contextmenu', row: Record<string, unknown>, event: MouseEvent): void
    /** A plain click on the row body, already filtered for stray targets. */
    (e: 'row-click', row: Record<string, unknown>): void
    /** Column drag-resize finished (or stepped) with a new pixel width. */
    (e: 'resize', key: string, width: number): void
}>()

/**
 * A click counts as "the row" only if it hit none of the row's own controls.
 *
 * WITHOUT THIS THE ROW EATS EVERYTHING INSIDE IT - the select checkbox, the
 * actions menu, an editable cell, a copy button, a link to a related record.
 * Each of those is a control somebody aimed at deliberately, and navigating
 * away instead is the single most irritating way for this feature to be wrong.
 *
 * A TEXT SELECTION IS NOT A CLICK EITHER. Dragging across a cell to read or
 * copy a value ends in a mouseup on the row, which is indistinguishable from a
 * click unless the selection is checked - and on a table of account numbers,
 * selecting text is something people do constantly.
 */
function onRowClick(row: Record<string, unknown>, event: MouseEvent) {
    if (!props.rowClickable || props.reordering) {
        return
    }

    // Modified clicks belong to the browser: ctrl/cmd-click and middle-click
    // mean "open in a new tab" everywhere else and must keep meaning it.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
    }

    const target = event.target as HTMLElement | null

    if (target?.closest('a, button, input, select, textarea, label, [role="menuitem"]')) {
        return
    }

    if ((window.getSelection()?.toString().length ?? 0) > 0) {
        return
    }

    emit('row-click', row)
}

const copied = ref<string | null>(null)

/** Unique prefix so two tables on one page do not share checkbox ids. */
const instanceId = useId()

const visibleColumns = computed(() => props.columns.filter((c) => !props.hidden?.has(c.key)))

/** Checkbox column width when selectable, used for sticky left offsets. */
const CHECKBOX_STICKY_WIDTH = 40

const stickyDataKey = computed(() => {
    const explicit = visibleColumns.value.find((col) => col.sticky)

    if (explicit) {
        return explicit.key
    }

    if (props.stickyFirst && visibleColumns.value.length > 0) {
        return visibleColumns.value[0].key
    }

    return null
})

function isStickyDataColumn(col: TableColumn): boolean {
    return stickyDataKey.value === col.key
}

function stickyDataLeft(): string {
    if (props.selectable && !props.reordering) {
        return `${CHECKBOX_STICKY_WIDTH}px`
    }

    return '0'
}

function columnWidthPx(col: TableColumn): number | undefined {
    const override = props.columnWidths?.[col.key]

    if (typeof override === 'number') {
        return override
    }

    return col.width
}

function columnStyle(col: TableColumn): Record<string, string> | undefined {
    const width = columnWidthPx(col)
    const sticky = isStickyDataColumn(col)
    const style: Record<string, string> = {}

    if (width !== undefined) {
        style.width = `${width}px`
        style.minWidth = `${width}px`
        style.maxWidth = `${width}px`
    }

    if (sticky) {
        style.left = stickyDataLeft()
    }

    return Object.keys(style).length ? style : undefined
}

function columnCanResize(col: TableColumn): boolean {
    if (!props.resizable) {
        return false
    }

    return col.resizable !== false
}

function onResizeStart(col: TableColumn, event: PointerEvent) {
    if (!columnCanResize(col)) {
        return
    }

    event.preventDefault()
    event.stopPropagation()

    const startX = event.clientX
    const startWidth = columnWidthPx(col) ?? 160
    const target = event.currentTarget as HTMLElement

    try {
        target.setPointerCapture(event.pointerId)
    } catch {
        // jsdom and some browsers lack pointer capture; listeners still work.
    }

    function onMove(moveEvent: PointerEvent) {
        const next = startWidth + (moveEvent.clientX - startX)
        emit('resize', col.key, Math.min(1200, Math.max(48, next)))
    }

    function onUp(upEvent: PointerEvent) {
        try {
            target.releasePointerCapture(upEvent.pointerId)
        } catch {
            // ignore
        }

        target.removeEventListener('pointermove', onMove)
        target.removeEventListener('pointerup', onUp)
        target.removeEventListener('pointercancel', onUp)
    }

    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerup', onUp)
    target.addEventListener('pointercancel', onUp)
}

const hasColumnGroups = computed(() => visibleColumns.value.some((c) => !!c.group))

const headerBands = computed(() => {
    const bands: Array<{ label: string | null; span: number; key: string }> = []

    for (const col of visibleColumns.value) {
        const label = col.group ?? null
        const last = bands[bands.length - 1]

        if (last && last.label === label) {
            last.span += 1
        } else {
            bands.push({ label, span: 1, key: `${label ?? 'loose'}-${col.key}` })
        }
    }

    return bands
})

/**
 * The value the selection Set is keyed by, or null when the row has none.
 *
 * A missing key MUST NOT become `undefined` in the Set: every such row would
 * then share one membership test, and ticking one checkbox would check them
 * all. Rows without an identity cannot be bulk-acted on anyway.
 */
function rowId(row: Record<string, unknown>): string | number | null {
    const value = row[props.rowKey]

    if (value === null || value === undefined || value === '') {
        return null
    }

    return value as string | number
}

function isSelected(row: Record<string, unknown>): boolean {
    const id = rowId(row)

    return id !== null && !!props.selected?.has(id)
}

/** Anchor for shift-click range selection (current page only). */
const lastSelectedId = ref<string | number | null>(null)

function indexOfRowId(id: string | number): number {
    return props.rows.findIndex((r) => {
        const rid = rowId(r)

        return rid !== null && rid === id
    })
}

function onCheckboxClick(row: Record<string, unknown>, event: MouseEvent) {
    const id = rowId(row)

    if (id === null) {
        return
    }

    const shift = event.shiftKey
    const clickedSelected = !!props.selected?.has(id)

    // If shift-clicking with an anchor that is not on the current page,
    // range selection is ambiguous, so fall back to single-row behaviour.
    if (shift && lastSelectedId.value !== null && lastSelectedId.value !== id) {
        const from = indexOfRowId(lastSelectedId.value)
        const to = indexOfRowId(id)

        if (from !== -1 && to !== -1) {
            const start = Math.min(from, to)
            const end = Math.max(from, to)

            const wantSelected = !clickedSelected

            for (let i = start; i <= end; i++) {
                if (!rowVisible(i)) {
                    continue
                }

                const rid = rowId(props.rows[i])

                if (rid === null) {
                    continue
                }

                const isSelectedNow = !!props.selected?.has(rid)

                // Only emit toggles for ids that actually need a state change.
                if (isSelectedNow !== wantSelected) {
                    emit('toggle-row', rid)
                }
            }

            lastSelectedId.value = id

            return
        }
    }

    // Regular click: toggle only the clicked row.
    emit('toggle-row', id)
    lastSelectedId.value = id
}

const pageIds = computed(() =>
    props.rows.map((r) => rowId(r)).filter((id): id is string | number => id !== null),
)

const allOnPageSelected = computed(
    () => pageIds.value.length > 0 && pageIds.value.every((id) => props.selected?.has(id)),
)

/**
 * Header checkbox shows a third state when only some rows are selected.
 *
 * Without it, a partially-selected page renders an unchecked box, and clicking
 * it looks like "select all" while actually clearing an existing selection.
 */
const someOnPageSelected = computed(
    () => !allOnPageSelected.value && pageIds.value.some((id) => props.selected?.has(id)),
)

function sortKeyOf(column: TableColumn): string {
    return column.sortKey ?? column.key
}

function isSortedBy(column: TableColumn): boolean {
    return props.sort === sortKeyOf(column)
}

async function copy(recordId: string, column: TableColumn, value: unknown) {
    try {
        await navigator.clipboard.writeText(String(value))
        copied.value = `${recordId}-${column.key}`
        setTimeout(() => (copied.value = null), 1200)
    } catch {
        // Clipboard needs a secure context; failing silently beats throwing.
    }
}

/**
 * The footer only renders once the VALUES arrive.
 *
 * Showing the labels with blank or zero cells while the aggregate is still
 * running reads as "the total is zero", which is a wrong answer rather than a
 * pending one.
 */
const hasSummary = computed(
    () => !!props.summaries && !!props.summaryValues && Object.keys(props.summaries).length > 0,
)

function summaryFor(key: string) {
    return props.summaries?.[key] ?? null
}

function summaryValue(key: string): string {
    const definition = props.summaries?.[key]
    const raw = props.summaryValues?.[key]

    if (!definition) {
        return ''
    }

    // Null is "no matching rows", which is not zero - an average over nothing
    // is undefined, and printing 0 would assert something false.
    if (raw === null || raw === undefined) {
        return 'None'
    }

    const value = definition.divideBy ? raw / definition.divideBy : raw

    const formatted = new Intl.NumberFormat(undefined, {
        minimumFractionDigits: definition.decimals,
        maximumFractionDigits: definition.decimals,
    }).format(value)

    return `${definition.prefix ?? ''}${formatted}${definition.suffix ?? ''}`
}
</script>

<template>
    <!--
        `min-h-0 shrink`, not `flex-1` and not `max-h-full`.

        flex-1 stretched this box to fill the shell, so a 10-row page left a
        large empty area between the last row and the pagination - dead space
        that reads as a broken layout.

        max-h-full then clipped the last row instead, because 100% of the parent
        ignores the title, tabs, toolbar and pagination sharing that column, so
        the cap was too generous by exactly their height.

        grow-0 + shrink + basis-auto hugs the content when it fits and shrinks
        only when it genuinely cannot. min-h-0 is what allows the shrink at all.
    -->
    <div
        class="pk-scroll relative min-h-0 w-full min-w-0 max-w-full shrink grow-0 overflow-x-auto overflow-y-auto overscroll-x-contain"
        :class="framed ? 'rounded-lg border shadow-sm' : ''"
    >
        <table class="w-max min-w-full border-collapse text-sm">
            <thead class="bg-background sticky top-0 z-10">
                <tr v-if="hasColumnGroups" class="bg-muted/40">
                    <th v-if="reordering" class="w-8 border-b px-2 py-1.5" />
                    <th v-if="selectable && !reordering" class="w-10 border-b px-3 py-1.5" />
                    <th
                        v-for="band in headerBands"
                        :key="band.key"
                        :colspan="band.span"
                        class="text-muted-foreground border-b px-3 py-1.5 text-left text-xs font-medium"
                    >
                        {{ band.label ?? '' }}
                    </th>
                    <th
                        v-if="$slots.actions"
                        class="pk-actions bg-muted/40 sticky right-0 w-12 border-b border-l px-2 py-1.5 shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
                    />
                </tr>
                <tr class="bg-muted/50">
                    <!-- Unlabelled: the handles below say what it is, and a
                         heading over a column of grips is noise. -->
                    <th v-if="reordering" class="w-8 border-b px-2 py-2.5" />

                    <th
                        v-if="selectable && !reordering"
                        class="w-10 border-b px-3 py-2.5"
                        :class="stickyDataKey ? 'bg-muted/50 sticky left-0 z-[11]' : ''"
                    >
                        <input
                            :id="`${instanceId}-page`"
                            type="checkbox"
                            class="accent-primary size-3.5 cursor-pointer align-middle"
                            :checked="allOnPageSelected"
                            :indeterminate="someOnPageSelected"
                            aria-label="Select all rows on this page"
                            @click.stop
                            @change.stop="emit('toggle-page', !allOnPageSelected)"
                        />
                    </th>

                    <th
                        v-for="col in visibleColumns"
                        :key="col.key"
                        class="text-muted-foreground relative border-b px-3 py-2.5 text-left font-medium whitespace-nowrap"
                        :class="
                            isStickyDataColumn(col)
                                ? 'bg-muted/50 sticky z-[11] shadow-[8px_0_8px_-8px_rgb(0_0_0/0.25)]'
                                : ''
                        "
                        :style="columnStyle(col)"
                    >
                        <button
                            v-if="col.sortable"
                            class="hover:text-foreground inline-flex items-center gap-1 transition-colors"
                            @click="emit('sort', sortKeyOf(col))"
                        >
                            {{ col.label }}
                            <span v-if="isSortedBy(col)" class="text-xs">{{
                                direction === 'desc' ? '↓' : '↑'
                            }}</span>
                            <span v-else class="text-xs opacity-40">↕</span>
                        </button>
                        <span v-else>{{ col.label }}</span>
                        <span
                            v-if="columnCanResize(col)"
                            class="hover:bg-primary/40 absolute top-0 right-0 z-[12] h-full w-1.5 cursor-col-resize"
                            role="separator"
                            aria-orientation="vertical"
                            :aria-label="`Resize ${col.label}`"
                            @pointerdown="onResizeStart(col, $event)"
                        />
                    </th>

                    <!-- Frozen actions column. The shadow is not decoration:
                         without a depth cue a pinned column overlaying scrolled
                         content reads as a rendering bug, most obviously on a
                         phone. -->
                    <th
                        v-if="$slots.actions"
                        class="pk-actions bg-muted/50 sticky right-0 w-12 border-b border-l px-2 py-2.5 shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
                    >
                        <span class="sr-only">Actions</span>
                    </th>
                </tr>
            </thead>

            <!-- Dimmed, never unmounted - scroll position and selection survive
                 a reload (§10). Skeletons stand in when there are no rows yet
                 so an empty catalogue and a first load stay distinct. -->
            <tbody
                v-if="loading && rows.length === 0"
                data-slot="table-skeleton"
                class="transition-opacity"
            >
                <tr v-for="n in 6" :key="`skel-${n}`" class="border-b">
                    <td v-if="reordering" class="w-8 px-2 py-2.5">
                        <PkSkeleton variant="circle" class="!size-4" />
                    </td>
                    <td v-if="selectable && !reordering" class="px-3 py-2.5">
                        <PkSkeleton variant="circle" class="!size-4" />
                    </td>
                    <td v-for="col in visibleColumns" :key="col.key" class="px-3 py-2.5">
                        <PkSkeleton variant="text" />
                    </td>
                    <td v-if="$slots.actions" class="px-2 py-2.5">
                        <PkSkeleton variant="circle" class="!size-4 ml-auto" />
                    </td>
                </tr>
            </tbody>
            <tbody v-else :class="loading ? 'opacity-50 transition-opacity' : 'transition-opacity'">
                <template v-for="(row, index) in rows" :key="rowId(row) ?? `row-${index}`">
                    <!--
                        A heading whenever the value changes from the previous
                        row - including on the FIRST row of a page, which is how
                        a group that spans a page boundary is shown continuing
                        rather than starting over.
                    -->
                    <tr v-if="groupBy && startsGroup(index)" class="bg-muted/40">
                        <td
                            :colspan="
                                columns.length + (selectable ? 1 : 0) + (reordering ? 1 : 0) + 1
                            "
                            class="text-muted-foreground px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase"
                        >
                            <button
                                v-if="groupBy.collapsible"
                                type="button"
                                class="hover:text-foreground inline-flex items-center gap-1.5"
                                :aria-expanded="!isCollapsed(clusterKey(row))"
                                :dusk="`group-header-${clusterKey(row) || 'none'}`"
                                @click="toggleGroup(clusterKey(row))"
                            >
                                <span class="text-[9px]" aria-hidden="true">{{
                                    isCollapsed(clusterKey(row)) ? '▸' : '▾'
                                }}</span>
                                {{ groupValue(row) }}
                            </button>
                            <span v-else dusk="group-header">{{ groupValue(row) }}</span>
                        </td>
                    </tr>

                    <tr
                        v-if="rowVisible(index)"
                        data-slot="table-row"
                        class="group pk-row border-b transition-colors hover:bg-muted/50"
                        :class="[
                            isSelected(row)
                                ? 'bg-primary/5 shadow-[inset_3px_0_0_0_var(--color-primary)]'
                                : striped && index % 2 === 1
                                  ? 'bg-muted/20'
                                  : '',
                            dragging === index ? 'opacity-40' : '',
                            dropEdge(index),
                            reordering ? 'cursor-grab active:cursor-grabbing' : '',
                            rowClickable && !reordering ? 'cursor-pointer' : '',
                        ]"
                        :draggable="reordering"
                        @dragstart="onDragStart(index, $event)"
                        @dragover="onDragOver(index, $event)"
                        @drop.prevent="onDrop(index)"
                        @dragend="onDragEnd"
                        @contextmenu="emit('row-contextmenu', row, $event)"
                        @click="onRowClick(row, $event)"
                    >
                        <!--
                        THE WHOLE ROW DRAGS, and only in reorder mode.
                        
                        An earlier version made just the grip draggable, which
                        meant aiming at a 16px target to move a row - and it
                        needed a `mousedown` to arm `draggable` first, which is
                        fragile across browsers. Inside a mode where reordering
                        is the only thing you can do, the row itself is the
                        obvious handle and the grip is just the affordance
                        saying so.
                    -->
                        <td v-if="reordering" class="w-8 px-2 py-2 align-middle">
                            <span
                                class="text-muted-foreground/50 flex cursor-grab active:cursor-grabbing"
                                aria-hidden="true"
                            >
                                <svg
                                    class="size-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <circle cx="9" cy="6" r="1.5" />
                                    <circle cx="15" cy="6" r="1.5" />
                                    <circle cx="9" cy="12" r="1.5" />
                                    <circle cx="15" cy="12" r="1.5" />
                                    <circle cx="9" cy="18" r="1.5" />
                                    <circle cx="15" cy="18" r="1.5" />
                                </svg>
                            </span>
                        </td>

                        <td
                            v-if="selectable && !reordering"
                            class="px-3 py-2"
                            :class="
                                stickyDataKey
                                    ? 'bg-background sticky left-0 z-[1] group-hover:bg-muted/50'
                                    : ''
                            "
                        >
                            <input
                                :id="`${instanceId}-row-${rowId(row) ?? index}`"
                                type="checkbox"
                                class="accent-primary size-3.5 cursor-pointer align-middle"
                                :value="rowId(row) ?? undefined"
                                :checked="isSelected(row)"
                                :disabled="rowId(row) === null"
                                :aria-label="
                                    rowId(row) === null
                                        ? 'This row has no id and cannot be selected'
                                        : `Select row ${rowId(row)}`
                                "
                                @click.stop="onCheckboxClick(row, $event)"
                            />
                        </td>

                        <td
                            v-for="col in visibleColumns"
                            :key="col.key"
                            class="px-3 py-2 whitespace-nowrap"
                            :class="[
                                col.cellClass,
                                isStickyDataColumn(col)
                                    ? 'bg-background sticky z-[1] shadow-[8px_0_8px_-8px_rgb(0_0_0/0.25)] group-hover:bg-muted/50'
                                    : '',
                            ]"
                            :style="columnStyle(col)"
                        >
                            <slot
                                :name="`cell:${col.key}`"
                                :row="row"
                                :value="row[col.key]"
                                :column="col"
                            >
                                <span v-if="col.copyable" class="inline-flex items-center gap-1.5">
                                    {{ row[col.key] }}
                                    <button
                                        type="button"
                                        class="text-muted-foreground hover:text-foreground rounded p-0.5 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
                                        :aria-label="`Copy ${col.label.toLowerCase()}`"
                                        @click="copy(String(row[rowKey]), col, row[col.key])"
                                    >
                                        <span class="text-xs">{{
                                            copied === `${row[rowKey]}-${col.key}` ? '✓' : '⧉'
                                        }}</span>
                                    </button>
                                </span>
                                <span
                                    v-else-if="row[col.key] == null || row[col.key] === ''"
                                    class="text-muted-foreground"
                                    >None</span
                                >
                                <span v-else>{{ row[col.key] }}</span>
                            </slot>
                        </td>

                        <td
                            v-if="$slots.actions"
                            class="pk-actions bg-background group-hover:bg-muted/40 sticky right-0 border-l px-2 py-2 text-right shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
                        >
                            <slot name="actions" :row="row" />
                        </td>
                    </tr>
                </template>
            </tbody>

            <!--
                The footer totals the FILTERED SET, not the page.

                Rendered as a real <tfoot> so it aligns with the columns and
                stays with the table when it scrolls horizontally. It is absent
                until the deferred values arrive, rather than showing zeroes -
                a total that reads 0 and then changes is worse than one that
                appears a moment late.
            -->
            <tfoot v-if="hasSummary" class="bg-muted/40 border-t-2">
                <tr>
                    <td v-if="selectable" />
                    <template v-for="col in columns" :key="`s-${col.key}`">
                        <td
                            v-if="!hidden?.has(col.key)"
                            class="px-3 py-2 align-top text-sm whitespace-nowrap"
                            :class="col.cellClass"
                        >
                            <template v-if="summaryFor(col.key)">
                                <span class="text-muted-foreground block text-[10px] font-medium">
                                    {{ summaryFor(col.key)!.label }}
                                </span>
                                <span class="font-semibold tabular-nums">
                                    {{ summaryValue(col.key) }}
                                </span>
                            </template>
                        </td>
                    </template>
                    <td v-if="$slots.actions" />
                </tr>
            </tfoot>
        </table>

        <!-- "No results for your filter" and "no data at all" are different
             problems with different fixes, so they are different states (§8).
             Skip while the first load is still in flight: skeletons own that. -->
        <PkEmptyState
            v-if="rows.length === 0 && !loading && filtered"
            compact
            icon="search"
            title="Nothing matches these filters"
            description="Try clearing filters or searching for something else."
        >
            <template v-if="$slots['clear-filters']" #actions>
                <slot name="clear-filters" />
            </template>
        </PkEmptyState>
        <PkEmptyState
            v-else-if="rows.length === 0 && !loading"
            :icon="emptyIcon"
            :title="emptyTitle"
            :description="emptyHint"
        >
            <template v-if="$slots['empty-actions']" #actions>
                <slot name="empty-actions" />
            </template>
        </PkEmptyState>
    </div>
</template>

<style scoped>
/**
 * Near-invisible scrollbars.
 *
 * A fixed shell means the table scrolls internally, which on default browser
 * styling produces heavy grey bars framing the data - visual weight that
 * competes with the content and reads as chrome rather than affordance.
 *
 * A quiet thumb is visible at rest and becomes stronger on hover/focus.
 * Deliberately NOT `scrollbar-width: none`: hiding a scrollbar outright
 * removes the only cue that there is more content sideways.
 */
.pk-scroll {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in oklch, currentColor 18%, transparent) transparent;
    transition: scrollbar-color 150ms ease;
}

.pk-scroll:hover,
.pk-scroll:focus-within {
    scrollbar-color: color-mix(in oklch, currentColor 32%, transparent) transparent;
}

.pk-scroll::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.pk-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.pk-scroll::-webkit-scrollbar-thumb {
    background: color-mix(in oklch, currentColor 18%, transparent);
    border-radius: 9999px;
    transition: background 150ms ease;
}

.pk-scroll:hover::-webkit-scrollbar-thumb,
.pk-scroll:focus-within::-webkit-scrollbar-thumb {
    background: color-mix(in oklch, currentColor 32%, transparent);
}

.pk-scroll::-webkit-scrollbar-corner {
    background: transparent;
}

/**
 * The frozen actions column must sit above every other cell.
 *
 * Without an explicit stacking order a later sticky cell can paint over the
 * actions column while the table is scrolled horizontally, making the row menu
 * unclickable even though it is plainly visible - a failure that looks like a
 * dead button rather than a layering bug.
 */
td.pk-actions,
th.pk-actions {
    z-index: 2;
}
</style>
