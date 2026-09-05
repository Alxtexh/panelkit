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
 * Who is in this organisation, and what they may do - one screen, two tabs.
 *
 * THEY WERE TWO UNRELATED PLACES and are one job. Granting somebody access meant
 * knowing that a screen under settings and a screen under the resource routes
 * had to agree; putting them side by side is the whole point.
 *
 * THE USERS TAB EMBEDS THE RESOURCE, it does not reimplement it. `UserResource`
 * owns the columns, the tenant constraint, the policy and the forms, and a
 * second users table here would be a second copy of all four.
 *
 * Below: the permission matrix.
 *
 * ONE ROLE AT A TIME, not every role in one grid. A grid of roles x abilities
 * looks efficient and is unreadable the moment there are more than three of
 * either - and this screen decides who can delete things, so "unreadable" is not
 * a cosmetic problem. Picking a role and seeing its abilities grouped by
 * resource keeps every row a sentence: "Clients: may view, may not delete".
 *
 * THE DANGEROUS ABILITIES ARE MARKED, because a checkbox grid flattens
 * everything to the same weight. `forceDelete` has no undo and `manage_roles`
 * can grant anything including itself; both read exactly like `view` at a glance
 * unless something says otherwise.
 *
 * SAVING IS EXPLICIT. Toggling a box does not write - a permission screen that
 * saves as you click means a mis-click is already live, with no moment to
 * reconsider and nothing to cancel.
 */
import { Deferred, Head, Link, router, useForm, usePage } from '@inertiajs/vue3'
import { Plus, ShieldAlert, Trash2, TriangleAlert } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import type { RecordActionGroup, RecordActionItem } from '@alxtexh-enterprise/panel'
import {
    BulkActions,
    DataTable,
    PkBoundary,
    RecordActions,
    SchemaNode,
    SelectionBar,
    PkModal,
} from '@alxtexh-enterprise/panel'
import { PkButton as Button, actionColorTone } from '@alxtexh-enterprise/panel'
/*
 * NO `layout` HERE. A packaged screen names no layout - the page file in the
 * consuming application decides, which is what lets one app wrap this in its
 * own shell and another use the published PanelLayout.
 *
 * AND NO WAYFINDER. The demo could import generated route helpers because the
 * routes are in its own application; a packaged screen has none to import, and
 * the panel may be mounted at any prefix. `panel.path` is shared on every
 * request - see `at()` below.
 */

interface RoleRow {
    id: number
    name: string
    grantsAll: boolean
    /** The oldest role in the organisation - it cannot be deleted. */
    isProtected: boolean
    permissions: string[]
    userCount: number
}

const props = defineProps<{
    tab: 'users' | 'roles'
    roles: RoleRow[]
    groups: Record<string, { action: string; name: string }[]>
    panelAbilities: string[]
    /**
     * NULL WHEN THE APPLICATION REGISTERED NO USERS RESOURCE. The screen says
     * so and still shows the roles, rather than rendering a headless table that
     * reads as a loading state which never ends.
     */
    users?: { schema: Record<string, any>; data: Record<string, any> } | null
}>()

/**
 * The panel's prefix, so these URLs work wherever it is mounted.
 *
 * DECLARED BEFORE `TABS` READS IT. `usePage()` is called again further down for
 * other reasons; this one has to be here because a `const` array evaluated at
 * setup time cannot reach a binding declared after it.
 */
const shell = usePage()

const base = computed(() => (shell.props.panel as { path?: string } | undefined)?.path ?? '')

const at = (path: string) => `${base.value === '/' ? '' : base.value}${path}`
const userBase = computed(() => props.users?.schema?.routes?.index ?? at('/users'))
const rolesBase = computed(() => at('/settings/roles'))

const TABS = computed(() => [
    { id: 'users', label: 'Users', href: at('/user-management/users') },
    { id: 'roles', label: 'Roles', href: at('/user-management/roles') },
])

/** Columns come from the resource's own schema - see the note at the top. */
const userColumns = computed(() =>
    (props.users?.schema?.table?.columns ?? []).filter((c: any) => !c.hidden),
)

const userRows = computed<Record<string, any>[]>(() => props.users?.data?.records ?? [])

