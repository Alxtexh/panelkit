# Quick start

After [installing](/getting-started/installation), the fastest way to see a
real, working screen is the official starter recipe — not a hand-written
resource, so you're looking at a known-good baseline before writing your own.

```bash
php artisan make:panel-recipe Invoices --migrate --seed
```

This writes an `InvoiceResource`, its model, policy, and migration, runs the
migration, and inserts three sample rows. Visit `/invoices` — a sortable,
searchable, paginated list, backed by a real policy, with Create/Edit/View
pages already wired up.

```bash
php artisan panel:doctor
```

Run this after any change to resources or navigation — most silent misconfigurations
(a missing policy, an unsupported icon name, a Filament-style property name)
produce a specific, named finding here rather than a broken-looking screen.

## What you get for free, with zero configuration

- Search, sort, pagination, column visibility, density, saved views,
  selection, export, and the empty state — none of this is declared per
  resource; it comes with `Table`.
- A generated ability set (`view_any_invoices`, `update_invoices`, …) and a
  working `Administrator` role, if you ran `panel:install`'s default flow.
- A generated `AGENTS.md` describing exactly this installation's resources,
  panels, and commands — see the [AI Blueprint](/ai/) if you're driving
  further development with an AI coding agent.

## Next

- [Your first resource](/getting-started/first-resource) — build one from
  scratch instead of the starter recipe, understanding each piece.
- [Creating resources](/resources/) — the full reference.
- [Money](/money/) — read this before your first resource touches currency.
