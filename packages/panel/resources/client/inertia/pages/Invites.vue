<script setup lang="ts">
/**
 * Pending invites. Host persists via InvitePage hooks.
 */
import { Head, router, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { PAGE_SHELL_STACK, PkButton as Button, PkModal } from '@alxtexh-enterprise/panel'

defineOptions({ inheritAttrs: false })

interface PendingInvite {
    id: string
    email: string
    role_id: string
    expires_at?: string | null
}

interface RoleOption {
    id: string
    label: string
}

const props = withDefaults(
    defineProps<{
        pageHeading?: string
        pageDescription?: string | null
        pending?: PendingInvite[]
        roles?: RoleOption[]
        acceptUrlPattern?: string
        sendHref?: string
        revokeHref?: string
    }>(),
    {
        pending: () => [],
        roles: () => [],
        acceptUrlPattern: '/invites/accept/{token}',
        sendHref: '/apps/invites/send',
        revokeHref: '/apps/invites/revoke',
    },
)

const showForm = ref(false)
const pendingRevoke = ref<string | null>(null)

const form = useForm<{ email: string; role_id: string }>({
    email: '',
    role_id: '',
})

function submitInvite() {
    form.post(props.sendHref ?? '/apps/invites/send', {
        preserveScroll: true,
        onSuccess: () => {
            form.reset()
            showForm.value = false
        },
    })
}

function requestRevoke(id: string) {
    pendingRevoke.value = id
}

function revoke() {
    if (pendingRevoke.value === null) {
        return
    }

    router.post(
        props.revokeHref ?? '/apps/invites/revoke',
        { id: pendingRevoke.value },
        { preserveScroll: true, onFinish: () => (pendingRevoke.value = null) },
    )
}

function roleLabel(roleId: string): string {
    return props.roles.find((role) => role.id === roleId)?.label ?? roleId
}
</script>

<template>
    <Head :title="pageHeading ?? 'Invites'" />

    <div :class="PAGE_SHELL_STACK">
        <header class="space-y-1">
            <h1 class="text-2xl font-semibold tracking-tight">{{ pageHeading ?? 'Invites' }}</h1>
            <p v-if="pageDescription" class="text-sm text-muted-foreground font-normal">
                {{ pageDescription }}
            </p>
            <p class="text-xs text-muted-foreground font-normal">
                Accept URL pattern: <code>{{ acceptUrlPattern }}</code> (host route).
            </p>
        </header>

        <div class="flex items-center justify-between gap-4">
            <p class="text-sm text-muted-foreground font-normal">
                Override InvitePage::pending() and ::send() to persist invites in your store.
            </p>
            <Button type="button" @click="showForm = !showForm">
                {{ showForm ? 'Cancel' : 'Send invite' }}
            </Button>
        </div>

        <form
            v-if="showForm"
            class="space-y-4 rounded-md border p-4"
            @submit.prevent="submitInvite"
        >
            <div>
                <label class="text-sm font-medium" for="invite-email">Email</label>
                <input
                    id="invite-email"
                    v-model="form.email"
                    type="email"
                    class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                <p v-if="form.errors.email" class="mt-1 text-xs text-destructive">
                    {{ form.errors.email }}
                </p>
            </div>

            <div>
                <label class="text-sm font-medium" for="invite-role">Role</label>
                <select
                    id="invite-role"
                    v-model="form.role_id"
                    class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                    <option value="" disabled>Select a role</option>
                    <option v-for="role in roles" :key="role.id" :value="role.id">
                        {{ role.label }}
                    </option>
                </select>
                <p v-if="roles.length === 0" class="mt-1 text-xs text-muted-foreground">
                    Override InvitePage::roles() to populate this list.
                </p>
                <p v-if="form.errors.role_id" class="mt-1 text-xs text-destructive">
                    {{ form.errors.role_id }}
                </p>
            </div>

            <Button type="submit" :disabled="form.processing">Send</Button>
        </form>

        <section>
            <p v-if="pending.length === 0" class="text-sm text-muted-foreground font-normal">
                No pending invites.
            </p>
            <ul v-else class="divide-y rounded-md border">
                <li
                    v-for="row in pending"
                    :key="row.id"
                    class="flex items-center justify-between gap-4 px-3 py-2 text-sm"
                >
                    <div>
                        <p class="font-medium">{{ row.email }}</p>
                        <p class="text-xs text-muted-foreground font-normal">
                            {{ roleLabel(row.role_id) }}
                        </p>
                    </div>
                    <Button type="button" variant="ghost" @click="requestRevoke(row.id)">Revoke</Button>
                </li>
            </ul>
        </section>

        <PkModal
            :open="pendingRevoke !== null"
            title="Revoke invitation?"
            description="The invitation link will stop working immediately."
            @close="pendingRevoke = null"
        >
            <p class="text-sm">Revoke the invitation for <strong>{{ pending.find((row) => row.id === pendingRevoke)?.email ?? `#${pendingRevoke}` }}</strong>?</p>
            <template #footer>
                <Button variant="ghost" size="sm" @click="pendingRevoke = null">Cancel</Button>
                <Button variant="destructive" size="sm" @click="revoke">Revoke invitation</Button>
            </template>
        </PkModal>
    </div>
</template>
