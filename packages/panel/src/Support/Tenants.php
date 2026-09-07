<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/**
 * The organisation model, for the screens that have to name one.
 *
 * THE KEY ALREADY EXISTED AND ONE COMMAND READ IT. `panel.tenancy.model` was
 * added so `panel:permissions` could walk every tenant reconciling roles, and
 * nothing else ever asked. The workspace and organisation screens are the first
 * things that need to CREATE and UPDATE an organisation rather than iterate
 * them, and doing that through `Tenant::class` written into a packaged file
 * would tie the package to the reference application's model.
 *
 * WHY NOT READ `tenancy.tenant_model` FROM stancl. Because the package supports
 * three tenancy modes and its own resolver, and only one of those involves that
 * library. Reading its key would make a panel on a hand-written resolver depend
 * on a package it does not use, and would silently pick the wrong class for an
 * application that has both.
 *
 * NULL IS A REAL ANSWER, NOT AN OMISSION, and every method here says so rather
 * than throwing. A single-tenant installation has no organisation model; the
 * screens that need one report that they are unavailable and the rest of the
 * panel is unaffected. A package that fatals because an optional feature is
 * unconfigured is one that makes the optional feature mandatory.
 */
final class Tenants
{
    /** @return class-string<Model>|null */
    public static function model(): ?string
    {
        $model = config('panel.tenancy.model');

        return is_string($model) && class_exists($model) && is_a($model, Model::class, true)
            ? $model
            : null;
    }

    /**
     * Is there an organisation model to manage at all?
     *
     * THE MODE IS CHECKED TOO. `mode => 'none'` is a single-tenant application
     * by declaration, and an installation that left a stale `model` key from a
     * previous arrangement should not get workspace switching back because of
     * it - the mode is the statement of intent, the model is the mechanism.
     */
    public static function available(): bool
    {
        return self::model() !== null && config('panel.tenancy.mode') !== 'none';
    }

    /** The column on the user that names their organisation. */
    public static function column(): string
    {
        return (string) config('panel.tenancy.column', 'tenant_id');
    }

    /**
     * Container binding for the memoized result of `current()`, registered
     * scoped (not singleton) in `PanelServiceProvider` - see that
     * registration's own comment.
     */
    public const MEMO_BINDING = 'alxtexhpanel.tenants.current-memo';

    /**
     * The acting user's organisation, or null.
     *
     * RESOLVED THROUGH THE USER, NOT THROUGH `tenancy()`. The helper reads
     * whatever the current bootstrapper initialised, which in `column` mode is
     * nothing at all - so a screen built on it renders empty for the majority
     * arrangement while working in the one it was written under.
     *
     * MEMOIZED ON A SCOPED CONTAINER BINDING, NOT ON `$request`.
     * `SharePanelProps::chrome()` calls this once per shared prop it builds a
     * cache key for - fourteen props, fourteen identical `find()` queries per
     * request, confirmed live (`Performance\ClientsPerformanceTest` expects
     * five queries on a warmed request and was counting twenty).
     *
     * `$request->attributes` looked like the obvious memo location and does
     * NOT work: `SharePanelProps` runs this twice per logical request (its
     * own `chrome()` docblock - once on the web-group pass, again as route
     * middleware after `UsePanel`), and logging `spl_object_id($request)`
     * across both proved they are two DIFFERENT `Request` objects, not the
     * same one revisited - so a memo keyed to the request only ever survived
     * within one of the two passes. The scoped container binding both passes
     * share is what actually spans them, the same mechanism `TenantContext`
     * already uses for exactly this reason.
     */
    public static function current(Request $request): ?Model
    {
        /** @var \ArrayObject<string, Model|null> $memo */
        $memo = app(self::MEMO_BINDING);

        if ($memo->offsetExists('tenant')) {
            return $memo['tenant'];
        }

        $model = self::model();
        $key = $request->user()?->{self::column()} ?? null;

        $tenant = $model === null || $key === null
            ? null
            : $model::query()->whereKey($key)->first();

        $memo['tenant'] = $tenant;

        return $tenant;
    }

