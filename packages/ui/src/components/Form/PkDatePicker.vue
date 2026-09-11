<script setup lang="ts">
/**
 * A themed date (and optional time) picker - the control for `DateField`.
 *
 * WHY THIS EXISTS. `FormFieldControl.vue` used to render `field.type ===
 * 'date'`/`'datetime'` as a bare `<input type="date">`/`<input
 * type="datetime-local">`. Every browser renders its own native date control
 * for that input type, in its own visual language, with no way to match it to
 * the rest of a form's chrome - the one field on the page that never looks
 * like it belongs to this kit. This draws the same day-grid job with the same
 * `.pk-control`/`border-input`/`FOCUS_RING` vocabulary every other field uses.
 *
 * PLAIN `Date` MATH, NOT A CALENDAR LIBRARY. `reka-ui` (already a dependency)
 * ships headless `Calendar`/`DatePicker` primitives, but they expect
 * `@internationalized/date` value types this package does not otherwise need,
 * and their exact prop contract could not be verified against source here -
 * shipping a control built against a guessed API is worse than shipping
 * something smaller and correct. A day grid is well-understood, unexotic
 * math; building it directly keeps this dependency-free and fully owned.
 *
 * THE OVERLAY IS THE SAME PATTERN `FormFieldControl.vue` ALREADY USES for its
 * searchable-select dropdown: an `open` ref, an absolutely positioned panel,
 * and a `fixed inset-0` backdrop that closes it on an outside click. Nothing
 * new architecturally, just the same shape applied to a day grid.
 *
 * VALUE SHAPE: an ISO `YYYY-MM-DD` string (matching `DateField::typeRules()`,
 * which validates `date` - Carbon and the browser both parse it unambiguously).
 * With `withTime`, the emitted value is `YYYY-MM-DDTHH:mm`, matching what
 * `<input type="datetime-local">` already produced, so no server-side change
 * is needed to adopt this control.
 */
import { computed, nextTick, ref, watch } from 'vue'
import { FOCUS_RING, INVALID_BORDER } from '../../lib/focusRing'

const props = withDefaults(
    defineProps<{
        modelValue: string | null
        id?: string
        withTime?: boolean
        min?: string | null
        max?: string | null
        disabled?: boolean
        invalid?: boolean
        placeholder?: string
        /** The id of this field's error message (`role="alert"` text), so a
         *  screen reader announces it as part of the control's description -
         *  not just at the moment the error first appears. */
        describedBy?: string
    }>(),
    {
        id: undefined,
        withTime: false,
        min: null,
        max: null,
        disabled: false,
        invalid: false,
        placeholder: 'Pick a date…',
        describedBy: undefined,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void
}>()

/* ------------------------------------------------------------- parsing --- */

/** The date part only, local time - never `new Date(isoString)` for a bare
 *  `YYYY-MM-DD`, which JS parses as UTC midnight and can render as the
 *  previous day west of Greenwich. */
function parseDatePart(value: string | null): Date | null {
    if (!value) {
        return null
    }

    const [datePart] = value.split('T')
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart ?? '')

    if (!match) {
        return null
    }

    const [, y, m, d] = match

    return new Date(Number(y), Number(m) - 1, Number(d))
}

function parseTimePart(value: string | null): string {
    if (!value || !value.includes('T')) {
        return '00:00'
    }

    return value.split('T')[1]?.slice(0, 5) || '00:00'
}

function pad(n: number): string {
    return String(n).padStart(2, '0')
}

