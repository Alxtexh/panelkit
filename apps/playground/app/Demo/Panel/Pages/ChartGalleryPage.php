<?php

declare(strict_types=1);

namespace App\Demo\Panel\Pages;

use App\Demo\Panel\DemoDashboard;
use Illuminate\Http\Request;
use Alxtexh\Panel\Pages\Page;

/**
 * Every chart renderer PanelKit ships, on real ISP data, in one place built
 * for exactly that - not folded onto the actual dashboard. See
 * `DemoDashboard::galleryCharts()`'s own docblock for the reasoning; this
 * class is deliberately thin, just wiring that method's output through
 * `Page::headerWidgets()` (the same generic mechanism any custom page uses
 * for widgets, not something dashboard-specific).
 *
 * COMPONENT `PanelPage`, the package's generic widget-only shell - no
 * bespoke Vue file needed for a screen that is entirely "heading + widgets".
 */
final class ChartGalleryPage extends Page
{
    protected static string $panel = 'admin';

    protected static string $icon = 'layout-grid';

    protected static ?string $group = 'Developer';

    protected static ?int $sort = 91;

    public static function label(): string
    {
        return 'Chart gallery';
    }

    public static function heading(): string
    {
        return 'Chart gallery';
    }

    public static function description(): string
    {
        return 'Every chart type PanelKit ships, rendered against this tenant\'s real data - a reference for picking one, not the operator dashboard.';
    }

    public static function ability(): ?string
    {
        return null;
    }

    public static function component(): string
    {
        return 'PanelPage';
    }

    /** @return array<string, mixed> */
    public static function data(Request $request): array
    {
        return [];
    }

    /** @return list<\Alxtexh\Panel\Widgets\ChartWidget> */
    public static function headerWidgets(): array
    {
        return DemoDashboard::galleryCharts();
    }
}
