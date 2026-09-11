# Money

Money is the field type most likely to be silently wrong: a mismatch between
storage and display doesn't crash anything, it just makes every amount on
screen ten or a hundred times too big or too small. This guide exists to make
that specific mistake close to impossible.

## The one rule

**PanelKit stores money in minor units by default: an integer count of the
smallest unit of the currency.**

```
12500  →  $125.00
   500  →  $5.00
     1  →  $0.01
```

This is the same convention Stripe, most payment processors, and most
accounting systems use, for the same reason: a `DECIMAL`/`float` amount drifts
under repeated arithmetic, and a total that's out by a cent is a support
ticket nobody can reproduce. An `INTEGER` column storing cents never drifts.

If your database genuinely stores decimal amounts (a `DECIMAL(10,2)` column,
or an existing schema you don't control), call `->major()` on the
column/field/entry — see [Storing major units instead](#storing-major-units-instead)
below. Do this **once, consistently**, for a given column across every screen
that touches it.

## The three places money appears

The same column shows up in three unrelated schema declarations — a table
column, a form field, and an infolist entry — and **all three must agree** on
whether the stored value is minor or major units. PanelKit does not
synchronize this for you across the three; agreement is your responsibility,
and disagreement is exactly the silent-wrongness this guide is about.

```php
// Table (List page)
MoneyColumn::make('amount')->currency('USD')->sortable(),

// Form (Create/Edit pages)
MoneyField::make('amount')->required(),

// Infolist (View page)
MoneyEntry::make('amount'),
```

With no `->major()` anywhere, all three read and write `12500` as `$125.00`.
Change your mind on one, change it on all three.

### Rows with different currencies

```php
MoneyColumn::make('amount')->currencyFrom('currency_code'),
```

`currencyFrom()` reads the currency per row from another column, rather than
fixing one currency for the whole table with `currency()`.

## Storing major units instead

```php
MoneyColumn::make('amount')->major()->currency('USD'),
MoneyField::make('amount')->major(),
MoneyEntry::make('amount')->major(),
```

`->major()` tells the field/column/entry that the underlying database value is
already a decimal amount (`125.00`, stored as `125.00` or `125.0`), not an
integer count of cents. Call it on all three, or a resource ends up reading
`125.00` as if it were `1.25` (or writing `125` back as `12500`) depending on
which screen you forgot.

## Formatting is client-side, on purpose

MoneyColumn and MoneyEntry format the amount **in the viewer's browser
locale** — grouping separators, decimal separators, currency symbol placement
— exactly like a date. Formatting on the server would print the *server's*
locale to every viewer regardless of where they are, which is wrong for
almost everyone outside the server's own region.

## Recommended database schema

```php
Schema::table('invoices', function (Blueprint $table) {
    $table->unsignedBigInteger('amount');       // minor units: cents
    $table->char('currency_code', 3)->default('USD');
});
```

An `unsignedBigInteger` (or `bigInteger` if the amount can be negative, e.g. a
refund or a running balance) comfortably holds minor-unit amounts well beyond
any realistic invoice total, with no floating-point rounding behavior to
reason about.

## Round-trip behavior

A `MoneyField` submits and validates as an integer (minor units) or a decimal
string (major units), matching whichever mode it's in. A `MoneyColumn` and
`MoneyEntry` reading the *same* underlying column with the *same* mode will
always render the identical amount the field wrote — that consistency is the
entire point of fixing the convention at the column/field/entry level instead
of formatting ad hoc in a Blade/Vue template.

## Checklist before shipping a money field

- [ ] Does the database column store minor units (integer) or major units (decimal)?
- [ ] Does `MoneyColumn` on the List page match that choice (`->major()` or not)?
- [ ] Does `MoneyField` on Create/Edit match that choice?
- [ ] Does `MoneyEntry` on the View page match that choice?
- [ ] If rows have different currencies, is it `currencyFrom('column')`, not a single fixed `currency()`?
- [ ] Are you formatting money anywhere by hand (string concatenation, a Blade filter) instead of using these three classes? If so, stop — that's the exact pattern this guide exists to replace.

## What NOT to do

```php
// BAD — a TextColumn with a manually prefixed dollar sign has no unit
// semantics at all: it doesn't know if $amount is already formatted, in
// cents, or in dollars, and neither does the next person reading this file.
TextColumn::make('amount')->formatStateUsing(fn ($state) => '$'.number_format($state / 100, 2)),

// GOOD
MoneyColumn::make('amount')->currency('USD'),
```

```php
// BAD — two columns for one fact invites them to drift (one shows the raw
// integer, the other a formatted string) and doubles the width of the row
// for no benefit.
TextColumn::make('amount_cents'),
TextColumn::make('amount_formatted'),

// GOOD — one column, one source of truth
MoneyColumn::make('amount'),
```
