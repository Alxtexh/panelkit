# Infolists & View pages

An infolist declares a resource's dedicated View page — independently of
what the List page's table shows.

```php
public static function infolist(): array
{
    return [
        TextEntry::make('name'),
        BadgeEntry::make('status'),
        MoneyEntry::make('total')->currency('USD'),
        ImageEntry::make('photo')->fallback('initials'),
        RepeatableEntry::make('lines')->schema([
            TextEntry::make('description'),
            MoneyEntry::make('amount'),
        ]),
    ];
}
```

## Entries

11 concrete `Entry` classes live in `Alxtexh\Panel\Infolists`:

| Class | Renders | Notable options |
|---|---|---|
| [`TextEntry`](/api/classes/text-entry) | Plain text | The simplest entry — just a key, label, optional `url()`/`action()` |
| [`BadgeEntry`](/api/classes/badge-entry) | A coloured pill | `colors()`, `defaultColor()` |
| [`MoneyEntry`](/api/classes/money-entry) | A formatted amount | `currency()`, `divideBy()` — see the [money guide](/money/) |
| [`ImageEntry`](/api/classes/image-entry) | An image, with a fallback | `fallback('initials'\|'icon'\|'none')`, `fallbackFrom()` |
| [`DateTimeEntry`](/api/classes/date-time-entry) | A date or datetime | `date()` / `dateTime()` |
| [`IconEntry`](/api/classes/icon-entry) | A named icon | `boolean()` preset for a yes/no icon |
| [`KeyValueEntry`](/api/classes/key-value-entry) | A key/value pairs table | `labels()` renames the two columns |
| `CodeEntry` | Monospace text | `language()` is a display hint only |
| `ColorEntry` | A swatch + hex value | `swatchOnly()` |
| [`RepeatableEntry`](/api/classes/repeatable-entry) | A list of sub-entries, one row per array item | Refuses to nest — a repeating group of repeating groups is a related table; use a nested resource or RelationManager instead |
| [`ViewEntry`](/api/classes/view-entry) | A named Vue component you register yourself | `view('name')` — same extension pattern as a custom field control |

`Action` (from an infolist entry) POSTs `{ action }` to
`{resource}/{id}/infolist-action` when clicked; `url()` renders a plain link
and is never itself an authorization check.

## Independent View data

**This is the detail most likely to surprise someone coming from a
table-only mental model**: an infolist is not "which table columns to also
show." When `infolist()` returns any entries, the View page's **column
list** comes from those entries, not from `table()`'s own `columns()` and
not from eager-loaded relations. Adding a field to `infolist()` never
requires adding it to `table()`, and vice versa.

**What's independent is the column list, not the base query.** The View
page still runs on top of the same `Table::query()` joins and
`Table::constrain()` predicates the resource's `table()` method declared —
only the SELECT list swaps to the infolist's own entries (via each entry's
`->from()`/`->fromRaw()`, exactly like a column). Concretely: if
`table()->query()` joins `customers`, an infolist entry can read
`->from('customers.name')` with no further wiring — the join is already
there. But if nothing in `table()` joins `customers` at all, adding
`TextEntry::make('customer_name')->from('customers.name')` to `infolist()`
alone will not make that join happen; the join is still declared once, on
the resource's `table()`, and both the List and View pages build on it.

## Automatic fallback

```php
public static function infolist(): array
{
    return []; // the default
}
```

An empty `infolist()` (the default on every resource) means the View page
falls back to whatever `table()`'s own columns select — a reasonable
default for a resource simple enough that the list and detail view show the
same information.

## Custom infolists

Reach for a dedicated `infolist()` once the View page needs to show more (or
different) information than the table — audit fields, a computed summary, a
related record's attributes via a join — anything that would clutter the
list but belongs on the detail page.

## Relationship display

Joins, never dot-notation.

::: danger `TextEntry::make('customer.name')` does not work
Dot-notation relationship access — a natural habit if you've used Filament —
is **not supported** and will not resolve here. PanelKit does not walk a
relationship per row for an infolist value, because that's exactly the N+1
query pattern joining a table avoids. A dotted key is treated as a literal
(and almost certainly invalid) SQL column reference, not a relationship
path — this fails loudly as a query error, not silently as a blank field.
:::

The correct, supported pattern is the same one [Tables](/tables/#joined-computed-values)
uses — declare the join once on the resource's query, then give the entry a
flat key with an explicit `->from()`:

```php
public static function table(Table $table): Table
{
    return $table
        ->query(fn ($query) => $query->leftJoin('customers', 'customers.id', '=', 'invoices.customer_id'))
        ->columns([ /* ... */ ]);
}

public static function infolist(): array
{
    return [
        TextEntry::make('customer_name')->label('Customer')->from('customers.name'),
    ];
}
```

The join must already exist in the query (via `Table::query()`); the entry's
own `key` is never dotted — only the `->from()` argument names the qualified
column.

## Null and missing-image display

There is no server-side "placeholder" mechanism on `Entry` — a null or empty
value renders as an em dash (`—`) entirely on the client, not because PHP
sent one. `ImageEntry` is the one entry with richer fallback behavior:
`fallbackFrom('name')` names a second record attribute (added to the SELECT
automatically) used to render initials when the image itself is missing or
fails to load.
