<script setup lang="ts">
/**
 * An inline link inside prose, underlined the way the reference app underlines.
 *
 * MOVED, NOT REDRAWN - `components/TextLink.vue`. The decoration colours are
 * the part worth preserving: a link that underlines in the text colour reads as
 * emphasis, and one that underlines in a lighter neutral reads as a link.
 */
import { Link } from '@inertiajs/vue3'
import type { InertiaLinkProps } from '@inertiajs/vue3'

defineProps<{
    href: string
    tabindex?: number
    method?: InertiaLinkProps['method']
    as?: string
}>()
</script>

<template>
    <Link
        :href="href"
        :tabindex="tabindex"
        :method="method"
        :as="as"
        class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
    >
        <slot />
    </Link>
</template>
