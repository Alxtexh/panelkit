<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Auth;

use Alxtexh\Panel\Panel;
use Laravel\Socialite\Facades\Socialite;

/**
 * Which sign-in providers this installation actually has, and what to call them.
 *
 * MOVED FROM THE REFERENCE APP unchanged. It was `App\Support\SocialProviders`
 * and there is nothing about it that belongs to an ISP - which is why the demo's
 * login had working provider buttons and a generated portal had none.
 *
 * THE SUPPORTED LIST IS EXTENDED FROM CONFIG, so an application that wires a
 * fourth provider through Socialite gets a button without editing the package.
 * It still has to say whether that provider verifies addresses - see below.
 *
 * WHEN SOCIALITE IS ON, THE LOGIN UI LISTS CONFIGURED PROVIDERS ONLY. Credentials
 * gate both the button list and the OAuth exchange (`enabled()` /
 * `hasCredentials()`). Set `panel.auth.social.show_unconfigured` to true to
 * show the full packaged catalogue with muted buttons that explain missing
 * `.env` keys (kit showcase / demo).
 *
 * SOCIALITE IS A SOFT DEPENDENCY. `class_exists` here is what keeps a missing
 * `laravel/socialite` from turning a configured client id into a 500: no class,
 * no buttons, no routes. Composer `suggest` names the package; this is the
 * runtime half of the same decision.
 */
final class SocialProviders
{
    /** @var array<string, string> provider key => human name */
    private const SUPPORTED = [
        'google' => 'Google',
        'github' => 'GitHub',
        'gitlab' => 'GitLab',
        'bitbucket' => 'Bitbucket',
        'facebook' => 'Facebook',
        'linkedin' => 'LinkedIn',
        'linkedin-openid' => 'LinkedIn',
        'microsoft' => 'Microsoft',
        'apple' => 'Apple',
        'twitter' => 'X',
        'x' => 'X',
        'discord' => 'Discord',
        'slack' => 'Slack',
        'twitch' => 'Twitch',
    ];

    /**
     * Keys shown on the login screen when socialite is enabled.
     *
     * ALIASES ARE COLLAPSED HERE so the screen does not render two "LinkedIn"
     * or two "X" buttons. `linkedin-openid` and `twitter` remain in SUPPORTED
     * for credentials and callbacks; they appear on login only when the panel
     * allowlist names them explicitly.
     *
     * @var list<string>
     */
    private const LOGIN_CATALOGUE = [
        'google',
        'github',
        'gitlab',
        'bitbucket',
        'facebook',
        'linkedin',
        'microsoft',
        'apple',
        'x',
        'discord',
        'slack',
        'twitch',
    ];

    /**
     * Whether `laravel/socialite` is actually loaded.
     *
     * CREDENTIALS WITHOUT THE PACKAGE ARE NOT A PROVIDER. Offering a button
     * that fatals on click is worse than no button.
     */
    public static function installed(): bool
    {
        return class_exists(Socialite::class);
    }

    /**
     * Whether the login UI lists providers that lack client id / secret.
     *
     * DEFAULT FALSE so only providers with real credentials appear. Set
     * `PANEL_SOCIAL_SHOW_UNCONFIGURED=true` (or the config key) when a demo
     * needs the full catalogue with muted unconfigured buttons.
     */
    public static function showUnconfigured(): bool
    {
        return (bool) config('panel.auth.social.show_unconfigured', false);
    }

    /**
     * Every provider this installation might offer, package list plus config.
     *
     * @param list<mixed>|null $extra
     * @return array<string, string>
     */
    private static function supported(?array $extra = null): array
    {
        $named = array_merge(self::SUPPORTED, (array) config('panel.auth.social.providers', []));

        if ($extra === null) {
            return $named;
        }

        foreach ($extra as $key) {
            if (! is_string($key) || $key === '') {
                continue;
            }

            $named[$key] = $named[$key] ?? self::label($key);
        }

        return $named;
    }

