# MFA & passwordless

## Two-factor at the login door

```php
Panel::make('admin')
    ->login()
    ->twoFactorChallenge();       // default: honour whatever the account has enrolled
    // ->twoFactorChallenge(false) // escape hatch: password alone is enough
    ->requireTwoFactor();         // off by default: force enrolment before the dashboard
```

Two independent factors both land on one challenge screen after a correct
password (or a matched social login — **social sign-in is never a 2FA
bypass**): TOTP with recovery codes, and email OTP. If both are enrolled,
**TOTP wins** and no email is sent. Sends are throttled by user and IP.

`requireTwoFactor()` (alias `twoFactorRequired()`) is off by default; once
on, a signed-in user with no TOTP, email OTP, or passkey enrolled is
redirected to Security and cannot reach the dashboard until they enrol one.

::: tip TOTP works even without a dedicated 2FA package
PanelKit's own TOTP verifier reads Fortify-shaped `two_factor_secret`/
`two_factor_confirmed_at` columns if your app already has them, and falls
back to Fortify's own provider or `pragmarx/google2fa` if either is
installed — but ships a correct, hand-rolled RFC 6238 implementation so 2FA
works even with none of those present. A missing column reads as "not
enrolled," never a 500.
:::

## Passkeys

```php
// laravel/passkeys installed, or Fortify's passkey feature enabled
```

A thin wrapper over `laravel/passkeys` (or Laravel Fortify's own passkey
support) — PanelKit deliberately doesn't reimplement WebAuthn itself.
Passkeys never trigger the mid-login 2FA challenge screen; they remain a
button directly on the login form. A missing `passkeys` table renders as an
empty list, not a 500.

Passkeys also cover **idle-lock unlock** — a separate mechanism from
sign-in, since an idle-locked session is still authenticated and can't reuse
the login routes.

## Passwordless magic link

```php
Panel::make('admin')->login()->passwordless(); // alias: magicLink()
```

```env
PANEL_MAGIC_LINK=true
PANEL_MAGIC_LINK_LIFETIME=10
```

**Off by default**, and requires **both** the panel opt-in above *and* the
env var — a magic link makes the mailbox a complete account-takeover path,
so enabling it is a deliberate, two-place decision rather than a single
flag. The request endpoint never reveals whether an address exists; a link
works once and requires a valid signed URL plus an unredeemed, hashed,
short-lived stored token (never the plaintext).

## Password policy

```php
// config/panel.php
'auth' => [
    'password' => [
        'max_age_days' => 90,       // 0 = never expire (default)
        'refuse_reuse' => true,     // checks the last 5 password hashes
    ],
],
```

`max_age_days` defaults to never-expiring. A `null` "password last changed"
timestamp is **never** treated as overdue — activating an expiry policy on
an existing user base doesn't retroactively lock everyone out on day one.

## Sensitive actions and idle lock

See [Authentication overview](/authentication/#sensitive-actions) and
[Idle lock](/authentication/#idle-lock) — both apply regardless of which
factors an account has enrolled.
