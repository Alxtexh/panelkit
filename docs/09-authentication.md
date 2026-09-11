# 9. Authentication

The panel does not require a particular auth stack. Breeze, Jetstream, Fortify
or your own are all ordinary consumers, and every feature below answers honestly
when its dependency is absent — a security screen renders without the passkey
section rather than failing to render.

## Sign-in

```bash
php artisan panel:install                     # auth is on by default
php artisan panel:install --no-auth           # keep a starter-kit login
php artisan make:panel reseller --auth        # a generated portal
```

Routes go under the panel's prefix (`/reseller/login`), never at `/login`, so a
generated portal and a starter kit coexist rather than fighting for the URI.

Sign-in is throttled by **address and IP together**: keying on the address alone
lets anybody lock a colleague out, and on the IP alone lets one office share a
budget with an attacker behind the same NAT. The message is identical for a
wrong password and an unknown address, or the form becomes an account-existence
oracle.

## Auth design families

Pick **one family** on the panel. Login, register, password reset, email OTP,
and the two-factor challenge all share it through `AuthLayout`. Choosing a
login template therefore auto-selects the matching signup and OTP composition.

Prefer `authFamily()`. `authLayout()` is the same setter, kept for existing
call sites. You may also pass a shadcn-vue block id (`login-04`, `signup-02`,
`otp-02`, …); it resolves to the coupled family.

```php
Panel::make('admin')
    ->authFamily('card')   // or 'centered' (default), 'muted', 'split', 'showcase'
    // ->authFamily('login-04')  // same as 'card': couples signup-04 + otp-04
```

| Family | shadcn-vue blocks (layout pattern) | Composition |
|---|---|---|
| `centered` | signup-05, otp-01, otp-05 | Form on a plain background. The default. |
| `muted` | login-03, otp-03 | Form centred on a muted background. |
| `showcase` | login-02, signup-02, otp-02 | Form on the left; full-bleed cover (and optional testimonial) on the right. |
| `split` | mirror of showcase | Cover on the left; form on the right. |
| `card` | login-04, signup-04, otp-04 | Muted page with an inset card: form \| image. |

Patterns are reimplemented in kit `AuthLayout` against PanelKit tokens. Do not
run `npx shadcn-vue add login-*` into the monorepo for these screens.

`split`, `showcase`, and `card` share an image panel for a logo, illustration,
or screenshot. Set it once, server-side — these are `panel/auth/*` screens
resolved by name, so there is no template position to slot markup into
without forking the page:

```php
Panel::make('admin')
    ->authFamily('showcase')
    ->authImage('/images/auth-cover.jpg', 'A dashboard, mid-shift')  // alt optional
```

Without it a placeholder is shown. `#image` still exists on `AuthLayout`
itself for a consumer rendering the layout directly from its own page,
outside `panel/auth/*` — that explicit slot wins over `authImage()`.

`showcase` also accepts a testimonial, declared as text rather than a
component - the renderer owns how it looks:

```php
Panel::make('admin')
    ->authFamily('showcase')
    ->authTestimonial(
        'Switching subscribers between plans used to mean a support ticket. Now it is a click.',
        'Amara Odhiambo',
        'Head of Operations',   // optional
    )
```

Calling it is optional. A `showcase` panel that never does shows the preview
panel with no quote under it, rather than a placeholder attributed to nobody.

## Shared sign-in

Two panels can share one login URL where the credential decides the destination:

```php
// app/Providers/Panels/AdminPanelProvider.php
Panel::make('admin')
    ->guard('web')
    ->sharedLogin('login');   // participates in /login

// app/Providers/Panels/ClientPanelProvider.php
Panel::make('client')
    ->guard('customers')
    ->sharedLogin('login');   // same path — one route is registered
```

`POST /login` tries each panel's guard in registration order. The first that
accepts the credentials owns the session and provides the redirect target.
If every guard rejects, a generic `auth.failed` error is returned — the same
message regardless of which guard failed, so it cannot name which table a user
is or is not in.

**Registration order is priority order.** If an account exists in both guards,
the panel registered first wins. That is an explicit choice by whoever declared
the registration order, not a silent default.

**`url.intended` is cross-panel safe.** After a successful sign-in the intended
URL is only honoured when it belongs to the matched panel's path prefix. A session
carrying `/admin/dashboard` as the intended destination will not redirect a client
to the admin panel after they sign in.

