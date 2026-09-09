<script setup lang="ts">
/**
 * Renders one node of a VIEW-page schema tree.
 *
 * Deliberately separate from SchemaNode rather than a mode flag on it: a form
 * node owns editable state and emits changes, a view node is pure output. One
 * component doing both would carry an `if (readonly)` through every branch, and
 * that is how a read-only page ends up shipping an editable control by accident.
 *
 * Leaves are COLUMNS, the same objects the table renders, so a value cannot look
 * one way in the list and another here.
 *
 * Hierarchy tokens match SchemaNode section chrome: root sections are elevated
 * cards; entries use a quiet label / loud value contrast so scanning a record
 * page does not feel like reading a muted wall of text.
 */
import { computed, ref } from 'vue'
import { entryView, registeredEntryViews } from '../../composables/useEntryViews'
import { BADGE_VARIANTS, hasBadgeValue } from '../../composables/useSchemaColumns'
import ColourCell from '../DataTable/ColourCell.vue'
import IconCell from '../DataTable/IconCell.vue'
import ImageCell from '../DataTable/ImageCell.vue'
import { iconPath } from '../primitives/icons'
import PkBadge from '../primitives/PkBadge.vue'
import PkStatusBadge from '../primitives/PkStatusBadge.vue'

export interface InfoNode {
    component: 'entry' | 'section' | 'grid' | 'tabs' | 'tab'
    children?: InfoNode[]
    key?: string
    label?: string
    badge?: string | number | null
    description?: string
    columns?: number | ResponsiveColumns
    collapsible?: boolean
    collapsed?: boolean
    icon?: string | null
    /** Optional status chip next to a section title. */
    status?: string | null
    type?: string
    mono?: boolean
    muted?: boolean
    transform?: 'upper' | 'lower'
    prefix?: string
    suffix?: string
    colors?: Record<string, string>
    defaultColor?: string
    [key: string]: any
}

type ResponsiveColumns = Partial<Record<'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>

const props = withDefaults(
    defineProps<{
        node: InfoNode
        record: Record<string, any>
        /** 0 is the outermost layout node - the only one that draws a frame. */
        depth?: number
    }>(),
    { depth: 0 },
)

const emit = defineEmits<{
    (e: 'action', action: { key: string; label?: string; confirmation?: string }): void
}>()

const open = ref(!props.node.collapsed)
const activeTab = ref(0)

const isRoot = computed(() => props.depth === 0)

/**
 * Prefer a two-column entry grid when the schema did not declare a count.
 * A single long column of labels feels utilitarian; two columns match form
 * sections and let short fields scan side by side.
 */
const gridClass = computed(() => {
    const configured = props.node.columns
    const columns =
        typeof configured === 'number'
            ? configured
            : (configured?.default ??
              configured?.sm ??
              configured?.md ??
              (props.node.component === 'section' ? 2 : 1))

    return columns >= 3 ? 'sm:grid-cols-3' : columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'
})

function responsiveGridStyle(node: InfoNode): Record<string, string> {
    const columns = node.columns
    const values = typeof columns === 'number' ? { default: columns } : columns
    const style: Record<string, string> = {}

    for (const breakpoint of ['default', 'sm', 'md', 'lg', 'xl', '2xl'] as const) {
        const count = values?.[breakpoint]

        if (typeof count === 'number' && count > 0) {
            style[`--pk-grid-cols-${breakpoint}`] = String(Math.min(12, Math.max(1, count)))
        }
    }

    return style
}

const dateFormats: Record<string, Intl.DateTimeFormatOptions> = {
    date: { year: 'numeric', month: 'long', day: 'numeric' },
    datetime: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    },
}

const value = computed(() => (props.node.key ? props.record[props.node.key] : null))

const isBlank = computed(() => {
    const v = value.value

    return v === null || v === undefined || v === ''
})

const moneyDisplay = computed(() => {
    if (isBlank.value) {
        return 'None'
    }

    const raw = Number(value.value)

    if (Number.isNaN(raw)) {
        return 'None'
    }

    const divisor = props.node.divideBy ?? 100
    const amount = raw / divisor
    const currency = props.node.currency ?? 'USD'

    try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
    } catch {
        return `${currency} ${amount.toFixed(2)}`
    }
})

const display = computed(() => {
    if (isBlank.value) {
        return 'None'
    }

    const v = value.value

    if (props.node.type === 'date' || props.node.type === 'datetime') {
        return new Date(String(v)).toLocaleDateString(undefined, dateFormats[props.node.type])
    }

    if (props.node.type === 'money') {
        return moneyDisplay.value
    }

    let text = String(v)

    if (props.node.transform === 'upper') {
        text = text.toUpperCase()
    }

    if (props.node.transform === 'lower') {
        text = text.toLowerCase()
    }

    return [props.node.prefix, text, props.node.suffix].filter(Boolean).join(' ')
})

const badgeVariant = computed(() => {
    const lookup = typeof value.value === 'boolean' ? (value.value ? '1' : '') : String(value.value)
    const intent = props.node.colors?.[lookup] ?? props.node.defaultColor ?? 'neutral'

    return BADGE_VARIANTS[intent] ?? 'outline'
})

