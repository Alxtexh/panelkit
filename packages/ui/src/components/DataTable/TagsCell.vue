<script setup lang="ts">
/**
 * Chips for a TagsColumn value.
 *
 * Accepts an array, a JSON array string, or a separator-split string. `limit`
 * caps visible chips; the rest collapse to "+N".
 */
import { computed } from 'vue'
import PkBadge from '../primitives/PkBadge.vue'

const props = withDefaults(
    defineProps<{
        value: unknown
        limit?: number | null
        separator?: string
    }>(),
    {
        limit: null,
        separator: ',',
    },
)

function asTags(value: unknown, separator: string): string[] {
    if (value === null || value === undefined || value === '') {
        return []
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => (item === null || item === undefined ? '' : String(item).trim()))
            .filter((item) => item !== '')
    }

    if (typeof value === 'string') {
        const trimmed = value.trim()

        if (trimmed.startsWith('[')) {
            try {
                const parsed = JSON.parse(trimmed) as unknown

                if (Array.isArray(parsed)) {
                    return asTags(parsed, separator)
                }
            } catch {
                // Fall through to separator split.
            }
        }

        return trimmed
            .split(separator)
            .map((part) => part.trim())
            .filter((part) => part !== '')
    }

    return [String(value)]
}

const tags = computed(() => asTags(props.value, props.separator))

const visible = computed(() => {
    if (props.limit === null || props.limit === undefined || props.limit < 1) {
        return tags.value
    }

    return tags.value.slice(0, props.limit)
})

const remainder = computed(() => Math.max(0, tags.value.length - visible.value.length))
</script>

<template>
    <span v-if="tags.length === 0" class="text-muted-foreground text-sm font-normal">-</span>
    <span v-else class="inline-flex flex-wrap items-center gap-1">
        <PkBadge v-for="tag in visible" :key="tag" variant="secondary">
            {{ tag }}
        </PkBadge>
        <PkBadge v-if="remainder > 0" variant="outline">+{{ remainder }}</PkBadge>
    </span>
</template>
