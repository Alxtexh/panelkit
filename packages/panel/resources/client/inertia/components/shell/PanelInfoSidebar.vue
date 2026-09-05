<script setup lang="ts">
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import { PkSlideover } from '@alxtexh-enterprise/panel'
import { closePanelInfo, panelInfoOpen } from './panelInfoState'

export interface PanelInfoSection {
    heading: string
    body: string
}

export interface PanelInfoPanel {
    title: string
    description?: string | null
    sections?: PanelInfoSection[]
}

const page = usePage()
const open = computed(() => panelInfoOpen.value)

const infoPanel = (): PanelInfoPanel | null => {
    const value = (page.props as Record<string, unknown>).infoPanel

    if (!value || typeof value !== 'object') {
        return null
    }

    return value as PanelInfoPanel
}

</script>

<template>
    <PkSlideover
        v-if="infoPanel()"
        :open="open"
        :title="infoPanel()?.title ?? 'Page information'"
        :description="infoPanel()?.description"
        side="right"
        size="md"
        @close="closePanelInfo"
    >
        <div class="flex flex-col gap-5">
            <section
                v-for="section in infoPanel()?.sections ?? []"
                :key="section.heading"
                class="space-y-1.5"
            >
                <h2 class="text-sm font-semibold tracking-tight">{{ section.heading }}</h2>
                <p class="text-muted-foreground text-sm leading-6">{{ section.body }}</p>
            </section>
        </div>
    </PkSlideover>
</template>
