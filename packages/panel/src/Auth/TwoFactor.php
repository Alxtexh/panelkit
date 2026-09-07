<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Throwable;

/**
 * TOTP and recovery codes at the login door, using the same secrets Security
 * already stores.
 *
 * WHY THIS IS NOT A THIRD MFA STACK. Passkeys and two-factor already live on
 * the Security screen. Filament challenges at Login via
 * `Panel::multiFactorAuthentication()`. Until this class existed, a panel that
 * declared `->login()` signed the person in after the password even when they
 * had confirmed TOTP: the kit had a way to turn 2FA on, and no door that asked
 * for it. Fortify's own `/login` already challenges; this is that same pause
 * for a generated portal's own guard.
 *
 * A SOFT DEPENDENCY, like `Passkeys`. Fortify encrypts the secret and recovery
 * codes. An installation without Fortify still verifies if the columns exist:
 * missing columns are "not enabled", never a 500.
 */
final class TwoFactor
{
    public const SESSION_ID = 'login.id';

    public const SESSION_REMEMBER = 'login.remember';

    public const SESSION_PANEL = 'login.panel';

    /**
     * Whether this account has a second factor that login must ask for.
     *
     * HONOUR THE USER'S SETTINGS. Enabling 2FA on Security is the switch; the
     * panel flag only turns the challenge off. A secret with no confirmation
     * is still enrolment, not protection.
     */
    public static function enabled(?Authenticatable $user): bool
    {
        if ($user === null || ! self::hasSecretColumn($user)) {
            return false;
        }

        try {
            if (method_exists($user, 'hasEnabledTwoFactorAuthentication')) {
                return (bool) $user->hasEnabledTwoFactorAuthentication();
            }

            $secret = $user->two_factor_secret ?? null;

            if (! is_string($secret) || $secret === '') {
                return false;
            }

            if (! self::hasConfirmedColumn($user)) {
                return true;
            }

            return ($user->two_factor_confirmed_at ?? null) !== null;
        } catch (QueryException) {
            return false;
        }
    }

    /** Park a password-verified user until the code is accepted. Do not log them in yet. */
    public static function begin(
        \Illuminate\Http\Request $request,
        Authenticatable $user,
        string $panelId,
        bool $remember,
    ): void {
        $request->session()->put([
            self::SESSION_ID => $user->getAuthIdentifier(),
            self::SESSION_REMEMBER => $remember,
            self::SESSION_PANEL => $panelId,
        ]);
    }

    public static function remember(\Illuminate\Http\Request $request): bool
    {
        return (bool) $request->session()->pull(self::SESSION_REMEMBER, false);
    }

    public static function panelId(\Illuminate\Http\Request $request): ?string
    {
        $id = $request->session()->get(self::SESSION_PANEL);

        return is_string($id) && $id !== '' ? $id : null;
    }

    public static function forget(\Illuminate\Http\Request $request): void
    {
        $request->session()->forget([
            self::SESSION_ID,
            self::SESSION_REMEMBER,
            self::SESSION_PANEL,
        ]);

        EmailTwoFactor::forget($request);
    }

    /**
     * The user waiting on the challenge page, or null when the session has
     * nobody pending. Null means "send them back to login", not 500.
     */
    public static function challengedUser(\Illuminate\Http\Request $request, string $model): ?Authenticatable
    {
        $id = $request->session()->get(self::SESSION_ID);

        if ($id === null || $id === '') {
            return null;
        }

        if (! class_exists($model)) {
            return null;
        }

        $user = $model::query()->find($id);

        return $user instanceof Authenticatable ? $user : null;
    }

    public static function verifyCode(Authenticatable $user, string $code): bool
    {
        $code = preg_replace('/\s+/', '', $code) ?? '';

        if ($code === '' || preg_match('/^\d{6}$/', $code) !== 1) {
            return false;
        }

        $secret = self::plainSecret($user);

        if ($secret === null) {
            return false;
        }

        $provider = 'Laravel\\Fortify\\Contracts\\TwoFactorAuthenticationProvider';

        if (app()->bound($provider)) {
            return (bool) app($provider)->verify($secret, $code);
        }

        $engine = 'PragmaRX\\Google2FA\\Google2FA';

        if (class_exists($engine)) {
            return (bool) (new $engine())->verifyKey($secret, $code);
        }

        $now = time();

        for ($i = -1; $i <= 1; $i++) {
            if (hash_equals(self::totp($secret, $now + ($i * 30)), $code)) {
                return true;
            }
        }

        return false;
    }

