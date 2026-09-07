<script setup lang="ts">
/**
 * Built-in API reference, rendered by Scalar against an OpenAPI URL.
 *
 * The URL is a prop from ApiDocsPage (generated `{page}/openapi.json` or a
 * host-configured absolute URL). Missing URL shows an empty state instead of
 * mounting Scalar with nothing to fetch.
 */
import { Head } from '@inertiajs/vue3'
import { computed, defineAsyncComponent } from 'vue'
import { useAppearance } from '@alxtexh-enterprise/panel'

/** Keep the optional API explorer out of the initial panel shell bundle. */
const ApiReference = defineAsyncComponent(async () => {
    await import('@scalar/api-reference/style.css')

    return (await import('@scalar/api-reference')).ApiReference
})

defineOptions({ inheritAttrs: false })

const props = withDefaults(
    defineProps<{
        pageHeading?: string
        pageDescription?: string | null
        openapiUrl?: string | null
    }>(),
    {
        openapiUrl: null,
    },
)

const { appearance } = useAppearance()

const hasSpec = computed(
    () => typeof props.openapiUrl === 'string' && props.openapiUrl.trim() !== '',
)

const configuration = computed(() => ({
    url: props.openapiUrl as string,
    darkMode: appearance.value.theme === 'dark',
    hideDownloadButton: false,
    hideModels: false,
}))
</script>

<template>
    <Head :title="pageHeading ?? 'API docs'" />

    <div
        v-if="!hasSpec"
        class="flex h-full flex-col items-center justify-center gap-2 p-8 text-center"
    >
        <h1 class="text-lg font-semibold">{{ pageHeading ?? 'API docs' }}</h1>
        <p class="max-w-md text-sm text-muted-foreground">
            No OpenAPI document is configured. Enable
            <code class="rounded bg-muted px-1 py-0.5 text-xs">Panel::apiDocs()</code>
            so the kit can generate one, or pass an OpenAPI URL to
            <code class="rounded bg-muted px-1 py-0.5 text-xs">apiDocs($url)</code>.
        </p>
    </div>

    <div v-else class="h-full min-h-[70vh]">
        <ApiReference :configuration="configuration" />
    </div>
</template>
