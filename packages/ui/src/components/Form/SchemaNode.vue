<script setup lang="ts">
/**
 * Renders one node of a form schema tree, recursing into its children.
 *
 * The tree mixes layout components and fields, discriminated by `component`.
 * Recursion is what lets a Section hold a Grid hold a Field at any depth without
 * the renderer knowing the shapes in advance.
 *
 * ONLY THE OUTERMOST LAYOUT NODE DRAWS A FRAME. A Section inside Tabs inside a
 * page card renders three nested bordered boxes - each individually reasonable,
 * collectively a set of Russian dolls that eats horizontal space and makes the
 * actual inputs look like a footnote. `depth` is how a node knows whether it is
 * the container or the contained.
 *
 * Layout carries only SEMANTIC values - `columns: 2`, `collapsible: true` - and
 * this file decides what those look like. PHP never emits a class
 * (antipatterns §6.1).
 */
import { computed, ref, watch } from 'vue'
import PkStepIndicator from '../Layout/PkStepIndicator.vue'
import { iconPath } from '../primitives/icons'
import PkBadge from '../primitives/PkBadge.vue'
import FormFieldControl from './FormFieldControl.vue'
import type { UploadedFileValue } from './PkFileUpload.vue'
import type { FormField } from './types'

export interface SchemaNode {
    component:
        | 'field'
        | 'section'
        | 'card'
        | 'columns'
        | 'column'
        | 'grid'
        | 'flex'
        | 'fieldset'
        | 'callout'
        | 'tabs'
        | 'tab'
        | 'wizard'
        | 'step'
    children?: SchemaNode[]
    label?: string
    badge?: string | number | null
    title?: string
    description?: string
    columns?: number | ResponsiveColumns
    span?: number
    collapsible?: boolean
    collapsed?: boolean
    icon?: string | null
    /** `flex` */
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
    gap?: 'sm' | 'md' | 'lg'
    wrap?: boolean
    /** `callout` */
    tone?: 'info' | 'success' | 'warning' | 'danger'
    body?: string
    /** `tabs`/`wizard`: the query-string key to remember position under, or
     * null when the node did not opt in. */
    persistInQueryString?: string | null
    [key: string]: any
}

export type ResponsiveColumns = Partial<
    Record<'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>
>

const props = withDefaults(
    defineProps<{
        node: SchemaNode
        values: Record<string, any>
        errors?: Record<string, string>
        options?: Record<string, { value: any; label: string }[]>
        processing?: boolean
        /** Supplied by the page; @alxtexh-enterprise/panel ships no HTTP client. */
        searchOptions?: (field: string, term: string) => Promise<{ value: any; label: string }[]>
        /** Performs an upload for a file field. See PkFileUpload. */
        upload?: (
            field: string,
            file: File,
            onProgress: (percent: number) => void,
        ) => Promise<UploadedFileValue>
        discard?: (handle: string) => Promise<void>
        /** 0 is the outermost layout node - the only one that draws a frame. */
        depth?: number
    }>(),
    { errors: () => ({}), options: () => ({}), processing: false, depth: 0 },
)

const emit = defineEmits<{
    (e: 'change', key: string, value: unknown): void
    (e: 'affix-action', field: string, action: string): void
}>()

const open = ref(!props.node.collapsed)

/**
 * The position a persisted `Tabs`/`Wizard` was left at, read from its own
 * query-string key - `?tab=2`, `?step=1` - so a refresh or a browser-back
 * return lands where it was left instead of resetting to the first one.
 * `0` (never `NaN`, never out of range) for a node that did not opt in, was
 * never visited with that key set, or was given a value that no longer
 * fits the tab/step count - a stale link from before a step was removed
 * should not open past the end of what still exists.
 */
function initialIndexFromQuery(): number {
    const key = props.node.persistInQueryString

    if (!key || typeof window === 'undefined') {
        return 0
    }

    const raw = new URLSearchParams(window.location.search).get(key)
    const parsed = raw === null ? NaN : Number.parseInt(raw, 10)
    const count = props.node.children?.length ?? 0

    return Number.isInteger(parsed) && parsed >= 0 && parsed < count ? parsed : 0
}

const activeTab = ref(props.node.component === 'tabs' ? initialIndexFromQuery() : 0)

/** Which wizard step is showing. Separate from `activeTab`: one node is one or the other. */
const activeStep = ref(props.node.component === 'wizard' ? initialIndexFromQuery() : 0)