/* ---------------------------------------------------------------------------
 * Selection and actions
 *
 * THIS TAB HAD NEITHER, AND THAT WAS THE BUG. It embedded the resource's schema
 * and rows and then rendered a bare table - so `UserResource` declared record
 * actions and bulk actions that had nowhere to appear, and the one screen for
 * managing people offered no way to delete, ban or impersonate any of them.
 *
 * THE ENDPOINTS ALREADY EXISTED. `users` is a registered panel resource, so
 * `/users/bulk` and the record-action endpoint have been live all along; nothing
 * server-side is new here. What was missing was entirely on this page.
 * ------------------------------------------------------------------------- */

// Named for the tab, because the roles tab already owns `selected`.
const selectedUsers = ref<Set<string | number>>(new Set())

function toggleRow(id: string | number) {
    const next = new Set(selectedUsers.value)

    if (next.has(id)) {
        next.delete(id)
    } else {
        next.add(id)
    }

    selectedUsers.value = next
}

function togglePage(select: boolean) {
    selectedUsers.value = select ? new Set(userRows.value.map((r) => r.id)) : new Set()
}

const rowMenus = new Map<number, InstanceType<typeof RecordActions>>()

function keepMenu(id: number, el: any) {
    if (el) {
        rowMenus.set(id, el)
    } else {
        rowMenus.delete(id)
    }
}

function onRowContextMenu(row: Record<string, any>, event: MouseEvent) {
    rowMenus.get(row.id)?.openContextMenu(event)
}

/**
 * The actions available on one person.
 *
 * FILTERED BY WHAT THE ROW SAYS, not by what this page guesses. `_actions`
 * arrives per row already narrowed by the policy for that record, so an action
 * absent there is one the server would refuse - and `_actionUrls` carries the
 * per-row link targets the cached schema cannot hold.
 */
function menuFor(row: Record<string, any>): RecordActionGroup[] {
    const available: string[] | null = row._actions ?? null

    const groups: RecordActionGroup[] = (props.users?.schema?.table?.recordActions ?? [])
        .map((group: any) => ({
            label: group.label,
            actions: group.actions
                .filter((a: any) => available === null || available.includes(a.key))
                /*
                 * THE FIRST ACCOUNT IS NOT EDITABLE BY ANYBODY ELSE, and the
                 * menu says so rather than offering an action the server
                 * refuses. Protecting it from deletion alone protected the ROW
                 * and not the ACCESS: its email could be moved to an address
                 * nobody controls and its roles stripped, leaving the exact
                 * lockout the delete guard exists to prevent.
                 *
                 * Its OWNER keeps Edit, because somebody must be able to change
                 * their own name and password. `UserPolicy::update` is what
                 * enforces this; the menu only agrees with it.
                 */
                .filter(
                    (a: any) =>
                        !(
                            a.key === 'edit' &&
                            Number(row.id) === firstUserId.value &&
                            Number(row.id) !== Number((page.props.auth as any)?.user?.id)
                        ),
                )
                .map((a: any) => ({ ...a, url: row._actionUrls?.[a.key] })),
        }))
        .filter((group: any) => group.actions.length > 0)

    /*
     * DELETE JOINS AS A SYNTHETIC ENTRY, exactly as `ResourceIndex` does it.
     *
     * It is not a server-declared action - it opens a confirmation instead of
     * calling the action endpoint - so the key is namespaced and can never be
     * mistaken for one. As a list entry it sorts itself: `RecordActions` already
     * puts every destructive action last and separated.
     *
     * WHETHER IT IS OFFERED COMES FROM THE ROW, not from a page-level `can`.
     * `_actions` was already narrowed by the policy for THIS record, so asking
     * it is asking the server - a page-wide flag would say "you may delete
     * users" and be wrong for the two the server refuses.
     *
     * The first user and yourself are excluded here as a courtesy; `UserPolicy`
     * refuses both regardless, which is what actually protects them.
     */
    const me = (page.props.auth as any)?.user?.id
    const isFirst = row.id === firstUserId.value

    if (available !== null && available.includes('delete') && row.id !== me && !isFirst) {
        groups.push({
            actions: [
                {
                    key: DELETE_USER,
                    label: 'Delete',
                    icon: 'trash',
                    destructive: true,
                },
            ],
        })
    }

    return groups
}

