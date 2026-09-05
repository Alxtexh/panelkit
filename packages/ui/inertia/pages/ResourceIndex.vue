<script setup lang="ts">
/**
 * PHASE 4 - the ONE page that renders every resource.
 *
 * Clients, Routers and Plans all render through this. Adding a screen is a PHP
 * class and nothing else; there is no per-resource Vue file left.
 *
 * WHY THIS LIVES IN THE APP rather than in @alxtexh-enterprise/panel:
 *
 * It is the Inertia adapter. Spec §4 rule 1 forbids anything in the UI package
 * from importing Inertia, and a page must know how data arrives. So the
 * reusable parts - DataTable, TableToolbar, TableTabs, TablePagination,
 * SelectionBar, and the schema-to-column mapping - all live in the package,
 * and this file is the thin seam that wires Inertia to them.
 *
 * THE TRANSPORT SPLIT, which is the entire architecture:
 *
 *   `schema` arrives on first load and is NOT in the `only:` list that
 *   useListTable sends, so filtering, sorting and paging move rows and nothing
 *   else. A server-rendered panel re-renders its whole component tree per
 *   interaction instead (antipatterns §3.1: 500-950 ms, of which 1-16 ms was
 *   actually the database).
 *
 *   `filterOptions` arrives WITH the data, never inside the schema, because a
 *   tenant's routers are tenant data (addendum Part A). That is what lets the
 *   schema cache key drop the tenant id entirely.
 */
import { Head, Link, router, usePage } from '@inertiajs/vue3'
import { computed, onMounted, ref, toRef, watch } from 'vue'
import { toast } from 'vue-sonner'
import { PkBadge as Badge } from '@alxtexh-enterprise/panel'
import {
    PkButton as Button,
    actionColorTone,
    buttonClasses,
    PkPageHeader,
} from '@alxtexh-enterprise/panel'
import {
    BulkActions,
    DataTable,
    EditableCell,
    BadgeResolver,
    CodeCell,
    IconCell,
    ImageCell,
    KeyValueCell,
    TagsCell,
    ColourCell,
    CheckboxCell,
    RatingCell,
    PkBoundary,
    RecordActions,
    InlineRecordActions,
    SavedViews,
    SelectionBar,
    TablePagination,
    TableShell,
    TableTabs,
    TableToolbar,
    PkModal,
    PkSlideover,
    SchemaNode,
    useColumnVisibility,
    useColumnWidths,
    useLiveUpdates,
    hasBadgeValue,
    useSchemaColumns,
} from '@alxtexh-enterprise/panel'
import type {
    FormField,
    RecordActionGroup,
    RecordActionItem,
    SchemaColumn,
} from '@alxtexh-enterprise/panel'
import type { SavedTableView } from '@alxtexh-enterprise/panel'
import ImportDialog from '../components/ImportDialog.vue'
import RenderHook from '../components/RenderHook.vue'
import ResourceCrudModal from '../components/ResourceCrudModal.vue'
import PanelWidgets from '../components/widgets/PanelWidgets.vue'
import { useBulkJob } from '../composables/useBulkJob'
import { useListTable } from '../composables/useListTable'
import type { ListPageProps } from '../composables/useListTable'
import { formatMoney } from '../lib/money'

interface ResourceSchema {
    v: number
    kind: string
    key: string
    label: string
    labelPlural: string
    /** One sentence, declared on the `Resource` - see roadmap 3.9. */
    purpose: string | null
    icon: string
    group: string | null
    routes: { index: string; attach?: string }
    forms?: { create: 'page' | 'modal'; edit: 'page' | 'modal'; view: 'page' | 'modal' }
    lenses?: { key: string; label: string }[]
    table: {
        columns: SchemaColumn[]
        filters: {
            key: string
            label: string
            type: 'select' | 'boolean'
            trueLabel?: string
            falseLabel?: string
        }[]
        tabs: string[]
        /**
         * Property on each row that uniquely identifies it. The list SELECT
         * always includes this even when it is not a visible column, so
         * checkboxes can tell rows apart.
         */
        rowKey?: string
        /** Structure only; the values arrive with the rows. */
        groupBy?: {
            key: string
            label: string
            collapsible?: boolean
            date?: boolean
            titlePrefixed?: boolean
        } | null
        groups?: {
            key: string
            label: string
            collapsible?: boolean
            date?: boolean
            titlePrefixed?: boolean
        }[]
        collapsedGroupsByDefault?: boolean
        /** The order column, when this table can be dragged into order. */
        reorderable?: string | null
        /**
         * Whether clicking the row body opens the record. Declared per resource
         * server-side, because a browsed list wants it and a read-in-place one
         * does not - see `Table::rowClick()`.
         */
        rowClick?: 'view' | null
        striped?: boolean
        stickyFirstColumn?: boolean
        resizableColumns?: boolean
        layouts?: Array<'table' | 'cards'>
        /** Structure only; per-row availability rides with the row. */
        recordActions?: {
            label?: string
            actions: {
                key: string
                label: string
                icon?: string
                ability: string
                link?: boolean
                destructive?: boolean
                confirmation?: string
                removesRow?: boolean
                color?: string
            }[]
        }[]
        /** `Table::inlineRecordActions()` - off collapses everything into one kebab menu. */
        inlineRecordActions?: boolean
        bulkActions: {
            key: string
            label: string
            ability: string
            icon: string | null
            destructive: boolean
            confirmation: string | null
            /** Present when the action collects input first. */
            form?: { nodes: unknown[] } | null
        }[]
    }
    /**
     * Mostly the count only - the form pages own the field shapes - but the
     * modal-presentation path (`ResourceCrudModal`) reuses this same schema
     * to render the form for real, so the shape has to be true.
     */
    form: { columns: number; fields: FormField[] }
}

const props = defineProps<
    {
        /*
         * `ListPageProps` SPELLED OUT, deliberately. Importing it into
         * `defineProps` makes the SFC compiler resolve a type across files,
         * which it can only do by loading TypeScript from the CONSUMING
         * project - and a fresh Laravel app has none, so `npm run build` dies
         * with "Failed to load TypeScript". The guard below fails `vue-tsc`
         * here if this copy and the canonical one ever diverge.
         */
        records: Record<string, any>[]
        filters: Record<string, unknown>
        search: string
        sort: string
        direction: 'asc' | 'desc'
        nextCursor: string | null
        perPage: number
        perPageOptions: number[]
        tab: string | null
        tabs: string[]
        groupBy?: {
            key: string
            label: string
            collapsible?: boolean
            date?: boolean
            titlePrefixed?: boolean
        } | null
        indicators?: { key: string; label: string; removable?: boolean }[]
    } & {
        schema: ResourceSchema
        /** Tenant data, delivered beside the records rather than in the schema. */
        filterOptions: Record<string, string[]>
        /** Form option lists - tenant data, so they arrive with the payload. */
        formOptions: Record<string, { value: any; label: string }[]>
        /** UI hints only. Every write re-authorizes server-side. */
        can: {
            viewAny: boolean
            create: boolean
            update: boolean
            delete: boolean
            deleteAny?: boolean
            restore?: boolean
            restoreAny?: boolean
            forceDelete?: boolean
            forceDeleteAny?: boolean
            import: boolean
            excelImport?: boolean
        }
        /** Transport for staying fresh. The page does not know which driver. */
        live: {
            driver: 'none' | 'poll' | 'broadcast'
            intervalMs: number
            batchMs: number
            channel: string | null
            events: string[]
            pauseWhenHidden: boolean
        }
        total?: number
        lens?: string | null
        tabCounts?: Record<string, number>
        /**
         * The cluster this resource belongs to, if any - roadmap 4.1. Items
         * are permission-filtered on the server, so a sibling this person may
         * not open never reaches the client.
         */
        cluster?: {
            key: string
            label: string
            items: { title: string; href: string; current: boolean }[]
        } | null
        /**
         * Markup plugins asked to put on this screen - roadmap 4.4. Already
         * scoped to this resource server-side.
         */
        renderHooks?: { position: string; component: string; props: Record<string, unknown> }[]
    }
