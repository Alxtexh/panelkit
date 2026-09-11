# Custom fields

Before writing one, check the [full field catalogue](/forms/#every-field-type)
— 34 field types already ship, covering nearly everything an ordinary CRUD
screen needs. Reach for a custom field only when none of them fit, not as a
first move.

## Subclass `Field`

```php
final class SlugField extends Field
{
    public function type(): string
    {
        return 'slug';
    }

    protected function typeRules(): array
    {
        return ['string', 'regex:/^[a-z0-9-]+$/'];
    }

    protected function transformForStorage(mixed $value): mixed
    {
        return Str::slug((string) $value);
    }
}
```

`Field`'s constructor is `final` — configure per-instance defaults inside
your own fluent methods, not by overriding `__construct()`.

## The hook points, in the order data flows through them

| Hook | Direction | Default |
|---|---|---|
| `typeRules()` | — | `[]` |
| `additionalRules()` | — | `[]` — rules for *other* keys, e.g. `{key}.*` on a multi-value field |
| `valuesFrom($record)` → `presentValue($value)` | stored → shown | reads `$record->getAttribute($key)`, identity transform |
| `transformForStorage($value)` | validated → stored | identity |
| `omitsFromStorage($value)` | — | `false` — override to decline writing at all under some condition (distinct from writing `null`) |
| `expandStorage($value)` | — | `null` — override to write into more than one column, like a morph type/id pair |
| `absentMeans()` | — | `Field::ABSENT_MEANS_NOTHING` — override (as `CheckboxField`/`ToggleField` do) if a missing submission key should mean something other than "leave it alone" |
| `resolveOptions()` | — | `null` — override for an option-bearing field |

## Register the matching Vue control

A field type with no registered control has nothing to render. On the client:

```ts
import { registerFieldControl } from '@alxtexh-enterprise/panel'
registerFieldControl('slug', SlugFieldControl)
```

The registry is consulted **before** the kit's own built-in type list, so a
custom control for `'slug'` renders correctly, and re-registering a type
(harmless under Vite HMR) simply replaces the previous control with no
warning. The control receives `field`, `modelValue`, `disabled`, `errors`,
and `options` as props, and emits a plain `update:modelValue` — an ordinary
`v-model` contract, nothing PanelKit-specific to learn.

## An option-bearing custom field needs `resolveOptions()`

If your field has options, override `resolveOptions()` as well as
registering a control — a field with a control but no `resolveOptions()`
override renders with nothing to choose from and reports no error, which is
a frustrating thing to debug from the outside.
