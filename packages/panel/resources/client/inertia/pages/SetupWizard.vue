<script setup lang="ts">
/**
 * The full-screen first-run setup wizard. Props from SetupWizardController.
 *
 * ONE SUBMIT, NOT ONE PER STEP - see `Support\SetupWizard`'s own docblock.
 * `RecordForm` renders every step's fields (the payload already carries all
 * of them); this page supplies the single Save button below it, the same
 * shape `ResourceForm.vue` uses for a resource whose form happens to declare
 * a `Wizard` node.
 */
import { Head, Link, router } from '@inertiajs/vue3'
import { markRaw, reactive, ref } from 'vue'
import { PkButton as Button, PkSetupWizardCompletion, RecordForm } from '@alxtexh-enterprise/panel'
import type { SchemaNodeShape as SchemaNodeType } from '@alxtexh-enterprise/panel'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
    defineProps<{
        pageHeading?: string
        wizard?: { nodes: SchemaNodeType[] }
        values?: Record<string, any>
        options?: Record<string, { value: any; label: string }[]>
        errors?: Record<string, string>
        completed?: boolean
        completion?: {
            heading: string
            summary: { label: string; detail?: string }[]
            nextSteps: { label: string; href: string }[]
            actions: { label: string; href: string; primary?: boolean }[]
        } | null
        skipUrl?: string
    }>(),
    {
        wizard: () => ({ nodes: [] }),
        values: () => ({}),
        options: () => ({}),
        errors: () => ({}),
        completed: false,
        completion: null,
    },
)

const InertiaLink = markRaw(Link)

const formValues = reactive<Record<string, any>>({ ...props.values })
const processing = ref(false)

function onChange(key: string, value: unknown) {
    formValues[key] = value
}

function submit() {
    processing.value = true
    router.post(window.location.pathname, formValues, {
        preserveScroll: true,
        onFinish: () => {
            processing.value = false
        },
    })
}

function skip() {
    if (props.skipUrl) {
        router.post(props.skipUrl)
    }
}
</script>

<template>
    <Head
        :title="completed ? (completion?.heading ?? 'Setup complete') : (pageHeading ?? 'Setup')"
    />
    <div class="bg-muted flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div class="bg-card w-full max-w-2xl rounded-xl border p-6 shadow-sm sm:p-8">
            <PkSetupWizardCompletion
                v-if="completed && completion"
                :heading="completion.heading"
                :summary="completion.summary"
                :next-steps="completion.nextSteps"
                :actions="completion.actions"
                :link-component="InertiaLink"
            />

            <template v-else>
                <h1 class="text-foreground mb-6 text-xl font-semibold">
                    {{ pageHeading ?? 'Setup' }}
                </h1>

                <RecordForm
                    :nodes="wizard.nodes"
                    :model-value="formValues"
                    :options="options"
                    :errors="errors"
                    :processing="processing"
                    @change="onChange"
                />

                <div class="mt-6 flex items-center justify-between gap-3">
                    <button
                        v-if="skipUrl"
                        type="button"
                        dusk="skip-setup-wizard"
                        class="text-muted-foreground hover:text-foreground text-sm"
                        @click="skip"
                    >
                        Skip setup wizard
                    </button>
                    <span v-else />

                    <Button :disabled="processing" @click="submit">Finish setup</Button>
                </div>
            </template>
        </div>
    </div>
</template>
