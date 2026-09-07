<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Alxtexh\Panel\Support\TenantContext;

/**
 * Constrains every query on a tenant-owned model to the acting tenant.
 *
 * PROMOTED FROM THE REFERENCE APP, where it was written and where every
 * argument below was earned. It always delegated the hard question to
 * `TenantContext`, which is the package's - so the only thing keeping it in an
 * application was that nobody had moved it, and every consumer was writing
 * their own version of a class whose failure mode is a cross-tenant leak.
 *
 * This is a global scope rather than a `where` in the controller for one reason:
 * a forgotten `where` is a cross-tenant data leak, and a global scope cannot be
 * forgotten. Every new query, relation load, and count inherits it.
 *
 * It applies via `qualifyColumn`, so it stays correct once the list query joins
 * `plans` - an unqualified `tenant_id` is ambiguous the moment a second table
 * with that column enters the query.
 *
 * WHICH constraint to apply is delegated to TenantContext, because the answer
 * differs by isolation strategy:
 *
 *   shared / single database    add `where tenant_id = ?`
 *   dedicated / multi database  add NOTHING - stancl/tenancy already switched
 *                               the connection, and the column does not exist
 *
 * Fails closed, with NO context exemption. There is deliberately no
 * `runningInConsole()` escape hatch: `php artisan test` runs in console, so such
 * an exemption disables the scope across the entire test suite and no test can
 * ever catch a leak again. That is not hypothetical - the first version of this
 * class had it, and the cross-tenant test passed a full result set.
 *
 * Code that legitimately crosses tenants opts out loudly and per query with
 * `withoutGlobalScope(TenantScope::class)`, which is greppable. An implicit
 * ambient exemption is not.
 */
/** @implements Scope<Model> */
final class TenantScope implements Scope
{
    /**
     * `Builder<Model>`, THE WIDEST HONEST TYPE. A global scope is applied to
     * whatever model declared it, so the builder's model parameter genuinely
     * is unconstrained here - narrowing it would be a claim about a caller
     * this class never sees.
     *
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        $context = app(TenantContext::class);

        /*
         * A CENTRAL PANEL IS DELIBERATELY UNSCOPED.
         *
         * A super admin exists to see across tenants; constraining its queries
         * to one would make the panel useless. This is the only exemption the
         * scope grants, and it is checked FIRST so it reads as the exception it
         * is rather than as one branch among several.
         *
         * It cannot be reached by accident: `isCentralPanel()` answers false for
         * an unregistered panel, an absent panel, and an unknown id, so the only
         * way here is a `Panel` explicitly declared `central` in application code
         * and made current by the route. Nothing in the REQUEST can select it.
         */
        if ($context->isCentralPanel()) {
            return;
        }

        // Dedicated-database tenancy: the connection is the boundary. Adding a
        // column constraint here would reference a column that does not exist.
        if (! $context->shouldScopeByColumn()) {
            if (! $context->isIsolated()) {
                $this->deny($builder, $model);
            }

            return;
        }

        $key = $context->currentKey();

        if ($key === null) {
            $this->deny($builder, $model);

            return;
        }

        $builder->where($model->qualifyColumn($context->column()), $key);
    }

    /**
     * An unresolvable tenant yields no rows rather than every row.
     *
     * whereRaw('1 = 0') would be marginally cheaper, but this reads unambiguously
     * in a query log and does not depend on driver boolean handling.
     */
    /** @param Builder<covariant Model> $builder */
    private function deny(Builder $builder, Model $model): void
    {
        $builder->whereNull($model->qualifyColumn($model->getKeyName()));
    }

    /**
     * Convenience for application code that needs the current tenant key.
     *
     * Kept as a thin pass-through so callers do not reach into TenantContext
     * directly and accidentally bypass the deny-on-null contract.
     */
    public static function currentTenantId(): int|string|null
    {
        return app(TenantContext::class)->currentKey();
    }
}
