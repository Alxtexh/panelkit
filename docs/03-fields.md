# 3. Fields

Every field is declared in `Resource::form()` and lives in
`Alxtexh\Panel\Forms\Fields`.

```php
use Alxtexh\Panel\Forms\Fields\TextField;
use Alxtexh\Panel\Forms\Form;

public static function form(Form $form): Form
{
    return $form->schema([
        TextField::make('name')->required()->placeholder('Acme Ltd'),
    ]);
}
```

**The form schema is the whitelist.** Only declared keys reach the model, so
mass assignment is bounded by what you wrote rather than by `$fillable`.

## Every field type

| Field | For |
|---|---|
| `TextField` | Single-line text |
| `TextareaField` | Multi-line text |
| `NumberField` | Integers, with `min()` / `max()` and decision-chip `presets()` |
| `MoneyField` | Decimal amounts — `currency()` prefix, `decimals()`, `min()` / `max()` as floats |
| `PasswordField` | Passwords — blank means *unchanged*, never *null* |
| `SelectField` | One of a list; `searchable()` or `relationship()` for long lists |
| `MultiSelectField` | Several of a list |
| `RadioField` | One of a few, all visible |
| `ToggleButtonsField` | One or several choices as buttons (colours, icons) |
| `CheckboxField` | A single boolean tickbox |
| `CheckboxListField` | Several of a list, all visible |
| `ToggleField` | A boolean as a switch |
| `SliderField` | A number on a track |
| `DateField` | Dates and datetimes |
| `ColourField` | A colour picker |
| `MapField` | Leaflet geopoint (`{lat,lng}`); lazy-loaded |
| `QrCodeField` | QR preview of a string or sibling field |
| `BarcodeField` | Barcode preview (CODE128, EAN13, …); JsBarcode, lazy-loaded |
| `DiffField` | Side-by-side text diff of two siblings |
| `CountryField` | An ISO country list, supplied |
| `TagsField` | Free-form repeated strings |
| `KeyValueField` | An arbitrary map |
| `CodeField` | Source, monospaced |
| `MarkdownField` | Markdown with a preview |
| `RichEditorField` | Formatted prose |
| `FileUploadField` | Files and images |
| `RepeaterField` | A repeating group of fields |
| `BuilderField` | Repeating groups of *different* shapes |
| `VisualSelectField` | A choice made by picture rather than label |
| `PhoneField` | Phone numbers with optional country code |
| `IconPickerField` | Pick an icon name from the kit catalogue |
| `TreeSelectField` | Hierarchical choice from nested options |
| `RatingField` | Star rating (numeric value) |
| `HiddenField` | A value submitted but not shown |

## What every field can do

These come from the shared base and work on all of them:

```php
TextField::make('reference')
    ->label('Invoice number')      // Defaults to a humanised key
    ->required()                   // Adds the validation rule
    ->placeholder('INV-0001')
    ->help('Shown under the control')
    ->disabled()
    ->span(2)                      // Columns in the form grid
    ->rule('string', 'max:64')     // Extra Laravel rules (variadic, not an array)
    ->chips(['INV-', 'CR-'])       // One-tap values
    ->prefix('INV-')               // Text before the control
    ->suffixAction(['label' => 'Copy', 'copy' => true])
    ->hint('Keep this private')
    ->visibleWhen('type', 'invoice');  // Show only when another field matches
```

`prefix()`, `suffix()`, `prefixAction()`, `suffixAction()`, `hint()`, and
`copyable()` serialise into the Vue schema. Copy actions write the current
value to the clipboard in the browser. There is no Livewire.

`visibleWhen()` is evaluated in the browser *and* on the server, so a hidden
field cannot be submitted by a crafted request.

### Responsive schema layout

Use `Grid` when fields need a responsive layout without host-specific CSS. A
single integer remains the compact form; a breakpoint map is preferred for
production forms that should read well on phones and wide screens:

```php
use Alxtexh\Panel\Schema\Grid;

Grid::make([
    'default' => 1,
    'sm' => 2,
    'lg' => 4,
])->schema([
    TextField::make('first_name'),
    TextField::make('last_name'),
]);
```

Supported breakpoints are `default`, `sm`, `md`, `lg`, `xl`, and `2xl`; each
value must be between 1 and 12. The same semantic schema is used by form and
infolist rendering, while the kit owns the responsive CSS.

Tabs can carry a small count or status badge without putting presentation
markup in the page. Resolve the value while building the schema so the
serialized contract remains cacheable:

