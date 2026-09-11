# Custom columns & entries

Columns and entries share the same underlying mechanism as
[custom fields](/forms/custom-fields), applied to the List and View pages
respectively.

## A custom column

```php
final class ProgressColumn extends Column
{
    public function type(): string
    {
        return 'progress';
    }

    public function toArray(): array
    {
        return [...parent::toArray(), 'max' => $this->max ?? 100];
    }
}
```

::: warning Override `toArray()`, not `toSchema()`
`Table`'s serialisation loop calls a column's `->toArray()` directly, never
`->toSchema()`. Several shipped columns (`CodeColumn`, `KeyValueColumn`,
`MoneyColumn`, `RatingColumn`) carry an explicit docblock note about this,
because it's exactly the kind of mistake that produces a column which
renders but silently drops every custom option you added — the base schema
fields arrive, yours don't, and nothing errors.
:::

An editable column (writing back to the record on interaction, like
`ToggleColumn` or `SelectColumn`) implements `InlineWritableColumn` instead
— `isInlineWritable()`, `castValue()` (validate the incoming write), and
`writableColumn()` (the bare column name, stripped of any table qualifier).
Extending `EditableColumn` gives you this contract with `isInlineWritable()`
already returning `true`.

## A custom entry

```php
final class ProgressEntry extends Entry
{
    public function type(): string
    {
        return 'progress';
    }
}
```

Entries share `HasQualifiedSource` (`from()`/`fromRaw()`) with `Column` —
this is the *only* other class that trait is used by, which is why a joined
or computed value works identically on a table column and a view-page entry.

## Registering the Vue side

```ts
import { registerFieldControl } from '@alxtexh-enterprise/panel' // yes, the same registry name for fields
```

Columns and entries use their own analogous registries in the client
package — register a component against the same `type()` string your PHP
class returns, following the pattern in
[Vue extension points](/extending/vue-extension-points).

## When a custom column/entry isn't the answer

If what you actually need is "show a Vue component nobody's built a
Field/Column/Entry wrapper for yet" on a screen you don't otherwise control —
a banner, a widget, a notice — reach for a
[render hook](/extending/vue-extension-points#render-hooks) instead of
inventing a column type that doesn't represent tabular data at all.
