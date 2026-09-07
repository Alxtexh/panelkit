<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Invites;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $tenant_id
 * @property string $email
 * @property string $token
 * @property list<string>|null $roles
 * @property int|null $invited_by
 * @property \Carbon\CarbonImmutable|null $accepted_at
 * @property \Carbon\CarbonImmutable|null $revoked_at
 * @property \Carbon\CarbonImmutable|null $expires_at
 */
final class PanelInvite extends Model
{
    protected $table = 'panel_invites';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'roles' => 'array',
            'accepted_at' => 'datetime',
            'revoked_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    /** @param list<string>|null $roles */
    public static function mint(int|string $tenantId, string $email, ?array $roles = null, ?int $invitedBy = null): self
    {
        return self::query()->create([
            'tenant_id' => $tenantId,
            'email' => $email,
            'token' => Str::random(40),
            'roles' => $roles,
            'invited_by' => $invitedBy,
            'expires_at' => now()->addDays(7),
        ]);
    }

    public function isPending(): bool
    {
        return $this->accepted_at === null
            && $this->revoked_at === null
            && ($this->expires_at === null || $this->expires_at->isFuture());
    }
}
