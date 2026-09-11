# API Reference

Everything on this page and its subpages is **generated**, not hand-written.
`scripts/generate-api-manifest.php` boots the actual package via Composer's
autoloader and uses PHP's Reflection API to read every class's real
signatures, defaults, parent class, interfaces and traits — the same
technique `scripts/check-public-api.php` uses for the narrower
backward-compatibility floor.

This exists because a hand-maintained signature list drifts, and a drifted
signature is worse than no documentation: it produces code that looks right
and fails at runtime. If a method here doesn't match your installed version,
the manifest is stale — regenerate it, don't trust memory over source.

```bash
php scripts/generate-api-manifest.php              # regenerate against main
php scripts/generate-api-manifest.php --tag=v1.5.0 # source-link a tagged release
```

## What's curated here

Not every class in the package appears in this reference — `docs/api-manifest/classes.json`
is a curated list of genuinely public, developer-facing classes (resources,
tables, columns, filters, actions, forms, entries, widgets, plugins, the
`Panel` configuration object, and the testing trait). Internal implementation
detail — query builders, cache plumbing, private helpers — is deliberately
left out, the same judgment call the [inventory phase](/ai/panelkit-core) of
this documentation project made for every class in the package.

- [All classes, grouped by category](/api/all)
- Machine-readable manifest: [`docs/api-manifest/manifest.json`](https://github.com/Alxtexh/panelkit/blob/main/docs/api-manifest/manifest.json) in the repository

## Reading a class page

Each page shows: the fully-qualified name and kind (class, abstract class,
interface, trait), what it extends and implements, its own static
configuration properties (like `Resource::$icon`), and every public method
declared directly on that class — inherited methods are documented on the
page for the class that actually declares them, not repeated on every
subclass.
