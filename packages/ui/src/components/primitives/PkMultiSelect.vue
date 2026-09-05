<script setup lang="ts">
/**
 * A token multi-select: chosen values sit as removable chips INSIDE the
 * control, and the dropdown offers what is left, filtered by a search box.
 *
 * WHY CHIPS RATHER THAN A CHECKBOX LIST. A list of checkboxes answers "which
 * options exist"; a token field answers "what have I chosen", which is the
 * question someone actually has once they have chosen three things out of
 * forty. With checkboxes the selection is scattered down a scrolling list and
 * the only way to audit it is to scroll the whole thing.
 *
 * CHOSEN OPTIONS LEAVE THE LIST. They are already visible as chips, so
 * repeating them below is duplication that pushes the remaining choices out of
 * view - which is the actual complaint about a long checkbox list.
 *
 * THE PANEL IS TELEPORTED AND POSITIONED FIXED, for the reason PkDropdown
 * documents: an absolutely-positioned panel is clipped by any scrolling
 * ancestor, and this control is used inside a filter panel and a slideover,
 * both of which scroll.
 *
 * KEYBOARD IS FIRST CLASS. Typing filters, Enter takes the highlighted option,
 * ArrowUp/Down move, and Backspace on an empty query removes the last chip -
 * the behaviour every token field has, and its absence is immediately felt.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

export interface MultiSelectOption {
    value: string | number
    label: string
}

const props = withDefaults(
    defineProps<{
        modelValue: (string | number)[]
        options: MultiSelectOption[]
        placeholder?: string
        searchPlaceholder?: string
        /** Show the search box. Pointless for a handful of options. */
        searchable?: boolean | null
        disabled?: boolean
        /** Refuse further selections past this many. */
        max?: number | null
    }>(),
    {
        placeholder: 'Select…',
        searchPlaceholder: 'Start typing to search...',
        searchable: null,
        disabled: false,
        max: null,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: (string | number)[]): void
}>()

const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const panelId = `pk-multi-select-${useId()}`

const open = ref(false)
const query = ref('')
const highlighted = ref(0)
const position = ref({ top: 0, left: 0, width: 0 })

const selected = computed(() =>
    props.modelValue
        .map(
            (v) =>
                props.options.find((o) => o.value === v) ?? {
                    value: v,
                    label: String(v),
                },
        )
        .filter(Boolean),
)

/** Search appears once the list is long enough to be worth searching. */
const showSearch = computed(() => props.searchable ?? props.options.length > 6)

const available = computed(() => {
    const chosen = new Set(props.modelValue)
    const q = query.value.trim().toLowerCase()

    return props.options
        .filter((o) => !chosen.has(o.value))
        .filter((o) => (q ? o.label.toLowerCase().includes(q) : true))
})

const atLimit = computed(() => props.max !== null && props.modelValue.length >= props.max)

function place() {
    const anchor = root.value
    const menu = panel.value

    if (!anchor || !menu) {
        return
    }

    const box = anchor.getBoundingClientRect()
    const size = menu.getBoundingClientRect()
    const margin = 8

    // Flip above when there is no room below. A dropdown that renders past the
    // bottom of the window is unreachable when the page itself does not scroll.
    let top = box.bottom + 4

    if (top + size.height > window.innerHeight - margin && box.top - size.height - 4 > margin) {
        top = box.top - size.height - 4
    }

    position.value = {
        top,
        left: Math.min(Math.max(margin, box.left), window.innerWidth - box.width - margin),
        // Matching the trigger's width is what makes it read as one control
        // rather than as a menu that happens to be nearby.
        width: box.width,
    }
}

async function show() {
    if (props.disabled || open.value) {
        return
    }

    open.value = true
    query.value = ''
    highlighted.value = 0

    await nextTick()
    place()
    searchInput.value?.focus()
}

function hide() {
    open.value = false
    query.value = ''
}

function toggle() {
    if (open.value) {
        hide()
    } else {
        show()
    }
}

function pick(option: MultiSelectOption) {
    if (atLimit.value) {
        return
    }

    emit('update:modelValue', [...props.modelValue, option.value])

    // The panel stays open: choosing several is the whole point, and closing
    // after each one turns three selections into three round trips of clicking.
    query.value = ''
    highlighted.value = 0

    nextTick(() => {
        place()
        searchInput.value?.focus()
    })
}

function remove(value: string | number) {
    emit(
        'update:modelValue',
        props.modelValue.filter((v) => v !== value),
    )

    nextTick(place)
}

function clearAll() {
    emit('update:modelValue', [])
    nextTick(place)
}

