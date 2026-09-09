<script setup lang="ts">
/**
 * Empty chat shell. Conversations and the open thread are props from ChatPage.
 *
 * Reuses kit `useLiveUpdates` when `live.driver` is not `none`.
 */
import { Head, router, usePage } from '@inertiajs/vue3'
import { computed, ref, watch } from 'vue'
import { PAGE_SHELL, useLiveUpdates } from '@alxtexh-enterprise/panel'
import type { LiveConfig } from '@alxtexh-enterprise/panel'

defineOptions({ inheritAttrs: false })

interface Conversation {
    id: number | string
    name: string
    preview?: string | null
    unread?: number
}

interface Message {
    id: number | string
    direction?: 'incoming' | 'outgoing'
    body: string
    at?: string | null
}

const props = withDefaults(
    defineProps<{
        pageHeading?: string
        pageDescription?: string | null
        search?: string
        selectedId?: number | string | null
        conversations?: Conversation[]
        thread?: { name?: string; status?: string; messages: Message[] } | null
        live?: LiveConfig
    }>(),
    {
        search: '',
        selectedId: null,
        conversations: () => [],
        thread: null,
        live: () => ({
            driver: 'none',
            intervalMs: 10_000,
            batchMs: 250,
            channel: null,
            events: [],
            pauseWhenHidden: true,
        }),
    },
)

const rows = ref<Record<string, unknown>[]>([])

watch(
    () => props.conversations,
    (next) => {
        rows.value = next.map((c) => ({ ...c }))
    },
    { immediate: true },
)

useLiveUpdates({
    config: props.live,
    rows,
    rowKey: 'id',
})

const list = computed(() => rows.value as unknown as Conversation[])

const page = usePage()

const indexHref = computed(() => {
    const url = String(page.url ?? '/apps/chat')
    const q = url.indexOf('?')

    return q === -1 ? url : url.slice(0, q)
})

/**
 * `ChatPage::data()` reads `id` (and `q`) straight off the query string, so
 * opening a conversation is a plain navigation - same shape EmailTemplates'
 * `openTemplate` and the playground's own Chat page already use.
 */
function openConversation(id: number | string) {
    router.get(
        indexHref.value,
        { id, q: props.search || undefined },
        { preserveState: true, preserveScroll: true },
    )
}
</script>

<template>
    <Head :title="pageHeading ?? 'Chat'" />

    <div :class="[PAGE_SHELL, 'flex flex-col gap-6']">
        <header class="space-y-1">
            <h1 class="text-2xl font-semibold tracking-tight">{{ pageHeading ?? 'Chat' }}</h1>
            <p v-if="pageDescription" class="text-sm text-muted-foreground font-normal">
                {{ pageDescription }}
            </p>
        </header>

        <div class="grid gap-6 sm:grid-cols-[16rem_1fr]">
            <aside class="space-y-2 text-sm">
                <p v-if="list.length === 0" class="text-muted-foreground">
                    No conversations. Override ChatPage::conversations() to load your store.
                </p>
                <button
                    v-for="item in list"
                    :key="String(item.id)"
                    type="button"
                    class="block w-full rounded-md px-2 py-1.5 text-left"
                    :class="
                        String(item.id) === String(selectedId)
                            ? 'bg-muted font-medium'
                            : 'hover:bg-muted/60'
                    "
                    @click="openConversation(item.id)"
                >
                    {{ item.name }}
                    <span v-if="item.preview" class="text-muted-foreground block truncate text-xs">
                        {{ item.preview }}
                    </span>
                </button>
            </aside>

            <section class="min-h-64 rounded-md border p-4">
                <p v-if="!thread" class="text-muted-foreground text-sm font-normal">
                    No thread open. Override ChatPage::thread() when a conversation is selected.
                </p>
                <div v-else class="space-y-3">
                    <p class="font-medium">{{ thread.name }}</p>
                    <p
                        v-if="thread.messages.length === 0"
                        class="text-muted-foreground text-sm font-normal"
                    >
                        No messages.
                    </p>
                    <p
                        v-for="message in thread.messages"
                        :key="String(message.id)"
                        class="text-sm"
                        :class="message.direction === 'outgoing' ? 'text-right' : ''"
                    >
                        {{ message.body }}
                    </p>
                </div>
            </section>
        </div>
    </div>
</template>
