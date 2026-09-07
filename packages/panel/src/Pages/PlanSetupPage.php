<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Pages;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Alxtexh\Panel\Support\ModuleRegistry;

/**
 * SaaS plan catalogue: cards on the index, two-column editor for create/edit.
 *
 * OPT-IN BY SUBCLASSING. Fill `plans()`. `modules()` and `limits()` default
 * from the panel module registry (`Module::make` / `Panel::modules()`), so a
 * second hardcoded list is not required. Persist in `save()` / `destroy()`
 * against YOUR models. The Vue screen is `PlanSetup`.
 *
 * Saving expands `perks.modules` with required parent keys and runs
 * `ModuleRegistry::applyGrants()` (`onGrant` once per newly added key).
 *
 * URI DEFAULTS TO `settings/plans`. Editor mode is `?plan=new` or `?plan={id}`
 * so save/destroy can sit at `/settings/plans/save` without colliding with an
 * optional path segment.
 *
 * Generate an empty stub with `php artisan make:panel-page BillingPlans --plan-setup`,
 * then import PlanGrid / PlanEditor in the Vue file.
 */
abstract class PlanSetupPage extends Page
{
    protected static string $icon = 'package';

    public static function uri(): string
    {
        return 'settings/plans';
    }

    public static function label(): string
    {
        return 'Subscription plans';
    }

    public static function component(): string
    {
        return 'PlanSetup';
    }

    public static function actions(): array
    {
        return [
            'save' => static::ability(),
            'destroy' => static::ability(),
        ];
    }

    public static function actionUris(): array
    {
        return [
            'save' => 'save',
            'destroy' => 'destroy',
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    abstract public static function plans(Request $request): array;

    /**
     * Modules this product sells access to (key, label, description).
     *
     * Defaults to the panel registry so the plan editor and `moduleEnabled()`
     * share one list. Override only to show a subset.
     *
     * @return list<array{key: string, label: string, description?: string|null, children?: list<string>, requires?: list<string>}>
     */
    public static function modules(): array
    {
        return ModuleRegistry::all();
    }

    /**
     * Numeric (or toggle) perks on the editor. -1 means Unlimited.
     *
     * Defaults to `planLimit()` declarations on registered modules.
     *
     * @return list<array{key: string, label: string, kind: string, hint?: string|null, step?: float|int}>
     */
    public static function limits(): array
    {
        return ModuleRegistry::planLimits();
    }

    /**
     * Persist a plan payload from the editor. Override in the app.
     *
     * @param  array<string, mixed>  $plan
     */
    public static function persist(array $plan): void
    {
    }

    public static function forget(string $id): void
    {
    }

    /**
     * @return array<string, mixed>
     */
    public static function data(Request $request): array
    {
        $segment = (string) $request->query('plan', '');
        $plans = static::plans($request);
        $mode = 'index';
        $editing = null;

        if ($segment === 'new') {
            $mode = 'create';
        } elseif ($segment !== '') {
            $mode = 'edit';
            foreach ($plans as $plan) {
                if ((string) ($plan['id'] ?? '') === $segment) {
                    $editing = $plan;
                    break;
                }
            }

            abort_if($editing === null, 404);
        }

        $index = static::indexHref();

        return [
            'plans' => $plans,
            'modules' => static::modules(),
            'limits' => static::limits(),
            'mode' => $mode,
            'editing' => $editing,
            'indexHref' => $index,
            'saveHref' => $index.'/save',
            'destroyHref' => $index.'/destroy',
        ];
    }

    public static function indexHref(): string
    {
        $index = '/'.trim(static::navigationPath(), '/');
        $prefix = app(\Alxtexh\Panel\PanelManager::class)->currentPanel()?->getPath() ?? '';

        if ($prefix !== '' && $prefix !== '/') {
            $index = rtrim($prefix, '/').$index;
        }

        if (! str_starts_with($index, '/')) {
            $index = '/'.$index;
        }

        return $index;
    }

    public static function save(Request $request): RedirectResponse
    {
        $request->validate([
            'plan' => ['required', 'array'],
            'plan.id' => ['nullable', 'string', 'max:64'],
            'plan.name' => ['required', 'string', 'max:120'],
            'plan.days' => ['required', 'integer'],
            'plan.price' => ['required', 'numeric'],
        ]);

        /** @var array<string, mixed> $plan */
        $plan = $request->input('plan', []);
        $selected = $plan['perks']['modules']['value'] ?? null;

        if (is_array($selected)) {
            $previous = [];
            $id = (string) ($plan['id'] ?? '');

            if ($id !== '') {
                foreach (static::plans($request) as $existing) {
                    if ((string) ($existing['id'] ?? '') !== $id) {
                        continue;
                    }

                    $prior = $existing['perks']['modules']['value'] ?? [];
                    if (is_array($prior)) {
                        foreach ($prior as $module) {
                            $previous[] = (string) $module;
                        }
                    }
                    break;
                }
            }

            $selectedKeys = [];
            foreach ($selected as $module) {
                $selectedKeys[] = (string) $module;
            }

            $plan['perks']['modules']['value'] = ModuleRegistry::applyGrants(
                $request->user(),
                $selectedKeys,
                $previous,
            );
        }

        static::persist($plan);

        return redirect(static::indexHref())->with('success', 'Plan saved.');
    }

    public static function destroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => ['required', 'string', 'max:64'],
        ]);

        static::forget($validated['id']);

        return back()->with('success', 'Plan deleted.');
    }
}
