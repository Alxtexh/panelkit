<?php

declare(strict_types=1);

namespace App\Panel\Pages;

use Alxtexh\Panel\Pages\TillPage;
use Alxtexh\Panel\Widgets\ChartWidget;
use App\Panel\KitDemo;
use Illuminate\Http\Request;

/**
 * Playground till: demo SKUs and tax live here, not in the kit.
 */
final class KitTillPage extends TillPage
{
    protected static string $panel = 'admin';

    protected static string $icon = 'receipt';

    protected static ?string $group = 'Kit';

    protected static ?int $sort = 20;

    public static function label(): string
    {
        return 'Till';
    }

    public static function ability(): ?string
    {
        return null;
    }

    public static function component(): string
    {
        return 'KitTill';
    }

    public static function heading(): string
    {
        return 'Till';
    }

    public static function description(): string
    {
        return 'Tap products into a cart. LineItems, PkStatusBadge, and catalog ChartWidgets.';
    }

    public static function items(): array
    {
        return KitDemo::products();
    }

    public static function taxRate(): float
    {
        return 0.16;
    }

    public static function taxLabel(): string
    {
        return 'VAT 16%';
    }

    public static function itemPath(): string
    {
        return '/kit-catalog';
    }

    /**
     * @return list<ChartWidget>
     */
    public static function headerWidgets(): array
    {
        return [
            ChartWidget::make('featured', 'Featured')
                ->type('catalog')
                ->description('The same CatalogGrid, hosted as a dashboard card')
                ->data(fn (): array => [
                    'items' => array_slice(KitDemo::products(), 0, 3),
                ]),

            ChartWidget::make('recent_lines', 'Recent lines')
                ->type('items')
                ->description('The same LineItems shape, hosted as a dashboard card')
                ->data(fn (): array => [
                    'items' => array_slice(KitDemo::lines(), 0, 3),
                ]),
        ];
    }

    public static function data(Request $request): array
    {
        return [
            ...parent::data($request),
            'products' => static::items(),
            'lines' => KitDemo::lines(),
            'statuses' => KitDemo::statuses(),
        ];
    }
}
