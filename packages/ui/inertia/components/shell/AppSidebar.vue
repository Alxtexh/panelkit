<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3'
import {
    Check,
    ChevronLeft,
    ChevronRight,
    File,
    Folder,
    FolderOpen,
    HelpCircle,
    House,
    MessageCircleQuestion,
    Minus,
    Plus,
    Search,
    Sparkles,
} from '@lucide/vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { PkBoundary, PkDropdown, useAppearance } from '@alxtexh-enterprise/panel'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarSeparator,
    useSidebar,
} from '@alxtexh-enterprise/panel'
import { useCurrentUrl } from '../../composables/useCurrentUrl'
import { usePanelNav } from '../../composables/usePanelNav'
import type { NavGroup } from '../../composables/usePanelNav'
import { useSidebarLayout } from '../../composables/useSidebarLayout'
import { useSidebarOpener } from '../../lib/mobileNav'
import type { NavItem } from '../../types'
import AppLogo from './AppLogo.vue'
import DefaultAccountMenuItems from './DefaultAccountMenuItems.vue'
import NavFooter from './NavFooter.vue'
import NavMain from './NavMain.vue'
import NavUser from './NavUser.vue'
import NestedNavGroups from './NestedNavGroups.vue'
import SidebarMiniCalendar from './SidebarMiniCalendar.vue'
import SidebarSupportMenu from './SidebarSupportMenu.vue'
import TeamSwitcher from './TeamSwitcher.vue'

/**
 * Built from the resource registry, delivered with the initial payload.
 *
 * A hardcoded list would mean `make:panel-resource --generate` produced a
 * screen you could only reach by typing the URL, which is not "no hand
 * editing". Items are already permission-filtered server-side, so a resource
 * the user cannot view never reaches the client at all.
 */
const props = defineProps<{
    /** Gallery / preview override; wins over the panel's shared layout. */
    forceSidebarLayout?: string | null
}>()

const page = usePage()

const { chrome: sidebarChrome } = useSidebarLayout(() => props.forceSidebarLayout)

function openCommandPalette(): void {
    window.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: 'k',
            code: 'KeyK',
            ctrlKey: true,
            bubbles: true,
        }),
    )
}

/**
 * Sidebar side comes from the user preference.
 *
 * Passed to the component rather than flipped with CSS: the sidebar is
 * fixed-positioned, so `flex-direction: row-reverse` moved only the spacer and
 * left the panel sitting on top of the content.
 */
const { appearance } = useAppearance()

/**
 * COLLAPSED GROUPS BECOME FLYOUTS.
 *
 * An icon rail has no width to expand a group into, so the previous behaviour
 * was that collapsing the sidebar simply HID every grouped resource - the rail
 * showed Dashboard and nothing else, and the only way back to Clients was to
 * expand again. A flyout beside the rail is the standard answer and the one the
 * reference panels use.
 *
 * It opens on hover as well as click, because a rail is a scanning surface:
 * requiring a click to discover what an icon contains defeats the point of
 * collapsing.
 */
const { state, isMobile, setOpenMobile } = useSidebar()

/**
 * THE BOTTOM BAR'S "MORE" OPENS THIS, rather than a menu of its own.
 *
 * It used to open a sheet built from the same data as this sidebar and looking
 * nothing like it - no groups, no collapse state, no footer links - so a phone
 * got a second navigation nobody else has seen. Opening the real drawer means
 * the thing somebody learns on a handset is the thing they see on a laptop.
 *
 * REGISTERED WHILE MOUNTED, because the horizontal layout has no sidebar and
 * the bar has to know the difference between "opened" and "asked into nothing".
 */
const opener = useSidebarOpener()

onMounted(() => opener.register())
onUnmounted(() => opener.unregister())

watch(opener.requests, () => setOpenMobile(true))

/**
 * Icon-only flyouts are a DESKTOP rail mode. On a phone the sidebar is a
 * full overlay drawer: every item needs its label, and collapsible groups
 * still show their titles. `state` can stay collapsed from the desktop
 * cookie while the mobile sheet is open; that must not hide the text.
 */
const isCollapsed = computed(() => !isMobile.value && state.value === 'collapsed')

/** The flyout opens away from the rail, whichever edge it is on. */
const flyoutSide = computed<'left' | 'right'>(() =>
    appearance.value.sidebarSide === 'right' ? 'left' : 'right',
)

const { isCurrentUrl } = useCurrentUrl()

/**
 * WHICH HEADER, decided here rather than inside `TeamSwitcher` itself -
 * something has to render the plain logo link when there is nothing to
 * switch between, and a component that renders nothing cannot also be the
 * `v-else` of a sibling it does not know about.
 */
const hasWorkspaces = computed(() => page.props.workspaces != null)

function groupIsActive(items: NavItem[]): boolean {
    return items.some((i) => isCurrentUrl(typeof i.href === 'string' ? i.href : String(i.href)))
}

/** Whether the active page is this group's OWN item, or one nested under it. */
function groupContainsActive(group: NavGroup): boolean {
    return groupIsActive(group.items) || group.groups.some((sub) => groupIsActive(sub.items))
}

const { nav, supportItems } = usePanelNav()

