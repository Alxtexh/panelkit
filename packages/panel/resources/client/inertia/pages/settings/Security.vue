<script setup lang="ts">
/**
 * Everything about getting into this account, on one screen.
 *
 * MOVED FROM THE REFERENCE APPLICATION, not rewritten. The components this
 * mounts - ManagePasskeys, ManageTwoFactor and the modals under them - shipped
 * in this package from 0.6 and were rendered by nothing outside the demo, so
 * every installation downloaded a working passkey manager and had no page on
 * which to see it. Rewriting the screen would have meant re-deriving the props
 * those components expect, which is exactly how "the section renders but the
 * button does nothing" happens.
 *
 * ONE SCREEN, NOT FOUR. Password, second factor, passkeys, connected accounts
 * and signed-in devices answer one question - who can get into this account -
 * and somebody who opens any of them is already worried. Across tabs, half of
 * it gets audited.
 *
 * URLS ARE BUILT FROM THE PANEL PATH, not from Wayfinder. The demo could import
 * generated route helpers because the routes are in its own application; a
 * packaged screen has no such file to import, and the panel may be mounted at
 * any prefix. `panel.path` is shared by SharePanelProps on every request.
 */
import { Form, Head, router, useForm, usePage } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import {
    PkButton as Button,
    PkFieldLabel as Label,
    PkHeading as Heading,
    PkModal,
    PkPasswordInput as PasswordInput,
} from '@alxtexh-enterprise/panel'
import AuthInputError from '../../components/AuthInputError.vue'
import ManagePasskeys from '../../components/security/ManagePasskeys.vue'
import ManageTwoFactor from '../../components/security/ManageTwoFactor.vue'
import { useGroupedSettingsCards } from '../../composables/useGroupedSettingsCards'
import type { Passkey } from '../../types'

interface ConnectedAccountRow {
    id: number
    provider: string
    label: string
    email: string | null
    nickname: string | null
    lastUsedAt: string | null
}

interface Device {
    id: string
    current: boolean
    ip: string | null
    browser: string
    platform: string
    lastActiveAt: string | null
}

type Props = {
    /** Provider key => human name. Empty when none are configured. */
    socialProviders?: Record<string, string>
    connectedAccounts?: ConnectedAccountRow[]
    passwordRules: string
    devices: Device[]
    /**
     * True only when SESSION_DRIVER=database and the sessions table exists.
     * File, cookie, array and redis cannot list or revoke other browsers.
     */
    canListOtherDevices?: boolean
    /*
     * WHAT THE SECURITY CARDS NEED, spelled out rather than imported. They are
     * `.vue` files, and a `Props` type exported from one is not reachable
     * through the package entry. The server sends exactly these keys.
     */
    canManagePasskeys?: boolean
    passkeys?: Passkey[]
    canManageTwoFactor?: boolean
    requiresConfirmation?: boolean
    twoFactorEnabled?: boolean
    canManageEmailTwoFactor?: boolean
    emailTwoFactorEnabled?: boolean
}

const props = defineProps<Props>()

const page = usePage()

const { sectionClass, wrapClass } = useGroupedSettingsCards()

/** The panel's prefix, so these URLs work wherever it is mounted. */
const base = computed(() => (page.props.panel as { path?: string } | undefined)?.path ?? '')

const at = (path: string) => `${base.value === '/' ? '' : base.value}${path}`

/** Providers configured but not yet attached to this account. */
const unconnected = computed(() =>
    Object.entries(props.socialProviders ?? {}).filter(
        ([key]) => !(props.connectedAccounts ?? []).some((a) => a.provider === key),
    ),
)

const otherDevices = computed(() => (props.devices ?? []).filter((d) => !d.current))

const canListOtherDevices = computed(() => props.canListOtherDevices === true)

type PendingSecurityAction =
    | { kind: 'disconnect'; id: number }
    | { kind: 'device'; id: string }
    | { kind: 'others' }
    | { kind: 'email-two-factor' }

const pendingSecurityAction = ref<PendingSecurityAction | null>(null)
const emailTwoFactorForm = useForm({})

const securityActionTitle = computed(() => {
    switch (pendingSecurityAction.value?.kind) {
        case 'disconnect':
            return 'Disconnect account?'
        case 'device':
            return 'Sign out this device?'
        case 'others':
            return 'Sign out other devices?'
        case 'email-two-factor':
            return 'Disable email codes?'
        default:
            return 'Confirm security change'
    }
})

const securityActionDescription = computed(() => {
    switch (pendingSecurityAction.value?.kind) {
        case 'disconnect':
            return 'This removes the connected sign-in provider from your account.'
        case 'device':
            return 'That browser session will be invalidated immediately.'
        case 'others':
            return 'Every other browser session will be invalidated immediately.'
        case 'email-two-factor':
            return 'Your account will no longer receive email codes as a second factor.'
        default:
            return undefined
    }
})

