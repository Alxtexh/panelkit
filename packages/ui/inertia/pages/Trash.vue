<script setup lang="ts">
/**
 * Everything that was deleted, and how long is left to change your mind.
 *
 * IT EXISTS BECAUSE A DELETE HAD NOWHERE TO GO. Soft deletes, restore and
 * force-delete were all implemented and all reachable only through a `Deleted`
 * option on one table's filter panel - so a removed subscriber sat inside the
 * live list under a control nobody opens, and the endpoint that could bring it
 * back had no button anywhere.
 *
 * TABS RATHER THAN STACKED SECTIONS, because the first question in a bin is
 * "which of these am I looking at". Stacked, a subscriber and a router are two
 * headings apart and a selection spanning both is a mistake waiting to happen;
 * as tabs there is exactly one resource on screen, its count is on the tab, and
 * a selection cannot silently include something from another table.
 *
 * SELECTION IS PER TAB AND CLEARED WHEN THE TAB CHANGES. Carrying ticks across
 * tabs is how somebody restores forty routers while looking at subscribers.
 *
 * DELETE FOREVER ASKS FIRST, AND IN THE PAGE. `window.confirm` is suppressed in
 * embedded browsers - it returns false without showing anything - so the one
 * irreversible action in the panel would silently do nothing for some people and
 * everything for others. The dialog is a component.
 *
 * THE DEADLINE IS ON EVERY ROW and configurable by whoever runs the panel,
 * between a week and a month. A bin that empties on a schedule nobody published
 * is one people learn not to trust; "3 days left" is what makes it something you
 * can plan around.
 *
 * THE ROWS ARE PAGED AND THE TAB LIVES IN THE URL - roadmap 5.2. This screen
 * used to receive a page of every resource's rows at once and pick a tab
 * client-side, which meant two things: a nine-resource panel described 225
 * records to render 25, and anything past the first 25 of a resource was
 * unreachable - delete thirty clients and five of them could not be restored
 * from the one screen built to restore them. The server now sends the tab
 * counts plus one keyset page of the resource named in the query string.
 *
 * THE SAME `TablePagination` AND CURSOR STACK EVERY OTHER LIST USES, not a
 * "load older" button - roadmap item 9 removed load-more from this codebase
 * once already, and a bin is a list somebody works through a page at a time
 * rather than a feed they scroll. Keyset forward only, with the visited
 * cursors kept client-side so "previous" is a stack pop; the trail resets on a
 * tab change, because those cursors point into another resource's ordering.
 */
import { Head, router } from '@inertiajs/vue3'
import { Check, RotateCcw, Settings2, Trash2, TriangleAlert } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { PAGE_SHELL, PkModal, TablePagination, TableShell } from '@alxtexh-enterprise/panel'
import { PkButton as Button } from '@alxtexh-enterprise/panel'

interface TrashedRecord {
    id: number | string
    title: string
    deletedAt: string
    purgesAt: string
    canRestore: boolean
    canForceDelete: boolean
}

interface TrashGroup {
    key: string
    label: string
    icon: string
    total: number
}

const props = defineProps<{
    groups: TrashGroup[]
    /** The tab the server rendered, so a reload lands back on it. */
    resource: string | null
    records: TrashedRecord[]
    nextCursor: string | null
    perPage: number
    prefix: string
    retentionDays: number
    retentionRange: { min: number; max: number }
    canConfigure: boolean
}>()

defineOptions({
    // Page props arrive as attributes and this root is a fragment.
    inheritAttrs: false,
    layout: { breadcrumbs: [{ title: 'Trash', href: '/trash' }] },
})

const selected = ref<Set<number | string>>(new Set())
const confirming = ref<'one' | 'many' | null>(null)
const confirmingRecord = ref<TrashedRecord | null>(null)
const confirmingRestore = ref<'one' | 'many' | null>(null)
const confirmingRestoreRecord = ref<TrashedRecord | null>(null)
const configuring = ref(false)
const days = ref(props.retentionDays)
const paging = ref(false)

