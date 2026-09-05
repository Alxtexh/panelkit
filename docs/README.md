# Alxtexhpanel documentation

A schema-driven admin panel for Laravel. You describe a screen in one PHP class;
the panel sends that description to the browser once, and every interaction
afterwards moves data only.

These pages are the catalogue: what ships, and how to switch each part on.

| Page | What it covers |
|---|---|
| [1. Install](01-install.md) | GitHub-only install: panelkit (dev) → Alxtexh/panel (Composer). Two repos, not three |
| [2. Resources](02-resources.md) | Tables, forms, and the one class that declares both |
| [3. Fields](03-fields.md) | Form field types (incl. ToggleButtons, morphTo, tableSelect) |
| [4. Columns and filters](04-columns-and-filters.md) | All 12 column types, 6 filters |
| [5. Actions](05-actions.md) | Record actions, bulk actions, exports, imports |
| [6. Dashboards and widgets](06-dashboards-and-widgets.md) | Stats, 17 chart types, filters, strips |
| [7. Pages and panels](07-pages-and-panels.md) | Custom pages, multiple portals, navigation |
| [8. Authorisation and tenancy](08-authorisation-and-tenancy.md) | Policies, abilities, multi-tenancy |
| [9. Authentication](09-authentication.md) | Sign-in, passkeys, 2FA, social, impersonation |
| [10. Built-in screens](10-built-in-screens.md) | Operations, trash, documents, help, and why you may not see them |
| [11. Commands](11-commands.md) | Every artisan command |
| [12. Going to production](12-production.md) | Queues, sockets, SSR, backups |
| [13. Billing adapters](13-billing-adapters.md) | Provider-agnostic inbound webhooks: signature header + payload map |
| [14. Design layout](14-design-layout.md) | PAGE_SHELL, FORM_MEASURE, TableShell, catalogue grids (freeze) |
| [15. Filament gaps](15-filament-gaps.md) | Honest gaps + agent Day-0; doctor host checks; no plugin track |
| [16. Workflows](16-workflows.md) | Resource states, transitions, view and index actions |
| [17. Comments](17-comments.md) | Opt-in record threads, @mentions, bell notifications |
| [18. Public landing](18-landing.md) | Host-owned public pages; no landing templates ship |
| [Starter recipe](recipes/01-invoices.md) | Copyable Invoices resource after install. Not Nairobi Fibre |
| [Tests](tests.md) | `InteractsWithPanels`: isolation, form-state, attach, import, toasts, billing |

## The shortest useful thing

One file. No Vue.

```php
namespace App\Panel\Resources;

use App\Models\Invoice;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Table;

final class InvoiceResource extends Resource
{
    protected static string $model = Invoice::class;

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('reference')->sortable()->searchable(),
            TextColumn::make('customer_name')->copyable(),
        ]);
    }
}
```

That is a working list at `/invoices` — sortable, searchable, paginated, scoped
to the signed-in tenant, and fast on a table with a million rows.

**It will show nothing until a policy exists.** That is deliberate; see
[Authorisation](08-authorisation-and-tenancy.md).

## Two rules worth knowing before you start

**Nothing is registered by hand.** A resource class in a discovered directory
becomes a route, a navigation entry, a set of ability names and an API endpoint.
There is no `routes/panel.php` to edit.

**A missing policy denies rather than allows.** Every failure in this package is
designed to be loud. A resource with no policy shows an empty screen instead of
somebody else's data, and `panel:doctor` tells you which are missing.

## This is not tied to any industry

A fresh `panel:install` is chrome plus an empty canvas: dashboard, user menu,
Get started. The application under `apps/playground` is an **ISP demo**
(Nairobi Fibre), not the kit default. Two test suites enforce that no shipped
string assumes a business. Build a veterinary practice, a law firm or a
warehouse on the same package.
