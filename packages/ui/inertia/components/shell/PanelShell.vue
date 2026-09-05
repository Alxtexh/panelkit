<script setup lang="ts">
/**
 * The frame every panel screen sits in - and THE SAME frame the reference app
 * proves, not a thinner cousin of it.
 *
 * THERE USED TO BE TWO SHELLS. This one composed `PanelSidebar` - a 191-line
 * flat list with the account menu in the header - while the demo rendered
 * `AppSidebar`: grouped navigation with flyouts, Help/FAQ/What's new/About in
 * a footer, and the account menu at the bottom of the rail. Everything a
 * generated portal was missing already existed in this package; this file
 * simply did not reach for it. So `make:panel` produced the same tables as
 * the demo wearing visibly plainer chrome, which is the exact failure
 * UI_FOUNDATION.md predicted: two copies drift, and the drift surfaces in
 * front of a customer.
 *
 * NOW IT COMPOSES WHAT THE DEMO COMPOSES - `AppShell`, `AppSidebar`,
 * `AppContent`, `AppSidebarHeader` - plus the pieces the demo's `AppLayout`
 * carried and every consumer silently lost: the skip link, the bottom bar
 * padding, the SPA navigation announcement, the session-expired dialog, the
 * toast outlet and per-tenant theming.
 *
 * IT STILL TAKES NO PROPS BY DEFAULT and reads what `SharePanelProps` already
 * puts on every panel response. The published `PanelLayout` keeps its two
 * slots - `#topbar` and `#actions` - and gains `#userMenu`, which is how an
 * application replaces the account menu's items without forking the shell.
 *
 * THE HORIZONTAL PREFERENCE IS HONOURED HERE TOO. The appearance drawer offers
 * top navigation on every installation, and a shell that ignores the setting
 * turns a visible control into a lie. The layout genuinely swaps - the two
 * modes have different DOM, not different styling.
 */
import { router, usePage } from '@inertiajs/vue3'
import { computed, onMounted, ref } from 'vue'
import {
    AppPageFooter,
    PkBottomNav,
    PkModal,
    useAppearance,
    useShellPageFooter,
    useTenantTheme,
} from '@alxtexh-enterprise/panel'
import type { BottomNavItem } from '@alxtexh-enterprise/panel'
import { useSidebarOpener } from '../../lib/mobileNav'
import { showFlashToast } from '../../lib/notificationActions'
import type { FlashToast } from '../../lib/notificationActions'
import type { BreadcrumbItem, User } from '../../types'
import RenderHook from '../RenderHook.vue'
import SessionExpired from '../SessionExpired.vue'
import Toaster from '../Toaster.vue'
import AppContent from './AppContent.vue'
import AppShell from './AppShell.vue'
import AppSidebar from './AppSidebar.vue'
import AppSidebarHeader from './AppSidebarHeader.vue'
import AppTopNav from './AppTopNav.vue'
import PanelIdleLockGuard from './PanelIdleLockGuard.vue'
import PanelImpersonationBanner from './PanelImpersonationBanner.vue'
import PanelInfoSidebar from './PanelInfoSidebar.vue'

const props = withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItem[]
    }>(),
    {
        breadcrumbs: () => [],
    },
)

defineSlots<{
    /** The page. */
    default(): unknown
    /** Between the collapse trigger and the topbar controls - a heading, a search. */
    topbar?(): unknown
    /** Trailing topbar controls, before the appearance drawer. */
    actions?(): unknown
    /** The account menu's items. The default is the packaged menu. */
    userMenu?(props: { user: User | null }): unknown
}>()

const page = usePage()

onMounted(() => {
    showFlashToast(page.props.toast as FlashToast | undefined)

    router.on('flash', (event) => {
        const flash = (event as CustomEvent).detail?.flash
        showFlashToast(flash?.toast as FlashToast | undefined)
    })
})

const { appearance } = useAppearance()
const pageFooter = useShellPageFooter()

