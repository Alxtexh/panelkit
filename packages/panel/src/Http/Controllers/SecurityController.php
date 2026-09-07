<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Alxtexh\Panel\Auth\Devices;
use Alxtexh\Panel\Auth\EmailTwoFactor;
use Alxtexh\Panel\Auth\Passkeys;
use Alxtexh\Panel\Auth\PasswordPolicy;
use Alxtexh\Panel\Auth\SensitiveAction;
use Alxtexh\Panel\Auth\SocialProviders;
use Alxtexh\Panel\Http\Requests\TwoFactorStateRequest;
use Alxtexh\Panel\Models\ConnectedAccount;
use Alxtexh\Panel\PanelManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Everything about getting into this account, on one screen.
 *
 * THE PIECES WERE ALL PACKAGED AND THE SCREEN WAS NOT, which is the failure this
 * closes. `ManagePasskeys`, `ManageTwoFactor`, `TwoFactorSetupModal` and
 * `TwoFactorRecoveryCodes` have shipped in the npm package since 0.6, and
 * nothing in any installation but the reference application mounted a single one
 * of them. A component in `node_modules` that no route renders is indisting-
 * uishable, from the outside, from a feature that was never built.
 *
 * ONE SCREEN, NOT FOUR. Password, second factor, passkeys, connected accounts
 * and signed-in devices are one question - "who can get into this account" - and
 * somebody who reaches for any of them is already worried. Splitting them across
 * tabs means half of it gets audited.
 *
 * EVERY SECTION IS OPTIONAL AND SAYS SO HONESTLY. Two-factor needs Fortify,
 * passkeys need it too, connected accounts need a configured provider, and
 * listing other devices needs the database session driver. Each is asked rather
 * than assumed. The current device is always shown while authenticated; an
 * absent listing capability gets an honest note rather than a 500 or a lie.
 */
