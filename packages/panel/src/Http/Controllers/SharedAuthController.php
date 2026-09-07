<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Alxtexh\Panel\Auth\EmailTwoFactor;
use Alxtexh\Panel\Auth\Mfa;
use Alxtexh\Panel\Auth\Turnstile;
use Alxtexh\Panel\Auth\TwoFactor;
use Alxtexh\Panel\Panel;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\PanelHome;
use Alxtexh\Panel\Support\PanelIdleActivity;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ONE SIGN-IN PAGE, MULTIPLE PANELS.
 *
 * WHY THIS EXISTS ALONGSIDE `PanelAuthController`. The per-panel controller is
 * excellent when each portal has its own door: `/admin/login` authenticates
 * against the admin guard, `/client/login` against the client guard, and there
 * is no ambiguity about which panel a request belongs to.
 *
 * The ambiguity arrives the moment two user populations share a login URL. A
 * SaaS with both operators and end-users is the common case: the platform wants
 * one `/login` that decides by credential rather than by path. Sending operators
 * to `/admin/login` and clients to `/client/login` works technically but shifts
 * the routing decision onto the user, which is the decision they cannot make
 * before they have signed in.
 *
 * CREDENTIAL-BASED ROUTING, NOT PATH-BASED. POST to the shared endpoint tries
 * each participating panel's guard in the order they were declared. The first
 * that accepts the credentials owns the session and provides the redirect target.
 *
 * REGISTRATION ORDER IS THE PRIORITY ORDER. If the same account exists in two
 * guards - an unusual but possible state when an admin is also a customer - the
 * guard for the panel declared first wins. That panel's administrators have agreed
 * to that registration order; it is not a surprise.
 *
 * NO PASSWORD RESET AT THE SHARED ENDPOINT. Reset is broker-specific: each guard
 * has its own token table and its own mail template. A shared reset page would
 * need to know which broker to use before the user authenticates, and the only
 * signal is the email address - which must not be used as an account-existence
 * oracle. Each panel's own `/prefix/forgot-password` does the right thing; the
 * shared login page simply omits the link.
 *
 * NO SOCIAL SIGN-IN. Provider redirects are panel-specific: they must sign into a
 * particular guard and land on a particular panel's home. Wiring them from a
 * shared page requires per-provider, per-panel buttons - a matrix that grows with
 * both dimensions. Leave it to the per-panel login for now.
 *
 * RATE LIMITING COVERS ALL GUARDS IN ONE BUDGET. A key on email+ip hitting the
 * limit blocks all further attempts regardless of guard, so exhausting the budget
 * against one guard does not give a free pass to the others.
 */
final class SharedAuthController extends Controller
{
    public function showLogin(Request $request): Response
    {
        return Inertia::render('panel/auth/Login', [
            /*
             * THE APP NAME, not the panel brand. No panel is active here -
             * the shared route carries no `UsePanel` middleware - so there is
             * no brand to resolve. `AuthLayout` falls through `panel.brand →
             * name → 'Panel'`; passing `name` here satisfies the second step
             * so the heading says something real.
             */
            'name' => config('app.name', 'Panel'),

            'action' => $request->url(),

            /*
             * NO FORGOT-PASSWORD LINK. See the class docblock for why the
             * shared endpoint does not offer one. Each panel's own login page
             * does, and a user who needs a reset can reach it.
             */
            'forgotUrl' => null,

            'status' => $request->session()->get('status'),

            'turnstileSiteKey' => Turnstile::enabled() ? Turnstile::siteKey() : null,

            /*
             * PASSKEYS AND SOCIAL ARE PER-PANEL. Neither can be offered from
             * a shared page without knowing in advance which guard will handle
             * the credential. Setting them null means the components render
             * nothing rather than broken buttons.
             */
            'passkeys' => null,
            'socialProviders' => [],
        ]);
    }

