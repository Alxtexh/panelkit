<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Pages;

use Closure;
use Illuminate\Http\Request;
use Alxtexh\Panel\PanelManager;

/**
 * Organisation payment-gateway settings. Off until a panel calls
 * `->paymentSettings()`.
 *
 * FAKE CONNECTED STATE IN THE BROWSER unless you persist from an action.
 * The kit draws enable/disable/default; it does not talk to a processor.
 *
 * Enable: `Panel::make('admin')->paymentSettings(fn () => [...gateways])`.
 */
final class PaymentSettingsPage extends Page
{
    protected static string $icon = 'credit-card';

    public static function shouldShowInNavigation(): bool
    {
        return false;
    }

    public static function uri(): string
    {
        return 'settings/payments';
    }

    public static function label(): string
    {
        return 'Payment gateways';
    }

    public static function ability(): ?string
    {
        return null;
    }

    /**
     * ABSENT until this portal opted in. A customer panel must not inherit
     * a till settings screen because the operator panel has one.
     */
    public static function isEnabled(): bool
    {
        $panel = app(PanelManager::class)->panel(static::panel());

        return $panel?->offersPaymentSettings() ?? false;
    }

    public static function component(): string
    {
        return 'settings/Payments';
    }

    public static function heading(): string
    {
        return 'Payment gateways';
    }

    public static function description(): string
    {
        return 'How this organisation takes money. Showcase only: no live processors, no API keys stored.';
    }

    /**
     * @return array<string, mixed>
     */
    public static function data(Request $request): array
    {
        $panel = app(PanelManager::class)->currentPanel();
        $resolve = $panel?->paymentGatewaysResolver();

        return [
            'gateways' => $resolve instanceof Closure ? $resolve() : [],
        ];
    }
}
