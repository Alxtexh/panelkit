<?php

declare(strict_types=1);

namespace App\Panel\Client\Pages;

use App\Models\Plan;
use Illuminate\Http\Request;
use Alxtexh\Panel\Pages\PlanCatalogPage as BasePlanCatalogPage;

/**
 * The client portal's subscription page - the purchase-side counterpart to
 * the read-only comparison table at `App\Panel\Client\Resources\PlanResource`.
 * That one is for browsing before asking to change; this one is for acting
 * on it directly.
 *
 * DEDUPED BY SPEED, NOT ONE CARD PER ROW. `panel:seed-reference` inserts
 * every speed tier under three interchangeable name suffixes (Home /
 * Business / Lite) at the IDENTICAL price, several times over - a raw dump
 * of that table is a wall of duplicate-looking cards with nothing to tell
 * them apart, which is a worse demonstration of this screen than a small
 * clean set of genuinely distinct tiers. `price_cents` is a pure function
 * of `speed_mbps` here, so speed is the only real distinguishing fact this
 * data actually has - the catalogue below says so honestly instead of
 * dressing up duplicates as different products.
 *
 * NO "CURRENT PLAN" HERE. Earlier revisions linked this to
 * `customers.plan_id` and marked one card current - which is a real,
 * useful pattern for a business whose plans genuinely are "one at a time,
 * upgrading replaces it" (a SaaS tier, a gym membership), but presuming it
 * universally is wrong: a lot of package-selling businesses (prepaid
 * bundles, credit top-ups) have no single "current" one at all, several can
 * be active together, and buying another doesn't replace anything. This
 * demo shows the plain, universal case - `PlanCatalogPage::subscription()`
 * stays at its base-class default (null, no summary) and no plan is marked
 * `current`. A host whose own domain genuinely has exclusive plans
 * overrides `subscription()` and marks one `current: true`, same as before.
 */
final class PlanCatalogPage extends BasePlanCatalogPage
{
    protected static string $panel = 'client';

    public static function plans(Request $request): array
    {
        $plans = [];

        foreach (Plan::query()
            ->where('is_active', true)
            ->selectRaw('MIN(id) as id, speed_mbps, price_cents')
            ->groupBy('speed_mbps', 'price_cents')
            ->orderBy('price_cents')
            ->get() as $plan) {
            $plans[] = [
                'id' => (string) $plan->id,
                'name' => "{$plan->speed_mbps} Mbps",
                'price' => $plan->price_cents / 100,
                'priceFormatted' => 'KES '.number_format($plan->price_cents / 100, 2),
                'interval' => 'month',
            ];
        }

        return $plans;
    }
}
