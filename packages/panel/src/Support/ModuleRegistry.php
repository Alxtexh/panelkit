<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Closure;

/**
 * Product modules a SaaS app declares, and which ones the current plan grants.
 *
 * THE KIT DOES NOT KNOW YOUR PRODUCT. A plan lists module keys plus numeric
 * limits (-1 = unlimited). This registry is the catalogue (key, label,
 * description, optional plan-editor limit, optional usage counter) and a grant
 * resolver the app fills from its own subscription row.
 *
 * Register from a panel provider:
 *
 *     Panel::make('admin')->modules([
 *         Module::make('accounting')->label('Accounting')->children(['double-entry']),
 *         Module::make('double-entry')->label('Double entry')->requires(['accounting']),
 *         Module::make('campaigns')
 *             ->label('Campaigns')
 *             ->planLimit(kind: 'number'),
 *         ['key' => 'storage', 'label' => 'Storage'],
 *     ]);
 *
 * Or without a panel instance: `ModuleRegistry::register([...])`.
 *
 * `moduleEnabled('campaigns')` is true when that key is granted. With no grant
 * resolver, every registered module is treated as enabled so a fresh install
 * (and the ISP playground) is not a locked box. A SaaS application MUST set
 * `grants()` from the subscriber plan or every registered module stays on:
 *
 *     ModuleRegistry::grants(fn (): array => $org->plan->moduleKeys());
 *     ModuleRegistry::caps(fn (): array => $org->plan->moduleCaps());
 *
 * Discovered screens with `protected static ?string $module = 'campaigns'`
 * 403 and drop out of the sidebar when that key is not granted. Hand-written
 * routes still use `panel.module:campaigns` (`EnsureModule`). Feature flags
 * that are not plan entitlements stay in your own config. Do not gate PanelKit
 * itself on a paid SKU.
 */
final class ModuleRegistry
{
    private const KEY = 'alxtexhpanel.modules';

    private const GRANTS = 'alxtexhpanel.module-grants';

    private const CAPS = 'alxtexhpanel.module-caps';

    /**
     * @param  list<Module|array<string, mixed>>  $modules
     */
    public static function register(array $modules): void
    {
        $existing = self::definitions();
        $byKey = [];

        foreach ([...$existing, ...array_map(self::normalize(...), $modules)] as $module) {
            $key = (string) ($module['key'] ?? '');

            if ($key === '') {
                continue;
            }

            $byKey[$key] = $module;
        }

        app()->instance(self::KEY, array_values(self::linkFamily($byKey)));
    }

    /**
     * Keys the current actor may use. Return an empty list to grant nothing.
     *
     * A SaaS MUST set this. While it is unset, every registered module is on.
     *
     * @param  Closure(): list<string>  $resolver
     */
    public static function grants(Closure $resolver): void
    {
        app()->instance(self::GRANTS, $resolver);
    }

    /**
     * Numeric (or 0/1 toggle) caps keyed by module. -1 means Unlimited.
     *
     * @param  Closure(): array<string, int|float>  $resolver
     */
    public static function caps(Closure $resolver): void
    {
        app()->instance(self::CAPS, $resolver);
    }

    public static function grantsAreSet(): bool
    {
        return app()->bound(self::GRANTS);
    }

    /**
     * Catalogue for the client and the plan editor. Closures are stripped.
     *
     * @return list<array{key: string, label: string, description: string|null, children: list<string>, requires: list<string>}>
     */
    public static function all(): array
    {
        return array_map(static fn (array $module): array => [
            'key' => (string) $module['key'],
            'label' => (string) $module['label'],
            'description' => $module['description'] ?? null,
            'children' => self::stringList($module['children'] ?? []),
            'requires' => self::stringList($module['requires'] ?? []),
        ], self::definitions());
    }

    /**
     * Perk rows for `PlanSetupPage::limits()`, from modules that declared
     * `planLimit()`.
     *
     * @return list<array{key: string, label: string, kind: string, hint?: string|null, step?: float|int}>
     */
    public static function planLimits(): array
    {
        $rows = [];

        foreach (self::definitions() as $module) {
            $kind = $module['limitKind'] ?? null;

            if (! is_string($kind) || $kind === '') {
                continue;
            }

            $row = [
                'key' => (string) $module['key'],
                'label' => (string) ($module['limitLabel'] ?? $module['label']),
                'kind' => $kind,
            ];

            if (($module['limitHint'] ?? null) !== null) {
                $row['hint'] = $module['limitHint'];
            }

            if (($module['limitStep'] ?? null) !== null) {
                $row['step'] = $module['limitStep'];
            }

            $rows[] = $row;
        }

        return $rows;
    }

    /**
     * @return list<string>
     */
    public static function granted(): array
    {
        if (! app()->bound(self::GRANTS)) {
            return array_column(self::all(), 'key');
        }

        $resolver = app()->make(self::GRANTS);
        $keys = $resolver();
        $raw = array_values(array_map('strval', is_array($keys) ? $keys : []));

        return array_values(array_filter(
            $raw,
            static fn (string $key): bool => self::parentsGranted($key, $raw),
        ));
    }

    public static function enabled(string $key): bool
    {
        return in_array($key, self::granted(), true);
    }

    /**
     * Add required parents so a plan that ticks a child also grants the parent.
     *
     * `enabled()` still refuses a child whose parent is missing from the grant
     * list. Call this from the plan editor (or `applyGrants()`) so a save does
     * not store an orphan child.
     *
     * @param  list<string>  $keys
     * @return list<string>
     */
    public static function withRequiredParents(array $keys): array
    {
        $out = [];

        foreach (array_map('strval', $keys) as $key) {
            if ($key === '') {
                continue;
            }

            foreach (self::requiredParents($key) as $parent) {
                $out[] = $parent;
            }

            $out[] = $key;
        }

        return array_values(array_unique($out));
    }

