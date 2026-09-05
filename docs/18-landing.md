# 18. Public landing pages

PanelKit does not ship a public landing-page template. This is deliberate: a
panel package must not claim `/`, replace a host application's marketing site,
or present a hardcoded brand and links that do not exist in the host system.

The previously bundled landing compositions and preview routes have been
removed. Fresh installs therefore expose no `/preview/*`, `/landing/*`, or
`/landing-template` pages. `Sitemap` also never invents a public URL; register
the application's real public pages explicitly:

```php
use Alxtexh\Panel\Support\Sitemap;

Sitemap::add('/');
Sitemap::add('/pricing');
Sitemap::source(fn () => Article::published()->pluck('url')->all());
```

If a host wants a landing page, keep it in the host application's own frontend
or install a dedicated marketing template and connect its buttons to the
panel's configured login and dashboard URLs. That keeps the design reusable
without making the panel package responsible for somebody else's public site.

The former landing APIs and backend catalog have also been removed. Existing
providers should delete any `->landing(...)` call and keep their public site in
the host application.
