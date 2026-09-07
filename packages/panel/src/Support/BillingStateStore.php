<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Alxtexh\Panel\Billing\BillingState;
use Alxtexh\Panel\Panel;
use DateTimeInterface;
use Illuminate\Support\Carbon;

final class BillingStateStore
{
    /**
     * @return array<string, mixed>|null
     */
    public static function forCurrentContext(Panel $panel): ?array
    {
        $target = self::resolveBillableTarget($panel);

        if ($target === null) {
            return null;
        }

        $row = BillingState::query()
            ->where('billable_type', $target['type'])
            ->where('billable_key', $target['key'])
            ->first();

        if ($row === null) {
            return null;
        }

        return [
            'status' => $row->status,
            'period_end_at' => $row->period_end_at?->toIso8601String(),
            'grace_ends_at' => $row->grace_ends_at?->toIso8601String(),
            'provider_ref' => $row->provider_ref,
            'updated_at' => $row->updated_at->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function upsert(
        string $billableType,
        string|int $billableKey,
        string $status,
        DateTimeInterface|string|null $periodEndAt = null,
        DateTimeInterface|string|null $graceEndsAt = null,
        ?string $providerRef = null,
    ): array {
        $type = self::normalizeBillableType($billableType);
        $key = (string) $billableKey;
        $resolvedStatus = self::normalizeStatus($status);

        BillingState::query()->updateOrCreate(
            ['billable_type' => $type, 'billable_key' => $key],
            [
                'status' => $resolvedStatus,
                'period_end_at' => self::asCarbon($periodEndAt),
                'grace_ends_at' => self::asCarbon($graceEndsAt),
                'provider_ref' => self::trimmedOrNull($providerRef),
            ],
        );

        return self::transitionResult($type, $key, $resolvedStatus);
    }

    /**
     * Suspend only when current status is past_due and grace has passed.
     *
     * @return array<string, mixed>
     */
    public static function suspendIfPastDueBeyondGrace(string $billableType, string|int $billableKey): array
    {
        $type = self::normalizeBillableType($billableType);
        $key = (string) $billableKey;

        $row = BillingState::query()
            ->where('billable_type', $type)
            ->where('billable_key', $key)
            ->first();

        if ($row === null || $row->status !== 'past_due' || $row->grace_ends_at === null) {
            return self::transitionResult($type, $key, $row === null ? 'active' : $row->status, false);
        }

        if ($row->grace_ends_at->isFuture()) {
            return self::transitionResult($type, $key, $row->status, false);
        }

        $row->status = 'suspended';
        $row->save();

        return self::transitionResult($type, $key, 'suspended');
    }

    /**
     * @return array<string, mixed>
     */
    public static function reactivate(
        string $billableType,
        string|int $billableKey,
        DateTimeInterface|string|null $periodEndAt = null,
        ?string $providerRef = null,
    ): array {
        return self::upsert(
            $billableType,
            $billableKey,
            'active',
            $periodEndAt,
            null,
            $providerRef,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public static function cancelAtPeriodEnd(
        string $billableType,
        string|int $billableKey,
        DateTimeInterface|string|null $periodEndAt = null,
        ?string $providerRef = null,
    ): array {
        return self::upsert(
            $billableType,
            $billableKey,
            'canceled',
            $periodEndAt,
            null,
            $providerRef,
        );
    }

    /**
     * @return array{type: string, key: string}|null
     */
    public static function resolveBillableTarget(Panel $panel): ?array
    {
        $tenantKey = app(TenantContext::class)->currentKey();

        if ($tenantKey !== null) {
            return ['type' => 'tenant', 'key' => (string) $tenantKey];
        }

        $user = $panel->user();

        if ($user !== null) {
            return ['type' => 'user', 'key' => (string) $user->getAuthIdentifier()];
        }

        return null;
    }

    private static function normalizeBillableType(string $billableType): string
    {
        $normalized = strtolower(trim($billableType));

        return $normalized === 'user' ? 'user' : 'tenant';
    }

    private static function normalizeStatus(string $status): string
    {
        return match (str_replace('-', '_', strtolower(trim($status)))) {
            'pastdue', 'past_due' => 'past_due',
            'suspended', 'suspend' => 'suspended',
            'cancelled', 'canceled' => 'canceled',
            'expired', 'expire' => 'expired',
            default => 'active',
        };
    }

    private static function asCarbon(DateTimeInterface|string|null $value): ?Carbon
    {
        if ($value === null || $value === '') {
            return null;
        }

        if ($value instanceof Carbon) {
            return $value;
        }

        if ($value instanceof DateTimeInterface) {
            return Carbon::instance($value);
        }

        return Carbon::parse($value);
    }

    /**
     * @return array<string, mixed>
     */
    private static function transitionResult(
        string $billableType,
        string $billableKey,
        string $status,
        bool $updated = true,
    ): array {
        return [
            'billable_type' => $billableType,
            'billable_key' => $billableKey,
            'status' => self::normalizeStatus($status),
            'updated' => $updated,
        ];
    }

    private static function trimmedOrNull(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }
}