function onKeydown(e: KeyboardEvent) {
    if (props.disabled) {
        return
    }

    if (e.key === 'Escape' && open.value) {
        e.stopPropagation()
        hide()

        return
    }

    if (e.key === 'Backspace' && query.value === '' && props.modelValue.length > 0) {
        // The token-field convention: backspace on an empty query eats the last
        // chip. Without it the only way to undo a mis-click is to aim at a 12px ×.
        remove(props.modelValue[props.modelValue.length - 1])

        return
    }

    if (!open.value && (e.key === 'ArrowDown' || e.key === 'Enter')) {
        e.preventDefault()
        show()

        return
    }

    if (!open.value) {
        return
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault()
        highlighted.value = Math.min(highlighted.value + 1, available.value.length - 1)
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        highlighted.value = Math.max(highlighted.value - 1, 0)
    } else if (e.key === 'Enter') {
        e.preventDefault()

        const option = available.value[highlighted.value]

        if (option) {
            pick(option)
        }
    }
}

function onDocumentPointerDown(e: PointerEvent) {
    if (!open.value) {
        return
    }

    const target = e.target as Node

    // The panel is teleported, so it is not a descendant of the trigger; both
    // have to be checked or picking an option would close before it registered.
    if (root.value?.contains(target) || panel.value?.contains(target)) {
        return
    }

    // Searchable controls can contain another teleported overlay (for example
    // a custom option picker). Do not dismiss this control while interacting
    // with that nested surface; PkDropdown follows the same overlay contract.
    const el = target instanceof Element ? target : target.parentElement

    if (el?.closest('[data-pk-overlay]')) {
        return
    }

    hide()
}

function optionId(index: number): string {
    return `${panelId}-option-${index}`
}

function reposition() {
    if (open.value) {
        place()
    }
}

// A filtered list can shrink under the cursor; keep the highlight in range or
// Enter selects nothing and looks broken.
watch(available, (list) => {
    if (highlighted.value > list.length - 1) {
        highlighted.value = Math.max(0, list.length - 1)
    }
})

onMounted(() => {
    document.addEventListener('pointerdown', onDocumentPointerDown)
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
    window.removeEventListener('scroll', reposition, true)
    window.removeEventListener('resize', reposition)
})
</script>

<template>
    <div ref="root" class="relative w-full" @keydown="onKeydown">
        <div
            class="bg-background flex min-h-9 w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 transition-colors"
            :class="[
                open ? 'ring-ring border-ring ring-2' : 'hover:border-ring/50',
                disabled ? 'cursor-not-allowed opacity-50' : '',
            ]"
            role="combobox"
            :aria-expanded="open"
            :aria-controls="panelId"
            :aria-activedescendant="
                open && available[highlighted] ? optionId(highlighted) : undefined
            "
            aria-haspopup="listbox"
            tabindex="0"
            @click="toggle"
        >
            <span
                v-for="option in selected"
                :key="option.value"
                class="bg-primary/10 text-primary flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium"
            >
                {{ option.label }}
                <button
                    type="button"
                    class="hover:text-destructive -mr-0.5 leading-none"
                    :aria-label="`Remove ${option.label}`"
                    @click.stop="remove(option.value)"
                >
                    <svg
                        viewBox="0 0 24 24"
                        class="size-3"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                    >
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            </span>

            <span v-if="selected.length === 0" class="text-muted-foreground flex-1 text-sm">
                {{ placeholder }}
            </span>

            <span class="ml-auto flex shrink-0 items-center gap-1">
                <button
                    v-if="selected.length > 1"
                    type="button"
                    class="text-muted-foreground hover:text-foreground text-xs"
                    aria-label="Clear all"
                    @click.stop="clearAll"
                >
                    Clear
                </button>
                <svg
                    viewBox="0 0 24 24"
                    class="text-muted-foreground size-4 transition-transform"
                    :class="open ? 'rotate-180' : ''"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </span>
        </div>

        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="opacity-0 scale-95"
                leave-active-class="transition duration-75 ease-in"
                leave-to-class="opacity-0 scale-95"
            >
                <div
                    v-if="open"
                    ref="panel"
                    :id="panelId"
                    data-pk-overlay
                    class="bg-popover fixed z-[100] overflow-hidden rounded-md border shadow-lg"
                    :style="{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        width: `${position.width}px`,
                    }"
                    role="listbox"
                >
                    <div v-if="showSearch" class="border-b p-1">
                        <input
                            ref="searchInput"
                            v-model="query"
                            type="text"
                            class="w-full bg-transparent px-2 py-1.5 text-sm outline-none"
                            :placeholder="searchPlaceholder"
                            @keydown="onKeydown"
                        />
                    </div>

                    <div class="max-h-60 overflow-y-auto p-1">
                        <button
                            v-for="(option, i) in available"
                            :key="option.value"
                            :id="optionId(i)"
                            type="button"
                            class="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm transition-colors"
                            :class="i === highlighted ? 'bg-accent' : 'hover:bg-accent/60'"
                            role="option"
                            aria-selected="false"
                            @mouseenter="highlighted = i"
                            @click="pick(option)"
                        >
                            {{ option.label }}
                        </button>

                        <p
                            v-if="available.length === 0"
                            class="text-muted-foreground px-2 py-3 text-sm"
                        >
                            <template v-if="atLimit">You have selected the maximum.</template>
                            <template v-else-if="query">Nothing matches “{{ query }}”.</template>
                            <template v-else>Everything is selected.</template>
                        </p>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>