/**
 * On a phone, choosing a destination closes the drawer.
 *
 * FOUND IN THE DEVICE PREVIEW, which is the point of having one: at 390px the
 * sidebar is an overlay covering the page, so tapping a link navigated behind a
 * drawer that stayed open. The destination was reached and could not be seen -
 * which reads as the tap having failed, so the natural next move is to tap it
 * again.
 *
 * Only on mobile. On a desktop the rail is permanent and closing it after every
 * click would be the bug.
 */
function closeOnMobile() {
    if (isMobile.value) {
        setOpenMobile(false)
    }
}

/**
 * Home, for the portal actually being served.
 *
 * IT WAS A HARDCODED `/dashboard`, which is the operator application's screen -
 * so the first entry in a generated portal's navigation took you out of the
 * portal, and the only way back was the browser button. The server knows which
 * panel is serving the request; the client should not be guessing.
 */
const panelHome = computed(
    () =>
        (page.props.panelHome as { href: string; isDefault: boolean } | undefined) ?? {
            href: '/',
            isDefault: true,
        },
)

const dashboardItem = computed<NavItem>(() => ({
    /*
     * THE NAME DOES NOT CHANGE BETWEEN PORTALS. It was briefly "Home" in a
     * generated one, which is a second word for the same thing - somebody
     * working across two portals then has to notice that the first entry is
     * called something else before they trust it is the same entry. The
     * DESTINATION differs; the label is a constant.
     */
    title: 'Dashboard',
    href: panelHome.value.href,
    /*
     * House, not a grid - a grid glyph on the panel's own first, most-clicked
     * entry reads as "launcher", which is what a grid means everywhere else
     * in this sidebar (Catalog, the kit showcase). Filament's own default
     * dashboard nav item is a house for the same reason: "home" needs a home
     * icon.
     */
    icon: House,
}))

/**
 * The support screens, resolved for THE PANEL BEING SERVED.
 *
 * THE OLD GUARD HERE WAS `panelHome.isDefault ? [...] : []`, on the reasoning
 * that these were routed at the root, so a generated portal offering them was
 * a portal you leave by clicking Help. That reasoning went stale the day
 * `HelpController` was mounted under every panel's prefix - `platform/help`,
 * `reseller/faq`, `client/about` all answer - and the guard kept suppressing
 * the whole footer anyway. The server now shares each URL per panel
 * (`SharePanelProps`), null when that panel genuinely lacks the route, so the
 * footer shows exactly what this portal can serve and nothing it cannot.
 *
 * WHAT'S NEW IS `panel.whatsNew` WHEN THE SERVER SHARED A URL, and the
 * packaged `/whats-new` path otherwise. ChangelogPage used to hide the
 * route on an empty config, so a stock install lost the fourth footer
 * link while Help, FAQ and About still appeared.
 *
 * DECLARED ABOVE `navGroups`, WHICH READS IT, AND THAT ORDER IS LOAD-BEARING.
 * `const collapsed = ref(readCollapsed())` forces `navGroups` DURING setup, so
 * the computed body runs while this file is still being evaluated - and a
 * `const` declared further down is in its temporal dead zone at that moment.
 * Sitting below, this threw on every single panel screen: the sidebar's setup
 * aborted, so the whole shell failed to mount and every page rendered blank,
 * with only a console error to say why. Lazy evaluation does NOT save it: this
 * one computed is read eagerly, and that is easy to miss from the call site.
 */
/**
 * `route()` on the server yields ABSOLUTE urls, and everything downstream -
 * the footer-wins dedup in `navGroups`, `isCurrentUrl` - compares paths. One
 * regex rather than `new URL(...)`, because this also runs during SSR where
 * there is no `window.location` to resolve against.
 */
const toPath = (url: string): string => url.replace(/^https?:\/\/[^/]+/, '') || '/'

const supportNavItems = computed<NavItem[]>(() => {
    const panel = page.props.panel as
        | {
            help?: string | null
            faq?: string | null
            whatsNew?: string | null
          }
        | null
        | undefined

    const items: NavItem[] = []

    if (panel?.help) {
        items.push({ title: 'Help', href: toPath(panel.help), icon: HelpCircle })
    }

    if (panel?.faq) {
        items.push({ title: 'FAQ', href: toPath(panel.faq), icon: MessageCircleQuestion })
    }

    if (panel?.whatsNew) {
        items.push({ title: "What's new", href: toPath(panel.whatsNew), icon: Sparkles })
    }

    if (items.length > 0) {
        /*
         * A STOCK INSTALL SHARES HELP/FAQ but not What's new until
         * ChangelogPage has releases. The footer is still four links; the
         * packaged default is `/whats-new`.
         */
        if (!items.some((item) => item.title === "What's new")) {
            const fallback = supportItems.value.find((item) => item.title === "What's new")

            if (fallback) {
                items.push(fallback)
            }
        }

        return items
    }

    /*
     * APP-OWNED ROUTES USED TO SKIP SharePanelProps, so `panel.help` was
     * undefined and this footer vanished on Backups/Logs/Monitoring while
     * Dashboard still had it. The default portal's support screens still
     * live at these paths; a generated portal without shared urls stays
     * empty rather than linking out.
     */
    const home = page.props.panelHome as { isDefault?: boolean } | undefined

    return home?.isDefault === false ? [] : supportItems.value
})