/**
 * Cursors for the pages already visited, oldest first.
 *
 * A keyset cursor only knows how to go FORWARD - it says "everything after
 * this row", never "everything before it" - so rather than run a second
 * reversed query to walk back, the pages already stepped through are
 * remembered here and "previous" is a pop. `stack[i]` is the cursor that
 * produced page i+2; page 1 needs none. The same shape `useListTable` uses,
 * because it is the same problem.
 */
const stack = ref<string[]>([])
const page = computed(() => stack.value.length + 1)

const active = computed(() => props.resource ?? props.groups[0]?.key ?? '')

const total = computed(() => props.groups.reduce((sum, g) => sum + g.total, 0))

const group = computed(() => props.groups.find((g) => g.key === active.value) ?? props.groups[0])

/** Rows in this tab the acting user could actually act on. */
const actionable = computed(() => props.records.filter((r) => r.canRestore || r.canForceDelete))

const allSelected = computed(
    () => actionable.value.length > 0 && selected.value.size === actionable.value.length,
)

const chosen = computed(() => props.records.filter((r) => selected.value.has(r.id)))

const canRestoreSelection = computed(() => chosen.value.some((r) => r.canRestore))
const canDestroySelection = computed(() => chosen.value.some((r) => r.canForceDelete))

/**
 * A selection belongs to the page it was made on.
 *
 * Cleared on every arriving page, not only on a tab change: a tick carried
 * onto page 2 names a record that is no longer on screen, and the bulk buttons
 * would then act on rows the person cannot see - the same class of mistake
 * carrying ticks across tabs would be.
 */
watch(
    () => props.records,
    () => {
        selected.value = new Set()
        paging.value = false
    },
)

/** Fetch one page. `cursor === null` is page 1. */
function fetchPage(resource: string, cursor: string | null) {
    paging.value = true

    router.get(path('/trash'), cursor === null ? { resource } : { resource, cursor }, {
        // The tab counts and the retention settings do not change with a
        // page, so paging moves rows and nothing else.
        only: ['resource', 'records', 'nextCursor'],
        preserveState: true,
        preserveScroll: true,
        onError: () => (paging.value = false),
    })
}

/**
 * Switching tab is a REQUEST, because the rows are the server's to page - and
 * it restarts the trail, since a cursor from one resource's ordering cannot
 * seek into another's.
 */
function openTab(key: string) {
    if (key === active.value) {
        return
    }

    stack.value = []
    fetchPage(key, null)
}

function nextPage() {
    if (props.nextCursor === null) {
        return
    }

    stack.value = [...stack.value, props.nextCursor]
    fetchPage(active.value, props.nextCursor)
}

function previousPage() {
    if (stack.value.length === 0) {
        return
    }

    const trail = stack.value.slice(0, -1)
    stack.value = trail

    fetchPage(active.value, trail[trail.length - 1] ?? null)
}

function firstPage() {
    if (stack.value.length === 0) {
        return
    }

    stack.value = []
    fetchPage(active.value, null)
}

/**
 * Back to page 1 after a mutation.
 *
 * A restore or a permanent delete REMOVES rows from the bin, so every cursor
 * in the trail points past rows that are no longer there - the page the person
 * was on may now be short, empty, or gone. Returning to the first page is the
 * honest answer, and it is also where the thing they just acted on was.
 */
function reloadFirstPage() {
    stack.value = []
    paging.value = true

    router.get(
        path('/trash'),
        { resource: active.value },
        {
            // `groups` too, unlike a plain page step: a restore changes the tab
            // counts, and a tab that just emptied has to stop being a tab.
            only: ['groups', 'resource', 'records', 'nextCursor'],
            preserveState: true,
            preserveScroll: true,
            onError: () => (paging.value = false),
        },
    )
}

function toggle(record: TrashedRecord) {
    const next = new Set(selected.value)

    if (next.has(record.id)) {
        next.delete(record.id)
    } else {
        next.add(record.id)
    }

    selected.value = next
}

function toggleAll() {
    selected.value = allSelected.value ? new Set() : new Set(actionable.value.map((r) => r.id))
}

