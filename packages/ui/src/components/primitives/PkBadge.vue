<script setup lang="ts">
/**
 * A small piece of state, rendered as a pill.
 *
 * HERE FOR THE SAME REASON AS `PkButton` - the packaged resource screens show a
 * record's status and a trashed row's origin as badges, and those screens must
 * render in an application that has never run shadcn's installer. Same variant
 * names, same classes, no dependency.
 *
 * IT IS NOT A STATUS COLOUR MAP. A schema emits a colour INTENT - `success`,
 * `danger` - and the table's own badge column resolves that; this is the plain
 * pill used by hand-written markup around the table, and conflating the two
 * would put presentation decisions back inside the schema.
 */
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        variant?:
            'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
        /**
         * A tinted background with saturated text instead of a solid fill.
         *
         * FOR DENSE LISTS, NOT FOR A LONE BADGE. A single solid pill reads
         * fine next to a heading; a table where every row carries one reads
         * loud. `soft` is the calmer alternative for that case - `outline`
         * is unaffected, since it already has no fill to soften.
         */
        soft?: boolean
        class?: string
    }>(),
    { variant: 'default', soft: false },
)

const BASE =
    'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium ' +
    'w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden [&>svg]:size-3 [&>svg]:pointer-events-none'

/*
 * `success`/`warning`/`info` ARE FIXED, THE SAME WAY `destructive` ALREADY IS.
 * Their CSS vars are never touched by `appearanceVars()` or a tenant's brand
 * colour (see app.css) - a status pill is not a place a theme gets a vote.
 */
const VARIANTS: Record<string, string> = {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    destructive: 'border-transparent bg-destructive text-white dark:bg-destructive/60',
    outline: 'text-foreground',
    success: 'border-transparent bg-success text-success-foreground',
    warning: 'border-transparent bg-warning text-warning-foreground',
    info: 'border-transparent bg-info text-info-foreground',
}

/** Same colour intents as `VARIANTS`, tinted rather than filled. No entry for `outline`. */
const SOFT_VARIANTS: Record<string, string> = {
    default: 'border-transparent bg-primary/12 text-primary',
    secondary: 'border-transparent bg-secondary/70 text-secondary-foreground',
    destructive: 'border-transparent bg-destructive/12 text-destructive',
    success: 'border-transparent bg-success/15 text-success',
    warning: 'border-transparent bg-warning/15 text-warning',
    info: 'border-transparent bg-info/15 text-info',
}

const classes = computed(() => {
    const variant = props.soft
        ? (SOFT_VARIANTS[props.variant] ?? VARIANTS[props.variant])
        : VARIANTS[props.variant]

    return [BASE, variant, props.class].filter(Boolean).join(' ')
})
</script>

<template>
    <span data-slot="badge" :data-variant="variant" :class="classes">
        <slot />
    </span>
</template>
