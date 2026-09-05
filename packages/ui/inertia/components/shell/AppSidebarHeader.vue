<script setup lang="ts">
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import { AppearanceDrawer, useAppearance } from '@alxtexh-enterprise/panel'
import { SidebarTrigger } from '@alxtexh-enterprise/panel'
import { PkBoundary } from '@alxtexh-enterprise/panel'
import { useSidebarLayout } from '../../composables/useSidebarLayout'
import type { BreadcrumbItem } from '../../types'
import type { User } from '../../types'
import AssistantDrawer from './AssistantDrawer.vue'
import Breadcrumbs from './Breadcrumbs.vue'
import DefaultAccountMenuItems from './DefaultAccountMenuItems.vue'
import PanelCommandPalette from './PanelCommandPalette.vue'
import PanelLockButton from './PanelLockButton.vue'
import NotificationBell from './PanelNotificationBell.vue'
import PanelQuickCreate from './PanelQuickCreate.vue'
import TopNavUser from './TopNavUser.vue'
import AppLogo from './AppLogo.vue'
import { openPanelInfo } from './panelInfoState'

const props = withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItem[]
    }>(),
    {
        breadcrumbs: () => [],
    },
)

defineSlots<{
    /**
     * Replaces the breadcrumb trail - a heading, a search box. The fallback is
     * the trail, so a screen that passes nothing gets where-you-are instead of
     * a gap. This is the same contract `PanelShell` has always published, kept
     * here so `PanelLayout` files written against it keep working.
     */
    topbar?(): unknown
    /** Trailing controls, between the bell and the appearance drawer. */
    actions?(): unknown
    /** Account menu items when the layout family moves the user to the top bar. */
    userMenu?(props: { user: User | null }): unknown
}>()

const { chrome } = useSidebarLayout()

const page = usePage()

const hasInfoPanel = computed(() => {
    const info = (page.props as Record<string, unknown>).infoPanel

    return Boolean(info && typeof info === 'object')
})

function openInfoPanel(): void {
    openPanelInfo()
}

/**
 * The topbar MIRRORS the sidebar.
 *
 * Leaving the collapse trigger and breadcrumbs on the left while the sidebar
 * sits on the right splits the navigation across both edges - the trigger ends
 * up as far as possible from the thing it collapses. Flipping the row keeps
 * them adjacent whichever side is chosen.
 */
const { appearance } = useAppearance()

const mirrored = computed(() => appearance.value.sidebarSide === 'right')

/**
 * Static layout options first, page props second.
 *
 * A bespoke page declares its trail through defineOptions, which is evaluated
 * once at definition time. The generic resource page cannot - it does not know
 * which resource it is until the props arrive - so it ships the trail as a prop
 * instead and this falls through to it.
 */
const trail = computed<BreadcrumbItem[]>(() =>
    props.breadcrumbs.length
        ? props.breadcrumbs
        : ((page.props.breadcrumbs as BreadcrumbItem[] | undefined) ?? []),
)
</script>

<template>
    <!--
        SPACING COMES FROM justify-between, NOT FROM ml-auto ON THE SECOND GROUP.

        `ml-auto` only reads as "push to the far end" while the main axis runs
        left-to-right. Under flex-row-reverse the axis is inverted, so an auto
        LEFT margin absorbs the free space on the item's left and drags it
        toward its sibling - both groups ended up jammed into the right corner
        with the whole left half empty.

        justify-between has no handedness: it pins the first child to one edge
        and the last to the other, and reversing the row swaps which edge is
        which. That is the mirror, rather than a second hardcoded layout.
    -->
    <header
        class="bg-background/88 supports-[backdrop-filter]:bg-background/72 sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/70 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:px-6 md:px-4"
        :class="mirrored ? 'flex-row-reverse' : ''"
    >
        <div class="flex min-w-0 items-center gap-2" :class="mirrored ? 'flex-row-reverse' : ''">
            <SidebarTrigger :class="mirrored ? '-mr-1' : '-ml-1'" />
            <!-- Keep the tenant mark visible when the desktop rail is hidden;
                 a mobile header made only of utility icons has no identity. -->
            <AppLogo class="md:hidden" />
            <slot name="topbar">
                <!-- Breadcrumbs are the first thing to give up on a phone; the
                     search trigger earns that space more. -->
                <template v-if="trail.length > 0">
                    <Breadcrumbs :breadcrumbs="trail" class="hidden sm:flex" />
                </template>
            </slot>
        </div>

        <div class="flex items-center gap-2" :class="mirrored ? 'flex-row-reverse' : ''">
            <!--
                Site-header family: search, lock, and account menu live on
                SidebarSiteHeader. Repeating them here stacked a second chrome
                row that looked like a nested fake header.
            -->
            <div class="flex items-center gap-2">
                <PanelQuickCreate />
                <PanelLockButton v-if="!chrome.siteHeader" />
                <PanelCommandPalette v-if="!chrome.siteHeader" />
            </div>
            <!-- Beside search, because a question about a record is the same
                 kind of interruption as looking one up - and it opens over the
                 screen you are on rather than navigating away from it. -->
            <AssistantDrawer />
            <NotificationBell />
            <button
                v-if="hasInfoPanel"
                type="button"
                class="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-2 transition-colors"
                aria-label="Page information"
                title="Page information"
                @click="openInfoPanel"
            >
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                </svg>
            </button>
            <slot name="actions" />
            <PkBoundary
                v-if="chrome.topNavUser && !chrome.siteHeader"
                label="The account menu"
                silent
            >
                <TopNavUser>
                    <template #menu="{ user }">
                        <slot name="userMenu" :user="user">
                            <DefaultAccountMenuItems />
                        </slot>
                    </template>
                </TopNavUser>
            </PkBoundary>
            <!-- Appearance belongs where you can see what it changes. -->
            <AppearanceDrawer />
        </div>
    </header>
</template>
