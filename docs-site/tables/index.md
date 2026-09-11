# Columns

`Table::columns()` declares a resource's list screen. Search, sort persistence,
pagination, column visibility, density, saved views, selection, export and the
empty state all come with the table for free — what you declare here is only
the part specific to your data.

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('name')->sortable()->searchable()->locked(),
            BadgeColumn::make('status')->colors(['active' => 'success', 'closed' => 'neutral']),
            MoneyColumn::make('total')->currency('USD')->sortable(),
            DateColumn::make('created_at')->sortable()->muted(),
        ])
        ->keyColumn('id')
        ->defaultSort('created_at', 'desc');
}
```

## Column types

| Class | Renders | Notable options |
|---|---|---|
| [`TextColumn`](/api/classes/text-column) | Plain text | `mono()`, `transform('upper'\|'lower')`, `copyable()` |
| [`BadgeColumn`](/api/classes/badge-column) | A coloured pill | `colors()`, `labels()`, `defaultColor()` |
| [`MoneyColumn`](/api/classes/money-column) | A formatted amount | `currency()`, `currencyFrom()`, `major()` — see the [money guide](/money/) |
| [`IconColumn`](/api/classes/icon-column) | A named icon, optionally boolean-mapped | `boolean()`, `icons()`, `colors()` |
| [`ImageColumn`](/api/classes/image-column) | A thumbnail | `rounded()`, `size()`, `fallback()` |
| [`DateColumn`](/api/classes/date-column) | A date or datetime | `withTime()` |
| [`TagsColumn`](/api/classes/tags-column) | A list of chips | `limit()`, `separator()` |
| `CheckboxColumn` | Read-only boolean | Distinct from `ToggleColumn` — read-only, `aria-readonly` |
| `ColourColumn` | A swatch + hex value | `swatchOnly()` |
| `CodeColumn` | Monospace, with a language hint | `language()` |
| `KeyValueColumn` | A small key/value list | `labels()` |
| `RatingColumn` | Stars | `max()` (clamped 1–10) |
| `ColumnGroup` | Groups leaf columns under one header (layout only — leaf columns still query/render individually) | `make(label, columns)` |

### Inline-writable columns

Three columns write back to the record on interaction, not just display it:
[`SelectColumn`](/api/classes/select-column) (change on select),
[`ToggleColumn`](/api/classes/toggle-column) (write on click), and
`TextInputColumn` (write on blur/Enter, with its own `rules()`). Each follows
the same three-part security contract: the new value must be in an allowlist
(or pass validation), it's validated server-side regardless of what the
client sent, and the record is re-authorized before the write — never assume
a value rendered from an authorized list is still safe to write back.

All column types share `sortable()`, `searchable()`, `summarize()` (a footer
aggregate — `Summarizer::sum()/average()/min()/max()/count()`), `copyable()`,
`locked()` (excluded from the column-visibility menu), `width()`, `align()`,
`muted()`, and `from()`/`fromRaw()` — see
[Joined & computed values](#joined-and-computed-values) below.

## Sorting, searching, filtering

```php
$table
    ->defaultSort('created_at', 'desc')
    ->splitsSearchTerms()               // "ada engineer" matches rows containing both words
    ->searchMode('relevance')           // or 'prefix' (default) / 'exact'
    ->searchesRelation('customer', ['name', 'email'])  // search through a relationship
    ->filters([
        SelectFilter::make('status')->options(['open', 'closed']),
        BooleanFilter::make('is_active')->labels('Active', 'Inactive'),
        DateRangeFilter::make('created_at'),
        TrashedFilter::make(),
    ]);
```

::: warning `defaultSort()`'s column must itself be `->sortable()`
Omitting `defaultSort()` entirely falls back to sorting by `created_at` — but
that fallback (and any explicit `defaultSort()` call) still has to name a
column that's actually declared `->sortable()` in `columns()`, or the list
throws `InvalidArgumentException: Default sort [...] is not in the sortable
allowlist` the first time anyone requests it. If your columns don't include a
sortable `created_at` (or whatever you sort by), add one or set
`defaultSort()` to a column that already is one.
:::

Filter classes: [`SelectFilter`](/api/classes/select-filter) (one of a
list, or `->relationship()` for a BelongsTo picker),
[`MultiSelectFilter`](/api/classes/multi-select-filter),
[`BooleanFilter`](/api/classes/boolean-filter) (a genuine three-state
yes/no/either — `null` is not the same as `false`),
[`DateRangeFilter`](/api/classes/date-range-filter) (built-in presets: today,
yesterday, last/next 7 or 30 days, this/last month),
[`NumberRangeFilter`](/api/classes/number-range-filter),
[`TrashedFilter`](/api/classes/trashed-filter) (with/without/only soft-deleted),
and `QueryBuilderFilter` for arbitrary nested AND/OR conditions (depth- and
rule-capped; treat as advanced — it builds a filter tree from user input, so
read its allowlist behaviour before reaching for it).

**Filter options are always data, never schema** — an options list that
depends on the database (`SelectFilter::options(fn () => …)`) must be a
closure, resolved once per request, never computed eagerly where it could be
cached into another tenant's screen.

## Pagination

Keyset pagination by default — correct and fast on large tables, but it means
there's no "jump to page 40." `perPage()` and `perPageOptions()` configure the
page-size control; the operator still moves forward/backward, not to an
arbitrary offset.

## Actions and bulk actions

```php
$table
    ->recordActions([
        RecordAction::make('suspend')->icon('ban')->authorize('update')
            ->confirm('Suspend this account?')
            ->handle(fn (Client $client) => $client->update(['status' => 'suspended'])),
    ])
    ->bulkActions([
        BulkAction::make('export', 'Export')->handle(fn ($records) => /* ... */ null),
    ]);
```

See [Actions](/actions/) for the full `RecordAction`/`BulkAction` API —
confirmation dialogs, forms-before-run, per-record authorization, and the
`mutate()` vs `handle()` distinction.

## Money, badges, dates

Use [`MoneyColumn`](/api/classes/money-column), never a `TextColumn` with a
manually formatted string — see the dedicated [money guide](/money/) for the
minor-vs-major-units contract this column shares with `MoneyField` and
`MoneyEntry`. Use [`BadgeColumn`](/api/classes/badge-column) for status-shaped
values instead of colouring text by hand — colours are semantic intents
(`success`, `warning`, `danger`, `neutral`), not CSS classes, so a theme
change never requires touching a resource. [`DateColumn`](/api/classes/date-column)
formats in the viewer's own timezone client-side, the same reasoning as money.

## Joined & computed values

```php
TextColumn::make('customer_name')->from('customers.name'),
TextColumn::make('unread_count')->fromRaw('(select count(*) from messages where read_at is null)'),
```

`from()` qualifies a column that lives on a joined table — PanelKit aliases
it back to the column's own key automatically, so `->from('customers.name')`
on a key `customer_name` still arrives as `customer_name`, not `name` (a
hand-written alias here is a classic silent bug: the query is valid, the join
is correct, and the cell just renders an em dash because nothing selects the
key the client is looking for).

`fromRaw()` is for a value the *database* computes — it must be a
developer-written literal, never built from request input; there is no safe
way to parameterize a raw SELECT expression.

## Row click navigation

```php
$table->rowClick('view'); // or 'none' (default)
```

Makes an entire row clickable, navigating to the record's authorized `view`
action — never an invented route, and off by default.
