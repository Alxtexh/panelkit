<script setup lang="ts">
/**
 * Resource page identity: title + purpose, actions at the trailing edge.
 *
 * DESIGN_RULES rules 1 and 2: exactly two flex children (identity, actions),
 * primary last inside the actions slot. Title scale is deliberately larger than
 * section headings so the page names itself before the table or form does.
 *
 * Optional `#status` sits beside the title for a record badge (paid, draft)
 * without competing with the trailing actions.
 */
defineProps<{
    title: string
    /** One sentence for what this screen is for (resource purpose, subtitle). */
    purpose?: string | null
}>()
</script>

<template>
    <header data-slot="page-header" class="pk-section-heading flex flex-wrap items-start justify-between gap-3 pb-0.5">
        <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2.5">
                <h1 class="text-2xl font-semibold tracking-tight">{{ title }}</h1>
                <div v-if="$slots.status" class="flex items-center gap-2">
                    <slot name="status" />
                </div>
            </div>
            <p v-if="purpose" class="text-muted-foreground text-sm font-normal">{{ purpose }}</p>
        </div>

        <div v-if="$slots.actions" class="flex shrink-0 flex-wrap items-center gap-2">
            <slot name="actions" />
        </div>
    </header>
</template>