function toIsoDate(date: Date): string {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function sameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

/* --------------------------------------------------------------- state --- */

const open = ref(false)
const selected = computed(() => parseDatePart(props.modelValue))
const timeValue = ref(parseTimePart(props.modelValue))
/** The month the grid is showing - independent of the selected date, so
 *  navigating months does not change the value until a day is picked. */
const viewMonth = ref(selected.value ?? new Date())

watch(
    () => props.modelValue,
    (next) => {
        timeValue.value = parseTimePart(next)

        const parsed = parseDatePart(next)

        if (parsed) {
            viewMonth.value = parsed
        }
    },
)

const minDate = computed(() => parseDatePart(props.min))
const maxDate = computed(() => parseDatePart(props.max))

function isDisallowed(date: Date): boolean {
    if (minDate.value && date < minDate.value) {
        return true
    }

    return !!(maxDate.value && date > maxDate.value)
}

const monthLabel = computed(() =>
    viewMonth.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
)

const weekdayLabels = computed(() => {
    // Sunday-first grid, matching Date#getDay()'s own 0=Sunday convention -
    // a Monday-first grid would need every cell's weekday remapped instead of
    // read directly.
    const narrow = new Intl.DateTimeFormat(undefined, { weekday: 'narrow' })
    // The visible glyph alone is genuinely ambiguous for two pairs of days
    // in English ("S" for Sunday AND Saturday, "T" for Tuesday AND
    // Thursday) - a screen reader reading the narrow form aloud announces
    // that same ambiguous letter, so each header also carries the full
    // weekday name as its accessible name.
    const full = new Intl.DateTimeFormat(undefined, { weekday: 'long' })
    const start = new Date(2023, 0, 1) // a Sunday

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start)
        d.setDate(start.getDate() + i)

        return { short: narrow.format(d), full: full.format(d) }
    })
})

/** Every cell the grid draws, including the leading/trailing days that fill
 *  out the first and last week. */
const gridDays = computed(() => {
    const year = viewMonth.value.getFullYear()
    const month = viewMonth.value.getMonth()
    const firstOfMonth = new Date(year, month, 1)
    const startOffset = firstOfMonth.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: { date: Date; inMonth: boolean }[] = []

    for (let i = 0; i < startOffset; i++) {
        days.push({ date: new Date(year, month, i - startOffset + 1), inMonth: false })
    }

    for (let d = 1; d <= daysInMonth; d++) {
        days.push({ date: new Date(year, month, d), inMonth: true })
    }

    // Pad to a multiple of 7 so the grid never reflows between five and six
    // rows as the month changes.
    while (days.length % 7 !== 0 || days.length < 42) {
        const last = days[days.length - 1]!.date
        const next = new Date(last)
        next.setDate(last.getDate() + 1)
        days.push({ date: next, inMonth: false })
    }

    return days
})

/**
 * `gridDays` CHUNKED INTO WEEKS OF 7, so the template can wrap each week in
 * `role="row"` - a `role="grid"` whose `gridcell`s are direct children,
 * skipping `row`, is invalid ARIA grid structure (the spec requires
 * `row` as the required owned element of `grid`, with `gridcell` owned by
 * `row` in turn). Screen readers vary in how they degrade an invalid grid;
 * some drop the table-navigation semantics entirely, which is the exact
 * "arrow keys move focus but nothing is announced as a grid" failure this
 * exists to avoid.
 */
const gridWeeks = computed(() => {
    const days = gridDays.value
    const weeks: { date: Date; inMonth: boolean }[][] = []

    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7))
    }

    return weeks
})

const today = new Date()

/** The full, unambiguous date a screen reader announces on a grid cell -
 *  the bare day number alone ("14") carries no month/year/weekday context,
 *  which matters most exactly when arrow-key navigation crosses a month
 *  boundary and the visible number resets to a small value in a different
 *  month nothing else announces. */
function cellLabel(date: Date): string {
    return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function goToPreviousMonth(): void {
    viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() - 1, 1)
}

function goToNextMonth(): void {
    viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + 1, 1)
}

function emitValue(date: Date, time: string): void {
    emit('update:modelValue', props.withTime ? `${toIsoDate(date)}T${time}` : toIsoDate(date))
}

function pickDay(date: Date): void {
    if (props.disabled || isDisallowed(date)) {
        return
    }

    emitValue(date, timeValue.value)

    if (!props.withTime) {
        open.value = false
    }
}