    /**
     * Attempt sign-in across every participating panel.
     *
     * The first guard that accepts the credentials ends the loop; all subsequent
     * guards are never tried. The user lands on the matched panel's home - or on
     * the `url.intended` entry IF it belongs to that panel's path prefix.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $key = Str::transliterate(Str::lower($credentials['email']).'|'.$request->ip());
        $max = max(1, (int) config('panel.auth.max_attempts', 5));

        if (RateLimiter::tooManyAttempts($key, $max)) {
            throw ValidationException::withMessages([
                'email' => __('auth.throttle', [
                    'seconds' => $seconds = RateLimiter::availableIn($key),
                    'minutes' => (int) ceil($seconds / 60),
                ]),
            ]);
        }

        foreach ($this->panels($request) as $panel) {
            $user = $this->userFromCredentials($panel, $credentials);

            if ($user === null) {
                continue;
            }

            RateLimiter::clear($key);

            if (Mfa::shouldChallenge($panel, $user)) {
                return Mfa::begin(
                    $request,
                    $panel,
                    $user,
                    $request->boolean('remember'),
                    $this->challengeUrl($request, $panel),
                );
            }

            Mfa::complete($request, $panel, $user, $request->boolean('remember'));

            return redirect($this->destination($request, $panel));
        }

        RateLimiter::hit($key, (int) config('panel.auth.decay_seconds', 60));

        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }

    public function showTwoFactorChallenge(Request $request): Response|RedirectResponse
    {
        $panel = $this->pendingPanel($request);
        $user = $panel === null ? null : $this->challengedUser($request, $panel);

        if ($panel === null || $user === null) {
            return redirect($this->sharedBase($request));
        }

        return Inertia::render('panel/auth/TwoFactorChallenge', [
            'action' => rtrim($this->sharedBase($request), '/').'/two-factor-challenge',
            'method' => EmailTwoFactor::method($request),
            'resendUrl' => EmailTwoFactor::method($request) === EmailTwoFactor::METHOD_EMAIL
                ? rtrim($this->sharedBase($request), '/').'/two-factor-challenge/email'
                : null,
            'sentTo' => EmailTwoFactor::method($request) === EmailTwoFactor::METHOD_EMAIL
                ? EmailTwoFactor::maskedAddress($user)
                : null,
            'status' => $request->session()->get('status'),
            'turnstileSiteKey' => Turnstile::enabled() ? Turnstile::siteKey() : null,
        ]);
    }

    public function resendEmailTwoFactor(Request $request): RedirectResponse
    {
        $panel = $this->pendingPanel($request);
        $user = $panel === null ? null : $this->challengedUser($request, $panel);

        if ($panel === null || $user === null) {
            return redirect($this->sharedBase($request));
        }

        if (! EmailTwoFactor::enabled($user)) {
            return redirect($this->challengeUrl($request, $panel));
        }

        EmailTwoFactor::send($request, $user);

        return back()->with('status', 'A new code is on its way.');
    }

    public function twoFactorChallenge(Request $request): RedirectResponse
    {
        $panel = $this->pendingPanel($request);
        $user = $panel === null ? null : $this->challengedUser($request, $panel);

        if ($panel === null || $user === null) {
            return redirect($this->sharedBase($request));
        }

        $key = 'two-factor|'.$user->getAuthIdentifier().'|'.$request->ip();
        $max = max(1, (int) config('panel.auth.max_attempts', 5));

        if (RateLimiter::tooManyAttempts($key, $max)) {
            throw ValidationException::withMessages([
                'code' => __('auth.throttle', [
                    'seconds' => $seconds = RateLimiter::availableIn($key),
                    'minutes' => (int) ceil($seconds / 60),
                ]),
            ]);
        }

        $code = (string) $request->input('code', '');
        $recovery = (string) $request->input('recovery_code', '');
        $method = EmailTwoFactor::method($request);

        if ($method === EmailTwoFactor::METHOD_EMAIL) {
            if (! EmailTwoFactor::verify($request, $code)) {
                RateLimiter::hit($key, (int) config('panel.auth.decay_seconds', 60));

                throw ValidationException::withMessages([
                    'code' => __('The provided two factor authentication code was invalid.'),
                ]);
            }
        } elseif ($recovery !== '') {
            $matched = TwoFactor::verifyRecovery($user, $recovery);

            if ($matched === null) {
                RateLimiter::hit($key, (int) config('panel.auth.decay_seconds', 60));

                throw ValidationException::withMessages([
                    'recovery_code' => __('The provided two factor authentication code was invalid.'),
                ]);
            }

            TwoFactor::consumeRecovery($user, $matched);
        } elseif (! TwoFactor::verifyCode($user, $code)) {
            RateLimiter::hit($key, (int) config('panel.auth.decay_seconds', 60));

            throw ValidationException::withMessages([
                'code' => __('The provided two factor authentication code was invalid.'),
            ]);
        }

        RateLimiter::clear($key);

        $remember = TwoFactor::remember($request);
        Mfa::complete($request, $panel, $user, $remember);

        return redirect($this->destination($request, $panel));
    }

    /**
     * WHERE SIGNING IN LANDS YOU.
     *
     * Mirrors `PanelAuthController::destination()`: honour `url.intended` only
     * when the intended URL belongs to the panel we just authenticated against.
     * A URL intended for a different panel is discarded - it would send the user
     * somewhere they have not authenticated for, which means an immediate bounce
     * back to a login screen.
     */
    private function destination(Request $request, Panel $panel): string
    {
        $intended = $request->session()->pull('url.intended');

        if (! is_string($intended) || $intended === '') {
            return PanelHome::urlFor($panel);
        }

        $path = '/'.ltrim((string) parse_url($intended, PHP_URL_PATH), '/');

        if (PanelIdleActivity::isLockScreenPath($path)) {
            return PanelHome::urlFor($panel);
        }

        $prefix = '/'.trim($panel->getPath(), '/');

        $belongs = $prefix === '/'
            ? true
            : ($path === $prefix || str_starts_with($path, rtrim($prefix, '/').'/'));

        return $belongs ? $intended : PanelHome::urlFor($panel);
    }

