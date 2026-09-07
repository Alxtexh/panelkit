<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\DashboardLayout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

/**
 * Saves the acting user's display preferences.
 *
 * PACKAGED so a host does not copy the playground controller. Values become
 * CSS custom properties on `<html>`, so each key is allow-listed. Partial
 * updates merge: the drawer sends one setting at a time.
 *
 * Requires an `appearance` JSON column on the user model (the package
 * migration adds it when `users` exists). Hosts that persist another way
 * keep their own route; this one yields when the URI is already claimed.
 *
 * `dashboardLayout` (widget order, spans, visibility) is accepted only when
 * the current panel enabled `Panel::userDashboards()`. Otherwise the key is
 * ignored on write.
 */
final class AppearanceController extends Controller
{
    private const THEMES = ['light', 'dark'];

    private const DENSITIES = ['comfortable', 'compact', 'spacious'];

    private const SIDES = ['left', 'right', 'horizontal'];

    private const CARD_STYLES = ['transparent', 'filled'];

    private const PRIMARIES = [
        'slate', 'gray', 'zinc', 'red', 'rose', 'orange', 'amber', 'yellow',
        'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo',
        'violet', 'purple', 'fuchsia', 'pink',
    ];

    private const SURFACES = ['neutral', 'slate', 'gray', 'zinc', 'stone', 'warm', 'cool', 'sand'];

    private const RADII = [0, 0.25, 0.5, 0.75, 1];

    private const CONTENT_LAYOUTS = ['full', 'centered'];

    private const MENU_STYLES = ['collapsible', 'drilldown'];

    private const FONT_MIN = 12;

    private const FONT_MAX = 20;

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'theme' => ['sometimes', 'string', 'in:'.implode(',', self::THEMES)],
            'density' => ['sometimes', 'string', 'in:'.implode(',', self::DENSITIES)],
            'sidebarSide' => ['sometimes', 'string', 'in:'.implode(',', self::SIDES)],
            'cardStyle' => ['sometimes', 'string', 'in:'.implode(',', self::CARD_STYLES)],
            'primary' => ['sometimes', 'string', 'in:'.implode(',', self::PRIMARIES)],
            'primaryChosen' => ['sometimes', 'boolean'],
            'surface' => ['sometimes', 'string', 'in:'.implode(',', self::SURFACES)],
            'fontSize' => ['sometimes', 'integer', 'between:'.self::FONT_MIN.','.self::FONT_MAX],
            'radius' => ['sometimes', 'numeric', 'in:'.implode(',', self::RADII)],
            'contentLayout' => ['sometimes', 'string', 'in:'.implode(',', self::CONTENT_LAYOUTS)],
            'menuStyle' => ['sometimes', 'string', 'in:'.implode(',', self::MENU_STYLES)],
            'dashboardLayout' => ['sometimes', 'array'],
            'dashboardLayout.widgets' => ['sometimes', 'array', 'max:'.DashboardLayout::MAX_WIDGETS],
            'dashboardLayout.widgets.*.id' => ['sometimes', 'string', 'max:80', 'regex:'.DashboardLayout::ID_PATTERN],
            'dashboardLayout.widgets.*.kind' => ['sometimes', 'string', 'in:'.implode(',', DashboardLayout::KINDS)],
            'dashboardLayout.widgets.*.type' => ['sometimes', 'string', 'in:'.implode(',', DashboardLayout::KINDS)],
            'dashboardLayout.widgets.*.key' => ['sometimes', 'string', 'max:64', 'regex:'.DashboardLayout::KEY_PATTERN],
            'dashboardLayout.widgets.*.span' => ['sometimes', 'integer', 'between:1,2'],
            'dashboardLayout.widgets.*.hidden' => ['sometimes', 'boolean'],
            // Legacy v1.0.97 field; still accepted and folded into widgets.
            'dashboardLayout.chartOrder' => ['sometimes', 'array', 'max:'.DashboardLayout::MAX_WIDGETS],
            'dashboardLayout.chartOrder.*' => ['string', 'max:64', 'regex:'.DashboardLayout::KEY_PATTERN],
        ]);

        $user = $request->user();

        abort_if($user === null, 403);

        $appearance = $user->getAttribute('appearance');
        $current = is_array($appearance) ? $appearance : [];

        if (array_key_exists('dashboardLayout', $validated)) {
            $panel = app(PanelManager::class)->currentPanel();

            if ($panel === null || ! $panel->hasUserDashboards()) {
                unset($validated['dashboardLayout']);
            } else {
                $validated['dashboardLayout'] = DashboardLayout::normalize($validated['dashboardLayout']);
            }
        }

        $user->setAttribute('appearance', [...$current, ...$validated]);
        $user->save();

        return response()->json(['appearance' => $user->getAttribute('appearance')]);
    }
}
