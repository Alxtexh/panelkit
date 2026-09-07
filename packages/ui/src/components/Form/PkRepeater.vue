<script setup lang="ts">
/**
 * A repeating group of fields - the control for `RepeaterField`.
 *
 * FOR THE ONE-TO-MANY THAT DOES NOT DESERVE A TABLE: a client's several contact
 * numbers, the notes attached to an installation. Data always read with its
 * parent, never queried on its own. The honest limit is stated on the PHP side
 * and repeated here because it is the thing people get wrong: anything you will
 * ever FILTER, SORT or COUNT belongs in a table, and moving it later is a
 * migration.
 *
 * CHILDREN ARE LEAVES. The server refuses a repeater inside a repeater at
 * declaration time, so this never recurses more than one level - which is also
 * why importing the field control here is safe.
 *
 * ROWS CARRY A CLIENT-SIDE UID, and it is load-bearing rather than tidy. Keying
 * rows by array index means deleting row 2 renumbers rows 3 and 4, so Vue
 * reuses the wrong DOM nodes and the values appear to jump between rows. Keying
 * by content is worse, because content changes as you type.
 *
 * ERRORS ARE ADDRESSED BY PATH. Laravel validates children at
 * `contacts.0.phone`, so that is exactly the key looked up here - no
 * re-derivation, no guessing which row a message belongs to.
 *
 * DRAG IS ADDITIVE, NOT A REPLACEMENT for the up/down buttons below - see
 * their own note. A grip handle beside the ordinal gives a long list a
 * faster way to reorder without taking away the one that works from a
 * keyboard or a field inside a page that scrolls under a drag. Same
 * mechanism `PanelDashboard.vue` already uses for widget reordering:
 * native HTML5 drag events on the handle alone, never the row, so
 * clicking into an input never starts a drag by accident.
 */
import { computed, ref, watch } from 'vue'
import FormFieldControl from './FormFieldControl.vue'
import type { FormField } from './types'

type Row = Record<string, unknown>

interface KeyedRow {
    uid: number
    data: Row
}

const props = withDefaults(
    defineProps<{
        modelValue: Row[] | null
        /** One row's shape, declared server-side. */
        children: FormField[]
        itemLabel?: string
        minItems?: number | null
        maxItems?: number | null
        collapsible?: boolean
        /** Whether "Add" appears at all - distinct from `atMax` below, which
         * is a count ceiling. This is a declared "never grows" field. */
        addable?: boolean
        /** Whether a row's own remove control appears - distinct from
         * `atMin`, which is a count floor. This is a declared "never
         * shrinks" field. */
        deletable?: boolean
        /** Whether a row can be duplicated. Independent of `addable`: a host
         * can offer "start from a copy" while still refusing a blank row. */
        cloneable?: boolean
        /** Render as a `<table>` - one column per child, one row per item -
         * instead of the stacked one-field-per-line layout. No collapse
         * affordance renders in this mode, whatever `collapsible` says. */
        table?: boolean
        /** Relationship mode preserves the server-issued child id on submit. */
        relationship?: string | null
        disabled?: boolean
        /** Validation errors for the whole form, keyed by dotted path. */
        errors?: Record<string, string>
        /** The field's own key, so child error paths can be built. */
        fieldKey: string
        /** Option lists for child selects, keyed by child field key. */
        childOptions?: Record<string, { value: any; label: string }[]>
    }>(),
    {
        itemLabel: 'Item',
        minItems: null,
        maxItems: null,
        collapsible: false,
        addable: true,
        deletable: true,
        cloneable: false,
        table: false,
        relationship: null,
        disabled: false,
        errors: () => ({}),
        childOptions: () => ({}),
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: Row[] | null): void
}>()

let nextUid = 0

const rows = ref<KeyedRow[]>(fromValue(props.modelValue))

function fromValue(source: Row[] | null): KeyedRow[] {
    if (!Array.isArray(source)) {
        return []
    }

    return source.map((data) => ({ uid: nextUid++, data: { ...data } }))
}

/** Same reasoning as PkKeyValue: re-seed only on a genuine external change. */
watch(
    () => props.modelValue,
    (incoming) => {
        if (JSON.stringify(incoming ?? null) === JSON.stringify(toValue())) {
            return
        }

        rows.value = fromValue(incoming)
    },
)

