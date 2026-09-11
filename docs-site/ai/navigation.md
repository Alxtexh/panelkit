# 8. Navigation

Full reference: [Navigation guide](/navigation/).

## The rule

```php
protected static string $icon = 'file-text';
protected static ?string $group = 'Billing';
protected static ?int $sort = 10;
```

Use `$icon`, `$group`, `$sort` — **never** `$navigationIcon`,
`$navigationGroup`, `$navigationSort`. Those are Filament's property names.
Declaring the wrong one is not caught by PHP (it's just an unused property),
and produces a working-looking sidebar with a generic fallback icon instead
of an error — this is specifically why `panel:doctor` checks for it by
reflection. **Run `panel:doctor` after any navigation change.**

## Icons must come from the supported allowlist

Roughly 60 curated names — see the full list in the
[Navigation guide](/navigation/#icons). A name outside that list silently
falls back to a generic icon; it does not error. Don't guess an icon name
from a Lucide/Feather/FontAwesome name you remember — check the list, or run
`panel:doctor`, which reports an unsupported icon by name.

## Two icon vocabularies, don't conflate them

Navigation icons (`$icon` on `Resource`/`Page`/`Cluster`) and action/UI
glyphs (`RecordAction::icon()`, `Action::icon()`) are validated against two
*different*, unrelated lists. An icon name valid for one is not guaranteed
valid for the other.

## After any navigation change

```bash
php artisan panel:doctor
```