/**
 * Navigation, grouped by the `group` each resource declares, from the SHARED
 * model.
 *
 * Resources have carried a group since Phase 4 and nothing rendered it, so every
 * screen sat in one flat list. That is fine at three resources and unusable at
 * twenty - which is the point at which a panel stops being navigable and starts
 * needing search for everything. Ungrouped resources stay at the top level
 * rather than landing in a catch-all "Other": a group of one is noise.
 *
 * This block used to rebuild the groups itself, in parallel with `usePanelNav`.
 * That composable's own docblock warns against exactly this - "duplicating the
 * group-building into each is how a resource ends up visible in two layouts and
 * missing from the third, with nothing failing" - and it is precisely what
 * happened: two new groups were added to the composable, they appeared in the
 * horizontal bar, and the sidebar silently did not have them. Nothing errored,
 * because there was no contradiction to detect - just two lists that had
 * stopped agreeing. One source now.
 *
 * `grouped` IS `nav.value.groups` UNCHANGED, not a re-derived shape - the
 * sidebar walks `NavGroup[]` directly, including each group's own nested
 * `groups`, rather than flattening to `[name, items]` pairs the way it used
 * to. Anything nested a second time (`Screens/Errors`) still arrives with a
 * `.groups` array of its own; the template just never recurses into it,
 * because one level of nesting is the whole shape this follows.
 *
 * THE FOOTER WINS, AND THE MAIN LIST GIVES THAT ENTRY UP. `What's new` is a
 * REGISTERED PAGE - `ChangelogPage` declares the slug, so it arrives in
 * `panelPages` and lands in the top-level list like any other - AND it is
 * hardcoded into the footer. Both rendered, so the same destination appeared
 * twice in one sidebar: once under Platform and once beside Help and FAQ.
 *
 * DEDUPED BY HREF RATHER THAN BY TITLE, and against whatever the footer
 * actually holds rather than against a second hardcoded list - so a support
 * link added there is automatically dropped from the main list instead of
 * quietly becoming the next duplicate. The FOOTER is the one that survives,
 * because that is where these belong: read once and then rarely, they should
 * not compete with the resources.
 */
const navGroups = computed(() => {
    const inFooter = new Set(supportNavItems.value.map((item) => String(item.href)))

    return {
        ungrouped: [
            dashboardItem.value,
            ...nav.value.primary.filter(
                (item) => item.title !== 'Dashboard' && !inFooter.has(String(item.href)),
            ),
        ],
        grouped: nav.value.groups,
    }
})

/*
 * The key is versioned because the DEFAULT changed.
 *
 * Resource sections are closed by default. This keeps a large panel calm on
 * first paint while the active destination remains discoverable at the top;
 * navigation into a section opens its active trail. Bumping the key retires
 * the older open-by-default preference so existing browsers receive this
 * compact navigation on the next visit.
 */
const NAV_STORAGE_KEY = 'alxtexhpanel.nav.collapsed.v6'

/**
 * Which groups are CLOSED. Every collapsible group starts closed; static
 * sections are intentionally omitted because they have no dropdown state.
 * Nested keys are included as well so opening a parent never reveals a second
 * level unexpectedly. The explicit local preference is read after this
 * function, so this only controls a fresh browser or a new schema.
 */
function defaultCollapsed(): Set<string> {
    const closed = new Set<string>()

    for (const group of navGroups.value.grouped) {
        if (group.collapsible) {
            closed.add(group.name)
        }

        for (const sub of group.groups) {
            if (sub.collapsible) {
                closed.add(`${group.name}/${sub.name}`)
            }
        }
    }

    return closed
}

/**
 * Read synchronously rather than in `onMounted`.
 *
 * Deciding this after mount means the first paint renders every group open and
 * then closes them, which reads as the sidebar flinching on every page load.
 */
function readCollapsed(): Set<string> {
    if (typeof window === 'undefined') {
        // Match the browser's first paint during SSR/hydration. Returning an
        // empty set here renders every group open on the server, then closes
        // them on hydration, which is the exact sidebar flinch this state is
        // meant to prevent.
        return defaultCollapsed()
    }

    try {
        const saved = localStorage.getItem(NAV_STORAGE_KEY)

        return saved ? new Set(JSON.parse(saved) as string[]) : defaultCollapsed()
    } catch {
        // Private mode or corrupt storage. The default is still correct.
        return defaultCollapsed()
    }
}

const collapsed = ref<Set<string>>(readCollapsed())

/**
 * `key` IS THE FULL PATH - a bare name for a top-level group, `'Screens/Errors'`
 * for a nested one - and `collapsible` is READ OFF THE GROUP AT THE CALL SITE
 * rather than looked up here. A section's heading is not even a button (see
 * the template), so the guard is belt-and-braces for a programmatic caller;
 * it no longer needs its own lookup into a name-only Set that a compound key
 * would not match correctly anyway.
 */
function toggleGroup(key: string, collapsible: boolean) {
    if (!collapsible) {
        return
    }

    const next = new Set(collapsed.value)

    if (next.has(key)) {
        next.delete(key)
    } else {
        next.add(key)
    }

    collapsed.value = next

    try {
        localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify([...next]))
    } catch {
        // Private mode. The group still toggles; only persistence is lost.
    }
}

