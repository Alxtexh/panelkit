<script setup lang="ts">
/**
 * The actions available on one record, inline in the row.
 *
 * OPT-IN COUNTERPART TO `RecordActions.vue` - a table renders this one only
 * when it called `Table::inlineRecordActions()`. Filament's own DEFAULT is
 * exactly this shape: a bare action is a text link in the row, and only an
 * action a resource explicitly wrapped in `ActionGroup` collapses into a
 * dropdown. `RecordActions.vue`'s own doc comment used to cite that
 * behaviour as the reason to collapse EVERYTHING - which was true of
 * `ActionGroup` specifically and not of Filament's default, so a table that
 * wants Filament's actual look now has a way to ask for it without
 * reversing the kebab-only default everything else keeps.
 *
 * ONE UNLABELLED ACTION RENDERS INLINE; A LABELLED `ActionGroup` STILL
 * COLLAPSES. Nothing about how a resource declares its actions changes -
 * `recordActionSchema()` already produced `{label?, actions}` groups before
 * this component existed. This is a new CONSUMER of the `label` field the
 * kebab renderer already received and discarded, not a new PHP concept.
 *
 * NO SECOND MOBILE SURFACE. The kebab-only default exists partly because a
 * narrow row cannot fit inline text without wrapping or truncating past
 * recognition, so below `sm` this component defers entirely to
 * `RecordActions.vue` (`sm:hidden`) instead of inventing its own collapse -
 * one real menu, not two behaving slightly differently. Its `openContextMenu`
 * is re-exposed here too, so right-click still opens the full menu even
 * while its own trigger sits hidden on a wide viewport.
 *
 * KEY BINDINGS STAY SCOPED TO THE OPEN KEBAB MENU (`RecordAction::keyBindings()`,
 * `RecordActions.vue`'s `onMenuKeydown`). An inline button is already one
 * click away with no menu to open first, so there is nothing here for a
 * binding to shortcut past.
 */
import { computed, ref } from 'vue'
import { iconPath, resolveActionIcon } from '../primitives/icons'
import PkDropdown from '../primitives/PkDropdown.vue'
import RecordActions from './RecordActions.vue'
import type { RecordActionGroup, RecordActionItem } from './RecordActions.vue'

const props = withDefaults(
    defineProps<{
        groups: RecordActionGroup[]
        title: string
        busy?: string | null
    }>(),
    { busy: null },
)

const emit = defineEmits<{
    (e: 'run', action: RecordActionItem): void
}>()

const fallback = ref<InstanceType<typeof RecordActions> | null>(null)

/** A bare `RecordAction` becomes a one-item, label-less group - see PHP's `recordActionSchema()`. */
const standaloneGroups = computed(() => props.groups.filter((g) => !g.label))
const dropdownGroups = computed(() => props.groups.filter((g) => g.label))

const standalone = computed(() => standaloneGroups.value.flatMap((g) => g.actions))
const standaloneOrdinary = computed(() => standalone.value.filter((a) => !a.destructive))
const standaloneDestructive = computed(() => standalone.value.filter((a) => a.destructive))

const isEmpty = computed(() => props.groups.every((g) => g.actions.length === 0))

const TONES: Record<string, string> = {
    primary: 'text-primary',
    gray: 'text-muted-foreground',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-500',
    danger: 'text-destructive',
    info: 'text-sky-600 dark:text-sky-400',
}

function tone(action: RecordActionItem): string {
    return TONES[action.color ?? 'gray'] ?? TONES.gray
}

function run(action: RecordActionItem) {
    emit('run', action)
}

/**
 * Only ever wired to the non-link button below - a link action renders as a
 * real `<a href>` and needs no click handler of its own, so `action.link`
 * cannot be true here. Named separately from `run()` anyway so the busy
 * guard has a home that reads as "the click handler", not as the emit.
 */
function clickAction(action: RecordActionItem) {
    if (props.busy === action.key) {
        return
    }

    run(action)
}

function openContextMenu(event: MouseEvent) {
    if (isEmpty.value) {
        return
    }

    fallback.value?.openContextMenu(event)
}

defineExpose({ openContextMenu })
</script>

<template>
    <div class="flex items-center justify-end gap-1">
        <div class="hidden items-center gap-1 sm:flex">
            <template
                v-for="action in [...standaloneOrdinary, ...standaloneDestructive]"
                :key="action.key"
            >
                <a
                    v-if="action.link"
                    :href="action.url ?? '#'"
                    class="hover:bg-accent inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors"
                    :class="tone(action)"
                >
                    <svg
                        class="size-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path :d="resolveActionIcon(action)" />
                    </svg>
                    <span>{{ action.label }}</span>
                </a>

                <button
                    v-else
                    type="button"
                    class="hover:bg-accent inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors disabled:pointer-events-none disabled:opacity-50"
                    :class="tone(action)"
                    :disabled="busy === action.key"
                    @click="clickAction(action)"
                >
                    <svg
                        class="size-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                        :class="busy === action.key && 'animate-pulse'"
                    >
                        <path :d="resolveActionIcon(action)" />
                    </svg>
                    <span>{{ action.label }}</span>
                </button>
            </template>

            <!-- A labelled ActionGroup still collapses - grouping stays the tool it already was. -->
            <PkDropdown
                v-for="group in dropdownGroups"
                :key="group.label"
                align="end"
                placement="left"
            >
                <template #trigger>
                    <button
                        type="button"
                        class="text-muted-foreground hover:bg-accent hover:text-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors"
                        aria-haspopup="menu"
                    >
                        <svg
                            v-if="group.icon"
                            class="size-3.5 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path :d="iconPath(group.icon)" />
                        </svg>
                        <span>{{ group.label }}</span>
                    </button>
                </template>

                <template #panel>
                    <div class="py-0.5">
                        <template
                            v-for="action in [
                                ...group.actions.filter((a) => !a.destructive),
                                ...group.actions.filter((a) => a.destructive),
                            ]"
                            :key="action.key"
                        >
                            <a
                                v-if="action.link"
                                :href="action.url ?? '#'"
                                role="menuitem"
                                class="hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none"
                                :class="action.destructive ? 'text-destructive' : tone(action)"
                            >
                                <svg
                                    class="size-4 shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                >
                                    <path :d="resolveActionIcon(action)" />
                                </svg>
                                <span class="min-w-0 flex-1 truncate">{{ action.label }}</span>
                            </a>

                            <button
                                v-else
                                type="button"
                                role="menuitem"
                                class="hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                                :class="
                                    action.destructive
                                        ? 'text-destructive hover:bg-destructive/10 focus:bg-destructive/10'
                                        : tone(action)
                                "
                                :disabled="busy === action.key"
                                @click="run(action)"
                            >
                                <svg
                                    class="size-4 shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    aria-hidden="true"
                                    :class="busy === action.key && 'animate-pulse'"
                                >
                                    <path
                                        :d="
                                            resolveActionIcon({
                                                ...action,
                                                destructive: action.destructive,
                                            })
                                        "
                                    />
                                </svg>
                                <span class="min-w-0 flex-1 truncate">{{ action.label }}</span>
                            </button>
                        </template>
                    </div>
                </template>
            </PkDropdown>
        </div>

        <RecordActions
            ref="fallback"
            class="sm:hidden"
            :groups="groups"
            :title="title"
            :busy="busy"
            @run="(action) => emit('run', action)"
        />
    </div>
</template>
