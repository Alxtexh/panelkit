<script setup lang="ts">
/**
 * A badge that opens a "Select status" list and writes the cell.
 *
 * IT DOES NOT FETCH. Same contract as EditableCell: emit `change`, show the
 * value it was given, disable while busy. The page PATCHes `/{id}/cell`.
 *
 * COLOURS ARE SCHEMA INTENTS, not tenant brand. `success` / `warning` /
 * `destructive` / `info` are the dedicated tokens PkBadge already owns.
 *
 * SOFT BY DEFAULT, unlike a hand-placed PkBadge. This is the pill a table
 * repeats down every row; a column of solid, saturated fills reads louder
 * than a status column should. Pass `soft={false}` for a screen that wants
 * the bolder single-badge look instead.
 */
import { computed } from 'vue'
import { BADGE_VARIANTS } from '../../composables/useSchemaColumns'
import { iconPath } from '../primitives/icons'
import PkBadge from '../primitives/PkBadge.vue'
import PkDropdown from '../primitives/PkDropdown.vue'

const props = withDefaults(
    defineProps<{
        value: unknown
        options?: Record<string, string>
        colors?: Record<string, string>
        defaultColor?: string
        label?: string
        busy?: boolean
        disabled?: boolean
        soft?: boolean
    }>(),
    {
        options: () => ({}),
        colors: () => ({}),
        defaultColor: 'neutral',
        label: 'value',
        busy: false,
        disabled: false,
        soft: true,
    },
)

const emit = defineEmits<{ (e: 'change', value: string): void }>()

const locked = computed(() => props.busy || props.disabled)

const current = computed(() => String(props.value ?? ''))

const title = computed(() => {
    const name = (props.label || 'value').trim().toLowerCase()

    return `Select ${name}`
})

function lookup(value: unknown): string {
    if (typeof value === 'boolean') {
        return value ? '1' : ''
    }

    return String(value ?? '')
}

function variant(value: unknown): string {
    const intent = props.colors[lookup(value)] ?? props.defaultColor ?? 'neutral'

    return BADGE_VARIANTS[intent] ?? 'outline'
}

function optionLabel(value: string): string {
    return props.options[value] ?? value
}

function pick(next: string, close: () => void) {
    if (locked.value || next === current.value) {
        close()

        return
    }

    emit('change', next)
    close()
}
</script>

<template>
    <div @click.stop>
        <PkDropdown v-if="!disabled" align="start">
            <template #trigger>
                <button
                    type="button"
                    class="inline-flex items-center gap-0.5 rounded-full disabled:opacity-50"
                    :disabled="locked"
                    :aria-label="title"
                    :aria-busy="busy"
                >
                    <PkBadge :variant="variant(value) as any" :soft="soft" class="capitalize">
                        {{ optionLabel(current) || '-' }}
                    </PkBadge>
                    <svg
                        class="text-muted-foreground size-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path :d="iconPath('chevron-down')" />
                    </svg>
                </button>
            </template>
            <template #panel="{ close }">
                <div class="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                    {{ title }}
                </div>
                <button
                    v-for="(option, key) in options"
                    :key="key"
                    type="button"
                    role="menuitem"
                    class="hover:bg-accent flex w-full items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-left disabled:opacity-50"
                    :disabled="locked"
                    @click="pick(String(key), close)"
                >
                    <PkBadge :variant="variant(key) as any" :soft="soft" class="capitalize">
                        {{ option }}
                    </PkBadge>
                    <svg
                        v-if="String(key) === current"
                        class="size-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-label="Current"
                    >
                        <path :d="iconPath('check')" />
                    </svg>
                    <span v-else class="size-4 shrink-0" aria-hidden="true" />
                </button>
            </template>
        </PkDropdown>
        <PkBadge v-else :variant="variant(value) as any" :soft="soft" class="capitalize">
            {{ optionLabel(current) || '-' }}
        </PkBadge>
    </div>
</template>
