<script setup lang="ts">
/**
 * Outbound webhook endpoints and delivery log (`Panel::webhooks()`).
 *
 * Props come from WebhookEndpointsPage: create/edit, ping, retry, select.
 */
import { Head, router, useForm } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import {
    PAGE_SHELL_STACK,
    PkButton as Button,
    PkEmptyState,
    PkModal,
    PkPageHeader,
    TableShell,
} from '@alxtexh-enterprise/panel'

defineOptions({ inheritAttrs: false })

interface EndpointRow {
    id: number
    url: string
    events: string[]
    enabled: boolean
}

interface DeliveryRow {
    id: number
    event: string
    status_code?: number | null
    error?: string | null
    delivered_at?: string | null
}

const props = withDefaults(
    defineProps<{
        pageHeading?: string
        pageDescription?: string | null
        eventsCatalog?: string[]
        endpoints?: EndpointRow[]
        selectedEndpointId?: number | null
        deliveries?: DeliveryRow[]
        pageHref?: string
        saveHref?: string
        deleteHref?: string
        retryHref?: string
        pingHref?: string
    }>(),
    {
        eventsCatalog: () => [],
        endpoints: () => [],
        selectedEndpointId: null,
        deliveries: () => [],
        pageHref: '/apps/webhooks',
        saveHref: '/apps/webhooks/save',
        deleteHref: '/apps/webhooks/delete',
        retryHref: '/apps/webhooks/retry',
        pingHref: '/apps/webhooks/ping',
    },
)

const showCreate = ref(false)
const editingId = ref<number | null>(null)
const pendingDeleteId = ref<number | null>(null)

const form = useForm<{
    id: number | null
    url: string
    events: string[]
    enabled: boolean
    secret: string
}>({
    id: null,
    url: '',
    events: [],
    enabled: true,
    secret: '',
})

const catalog = computed(() => props.eventsCatalog ?? [])
const selected = computed(
    () => props.endpoints.find((row) => row.id === props.selectedEndpointId) ?? null,
)

function toggleEvent(event: string) {
    const set = new Set(form.events)

    if (set.has(event)) {
        set.delete(event)
    } else {
        set.add(event)
    }

    form.events = [...set]
}

function openCreate() {
    editingId.value = null
    form.id = null
    form.url = ''
    form.events = catalog.value.includes('webhook.ping') ? ['webhook.ping'] : []
    form.enabled = true
    form.secret = ''
    form.clearErrors()
    showCreate.value = true
}

function openEdit(row: EndpointRow) {
    editingId.value = row.id
    form.id = row.id
    form.url = row.url
    form.events = [...row.events]
    form.enabled = row.enabled
    form.secret = ''
    form.clearErrors()
    showCreate.value = true
}

function cancelForm() {
    showCreate.value = false
    editingId.value = null
    form.reset()
    form.clearErrors()
}

function submitSave() {
    form.post(props.saveHref ?? '/apps/webhooks/save', {
        preserveScroll: true,
        onSuccess: () => cancelForm(),
    })
}

function requestRemove(id: number) {
    pendingDeleteId.value = id
}

function remove() {
    if (pendingDeleteId.value === null) {
        return
    }

    router.post(
        props.deleteHref ?? '/apps/webhooks/delete',
        { id: pendingDeleteId.value },
        { preserveScroll: true, onFinish: () => (pendingDeleteId.value = null) },
    )
}

function selectEndpoint(id: number) {
    router.get(
        props.pageHref ?? '/apps/webhooks',
        { endpoint: id },
        { preserveState: true, preserveScroll: true },
    )
}

function sendPing(id: number) {
    router.post(props.pingHref ?? '/apps/webhooks/ping', { id }, { preserveScroll: true })
}

function retryDelivery(id: number) {
    router.post(props.retryHref ?? '/apps/webhooks/retry', { id }, { preserveScroll: true })
}

function formatWhen(value?: string | null): string {
    if (!value) {
        return 'Unknown'
    }

    try {
        return new Date(value).toLocaleString()
    } catch {
        return value
    }
}

function statusLabel(row: DeliveryRow): string {
    if (row.error) {
        return row.error
    }

    if (row.status_code != null) {
        return String(row.status_code)
    }

    return 'Pending'
}
</script>

