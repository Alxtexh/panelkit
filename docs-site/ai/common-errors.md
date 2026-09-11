# 13. Common failure patterns

Every pattern below is a real, previously-observed mistake — not a
hypothetical. Most of them **do not produce an error** — that's exactly why
they're worth memorizing rather than trusting a test run to catch them.

## Wrong Filament property names

```php
// BAD
protected static ?string $navigationIcon = 'users';

// GOOD
protected static string $icon = 'users';
```

Same mistake, different property: `$navigationGroup` → `$group`,
`$navigationSort` → `$sort`. None of these error — the wrong property is
just an unused class property, and the resource falls back to a generic
icon with no group/sort applied. `panel:doctor` catches this by reflection.

## Dot-notation relationship access

```php
// BAD — does not do what it looks like it does
TextEntry::make('customer.name')
SelectField::make('x')->relationship('customer.owner', 'name') // relationship() takes a MODEL CLASS, not a path

// GOOD
TextEntry::make('customer_name')->from('customers.name'), // with the join declared on the resource's query
SelectField::make('customer_id')->relationship(Customer::class, 'name'),
```

See [Infolists](/ai/infolists) and [Forms](/ai/forms).

## Searchable relationship field inside a bare RelationManager

```php
// BAD — throws at schema-build time
RelationManager::make('items', 'Items')
    ->related(OrderItem::class, 'order_id')
    ->form(fn ($form) => $form->schema([
        SelectField::make('product_id')->relationship(Product::class, 'name'), // implicitly searchable
    ]));

// GOOD
RelationManager::make('items', 'Items')->resource(OrderItemResource::class);
```

See [Relation managers](/ai/relation-managers).

## Money unit mismatch

```php
// BAD — MoneyField stores decimals, MoneyColumn assumes cents on the SAME column
MoneyField::make('amount')->major(),
MoneyColumn::make('amount'), // no ->major() — disagrees with the field above

// GOOD — both agree
MoneyField::make('amount')->major(),
MoneyColumn::make('amount')->major(),
```

See [Money](/ai/money) — read it before writing any money field, not after
hitting this.

## View data coupled to table columns (a real, fixed historical bug)

An earlier version of PanelKit built the View page's data from the same
*column list* as the List page — an infolist entry for an attribute the
table didn't select rendered a dash even though the value existed. This is
fixed: `infolist()`, when non-empty, drives its **own column list**,
independent of `table()->columns()`. Don't assume you still need to add a
column to `table()` for it to be available on the View page.

**The column list is independent; the underlying joins are not.** The View
page still runs on the same `Table::query()`/`Table::constrain()` the
resource's `table()` method declared — an infolist entry can read
`->from('customers.name')` for free only if `table()->query()` already
joins `customers`. If nothing joins that table at all, adding the entry
alone won't create the join; the join is declared once, on `table()`, and
both List and View build on it. See [Infolists](/ai/infolists).

## Unsupported icon names

```php
// BAD — falls back to a generic icon silently
protected static string $icon = 'invoice-icon'; // not in the allowlist

// GOOD — pick from the curated list
protected static string $icon = 'receipt';
```

See the full allowlist in [Navigation](/ai/navigation).

## Raw foreign keys in user-facing UI

```php
// BAD
TextColumn::make('customer_id'),

// GOOD
TextColumn::make('customer_name')->from('customers.name'),
```

An id is meaningless to an operator and is exactly the kind of thing that
should never need explaining in a support ticket.

## Native HTML controls when a PanelKit primitive exists

```php
// BAD — inside a RecordAction confirmation
window.confirm('Are you sure?')

// GOOD
->confirm('Are you sure?')  // renders PkModal — window.confirm is silently
                              // suppressed in embedded browsers and fails invisibly
```

## Resource-specific CSS for a framework layout issue

If a screen looks wrong, check whether it's missing a `PAGE_SHELL`/
`FORM_MEASURE` token or wrapped in an unnecessary `mx-auto max-w-*` before
writing new CSS — see [Customization](/customization/). A CI gate
(`make check-page-shell`) exists specifically to catch the latter.

## Editing framework internals for an application-level problem

If a fix requires editing anything under `vendor/alxtexh-enterprise/panel`,
stop — that's very likely the wrong layer. Application behavior (a
resource, a policy, a custom field) belongs in the application; see
[Architecture](/getting-started/architecture) for where PanelKit's own
files actually live vs. where yours do.

## Assuming an optional package is installed

`Resource::importable()` and `Panel::billingWebhookMapper()` are core
hook points — but the concrete importer classes and the generic billing
adapter they'd typically use live in **separate, optional** Composer
packages (`panel-operations`, `panel-billing`). Check
`php artisan panel:modules` before writing code that assumes either is
present. See [SaaS blueprint](/ai/saas-blueprint).

## A command name that doesn't exist

A handful of command names have changed or were never quite what an older
guide said — `make:relation-manager` is not a command (it's
`make:panel-relation-manager`); `panel:suspend-tenant` is not a command
(it's `panel:tenant-suspension`). Check the
[command reference](/commands/) or the generated `AGENTS.md`, not memory.
