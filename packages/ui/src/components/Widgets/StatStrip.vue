<script setup lang="ts">
import { computed, ref } from 'vue'
import PkSkeleton from '../primitives/PkSkeleton.vue'
import Sparkline from './Sparkline.vue'
import TrendBadge from './TrendBadge.vue'
/**
 * One card, split into metric segments.
 *
 * WHY THIS IS NOT A ROW OF CARDS. Four separate cards say "four things"; one
 * card split by hairlines says "one thing, measured four ways" - which is what
 * a set of windows over the same metric actually is. The segments here are
 * meant to share a subject, and the container is what asserts that.
 *
 * THE DIVIDERS ARE GAPS, NOT BORDERS, and that is what makes it work on a
 * phone. A bordered variant has to know which edge to draw on, which changes
 * with the column count, so every breakpoint needs its own set of rules and a
 * `last:` exception to stop a trailing line. A `gap-px` grid over a coloured
 * background draws the hairlines wherever cells happen to meet - four across on
 * a desktop, two-by-two on a phone - with no per-breakpoint rules at all and no
 * edge line to suppress.
 *
 * ONE SWITCH FOR THE WHOLE STRIP, and it starts CLOSED.
 *
 * The eye covers every sensitive segment at once, because putting a strip back
 * the way it was should be one click rather than four - and hidden is the state
 * anyone who wanted it hidden wants again a minute later. Starting hidden is the
 * same argument from the other end: a strip that opens revealed has already
 * shown the number by the time you decide you did not want it shown.
 *
 * WHICH SEGMENTS ARE SENSITIVE IS DECLARED, NOT ASSUMED.
 *
 * This used to mask all four or none, on the reasoning that a strip is one
 * metric over four windows, so covering "this month" while "last 7 days" shows
 * hides nothing. That is true of THAT strip and is not a property of the
 * component: a strip pairing revenue with a device count has one cell worth
 * covering and three that are noise to cover. `sensitive` on a segment says
 * which is which, and the default is every segment - so a strip that declares
 * nothing behaves exactly as it always did.
 *
 * THE VALUE ITSELF IS THE CONTROL, not only the eye. Reaching for a 16px icon
 * in the corner to read the cell you are already looking at is a detour; the
 * dots are a button, and clicking them reveals that one cell. Clicking it again
 * puts it back. The eye remains the way to do all of them at once.
 *
 * THE MASK IS PRESENTATIONAL, NOT A SECURITY BOUNDARY. The value is in the DOM
 * either way; this is shoulder-surfing courtesy. Anything that must not reach
 * the browser must not be sent to it.
 */

export interface StatSegment {
    key: string
    label: string
    value: string | number
    /** Small muted line under the value. */
    caption?: string | null
    /**
     * Whether this cell is one of the ones worth covering.
     *
     * OMITTED MEANS SENSITIVE. The alternative default - "cover nothing unless
     * asked" - turns every existing strip into one that shows its numbers
     * immediately, which is the exact failure the closed-by-default rule exists
     * to prevent, and it would happen silently on upgrade.
     */
    sensitive?: boolean

    /**
     * THE DECORATIONS A `StatCard` CARRIES, so the joined strip can be the
     * default presentation without costing anything to switch to it.
     *
     * The strip used to show a label and a number and nothing else, which was
     * fine while it was only used for the four figures above a dashboard. Once
     * `stats()` renders through here, that omission would silently drop the
     * trend badge, the sparkline and the comparison line from every panel -
     * a redesign that quietly removes information is the worst kind.
     *
     * ALL OPTIONAL, so every strip that existed before this renders unchanged.
     */
    trend?: {
        direction: 'up' | 'down' | 'flat' | 'new'
        percentage: number | null
    } | null
    sparkline?: { label: string; value: number }[] | null
    /** What the trend is measured against, e.g. "vs previous 30 days". */
    comparison?: string | null
    /** True when a DECREASE is the good outcome. */
    inverted?: boolean
    /** The value could not be resolved; the cell says so rather than lying. */
    error?: boolean
}

const props = withDefaults(
    defineProps<{
        segments: StatSegment[]
        /**
         * Columns at the widest breakpoint.
         *
         * It never falls below TWO. A strip is a comparison, and a single
         * column stops being one - four stacked cells read as four unrelated
         * numbers you have to scroll between, which is the row of separate
         * cards this exists to avoid. Two-by-two keeps every value on screen
         * together on a phone.
         */
        columns?: 2 | 3 | 4 | 5 | 6
        /** Offer the reveal control at all. */
        maskable?: boolean
        /** Whether the strip starts masked. Hidden unless told otherwise. */
        hidden?: boolean
        loading?: boolean
    }>(),
    { columns: 4, maskable: true, hidden: true, loading: false },
)

const emit = defineEmits<{ (e: 'toggle', hidden: boolean): void }>()

/*
 * Local state seeded once, deliberately NOT synced to the prop afterwards.
 *
 * The values refresh - a poll, a filter change, a partial reload - and a strip
 * that re-hid itself every time fresh numbers arrived would fight whoever just
 * chose to look at them.
 */