/**
 * Rows that have something in them, in order.
 *
 * Empty rows are dropped because "Add" creates one before it is filled in, and
 * saving with a blank row at the bottom should not persist a blank row. The
 * server does this too - it has to, since it cannot trust the client - but
 * doing it here as well keeps the dirty-check honest: a form is not "changed"
 * because somebody clicked Add and then thought better of it.
 */
function toValue(): Row[] | null {
    const out: Row[] = []

    for (const row of rows.value) {
        const clean: Row = {}
        let hasValue = false

        if (props.relationship && row.data._id !== undefined) {
            clean._id = row.data._id
        }

        for (const child of props.children) {
            const entry = row.data[child.key] ?? null

            clean[child.key] = entry

            if (entry !== null && entry !== '' && !(Array.isArray(entry) && entry.length === 0)) {
                hasValue = true
            }
        }

        if (hasValue) {
            out.push(clean)
        }
    }

    return out.length ? out : null
}

function publish() {
    emit('update:modelValue', toValue())
}

const atMax = computed(() => props.maxItems !== null && rows.value.length >= props.maxItems)
const atMin = computed(() => props.minItems !== null && rows.value.length <= props.minItems)

/**
 * One child field means one input per row, and the row drops the repeated
 * label (DESIGN_RULES rule 6): the section heading already names it, and
 * "Instruction" three times above three inputs says nothing the first one
 * didn't. The label stays in the DOM as `sr-only` so the input keeps its
 * accessible name. Two or more children keep their labels - there they
 * disambiguate.
 */
const singleChild = computed(() => props.children.length === 1)

function add() {
    if (atMax.value || props.disabled || !props.addable) {
        return
    }

    const blank: Row = {}

    for (const child of props.children) {
        blank[child.key] = null
    }

    rows.value.push({ uid: nextUid++, data: blank })
}

function remove(uid: number) {
    rows.value = rows.value.filter((r) => r.uid !== uid)
    publish()
}

/**
 * Insert a copy of one row right after itself.
 *
 * Gated on `atMax`, same ceiling `add()` respects - a clone is still a new
 * row. NOT gated on `addable`: cloning is its own declared capability
 * (`cloneable()`), so a field can offer "start from a copy" while refusing a
 * blank row, or the reverse. A shallow-per-child copy is enough because
 * `FormFieldControl` values are themselves primitives, arrays of primitives,
 * or already-cloned-on-read objects - nothing here holds a live reference
 * back into the source row.
 */
function cloneRow(uid: number) {
    if (atMax.value || props.disabled || !props.cloneable) {
        return
    }

    const index = rows.value.findIndex((r) => r.uid === uid)

    if (index < 0) {
        return
    }

    const source = rows.value[index]
    const copy: Row = {}

    for (const child of props.children) {
        const value = source.data[child.key]

        copy[child.key] = Array.isArray(value) ? [...value] : value
    }

    const next = [...rows.value]

    next.splice(index + 1, 0, { uid: nextUid++, data: copy })
    rows.value = next
    publish()
}

/**
 * Move a row one place.
 *
 * Order is meaningful here - a repeater is a list, and "primary contact first"
 * is the commonest reason to use one. Buttons rather than drag: a form field
 * inside a scrolling page is a poor drag target, and two arrows work with a
 * keyboard, which a drag does not.
 */
function move(index: number, delta: number) {
    const target = index + delta

    if (target < 0 || target >= rows.value.length) {
        return
    }

    const next = [...rows.value]
    const [moved] = next.splice(index, 1)

    next.splice(target, 0, moved)
    rows.value = next
    publish()
}

function setChild(uid: number, key: string, value: unknown) {
    const row = rows.value.find((r) => r.uid === uid)

    if (!row) {
        return
    }

    row.data[key] = value
    publish()
}

/** Laravel's own path for this child, so its message is found not rebuilt. */
function errorFor(index: number, childKey: string): string | undefined {
    return props.errors[`${props.fieldKey}.${index}.${childKey}`]
}

/**
 * Which rows are folded, by uid - UI-only, never published. Collapsing a
 * row changes nothing about its data, so it has no business round-tripping
 * through `update:modelValue` or surviving a page reload.
 */
const collapsedUids = ref<Set<number>>(new Set())

function isCollapsed(uid: number): boolean {
    return props.collapsible && collapsedUids.value.has(uid)
}

