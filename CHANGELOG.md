# Changelog

All notable changes to PanelKit are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/); dates are release-tag dates,
not commit dates.

## [1.5.0] - 2026-09-11

### ⚠ Breaking change

**A hand-authored `RelationManager` with a searchable relationship field and
no `->resource()` now throws, instead of silently shipping a broken search.**

Before this release, a simple (non-resource-backed) `RelationManager` built
like this:

```php
RelationManager::make('items', 'Items')
    ->related(Item::class, 'items.parent_id')
    ->form(fn (Form $form) => $form->schema([
        SelectField::make('product_id')->searchable()->relationship('product', 'name'),
    ]));
```

rendered without error, but the searchable select's dropdown never returned
results - a simple `RelationManager` has no dedicated search endpoint of its
own, only a resource-backed one does. Clicking a page containing this exact
configuration will now raise `InvalidArgumentException` instead, naming the
field and the fix.

**Find affected code:**

```bash
grep -rn "RelationManager::make" app/Panel/Resources | grep -B0 -A20 "\->form(" 
```

then check whether any matched `->form()` closure declares a `SelectField`
with `->searchable()`/`->relationship()` and no sibling `->resource()` call
on the same `RelationManager::make(...)` chain.

**Fix**, either:
- Give the field a fixed option list instead of searching: `->options([...])`, or
- Make the relation manager resource-backed, so it gets a real search
  endpoint: `RelationManager::make('items', 'Items')->resource(ItemResource::class)`.

Both are mechanical, but the failure is a hard 500 on the parent record's
page if missed - check for this before upgrading, not after.

### Fixed

- **Infolist entries no longer inherit `table()`'s column selection.** A
  `Resource::infolist()` entry for an attribute the list doesn't display used
  to render `—` even though the value existed, because the view page's
  database query was really the list's. Each page now selects exactly what
  it declares; a real SQL join can back a relationship value on either page
  via `Entry::from()`/`Entry::fromRaw()` (the same mechanism `Column` already
  had). **If your resource's `table()` already joins another table** (for a
  `customer_name`-style column, say) and `infolist()` declares an entry whose
  key collides with a column on that joined table (`status` is the common
  one - plenty of related tables have their own), you may need to add
  `->from('your_table.column')` to that entry - see "The view page selects
  its own data" in `docs/02-resources.md` for the exact symptom
  (`ambiguous column name`) and fix.
- **`MoneyField` now shares `MoneyColumn`/`MoneyEntry`'s minor-unit
  convention.** It previously edited the raw stored value directly, so a
  column storing cents (PanelKit's documented default for money) showed and
  accepted a decimal amount that was two orders of magnitude wrong. `->major()`
  and `->divideBy()` now match the read-side API. **If you already adopted
  `MoneyField` against a column your `MoneyColumn`/`MoneyEntry` declared
  `->major()`/`->divideBy(1)` for, add the matching `->major()` to the field
  too** - its previous no-conversion behavior is now the *explicit* major-unit
  mode, not the default.
- **Navigation icon values are now validated.** `php artisan panel:doctor`
  reports a resource or page whose `$icon` is not one of PanelKit's curated
  names, naming the class and the bad value - previously an unrecognised
  name silently fell back to the generic package icon with no error anywhere.
- **`panel:install` no longer leaves decoy `app/Panel/Admin/Resources` and
  `app/Panel/Admin/Widgets` directories behind** on a fresh install (a
  cleanup ordering bug: only the `Resources` child was removed before the
  parent directory, so the parent's removal silently failed while `Widgets`
  was still inside it).
- Three canonical documentation examples (`docs/02-resources.md`,
  `docs/07-pages-and-panels.md`) used Filament's `$navigationGroup`/
  `$navigationSort`/`$navigationIcon` property names, which PanelKit has
  never read (the real names are `$group`/`$sort`/`$icon`) - corrected.
- Systemic form-field accessibility: every field type now carries
  `aria-invalid`/`aria-describedby` wired to its own error and help text,
  via one shared contract in `FormFieldControl.vue` rather than a per-field
  copy.

### Added

- `Entry::from()` / `Entry::fromRaw()` - the documented way to show a joined
  or computed value on an infolist (see "Showing a relationship value on an
  infolist" in `docs/02-resources.md`). `TextEntry::make('customer.name')`
  dot notation is not supported.
- `panel-icon-names.json` alongside `panelIcons.ts` - the machine-readable
  list `panel:doctor` validates a resource's `$icon` against, kept in sync
  with `PANEL_ICONS` by a Vitest test.
- A parity test between the desktop (`panelIcons.ts`) and mobile
  (`icons.ts`) navigation-icon registries, so a name supported on one and
  missing from the other fails a build instead of silently showing a
  generic icon on one platform.

## Earlier history

Not yet reconstructed as dated entries. See `git log` and git tags
(`v1.4.x`) for the commit-level history up to this point.
