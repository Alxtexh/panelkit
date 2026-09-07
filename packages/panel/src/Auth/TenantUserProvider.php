<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Auth;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Alxtexh\Panel\Support\TenantContext;

/**
 * Credentials are looked up WITHIN the resolved tenant, not across all of them.
 *
 * ONCE EMAIL IS ONLY UNIQUE PER TENANT, an email alone no longer identifies
 * anybody - so a provider that searches on email alone would find whichever row
 * the database returned first. On a shared login page that was merely a
 * limitation; on a per-tenant login page it is a cross-tenant authentication
 * bug, because the person typing into `acme`'s form could be matched against
 * `zenith`'s account with the same address.
 *
 * THE CONSTRAINT IS ADDED, NOT SUBSTITUTED. The parent still does the password
 * verification, the rehashing and the "remember me" token handling; this only
 * narrows which rows it may consider. Reimplementing any of that to add a
 * `where` would be trading a one-line constraint for a copy of Laravel's
 * password handling.
 *
 * NO TENANT MEANS NO CONSTRAINT, and that is deliberate rather than an
 * oversight. The central domain has a genuine login - super admins, platform
 * operators - and there is no tenant to scope it to. The panel's own guards
 * still deny tenant DATA to a session with no tenant, so the worst case is
 * somebody authenticating centrally and seeing nothing, which is the correct
 * outcome rather than a leak.
 */
final class TenantUserProvider extends EloquentUserProvider
{
    /** @param array<string, mixed> $credentials */
    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        $user = $this->withTenant(fn () => parent::retrieveByCredentials($credentials));

        return $user instanceof Model ? $user : null;
    }

    public function retrieveByToken($identifier, $token): ?Authenticatable
    {
        $user = $this->withTenant(fn () => parent::retrieveByToken($identifier, $token));

        return $user instanceof Model ? $user : null;
    }

    /**
     * Run `$lookup` with the tenant constraint applied to new queries.
     *
     * `EloquentUserProvider` builds its query through `newModelQuery()`, so the
     * constraint is applied by overriding that rather than by intercepting each
     * method - which keeps it in one place and means a method added upstream is
     * scoped too.
     */
    private function withTenant(callable $lookup): ?Authenticatable
    {
        return $lookup();
    }

    /**
     * @param  Model|null  $model
     * @return Builder<Model>
     */
    protected function newModelQuery($model = null)
    {
        $query = parent::newModelQuery($model);

        $key = app(TenantContext::class)->currentKey();

        if ($key !== null) {
            $query->where(app(TenantContext::class)->column(), $key);
        }

        return $query;
    }
}
