import { router } from '@inertiajs/vue3'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

/**
 * The Inertia adapter.
 *
 * This is the ONLY place that knows list screens are driven by Inertia. It lives
 * in the app, not in @alxtexh-enterprise/panel, because spec §4 rule 1 says nothing in the UI
 * package may import Inertia - the components emit events, and this turns those
 * events into requests. Swapping Inertia for anything else means rewriting this
 * file and nothing else.
 *
 * Everything §10 requires of the transport lives here once:
 *
 *   - `only:` so a filter change carries DATA ONLY, never the page shell
 *   - preserveState/preserveScroll so the table never unmounts or jumps
 *   - `replace: true` so filtering does not bury the back button in history
 *   - a 300 ms delay before any loading indicator, because a flash of spinner
 *     reads as slower than a brief pause
 *   - keyset paging via a client-side cursor stack, so "previous" is free
 */
export interface ListPageProps {
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
    lens?: string | null
}

export interface ListTableOptions {
    /** Property on each row that uniquely identifies it. Defaults to `id`. */
    rowKey?: string
    /** Keys the group picker may send. Empty means grouping is not pickable. */
    groupKeys?: string[]
    /** Active resource lens key, when switching alternate index views. */
    lens?: string | null
}

export function useListTable(url: string, props: ListPageProps, options: ListTableOptions = {}) {
    const rowKey = options.rowKey ?? 'id'
    const rows = ref<Record<string, any>[]>([...props.records])
    const loading = ref(false)
    const showSpinner = ref(false)

    let spinnerTimer: ReturnType<typeof setTimeout> | undefined
    let requestSequence = 0

    /**
     * Cursors for the pages already visited, oldest first.
     *
     * Keyset pagination only knows how to go FORWARD - a cursor says "everything
     * after this row", not "everything before it". Rather than run a second
     * reversed query to walk backwards, the pages we have already been through
     * are remembered here, so "previous" is a stack pop and costs the server
     * nothing beyond re-fetching that page.
     *
     * `stack[i]` is the cursor that produced page i+2 (page 1 needs no cursor).
     */
    const cursorStack = ref<string[]>([])
    const page = computed(() => cursorStack.value.length + 1)

    /**
     * Selected record ids.
     *
     * `allMatching` is a separate flag rather than "every id loaded", because
     * the operator's intent is usually the whole filtered set (§8:
     * select-all-matching-filter, not select-all-on-page). Enumerating 11,111
     * ids into the browser to express that would be absurd; the flag says
     * "everything the current filters match" and the server re-derives it.
     */
    const selected = ref<Set<string | number>>(new Set())
    const allMatching = ref(false)

    function idOf(row: Record<string, any>): string | number | null {
        const value = row[rowKey]

        if (value === null || value === undefined || value === '') {
            return null
        }

        return value as string | number
    }

    function clearSelection() {
        selected.value = new Set()
        allMatching.value = false
    }

    function toggleRow(id: string | number) {
        if (id === '') {
            return
        }

        const next = new Set(selected.value)

        if (next.has(id)) {
            next.delete(id)
        } else {
            next.add(id)
        }

        selected.value = next
        // Removing a row means the selection is no longer "everything".
        allMatching.value = false
    }

    function togglePage(select: boolean) {
        const next = new Set(selected.value)

        for (const row of props.records) {
            const id = idOf(row)

            if (id === null) {
                continue
            }

            if (select) {
                next.add(id)
            } else {
                next.delete(id)
            }
        }

        selected.value = next
        allMatching.value = false
    }

    function selectAllMatching() {
        togglePage(true)
        allMatching.value = true
    }

    // Any change to filters, sort, search or page size invalidates the trail:
    // those cursors point into a result set that no longer exists.
    function resetPagination() {
        cursorStack.value = []
    }

    watch(
        () => props.records,
        (records) => {
            rows.value = [...records]
        },
    )

    /**
     * Builds the query string from current state plus an override.
     *
     * `null` removes a parameter; `false` must NOT - it is an applied value for
     * a tri-state boolean filter, and dropping it would silently turn "only
     * inactive" into "no filter".
     */
    function query(overrides: Record<string, unknown> = {}): Record<string, string> {
        const merged: Record<string, unknown> = {
            search: props.search,
            sort: props.sort,
            direction: props.direction,
            perPage: props.perPage,
            tab: props.tab,
            group: props.groupBy?.key ?? ((options.groupKeys?.length ?? 0) > 0 ? '-' : null),
            lens: options.lens ?? props.lens ?? null,
            ...props.filters,
            ...overrides,
        }

        const out: Record<string, string> = {}

        for (const [key, value] of Object.entries(merged)) {
            if (value === null || value === undefined || value === '') {
                continue
            }

            if (typeof value === 'boolean') {
                out[key] = value ? '1' : '0'
                continue
            }

            out[key] = String(value)
        }

        // Defaults are omitted so a pristine URL stays clean and shareable.
        if (out.sort === 'created_at') {
            delete out.sort
        }

        if (out.direction === 'desc') {
            delete out.direction
        }

        return out
    }

    /**
     * Any state change other than paging. Always returns to page 1, because the
     * cursor trail describes a result set the new filters no longer produce.
     */
    function apply(overrides: Record<string, unknown> = {}) {
        resetPagination()
        // A selection describes a result set. Change the result set and the
        // selection is meaningless - worse, a bulk action on a stale selection
        // would hit rows the operator can no longer see.
        clearSelection()
        request(query(overrides))
    }

    function request(params: Record<string, string>) {
        const sequence = ++requestSequence

        loading.value = true
        const timer = setTimeout(() => {
            if (sequence === requestSequence) {
                showSpinner.value = true
            }
        }, 300)

        spinnerTimer = timer

        router.get(url, params, {
            only: [
                'records',
                'filters',
                'search',
                'sort',
                'direction',
                'nextCursor',
                'perPage',
                'tab',
                'total',
                'tabCounts',
                'groupBy',
                'indicators',
                'lens',
            ],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => {
                // Inertia calls completion handlers for cancelled requests as
                // well. An older response must never hide the loading state of
                // the newer request that replaced it.
                if (sequence !== requestSequence) {
                    return
                }

                clearTimeout(timer)
                spinnerTimer = undefined
                loading.value = false
                showSpinner.value = false
            },
        })
    }

    onBeforeUnmount(() => {
        requestSequence++

        if (spinnerTimer) {
            clearTimeout(spinnerTimer)
            spinnerTimer = undefined
        }

        loading.value = false
        showSpinner.value = false
    })

    function nextPage() {
        if (!props.nextCursor || loading.value) {
            return
        }

        const cursor = props.nextCursor
        cursorStack.value = [...cursorStack.value, cursor]
        request({ ...query(), cursor })
    }

    function previousPage() {
        if (cursorStack.value.length === 0 || loading.value) {
            return
        }

        // Drop the cursor that got us here; the one beneath it produced the
        // previous page. An empty stack means page 1, which takes no cursor.
        const stack = cursorStack.value.slice(0, -1)
        cursorStack.value = stack

        const cursor = stack.length ? stack[stack.length - 1] : null
        request(cursor ? { ...query(), cursor } : query())
    }

    /**
     * Back to page 1, without seeking anywhere.
     *
     * The cheapest operation in keyset pagination and the reason a "first"
     * control exists while a "last" one does not: page 1 is simply the query
     * with no cursor, so this drops the trail and re-asks. Nothing is walked
     * and nothing is discarded.
     */
    function firstPage() {
        if (cursorStack.value.length === 0 || loading.value) {
            return
        }

        cursorStack.value = []
        request(query())
    }

    function setTab(tab: string | null) {
        apply({ tab })
    }

    function setPerPage(value: number) {
        apply({ perPage: value })
    }

    function sortBy(key: string) {
        const direction = props.sort === key && props.direction === 'desc' ? 'asc' : 'desc'
        apply({ sort: key, direction })
    }

    function setFilter(key: string, value: unknown) {
        apply({ [key]: value })
    }

    /**
     * Apply a whole filter set in ONE request.
     *
     * Choosing four filters one click at a time cost four round trips and four
     * repaints, with the list rearranging under the cursor between each. Staged
     * in the panel and applied together, it costs one.
     */
    function applyFilters(next: Record<string, unknown>) {
        apply(next)
    }

    function setGroup(key: string | null) {
        apply({ group: key ?? '-' })
    }

    function setSearch(value: string) {
        apply({ search: value })
    }

    function resetFilters() {
        apply(Object.fromEntries(Object.keys(props.filters).map((k) => [k, null])))
    }

    function clearAll() {
        apply({
            search: '',
            ...Object.fromEntries(Object.keys(props.filters).map((k) => [k, null])),
        })
    }

    const isFiltered = computed(
        () =>
            props.search !== '' ||
            Object.values(props.filters).some((v) => v !== null && v !== undefined),
    )

    return {
        rows,
        loading,
        showSpinner,
        isFiltered,
        page,
        selected,
        allMatching,
        toggleRow,
        togglePage,
        selectAllMatching,
        clearSelection,
        setTab,
        hasNext: computed(() => props.nextCursor !== null),
        hasPrevious: computed(() => cursorStack.value.length > 0),
        apply,
        nextPage,
        previousPage,
        firstPage,
        setPerPage,
        sortBy,
        setFilter,
        applyFilters,
        setGroup,
        setSearch,
        resetFilters,
        clearAll,
    }
}
