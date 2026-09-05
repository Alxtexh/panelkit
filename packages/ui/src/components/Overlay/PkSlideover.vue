<script setup lang="ts">
/**
 * A panel that slides in from an edge - filters, notifications, details,
 * secondary action forms, and opt-in CRUD modals.
 *
 * WHY A SLIDEOVER RATHER THAN A DIALOG for these: a modal dialog is a question
 * that must be answered before anything else can happen. A filter panel and a
 * notification list are neither - they are secondary surfaces you consult
 * beside the page, and forcing them into a centred modal makes the page they
 * describe disappear behind them.
 *
 * CREATE / EDIT / VIEW stay dedicated pages by default. Use this for secondary
 * flows only, or when a resource opts in via createUsing/editUsing/viewUsing
 * ('modal').
 *
 * IT OWNS NO STATE. `open` comes in, `close` goes out. A component that decides
 * for itself when it is open cannot be driven from a keyboard shortcut, a route
 * or a parent's logic without fighting it.
 *
 * SCROLL IS LOCKED WHILE OPEN. Without it a touch scroll inside the panel
 * chains to the page behind once the panel hits its end, and the content you
 * were reading moves out from under the panel.
 *
 * THE BODY SCROLLS, NOT THE PANEL. Header and footer stay put, so the primary
 * action in a long filter form is never scrolled out of reach.
 */
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { OVERLAY_FORM_MEASURE, SLIDEOVER_BODY, SLIDEOVER_WIDTH } from '../../lib/pageShell'
import { acquireScrollLock, releaseScrollLock } from '../../lib/scrollLock'
import type { SlideoverSize } from '../../lib/pageShell'

const props = withDefaults(
    defineProps<{
        open: boolean
        title: string
        description?: string | null
        side?: 'left' | 'right'
        /**
         * Width preset. Prefer this over a raw Tailwind `width` string so
         * mobile stays `w-full` and design-freeze sizes stay shared.
         */
        size?: SlideoverSize
        /** Escape hatch; wins over `size` when set. */
        width?: string | null
        /** When true, Escape and backdrop clicks do not close (saving). */
        busy?: boolean
        /** Apply SLIDEOVER_BODY padding around the default slot. */
        padded?: boolean
    }>(),
    {
        description: null,
        side: 'right',
        size: 'sm',
        width: null,
        busy: false,
        padded: true,
    },
)

const emit = defineEmits<{ (e: 'close'): void }>()

const panel = ref<HTMLElement | null>(null)
const titleId = `pk-slideover-title-${useId()}`
const descriptionId = `pk-slideover-description-${useId()}`
const scrollLockOwner = Symbol('pk-slideover')

let restoreFocusTo: HTMLElement | null = null
let ownsScrollLock = false

/**
 * Tracks whether a press STARTED on the backdrop.
 *
 * A plain @click closes the panel when a drag that began inside (selecting
 * text) happens to end outside it, discarding what was typed.
 */
const pressStartedOnBackdrop = ref(false)

const panelWidth = computed(() => props.width ?? SLIDEOVER_WIDTH[props.size])

const bodyClass = computed(() =>
    [OVERLAY_FORM_MEASURE, props.padded ? SLIDEOVER_BODY : ''].filter(Boolean).join(' '),
)

function onBackdropDown(e: PointerEvent) {
    pressStartedOnBackdrop.value = e.target === e.currentTarget
}

function onBackdropUp(e: PointerEvent) {
    if (pressStartedOnBackdrop.value && e.target === e.currentTarget && !props.busy) {
        emit('close')
    }

    pressStartedOnBackdrop.value = false
}

function onKeydown(e: KeyboardEvent) {
    if (!props.open) {
        return
    }

    if (e.key === 'Escape') {
        if (props.busy) {
            return
        }

        e.stopPropagation()
        emit('close')

        return
    }

    if (e.key !== 'Tab' || !panel.value) {
        return
    }

    /*
     * A minimal focus trap. Without it, tabbing out of the panel lands on
     * controls UNDER the backdrop - reachable by keyboard, unreachable by
     * mouse, which is the worst possible combination.
     */
    const focusable = panel.value.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )

    if (focusable.length === 0) {
        return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
    }
}

watch(
    () => props.open,
    async (isOpen) => {
        if (isOpen) {
            restoreFocusTo = document.activeElement as HTMLElement | null
            acquireScrollLock(scrollLockOwner)
            ownsScrollLock = true
            document.addEventListener('keydown', onKeydown)

            await nextTick()
            panel.value?.querySelector<HTMLElement>('input, button, [tabindex]')?.focus()

            return
        }

        if (ownsScrollLock) {
            const wasLastOverlay = releaseScrollLock(scrollLockOwner)
            ownsScrollLock = false
            document.removeEventListener('keydown', onKeydown)
            // Focus goes back where it came from, or the trigger appears to vanish.
            if (wasLastOverlay) {
                restoreFocusTo?.focus?.()
            }
            restoreFocusTo = null
        }
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)

    if (ownsScrollLock) {
        releaseScrollLock(scrollLockOwner)
        ownsScrollLock = false
    }
})
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0"
        >
            <div
                v-if="open"
                class="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]"
                @pointerdown="onBackdropDown"
                @pointerup="onBackdropUp"
            />
        </Transition>

        <Transition
            enter-active-class="transition duration-200 ease-out"
            :enter-from-class="side === 'left' ? '-translate-x-full' : 'translate-x-full'"
            leave-active-class="transition duration-150 ease-in"
            :leave-to-class="side === 'left' ? '-translate-x-full' : 'translate-x-full'"
        >
            <aside
                v-if="open"
                ref="panel"
                data-pk-overlay
                class="bg-background fixed inset-y-0 z-50 flex h-dvh max-h-dvh max-w-full flex-col shadow-2xl"
                :class="[panelWidth, side === 'left' ? 'left-0 border-r' : 'right-0 border-l']"
                role="dialog"
                aria-modal="true"
                :aria-busy="busy ? 'true' : undefined"
                :aria-labelledby="titleId"
                :aria-describedby="description ? descriptionId : undefined"
            >
                <header
                    class="bg-background flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3"
                >
                    <div class="min-w-0">
                        <h2 :id="titleId" class="text-base font-semibold">{{ title }}</h2>
                        <p
                            v-if="description"
                            :id="descriptionId"
                            class="text-muted-foreground mt-0.5 text-xs"
                        >
                            {{ description }}
                        </p>
                    </div>

                    <div class="flex shrink-0 items-center gap-2">
                        <slot name="header-actions" />
                        <button
                            type="button"
                            class="text-muted-foreground hover:text-foreground disabled:opacity-50"
                            aria-label="Close"
                            :disabled="busy"
                            @click="emit('close')"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                class="size-4"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                            >
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </header>

                <!-- Only this scrolls. -->
                <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <div :class="bodyClass">
                        <slot />
                    </div>
                </div>

                <footer
                    v-if="$slots.footer"
                    class="bg-muted/30 flex shrink-0 items-center justify-end gap-2 border-t px-4 py-3"
                >
                    <slot name="footer" />
                </footer>
            </aside>
        </Transition>
    </Teleport>
</template>
