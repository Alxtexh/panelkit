# Form schema & layout

`Form::schema()` declares a resource's create/edit form as a tree of layout
nodes and fields — the layout is data too, cached the same way `table()` is.

```php
public static function form(Form $form): Form
{
    return $form->schema([
        Section::make('Identity')->columns(2)->schema([
            TextField::make('name')->required(),
            CountryField::make('country'),
        ]),

        Section::make('Billing')
            ->visibleWhen('plan_type', 'postpaid')
            ->schema([
                SelectField::make('cycle')->options(['monthly', 'annual']),
            ]),
    ]);
}
```

## Layout primitives (`Alxtexh\Panel\Schema\*`)

| Class | Renders | Notes |
|---|---|---|
| [`Section`](/api/classes/section) | A titled, optionally collapsible group | The default reach-for |
| `Card` | Like Section, but a card shell instead of a bordered block | |
| `Fieldset` | An HTML `<fieldset>`/`<legend>` sharing the parent's surface | Better for accessibility when a titled group shouldn't look like its own card |
| [`Tabs`](/api/classes/tabs) (+ `Tab`) | Independent tabs someone dips in and out of | Fields behind an inactive tab are still validated and saved — hiding one client-side never skips it server-side |
| [`Wizard`](/api/classes/wizard) (+ `Step`) | Ordered steps where a later step depends on an earlier one | Full-form validation still runs on submit regardless of which step was open last |
| [`Grid`](/api/classes/grid) | A responsive column-count grid (`1..12`, per breakpoint) | |
| `Columns` (+ `Column`) | An explicit row of columns with individual spans | |
| `Flex` | A natural-width row (vs. `Grid`'s equal-width columns) | |
| `Callout` | An inline info/warning/danger/success note | `danger` is reserved for irreversible-action warnings, never a validation error |

Use `Section` first. Reach for `Tabs` when a form is long enough that
scrolling loses people. Use `Wizard` **only** when step two genuinely depends
on step one — a form somebody dips into to change one field should never be
a wizard.

## Visibility: two different mechanisms, both real

```php
Section::make('Billing')->visibleWhen('plan_type', 'postpaid'), // cheap, client-evaluated
Section::make('Advanced')->visible(fn ($values) => $values['role'] === 'admin'), // server-side closure
```

`visibleWhen()` is a plain `[field, value]` tuple the client can evaluate on
every keystroke with no round-trip. `visible(Closure)` runs server-side only
and can express arbitrary logic, but only updates after a `live()` field
change triggers a form-state round-trip — it cannot react to every keystroke
the way `visibleWhen()` can.

`Field::visibleWhen()` doubles as validation, not just presentation — the
same declaration also becomes a `required_if` rule, so hiding a required
field client-side never silently drops its own server-side requirement.

## Live fields

```php
SelectField::make('country')->live()->afterStateUpdated(fn ($set, $value) => $set('region', null)),
```

`live()` opts a field into POSTing form state after it changes — needed for
one field's value to affect another's options or visibility. Don't mark
every field live by default; each one adds a round-trip.

## Every field type

34 concrete `Field` subclasses live in `Alxtexh\Panel\Forms\Fields`. The most
commonly reached-for:

| Class | Use it for |
|---|---|
| [`TextField`](/api/classes/text-field) | Short text, email, phone, URL (`->as('email')` hints the input type) |
| [`TextareaField`](/api/classes/textarea-field) | Plain multi-line text |
| [`NumberField`](/api/classes/number-field) | Integers only — see [Numbers & money](/forms/numbers-and-money) for decimals/currency |
| [`MoneyField`](/api/classes/money-field) | Currency amounts — see the [money guide](/money/) |
| [`SelectField`](/api/classes/select-field) | Single choice, including relationship pickers — see [Selects & relationships](/forms/selects-and-relationships) |
| [`MultiSelectField`](/api/classes/multi-select-field) | Several of a list |
| [`CheckboxField`](/api/classes/checkbox-field) / [`ToggleField`](/api/classes/toggle-field) | A boolean — see [Checkboxes & toggles](/forms/checkboxes-and-toggles) |
| [`DateField`](/api/classes/date-field) | A date, or `->withTime()` for a datetime |
| [`CountryField`](/api/classes/country-field) | A country picker — a thin factory returning a pre-configured `SelectField`, not its own class |
| [`TagsField`](/api/classes/tags-field) | Free-form tags, no fixed option list |
| [`KeyValueField`](/api/classes/key-value-field) | An editable list of key/value pairs |
| [`CodeField`](/api/classes/code-field) / [`MarkdownField`](/api/classes/markdown-field) / [`RichEditorField`](/api/classes/rich-editor-field) | See [Textarea, markdown, rich text, code](/forms/text-content) |
| [`FileUploadField`](/api/classes/file-upload-field) | See [Uploads](/forms/uploads) |
| [`RepeaterField`](/api/classes/repeater-field) / [`BuilderField`](/api/classes/builder-field) | Many rows of one shape, or blocks of different shapes — see below |
| [`HiddenField`](/api/classes/hidden-field) | A value carried in the form but not shown — **not a security boundary**; it's still client-editable, and its validation rules apply exactly like a visible field's |
| `PasswordField` | Blank on submit means "leave unchanged" — never round-trips a hash to the client |
| `PhoneField`, `ColourField`, `MapField`, `QrCodeField`, `BarcodeField`, `DiffField`, `SliderField`, `RadioField`, `ToggleButtonsField`, `CheckboxListField`, `VisualSelectField`, `IconPickerField`, `TreeSelectField` | See [all classes](/api/all) for the complete, generated list |

`RepeaterField` is for **one-to-many data that's always read with its
parent** — not for anything you'd filter, sort, or count independently
(that's a [RelationManager](/relation-managers/) or a nested resource
instead). `BuilderField` is where `RepeaterField` stops: use it for blocks of
**different** shapes in a chosen order (a heading, a paragraph, an image);
reach for it only when the shapes genuinely differ, since a `RepeaterField`
is simpler for rows that are all the same shape.

## Extension points every field shares

Overridable on any `Field` subclass, in the order data flows through them:

- `typeRules()` / `additionalRules()` — validation
- `valuesFrom($record)` → `presentValue()` — stored value to what the form shows
- `transformForStorage()` — validated input to what gets stored
- `omitsFromStorage()` — decline to write at all (distinct from writing null)
- `expandStorage()` — write into more than one column (e.g. a morph type/id pair)
- `absentMeans()` — what a missing submission key means (default: write nothing; a checkbox overrides this to mean `false`)

See [Custom fields](/forms/custom-fields) for building your own on top of these.

## The mass-assignment boundary: `Form::sanitize()`

Every value a create/update request writes to a model passes through
`Form::sanitize()` first — an **allow-list**, not a denylist. It walks only
the fields actually visible given the submitted values (a field hidden by
its own `visibleWhen()`/`visible()` condition contributes nothing, at any
nesting depth), and no key outside that walk ever reaches the model. A
request carrying an extra field nothing declared has that key silently
dropped, not written.
