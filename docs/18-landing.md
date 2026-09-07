# 18. Public landing pages

The PanelKit package does not impose a public landing-page template on an
installed application. This is deliberate: a panel package must not claim `/`,
replace a host application's marketing site, or present a hardcoded brand and
links that do not exist in the host system.

The playground is different: it is a complete demonstration application and
ships several imported landing designs as presets. It exposes exactly one
public landing at `/` at a time. The `Landing page` sidebar entry is the CMS
for that active page: an administrator chooses the preset, edits the shared
identity/conversion/SEO fields, saves a draft, and publishes it. The other
presets are not public destinations and are not added as separate sidebar
items.

The imported designs remain compiled React/Next documents so their original
visual language and interactions are preserved. The shared CMS contract owns
the safe host integration points; template-specific block editing should be
added through an adapter when a host needs to edit every section of a design.

The package itself exposes no generic `/preview/*`, `/landing/*`, or
`/landing-template` pages. `Sitemap` also never invents a public URL; register
the application's real public pages explicitly:

```php
use Alxtexh\Panel\Support\Sitemap;

Sitemap::add('/');
Sitemap::add('/pricing');
Sitemap::source(fn () => Article::published()->pluck('url')->all());
```

For a host application, keep the landing page in the host application's own
frontend or install a dedicated marketing template and connect its buttons to
the panel's configured login and dashboard URLs. That keeps the design reusable
without making the core package responsible for somebody else's public site.

The former landing APIs and backend catalog have also been removed. Existing
providers should delete any `->landing(...)` call and keep their public site in
the host application.