const registeredView = computed(() => {
    const name = typeof props.node.view === 'string' ? props.node.view : ''

    return name ? entryView(name) : undefined
})

const missingViewMessage = computed(() => {
    const name = typeof props.node.view === 'string' ? props.node.view : ''

    if (!name) {
        return 'ViewEntry has no view name.'
    }

    const registered = registeredEntryViews()
    const list = registered.length > 0 ? registered.join(', ') : '(none)'

    return `No entry view for [${name}]; registered: ${list}`
})
</script>

<template>
    <!-- Entry: a labelled value with quiet label / loud value contrast. -->
    <div v-if="node.component === 'entry'" class="flex flex-col gap-1">
        <dt class="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
            {{ node.label }}
        </dt>
        <dd class="text-foreground text-sm font-medium">
            <PkBadge
                v-if="node.type === 'badge' && hasBadgeValue(value)"
                :variant="badgeVariant as any"
                class="capitalize"
            >
                {{ value }}
            </PkBadge>
            <span v-else-if="node.type === 'badge'" class="text-muted-foreground font-normal"
                >None</span
            >
            <IconCell
                v-else-if="node.type === 'icon'"
                :value="value"
                :icons="node.icons"
                :colors="node.colors"
                :labels="node.labels"
                :default-icon="node.defaultIcon"
            />
            <ImageCell
                v-else-if="node.type === 'image'"
                :src="value"
                :fallback-text="record[node.fallbackFrom ?? 'name']"
                :rounded="node.rounded !== false"
                :size="node.size ?? 'md'"
                :fallback="node.fallback ?? 'initials'"
            />
            <ColourCell
                v-else-if="node.type === 'color' || node.type === 'colour'"
                :value="typeof value === 'string' ? value : null"
                :show-value="node.showValue !== false"
            />
            <div v-else-if="node.type === 'code'" class="max-w-full font-normal">
                <p
                    v-if="node.language"
                    class="text-muted-foreground mb-1 font-mono text-[10px] uppercase"
                >
                    {{ node.language }}
                </p>
                <pre
                    class="bg-muted/50 overflow-x-auto rounded-md border p-3 font-mono text-xs font-normal"
                ><code>{{ value ?? '' }}</code></pre>
            </div>
            <div v-else-if="node.type === 'keyvalue'" class="font-normal">
                <dl
                    v-if="
                        value &&
                        typeof value === 'object' &&
                        !Array.isArray(value) &&
                        Object.keys(value).length
                    "
                    class="divide-y rounded-md border"
                >
                    <div
                        v-for="(item, k) in value"
                        :key="k"
                        class="grid grid-cols-3 gap-2 px-3 py-2 text-sm"
                    >
                        <dt class="text-muted-foreground truncate font-medium">{{ k }}</dt>
                        <dd class="text-foreground col-span-2 break-words">{{ item }}</dd>
                    </div>
                </dl>
                <span v-else class="text-muted-foreground font-normal">None</span>
            </div>
            <div v-else-if="node.type === 'repeatable'" class="flex flex-col gap-3 font-normal">
                <div
                    v-for="(item, i) in Array.isArray(value) ? value : []"
                    :key="i"
                    class="rounded-md border p-3"
                >
                    <InfoNode
                        v-for="(child, j) in node.entries ?? []"
                        :key="j"
                        :node="child"
                        :record="item"
                        :depth="depth + 1"
                        @action="emit('action', $event)"
                    />
                </div>
                <span
                    v-if="!Array.isArray(value) || value.length === 0"
                    class="text-muted-foreground font-normal"
                    >None</span
                >
            </div>
            <span
                v-else-if="node.type === 'money'"
                :class="isBlank ? 'text-muted-foreground font-normal' : ''"
            >
                {{ moneyDisplay }}
            </span>
            <component
                :is="registeredView"
                v-else-if="node.type === 'view' && registeredView"
                :node="node"
                :record="record"
                :value="value"
            />
            <p
                v-else-if="node.type === 'view'"
                class="text-destructive text-xs font-normal"
                data-testid="missing-entry-view"
            >
                {{ missingViewMessage }}
            </p>
            <a
                v-else-if="node.url && !isBlank"
                :href="node.url"
                class="text-foreground font-medium underline-offset-2 hover:underline"
            >
                {{ display }}
            </a>
            <span
                v-else
                :class="[
                    isBlank || node.muted ? 'text-muted-foreground font-normal' : '',
                    node.mono ? 'font-mono text-xs' : '',
                ]"
            >
                {{ display }}
            </span>
            <button
                v-if="node.action"
                type="button"
                class="text-muted-foreground hover:text-foreground mt-0.5 text-xs font-normal underline-offset-2 hover:underline"
                @click="emit('action', node.action)"
            >
                {{ node.action.label }}
            </button>
        </dd>
    </div>

    <!-- Section: elevated chrome matches SchemaNode form sections. -->
    <section
        v-else-if="node.component === 'section'"
        :class="
            isRoot
                ? 'bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                : ''
        "
    >
        <header
            class="flex items-start justify-between gap-3"
            :class="[
                isRoot ? 'px-4 py-3.5 sm:px-5' : 'pb-2',
                node.collapsible ? 'cursor-pointer select-none' : '',
            ]"
            @click="node.collapsible && (open = !open)"
        >
            <div class="flex min-w-0 items-start gap-2.5">
                <div
                    v-if="node.icon"
                    class="bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md"
                    aria-hidden="true"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="size-3.5"
                    >
                        <path :d="iconPath(node.icon)" />
                    </svg>
                </div>
                <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                        <h3 class="text-sm font-semibold">{{ node.label }}</h3>
                        <PkStatusBadge
                            v-if="node.status"
                            :status="node.status"
                            class="capitalize"
                        />
                    </div>
                    <p v-if="node.description" class="text-muted-foreground mt-0.5 text-xs">
                        {{ node.description }}
                    </p>
                </div>
            </div>
        </header>

        <dl
            v-if="open"
            class="grid grid-cols-1 gap-x-6 gap-y-4"
            :class="[gridClass, isRoot ? 'border-t px-4 py-4 sm:px-5 sm:py-5' : '']"
        >
            <InfoNode
                v-for="(child, i) in node.children ?? []"
                :key="i"
                :node="child"
                :record="record"
                :depth="depth + 1"
                @action="emit('action', $event)"
            />
        </dl>
    </section>

    <!-- Grid. -->
    <dl
        v-else-if="node.component === 'grid'"
        class="pk-responsive-grid grid gap-x-6 gap-y-4"
        :style="responsiveGridStyle(node)"
    >
        <InfoNode
            v-for="(child, i) in node.children ?? []"
            :key="i"
            :node="child"
            :record="record"
            :depth="depth + 1"
            @action="emit('action', $event)"
        />
    </dl>

    <!-- Tabs. -->
    <div
        v-else-if="node.component === 'tabs'"
        :class="
            isRoot
                ? 'bg-card overflow-hidden rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                : ''
        "
    >
        <div
            class="bg-muted/30 flex gap-1 overflow-x-auto p-1"
            :class="isRoot ? 'border-b' : 'rounded-md'"
            role="tablist"
            aria-label="Information sections"
        >
            <button
                v-for="(tab, i) in node.children ?? []"
                :key="i"
                type="button"
                role="tab"
                class="shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors"
                :class="
                    activeTab === i
                        ? 'bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30'
                        : 'text-muted-foreground hover:text-foreground'
                "
                :aria-selected="activeTab === i"
                @click="activeTab = i"
            >
                {{ tab.label }}
                <PkBadge v-if="tab.badge !== null && tab.badge !== undefined" variant="secondary">
                    {{ tab.badge }}
                </PkBadge>
            </button>
        </div>

        <div
            v-for="(tab, i) in node.children ?? []"
            v-show="activeTab === i"
            :key="i"
            class="flex flex-col gap-5"
            :class="isRoot ? 'p-4 sm:p-5' : 'pt-4'"
        >
            <InfoNode
                v-for="(child, j) in tab.children ?? []"
                :key="j"
                :node="child"
                :record="record"
                :depth="depth + 1"
                @action="emit('action', $event)"
            />
        </div>
    </div>
