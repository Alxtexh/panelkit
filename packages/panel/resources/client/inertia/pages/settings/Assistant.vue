<script setup lang="ts">
/**
 * MOVED FROM THE REFERENCE APP.
 *
 * Its Wayfinder route helpers became a `routes` prop, and `defineOptions({
    // Page props arrive as attributes and this root is a fragment.
    inheritAttrs: false,
 * layout })` is gone - the layout is the consumer's, applied by the one-line
 * page file `panel:install` writes.
 */
/**
 * The assistant's provider and key - a form over `AiCredentials`.
 *
 * THE KEY FIELD IS ALWAYS EMPTY. The server never sends the stored secret -
 * only the masked tail as a caption - so this form cannot leak what it
 * cannot see. Entering a new key replaces the old one; the field being
 * blank on an unrelated visit changes nothing because blank never submits.
 */
import { Head, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import {
    Label,
    PkButton as Button,
    PkHeading as Heading,
    PkModal,
    ShadcnInput as Input,
} from '@alxtexh-enterprise/panel'
import AuthInputError from '../../components/AuthInputError.vue'
import { useGroupedSettingsCards } from '../../composables/useGroupedSettingsCards'

const { sectionClass } = useGroupedSettingsCards()

const props = defineProps<{
    /** Where the form posts. See `AssistantSettingsController`. */
    routes: { update: string; destroy: string }
    providers: string[]
    provider: string | null
    maskedKey: string | null
    available: boolean
    byok: boolean
}>()

const form = useForm({
    provider: props.provider ?? 'anthropic',
    key: '',
})

function submit() {
    form.put(props.routes.update, {
        preserveScroll: true,
        onSuccess: () => {
            form.reset('key')
            toast.success('Assistant credentials saved')
        },
    })
}

const removing = useForm({})
const confirmingRemove = ref(false)

function remove() {
    confirmingRemove.value = true
}

function confirmRemove() {
    removing.delete(props.routes.destroy, {
        preserveScroll: true,
        onSuccess: () => toast.success('Assistant credentials removed'),
        onFinish: () => (confirmingRemove.value = false),
    })
}
</script>

<template>
    <Head title="Assistant" />

    <h1 class="sr-only">Assistant settings</h1>

    <div class="flex flex-col" :class="sectionClass">
        <Heading
            variant="small"
            title="Assistant"
            description="The AI provider the assistant runs on, and its key"
        />

        <!-- Which source powers the assistant right now, in one sentence. -->
        <p
            class="rounded-md border px-3 py-2 text-sm"
            :class="
                available ? 'border-primary/30 bg-primary/5' : 'border-dashed text-muted-foreground'
            "
        >
            <template v-if="byok">
                Running on the key saved here ({{ maskedKey }}, {{ provider }}).
            </template>
            <template v-else-if="available">
                Running on the key from the deployment's environment. Saving one here overrides it,
                and an administrator can rotate it without a deploy.
            </template>
            <template v-else>
                The assistant is off — nobody has provided an AI key yet. Save one below to turn it
                on.
            </template>
        </p>

        <form class="space-y-6" @submit.prevent="submit">
            <div class="grid gap-2">
                <Label for="ai-provider">Provider</Label>
                <select
                    id="ai-provider"
                    v-model="form.provider"
                    class="h-9 rounded-md border border-input bg-background px-3 text-sm capitalize"
                >
                    <option v-for="p in providers" :key="p" :value="p">
                        {{ p }}
                    </option>
                </select>
                <AuthInputError :message="form.errors.provider" />
            </div>

            <div class="grid gap-2">
                <Label for="ai-key">API key</Label>
                <Input
                    id="ai-key"
                    v-model="form.key"
                    type="password"
                    autocomplete="off"
                    :placeholder="
                        maskedKey ? `Currently ${maskedKey} — enter a new key to replace it` : ''
                    "
                />
                <AuthInputError :message="form.errors.key" />
                <p class="text-xs text-muted-foreground font-normal">
                    Stored encrypted, and never shown again in full. Rotating it is pasting a new
                    one here.
                </p>
            </div>

            <div class="flex items-center gap-2">
                <Button
                    v-if="byok"
                    type="button"
                    variant="outline"
                    :disabled="removing.processing"
                    @click="remove"
                >
                    Remove key
                </Button>
                <Button type="submit" :disabled="form.processing || !form.key">
                    {{ form.processing ? 'Saving…' : 'Save' }}
                </Button>
            </div>
        </form>

        <PkModal
            :open="confirmingRemove"
            title="Remove assistant key?"
            description="The assistant will fall back to the deployment key, if one is configured."
            @close="confirmingRemove = false"
        >
            <p class="text-sm">Remove the saved provider credentials from this tenant?</p>
            <template #footer>
                <Button variant="outline" @click="confirmingRemove = false">Cancel</Button>
                <Button variant="destructive" :disabled="removing.processing" @click="confirmRemove">
                    Remove key
                </Button>
            </template>
        </PkModal>
    </div>
</template>