function disconnect(id: number) {
    pendingSecurityAction.value = { kind: 'disconnect', id }
}

/**
 * Signing out deletes the session row, which is what makes it immediate.
 *
 * Marking a session revoked and checking a flag later leaves a stolen cookie
 * working until something looks; deleting means the very next request has no
 * session at all.
 */
function signOut(id: string) {
    pendingSecurityAction.value = { kind: 'device', id }
}

function signOutOthers() {
    pendingSecurityAction.value = { kind: 'others' }
}

function disableEmailTwoFactor() {
    pendingSecurityAction.value = { kind: 'email-two-factor' }
}

function confirmSecurityAction() {
    const action = pendingSecurityAction.value

    if (!action) {
        return
    }

    pendingSecurityAction.value = null

    if (action.kind === 'disconnect') {
        router.delete(at(`/connected-accounts/${action.id}`), { preserveScroll: true })
    } else if (action.kind === 'device') {
        router.delete(at(`/security/devices/${action.id}`), { preserveScroll: true })
    } else if (action.kind === 'others') {
        router.delete(at('/security/devices'), { preserveScroll: true })
    } else {
        emailTwoFactorForm.delete(at('/security/email-two-factor'), { preserveScroll: true })
    }
}

defineOptions({
    // Page props arrive as attributes and this root is a fragment.
    inheritAttrs: false,
    layout: {
        breadcrumbs: [{ title: 'Security settings', href: '' }],
    },
})
</script>

