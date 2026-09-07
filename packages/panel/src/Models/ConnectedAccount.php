<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A sign-in provider attached to somebody's account.
 *
 * MOVED FROM THE REFERENCE APP. IDENTITY ONLY - see the migration for why no
 * token is kept.
 *
 * THE TABLE IS NAMED IN CONFIG, for the same reason the ticket tables are:
 * `connected_accounts` is a name an application may already use, and a migration
 * that succeeds against somebody else's table is worse than one that collides.
 *
 * THE USER MODEL IS THE APPLICATION'S. A package cannot name it, and
 * `auth.providers.users.model` is where Laravel already keeps the answer.
 *
 * @property int|string|null $id
 * @property string $guard
 * @property int|string $user_id
 * @property string $provider
 * @property string $provider_id
 * @property string|null $email
 * @property string|null $nickname
 * @property \Illuminate\Support\Carbon|null $last_used_at
 */
final class ConnectedAccount extends Model
{
    protected $guarded = [];

    public function getTable(): string
    {
        return (string) config('panel.auth.social.table', 'connected_accounts');
    }

    protected function casts(): array
    {
        return [
            'last_used_at' => 'datetime',
        ];
    }

    /**
     * THE MODEL COMES FROM THE ROW'S OWN GUARD, not from the default one.
     *
     * This used to be hardcoded to `auth.providers.users.model`, which is only
     * correct for panels running the default guard. A row belonging to a
     * customer portal resolved to an OPERATOR of the same id - and the caller
     * then signed that operator in. See the `guard` migration.
     */
    /** @return BelongsTo<Model, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(self::modelForGuard((string) $this->guard));
    }

    /**
     * The Eloquent model a guard authenticates.
     *
     * Falls back to the default guard's provider for a row written before the
     * `guard` column existed, which is what those rows meant.
     *
     * @return class-string<Model>
     */
    public static function modelForGuard(?string $guard): string
    {
        $guard = $guard !== null && $guard !== '' ? $guard : (string) config('auth.defaults.guard', 'web');

        $provider = (string) config("auth.guards.{$guard}.provider", 'users');

        $model = config(
            "auth.providers.{$provider}.model",
            config('auth.providers.users.model', 'App\\Models\\User'),
        );

        return is_string($model) && class_exists($model) && is_a($model, Model::class, true)
            ? $model
            : Model::class;
    }
}
