<script setup lang="ts">
/*
 * EVERY PAGE PROP ARRIVES AS AN ATTRIBUTE, and this page's root is a
 * fragment. Inertia binds the whole payload onto the page component -
 * declared props bind as props, and the shared ones (panelNav, auth,
 * locale, and every deferred prop as it lands) arrive as plain
 * attributes with nowhere to go. Vue then warns once per prop, per
 * visit, which reads exactly like the page reloading in a loop.
 */
defineOptions({ inheritAttrs: false })

/**
 * Read-only detail page for any resource.
 *
 * Driven entirely by the schema's columns, so no resource contributes Vue. A
 * dedicated page rather than a modal for the same reasons as the form: it is
 * linkable, survives a refresh, and is what an operator pastes into a ticket.
 *
 * Fields render through the same semantic mapping the table uses - badge
 * colours from the schema's intent map, dates by column type - so a value never
 * looks one way in the list and another here.
 */
import { Head, Link, router, usePage } from '@inertiajs/vue3'
import { computed, ref, toRef } from 'vue'
import { toast } from 'vue-sonner'
import { PkBadge as Badge } from '@alxtexh-enterprise/panel'
import {
    FORM_MEASURE,
    PAGE_SHELL_COMPACT,
    PkButton as Button,
    PkModal,
    PkPageHeader,
    buttonClasses,
} from '@alxtexh-enterprise/panel'
/*
 * THE SAME CELLS THE TABLE USES, not new ones.
 *
 * This page rendered `badge` and turned everything else into a string, so a
 * record whose list row showed a colour swatch, an icon or a thumbnail showed
 * `#1e90ff`, `active` and a URL on its own page. The renderers existed and
 * were exported the whole time; nothing imported them here.
 *
 * Reusing them rather than writing entry components means a column type can
 * never render one way in a list and another way on the record - which is the
 * bug this shape is most likely to grow.
 */
import {
    CheckboxCell,
    ColourCell,
    IconCell,
    ImageCell,
    InfoNode,
    RelationCreateDialog,
    RelationPanel,
    useSchemaColumns,
} from '@alxtexh-enterprise/panel'
import type { SchemaColumn } from '@alxtexh-enterprise/panel'
import AuditTimeline from '../components/AuditTimeline.vue'
import CommentsSection from '../components/CommentsSection.vue'
import RecordPresence from '../components/RecordPresence.vue'
import RenderHook from '../components/RenderHook.vue'
import WorkflowHistory from '../components/WorkflowHistory.vue'
import { formatMoney } from '../lib/money'

const props = defineProps<{
    schema: {
        key: string
        label: string
        labelPlural: string
        routes: { index: string; audit?: string | null }
        table: { columns: SchemaColumn[] }
        /** Optional layout tree. Falls back to a flat list when empty. */
        infolist: any[]
        /** Related lists. Structure only - rows arrive on demand. */
        relations?: {
            key: string
            label: string
            icon: string | null
            table: {
                columns: SchemaColumn[]
                filters?: {
                    key: string
                    label: string
                    type: string
                    options?: string[]
                    trueLabel?: string
                    falseLabel?: string
                    presets?: Record<string, string>
                }[]
            }
            form?: { nodes?: unknown[] } | null
            canCreate?: boolean
            canEdit?: boolean
            inlineCreate?: boolean
            pages?: { resource: string } | null
        }[]
    }
    record: Record<string, any>
    can: { update: boolean; delete: boolean }
    /** Option lists for inline relation create dialogs. */
    relationFormOptions?: Record<string, Record<string, { value: any; label: string }[]>>
    /** Markup contributed by plugins, at named positions - roadmap 4.4. */
    renderHooks?: { position: string; component: string; props: Record<string, unknown> }[]
    /** Workflow transitions available on this record, when the resource declares one. */
    workflow?: {
        column: string
        /** `Workflow::groupLabel()` - defaults to "Status". */
        group: string
        current: string
        currentLabel: string
        currentColor: string
        diagramUrl?: string | null
        states?: Record<string, { label: string; color: string }>
        history?: {
            id: number | string
            actor: string | null
            at: string | null
            column: string | null
            from: string | null
            to: string | null
        }[]
        actions: {
            key: string
            label: string
            icon?: string
            color?: string
            confirm?: string
        }[]
    } | null
    /** Record comments when the resource opted in via `comments()`. */
    comments?: {
        label: string
        url: string
        canCreate: boolean
    } | null
    breadcrumbs: { title: string; href: string }[]
}>()