/*
 * Navigating into a collapsed group opens it - AND, if the arriving page is
 * inside a NESTED group, opens both levels, or the sidebar shows the right
 * top-level section already open with its own dropdown still shut on the
 * page you are on.
 *
 * Without this, following a ⌘K result or a link into Network leaves that group
 * shut with its own page showing - the sidebar says you are nowhere. Only the
 * arriving group (and its arriving subgroup) is touched; whatever else the
 * user had open stays open.
 *
 * ONLY WHEN `collapsible`. In `drilldown` there is no accordion state to open -
 * the watcher below does the equivalent job of keeping `focusedPath` honest.
 */
watch(
    () => page.url,
    () => {
        if (isDrilldown.value) {
            return
        }

        const next = new Set(collapsed.value)
        let changed = false

        for (const group of navGroups.value.grouped) {
            if (groupContainsActive(group) && next.delete(group.name)) {
                changed = true
            }

            for (const sub of group.groups) {
                if (groupIsActive(sub.items) && next.delete(`${group.name}/${sub.name}`)) {
                    changed = true
                }
            }
        }

        if (changed) {
            collapsed.value = next
        }
    },
)

/**
 * `drilldown`: a group opened by REPLACING the sidebar's contents with its own
 * items and a back button, rather than by expanding in place.
 *
 * NO NEW SERVER SHAPE. `navGroups.grouped` already carries everything this
 * needs, nesting included - the same tree the accordion above walks. The two
 * render modes are a client-side choice about ONE structure, not two.
 *
 * A STATIC TOP-LEVEL SECTION IS NEVER ITSELF DRILLED INTO - it has no
 * open/closed state in `collapsible` mode either, so `drilldown` shows its own
 * items inline the same way. Its NESTED groups are a different question: they
 * are dropdowns regardless of what their parent is, so they drill exactly like
 * a top-level one does - `focusedPath` can end on either.
 */
const isDrilldown = computed(() => appearance.value.menuStyle === 'drilldown')

/**
 * ONE OR TWO SEGMENTS: `[]` at the top level, `['Screens']` inside a
 * top-level group, `['Screens', 'Errors']` inside a group nested under that.
 * A path rather than a single name generalises "back" to "pop the last
 * segment" regardless of depth, without the two levels needing separate
 * state.
 */
const focusedPath = ref<string[]>([])

/** The group named by the last segment of `focusedPath`, or null at the top. */
const focusedGroup = computed<NavGroup | null>(() => {
    let level = navGroups.value.grouped
    let found: NavGroup | null = null

    for (const segment of focusedPath.value) {
        found = level.find((g) => g.name === segment) ?? null

        if (!found) {
            return null
        }

        level = found.groups
    }

    return found
})

function focusGroup(name: string) {
    focusedPath.value = [...focusedPath.value, name]
}

/** Drilling straight into a nested group: both levels focused in one click. */
function focusGroupPair(name: string, subName: string) {
    focusGroup(name)
    focusGroup(subName)
}

function unfocusGroup() {
    focusedPath.value = focusedPath.value.slice(0, -1)
}

/**
 * Entering `drilldown`, or navigating while already in it, both land on
 * wherever the current page actually is - the same "show me where I am" rule
 * `collapsed` follows above. Two levels deep when the page belongs to a
 * nested group, one when it belongs to a top-level group directly, none when
 * it is ungrouped - never stranding whatever was open before the navigation.
 */
watch(
    [isDrilldown, () => page.url],
    ([drilldown]) => {
        if (!drilldown) {
            return
        }

        const top = navGroups.value.grouped.find((g) => groupContainsActive(g))

        if (!top) {
            focusedPath.value = []

            return
        }

        const sub = top.groups.find((s) => groupIsActive(s.items))

        focusedPath.value = sub ? [top.name, sub.name] : [top.name]
    },
    { immediate: true },
)
</script>

