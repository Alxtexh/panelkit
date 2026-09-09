<?php

declare(strict_types=1);

namespace App\Panel\Pages;

use Alxtexh\Panel\Pages\Page;
use App\Panel\Pages as NavigationPages;
use Illuminate\Http\Request;

/**
 * A read-only gallery of the imported landing presets.
 *
 * There is nothing to save here. Which preset is live at the public root is
 * a code-level choice (`NavigationPages::LANDING_DEFAULT`), not a setting;
 * this page exists only so an operator can discover and preview what was
 * imported, the same way `?preview=<slug>` already lets anyone do from the
 * address bar.
 */
final class LandingPagesPage extends Page
{
    protected static string $panel = 'admin';

    protected static string $icon = 'layout-template';

    protected static ?string $group = 'Website';

    public static function label(): string
    {
        return 'Landing pages';
    }

    public static function ability(): string
    {
        return 'view_landing_pages';
    }

    /**
     * The app navigation owns the curated entry, so the generated page list
     * does not offer a second one for the same destination. See Pages::all().
     */
    public static function shouldShowInNavigation(): bool
    {
        return false;
    }

    public static function component(): string
    {
        return 'LandingPages';
    }

    public static function heading(): string
    {
        return 'Landing pages';
    }

    public static function description(): string
    {
        return 'Browse the imported landing page designs and preview any of them outside the dashboard shell.';
    }

    /** @return array<string, mixed> */
    public static function data(Request $request): array
    {
        return [
            'templates' => NavigationPages::landingTemplates(),
            'defaultSlug' => NavigationPages::LANDING_DEFAULT,
        ];
    }
}
