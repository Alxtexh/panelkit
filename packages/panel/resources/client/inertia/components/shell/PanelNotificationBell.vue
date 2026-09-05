<script setup lang="ts">
/**
 * The topbar bell: alerts and notifications, kept apart.
 *
 * TWO TABS, NOT ONE LIST, because they answer different questions and support
 * different actions:
 *
 *   ALERTS  - what is wrong RIGHT NOW. Recomputed server-side on every open,
 *             no read state, nothing to dismiss. You clear an alert by fixing
 *             the condition.
 *   INBOX   - what HAPPENED, addressed to you. Persistent, has read state, and
 *             you delete it when you are done with it.
 *
 * THE BADGE COUNTS UNREAD NOTIFICATIONS ONLY. Counting alerts too would leave a
 * badge lit for as long as a condition persists - which trains people to ignore
 * the badge, and then they miss the notification that mattered.
 *
 * IT FETCHES WHEN OPENED, THEN POLLS ONLY WHILE OPEN. This gives realtime-capable
 * hosts a natural place to refresh after a push event, while installations that
 * have no broadcaster still receive new notifications without background work
 * in every open tab.
 *
 * THE ENDPOINT IS PANEL-PREFIXED, which is the one thing the reference app's
 * version could not do - it wrote `/notifications` in its own source, so a
 * portal mounted at `/reseller` asked the wrong panel and got the wrong bell.
 */
import { usePage } from '@inertiajs/vue3'
import { computed, onUnmounted, ref } from 'vue'
import { PkModal, PkSlideover } from '@alxtexh-enterprise/panel'
import {
    followNotificationAction,
    linkedNotificationActions,
    notificationActionIsPost,
} from '../../lib/notificationActions'
import type { NotificationAction } from '../../lib/notificationActions'

/*
 * INLINE, NOT IMPORTED. A type imported into `defineProps` makes the SFC
 * compiler resolve it ACROSS FILES, which it can only do by loading TypeScript
 * from the CONSUMING project - which is what broke the barrel import in 0.6.0.
 */
const props = withDefaults(
    defineProps<{
        /** Where the bell asks. Panel-prefixed by the server when omitted. */
        endpoint?: string
        /**
         * Which edge the panel slides from.
         *
         * A PROP RATHER THAN A READ OF THE APPEARANCE STORE, because a panel
         * whose sidebar sits on the right wants this opposite it - and that is
         * the application's arrangement to know, not this component's.
         */
        side?: 'left' | 'right'
    }>(),
    { endpoint: '', side: 'right' },
)

interface Alert {
    key: string
    severity: 'danger' | 'warning' | 'info'
    title: string
    body: string
    href: string | null
    count: number
}

interface Note {
    id: string
    title: string
    body: string
    href: string | null
    severity: string
    read: boolean
    at: string | null
    actions?: NotificationAction[]
}

const page = usePage()

const open = ref(false)
const tab = ref<'alerts' | 'inbox'>('alerts')
const loading = ref(false)
const alerts = ref<Alert[]>([])
const notifications = ref<Note[]>([])

/** Whether another page exists past what is currently loaded. */
const hasMore = ref(false)
const loadingMore = ref(false)
const notificationsPage = ref(1)
const confirmingClearAll = ref(false)
let pollTimer: ReturnType<typeof setInterval> | null = null

/**
 * Whether this person may write an announcement.
 *
 * FROM THE SERVER, WITH THE LIST, rather than assumed. Most people who open this
 * bell cannot create one, and a link that always 403s advertises a screen and
 * then refuses it.
 */
const canAnnounce = ref(false)

/**
 * Seeded from the page payload so the badge is right before anything is
 * fetched, then kept current by each open.
 */
const unread = ref<number>((page.props as any).notificationCount ?? 0)

const prefix = computed<string>(() => {
    const path = (page.props as any).panel?.path ?? '/'

    return path === '/' ? '' : `/${String(path).replace(/^\/|\/$/g, '')}`
})

const base = computed<string>(() => props.endpoint || `${prefix.value}/notifications`)

const TONES: Record<string, string> = {
    danger: 'text-rose-600 dark:text-rose-400 bg-rose-500/10',
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
    info: 'text-sky-600 dark:text-sky-400 bg-sky-500/10',
}