const shellHooks = computed(
    () =>
        ((page.props as Record<string, any>).shellHooks as
            | { position: string; component: string; props: Record<string, unknown> }[]
            | undefined) ?? [],
)

/**
 * Per-tenant branding, applied at runtime rather than compiled per tenant.
 * `panelTheme` is what the reference app shares; absent, this applies nothing.
 */
useTenantTheme(computed(() => page.props.panelTheme as Record<string, string> | undefined))

/**
 * The PANEL'S palette - `Panel::colors()` via `SharePanelProps` - as bare
 * custom properties, without the `--color-` prefix. Tailwind's `@theme`
 * declares `--color-primary: var(--primary)` at BUILD time, so `bg-primary`
 * compiles to `var(--primary)`; setting the prefixed name at runtime writes a
 * property nothing reads, which is exactly how per-portal branding once
 * shipped doing nothing at all. This is the only branding channel a generated
 * portal has, so it survives the shell unification.
 */
const palette = computed<Record<string, string>>(() =>
    Object.fromEntries(
        Object.entries(
            ((page.props.panel as Record<string, any> | undefined)?.colors ?? {}) as Record<
                string,
                string
            >,
        ).map(([k, v]) => [`--${k}`, v]),
    ),
)

const horizontal = computed(() => appearance.value.sidebarSide === 'horizontal')

/**
 * The handset navigation, built from the same shared props the sidebar reads -
 * so a screen added in PHP appears in both, and the two can never disagree.
 *
 * `panel.home` rather than a fixed `/dashboard`: inside a generated portal a
 * hardcoded path is a link OUT of the portal, and for an operator who may not
 * open the admin dashboard it refuses.
 */
const bottomNavItems = computed<BottomNavItem[]>(() => {
    const fromProps = (key: string) =>
        ((page.props[key] as any[]) ?? [])
            // `#`-prefixed entries are client-side triggers, not destinations.
            .filter((item) => !String(item.href).startsWith('#'))
            .map((item) => ({
                key: item.key ?? item.href,
                title: item.title,
                href: item.href,
                icon: item.icon,
            }))

    return [
        {
            key: 'dashboard',
            title: 'Home',
            href: (page.props.panel as { home?: string } | undefined)?.home ?? '/dashboard',
            icon: 'home',
        },
        ...fromProps('panelNav'),
        ...fromProps('panelPages'),
    ]
})

/**
 * "More" opens the SIDEBAR - the same one, as a drawer - not a second
 * navigation nobody has seen. The sheet survives only for the horizontal
 * layout, which genuinely has no sidebar; `request()` answers whether
 * anything took the request.
 */
const showAllNav = ref(false)

const opener = useSidebarOpener()

function openFullNav() {
    if (!opener.request()) {
        showAllNav.value = true
    }
}

/**
 * What the live region says after a navigation. Taken from the document
 * title, cleared and re-set so navigating twice to same-titled pages still
 * announces. SPA navigation is otherwise silent to a screen reader.
 */
const announcement = ref('')

router.on('success', () => {
    announcement.value = ''

    requestAnimationFrame(() => {
        announcement.value = `${document.title} - page loaded`
    })
})
</script>

