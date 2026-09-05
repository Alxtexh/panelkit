<script setup lang="ts">
/**
 * API keys for the public API. Keys and ability options are props from ApiKeysPage.
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

interface KeyRow {
    id: number | string
    name: string
    prefix: string
    abilities: string[]
    last_used_at?: string | null
    expires_at?: string | null
}

const props = withDefaults(
    defineProps<{
        pageHeading?: string
        pageDescription?: string | null
        keys?: KeyRow[]
        abilityOptions?: string[]
        plaintext?: string | null
        createHref?: string
        destroyHref?: string
    }>(),
    {
        keys: () => [],
        abilityOptions: () => [],
        plaintext: null,
        createHref: '/apps/api-keys/create',
        destroyHref: '/apps/api-keys/destroy',
    },
)

const showCreate = ref(false)
const pendingRevoke = ref<number | string | null>(null)

const form = useForm<{ name: string; abilities: string[] }>({
    name: '',
    abilities: [],
})

const revealed = computed(() => props.plaintext)

function toggleAbility(ability: string) {
    const set = new Set(form.abilities)

    if (set.has(ability)) {
        set.delete(ability)
    } else {
        set.add(ability)
    }

    form.abilities = [...set]
}

function submitCreate() {
    form.post(props.createHref ?? '/apps/api-keys/create', {
        preserveScroll: true,
        onSuccess: () => {
            form.reset()
            showCreate.value = false
        },
    })
}

function requestRevoke(id: number | string) {
    pendingRevoke.value = id
}

function revoke() {
    if (pendingRevoke.value === null) {
        return
    }

    router.post(
        props.destroyHref ?? '/apps/api-keys/destroy',
        { id: pendingRevoke.value },
        { preserveScroll: true, onFinish: () => (pendingRevoke.value = null) },
    )
}

function formatWhen(value?: string | null): string {
    if (!value) {
        return 'Never'
    }

    try {
        return new Date(value).toLocaleString()
    } catch {
        return value
    }
}
</script>

<template>
    <Head :title="pageHeading ?? 'API keys'" />

    <div :class="PAGE_SHELL_STACK">
        <PkPageHeader
            :title="pageHeading ?? 'API keys'"
            :purpose="
                pageDescription ??
                'Tokens use the same ability names as the panel. Override ApiKeysPage to use your store.'
            "
        >
            <template #actions>
                <Button type="button" @click="showCreate = !showCreate">
                    {{ showCreate ? 'Cancel' : 'Create key' }}
                </Button>
            </template>
        </PkPageHeader>

        <section
            v-if="revealed"
            class="rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm"
        >
            <p class="font-medium">Copy this key now. It will not be shown again.</p>
            <code class="mt-2 block break-all rounded bg-background px-2 py-1 font-mono text-xs">
                {{ revealed }}
            </code>
        </section>

        <form
            v-if="showCreate"
            class="space-y-4 rounded-md border p-4"
            @submit.prevent="submitCreate"
        >
            <div>
                <label class="text-sm font-medium" for="key-name">Name</label>
                <input
                    id="key-name"
                    v-model="form.name"
                    type="text"
                    class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="Production integration"
                />
                <p v-if="form.errors.name" class="mt-1 text-xs text-destructive">
                    {{ form.errors.name }}
                </p>
            </div>

            <fieldset>
                <legend class="text-sm font-medium">Abilities</legend>
                <p v-if="abilityOptions.length === 0" class="mt-1 text-sm text-muted-foreground">
                    No abilities registered yet.
                </p>
                <ul v-else class="mt-2 max-h-48 space-y-1 overflow-y-auto text-sm">
                    <li v-for="ability in abilityOptions" :key="ability">
                        <label class="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                :checked="form.abilities.includes(ability)"
                                @change="toggleAbility(ability)"
                            />
                            <span class="font-mono text-xs">{{ ability }}</span>
                        </label>
                    </li>
                </ul>
                <p v-if="form.errors.abilities" class="mt-1 text-xs text-destructive">
                    {{ form.errors.abilities }}
                </p>
            </fieldset>

            <Button type="submit" :disabled="form.processing">Issue key</Button>
        </form>

        <PkEmptyState
            v-if="keys.length === 0 && !showCreate"
            title="No API keys yet"
            description="Create a key for an integration. The plaintext secret is shown once."
            icon="key"
        >
            <template #actions>
                <Button type="button" @click="showCreate = true">Create key</Button>
            </template>
        </PkEmptyState>

        <TableShell v-else-if="keys.length > 0">
            <template #title>
                <p class="text-sm font-medium">
                    {{ keys.length }} {{ keys.length === 1 ? 'key' : 'keys' }}
                </p>
            </template>

            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead
                        class="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground"
                    >
                        <tr>
                            <th class="px-3 py-2">Name</th>
                            <th class="px-3 py-2">Prefix</th>
                            <th class="px-3 py-2">Abilities</th>
                            <th class="px-3 py-2">Last used</th>
                            <th class="px-3 py-2">Expires</th>
                            <th class="px-3 py-2" />
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in keys"
                            :key="String(row.id)"
                            class="border-b last:border-0"
                        >
                            <td class="px-3 py-2">{{ row.name }}</td>
                            <td class="px-3 py-2 font-mono text-xs">{{ row.prefix }}…</td>
                            <td class="px-3 py-2 font-mono text-xs">
                                {{ row.abilities.join(', ') }}
                            </td>
                            <td class="px-3 py-2 text-muted-foreground">
                                {{ formatWhen(row.last_used_at) }}
                            </td>
                            <td class="px-3 py-2 text-muted-foreground">
                                {{ formatWhen(row.expires_at) }}
                            </td>
                            <td class="px-3 py-2 text-right">
                                <Button type="button" variant="ghost" @click="requestRevoke(row.id)">
                                    Revoke
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </TableShell>

        <PkModal
            :open="pendingRevoke !== null"
            title="Revoke API key?"
            description="Applications using this key will lose access immediately."
            @close="pendingRevoke = null"
        >
            <p class="text-sm">Revoke key <strong>#{{ pendingRevoke }}</strong>?</p>
            <template #footer>
                <Button variant="outline" @click="pendingRevoke = null">Cancel</Button>
                <Button variant="destructive" @click="revoke">Revoke key</Button>
            </template>
        </PkModal>
    </div>
</template>