/** Not a server action: it opens the confirmation dialog. */
const DELETE_USER = '__delete'

/**
 * The oldest account in the organisation, which cannot be deleted.
 *
 * Derived from the rows rather than sent as a flag: the list is ordered newest
 * first, so the smallest id on the page is the candidate - and the server is the
 * thing that actually refuses, so a wrong guess here costs a menu entry that
 * would have been rejected, not a deleted account.
 */
const firstUserId = computed(() =>
    userRows.value.length ? Math.min(...userRows.value.map((r) => Number(r.id))) : null,
)

const confirmingDeleteUser = ref<Record<string, any> | null>(null)

function reallyDeleteUser(): void {
    const user = confirmingDeleteUser.value

    confirmingDeleteUser.value = null

    if (!user) {
        return
    }

    router.delete(`${userBase.value}/${user.id}`, { preserveScroll: true })
}

const busyAction = ref<string | null>(null)

/** An action waiting for confirmation, with the row it applies to. */
const pendingAction = ref<{
    row: Record<string, any>
    action: RecordActionItem
} | null>(null)

function confirmPendingAction() {
    const pending = pendingAction.value

    if (pending) {
        runRecordAction(pending.row, pending.action)
    }
}

function csrfToken(): string {
    return decodeURIComponent(
        (document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/) ?? ['', ''])[1],
    )
}

/**
 * The open form action, or null.
 *
 * `RecordAction::form()` is not a resource-page-only feature - it exists so
 * "why is this account suspended" or "who approved this" can be collected
 * before an action runs, and a row action here is the exact same
 * `RecordAction` a resource's own index page would render. Until this
 * existed, `pendingAction`'s modal showed no fields for one - the operator
 * had nowhere to type the value the server was about to require, and
 * confirming submitted the key alone.
 */
const actionForm = ref<{
    row: Record<string, any>
    action: RecordActionItem
    values: Record<string, any>
    errors: Record<string, string>
    processing: boolean
} | null>(null)

async function searchActionOptions(
    field: string,
    term: string,
): Promise<{ value: any; label: string }[]> {
    const query = new URLSearchParams({ field, q: term })

    const res = await fetch(`${userBase.value}/field-options?${query}`, {
        headers: { Accept: 'application/json' },
    })

    if (!res.ok) {
        throw new Error(String(res.status))
    }

    return (await res.json()).options
}