>()

/*
 * THE DRIFT GUARD for the props spelled out above.
 *
 * `ListPageProps` is the canonical shape and `useListTable` takes it; this
 * asserts the copy in `defineProps` still satisfies it, so a field added there
 * and not here fails `vue-tsc` rather than reaching a consumer as a prop this
 * screen silently ignores. It is a TYPE, so it compiles to nothing.
 */
type _ListPropsMatch = typeof props extends ListPageProps ? true : never

defineOptions({
    // Page props arrive as attributes and this root is a fragment.
    inheritAttrs: false,
    layout: {
        breadcrumbs: [],
    },
})

const t = useListTable(props.schema.routes.index, props, {
    rowKey: props.schema.table.rowKey ?? 'id',
    groupKeys: (props.schema.table.groups ?? []).map((g) => g.key),
    lens: props.lens ?? null,
})

// Keyed by resource, so hiding a column on Clients does not hide it on Routers.
const { hidden, setHidden } = useColumnVisibility(`alxtexhpanel.${props.schema.key}.columns`)
const { widths, setWidth } = useColumnWidths(`alxtexhpanel.${props.schema.key}.widths`)

const savedViewsKey = `alxtexhpanel.${props.schema.key}.saved-views`
const savedViews = ref<SavedTableView[]>([])
const activeSavedView = ref<string | null>(null)

function readSavedViews() {
    if (typeof localStorage === 'undefined') return

    try {
        const value = JSON.parse(localStorage.getItem(savedViewsKey) ?? '[]')

        if (Array.isArray(value)) savedViews.value = value as SavedTableView[]
    } catch {
        savedViews.value = []
    }
}

function persistSavedViews() {
    try {
        localStorage.setItem(savedViewsKey, JSON.stringify(savedViews.value))
    } catch {
        // Private mode or storage quota: the current table still works.
    }
}

function currentSavedView(name: string): SavedTableView {
    return {
        name,
        search: props.search,
        filters: { ...props.filters },
        sort: props.sort,
        direction: props.direction,
        perPage: props.perPage,
        tab: props.tab,
        group: props.groupBy?.key ?? null,
        lens: props.lens ?? null,
        hidden: [...hidden.value],
        layout: indexLayout.value,
    }
}

function saveView(name: string) {
    savedViews.value = [
        ...savedViews.value.filter((view) => view.name !== name),
        currentSavedView(name),
    ].slice(-12)
    activeSavedView.value = name
    persistSavedViews()
}

function applySavedView(view: SavedTableView) {
    setHidden(new Set(view.hidden))
    setIndexLayout(view.layout)
    activeSavedView.value = view.name

    const filters = Object.fromEntries(
        Object.keys(props.filters).map((key) => [key, view.filters[key] ?? null]),
    )

    t.apply({
        ...filters,
        search: view.search,
        sort: view.sort,
        direction: view.direction,
        perPage: view.perPage,
        tab: view.tab,
        group: view.group ?? '-',
        lens: view.lens,
    })
}

function removeSavedView(name: string) {
    savedViews.value = savedViews.value.filter((view) => view.name !== name)
    if (activeSavedView.value === name) activeSavedView.value = null
    persistSavedViews()
}

if (typeof window !== 'undefined') readSavedViews()

const layoutStorageKey = `alxtexhpanel.${props.schema.key}.layout`
const indexLayout = ref<'table' | 'cards'>(
    (props.schema.table.layouts?.[0] as 'table' | 'cards' | undefined) ?? 'table',
)

function readStoredLayout(): 'table' | 'cards' | null {
    if (typeof localStorage === 'undefined') {
        return null
    }

    try {
        const saved = localStorage.getItem(layoutStorageKey)

        if (saved === 'table' || saved === 'cards') {
            return saved
        }
    } catch {
        // ignore
    }

    return null
}

function setIndexLayout(mode: 'table' | 'cards') {
    const allowed = props.schema.table.layouts ?? []

    if (!allowed.includes(mode)) {
        return
    }

    indexLayout.value = mode

    try {
        localStorage.setItem(layoutStorageKey, mode)
    } catch {
        // ignore
    }
}

if (typeof window !== 'undefined') {
    const saved = readStoredLayout()

    if (saved && (props.schema.table.layouts ?? []).includes(saved)) {
        indexLayout.value = saved
    }
}

/** The column panel stages its choices and applies them together. */
function applyColumns(keys: string[]) {
    setHidden(new Set(keys))
}

function onColumnResize(key: string, width: number) {
    setWidth(key, width)
}

const cardTitleKey = computed(() => columns.value[0]?.key ?? 'id')
const cardDetailColumns = computed(() => columns.value.slice(1, 4))

const schemaColumns = toRef(() => props.schema.table.columns)
const { columns, byKey, badgeVariant } = useSchemaColumns(schemaColumns)

/**
 * Filter schema and its OPTIONS are recombined here, at the last moment.
 *
 * They travel separately on purpose: structure is cached and shared, options
 * are tenant data. The toolbar only ever sees the merged result.
 */
const filterSchema = computed(() =>
    props.schema.table.filters.map((f) => ({ ...f, options: props.filterOptions[f.key] ?? [] })),
)

const dateFormats: Record<string, Intl.DateTimeFormatOptions> = {
    date: { year: 'numeric', month: 'short', day: '2-digit' },
    datetime: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    },
}

function render(key: string, value: unknown, row?: Record<string, unknown>): string {
    const column = byKey.value[key]

    if (value === null || value === undefined || value === '') {
        return '-'
    }

    if (column?.type === 'date' || column?.type === 'datetime') {
        return new Date(String(value)).toLocaleDateString(undefined, dateFormats[column.type])
    }

    if (column?.type === 'money') {
        return formatMoney(column, value, row)
    }

    // Units and currency codes come from the schema, so no resource needs its
    // own Vue slot just to write "Mbps" after a number.
    return [column?.prefix, String(value), column?.suffix].filter(Boolean).join(' ')
}

/** Columns the schema marks as badges get badge rendering, generically. */
/**
 * Footer aggregate definitions, pulled off the schema columns.
 *
 * Structure only - which aggregate and how to render it. The VALUES arrive as
 * their own deferred prop, so a total over 200,000 rows never sits in front of
 * the ten on screen.
 */
const page = usePage()

const columnSummaries = computed(() => {
    const out: Record<string, any> = {}

    for (const column of schemaColumns.value) {
        if ((column as any).summary) {
            out[column.key] = (column as any).summary
        }
    }

    return Object.keys(out).length ? out : null
})

const badgeKeys = computed(() =>
    schemaColumns.value.filter((c) => c.type === 'badge').map((c) => c.key),
)

/* ---------------------------------------------------------------------------
 * Writes
 *
 * Create, view and edit are dedicated PAGES now, not modals - Filament's
 * convention, and for practical reasons: a page is linkable, survives a refresh,
 * gets its own history entry, and has room for a form a dialog cannot hold.
 *
 * Delete stays a confirmation dialog, because that is what a modal is actually
 * good at: a single irreversible decision with no form to fill in. It still
 * opens with no network request.
 * ------------------------------------------------------------------------- */

const confirmingDelete = ref<Record<string, any> | null>(null)
const deleting = ref(false)

const crudModal = ref<{
    mode: 'create' | 'edit' | 'view'
    recordId?: string | number | null
} | null>(null)

function formUsesModal(action: 'create' | 'edit' | 'view'): boolean {
    return props.schema.forms?.[action] === 'modal'
}

function openCrudModal(mode: 'create' | 'edit' | 'view', row?: Record<string, any>) {
    crudModal.value = {
        mode,
        recordId: row?.id ?? null,
    }
}

function onCrudSaved() {
    router.reload({
        only: ['records', 'total', 'tabCounts', 'summary', 'filters', 'filterOptions'],
    })
}

function setLens(key: string | null) {
    t.apply({ lens: key })
}

const canWrite = computed(() => props.schema.form.fields.length > 0)