/**
 * The session cookie, for the writes.
 *
 * A BELL IS NOT A FORM, so there is no Inertia visit to carry the token. Laravel
 * reads `X-XSRF-TOKEN` from the encrypted cookie it already set, which is why
 * this needs no meta tag in the consuming project's layout.
 */
function csrf(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)

    return match ? decodeURIComponent(match[1]) : ''
}

async function send(url: string, method: string): Promise<void> {
    await fetch(url, {
        method,
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrf(),
        },
        credentials: 'same-origin',
    })
}

async function load(): Promise<void> {
    loading.value = true
    notificationsPage.value = 1

    try {
        const response = await fetch(base.value, {
            headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        })

        if (!response.ok) {
            throw new Error(String(response.status))
        }

        const data = await response.json()

        alerts.value = data.alerts ?? []
        notifications.value = data.notifications ?? []
        unread.value = data.unread ?? 0
        hasMore.value = data.hasMore === true
        canAnnounce.value = data.canAnnounce === true

        // Open on whichever tab has something to say. Landing on an empty
        // Alerts tab while three unread notifications sit behind it is the
        // panel hiding the thing you opened it for.
        tab.value = alerts.value.length === 0 && unread.value > 0 ? 'inbox' : 'alerts'
    } catch {
        // A failed load leaves the panel empty rather than showing stale alerts,
        // which would be worse: an alert list is a claim about NOW.
        alerts.value = []
        notifications.value = []
        hasMore.value = false
        canAnnounce.value = false
    } finally {
        loading.value = false
    }
}

/**
 * The next page, APPENDED rather than replacing what is already shown - a
 * "Load more" click that reset the scroll position back to the top would
 * lose the reader's place for the sake of ten more rows.
 */
async function loadMore(): Promise<void> {
    if (loadingMore.value || !hasMore.value) {
        return
    }

    loadingMore.value = true

    try {
        const response = await fetch(`${base.value}?page=${notificationsPage.value + 1}`, {
            headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        })

        if (!response.ok) {
            throw new Error(String(response.status))
        }

        const data = await response.json()

        notifications.value = [...notifications.value, ...(data.notifications ?? [])]
        hasMore.value = data.hasMore === true
        notificationsPage.value += 1
    } catch {
        // Leaves what is already on screen alone; the button simply stays put
        // to try again, rather than the inbox losing rows it had shown.
    } finally {
        loadingMore.value = false
    }
}

function show(): void {
    open.value = true
    void load()
    if (pollTimer === null) {
        pollTimer = setInterval(() => {
            if (open.value && !loading.value) {
                void load()
            }
        }, 30_000)
    }
}

onUnmounted(() => {
    if (pollTimer !== null) {
        clearInterval(pollTimer)
        pollTimer = null
    }
})

/*
 * THE COUNT MOVES BEFORE THE REQUEST DOES, in all three writes below. Marking a
 * notification read is not a decision the server can refuse, and waiting a round
 * trip to grey out a row makes a working bell feel broken.
 */
async function markRead(note: Note): Promise<void> {
    if (note.read) {
        return
    }

    note.read = true
    unread.value = Math.max(0, unread.value - 1)

    await send(`${base.value}/${note.id}/read`, 'POST')
}

async function markAllRead(): Promise<void> {
    notifications.value.forEach((n) => (n.read = true))
    unread.value = 0

    await send(`${base.value}/read-all`, 'POST')
}

async function remove(note: Note): Promise<void> {
    notifications.value = notifications.value.filter((n) => n.id !== note.id)

    if (!note.read) {
        unread.value = Math.max(0, unread.value - 1)
    }

    await send(`${base.value}/${note.id}`, 'DELETE')
}

/** The undo for `markRead` - set aside a note read by accident. */
async function markUnread(note: Note, event: Event): Promise<void> {
    event.stopPropagation()

    if (!note.read) {
        return
    }

    note.read = false
    unread.value += 1

    await send(`${base.value}/${note.id}/unread`, 'POST')
}

/**
 * Empties the inbox in one request. Confirmed, unlike every other write on
 * this panel - those undo in one click each; this one cannot.
 */
async function clearAll(): Promise<void> {
    if (notifications.value.length === 0) {
        return
    }

    confirmingClearAll.value = true
}

async function executeClearAll(): Promise<void> {
    confirmingClearAll.value = false

    notifications.value = []
    unread.value = 0
    hasMore.value = false

    await send(`${base.value}/clear`, 'DELETE')
}

