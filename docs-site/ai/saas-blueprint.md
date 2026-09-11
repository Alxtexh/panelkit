# 11. SaaS architecture recipe

Building a whole SaaS application on PanelKit means combining what the
framework ships with what your application still has to build. Getting this
split wrong — claiming PanelKit provides something it doesn't — produces
code that references classes which don't exist, or that don't exist in the
*installed* package.

## PANELKIT PROVIDES

| Concern | Class / mechanism |
|---|---|
| Plan-gated modules | `Module`, `ModuleRegistry::grants()`/`caps()`/`applyGrants()` — see [Blueprint's SaaS recipes](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Support/Blueprint.php) |
| A plan catalogue screen | `Panel::planCatalog()`, `PlanSetupPage`, client `PlanGrid`/`PlanEditor` |
| Billing state & the expiry wall | `Panel::billingState()`, `Panel::subscriptionGate()`, `BillingState`, `BillingStateStore`, `BillingAccess` |
| Inbound billing webhook contract | `Panel::billingWebhookVerifier()`/`billingWebhookMapper()`, `BillingWebhookInboundController`, the `billable_type`/`billable_key`/`status`/`period_end_at`/`grace_ends_at`/`provider_ref` field contract |
| Outbound webhooks | `WebhookDispatcher`, `WebhookEndpoint`, `WebhookDelivery`, opt-in via `Panel::webhooks()` |
| Support ticketing (two-sided) | `TicketingPlugin` — turn it on, do not hand-build one; see below |
| Announcements | `AnnouncementsPlugin` |
| Toasts, bell notifications, dashboard alerts | `Notification::make()`, `AlertRule`/`Alert`, Laravel's own `->notify()` |
| Roles & generated permissions | `panel:permissions`, `Abilities`, `TenantResourcePolicy` |
| Tenancy plumbing | See [Tenancy](/ai/tenancy) |
| Multi-panel portals (central + tenant) | `make:panel --central`, `Panel::context()` |

## APPLICATION MUST IMPLEMENT

- Users, tenants/organisations, and the relationship between them.
- Subscriptions and plan assignment logic (PanelKit gates access; your
  application decides who's on which plan).
- Tenant provisioning (creating a new organisation's data/database on
  signup).
- Domains, if a portal is reached by subdomain/custom domain.
- Global (non-panel) application settings.
- The actual business resources: customers, products, orders, invoices —
  ordinary `Resource` classes, built the normal way.
- Reports, beyond what `panel:refresh-rollups`/dashboard widgets already
  aggregate.

## OPTIONAL EXTERNAL PACKAGE — do not assume these are installed

Two capabilities are split into **separate Composer packages**, sharing
PanelKit's own namespace but not present unless separately required. Check
`composer.json` / run `php artisan panel:modules` before writing code
against these — do not assume they exist just because PanelKit is
installed:

- **`alxtexh-enterprise/panel-operations`** — import/export
  (`Alxtexh\Panel\Imports\Importer`, `RowsReader`, `CsvReader`,
  `ExcelReader`), scheduled reports. `Resource::importable()` is a core
  opt-in flag, but the actual importer classes it names only work once this
  package is installed; `ImportController`'s routes are gated on
  `class_exists()` checks against it.
- **`alxtexh-enterprise/panel-billing`** — `GenericBillingWebhookAdapter`,
  `GenericInboundBillingMapper`. The **hook points**
  (`billingWebhookVerifier()`/`billingWebhookMapper()`) and the underlying
  `BillingState` contract are core; the ready-made generic adapter classes
  are not — without this package, you map a gateway's webhook payload to
  the `billable_type`/`billable_key`/`status`/... contract yourself.
- **`stancl/tenancy`** — required for `database`/`hybrid` tenancy modes; see
  [Tenancy](/ai/tenancy).

## Task templates

**BUILD RESOURCE** — Input: model, schema, relationships, requirements.
Inspect first: the actual migration/columns (see
[Model the data first](/ai/panelkit-core#model-the-data-first)). Output:
table, form, infolist (if the view needs more than the table), navigation
identity, a reviewed policy, a contract test. Verify: `panel:doctor`, visit
each CRUD page, confirm tenant isolation.

**BUILD TENANT MODULE** — Input: a `Module::make()` key, the resources it
should gate. Output: the module registered in a panel provider, resources
carrying `protected static ?string $module = '{key}'`, an
`ModuleRegistry::grants()`/`caps()` wiring if not already set up. Verify: an
ungranted key both 403s and disappears from the sidebar.

**BUILD BILLING MODULE** — Check first whether `panel-billing` is installed
(see above). Output: `Panel::billingState()`/`subscriptionGate()`
configured, and either the packaged adapter (if installed) or a
hand-written mapper into the `billable_*`/`status` contract. Verify: an
expired/suspended state actually redirects, and the webhook endpoint
round-trips against a real signed payload.

**ADD RELATIONMANAGER** — See [Relation managers](/ai/relation-managers)'
decision tree first. Output depends on the choice made there.

**ADD DASHBOARD** — Input: what an operator needs to see at a glance.
Output: a `DashboardPage` with `stats()`/`charts()`/`tables()`, each backed
by a real query, none of them sample/placeholder data. Verify: each widget
resolves under its own query budget (`panel.widgets.query_budget`), and
polling/live wiring doesn't double-fetch (see [Deployment](/deployment/)).

**ADD SETTINGS PAGE** — For a single-record form with no list, reach for
`SingularResource`, not a full `Resource` with one hidden row. Output:
`form()`, `values()`, `save()`, an `ability()` gate, registered in
`config('panel.singulars')`.

**DEBUG PANELKIT RESOURCE** — Start with `php artisan panel:doctor`, then
[Common errors](/ai/common-errors). Most "this doesn't work" reports here
trace to one of a small, known set of silent failures — check those before
assuming a new bug.