/**
 * An empty state that NAMES THE BUTTON TO PRESS - roadmap 3.9. "Seed demo
 * data with: make seed" was every resource's hint, dev-only advice with
 * nothing to do with what an operator can actually click. This is derived
 * rather than declared on the Resource: the button's own label already
 * exists (`New {label}`, above), so a second, hand-written copy of the same
 * words would only be one more place for the two to drift apart.
 */
const emptyHint = computed(() =>
    canWrite.value && props.can.create
        ? `Create the first ${props.schema.label.toLowerCase()} to get started.`
        : undefined,
)

/* ---------------------------------------------------------------------------
 * Inline cell edits
 *
 * OPTIMISTIC, WITH A REAL ROLLBACK. The switch flips immediately because
 * waiting 40 ms to see your own click is what makes a panel feel slow - but a
 * rejected write must visibly undo, or the operator walks away believing a
 * change landed that never did.
 *
 * The new value is held in an OVERRIDE MAP rather than written into the row.
 * `t.rows` derives from page props, so mutating a row in place fights the next
 * partial reload: the reload would restore the server value and the edit would
 * appear to flicker back. An override keyed by row and column is discarded when
 * fresh rows arrive, which is exactly the desired lifetime.
 * ------------------------------------------------------------------------- */

const cellOverrides = ref<Record<string, unknown>>({})
const savingCell = ref<string | null>(null)

// A new page of rows makes every override stale by definition.
watch(
    () => t.rows.value,
    () => (cellOverrides.value = {}),
)

function cellKey(row: Record<string, any>, column: string): string {
    return `${row.id}:${column}`
}

/** `in`, not `??` - an override of `false` or `0` is a real value. */
function cellValue(row: Record<string, any>, column: string): unknown {
    const key = cellKey(row, column)

    return key in cellOverrides.value ? cellOverrides.value[key] : row[column]
}

async function editCell(row: Record<string, any>, column: string, value: unknown) {
    const key = cellKey(row, column)
    const previous = cellValue(row, column)

    cellOverrides.value = { ...cellOverrides.value, [key]: value }
    savingCell.value = key

    try {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)

        const response = await fetch(`${props.schema.routes.index}/${row.id}/cell`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': match ? decodeURIComponent(match[1]) : '',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ column, value }),
        })

        if (!response.ok) {
            const body = await response.json().catch(() => ({}))

            throw new Error(body.message ?? 'That change was rejected.')
        }

        const saved = await response.json()
        cellOverrides.value = { ...cellOverrides.value, [key]: saved.value }

        // Tab counts and the total can both move when a status changes.
        router.reload({ only: ['tabCounts', 'total'] })
    } catch (e) {
        const { [key]: _discarded, ...rest } = cellOverrides.value
        cellOverrides.value = { ...rest, [key]: previous }

        toast.error(e instanceof Error ? e.message : 'That change was rejected.')
    } finally {
        savingCell.value = null
    }
}

/* ---------------------------------------------------------------------------
 * Bulk actions and export
 *
 * The selection can mean two very different things and they post differently:
 * a set of ticked ids, or "everything matching the current filters". The second
 * never sends ids - the whole point is that the set may be far larger than this
 * page has ever seen, so the server re-derives it from the same filter
 * parameters that drew the table.
 * ------------------------------------------------------------------------- */

const job = useBulkJob(props.schema.key, props.schema.routes.index)

/**
 * Hide actions the operator cannot perform.
 *
 * A UI HINT ONLY - every bulk request re-authorizes server-side against the
 * ability the action declares (§9 item 3). Hiding a button the policy would
 * refuse just avoids offering a guaranteed 403.
 */
const allowedBulkActions = computed(() =>
    props.schema.table.bulkActions.filter((action) =>
        (props.can as Record<string, boolean | undefined>)[action.ability] !== false,
    ),
)

function bulkTarget() {
    return t.allMatching.value
        ? { all: true }
        : { ids: Array.from(t.selected.value) as (string | number)[] }
}

/**
 * The row menu for one row: the declared structure, filtered for what this
 * operator may do and what this record is.
 *
 * VISIBILITY IS RE-CHECKED ON THE SERVER. This filtering exists so the menu
 * does not offer "Suspend" on a suspended row; it is not a permission boundary,
 * and the endpoint enforces both the policy and the same visibility rule again.
 * A hidden button is not a check (§9 item 3).
 *
 * The `visible` predicates cannot be sent as closures, so the server sends the
 * RESULT per row - see `row._actions`.
 */
function menuFor(row: Record<string, any>): RecordActionGroup[] {
    const available: string[] | null = row._actions ?? null

    const groups: RecordActionGroup[] = (props.schema.table.recordActions ?? [])
        .map((group: any) => ({
            label: group.label,
            actions: group.actions
                .filter(
                    (a: any) =>
                        (available === null || available.includes(a.key)) &&
                        (props.can as unknown as Record<string, boolean>)[a.ability] !== false,
                )
                // The URL is per-row, so it is resolved here rather than in the
                // schema - the schema is cached across every record.
                .map((a: any) => {
                    const action = { ...a, url: row._actionUrls?.[a.key] }

                    if (
                        a.link &&
                        ((a.key === 'view' && formUsesModal('view')) ||
                            (a.key === 'edit' && formUsesModal('edit')))
                    ) {
                        return { ...action, link: false }
                    }

                    return action
                }),
        }))
        // A heading over nothing reads as something failing to load.
        .filter((group: any) => group.actions.length > 0)

    /*
     * Delete joins the list as an ordinary declared action.
     *
     * It used to be markup appended after the loop, which meant RecordActions
     * could not know it existed - so the "no actions available" case and the
     * destructive separator both had to be reasoned about in two places. As a
     * synthetic entry it sorts itself: the component already puts every
     * destructive action last, separated, and never inline.
     *
     * The key is namespaced because it is NOT a server-declared action and must
     * never be sent to the action endpoint as one.
     */
    if (props.can.delete) {
        groups.push({
            actions: [{ key: DELETE_ACTION, label: 'Delete', icon: 'trash', destructive: true }],
        })
    }

    return groups
}

/** Not a server action: it opens the confirmation dialog instead. */
const DELETE_ACTION = '__delete'

/**
 * The RecordActions instance per row, so a right-click can open the right one.
 *
 * A plain Map keyed by row id rather than an array: rows are keyed by id in the
 * table too, so after a filter or a page change the surviving components keep
 * their entries and the departed ones unregister themselves. An index-keyed
 * array would silently point at whatever row now occupies that position.
 */
const rowMenus = new Map<string | number, { openContextMenu: (e: MouseEvent) => void }>()

function registerRowMenu(id: string | number, instance: unknown) {
    if (instance) {
        rowMenus.set(id, instance as { openContextMenu: (e: MouseEvent) => void })
    } else {
        rowMenus.delete(id)
    }
}

function onRowContextMenu(row: Record<string, any>, event: MouseEvent) {
    // Reordering is a mode where the only verb is "move"; opening an action
    // menu mid-drag offers things that contradict what the mode is for.
    if (reordering.value) {
        return
    }

    rowMenus.get(row.id)?.openContextMenu(event)
}

/**
 * A click on the row body opens the record.
 *
 * IT REUSES THE `view` RECORD ACTION rather than building a URL from the
 * resource name, and that is the whole design. The action list arriving with
 * each row has already been filtered by the policy for this record and this
 * user, so a row whose operator may not view it carries no `view` action and
 * simply does not navigate. Constructing `/clients/{id}` here would instead
 * send them to a page that 403s - the permission approximated in a second
 * place, and wrong.
 *
 * IT ALSO SILENTLY DOES NOTHING when the resource has no view page at all,
 * which is the correct outcome for a table whose records are edited in place.
 */
function onRowClick(row: Record<string, any>) {
    if (formUsesModal('view')) {
        openCrudModal('view', row)

        return
    }

    const view = menuFor(row)
        .flatMap((group) => group.actions)
        .find((a) => a.key === 'view' && a.link && a.url)

    if (view?.url) {
        router.visit(view.url)
    }
}

