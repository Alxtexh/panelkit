# Validation

## Every field validates itself

```php
TextField::make('email')->as('email')->rule('email'),
NumberField::make('age')->min(0)->max(150),
```

Most fields derive their own base rules from their *type* (`typeRules()`) —
a `NumberField` is always at least `integer`, a `DateField` is always at
least `date` — before any `->rule()` calls you add on top.

## Rule objects, not just strings

```php
SelectField::make('plan_id')->rule(ExistsInScope::of(Plan::class)),
```

`rule()` accepts real Laravel rule objects as well as strings — this is how
`SelectField::relationship()` enforces that a submitted id exists in the
*tenant-scoped* related table, not merely that it's an integer.

## Multi-value fields validate their members, not just the array

```php
MultiSelectField::make('tags')->options(['red', 'green', 'blue']),
```

`['array']` alone would accept `['red', 'anything-at-all']`, because the
submitted value genuinely is an array. Every field that holds several values
(`MultiSelectField`, `CheckboxListField`, `TagsField`, `RepeaterField`)
declares an `additionalRules()` entry for `{key}.*` that validates each
member individually — this is a real, previously-real failure class, not a
hypothetical: an unvalidated multi-value field is how a bulk selection ends
up containing an id belonging to another tenant.

## Conditional requirement follows conditional visibility

```php
SelectField::make('billing_cycle')->visibleWhen('plan_type', 'postpaid')->required(),
```

A field's `visibleWhen()` condition doubles as a `required_if` validation
rule automatically — hiding a required field client-side can never silently
drop its own server-side requirement, because the same declaration produces
both.

## The mass-assignment boundary

See [Form schema — sanitize()](/forms/#the-mass-assignment-boundary-form-sanitize)
for how `Form::sanitize()` turns the whole schema into an allow-list at
submission time, independent of any individual field's own rules.
