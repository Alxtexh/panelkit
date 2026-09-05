import { ref } from 'vue'

/** Shared shell state for the contextual page-information drawer. */
export const panelInfoOpen = ref(false)

export function openPanelInfo(): void {
    panelInfoOpen.value = true
}

export function closePanelInfo(): void {
    panelInfoOpen.value = false
}
