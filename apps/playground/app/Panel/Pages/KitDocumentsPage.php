<?php

declare(strict_types=1);

namespace App\Panel\Pages;

use Alxtexh\Panel\Pages\SignatureStudioPage;
use App\Panel\KitDemo;
use Illuminate\Http\Request;

/**
 * Draw a signature, keep stamps/logos, preview them on a contract or invoice.
 */
final class KitDocumentsPage extends SignatureStudioPage
{
    protected static string $panel = 'admin';

    protected static string $icon = 'file-text';

    protected static ?string $group = 'Kit';

    protected static ?int $sort = 50;

    public static function label(): string
    {
        return 'Signatures';
    }

    public static function ability(): ?string
    {
        return null;
    }

    public static function component(): string
    {
        return 'KitDocuments';
    }

    public static function heading(): string
    {
        return 'Signatures';
    }

    public static function description(): string
    {
        return 'Draw a signature, upload a logo or stamp, place them on a sample invoice or lease.';
    }

    /**
     * @return list<array{key: string, label: string, document: array<string, mixed>}>
     */
    public static function documents(): array
    {
        return [
            ['key' => 'invoice', 'label' => 'Invoice', 'document' => KitDemo::sampleInvoice()],
            ['key' => 'contract', 'label' => 'Lease', 'document' => KitDemo::sampleContract()],
        ];
    }

    public static function storageKey(): string
    {
        return 'kit-demo';
    }

    /**
     * @return array<string, mixed>
     */
    public static function data(Request $request): array
    {
        return [
            ...parent::data($request),
            'invoice' => KitDemo::sampleInvoice(),
            'contract' => KitDemo::sampleContract(),
        ];
    }
}
