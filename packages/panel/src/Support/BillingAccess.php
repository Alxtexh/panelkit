<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Alxtexh\Panel\Pages\BillingPortalPage;
use Alxtexh\Panel\Panel;
use Alxtexh\Panel\PanelManager;
use Illuminate\Support\Arr;

final class BillingAccess
{
    /**
     * @param  array<string, mixed>|null  $state
     * @return array<string, mixed>
     */
    public static function normalize(?array $state, Panel $panel): array
    {
        $status = self::normalizeStatus((string) ($state['status'] ?? 'active'));
        $blocks = array_key_exists('blocksAccess', $state ?? [])
            ? (bool) $state['blocksAccess']
            : in_array($status, ['suspended', 'canceled', 'expired'], true);

        $plan = self::normalizePlan($state);
        $reason = self::stringOrNull($state['reason'] ?? $state['message'] ?? $state['detail'] ?? null);
        $due = self::stringOrNull($state['dueMessage'] ?? $state['due_message'] ?? null);
        $renewal = self::stringOrNull($state['renewalMessage'] ?? $state['renewal_message'] ?? null);
        $title = self::stringOrNull($state['title'] ?? null) ?? self::defaultTitle($status);
        $body = self::stringOrNull($state['body'] ?? null) ?? self::defaultBody($status, $plan['name'] ?? null);

        return [
            'status' => $status,
            'statusLabel' => self::label($status),
            'blocksAccess' => $blocks,
            'title' => $title,
            'body' => $body,
            'reason' => $reason,
            'dueMessage' => $due,
            'renewalMessage' => $renewal,
            'plan' => $plan,
            'billingHref' => self::billingHref($panel, $state ?? []),
            'billingLabel' => self::stringOrNull($state['billingLabel'] ?? Arr::get($state, 'actions.billing.label')) ?? __('panel::billing.actions.manage'),
            'logoutHref' => self::logoutHref($panel),
            'logoutLabel' => self::stringOrNull($state['logoutLabel'] ?? Arr::get($state, 'actions.logout.label')) ?? __('panel::billing.actions.logout'),
            'supportEmail' => config('panel.support_email'),
        ];
    }

    public static function blocks(Panel $panel): bool
    {
        return (bool) ($panel->resolveBillingState()['blocksAccess'] ?? false);
    }

    public static function label(string $status): string
    {
        $key = 'panel::billing.status.'.$status;
        $translated = __($key);

        return $translated === $key ? __('panel::billing.status.fallback') : $translated;
    }

    /**
     * @return array<string, array{label: string, href: string|null}>
     */
    public static function defaultPortalActions(): array
    {
        return [
            'pay_now' => ['label' => __('panel::billing.actions.pay_now'), 'href' => null],
            'update_method' => ['label' => __('panel::billing.actions.update_method'), 'href' => null],
            'view_invoices' => ['label' => __('panel::billing.actions.view_invoices'), 'href' => null],
            'contact_billing' => ['label' => __('panel::billing.actions.contact_billing'), 'href' => null],
        ];
    }

    /**
     * @param  array<string, mixed>  $actions
     * @return array<string, array{label: string, href: string|null}>
     */
    public static function normalizePortalActions(array $actions): array
    {
        $normalized = self::defaultPortalActions();

        foreach ($actions as $key => $action) {
            $name = trim($key);

            if ($name === '') {
                continue;
            }

            if (is_string($action)) {
                $normalized[$name] = [
                    'label' => $normalized[$name]['label'] ?? self::labelFromKey($name),
                    'href' => trim($action) !== '' ? trim($action) : null,
                ];

                continue;
            }

            if (! is_array($action)) {
                continue;
            }

            $normalized[$name] = [
                'label' => self::stringOrNull($action['label'] ?? null)
                    ?? ($normalized[$name]['label'] ?? self::labelFromKey($name)),
                'href' => self::stringOrNull($action['href'] ?? null),
            ];
        }

        return $normalized;
    }

    /** @param array<string, mixed> $state */
    public static function billingHref(Panel $panel, array $state = []): string
    {
        $fromState = self::stringOrNull(
            Arr::get($state, 'billingHref')
            ?? Arr::get($state, 'actions.billing.href')
            ?? Arr::get($state, 'actions.portal.href')
            ?? Arr::get($state, 'actions.manage.href')
        );

        if ($fromState !== null) {
            return $fromState;
        }

        $pages = app(PanelManager::class)->pagesFor($panel->id);

        foreach ($pages as $slug => $class) {
            if (! is_a($class, BillingPortalPage::class, true)) {
                continue;
            }

            return '/'.trim($panel->getPath().'/'.$class::navigationPath(), '/');
        }

        return $panel->subscriptionBillingPath();
    }

    public static function logoutHref(Panel $panel): ?string
    {
        $route = rtrim($panel->getRouteName(), '.').'.logout';

        return app('router')->getRoutes()->getByName($route) !== null
            ? route($route)
            : null;
    }

    private static function normalizeStatus(string $status): string
    {
        $normalized = str_replace('-', '_', strtolower(trim($status)));

        return match ($normalized) {
            'pastdue', 'past_due' => 'past_due',
            'suspend', 'suspended' => 'suspended',
            'cancelled', 'canceled' => 'canceled',
            'expire', 'expired' => 'expired',
            default => 'active',
        };
    }

    /**
     * @param  array<string, mixed>|null  $state
     * @return array{name: ?string, price: ?string, interval: ?string}
     */
    private static function normalizePlan(?array $state): array
    {
        $plan = $state['plan'] ?? null;

        if (is_array($plan)) {
            return [
                'name' => self::stringOrNull($plan['name'] ?? $plan['label'] ?? null),
                'price' => self::stringOrNull($plan['price'] ?? null),
                'interval' => self::stringOrNull($plan['interval'] ?? null),
            ];
        }

        return [
            'name' => self::stringOrNull($plan),
            'price' => null,
            'interval' => null,
        ];
    }

    private static function defaultTitle(string $status): string
    {
        $key = 'panel::billing.title.'.$status;
        $translated = __($key);

        return $translated === $key ? __('panel::billing.title.limited') : $translated;
    }

    private static function defaultBody(string $status, ?string $plan): string
    {
        $planCopy = $plan !== null && $plan !== ''
            ? __('panel::billing.plan_suffix', ['plan' => $plan])
            : '';

        $key = 'panel::billing.body.'.$status;
        $translated = __($key, ['plan' => $planCopy]);

        return $translated === $key
            ? __('panel::billing.body.attention')
            : $translated;
    }

    private static function stringOrNull(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }

    private static function labelFromKey(string $key): string
    {
        $words = preg_split('/[_-]+/', strtolower($key)) ?: [$key];
        $words = array_map(static fn (string $word): string => ucfirst($word), $words);

        return trim(implode(' ', $words));
    }
}
