# Troubleshooting

Every entry below is a real, previously-encountered failure mode — verified
against source, tests, or `panel:doctor`'s own check list, not a
hypothetical. Run `php artisan panel:doctor` first; most of these produce a
specific, named finding rather than an exception.

## Fatal error: "Type of ...::$icon must be string" on class load

`$icon` is declared **non-nullable** (`string`, not `?string`) on the
`Resource`/`Page`/`Cluster` base classes. Overriding it with a nullable type
is a PHP fatal error at class-load time (PHP does not allow a subclass to
widen an inherited typed property to nullable), not a runtime PanelKit
error:

```php
// BAD — fatals immediately, before any request is even served
protected static ?string $icon = 'file-text';

// GOOD
protected static string $icon = 'file-text';
```

Every other navigation-adjacent property (`$group`, `$sort`, `$cluster`,
`$parent`) genuinely is nullable — only `$icon` (and `$model`, `$panel`)
are not. If in doubt, check the
[generated API reference](/api/classes/resource#configuration-properties)
for the exact current type rather than copying a `?string` pattern from
memory.

## The sidebar shows a generic icon instead of the one I set

Two distinct causes, both silent (neither is an error page):

1. **You used `$navigationIcon` instead of `$icon`.** This is Filament's
   property name, not PanelKit's. `panel:doctor` specifically detects this —
   its own docblock notes six real resources have independently made this
   exact mistake. Rename the property to `$icon`.
2. **`$icon` holds a name outside the supported allowlist.** An unsupported
   name falls back to a generic icon with no error. See the exact ~60-name
   list in [Navigation](/navigation/#icons). `panel:doctor` reports this too,
   as a separate check from #1.

## A resource shows nothing at all

**No policy is registered for the model.** This is PanelKit's deny-by-default
behavior, not a bug — a resource with no policy is invisible to everyone,
deliberately, rather than open to everyone. Run `panel:doctor`; it names
every resource missing a policy. Register one:

```php
Gate::policy(Invoice::class, InvoicePolicy::class);
```

## Relationship search doesn't work inside a RelationManager tab

A **simple** RelationManager (one with no `->resource()`) has no dedicated
`field-options` endpoint to search against — `SelectField::searchable()`
needs a live endpoint, and a simple RelationManager doesn't have one.
PanelKit fails this fast at schema-build time with an explicit exception
rather than shipping a search box that silently returns nothing. If you need
searchable relationship fields on a related list, give the RelationManager a
`->resource()` (a resource-backed RelationManager) instead. See
[Relation Managers](/relation-managers/).

## A money amount is off by 100× (or 1/100×)

**Minor/major unit mismatch.** Check that `MoneyColumn`, `MoneyField`, and
`MoneyEntry` for the *same* database column all agree on `->major()` (or all
omit it, meaning minor units). See the [money guide](/money/) — this is the
single most common money mistake and the reason that guide exists.

## A joined column renders as an em dash / missing value

You used `->from('table.column')` where `column` doesn't match the schema
key, and didn't get (or need) an alias — e.g. `->from('clients.name')` on a
key `client_name` selects a result column literally called `name`, and
nothing in the row payload has the key `client_name` to render. PanelKit
auto-aliases most cases (`table.column` back to the declared key) but an
explicit `as` you wrote yourself is always respected, including a wrong one.
Double check the alias, or drop it and let `from()` derive it automatically.

## Frontend changes aren't showing up after a deploy

**Stale published assets.** `panel:install`/`panel:update` publish
`public/vendor/panel/{app.css,app.js}` — if you also run your own Vite build
(`npm run build`), a mismatch between what's published and what Vite last
built can look like your change "didn't take." Rebuild and republish, and
confirm `panel:doctor` isn't reporting a stale kit CSS/JS finding.

## A View page shows different data than I expected from the List page

Table columns and infolist entries are **independent declarations** — adding
a field to a resource's `table()` does not add it to `infolist()`, and vice
versa. If a View page is missing something you see on the List page (or
showing something the List page doesn't), that's expected: declare it
explicitly in `infolist()`. See [Infolists & View pages](/infolists/).

## `TextEntry::make('customer.name')` doesn't work

Dot-notation relationship access is **not supported** in infolists — this is
a Filament convention PanelKit deliberately doesn't replicate. Use a joined
column with `->from()` instead:

```php
TextEntry::make('customer_name')->from('customers.name'),
```

## A generated resource's default sort order 500s

`make:panel-resource --generate` always emits a sortable `created_at`
`DateColumn` specifically so the generator's own default
`->defaultSort('created_at', 'desc')` has something valid to sort — if you
remove that column by hand, either remove the default sort too or point it
at another sortable column.

## An `AGENTS.md`/blueprint change didn't take effect

`panel:blueprint` (and `panel:install`'s automatic call to it) reads the
**running application** — its resource list, panels, and commands are
generated by introspection, not cached indefinitely. If you added a resource
and `AGENTS.md` doesn't mention it, re-run:

```bash
php artisan panel:blueprint
```

## A command name in an older guide doesn't work

A few command names have changed since early documentation was written.
Confirmed current names (verified directly against each command's
`$signature` in source):

| You might see written as | Actual command |
|---|---|
| `panel:suspend-tenant` | `panel:tenant-suspension` |
| `panel:index-knowledge` | `panel:knowledge` |
| `make:relation-manager` | `make:panel-relation-manager` |
| `panel:journey` (referenced in an older production guide) | Does not currently exist as a command — use `panel:benchmark` |

See the full [command reference](/commands/) for every current name.

## PHPStan / static analysis findings after upgrading

Two real historical causes, worth knowing if you hit something similar in
your own fork:

- A `DB::raw()` call built from a concatenated string needs a
  `literal-string`-typed input under strict analysis — see
  `HasQualifiedSource::fromRaw()`'s docblock for the exact assumption it
  makes (developer-authored literal, never request input).
- Normalizing a `value => label` map into a list by calling `array_map()`
  over separately-computed `array_keys()`/`array_values()` loses the
  per-element type pairing a static analyzer needs — prefer an explicit
  `foreach` with a per-element type check (see `SelectFilter::resolvedOptions()`
  for the pattern PanelKit itself uses).

## Installing into a fresh app leaves an empty `Panel/Admin` directory

Fixed as of the current release — `make:panel` seeds `Resources`/`Widgets`
subdirectories with a `.gitkeep` file so they survive a git clone, and an
earlier version of `panel:install`'s cleanup logic removed the directories
without first removing that file, which silently no-ops `rmdir()`. If you
see leftover `Panel/Admin/{Resources,Widgets}` after install on an old
version, upgrade — `panel:update` won't retroactively clean an already-run
install, but a fresh `panel:install` on the current version won't leave them
behind.

## A nested resource's "Quick Create" entry 404s

Nested resources are correctly excluded from the main sidebar (they have no
flat URL of their own — see [Nested resources](/resources/nested-resources)),
but the header's "Quick Create" shortcut menu has been observed listing one
anyway, linking to the resource's flat `/{key}/create` path, which 404s for
exactly the reason the resource is nested in the first place. This is a
product-level gap in that one menu's own filtering, not a configuration
mistake on your part — there's nothing to fix in your resource. Reach the
nested resource's create page from its parent's own page instead
(`/{parent}/{id}/{child}/create`).

## A sidebar group with only one member renders as a flat link

Setting `$group` on a single resource (with no sibling resource sharing that
group) does not produce a collapsible group header in the sidebar — it
renders as an ordinary flat link, as if `$group` had never been set. This is
intentional client-side rendering, not a sign that `$group` didn't take: a
group header with exactly one item under it has nothing to disclose. Confirm
`$group` is actually being read by checking the resource's schema payload
(or `PanelNavigation::build()`'s output) directly rather than trusting the
sidebar's visual appearance alone — the value is there even when the chrome
around it isn't.
