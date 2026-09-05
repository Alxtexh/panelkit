<script setup lang="ts">
/**
 * Inertia host for PlanSetupPage: grid on the index, editor on create/edit.
 */
import { Head, router } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { PAGE_SHELL, PkButton as Button, PkModal, PlanEditor, PlanGrid } from '@alxtexh-enterprise/panel'
import type { PlanLimitField, PlanModuleOption, PlanRecord } from '@alxtexh-enterprise/panel'

defineOptions({
    inheritAttrs: false,
    layout: {
        breadcrumbs: [{ title: 'Subscription plans', href: '' }],
    },
})

const props = defineProps<{
    pageHeading?: string
    pageDescription?: string | null
    plans?: PlanRecord[]
    modules?: PlanModuleOption[]
    limits?: PlanLimitField[]
    editing?: PlanRecord | null
    mode?: 'index' | 'create' | 'edit'
    indexHref?: string
    saveHref?: string
    destroyHref?: string
}>()

const mode = computed(() => props.mode ?? (props.editing ? 'edit' : 'index'))
const pendingDestroy = ref<string | null>(null)

function visitIndex() {
    router.visit(props.indexHref ?? '/settings/plans')
}

function visitCreate() {
    const base = (props.indexHref ?? '/settings/plans').replace(/\/$/, '')
    router.visit(`${base}?plan=new`)
}

function visitEdit(id: string) {
    const base = (props.indexHref ?? '/settings/plans').replace(/\/$/, '')
    router.visit(`${base}?plan=${encodeURIComponent(id)}`)
}

function save(plan: PlanRecord) {
    router.post(props.saveHref ?? `${props.indexHref ?? '/settings/plans'}/save`, { plan } as any, {
        preserveScroll: true,
    })
}

function requestDestroy(id: string) {
    pendingDestroy.value = id
}

function destroy() {
    if (pendingDestroy.value === null) {
        return
    }

    router.post(
        props.destroyHref ?? `${props.indexHref ?? '/settings/plans'}/destroy`,
        { id: pendingDestroy.value },
        {
            preserveScroll: true,
            onFinish: () => (pendingDestroy.value = null),
        },
    )
}
</script>

<template>
    <Head :title="pageHeading ?? 'Plans'" />

    <div :class="PAGE_SHELL">
        <PlanEditor
            v-if="mode === 'create' || mode === 'edit'"
            :plan="editing ?? undefined"
            :modules="modules ?? []"
            :limits="limits ?? []"
            :mode="mode === 'edit' ? 'edit' : 'create'"
            @save="save"
            @cancel="visitIndex"
        />

        <PlanGrid
            v-else
            :title="pageHeading ?? 'Plans'"
            :description="pageDescription"
            :plans="plans ?? []"
            @create="visitCreate"
            @edit="visitEdit"
            @delete="requestDestroy"
        />

        <PkModal
            :open="pendingDestroy !== null"
            title="Delete plan?"
            description="This removes the plan and cannot be undone from this screen."
            @close="pendingDestroy = null"
        >
            <p class="text-sm">
                Delete plan <strong>#{{ pendingDestroy }}</strong>?
            </p>
            <template #footer>
                <Button variant="ghost" size="sm" @click="pendingDestroy = null">Cancel</Button>
                <Button variant="destructive" size="sm" @click="destroy">Delete plan</Button>
            </template>
        </PkModal>
    </div>
</template>