/** `/reseller` + `/clients` + `/12`, never assembled from the resource alone. */
function path(suffix: string): string {
    const prefix = props.prefix === '/' ? '' : props.prefix

    return `${prefix}${suffix}`
}

function executeRestoreOne(record: TrashedRecord) {
    router.post(
        path(`/${active.value}/${record.id}/restore`),
        {},
        {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${record.title} restored`)
                reloadFirstPage()
            },
            onError: () => toast.error('That could not be restored.'),
        },
    )
}

function restoreOne(record: TrashedRecord) {
    confirmingRestoreRecord.value = record
    confirmingRestore.value = 'one'
}

function executeRestoreSelected() {
    const ids = chosen.value.filter((r) => r.canRestore).map((r) => r.id)

    router.post(
        path('/trash/restore'),
        { resource: active.value, ids },
        {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${ids.length} record(s) restored`)
                reloadFirstPage()
            },
            onError: () => toast.error('Those could not be restored.'),
        },
    )
}

function restoreSelected() {
    confirmingRestore.value = 'many'
}

function confirmRestore() {
    const mode = confirmingRestore.value
    const record = confirmingRestoreRecord.value
    confirmingRestore.value = null
    confirmingRestoreRecord.value = null

    if (mode === 'one' && record) {
        executeRestoreOne(record)
    } else if (mode === 'many') {
        executeRestoreSelected()
    }
}

/** Two statements in a template expression need a semicolon; a function is clearer. */
function confirmOne(record: TrashedRecord) {
    confirmingRecord.value = record
    confirming.value = 'one'
}

function destroyForever() {
    const single = confirmingRecord.value

    if (confirming.value === 'one' && single) {
        router.delete(path(`/${active.value}/${single.id}/force`), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${single.title} deleted permanently`)
                reloadFirstPage()
            },
            onError: () => toast.error('That could not be deleted.'),
            onFinish: () => {
                confirming.value = null
                confirmingRecord.value = null
            },
        })

        return
    }

    const ids = chosen.value.filter((r) => r.canForceDelete).map((r) => r.id)

    router.delete(path('/trash'), {
        data: { resource: active.value, ids },
        preserveScroll: true,
        onSuccess: () => {
            toast.success(`${ids.length} record(s) deleted permanently`)
            reloadFirstPage()
        },
        onError: () => toast.error('Those could not be deleted.'),
        onFinish: () => (confirming.value = null),
    })
}

function saveRetention() {
    router.patch(
        path('/trash/settings'),
        { days: days.value },
        {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Deleted records are now kept for ${days.value} days`)
                configuring.value = false
            },
            onError: () => toast.error('That could not be saved.'),
        },
    )
}

/**
 * "3 days left", not a timestamp.
 *
 * The question somebody has on this screen is whether they still have time, and
 * a date makes them do the arithmetic. The exact moment is on the title
 * attribute for anyone who wants it.
 */
function remaining(purgesAt: string): string {
    const ms = new Date(purgesAt).getTime() - Date.now()

    if (ms <= 0) {
        return 'due to be removed'
    }

    const d = Math.floor(ms / 86_400_000)

    if (d >= 1) {
        return `${d} day${d === 1 ? '' : 's'} left`
    }

    const h = Math.max(1, Math.floor(ms / 3_600_000))

    return `${h} hour${h === 1 ? '' : 's'} left`
}

/** Under a day left is worth colouring: it is the last chance to act. */
const urgent = (purgesAt: string) => new Date(purgesAt).getTime() - Date.now() < 86_400_000

function deletedOn(value: string): string {
    return new Date(value.replace(' ', 'T')).toLocaleString()
}
</script>