/** One entry point for both the inline buttons and the menu. */
function onRecordAction(row: Record<string, any>, action: RecordActionItem) {
    if (action.key === 'view' && formUsesModal('view')) {
        openCrudModal('view', row)

        return
    }

    if (action.key === 'edit' && formUsesModal('edit')) {
        openCrudModal('edit', row)

        return
    }

    if (action.key === DELETE_ACTION) {
        confirmingDelete.value = row

        return
    }

    /*
     * A FORM ACTION OPENS ITS DIALOG INSTEAD OF RUNNING.
     *
     * WITH NO NETWORK REQUEST, which is the point: the fields arrived with the
     * action in the schema, so this is local state. A dialog that fetched its
     * own fields would stall at the moment somebody has already committed to
     * acting - and on a row menu that is the worst possible moment for a
     * spinner.
     */
    if (action.form) {
        actionForm.value = { row, action, values: {}, errors: {}, processing: false }

        return
    }

    runRecordAction(row, action)
}

/**
 * Strip `action`/`record` from the URL once Inertia's own bookkeeping has
 * settled, not sooner.
 *
 * `history.replaceState` RIGHT AWAY LOSES THE RACE. This page's deferred
 * widget props each resolve as their own partial reload, and every one of
 * those has Inertia write `history.replaceState(page, '', page.url)` from
 * ITS OWN remembered URL - which is still the original `?action=&record=`
 * one, since only the browser's address bar was told about this page's
 * edit, never Inertia's router. A `setTimeout` deferral was tried first and
 * still lost some of the time, because the churn is however many deferred
 * props this resource declares, not one fixed tick.
 *
 * `router.on('success', ...)` FIRES AFTER EACH OF THOSE SETTLES, so
 * clearing on every one - which is a harmless no-op once the params are
 * already gone - means the last write, whenever it lands, is this one.
 */
function clearActionParams(): void {
    const url = new URL(window.location.href)

    url.searchParams.delete('action')
    url.searchParams.delete('record')
    window.history.replaceState(window.history.state, '', url)
}

function clearActionParamsOnNextSettle(): void {
    // Stripped once immediately - the only write that happens at all when
    // this resource has no deferred props to churn through.
    clearActionParams()

    const unsubscribe = router.on('success', () => {
        const url = new URL(window.location.href)

        if (!url.searchParams.has('action') && !url.searchParams.has('record')) {
            unsubscribe()

            return
        }

        clearActionParams()
    })
}

/**
 * `?action=<key>&record=<id>` opens that action on that record the moment
 * the list finishes loading - a link from a notification email, a saved
 * bookmark, an "approve this" message that should not cost its reader a
 * manual search first.
 *
 * SCOPED TO WHATEVER PAGE IS ALREADY LOADED. There is no per-record lookup
 * behind this - `t.rows` is exactly the page `useListTable` already fetched,
 * so a record on page 4,823 of an unfiltered list is not found by a link
 * built for page 1. That is stated here rather than quietly failing: the
 * honest fix (fetching one record outside the list's own pagination) is a
 * bigger, separately-scoped mechanism, and a link that sometimes silently
 * does nothing is worse than one that says why it didn't work.
 *
 * REUSES `menuFor()`/`onRecordAction()` RATHER THAN POSTING DIRECTLY, so a
 * deep-linked action goes through every check a clicked one does - the
 * per-row `_actions` filter, the ability check, the same form/confirm/link
 * branching - rather than a second, easier-to-drift path to the same POST.
 */
function openActionFromQueryString(): void {
    if (typeof window === 'undefined') {
        return
    }

    const params = new URLSearchParams(window.location.search)
    const actionKey = params.get('action')
    const recordId = params.get('record')

    if (!actionKey || !recordId) {
        return
    }

    clearActionParamsOnNextSettle()

    const row = t.rows.value.find((r) => String(r.id) === recordId)

    if (!row) {
        toast.error(`Record #${recordId} isn't in the current view. Search for it and try again.`)

        return
    }

    const action = menuFor(row)
        .flatMap((group) => group.actions)
        .find((a) => a.key === actionKey)

    if (!action) {
        toast.error(`"${actionKey}" isn't available for that record.`)

        return
    }

    onRecordAction(row, action)
}

onMounted(openActionFromQueryString)

/**
 * The open form action, or null.
 *
 * ONE AT A TIME, and holding the ROW rather than its id: the dialog names the
 * record it is about, and re-finding the row by id after a partial reload would
 * be a lookup that can fail while the dialog is open.
 */
const actionForm = ref<{
    /** Null for a bulk action, which applies to the selection rather than a row. */
    row: Record<string, any> | null
    action: RecordActionItem
    values: Record<string, any>
    errors: Record<string, string>
    processing: boolean
} | null>(null)

/**
 * Submit what the dialog collected.
 *
 * ERRORS ARE SHOWN IN PLACE, not as a toast. The server validates against the
 * fields the RESOURCE declared, so a 422 names a field this dialog is
 * displaying - and a toast saying "the given data was invalid" over a form that
 * shows nothing wrong is the least useful thing it could do.
 */
async function submitActionForm() {
    const open = actionForm.value

    if (!open) {
        return
    }

    open.processing = true
    open.errors = {}

    /*
     * A BULK FORM GOES THROUGH THE BULK PATH, which is not a detail: that path
     * chunks, can queue, and reports progress. Posting a selection to the
     * single-record endpoint would work for twenty rows and quietly fail for
     * forty thousand.
     */
    if (open.row === null) {
        actionForm.value = null

        await runBulk(open.action.key, open.values)

        return
    }

    try {
        const response = await fetch(`${props.schema.routes.index}/${open.row.id}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': csrfToken(),
            },
            credentials: 'same-origin',
            body: JSON.stringify({ action: open.action.key, data: open.values }),
        })

        if (response.status === 422) {
            const body = await response.json().catch(() => null)

            open.errors = Object.fromEntries(
                Object.entries(body?.errors ?? {}).map(([key, messages]) => [
                    key,
                    Array.isArray(messages) ? String(messages[0]) : String(messages),
                ]),
            )

            return
        }

        if (!response.ok) {
            const body = await response.json().catch(() => null)

            toast.error(body?.message ?? 'That action could not be completed.')

            return
        }

        const body = await response.json().catch(() => null)

        toast.success(`${open.action.label} done`)
        actionForm.value = null

        /*
         * A DECLARED `redirect()` WINS OVER THE DEFAULT RELOAD. Most actions
         * have nowhere else to go - "resend invoice" ends right back on this
         * list - but one that creates or opens something else (replicate,
         * "start onboarding") says so itself; see `RecordAction::redirect()`.
         */
        if (body?.redirect) {
            router.visit(body.redirect)

            return
        }

        // The list, not the row - see `runRecordAction` for why.
        router.reload({ only: ['records', 'total', 'tabCounts'] })
    } finally {
        if (actionForm.value) {
            actionForm.value.processing = false
        }
    }
}

/** Which action is in flight, as `rowId:actionKey`. */
const runningAction = ref<string | null>(null)

/**
 * The action key in flight FOR THIS ROW, or null.
 *
 * Scoped per row on purpose: `runningAction` is a single global, so returning
 * the bare key would disable the same button on all twenty-five rows while one
 * of them worked.
 */
function busyActionFor(row: Record<string, any>): string | null {
    const running = runningAction.value

    if (!running || !running.startsWith(`${row.id}:`)) {
        return null
    }

    return running.slice(String(row.id).length + 1)
}

async function executeRecordAction(row: Record<string, any>, action: any) {
    runningAction.value = `${row.id}:${action.key}`

    try {
        const response = await fetch(`${props.schema.routes.index}/${row.id}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': csrfToken(),
            },
            credentials: 'same-origin',
            body: JSON.stringify({ action: action.key }),
        })

        if (!response.ok) {
            const body = await response.json().catch(() => null)

            toast.error(body?.message ?? 'That action could not be completed.')

            return
        }

        const body = await response.json().catch(() => null)

        toast.success(`${action.label} done`)

        // See `submitActionForm` for why a declared redirect wins.
        if (body?.redirect) {
            router.visit(body.redirect)

            return
        }

        /*
         * The LIST is reloaded, not the row patched.
         *
         * An action changes the record's data and can change whether it still
         * belongs in the current view at all - suspending a client under an
         * "Active" tab means the row should leave. Patching in place would
         * leave it sitting there contradicting the filter above it.
         *
         * Partial: the schema does not travel again.
         */
        router.reload({ only: ['records', 'total', 'tabCounts'] })
    } finally {
        runningAction.value = null
    }
}