const revealAll = ref(props.maskable ? !props.hidden : true)

/** Cells opened one at a time, by clicking the cell rather than the eye. */
const revealed = ref(new Set<string>())

/** A segment nobody asked to cover is still covered - see `sensitive`. */
function isSensitive(segment: StatSegment): boolean {
    return props.maskable && (segment.sensitive ?? true)
}

function isMasked(segment: StatSegment): boolean {
    return isSensitive(segment) && !revealAll.value && !revealed.value.has(segment.key)
}

/** Whether the eye currently offers "show" rather than "hide". */
const anyMasked = computed(() => props.segments.some(isMasked))

/*
 * NO EYE WHEN THERE IS NOTHING TO COVER. A strip whose every segment declares
 * `sensitive: false` would otherwise carry a control that toggles nothing.
 */
const hasSensitive = computed(() => props.segments.some(isSensitive))

/*
 * Tailwind resolves class names at build time from source text, so the column
 * count cannot be interpolated - `grid-cols-${n}` produces a class that was
 * never generated and silently renders one column. The map keeps every variant
 * spelled out where the compiler can see it.
 */
const COLUMNS: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
}

const grid = computed(() => COLUMNS[props.columns] ?? COLUMNS[4])

/**
 * Complete rows stay a joined strip. The leftover cards on an incomplete last
 * row are independent: same column track, no full-width empty grey band.
 */
const packed = computed(() => {
    const cols = props.columns ?? 4
    const complete = Math.floor(props.segments.length / cols) * cols

    return props.segments.slice(0, complete)
})

const leftover = computed(() => {
    const cols = props.columns ?? 4
    const complete = Math.floor(props.segments.length / cols) * cols

    return props.segments.slice(complete)
})

const stripRows = computed(() => {
    const rows: { key: string; joined: boolean; segments: StatSegment[] }[] = []

    if (packed.value.length > 0) {
        rows.push({ key: 'packed', joined: true, segments: packed.value })
    }

    if (leftover.value.length > 0) {
        rows.push({ key: 'leftover', joined: false, segments: leftover.value })
    }

    return rows
})

/**
 * The eye: all of them, in one click, in whichever direction is not already
 * true. Individually-opened cells are forgotten either way, so "hide" really
 * does hide everything rather than leaving the one cell somebody opened.
 */
function toggle() {
    const hide = anyMasked.value === false

    revealAll.value = !hide
    revealed.value = new Set()

    emit('toggle', hide)
}

/**
 * One cell, by clicking the cell.
 *
 * A NEW SET RATHER THAN A MUTATION, because Vue's reactivity does not track
 * `Set.add` on a plain ref - mutating in place changes the data and never
 * re-renders, which looks like a dead click.
 */
function toggleSegment(segment: StatSegment) {
    if (!isSensitive(segment)) {
        return
    }

    const next = new Set(revealed.value)

    if (isMasked(segment)) {
        next.add(segment.key)
    } else {
        next.delete(segment.key)

        /*
         * Re-hiding one cell while the master switch says "all revealed" has to
         * drop the master switch, or this cell is instantly revealed again by
         * the rule above it. The other cells keep their state explicitly.
         */
        if (revealAll.value) {
            revealAll.value = false

            for (const other of props.segments) {
                if (other.key !== segment.key && isSensitive(other)) {
                    next.add(other.key)
                }
            }
        }
    }

    revealed.value = next
    emit('toggle', anyMasked.value)
}

function display(value: string | number): string {
    return typeof value === 'number' ? new Intl.NumberFormat().format(value) : value
}
</script>

