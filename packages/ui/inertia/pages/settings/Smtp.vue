<script setup lang="ts">
/**
 * The mail server this installation sends through - a form over
 * `SmtpSettings`, `settings/Assistant.vue`'s same shape.
 *
 * THE PASSWORD FIELD IS ALWAYS EMPTY. The server never sends the stored
 * secret - only `maskedPassword`'s last four characters as a caption - so
 * this form cannot leak what it cannot see. Leaving it blank on save keeps
 * the stored password; leaving it blank on TEST sends with the stored one
 * too, so opening this page and clicking "Send test email" tests what is
 * actually live right now, not an empty credential.
 *
 * SAVE AND TEST ARE TWO SEPARATE REQUESTS. Save is the ordinary Inertia
 * form `PUT`; test is a plain `fetch` to a JSON endpoint - `useImport`'s
 * same reasoning, duplicated rather than shared for four lines with no
 * other purpose - because a full-page Inertia visit is the wrong shape for
 * "try this and tell me what happened without navigating anywhere".
 *
 * SAVE/CANCEL ARE `UnsavedBar`, NOT AN INLINE BUTTON PAIR - the kit's own
 * save control, `ResourceForm.vue`'s same reasoning: a floating bar visible
 * wherever the scroll is beats a button at the bottom of a form nobody has
 * scrolled to yet. "Send test email" stays OUTSIDE the bar and always
 * visible regardless of `form.isDirty` - it tests whatever is currently
 * live (saved, or the form's own unsaved values), which is exactly the
 * thing an operator wants to check on a page that has nothing typed yet.
 */
import { Head, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import {
    Label,
    PkButton as Button,
    PkHeading as Heading,
    ShadcnInput as Input,
    UnsavedBar,
} from '@alxtexh-enterprise/panel'
import AuthInputError from '../../components/AuthInputError.vue'
import { useGroupedSettingsCards } from '../../composables/useGroupedSettingsCards'

const { sectionClass } = useGroupedSettingsCards()

const props = defineProps<{
    /** Where `save` posts - injected by `PageController` for a declared `save` action. */
    saveHref: string
    saveMethod: string
    /** Where `test` posts. See `MailSettingsPage`. */
    routes: { test: string }
    config: {
        host: string
        port: number
        encryption: string | null
        username: string | null
        fromAddress: string
        fromName: string
    }
    maskedPassword: string | null
    configured: boolean
}>()

const form = useForm({
    host: props.config.host,
    port: props.config.port,
    encryption: props.config.encryption ?? '',
    username: props.config.username ?? '',
    password: '',
    from_address: props.config.fromAddress,
    from_name: props.config.fromName,
})

function submit() {
    form.transform((data) => ({ ...data, encryption: data.encryption || null })).submit(
        props.saveMethod as 'put',
        props.saveHref,
        {
            preserveScroll: true,
            onSuccess: () => {
                form.reset('password')

                // `form.isDirty` compares against the defaults captured when
                // `useForm()` ran, not against "whatever was last saved" -
                // Inertia keeps this component instance mounted rather than
                // remounting it, so nothing resets that baseline on its own.
                // Without this, `UnsavedBar` stays visible right after a
                // successful save, which reads as the save having failed.
                form.defaults()
                toast.success('SMTP settings saved')
            },
        },
    )
}

function discard() {
    form.reset()
    form.clearErrors()
}

function csrf(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)

    return match ? decodeURIComponent(match[1]) : ''
}

const testing = ref(false)

async function sendTest() {
    testing.value = true

    try {
        const response = await fetch(props.routes.test, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': csrf(),
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                host: form.host,
                port: form.port,
                encryption: form.encryption || null,
                username: form.username,
                password: form.password,
                from_address: form.from_address,
                from_name: form.from_name,
            }),
        })

        const result = (await response.json().catch(() => null)) as {
            ok: boolean
            message: string
        } | null

        if (!response.ok || result === null) {
            toast.error('The server could not run the test.')

            return
        }

        if (result.ok) {
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }
    } catch {
        toast.error('Could not reach the server to send a test email.')
    } finally {
        testing.value = false
    }
}
</script>