const pendingActionConfirmation = ref<{
    row: Record<string, any>
    action: any
} | null>(null)

function runRecordAction(row: Record<string, any>, action: any) {
    if (action.confirmation) {
        pendingActionConfirmation.value = { row, action }

        return
    }

    void executeRecordAction(row, action)
}

function confirmRecordAction() {
    const pending = pendingActionConfirmation.value
    pendingActionConfirmation.value = null

    if (pending) {
        void executeRecordAction(pending.row, pending.action)
    }
}

/**
 * Options for a searchable select inside an action dialog.
 *
 * THE SAME ENDPOINT THE RECORD FORM USES, and it needs no new one: the field
 * key identifies which declaration to search, and a form action's fields are
 * declared on the same resource. `@alxtexh-enterprise/panel` may not import an HTTP client,
 * which is why this lives here rather than in the control.
 */
async function searchActionOptions(
    field: string,
    term: string,
): Promise<{ value: any; label: string }[]> {
    const query = new URLSearchParams({ field, q: term })

    const res = await fetch(`${props.schema.routes.index}/field-options?${query}`, {
        headers: { Accept: 'application/json' },
    })

    if (!res.ok) {
        throw new Error(String(res.status))
    }

    return (await res.json()).options
}

function csrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)

    return match ? decodeURIComponent(match[1]) : ''
}

/**
 * Whether dragging is offered right now.
 *
 * ONLY WHILE SORTED BY THE ORDER COLUMN. Under any other ordering a drag would
 * write a position whose effect is invisible - the row would not move, because
 * the table is not sorted by the thing that changed - and that reads as the
 * drag having silently failed. Searching and filtering are fine: the visible
 * rows still redistribute their own positions among themselves.
 */
const canReorder = computed(
    () =>
        !!props.schema.table.reorderable &&
        props.sort === props.schema.table.reorderable &&
        props.can.update !== false,
)

/**
 * Whether the table is currently being arranged.
 *
 * A MODE, entered deliberately. Handles on every row all the time are clutter
 * on a table nobody reorders daily, and they make an ordinary list look
 * half-editable. Entering the mode also suppresses selection - choosing rows
 * and arranging them are different intents, and offering both at once means
 * every drag starts by wondering whether it will tick a checkbox.
 */
const reordering = ref(false)

const showEmptyCreate = computed(() => canWrite.value && props.can.create && !reordering.value)

/*
 * Leaving the ordering drops out of the mode.
 *
 * Sorting by name while holding a reorder handle would let somebody drag under
 * an ordering where the result is invisible - the row would not move, because
 * the table is not sorted by the thing that changed.
 */
watch(
    () => props.sort,
    () => {
        reordering.value = false
    },
)

/**
 * Persist a new order for the visible page.
 *
 * The rows are NOT patched optimistically. A reorder rewrites positions that
 * the next page's cursor is derived from, so showing a provisional order and
 * then reloading would flash twice; reloading once is both simpler and honest
 * about when the change is real.
 */