<template>
    <!--
        `shrink-0` is load-bearing, not decoration.

        `overflow-hidden` is needed to keep the cells inside the rounded corners,
        but it also changes this element's automatic minimum size from `auto` to
        zero - that is the flexbox rule, not a quirk. Dropped into a flex column
        the strip was therefore squashed to its two border pixels and rendered as
        a hairline. It is fixed-height content and must never be the thing that
        gives way.

        The container also carries the divider colour; the cells sit on top of it
        in the card colour, and the 1px gaps between them are what shows through.
        Leftover cards skip that container so empty tracks stay transparent.
    -->
    <div
        class="flex flex-col gap-3"
        data-slot="stat-strip"
        :aria-busy="loading ? 'true' : undefined"
    >
        <div
            v-for="row in stripRows"
            :key="row.key"
            class="relative shrink-0"
            :class="row.joined ? 'bg-border overflow-hidden rounded-xl border shadow-sm' : ''"
            :data-slot="row.joined ? 'stat-packed' : 'stat-leftover'"
        >
            <!--
            One control, floated over the corner rather than given a header row
            of its own - a header would push the strip taller for a single
            button and break the flush, four-across look the whole component is
            for.
        -->
            <button
                v-if="maskable && hasSensitive && row.key === stripRows[0]?.key"
                type="button"
                class="text-muted-foreground hover:text-foreground absolute top-3 right-3 z-10 rounded p-1 transition-colors"
                :aria-pressed="anyMasked"
                :aria-label="anyMasked ? 'Show all values' : 'Hide all values'"
                :title="anyMasked ? 'Show all values' : 'Hide all values'"
                @click="toggle"
            >
                <!--
                Drawn inline rather than imported. This package carries no icon
                dependency on purpose (§4): it is the rendering layer, and
                pulling a whole icon set in for two glyphs would make every
                consumer install it.
            -->
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
                    <template v-if="anyMasked">
                        <path d="M10.7 6.2A9 9 0 0 1 12 6c5 0 9 4.5 9 6a12 12 0 0 1-2.2 3" />
                        <path d="M6.6 6.9A13 13 0 0 0 3 12c0 1.5 4 6 9 6a9 9 0 0 0 3.7-.8" />
                        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                        <path d="m3 3 18 18" />
                    </template>
                    <template v-else>
                        <path d="M3 12s3.6-6 9-6 9 6 9 6-3.6 6-9 6-9-6-9-6Z" />
                        <circle cx="12" cy="12" r="3" />
                    </template>
                </svg>
            </button>

            <div class="grid" :class="[row.joined ? 'gap-px' : 'gap-3', grid]">
                <div
                    v-for="segment in row.segments"
                    :key="segment.key"
                    class="bg-card flex min-w-0 flex-col gap-2 p-4 sm:p-5"
                    :class="row.joined ? '' : 'overflow-hidden rounded-xl border'"
                >
                    <p
                        class="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase"
                    >
                        {{ segment.label }}
                    </p>

                    <!--
                    The skeleton, the mask and the value all occupy the same
                    height, so a strip does not reflow as data lands or as it is
                    revealed - a row that jumps under the pointer is how you
                    click the wrong thing.
                -->
                    <div class="flex h-8 items-center">
                        <PkSkeleton v-if="loading" variant="number" />

                        <!--
                        `role="img"` IS LOAD-BEARING, not decoration. A plain
                        `<span>` has no accessible-name-supporting role, so
                        `aria-label` on it is dropped by assistive tech - the
                        five dots would announce as nothing at all rather than
                        "Active hidden". `role="img"` is what makes this one
                        thing with a text alternative, the same contract an
                        `<img alt="...">` has.
                    -->
                        <!--
                        THE DOTS ARE THE BUTTON. Clicking the cell you are
                        already looking at is shorter than travelling to an icon
                        in the corner, and it is the gesture people try first.
                        `aria-label` still carries the whole meaning, because
                        five dots announce as nothing on their own.
                    -->
                        <button
                            v-else-if="isMasked(segment)"
                            type="button"
                            class="hover:bg-muted/60 -mx-1 flex items-center gap-1.5 rounded px-1 py-1 transition-colors"
                            :aria-label="`${segment.label} hidden. Show it.`"
                            :title="`Show ${segment.label}`"
                            @click="toggleSegment(segment)"
                        >
                            <span
                                v-for="dot in 5"
                                :key="dot"
                                class="bg-muted-foreground/70 size-1.5 rounded-full"
                            ></span>
                        </button>

                        <!--
                        A REVEALED SENSITIVE CELL STAYS CLICKABLE, so the way
                        back is the way in. A cell that was never sensitive is
                        plain text - making it look pressable would promise a
                        behaviour it does not have.
                    -->
                        <button
                            v-else-if="isSensitive(segment)"
                            type="button"
                            class="hover:bg-muted/60 -mx-1 truncate rounded px-1 text-2xl font-semibold tabular-nums transition-colors"
                            :aria-label="`${segment.label}, ${display(segment.value)}. Hide it.`"
                            :title="`Hide ${segment.label}`"
                            @click="toggleSegment(segment)"
                        >
                            {{ display(segment.value) }}
                        </button>

                        <span v-else class="truncate text-2xl font-semibold tabular-nums">
                            {{ display(segment.value) }}
                        </span>

                        <!--
                        THE TREND SITS BESIDE THE NUMBER, not under it, so the
                        row keeps its fixed height. A badge on its own line
                        would make cells with a trend taller than cells without
                        and the strip would stop reading as one row.

                        HIDDEN WHILE MASKED, because a direction and a
                        percentage are most of what the mask is covering: "down
                        40%" tells the person behind you nearly as much as the
                        figure does.
                    -->
                        <TrendBadge
                            v-if="segment.trend && !loading && !isMasked(segment)"
                            :direction="segment.trend.direction"
                            :percentage="segment.trend.percentage"
                            :inverted="segment.inverted"
                            class="ml-2 shrink-0"
                        />
                    </div>

                    <!--
                    THE SPARKLINE IS THE LAST THING AND THE FIRST TO GO. It is
                    the least precise part of the cell, so it yields its space
                    to the value and the trend rather than competing with them -
                    and it is covered with them, since its shape carries the
                    same story the number does.
                -->
                    <Sparkline
                        v-if="segment.sparkline?.length && !loading && !isMasked(segment)"
                        :data="segment.sparkline"
                        :height="24"
                    />

                    <p
                        v-if="segment.caption || (segment.comparison && segment.trend)"
                        class="text-muted-foreground truncate text-xs"
                    >
                        {{ segment.caption ?? segment.comparison }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