    /**
     * The relation naming every organisation a user belongs to, if any.
     *
     * THREE NAMES ARE ACCEPTED because this is somebody else's model and the
     * word for it is a house style rather than a contract - the reference
     * application calls it `memberships`, `tenants` reads naturally on a
     * stancl-shaped app, and `organisations` is what a domain that avoids the
     * word "tenant" tends to use. Requiring one of them would mean an
     * application renaming a relation to satisfy a package.
     *
     * ORDER MATTERS ONLY IF A MODEL HAS TWO, which would itself be the bug.
     */
    private const RELATIONS = ['memberships', 'tenants', 'organisations'];

    public static function relation(mixed $user): ?string
    {
        foreach (self::RELATIONS as $name) {
            if ($user !== null && method_exists($user, $name)) {
                return $name;
            }
        }

        return null;
    }

    /**
     * Every organisation the acting user belongs to.
     *
     * THROUGH THE MEMBERSHIP RELATION WHERE THE USER HAS ONE, and otherwise the
     * single organisation their column names. Workspace switching only means
     * anything for an account with more than one, and an application that has
     * not modelled that relation has exactly one - which this returns, so the
     * screen shows the current organisation rather than an empty list that
     * reads as a fault.
     *
     * @return list<Model>
     */
    public static function forUser(Request $request): array
    {
        $user = $request->user();

        if ($user === null || ! self::available()) {
            return [];
        }

        $relation = self::relation($user);

        if ($relation !== null) {
            return $user->{$relation}()->orderBy('name')->get()->all();
        }

        $current = self::current($request);

        return $current === null ? [] : [$current];
    }

    /**
     * Every organisation on the installation, for screens that act across them.
     *
     * OPERATIONS, NOT THE SWITCHER. A backup of one tenant is chosen by somebody
     * who runs the servers, not by the acting user's memberships.
     *
     * @return list<Model>
     */
    public static function all(): array
    {
        $model = self::model();

        if ($model === null || ! self::available()) {
            return [];
        }

        $query = $model::query();
        $table = (new $model)->getTable();

        if (\Illuminate\Support\Facades\Schema::hasColumn($table, 'name')) {
            $query->orderBy('name');
        }

        $rows = [];
        foreach ($query->get() as $tenant) {
            $rows[] = $tenant;
        }

        return $rows;
    }

    public static function find(string|int $id): ?Model
    {
        $model = self::model();

        if ($model === null || ! self::available()) {
            return null;
        }

        $found = $model::query()->find($id);

        if ($found !== null) {
            return $found;
        }

        $table = (new $model)->getTable();

        if (\Illuminate\Support\Facades\Schema::hasColumn($table, 'slug')) {
            return $model::query()->where('slug', $id)->first();
        }

        return null;
    }

    /**
     * May this user move between organisations at all?
     *
     * A SWITCHER FOR ONE ORGANISATION IS NOISE, and a "create workspace" button
     * in an application that models no membership relation would produce a row
     * nobody can reach - the new organisation would exist and the user's single
     * `tenant_id` would be the only way in.
     */
    public static function switchable(Request $request): bool
    {
        return self::available() && self::relation($request->user()) !== null;
    }

    /**
     * Serialise one for a screen.
     *
     * NAME FALLS BACK TO THE KEY, because an organisation row with a null name
     * renders as an empty switcher entry that cannot be clicked with confidence
     * - and "23" is at least selectable.
     *
     * @return array<string, mixed>
     */
    public static function toArray(Model $tenant): array
    {
        return [
            'id' => $tenant->getKey(),
            'name' => $tenant->name ?? (string) $tenant->getKey(),
            'slug' => $tenant->slug ?? null,
        ];
    }
}
