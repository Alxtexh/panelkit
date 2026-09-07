<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Alxtexh\Panel\Audit\Auditable;
use Alxtexh\Panel\Support\Abilities;
use Spatie\Permission\Exceptions\PermissionDoesNotExist;
use Spatie\Permission\PermissionRegistrar;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /*
     * AUDITED. Role changes and email changes are among the most consequential
     * edits in the panel, and both happen here - "who gave this account
     * administrator" is a question with a short list of good answers.
     *
     * `AuditRecorder` redacts the value of anything whose name looks sensitive,
     * which on this model is most of it: password, remember token and the
     * two-factor secret all live here. The field NAME is still recorded, so the
     * trail says a password changed without saying what to.
     */
    use Auditable;
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /*
     * Spatie's trait replaces the hand-rolled single `role_id`. The difference
     * that matters is arity: a person can hold SEVERAL roles, and can be granted
     * a permission directly without any role at all. "Grace is Support and
     * Billing" was not expressible before without inventing a combined role for
     * every combination.
     */
    use HasRoles;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'appearance' => 'array',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'password_changed_at' => 'datetime',
            /*
             * ARRAY, and the values are HASHES rather than passwords - see the
             * migration. Cast so `PasswordPolicy` reads a list either way,
             * whether the row was written by Eloquent or by a query builder.
             */
            'password_history' => 'array',
            'must_change_password' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * The tenant this admin belongs to.
     *
     * Feature flags and branding are read from here, so it is deliberately a
     * relation rather than an ambient `tenant()` helper - the panel must work
     * identically whether or not stancl/tenancy is installed.
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Every workspace this person may switch to - roadmap 5.6.
     *
     * `tenant_id` above stays the CURRENT one; this pivot answers only "which
     * others". The switch endpoint trusts this relation and nothing else, so
     * membership is the entire authorisation: no row, no switch.
     */
    public function memberships(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'tenant_members')->withTimestamps();
    }

    /**
     * A new account created without a password gets an UNUSABLE one.
     *
     * WHY NOT REQUIRE A PASSWORD ON THE CREATE FORM. The panel's form schema is
     * shared between creating and editing, and on an edit form a blank password
     * has to mean "leave it alone" - otherwise correcting a typo in a colleague's
     * name forces a password reset. So blank is legitimate in one case and not
     * the other, and the form cannot tell them apart.
     *
     * Filling it with random bytes resolves that in the safe direction: the
     * account exists, appears in the list, holds its role, and CANNOT SIGN IN
     * until somebody sets a password or the person uses the reset flow. That is
     * the ordinary invite shape.
     *
     * The dangerous alternatives are both worse. A nullable password column
     * means an account with no password, one bad `Hash::check` away from
     * admitting anybody. A known placeholder is a shared credential across every
     * account created this way.
     */
    protected static function booted(): void
    {
        static::creating(function (self $user): void {
            if (blank($user->password)) {
                $user->password = Hash::make(Str::random(64));
            }
        });

        /*
         * BELONGING TO YOUR OWN WORKSPACE IS AN INVARIANT, not a step someone
         * remembers. Every path that creates a user - the resource form, an
         * import, a seeder, a test factory - stamps `tenant_id`; the membership
         * row that says the same thing must appear with it, or the switcher
         * would one day tell this person their own workspace is off limits.
         */
        static::created(function (self $user): void {
            if ($user->tenant_id !== null) {
                $user->memberships()->syncWithoutDetaching([$user->tenant_id]);
            }
        });
    }

    /**
     * Whether any of this person's roles holds every ability.
     *
     * MEMOIZED PER INSTANCE, because `hasPermission()` is asked dozens of times
     * on a single page - seven abilities for every registered resource, to decide
     * which buttons exist. An `exists()` query per question is not one extra
     * query, it is dozens, and the N+1 guard caught exactly that when this was
     * first written against Spatie.
     *
     * The same mistake was made once before, against the hand-rolled roles table,
     * and caught by the same test. Worth noting that the guard has now paid for
     * itself twice on the same line of reasoning.
     */
    public function grantsEverything(): bool
    {
        return $this->grantsEverything ??= $this->roles()->where('grants_all', true)->exists();
    }

    /** Per-instance memo for grantsEverything(). */
    private ?bool $grantsEverything = null;

    /**
     * Answer `grantsEverything()` for a whole page of people at once.
     *
     * THE MEMO ABOVE IS PER INSTANCE, which is right for one person asked about
     * many times and useless for many people asked about once each. A list that
     * compares abilities per row - the users screen deciding where to offer
     * "Impersonate" - therefore paid one EXISTS per person listed, and the cost
     * grew with the page. The N+1 guard has now caught this same reasoning three
     * times, twice on this method.
     *
     * THE RELATION IS THE ONE `grantsEverything()` WOULD HAVE USED, loaded under
     * the team context `withPermissionsTeam()` sets. That is the whole reason
     * this is safe to do at all, and why it is here rather than in a query
     * written at the call site: Spatie scopes `roles` by the registrar's team id,
     * so a relation loaded under the wrong team - or a hand-written join that
     * reproduces the scoping approximately - answers a DIFFERENT question and
     * gets it wrong in the direction that grants access. Same relation, same
     * team, one query per tenant instead of one per person.
     *
     * GROUPED BY TENANT because the team id is per user. In a tenant-scoped list
     * that is one group and one query; the grouping exists so this cannot be
     * quietly wrong when somebody passes a mixed set.
     *
     * @param  iterable<mixed>  $users
     */
    public static function primeGrantsEverything(iterable $users): void
    {
        $people = collect($users)
            ->filter(static fn ($u): bool => $u instanceof self)
            ->filter(static fn (self $u): bool => $u->grantsEverything === null)
            ->values();

        if ($people->isEmpty()) {
            return;
        }

        $registrar = app(PermissionRegistrar::class);
        $previous = $registrar->getPermissionsTeamId();

        try {
            foreach ($people->groupBy('tenant_id') as $tenantId => $group) {
                $registrar->setPermissionsTeamId($tenantId === '' ? null : $tenantId);

                /*
                 * `load`, not `loadMissing`: anything already on the models was
                 * loaded under whatever team happened to be set at the time, and
                 * an authorisation answer must not depend on that.
                 */
                $group = new EloquentCollection($group->values()->all());
                $group->load('roles');

                foreach ($group as $person) {
                    $person->grantsEverything = $person->roles
                        ->contains(static fn ($role): bool => (bool) $role->grants_all);
                }
            }
        } finally {
            $registrar->setPermissionsTeamId($previous);
        }
    }

    /**
     * The FIRST account in this organisation, which cannot be deleted.
     *
     * The same reasoning as the first role: whatever else has been done, one
     * account is always left that can sign in. Without it a tenant can be
     * emptied of users entirely - the data remains, the panel works, and nobody
     * can open it, which is recoverable only from a console.
     *
     * Oldest by id rather than a flag, because a flag can be cleared, and it
     * would be cleared precisely when somebody is doing something drastic.
     */
    public function isProtected(): bool
    {
        return $this->getKey() === static::query()
            ->where('tenant_id', $this->tenant_id)
            ->orderBy('id')
            ->value('id');
    }

    /**
     * Whether this user may do `$ability`.
     *
     * DELEGATES TO SPATIE, and keeps the name because everything in the panel -
     * policies, tools, the channel callbacks - calls it. Swapping the storage
     * under one method was the point of having one method.
     *
     * NO ROLE STILL MEANS NO. Spatie returns false for a user with no roles and
     * no direct permissions, which is the same deny-by-default posture the
     * hand-rolled version had: a mis-provisioned account is locked out loudly
     * rather than silently handed everything.
     *
     * `grants_all` IS CHECKED FIRST because it is ours rather than Spatie's - a
     * role that holds every ability including ones invented later, so that
     * registering a resource cannot lock its administrators out of it.
     */
    public function hasPermission(string $ability): bool
    {
        /*
         * THE TEAM IS SET FROM THIS USER, not read from ambient state.
         *
         * Spatie filters roles by the team id held in the registrar, which a
         * request sets and a console command, queued job or test does not - so
         * without this the same person with the same roles is permitted inside a
         * request and denied everywhere else, with nothing at the call site to
         * explain why.
         *
         * That is the THIRD time this exact bug has appeared in this codebase:
         * once in the hand-rolled `hasPermission`, once in `Role::isProtected`,
         * and now here. A guard must not depend on ambient state.
         */
        return $this->withPermissionsTeam(fn (): bool => $this->resolvePermission($ability));
    }

    /** Run `$body` with this user's tenant as Spatie's team, then restore. */
    private function withPermissionsTeam(callable $body): mixed
    {
        $registrar = app(PermissionRegistrar::class);
        $previous = $registrar->getPermissionsTeamId();

        $registrar->setPermissionsTeamId($this->tenant_id);

        try {
            return $body();
        } finally {
            $registrar->setPermissionsTeamId($previous);
        }
    }

    private function resolvePermission(string $ability): bool
    {
        /*
         * `grants_all` COVERS ONLY ABILITIES THAT EXIST, and the check against
         * the registry is the point rather than a formality.
         *
         * Without it a superuser role returns true for ANY string - so a
         * misspelled ability in a policy passes for administrators and fails for
         * everybody else. It works for whoever wrote it, who is almost always an
         * administrator, and breaks for the people who actually use the panel:
         * the worst possible distribution of a bug.
         *
         * Restricting it to the registry costs nothing, because the registry IS
         * the definition of what an ability is. An unknown name now returns
         * false for everyone, which is discoverable.
         */
        if (in_array($ability, Abilities::all(), true) && $this->grantsEverything()) {
            return true;
        }

        /*
         * `hasPermissionTo` throws when the permission has never been created -
         * which happens for an ability declared in code but not yet synced. That
         * is a configuration gap, not an authorisation decision, and it must
         * resolve to "no" rather than to a 500 on every page.
         */
        try {
            return $this->hasPermissionTo($ability);
        } catch (PermissionDoesNotExist) {
            return false;
        }
    }
}
