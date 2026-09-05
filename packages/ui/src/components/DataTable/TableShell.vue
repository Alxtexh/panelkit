<script setup lang="ts">
/**
 * One card around everything a table is - DESIGN_RULES rule 4.
 *
 * Tabs, title band, toolbar (or the selection bar that replaces it), the rows
 * and the pagination used to render as four sibling cards with gaps between
 * them, each with its own border - so the controls read as separate widgets
 * that happened to be nearby rather than as parts of the object they act on.
 * This shell owns the ONE border, the rounding and the dividers; the bands
 * inside it own nothing but their content.
 *
 * THE ROWS BAND IS THE ONLY ONE THAT SCROLLS. The shell is a flex column
 * with the same hug-then-shrink sizing DataTable's root documents
 * (min-h-0 + shrink + grow-0): tabs, title, toolbar and pagination keep their
 * natural height, and the default slot - the table - shrinks and scrolls
 * when the page genuinely cannot hold it.
 *
 * SLOTS, NOT PROPS. The shell knows nothing about what a toolbar or a tab
 * strip is - Trash's list and a resource index share this frame while
 * filling it with entirely different controls. Relation managers put the
 * relation name and Add / View all in the title band so those actions live
 * inside the same card as the rows.
 *
 * `toolbarTint` softens the toolbar band while selection or reorder is
 * active, so the mode reads as a temporary state of the table card rather
 * than a second floating widget.
 */
withDefaults(
    defineProps<{
        toolbarTint?: 'none' | 'muted'
    }>(),
    { toolbarTint: 'none' },
)
</script>

<template>
    <div
        class="pk-surface flex min-h-0 w-full min-w-0 shrink grow-0 flex-col overflow-hidden rounded-xl shadow-[0_1px_2px_rgb(0_0_0/0.04),0_14px_32px_-24px_rgb(0_0_0/0.28)]"
    >
        <div v-if="$slots.tabs" class="shrink-0 border-b px-3 py-2.5 sm:px-4">
            <slot name="tabs" />
        </div>

        <div
            v-if="$slots.title"
            class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-3 py-2.5 sm:px-4"
        >
            <slot name="title" />
        </div>

        <div
            v-if="$slots.toolbar"
            class="shrink-0 border-b px-3 py-2.5 sm:px-4"
            :class="toolbarTint === 'muted' ? 'bg-muted/40' : ''"
        >
            <slot name="toolbar" />
        </div>

        <slot />

        <div v-if="$slots.pagination" class="shrink-0 border-t px-3 py-2.5 sm:px-4">
            <slot name="pagination" />
        </div>
    </div>
</template>
