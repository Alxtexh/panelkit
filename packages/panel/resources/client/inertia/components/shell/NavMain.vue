<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@alxtexh-enterprise/panel'
import { toUrl } from '@alxtexh-enterprise/panel'
import { useCurrentUrl } from '../../composables/useCurrentUrl'
import type { NavItem } from '../../types'

defineProps<{
    /**
     * Heading above the items.
     *
     * Optional because the sidebar renders its own group headings now - a
     * hardcoded 'Platform' inside each one repeated the label under every
     * group.
     */
    label?: string
    items: NavItem[]
    /**
     * Render as children of a group heading rather than as top-level entries.
     *
     * THE ICON BELONGS TO THE GROUP, NOT TO EACH CHILD. An icon per item inside
     * a group is four or five glyphs stacked vertically, none of which
     * distinguishes anything - "Active Clients", "Clients", "IP Bindings" and
     * "Leads" are all subscriber things, so four subscriber-ish icons carry no
     * information and just make the column noisy. One icon on the heading says
     * what the whole group is; the children only need to be legible and to look
     * subordinate.
     *
     * The connecting line and dots do the work the icons were failing to do:
     * they show these items belong to the heading above them, which is the only
     * thing a reader needs from this level.
     */
    nested?: boolean
}>()

const emit = defineEmits<{ (e: 'navigate'): void }>()

const { isCurrentUrl } = useCurrentUrl()
</script>

<template>
    <SidebarGroup class="px-2 py-0">
        <SidebarGroupLabel v-if="label">{{ label }}</SidebarGroupLabel>

        <!--
            NESTED: plain indented rows, no rail and no dot.
            A dot-and-rail read as decoration competing with the highlight
            for attention on the one signal that matters here - which of
            these is the current page. Indentation alone still says "these
            belong to the heading above them"; it does not also need a line
            drawn to prove it, and dropping the line is what lets the active
            row's own rounded highlight read clearly instead of sitting on
            top of a rail that has to break around it.
        -->
        <SidebarMenu v-if="nested" class="gap-0.5">
            <SidebarMenuItem v-for="item in items" :key="item.title">
                <a
                    v-if="item.external"
                    :href="toUrl(item.href)"
                    class="relative flex items-center gap-2.5 rounded-md py-1.5 pr-2 pl-8 text-sm transition-colors"
                    @click="emit('navigate')"
                    :aria-current="isCurrentUrl(item.href) ? 'page' : undefined"
                    :class="
                        isCurrentUrl(item.href)
                            ? 'bg-primary/10 font-medium text-primary'
                            : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    "
                >
                    <span class="truncate">{{ item.title }}</span>
                    <span
                        v-if="item.badge != null && item.badge !== ''"
                        class="bg-sidebar-accent text-sidebar-accent-foreground ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums"
                    >
                        {{ item.badge }}
                    </span>
                </a>
                <Link
                    v-else
                    :href="item.href"
                    prefetch="hover"
                    cache-for="30s"
                    class="relative flex items-center gap-2.5 rounded-md py-1.5 pr-2 pl-8 text-sm transition-colors"
                    @click="emit('navigate')"
                    :aria-current="isCurrentUrl(item.href) ? 'page' : undefined"
                    :class="
                        isCurrentUrl(item.href)
                            ? 'bg-primary/10 font-medium text-primary'
                            : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    "
                >
                    <span class="truncate">{{ item.title }}</span>
                    <span
                        v-if="item.badge != null && item.badge !== ''"
                        class="bg-sidebar-accent text-sidebar-accent-foreground ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums"
                    >
                        {{ item.badge }}
                    </span>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>

        <!-- Top level: no heading above it, so each item carries its own icon. -->
        <SidebarMenu v-else>
            <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton
                    as-child
                    :is-active="isCurrentUrl(item.href)"
                    :tooltip="item.title"
                >
                    <!--
                        PREFETCHED ON HOVER. Inertia fetches the page while the
                        pointer is still travelling to the link, so the click
                        lands on data that has already arrived - most of the
                        perceived navigation budget, for one attribute.

                        `hover` rather than `mount`: prefetching every nav item
                        on page load would issue a dozen requests for pages
                        nobody asked for, which is slower overall and looks like
                        a polling bug in the network tab.
                    -->
                    <!--
                        `aria-current="page"` is what tells a screen reader WHICH
                        item is the one you are on. Colour and weight say it to
                        everybody else and say nothing at all here.
                    -->
                    <a
                        v-if="item.external"
                        :href="toUrl(item.href)"
                        :aria-current="isCurrentUrl(item.href) ? 'page' : undefined"
                        @click="emit('navigate')"
                    >
                        <component :is="item.icon" />
                        <span>{{ item.title }}</span>
                    </a>
                    <Link
                        v-else
                        :href="item.href"
                        prefetch="hover"
                        cache-for="30s"
                        :aria-current="isCurrentUrl(item.href) ? 'page' : undefined"
                        @click="emit('navigate')"
                    >
                        <component :is="item.icon" />
                        <span>{{ item.title }}</span>
                    </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge v-if="item.badge != null && item.badge !== ''">
                    {{ item.badge }}
                </SidebarMenuBadge>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarGroup>
</template>
