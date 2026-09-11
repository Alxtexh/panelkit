<script setup lang="ts">
/**
 * The floating "Unsaved changes" bar.
 *
 * PINNED TO THE MAIN CONTENT COLUMN (`#pk-main`), not the viewport - so it
 * covers the pane to the right of the rail, not the sidebar too. Inner chrome
 * stays on FORM_MEASURE (max-w-7xl), left-aligned like the fields, with
 * PAGE_SHELL_COMPACT padding.
 *
 * `position: sticky`, NOT `fixed`. `#pk-main` is both the scroll container
 * (`overflow-y: auto`) AND, via `transform-gpu`, the containing block a
 * `fixed` descendant resolves against - and a `fixed` element whose
 * containing block is a transformed ancestor is positioned like `absolute`,
 * which scrolls WITH that ancestor's content instead of staying pinned to
 * its viewport. Verified live: scrolling `#pk-main` to its end moved the bar
 * from `top: 658` to `top: -67` in the same viewport, off-screen, on a 390px
 * Create page - the exact bug Phase 6's audit reported ("the bar drifts into
 * the middle of the form"). `position: sticky` does not have this failure
 * mode: it stays in normal flow, so it sticks to the bottom of `#pk-main`'s
 * own scrollport regardless of any ancestor's transform. The no-shell
 * fallback below already used `sticky` for the same reason; this just
 * stopped the two branches disagreeing.
 *
 * Outside a panel shell (tests, rare host pages) Teleport is disabled and the
 * bar sticks at the bottom of its in-tree parent instead - now the same rule,
 * not a different one.
 *
 * IT DOES NOT FETCH: it emits `save` and `cancel`, and the page owns both.
 * Dirtiness belongs to the form, not to a bar that draws it.
 *
 * `pointer-events-none` on the positioning wrapper keeps the strip either side
 * of the bar clickable, so it does not become an invisible barrier across the
 * page.
 *
 * CLEARS `PkBottomNav` ON A HANDSET. Both are `fixed`/`bottom-0`, and without
 * an offset the bar and the handset nav occupy the same pixels - whichever
 * has the higher `z-index` wins, which meant Save/Cancel painted UNDER the
 * nav bar and were unreachable. `PkBottomNav` is `min-h-14` plus the safe-area
 * inset and only renders `sm:hidden`, so the offset matches that exactly and
 * drops away at the same breakpoint the nav does.
 */
import { computed, onMounted, ref } from 'vue'
import { FORM_MEASURE } from '../../lib/pageShell'

withDefaults(
    defineProps<{
        show: boolean
        processing?: boolean
        message?: string
        saveLabel?: string
        cancelLabel?: string
        discardLabel?: string
        /**
         * A second, non-primary submit - "Create & add another" on a create
         * form. Undefined hides it, same as `discardLabel`: this bar stays
         * generic (it also guards ordinary settings forms via
         * `useUnsavedChanges`), so the concept is a plain optional secondary
         * action rather than anything creation-specific.
         */
        extraLabel?: string
        /**
         * The primary button reads as a warning, not a recommendation - for a
         * bar whose main action is "leave and lose this" rather than "save
         * this", where a brand-coloured button would read as the endorsed
         * choice.
         */
        destructive?: boolean
    }>(),
    {
        processing: false,
        message: 'Unsaved changes',
        saveLabel: 'Save',
        cancelLabel: 'Cancel',
        destructive: false,
    },
)

defineEmits<{
    (e: 'save'): void
    (e: 'cancel'): void
    (e: 'discard'): void
    (e: 'extra'): void
}>()

const shellReady = ref(false)

onMounted(() => {
    shellReady.value = Boolean(document.getElementById('pk-main'))
})

const teleportTo = computed(() => (shellReady.value ? '#pk-main' : 'body'))
const teleportDisabled = computed(() => !shellReady.value)

const frameClass =
    'pointer-events-none sticky inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 px-3 pb-3 sm:bottom-0 sm:px-4 sm:pb-4'

/**
 * MANUAL, NOT CSS-CLASS-DRIVEN. `<Transition>`'s default mode detects
 * completion by watching for `transitionend` on the element it thinks it
 * teleported - which, combined with `Teleport`'s own dynamic target, left
 * this element stuck mid-leave with both the "from" and "to" classes
 * applied and nothing ever removing it: `show` genuinely went `false`,
 * `UnsavedBar` genuinely received it, and the bar stayed on screen anyway.
 * Driving the same animation from `requestAnimationFrame` + a plain
 * `setTimeout` matching the CSS duration removes the one part that was
 * failing to fire - `done()` is guaranteed to be called, so the element is
 * guaranteed to be removed.
 */
const HIDDEN = { opacity: '0', transform: 'translateY(0.75rem)' }
const SHOWN = { opacity: '1', transform: 'translateY(0)' }

function onEnter(el: Element, done: () => void): void {
    const node = el as HTMLElement
    Object.assign(node.style, HIDDEN, { transition: 'none' })
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            node.style.transition = 'opacity 200ms ease-out, transform 200ms ease-out'
            Object.assign(node.style, SHOWN)
        })
    })
    setTimeout(done, 200)
}

function onLeave(el: Element, done: () => void): void {
    const node = el as HTMLElement
    Object.assign(node.style, SHOWN, {
        transition: 'opacity 150ms ease-in, transform 150ms ease-in',
    })
    requestAnimationFrame(() => {
        Object.assign(node.style, HIDDEN)
    })
    setTimeout(done, 150)
}
</script>

<template>
    <Teleport :to="teleportTo" :disabled="teleportDisabled">
        <Transition :css="false" @enter="onEnter" @leave="onLeave">
            <div
                v-if="show"
                :class="frameClass"
                role="status"
                aria-live="polite"
                data-slot="unsaved-bar"
            >
                <div
                    :class="[
                        FORM_MEASURE,
                        'pointer-events-auto flex items-center gap-3 rounded-xl border bg-card/95 py-3 pr-3 pl-4 shadow-md ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10',
                    ]"
                >
                    <span class="text-amber-600 dark:text-amber-400" aria-hidden="true">
                        <svg
                            viewBox="0 0 24 24"
                            class="size-4"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 8v4M12 16h.01" />
                        </svg>
                    </span>

                    <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ message }}</span>

                    <button
                        v-if="discardLabel"
                        type="button"
                        class="hover:bg-muted inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50"
                        :disabled="processing"
                        @click="$emit('discard')"
                    >
                        {{ discardLabel }}
                    </button>

                    <button
                        type="button"
                        class="bg-muted hover:bg-muted/70 inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50"
                        :disabled="processing"
                        @click="$emit('cancel')"
                    >
                        {{ cancelLabel }}
                    </button>

                    <button
                        v-if="extraLabel"
                        type="button"
                        class="hover:bg-muted inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50"
                        :disabled="processing"
                        @click="$emit('extra')"
                    >
                        {{ extraLabel }}
                    </button>

                    <button
                        type="button"
                        class="inline-flex min-h-9 items-center rounded-lg px-4 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                        :class="
                            destructive
                                ? 'bg-destructive text-white'
                                : 'bg-primary text-primary-foreground'
                        "
                        :disabled="processing"
                        @click="$emit('save')"
                    >
                        {{ processing ? 'Saving…' : saveLabel }}
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
