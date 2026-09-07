<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Alxtexh\Panel\Audit\AuditRecorder;
use Alxtexh\Panel\Support\Abilities;
use Alxtexh\Panel\Support\Ability;
use Alxtexh\Panel\Support\TenantContext;
use RuntimeException;

/**
 * Signing in as somebody else, on purpose, and getting back out.
 *
 * IMPERSONATION IS A PRIVILEGE-ESCALATION PRIMITIVE unless it is fenced, and
 * every rule below exists because without it the feature hands an operator a
 * quiet way to become someone more powerful than they are. The support case it
 * is built for - "the customer says the page is blank, let me look" - is served
 * by all of these restrictions; the attack is not.
 *
 * THE FENCES, and none of them is decoration:
 *
 *   ONE ABILITY OF ITS OWN. `impersonate_users` is separate from managing users,
 *   because seeing somebody's data as them is a different act from editing their
 *   account, and an organisation must be able to grant one without the other.
 *
 *   NEVER UPWARD. You cannot become someone who holds an ability you do not.
 *   Otherwise the whole permission system is advisory: anybody with this ability
 *   simply impersonates an administrator and does the thing they were denied.
 *   This is the rule that makes impersonation safe to grant at all.
 *
 *   NEVER ACROSS TENANTS. Enforced here as well as by the resolver, because a
 *   session that begins in one organisation and continues in another is the one
 *   outcome the entire tenancy design exists to prevent.
 *
 *   NEVER NESTED. Impersonating while impersonating would make "who is really
 *   doing this" a stack rather than a fact, and the return path ambiguous.
 *
 *   ALWAYS AUDITED, AT BOTH ENDS. A start with no stop is how a session that
 *   was never handed back looks in the record.
 *
 * THE SESSION ID IS REGENERATED ON BOTH TRANSITIONS. Reusing it would leave one
 * identifier meaning two different people over its lifetime, which is fixation
 * in the one place where the application itself is doing the swapping.
 *
 * WHAT THIS CLASS DOES NOT DO is decide what an impersonator may then change -
 * see `BlockImpersonatedCredentialChanges`. Freezing credentials is a rule about
 * REQUESTS, not about the act of impersonating, and putting it here would mean
 * every caller had to remember it.
 */
final class Impersonation
{
    /** The real user's id, parked while somebody else is being worn. */
    public const SESSION_KEY = 'panel.impersonator';

    /** When it started, for the banner and for the audit trail. */
    public const STARTED_KEY = 'panel.impersonator_since';

    /**
     * True while this class is swapping who is signed in.
     *
     * BECAUSE BECOMING SOMEBODY IS NOT THAT PERSON SIGNING IN. `auth()->login()`
     * fires `Illuminate\Auth\Events\Login`, the same event a real sign-in
     * fires, and nothing in that event says which of the two happened. A
     * listener that records "last seen" would therefore stamp a CUSTOMER's
     * account every time an operator looked at their screen - and that column
     * is exactly what somebody later reads to decide whether an account is
     * still in use, or to answer "was this person online when it happened".
     *
     * The return leg is suppressed for the same reason: the operator did not
     * sign in again, they stopped wearing somebody else.
     *
     * A flag rather than a session key, because it is true for the duration of
     * one method call and must not survive it. `isImpersonating()` cannot serve
     * here - by the time `stop()` logs the original back in, it has already
     * been cleared.
     */
    private static bool $switching = false;

    /** Whether a login happening right now is an impersonation swap. */
    public static function isSwitching(): bool
    {
        return self::$switching;
    }

    /** @param callable(): void $swap */
    private static function whileSwitching(callable $swap): void
    {
        self::$switching = true;

        try {
            $swap();
        } finally {
            self::$switching = false;
        }
    }

    public function __construct(private readonly Request $request) {}

    public function isActive(): bool
    {
        return $this->request->session()->has(self::SESSION_KEY);
    }

    /** The real person, or null when nobody is being impersonated. */
    public function impersonator(): ?Authenticatable
    {
        $id = $this->request->session()->get(self::SESSION_KEY);

        if (! is_int($id) && ! is_string($id)) {
            return null;
        }

        $user = $this->users()->whereKey($id)->first();

        return $user instanceof Authenticatable ? $user : null;
    }

    /**
     * Whether `$actor` may become `$target`.
     *
     * SEPARATE FROM `start()` so the UI can ask the same question the server
     * will answer, and get the same answer. A button that offers an action the
     * server refuses teaches people the panel is unreliable; a button that is
     * absent because the server said so cannot disagree with it.
     */
    public function allows(Authenticatable $actor, Authenticatable $target): bool
    {
        return $this->refusalFor($actor, $target) === null;
    }

