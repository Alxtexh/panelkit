# Turnstile

Cloudflare Turnstile is fully built into PanelKit and genuinely optional —
off by default, on only once you provide keys.

```env
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

```php
Panel::make('admin')->turnstile(false); // force it off for one portal even with keys set
```

```env
PANEL_TURNSTILE=false  # force it off globally, even with keys present
```

## What it covers

Both keys set together enable the widget on **sign-in, registration,
password reset, and the two-factor challenge** — every place a bot could
otherwise hammer an endpoint.

## Fails closed, not open

Once configured, a login POST without a valid token fails validation. If
Cloudflare itself is unreachable when verifying a token, that's treated as a
**refusal**, not a pass — an outage on Cloudflare's side never becomes a way
to skip the check.

## Missing keys is silently off, not broken

With either key absent, there's no widget and no extra HTTP request at
all — `Http::assertNothingSent()` holds true in that state. A fresh install
with no Turnstile configuration works exactly as if the feature didn't
exist; nothing needs disabling explicitly to get a working login.

## Where this is wired

`Alxtexh\Panel\Auth\Turnstile::configured()`/`enabled()` gate the whole
feature; the `VerifyTurnstile` middleware is attached to the `web` group on
every install but no-ops immediately when disabled — there's no separate
opt-in step for the middleware itself, only for the keys. `panel:setup`
reports Turnstile's current readiness alongside mail and tenancy.
