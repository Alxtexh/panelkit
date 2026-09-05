<script setup lang="ts">
/**
 * ONE subscription screen: what you have, at the top; what you could have
 * instead, below. Host props from `PlanCatalogPage`. Shaped after how
 * production Filament billing plugins actually do it (`tomatophp/filament-
 * subscriptions`' single "Billing" page; `ihor-k/subkit`'s dashboard +
 * pricing pairing) rather than two screens a customer has to find twice.
 *
 * CHOOSING A PLAN OPENS A CONFIRM MODAL, IT NEVER COLLECTS A CARD NUMBER
 * HERE. Filament's own convention is the same two-step split: a "Change
 * Subscription" modal confirms WHICH plan, then an off-site checkout page
 * collects payment. Confirming here POSTs the plan id to `checkoutHref`;
 * the server's `PlanCatalogPage::checkout()` hands it to the host's
 * checkout-session resolver and sends back an `Inertia::location()`
 * response, which the client below follows as a real navigation to
 * wherever that resolver said - a Stripe Checkout Session, a Paddle
 * transaction, or a host's own dedicated confirmation page when there is no
 * live processor yet. This screen never talks to a payment processor
 * directly.
 */
import { Head, router } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import {
    PAGE_SHELL_STACK,
    PkBadge,
    PkButton,
    PkEmptyState,
    PkModal,
    PkPageHeader,
    PlanPurchaseCard,
} from '@alxtexh-enterprise/panel'
import type { PurchasablePlan } from '@alxtexh-enterprise/panel'
import { useTranslations } from '../composables/useTranslations'

defineOptions({ inheritAttrs: false })

type SubscriptionStatus = {
    status?: string
    period_end_at?: string | null
    grace_ends_at?: string | null
}

const props = withDefaults(
    defineProps<{
        pageHeading?: string
        pageDescription?: string | null
        subscription?: SubscriptionStatus | null
        plans?: PurchasablePlan[]
        checkoutHref?: string
    }>(),
    { subscription: null, plans: () => [] },
)

const { t } = useTranslations()

/** Hidden entirely when nothing has one - a switch that changes nothing is a dead control. */
const canSwitchAnnual = computed(() => props.plans.some((plan) => plan.annualPrice !== undefined))
const annual = ref(false)

/**
 * THE SAVING IS STATED, NOT IMPLIED - matching `PkPricing`'s own marketing
 * toggle. A smaller number next to "Annual" invites the reader to work out
 * the discount themselves and get it wrong; saying it costs one badge. The
 * biggest saving across plans wins, rounded to a whole percent - a badge
 * reading "Save 19.7%" looks like a rendering bug, not a rate.
 */
const annualSavingsPercent = computed(() => {
    const savings = props.plans
        .filter((plan) => plan.annualPrice !== undefined && plan.price > 0)
        .map((plan) => 1 - plan.annualPrice! / 12 / plan.price)

    return savings.length > 0 ? Math.round(Math.max(...savings) * 100) : 0
})

const currentPlan = computed(() => props.plans.find((plan) => plan.current) ?? null)

/**
 * `past_due`/`suspended`/`canceled` are not in `PkStatusBadge`'s built-in
 * vocabulary map (that map is POS/rental/payment-flag words, not this
 * package's own billing statuses) - explicit here rather than silently
 * falling through to an unstyled default.
 */
const STATUS_TONES: Record<string, 'success' | 'warning' | 'destructive' | 'info'> = {
    active: 'success',
    past_due: 'warning',
    suspended: 'destructive',
    canceled: 'info',
    expired: 'destructive',
}

const statusTone = computed(() => STATUS_TONES[props.subscription?.status ?? ''] ?? 'info')

const statusLabel = computed(() => {
    const status = props.subscription?.status

    return status ? t(`billing.status.${status}`) : t('billing.status.fallback')
})

function formatDate(value?: string | null): string | null {
    if (!value) {
        return null
    }

    try {
        return new Date(value).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    } catch {
        return value
    }
}

const renewalDate = computed(() => formatDate(props.subscription?.period_end_at))
const graceDate = computed(() => formatDate(props.subscription?.grace_ends_at))

/** The plan awaiting confirmation in the modal - null means the modal is closed. */
const confirming = ref<PurchasablePlan | null>(null)
const processing = ref(false)