    /** @param array<string, mixed> $credentials */
    private function userFromCredentials(Panel $panel, array $credentials): ?Authenticatable
    {
        $provider = Auth::guard($panel->getGuard())->getProvider();
        $user = $provider->retrieveByCredentials($credentials);

        if ($user === null || ! $provider->validateCredentials($user, ['password' => $credentials['password']])) {
            return null;
        }

        if (config('hashing.rehash_on_login', true)) {
            $provider->rehashPasswordIfRequired($user, ['password' => $credentials['password']]);
        }

        return $user;
    }

    private function challengedUser(Request $request, Panel $panel): ?Authenticatable
    {
        $provider = Auth::guard($panel->getGuard())->getProvider();
        $model = method_exists($provider, 'getModel') ? $provider->getModel() : '';

        if (! is_string($model) || $model === '') {
            return null;
        }

        return TwoFactor::challengedUser($request, $model);
    }

    private function pendingPanel(Request $request): ?Panel
    {
        $id = TwoFactor::panelId($request);

        if ($id === null) {
            return null;
        }

        foreach ($this->panels($request) as $panel) {
            if ($panel->id === $id) {
                return $panel;
            }
        }

        return null;
    }

    /**
     * Prefer the panel's own challenge URL so UsePanel brands the screen.
     * Shared-only portals stay on this path.
     */
    private function challengeUrl(Request $request, Panel $panel): string
    {
        if ($panel->hasLogin()) {
            return '/'.trim($panel->getPath().'/two-factor-challenge', '/');
        }

        return rtrim($this->sharedBase($request), '/').'/two-factor-challenge';
    }

    private function sharedBase(Request $request): string
    {
        $path = '/'.ltrim((string) parse_url($request->url(), PHP_URL_PATH), '/');

        return preg_replace('#/two-factor-challenge/?$#', '', $path) ?: '/';
    }

    /** @return list<Panel> */
    private function panels(Request $request): array
    {
        $ids = (array) ($request->route()?->defaults['panels'] ?? []);
        $manager = app(PanelManager::class);

        return array_values(array_filter(
            array_map(static fn (string $id): ?Panel => $manager->panel($id), $ids),
        ));
    }
}