function toggleCollapsed(uid: number) {
    const next = new Set(collapsedUids.value)

    if (next.has(uid)) {
        next.delete(uid)
    } else {
        next.add(uid)
    }

    collapsedUids.value = next
}

const allCollapsed = computed(
    () => rows.value.length > 0 && rows.value.every((r) => collapsedUids.value.has(r.uid)),
)

function toggleAllCollapsed() {
    collapsedUids.value = allCollapsed.value ? new Set() : new Set(rows.value.map((r) => r.uid))
}

/**
 * The line a folded row shows in place of its fields - the ordinal plus
 * whatever the FIRST child holds, when that is short plain text. Anything
 * else (an array, an object, something long) is left out rather than
 * summarised badly; the ordinal alone is still enough to find the row
 * again by expanding it.
 */
function summaryFor(row: KeyedRow): string {
    const first = props.children[0]

    if (!first) {
        return ''
    }

    const value = row.data[first.key]

    if (typeof value !== 'string' && typeof value !== 'number') {
        return ''
    }

    const text = String(value).trim()

    if (text === '' || text.length > 60) {
        return ''
    }

    return text
}

/** The row currently being dragged, or null - see the class note on why
 * this lives on the handle alone rather than the whole row. */
const dragUid = ref<number | null>(null)

function onHandleDragStart(uid: number, event: DragEvent) {
    if (props.disabled) {
        event.preventDefault()

        return
    }

    dragUid.value = uid
    event.dataTransfer?.setData('text/plain', String(uid))

    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
    }
}

function onHandleDragEnd() {
    dragUid.value = null
}

function onRowDrop(targetUid: number, event: DragEvent) {
    event.preventDefault()

    const from = dragUid.value
    dragUid.value = null

    /*
     * `=== null`, NOT a truthiness check - `nextUid` starts at 0, so the
     * very first row's own uid is `0`, and `!from` would treat dragging
     * THAT row as if nothing were being dragged at all.
     */
    if (props.disabled || from === null || from === targetUid) {
        return
    }

    const next = [...rows.value]
    const fromIndex = next.findIndex((r) => r.uid === from)
    const toIndex = next.findIndex((r) => r.uid === targetUid)

    if (fromIndex < 0 || toIndex < 0) {
        return
    }

    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)

    rows.value = next
    publish()
}
</script>

