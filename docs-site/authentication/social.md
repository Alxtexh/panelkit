# Social sign-in

```php
Panel::make('admin')
    ->login()
    ->socialite();                       // every provider that has both client id + secret set
    // ->socialite(['google', 'github']); // narrow the list
    // ->socialite(false)                 // hide even when keys exist
```

Requires `laravel/socialite` (a Composer suggest, not a hard dependency) —
without it, the buttons stay hidden and nothing 500s.

## Supported providers

`google`, `github`, `gitlab`, `bitbucket`, `facebook`, `linkedin` /
`linkedin-openid`, `microsoft`, `apple`, `twitter` / `x`, `discord`, `slack`,
`twitch`. Microsoft, Apple, and Discord need a community Socialite driver in
addition to the base package.

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
# ...one client id/secret pair per provider you enable
```

## Credentials are the switch

A provider is only listed when **both** its client id and secret are set —
there's no separate enable flag. When the resolved list is empty, the whole
social block (including the "or continue with" divider) is hidden, and
routes for unconfigured providers aren't registered either.

```env
PANEL_SOCIAL_SHOW_UNCONFIGURED=true
```

Set this only for a kit showcase or demo that wants the full catalogue
visible with muted, explained buttons for providers missing credentials —
the package default is to hide them entirely.

## Account matching — no account is ever created from a callback

Two conditions must **both** hold before a social login is allowed to match
an existing account by email: the provider must report the address as
verified, and the panel account's own email must already be verified too.
Either alone would let an attacker register a look-alike provider account
with an administrator's email address and be signed in as them, with
nothing unusual in a log.

**PanelKit never creates an account from a social callback.** An operator
account carries a tenant and a role, and neither is knowable from "somebody
signed in with Google" — an unmatched provider identity is turned away with
an explanation, not auto-registered. Connect an existing account instead,
from Security.

Connected-account lookups are scoped **per guard** — a link made on a
customer portal cannot answer a sign-in attempt on the operator panel, since
the two guards are separate id spaces.

## Social sign-in is never a 2FA bypass

A user who has confirmed two-factor is paused on the same challenge screen
after a successful Google or GitHub callback as after a correct password.