<template>
    <Head :title="pageHeading ?? 'Webhooks'" />

    <div :class="PAGE_SHELL_STACK">
        <PkPageHeader
            :title="pageHeading ?? 'Webhooks'"
            :purpose="
                pageDescription ??
                'Outbound HTTPS deliveries with X-Panel-Signature (HMAC-SHA256). Enable with Panel::webhooks().'
            "
        >
            <template #actions>
                <Button type="button" @click="showCreate ? cancelForm() : openCreate()">
                    {{ showCreate ? 'Cancel' : 'Add endpoint' }}
                </Button>
            </template>
        </PkPageHeader>

        <form
            v-if="showCreate"
            class="space-y-4 rounded-md border p-4"
            @submit.prevent="submitSave"
        >
            <div>
                <label class="text-sm font-medium" for="webhook-url">URL</label>
                <input
                    id="webhook-url"
                    v-model="form.url"
                    type="url"
                    required
                    class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="https://example.com/hooks/panel"
                />
                <p v-if="form.errors.url" class="mt-1 text-xs text-destructive">
                    {{ form.errors.url }}
                </p>
            </div>

            <fieldset>
                <legend class="text-sm font-medium">Events</legend>
                <p v-if="catalog.length === 0" class="mt-1 text-sm text-muted-foreground">
                    No events in
                    <code class="font-mono">panel.webhooks.events</code>. Override
                    <code class="font-mono">WebhookEndpointsPage::events()</code>
                    or set the catalog.
                </p>
                <ul v-else class="mt-2 max-h-48 space-y-1 overflow-y-auto text-sm">
                    <li v-for="event in catalog" :key="event">
                        <label class="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                :checked="form.events.includes(event)"
                                @change="toggleEvent(event)"
                            />
                            <span class="font-mono text-xs">{{ event }}</span>
                        </label>
                    </li>
                </ul>
                <p v-if="form.errors.events" class="mt-1 text-xs text-destructive">
                    {{ form.errors.events }}
                </p>
            </fieldset>

            <div>
                <label class="text-sm font-medium" for="webhook-secret">
                    Secret
                    <span class="font-normal text-muted-foreground">
                        ({{
                            editingId ? 'leave blank to keep' : 'optional, auto-generated if empty'
                        }})
                    </span>
                </label>
                <input
                    id="webhook-secret"
                    v-model="form.secret"
                    type="text"
                    autocomplete="off"
                    class="mt-1 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm"
                    placeholder="Signing secret"
                />
            </div>

            <label class="flex cursor-pointer items-center gap-2 text-sm">
                <input v-model="form.enabled" type="checkbox" />
                Enabled
            </label>

            <Button type="submit" :disabled="form.processing">
                {{ editingId ? 'Update endpoint' : 'Save endpoint' }}
            </Button>
        </form>

        <PkEmptyState
            v-if="endpoints.length === 0 && !showCreate"
            title="No webhook endpoints yet"
            description="Add a URL, pick events, then send a ping to verify delivery."
            icon="link"
        >
            <template #actions>
                <Button type="button" @click="openCreate">Add endpoint</Button>
            </template>
        </PkEmptyState>

        <TableShell v-else-if="endpoints.length > 0">
            <template #title>
                <p class="text-sm font-medium">
                    {{ endpoints.length }}
                    {{ endpoints.length === 1 ? 'endpoint' : 'endpoints' }}
                </p>
            </template>

            <ul class="divide-y">
                <li
                    v-for="row in endpoints"
                    :key="row.id"
                    class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
                    :class="selectedEndpointId === row.id ? 'bg-muted/40' : ''"
                >
                    <button
                        type="button"
                        class="min-w-0 flex-1 text-left"
                        @click="selectEndpoint(row.id)"
                    >
                        <p class="truncate font-medium">{{ row.url }}</p>
                        <p class="mt-0.5 font-mono text-xs text-muted-foreground">
                            {{ row.events.join(', ') || 'No events' }}
                        </p>
                        <p
                            class="mt-1 text-xs"
                            :class="
                                row.enabled
                                    ? 'text-muted-foreground'
                                    : 'text-amber-600 dark:text-amber-500'
                            "
                        >
                            {{ row.enabled ? 'Enabled' : 'Disabled' }}
                        </p>
                    </button>
                    <div class="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            @click="selectEndpoint(row.id)"
                        >
                            Deliveries
                        </Button>
                        <Button type="button" variant="outline" size="sm" @click="sendPing(row.id)">
                            Send ping
                        </Button>
                        <Button type="button" variant="ghost" size="sm" @click="openEdit(row)">
                            Edit
                        </Button>
                        <Button type="button" variant="ghost" size="sm" @click="requestRemove(row.id)">
                            Delete
                        </Button>
                    </div>
                </li>
            </ul>
        </TableShell>

        <section v-if="selectedEndpointId" class="space-y-3">
            <header class="space-y-1">
                <h2 class="text-lg font-semibold tracking-tight">Delivery log</h2>
                <p class="text-sm text-muted-foreground font-normal">
                    Recent deliveries for
                    <span class="font-mono text-xs">{{
                        selected?.url ?? `endpoint #${selectedEndpointId}`
                    }}</span>
                    (last 50).
                </p>
            </header>

            <PkEmptyState
                v-if="deliveries.length === 0"
                title="No deliveries yet"
                description="Use Send ping to post a webhook.ping test."
                icon="activity"
            />

            <TableShell v-else>
                <template #title>
                    <p class="text-sm font-medium">{{ deliveries.length }} deliveries</p>
                </template>

                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead
                            class="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground"
                        >
                            <tr>
                                <th class="px-3 py-2">Event</th>
                                <th class="px-3 py-2">Status</th>
                                <th class="px-3 py-2">Delivered</th>
                                <th class="px-3 py-2" />
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="row in deliveries"
                                :key="row.id"
                                class="border-b last:border-0"
                            >
                                <td class="px-3 py-2 font-mono text-xs">{{ row.event }}</td>
                                <td
                                    class="px-3 py-2 text-xs"
                                    :class="
                                        row.error ? 'text-destructive' : 'text-muted-foreground'
                                    "
                                >
                                    {{ statusLabel(row) }}
                                </td>
                                <td class="px-3 py-2 text-muted-foreground">
                                    {{ formatWhen(row.delivered_at) }}
                                </td>
                                <td class="px-3 py-2 text-right">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        @click="retryDelivery(row.id)"
                                    >
                                        Retry
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </TableShell>
        </section>

        <PkModal
            :open="pendingDeleteId !== null"
            title="Delete webhook endpoint?"
            description="Future deliveries will stop for this endpoint."
            @close="pendingDeleteId = null"
        >
            <p class="text-sm">Delete endpoint <strong>#{{ pendingDeleteId }}</strong>?</p>
            <template #footer>
                <Button variant="ghost" size="sm" @click="pendingDeleteId = null">Cancel</Button>
                <Button variant="destructive" size="sm" @click="remove">Delete endpoint</Button>
            </template>
        </PkModal>
    </div>
</template>