    /**
     * Expand parents, then run `onGrant` for keys that were not in `$previous`.
     *
     * PlanSetupPage::save() calls this. Apps that persist plans without that
     * page should call it from their own save path.
     *
     * @param  list<string>  $keys
     * @param  list<string>  $previous
     * @return list<string>
     */
    public static function applyGrants(mixed $org, array $keys, array $previous = []): array
    {
        $expanded = self::withRequiredParents($keys);
        $already = array_map('strval', $previous);

        foreach ($expanded as $key) {
            if (in_array($key, $already, true)) {
                continue;
            }

            $callback = self::definition($key)['onGrant'] ?? null;

            if ($callback instanceof Closure) {
                $callback($org);
            }
        }

        return $expanded;
    }

    public static function has(string $key): bool
    {
        return in_array($key, array_column(self::all(), 'key'), true);
    }

    /**
     * Cap for this module from `caps()`. -1 when no cap is configured (Unlimited).
     */
    public static function limit(string $key): int|float
    {
        if (! app()->bound(self::CAPS)) {
            return -1;
        }

        $resolver = app()->make(self::CAPS);
        $caps = $resolver();

        if (! is_array($caps) || ! array_key_exists($key, $caps)) {
            return -1;
        }

        $value = $caps[$key];

        return is_numeric($value) ? $value + 0 : -1;
    }

    /**
     * Whether current usage is still under the plan cap.
     *
     * -1 skips the usage callback (Unlimited). No `usage()` on the module also
     * counts as within limit. An ungranted key is never within limit.
     */
    public static function withinLimit(string $key): bool
    {
        if (! self::enabled($key)) {
            return false;
        }

        $limit = self::limit($key);

        if ((int) $limit === -1) {
            return true;
        }

        $kind = self::definition($key)['limitKind'] ?? 'number';

        if ($kind === 'toggle') {
            return (int) $limit !== 0;
        }

        $usage = self::usage($key);

        if ($usage === null) {
            return true;
        }

        return $usage < $limit;
    }

    public static function usage(string $key): int|float|null
    {
        $usage = self::definition($key)['usage'] ?? null;

        if (! $usage instanceof Closure) {
            return null;
        }

        $value = $usage();

        return is_numeric($value) ? $value + 0 : null;
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function definitions(): array
    {
        $bound = app()->bound(self::KEY) ? app()->make(self::KEY) : [];

        return is_array($bound) ? array_values($bound) : [];
    }

    /**
     * @return array<string, mixed>
     */
    private static function definition(string $key): array
    {
        foreach (self::definitions() as $module) {
            if ((string) ($module['key'] ?? '') === $key) {
                return $module;
            }
        }

        return [];
    }

    /**
     * @param  Module|array<string, mixed>  $module
     * @return array<string, mixed>
     */
    private static function normalize(Module|array $module): array
    {
        if ($module instanceof Module) {
            return $module->toDefinition();
        }

        $key = (string) ($module['key'] ?? '');

        return [
            'key' => $key,
            'label' => (string) ($module['label'] ?? ($key !== '' ? str($key)->headline()->value() : '')),
            'description' => $module['description'] ?? null,
            'limitKind' => $module['limitKind'] ?? $module['kind'] ?? null,
            'limitLabel' => $module['limitLabel'] ?? null,
            'limitStep' => $module['limitStep'] ?? $module['step'] ?? null,
            'limitHint' => $module['limitHint'] ?? $module['hint'] ?? null,
            'usage' => $module['usage'] ?? null,
            'children' => self::stringList($module['children'] ?? []),
            'requires' => self::stringList($module['requires'] ?? []),
            'onGrant' => $module['onGrant'] ?? null,
        ];
    }

    /**
     * @param  array<string, array<string, mixed>>  $byKey
     * @return array<string, array<string, mixed>>
     */
    private static function linkFamily(array $byKey): array
    {
        foreach ($byKey as $key => $module) {
            foreach (self::stringList($module['children'] ?? []) as $childKey) {
                if (! isset($byKey[$childKey])) {
                    continue;
                }

                $byKey[$childKey]['requires'] = array_values(array_unique([
                    ...self::stringList($byKey[$childKey]['requires'] ?? []),
                    (string) $key,
                ]));
            }

            foreach (self::stringList($module['requires'] ?? []) as $parentKey) {
                if (! isset($byKey[$parentKey])) {
                    continue;
                }

                $byKey[$parentKey]['children'] = array_values(array_unique([
                    ...self::stringList($byKey[$parentKey]['children'] ?? []),
                    (string) $key,
                ]));
            }
        }

        return $byKey;
    }

    /**
     * @param  list<string>  $granted
     */
    private static function parentsGranted(string $key, array $granted): bool
    {
        foreach (self::requiredParents($key) as $parent) {
            if (! in_array($parent, $granted, true)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return list<string>
     */
    /**
     * @param list<string> $seen
     * @return list<string>
     */
    private static function requiredParents(string $key, array $seen = []): array
    {
        if (in_array($key, $seen, true)) {
            return [];
        }

        $seen[] = $key;
        $out = [];

        foreach (self::stringList(self::definition($key)['requires'] ?? []) as $parent) {
            $out[] = $parent;
            $out = [...$out, ...self::requiredParents($parent, $seen)];
        }

        return array_values(array_unique($out));
    }

    /**
     * @return list<string>
     */
    private static function stringList(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return array_values(array_filter(
            array_map('strval', $value),
            static fn (string $item): bool => $item !== '',
        ));
    }
}
