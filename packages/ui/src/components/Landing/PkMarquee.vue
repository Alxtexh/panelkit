<script setup lang="ts">
import { computed } from 'vue'
import PkSection from './PkSection.vue'

const props = withDefaults(
    defineProps<{
        title?: string
        items?: { name: string; href?: string }[]
        speed?: 'slow' | 'normal' | 'fast'
        reverse?: boolean
    }>(),
    { title: '', items: () => [], speed: 'normal', reverse: false },
)

const loop = computed(() => [...props.items, ...props.items])
</script>

<template>
    <PkSection v-if="items.length" class="overflow-hidden" :aria-label="title || 'Highlights'">
        <p
            v-if="title"
            class="mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
        >
            {{ title }}
        </p>
        <div
            class="pk-marquee"
            :class="[`pk-marquee-${speed}`, reverse ? 'pk-marquee-reverse' : '']"
        >
            <div class="pk-marquee-track" role="list">
                <template v-for="(item, index) in loop" :key="`${item.name}-${index}`">
                    <a v-if="item.href" :href="item.href" role="listitem" class="pk-marquee-item">{{
                        item.name
                    }}</a>
                    <span v-else role="listitem" class="pk-marquee-item">{{ item.name }}</span>
                </template>
            </div>
        </div>
    </PkSection>
</template>
