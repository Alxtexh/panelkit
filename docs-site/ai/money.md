# 7. Money — read this before touching any money field

Full reference: [Money guide](/money/). This is the single highest-cost
silent-failure class in the framework — nothing errors when this is wrong,
every amount is just off by a factor of 100 (or the field shows major units
where minor units are stored, or vice versa).

## Before writing a single line

**Determine, don't guess**: is the database column storing MINOR units
(an integer count of the smallest unit — cents) or MAJOR units (a decimal)?

- **PanelKit's default is MINOR units.** `12500` in the column means
  `$125.00`.
- If the column is a `DECIMAL` type, or an existing schema you don't
  control already stores `125.00` literally, that's MAJOR units — you must
  opt out explicitly with `->major()`.

## The rule

`MoneyColumn`, `MoneyField`, and `MoneyEntry` for the **same database
column** must all agree — all call `->major()`, or none of them do. There is
no global config flag for this; it's set per declaration, so it's entirely
possible (and a real, previously-seen mistake) for one screen to disagree
with another on the same column.

```php
// Every one of these three MUST match for the same `amount` column:
MoneyColumn::make('amount')->currency('USD'),   // list
MoneyField::make('amount'),                      // form
MoneyEntry::make('amount'),                      // view
```

## Never

- Never mix `MoneyColumn`'s default (minor units) with a `MoneyField` you've
  set to `->major()` on the same column without matching both.
- Never guess which mode a column is in from its name alone — check the
  migration, or the actual stored value in a sample row.
- Never format money by hand (`number_format($cents / 100, 2)` inside a
  `TextColumn::formatStateUsing()`) instead of using `MoneyColumn` — a
  hand-rolled formatter has no unit semantics anyone else can check.
- Never format money server-side for display — `MoneyColumn`/`MoneyEntry`
  format client-side, in the viewer's own locale, deliberately: a
  server-formatted string bakes in the server's own grouping/decimal
  conventions for every viewer regardless of where they are.

## Rows with different currencies

```php
MoneyColumn::make('amount')->currencyFrom('currency_code'),
```

Use `currencyFrom()`, not a single fixed `currency()`, whenever different
rows can be in different currencies.
