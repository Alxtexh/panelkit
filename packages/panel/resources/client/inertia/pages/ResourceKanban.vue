<script setup lang="ts">
/**
 * Opt-in Kanban board for a resource that declared `Resource::board()`.
 *
 * Cards drag between columns. The move posts JSON to `moveUrl`; the page
 * updates local state on success so a drop does not need a full Inertia visit.
 */
import { Head, Link, router } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { PAGE_SHELL, PkEmptyState, PkPageHeader, buttonClasses } from '@alxtexh-enterprise/panel'

interface BoardCard {
    id: number | string
    title: string
    column: string
    description?: string | null
}

interface BoardColumn {
    value: string
    label: string
    cards: BoardCard[]
}

const props = withDefaults(
    defineProps<{
        schema: {
            key: string
            label: string
            labelPlural: string
        }
        board: {
            column: string
            columns: { value: string; label: string }[]
            title: string
            description: string | null
        }
        columns: BoardColumn[]
        can: { update: boolean }
        moveUrl: string
        indexUrl: string
        breadcrumbs?: { title: string; href?: string | null }[]
        /** Server hard cap on cards loaded for the board. */
        cardCap?: number
        /** True when matching rows exceed cardCap. */
        capped?: boolean
        /** Matching row count before the cap (may equal cards shown). */
        totalMatching?: number | null
    }>(),
    {
        cardCap: 500,
        capped: false,
        totalMatching: null,
    },
)

const columns = ref<BoardColumn[]>(
    props.columns.map((col) => ({
        ...col,
        cards: [...col.cards],
    })),
)

const draggingId = ref<string | number | null>(null)
const dragOverColumn = ref<string | null>(null)
const busy = ref(false)
const error = ref<string | null>(null)

const totalCards = computed(() => columns.value.reduce((n, col) => n + col.cards.length, 0))

const purpose = computed(() => {
    const base = `${totalCards.value} cards across ${columns.value.length} columns`

    if (props.capped) {
        return `${base}. Showing first ${props.cardCap}.`
    }

    return base
})

function onDragStart(card: BoardCard, event: DragEvent) {
    if (!props.can.update || busy.value) {
        event.preventDefault()

        return
    }

    draggingId.value = card.id
    event.dataTransfer?.setData('text/plain', String(card.id))

    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
    }
}

function onDragEnd() {
    draggingId.value = null
    dragOverColumn.value = null
}

function onColumnDragOver(columnValue: string, event: DragEvent) {
    if (draggingId.value === null) {
        return
    }

    event.preventDefault()
    dragOverColumn.value = columnValue
}

async function onColumnDrop(columnValue: string, event: DragEvent) {
    event.preventDefault()

    const id = draggingId.value
    draggingId.value = null
    dragOverColumn.value = null

    if (id === null || !props.can.update || busy.value) {
        return
    }

    let fromColumn: BoardColumn | undefined
    let card: BoardCard | undefined

    for (const col of columns.value) {
        const found = col.cards.find((c) => c.id === id)

        if (found) {
            fromColumn = col
            card = found
            break
        }
    }

    if (!card || !fromColumn || fromColumn.value === columnValue) {
        return
    }

    const previous = columns.value.map((col) => ({
        ...col,
        cards: [...col.cards],
    }))

    columns.value = columns.value.map((col) => {
        if (col.value === fromColumn!.value) {
            return { ...col, cards: col.cards.filter((c) => c.id !== id) }
        }

        if (col.value === columnValue) {
            return {
                ...col,
                cards: [...col.cards, { ...card!, column: columnValue }],
            }
        }

        return col
    })

    busy.value = true
    error.value = null

    try {
        const response = await fetch(props.moveUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN':
                    (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)
                        ?.content ?? '',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ id, column: columnValue }),
        })

        if (!response.ok) {
            columns.value = previous
            error.value = 'Could not move that card.'

            return
        }
    } catch {
        columns.value = previous
        error.value = 'Could not move that card.'
    } finally {
        busy.value = false
    }
}

function openRecord(card: BoardCard) {
    router.visit(`${props.indexUrl}/${card.id}`)
}

/**
 * A native HTML5 drag (dragstart -> drop elsewhere) does not fire `click` on
 * the source element, so this and dragging never fight over the same
 * gesture - only a plain click needed opening the card, the dblclick it
 * used to require was never discoverable.
 */
function onCardClick(card: BoardCard, event: MouseEvent) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
    }

    if ((window.getSelection()?.toString().length ?? 0) > 0) {
        return
    }

    openRecord(card)
}
</script>

<template>
    <Head :title="`${schema.labelPlural} board`" />

    <div :class="[PAGE_SHELL, 'flex min-h-0 flex-1 flex-col gap-4']">
        <PkPageHeader :title="`${schema.labelPlural} board`" :purpose="purpose">
            <template #actions>
                <Link :href="indexUrl" :class="buttonClasses({ variant: 'outline' })">
                    Table view
                </Link>
            </template>
        </PkPageHeader>

        <p
            v-if="capped"
            class="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground"
            role="status"
        >
            Showing first {{ cardCap }} cards
            <span v-if="totalMatching != null"> of {{ totalMatching }} matching </span>
            . Use the table view with filters to work beyond this cap.
        </p>

        <p v-if="error" class="text-destructive text-sm" role="alert">{{ error }}</p>

        <p v-if="busy" class="text-muted-foreground text-sm font-normal" aria-live="polite">
            Saving move...
        </p>

        <PkEmptyState
            v-if="totalCards === 0"
            title="No cards on this board"
            description="Records that match the board columns will appear here. Create one from the table view, or adjust filters."
            icon="package"
        >
            <template #actions>
                <Link :href="indexUrl" :class="buttonClasses()">Open table</Link>
            </template>
        </PkEmptyState>

        <div v-else class="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2">
            <section
                v-for="col in columns"
                :key="col.value"
                class="bg-muted/30 border-border flex w-72 shrink-0 flex-col rounded-lg border"
                :class="dragOverColumn === col.value ? 'ring-primary ring-2' : ''"
                @dragover="onColumnDragOver(col.value, $event)"
                @drop="onColumnDrop(col.value, $event)"
            >
                <header class="border-border flex items-center justify-between border-b px-3 py-2">
                    <h2 class="text-sm font-medium">{{ col.label }}</h2>
                    <span class="text-muted-foreground text-xs font-normal">{{
                        col.cards.length
                    }}</span>
                </header>

                <ul class="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
                    <li
                        v-for="card in col.cards"
                        :key="card.id"
                        class="bg-card border-border cursor-grab rounded-md border p-3 shadow-sm active:cursor-grabbing"
                        :class="draggingId === card.id ? 'opacity-40' : ''"
                        :draggable="can.update"
                        @dragstart="onDragStart(card, $event)"
                        @dragend="onDragEnd"
                        @click="onCardClick(card, $event)"
                    >
                        <p class="text-sm font-medium">{{ card.title || 'Untitled' }}</p>
                        <p
                            v-if="card.description"
                            class="text-muted-foreground mt-1 line-clamp-2 text-xs"
                        >
                            {{ card.description }}
                        </p>
                    </li>

                    <li
                        v-if="col.cards.length === 0"
                        class="text-muted-foreground px-2 py-6 text-center text-xs"
                    >
                        Drop cards here
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>
