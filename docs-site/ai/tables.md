# 4. Tables

Full reference: [Tables guide](/tables/). This page is the AI-facing recipe
for a List page specifically.

## Recipe

Choose deliberately, don't default every column to visible:

- **Primary identifying column** — usually the resource's own `recordTitle()`
  candidate attribute (name, title, number, reference).
- **Searchable fields** — `->searchable()` only on columns an operator would
  actually type a search term to find.
- **Sortable fields** — `->sortable()` on anything with a meaningful order
  (dates, amounts, a natural key); not every column needs it.
- **Status as a badge**, never plain text — `BadgeColumn`, colours as
  semantic intents (`success`/`warning`/`danger`/`neutral`), never CSS
  classes chosen per-value.
- **Money as `MoneyColumn`**, never a `TextColumn` with a manually formatted
  string. Read [Money](/ai/money) first.
- **Dates as `DateColumn`** — formats client-side in the viewer's own
  timezone.
- **Filters** for the dimensions an operator actually narrows by — don't add
  a filter for every column just because you can.
- **Row navigation** (`->rowClick('view')`) when a row's own detail page is
  the obvious next click.
- **Row and bulk actions** as needed — see [Actions](/actions/).

## Don't overcrowd the table

Detailed information belongs on the View page
([Infolists](/ai/infolists)), not squeezed into the list as more and more
columns. A list with fifteen columns is usually a sign three of them belong
on a dedicated view instead.

## Joined and computed values

```php
TextColumn::make('customer_name')->from('customers.name'),
```

Always give a joined column its own flat key with `->from('table.column')`
— PanelKit aliases it back to the key automatically. Never put a dot inside
the column's own `key` itself; that's the infolist dot-notation mistake
applied to a table, and it produces the same silent-blank-cell failure. See
[Common errors](/ai/common-errors).

## Definitions must not query

`table()` builds a cached description. A closure passed to `->query()` is
for joins/eager-loading only — never a predicate, since it's dropped from a
`COUNT`. Use `->constrain()` for an actual row-scoping predicate. Neither of
these — nor an option list inside a `SelectFilter` — may run an eager,
non-closure query at definition time; a data-derived filter's options must
be a closure, resolved per request.