    /**
     * Providers listed on the login UI for this panel (or the app-wide door).
     *
     * WITH `show_unconfigured` OFF (the default), this matches `enabled()`:
     * credentials only. WITH IT ON, this is the packaged catalogue (plus
     * config extras), narrowed by `->socialite([...])` when set.
     *
     * @return array<string, string>
     */
    public static function offered(?Panel $panel = null): array
    {
        if (! self::installed()) {
            return [];
        }

        $only = $panel?->socialiteAllowlist();

        if ($only === []) {
            return [];
        }

        if (! self::showUnconfigured()) {
            return self::enabled($panel);
        }

        $named = self::supported($only);
        $out = [];

        if ($only !== null) {
            foreach ($only as $key) {
                if (isset($named[$key])) {
                    $out[$key] = $named[$key];
                }
            }

            return $out;
        }

        foreach (self::LOGIN_CATALOGUE as $key) {
            if (isset($named[$key])) {
                $out[$key] = $named[$key];
            }
        }

        foreach ($named as $key => $label) {
            if (isset($out[$key]) || in_array($key, ['linkedin-openid', 'twitter'], true)) {
                continue;
            }

            $out[$key] = $label;
        }

        return $out;
    }

    /**
     * Providers with credentials configured, optionally restricted to one panel.
     *
     * A PANEL MAY NARROW THE LIST with `->socialite(['google', 'github'])`.
     * `->socialite(false)` offers none. Credentials still decide whether the
     * OAuth exchange can start; the login UI may list more via `offered()`.
     *
     * @return array<string, string>
     */
    public static function enabled(?Panel $panel = null): array
    {
        if (! self::installed()) {
            return [];
        }

        $only = $panel?->socialiteAllowlist();

        if ($only === []) {
            return [];
        }

        $out = [];

        foreach (self::supported($only) as $key => $label) {
            if ($only !== null && ! in_array($key, $only, true)) {
                continue;
            }

            if (self::hasCredentials($key)) {
                $out[$key] = $label;
            }
        }

        return $out;
    }

    public static function hasCredentials(string $provider): bool
    {
        return filled(config("services.{$provider}.client_id"))
            && filled(config("services.{$provider}.client_secret"));
    }

    public static function isEnabled(string $provider, ?Panel $panel = null): bool
    {
        return array_key_exists($provider, self::enabled($panel));
    }

    public static function isOffered(string $provider, ?Panel $panel = null): bool
    {
        return array_key_exists($provider, self::offered($panel));
    }

    public static function label(string $provider): string
    {
        return self::supported()[$provider] ?? ucfirst($provider);
    }

    /**
     * What to tell an operator who clicks a button with no OAuth keys.
     */
    public static function credentialsHint(string $provider): string
    {
        $env = strtoupper(str_replace('-', '_', $provider));

        return "Set {$env}_CLIENT_ID and {$env}_CLIENT_SECRET in .env";
    }

    /**
     * Whether this provider's asserted email may be trusted to identify a
     * person who has not linked yet.
     *
     * THE WHOLE ACCOUNT-TAKEOVER QUESTION IS HERE. Matching a provider's email
     * against a panel account means whoever controls that address at that
     * provider can sign in as that person - which is exactly what "sign in with
     * Google" is supposed to mean, and a catastrophe at a provider that lets
     * anybody claim any address without proving it.
     *
     * Google and GitHub both verify addresses before returning them, and GitHub
     * returns only verified ones from its API. Microsoft Entra does the same
     * for work accounts. A provider added later starts OUTSIDE this list and
     * has to earn its place by somebody checking, because the failure is silent:
     * the wrong person is simply signed in.
     *
     * @var list<string>
     */
    private const VERIFIES_EMAIL = ['google', 'github', 'microsoft'];

    /**
     * AN APPLICATION MAY ADD TO THIS AND MAY NOT REMOVE FROM IT SILENTLY. The
     * config list is a claim somebody made deliberately about a provider they
     * added; the constant is what this package has checked itself.
     */
    public static function verifiesEmail(string $provider): bool
    {
        $trusted = array_merge(
            self::VERIFIES_EMAIL,
            (array) config('panel.auth.social.verifies_email', []),
        );

        return in_array($provider, $trusted, true);
    }
}
