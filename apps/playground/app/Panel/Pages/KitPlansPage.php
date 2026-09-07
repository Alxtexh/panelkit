<?php

declare(strict_types=1);

namespace App\Panel\Pages;

use Alxtexh\Panel\Pages\PlanSetupPage;
use App\Panel\KitDemo;
use Illuminate\Http\Request;

/**
 * Kit demo of PlanSetupPage with fake Starter / Pro / Enterprise plans.
 */
final class KitPlansPage extends PlanSetupPage
{
    protected static string $panel = 'admin';

    protected static string $icon = 'package';

    protected static ?string $group = 'Kit';

    protected static ?int $sort = 5;

    public static function label(): string
    {
        return 'Subscription plans';
    }

    public static function ability(): ?string
    {
        return null;
    }

    public static function component(): string
    {
        return 'KitPlans';
    }

    public static function heading(): string
    {
        return 'Subscription plans';
    }

    public static function description(): string
    {
        return 'Organisation-wide catalogue. Fake data; -1 is Unlimited.';
    }

    public static function plans(Request $request): array
    {
        $overrides = $request->session()->get('kit_saas_plans');

        if (! is_array($overrides)) {
            return KitDemo::saasPlans();
        }

        $plans = [];

        foreach ($overrides as $plan) {
            if (! is_array($plan)) {
                continue;
            }

            $normalised = [];

            foreach ($plan as $key => $value) {
                if (is_string($key)) {
                    $normalised[$key] = $value;
                }
            }

            $plans[] = $normalised;
        }

        return $plans;
    }

    public static function persist(array $plan): void
    {
        $id = (string) ($plan['id'] ?? '');

        if ($id === '') {
            $id = str((string) $plan['name'])->slug()->value();
            $plan['id'] = $id;
        }

        $plans = self::plans(request());
        $found = false;

        foreach ($plans as $i => $existing) {
            if ((string) ($existing['id'] ?? '') === $id) {
                $plans[$i] = array_merge($existing, $plan);
                $found = true;
                break;
            }
        }

        if (! $found) {
            $plans[] = $plan;
        }

        request()->session()->put('kit_saas_plans', $plans);
    }

    public static function forget(string $id): void
    {
        $plans = array_values(array_filter(
            self::plans(request()),
            static fn (array $plan): bool => (string) ($plan['id'] ?? '') !== $id
                && (int) ($plan['activeUsers'] ?? 0) === 0,
        ));

        request()->session()->put('kit_saas_plans', $plans);
    }
}
