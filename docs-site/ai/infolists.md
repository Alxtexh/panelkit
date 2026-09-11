# 5. Infolists

Full reference: [Infolists guide](/infolists/). This page is the AI-facing
recipe for a View page specifically.

## The one fact to internalize

**The column list is independent; the joins are not.** Adding a field to a
resource's `infolist()` does **not** require adding it to `table()`, and
vice versa — an empty `infolist()` falls back to the table's columns; a
non-empty one replaces that fallback with its own column list built from
its entries. But the View page still runs on the same `Table::query()`
joins and `Table::constrain()` predicates `table()` declared. An entry can
read `->from('customers.name')` for free only if `table()->query()` already
joins `customers` — the join itself is declared once, on `table()`, never
inside `infolist()`.

## When to write a dedicated infolist

Only once the View page genuinely needs information the table doesn't show
— audit fields, a computed summary, a joined attribute nobody needs in the
list. If the table already shows everything worth showing, leave
`infolist()` at its default empty array.

## `from()` and `fromRaw()` — correct usage

```php
TextEntry::make('customer_name')->from('customers.name'),   // joined column
TextEntry::make('unread_count')->fromRaw('(select count(*) ...)'), // computed
```

Both require the entry's own `key` to be flat (no dot) — `from()` names the
qualified source column separately from the key it's aliased back to.
`fromRaw()` must never receive anything built from request input; it's a
developer-written literal only, with no runtime injection protection.

## Do not

::: danger `TextEntry::make('customer.name')` does not work
This is the single most important rule in this file. Dot-notation
relationship access is a Filament convention that does **not** exist in
PanelKit's infolists (or its forms — see [Forms](/ai/forms)). Tracing the
actual source: a dotted key is passed straight through as if it were a raw
SQL `table.column` reference, producing either a query error or a
meaningless literal key nothing in the row payload matches. There is no
silent partial success here — but there's also no helpful validation error
pointing you at the fix, so an agent that doesn't know this rule burns time
debugging a blank field or a syntax error instead of just using the
supported pattern above.
:::

- Do not assume adding a column to `infolist()` also adds it to `table()`.
- Do not invent a "placeholder" or "null text" configuration on an `Entry` —
  the em-dash fallback for missing values is a client-side rendering
  concern, not a server-side property to set.