    /** Why `$actor` may not become `$target`, or null if they may. */
    public function refusalFor(Authenticatable $actor, Authenticatable $target): ?string
    {
        if ($this->isActive()) {
            return 'You are already impersonating somebody.';
        }

        if ($actor->getAuthIdentifier() === $target->getAuthIdentifier()) {
            return 'You are already yourself.';
        }

        if (! $this->can($actor, 'impersonate_users')) {
            return 'You may not impersonate.';
        }

        /*
         * TENANT EQUALITY IS CHECKED ON THE RECORDS, not inferred from the
         * request's tenant. A guard that trusts ambient state is a guard that
         * stops working the moment something forgets to set it - which has
         * happened three times in this codebase already.
         */
        $column = app(TenantContext::class)->column();

        if ($actor->getAttribute($column) !== $target->getAttribute($column)) {
            return 'That account belongs to another organisation.';
        }

        /*
         * THE UPWARD CHECK, and the reason it compares ABILITIES rather than
         * roles or a rank column: roles are named by each organisation and a
         * rank is a number somebody has to remember to keep honest. What
         * actually matters is whether the target can do anything the actor
         * cannot - if so, becoming them is an escalation however it is labelled.
         */
        if ($this->grantsMoreThan($target, $actor)) {
            return 'That account can do things you cannot.';
        }

        return null;
    }

    /**
     * Become `$target`.
     *
     * @throws RuntimeException when refused - callers must ask `allows()` first,
     *                          and this is the backstop for the ones that do not.
     */
    public function start(Authenticatable $actor, Authenticatable $target): void
    {
        $refusal = $this->refusalFor($actor, $target);

        if ($refusal !== null) {
            throw new RuntimeException($refusal);
        }

        // AUDITED BEFORE THE SWAP, so the entry is attributed to the real
        // person. Recording it afterwards would credit the impersonated account
        // with starting its own impersonation.
        $this->audit($target, 'impersonation.started');

        $session = $this->request->session();

        $session->put(self::SESSION_KEY, $actor->getAuthIdentifier());
        $session->put(self::STARTED_KEY, now()->toIso8601String());

        self::whileSwitching(static fn () => auth()->login($target));
        $session->regenerate();
    }

    /** Hand the session back. Safe to call when nothing is being impersonated. */
    public function stop(): void
    {
        if (! $this->isActive()) {
            return;
        }

        $session = $this->request->session();
        $original = $this->users()->find($session->get(self::SESSION_KEY));

        // Audited while still wearing the other account, so the entry records
        // which impersonation ended rather than merely that one did.
        $this->audit(auth()->user(), 'impersonation.stopped');

        $session->forget([self::SESSION_KEY, self::STARTED_KEY]);

        /*
         * A MISSING ORIGINAL ENDS THE SESSION ENTIRELY. The real account was
         * deleted while its owner was impersonating somebody; the one thing that
         * must not happen is being left signed in as the target with no way back
         * and no marker saying so.
         */
        if ($original === null) {
            auth()->logout();
            $session->invalidate();

            return;
        }

        self::whileSwitching(static fn () => auth()->login($original));
        $session->regenerate();
    }

    /** @param array<string, mixed> $_ */
    private function audit(?Authenticatable $subject, string $event): void
    {
        if ($subject instanceof Model) {
            app(AuditRecorder::class)->record($subject, $event);
        }
    }

    /**
     * @var array<string, bool> "id|ability" => held
     */
    private array $abilityCache = [];

    /**
     * MEMOISED FOR THIS INSTANCE, which is one request's worth.
     *
     * `hasPermission` is an EXISTS against the role tables every time it is
     * asked - it does not use a loaded relation - and the two callers ask it a
     * great many times. `grantsMoreThan` walks the whole ability registry, so a
     * single comparison of two people is two queries per registered ability;
     * and a list that offers "Impersonate" per row asks the same question about
     * the same actor once for every person on the page.
     *
     * A grant cannot change between the start and end of one request, so the
     * cached answer is the same answer. It is deliberately NOT static: a
     * long-lived worker would then serve a decision about somebody's permissions
     * made before those permissions were edited, which is precisely the kind of
     * staleness an authorisation check must never have.
     */
    private function can(Authenticatable $user, string $ability): bool
    {
        $key = $user->getAuthIdentifier().'|'.$ability;

        return $this->abilityCache[$key] ??= Ability::allows($user, $ability);
    }

    /**
     * Does `$a` hold any ability `$b` does not?
     *
     * Compared over the WHOLE registry rather than a curated list of "dangerous"
     * abilities, because a curated list is a list somebody has to remember to
     * extend, and the one they forget is the one that matters.
     */
    private function grantsMoreThan(Authenticatable $a, Authenticatable $b): bool
    {
        foreach (Abilities::all() as $ability) {
            if ($this->can($a, $ability) && ! $this->can($b, $ability)) {
                return true;
            }
        }

        return false;
    }

    /** @return Builder<Model> */
    private function users()
    {
        $model = config('auth.providers.users.model');

        return $model::query();
    }
}
