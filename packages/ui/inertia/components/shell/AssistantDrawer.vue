<script setup lang="ts">
/**
 * The assistant, as a drawer over whatever you are already looking at.
 *
 * IT WAS A PAGE AND THAT WAS THE WRONG SHAPE. Asking "is Grace's line active?"
 * is something you do WHILE looking at a list, a form, an invoice - and a
 * dedicated page answers it by throwing that context away. You navigate off the
 * screen you were working on, get an answer, and come back to find your filters,
 * your scroll position and your half-typed form gone.
 *
 * THE HISTORY IS THE OTHER HALF, and its absence made the whole thing feel
 * disposable. Every conversation was already stored, tenant-scoped and linked to
 * the person who had it - and the only route back to one was to not close the
 * drawer. Somebody who got a good answer on Monday could not find it on Tuesday.
 * The list is one panel over, and switching to a thread replays it with its tool
 * calls intact, because an answer without its lookups is one nobody can check.
 *
 * THE TRANSCRIPT SURVIVES CLOSING. Somebody asks a question, closes the drawer
 * to look at the record it named, and opens it again to ask the follow-up - and
 * a conversation that reset in between would make the second question
 * unanswerable ("that one" refers to nothing).
 *
 * ON THE LOOK: messages are sided and tinted rather than stacked in one column,
 * because the first thing you do returning to a thread is find where you last
 * spoke. Tool calls are inline chips above the answer, in the order they
 * happened - seeing WHICH record was fetched is what makes a wrong answer
 * catchable, and once the conclusion is on screen nobody re-checks the premise.
 *
 * The streaming is `fetch` and a reader rather than `EventSource`, because the
 * browser's own SSE client can only issue a GET and this posts a message body.
 */
import {
    ArrowLeft,
    History,
    MessageSquarePlus,
    Send,
    Sparkles,
    Square,
    TriangleAlert,
    Wrench,
    X,
} from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { PkSkeleton } from '@alxtexh-enterprise/panel'
import { PkButton as Button } from '@alxtexh-enterprise/panel'

interface Turn {
    role: 'you' | 'assistant'
    text: string
    /** Tool names, in the order they were called, for an assistant turn. */
    tools: string[]
    error?: string
}

interface PastConversation {
    id: string
    title: string
    at: string | null
}

const open = ref(false)
const showHistory = ref(false)
const turns = ref<Turn[]>([])
const draft = ref('')
const streaming = ref(false)
const past = ref<PastConversation[]>([])
const loadingHistory = ref(false)

const page = usePage()
const panelBase = computed(() => (page.props.panel as { path?: string } | undefined)?.path ?? '')
const at = (path: string) => `${panelBase.value === '/' ? '' : panelBase.value}${path}`

/**
 * Carried, not remembered server-side.
 *
 * A "current conversation" held on the server would be ambient state shared
 * between two tabs, and the second tab would silently append to the first one's
 * history.
 */
const conversation = ref<string | null>(null)

const transcript = useTemplateRef<HTMLElement>('transcript')
const input = useTemplateRef<HTMLTextAreaElement>('input')

/**
 * The in-flight request, so it can be stopped.
 *
 * An assistant answering at length from a wrong premise is exactly what somebody
 * wants to interrupt; without this the only way out is closing the drawer, which
 * leaves the request running and still being billed.
 */
let controller: AbortController | null = null

const empty = computed(() => turns.value.length === 0)

async function scrollDown() {
    await nextTick()
    transcript.value?.scrollTo({
        top: transcript.value.scrollHeight,
        behavior: 'smooth',
    })
}

function stop() {
    controller?.abort()
    controller = null
    streaming.value = false
}

/** A fresh conversation, not a fresh drawer - the panel behind it is untouched. */
function reset() {
    stop()
    turns.value = []
    conversation.value = null
    draft.value = ''
    showHistory.value = false
    nextTick(() => input.value?.focus())
}

function close() {
    open.value = false
}

/* ------------------------------------------------------------------ history */

async function loadHistory() {
    showHistory.value = true
    loadingHistory.value = true

    try {
        const response = await fetch(at('/apps/assistant/conversations'), {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        })

        if (!response.ok) {
            throw new Error('history')
        }

        past.value = (await response.json()).conversations ?? []
    } catch {
        // An unreachable history is not worth an error dialog over the top of a
        // working chat; the list simply stays empty and says so.
        past.value = []
    } finally {
        loadingHistory.value = false
    }
}

