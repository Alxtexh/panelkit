<script setup lang="ts">
/**
 * A capped resource list on the dashboard. Same DataTable as the index.
 *
 * ChartWidget type('table') is a labelled fact list. This is the resource's
 * own columns and a limited ListQuery: no pager, no selection. Echo replaces
 * poll when `table.live` is set and `window.Echo` exists.
 */
import { Deferred, Link, router, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import { DataTable, PkBadge, PkBoundary, useSchemaColumns } from '@alxtexh-enterprise/panel'
import type { SchemaColumn } from '@alxtexh-enterprise/panel'
import { useWidgetPoll } from '../../composables/useWidgetPoll'
import { formatMoney } from '../../lib/money'

export interface TableWidgetDecl {
    key: string
    label: string
    description: string | null
    span: number
    limit: number
    href: string | null
    poll?: number | null
    live?: string | null
}

interface TableWidgetValue {
    records: Record<string, unknown>[]
    columns: SchemaColumn[]
    rowKey: string
    error: boolean
}

const props = defineProps<{
    table: TableWidgetDecl
    dataKey: string
}>()

const page = usePage()

const resolved = computed(
    () => (page.props as Record<string, unknown>)[props.dataKey] as TableWidgetValue | undefined,
)

function retry() {
    router.reload({ only: [props.dataKey], preserveState: true, preserveScroll: true })
}

const schemaColumns = computed<SchemaColumn[]>(() => resolved.value?.columns ?? [])
const { columns, byKey, badgeVariant } = useSchemaColumns(schemaColumns)

const dateFormats: Record<string, Intl.DateTimeFormatOptions> = {
    date: { year: 'numeric', month: 'short', day: '2-digit' },
    datetime: {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    },
}

function displayValue(column: SchemaColumn, value: unknown, row: Record<string, unknown>): string {
    if (value === null || value === undefined || value === '') return 'None'

    if (column.type === 'money') return formatMoney(column, value, row)

    if (column.type === 'date' || column.type === 'datetime') {
        const date = new Date(String(value))

        return Number.isNaN(date.getTime())
            ? String(value)
            : date.toLocaleDateString(undefined, dateFormats[column.type])
    }

    if (column.type === 'checkbox' || column.type === 'toggle') {
        return Boolean(value) ? (column.onLabel ?? 'Enabled') : (column.offLabel ?? 'Disabled')
    }

    if (column.type === 'select' && column.options) return column.options[String(value)] ?? String(value)

    return [column.prefix, String(value), column.suffix].filter(Boolean).join(' ')
}

function shouldFormat(column: SchemaColumn): boolean {
    return ['money', 'date', 'datetime', 'badge', 'checkbox', 'toggle', 'select'].includes(column.type)
}

useWidgetPoll(
    () => [props.dataKey],
    () => props.table.poll ?? null,
    () => props.table.live ?? null,
)
</script>

<template>
    <PkBoundary :label="table.label">
        <Deferred :data="dataKey">
            <template #fallback>
                <div
                    class="@container/table pk-surface min-w-0 rounded-lg"
                    aria-busy="true"
                >
                    <div class="border-b px-4 py-3">
                        <h2 class="pk-section-heading">{{ table.label }}</h2>
                    </div>
                    <DataTable
                        :columns="[]"
                        :rows="[]"
                        :selectable="false"
                        :framed="false"
                        loading
                        empty-title="Loading"
                    />
                </div>
            </template>

            <template #default>
                <div
                    class="@container/table pk-surface min-w-0 rounded-lg"
                    :aria-busy="resolved ? 'false' : 'true'"
                >
                    <div class="flex items-center justify-between gap-3 border-b px-4 py-3">
                        <div class="min-w-0">
                            <h2 class="pk-section-heading">{{ table.label }}</h2>
                            <p
                                v-if="table.description"
                                class="text-muted-foreground truncate text-xs"
                            >
                                {{ table.description }}
                            </p>
                        </div>
                        <Link
                            v-if="table.href"
                            :href="table.href"
                            class="pk-focus-ring text-muted-foreground shrink-0 rounded text-xs hover:text-foreground hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <div
                        v-if="resolved?.error"
                        class="flex items-center justify-between gap-3 p-4 text-sm"
                        role="alert"
                    >
                        <span class="text-destructive">This list could not be loaded.</span>
                        <button
                            type="button"
                            class="text-foreground hover:bg-accent shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
                            @click="retry"
                        >
                            Try again
                        </button>
                    </div>
                    <DataTable
                        v-else
                        :columns="columns"
                        :rows="resolved?.records ?? []"
                        :row-key="resolved?.rowKey ?? 'id'"
                        :selectable="false"
                        :framed="false"
                        :empty-title="`No ${table.label.toLowerCase()} yet`"
                    >
                        <template
                            v-for="column in schemaColumns"
                            v-slot:[`cell:${column.key}`]="slotProps"
                        >
                            <PkBadge
                                v-if="column.type === 'badge'"
                                :variant="badgeVariant(column.key, slotProps.value) as any"
                                class="capitalize"
                            >
                                {{ column.options?.[String(slotProps.value)] ?? String(slotProps.value ?? 'None') }}
                            </PkBadge>
                            <span v-else-if="shouldFormat(column)" class="tabular-nums">
                                {{ displayValue(byKey[column.key] ?? column, slotProps.value, slotProps.row) }}
                            </span>
                            <template v-else>{{ slotProps.value }}</template>
                        </template>
                    </DataTable>
                </div>
            </template>
        </Deferred>
    </PkBoundary>
</template>