function openConfirm(id: string) {
    confirming.value = props.plans.find((plan) => plan.id === id) ?? null
}

function closeConfirm() {
    if (processing.value) {
        return
    }

    confirming.value = null
}

function confirmChoice() {
    if (!confirming.value || processing.value) {
        return
    }

    processing.value = true

    router.post(
        props.checkoutHref ?? '',
        { plan_id: confirming.value.id },
        {
            preserveScroll: true,
            onFinish: () => {
                processing.value = false
                confirming.value = null
            },
        },
    )
}

const confirmPrice = computed(() => {
    if (!confirming.value) {
        return ''
    }

    if (annual.value && confirming.value.annualPrice !== undefined) {
        return confirming.value.annualPriceFormatted ?? String(confirming.value.annualPrice)
    }

    return confirming.value.priceFormatted ?? String(confirming.value.price)
})
</script>

<template>
    <Head :title="pageHeading ?? t('billing.subscription.title')" />

    <div :class="PAGE_SHELL_STACK">
        <PkPageHeader
            :title="pageHeading ?? t('billing.subscription.title')"
            :purpose="pageDescription ?? undefined"
        />

        <!--
            THE STATUS SUMMARY, ABOVE THE PICKER. "What do I have" answered
            before "what else could I have" - the same order Filament's own
            billing page and SubKit's dashboard-then-pricing pairing use.
        -->
        <section
            v-if="subscription"
            class="bg-card flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="flex flex-col gap-1">
                <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                    {{ t('billing.subscription.current_plan') }}
                </p>
                <p class="text-lg font-semibold">
                    {{ currentPlan?.name ?? t('billing.status.fallback') }}
                </p>
                <p v-if="renewalDate" class="text-muted-foreground text-sm font-normal">
                    Renews {{ renewalDate }}
                </p>
                <p v-else-if="graceDate" class="text-muted-foreground text-sm font-normal">
                    Grace period ends {{ graceDate }}
                </p>
            </div>
            <PkBadge :variant="statusTone">{{ statusLabel }}</PkBadge>
        </section>

        <PkEmptyState v-else :title="t('billing.subscription.no_active')" icon="credit-card" />

        <div v-if="canSwitchAnnual" class="flex items-center justify-center gap-3">
            <div class="bg-background inline-flex rounded-md border p-1" role="group">
                <button
                    type="button"
                    class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                    :class="
                        !annual ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                    "
                    :aria-pressed="!annual"
                    @click="annual = false"
                >
                    {{ t('billing.subscription.monthly') }}
                </button>
                <button
                    type="button"
                    class="rounded px-3 py-1.5 text-sm font-medium transition-colors"
                    :class="annual ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'"
                    :aria-pressed="annual"
                    @click="annual = true"
                >
                    {{ t('billing.subscription.annual') }}
                </button>
            </div>
            <span v-if="annualSavingsPercent > 0" class="text-success text-xs font-semibold">
                Save {{ annualSavingsPercent }}%
            </span>
        </div>

        <PkEmptyState
            v-if="plans.length === 0"
            :title="t('billing.subscription.empty')"
            icon="package"
        />

        <div v-else class="grid gap-x-4 gap-y-6 pt-3 sm:grid-cols-2 lg:grid-cols-3">
            <PlanPurchaseCard
                v-for="plan in plans"
                :key="plan.id"
                :plan="plan"
                :annual="annual"
                @choose="openConfirm"
            />
        </div>

        <PkModal
            :open="confirming !== null"
            title="Change subscription"
            :busy="processing"
            @close="closeConfirm"
        >
            <p v-if="confirming" class="text-sm">
                You're about to switch to
                <span class="font-medium">{{ confirming.name }}</span>
                at <span class="font-medium">{{ confirmPrice }}</span
                >. You'll be sent to a secure checkout to complete payment.
            </p>

            <template #footer>
                <PkButton variant="outline" :disabled="processing" @click="closeConfirm">
                    Cancel
                </PkButton>
                <PkButton :disabled="processing" @click="confirmChoice">
                    {{ processing ? 'Redirecting…' : 'Continue to payment' }}
                </PkButton>
            </template>
        </PkModal>
    </div>
</template>