```php
use Alxtexh\Panel\Schema\Tab;
use Alxtexh\Panel\Schema\Tabs;

Tabs::make()->tabs([
    Tab::make('Open')->badge($openCount)->schema([...]),
    Tab::make('Closed')->badge($closedCount)->schema([...]),
]);
```

The badge is rendered consistently in both editable forms and read-only
infolists, and tab-level errors remain visible when the tab is inactive.

`live()` is the Inertia equivalent of Filament's live fields. After the field
changes, the page POSTs `{ field, values }` to `{resource}/form-state`. The
server returns `{ options, schema, values }` so `afterStateUpdated` can hide,
disable, or replace fields. `visibleWhen` stays a client-side hide.

Typing validation uses the same JSON POST against the existing precognitive
store/update route (`Precognition-Validate-Only` names the field). Errors
arrive while typing, from the same Laravel rules as submit. No Livewire.
Agents should assert form-state with `assertFormState()`; see [Tests](tests.md).

### SelectField::relationship()

BelongsTo picker. Searchable by default. Options come from the related model
(tenant scopes apply). Validation uses `ExistsInScope`, so another tenant's id
is invalid the same way a missing id is.

```php
SelectField::make('article_id')
    ->relationship(Article::class, 'title', function ($query, array $form): void {
        // Optional: narrow options from the current form (live() dependents).
    })
    ->live();
```