/**
 * `history.replaceState`, NOT a `router.visit` or `pushState`. Every value
 * in a schema is already on the page - switching tabs or steps is local
 * state with nothing to fetch, so a request here would be pure latency for
 * no new data. `replaceState` over `pushState` for the same reason
 * `Tabs::persistInQueryString()`'s own docblock gives: a `pushState` entry
 * per switch would make the browser's own back button switch tabs instead
 * of leaving the page, which is not what anybody reaching for "back" wants.
 */
function syncQueryString(key: string | null | undefined, index: number): void {
    if (!key || typeof window === 'undefined') {
        return
    }

    const url = new URL(window.location.href)
    url.searchParams.set(key, String(index))
    window.history.replaceState(window.history.state, '', url)
}

watch(activeTab, (index) => syncQueryString(props.node.persistInQueryString, index))
watch(activeStep, (index) => syncQueryString(props.node.persistInQueryString, index))

/**
 * `PkStepIndicator` requires a label; a schema node's is optional because
 * every OTHER node kind may omit one. A wizard step never actually does -
 * `Step::class` on the PHP side requires it - so this is a type-shape fix,
 * not a fallback for data that is expected to arrive.
 */
const wizardSteps = computed(() =>
    (props.node.children ?? []).map((step) => ({
        label: step.label ?? '',
        description: step.description,
    })),
)

const isRoot = computed(() => props.depth === 0)

/**
 * The row's cross-axis alignment and gap, mapped from the schema.
 *
 * A MAP RATHER THAN INTERPOLATION. `items-${node.align}` would produce a class
 * Tailwind never generated, because Tailwind scans for literal strings and
 * cannot see one built at runtime - so the row would silently lose its
 * alignment and nothing would report it.
 */
const flexClass = computed(() => {
    const align: Record<string, string> = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
    }

    const gap: Record<string, string> = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' }

    return [
        align[props.node.align ?? 'start'] ?? 'items-start',
        gap[props.node.gap ?? 'md'] ?? 'gap-4',
        props.node.wrap === false ? 'flex-nowrap' : 'flex-wrap',
    ]
})

/**
 * A callout's tone.
 *
 * DANGER AND VALIDATION ERRORS DO NOT SHARE STYLING. An authored warning that
 * borrowed the error colours would teach people to read red as "I typed
 * something wrong" and dismiss it - so danger is a filled, bordered surface
 * rather than the bare red text an invalid field gets.
 */
const calloutClass = computed(() => {
    const tones: Record<string, string> = {
        info: 'border-border bg-muted/50 text-foreground',
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200',
        warning: 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200',
        danger: 'border-destructive/30 bg-destructive/10 text-destructive',
    }

    return tones[props.node.tone ?? 'info'] ?? tones.info
})

const gridClass = computed(() => {
    const configured = props.node.columns
    const columns =
        typeof configured === 'number'
            ? configured
            : (configured?.default ?? configured?.sm ?? configured?.md ?? 1)

    return columns >= 3 ? 'sm:grid-cols-3' : columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1'
})

function columnsGridClass(node: SchemaNode): string {
    const count = node.children?.length ?? 1

    if (count >= 3) {
        return 'md:grid-cols-3'
    }

    if (count === 2) {
        return 'md:grid-cols-2'
    }

    return 'md:grid-cols-1'
}

/**
 * Responsive Grid::make() values are carried as CSS custom properties. This
 * keeps the server schema semantic and avoids interpolated Tailwind classes,
 * which Tailwind cannot see at build time.
 */