<template>
    <Head title="Trash" />

    <div :class="[PAGE_SHELL, 'flex flex-col gap-5']">
        <header class="flex flex-wrap items-start justify-between gap-3">
            <div class="flex flex-col gap-1">
                <h1 class="text-xl font-semibold tracking-tight sm:text-2xl">Trash</h1>
                <p class="text-muted-foreground text-sm font-normal">
                    Deleted records are kept for {{ retentionDays }} days and then removed
                    permanently. Until then they can be restored from here.
                </p>
            </div>

            <Button
                v-if="canConfigure"
                type="button"
                variant="outline"
                size="sm"
                @click="configuring = true"
            >
                <Settings2 class="size-3.5" />
                Retention
            </Button>
        </header>

        <div
            v-if="total === 0"
            class="bg-card flex flex-col items-center gap-2 rounded-lg border p-10 text-center"
        >
            <Trash2 class="text-muted-foreground size-6" />
            <p class="text-sm font-medium">The trash is empty</p>
            <p class="text-muted-foreground text-sm font-normal">
                Anything you delete will wait here for {{ retentionDays }} days.
            </p>
        </div>

        <!--
            ONE CARD - DESIGN_RULES rule 4. Tabs, selection controls, the rows
            and the pagination share the shell's single border, the same frame
            every resource list uses.
        -->
        <TableShell v-else>
            <!-- ONE RESOURCE ON SCREEN AT A TIME, with its count on the tab. -->
            <template #tabs>
                <div class="flex gap-1 overflow-x-auto">
                    <button
                        v-for="g in groups"
                        :key="g.key"
                        type="button"
                        class="flex items-center gap-1.5 rounded-md border-b-2 px-3 py-2 text-sm whitespace-nowrap transition-colors"
                        :class="
                            active === g.key
                                ? 'border-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground border-transparent'
                        "
                        :disabled="paging"
                        @click="openTab(g.key)"
                    >
                        {{ g.label }}
                        <span
                            class="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-xs"
                        >
                            {{ g.total }}
                        </span>
                    </button>
                </div>
            </template>

            <!--
                THE SELECTION CONTROLS APPEAR WITH THE SELECTION rather than
                sitting beside it always: a bar that is present but usually
                disabled is a row of dead controls people stop reading.
            -->
            <template #toolbar>
                <div class="flex flex-wrap items-center justify-between gap-2 px-2">
                    <label class="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            class="text-primary size-4 rounded border"
                            :checked="allSelected"
                            :indeterminate="selected.size > 0 && !allSelected"
                            :disabled="actionable.length === 0"
                            @change="toggleAll"
                        />
                        <span v-if="selected.size === 0" class="text-muted-foreground">
                            Select all on this tab
                        </span>
                        <span v-else class="font-medium">{{ selected.size }} selected</span>
                    </label>

                    <div v-if="selected.size > 0" class="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            :disabled="!canRestoreSelection"
                            @click="restoreSelected"
                        >
                            <RotateCcw class="size-3.5" />
                            Restore
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            class="text-destructive hover:text-destructive"
                            :disabled="!canDestroySelection"
                            @click="confirming = 'many'"
                        >
                            <Trash2 class="size-3.5" />
                            Delete forever
                        </Button>
                    </div>
                </div>
            </template>

            <div class="divide-y">
                <div
                    v-for="record in records"
                    :key="`${active}-${record.id}`"
                    class="flex flex-wrap items-center gap-3 px-4 py-3"
                    :class="selected.has(record.id) ? 'bg-muted/40' : ''"
                >
                    <input
                        type="checkbox"
                        class="text-primary size-4 shrink-0 rounded border"
                        :checked="selected.has(record.id)"
                        :disabled="!record.canRestore && !record.canForceDelete"
                        :aria-label="`Select ${record.title}`"
                        @change="toggle(record)"
                    />

                    <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-medium">{{ record.title }}</p>
                        <p
                            class="text-xs"
                            :class="
                                urgent(record.purgesAt)
                                    ? 'text-destructive'
                                    : 'text-muted-foreground'
                            "
                            :title="record.purgesAt"
                        >
                            Deleted {{ deletedOn(record.deletedAt) }} ·
                            {{ remaining(record.purgesAt) }}
                        </p>
                    </div>

                    <div class="flex shrink-0 items-center gap-1">
                        <Button
                            v-if="record.canRestore"
                            type="button"
                            variant="ghost"
                            size="sm"
                            @click="restoreOne(record)"
                        >
                            <RotateCcw class="size-3.5" />
                            Restore
                        </Button>

                        <Button
                            v-if="record.canForceDelete"
                            type="button"
                            variant="ghost"
                            size="sm"
                            class="text-destructive hover:text-destructive"
                            @click="confirmOne(record)"
                        >
                            <Trash2 class="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            <!--
                THE SAME CONTROLS AS EVERY OTHER LIST. This used to be a line of
                prose - "showing the 25 most recently deleted of 30" - which told
                somebody five records existed and gave them no way to reach them.
            -->
            <template #pagination>
                <TablePagination
                    :page="page"
                    :per-page="perPage"
                    :per-page-options="[perPage]"
                    :rows-on-page="records.length"
                    :has-next="nextCursor !== null"
                    :has-previous="page > 1"
                    :total="group?.total"
                    :loading="paging"
                    @next="nextPage"
                    @previous="previousPage"
                    @first="firstPage"
                />
            </template>
        </TableShell>
    </div>

    <PkModal :open="confirming !== null" title="Delete permanently?" @close="confirming = null">
        <div class="flex flex-col gap-3">
            <p class="flex items-start gap-2 text-sm">
                <TriangleAlert class="text-destructive mt-0.5 size-4 shrink-0" />
                <span v-if="confirming === 'one'">
                    <strong>{{ confirmingRecord?.title }}</strong> will be removed for good. This
                    cannot be undone, and nothing else in the panel will bring it back.
                </span>
                <span v-else>
                    <strong>{{ chosen.filter((r) => r.canForceDelete).length }} record(s)</strong>
                    will be removed for good. This cannot be undone.
                </span>
            </p>

            <div class="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" @click="confirming = null">
                    Cancel
                </Button>
                <Button type="button" variant="destructive" size="sm" @click="destroyForever">
                    Delete forever
                </Button>
            </div>
        </div>
    </PkModal>

    <PkModal
        :open="confirmingRestore !== null"
        title="Restore deleted record?"
        description="The record will return to its normal list."
        @close="confirmingRestore = null; confirmingRestoreRecord = null"
    >
        <p class="text-sm">
            <template v-if="confirmingRestore === 'one'">
                Restore <strong>{{ confirmingRestoreRecord?.title }}</strong>?
            </template>
            <template v-else>
                Restore <strong>{{ chosen.filter((r) => r.canRestore).length }} record(s)</strong>?
            </template>
        </p>
        <template #footer>
            <Button type="button" variant="outline" size="sm" @click="confirmingRestore = null">
                Cancel
            </Button>
            <Button type="button" size="sm" @click="confirmRestore">Restore</Button>
        </template>
    </PkModal>

    <PkModal
        :open="configuring"
        title="How long to keep deleted records"
        @close="configuring = false"
    >
        <div class="flex flex-col gap-4">
            <p class="text-muted-foreground text-sm font-normal">
                After this many days a deleted record is removed permanently by the nightly sweep.
                Between {{ retentionRange.min }} and {{ retentionRange.max }} days: shorter and "I
                deleted it on Friday" is unrecoverable by Monday; longer and the panel is keeping
                personal data nobody is looking after.
            </p>

            <div class="flex items-center gap-3">
                <input
                    v-model.number="days"
                    type="range"
                    class="accent-primary flex-1"
                    :min="retentionRange.min"
                    :max="retentionRange.max"
                    step="1"
                    aria-label="Days to keep deleted records"
                />
                <div class="flex items-center gap-1">
                    <input
                        v-model.number="days"
                        type="number"
                        class="border-input bg-background h-9 w-16 rounded-md border px-2 text-sm"
                        :min="retentionRange.min"
                        :max="retentionRange.max"
                    />
                    <span class="text-muted-foreground text-sm font-normal">days</span>
                </div>
            </div>

            <div class="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" @click="configuring = false">
                    Cancel
                </Button>
                <Button type="button" size="sm" @click="saveRetention">
                    <Check class="size-3.5" />
                    Save
                </Button>
            </div>
        </div>
    </PkModal>
</template>