**No password reset at the shared endpoint.** Reset is broker-specific; each
guard has its own token table and mail template. Each panel's own
`/prefix/forgot-password` handles resets. The shared sign-in page omits the link.

**Rate limiting covers all guards in one budget**, keyed on address and IP.
Exhausting the budget against one guard does not grant a free pass to the others.

If the path is already claimed — by Fortify, Breeze, or your own `web.php` — the
shared route stands down and the declaration is silently held until the conflict
is resolved. The path is never replaced.

## What ships

| Feature | Needs | Notes |
|---|---|---|
| Password sign-in | — | Throttled, generic errors |
| Password reset | A `passwords.{guard}` broker | Cycles the remember token |
| **Passkeys** | `laravel/passkeys` or Fortify | Sign-in and enrolment |
| **Two-factor** | Fortify | TOTP with recovery codes |
| **Social sign-in** | `laravel/socialite` | Per provider credentials |
| **Devices** | Current device always; other devices need `SESSION_DRIVER=database` + `sessions` table | List and revoke other sessions |
| **Impersonation** | `impersonate_users` | Audited, cannot reach upward |
| **Turnstile** | A site key | Bot check on sign-in |
| **Password policy** | — | Reuse history, maximum age |
| **Session lifetime** | — | Absolute ceiling, not just idle |
| **One-time credentials** | — | Magic links, OTP |

## Passwordless magic link

Email a one-time sign-in link instead of typing a password. **Off by default**: a
magic link makes the mailbox a complete account takeover path, so it is an
explicit installation choice.

```php
Panel::make('admin')
    ->login()
    ->passwordless();   // alias: magicLink()
```

```env
PANEL_MAGIC_LINK=true
PANEL_MAGIC_LINK_LIFETIME=10
PANEL_MAGIC_LINK_TABLE=magic_login_tokens
```

Both the panel opt-in (`Panel::passwordless()` / `magicLink()`) and `PANEL_MAGIC_LINK=true`
must be set. The installer does not enable either by default. Routes mount under
the panel prefix (`/{panel}/magic-link`, `/{panel}/magic-link/consume`). The host
owns the token table; `OneTimeCredential` stores hashed tokens keyed by tenant and
email.

The login screen shows **Email me a sign-in link** when enabled. The request
endpoint never reveals whether an address exists. A link works once and requires a
valid signed URL plus an unredeemed stored token. Turnstile covers the request
when keys are set.

Fortify or Breeze hosts can keep app-level routes at `/auth/magic-link` pointing
at `Alxtexh\Panel\Http\Controllers\MagicLinkController` (see the reference demo).

## Social sign-in

Packaged provider keys (button when both `client_id` and `client_secret` are
set under `config/services.php`):

| Key | Env vars | Notes |
|---|---|---|
| `google` | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Trusts email |
| `github` | `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Trusts email |
| `gitlab` | `GITLAB_CLIENT_ID` / `GITLAB_CLIENT_SECRET` | Built-in Socialite |
| `bitbucket` | `BITBUCKET_CLIENT_ID` / `BITBUCKET_CLIENT_SECRET` | Built-in Socialite |
| `facebook` | `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` | |
| `linkedin` / `linkedin-openid` | `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` | Prefer OpenID |
| `microsoft` | `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` | Community driver; trusts email |
| `apple` | `APPLE_CLIENT_ID` / `APPLE_CLIENT_SECRET` | Community driver |
| `twitter` / `x` | `TWITTER_*` or `X_CLIENT_ID` / `X_CLIENT_SECRET` | |
| `discord` | `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | Community driver |
| `slack` | `SLACK_CLIENT_ID` / `SLACK_CLIENT_SECRET` | Same `services.slack` as bot token |
| `twitch` | `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET` | Built-in Socialite |

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITLAB_CLIENT_ID=
GITLAB_CLIENT_SECRET=
BITBUCKET_CLIENT_ID=
BITBUCKET_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
X_CLIENT_ID=
X_CLIENT_SECRET=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Extra providers (beyond the packaged list) go in `config/panel.php` under
`auth.social.providers`, with matching `services.{key}` credentials and a
Socialite driver.

**Credentials are the switch (default).** A provider without both a client id
and a secret is not listed, and when the list is empty the whole social block
(including the "or continue with" divider) is hidden. Routes for unconfigured
providers are not registered either. `laravel/socialite` is a composer suggest:
without the package there are no buttons and no 500.