/**
 * Layout when the resource declares one; a flat list of its table columns
 * otherwise - which is what every resource had before layout existed, so
 * nothing that has not opted in changes.
 */
const hasLayout = computed(() => (props.schema.infolist?.length ?? 0) > 0)

const schemaColumns = toRef(() => props.schema.table.columns)
const { byKey, badgeVariant } = useSchemaColumns(schemaColumns)

const title = computed(() => String(props.record.name ?? `#${props.record.id}`))

const page = usePage()

const presenceTenantId = computed(() => {
    const workspaces = (page.props as any).workspaces as {
        current?: { id?: string | number }
    } | null

    if (workspaces?.current?.id != null) {
        return workspaces.current.id
    }

    return (page.props as any).auth?.user?.tenant_id ?? null
})

/**
 * Optional status chip beside the page title. Prefer a badge column named
 * `status`; otherwise the first badge column on the table schema.
 */
const statusColumn = computed(() => {
    if (props.workflow?.current) {
        return {
            key: props.workflow.column.includes('.')
                ? props.workflow.column.split('.').pop()!
                : props.workflow.column,
            type: 'badge' as const,
            label: props.workflow.group ?? 'Status',
        }
    }

    const columns = props.schema.table.columns
    const named = columns.find((column) => column.key === 'status' && column.type === 'badge')

    if (named) {
        return named
    }

    return columns.find((column) => column.type === 'badge') ?? null
})

const statusLabel = computed(() => {
    if (props.workflow?.currentLabel) {
        return props.workflow.currentLabel
    }

    const column = statusColumn.value

    if (!column) {
        return ''
    }

    return String(props.record[column.key] ?? '')
})

const statusVariant = computed(() => {
    if (props.workflow?.currentColor) {
        const map: Record<string, string> = {
            success: 'success',
            warning: 'warning',
            danger: 'destructive',
            destructive: 'destructive',
            info: 'info',
            neutral: 'outline',
        }

        return map[props.workflow.currentColor] ?? 'outline'
    }

    const column = statusColumn.value

    if (!column) {
        return 'outline'
    }

    return badgeVariant(column.key, props.record[column.key])
})

const workflowRunning = ref<string | null>(null)

const pendingConfirmation = ref<{
    title: string
    description: string
    run: () => void
} | null>(null)

/* ---------------------------------------------------------------------------
 * Related lists
 *
 * FETCHED WHEN A TAB IS OPENED, never with the record. A page with four
 * relations must not run four list queries to show one, and eager-loading a
 * relation reads every related row to render the ten a person looks at - which
 * is fine for the client the developer tested with and ruinous for the one with
 * forty thousand sessions.
 *
 * Each tab keeps its own rows and cursor, so switching back to a tab does not
 * refetch what is already there.
 * ------------------------------------------------------------------------- */

interface RelationState {
    rows: Record<string, any>[]
    cursor: string | null
    loading: boolean
    loaded: boolean
    /** True once the ceiling below stopped the appending. */
    capped: boolean
    search: string
    filters: Record<string, unknown>
    filterOptions: Record<string, string[]>
    indicators: { key: string; label: string; removable?: boolean }[]
}

/**
 * How many related rows this panel will hold at once - Part G.7.
 *
 * A related list appends every page it fetches, so without a ceiling the DOM
 * grows for as long as somebody keeps clicking. Twelve pages of twenty-five
 * is far past what anybody reads inside a record page, and the full list has
 * its own screen for the cases that need searching.
 */
const MAX_RELATION_ROWS = 300

const relations = computed(() => props.schema.relations ?? [])
const activeRelation = ref<string | null>(relations.value[0]?.key ?? null)

function relationPages(relation: { pages?: { resource: string } | null }): string | null {
    if (!relation.pages?.resource) {
        return null
    }

    return `${props.schema.routes.index}/${props.record.id}/${relation.pages.resource}`
}

const state = ref<Record<string, RelationState>>({})