async function submitActionForm() {
    const open = actionForm.value

    if (!open) {
        return
    }

    open.processing = true
    open.errors = {}

    try {
        const response = await fetch(`${userBase.value}/${open.row.id}/action`, {
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

        actionForm.value = null

        // Same full visit `runRecordAction` uses below - see its own note.
        router.visit(body?.redirect ?? at('/dashboard'))
    } finally {
        if (actionForm.value) {
            actionForm.value.processing = false
        }
    }
}

function runRecordAction(row: Record<string, any>, action: RecordActionItem) {
    if (action.key === DELETE_USER) {
        confirmingDeleteUser.value = row

        return
    }

    if (action.link) {
        router.visit(action.url ?? '#')

        return
    }

    /*
     * A FORM ACTION OPENS ITS DIALOG INSTEAD OF RUNNING - see `actionForm`.
     * Checked before `confirmation` because a form action's own description
     * is shown inside that dialog, not as a separate confirm-then-fill step.
     */
    if (action.form) {
        actionForm.value = { row, action, values: {}, errors: {}, processing: false }

        return
    }

    /*
     * NOT `window.confirm`. It is suppressed in embedded browsers and returns
     * false without ever showing, so the action silently did nothing - the same
     * trap that hid role deletion. Confirmation goes through a real modal, and
     * `runRecordAction` is re-entered once it is accepted.
     */
    if (action.confirmation && pendingAction.value?.action.key !== action.key) {
        pendingAction.value = { row, action }

        return
    }

    pendingAction.value = null
    busyAction.value = action.key

    /*
     * `POST {resource}/{id}/action` WITH THE KEY IN THE BODY.
     *
     * This previously posted to `/users/{id}/actions/{key}`, a URL invented
     * here that no route matched, so every action from this tab answered 404 -
     * Impersonate included. The real endpoint is the one `ResourceIndex` uses,
     * and it is the same one whether the list is rendered by the generic
     * resource page or embedded in a tab.
     *
     * `fetch` rather than `router.post` because an action returns JSON, not an
     * Inertia page; the list is reloaded separately once it succeeds.
     */
    fetch(`${userBase.value}/${row.id}/action`, {
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
        .then(async (response) => {
            if (!response.ok) {
                const body = await response.json().catch(() => null)

                toast.error(body?.message ?? 'That action could not be completed.')
                return
            }

            /*
             * A FULL VISIT, not a partial reload. Impersonation changes WHO the
             * session belongs to, so the shared props - the banner, the account
             * menu, the navigation - all have to be rebuilt. A partial reload of
             * the rows alone would leave the panel showing the previous person.
             *
             * A DECLARED `redirect()` OVERRIDES THE `/dashboard` DEFAULT for
             * actions that say where they want to go (see
             * `RecordAction::redirect()`) - Impersonate itself keeps landing on
             * `/dashboard` either way, since it never declares one.
             */
            const body = await response.json().catch(() => null)

            router.visit(body?.redirect ?? at('/dashboard'))
        })
        .finally(() => (busyAction.value = null))
}

const bulkBusy = ref(false)

function runBulk(key: string) {
    bulkBusy.value = true

    router.post(
        `${userBase.value}/bulk`,
        { action: key, ids: [...selectedUsers.value] },
        {
            preserveScroll: true,
            onSuccess: () => (selectedUsers.value = new Set()),
            onFinish: () => (bulkBusy.value = false),
        },
    )
}

const page = usePage()

/**
 * A readable name for a panel-level ability.
 *
 * THE LABEL USED TO BE HARDCODED inside the loop, which was correct while
 * `manage_roles` was the only panel ability and became a lie the moment a
 * second one existed: every checkbox in the list read "Manage roles and
 * permissions", so the impersonation ability was indistinguishable from it and
 * granting one looked like granting the other.
 *
 * The fallback humanises the key rather than showing nothing, so an ability
 * added in the package without a label here still reads sensibly.
 */
const PANEL_ABILITY_LABELS: Record<string, string> = {
    manage_roles: 'Manage roles and permissions',
    impersonate_users: 'Sign in as another person (impersonate)',
}

function panelAbilityLabel(ability: string): string {
    return (
        PANEL_ABILITY_LABELS[ability] ??
        ability.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())
    )
}

const selectedId = ref<number | null>(props.roles[0]?.id ?? null)

const selected = computed(() => props.roles.find((r) => r.id === selectedId.value) ?? null)

const form = useForm<{ name: string; permissions: string[] }>({
    name: '',
    permissions: [],
})

/**
 * Reloaded whenever the chosen role changes, and on every server round trip.
 *
 * `props.roles` is replaced after a save, so watching it too keeps the form
 * showing what was actually stored rather than what was submitted - which is the
 * difference that matters here, because the server INTERSECTS the submitted
 * abilities with the registry and may legitimately have stored fewer.
 */
watch(
    [selected, () => props.roles],
    () => {
        if (selected.value) {
            form.defaults({
                name: selected.value.name,
                permissions: [...selected.value.permissions],
            })
            form.reset()
        }
    },
    { immediate: true },
)

const DANGEROUS = new Set(['forceDelete'])

/**
 * A superuser role is shown as read-only, and that is not a UI nicety.
 *
 * `grants_all` makes `grants()` return true for every ability, including ones
 * that do not exist yet - so rendering editable checkboxes would let somebody
 * untick "Force Delete", save, see it saved, and still have the role granting
 * it. A permission screen that misreports permissions is worse than no screen.
 */
const locked = computed(() => selected.value?.grantsAll === true)

function has(ability: string): boolean {
    return locked.value || form.permissions.includes(ability)
}

function toggle(ability: string): void {
    form.permissions = has(ability)
        ? form.permissions.filter((a) => a !== ability)
        : [...form.permissions, ability]
}

/** Whole-row convenience: a resource's abilities move together far more often than not. */
function toggleGroup(abilities: { name: string }[]): void {
    const names = abilities.map((a) => a.name)
    const allOn = names.every((n) => has(n))

    form.permissions = allOn
        ? form.permissions.filter((a) => !names.includes(a))
        : [...new Set([...form.permissions, ...names])]
}

function label(action: string): string {
    return action
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (c) => c.toUpperCase())
        .trim()
}

const creating = ref(false)
const newRole = useForm({ name: '' })

function create(): void {
    newRole.post(at('/roles'), {
        preserveScroll: true,
        onSuccess: () => {
            newRole.reset()
            creating.value = false
        },
    })
}

/**
 * Deleting asks first, and the server refuses a role somebody holds.
 *
 * Deleting a role cascades its rows out of `model_has_roles`, so removing one
 * somebody holds leaves those people able to sign in with every page empty -
 * which reads as data loss rather than as a permissions change. The confirm
 * here is courtesy; the refusal is in the controller.
 */
/**
 * NOT `window.confirm`.
 *
 * The native dialog is suppressed in embedded browsers and headless contexts -
 * it returned false without ever showing, so clicking "Delete role" did nothing
 * at all: no request, no error, no dialog. It also blocks the event loop and
 * cannot be styled or asserted on, which is why `BulkActions` had already
 * stopped using it. This asks in a real modal instead.
 */
const confirmingDeleteRole = ref<RoleRow | null>(null)

function destroy(role: RoleRow): void {
    confirmingDeleteRole.value = role
}

function reallyDestroyRole(): void {
    const role = confirmingDeleteRole.value

    confirmingDeleteRole.value = null

    if (!role) {
        return
    }

    router.delete(`${rolesBase.value}/${role.id}`, { preserveScroll: true })
}

function save(): void {
    if (selected.value) {
        form.put(`${rolesBase.value}/${selected.value.id}`, {
            preserveScroll: true,
        })
    }
}
</script>

<template>
    <Head title="User management" />

    <div class="flex flex-col gap-4 p-4 sm:p-6">
        <div>
            <h1 class="text-xl font-semibold tracking-tight">User management</h1>
            <p class="text-sm text-muted-foreground font-normal">
                Who is in this organisation, and what each role may do.
            </p>
        </div>

        <div class="flex gap-1 border-b">
            <Link
                v-for="t in TABS"
                :key="t.id"
                :href="t.href"
                prefetch="hover"
                class="-mb-px border-b-2 px-3 py-2 text-sm transition-colors"
                :class="
                    tab === t.id
                        ? 'border-primary font-medium text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                "
            >
                {{ t.label }}
            </Link>
        </div>

        <!-- USERS -->
        <div v-if="tab === 'users'" class="flex flex-col gap-3">
            <div class="flex items-center justify-end">
                <Link :href="`${userBase}/create`">
                    <Button size="sm">New user</Button>
                </Link>
            </div>

            <Deferred data="users">
                <template #fallback>
                    <div class="rounded-lg border p-8 text-center text-sm text-muted-foreground">
                        Loading people…
                    </div>
                </template>

                <template #default>
                    <SelectionBar
                        v-if="selectedUsers.size"
                        :count="selectedUsers.size"
                        :total="userRows.length"
                        :all-matching="false"
                        @clear="selectedUsers = new Set()"
                    >
                        <BulkActions
                            :actions="users?.schema?.table?.bulkActions ?? []"
                            :count="selectedUsers.size"
                            :all-matching="false"
                            :busy="bulkBusy"
                            :can-export="false"
                            @run="runBulk"
                        />
                    </SelectionBar>

                    <PkBoundary label="The user list">
                        <DataTable
                            :columns="userColumns"
                            :rows="userRows"
                            row-key="id"
                            selectable
                            :selected="selectedUsers"
                            @toggle-row="toggleRow"
                            @toggle-page="togglePage"
                            @row-contextmenu="onRowContextMenu"
                        >
                            <template #actions="{ row }">
                                <RecordActions
                                    :ref="(el: any) => keepMenu(row.id, el)"
                                    :groups="menuFor(row)"
                                    :title="row.name ?? 'this person'"
                                    :busy="busyAction"
                                    @run="(action) => runRecordAction(row, action)"
                                />
                            </template>
                        </DataTable>
                    </PkBoundary>
                </template>
            </Deferred>
        </div>

        <div v-if="tab === 'roles'" class="flex flex-col gap-4 lg:flex-row">
            <!-- Roles, as a list rather than a select: how many there are, and
                 how many people hold each, is context you want while editing. -->
            <aside class="flex shrink-0 flex-col gap-1 lg:w-56">
                <button
                    v-for="role in roles"
                    :key="role.id"
                    type="button"
                    class="flex flex-col items-start rounded-md border px-3 py-2 text-left text-sm transition-colors"
                    :class="
                        selectedId === role.id
                            ? 'border-primary bg-primary/5'
                            : 'border-transparent hover:bg-accent'
                    "
                    @click="selectedId = role.id"
                >
                    <span class="font-medium">{{ role.name }}</span>
                    <span class="text-xs text-muted-foreground font-normal">
                        {{ role.userCount }}
                        {{ role.userCount === 1 ? 'person' : 'people' }}
                        <!-- "first" rather than "default": it is the oldest role
                             in the organisation, which is both the one new people
                             are given and the one that cannot be deleted. One
                             fact, one label. -->
                        <template v-if="role.isProtected"> · first</template>
                    </span>
                </button>

                <!-- Creating and configuring are separate steps: a new role
                     grants nothing until somebody ticks boxes and saves. -->
                <form v-if="creating" class="mt-1 flex flex-col gap-2" @submit.prevent="create">
                    <input
                        v-model="newRole.name"
                        placeholder="Role name"
                        autofocus
                        class="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    />
                    <p v-if="newRole.errors.name" class="text-xs text-destructive">
                        {{ newRole.errors.name }}
                    </p>
                    <div class="flex gap-2">
                        <Button type="submit" size="sm" :disabled="newRole.processing"
                            >Create</Button
                        >
                        <Button type="button" size="sm" variant="ghost" @click="creating = false">
                            Cancel
                        </Button>
                    </div>
                </form>

                <button
                    v-else
                    type="button"
                    class="mt-1 flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    @click="creating = true"
                >
                    <Plus class="size-4" />
                    New role
                </button>
            </aside>

            <section v-if="selected" class="min-w-0 flex-1">
                <form class="flex flex-col gap-4" @submit.prevent="save">
                    <div
                        v-if="locked"
                        class="flex items-start gap-3 rounded-lg border bg-muted/40 p-4 text-sm"
                    >
                        <ShieldAlert class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <p>
                            <span class="font-medium">This role holds every ability</span>
                            - including ones added in future updates. That is deliberate, so it
                            cannot be edited here. Create another role to grant a narrower set.
                        </p>
                    </div>

                    <div
                        v-for="(abilities, group) in groups"
                        :key="group"
                        class="rounded-lg border bg-card"
                    >
                        <div class="flex items-center justify-between border-b px-4 py-2.5">
                            <h2 class="text-sm font-medium">{{ group }}</h2>
                            <button
                                v-if="!locked"
                                type="button"
                                class="text-xs text-muted-foreground font-normal underline-offset-2 hover:text-foreground hover:underline"
                                @click="toggleGroup(abilities)"
                            >
                                Toggle all
                            </button>
                        </div>

                        <div
                            class="grid grid-cols-2 gap-x-4 gap-y-2 p-4 sm:grid-cols-3 lg:grid-cols-4"
                        >
                            <label
                                v-for="ability in abilities"
                                :key="ability.name"
                                class="flex cursor-pointer items-center gap-2 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    class="size-4 accent-primary"
                                    :checked="has(ability.name)"
                                    :disabled="locked"
                                    @change="toggle(ability.name)"
                                />
                                <span
                                    :class="DANGEROUS.has(ability.action) ? 'text-destructive' : ''"
                                >
                                    {{ label(ability.action) }}
                                </span>
                                <!-- Permanent deletion has no undo, so it does not
                                     look like the six abilities beside it. -->
                                <TriangleAlert
                                    v-if="DANGEROUS.has(ability.action)"
                                    class="size-3.5 shrink-0 text-destructive"
                                    aria-label="No undo"
                                />
                            </label>
                        </div>
                    </div>

                    <div class="rounded-lg border border-destructive/30 bg-destructive/5">
                        <div class="flex items-start gap-3 p-4">
                            <ShieldAlert class="mt-0.5 size-4 shrink-0 text-destructive" />
                            <div class="min-w-0 flex-1">
                                <h2 class="text-sm font-medium">Panel administration</h2>
                                <p class="mb-3 text-sm text-muted-foreground">
                                    Anybody with this can change permissions, including their own.
                                </p>

                                <label
                                    v-for="ability in panelAbilities"
                                    :key="ability"
                                    class="flex cursor-pointer items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        class="size-4 accent-destructive"
                                        :checked="has(ability)"
                                        :disabled="locked"
                                        @change="toggle(ability)"
                                    />
                                    {{ panelAbilityLabel(ability) }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <p v-if="page.props.errors?.role" class="text-sm text-destructive">
                        {{ page.props.errors.role }}
                    </p>

                    <div v-if="!locked" class="flex items-center justify-end gap-2">
                        <!-- Destructive, so it sits apart from Save rather than
                             beside it, and is never the default action. -->
                        <!-- The first role cannot be deleted, so the button is
                             not offered rather than offered and refused. The
                             server refuses regardless. -->
                        <Button
                            v-if="!selected.isProtected"
                            type="button"
                            variant="ghost"
                            class="mr-auto text-destructive"
                            @click="destroy(selected)"
                        >
                            <Trash2 class="size-4" />
                            Delete role
                        </Button>
                        <span v-else class="mr-auto text-xs text-muted-foreground">
                            The first role cannot be deleted.
                        </span>

                        <span v-if="form.isDirty" class="text-sm text-muted-foreground font-normal">
                            Unsaved changes.
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            :disabled="!form.isDirty"
                            @click="form.reset()"
                        >
                            Discard
                        </Button>
                        <Button type="submit" :disabled="form.processing || !form.isDirty">
                            {{ form.processing ? 'Saving…' : 'Save changes' }}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    </div>

    <!-- Deleting a role is refused server-side when somebody holds it; this
             only asks, and the controller is what decides. -->
    <PkModal
        :open="confirmingDeleteRole !== null"
        :title="`Delete ${confirmingDeleteRole?.name ?? ''}?`"
        description="Anybody holding this role loses everything it granted."
        @close="confirmingDeleteRole = null"
    >
        <template #footer>
            <Button variant="outline" @click="confirmingDeleteRole = null"> Cancel </Button>
            <Button variant="destructive" @click="reallyDestroyRole">
                Delete role
            </Button>
        </template>
    </PkModal>

    <PkModal
        :open="confirmingDeleteUser !== null"
        :title="`Delete ${confirmingDeleteUser?.name ?? 'this person'}?`"
        description="They lose access immediately. Their records stay."
        @close="confirmingDeleteUser = null"
    >
        <template #footer>
            <Button variant="outline" @click="confirmingDeleteUser = null"> Cancel </Button>
            <Button variant="destructive" @click="reallyDeleteUser"> Delete </Button>
        </template>
    </PkModal>

    <PkModal
        :open="pendingAction !== null"
        :title="pendingAction?.action.label ?? ''"
        :description="pendingAction?.action.confirmation ?? ''"
        @close="pendingAction = null"
    >
        <template #footer>
            <Button variant="outline" @click="pendingAction = null">Cancel</Button>
            <Button @click="confirmPendingAction">
                {{ pendingAction?.action.label }}
            </Button>
        </template>
    </PkModal>

    <PkModal
        :open="actionForm !== null"
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
                variant="ghost"
                size="sm"
                :disabled="actionForm?.processing"
                @click="actionForm = null"
            >
                Cancel
            </Button>

            <Button size="sm" :disabled="actionForm?.processing" @click="submitActionForm">
                {{ actionForm?.processing ? 'Working…' : actionForm?.action.label }}
            </Button>
        </template>
    </PkModal>
</template>