function onTimeChange(event: Event): void {
    const next = (event.target as HTMLInputElement).value || '00:00'
    timeValue.value = next

    if (selected.value) {
        emitValue(selected.value, next)
    }
}

function clear(): void {
    emit('update:modelValue', null)
}

const displayLabel = computed(() => {
    if (!selected.value) {
        return null
    }

    const datePart = selected.value.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })

    return props.withTime ? `${datePart}, ${timeValue.value}` : datePart
})

/* ----------------------------------------------------------- keyboard --- */

const gridRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)

async function toggleOpen(): Promise<void> {
    if (props.disabled) {
        return
    }

    open.value = !open.value

    if (open.value) {
        await nextTick()
        gridRef.value?.querySelector<HTMLElement>('[data-selected="true"], [data-today="true"]')
            ?.focus()
    }
}

/**
 * FOCUS RETURNS TO THE TRIGGER whenever the calendar closes, regardless of
 * how - Escape, picking a day, or the backdrop's outside-click all just set
 * `open` to false. A `watch` here catches every path in one place rather
 * than repeating a `.focus()` call at each of them; without it, closing via
 * Escape (or a day pick removing the focused grid cell from the DOM) left
 * focus on nothing in particular - `document.body` - which is the standard
 * "where did my cursor go" complaint against a popover/dialog pattern.
 */
watch(open, (isOpen, wasOpen) => {
    if (!isOpen && wasOpen) {
        triggerRef.value?.focus()
    }
})

function moveFocus(days: number): void {
    const current = document.activeElement as HTMLElement | null
    const currentIso = current?.dataset.iso

    if (!currentIso) {
        return
    }

    const [y, m, d] = currentIso.split('-').map(Number)
    const next = new Date(y!, m! - 1, d! + days)

    if (next.getMonth() !== viewMonth.value.getMonth() || next.getFullYear() !== viewMonth.value.getFullYear()) {
        viewMonth.value = new Date(next.getFullYear(), next.getMonth(), 1)
    }

    nextTick(() => {
        gridRef.value?.querySelector<HTMLElement>(`[data-iso="${toIsoDate(next)}"]`)?.focus()
    })
}

function onGridKeydown(event: KeyboardEvent): void {
    const steps: Record<string, number> = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -7,
        ArrowDown: 7,
    }

    if (event.key in steps) {
        event.preventDefault()
        moveFocus(steps[event.key]!)
    }
}

const dialogRef = ref<HTMLElement | null>(null)

/**
 * ESCAPE (from anywhere in the dialog, not only the grid) and a MINIMAL
 * FOCUS TRAP for Tab/Shift+Tab - `aria-modal="true"` on the dialog below
 * tells assistive tech everything outside it is inert, which is only true
 * if REAL keyboard focus also cannot leave it. Without this, Tab from
 * "Next month" (or the time input) escaped to whatever followed in the
 * page's own DOM order - reachable by keyboard, invisible to a sighted
 * mouse user, the same failure `PkSlideover.vue`'s own trap exists to
 * avoid, adapted here for a roving-tabindex day grid: `:not([tabindex="-1"])`
 * excludes the 41 grid cells NOT currently the roving focus stop while
 * keeping the one that is, so first/last are computed correctly regardless
 * of which day currently holds it.
 *
 * Escape moved here (off the grid-only handler) for the same reason: it
 * used to work only while focus was literally inside the day grid, not
 * from "Previous month" or the time input.
 */
function onDialogKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        event.preventDefault()
        open.value = false

        return
    }

    if (event.key !== 'Tab' || !dialogRef.value) {
        return
    }

    const focusable = dialogRef.value.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([tabindex="-1"]), input:not([disabled])',
    )

    if (focusable.length === 0) {
        return
    }

    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
    }
}
</script>