<template>
    <!--
        ONE VIEWPORT TALL. The skip link used to sit in normal flow as a white
        chip, which made `html`/`body` taller than the `h-svh` sidebar wrapper,
        so the page and the inset both scrolled. `pk-shell` is what the
        published stylesheet keys on to freeze the document and leave scrolling
        to the inset.
    -->
    <div class="pk-shell relative flex h-svh flex-col overflow-hidden" :style="palette">
        <!--
        FIRST IN THE DOCUMENT, because that is the only position that works. A
        skip link placed anywhere else is reached after the thing it exists to
        skip. It targets #pk-main, which AppContent renders focusable.

        Hidden until focused: utilities live on the element so a consumer that
        never copied `.pk-skip-link` still gets a real skip link, not a chip
        over the logo.
    -->
        <a
            href="#pk-main"
            class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:border focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
            Skip to content
        </a>

        <!--
        PADDING FOR THE BOTTOM BAR, so the last row of a table is not
        permanently underneath it. `sm:pb-0` because the bar disappears there.
        `min-h-0` so this flex child can shrink; without it the inner `h-svh`
        rail overflows and the document scrolls again.
    -->
        <div class="flex min-h-0 flex-1 flex-col overflow-hidden pb-14 sm:pb-0">
            <!-- Top navigation, by preference: no rail, no provider. -->
            <div
                v-if="horizontal"
                class="flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-sidebar"
            >
                <PanelImpersonationBanner />

                <!--
                FORWARDED ONLY WHEN GIVEN. An unconditional forward renders an
                empty slot where the sidebar would have rendered its default
                menu - the dropdown opens onto nothing, silently.
            -->
                <AppTopNav :breadcrumbs="props.breadcrumbs">
                    <template v-if="$slots.userMenu" #userMenu="{ user }">
                        <slot name="userMenu" :user="user" />
                    </template>
                </AppTopNav>

                <main
                    id="pk-main"
                    tabindex="-1"
                    class="flex min-h-0 flex-1 transform-gpu flex-col overflow-y-auto bg-background text-foreground md:m-2 md:rounded-xl md:border"
                >
                    <div
                        data-slot="app-content-column"
                        class="flex min-h-full w-full shrink-0 flex-col"
                    >
                        <slot />
                        <AppPageFooter v-if="pageFooter" host />
                    </div>
                </main>

                <Toaster />
            </div>

            <AppShell v-else variant="sidebar">
                <AppSidebar>
                    <template v-if="$slots.userMenu" #userMenu="{ user }">
                        <slot name="userMenu" :user="user" />
                    </template>
                </AppSidebar>

                <AppContent
                    variant="sidebar"
                    class="min-h-0 overflow-x-hidden overflow-y-auto md:m-2 md:rounded-2xl md:border md:shadow-sm"
                >
                    <PanelImpersonationBanner />

                    <AppSidebarHeader :breadcrumbs="props.breadcrumbs">
                        <template v-if="$slots.topbar" #topbar>
                            <slot name="topbar" />
                        </template>
                        <template v-if="$slots.actions" #actions>
                            <slot name="actions" />
                        </template>
                        <template v-if="$slots.userMenu" #userMenu="{ user }">
                            <slot name="userMenu" :user="user" />
                        </template>
                    </AppSidebarHeader>

                    <slot />
                </AppContent>

                <Toaster />
            </AppShell>
        </div>

        <PkBottomNav :items="bottomNavItems" :current="page.url" @more="openFullNav" />

        <!--
        EVERY DESTINATION, when the bar's slots are not enough and there is no
        sidebar to open (horizontal mode). A sheet rather than a page: "more"
        is a disclosure, and navigating away to a menu loses the page.
    -->
        <PkModal v-if="showAllNav" :open="showAllNav" title="Go to" @close="showAllNav = false">
            <nav class="flex flex-col">
                <a
                    v-for="item in bottomNavItems"
                    :key="item.key"
                    :href="item.href"
                    class="-mx-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                    :class="page.url === item.href ? 'font-medium text-primary' : ''"
                    >{{ item.title }}</a
                >
            </nav>

            <template #footer>
                <button
                    type="button"
                    class="text-sm text-muted-foreground font-normal hover:text-foreground"
                    @click="showAllNav = false"
                >
                    Close
                </button>
            </template>
        </PkModal>

        <!--
        SPA navigation is silent to a screen reader; a polite live region
        carrying the page title is the standard remedy.
    -->
        <div class="sr-only" role="status" aria-live="polite">
            {{ announcement }}
        </div>

        <!--
        Mounted once, for every panel page. A stale session can be discovered
        on any click anywhere, so the dialog that reports it has to already
        exist wherever that click happened.
    -->
        <SessionExpired />
        <PanelIdleLockGuard />
        <PanelInfoSidebar />
        <RenderHook position="shell.feedback" :hooks="shellHooks" />
    </div>
</template>
