<?php

declare(strict_types=1);

namespace App\Panel\Pages;

use Alxtexh\Panel\Pages\CatalogRegisterPage;
use App\Panel\KitDemo;
use Illuminate\Http\Request;

/**
 * Lease list/cards: tenant, unit, dates, rent, status, deposit. Fake rows.
 */
final class KitLeasesPage extends CatalogRegisterPage
{
    protected static string $panel = 'admin';

    protected static string $icon = 'home';

    protected static ?string $group = 'Kit';

    protected static ?int $sort = 40;

    public static function label(): string
    {
        return 'Leases';
    }

    public static function ability(): ?string
    {
        return null;
    }

    public static function component(): string
    {
        return 'KitLeases';
    }

    public static function heading(): string
    {
        return 'Leases';
    }

    public static function description(): string
    {
        return 'Lease cards and a table. CatalogCard facts, DataTable, PkStatusBadge. Not a lease engine.';
    }

    public static function itemPath(): string
    {
        return '/kit-catalog';
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function cards(): array
    {
        return KitDemo::leaseCards();
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function rows(): array
    {
        return KitDemo::leases();
    }

    /**
     * @return array<string, mixed>
     */
    public static function data(Request $request): array
    {
        return [
            ...parent::data($request),
            'leases' => KitDemo::leases(),
        ];
    }
}