function relationState(key: string): RelationState {
    if (!state.value[key]) {
        state.value = {
            ...state.value,
            [key]: {
                rows: [],
                cursor: null,
                loading: false,
                loaded: false,
                capped: false,
                search: '',
                filters: {},
                filterOptions: {},
                indicators: [],
            },
        }
    }

    return state.value[key]
}

function relationFilterSchema(key: string) {
    const relation = relations.value.find((item) => item.key === key)
    const schema = relation?.table.filters ?? []
    const options = relationState(key).filterOptions

    return schema.map((filter) => ({
        ...filter,
        options: options[filter.key] ?? filter.options ?? [],
    })) as any[]
}

function relationQuery(key: string, cursor: string | null = null): string {
    const current = relationState(key)
    const params = new URLSearchParams()

    if (cursor) {
        params.set('cursor', cursor)
    }

    if (current.search !== '') {
        params.set('search', current.search)
    }

    for (const [filterKey, value] of Object.entries(current.filters)) {
        if (value === null || value === undefined || value === '') {
            continue
        }

        if (Array.isArray(value)) {
            for (const item of value) {
                params.append(`${filterKey}[]`, String(item))
            }

            continue
        }

        if (typeof value === 'object') {
            for (const [subKey, subValue] of Object.entries(value as Record<string, unknown>)) {
                if (subValue === null || subValue === undefined || subValue === '') {
                    continue
                }

                params.set(`${filterKey}[${subKey}]`, String(subValue))
            }

            continue
        }

        params.set(filterKey, String(value))
    }

    const encoded = params.toString()

    return encoded === '' ? '' : `?${encoded}`
}

async function loadRelation(key: string, cursor: string | null = null, force = false) {
    const current = relationState(key)

    // Already have the first page and nothing more was asked for.
    if (current.loaded && cursor === null && !force) {
        return
    }

    current.loading = true

    try {
        const response = await fetch(
            `${props.schema.routes.index}/${props.record.id}/relations/${key}${relationQuery(key, cursor)}`,
            {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            },
        )

        if (!response.ok) {
            throw new Error(String(response.status))
        }

        const data = await response.json()

        // Appended, not replaced: "load more" continues the list rather than
        // jumping to a page, which is what a keyset cursor expresses.
        const appended = cursor ? [...current.rows, ...data.records] : data.records

        /*
         * BOUNDED - Part G.7. Appending forever is the one unbounded list
         * left after the tables were paginated: a relation with 40,000 rows
         * and somebody leaning on "Load more" puts all of them in the DOM,
         * and the record page they are reading gets slower with every click.
         * The panel keeps a ceiling's worth and says so; a relation that long
         * has a real home now - its own nested screen, with tabs, filters and
         * paging - which is where searching it belongs anyway.
         */
        current.rows = appended.slice(0, MAX_RELATION_ROWS)
        current.capped = appended.length > MAX_RELATION_ROWS
        current.cursor = current.capped ? null : (data.nextCursor ?? null)
        current.filters = data.filters ?? current.filters
        current.search = typeof data.search === 'string' ? data.search : current.search
        current.filterOptions = data.filterOptions ?? current.filterOptions
        current.indicators = data.indicators ?? []
        current.loaded = true
    } catch {
        current.loaded = true
    } finally {
        current.loading = false
    }
}

function openRelation(key: string) {
    activeRelation.value = key
    loadRelation(key)
}

function reloadRelation(key: string) {
    const current = relationState(key)
    current.rows = []
    current.cursor = null
    current.capped = false
    current.loaded = false
    void loadRelation(key, null, true)
}

function setRelationSearch(key: string, value: string) {
    relationState(key).search = value
    reloadRelation(key)
}

function applyRelationFilters(key: string, next: Record<string, unknown>) {
    relationState(key).filters = next
    reloadRelation(key)
}

function clearRelationFilters(key: string) {
    const current = relationState(key)
    current.filters = Object.fromEntries(
        Object.keys(current.filters).map((filterKey) => [filterKey, null]),
    )
    current.search = ''
    reloadRelation(key)
}

function clearRelationFilter(key: string, filterKey: string) {
    relationState(key).filters = { ...relationState(key).filters, [filterKey]: null }
    reloadRelation(key)
}

const creatingRelation = ref<string | null>(null)
const createProcessing = ref(false)
const createErrors = ref<Record<string, string>>({})

const creating = computed(
    () => relations.value.find((relation) => relation.key === creatingRelation.value) ?? null,
)