Set `PANEL_SOCIAL_SHOW_UNCONFIGURED=true` only when you want the full packaged
catalogue with muted buttons that explain missing `.env` keys (kit showcase /
demo). That is opt-in; the package default is hide unconfigured.

```php
Panel::make('admin')
    ->login()
    ->socialite();                       // every provider that has keys
    // ->socialite(['google', 'github']); // optional: narrow the list
    // ->socialite(false)                 // hide even when keys exist
```

Two conditions must both hold before an address matches an account: the provider
must have verified it, *and* the panel account must have verified its own.
Either alone would let an attacker register with an administrator's address and
become them, with nothing in the log looking unusual.

**No account is ever created** by a social callback. Operators are invited,
carrying a tenant and a role, and neither is knowable from a provider.

Accounts are recorded per guard, so a link made on a customer portal cannot
answer a sign-in on the operator panel. Two guards mean two id spaces, and
`user_id` alone names no table.

**Social does not skip 2FA.** A user who confirmed two-factor on Security is
paused on `two-factor-challenge` after Google or GitHub, the same as after a
password. Passkeys remain a button on the login form.

## Cloudflare Turnstile

Both `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` enable the widget on
sign-in, register, password reset and the two-factor challenge. Missing either
key is off: no widget, no extra HTTP. `PANEL_TURNSTILE=false` forces it off
even when keys exist. `->turnstile(false)` does the same for one portal.

A login POST without a token fails validation when Turnstile is on. Cloudflare
unreachable is a refusal, not a pass.

## Two-factor and passkeys

Both appear on one Security screen, alongside password, devices and connected
accounts — they are one question, "who can get into this account", and somebody
who reaches for any of them is already worried. Splitting them across tabs means
half of it gets audited.

Passkeys work with `laravel/passkeys` alone; Fortify's feature flag is also
honoured, and an explicit "off" wins over an available implementation.

### At the login door

Enabling a factor on Security is the switch. After a correct password (or a
social match), a panel that declared `->login()` pauses on
`two-factor-challenge` until the code succeeds. Authenticator TOTP and
recovery codes are one method; email OTP (Filament EmailAuthentication, without
Livewire) is the other. TOTP wins when both are on. Sends are throttled by
user and IP. The pause is not skippable. A user with no factor reaches the
dashboard as before. Passkeys remain a button on the login form; typing a
password still has to clear an enrolled factor.

```php
Panel::make('admin')
    ->login()
    ->twoFactorChallenge();       // default: honour the user's 2FA setting
    // ->twoFactorChallenge(false)  // escape hatch: password is enough
    ->requireTwoFactor();         // optional: enrol before the dashboard
    // ->registration()             // mount register.store
    // ->emailVerification();       // mailbox proof before the panel
```

`requireTwoFactor()` (alias `twoFactorRequired()`) is **off by default**.
When on, a signed-in user with no TOTP, email OTP, or passkey is redirected
to Security and cannot open the dashboard until they enrol.

Fortify's own `/login` already does the TOTP pause. The packaged controller is
the copy generated portals actually use. A missing `passkeys` table is still
an empty list, not a 500.

### Fortify::ignoreRoutes() takes 2FA management down too

`Security.vue`'s enrolment modal (`ManageTwoFactor.vue`) posts straight to
Fortify's own default paths — `/user/two-factor-authentication`,
`/user/confirmed-two-factor-authentication`, `/user/two-factor-qr-code`,
`/user/two-factor-secret-key`, `/user/two-factor-recovery-codes` — because
those are the six routes `laravel/fortify` itself registers, and the modal is
built to talk to them directly rather than to a packaged equivalent.

If Fortify is only there for its 2FA machinery — the common case, since this
package supplies its own login, registration and password-reset controllers —
the usual move is `Fortify::ignoreRoutes()` in `boot()`, to stop Fortify's
`/login` and friends colliding with the panel's. That call is all-or-nothing:
it takes the six 2FA-management routes down as collateral, and the enrolment
modal 404s instead of opening.

Register just those six back, with Fortify's own controllers, guard and
middleware:

