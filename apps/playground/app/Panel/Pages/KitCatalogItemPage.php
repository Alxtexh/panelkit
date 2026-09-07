<?php

declare(strict_types=1);

namespace App\Panel\Pages;

use Alxtexh\Panel\Pages\CatalogItemPage;
use App\Panel\KitDemo;

/**
 * Dedicated product or unit page. Reached from a catalog tile, not the sidebar.
 */
final class KitCatalogItemPage extends CatalogItemPage
{
    protected static string $panel = 'admin';

    protected static string $icon = 'package';

    public static function uri(): string
    {
        return 'kit-catalog/{key}';
    }

    public static function ability(): ?string
    {
        return null;
    }

    public static function component(): string
    {
        return 'KitCatalogItem';
    }

    public static function heading(): string
    {
        return 'Catalog item';
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function find(string $key): ?array
    {
        return KitDemo::item($key);
    }

    public static function catalogHref(): string
    {
        return '/kit-catalog';
    }

    public static function cartHref(): string
    {
        return '/kit-till';
    }
}
