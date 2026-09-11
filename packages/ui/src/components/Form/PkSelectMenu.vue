<script setup lang="ts">
/**
 * A themed single-select trigger - the control for a plain `SelectField`.
 *
 * WHY THIS EXISTS. `FormFieldControl.vue` already draws a fully themed
 * overlay for a SEARCHABLE select (`field.type === 'select' && searchOptions`)
 * - but a static option list with no search callback fell through to a bare
 * native `<select>`, which every browser renders in its own visual language.
 * That's the same "one field that doesn't look like the rest of the kit"
 * problem `PkDatePicker` closed for dates, applied to the far more common
 * case: a short, fixed list of options (a status, a type, a plan).
 *
 * THE SAME OVERLAY SHAPE AS THE SEARCHABLE VARIANT, deliberately - an `open`
 * ref, an absolutely positioned panel, a `fixed inset-0` backdrop - so a
 * select feels identical whether or not it happens to search. Kept as its
 * own small component rather than folded into `FormFieldControl.vue`'s
 * already-large template, since a plain option list needs none of the
 * search-debounce/create-option machinery that block already carries.
 */
import { computed, nextTick, ref, watch } from 'vue'
import { FOCUS_RING, INVALID_BORDER } from '../../lib/focusRing'

interface Option {
    value: string | number
    label: string
}

const props = withDefaults(
    defineProps<{
        modelValue: string | number | null
        options: Option[]
        id?: string
        disabled?: boolean
        invalid?: boolean
        placeholder?: string
        clearable?: boolean
        /** The field's own label text, read only for the popup listbox's
         *  `aria-label` - the VISIBLE label already lives outside this
         *  component (the surrounding form layout renders it), so a
         *  screen reader landing in the listbox otherwise hears an
         *  unnamed "listbox" with no indication of what it is choosing. */
        label?: string
        /** The id of this field's error message (`role="alert"` text), so a
         *  screen reader announces it as part of the control's description -
         *  not just at the moment the error first appears. */
        describedBy?: string
    }>(),
    {
        id: undefined,
        disabled: false,
        invalid: false,
        placeholder: 'Select…',
        clearable: true,
        label: undefined,
        describedBy: undefined,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number | null): void
}>()

const open = ref(false)
const listRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)

const selectedOption = computed(
    () => props.options.find((opt) => String(opt.value) === String(props.modelValue)) ?? null,
)

/**
 * FOCUS RETURNS TO THE TRIGGER whenever the listbox closes - Escape, picking
 * an option, or the backdrop's outside-click all just set `open` to false.
 * Same reasoning as `PkDatePicker`'s identical watch: catching every close
 * path in one place is what keeps focus from landing on `document.body`
 * (the standard complaint against a popover/listbox pattern) after any one
 * of them, rather than only the paths someone remembered to add it to.
 */
watch(open, (isOpen, wasOpen) => {
    if (!isOpen && wasOpen) {
        triggerRef.value?.focus()
    }
})

/**
 * ROVING TABINDEX: exactly one option is a real Tab stop (`tabindex="0"`)
 * at a time - the rest are `tabindex="-1"`, reachable by Arrow keys but not
 * by Tab. Before this, every option button had its native implicit
 * `tabindex="0"` (nothing overrode it), so pressing Tab while the list was
 * open stepped through options ONE AT A TIME instead of leaving the
 * listbox, and a screen reader's own Tab-based scan of the page listed
 * every option as a separate stop. Defaults to the selected option (or the
 * first, if none), and follows real DOM focus via `@focus` so it stays
 * correct regardless of how focus arrived - arrow key, mouse, or a screen
 * reader's own virtual cursor.
 */
const rovingIndex = computed(() => {
    const selectedIndex = props.options.findIndex((opt) => String(opt.value) === String(props.modelValue))

    return selectedIndex >= 0 ? selectedIndex : 0
})

const focusedIndex = ref<number | null>(null)

