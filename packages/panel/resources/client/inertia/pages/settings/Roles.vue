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
 * The permission matrix.
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
import { Head, router, useForm, usePage } from '@inertiajs/vue3'
import { Plus, ShieldAlert, Trash2, TriangleAlert } from '@lucide/vue'
// IMPORTED, WHICH IT WAS NOT. Nothing registers Pk* globally, so the delete
// confirmation resolved to nothing: the button opened a dialog that was never
// rendered, and the build stayed clean because an unresolved component is a
// runtime console warning rather than a compile error. That is the third time
// this screen's delete has failed silently.
import { computed, ref, watch } from 'vue'
import { PkModal } from '@alxtexh-enterprise/panel'
// Generated from the routes, so renaming one breaks the build rather than
// leaving this screen posting at a 404 nothing reports.
import { PkButton as Button } from '@alxtexh-enterprise/panel'

interface RoleRow {
    id: number
    name: string
    /** The oldest role in the organisation - it cannot be deleted. */
    isProtected: boolean
    grantsAll: boolean
    permissions: string[]
    userCount: number
}

const props = defineProps<{
    roles: RoleRow[]
    groups: Record<string, { action: string; name: string }[]>
    /** `ability => label`, both from the server - see `Abilities::panelLabelled`. */
    panelAbilities: Record<string, string>
    templates: {
        key: string
        name: string
        description: string
        abilities: string[]
    }[]
    /*
     * WHERE TO POST, FROM THE SERVER.
     *
     * This page used to import Wayfinder's generated `@/routes/settings/roles`,
     * which is the application's route table - a file that does not exist in a
     * package, and would name the wrong URL anyway for anyone who mounted the
     * screen somewhere else. The server already knows where it routed this; it
     * says so, and `/{id}` hangs off it for update and destroy.
     */
    endpoint: string
}>()

const page = usePage()

/*
 * THE LABELS COME FROM THE SERVER NOW.
 *
 * They were a hardcoded map in this file, which was correct while
 * `manage_roles` was the only panel ability and became a lie the moment a
 * second existed: an ability added in PHP rendered under whatever caption
 * happened to be here, so granting one looked like granting another. A name and
 * the words describing it are one declaration, and it lives beside the name.
 */

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

/**
 * A new role, optionally started from a template.
 *
 * THE TEMPLATE IS RESOLVED ON THE SERVER, not applied from this list. The
 * abilities are sent here only so the picker can say how many each one grants -
 * posting them back would let a crafted request name any ability under the cover
 * of a template, which is exactly the kind of thing a permission screen must not
 * accept on trust.
 */
const newRole = useForm<{ name: string; template: string | null }>({
    name: '',
    template: null,
})

function create(): void {
    newRole.post(props.endpoint, {
        preserveScroll: true,
        onSuccess: () => {
            newRole.reset()
            creating.value = false
        },
    })
}

const chosenTemplate = computed(
    () => props.templates.find((t) => t.key === newRole.template) ?? null,
)

/**
 * Apply a template to a role that already exists.
 *
 * IT FILLS THE FORM AND NOTHING ELSE - no request, no save. The operator sees
 * exactly which boxes moved before committing, which is the whole reason this is
 * safe to do client-side: the abilities being ticked are ones they could tick by
 * hand, the update endpoint still intersects what is submitted against the
 * registry, and nothing is stored until they press Save.
 *
 * THAT IS ALSO WHY IT DIFFERS FROM CREATION. Creating from a template posts a
 * KEY and the server resolves it, because a create has no matrix to review
 * first. Here there is one.
 *
 * IT REPLACES RATHER THAN MERGES. "Apply the support template" means the role
 * should end up looking like the support template; adding to whatever was
 * already ticked produces a role that matches no template and nobody can
 * describe.
 */
const applying = ref<string>('')

function applyTemplate(): void {
    const template = props.templates.find((t) => t.key === applying.value)

    if (!template || locked.value) {
        return
    }

    form.permissions = [...template.abilities]
    applying.value = ''
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

    router.delete(`${props.endpoint}/${role.id}`, {
        preserveScroll: true,
    })
}

function save(): void {
    if (selected.value) {
        form.put(`${props.endpoint}/${selected.value.id}`, {
            preserveScroll: true,
        })
    }
}
</script>

<template>
    <Head title="Roles and permissions" />

    <div class="flex flex-col gap-4 p-4 sm:p-6">
        <div>
            <h1 class="text-xl font-semibold tracking-tight">Roles and permissions</h1>
            <p class="text-sm text-muted-foreground font-normal">
                What each role may do. Everyone is denied anything not ticked here.
            </p>
        </div>

        <div class="flex flex-col gap-4 lg:flex-row">
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
                     grants nothing until somebody ticks boxes and saves, unless
                     it was started from a template. -->
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

                    <!--
                        START FROM SOMETHING, OR FROM NOTHING.

                        An empty matrix is not a neutral default: it is dozens of
                        boxes to tick correctly from memory, and the mistakes it
                        produces are lopsided. Forgetting a `view` is a complaint
                        within the hour; leaving `force delete` ticked is
                        invisible until the day somebody uses it. Blank forms
                        quietly push people towards over-granting, because the
                        fastest way to make a role work is to tick more.
                    -->
                    <label class="flex flex-col gap-1">
                        <span class="text-xs text-muted-foreground font-normal">Start from</span>
                        <select
                            v-model="newRole.template"
                            class="h-9 rounded-md border border-input bg-background px-2 text-sm"
                        >
                            <option :value="null">Nothing - an empty role</option>
                            <option v-for="t in templates" :key="t.key" :value="t.key">
                                {{ t.name }}
                            </option>
                        </select>
                    </label>

                    <p v-if="chosenTemplate" class="text-xs text-muted-foreground font-normal">
                        {{ chosenTemplate.description }}
                        <!-- The count is the honest summary: a template is a
                             starting point, and the matrix below is what it
                             actually did. -->
                        <span class="block">
                            Ticks
                            {{ chosenTemplate.abilities.length }} permission(s). Editable afterwards
                            like any other role.
                        </span>
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

                    <!--
                        A STARTING POINT FOR A ROLE THAT ALREADY EXISTS.

                        Nothing is saved until Save is pressed, so the operator
                        sees which boxes moved before committing - and a role
                        whose permissions drifted over a year can be put back on
                        a known footing without ticking forty boxes from memory.
                    -->
                    <div
                        v-if="!locked && templates.length"
                        class="flex flex-wrap items-center gap-2 rounded-lg border p-3 text-sm"
                    >
                        <span class="text-xs text-muted-foreground font-normal"
                            >Replace these with a template:</span
                        >

                        <select
                            v-model="applying"
                            class="h-8 rounded-md border border-input bg-background px-2 text-sm"
                        >
                            <option value="">Choose one…</option>
                            <option v-for="t in templates" :key="t.key" :value="t.key">
                                {{ t.name }}
                            </option>
                        </select>

                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            :disabled="applying === ''"
                            @click="applyTemplate"
                        >
                            Apply
                        </Button>

                        <span class="w-full text-xs text-muted-foreground">
                            Ticks the boxes and stops there - nothing is saved until you press Save
                            changes.
                        </span>
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
                                    v-for="(abilityLabel, ability) in panelAbilities"
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
                                    {{ abilityLabel }}
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
</template>