<template>
    <div class="relative">
        <div
            :aria-invalid="invalid"
            :class="[
                'border-input bg-background flex h-9 items-center gap-2 rounded-md border px-3 text-sm',
                { 'opacity-50': disabled },
                FOCUS_RING,
                INVALID_BORDER,
            ]"
        >
            <button
                :id="id"
                ref="triggerRef"
                type="button"
                class="flex flex-1 items-center gap-2 text-left disabled:cursor-not-allowed"
                :disabled="disabled"
                :aria-invalid="invalid"
                :aria-describedby="describedBy"
                :aria-expanded="open"
                aria-haspopup="dialog"
                @click="toggleOpen"
            >
                <svg
                    class="text-muted-foreground size-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                >
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
                <span :class="displayLabel ? '' : 'text-muted-foreground'">
                    {{ displayLabel ?? placeholder }}
                </span>
            </button>
            <button
                v-if="displayLabel && !disabled"
                type="button"
                class="text-muted-foreground hover:text-foreground text-xs"
                aria-label="Clear date"
                @click.stop="clear"
            >
                ✕
            </button>
        </div>

        <div
            v-if="open"
            ref="dialogRef"
            class="bg-popover absolute z-50 mt-1 w-72 rounded-md border p-3 shadow-md"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a date"
            @keydown="onDialogKeydown"
        >
            <div class="mb-2 flex items-center justify-between">
                <button
                    type="button"
                    class="hover:bg-accent rounded p-1 text-sm"
                    aria-label="Previous month"
                    @click="goToPreviousMonth"
                >
                    ‹
                </button>
                <span class="text-sm font-medium">{{ monthLabel }}</span>
                <button
                    type="button"
                    class="hover:bg-accent rounded p-1 text-sm"
                    aria-label="Next month"
                    @click="goToNextMonth"
                >
                    ›
                </button>
            </div>

            <!--
                `role="row"` wraps each week - see `gridWeeks`'s own docblock
                for why a `role="grid"` cannot own `gridcell`s directly.
            -->
            <div ref="gridRef" role="grid" @keydown="onGridKeydown">
                <div role="row" class="grid grid-cols-7 gap-0.5">
                    <span
                        v-for="label in weekdayLabels"
                        :key="label.short"
                        class="text-muted-foreground flex h-7 items-center justify-center text-xs"
                        role="columnheader"
                        :aria-label="label.full"
                    >
                        {{ label.short }}
                    </span>
                </div>

                <div
                    v-for="(week, wi) in gridWeeks"
                    :key="wi"
                    role="row"
                    class="grid grid-cols-7 gap-0.5"
                >
                    <button
                        v-for="cell in week"
                        :key="cell.date.toISOString()"
                        type="button"
                        role="gridcell"
                        :aria-label="cellLabel(cell.date)"
                        :aria-selected="!!selected && sameDay(cell.date, selected)"
                        :data-iso="toIsoDate(cell.date)"
                        :data-selected="!!selected && sameDay(cell.date, selected)"
                        :data-today="sameDay(cell.date, today)"
                        :tabindex="selected ? (sameDay(cell.date, selected) ? 0 : -1) : sameDay(cell.date, today) ? 0 : -1"
                        :disabled="isDisallowed(cell.date)"
                        :class="[
                            'flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
                            cell.inMonth ? '' : 'text-muted-foreground/50',
                            selected && sameDay(cell.date, selected)
                                ? 'bg-primary text-primary-foreground font-medium'
                                : sameDay(cell.date, today)
                                  ? 'border-primary/50 border font-medium'
                                  : 'hover:bg-accent',
                            'disabled:pointer-events-none disabled:opacity-30',
                            FOCUS_RING,
                        ]"
                        @click="pickDay(cell.date)"
                    >
                        {{ cell.date.getDate() }}
                    </button>
                </div>
            </div>

            <div v-if="withTime" class="mt-3 border-t pt-3">
                <label class="text-muted-foreground mb-1 block text-xs">Time</label>
                <input
                    type="time"
                    :value="timeValue"
                    :class="[
                        'border-input bg-background h-9 w-full rounded-md border px-3 text-sm',
                        FOCUS_RING,
                    ]"
                    @change="onTimeChange"
                />
            </div>
        </div>

        <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />
    </div>
</template>