async function openConversation(id: string) {
    stop()
    loadingHistory.value = true

    try {
        const response = await fetch(at(`/apps/assistant/conversations/${id}`), {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        })

        if (!response.ok) {
            throw new Error('conversation')
        }

        const payload = await response.json()

        turns.value = payload.turns ?? []
        conversation.value = payload.id
        showHistory.value = false

        await scrollDown()
    } catch {
        showHistory.value = false
    } finally {
        loadingHistory.value = false
    }
}

/*
 * CLOSING DOES NOT CANCEL. A long answer is still worth having when the drawer
 * is reopened, and aborting on close would waste tokens already paid for. The
 * only thing that stops a stream is Stop.
 */
watch(open, async (isOpen) => {
    if (!isOpen) {
        return
    }

    await nextTick()
    input.value?.focus()
    await scrollDown()
})

/** Escape closes the history first, then the drawer - innermost thing first. */
function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !open.value) {
        return
    }

    if (showHistory.value) {
        showHistory.value = false

        return
    }

    close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

/* ------------------------------------------------------------------ sending */

async function send() {
    const message = draft.value.trim()

    if (message === '' || streaming.value) {
        return
    }

    draft.value = ''
    showHistory.value = false
    turns.value.push({ role: 'you', text: message, tools: [] })

    const reply: Turn = { role: 'assistant', text: '', tools: [] }
    turns.value.push(reply)

    streaming.value = true
    controller = new AbortController()

    await scrollDown()

    try {
        const response = await fetch(at('/apps/assistant/stream'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
                'X-CSRF-TOKEN':
                    document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ??
                    '',
            },
            body: JSON.stringify({ message, conversation: conversation.value }),
            signal: controller.signal,
        })

        if (!response.ok || !response.body) {
            reply.error = 'The assistant could not be reached.'

            return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        for (;;) {
            const { done, value } = await reader.read()

            if (done) {
                break
            }

            buffer += decoder.decode(value, { stream: true })

            /*
             * FRAMES ARE SEPARATED BY A BLANK LINE and a chunk can end mid-frame,
             * so the tail stays in the buffer. Parsing whatever arrived as if it
             * were whole produces a JSON error on a perfectly good stream - and
             * only under load, when chunks get split.
             */
            const frames = buffer.split('\n\n')
            buffer = frames.pop() ?? ''

            for (const frame of frames) {
                const line = frame.replace(/^data: /, '').trim()

                if (line === '') {
                    continue
                }

                const event = JSON.parse(line)

                if (event.type === 'delta') {
                    reply.text += event.text
                } else if (event.type === 'tool') {
                    reply.tools.push(event.name)
                } else if (event.type === 'error') {
                    reply.error = event.message
                } else if (event.type === 'done') {
                    conversation.value = event.conversation ?? conversation.value
                }

                await scrollDown()
            }
        }
    } catch (e) {
        // An abort is the operator stopping it, not a failure - saying "the
        // assistant failed" when somebody pressed Stop is the interface
        // misreporting its own state.
        if ((e as Error).name !== 'AbortError') {
            reply.error = 'The connection dropped part-way through that answer.'
        }
    } finally {
        streaming.value = false
        controller = null
    }
}

/** `find_subscriber` reads as a log line rather than as something happening. */
const toolLabel = (name: string) => name.replace(/[-_]/g, ' ')

/*
 * NO SUGGESTION NAMES A RECORD, and that is the whole of this list's design.
 *
 * The first one used to read "Is Grace Wanjiku's line active?" - a name written
 * by hand against seed data that has since changed. There is no Grace Wanjiku in
 * this database. So the headline example on the screen that exists to show the
 * assistant working asked it about somebody who is not there, and answered
 * "not found".
 *
 * A CLICKABLE SUGGESTION IS A PROMISE that the thing will work. One built from
 * a literal that only matches a particular seed run is a promise with an expiry
 * date nobody wrote down, and it expires silently - the chip still renders, and
 * only the answer is wrong.
 *
 * Each of these is answerable against ANY data: two search the records the
 * signed-in person may see, one reads the help centre. If the panel is empty
 * they return nothing, which is the truth rather than a miss.
 */
const suggestions = [
    { text: 'Which records are suspended?', hint: 'Searches your own records' },
    { text: 'Who expires this week?', hint: 'Searches your own records' },
    { text: 'How do exports work?', hint: 'Answers from the help centre' },
]

function ask(question: string) {
    draft.value = question
    send()
}
</script>