<template>
    <Head title="Security settings" />

    <h1 class="sr-only">Security settings</h1>

    <div :class="sectionClass">
        <Heading
            variant="small"
            title="Update password"
            description="Ensure your account is using a long, random password to stay secure"
        />

        <Form
            :action="at('/security/password')"
            method="put"
            :options="{ preserveScroll: true }"
            reset-on-success
            :reset-on-error="['password', 'password_confirmation', 'current_password']"
            class="space-y-6"
            v-slot="{ errors, processing }"
        >
            <div class="grid gap-2">
                <Label for="current_password">Current password</Label>
                <PasswordInput
                    id="current_password"
                    name="current_password"
                    class="mt-1 block w-full"
                    autocomplete="current-password"
                    placeholder="Current password"
                />
                <AuthInputError :message="errors.current_password" />
            </div>

            <div class="grid gap-2">
                <Label for="password">New password</Label>
                <!--
                    `passwordrules` IS WHAT TELLS A PASSWORD MANAGER WHAT TO
                    GENERATE. Without it the manager offers its own default, the
                    server rejects it, and the person blames the panel.
                -->
                <PasswordInput
                    id="password"
                    name="password"
                    class="mt-1 block w-full"
                    autocomplete="new-password"
                    placeholder="New password"
                    :passwordrules="props.passwordRules"
                />
                <AuthInputError :message="errors.password" />
            </div>

            <div class="grid gap-2">
                <Label for="password_confirmation">Confirm password</Label>
                <PasswordInput
                    id="password_confirmation"
                    name="password_confirmation"
                    class="mt-1 block w-full"
                    autocomplete="new-password"
                    placeholder="Confirm password"
                    :passwordrules="props.passwordRules"
                />
                <AuthInputError :message="errors.password_confirmation" />
            </div>

            <div class="flex items-center gap-4">
                <Button :disabled="processing" data-test="update-password-button"> Save </Button>
            </div>
        </Form>
    </div>

    <div v-if="canManageTwoFactor" :class="wrapClass">
        <ManageTwoFactor
            :canManageTwoFactor="canManageTwoFactor"
            :requiresConfirmation="requiresConfirmation"
            :twoFactorEnabled="twoFactorEnabled"
        />
    </div>

    <div v-if="canManageEmailTwoFactor" :class="sectionClass">
        <Heading
            variant="small"
            title="Email codes"
            description="A one-time code is emailed after your password, as a second factor."
        />

        <p class="text-muted-foreground text-sm font-normal">
            Turn this on if you would rather receive a code at your address than use an
            authenticator app. You can keep both.
        </p>

        <Form
            v-if="!emailTwoFactorEnabled"
            :action="at('/security/email-two-factor')"
            method="post"
            :options="{ preserveScroll: true }"
            #default="{ processing }"
        >
            <Button type="submit" :disabled="processing">Enable email codes</Button>
        </Form>

        <div v-else>
            <Button
                variant="destructive"
                type="button"
                :disabled="emailTwoFactorForm.processing"
                @click="disableEmailTwoFactor"
            >
                Disable email codes
            </Button>
        </div>
    </div>

    <div v-if="canManagePasskeys" :class="wrapClass">
        <ManagePasskeys :canManagePasskeys="canManagePasskeys" :passkeys="passkeys" />
    </div>

    <!--
        Signed-in devices.

        HERE rather than in their own screen: "where am I logged in" is the same
        worry as "who has my password", so it belongs beside the controls
        somebody reaches for next.
    -->
    <div :class="sectionClass">
        <!--
            CONNECTED ACCOUNTS SIT BESIDE THE DEVICE LIST, for the same reason
            that list is here: "what else can get into my account" is one worry,
            and splitting it across two screens means somebody audits half of it.
        -->
        <template v-if="Object.keys(props.socialProviders ?? {}).length > 0">
            <Heading
                title="Connected accounts"
                description="Sign in with a provider instead of typing your password. Removing one does not close any session it opened."
            />

            <ul
                v-if="(props.connectedAccounts ?? []).length > 0"
                class="divide-y rounded-lg border"
            >
                <li
                    v-for="account in props.connectedAccounts"
                    :key="account.id"
                    class="flex items-center gap-3 p-3"
                >
                    <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium">{{ account.label }}</p>
                        <p class="text-xs text-muted-foreground font-normal">
                            {{ account.email ?? account.nickname ?? 'Connected' }}
                            <template v-if="account.lastUsedAt">
                                · last used
                                {{ new Date(account.lastUsedAt).toLocaleDateString() }}
                            </template>
                        </p>
                    </div>

                    <Button variant="ghost" size="sm" @click="disconnect(account.id)">
                        Disconnect
                    </Button>
                </li>
            </ul>

            <div v-if="unconnected.length > 0" class="flex flex-wrap gap-2">
                <!-- A real navigation: the provider redirect leaves the app. -->
                <a
                    v-for="[key, label] in unconnected"
                    :key="key"
                    :href="`/auth/${key}/redirect`"
                    class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                    Connect {{ label }}
                </a>
            </div>
        </template>

        <Heading
            title="Signed-in devices"
            description="This browser, plus every other session we can see for this account. Sign out anything you do not recognise."
        />

        <ul v-if="devices.length > 0" class="divide-y rounded-lg border">
            <li v-for="device in devices" :key="device.id" class="flex items-center gap-3 p-3">
                <span class="shrink-0 text-muted-foreground">
                    <svg
                        class="size-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <rect x="2" y="4" width="20" height="14" rx="2" />
                        <path d="M8 21h8M12 18v3" />
                    </svg>
                </span>

                <div class="min-w-0 flex-1">
                    <p class="flex items-center gap-2 text-sm font-medium">
                        {{ device.browser }} on {{ device.platform }}
                        <span
                            v-if="device.current"
                            class="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                        >
                            This device
                        </span>
                    </p>
                    <p class="text-xs text-muted-foreground font-normal">
                        {{ device.ip ?? 'Unknown address' }}
                        <template v-if="device.lastActiveAt">
                            · last active
                            {{ new Date(device.lastActiveAt).toLocaleString() }}
                        </template>
                    </p>
                </div>

                <!--
                    THE CURRENT DEVICE HAS NO SIGN-OUT BUTTON. Signing yourself
                    out from a security page reads as a mistake, and the account
                    menu already has Log out for when it is not.
                -->
                <Button
                    v-if="!device.current && canListOtherDevices"
                    variant="ghost"
                    size="sm"
                    @click="signOut(device.id)"
                >
                    Sign out
                </Button>
            </li>
        </ul>

        <div
            v-if="!canListOtherDevices"
            class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground"
        >
            Other signed-in devices cannot be listed with the current session driver. Set
            <code class="text-xs">SESSION_DRIVER=database</code>
            and run the sessions migration to list and revoke them. This device still appears above.
        </div>

        <div
            v-else-if="otherDevices.length === 0"
            class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground"
        >
            No other devices are signed in.
        </div>

        <Button
            v-if="canListOtherDevices && otherDevices.length > 0"
            variant="outline"
            size="sm"
            @click="signOutOthers"
        >
            Sign out every other device
        </Button>
    </div>

    <PkModal
        :open="pendingSecurityAction !== null"
        :title="securityActionTitle"
        :description="securityActionDescription"
        @close="pendingSecurityAction = null"
    >
        <p class="text-sm">
            <template v-if="pendingSecurityAction?.kind === 'disconnect'">
                This provider will no longer be available as a sign-in method.
            </template>
            <template v-else-if="pendingSecurityAction?.kind === 'email-two-factor'">
                Continue only if you have another reliable second factor or recovery method.
            </template>
            <template v-else>
                Continue with this security change?
            </template>
        </p>
        <template #footer>
            <Button variant="ghost" size="sm" @click="pendingSecurityAction = null">Cancel</Button>
            <Button variant="destructive" size="sm" @click="confirmSecurityAction">
                Confirm
            </Button>
        </template>
    </PkModal>
</template>
