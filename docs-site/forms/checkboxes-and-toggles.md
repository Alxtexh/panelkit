# Checkboxes & toggles

```php
CheckboxField::make('is_featured'),
ToggleField::make('is_active'),
```

`CheckboxField` and `ToggleField` are functionally identical — same
`boolean` validation rule, same behavior — and differ only in which control
fits the surrounding form visually. Both share a detail worth knowing if
you're building a custom boolean field: an **unticked** checkbox or toggle
submits no key at all in the request body, so both override `absentMeans()`
to resolve a missing submission as `false` rather than the base `Field`
default of "write nothing." Without that override, unchecking a
previously-true boolean would silently fail to persist.

## A read-only checkbox in a table

[`CheckboxColumn`](/tables/) is the List-page display equivalent — but it's
deliberately read-only (`aria-readonly`), distinct from
[`ToggleColumn`](/tables/), which writes on click. Reach for `ToggleColumn`
only when clicking it in the list should actually change the record.

## Several booleans from one list

```php
ToggleButtonsField::make('visibility')->boolean('Public', 'Private'),
CheckboxListField::make('permissions')->options(['read', 'write', 'delete']),
```

`ToggleButtonsField::boolean()` is a convenience preset for a two-state
choice rendered as buttons rather than a single switch. `CheckboxListField`
is for several independent booleans from one option set (multiple can be
checked at once) — different from `MultiSelectField` mainly in presentation.
