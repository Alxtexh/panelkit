<script setup lang="ts">
/**
 * Dense centred modal. Opens as pure local state - no network request
 * (antipatterns §3.0.3).
 *
 * Use for confirmations and short secondary action forms. Long secondary
 * forms and filters belong in PkSlideover. Create / edit / view stay
 * dedicated pages by default; this is not the CRUD default.
 *
 * Focus is trapped and restored, Escape closes, and the backdrop closes on a
 * click that both started AND ended outside the panel. That last detail matters:
 * with a plain `@click.self`, selecting text inside the form and releasing
 * outside it closes the dialog and discards what you typed.
 *
 * HEADER AND FOOTER STAY PUT. Long action / bulk wizards scroll the body only,
 * so Cancel and the primary action never leave the viewport while the form grows.
 */
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { MODAL_WIDTH, OVERLAY_FORM_MEASURE } from '../../lib/pageShell'
import { acquireScrollLock, releaseScrollLock } from '../../lib/scrollLock'
import type { ModalSize } from '../../lib/pageShell'

const props = withDefaults(
    defineProps<{
        open: boolean
        title: string
        description?: string
        busy?: boolean
        /**
         * `confirm` and `form` are the two sizes this dialog has always had -
         * kept as their own names rather than folded into `md`/`lg` so every
         * existing caller keeps reading the same either way. `sm`, `lg` and
         * `xl` are new: a `RecordAction::modalWidth()` that needs narrower
         * than a confirmation or wider than a field stack no longer has to
         * pick the nearest of two sizes that were not sized for it.
         */
        size?: ModalSize
    }>(),
    { busy: false, size: 'confirm' },
)

const emit = defineEmits<{ (e: 'close'): void }>()

const panel = ref<HTMLElement | null>(null)
const titleId = `pk-modal-title-${useId()}`
const descriptionId = `pk-modal-description-${useId()}`
const scrollLockOwner = Symbol('pk-modal')
let restoreFocusTo: HTMLElement | null = null
let ownsScrollLock = false
/**
 * Tracks whether a press STARTED on the backdrop.
 *
 * A plain @click.self closes the dialog when a drag that began inside the form
 * (selecting text) happens to end outside it, discarding what was typed.
 */
const pressStartedOnBackdrop = ref(false)

const panelClass = computed(() => MODAL_WIDTH[props.size] ?? MODAL_WIDTH.confirm)

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

    if (e.key === 'Escape' && !props.busy) {
        e.stopPropagation()
        emit('close')

        return
    }

    if (e.key !== 'Tab' || !panel.value) {
        return
    }

    const focusable = panel.value.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )

    if (focusable.length === 0) {
        return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    // Wrap, so Tab cannot walk out of the dialog into the page behind it.
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
    (open) => {
        if (open) {
            restoreFocusTo = document.activeElement as HTMLElement | null
            acquireScrollLock(scrollLockOwner)
            ownsScrollLock = true
            document.addEventListener('keydown', onKeydown)
            nextTick(() =>
                panel.value?.querySelector<HTMLElement>('input, select, textarea, button')?.focus(),
            )
        } else if (ownsScrollLock) {
            const wasLastOverlay = releaseScrollLock(scrollLockOwner)
            ownsScrollLock = false
            document.removeEventListener('keydown', onKeydown)
            // Returning focus to the trigger is what makes a modal usable by
            // keyboard at all; without it focus falls back to <body>.
            if (wasLastOverlay) {
                restoreFocusTo?.focus()
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
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0"
            leave-active-class="transition duration-75 ease-in"
            leave-to-class="opacity-0"
        >
            <div
                v-if="open"
                class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-[8vh] backdrop-blur-sm"
                @pointerdown="onBackdropDown"
                @pointerup="onBackdropUp"
            >
                <div
                    ref="panel"
                    data-pk-overlay
                    role="dialog"
                    aria-modal="true"
                    :aria-busy="busy ? 'true' : undefined"
                    :aria-labelledby="titleId"
                    :aria-describedby="description ? descriptionId : undefined"
                    :class="panelClass"
                >
                    <div class="bg-popover sticky top-0 z-10 shrink-0 border-b px-6 py-5">
                        <h2 :id="titleId" class="text-lg font-semibold tracking-tight">
                            {{ title }}
                        </h2>
                        <p
                            v-if="description"
                            :id="descriptionId"
                            class="text-muted-foreground mt-1 text-sm leading-5"
                        >
                            {{ description }}
                        </p>
                    </div>

                    <div
                        :class="[
                            'min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5',
                            OVERLAY_FORM_MEASURE,
                        ]"
                    >
                        <slot />
                    </div>

                    <div
                        v-if="$slots.footer"
                        data-slot="modal-footer"
                        class="bg-muted/30 sticky bottom-0 z-10 flex shrink-0 flex-wrap items-center justify-end gap-3 border-t px-6 py-4 [&>[data-slot='button']]:min-h-10 [&>[data-slot='button']]:min-w-20 [&>[data-slot='button']]:px-4 [&>[data-slot='button'][data-variant='destructive']]:min-w-24"
                    >
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
