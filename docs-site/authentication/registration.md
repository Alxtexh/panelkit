# Registration & email verification

Both are off until explicitly enabled — a fresh install assumes operators
are invited, not self-registered.

```php
Panel::make('admin')
    ->registration()        // mounts register.store at /{panel}/register
    ->emailVerification();  // mailbox proof required before reaching the panel
```

`registration(bool|string $slug = 'register')` mounts the registration form
and its submit route at the given slug (or disables it entirely with
`false`), the same pattern `login()` uses for its own slug.
`emailVerification()` adds the verify-notice screen and resend flow, gating
access until the address is confirmed.

Both screens share whichever [auth design family](/authentication/#auth-design-families)
the panel has chosen, so a `showcase` login automatically gets a matching
`showcase` registration screen rather than needing its own configuration.

See [Social sign-in](/authentication/social) for how registration interacts
with (and is deliberately *not* triggered by) a social login callback —
social sign-in only ever matches an existing account; it never creates one.
