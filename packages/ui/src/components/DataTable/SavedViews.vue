<script setup lang="ts">
/** A small local saved-view control for resource tables. */
export interface SavedTableView {
    name: string
    search: string
    filters: Record<string, unknown>
    sort: string
    direction: 'asc' | 'desc'
    perPage: number
    tab: string | null
    group: string | null
    lens: string | null
    hidden: string[]
    layout: 'table' | 'cards'
}

defineProps<{ views: SavedTableView[]; active?: string | null }>()

const emit = defineEmits<{
    (e: 'save', name: string): void
    (e: 'apply', view: SavedTableView): void
    (e: 'remove', name: string): void
}>()

function save(event: Event) {
    const form = event.currentTarget as HTMLFormElement
    const name = String(new FormData(form).get('name') ?? '').trim()

    if (!name) return

    emit('save', name)
    form.reset()
}
</script>

<template>
    <details class="group/saved relative shrink-0">
        <summary
            class="pk-focus-ring inline-flex min-h-9 cursor-pointer list-none items-center gap-1.5 rounded-md border px-2.5 text-sm text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden"
            aria-label="Saved table views"
        >
            Views
            <span v-if="active" class="max-w-28 truncate text-xs text-foreground">{{
                active
            }}</span>
            <span aria-hidden="true">⌄</span>
        </summary>

        <div
            class="bg-popover text-popover-foreground absolute top-full left-0 z-30 mt-2 w-72 rounded-lg border p-2 shadow-xl"
        >
            <form class="flex gap-2 border-b pb-2" @submit.prevent="save">
                <label class="sr-only" for="pk-save-view">View name</label>
                <input
                    id="pk-save-view"
                    name="name"
                    class="pk-control min-w-0 flex-1 px-2 text-sm"
                    placeholder="Save current view…"
                    maxlength="40"
                />
                <button
                    type="submit"
                    class="pk-focus-ring rounded-md bg-primary px-2.5 text-xs text-primary-foreground"
                >
                    Save
                </button>
            </form>

            <div v-if="views.length" class="mt-1 max-h-56 overflow-y-auto">
                <div
                    v-for="view in views"
                    :key="view.name"
                    class="flex items-center gap-1 rounded-md px-1 hover:bg-muted"
                >
                    <button
                        type="button"
                        class="pk-focus-ring min-w-0 flex-1 truncate rounded px-2 py-1.5 text-left text-sm"
                        :class="view.name === active ? 'font-medium text-primary' : ''"
                        @click="emit('apply', view)"
                    >
                        {{ view.name }}
                    </button>
                    <button
                        type="button"
                        class="pk-focus-ring rounded px-2 py-1 text-xs text-muted-foreground hover:text-destructive"
                        :aria-label="`Delete saved view ${view.name}`"
                        @click="emit('remove', view.name)"
                    >
                        ×
                    </button>
                </div>
            </div>
            <p v-else class="px-2 py-3 text-xs text-muted-foreground">
                Save filters, columns, and layout for quick reuse.
            </p>
        </div>
    </details>
</template>
