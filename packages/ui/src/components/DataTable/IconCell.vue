<script setup lang="ts">
/**
 * A value rendered as an icon.
 *
 * THE ICON SET LIVES HERE, keyed by the semantic names PHP emits. That is the
 * whole point of the split: the schema says `check`, this file decides what a
 * check looks like, and swapping icon libraries never touches a PHP file.
 *
 * EVERY ICON CARRIES TEXT. An icon-only cell is unreadable to a screen reader
 * and merely guessable to a sighted user who has not learned the convention, so
 * each renders a `<title>` for the tooltip and an aria-label for assistive
 * technology. An unlabelled tick in a table is a puzzle, not information.
 *
 * A value with no mapping falls back to a neutral dot rather than rendering
 * nothing - an empty cell reads as missing data, which is a different claim
 * from "this value is not one we colour".
 */
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        value: unknown
        icons?: Record<string, string>
        colors?: Record<string, string>
        labels?: Record<string, string>
        defaultIcon?: string
    }>(),
    {
        icons: () => ({}),
        colors: () => ({}),
        labels: () => ({}),
        defaultIcon: 'dot',
    },
)

/** SVG path data only - the wrapper supplies size, stroke and colour. */
const PATHS: Record<string, string> = {
    check: 'M20 6 9 17l-5-5',
    x: 'M18 6 6 18M6 6l12 12',
    dot: 'M12 12h.01',
    wifi: 'M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M12 20h.01M2 8.8a15 15 0 0 1 20 0',
    'wifi-off':
        'M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.6M2 8.8a15 15 0 0 1 4.2-2.5M22 8.8a15 15 0 0 0-6-3.4M12 20h.01',
    alert: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
    clock: 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
    star: 'm12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z',
    pause: 'M10 4v16M14 4v16',
}

const TONES: Record<string, string> = {
    success: 'text-emerald-600 dark:text-emerald-400',
    danger: 'text-rose-600 dark:text-rose-400',
    warning: 'text-amber-600 dark:text-amber-400',
    neutral: 'text-muted-foreground',
}

/**
 * Booleans arrive as `true`, `1` or `"1"` depending on the driver, and their
 * falsy counterparts likewise. Both collapse to the two keys PHP maps
 * against - `IconColumn::boolean()`/`IconEntry::boolean()` both say so in
 * their own docblocks, but only the truthy half of that promise was ever
 * implemented: `0` and `"0"` fell through to `String(props.value)` below,
 * producing the lookup key `"0"` - which matches neither `boolean()`'s `'1'`
 * key nor its `''` false key, so the icon/color/label all missed and the
 * cell rendered the literal text "0".
 *
 * CONFIRMED LIVE: a Product's View page, `active` cast to `boolean` on the
 * model, still arrives at the client as a raw `0` - `ResourceController::
 * show()` reads the record through `ListQuery::find()`, which drops to
 * `Builder::toBase()` for the joined-column select and returns an
 * uncast `stdClass` row, not a hydrated Eloquent model. That is a separate,
 * deeper architectural trade-off (`toBase()` is there so a list of
 * thousands of rows does not hydrate a model per row) - not something to
 * unwind here. This fix instead makes the CLIENT actually keep the promise
 * its own docblock already made: normalise every falsy/truthy shape a
 * boolean column can arrive in, whichever layer sent it raw.
 */
const lookup = computed(() => {
    if (props.value === null || props.value === undefined) {
        return ''
    }

    if (props.value === false || props.value === 0 || props.value === '0') {
        return ''
    }

    if (props.value === true || props.value === 1 || props.value === '1') {
        return '1'
    }

    return String(props.value)
})

const icon = computed(() => props.icons[lookup.value] ?? props.defaultIcon)
const path = computed(() => PATHS[icon.value] ?? PATHS.dot)
const tone = computed(() => TONES[props.colors[lookup.value] ?? 'neutral'] ?? TONES.neutral)
const label = computed(() => props.labels[lookup.value] ?? String(props.value ?? '-'))
</script>

<template>
    <span class="inline-flex items-center" :title="label">
        <svg
            viewBox="0 0 24 24"
            class="size-4"
            :class="tone"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            role="img"
            :aria-label="label"
        >
            <path :d="path" />
        </svg>
        <span class="sr-only">{{ label }}</span>
    </span>
</template>
