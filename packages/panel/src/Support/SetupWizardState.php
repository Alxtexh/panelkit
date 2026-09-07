<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Symfony\Component\HttpFoundation\Cookie;

/**
 * First-run persistence for the setup wizard - same shape as
 * `OnboardingSteps`' cookie + `appearance` pair, deliberately not shared with
 * it. The wizard and the dashboard checklist are two independently
 * dismissable flows; a host can enable either, both, or neither, and finishing
 * one must not mark the other done. Two call sites are not enough to justify
 * folding this into a shared trait - see `OnboardingSteps`' own docblock for
 * why THAT class earns its keep as a single source rather than being split.
 *
 * THE COOKIE NEEDS ITS OWN EXCEPTION FROM `EncryptCookies`, the same way
 * `panel_onboarding_done` already does in a host's `bootstrap/app.php`
 * (`$middleware->encryptCookies(except: [...])`). Left encrypted, a value
 * this class writes with the plain `cookie()` helper is unreadable to
 * `isDone()`'s own `$request->cookie()` read on the very next request -
 * every visit looks undone, `RedirectToSetupWizard` never lets go.
 */
final class SetupWizardState
{
    public const COOKIE = 'panel_setup_wizard_done';

    public const APPEARANCE_KEY = 'setupWizardDone';

    public static function isDone(?Request $request = null): bool
    {
        $request ??= request();

        $user = $request->user();
        $appearanceValue = $user instanceof Model ? $user->getAttribute('appearance') : null;
        $appearance = is_array($appearanceValue) ? $appearanceValue : [];
        $cookieValue = $request->cookie(self::COOKIE);
        $cookieDone = is_string($cookieValue) && $cookieValue === '1';

        /*
         * THE ACCOUNT WINS WHEN IT HAS AN OPINION - see `OnboardingSteps::isDone()`,
         * same reasoning: a demo reset of `appearance.setupWizardDone` must show
         * the wizard again even if this browser still carries the cookie.
         */
        if (array_key_exists(self::APPEARANCE_KEY, $appearance)) {
            $done = $appearance[self::APPEARANCE_KEY] === true;

            if (! $done && $cookieDone) {
                cookie()->queue(self::doneCookie(false));
            }

            return $done;
        }

        return $cookieDone;
    }

    public static function persistDone(?Request $request = null): void
    {
        $request ??= request();
        $user = $request->user();

        if (! $user instanceof Model) {
            return;
        }

        $currentValue = $user->getAttribute('appearance');
        $current = is_array($currentValue) ? $currentValue : [];
        $user->setAttribute('appearance', [...$current, self::APPEARANCE_KEY => true]);
        $user->save();
    }

    public static function doneCookie(bool $done = true): Cookie
    {
        return cookie(self::COOKIE, $done ? '1' : '0', 60 * 24 * 365, '/', null, false, false, false, 'lax');
    }
}
