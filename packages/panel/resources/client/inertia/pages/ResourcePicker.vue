<script setup lang="ts">
/*
 * EVERY PAGE PROP ARRIVES AS AN ATTRIBUTE, and this page's root is a
 * fragment. Inertia binds the whole payload onto the page component.
 */
defineOptions({ inheritAttrs: false })

/**
 * Table-backed picker. A dedicated page that reuses ListQuery, not a modal.
 *
 * Filament TableSelect without Livewire. The rows are the related resource's
 * table. Choosing one returns to the form with the id on the query string.
 */
import { Head, Link, router } from '@inertiajs/vue3'
import { ref } from 'vue'
import {
    PAGE_SHELL_COMPACT,
    PkButton as Button,
    PkPageHeader,
    buttonClasses,
} from '@alxtexh-enterprise/panel'
import type { SchemaColumn } from '@alxtexh-enterprise/panel'

const props = defineProps<{
    schema: {
        key: string
        label: string
        labelPlural: string
        table: { columns: SchemaColumn[] }
    }
    field: string
    chooseBase: string
    returnUrl: string
    records: Record<string, any>[]
    search: string
    breadcrumbs: { title: string; href: string }[]
}>()

const term = ref(props.search ?? '')

function runSearch(): void {
    router.get(
        window.location.pathname,
        { search: term.value, return: props.returnUrl },
        { preserveState: true, replace: true },
    )
}

function chooseHref(id: string | number): string {
    return `${props.chooseBase}/${id}?return=${encodeURIComponent(props.returnUrl)}`
}

/**
 * The row already reads as clickable (`hover:bg-muted/30`); this just makes
 * that true. SAME GUARD AS DataTable/RelationPanel's own row click: a click
 * only counts as "the row" when it hits none of the row's own controls (the
 * "Select" link itself included, so it keeps working via its own anchor
 * click without double-firing), a modifier isn't held, and there is no text
 * selection in progress.
 */
function onRowClick(id: string | number, event: MouseEvent): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
    }

    const target = event.target as HTMLElement | null

    if (target?.closest('a, button, input, select, textarea, label, [role="menuitem"]')) {
        return
    }

    if ((window.getSelection()?.toString().length ?? 0) > 0) {
        return
    }

    router.visit(chooseHref(id))
}

function cell(row: Record<string, any>, column: SchemaColumn): string {
    const value = row[column.key]

    if (value === null || value === undefined || value === '') {
        return '-'
    }

    return String(value)
}
</script>

<template>
    <Head :title="`Choose ${schema.label}`" />

    <div :class="[PAGE_SHELL_COMPACT, 'flex flex-col gap-4 pb-24']">
        <PkPageHeader
            :title="`Choose ${schema.label}`"
            purpose="A page, not a dialog. The list is the same query the related resource uses."
        >
            <template #actions>
                <Link :href="returnUrl" :class="buttonClasses({ variant: 'outline', size: 'sm' })">
                    Back
                </Link>
            </template>
        </PkPageHeader>

        <form class="flex gap-2" @submit.prevent="runSearch">
            <input
                v-model="term"
                type="search"
                class="border-input bg-background focus-visible:ring-ring h-9 min-w-0 flex-1 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
                placeholder="Search"
            />
            <Button type="submit" variant="outline" size="sm">Search</Button>
        </form>

        <div class="bg-card overflow-x-auto rounded-lg border">
            <table class="w-full text-sm">
                <thead class="bg-muted/40 text-muted-foreground text-left text-xs">
                    <tr>
                        <th
                            v-for="column in schema.table.columns"
                            :key="column.key"
                            class="px-3 py-2 font-medium"
                        >
                            {{ column.label }}
                        </th>
                        <th class="px-3 py-2 font-medium"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="records.length === 0">
                        <td
                            class="text-muted-foreground px-3 py-6 text-center"
                            :colspan="schema.table.columns.length + 1"
                        >
                            No matching records.
                        </td>
                    </tr>
                    <tr
                        v-for="row in records"
                        :key="row.id"
                        class="hover:bg-muted/30 cursor-pointer border-t"
                        @click="onRowClick(row.id, $event)"
                    >
                        <td
                            v-for="column in schema.table.columns"
                            :key="column.key"
                            class="px-3 py-2"
                        >
                            {{ cell(row, column) }}
                        </td>
                        <td class="px-3 py-2 text-right">
                            <Link :href="chooseHref(row.id)" :class="buttonClasses({ size: 'sm' })">
                                Select
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