function optionTabindex(index: number): number {
    return index === (focusedIndex.value ?? rovingIndex.value) ? 0 : -1
}

async function toggleOpen(): Promise<void> {
    if (props.disabled) {
        return
    }

    open.value = !open.value

    if (open.value) {
        focusedIndex.value = null
        await nextTick()
        const items = Array.from(listRef.value?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
        // The selected option when there is one; otherwise the first -
        // APG's own recommendation, and the reason `rovingIndex` above
        // does not just stay unset when nothing is selected.
        items[rovingIndex.value]?.focus()
    }
}

function pick(option: Option): void {
    emit('update:modelValue', option.value)
    open.value = false
}

function clear(): void {
    emit('update:modelValue', null)
}

function moveFocus(step: number): void {
    const items = Array.from(listRef.value?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
    const current = document.activeElement as HTMLElement | null
    const index = items.indexOf(current!)
    const next = items[Math.min(Math.max(index + step, 0), items.length - 1)]
    next?.focus()
}

function onListKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
        event.preventDefault()
        moveFocus(1)
    } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        moveFocus(-1)
    } else if (event.key === 'Escape' || event.key === 'Tab') {
        // Tab CLOSES rather than traps - a listbox popup is not a modal
        // dialog (unlike PkDatePicker's calendar), so the standard,
        // expected behaviour is the same as a native <select>: Tab moves
        // on to the next field. Without this the popup stayed open,
        // visually floating with no focus inside it, while real focus
        // continued past it into whatever followed in the page.
        if (event.key === 'Tab') {
            open.value = false

            return
        }

        event.preventDefault()
        open.value = false
    } else if (event.key === 'Enter' || event.key === ' ') {
        const focused = document.activeElement as HTMLElement | null

        if (focused?.dataset.value !== undefined) {
            event.preventDefault()
            const option = props.options.find((opt) => String(opt.value) === focused.dataset.value)

            if (option) {
                pick(option)
            }
        }
    }
}
</script>

<template>
    <div class="relative">
        <button
            :id="id"
            ref="triggerRef"
            type="button"
            :class="[
                'border-input bg-background flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50',
                FOCUS_RING,
                INVALID_BORDER,
            ]"
            :disabled="disabled"
            :aria-invalid="invalid"
            :aria-describedby="describedBy"
            :aria-expanded="open"
            aria-haspopup="listbox"
            @click="toggleOpen"
        >
            <span :class="['truncate', selectedOption ? '' : 'text-muted-foreground']">
                {{ selectedOption?.label ?? placeholder }}
            </span>
            <span class="flex shrink-0 items-center gap-1">
                <span
                    v-if="clearable && selectedOption && !disabled"
                    class="text-muted-foreground hover:text-foreground text-xs"
                    role="button"
                    aria-label="Clear selection"
                    @click.stop="clear"
                >
                    ✕
                </span>
                <svg
                    class="text-muted-foreground size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </span>
        </button>

        <div
            v-if="open"
            ref="listRef"
            role="listbox"
            :aria-label="label"
            class="bg-popover absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border p-1 shadow-md"
            @keydown="onListKeydown"
        >
            <button
                v-for="(opt, i) in options"
                :key="String(opt.value)"
                type="button"
                role="option"
                :tabindex="optionTabindex(i)"
                :data-value="String(opt.value)"
                :data-selected="String(opt.value) === String(modelValue)"
                :aria-selected="String(opt.value) === String(modelValue)"
                :class="[
                    'flex w-full items-center rounded px-2 py-1.5 text-left text-sm',
                    String(opt.value) === String(modelValue)
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'hover:bg-accent hover:text-accent-foreground',
                    FOCUS_RING,
                ]"
                @click="pick(opt)"
                @focus="focusedIndex = i"
            >
                {{ opt.label }}
            </button>
            <p v-if="options.length === 0" class="text-muted-foreground px-2 py-2 text-xs">
                No options
            </p>
        </div>

        <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />
    </div>
</template>