final class SecurityController
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $props = [
            /*
             * PASSWORD RULES GO TO THE BROWSER as the `passwordrules` attribute,
             * which is what tells a password manager to GENERATE something that
             * will pass. Without it the manager offers its own default, the
             * server rejects it, and the person blames the panel.
             */
            'passwordRules' => PasswordPolicy::complexityHint(Password::defaults()),

            /*
             * Current device is always present while authenticated. Other
             * devices need the database session driver - see Devices.
             */
            'devices' => Devices::forUser($request),
            'canListOtherDevices' => Devices::available(),

            /*
             * WHICH PROVIDERS COULD BE ATTACHED, and which already are. Both are
             * needed: the screen offers what is missing and lists what is there,
             * and sending only the second would leave nothing to connect from.
             */
            'socialProviders' => SocialProviders::enabled(),
            'connectedAccounts' => self::connectedAccounts(
                $user?->getAuthIdentifier(),
                app(PanelManager::class)->currentPanel()?->getGuard()
                    ?? (string) config('auth.defaults.guard', 'web'),
            ),

            /*
             * SERIALISED BY THE PACKAGE, so every panel that shows passkeys
             * shows the same fields under the same names - and answers honestly
             * when Fortify is absent, so this screen renders without the section
             * rather than failing to render.
             */
            'canManagePasskeys' => Passkeys::available($user),
            'passkeys' => Passkeys::forUser($user),
            'canManageEmailTwoFactor' => EmailTwoFactor::enabled($user) || self::emailTwoFactorAvailable($user),
            'emailTwoFactorEnabled' => EmailTwoFactor::enabled($user),
        ];

        return Inertia::render('settings/Security', $props + self::twoFactor($request));
    }

    /**
     * Change the password.
     *
     * THE CURRENT ONE IS REQUIRED, and that is not ceremony. Every other control
     * on this screen is reachable by whoever is sitting at an unlocked laptop;
     * asking for the password is what stops that person quietly changing it to
     * one they know and keeping the account.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        /*
         * THE CURRENT-PASSWORD CHECK IS A PASSWORD ORACLE WITHOUT A BUDGET.
         * Signing in is throttled; this asks the same question from inside an
         * already-authenticated session, so leaving it unlimited hands anybody
         * who reaches a borrowed or hijacked session an unmetered guessing
         * machine against the password itself.
         */
        SensitiveAction::assertNotExhausted($request, 'password.confirm', 'current_password');

        $user = $request->user();

        if ($user === null || ! Hash::check($validated['current_password'], (string) $user->getAuthPassword())) {
            SensitiveAction::recordFailure($request, 'password.confirm');

            return back()->withErrors(['current_password' => __('That is not your current password.')]);
        }

        // Proven. A correct answer must not leave somebody rate-limited out of
        // their own settings.
        SensitiveAction::clear($request, 'password.confirm');

        /*
         * THE SAME REFUSAL AS THE RENEWAL SCREEN, because this is the other way
         * to change a password and a rule enforced at one entrance is not
         * enforced. Somebody caught by the age policy who happens to be on the
         * settings page would otherwise satisfy it by re-entering what they
         * already had.
         */
        $policy = PasswordPolicy::fromConfig();

        if ($policy->isReused($user, $validated['password'])) {
            throw ValidationException::withMessages([
                'password' => __('That is one of your recent passwords. Choose a different one.'),
            ]);
        }

        // Before the save, so the history holds the password being replaced -
        // see `PasswordPolicy::recordChange`.
        $policy->recordChange($user);

        /*
         * THE REMEMBER TOKEN IS CYCLED WITH THE PASSWORD, and leaving it alone
         * undid the sign-out below.
         *
         * Sign-in issues a "remember me" recaller cookie, and `SessionGuard`
         * re-authenticates from it whenever the session is gone - validating
         * ONLY `remember_token`, which nothing here touched. So an attacker
         * holding a stolen recaller lost their session row to
         * `Devices::forgetOthers()` and was transparently signed back in on
         * their very next request, by the framework, using a token the password
         * change had not invalidated.
         *
         * That is the precise scenario this screen exists for - "somebody may
         * have my password" - answered with a message saying every other device
         * was signed out.
         */
        $user->forceFill([
            'password' => Hash::make($validated['password']),
            'remember_token' => Str::random(60),
        ])->save();

        /*
         * EVERY OTHER SESSION GOES. A password change is most often a response
         * to "somebody may have my password", and leaving their existing
         * sessions alive answers the wrong half of that: the new password locks
         * the front door while whoever is already inside stays inside.
         */
        Devices::forgetOthers($request);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Password updated. Every other device was signed out.')]);

        return back();
    }

    /** Sign one device out. */
    public function destroyDevice(Request $request, string $id): RedirectResponse
    {
        if (! Devices::forget($request, $id)) {
            throw new NotFoundHttpException('No such session.');
        }

        return back()->with('success', __('That device was signed out.'));
    }

    /** Sign out everywhere but here. */
    public function destroyOtherDevices(Request $request): RedirectResponse
    {
        Devices::forgetOthers($request);

        return back()->with('success', __('Every other device was signed out.'));
    }

    public function enableEmailTwoFactor(Request $request): RedirectResponse
    {
        $user = $request->user();

        abort_if($user === null || ! self::emailTwoFactorAvailable($user), 404);

        EmailTwoFactor::enable($user);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Email codes are on. The next sign-in will send one.')]);

        return back();
    }

    public function disableEmailTwoFactor(Request $request): RedirectResponse
    {
        $user = $request->user();

        abort_if($user === null, 404);

        EmailTwoFactor::disable($user);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Email codes are off.')]);

        return back();
    }

    /**
     * @return list<array<string, mixed>>
     */
    /**
     * SCOPED BY GUARD AS WELL AS BY ID, because `user_id` alone names no table.
     *
     * With two guards in play, an id belongs to two different populations. This
     * screen listed the provider, EMAIL ADDRESS and nickname of whoever held
     * the same id under the other guard - so a customer saw an operator's
     * connected Google account, and the delete button next to it worked.
     *
     * @return list<array<string, mixed>>
     */
    private static function connectedAccounts(mixed $userId, string $guard): array
    {
        if ($userId === null || SocialProviders::enabled() === []) {
            return [];
        }

        return array_values(ConnectedAccount::query()
            ->where('guard', $guard)
            ->where('user_id', $userId)
            ->orderBy('provider')
            ->get()
            ->map(static fn (ConnectedAccount $a): array => [
                'id' => $a->id,
                'provider' => $a->provider,
                'label' => SocialProviders::label($a->provider),
                'email' => $a->email,
                'nickname' => $a->nickname,
                'lastUsedAt' => $a->last_used_at?->toIso8601String(),
            ])
            ->all());
    }

    /**
     * The two-factor props, or none at all when Fortify is not installed.
     *
     * ASKED THROUGH `class_exists` RATHER THAN ASSUMED. Fortify is a suggestion
     * of this package, not a requirement, and referring to its `Features` class
     * unconditionally turns an optional feature into a fatal error on every
     * installation that declined it.
     *
     * THE STATE IS SETTLED BEFORE IT IS REPORTED. An enrolment that was started
     * and abandoned leaves a secret issued and `two_factor_confirmed_at` null;
     * reading the flags without first running Fortify's transitions would show
     * that account as having a second factor it cannot be challenged for. See
     * `TwoFactorStateRequest` for why this is resolved rather than type-hinted.
     *
     * @return array<string, mixed>
     */
    private static function twoFactor(Request $request): array
    {
        $features = '\Laravel\Fortify\Features';
        $user = $request->user();

        if ($user === null || ! class_exists($features)) {
            return ['canManageTwoFactor' => false];
        }

        if (! $features::canManageTwoFactorAuthentication()) {
            return ['canManageTwoFactor' => false];
        }

        if ($request->hasSession()) {
            app(TwoFactorStateRequest::class)->ensureStateIsValid();

            // Re-read: the call above can DISABLE a half-finished enrolment, and
            // reporting the flags captured before it would show the secret it
            // just cleared.
            $user = $request->user();

            if ($user === null) {
                return ['canManageTwoFactor' => false];
            }
        }

        return [
            'canManageTwoFactor' => true,
            'twoFactorEnabled' => method_exists($user, 'hasEnabledTwoFactorAuthentication')
                ? $user->hasEnabledTwoFactorAuthentication()
                : $user->getAttribute('two_factor_confirmed_at') !== null,
            'requiresConfirmation' => $features::optionEnabled($features::twoFactorAuthentication(), 'confirm'),
        ];
    }

    private static function emailTwoFactorAvailable(?\Illuminate\Contracts\Auth\Authenticatable $user): bool
    {
        return $user !== null && \Illuminate\Support\Facades\Schema::hasColumn($user->getTable(), 'email_two_factor_confirmed_at');
    }
}