<template>
    <Sidebar
        :collapsible="isMobile ? 'offcanvas' : sidebarChrome.collapsible"
        :variant="sidebarChrome.variant"
        :side="appearance.sidebarSide === 'right' ? 'right' : 'left'"
    >
        <SidebarHeader>
            <TeamSwitcher v-if="hasWorkspaces && !sidebarChrome.hideSidebarBrand" />
            <SidebarMenu v-else-if="!sidebarChrome.hideSidebarBrand">
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="'/'">
                            <!-- The rail has room, and the name says which tenant. -->
                            <AppLogo show-name />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>

            <!--
                header family (sidebar-16): search in the rail. Opens the same
                command palette the topbar already mounts (Ctrl+K).
            -->
            <button
                v-if="sidebarChrome.sidebarSearch && !isCollapsed"
                type="button"
                class="mx-2 mb-1 flex h-8 items-center gap-2 rounded-md border bg-background px-2 text-left text-sm text-muted-foreground shadow-none hover:bg-muted"
                @click="openCommandPalette"
            >
                <Search class="size-4 shrink-0" />
                <span class="truncate">Search…</span>
            </button>

            <!--
                calendar family (sidebar-12): account menu sits in the rail
                header the way the shadcn block places NavUser.
            -->
            <PkBoundary v-if="sidebarChrome.headerUser" label="The account menu" silent>
                <NavUser>
                    <template #menu="{ user }">
                        <slot name="userMenu" :user="user">
                            <DefaultAccountMenuItems />
                        </slot>
                    </template>
                </NavUser>
            </PkBoundary>
        </SidebarHeader>

        <SidebarContent>
            <SidebarMiniCalendar v-if="sidebarChrome.calendarChrome && !isCollapsed" />
            <SidebarSeparator v-if="sidebarChrome.calendarChrome && !isCollapsed" class="mx-0" />

            <!--
                HIDDEN WHILE DRILLED IN. The top-level list and a focused
                group's own items would otherwise both be on screen at once,
                which is the accordion's layout wearing the drilldown's
                back button - neither one nor the other.
            -->
            <NavMain
                v-if="!(isDrilldown && focusedGroup)"
                :items="navGroups.ungrouped"
                :label="
                    sidebarChrome.calendarChrome
                        ? undefined
                        : sidebarChrome.treeNav
                          ? 'Files'
                          : 'Platform'
                "
                @navigate="closeOnMobile"
            />

            <!--
                Two renderings of one group list.

                EXPANDED: a collapsible section, so twenty resources stay
                navigable. COLLAPSED: a flyout, because the rail is too narrow
                to expand into - without this branch every grouped resource
                disappears the moment the sidebar is collapsed.
            -->
            <template v-if="isCollapsed">
                <SidebarGroup
                    v-for="group in navGroups.grouped"
                    :key="group.name"
                    class="px-2 py-0"
                >
                    <PkDropdown :placement="flyoutSide" width="w-52" :offset="8" hoverable>
                        <template #trigger>
                            <button
                                type="button"
                                class="flex size-8 items-center justify-center rounded-md transition-colors hover:bg-sidebar-accent"
                                :class="groupContainsActive(group) ? 'bg-sidebar-accent' : ''"
                                :aria-label="group.name"
                                :title="group.name"
                            >
                                <component
                                    :is="group.items[0]?.icon ?? group.groups[0]?.items[0]?.icon"
                                    class="size-4"
                                />
                            </button>
                        </template>

                        <template #panel="{ close }">
                            <!--
                                The HEADING carries the icon; the items do not -
                                the same rule the expanded sidebar follows. In a
                                flyout the group name is already at the top, so
                                an icon on every child repeats what the header
                                said and distinguishes nothing between siblings.
                            -->
                            <p
                                class="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-muted-foreground"
                            >
                                <component
                                    :is="group.items[0]?.icon ?? group.groups[0]?.items[0]?.icon"
                                    class="size-4 shrink-0"
                                />
                                {{ group.name }}
                            </p>

                            <div class="ml-4 border-l border-border">
                                <Link
                                    v-for="item in group.items"
                                    :key="item.title"
                                    :href="item.href"
                                    prefetch="hover"
                                    cache-for="30s"
                                    class="group/flyout relative flex items-center py-1.5 pl-4 text-sm transition-colors hover:text-foreground"
                                    :class="
                                        isCurrentUrl(item.href)
                                            ? 'font-medium text-foreground'
                                            : 'text-muted-foreground'
                                    "
                                    @click="close()"
                                >
                                    <span
                                        class="absolute -left-[3px] flex size-1.5 items-center justify-center rounded-full bg-popover"
                                        aria-hidden="true"
                                    >
                                        <span
                                            class="size-1.5 rounded-full transition-colors"
                                            :class="
                                                isCurrentUrl(item.href)
                                                    ? 'bg-primary'
                                                    : 'bg-muted-foreground/40 group-hover/flyout:bg-muted-foreground'
                                            "
                                        />
                                    </span>
                                    {{ item.title }}
                                </Link>
                            </div>

                            <!--
                                NESTED DROPDOWNS, FLATTENED. A flyout is already
                                a compact popover with nowhere to drill further
                                into - so a subgroup's items appear here under
                                their own small heading rather than behind a
                                second click the rail has no room to explain.
                            -->
                            <div v-for="sub in group.groups" :key="sub.name" class="mt-2">
                                <p class="px-2 py-1 text-xs font-medium text-muted-foreground">
                                    {{ sub.name }}
                                </p>
                                <div class="ml-4 border-l border-border">
                                    <Link
                                        v-for="item in sub.items"
                                        :key="item.title"
                                        :href="item.href"
                                        prefetch="hover"
                                        cache-for="30s"
                                        class="group/flyout relative flex items-center py-1.5 pl-4 text-sm transition-colors hover:text-foreground"
                                        :class="
                                            isCurrentUrl(item.href)
                                                ? 'font-medium text-foreground'
                                                : 'text-muted-foreground'
                                        "
                                        @click="close()"
                                    >
                                        <span
                                            class="absolute -left-[3px] flex size-1.5 items-center justify-center rounded-full bg-popover"
                                            aria-hidden="true"
                                        >
                                            <span
                                                class="size-1.5 rounded-full transition-colors"
                                                :class="
                                                    isCurrentUrl(item.href)
                                                        ? 'bg-primary'
                                                        : 'bg-muted-foreground/40 group-hover/flyout:bg-muted-foreground'
                                                "
                                            />
                                        </span>
                                        {{ item.title }}
                                    </Link>
                                </div>
                            </div>
                        </template>
                    </PkDropdown>
                </SidebarGroup>
            </template>

            <!--
                DRILLDOWN, TOP LEVEL. A section renders fully, same as the
                accordion below - it has no state to drill into either way,
                and its OWN nested groups appear as drill-rows within it
                rather than turning the section itself into one. Every other
                top-level group is a plain row: no chevron-down, no expanded
                items, just a destination one tap away.
            -->
            <template v-else-if="isDrilldown && !focusedGroup">
                <SidebarGroup
                    v-for="group in navGroups.grouped"
                    :key="group.name"
                    class="px-2 py-0"
                >
                    <template v-if="!group.collapsible">
                        <p
                            class="flex w-full items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground"
                        >
                            <component
                                :is="group.items[0]?.icon ?? group.groups[0]?.items[0]?.icon"
                                class="size-4 shrink-0"
                                aria-hidden="true"
                            />
                            <span class="flex-1 text-left">{{ group.name }}</span>
                        </p>

                        <NavMain :items="group.items" nested @navigate="closeOnMobile" />

                        <!-- NESTED DROPDOWNS, AS DRILL ROWS - "Auth", "Errors" living inside a static "Pages"/"Screens" heading. -->
                        <div v-for="sub in group.groups" :key="sub.name" class="ml-4">
                            <button
                                type="button"
                                class="flex w-full items-center gap-2 rounded-md py-1.5 pl-4 text-sm transition-colors hover:bg-sidebar-accent"
                                :class="
                                    groupIsActive(sub.items)
                                        ? 'bg-sidebar-accent font-medium'
                                        : 'text-muted-foreground hover:text-foreground'
                                "
                                @click="focusGroupPair(group.name, sub.name)"
                            >
                                <span class="flex-1 text-left">{{ sub.name }}</span>
                                <ChevronRight class="size-3.5 shrink-0" aria-hidden="true" />
                            </button>
                        </div>
                    </template>

                    <button
                        v-else
                        type="button"
                        class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent"
                        :class="
                            groupContainsActive(group)
                                ? 'bg-sidebar-accent font-medium'
                                : 'text-muted-foreground hover:text-foreground'
                        "
                        @click="focusGroup(group.name)"
                    >
                        <component
                            :is="group.items[0]?.icon ?? group.groups[0]?.items[0]?.icon"
                            class="size-4 shrink-0"
                            aria-hidden="true"
                        />
                        <span class="flex-1 text-left">{{ group.name }}</span>
                        <ChevronRight class="size-3.5 shrink-0" aria-hidden="true" />
                    </button>
                </SidebarGroup>
            </template>

            <!--
                DRILLDOWN, INSIDE A GROUP - one or two levels deep, per
                `focusedPath`. The back row goes up ONE segment, not to the
                top - popping back out of "Errors" lands on "Screens", not on
                the section list, matching how the reference behaves.
            -->
            <template v-else-if="isDrilldown && focusedGroup">
                <SidebarGroup class="px-2 py-0">
                    <button
                        type="button"
                        class="mb-1 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                        @click="unfocusGroup"
                    >
                        <ChevronLeft class="size-3.5 shrink-0" aria-hidden="true" />
                        <span class="flex-1 text-left">{{ focusedGroup.name }}</span>
                    </button>

                    <NavMain :items="focusedGroup.items" nested @navigate="closeOnMobile" />

                    <!-- A subgroup nested one level further still, if this one has any. -->
                    <div v-for="sub in focusedGroup.groups" :key="sub.name" class="ml-4">
                        <button
                            type="button"
                            class="flex w-full items-center gap-2 rounded-md py-1.5 pl-4 text-sm transition-colors hover:bg-sidebar-accent"
                            :class="
                                groupIsActive(sub.items)
                                    ? 'bg-sidebar-accent font-medium'
                                    : 'text-muted-foreground hover:text-foreground'
                            "
                            @click="focusGroup(sub.name)"
                        >
                            <span class="flex-1 text-left">{{ sub.name }}</span>
                            <ChevronRight class="size-3.5 shrink-0" aria-hidden="true" />
                        </button>
                    </div>
                </SidebarGroup>
            </template>

            <SidebarGroup
                v-for="group in navGroups.grouped"
                v-else
                :key="group.name"
                class="px-2 py-0"
                :class="sidebarChrome.accordionNav || sidebarChrome.treeNav ? 'gap-0' : ''"
            >
                <!--
                    calendar family: collapsible labeled sections with check
                    marks on leaves (sidebar-12 Calendars chrome).
                -->
                <template v-if="sidebarChrome.calendarChrome">
                    <button
                        type="button"
                        class="group/label flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        :aria-expanded="!collapsed.has(group.name)"
                        @click="toggleGroup(group.name, true)"
                    >
                        <span class="flex-1 text-left font-medium">{{ group.name }}</span>
                        <ChevronRight
                            class="size-3.5 shrink-0 transition-transform"
                            :class="collapsed.has(group.name) ? '' : 'rotate-90'"
                            aria-hidden="true"
                        />
                    </button>
                    <SidebarMenu v-if="!collapsed.has(group.name)" class="gap-0.5 px-2">
                        <SidebarMenuItem v-for="item in group.items" :key="item.title">
                            <SidebarMenuButton as-child :is-active="isCurrentUrl(item.href)">
                                <Link
                                    :href="item.href"
                                    prefetch="hover"
                                    cache-for="30s"
                                    @click="closeOnMobile"
                                >
                                    <Check
                                        class="size-3.5 shrink-0"
                                        :class="
                                            isCurrentUrl(item.href) ? 'opacity-100' : 'opacity-0'
                                        "
                                        aria-hidden="true"
                                    />
                                    <span>{{ item.title }}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <template v-for="sub in group.groups" :key="sub.name">
                            <SidebarGroupLabel class="mt-1">{{ sub.name }}</SidebarGroupLabel>
                            <SidebarMenuItem v-for="item in sub.items" :key="item.title">
                                <SidebarMenuButton as-child :is-active="isCurrentUrl(item.href)">
                                    <Link
                                        :href="item.href"
                                        prefetch="hover"
                                        cache-for="30s"
                                        @click="closeOnMobile"
                                    >
                                        <Check
                                            class="size-3.5 shrink-0"
                                            :class="
                                                isCurrentUrl(item.href)
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            "
                                            aria-hidden="true"
                                        />
                                        <span>{{ item.title }}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </template>
                    </SidebarMenu>
                </template>

                <!--
                    file-tree family: folders and files with indent (sidebar-11).
                    Static and collapsible groups both render as folders.
                -->
                <template v-else-if="sidebarChrome.treeNav">
                    <button
                        type="button"
                        class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-sidebar-accent"
                        :class="
                            groupContainsActive(group)
                                ? 'bg-sidebar-accent/60 font-medium'
                                : 'text-sidebar-foreground'
                        "
                        :aria-expanded="!group.collapsible || !collapsed.has(group.name)"
                        @click="group.collapsible && toggleGroup(group.name, group.collapsible)"
                    >
                        <component
                            :is="
                                !group.collapsible || !collapsed.has(group.name)
                                    ? FolderOpen
                                    : Folder
                            "
                            class="size-4 shrink-0 text-amber-600 dark:text-amber-400"
                            aria-hidden="true"
                        />
                        <span class="flex-1 truncate text-left">{{ group.name }}</span>
                        <ChevronRight
                            v-if="group.collapsible"
                            class="size-3.5 shrink-0 transition-transform"
                            :class="collapsed.has(group.name) ? '' : 'rotate-90'"
                            aria-hidden="true"
                        />
                    </button>
                    <div
                        v-if="!group.collapsible || !collapsed.has(group.name)"
                        class="ml-3 border-l border-sidebar-border pl-2"
                    >
                        <Link
                            v-for="item in group.items"
                            :key="item.title"
                            :href="item.href"
                            prefetch="hover"
                            cache-for="30s"
                            class="flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors"
                            :class="
                                isCurrentUrl(item.href)
                                    ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
                            "
                            @click="closeOnMobile"
                        >
                            <File class="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
                            <span class="truncate">{{ item.title }}</span>
                        </Link>
                        <div v-for="sub in group.groups" :key="sub.name" class="mt-0.5">
                            <button
                                type="button"
                                class="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
                                :aria-expanded="!collapsed.has(`${group.name}/${sub.name}`)"
                                @click="toggleGroup(`${group.name}/${sub.name}`, sub.collapsible)"
                            >
                                <component
                                    :is="
                                        collapsed.has(`${group.name}/${sub.name}`)
                                            ? Folder
                                            : FolderOpen
                                    "
                                    class="size-3.5 shrink-0 text-amber-600 dark:text-amber-400"
                                    aria-hidden="true"
                                />
                                <span class="flex-1 truncate text-left">{{ sub.name }}</span>
                            </button>
                            <div
                                v-if="!collapsed.has(`${group.name}/${sub.name}`)"
                                class="ml-3 border-l border-sidebar-border pl-2"
                            >
                                <Link
                                    v-for="item in sub.items"
                                    :key="item.title"
                                    :href="item.href"
                                    prefetch="hover"
                                    cache-for="30s"
                                    class="flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors"
                                    :class="
                                        isCurrentUrl(item.href)
                                            ? 'bg-sidebar-accent font-medium'
                                            : 'text-muted-foreground hover:bg-sidebar-accent/50'
                                    "
                                    @click="closeOnMobile"
                                >
                                    <File class="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
                                    <span class="truncate">{{ item.title }}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </template>

                <!--
                    accordion family (sidebar-05 / sidebar-06): Plus/Minus triggers
                    and SidebarMenuSub children.
                -->
                <template v-else-if="sidebarChrome.accordionNav">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <button
                                type="button"
                                class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-2 rounded-md p-2 text-left text-sm"
                                :aria-expanded="!collapsed.has(group.name)"
                                @click="toggleGroup(group.name, true)"
                            >
                                <span class="flex-1 truncate">{{ group.name }}</span>
                                <Plus
                                    v-if="collapsed.has(group.name)"
                                    class="size-4 shrink-0"
                                    aria-hidden="true"
                                />
                                <Minus v-else class="size-4 shrink-0" aria-hidden="true" />
                            </button>
                            <SidebarMenuSub v-if="!collapsed.has(group.name)">
                                <SidebarMenuSubItem v-for="item in group.items" :key="item.title">
                                    <SidebarMenuSubButton
                                        as-child
                                        :is-active="isCurrentUrl(item.href)"
                                    >
                                        <Link
                                            :href="item.href"
                                            prefetch="hover"
                                            cache-for="30s"
                                            @click="closeOnMobile"
                                        >
                                            {{ item.title }}
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                <template v-for="sub in group.groups" :key="sub.name">
                                    <SidebarMenuSubItem>
                                        <button
                                            type="button"
                                            class="text-sidebar-foreground flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent"
                                            :aria-expanded="
                                                !collapsed.has(`${group.name}/${sub.name}`)
                                            "
                                            @click="toggleGroup(`${group.name}/${sub.name}`, true)"
                                        >
                                            <span class="flex-1 truncate text-left">{{
                                                sub.name
                                            }}</span>
                                            <Plus
                                                v-if="collapsed.has(`${group.name}/${sub.name}`)"
                                                class="size-3.5 shrink-0"
                                            />
                                            <Minus v-else class="size-3.5 shrink-0" />
                                        </button>
                                    </SidebarMenuSubItem>
                                    <template v-if="!collapsed.has(`${group.name}/${sub.name}`)">
                                        <SidebarMenuSubItem
                                            v-for="item in sub.items"
                                            :key="item.title"
                                        >
                                            <SidebarMenuSubButton
                                                as-child
                                                :is-active="isCurrentUrl(item.href)"
                                                class="pl-6"
                                            >
                                                <Link
                                                    :href="item.href"
                                                    prefetch="hover"
                                                    cache-for="30s"
                                                    @click="closeOnMobile"
                                                >
                                                    {{ item.title }}
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </template>
                                </template>
                            </SidebarMenuSub>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </template>

                <!-- Default inset / edge / floating / icon / header group chrome. -->
                <template v-else>
                    <NavMain
                        v-if="!group.collapsible"
                        :items="group.items"
                        :label="group.name"
                        @navigate="closeOnMobile"
                    />

                    <template v-else>
                        <button
                            type="button"
                            class="flex w-full items-center gap-2 rounded-md p-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            :aria-expanded="!collapsed.has(group.name)"
                            @click="toggleGroup(group.name, group.collapsible)"
                        >
                            <component
                                :is="group.items[0]?.icon ?? group.groups[0]?.items[0]?.icon"
                                class="size-4 shrink-0"
                                aria-hidden="true"
                            />
                            <span class="flex-1 text-left">{{ group.name }}</span>
                            <svg
                                viewBox="0 0 24 24"
                                class="size-3.5 shrink-0 transition-transform"
                                :class="collapsed.has(group.name) ? '-rotate-90' : ''"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        <NavMain
                            v-if="group.items.length && !collapsed.has(group.name)"
                            :items="group.items"
                            nested
                            @navigate="closeOnMobile"
                        />
                    </template>

                    <NestedNavGroups
                        v-if="!group.collapsible || !collapsed.has(group.name)"
                        :groups="group.groups"
                        :parent-name="group.name"
                        :collapsed="collapsed"
                        @toggle="toggleGroup"
                        @navigate="closeOnMobile"
                    />
                </template>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter
            v-if="
                supportNavItems.length > 0 ||
                (!sidebarChrome.topNavUser && !sidebarChrome.headerUser)
            "
        >
            <!--
                THE LINE BETWEEN THE RESOURCES AND THE REST. Without it, "About"
                reads as one more entry in whatever group happens to render last.
                Hidden in icon-rail mode where the footer is icons only.
            -->
            <SidebarSeparator
                v-if="!sidebarChrome.compactFooterSupport"
                class="group-data-[collapsible=icon]:hidden"
            />

            <!--
                Support pages live in the footer, not the main nav: they are
                read once and then rarely, so they should not compete for
                attention with the resources.

                The starter kit's Repository and Documentation links used to sit
                here. They pointed OUT of the panel - at the scaffold's GitHub
                page and the Laravel docs - which is of no use to an operator,
                while occupying the one part of the sidebar that never scrolls
                away.
            -->
            <NavFooter
                v-if="!sidebarChrome.compactFooterSupport && supportNavItems.length > 0"
                :items="supportNavItems"
            />
            <SidebarSupportMenu
                v-else-if="sidebarChrome.compactFooterSupport && supportNavItems.length > 0"
                :items="supportNavItems"
            />

            <!--
                THE BOUNDARY THAT WOULD HAVE PREVENTED THE BLANK 404 PAGE.

                NavUser reads `auth.user`, which is null on any URL that never
                entered the `web` middleware group - an unmatched route being
                the obvious one. It threw, Vue unmounted the whole tree, and the
                error page rendered as nothing at all.

                Silent, because the fallback here is genuinely "no user menu":
                a red failure card wedged into the sidebar footer of an error
                page is more alarming than the absence, and the console still
                gets the stack either way.
            -->
            <PkBoundary
                v-if="!sidebarChrome.topNavUser && !sidebarChrome.headerUser"
                label="The account menu"
                silent
            >
                <NavUser>
                    <template #menu="{ user }">
                        <!--
                            FORWARDED, so an application passes its own account
                            menu items through the sidebar without knowing that
                            NavUser is what renders them.

                            THE FALLBACK IS WHAT RENDERS WHEN NOBODY DID. An
                            install that has not written its own `userMenu`
                            content gets Profile/Security/Help/Sign out from
                            the same shared URLs `PanelAccountMenu` reads,
                            rather than a dropdown that opens onto nothing.
                        -->
                        <slot name="userMenu" :user="user">
                            <DefaultAccountMenuItems />
                        </slot>
                    </template>
                </NavUser>
            </PkBoundary>
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
