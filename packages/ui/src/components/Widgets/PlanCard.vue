<script setup lang="ts">
/**
 * One subscription plan: name, price, cycle, active seats, perk list, Edit/Delete.
 *
 * Visual language matches landing PkPricing: white card, quiet border,
 * featured as outline (border-primary), included checks in success not brand.
 * Persistence is the page's job.
 */
import { computed } from 'vue'
import { iconPath } from '../primitives/icons'
import PkButton from '../primitives/PkButton.vue'
import { cycleLabel, formatPerkValue, perkGranted } from './planTypes'
import type { PlanRecord } from './planTypes'

const props = withDefaults(
    defineProps<{
        plan: PlanRecord
        /** Hide delete when the plan still has subscribers. */
        canDelete?: boolean
    }>(),
    /*
     * Vue casts an absent `Boolean` prop to `false`, not `undefined` - so
     * without this default, every caller that never heard of `canDelete`
     * (which was every real one; PlanGrid never declared it to forward)
     * silently got "explicitly disabled" instead of "not overridden".
     * `plan.activeUsers > 0` below is what's actually meant to gate this.
     */
    { canDelete: true },
)

const emit = defineEmits<{
    edit: [id: string]
    delete: [id: string]
}>()

const price = computed(() => props.plan.priceFormatted ?? String(props.plan.price))

const highlighted = computed(() => Boolean(props.plan.featured || props.plan.recommended))

const perks = computed(() => {
    const data = props.plan.perks ?? {}

    return Object.entries(data).map(([key, perk]) => ({
        key,
        label: key.replace(/_/g, ' '),
        granted: perkGranted(perk.value),
        display: formatPerkValue(perk.value),
    }))
})

const extras = computed(() => props.plan.extraPerks ?? [])
</script>

<template>
    <article
        class="bg-card text-card-foreground hover:bg-muted/40 flex cursor-pointer flex-col gap-4 rounded-lg border p-6 text-left transition-colors"
        :class="highlighted ? 'border-primary shadow-sm' : ''"
        data-slot="plan-card"
        :data-featured="plan.featured ? 'true' : undefined"
        :data-recommended="plan.recommended ? 'true' : undefined"
        role="button"
        tabindex="0"
        @click="emit('edit', plan.id)"
        @keydown.enter.prevent="emit('edit', plan.id)"
    >
        <header class="flex flex-col gap-1">
            <p
                v-if="plan.recommended || plan.featured || plan.trial || plan.active === false"
                class="text-muted-foreground mb-1 flex flex-wrap gap-2 text-xs font-medium"
            >
                <span v-if="plan.recommended">Recommended</span>
                <span v-else-if="plan.featured">Featured</span>
                <span v-if="plan.trial">Trial</span>
                <span v-if="plan.active === false">Inactive</span>
            </p>
            <h3 class="text-sm font-semibold">{{ plan.name }}</h3>
            <p class="flex items-baseline gap-1">
                <span class="text-3xl font-semibold tracking-tight tabular-nums">{{ price }}</span>
                <span class="text-muted-foreground text-sm font-normal">{{
                    cycleLabel(plan.days)
                }}</span>
            </p>
            <p
                v-if="plan.shortDescription"
                class="text-muted-foreground text-sm font-normal text-pretty"
            >
                {{ plan.shortDescription }}
            </p>
            <p class="text-muted-foreground mt-1 text-xs">
                Active seats: {{ plan.activeUsers ?? 0 }}
            </p>
        </header>

        <ul class="flex flex-1 flex-col gap-2 text-sm">
            <li
                v-for="perk in perks"
                :key="perk.key"
                class="flex items-start justify-between gap-3"
            >
                <span class="flex min-w-0 items-start gap-2">
                    <span
                        class="mt-0.5 shrink-0"
                        :class="perk.granted ? 'text-success' : 'text-muted-foreground'"
                        aria-hidden="true"
                    >
                        <svg
                            v-if="perk.granted"
                            class="size-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path :d="iconPath('check')" />
                        </svg>
                        <svg
                            v-else
                            class="size-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path :d="iconPath('x')" />
                        </svg>
                    </span>
                    <span class="capitalize">{{ perk.label }}</span>
                </span>
                <span
                    v-if="perk.display"
                    class="text-muted-foreground max-w-[40%] shrink-0 text-end text-xs font-medium"
                >
                    {{ perk.display }}
                </span>
            </li>
            <li
                v-for="(extra, index) in extras"
                :key="`extra-${index}`"
                class="text-muted-foreground flex justify-between gap-3 text-sm"
            >
                <span>{{ extra.key }}</span>
                <span class="text-foreground font-medium">{{ extra.value }}</span>
            </li>
        </ul>

        <footer class="mt-auto flex gap-2 pt-2">
            <PkButton
                class="flex-1"
                variant="default"
                size="sm"
                @click.stop="emit('edit', plan.id)"
            >
                Edit
            </PkButton>
            <PkButton
                class="flex-1"
                variant="outline"
                size="sm"
                :disabled="canDelete === false || (plan.activeUsers ?? 0) > 0"
                @click.stop="emit('delete', plan.id)"
            >
                Delete
            </PkButton>
        </footer>
    </article>
</template>
