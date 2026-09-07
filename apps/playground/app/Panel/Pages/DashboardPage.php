<?php

declare(strict_types=1);

namespace App\Panel\Pages;

use Alxtexh\Panel\Pages\DashboardPage as AlxtexhpanelDashboard;
use Alxtexh\Panel\Widgets\StatWidget;
use Alxtexh\Panel\Widgets\TableWidget;
use App\Demo\Panel\Resources\ClientResource;
use App\Demo\Panel\Resources\RouterResource;
use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use App\Panel\DashboardExtras;
use App\Panel\Resources\PlanResource;

/**
 * The dashboard a copy of this application starts with.
 *
 * IT COUNTS WHAT EVERY DASHBOARD HAS - people, plans, organisations - and
 * nothing else. The ISP demonstration's sixteen widgets, its router filter and
 * its two strips used to live here, which meant this file named `Client`,
 * `Router` and `ClientSession` and the README's "replaces the data" began with
 * deleting most of an 893-line page.
 *
 * WHAT MOVED AND WHY IT COULD. `App\Demo\Panel\DemoDashboard` now holds every
 * ISP widget and the private helpers they need - the router scope, the rollup
 * wiring, the cross-tabs - and contributes them through `DashboardExtras`. The
 * dependency runs one way: the demo knows about this page, and this page knows
 * nothing about the demo.
 *
 * THE MERGE IS WHY THE DEMO LOSES NOTHING. Everything the ISP dashboard showed
 * it still shows, because stats, charts, the filter dimension and both strips
 * are all contributed rather than removed. Deleting `app/Demo` leaves the three
 * counters below and a working screen.
 *
 * A STARTER DASHBOARD THAT SHOWED NOTHING WOULD BE THE WRONG ANSWER. An empty
 * panel after `migrate:fresh` reads as broken rather than as new - which is the
 * failure a previous session produced by gating screens off, and the reason
 * these three counters are here rather than left for the copier to write.
 */
final class DashboardPage extends AlxtexhpanelDashboard
{
    protected static string $panel = 'admin';

    /*
     * GET STARTED is the kit card on PanelDashboard (`onboarding` page prop
     * from the parent `data()`). Demo widgets do not replace it. It hides
     * after skip/complete via cookie `panel_onboarding_done` and
     * `appearance.onboardingDone`. Clear those to see the card again.
     *
     * The ops Setup checklist is suppressed while this guide is open so the
     * dashboard does not show two SetupChecklist cards at once.
     */

    protected static ?int $sort = -100;

    public static function infoPanel(): array
    {
        return [
            'title' => 'Dashboard guide',
            'description' => 'Use this overview to monitor the panel and jump into the work that needs attention.',
            'sections' => [
                [
                    'heading' => 'Live widgets',
                    'body' => 'Cards and charts load independently, so a slow network or reporting query does not block the rest of the dashboard.',
                ],
                [
                    'heading' => 'Personalise the view',
                    'body' => 'Use Shortcuts to keep frequent actions close, and use Rearrange widgets to set the order that suits your team.',
                ],
                [
                    'heading' => 'Need more detail?',
                    'body' => 'Open the linked resource from a table card to use its filters, saved views, bulk actions, and permission-aware exports.',
                ],
            ],
        ];
    }

    /**
     * @return list<StatWidget>
     */
    public static function stats(): array
    {
        $contributed = DashboardExtras::allStats();

        /*
         * THE THREE COUNTERS STEP ASIDE ONCE A DOMAIN ARRIVES.
         *
         * They exist so a stripped starter is not an empty screen - an empty
         * dashboard after `migrate:fresh` reads as broken rather than as new.
         * They are not meant to sit above somebody's real figures: the ISP
         * demonstration already counts its subscribers, and a copier who has
         * added their own will not want People/Plans/Organisations wedged in
         * front of them.
         *
         * So this is a FALLBACK, not a header. Contribute anything and it
         * disappears, which also keeps the demo's dashboard exactly as it was
         * before the domain was fenced.
         */
        if ($contributed !== []) {
            return $contributed;
        }

        return [
            StatWidget::make('users_total', 'People')
                ->description('Accounts in this organisation')
                ->value(static fn (): int => User::query()->count()),

            StatWidget::make('plans_total', 'Plans')
                ->description('Offered right now')
                ->value(static fn (): int => Plan::query()->where('is_active', true)->count()),

            /*
             * ORGANISATIONS IS A CENTRAL COUNT, so it deliberately steps
             * outside the tenant scope - "how many organisations exist" is not
             * a question about one of them. It is the only figure on this page
             * that does, which is why it says so here.
             */
            StatWidget::make('tenants_total', 'Organisations')
                ->description('Across the installation')
                ->value(static fn (): int => Tenant::query()->count()),
        ];
    }

    /**
     * @return list<\Alxtexh\Panel\Widgets\ChartWidget>
     */
    public static function charts(): array
    {
        return DashboardExtras::allCharts();
    }

    /**
     * Capped lists so full dashboard DnD has table widgets to rearrange.
     *
     * @return list<TableWidget>
     */
    public static function tables(): array
    {
        return [
            TableWidget::make('recent_clients', 'Recent clients')
                ->resource(ClientResource::class)
                ->description('Newest subscribers')
                ->limit(5)
                ->span(2),

            TableWidget::make('recent_routers', 'Routers')
                ->resource(RouterResource::class)
                ->description('Network edge')
                ->limit(5),

            TableWidget::make('plans_list', 'Plans')
                ->resource(PlanResource::class)
                ->description('Catalogue')
                ->limit(5),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function filterDimensions(): array
    {
        return DashboardExtras::allDimensions();
    }

    public static function strip(): ?callable
    {
        return DashboardExtras::strip();
    }

    public static function stripAbility(): ?string
    {
        return DashboardExtras::stripAbility();
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function strips(): array
    {
        return DashboardExtras::allStrips();
    }

    /**
     * @return array<string, mixed>
     */
    public static function shortcuts(): array
    {
        return DashboardExtras::shortcuts();
    }
}