function openCreate(key: string) {
    createErrors.value = {}
    creatingRelation.value = key
}

function closeCreate() {
    if (createProcessing.value) {
        return
    }

    creatingRelation.value = null
    createErrors.value = {}
}

function csrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)

    return match ? decodeURIComponent(match[1]) : ''
}

async function searchRelationOptions(
    field: string,
    term: string,
): Promise<{ value: any; label: string }[]> {
    const relation = creating.value
    const base = relation ? relationPages(relation) : null

    if (!base) {
        return []
    }

    const query = new URLSearchParams({ field, q: term })
    const response = await fetch(`${base}/field-options?${query}`, {
        headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
    })

    if (!response.ok) {
        throw new Error(String(response.status))
    }

    return (await response.json()).options
}

async function submitRelationCreate(values: Record<string, unknown>) {
    const key = creatingRelation.value

    if (!key) {
        return
    }

    createProcessing.value = true
    createErrors.value = {}

    try {
        const response = await fetch(
            `${props.schema.routes.index}/${props.record.id}/relations/${key}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': csrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify(values),
            },
        )

        if (response.status === 422) {
            const body = await response.json().catch(() => null)
            createErrors.value = Object.fromEntries(
                Object.entries(body?.errors ?? {}).map(([field, messages]) => [
                    field,
                    Array.isArray(messages) ? String(messages[0]) : String(messages),
                ]),
            )

            return
        }

        if (!response.ok) {
            toast.error('Could not create the related record.')

            return
        }

        creatingRelation.value = null
        const current = relationState(key)
        current.loaded = false
        current.rows = []
        current.cursor = null
        current.capped = false
        await loadRelation(key)
        toast.success('Created.')
    } finally {
        createProcessing.value = false
    }
}

// The first tab loads once the page is up, because it is the one being looked
// at; the rest wait to be asked for.
if (activeRelation.value) {
    loadRelation(activeRelation.value)
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

function render(key: string): string {
    const column = byKey.value[key]
    const value = props.record[key]

    if (value === null || value === undefined || value === '') {
        return '-'
    }

    if (column?.type === 'date' || column?.type === 'datetime') {
        return new Date(String(value)).toLocaleDateString(undefined, dateFormats[column.type])
    }

    /*
     * MONEY WAS MISSING HERE, and it was the worst omission on this page. The
     * list showed a formatted currency; this showed the raw minor units - so a
     * record whose amount is 129900 read as "129900" on the one screen somebody
     * opens to check what a customer owes. A wrong number, not a plain one.
     *
     * The formatter is shared with the list rather than copied, so the two can
     * never disagree again.
     */
    if (column?.type === 'money') {
        return formatMoney(column as never, value, props.record)
    }

    // Same transform the table applies, so a value never reads one way in the
    // list and another here.
    let text = String(value)

    if (column?.transform === 'upper') {
        text = text.toUpperCase()
    }

    if (column?.transform === 'lower') {
        text = text.toLowerCase()
    }

    return [column?.prefix, text, column?.suffix].filter(Boolean).join(' ')
}

async function executeWorkflowTransition(action: { key: string; label: string; confirm?: string }) {
    workflowRunning.value = action.key

    try {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)
        const token = match ? decodeURIComponent(match[1]) : ''

        const response = await fetch(`${props.schema.routes.index}/${props.record.id}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': token,
            },
            credentials: 'same-origin',
            body: JSON.stringify({ action: action.key }),
        })

        if (!response.ok) {
            const body = await response.json().catch(() => null)
            toast.error(body?.message ?? 'That transition could not be completed.')

            return
        }

        const body = await response.json().catch(() => null)

        toast.success(`${action.label} done`)

        // A declared `redirect()` wins over the default reload — see ResourceIndex.
        if (body?.redirect) {
            router.visit(body.redirect)

            return
        }

        router.reload()
    } finally {
        workflowRunning.value = null
    }
}

function runWorkflowTransition(action: { key: string; label: string; confirm?: string }) {
    if (action.confirm) {
        pendingConfirmation.value = {
            title: action.label,
            description: action.confirm,
            run: () => void executeWorkflowTransition(action),
        }

        return
    }

    void executeWorkflowTransition(action)
}