```php
use Laravel\Fortify\Features;
use Laravel\Fortify\Http\Controllers\{
    ConfirmedTwoFactorAuthenticationController,
    RecoveryCodeController,
    TwoFactorAuthenticationController,
    TwoFactorQrCodeController,
    TwoFactorSecretKeyController,
};

if (Features::enabled(Features::twoFactorAuthentication())) {
    $middleware = Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword')
        ? [config('fortify.auth_middleware', 'auth').':'.config('fortify.guard'), 'password.confirm']
        : [config('fortify.auth_middleware', 'auth').':'.config('fortify.guard')];

    Route::group(['middleware' => config('fortify.middleware', ['web'])], function () use ($middleware) {
        Route::post('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'store'])->middleware($middleware);
        Route::post('/user/confirmed-two-factor-authentication', [ConfirmedTwoFactorAuthenticationController::class, 'store'])->middleware($middleware);
        Route::delete('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'destroy'])->middleware($middleware);
        Route::get('/user/two-factor-qr-code', [TwoFactorQrCodeController::class, 'show'])->middleware($middleware);
        Route::get('/user/two-factor-secret-key', [TwoFactorSecretKeyController::class, 'show'])->middleware($middleware);
        Route::get('/user/two-factor-recovery-codes', [RecoveryCodeController::class, 'index'])->middleware($middleware);
        Route::post('/user/two-factor-recovery-codes', [RecoveryCodeController::class, 'store'])->middleware($middleware);
    });
}
```

Put this where `Fortify::ignoreRoutes()` is called, so the two decisions stay
next to each other.

## Settings screen layout

Profile, Security, Workspaces, Organisation, Notifications, Assistant and
SMTP each render as bordered cards by default - one card per section
(password, second factor, passkeys, connected accounts and devices on
Security; name/email and delete-account on Profile; and so on).
`Panel::groupedSettingsCards(false)` returns all of them to one flat list:

```php
Panel::make('admin')
    ->groupedSettingsCards(false)   // flat lists instead of bordered cards
```

## Sensitive actions

Changing a password requires the current one — every other control on the
Security screen is reachable by whoever is sitting at an unlocked laptop.
Viewing the screen requires password confirmation, because it lists devices,
connected accounts and whether a second factor exists: a map of how to reach
the account.

Wrong answers are budgeted separately from the request rate. Signing in is
throttled; asking the same question from inside an authenticated session would
otherwise be an unmetered guessing machine.

Changing or resetting a password **cycles the remember token** and signs other
devices out. Without that, an attacker holding a stolen recaller cookie loses
their session row and is transparently signed back in on the next request.

## Idle lock

On by default: 15 minutes of no mouse/keyboard/touch/scroll activity shows a
password-prompt lock screen rather than signing the session out entirely —
the working state (open tabs, an unsaved form's draft) survives, but nothing
in the panel is visible or reachable until the same account re-enters its
password. A background tab locks immediately on refocus if the window was
already exceeded, rather than waiting for the next check.

```php
Panel::make('admin')
    ->idleLock(30)          // minutes, and a 60s on-screen warning by default
    ->idleLock(30, 120)     // custom warning too
    ->idleLock(false)       // off entirely
```

Off by default in a **test fixture panel** — `->idleLock(false)` — since an
automated suite (or an agent driving a browser through many long, sparse
interactions) has no "someone stepped away" signal to react to, and a fixed
per-test wait would either flake or slow every run down for a feature the
test isn't exercising. A real user's panel should keep the default on:
15 minutes is short enough to matter for a shared or public workstation and
long enough that normal use before a real lock is threatened.

## Impersonation

A dedicated ability, separate from managing users — support needs the first and
often should not have the second. It cannot nest, cannot target yourself, cannot
cross tenants, and cannot reach a target holding anything the actor lacks. Both
transitions regenerate the session and are audited.

Attach it to a user resource with `ImpersonateAction`, the same way
`ReplicateAction` attaches duplication:

```php
use Alxtexh\Panel\Actions\ImpersonateAction;

$table->actions([
    ImpersonateAction::make()->toAction(),
    // ->label('Sign in as this customer')
    // ->confirm(null)   // drop the confirmation dialog
]);
```

It builds a `RecordAction` whose `visible()` and `handle()` both ask
`Impersonation::allows()`/`start()` — the menu and the endpoint agree because
they are asking the same object, not two copies of the same rule. `visible()`
re-queries the target per row to check its abilities, which costs one extra
query per row shown; a resource with hundreds of users already loaded for the
page can call `->visible()` again on the returned action to resolve targets
from what it has instead.

**Stopping is not something you wire up.** `{panel}.impersonate.stop` is
registered for every panel automatically — `PanelImpersonationBanner.vue`
renders once anything starts an impersonation, with no configuration, and its
"Stop impersonating" button posts there. It is deliberately unauthorised:
whoever is impersonating must always be able to get back out, even after the
ability that let them in was revoked in the meantime.
