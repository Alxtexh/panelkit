# Selects & relationships

## Fixed options

```php
SelectField::make('status')->options(['draft', 'sent', 'paid']),
```

## A BelongsTo picker

```php
SelectField::make('customer_id')->relationship(Customer::class, 'name'),
```

`relationship()` takes a related model class and the **attribute name on
that model** to search and display — not a dotted relationship path. It:

- Forces `searchable(true)` automatically, since a relationship's option set
  can grow without bound.
- Adds `ExistsInScope::of($model)` as a validation rule, so a submitted id is
  checked against the actual, tenant-scoped table — not just "is this an
  integer."
- Resolves the record's *current* value's label with one row lookup on the
  Edit page, rather than shipping the whole option list just to find one
  label.

::: warning No dot-notation parsing happens here
`$titleAttribute` is passed straight to a `where($titleAttribute, 'like', …)`
query against `$model` — it is a literal attribute name on that model, never
a relation path split on `.`. This is a common Filament-trained assumption
that doesn't hold here; see [Infolists](/infolists/) for the equivalent (and
more consequential) mistake with `TextEntry::make('customer.name')`.
:::

## Narrowing the query

```php
SelectField::make('assignee_id')->relationship(
    User::class,
    'name',
    modifyQuery: fn ($query) => $query->where('is_staff', true),
),
```

## Search without a full relationship binding

```php
SelectField::make('tag')->searchable(fn (string $term): array =>
    Tag::where('name', 'like', "{$term}%")->limit(25)->pluck('name', 'id')->all()
),
```

## A dedicated picker page instead of a dropdown

```php
SelectField::make('product_id')->tableSelect(ProductResource::class),
```

For a relation with enough rows or enough columns that a dropdown search box
isn't the right interaction — opens a dedicated picker page reusing the
target resource's own list query, rather than a modal.

## Create-and-pick in one dialog

```php
SelectField::make('customer_id')->relationship(Customer::class, 'name')
    ->createOption([
        TextField::make('name')->required(),
        TextField::make('email')->required(),
    ]),
```

Opens a small inline form; on submit, validates it independently and inserts
a new related record (tenant-stamped automatically), then selects it — all
without leaving the parent form.

## A MorphTo picker

```php
SelectField::make('subject')->morphTo([
    Invoice::class => 'number',
    Ticket::class => 'subject',
]),
```

The client submits `{type, id}`; storage splits into `{key}_type` and
`{key}_id` columns automatically.

## Validating a non-relationship select against its real option set

Every fixed-choice field (`SelectField`, `RadioField`, `VisualSelectField`,
`ToggleButtonsField`) validates a submitted value against the actual resolved
option set — including the case where that set is empty, which used to
accept anything before being fixed. A **searchable** `SelectField` validates
differently: since its true valid set isn't the small window of options
currently loaded, submitted values are checked through the same
`relationship()`/`searchable()` query path rather than a static list.