<template>
    <Head title="SMTP" />

    <h1 class="sr-only">SMTP settings</h1>

    <!--
        `pb-40 sm:pb-24` CLEARS THE FLOATING SAVE BAR - `ResourceForm.vue`'s
        same comment, including the `sm:` split (the bar stacks above
        `PkBottomNav` below that breakpoint, so the handset exclusion zone
        is taller than `pb-24` alone ever reserved). The bar is fixed to the
        bottom of `#pk-main`; without reserved space it sits on top of the
        last field instead of below it.
    -->
    <div class="flex flex-col pb-40 sm:pb-24" :class="sectionClass">
        <Heading
            variant="small"
            title="SMTP"
            description="The mail server this installation sends through."
        />

        <p
            class="rounded-md border px-3 py-2 text-sm"
            :class="
                configured
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-dashed text-muted-foreground'
            "
        >
            <template v-if="configured">
                Sending through {{ config.host }}, as {{ config.fromName }} &lt;{{
                    config.fromAddress
                }}&gt;.
            </template>
            <template v-else>
                No mail server saved yet - outgoing mail falls back to whatever this deploy's
                environment configures. Fill in the form below and save to take over.
            </template>
        </p>

        <div>
            <Button type="button" variant="outline" :disabled="testing" @click="sendTest">
                {{ testing ? 'Sending…' : 'Send test email' }}
            </Button>
            <p class="mt-1 text-xs text-muted-foreground font-normal">
                Sends to your own account's address, using whichever password is in the field below
                - or the saved one, if you left it blank.
            </p>
        </div>

        <form class="space-y-6" @submit.prevent="submit">
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="grid gap-2 sm:col-span-2">
                    <Label for="smtp-host">Host</Label>
                    <Input id="smtp-host" v-model="form.host" placeholder="smtp.example.com" />
                    <AuthInputError :message="form.errors.host" />
                </div>

                <div class="grid gap-2">
                    <Label for="smtp-port">Port</Label>
                    <Input
                        id="smtp-port"
                        v-model.number="form.port"
                        type="number"
                        min="1"
                        max="65535"
                    />
                    <AuthInputError :message="form.errors.port" />
                </div>

                <div class="grid gap-2">
                    <Label for="smtp-encryption">Encryption</Label>
                    <select
                        id="smtp-encryption"
                        v-model="form.encryption"
                        class="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        <option value="">None</option>
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                    </select>
                    <AuthInputError :message="form.errors.encryption" />
                </div>

                <div class="grid gap-2">
                    <Label for="smtp-username">Username</Label>
                    <Input id="smtp-username" v-model="form.username" autocomplete="off" />
                    <AuthInputError :message="form.errors.username" />
                </div>

                <div class="grid gap-2">
                    <Label for="smtp-password">Password</Label>
                    <Input
                        id="smtp-password"
                        v-model="form.password"
                        type="password"
                        autocomplete="new-password"
                        :placeholder="
                            maskedPassword
                                ? `Currently ${maskedPassword} — enter a new password to replace it`
                                : ''
                        "
                    />
                    <AuthInputError :message="form.errors.password" />
                </div>

                <div class="grid gap-2">
                    <Label for="smtp-from-address">From address</Label>
                    <Input id="smtp-from-address" v-model="form.from_address" type="email" />
                    <AuthInputError :message="form.errors.from_address" />
                </div>

                <div class="grid gap-2">
                    <Label for="smtp-from-name">From name</Label>
                    <Input id="smtp-from-name" v-model="form.from_name" />
                    <AuthInputError :message="form.errors.from_name" />
                </div>
            </div>
        </form>

        <UnsavedBar
            :show="form.isDirty"
            :processing="form.processing"
            message="Unsaved changes"
            save-label="Save"
            @save="submit"
            @cancel="discard"
        />
    </div>
</template>
