<script setup lang="ts">
/**
 * The real panel, in a device-shaped viewport.
 *
 * AN IFRAME, so media queries fire against the frame, not the outer window.
 * `url` is empty until the host page fills it (panel home).
 */
import { Head } from '@inertiajs/vue3'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { PkDeviceFrame } from '@alxtexh-enterprise/panel'

defineOptions({ inheritAttrs: false })

interface Device {
    id: string
    label: string
    width: number
    height: number
    notch: boolean
    kind: 'phone' | 'laptop'
}

const DEVICES: Device[] = [
    { id: 'iphone-se', label: 'iPhone SE', width: 375, height: 667, notch: false, kind: 'phone' },
    { id: 'iphone-13', label: 'iPhone 13', width: 390, height: 844, notch: true, kind: 'phone' },
    { id: 'pixel-7', label: 'Pixel 7', width: 412, height: 915, notch: false, kind: 'phone' },
    { id: 'ipad-mini', label: 'iPad mini', width: 744, height: 1000, notch: false, kind: 'phone' },
    {
        id: 'laptop-13',
        label: '13" laptop',
        width: 1280,
        height: 800,
        notch: false,
        kind: 'laptop',
    },
    {
        id: 'laptop-14',
        label: '14" laptop',
        width: 1440,
        height: 900,
        notch: false,
        kind: 'laptop',
    },
    {
        id: 'laptop-16',
        label: '16" laptop',
        width: 1680,
        height: 1050,
        notch: false,
        kind: 'laptop',
    },
]

const props = withDefaults(
    defineProps<{
        pageHeading?: string
        pageDescription?: string | null
        url?: string
    }>(),
    {
        url: '',
    },
)

const device = ref(DEVICES[1])
const landscape = ref(false)
const isLaptop = computed(() => device.value.kind === 'laptop')
const src = computed(() => (props.url !== '' ? props.url : '/'))

const size = computed(() =>
    landscape.value && !isLaptop.value
        ? { width: device.value.height, height: device.value.width }
        : { width: device.value.width, height: device.value.height },
)

const available = ref(0)
const viewport = ref<HTMLElement | null>(null)

const scale = computed(() => {
    const needed = size.value.width + 80

    if (available.value === 0 || needed <= available.value) {
        return 1
    }

    return Math.max(0.25, available.value / needed)
})

let observer: ResizeObserver | null = null

onMounted(() => {
    if (!viewport.value) {
        return
    }

    observer = new ResizeObserver((entries) => {
        available.value = entries[0]?.contentRect.width ?? 0
    })

    observer.observe(viewport.value)
})

onBeforeUnmount(() => observer?.disconnect())

const frameKey = computed(() => `${device.value.id}-${landscape.value}-${src.value}`)
</script>

<template>
    <Head :title="pageHeading ?? 'Device preview'" />

    <div class="flex flex-col gap-4 p-4">
        <header class="space-y-1">
            <h1 class="text-xl font-semibold">{{ pageHeading ?? 'Device preview' }}</h1>
            <p class="text-sm text-muted-foreground font-normal">
                {{
                    pageDescription ?? 'The panel itself, at real device sizes. Navigate inside it.'
                }}
            </p>
        </header>

        <div class="flex flex-wrap items-center gap-2">
            <div class="flex items-center gap-1 rounded-md bg-muted/40 p-1">
                <button
                    v-for="d in DEVICES"
                    :key="d.id"
                    type="button"
                    class="rounded px-2.5 py-1 text-xs transition-colors"
                    :class="
                        device.id === d.id
                            ? 'bg-background font-semibold text-foreground shadow-sm ring-2 ring-primary/30'
                            : 'text-muted-foreground hover:text-foreground'
                    "
                    @click="device = d"
                >
                    {{ d.label }}
                </button>
            </div>

            <button
                type="button"
                class="rounded-md border px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="isLaptop"
                :title="isLaptop ? 'Laptops do not rotate' : undefined"
                @click="landscape = !landscape"
            >
                {{ landscape ? 'Portrait' : 'Landscape' }}
            </button>

            <span class="text-xs text-muted-foreground font-normal tabular-nums">
                {{ size.width }} × {{ size.height }}
                <template v-if="scale < 1"> · shown at {{ Math.round(scale * 100) }}%</template>
            </span>
        </div>

        <div ref="viewport" class="flex justify-center overflow-hidden py-4">
            <div class="origin-top transition-transform" :style="{ transform: `scale(${scale})` }">
                <PkDeviceFrame
                    :width="size.width"
                    :height="size.height"
                    :notch="device.notch && !landscape"
                    :kind="device.kind"
                >
                    <iframe
                        :key="frameKey"
                        :src="src"
                        class="size-full border-0 bg-white"
                        title="The panel at this device size"
                    />
                </PkDeviceFrame>
            </div>
        </div>
    </div>
</template>