<template>
    <!--
        ROWS, NOT CARDS - DESIGN_RULES rule 6. An item is an ordinal badge,
        its input(s) and its controls on one line. The bordered per-item card
        with its own heading and control strip made three short entries taller
        than the rest of the form put together.
    -->
    <div v-if="!table && collapsible && rows.length > 1" class="flex justify-end">
        <button
            type="button"
            class="text-muted-foreground hover:text-foreground text-xs font-medium"
            @click="toggleAllCollapsed"
        >
            {{ allCollapsed ? 'Expand all' : 'Collapse all' }}
        </button>
    </div>

    <div v-if="!table" class="flex flex-col gap-2">
        <div
            v-for="(row, index) in rows"
            :key="row.uid"
            class="flex items-start gap-2"
            :class="dragUid === row.uid ? 'opacity-40' : ''"
            @dragover.prevent
            @drop="onRowDrop(row.uid, $event)"
        >
            <button
                v-if="!disabled"
                type="button"
                class="text-muted-foreground/60 hover:text-muted-foreground flex size-6 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
                :class="singleChild ? 'mt-1.5' : 'mt-0.5'"
                draggable="true"
                :aria-label="`Drag to reorder ${itemLabel} ${index + 1}`"
                @dragstart="onHandleDragStart(row.uid, $event)"
                @dragend="onHandleDragEnd"
            >
                <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <circle cx="9" cy="6" r="1.4" />
                    <circle cx="15" cy="6" r="1.4" />
                    <circle cx="9" cy="12" r="1.4" />
                    <circle cx="15" cy="12" r="1.4" />
                    <circle cx="9" cy="18" r="1.4" />
                    <circle cx="15" cy="18" r="1.4" />
                </svg>
            </button>

            <span
                class="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums"
                :class="singleChild ? 'mt-1.5' : 'mt-0.5'"
                aria-hidden="true"
            >
                {{ index + 1 }}
            </span>

            <button
                v-if="isCollapsed(row.uid)"
                type="button"
                class="hover:bg-accent min-w-0 flex-1 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
                @click="toggleCollapsed(row.uid)"
            >
                <span class="font-medium">{{ itemLabel }} {{ index + 1 }}</span>
                <span v-if="summaryFor(row)" class="text-muted-foreground ml-2 truncate">
                    {{ summaryFor(row) }}
                </span>
            </button>

            <div v-else class="min-w-0 flex-1">
                <FormFieldControl
                    v-if="singleChild"
                    :field="{
                        ...children[0],
                        disabled: children[0].disabled || disabled,
                        labelHidden: true,
                    }"
                    :value="row.data[children[0].key]"
                    :error="errorFor(index, children[0].key)"
                    :options="childOptions[children[0].key] ?? []"
                    @change="(value) => setChild(row.uid, children[0].key, value)"
                />

                <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormFieldControl
                        v-for="child in children"
                        :key="child.key"
                        :field="{ ...child, disabled: child.disabled || disabled }"
                        :value="row.data[child.key]"
                        :error="errorFor(index, child.key)"
                        :options="childOptions[child.key] ?? []"
                        @change="(value) => setChild(row.uid, child.key, value)"
                    />
                </div>
            </div>

            <div class="flex shrink-0 items-center gap-0.5" :class="singleChild ? 'mt-1' : 'mt-0'">
                <button
                    v-if="collapsible"
                    type="button"
                    class="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors"
                    :aria-label="
                        isCollapsed(row.uid)
                            ? `Expand ${itemLabel} ${index + 1}`
                            : `Collapse ${itemLabel} ${index + 1}`
                    "
                    @click="toggleCollapsed(row.uid)"
                >
                    <svg
                        class="size-3.5 transition-transform"
                        :class="isCollapsed(row.uid) ? '' : 'rotate-180'"
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
                    type="button"
                    class="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30"
                    :disabled="disabled || index === 0"
                    :aria-label="`Move ${itemLabel} ${index + 1} up`"
                    @click="move(index, -1)"
                >
                    <svg
                        class="size-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path d="m18 15-6-6-6 6" />
                    </svg>
                </button>

                <button
                    type="button"
                    class="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30"
                    :disabled="disabled || index === rows.length - 1"
                    :aria-label="`Move ${itemLabel} ${index + 1} down`"
                    @click="move(index, 1)"
                >
                    <svg
                        class="size-3.5"
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
                    v-if="cloneable"
                    type="button"
                    class="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30"
                    :disabled="disabled || atMax"
                    :title="atMax ? `At most ${maxItems} allowed` : undefined"
                    :aria-label="`Duplicate ${itemLabel} ${index + 1}`"
                    @click="cloneRow(row.uid)"
                >
                    <svg
                        class="size-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <rect x="8" y="8" width="12" height="12" rx="2" />
                        <path d="M4 16V6a2 2 0 0 1 2-2h10" />
                    </svg>
                </button>

                <button
                    v-if="deletable"
                    type="button"
                    class="text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30"
                    :disabled="disabled || atMin"
                    :title="atMin ? `At least ${minItems} required` : undefined"
                    :aria-label="`Remove ${itemLabel} ${index + 1}`"
                    @click="remove(row.uid)"
                >
                    <svg
                        class="size-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        aria-hidden="true"
                    >
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <p
            v-if="rows.length === 0"
            class="text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
        >
            No {{ itemLabel.toLowerCase() }}s yet.
        </p>

        <!--
            HIDDEN AT THE LIMIT, not disabled, and no "n of max" counter -
            DESIGN_RULES rule 5. A disabled Add next to a live count was two
            controls describing a state instead of offering an action; when
            nothing more can be added, the honest UI is nothing.
        -->
        <button
            v-if="!atMax && addable"
            type="button"
            class="text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50"
            :disabled="disabled"
            @click="add"
        >
            <svg
                class="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
            >
                <path d="M12 5v14M5 12h14" />
            </svg>
            Add {{ itemLabel.toLowerCase() }}
        </button>
    </div>

    <!--
        TABLE MODE - `RepeaterField::table()`. Several short fields read as
        one glance across a row here; the stacked layout above wraps each to
        its own line, which is right for one field or a long one and wastes
        width for several short ones. No collapse affordance in this mode -
        see the PHP side's own note on why folding a row of cells is not a
        thing this builds.
    -->
    <div v-else class="flex flex-col gap-2">
        <div v-if="rows.length" class="overflow-x-auto rounded-md border">
            <table class="w-full text-sm">
                <thead>
                    <tr class="bg-muted/40">
                        <th v-if="!disabled" class="w-8 border-b px-2 py-1.5">
                            <span class="sr-only">Reorder</span>
                        </th>

                        <th
                            v-for="child in children"
                            :key="child.key"
                            class="text-muted-foreground border-b px-2 py-1.5 text-left text-xs font-medium"
                        >
                            {{ child.label }}
                            <span v-if="child.required" class="text-destructive" aria-hidden="true"
                                >*</span
                            >
                        </th>

                        <th class="border-b px-2 py-1.5">
                            <span class="sr-only">Row actions</span>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="(row, index) in rows"
                        :key="row.uid"
                        class="border-b last:border-b-0"
                        :class="dragUid === row.uid ? 'opacity-40' : ''"
                        @dragover.prevent
                        @drop="onRowDrop(row.uid, $event)"
                    >
                        <td v-if="!disabled" class="px-2 py-1.5 align-top">
                            <button
                                type="button"
                                class="text-muted-foreground/60 hover:text-muted-foreground mt-0.5 flex size-6 cursor-grab items-center justify-center active:cursor-grabbing"
                                draggable="true"
                                :aria-label="`Drag to reorder ${itemLabel} ${index + 1}`"
                                @dragstart="onHandleDragStart(row.uid, $event)"
                                @dragend="onHandleDragEnd"
                            >
                                <svg
                                    class="size-3.5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <circle cx="9" cy="6" r="1.4" />
                                    <circle cx="15" cy="6" r="1.4" />
                                    <circle cx="9" cy="12" r="1.4" />
                                    <circle cx="15" cy="12" r="1.4" />
                                    <circle cx="9" cy="18" r="1.4" />
                                    <circle cx="15" cy="18" r="1.4" />
                                </svg>
                            </button>
                        </td>

                        <td
                            v-for="child in children"
                            :key="child.key"
                            class="min-w-[8rem] px-2 py-1.5 align-top"
                        >
                            <FormFieldControl
                                :field="{
                                    ...child,
                                    disabled: child.disabled || disabled,
                                    labelHidden: true,
                                }"
                                :value="row.data[child.key]"
                                :error="errorFor(index, child.key)"
                                :options="childOptions[child.key] ?? []"
                                @change="(value) => setChild(row.uid, child.key, value)"
                            />
                        </td>

                        <td class="px-2 py-1.5 align-top">
                            <div class="mt-0.5 flex items-center gap-0.5">
                                <button
                                    type="button"
                                    class="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30"
                                    :disabled="disabled || index === 0"
                                    :aria-label="`Move ${itemLabel} ${index + 1} up`"
                                    @click="move(index, -1)"
                                >
                                    <svg
                                        class="size-3.5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="m18 15-6-6-6 6" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    class="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30"
                                    :disabled="disabled || index === rows.length - 1"
                                    :aria-label="`Move ${itemLabel} ${index + 1} down`"
                                    @click="move(index, 1)"
                                >
                                    <svg
                                        class="size-3.5"
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
                                    v-if="cloneable"
                                    type="button"
                                    class="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30"
                                    :disabled="disabled || atMax"
                                    :title="atMax ? `At most ${maxItems} allowed` : undefined"
                                    :aria-label="`Duplicate ${itemLabel} ${index + 1}`"
                                    @click="cloneRow(row.uid)"
                                >
                                    <svg
                                        class="size-3.5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        aria-hidden="true"
                                    >
                                        <rect x="8" y="8" width="12" height="12" rx="2" />
                                        <path d="M4 16V6a2 2 0 0 1 2-2h10" />
                                    </svg>
                                </button>

                                <button
                                    v-if="deletable"
                                    type="button"
                                    class="text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30"
                                    :disabled="disabled || atMin"
                                    :title="atMin ? `At least ${minItems} required` : undefined"
                                    :aria-label="`Remove ${itemLabel} ${index + 1}`"
                                    @click="remove(row.uid)"
                                >
                                    <svg
                                        class="size-3.5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-else class="text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs">
            No {{ itemLabel.toLowerCase() }}s yet.
        </p>

        <button
            v-if="!atMax && addable"
            type="button"
            class="text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50"
            :disabled="disabled"
            @click="add"
        >
            <svg
                class="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
            >
                <path d="M12 5v14M5 12h14" />
            </svg>
            Add {{ itemLabel.toLowerCase() }}
        </button>
    </div>
</template>
