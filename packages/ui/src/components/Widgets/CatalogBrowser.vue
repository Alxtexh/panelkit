<script setup lang="ts">
/**
 * A merchandising page: tabs, search, a Filters sheet, Tiles/List, pagination.
 *
 * DATA IS YOURS. Pass tabs (products, units, listings). Selecting a tile
 * emits `select`; the page visits the dedicated item route.
 */
import { computed, ref, watch } from 'vue'
import { PAGE_SHELL } from '../../lib/pageShell'
import PkHeading from '../primitives/PkHeading.vue'
import PkTextInput from '../primitives/PkTextInput.vue'
import type { CatalogItem } from './CatalogCard.vue'
import { catalogFiltersActive, emptyCatalogFilters, matchCatalogItem } from './catalogFilter'
import type { CatalogFacet, CatalogFilters } from './catalogFilter'
import CatalogFilterSheet from './CatalogFilterSheet.vue'
import CatalogGrid from './CatalogGrid.vue'

export interface CatalogBrowserTab {
    key: string
    label: string
    items: CatalogItem[]
    facets?: CatalogFacet[]
    searchPlaceholder?: string
    filterTitle?: string
}

const props = withDefaults(
    defineProps<{
        title?: string
        description?: string | null
        tabs: CatalogBrowserTab[]
        pageSize?: number
        embedded?: boolean
    }>(),
    {
        title: 'Catalog',
        description: null,
        pageSize: 8,
        embedded: true,
    },
)

const emit = defineEmits<{
    select: [key: string]
    cart: [key: string]
}>()

const tabKey = ref(props.tabs[0]?.key ?? '')
const layout = defineModel<'grid' | 'list'>('layout', { default: 'grid' })
const filterState = ref<Record<string, CatalogFilters>>({})
const sheetOpen = ref(false)

watch(
    () => props.tabs.map((tab) => tab.key).join(','),
    (keys) => {
        if (!keys.split(',').includes(tabKey.value)) {
            tabKey.value = props.tabs[0]?.key ?? ''
        }
    },
)

function filtersFor(key: string): CatalogFilters {
    return filterState.value[key] ?? emptyCatalogFilters()
}

const activeTab = computed(
    () => props.tabs.find((tab) => tab.key === tabKey.value) ?? props.tabs[0] ?? null,
)

const activeFilters = computed(() =>
    activeTab.value ? filtersFor(activeTab.value.key) : emptyCatalogFilters(),
)

const visibleItems = computed(() => {
    const tab = activeTab.value

    if (!tab) {
        return []
    }

    return tab.items.filter((item) => matchCatalogItem(item, filtersFor(tab.key)))
})

function setQuery(value: string): void {
    const key = activeTab.value?.key

    if (!key) {
        return
    }

    filterState.value = {
        ...filterState.value,
        [key]: { ...filtersFor(key), query: value },
    }
}

function clearFilters(): void {
    const key = activeTab.value?.key

    if (!key) {
        return
    }

    filterState.value = { ...filterState.value, [key]: emptyCatalogFilters() }
}

function applyFilters(next: CatalogFilters): void {
    const key = activeTab.value?.key

    if (!key) {
        return
    }

    filterState.value = { ...filterState.value, [key]: next }
    sheetOpen.value = false
}
</script>

<template>
    <div class="flex w-full flex-col gap-8" :class="embedded ? '' : PAGE_SHELL">
        <PkHeading :title="title" :description="description ?? undefined" />

        <div
            v-if="tabs.length > 1"
            class="inline-flex w-fit rounded-md border"
            role="tablist"
            aria-label="Catalog section"
        >
            <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                class="rounded px-3 py-1.5 text-sm transition-colors"
                :class="
                    tabKey === tab.key
                        ? 'bg-foreground text-background font-semibold shadow-sm ring-2 ring-primary/30'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                "
                role="tab"
                :aria-selected="tabKey === tab.key ? 'true' : 'false'"
                @click="tabKey = tab.key"
            >
                {{ tab.label }}
            </button>
        </div>

        <div
            class="flex flex-wrap items-center gap-2 sm:flex-nowrap"
            data-slot="catalog-page-toolbar"
        >
            <PkTextInput
                class="min-w-0 w-full flex-1 sm:max-w-xs"
                :model-value="activeFilters.query"
                type="search"
                :placeholder="activeTab?.searchPlaceholder ?? 'Search…'"
                :aria-label="activeTab?.searchPlaceholder ?? 'Search'"
                @update:model-value="setQuery(String($event))"
            />
            <button
                v-if="catalogFiltersActive(activeFilters)"
                type="button"
                class="text-muted-foreground hover:text-foreground shrink-0 text-xs hover:underline"
                @click="clearFilters"
            >
                Clear
            </button>
            <button
                v-if="(activeTab?.facets ?? []).length > 0"
                type="button"
                class="relative inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                @click="sheetOpen = true"
            >
                <svg
                    viewBox="0 0 24 24"
                    class="size-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M3 5h18M6 12h12M10 19h4" />
                </svg>
                Filters
                <span
                    v-if="catalogFiltersActive(activeFilters)"
                    class="bg-primary text-primary-foreground ml-0.5 rounded-full px-1.5 text-[10px] font-semibold"
                >
                    on
                </span>
            </button>
            <div
                class="ml-auto inline-flex shrink-0 rounded-md border"
                role="group"
                aria-label="Layout"
            >
                <button
                    type="button"
                    class="px-2.5 py-1.5 text-xs transition-colors"
                    :class="
                        layout === 'grid' ? 'bg-foreground text-background' : 'hover:bg-muted/60'
                    "
                    :aria-pressed="layout === 'grid' ? 'true' : 'false'"
                    aria-label="Grid"
                    @click="layout = 'grid'"
                >
                    Tiles
                </button>
                <button
                    type="button"
                    class="px-2.5 py-1.5 text-xs transition-colors"
                    :class="
                        layout === 'list' ? 'bg-foreground text-background' : 'hover:bg-muted/60'
                    "
                    :aria-pressed="layout === 'list' ? 'true' : 'false'"
                    aria-label="List"
                    @click="layout = 'list'"
                >
                    List
                </button>
            </div>
        </div>

        <CatalogGrid
            v-model:layout="layout"
            :page-size="pageSize"
            :items="visibleItems"
            @select="emit('select', $event)"
            @cart="emit('cart', $event)"
        />
    </div>

    <CatalogFilterSheet
        :open="sheetOpen"
        :title="activeTab?.filterTitle ?? 'Filters'"
        :search-placeholder="activeTab?.searchPlaceholder ?? 'Search…'"
        :facets="activeTab?.facets ?? []"
        :applied="activeFilters"
        @close="sheetOpen = false"
        @apply="applyFilters"
        @reset="clearFilters"
    />
</template>