async function persistOrder(ids: (string | number)[]) {
    const response = await fetch(`${props.schema.routes.index}/reorder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ ids }),
    })

    if (!response.ok) {
        toast.error('That order could not be saved.')

        return
    }

    router.reload({ only: ['records'] })
}

async function runBulk(action: string, data?: Record<string, unknown>) {
    await job.run(action, bulkTarget(), data)

    if (job.error.value) {
        toast.error(job.error.value)

        return
    }

    // A queued run reports when it lands, not now.
    if (job.progress.value?.status === 'done') {
        const done = job.progress.value.done.toLocaleString()
        const skipped = job.progress.value.skipped ?? 0

        toast.success(
            skipped > 0
                ? `${done} records updated; ${skipped.toLocaleString()} skipped by policy`
                : `${done} records updated`,
        )
        t.clearSelection()
    }
}

/**
 * A bulk action that asks for something opens the SAME dialog a record action
 * does - see `actionForm`. What differs is only what the footer says it will
 * touch, which is the count the selection already knows.
 */
function onBulkAction(key: string) {
    const action = allowedBulkActions.value.find((a) => a.key === key)

    if (action?.form) {
        actionForm.value = {
            row: null,
            action: action as any,
            values: {},
            errors: {},
            processing: false,
        }

        return
    }

    runBulk(key)
}

async function exportSelection() {
    await job.exportView(bulkTarget())

    if (job.error.value) {
        toast.error(job.error.value)
    }
}

const importing = ref(false)

function onImported(written: number) {
    importing.value = false
    toast.success(
        `${written.toLocaleString()} ${(written === 1 ? props.schema.label : props.schema.labelPlural).toLowerCase()} imported`,
    )
    router.reload({ only: ['records', 'total', 'tabCounts'] })
}

/**
 * A finished export announces itself rather than downloading silently.
 *
 * An automatic `window.location = url` on a background job fires whenever the
 * poll happens to resolve, which can be minutes after the click and while the
 * operator is reading something else - a file appearing unbidden reads as a
 * bug. The toast is persistent because the alternative is a download link that
 * times out while they are looking away.
 */
watch(
    () => job.downloadUrl.value,
    (url) => {
        if (!url) {
            return
        }

        toast.success('Your export is ready', {
            duration: Number.POSITIVE_INFINITY,
            action: { label: 'Download', onClick: () => window.location.assign(url) },
        })
    },
)

watch(
    () => job.error.value,
    (message) => {
        if (message) {
            toast.error(message)
        }
    },
)

function destroy() {
    const row = confirmingDelete.value

    if (!row || deleting.value) {
        return
    }

    deleting.value = true

    router.delete(`${props.schema.routes.index}/${row.id}`, {
        preserveScroll: true,
        onSuccess: () => {
            confirmingDelete.value = null
            toast.success(`${props.schema.label} deleted`)
            router.reload({ only: ['records', 'total', 'tabCounts'] })
        },
        onError: () => toast.error(`Could not delete this ${props.schema.label.toLowerCase()}`),
        onFinish: () => {
            deleting.value = false
        },
    })
}
/* ---------------------------------------------------------------------------
 * Staying fresh
 *
 * The page does not know or care which transport is configured. `poll` needs no
 * infrastructure and works on plain PHP-FPM; `broadcast` needs Reverb and gives
 * constant server cost regardless of viewer count. Switching is a config change.
 *
 * The fetch lives HERE rather than in the composable because @alxtexh-enterprise/panel may
 * not import Inertia or ship an HTTP client (spec §4).
 * ------------------------------------------------------------------------- */

// NOTHING IS DESTRUCTURED, and that is the whole point of calling it.
//
// `status` went unused when the live badge was removed (Part G.2) and
// `recentlyChanged` - the set of rows a patch just touched - was destructured
// for a row highlight that went with it. The transport still runs and rows
// still move; nothing advertises it. Naming a binding no template reads is how
// a removed feature keeps looking present.
useLiveUpdates({
    config: props.live,
    rows: t.rows,
    fetchChanges: async (ids, since) => {
        const query = new URLSearchParams({ ids: ids.join(','), since })
        const res = await fetch(`${props.schema.routes.index}/updates?${query}`, {
            headers: { Accept: 'application/json' },
        })

        if (!res.ok) {
            throw new Error(String(res.status))
        }

        return res.json()
    },
    // Rule 7: after a pause or a reconnect, refetch rather than trusting local
    // state. Data only - the schema does not travel again.
    onResync: () => router.reload({ only: ['records', 'total', 'tabCounts'] }),
})
/**
 * What a badge reads as.
 *
 * THE COLUMN'S OWN MAP FIRST. A boolean has no words of its own, and the old
 * fallback - the column's label for true, "not <label>" for false - only worked
 * while the label happened to be an adjective. Renaming a column to "Status"
 * made every active row read "Status" and every retired one "Not status".
 *
 * The fallback stays for columns that never declared a map, because a bare
 * `true` on screen is worse than a clumsy sentence.
 */
function badgeLabel(key: string, value: unknown): string {
    const column = byKey.value[key] as
        | { label?: string; labels?: Record<string, string>; options?: Record<string, string> }
        | undefined
    const lookup = typeof value === 'boolean' ? (value ? '1' : '0') : String(value)

    if (column?.labels?.[lookup] !== undefined) {
        return column.labels[lookup]
    }

    if (column?.options?.[lookup] !== undefined) {
        return column.options[lookup]
    }

    if (typeof value === 'boolean') {
        return value ? (column?.label ?? 'Yes') : `Not ${(column?.label ?? 'set').toLowerCase()}`
    }

    return String(value)
}
</script>

<template>
    <Head :title="schema.labelPlural" />

    <div class="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col gap-4 p-3 sm:p-4">
        <!--
            WIDGETS ABOVE THE LIST - what `Resource::headerWidgets()` declares.
            The open-ticket count above the ticket table, which previously meant
            a custom page that reimplemented the list.

            RENDERED BY `PanelWidgets`, NOT INLINE HERE ANY MORE. This screen
            drew the stats and silently dropped `headerCharts`: a resource could
            declare a chart, the server resolved it, and nothing appeared. The
            shared component draws both, and is the same one a custom page uses
            for `Page::headerWidgets()`.
        -->
        <PanelWidgets />
        <!--
            THE CLUSTER SUB-NAVIGATION - roadmap 4.1. The sidebar shows one
            entry for the whole cluster; this strip is where its members
            actually live. Links, not buttons: each one is a page with its own
            URL, history entry and refresh behaviour. Rendered above the page
            title because it is navigation BETWEEN screens, not a control of
            this one - putting it any lower would read as a table mode.
        -->
        <nav
            v-if="cluster"
            :aria-label="`${cluster.label} sections`"
            class="text-muted-foreground -mb-1 flex flex-wrap items-center gap-1 text-sm"
        >
            <Link
                v-for="item in cluster.items"
                :key="item.href"
                :href="item.href"
                :aria-current="item.current ? 'page' : undefined"
                class="rounded-md px-2.5 py-1 transition-colors"
                :class="
                    item.current ? 'bg-muted text-foreground font-medium' : 'hover:text-foreground'
                "
            >
                {{ item.title }}
            </Link>
        </nav>

        <RenderHook
            position="list.before-header"
            :hooks="renderHooks"
            :resource="schema.key"
            :base-url="schema.routes.index"
        />

        <div class="flex flex-col gap-4">
            <PkPageHeader :title="schema.labelPlural" :purpose="schema.purpose">
                <template #actions>
                    <!--
                        ONE GROUP, TRAILING EDGE, PRIMARY LAST - DESIGN_RULES rules
                        1 and 2. The header row has exactly TWO flex children; with
                        the actions loose, `justify-between` distributed them across
                        the full width - one left, one centre, one right - which is
                        not a layout anyone chose, just what the browser does when
                        nobody groups. (Reorder is not here at all: it is a MODE,
                        so it lives in the table's own toolbar as an icon - rule 3.)
                    -->
                    <Button
                        v-if="canWrite && can.import && !reordering"
                        variant="outline"
                        size="sm"
                        @click="importing = true"
                    >
                        Import
                    </Button>

                    <!--
                        A `<Link>` WEARING BUTTON CLASSES, not a `<Button as-child>`
                        wrapping one. `PkButton` never merges its classes onto a
                        child - see its own note - so `as-child` here used to render
                        as an inert attribute on a real `<button>` with this `<Link>`
                        as an `<a>` INSIDE it: two interactive elements where a
                        screen reader or keyboard user expects one.
                    -->
                    <Link
                        v-if="schema.routes.attach && canWrite && can.update && !reordering"
                        :href="schema.routes.attach"
                        :class="buttonClasses({ variant: 'outline', size: 'sm' })"
                    >
                        Attach
                    </Link>
                    <Link
                        v-if="canWrite && can.create && !reordering && !formUsesModal('create')"
                        :href="`${schema.routes.index}/create`"
                        :class="buttonClasses({ size: 'sm' })"
                    >
                        New {{ schema.label }}
                    </Link>
                    <Button
                        v-else-if="canWrite && can.create && !reordering && formUsesModal('create')"
                        size="sm"
                        @click="openCrudModal('create')"
                    >
                        New {{ schema.label }}
                    </Button>
                </template>
            </PkPageHeader>

            <div v-if="schema.lenses?.length" class="flex flex-wrap items-center gap-2">
                <span class="text-muted-foreground text-xs font-medium uppercase tracking-wide"
                    >Lens</span
                >
                <button
                    type="button"
                    :class="
                        buttonClasses({
                            variant: !lens ? 'default' : 'outline',
                            size: 'sm',
                        })
                    "
                    @click="setLens(null)"
                >
                    All
                </button>
                <button
                    v-for="item in schema.lenses"
                    :key="item.key"
                    type="button"
                    :class="
                        buttonClasses({
                            variant: lens === item.key ? 'default' : 'outline',
                            size: 'sm',
                        })
                    "
                    @click="setLens(item.key)"
                >
                    {{ item.label }}
                </button>
            </div>
        </div>

        <!--
            Said once, at the top, rather than as a tooltip on every handle: the
            mode is unusual enough to need explaining and short enough to leave.
        -->
        <p
            v-if="reordering"
            class="bg-muted/40 text-muted-foreground rounded-xl border px-3 py-2.5 text-xs sm:px-4"
        >
            Drag rows to change their order. Changes save as you drop them.
        </p>

        <!--
            The list page's context, forwarded the same way the record page
            forwards its record - so a plugin's component can address this
            resource's endpoints without knowing which portal it is in.
        -->
        <RenderHook
            position="list.before-table"
            :hooks="renderHooks"
            :resource="schema.key"
            :base-url="schema.routes.index"
        />

        <!--
            ONE CARD, NOT FOUR - DESIGN_RULES rule 4. Tabs, toolbar, rows and
            pagination were four sibling cards with gaps, so the controls read
            as separate widgets that happened to be nearby. The shell owns the
            border; the bands own their content.
        -->
        <TableShell :toolbar-tint="t.selected.value.size || reordering ? 'muted' : 'none'">
            <template v-if="schema.table.tabs.length" #tabs>
                <TableTabs
                    :tabs="schema.table.tabs"
                    :active="tab"
                    :counts="tabCounts"
                    @select="t.setTab"
                />
            </template>

            <!-- The selection bar REPLACES the toolbar while rows are chosen:
                 search and filters would change the set out from under the
                 selection, so the two never make sense at once. -->
            <template #toolbar>
                <SelectionBar
                    v-if="t.selected.value.size"
                    :count="t.selected.value.size"
                    :all-matching="t.allMatching.value"
                    :total="total"
                    @select-all-matching="t.selectAllMatching"
                    @clear="t.clearSelection"
                >
                    <template #actions>
                        <BulkActions
                            :actions="allowedBulkActions"
                            :count="t.selected.value.size"
                            :all-matching="t.allMatching.value"
                            :total="total"
                            :busy="job.busy.value"
                            @run="onBulkAction"
                            @export="exportSelection"
                        />
                    </template>
                </SelectionBar>

                <TableToolbar
                    v-else
                    :search="search"
                    :search-placeholder="`Search ${schema.labelPlural.toLowerCase()}…`"
                    search-hint="Matches the start of any word in the searchable columns"
                    :filter-schema="filterSchema"
                    :filters="filters"
                    :columns="columns"
                    :hidden="hidden"
                    :loading="t.showSpinner.value"
                    :reorderable="canReorder"
                    :reordering="reordering"
                    :groups="schema.table.groups ?? []"
                    :group-by="groupBy ?? null"
                    :indicators="indicators ?? []"
                    :layouts="schema.table.layouts ?? []"
                    :layout="indexLayout"
                    @update:search="t.setSearch"
                    @apply-filters="t.applyFilters"
                    @apply-columns="applyColumns"
                    @clear="t.clearAll"
                    @toggle-reorder="reordering = !reordering"
                    @group="t.setGroup"
                    @clear-filter="t.setFilter($event, null)"
                    @clear-filters="t.resetFilters"
                    @layout="setIndexLayout"
                />
                <SavedViews
                    :views="savedViews"
                    :active="activeSavedView"
                    @save="saveView"
                    @apply="applySavedView"
                    @remove="removeSavedView"
                />
            </template>

            <!--
            One boundary around the table, not one per row.

            A row that throws does so because of the SHAPE of the data - a
            column renderer meeting a type it did not expect - and that shape is
            almost always shared by every row on the page. Twenty-five identical
            failure cards is not more useful than one, and it is much harder to
            read.
        -->
            <PkBoundary label="The table" class="flex min-h-0 shrink grow-0 flex-col">
                <div
                    v-if="indexLayout === 'cards' && (schema.table.layouts ?? []).includes('cards')"
                    class="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3"
                    data-slot="resource-cards"
                >
                    <button
                        v-for="(row, index) in t.rows.value"
                        :key="String(row[schema.table.rowKey ?? 'id'] ?? index)"
                        type="button"
                        class="border-border bg-card hover:bg-muted/40 flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors"
                        @click="schema.table.rowClick === 'view' ? onRowClick(row) : undefined"
                    >
                        <span class="text-foreground font-medium">
                            {{ row[cardTitleKey] ?? 'Untitled' }}
                        </span>
                        <dl class="text-muted-foreground grid gap-1 text-xs">
                            <div
                                v-for="col in cardDetailColumns"
                                :key="col.key"
                                class="flex justify-between gap-2"
                            >
                                <dt class="shrink-0">{{ col.label }}</dt>
                                <dd class="truncate text-right">
                                    {{ render(col.key, row[col.key], row) }}
                                </dd>
                            </div>
                        </dl>
                    </button>
                    <p
                        v-if="t.rows.value.length === 0"
                        class="text-muted-foreground col-span-full py-8 text-center text-sm"
                    >
                        {{ `No ${schema.labelPlural.toLowerCase()} yet` }}
                    </p>
                </div>
                <DataTable
                    v-else
                    :framed="false"
                    :striped="Boolean(schema.table.striped)"
                    :sticky-first="Boolean(schema.table.stickyFirstColumn)"
                    :resizable="Boolean(schema.table.resizableColumns)"
                    :column-widths="widths"
                    :group-by="groupBy ?? schema.table.groupBy ?? null"
                    :collapsed-groups-by-default="schema.table.collapsedGroupsByDefault ?? false"
                    :reordering="reordering"
                    @reorder="persistOrder"
                    @row-contextmenu="onRowContextMenu"
                    :row-clickable="schema.table.rowClick === 'view'"
                    @row-click="onRowClick"
                    @resize="onColumnResize"
                    :columns="columns"
                    :rows="t.rows.value"
                    :row-key="schema.table.rowKey ?? 'id'"
                    :hidden="hidden"
                    :sort="sort"
                    :direction="direction"
                    :loading="t.loading.value"
                    :filtered="t.isFiltered.value"
                    selectable
                    :selected="t.selected.value"
                    :summaries="columnSummaries"
                    :summary-values="(page.props.summary as any) ?? null"
                    :empty-title="`No ${schema.labelPlural.toLowerCase()} yet`"
                    :empty-hint="emptyHint"
                    @sort="t.sortBy"
                    @toggle-row="t.toggleRow"
                    @toggle-page="t.togglePage"
                >
                    <!--
                ONE slot per column, branching inside.

                Two loops both emitting `cell:<key>` would collide: Vue keeps the
                last definition, so every badge column would silently render as
                plain text. The branch has to be inside a single loop.

                Nothing here names a resource - badge colouring comes from the
                schema's semantic map, and formatting from the column type.
            -->
                    <template v-for="col in columns" :key="col.key" #[`cell:${col.key}`]="{ row }">
                        <EditableCell
                            v-if="byKey[col.key]?.editable && byKey[col.key]?.type !== 'badge'"
                            :type="
                                byKey[col.key].type === 'toggle'
                                    ? 'toggle'
                                    : byKey[col.key].type === 'text'
                                      ? 'text'
                                      : 'select'
                            "
                            :value="cellValue(row, col.key)"
                            :options="byKey[col.key].options ?? {}"
                            :on-label="byKey[col.key].onLabel"
                            :off-label="byKey[col.key].offLabel"
                            :placeholder="byKey[col.key].placeholder"
                            :busy="savingCell === `${row.id}:${col.key}`"
                            :disabled="!can.update"
                            @change="(value: unknown) => editCell(row, col.key, value)"
                        />
                        <IconCell
                            v-else-if="byKey[col.key]?.type === 'icon'"
                            :value="row[col.key]"
                            :icons="byKey[col.key].icons ?? {}"
                            :colors="byKey[col.key].colors ?? {}"
                            :labels="byKey[col.key].labels ?? {}"
                            :default-icon="byKey[col.key].defaultIcon ?? 'dot'"
                        />
                        <ColourCell
                            v-else-if="byKey[col.key]?.type === 'colour'"
                            :value="row[col.key]"
                            :show-value="byKey[col.key].showValue !== false"
                        />
                        <CheckboxCell
                            v-else-if="byKey[col.key]?.type === 'checkbox'"
                            :value="row[col.key]"
                            :true-label="byKey[col.key].trueLabel"
                            :false-label="byKey[col.key].falseLabel"
                        />
                        <CodeCell
                            v-else-if="byKey[col.key]?.type === 'code'"
                            :value="row[col.key]"
                        />
                        <KeyValueCell
                            v-else-if="byKey[col.key]?.type === 'keyvalue'"
                            :value="row[col.key]"
                        />
                        <TagsCell
                            v-else-if="byKey[col.key]?.type === 'tags'"
                            :value="row[col.key]"
                            :limit="byKey[col.key].limit ?? null"
                            :separator="byKey[col.key].separator ?? ','"
                        />
                        <RatingCell
                            v-else-if="byKey[col.key]?.type === 'rating'"
                            :value="row[col.key]"
                            :max="byKey[col.key].max ?? 5"
                        />
                        <ImageCell
                            v-else-if="byKey[col.key]?.type === 'image'"
                            :src="row[col.key]"
                            :fallback-text="row[byKey[col.key].fallbackFrom ?? 'name']"
                            :rounded="byKey[col.key].rounded !== false"
                            :size="byKey[col.key].size ?? 'md'"
                            :fallback="byKey[col.key].fallback ?? 'initials'"
                        />
                        <template v-else-if="badgeKeys.includes(col.key)">
                            <!--
                            AN EMPTY BADGE COLUMN IS AN EM DASH, not a badge -
                            the decision lives in `hasBadgeValue`, with its own
                            spec, because the inline version of this check once
                            rendered String(null) in a capitalize pill and an
                            unanswered question read as a value called "Null".
                        -->
                            <BadgeResolver
                                v-if="byKey[col.key]?.resolver && can.update"
                                :value="cellValue(row, col.key)"
                                :options="byKey[col.key].options ?? {}"
                                :colors="byKey[col.key].colors ?? {}"
                                :default-color="byKey[col.key].defaultColor"
                                :label="byKey[col.key].label"
                                :busy="savingCell === `${row.id}:${col.key}`"
                                @change="(value: string) => editCell(row, col.key, value)"
                            />
                            <Badge
                                v-else-if="hasBadgeValue(row[col.key])"
                                :variant="badgeVariant(col.key, row[col.key]) as any"
                                class="capitalize"
                            >
                                {{ badgeLabel(col.key, row[col.key]) }}
                            </Badge>
                            <span v-else>{{ render(col.key, row[col.key], row) }}</span>
                        </template>
                        <Link
                            v-else-if="col.key === 'name'"
                            :href="`${schema.routes.index}/${row.id}`"
                            class="hover:text-primary hover:underline"
                        >
                            {{ render(col.key, row[col.key], row) }}
                        </Link>
                        <span v-else>{{ render(col.key, row[col.key], row) }}</span>
                    </template>

                    <template #clear-filters>
                        <Button variant="link" size="sm" @click="t.clearAll">Clear filters</Button>
                    </template>

                    <template v-if="showEmptyCreate" #empty-actions>
                        <Link
                            v-if="!formUsesModal('create')"
                            :href="`${schema.routes.index}/create`"
                            :class="buttonClasses({ size: 'sm' })"
                        >
                            New {{ schema.label }}
                        </Link>
                        <Button v-else size="sm" @click="openCrudModal('create')">
                            New {{ schema.label }}
                        </Button>
                    </template>

                    <template #actions="{ row }">
                        <RenderHook
                            position="list.row-actions-before"
                            :hooks="renderHooks"
                            :resource="schema.key"
                            :row="row"
                        />

                        <component
                            :is="
                                schema.table.inlineRecordActions
                                    ? InlineRecordActions
                                    : RecordActions
                            "
                            :ref="(el: any) => registerRowMenu(row.id, el)"
                            :groups="menuFor(row)"
                            :title="row.name ?? `#${row.id}`"
                            :busy="busyActionFor(row)"
                            @run="onRecordAction(row, $event)"
                        />

                        <RenderHook
                            position="list.row-actions-after"
                            :hooks="renderHooks"
                            :resource="schema.key"
                            :row="row"
                        />
                    </template>
                </DataTable>
            </PkBoundary>

            <template #pagination>
                <TablePagination
                    :page="t.page.value"
                    :per-page="perPage"
                    :per-page-options="perPageOptions"
                    :rows-on-page="t.rows.value.length"
                    :has-next="t.hasNext.value"
                    :has-previous="t.hasPrevious.value"
                    :total="total"
                    :loading="t.loading.value"
                    @first="t.firstPage"
                    @update:per-page="t.setPerPage"
                    @next="t.nextPage"
                    @previous="t.previousPage"
                />
            </template>
        </TableShell>

        <PanelWidgets prefix="footer" />

        <PkModal
            :open="!!confirmingDelete"
            :title="`Delete ${schema.label}?`"
            description="This cannot be undone."
            :busy="deleting"
            @close="confirmingDelete = null"
        >
            <p class="text-sm">
                <strong>{{ confirmingDelete?.name ?? `#${confirmingDelete?.id}` }}</strong>
                will be permanently removed.
            </p>

            <template #footer>
                <Button variant="outline" @click="confirmingDelete = null">Cancel</Button>
                <Button variant="destructive" :disabled="deleting" @click="destroy">
                    {{ deleting ? 'Deleting…' : 'Delete' }}
                </Button>
            </template>
        </PkModal>

        <PkModal
            :open="pendingActionConfirmation !== null"
            :title="pendingActionConfirmation?.action.label ?? 'Confirm action'"
            :description="pendingActionConfirmation?.action.confirmation ?? undefined"
            :busy="runningAction !== null"
            @close="pendingActionConfirmation = null"
        >
            <template #footer>
                <Button variant="outline" @click="pendingActionConfirmation = null">Cancel</Button>
                <Button
                    variant="destructive"
                    :disabled="runningAction !== null"
                    @click="confirmRecordAction"
                >
                    {{ runningAction !== null ? 'Working…' : 'Confirm' }}
                </Button>
            </template>
        </PkModal>

        <!--
            THE FORM ACTION DIALOG.

            IT RENDERS THE SAME `SchemaNode` THE RECORD FORM DOES, so a field
            type works here the day it works there - including the ones with
            behaviour, like a searchable select. A parallel set of controls for
            dialogs would be the same components again, drifting.
        -->
        <PkSlideover
            v-if="actionForm?.action.slideOver"
            :open="!!actionForm"
            :title="actionForm?.action.label ?? ''"
            :description="actionForm?.action.confirmation ?? undefined"
            size="lg"
            :busy="Boolean(actionForm?.processing)"
            @close="actionForm = null"
        >
            <form class="flex flex-col gap-4" @submit.prevent="submitActionForm">
                <SchemaNode
                    v-for="(node, index) in actionForm?.action.form?.nodes ?? []"
                    :key="index"
                    :node="node as any"
                    :values="actionForm!.values"
                    :errors="actionForm!.errors"
                    :processing="actionForm!.processing"
                    :search-options="searchActionOptions"
                    @change="(key: string, value: any) => (actionForm!.values[key] = value)"
                />
            </form>

            <template #footer>
                <div
                    v-if="actionForm?.action.extraFooterActions?.length"
                    class="mr-auto flex flex-wrap gap-1"
                >
                    <Button
                        v-for="extra in actionForm.action.extraFooterActions"
                        :key="extra.label"
                        as="a"
                        variant="ghost"
                        size="sm"
                        :href="extra.url ?? undefined"
                        target="_blank"
                        rel="noopener"
                        :class="actionColorTone(extra.color)"
                    >
                        {{ extra.label }}
                    </Button>
                </div>

                <Button
                    variant="outline"
                    :disabled="actionForm?.processing"
                    @click="actionForm = null"
                >
                    {{ actionForm?.action.cancelLabel ?? 'Cancel' }}
                </Button>

                <Button :disabled="actionForm?.processing" @click="submitActionForm">
                    {{
                        actionForm?.processing
                            ? 'Working…'
                            : (actionForm?.action.submitLabel ?? actionForm?.action.label)
                    }}
                </Button>
            </template>
        </PkSlideover>

        <PkModal
            v-else-if="actionForm"
            :open="!!actionForm"
            :title="actionForm?.action.label ?? ''"
            :description="actionForm?.action.confirmation ?? undefined"
            :size="actionForm?.action.modalWidth ?? 'form'"
            :busy="Boolean(actionForm?.processing)"
            @close="actionForm = null"
        >
            <form class="flex flex-col gap-4" @submit.prevent="submitActionForm">
                <SchemaNode
                    v-for="(node, index) in actionForm?.action.form?.nodes ?? []"
                    :key="index"
                    :node="node as any"
                    :values="actionForm!.values"
                    :errors="actionForm!.errors"
                    :processing="actionForm!.processing"
                    :search-options="searchActionOptions"
                    @change="(key: string, value: any) => (actionForm!.values[key] = value)"
                />
            </form>

            <template #footer>
                <div
                    v-if="actionForm?.action.extraFooterActions?.length"
                    class="mr-auto flex flex-wrap gap-1"
                >
                    <Button
                        v-for="extra in actionForm.action.extraFooterActions"
                        :key="extra.label"
                        as="a"
                        variant="ghost"
                        size="sm"
                        :href="extra.url ?? undefined"
                        target="_blank"
                        rel="noopener"
                        :class="actionColorTone(extra.color)"
                    >
                        {{ extra.label }}
                    </Button>
                </div>

                <Button
                    variant="outline"
                    :disabled="actionForm?.processing"
                    @click="actionForm = null"
                >
                    {{ actionForm?.action.cancelLabel ?? 'Cancel' }}
                </Button>

                <Button :disabled="actionForm?.processing" @click="submitActionForm">
                    {{
                        actionForm?.processing
                            ? 'Working…'
                            : (actionForm?.action.submitLabel ?? actionForm?.action.label)
                    }}
                </Button>
            </template>
        </PkModal>

        <ImportDialog
            :open="importing"
            :base-url="schema.routes.index"
            :resource-label="schema.labelPlural"
            :excel="Boolean(can.excelImport)"
            @close="importing = false"
            @imported="onImported"
        />

        <ResourceCrudModal
            v-if="crudModal"
            :open="!!crudModal"
            :mode="crudModal.mode"
            :base-url="schema.routes.index"
            :schema="schema"
            :record-id="crudModal.recordId"
            @close="crudModal = null"
            @saved="onCrudSaved"
        />
    </div>
</template>