<template>
    <button
        type="button"
        class="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        :class="open ? 'bg-accent text-foreground' : ''"
        aria-label="Assistant"
        title="Assistant"
        :aria-expanded="open"
        @click="open = !open"
    >
        <Sparkles class="size-4" />
    </button>

    <!--
        TELEPORTED TO THE BODY. Rendered in place it would sit inside the
        topbar's stacking context, where a sticky table header or the sidebar can
        paint over it - an overlay that is sometimes behind things is worse than
        no overlay.
    -->
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-150"
            leave-active-class="transition-opacity duration-150"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
        >
            <div
                v-if="open"
                class="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
                @click="close"
            />
        </Transition>

        <Transition
            enter-active-class="transition-transform duration-200 ease-out"
            leave-active-class="transition-transform duration-150 ease-in"
            enter-from-class="translate-x-full"
            leave-to-class="translate-x-full"
        >
            <aside
                v-if="open"
                class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background text-foreground shadow-2xl sm:inset-y-2 sm:right-2 sm:rounded-xl sm:border"
                role="dialog"
                aria-label="Assistant"
            >
                <!--
                    THE HEADER CARRIES THE TINT, not the whole panel. A drawer
                    that is entirely accented competes with the page it sits over;
                    a band at the top says which surface you are on and leaves the
                    conversation to read as text.
                -->
                <header
                    class="relative flex items-start justify-between gap-3 rounded-t-xl bg-gradient-to-br from-primary/10 to-transparent px-4 py-3.5"
                >
                    <div class="flex min-w-0 items-start gap-2.5">
                        <span
                            class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
                        >
                            <Sparkles class="size-4" />
                        </span>

                        <div class="min-w-0">
                            <h2 class="text-sm font-semibold">Assistant</h2>
                            <p class="mt-0.5 text-xs leading-snug text-muted-foreground">
                                Your records, and how the panel works. Anything that changes data
                                pauses for your approval.
                            </p>
                        </div>
                    </div>

                    <div class="flex shrink-0 items-center gap-0.5">
                        <button
                            type="button"
                            class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground"
                            :class="showHistory ? 'bg-background/70 text-foreground' : ''"
                            aria-label="Previous conversations"
                            title="Previous conversations"
                            @click="showHistory ? (showHistory = false) : loadHistory()"
                        >
                            <History class="size-4" />
                        </button>
                        <button
                            type="button"
                            class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground"
                            aria-label="New conversation"
                            title="New conversation"
                            @click="reset"
                        >
                            <MessageSquarePlus class="size-4" />
                        </button>
                        <button
                            type="button"
                            class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground"
                            aria-label="Close"
                            @click="close"
                        >
                            <X class="size-4" />
                        </button>
                    </div>
                </header>

                <!-- ------------------------------------------------ history -->

                <div v-if="showHistory" class="flex min-h-0 flex-1 flex-col">
                    <div class="flex items-center gap-2 border-y px-4 py-2">
                        <button
                            type="button"
                            class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                            @click="showHistory = false"
                        >
                            <ArrowLeft class="size-3.5" />
                            Back to the conversation
                        </button>
                    </div>

                    <div class="flex-1 overflow-y-auto p-2">
                        <PkSkeleton
                            v-if="loadingHistory"
                            variant="text"
                            :count="4"
                            label="Loading your conversations"
                            class="p-2"
                        />

                        <p
                            v-else-if="past.length === 0"
                            class="p-4 text-center text-sm text-muted-foreground"
                        >
                            Nothing here yet. Conversations appear once you have had one.
                        </p>

                        <button
                            v-for="item in past"
                            :key="item.id"
                            type="button"
                            class="flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
                            :class="conversation === item.id ? 'bg-accent' : ''"
                            @click="openConversation(item.id)"
                        >
                            <span class="truncate text-sm">{{ item.title }}</span>
                            <span v-if="item.at" class="text-xs text-muted-foreground font-normal">
                                {{ item.at }}
                            </span>
                        </button>
                    </div>
                </div>

                <!-- --------------------------------------------- transcript -->

                <template v-else>
                    <div ref="transcript" class="flex-1 overflow-y-auto px-4 py-4">
                        <!--
                            THE EMPTY STATE OFFERS QUESTIONS RATHER THAN A PROMPT.
                            "Ask me anything" says nothing about what this one can
                            do, and the first question people try is usually the
                            one it cannot answer. Each card says what it will do.
                        -->
                        <div v-if="empty" class="flex flex-col gap-4 py-6">
                            <div class="flex flex-col items-center gap-1.5 text-center">
                                <span
                                    class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                                >
                                    <Sparkles class="size-5" />
                                </span>
                                <p class="text-sm font-medium">What would you like to know?</p>
                                <p class="text-xs text-muted-foreground font-normal">
                                    It can look records up and cite the help centre.
                                </p>
                            </div>

                            <div class="flex flex-col gap-1.5">
                                <button
                                    v-for="s in suggestions"
                                    :key="s.text"
                                    type="button"
                                    class="group flex flex-col gap-0.5 rounded-lg border px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-accent/50"
                                    @click="ask(s.text)"
                                >
                                    <span class="text-sm">{{ s.text }}</span>
                                    <span class="text-xs text-muted-foreground font-normal">{{
                                        s.hint
                                    }}</span>
                                </button>
                            </div>

                            <!--
                                THE CHARTER, ONE CLICK AWAY - E.3. The full
                                statement of what it can and cannot do is a
                                help article, which also makes it the one
                                thing the assistant can always cite about
                                itself.
                            -->
                            <p class="text-center text-xs text-muted-foreground">
                                It acts with your permissions and asks before changing anything.
                                <a
                                    href="/help#assistant-charter"
                                    class="underline underline-offset-2 hover:text-foreground"
                                >
                                    What it can and cannot do
                                </a>
                            </p>
                        </div>

                        <div v-else class="flex flex-col gap-4">
                            <div
                                v-for="(turn, i) in turns"
                                :key="i"
                                class="flex flex-col gap-1"
                                :class="turn.role === 'you' ? 'items-end' : 'items-start'"
                            >
                                <!--
                                    TOOL CALLS COME FIRST, above the answer,
                                    because that is the order they happened in
                                    and because seeing which record was fetched is
                                    what makes a wrong answer catchable.
                                -->
                                <div v-if="turn.tools.length" class="mb-0.5 flex flex-wrap gap-1">
                                    <span
                                        v-for="(tool, t) in turn.tools"
                                        :key="t"
                                        class="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                                    >
                                        <Wrench class="size-3" />
                                        {{ toolLabel(tool) }}
                                    </span>
                                </div>

                                <div
                                    class="max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap"
                                    :class="
                                        turn.role === 'you'
                                            ? 'rounded-br-sm bg-primary text-primary-foreground'
                                            : 'rounded-bl-sm bg-muted'
                                    "
                                >
                                    <template v-if="turn.text">{{ turn.text }}</template>

                                    <!-- Only while nothing has arrived: once text
                                         is streaming it is its own progress. -->
                                    <PkSkeleton
                                        v-else-if="
                                            streaming && i === turns.length - 1 && !turn.error
                                        "
                                        variant="text"
                                        :count="2"
                                        label="The assistant is answering"
                                    />

                                    <span v-else-if="turn.error" class="sr-only">Failed</span>
                                </div>

                                <p
                                    v-if="turn.error"
                                    class="flex items-start gap-1.5 text-xs text-destructive"
                                >
                                    <TriangleAlert class="mt-0.5 size-3.5 shrink-0" />
                                    {{ turn.error }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form class="flex items-end gap-2 border-t p-3" @submit.prevent="send">
                        <div
                            class="flex flex-1 items-end rounded-xl border bg-muted/40 px-3 py-2 transition-colors focus-within:border-primary/40"
                        >
                            <textarea
                                ref="input"
                                v-model="draft"
                                rows="1"
                                placeholder="Ask about a record…"
                                class="max-h-32 min-h-6 flex-1 resize-none bg-transparent text-sm outline-none"
                                :disabled="streaming"
                                @keydown.enter.exact.prevent="send"
                            />
                        </div>

                        <!-- Stop replaces Send while streaming rather than
                             sitting beside it: two buttons where only one can do
                             anything is a choice nobody has to make. -->
                        <Button
                            v-if="streaming"
                            type="button"
                            variant="outline"
                            size="icon"
                            @click="stop"
                        >
                            <Square class="size-4" />
                            <span class="sr-only">Stop</span>
                        </Button>

                        <Button v-else type="submit" size="icon" :disabled="!draft.trim()">
                            <Send class="size-4" />
                            <span class="sr-only">Send</span>
                        </Button>
                    </form>
                </template>
            </aside>
        </Transition>
    </Teleport>
</template>