</template>

<style scoped>
.pk-responsive-grid {
    grid-template-columns: repeat(var(--pk-grid-cols-default, 1), minmax(0, 1fr));
}

@media (min-width: 640px) {
    .pk-responsive-grid {
        grid-template-columns: repeat(
            var(--pk-grid-cols-sm, var(--pk-grid-cols-default, 1)),
            minmax(0, 1fr)
        );
    }
}

@media (min-width: 768px) {
    .pk-responsive-grid {
        grid-template-columns: repeat(
            var(--pk-grid-cols-md, var(--pk-grid-cols-sm, var(--pk-grid-cols-default, 1))),
            minmax(0, 1fr)
        );
    }
}

@media (min-width: 1024px) {
    .pk-responsive-grid {
        grid-template-columns: repeat(
            var(
                --pk-grid-cols-lg,
                var(--pk-grid-cols-md, var(--pk-grid-cols-sm, var(--pk-grid-cols-default, 1)))
            ),
            minmax(0, 1fr)
        );
    }
}

@media (min-width: 1280px) {
    .pk-responsive-grid {
        grid-template-columns: repeat(
            var(
                --pk-grid-cols-xl,
                var(
                    --pk-grid-cols-lg,
                    var(--pk-grid-cols-md, var(--pk-grid-cols-sm, var(--pk-grid-cols-default, 1)))
                )
            ),
            minmax(0, 1fr)
        );
    }
}

@media (min-width: 1536px) {
    .pk-responsive-grid {
        grid-template-columns: repeat(
            var(
                --pk-grid-cols-2xl,
                var(
                    --pk-grid-cols-xl,
                    var(
                        --pk-grid-cols-lg,
                        var(
                            --pk-grid-cols-md,
                            var(--pk-grid-cols-sm, var(--pk-grid-cols-default, 1))
                        )
                    )
                )
            ),
            minmax(0, 1fr)
        );
    }
}
</style>