**Inside a `RelationManager`'s own `->form()`**, this only works when that
relation is resource-backed (`->resource(...)`) - a simple `->related()`
relation has no route for the search to reach and fails at schema-build time
with a message naming the fix. See
[Relation managers](02-resources.md#relation-managers).

### SelectField::morphTo()

Type plus id. Filament MorphToSelect without Livewire. The submitted value is
`{ type, id }`. Storage writes `{key}_type` and `{key}_id`. Exists validation
is scoped to the selected type's model.

```php
SelectField::make('notable')
    ->morphTo([
        Article::class => 'title',
        Tag::class => 'name',
    ]);
```

Draw the type picker as toggle buttons (short type lists):

```php
SelectField::make('notable')
    ->morphTo([
        Article::class => 'title',
        Tag::class => 'name',
    ])
    ->typeSelectToggleButtons();
```

### ToggleButtonsField

Status / yes-no / short enums as buttons. Colours and icons are semantic names
the client resolves (same tones as badges).

```php
use Alxtexh\Panel\Forms\Fields\ToggleButtonsField;

ToggleButtonsField::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
    ])
    ->colors([
        'draft' => 'warning',
        'scheduled' => 'info',
        'published' => 'success',
    ])
    ->icons([
        'draft' => 'pencil',
        'scheduled' => 'clock',
        'published' => 'check',
    ])
    ->grouped();

ToggleButtonsField::make('accepted')->boolean();

ToggleButtonsField::make('channels')
    ->multiple()
    ->options(['email' => 'Email', 'sms' => 'SMS']);
```

### SelectField::tableSelect()

A dedicated picker page that reuses `ListQuery`. Not a modal. Skip
ModalTableSelect and RelationshipRepeater; nested HasMany already has pages.

```php
SelectField::make('article_id')
    ->relationship(Article::class, 'title')
    ->tableSelect(ArticleResource::class);
```

The page lives at `{resource}/pick/{field}`. Choosing a row returns to the
form with the id on the query string.

### SelectField::createOption()

Create a related row from a small form, then pick it. JSON, not a Livewire
modal. Resource CRUD stays on dedicated pages; this is only the option-list
shortcut.

```php
SelectField::make('article_id')
    ->relationship(Article::class, 'title')
    ->createOption([
        TextField::make('title')->required(),
    ]);
```

`POST {resource}/field-options` with `{ field, values }` returns
`{ option: { value, label } }`. Pass a `using` callback to insert yourself;
omit it to write into the `relationship()` model (tenant-stamped).

The client opens a modal mini-form (not resource CRUD). On success it picks
the new option and closes the dialog. Optional labels:

```php
->createOptionLabel('Add article')
->createOptionActionLabel('New article')
```

## Fields worth extra care

### PasswordField

Blank means **unchanged**, which is different from writing `null` — one keeps the
stored value, the other destroys it. Any field with that shape should implement
`omitsFromStorage()`.

### FileUploadField

```php
FileUploadField::make('logo')
    ->image()
    ->accept(['png', 'jpg', 'webp'])
    ->maxKilobytes(2048)
    ->directory('logos');
```

Uploads are validated twice: the extension must be on the allow-list **and**
agree with the type sniffed from the file's own bytes. Stored names are
generated UUIDs, downloads are forced to `application/octet-stream` with
`nosniff`, and SVG is excluded deliberately — it executes script.

Stored paths are checked against the tenant prefix with `..` segments refused,
so a stored path cannot climb out of its tenant's directory.

### RepeaterField and BuilderField

`RepeaterField` repeats one shape. `BuilderField` repeats several:

```php
RepeaterField::make('lines')
    ->schema([
        TextField::make('description')->required(),
        NumberField::make('amount')->required(),
    ])
    ->minItems(1)
    ->maxItems(50)
    ->itemLabel('description')
    ->collapsible()
    ->cloneable();

BuilderField::make('content')
    ->block('paragraph', [RichEditorField::make('body')])
    ->block('image', [FileUploadField::make('file')->image()])
    ->maxBlocks(20);
```

Every row has a drag handle for reordering, alongside the up/down buttons -
not instead of them. The buttons stay because they work from a keyboard and a
row inside a scrolling page is a poor drag target on its own; the handle is
there for whoever would rather drag a long list into order.

`addable(false)` and `deletable(false)` hide the "Add" control and each row's
own remove control, for a repeater that only ever grows (an append-only log)
or never changes size at all - distinct from `minItems()`/`maxItems()`, which
are the count bound Laravel actually validates. `cloneable()` adds a
duplicate-row control, independent of `addable()`: a field can offer "start
from a copy" while still refusing a blank row.

`->collapsible()` lets a row fold to one line - its ordinal, and the first
field's value if it is short plain text - so working through the second row
does not mean staring at every other row's full set of inputs too. Off by
default. Folding a row changes nothing about its data: nothing is submitted,
saved, or validated differently, and reloading the page starts every row
expanded again.

`->table()` renders rows as a `<table>` - one column per child field, header
row above, one row per item - instead of stacking each field onto its own
line:

```php
RepeaterField::make('lines')
    ->itemLabel('Line')
    ->schema([
        TextField::make('description')->required(),
        NumberField::make('qty')->required(),
        NumberField::make('unit_price')->required(),
    ])
    ->table();
```

Several short fields read as one glance across a row this way; the stacked
layout wraps each to its own line, which wastes width for exactly this shape
and is the right choice for one field, or a long one (a textarea, a rich
editor). The header row reads straight off each child's own `label()` -
there is no separate column-label API to keep in sync with it. Not combined
with `collapsible()`: folding a row of table cells has no rendering this
builds, so no collapse control appears in table mode whatever `collapsible()`
says.

### SelectField with many options

```php
SelectField::make('customer_id')
    ->options(fn () => Customer::pluck('name', 'id')->all())
    ->searchable();
```

`searchable()` moves the filtering to the server, so an option list of fifty
thousand rows does not ship to the browser.

## Layout

Fields can be grouped, and the layout components live in
`Alxtexh\Panel\Schema`:

```php
use Alxtexh\Panel\Schema\Section;

$form->schema([
    Section::make('Details')->schema([
        TextField::make('name'),
        TextField::make('email'),
    ]),
]);
```

Every layout node - `Section`, `Card`, `Fieldset`, `Tabs`, and the rest -
takes the same `visibleWhen()` a field does, to show or hide the WHOLE group:

```php
Section::make('Enterprise fields')
    ->visibleWhen('plan', 'enterprise')
    ->schema([TextField::make('account_manager')]);
```

For a condition a `[field, value]` pair cannot express - two fields, a
range - use `visible()` with a closure instead:

```php
Section::make('Enterprise discount')
    ->visible(fn (array $values): bool => ($values['plan'] ?? null) === 'enterprise'
        && ($values['seats'] ?? 0) >= 50)
    ->schema([TextField::make('discount_code')]);
```

The tradeoff is the same one `Field::hidden(Closure)` already has:
`visibleWhen()` is a hint the browser re-evaluates on every keystroke, no
round trip; `visible(Closure)` cannot travel to the client at all, so it is
resolved on the server and only updates after a `live()` field's round-trip.
Either way, `Form::sanitize()` omits every field inside an unmet group from
the write payload entirely - a crafted request cannot resurrect a hidden
group by including its keys.

## Custom fields, per tenant

Beyond the declared schema, an installation can let each organisation add its
own fields at runtime — see `panel_custom_fields` and the Custom Fields screen.
Those are validated and stored like any other field, without a migration.