function responsiveGridStyle(node: SchemaNode): Record<string, string> {
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

function columnSpanClass(span = 1): string {
    if (span >= 4) {
        return 'md:col-span-4'
    }

    if (span === 3) {
        return 'md:col-span-3'
    }

    if (span === 2) {
        return 'md:col-span-2'
    }

    return 'md:col-span-1'
}

/**
 * Whether a tab contains a field with an error.
 *
 * Without this, submitting an invalid form can highlight nothing at all: the
 * offending field sits behind an inactive tab, so the user sees a rejected save
 * and no reason for it.
 */
function tabHasError(tab: SchemaNode): boolean {
    const keys: string[] = []

    const walk = (node: SchemaNode) => {
        if (node.component === 'field' && node.key) {
            keys.push(node.key)
        }

        node.children?.forEach(walk)
    }

    walk(tab)

    return keys.some((key) => props.errors[key])
}

/**
 * Binds the field key into the page's upload function.
 *
 * A small indirection so the template does not have to carry an annotated
 * arrow - inline type annotations inside a template expression do not parse,
 * and the resulting error points at the attribute rather than at the cause.
 */
/**
 * Whether a conditional field's controlling value currently matches.
 *
 * LOOSE COMPARISON on purpose. A toggle's value is `true` in the form state and
 * the condition may have been declared as `1` on the PHP side - strict equality
 * would silently never match, and the field would simply never appear, which
 * looks like a missing field rather than a comparison bug.
 */
function conditionMet(node: Record<string, any>): boolean {
    if (node.hidden) {
        return false
    }

    const condition = node.visibleWhen

    if (!condition) {
        return true
    }

    return props.values[condition.field] == condition.value
}

function uploadFor(key: string) {
    if (!props.upload) {
        return undefined
    }

    return (file: File, onProgress: (percent: number) => void) =>
        props.upload!(key, file, onProgress)
}
</script>

<template>
    <!--
        Field: a leaf.

        A CONDITIONAL FIELD IS NOT RENDERED when its condition is unmet, rather
        than rendered and hidden with CSS. A hidden-but-present control is still
        focusable by keyboard and still submits its value, so `display: none` on
        a form field is a way of sending data nobody can see.

        This is presentation only. The server derives `required_if` from the same
        declaration, so what is enforced does not depend on what was drawn.
    -->
    <FormFieldControl
        v-if="node.component === 'field' && conditionMet(node)"
        :field="node as unknown as FormField"
        :value="values[node.key]"
        :values="values"
        :error="errors[node.key]"
        :errors="errors"
        :options="options[node.key]"
        :child-options="options"
        :processing="processing"
        :search-options="
            node.searchable && searchOptions
                ? (term: string) => searchOptions!(node.key, term)
                : undefined
        "
        :upload="uploadFor(node.key)"
        :discard="discard"
        @change="(value: unknown) => emit('change', node.key, value)"
        @affix-action="(action: string) => emit('affix-action', node.key, action)"
    />

    <!--
        Section. Framed at the root, a plain labelled group when nested.

        A CONDITIONAL SECTION IS NOT RENDERED when its condition is unmet,
        the same choice made for a conditional field above and for the same
        reason - a disabled-but-present group still occupies the page and
        still submits whatever is in it. `Form::sanitize()` is the actual
        enforcement, from the same declaration; this is what makes a hidden
        section look like what it is on the server.
    -->
    <section
        v-else-if="node.component === 'section' && conditionMet(node)"
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
                    <h3 class="text-sm font-semibold">{{ node.label }}</h3>
                    <p v-if="node.description" class="text-muted-foreground mt-0.5 text-xs">
                        {{ node.description }}
                    </p>
                </div>
            </div>

            <svg
                v-if="node.collapsible"
                viewBox="0 0 24 24"
                class="text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform"
                :class="open ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        </header>

        <div
            v-if="open"
            class="grid grid-cols-1 gap-4"
            :class="[gridClass, isRoot ? 'border-t px-4 py-4 sm:px-5 sm:py-5' : '']"
        >
            <div
                v-for="(child, i) in node.children ?? []"
                :key="i"
                :class="child.span && child.span >= 2 ? 'sm:col-span-2' : ''"
            >
                <SchemaNode
                    :node="child"
                    :values="values"
                    :errors="errors"
                    :options="options"
                    :processing="processing"
                    :search-options="searchOptions"
                    :upload="upload"
                    :discard="discard"
                    :depth="depth + 1"
                    @change="(key: string, value: unknown) => emit('change', key, value)"
                    @affix-action="
                        (field: string, action: string) => emit('affix-action', field, action)
                    "
                />
            </div>
        </div>
    </section>

    <!-- Card: titled shell for page layouts. -->
    <section
        v-else-if="node.component === 'card' && conditionMet(node)"
        class="bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10"
    >
        <header class="border-b px-4 py-3.5 sm:px-5">
            <h3 class="text-sm font-semibold">{{ node.title }}</h3>
            <p v-if="node.description" class="text-muted-foreground mt-0.5 text-xs">
                {{ node.description }}
            </p>
        </header>

        <div class="grid grid-cols-1 gap-4 px-4 py-4" :class="gridClass">
            <SchemaNode
                v-for="(child, i) in node.children ?? []"
                :key="i"
                :node="child"
                :values="values"
                :errors="errors"
                :options="options"
                :processing="processing"
                :search-options="searchOptions"
                :upload="upload"
                :discard="discard"
                :depth="depth + 1"
                @change="(key: string, value: unknown) => emit('change', key, value)"
                @affix-action="
                    (field: string, action: string) => emit('affix-action', field, action)
                "
            />
        </div>
    </section>

    <!-- Columns: responsive row of Column nodes. -->
    <div
        v-else-if="node.component === 'columns' && conditionMet(node)"
        class="grid grid-cols-1 gap-4"
        :class="columnsGridClass(node)"
    >
        <div
            v-for="(child, i) in node.children ?? []"
            :key="i"
            :class="child.component === 'column' ? columnSpanClass(child.span) : ''"
        >
            <SchemaNode
                :node="child"
                :values="values"
                :errors="errors"
                :options="options"
                :processing="processing"
                :search-options="searchOptions"
                :upload="upload"
                :discard="discard"
                :depth="depth + 1"
                @change="(key: string, value: unknown) => emit('change', key, value)"
                @affix-action="
                    (field: string, action: string) => emit('affix-action', field, action)
                "
            />
        </div>
    </div>

    <!-- Column: one slot inside Columns. -->
    <div v-else-if="node.component === 'column' && conditionMet(node)" class="min-w-0 space-y-4">
        <SchemaNode
            v-for="(child, i) in node.children ?? []"
            :key="i"
            :node="child"
            :values="values"
            :errors="errors"
            :options="options"
            :processing="processing"
            :search-options="searchOptions"
            :upload="upload"
            :discard="discard"
            :depth="depth + 1"
            @change="(key: string, value: unknown) => emit('change', key, value)"
            @affix-action="(field: string, action: string) => emit('affix-action', field, action)"
        />
    </div>

    <!-- Grid: layout with no heading, so it never draws a frame. -->
    <div
        v-else-if="node.component === 'grid' && conditionMet(node)"
        class="pk-responsive-grid grid gap-4"
        :style="responsiveGridStyle(node)"
    >
        <SchemaNode
            v-for="(child, i) in node.children ?? []"
            :key="i"
            :node="child"
            :values="values"
            :errors="errors"
            :options="options"
            :processing="processing"
            :search-options="searchOptions"
            :upload="upload"
            :discard="discard"
            :depth="depth + 1"
            @change="(key: string, value: unknown) => emit('change', key, value)"
            @affix-action="(field: string, action: string) => emit('affix-action', field, action)"
        />
    </div>

    <!--
        Flex: a row of things that are NOT the same size. A grid would give the
        short one an equal column and leave it floating in whitespace.
    -->
    <div
        v-else-if="node.component === 'flex' && conditionMet(node)"
        class="flex"
        :class="flexClass"
    >
        <SchemaNode
            v-for="(child, i) in node.children ?? []"
            :key="i"
            :node="child"
            :values="values"
            :errors="errors"
            :options="options"
            :processing="processing"
            :search-options="searchOptions"
            :upload="upload"
            :discard="discard"
            :depth="depth + 1"
            @change="(key: string, value: unknown) => emit('change', key, value)"
            @affix-action="(field: string, action: string) => emit('affix-action', field, action)"
        />
    </div>

    <!--
        Fieldset: a named part of the surface it is already on, not a new one.

        A REAL `<fieldset>` AND `<legend>`, not a styled div. A screen reader
        announces the legend before every control inside, so "Line 1" is heard
        as "Billing address, Line 1" - which is the whole reason this element
        exists. The visual grouping is the smaller half of what it does.
    -->
    <fieldset
        v-else-if="node.component === 'fieldset' && conditionMet(node)"
        class="flex flex-col gap-3"
    >
        <legend class="text-sm font-medium">{{ node.label }}</legend>

        <p v-if="node.description" class="text-muted-foreground -mt-2 text-sm">
            {{ node.description }}
        </p>

        <div class="grid grid-cols-1 gap-4" :class="gridClass">
            <SchemaNode
                v-for="(child, i) in node.children ?? []"
                :key="i"
                :node="child"
                :values="values"
                :errors="errors"
                :options="options"
                :processing="processing"
                :search-options="searchOptions"
                :upload="upload"
                :discard="discard"
                :depth="depth + 1"
                @change="(key: string, value: unknown) => emit('change', key, value)"
                @affix-action="
                    (field: string, action: string) => emit('affix-action', field, action)
                "
            />
        </div>
    </fieldset>

    <!--
        Callout: a consequence, stated where the control that causes it is.

        `role="note"` RATHER THAN `alert`. An alert interrupts a screen reader
        mid-sentence, which is right for something that just went wrong and
        wrong for text that has been on the page since it loaded.
    -->
    <div
        v-else-if="node.component === 'callout' && conditionMet(node)"
        role="note"
        class="rounded-lg border px-4 py-3 text-sm"
        :class="calloutClass"
    >
        <p v-if="node.title" class="mb-1 font-medium">{{ node.title }}</p>
        <p>{{ node.body }}</p>
    </div>

    <!-- Tabs. -->
    <div
        v-else-if="node.component === 'tabs' && conditionMet(node)"
        :class="
            isRoot
                ? 'bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                : ''
        "
    >
        <div
            class="bg-muted/30 flex gap-1 overflow-x-auto p-1"
            :class="isRoot ? 'rounded-t-lg border-b' : 'rounded-md'"
        >
            <button
                v-for="(tab, i) in node.children ?? []"
                :key="i"
                type="button"
                class="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors"
                :class="
                    activeTab === i
                        ? 'bg-background text-foreground font-medium shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                "
                @click="activeTab = i"
            >
                {{ tab.label }}
                <PkBadge v-if="tab.badge !== null && tab.badge !== undefined" variant="secondary">
                    {{ tab.badge }}
                </PkBadge>
                <!-- An error behind an inactive tab is otherwise invisible. -->
                <span
                    v-if="tabHasError(tab)"
                    class="bg-destructive size-1.5 rounded-full"
                    aria-label="has errors"
                />
            </button>
        </div>

        <!--
            Every tab stays MOUNTED, hidden with v-show rather than v-if.

            v-if would destroy the inputs in inactive tabs, so switching tabs
            would discard anything typed in them, and a field with a validation
            error would unmount before the user could read it.
        -->
        <div
            v-for="(tab, i) in node.children ?? []"
            v-show="activeTab === i"
            :key="i"
            class="flex flex-col gap-5"
            :class="isRoot ? 'p-4' : 'pt-4'"
        >
            <SchemaNode
                v-for="(child, j) in tab.children ?? []"
                :key="j"
                :node="child"
                :values="values"
                :errors="errors"
                :options="options"
                :processing="processing"
                :search-options="searchOptions"
                :upload="upload"
                :discard="discard"
                :depth="depth + 1"
                @change="(key: string, value: unknown) => emit('change', key, value)"
                @affix-action="
                    (field: string, action: string) => emit('affix-action', field, action)
                "
            />
        </div>
    </div>

    <!--
        Wizard: the same tree as tabs, walked in order.

        THE STEPPER IS NOT A TAB STRIP. A tab strip says "these are equally
        available"; a stepper says "this comes after that", which is the only
        reason to use a wizard rather than tabs. So earlier steps are reachable
        by clicking - going back to correct something is always allowed - and
        later ones are not, because they are the ones that may depend on
        answers not yet given.

        EVERY STEP STAYS MOUNTED, for the same reason every tab does: v-if would
        destroy the inputs on the step you just left, so going back to fix a
        value would find it gone.
    -->
    <div
        v-else-if="node.component === 'wizard' && conditionMet(node)"
        :class="
            isRoot
                ? 'bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                : ''
        "
    >
        <PkStepIndicator
            class="p-4"
            :class="isRoot ? 'border-b' : ''"
            :steps="wizardSteps"
            :active-step="activeStep"
            :has-error="(i: number) => tabHasError((node.children ?? [])[i])"
            @update:active-step="activeStep = $event"
        />

        <div
            v-for="(step, i) in node.children ?? []"
            v-show="activeStep === i"
            :key="i"
            class="flex flex-col gap-5"
            :class="isRoot ? 'p-4' : 'pt-4'"
        >
            <SchemaNode
                v-for="(child, j) in step.children ?? []"
                :key="j"
                :node="child"
                :values="values"
                :errors="errors"
                :options="options"
                :processing="processing"
                :search-options="searchOptions"
                :upload="upload"
                :discard="discard"
                :depth="depth + 1"
                @change="(key: string, value: unknown) => emit('change', key, value)"
                @affix-action="
                    (field: string, action: string) => emit('affix-action', field, action)
                "
            />
        </div>

        <div class="flex items-center justify-between gap-3 border-t p-4">
            <button
                type="button"
                class="text-foreground hover:bg-accent rounded-md border px-3 py-1.5 text-sm transition-colors disabled:pointer-events-none disabled:opacity-40"
                :disabled="activeStep === 0"
                @click="activeStep--"
            >
                Back
            </button>

            <!--
                NEXT IS NOT DISABLED ON ERRORS, deliberately.

                Blocking the button leaves somebody stuck with no explanation of
                what is wrong - the classic "the button does nothing" wizard.
                Advancing is allowed; the step keeps its error dot, and the
                submit at the end validates everything server-side regardless.
            -->
            <button
                v-if="activeStep < (node.children ?? []).length - 1"
                type="button"
                class="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm transition-opacity hover:opacity-90"
                @click="activeStep++"
            >
                Next
            </button>
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
