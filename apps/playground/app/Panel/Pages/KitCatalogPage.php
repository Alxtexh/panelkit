<?php

declare(strict_types=1);

namespace App\Panel\Pages;

use Alxtexh\Panel\Pages\CatalogBrowserPage;
use App\Panel\KitDemo;
use Illuminate\Http\Request;

/**
 * Merchandising tiles: POS products and rental units, same CatalogGrid.
 */
final class KitCatalogPage extends CatalogBrowserPage
{
    protected static string $panel = 'admin';

    protected static string $icon = 'shopping-bag';

    protected static ?string $group = 'Kit';

    protected static ?int $sort = 10;

    public static function label(): string
    {
        return 'Catalog';
    }

    public static function ability(): ?string
    {
        return null;
    }

    public static function component(): string
    {
        return 'KitCatalog';
    }

    public static function heading(): string
    {
        return 'Catalog';
    }

    public static function description(): string
    {
        return 'CatalogGrid of products and units. Search, Filters, and Tiles sit on one row. Open a tile for the product page.';
    }

    public static function itemPath(): string
    {
        return '/kit-catalog';
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function tabs(): array
    {
        return KitDemo::catalogTabs();
    }

    /**
     * @return array<string, mixed>
     */
    public static function data(Request $request): array
    {
        return [
            ...parent::data($request),
            'products' => KitDemo::products(),
            'units' => KitDemo::units(),
        ];
    }
}