function follow(href: string | null): void {
    if (!href) {
        return
    }

    open.value = false
    window.location.assign(href)
}

function openNote(note: Note): void {
    void markRead(note)
    follow(note.href)
}

function runNoteAction(note: Note, action: NotificationAction, event: Event): void {
    event.stopPropagation()
    void markRead(note)
    followNotificationAction(action)
}
</script>

<template>
    <button
        type="button"
        class="border-input bg-background hover:bg-accent hover:text-accent-foreground relative inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors"
        :aria-label="unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'"
        title="Alerts and notifications"
        data-notification-bell
        @click="show"
    >
        <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>

        <span
            v-if="unread > 0"
            class="bg-destructive absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
        >
            {{ unread > 99 ? '99+' : unread }}
        </span>
    </button>

    <PkSlideover
        :open="open"
        :side="side"
        title="Alerts &amp; notifications"
        size="md"
        :padded="false"
        @close="open = false"
    >
        <div class="flex flex-col">
            <div class="bg-muted/40 sticky top-0 z-10 flex gap-1 border-b p-1">
                <button
                    type="button"
                    class="flex-1 rounded-md px-3 py-1.5 text-sm transition-colors"
                    :class="
                        tab === 'alerts'
                            ? 'bg-background font-medium shadow-sm'
                            : 'text-muted-foreground'
                    "
                    @click="tab = 'alerts'"
                >
                    Alerts
                    <span v-if="alerts.length" class="text-muted-foreground">
                        ({{ alerts.length }})
                    </span>
                </button>

                <button
                    type="button"
                    class="flex-1 rounded-md px-3 py-1.5 text-sm transition-colors"
                    :class="
                        tab === 'inbox'
                            ? 'bg-background font-medium shadow-sm'
                            : 'text-muted-foreground'
                    "
                    @click="tab = 'inbox'"
                >
                    Inbox
                    <span v-if="unread" class="text-muted-foreground">({{ unread }})</span>
                </button>
            </div>

            <p v-if="loading" class="text-muted-foreground p-4 text-sm">Loading…</p>

            <!-- ALERTS: current conditions. Nothing to dismiss. -->
            <template v-else-if="tab === 'alerts'">
                <div
                    v-if="alerts.length === 0"
                    class="flex flex-col items-center gap-1 p-8 text-center"
                >
                    <p class="text-sm font-medium">Nothing needs attention</p>
                    <p class="text-muted-foreground text-xs font-normal">
                        Alerts appear here while a condition is active, and clear themselves once it
                        is resolved.
                    </p>
                </div>

                <ul v-else class="divide-y">
                    <li v-for="alert in alerts" :key="alert.key">
                        <component
                            :is="alert.href ? 'button' : 'div'"
                            class="flex w-full items-start gap-3 p-4 text-left"
                            :class="alert.href ? 'hover:bg-accent/50 transition-colors' : ''"
                            @click="follow(alert.href)"
                        >
                            <span
                                class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                                :class="TONES[alert.severity] ?? TONES.info"
                            >
                                !
                            </span>

                            <span class="min-w-0">
                                <span class="block text-sm font-medium">{{ alert.title }}</span>
                                <span class="text-muted-foreground block text-xs">
                                    {{ alert.body }}
                                </span>
                            </span>
                        </component>
                    </li>
                </ul>

                <!--
                    WHERE AN ANNOUNCEMENT IS WRITTEN, beside the thing it
                    produces. Shown only to somebody who can create one AND only
                    where the screen exists - see the server's two conditions.
                -->
                <a
                    v-if="canAnnounce"
                    :href="`${prefix}/announcements/create`"
                    class="text-muted-foreground hover:bg-accent/50 hover:text-foreground flex items-center gap-2 border-t p-3 text-xs transition-colors"
                >
                    <svg
                        class="size-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="m3 11 18-5v12L3 14v-3z" />
                        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                    </svg>
                    Write an announcement
                </a>
            </template>

            <!-- INBOX: recorded events, per user. -->
            <template v-else>
                <div
                    v-if="notifications.length === 0"
                    class="flex flex-col items-center gap-1 p-8 text-center"
                >
                    <p class="text-sm font-medium">No notifications</p>
                    <p class="text-muted-foreground text-xs font-normal">
                        Finished exports and background actions land here.
                    </p>
                </div>

                <ul v-else class="divide-y">
                    <li
                        v-for="note in notifications"
                        :key="note.id"
                        class="group hover:bg-accent/30 flex items-start gap-3 p-4 transition-colors"
                        :class="note.read ? 'opacity-60' : ''"
                    >
                        <span
                            class="mt-1.5 size-2 shrink-0 rounded-full"
                            :class="note.read ? 'bg-transparent' : 'bg-primary'"
                            :aria-label="note.read ? 'Read' : 'Unread'"
                        />

                        <div class="min-w-0 flex-1">
                            <button type="button" class="w-full text-left" @click="openNote(note)">
                                <span class="block text-sm font-medium">{{ note.title }}</span>
                                <span class="text-muted-foreground block text-xs">{{
                                    note.body
                                }}</span>
                                <span
                                    v-if="note.at"
                                    class="text-muted-foreground/70 mt-0.5 block text-[11px]"
                                >
                                    {{ note.at }}
                                </span>
                            </button>
                            <span
                                v-if="linkedNotificationActions(note.actions).length"
                                class="mt-2 flex flex-wrap gap-2"
                            >
                                <a
                                    v-for="action in linkedNotificationActions(note.actions).filter(
                                        (item) => !notificationActionIsPost(item),
                                    )"
                                    :key="action.key"
                                    :href="action.href ?? undefined"
                                    class="text-primary text-xs font-medium underline"
                                    data-notification-action
                                    :target="action.newTab ? '_blank' : undefined"
                                    :rel="action.newTab ? 'noopener noreferrer' : undefined"
                                    @click="runNoteAction(note, action, $event)"
                                >
                                    {{ action.label }}
                                </a>
                                <button
                                    v-for="action in linkedNotificationActions(note.actions).filter(
                                        (item) => notificationActionIsPost(item),
                                    )"
                                    :key="action.key"
                                    type="button"
                                    class="text-primary text-xs font-medium underline"
                                    data-notification-action
                                    @click="runNoteAction(note, action, $event)"
                                >
                                    {{ action.label }}
                                </button>
                            </span>
                        </div>

                        <button
                            v-if="note.read"
                            type="button"
                            class="text-muted-foreground hover:text-foreground shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                            :aria-label="`Mark ${note.title} as unread`"
                            @click="markUnread(note, $event)"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                class="size-4"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            class="text-muted-foreground hover:text-destructive shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                            :aria-label="`Delete ${note.title}`"
                            @click="remove(note)"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                class="size-4"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </li>
                </ul>

                <div v-if="hasMore" class="flex justify-center border-t p-3">
                    <button
                        type="button"
                        class="text-muted-foreground hover:text-foreground text-xs font-medium disabled:opacity-50"
                        data-load-more
                        :disabled="loadingMore"
                        @click="loadMore"
                    >
                        {{ loadingMore ? 'Loading…' : 'Load more' }}
                    </button>
                </div>
            </template>
        </div>

        <template v-if="tab === 'inbox' && notifications.length > 0" #footer>
            <div class="flex items-center justify-between gap-2">
                <button
                    v-if="unread > 0"
                    type="button"
                    class="bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm"
                    data-mark-all-read
                    @click="markAllRead"
                >
                    Mark all as read
                </button>

                <button
                    type="button"
                    class="text-muted-foreground hover:text-destructive ml-auto px-2 py-1.5 text-sm"
                    data-clear-all
                    @click="clearAll"
                >
                    Clear all
                </button>
            </div>
        </template>
    </PkSlideover>

    <PkModal
        :open="confirmingClearAll"
        title="Clear all notifications?"
        description="This removes every notification from your inbox and cannot be undone."
        @close="confirmingClearAll = false"
    >
        <p class="text-sm">
            Clear <strong>{{ notifications.length }}</strong> notification(s) from your inbox?
        </p>
        <template #footer>
            <button
                type="button"
                class="hover:bg-accent rounded-md px-3 py-1.5 text-sm"
                @click="confirmingClearAll = false"
            >
                Cancel
            </button>
            <button
                type="button"
                class="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-3 py-1.5 text-sm"
                @click="executeClearAll"
            >
                Clear all
            </button>
        </template>
    </PkModal>
</template>