    public static function verifyRecovery(Authenticatable $user, string $recovery): ?string
    {
        $recovery = trim($recovery);

        if ($recovery === '') {
            return null;
        }

        if (method_exists($user, 'recoveryCodes')) {
            foreach ((array) $user->recoveryCodes() as $code) {
                if (is_string($code) && hash_equals($code, $recovery)) {
                    return $code;
                }
            }

            return null;
        }

        foreach (self::plainRecoveryCodes($user) as $code) {
            if (hash_equals($code, $recovery)) {
                return $code;
            }
        }

        return null;
    }

    /** Spend a recovery code so it cannot be reused. */
    public static function consumeRecovery(Authenticatable $user, string $code): void
    {
        if (method_exists($user, 'replaceRecoveryCode')) {
            $user->replaceRecoveryCode($code);

            return;
        }

        if (! self::hasRecoveryColumn($user)) {
            return;
        }

        $codes = self::plainRecoveryCodes($user);
        $next = [];

        foreach ($codes as $existing) {
            $next[] = hash_equals($existing, $code) ? Str::lower(Str::random(10)) : $existing;
        }

        $user->forceFill([
            'two_factor_recovery_codes' => self::seal(json_encode($next, JSON_THROW_ON_ERROR)),
        ])->save();
    }

    /**
     * The six-digit code for `$secret` at `$timestamp`.
     *
     * PUBLIC so tests generate a real code against the same algorithm login
     * uses, rather than a second copy that can drift.
     */
    public static function totp(string $secret, ?int $timestamp = null): string
    {
        $counter = intdiv($timestamp ?? time(), 30);
        $hash = hash_hmac('sha1', pack('N*', 0, $counter), self::base32Decode($secret), true);
        $offset = ord($hash[19]) & 0x0F;
        $unpacked = unpack('N', substr($hash, $offset, 4));
        if ($unpacked === false) {
            throw new \RuntimeException('Unable to generate a TOTP code.');
        }

        $truncated = $unpacked[1] & 0x7FFFFFFF;

        return str_pad((string) ($truncated % 1_000_000), 6, '0', STR_PAD_LEFT);
    }

    private static function plainSecret(Authenticatable $user): ?string
    {
        $stored = $user->two_factor_secret ?? null;

        if (! is_string($stored) || $stored === '') {
            return null;
        }

        return self::open($stored);
    }

    /** @return list<string> */
    private static function plainRecoveryCodes(Authenticatable $user): array
    {
        $stored = $user->two_factor_recovery_codes ?? null;

        if (! is_string($stored) || $stored === '') {
            return [];
        }

        $decoded = json_decode(self::open($stored) ?? '', true);

        if (! is_array($decoded)) {
            return [];
        }

        return array_values(array_filter(
            $decoded,
            static fn (mixed $code): bool => is_string($code) && $code !== '',
        ));
    }

    private static function open(string $value): ?string
    {
        try {
            $plain = decrypt($value);

            return is_string($plain) ? $plain : null;
        } catch (Throwable) {
            return $value;
        }
    }

    private static function seal(string $value): string
    {
        return encrypt($value);
    }

    private static function hasSecretColumn(Authenticatable $user): bool
    {
        return Schema::hasColumn($user->getTable(), 'two_factor_secret');
    }

    private static function hasConfirmedColumn(Authenticatable $user): bool
    {
        return Schema::hasColumn($user->getTable(), 'two_factor_confirmed_at');
    }

    private static function hasRecoveryColumn(Authenticatable $user): bool
    {
        return Schema::hasColumn($user->getTable(), 'two_factor_recovery_codes');
    }

    private static function base32Decode(string $input): string
    {
        $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        $input = strtoupper((string) preg_replace('/[^A-Z2-7]/', '', $input));
        $bits = '';

        for ($i = 0, $len = strlen($input); $i < $len; $i++) {
            $pos = strpos($alphabet, $input[$i]);

            if ($pos === false) {
                continue;
            }

            $bits .= str_pad(decbin($pos), 5, '0', STR_PAD_LEFT);
        }

        $out = '';

        foreach (str_split($bits, 8) as $byte) {
            if (strlen($byte) < 8) {
                break;
            }

            $out .= chr((int) bindec($byte));
        }

        return $out;
    }
}
