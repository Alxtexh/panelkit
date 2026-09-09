<script setup lang="ts">
/**
 * Picks the shell from the user's navigation preference.
 *
 * Switching here rather than in each page is what keeps `defineOptions({ layout })`
 * unchanged across all three modes - a page declares its breadcrumbs and never
 * learns which chrome is wrapping it.
 *
 * The layout component genuinely swaps, so the page remounts when the preference
 * changes. That is the honest cost of three real layouts rather than one layout
 * with CSS trickery: the vertical and horizontal shells have different DOM, not
 * different styling.
 */
import { PkBottomNav, PkModal, useAppearance } from '@alxtexh-enterprise/panel';
import type { BottomNavItem } from '@alxtexh-enterprise/panel';
import { PanelIdleLockGuard } from '@alxtexh-enterprise/panel/inertia';
import { router, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import SessionExpired from '@/components/SessionExpired.vue';
import AppHorizontalLayout from '@/layouts/app/AppHorizontalLayout.vue';
import AppSidebarLayout from '@/layouts/app/AppSidebarLayout.vue';
import { useSidebarOpener } from '@/lib/mobileNav';
import type { BreadcrumbItem } from '@/types';

const { breadcrumbs = [] } = defineProps<{
    breadcrumbs?: BreadcrumbItem[];
}>();

const { appearance } = useAppearance();

const page = usePage();

/** Null unless somebody is wearing another account. Shared on every response. */
/**
 * The handset navigation.
 *
 * BUILT FROM THE SAME SHARED PROPS THE SIDEBAR USES, so a screen added in PHP
 * appears in both without anybody editing a Vue file - and the two can never
 * disagree about what exists or what it is called.
 *
 * IT READ ONLY `panelNav` UNTIL NOW, which meant the resources were there and
 * everything else was not: the connections workspace, mail, chat, the API
 * reference. On a handset the bottom bar IS the navigation, so a screen missing
 * from it is a screen a field technician cannot reach at all - which is the same
 * disappearing-page problem the server-side declaration was built to end, left
 * standing in the one layout that needed it most.
 *
 * Dashboard is prepended because it is not a resource and is the destination
 * people return to most.
 */
const bottomNavItems = computed<BottomNavItem[]>(() => {
    const fromProps = (key: string) =>
        ((page.props[key] as any[]) ?? [])
            // `#`-prefixed entries are client-side triggers, not destinations -
            // a bottom bar has nothing to navigate to.
            .filter((item) => !String(item.href).startsWith('#'))
            .map((item) => ({
                key: item.key ?? item.href,
                title: item.title,
                href: item.href,
                icon: item.icon,
            }));

    return [
        /*
         | THE CURRENT PANEL'S HOME, shared by the server.
         |
         | This said `/dashboard` - a FIXED path in an application that mounts
         | three portals. So inside `/platform` the sidebar's Home pointed at
         | the ADMIN dashboard: clicking it left the portal silently, and for
         | an operator who may not open that screen it refused. Every generated
         | portal had it, because they all render this layout.
         */
        {
            key: 'dashboard',
            title: 'Home',
            href:
                (page.props.panel as { home?: string } | undefined)?.home ??
                '/dashboard',
            icon: 'home',
        },
        ...fromProps('panelNav'),
        ...fromProps('panelPages'),
    ];
});

/**
 * "More" opens the SIDEBAR, not a menu of its own.
 *
 * IT USED TO NAVIGATE TO THE DASHBOARD, which is not "more" - it is somewhere
 * else. Sending somebody home when they asked to see the rest is the interface
 * answering a different question.
 *
 * THEN IT OPENED A SHEET, which was closer and still wrong. That sheet was
 * built from the same data as the sidebar and looked nothing like it: a flat
 * list, no groups, no collapse state, none of the footer links. A phone got a
 * second navigation nobody else had seen, so what a technician learned standing
 * at a pole was not what they saw at a desk. There IS a sidebar on a handset -
 * it opens as a drawer - and it is the same one.
 *
 * THE SHEET SURVIVES AS A FALLBACK for the horizontal layout, which genuinely
 * has no sidebar. `request()` answers whether anything took it.
 */
const showAllNav = ref(false);

const opener = useSidebarOpener();

function openFullNav() {
    if (!opener.request()) {
        showAllNav.value = true;
    }
}

const shell = computed(() =>
    appearance.value.sidebarSide === 'horizontal'
        ? AppHorizontalLayout
        : AppSidebarLayout,
);
/**
 * What the live region says after a navigation.
 *
 * TAKEN FROM THE DOCUMENT TITLE, which every page already sets and which is
 * exactly the sentence a screen reader announces on a full page load. Reusing it
 * means the SPA behaves like the document navigation it is imitating, rather
 * than inventing a second vocabulary for the same event.
 *
 * SET AFTER THE DOM IS SWAPPED, on Inertia's `success`, because the title is
 * only correct once the new page has rendered. Announcing on `start` would read
 * out the page being left.
 *
 * It is CLEARED and re-set rather than assigned once: a live region only speaks
 * when its content CHANGES, so navigating twice to pages with the same title
 * would be silent the second time.
 */
const announcement = ref('');

router.on('success', () => {
    announcement.value = '';

    requestAnimationFrame(() => {
        announcement.value = `${document.title} - page loaded`;
    });
});
</script>

<template>
    <div class="pk-shell relative flex h-svh flex-col overflow-hidden">
        <!--
        FIRST IN THE DOCUMENT, because that is the only position that works. A
        skip link placed anywhere else is reached after the thing it exists to
        skip.
    -->
        <a
            href="#pk-main"
            class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:border focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow-lg focus:ring-2 focus:ring-ring focus:outline-none"
        >
            Skip to content
        </a>

        <!--
        PADDING FOR THE BAR, so the last row of a table is not permanently
        underneath it. `sm:pb-0` because the bar itself disappears there.
    -->
        <div class="flex min-h-0 flex-1 flex-col overflow-hidden pb-14 sm:pb-0">
            <component :is="shell" :breadcrumbs="breadcrumbs">
                <slot />
            </component>
        </div>

        <PkBottomNav
            :items="bottomNavItems"
            :current="page.url"
            @more="openFullNav"
        />

        <!--
        EVERY DESTINATION, when four slots are not enough.

        A sheet rather than a page: "more" is a disclosure, and navigating away
        to a menu loses the page somebody was reading. It closes on selection
        because the browser is about to replace the view anyway.
    -->
        <PkModal
            v-if="showAllNav"
            :open="showAllNav"
            title="Go to"
            @close="showAllNav = false"
        >
            <nav class="flex flex-col">
                <a
                    v-for="item in bottomNavItems"
                    :key="item.key"
                    :href="item.href"
                    class="-mx-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                    :class="
                        page.url === item.href ? 'font-medium text-primary' : ''
                    "
                    >{{ item.title }}</a
                >
            </nav>

            <template #footer>
                <button
                    type="button"
                    class="text-sm text-muted-foreground hover:text-foreground"
                    @click="showAllNav = false"
                >
                    Close
                </button>
            </template>
        </PkModal>

        <!--
        SPA NAVIGATION IS SILENT to a screen reader: the URL changes, the DOM is
        replaced, and nothing is announced - so somebody who cannot see the page
        has no idea it changed. A polite live region carrying the page title is
        the standard remedy.

        `polite` rather than `assertive` because a navigation is not an
        emergency; assertive would interrupt whatever is being read mid-word.
    -->
        <div class="sr-only" role="status" aria-live="polite">
            {{ announcement }}
        </div>

        <!--
        Mounted once, for every panel page, rather than per screen.

        A stale session can be discovered on any click anywhere, so the dialog
        that reports it has to already exist wherever that click happened. It
        renders nothing until the router hook in `app.ts` trips it.
    -->
        <SessionExpired />

        <!--
        THE IDLE-LOCK GUARD BELONGS HERE FOR THE SAME REASON `SessionExpired`
        DOES: it renders nothing on its own, and it exists to catch something
        that can happen on any screen. Without it, this application's own
        `AppSidebarLayout`/`AppHorizontalLayout` never mount the composable
        that (a) shows the "Still there?" warning before the panel locks and
        (b) intercepts the 423 a background reload gets once it is locked -
        so that response fell through to Inertia's own "must receive a valid
        Inertia response" dialog instead of the lock screen.
    -->
        <PanelIdleLockGuard />
    </div>
</template>
