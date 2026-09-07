<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Alxtexh\Panel\Panel;

/**
 * Environment badge payload for shared Inertia props.
 *
 * Permanently off. The chrome no longer renders an environment badge (it
 * congested the top bar). `Panel::environmentBanner()` and
 * `PANEL_ENVIRONMENT_BANNER` remain as accepted no-op API so host code that
 * still calls them does not break. `for()` always returns null.
 */
final class EnvironmentBanner
{
    public static function for(?Panel $panel = null): null
    {
        unset($panel);

        return null;
    }
}
