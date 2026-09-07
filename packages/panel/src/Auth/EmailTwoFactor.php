<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

/**
 * Email OTP as a second factor, the Filament EmailAuthentication shape
 * without Livewire.
 *
 * WHY THIS IS NOT A MAGIC LINK. Magic links and password-reset OTPs prove
 * control of a mailbox to *get in*. This one runs AFTER a correct password
 * (or social match) for an account that opted in on Security. Same door as
 * TOTP, different factor.
 *
 * STORED ON THE USER as `email_two_factor_confirmed_at`. A missing column is
 * "not enabled", never a 500. The one-time code lives in the session, hashed,
 * and is replaced on resend so an impatient click does not multiply guesses.
 */
final class EmailTwoFactor
{
    public const SESSION_HASH = 'login.email_otp.hash';

    public const SESSION_EXPIRES = 'login.email_otp.expires';

    public const SESSION_METHOD = 'login.method';

    public const METHOD_TOTP = 'totp';

    public const METHOD_EMAIL = 'email';

    public static function enabled(?Authenticatable $user): bool
    {
        if ($user === null || ! self::hasColumn($user)) {
            return false;
        }

        return ($user->email_two_factor_confirmed_at ?? null) !== null;
    }

    public static function enable(Authenticatable $user): void
    {
        if (! self::hasColumn($user)) {
            return;
        }

        $user->forceFill([
            'email_two_factor_confirmed_at' => now(),
        ])->save();
    }

    public static function disable(Authenticatable $user): void
    {
        if (! self::hasColumn($user)) {
            return;
        }

        $user->forceFill([
            'email_two_factor_confirmed_at' => null,
        ])->save();
    }

    public static function method(Request $request): string
    {
        $method = $request->session()->get(self::SESSION_METHOD);

        return $method === self::METHOD_EMAIL ? self::METHOD_EMAIL : self::METHOD_TOTP;
    }

    public static function setMethod(Request $request, string $method): void
    {
        $request->session()->put(
            self::SESSION_METHOD,
            $method === self::METHOD_EMAIL ? self::METHOD_EMAIL : self::METHOD_TOTP,
        );
    }

    /**
     * Issue a six-digit code, mail it, and park the hash in the session.
     *
     * THROTTLED BY USER AND IP. A mailbox is an unmetered delivery channel
     * without this: anybody who reaches the challenge page could otherwise
     * flood the address. The budget is separate from the code-guess budget.
     */
    public static function send(Request $request, Authenticatable $user): void
    {
        $key = self::sendKey($request, $user);
        $max = max(1, (int) config('panel.auth.email_otp.max_sends', 3));

        if (RateLimiter::tooManyAttempts($key, $max)) {
            throw ValidationException::withMessages([
                'code' => __('auth.throttle', [
                    'seconds' => $seconds = RateLimiter::availableIn($key),
                    'minutes' => (int) ceil($seconds / 60),
                ]),
            ]);
        }

        RateLimiter::hit($key, (int) config('panel.auth.email_otp.send_decay_seconds', 60));

        $code = str_pad((string) random_int(0, 999_999), 6, '0', STR_PAD_LEFT);
        $minutes = max(1, (int) config('panel.auth.email_otp.lifetime_minutes', 10));

        $request->session()->put([
            self::SESSION_HASH => Hash::make($code),
            self::SESSION_EXPIRES => now()->addMinutes($minutes)->getTimestamp(),
            self::SESSION_METHOD => self::METHOD_EMAIL,
        ]);

        $email = (string) ($user->email ?? '');

        if ($email === '') {
            return;
        }

        Notification::route('mail', $email)->notify(new EmailTwoFactorCode($code));
    }

    public static function verify(Request $request, string $code): bool
    {
        $code = preg_replace('/\s+/', '', $code) ?? '';

        if ($code === '' || preg_match('/^\d{6}$/', $code) !== 1) {
            return false;
        }

        $hash = $request->session()->get(self::SESSION_HASH);
        $expires = (int) $request->session()->get(self::SESSION_EXPIRES, 0);

        if (! is_string($hash) || $hash === '' || $expires < time()) {
            Hash::check($code, '$2y$12$usesomesillystringfore7hnbRJHxXVLeakoG8K30oukPsA.ztMG');

            return false;
        }

        if (! Hash::check($code, $hash)) {
            return false;
        }

        self::forgetCode($request);

        return true;
    }

    public static function forget(Request $request): void
    {
        $request->session()->forget([
            self::SESSION_HASH,
            self::SESSION_EXPIRES,
            self::SESSION_METHOD,
        ]);
    }

    public static function forgetCode(Request $request): void
    {
        $request->session()->forget([
            self::SESSION_HASH,
            self::SESSION_EXPIRES,
        ]);
    }

    public static function maskedAddress(Authenticatable $user): ?string
    {
        $email = (string) ($user->email ?? '');

        if ($email === '' || ! str_contains($email, '@')) {
            return null;
        }

        [$local, $domain] = explode('@', $email, 2);
        $keep = min(2, max(1, strlen($local)));

        return substr($local, 0, $keep).str_repeat('*', max(1, strlen($local) - $keep)).'@'.$domain;
    }

    private static function sendKey(Request $request, Authenticatable $user): string
    {
        return 'email-otp-send|'.$user->getAuthIdentifier().'|'.$request->ip();
    }

    private static function hasColumn(Authenticatable $user): bool
    {
        return Schema::hasColumn($user->getTable(), 'email_two_factor_confirmed_at');
    }
}
