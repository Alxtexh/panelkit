<?php

declare(strict_types=1);

namespace App\Panel;

use Closure;

/**
 * What another part of this application contributes to the dashboard.
 *
 * THE SAME SEAM `HelpCentre::add()` AND `SettingsIndex::add()` ALREADY USE, for
 * the same reason: the dashboard belongs to the STARTER, and the ISP
 * demonstration needs to put things on it without the starter's page importing
 * a single demo class. Without this, `DashboardPage` names `Client`, `Router`
 * and `ClientSession` - and deleting `app/Demo` takes the dashboard with it.
 *
 * IT IS AN APPLICATION SEAM, NOT A PACKAGE ONE, and that is deliberate.
 * `Panel::widgets()` already lets a PACKAGE contribute stats and charts, and
 * the demo's widgets go through it. What the package has no seam for is
 * FILTER DIMENSIONS - `DashboardPage::filterDimensions()` is a static on the
 * page - so the router filter would have been the one thing the fence could not
 * give back. Rather than push a new extension point into the package for one
 * application's benefit, the application declares its own.
 *
 * CLOSURES, NOT VALUES. Everything here is resolved per request: a dimension
 * lists the routers that exist right now, and a stat counts rows. Registering
 * resolved values in a provider would compute them during boot, on every
 * request, including the ones that never open the dashboard.
 */
final class DashboardExtras
{
    /** @var list<Closure(): list<array<string, mixed>>> */
    private static array $dimensions = [];

    /** @var list<Closure(): list<mixed>> */
    private static array $stats = [];

    /** @var list<Closure(): list<mixed>> */
    private static array $charts = [];

    /** @var list<Closure(): array<int|string, array<string, mixed>>> */
    private static array $strips = [];

    /** @var list<Closure(): array<string, mixed>> */
    private static array $shortcuts = [];

    /** @param Closure(): array<string, mixed> $shortcuts */
    public static function shortcutsCatalog(Closure $shortcuts): void
    {
        self::$shortcuts[] = $shortcuts;
    }

    /**
     * @return array<string, mixed>
     */
    public static function shortcuts(): array
    {
        $out = ['catalog' => [], 'defaults' => []];

        foreach (self::$shortcuts as $resolve) {
            $chunk = $resolve();
            $out['catalog'] = [...$out['catalog'], ...($chunk['catalog'] ?? [])];
            $out['defaults'] = [...$out['defaults'], ...($chunk['defaults'] ?? [])];
            $out['storageKey'] = $chunk['storageKey'] ?? ($out['storageKey'] ?? 'panel.dashboard.shortcuts');
        }

        return $out;
    }

    private static ?Closure $strip = null;

    private static ?string $stripAbility = null;

    /** @param Closure(): list<array<string, mixed>> $dimensions */
    public static function dimensions(Closure $dimensions): void
    {
        self::$dimensions[] = $dimensions;
    }

    /** @param Closure(): list<mixed> $stats */
    public static function stats(Closure $stats): void
    {
        self::$stats[] = $stats;
    }

    /** @param Closure(): list<mixed> $charts */
    public static function charts(Closure $charts): void
    {
        self::$charts[] = $charts;
    }

    /**
     * THE SINGLE ROW ABOVE THE WIDGETS - one, not many.
     *
     * `DashboardPage::strip()` returns ONE callable, so this cannot be a list.
     * Registering a second replaces the first, which is the honest behaviour:
     * silently rendering only one of two registered strips would be worse than
     * the last registration winning visibly.
     *
     * @param  Closure(\Alxtexh\Panel\Widgets\DashboardFilters, \DateTimeImmutable, string): array<string, mixed>  $strip
     */
    public static function useStrip(Closure $strip, ?string $ability = null): void
    {
        self::$strip = $strip;
        self::$stripAbility = $ability;
    }

    /** @param Closure(): array<int|string, array<string, mixed>> $strips */
    public static function addStrips(Closure $strips): void
    {
        self::$strips[] = $strips;
    }

    public static function strip(): ?Closure
    {
        return self::$strip;
    }

    public static function stripAbility(): ?string
    {
        return self::$stripAbility;
    }

    /** @return list<array<string, mixed>> */
    public static function allStrips(): array
    {
        $out = [];

        foreach (self::$strips as $resolve) {
            foreach ($resolve() as $strip) {
                $out[] = $strip;
            }
        }

        return $out;
    }

    /** @return list<array<string, mixed>> */
    public static function allDimensions(): array
    {
        return self::resolve(self::$dimensions);
    }

    /** @return list<mixed> */
    public static function allStats(): array
    {
        return self::resolve(self::$stats);
    }

    /** @return list<mixed> */
    public static function allCharts(): array
    {
        return self::resolve(self::$charts);
    }

    /**
     * REGISTRATIONS ARE CLEARED BETWEEN TESTS by the same call that clears the
     * panel's own memos, because a static list appended to on every boot grows
     * for the life of the process - the leak `PanelRoutes::EXTENSIONS`
     * documents, which turned a forty-eight second suite into four minutes.
     */
    public static function flush(): void
    {
        self::$dimensions = [];
        self::$stats = [];
        self::$charts = [];
        self::$strips = [];
        self::$shortcuts = [];
        self::$strip = null;
        self::$stripAbility = null;
    }

    /**
     * @param  list<Closure(): list<mixed>>  $registered
     * @return list<mixed>
     */
    private static function resolve(array $registered): array
    {
        $out = [];

        foreach ($registered as $resolve) {
            foreach ($resolve() as $item) {
                $out[] = $item;
            }
        }

        return $out;
    }
}
