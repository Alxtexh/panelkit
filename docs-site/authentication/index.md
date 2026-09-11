# Authentication

PanelKit does not require a particular auth stack. Breeze, Jetstream, Fortify
or your own are all ordinary consumers — every feature below degrades
honestly when its dependency is absent (a Security screen renders without the
passkey section rather than failing to render at all).

## Turning it on

```bash
php artisan panel:install                     # auth is on by default
php artisan panel:install --no-auth           # keep a starter-kit login instead
php artisan make:panel reseller --auth        # a generated portal gets its own
```

Routes live under the panel's own prefix (`/reseller/login`), never at
`/login` — a generated portal and a starter kit's own login coexist rather
than fighting over the same URI.

Sign-in is throttled by **address and IP together**: keying on the address
alone lets anybody lock a colleague out; keying on the IP alone lets one
office share a budget with an attacker behind the same NAT. The error message
is identical for a wrong password and an unknown address, so the form can't
be used to enumerate accounts.

## What ships

| Feature | Needs | Notes |
|---|---|---|
| Password sign-in | — | Throttled, generic errors |
| Password reset | A `passwords.{guard}` broker | Cycles the remember token |
| Passkeys | `laravel/passkeys` or Fortify | Sign-in and enrolment |
| Two-factor | Fortify | TOTP with recovery codes, plus email OTP |
| Social sign-in | `laravel/socialite` | Per-provider credentials — see [Social sign-in](/authentication/social) |
| Devices | Current device always; other devices need `SESSION_DRIVER=database` | List and revoke other sessions |
| Impersonation | `impersonate_users` ability | Audited, cannot reach upward or cross tenants |
| Turnstile | A site key | Bot check on sign-in — see [Turnstile](/authentication/turnstile) |
| Password policy | — | Reuse history, maximum age |
| Session lifetime | — | Absolute ceiling, not just idle |
| Passwordless magic link | — | Off by default — see [MFA & passwordless](/authentication/mfa) |

## Auth design families

Pick **one family** per panel — login, register, password reset, email OTP,
and the two-factor challenge all share it through `AuthLayout`:

```php
Panel::make('admin')
    ->authFamily('card')   // or 'centered' (default), 'muted', 'split', 'showcase'
```

| Family | Composition |
|---|---|
| `centered` (default) | Form on a plain background |
| `muted` | Form centred on a muted background |
| `showcase` | Form on the left; full-bleed cover (and optional testimonial) on the right |
| `split` | Mirror of showcase — cover on the left, form on the right |
| `card` | Muted page with an inset card: form + image |

`split`, `showcase` and `card` share an image panel, set once server-side:

```php
Panel::make('admin')
    ->authFamily('showcase')
    ->authImage('/images/auth-cover.jpg', 'A dashboard, mid-shift')
    ->authTestimonial(
        'Switching subscribers between plans used to mean a support ticket. Now it is a click.',
        'Amara Odhiambo',
        'Head of Operations',   // optional
    )
```

## Shared sign-in across two panels

Two panels can share one login URL, where the submitted credential decides
the destination:

```php
// AdminPanelProvider
Panel::make('admin')->guard('web')->sharedLogin('login');

// ClientPanelProvider
Panel::make('client')->guard('customers')->sharedLogin('login');
```

`POST /login` tries each panel's guard in registration order; the first to
accept the credentials owns the session. If every guard rejects, one generic
`auth.failed` error is returned regardless of which guard failed. Registration
order is priority order — if an account exists under both guards, whichever
panel registered first wins, by design.

The post-login intended URL only redirects within the *matched* panel's path
prefix — a session that intended `/admin/dashboard` will never redirect a
client-guard sign-in there. Rate limiting spans all guards in one shared
budget. Password reset is **not** available at the shared endpoint — each
panel's own `/prefix/forgot-password` handles it, since each guard has its
own token table and mail template.

## Settings screen layout

Profile, Security, Workspaces, Organisation, Notifications, Assistant and
SMTP each render as bordered cards by default. `Panel::groupedSettingsCards(false)`
flattens all of them to one list instead.

## Sensitive actions

- Changing a password requires the current one; every other Security control
  is reachable by whoever is at an unlocked, signed-in session.
- Viewing the Security screen itself requires password confirmation — it
  lists devices, connected accounts and second-factor status.
- Wrong-answer attempts on these are throttled separately from the sign-in
  rate limit.
- Changing or resetting a password cycles the remember token and signs other
  devices out.

## Idle lock

On by default: 15 minutes of no activity shows a password-prompt lock screen
rather than signing the session out — open tabs and unsaved drafts survive,
but nothing is visible until the same account re-enters its password.

```php
Panel::make('admin')
    ->idleLock(30)          // minutes, with a 60s on-screen warning by default
    ->idleLock(30, 120)     // custom warning window too
    ->idleLock(false)       // off entirely — e.g. for a test-fixture panel
```

## Impersonation

A dedicated ability, separate from managing users. It cannot nest, cannot
target yourself, cannot cross tenants, and cannot reach a target holding
anything the actor lacks. Both starting and stopping are audited.

```php
use Alxtexh\Panel\Actions\ImpersonateAction;

$table->actions([
    ImpersonateAction::make()->toAction(),
]);
```

Stopping an impersonation is never something you wire up — `{panel}.impersonate.stop`
is registered automatically for every panel, and the banner's "Stop
impersonating" button is deliberately unauthorised so the impersonator can
always get back out, even if the ability that let them in was revoked in the
meantime.