async function runInfolistAction(action: { key: string; label?: string }) {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)
    const token = match ? decodeURIComponent(match[1]) : ''

    const response = await fetch(
        `${props.schema.routes.index}/${props.record.id}/infolist-action`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': token,
            },
            credentials: 'same-origin',
            body: JSON.stringify({ action: action.key }),
        },
    )

    if (!response.ok) {
        toast.error('Could not run that action')

        return
    }

    toast.success(action.label ?? 'Done')
    router.reload()
}

function destroy() {
    router.delete(`${props.schema.routes.index}/${props.record.id}`, {
        onSuccess: () => {
            toast.success(`${props.schema.label} deleted`)
            router.visit(props.schema.routes.index)
        },
        onError: () => toast.error('Could not delete this record'),
    })
}

function requestDelete() {
    pendingConfirmation.value = {
        title: `Delete ${title.value}?`,
        description: 'This cannot be undone.',
        run: destroy,
    }
}

function confirmPending() {
    const run = pendingConfirmation.value?.run
    pendingConfirmation.value = null
    run?.()
}
</script>

<template>
    <Head :title="title" />

    <div :class="[PAGE_SHELL_COMPACT, 'flex flex-col gap-4']">
        <PkPageHeader :title="title" :purpose="schema.label">
            <template
                v-if="statusColumn && (workflow?.current || record[statusColumn.key] != null)"
                #status
            >
                <Badge :variant="statusVariant as any">
                    {{ statusLabel }}
                </Badge>
            </template>
            <template #actions>
                <RecordPresence
                    :resource="schema.key"
                    :record-id="record.id"
                    :tenant-id="presenceTenantId"
                />
                <Link
                    v-if="workflow?.diagramUrl"
                    :href="workflow.diagramUrl"
                    :class="buttonClasses({ variant: 'outline', size: 'sm' })"
                >
                    Workflow
                </Link>
                <Button
                    v-for="action in workflow?.actions ?? []"
                    :key="action.key"
                    variant="outline"
                    size="sm"
                    :disabled="workflowRunning === action.key"
                    @click="runWorkflowTransition(action)"
                >
                    {{ action.label }}
                </Button>
                <!-- Primary last (DESIGN_RULES rule 2): Edit is the action this
                     page exists for, so it takes the outside edge. -->
                <Button v-if="can.delete" variant="outline" size="sm" @click="requestDelete"
                    >Delete</Button
                >
                <!-- A `<Link>` wearing button classes, not `<Button as-child>` wrapping one - see the note beside ResourceIndex's own New button. -->
                <Link
                    v-if="can.update"
                    :href="`${schema.routes.index}/${record.id}/edit`"
                    :class="buttonClasses({ size: 'sm' })"
                >
                    Edit
                </Link>
            </template>
        </PkPageHeader>

        <!--
            Full-bleed shell; left-aligned FORM_MEASURE (max-w-7xl) for the
            record body (no mx-auto skinny centre column). Relation tables stay
            full width below.
        -->
        <div :class="FORM_MEASURE">
            <!-- Layout tree: tabs and sections, same components the form uses. -->
            <template v-if="hasLayout">
                <InfoNode
                    v-for="(node, i) in schema.infolist"
                    :key="i"
                    :node="node"
                    :record="record"
                    @action="runInfolistAction"
                />
            </template>

            <!-- Fallback: a definition list. One record's attributes read better as
                 labelled pairs than as a table row turned on its side. -->
            <dl
                v-else
                class="bg-card divide-y rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10"
            >
                <div
                    v-for="column in schema.table.columns"
                    :key="column.key"
                    class="grid grid-cols-1 gap-1 px-4 py-3.5 sm:grid-cols-3 sm:gap-4 sm:px-5"
                >
                    <dt
                        class="text-muted-foreground text-[11px] font-medium tracking-wide uppercase sm:pt-0.5"
                    >
                        {{ column.label }}
                    </dt>
                    <dd class="text-foreground text-sm font-medium sm:col-span-2">
                        <Badge
                            v-if="column.type === 'badge'"
                            :variant="badgeVariant(column.key, record[column.key]) as any"
                            class="capitalize"
                        >
                            {{ record[column.key] }}
                        </Badge>
                        <IconCell
                            v-else-if="column.type === 'icon'"
                            :value="record[column.key]"
                            :icons="(column as any).icons ?? {}"
                            :colors="(column as any).colors ?? {}"
                            :labels="(column as any).labels ?? {}"
                            :default-icon="(column as any).defaultIcon ?? 'dot'"
                        />
                        <ColourCell
                            v-else-if="column.type === 'colour'"
                            :value="record[column.key]"
                            :show-value="(column as any).showValue !== false"
                        />
                        <!--
                            A CHECKBOX AND A TOGGLE READ THE SAME HERE. On a record
                            page nothing is being switched - both are reporting a
                            yes or a no, and a toggle control would invite a click
                            that does nothing.
                        -->
                        <CheckboxCell
                            v-else-if="column.type === 'checkbox' || column.type === 'toggle'"
                            :value="record[column.key]"
                            :true-label="(column as any).trueLabel"
                            :false-label="(column as any).falseLabel"
                        />
                        <!--
                            THE RECORD PAGE IS WHERE THESE TWO ACTUALLY LIVE. The
                            list shows a truncated line and "3 entries" because a
                            row is a scanning surface; here there is room, and
                            somebody has already chosen this record.

                            This is the half `CodeField` and `KeyValueField` never
                            had: the package could accept a config blob or a map
                            and then print the raw JSON back at the person who
                            typed it into a two-column editor.
                        -->
                        <div v-else-if="column.type === 'code'" class="max-w-full">
                            <p
                                v-if="(column as any).language"
                                class="text-muted-foreground mb-1 font-mono text-[10px] uppercase"
                            >
                                {{ (column as any).language }}
                            </p>
                            <pre
                                class="bg-muted/50 overflow-x-auto rounded-md border p-3 font-mono text-xs"
                            ><code>{{ record[column.key] }}</code></pre>
                        </div>

                        <div v-else-if="column.type === 'keyvalue'">
                            <dl
                                v-if="
                                    record[column.key] &&
                                    typeof record[column.key] === 'object' &&
                                    Object.keys(record[column.key]).length
                                "
                                class="divide-y rounded-md border"
                            >
                                <div
                                    v-for="(v, k) in record[column.key]"
                                    :key="k"
                                    class="grid grid-cols-3 gap-2 px-3 py-2 text-sm"
                                >
                                    <dt class="text-muted-foreground truncate font-medium">
                                        {{ k }}
                                    </dt>
                                    <dd class="col-span-2 break-words">{{ v }}</dd>
                                </div>
                            </dl>
                            <span v-else class="text-muted-foreground font-normal">None</span>
                        </div>

                        <ImageCell
                            v-else-if="column.type === 'image'"
                            :src="record[column.key]"
                            :fallback-text="record[(column as any).fallbackFrom ?? 'name']"
                            :rounded="(column as any).rounded !== false"
                            :size="(column as any).size ?? 'md'"
                            :fallback="(column as any).fallback ?? 'initials'"
                        />
                        <span
                            v-else
                            :class="[
                                column.mono ? 'font-mono text-xs' : '',
                                record[column.key] == null || record[column.key] === ''
                                    ? 'text-muted-foreground font-normal'
                                    : '',
                            ]"
                        >
                            {{
                                record[column.key] == null || record[column.key] === ''
                                    ? 'None'
                                    : render(column.key)
                            }}
                        </span>
                    </dd>
                </div>
            </dl>
        </div>

        <PkModal
            :open="pendingConfirmation !== null"
            :title="pendingConfirmation?.title ?? 'Confirm action'"
            :description="pendingConfirmation?.description"
            @close="pendingConfirmation = null"
        >
            <template #footer>
                <Button variant="ghost" size="sm" @click="pendingConfirmation = null">Cancel</Button>
                <Button
                    variant="destructive"
                    size="sm"
                    @click="confirmPending"
                >
                    Confirm
                </Button>
            </template>
        </PkModal>

        <!-- Related lists: tabs outside, TableShell chrome inside RelationPanel. -->
        <section v-if="relations.length" class="flex flex-col gap-3">
            <div v-if="relations.length > 1" class="bg-muted/40 flex w-fit gap-1 rounded-md p-1">
                <button
                    v-for="relation in relations"
                    :key="relation.key"
                    type="button"
                    class="rounded px-3 py-1.5 text-sm transition-colors"
                    :class="
                        activeRelation === relation.key
                            ? 'bg-background text-foreground font-medium shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    "
                    @click="openRelation(relation.key)"
                >
                    {{ relation.label }}
                </button>
            </div>

            <template v-for="relation in relations" :key="relation.key">
                <RelationPanel
                    v-if="activeRelation === relation.key"
                    :title="relation.label"
                    :columns="relation.table.columns"
                    :rows="relationState(relation.key).rows"
                    :loading="relationState(relation.key).loading"
                    :loaded="relationState(relation.key).loaded"
                    :next-cursor="relationState(relation.key).cursor"
                    :capped="relationState(relation.key).capped"
                    :filter-schema="relationFilterSchema(relation.key)"
                    :filters="relationState(relation.key).filters"
                    :search="relationState(relation.key).search"
                    :indicators="relationState(relation.key).indicators"
                    :empty-title="`No ${relation.label.toLowerCase()} yet`"
                    :empty-text="`No ${relation.label.toLowerCase()} for this ${schema.label.toLowerCase()}.`"
                    :record-base="relationPages(relation)"
                    :index-href="relationPages(relation)"
                    @load="(cursor) => loadRelation(relation.key, cursor)"
                    @update:search="(value) => setRelationSearch(relation.key, value)"
                    @apply-filters="(next) => applyRelationFilters(relation.key, next)"
                    @clear-filters="clearRelationFilters(relation.key)"
                    @clear-filter="(filterKey) => clearRelationFilter(relation.key, filterKey)"
                >
                    <template v-if="relationPages(relation) || relation.canCreate" #actions>
                        <Link
                            v-if="relationPages(relation)"
                            :href="relationPages(relation)!"
                            :class="buttonClasses({ variant: 'outline', size: 'sm' })"
                        >
                            View all
                        </Link>
                        <button
                            v-if="relation.canCreate"
                            type="button"
                            :class="buttonClasses({ variant: 'default', size: 'sm' })"
                            @click="openCreate(relation.key)"
                        >
                            Add
                        </button>
                    </template>
                    <template v-if="relation.canCreate" #empty-actions>
                        <button
                            type="button"
                            :class="buttonClasses({ size: 'sm' })"
                            @click="openCreate(relation.key)"
                        >
                            Add {{ relation.label }}
                        </button>
                    </template>
                </RelationPanel>
            </template>
        </section>

        <RelationCreateDialog
            :open="!!creating"
            :title="creating ? `Add ${creating.label}` : 'Add'"
            :form="creating?.form ?? null"
            :form-options="creating ? (relationFormOptions?.[creating.key] ?? {}) : {}"
            :processing="createProcessing"
            :errors="createErrors"
            :search-options="searchRelationOptions"
            @close="closeCreate"
            @submit="submitRelationCreate"
        />

        <!--
            ANYTHING A PLUGIN ADDS TO THIS RECORD goes here: below the record
            and its related lists, above the history. A ticket's conversation
            arrives through this - see `TicketingPlugin`.
        -->
        <RenderHook
            position="view.after"
            :hooks="renderHooks"
            :record-id="record.id"
            :resource="schema.key"
            :base-url="schema.routes.index"
        />

        <CommentsSection
            v-if="comments"
            :label="comments.label"
            :url="comments.url"
            :can-create="comments.canCreate"
        />

        <!--
            History last, and collapsed. It is the least-read part of a detail
            page and the most likely to be long, so it sits below the record
            rather than competing with it.
        -->
        <WorkflowHistory
            v-if="workflow"
            :entries="workflow.history ?? []"
            :states="workflow.states"
        />

        <!--
            HIDDEN, NOT A PERMANENT RETRY LOOP. `schema.routes.audit` is null
            unless the host actually registered the app-level audit route
            `PanelRoutes::host()` requires - `panel:install` never scaffolds
            one, so every fresh install rendered this section and it always
            404'd. Same guard `WorkflowHistory` above already uses.
        -->
        <AuditTimeline
            v-if="schema.routes.audit"
            :url="schema.routes.audit.replace('{id}', String(record.id))"
        />

        <div>
            <Link
                :href="schema.routes.index"
                :class="buttonClasses({ variant: 'ghost', size: 'sm' })"
            >
                ← Back to {{ schema.labelPlural }}
            </Link>
        </div>
    </div>
</template>
