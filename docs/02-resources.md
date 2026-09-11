# 2. Resources

A resource is one class describing one model's screens. Put it anywhere under a
discovered directory (`app/Panel/Resources` by default) and it becomes a list,
a form, a view screen, routes, ability names and an API endpoint.

```bash
php artisan make:panel-resource Invoice --generate
```

`--generate` introspects the table and writes columns, fields and filters that
match its real shape. Without it you get a stub to fill in.

## The whole surface

```php
final class InvoiceResource extends Resource
{
    protected static string $model = Invoice::class;

    // Optional: defaults derive from the model name.
    protected static ?string $slug = 'invoices';
    protected static ?string $group = 'Billing';
    protected static string $icon = 'receipt';
    protected static ?int $sort = 10;

    public static function table(Table $table): Table { /* … */ }
    public static function form(Form $form): Form { /* … */ }
}
```

**Nothing registers it.** Discovery finds the class; the navigation entry, the
routes and the abilities `view_any_invoices`, `create_invoices` and the rest all
follow from it existing.

### Navigation icons

`$icon` picks from a curated set of Lucide names, not the whole ~1600-icon
library - keeping it curated is what lets the kit ship the sidebar's icons as
tree-shaken components instead of an unbounded dynamic import. As of this
writing the supported names are:

```
activity, app-window, app-window-mac, archive, book-open, building, calendar,
chat, chevrons-up-down, circle-check, coins, credit-card, faq, file,
file-question, file-text, flag, folder, folder-tree, gauge, help, home,
impersonate, info, key, layers, layout-grid, layout-template, life-buoy,
list, lock, log-in, login, mail, map, megaphone, message-circle, package,
panel-left, panel-left-close, receipt, rocket, router, scroll-text,
server-crash, settings, shield-alert, shopping-bag, shopping-cart, sliders,
smartphone, sparkles, square, timer-off, trash, user, user-check, user-plus,
users, wallet, webhook, wrench
```

A plausible but uncurated name (`user-cog` is a real Lucide icon, just not
one PanelKit ships) compiles and runs - it simply falls back to the generic
`package` icon in the sidebar, silently, since `package` is *also* a
legitimately declared icon elsewhere. `php artisan panel:doctor` checks every
registered resource's and page's `$icon` against this exact list and names
the resource and the bad value when one doesn't match, so a typo or a guess
outside the curated set is caught before it ships rather than noticed as "my
resource just has the box icon for some reason."

## Create / edit / view: pages first

Dedicated create, edit, and view pages are the default. Slide-overs and dense
modals are for **secondary** work (record action forms, filters, confirmations).
Opt into a CRUD slide-over per operation when you need it:

```php
InvoiceResource::configure()
    ->createUsing('modal') // default remains 'page'
    ->editUsing('page')
    ->viewUsing('page');
```

See [Actions](05-actions.md) and [Design layout](14-design-layout.md).

## Why the list stays fast

Three decisions, each of which only matters once the table is big.

**Keyset pagination, not `OFFSET`.** `OFFSET 100000` makes the database walk
100,000 rows it then discards. The panel seeks instead, so the first page costs
the same on 250,000 rows as on 200, measured at 0.44 ms against 0.48 ms.

**The count is deferred.** `COUNT(*)` over 250,000 rows takes ~17 ms, and nobody
should wait for a number they are not reading yet. Rows arrive first.

**Joins are declared, so the query count is constant.**

```php
$table
    ->query(fn ($q) => $q->leftJoin('customers', 'customers.id', '=', 'invoices.customer_id'))
    ->columns([
        TextColumn::make('customer_name')->from('customers.name'),
    ])
    ->keyColumn('invoices.id')      // qualified: see below
    ->alsoSelect(['invoices.id']);
```

> **If your table joins, qualify the key column.** The keyset tiebreaker appears
> in every `ORDER BY`, so an unqualified `id` becomes ambiguous the moment a
> second table has one.

## Record identity and navigation

Two small conventions, both about how a record presents itself, that are
easy to skip and then notice only once a real application has several
resources side by side.

**`recordTitle()` - what the View/Edit page calls a record.** The base
implementation checks `name`, `title`, `full_name`, `subject`, `number`,
`code`, `label`, then `email`, in that order, and falls back to `#id` only
when none of those columns exist. That covers the ordinary case with zero
code: a table with a plain `name` or `subject` column already gets a
human-readable title for free. It does **not** guess at a *prefixed*
identifier like `invoice_number` or `order_number` - a suffix-matching rule
would also catch a `phone_number` that was never meant to identify the
record, and a wrong guess silently mislabelling every record is worse than
one that still falls through to `#id` and asks for an override:

```php
public static function recordTitle(Model $record): ?string
{
    return $record->invoice_number;
}
```

`make:panel-resource --generate` writes this override for you automatically
when it detects a `{table-singular}_number` column and none of the base
class's literal candidates exist on the table - so `invoices.invoice_number`
or `orders.order_number` get a working title with no manual step, while a
`phone_number` column elsewhere is never mistaken for the record's identity.

**Row navigation - `->rowClick('view')`.** Off by default at the `Table`
class level, deliberately: a whole clickable row is not free (a mis-aimed
click on the way to a checkbox becomes an unwanted navigation), and it is
the right choice for a table people *browse* (a customer list, a product
catalogue) but not necessarily one they *read in place* (an audit log, a
dense line-item table). `make:panel-resource --generate` opts a freshly
generated resource IN by default, since an ordinary generated CRUD table is
usually the browsable kind - remove it with `->rowClick('none')` if a
particular resource genuinely is not:

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([...])
        ->rowClick('view'); // primary column opens the View page; row actions (⋮) still work
}
```

## Nested resources

A resource can live under a parent. Create, edit and view are dedicated pages
(the Filament `CreateRecord` / `EditRecord` model), never a modal.

```php
final class LineResource extends Resource
{
    protected static string $model = Line::class;
    protected static ?string $parent = InvoiceResource::class;
    protected static ?string $parentColumn = 'invoice_id';
}
```

The URL becomes `/invoices/{invoice}/lines`, plus `/create` and `/{id}/edit`.
The parent is resolved from the URL and authorised: a caller must be able to
`view` the parent, a mismatched pairing is a 404, and another tenant's id is a
404 rather than a 403 because confirming existence would itself leak. Writes
stamp the parent from the URL, so a submitted foreign key cannot move the row.

BelongsToMany: set `$relationship` to the parent model's method. Attach is a
dedicated page at `/{parent}/{id}/{child}/attach`. Detach is a row action on
the nested index. Not a modal, not Livewire.

`pivotColumns()` declares extra fields that live on the pivot table itself,
not on the related model:

```php
final class TagResource extends Resource
{
    protected static ?string $parent = ArticleResource::class;
    protected static ?string $relationship = 'tags';

    public static function pivotColumns(): array
    {
        return [TextField::make('note')];
    }
}
```

The attach page collects them once and applies the same values to every id in
that submission - not a separate form per selected row. `Edit pivot` is then
an auto-registered row action next to `Detach` for changing them afterwards,
via `updateExistingPivot()`, without detaching and reattaching. Each declared
field also appears as its own `pivot_{key}` column on the nested list, on
both the resource's dedicated nested page and a `RelationManager` tab
embedding the same resource - read through a correlated subquery per column,
not a join, so a pair with more than one pivot row still reads one value
rather than multiplying the list's rows.

## Relation managers

A `RelationManager` is the tab on a parent record's view page showing its
related rows - an order's line items, an invoice's payments, a client's
sessions. It is always a **summary tab**, never a Filament-style modal CRUD
surface. There are two genuinely different shapes it can take, and the
difference is not cosmetic - it decides what the tab can and cannot do.

### Simple vs. resource-backed - pick one deliberately

**A simple `RelationManager`** (`->related()` + `->table()`, no
`->resource()`) is a read list, plus optionally a fixed, one-shot inline
create form. It is the right choice for small, structurally straightforward
related rows that do not need their own dedicated pages: an order's line
items, a note thread, anything a person adds to and reads from the parent's
own page and nothing more.

**A resource-backed `RelationManager`** (`->resource(SomeResource::class)`)
is backed by a real, independently-routable child `Resource` - the same kind
declared under [Nested resources](#nested-resources) above. It gets its own
dedicated list/create/edit/view pages at `/{parent}/{id}/{child}`, its own
policy, and - critically - the field-options route a searchable
`SelectField::relationship()` needs (see below). Pick this when the related
rows are themselves complex enough to want their own View/Edit pages, need
independent permissions, or need relationship search inside their own form.

| Capability | Simple (`->related()`) | Resource-backed (`->resource()`) |
|---|---|---|
| List rows on the tab | ✓ | ✓ |
| Filters, sorting, pagination | ✓ | ✓ |
| Inline create (from the tab) | ✓, if `->form()` is set | ✓, gated on the child resource's `create` ability |
| Row-level Edit / Delete | ✗ - not a bug, see below | ✓ - the child resource's own dedicated pages |
| `SelectField::relationship()` search inside the tab's own form | ✗ - throws at schema-build time, see below | ✓ |
| Dedicated View/Edit pages for a related row | ✗ | ✓, at `/{parent}/{id}/{child}/{row}` |
| Independent policy / permissions | ✗ - authorised against the PARENT resource's own abilities | ✓ - the child resource's own policy |

**Do not pretend a simple `RelationManager` supports what only a
resource-backed one actually provides.** There is no partial or hidden
nested-CRUD behind `->related()` - a bare relation's rows are read and
(optionally) created from the tab, full stop. If you find yourself wanting
row-level Edit or Delete on a tab, that is the signal to add
`->resource(...)`, not a missing feature to work around.

```php
public static function relations(): array
{
    return [
        // Resource-backed: Line gets its own pages, policy, and searchable
        // relationship fields.
        RelationManager::make('lines', 'Lines')
            ->resource(LineResource::class)
            ->table(fn (Table $t) => $t->columns([
                TextColumn::make('name')->from('lines.name'),
            ])->keyColumn('lines.id')),
    ];
}
```

`php artisan make:panel-relation-manager Invoice Line` writes the nested
resource and a factory that returns that `RelationManager`.

`->readOnly()` turns off inline create and the edit affordance on THIS tab -
scoped to what a relation manager actually owns, the summary tab on the
parent page. It does not lock the nested resource's own dedicated pages;
`LineResource`'s `attach`/`detach`/edit routes still resolve against that
resource's own `create`/`update` abilities, independently of any tab that
happens to link to them. A relation genuinely meant to be read-only
everywhere gates that on the nested resource itself, not here.

### Searchable relationship fields need a resource-backed relation

`SelectField::relationship()` is searchable by default, and that search runs
against a `field-options` route registered per top-level `Resource` (see
[Nested resources](#nested-resources) above - a resource declaring `$parent`
gets that route mounted at `/{parent}/{parentId}/{resource}/field-options`).
A **simple** `RelationManager` is not itself a routable `Resource`, so there
is no route its own inline form's search could ever reach.

Using `->relationship()` on a simple relation's `->form()` fails loudly, at
schema-build time, rather than shipping a dropdown whose search silently
returns nothing:

```
SelectField [product_id] uses relationship search inside RelationManager
[items], but this relation has no ->resource() and therefore no
field-options endpoint to search against - the dropdown would open with a
search box that silently returns nothing. Either call ->options([...]) on
[product_id] for a small, fixed related table, or add
->resource(SomeResource::class) to RelationManager::make('items', ...) to
give this relation dedicated pages and a working search endpoint.
```

Two ways to fix it, matching the table above:

```php
// A: a small, fixed related table - ship it inline, no search endpoint needed.
// ->all() matters: pluck() returns a Collection, and ->options() takes a
// plain array.
SelectField::make('product_id')->options(fn () => Product::pluck('name', 'id')->all());

// B: the related table is large enough that search genuinely earns its keep -
// give the relation its own resource.
RelationManager::make('items', 'Order items')->resource(OrderItemResource::class);
```

### Sorting - a safe default, no configuration required

A `RelationManager`'s table needs no explicit `->sortable()` column. If none
is declared, its rows sort by the table's own key column (newest first) -
the same column every list already appends as an unconditional tiebreaker
for deterministic pagination, so nothing about correctness depends on this.
This is deliberately different from a top-level `Resource`'s own List page,
which still requires at least one `->sortable()` column: a full admin list
with no sort story at all is almost always a genuine oversight worth
catching there, where a small related tab with no sort story is a completely
ordinary, unremarkable choice.

Declare `->sortable()` on a column the normal way if you want the tab's own
header to offer a user-facing sort:

```php
RelationManager::make('items', 'Order items')
    ->related(OrderItem::class, 'order_items.order_id')
    ->table(fn (Table $t) => $t->columns([
        TextColumn::make('quantity')->from('order_items.quantity')->sortable(),
    ])->keyColumn('order_items.id')->defaultSort('quantity', 'desc'));
```

### A complete example: Order → OrderItems → Product

An order's line items, end to end - each item a real reference to a
`Product`, unbounded in count (not a fixed 2-4 shape a `KeyValueEntry`
summarises), which is why this is a `RelationManager`, not a `Repeater`.

```php
final class OrderResource extends Resource
{
    protected static string $model = Order::class;
    protected static string $panel = 'admin';
    protected static string $icon = 'shopping-cart';

    public static function relations(): array
    {
        return [
            RelationManager::make('items', 'Order items')
                ->related(OrderItem::class, 'order_items.order_id')
                ->table(fn (Table $table): Table => $table
                    // order_items only stores product_id - product_name is a
                    // JOINED column, the same ->query()/->alsoSelect() pattern
                    // "Why the list stays fast" uses for a top-level Resource,
                    // applied here to a RelationManager's own table.
                    ->query(fn ($query) => $query
                        ->leftJoin('products', 'products.id', '=', 'order_items.product_id'))
                    ->columns([
                        TextColumn::make('product_name')->from('products.name')
                            ->sortable(),
                        TextColumn::make('quantity')->from('order_items.quantity'),
                        MoneyColumn::make('unit_price')->from('order_items.unit_price')
                            ->currency('USD')->major(),
                    ])
                    ->defaultSort('product_name', 'asc')
                    ->keyColumn('order_items.id')
                    ->alsoSelect(['order_items.id']))
                ->form(fn (Form $form): Form => $form->schema([
                    // A small catalogue: ->options(), not ->relationship() -
                    // this is a simple relation, no ->resource() here.
                    // ->all() matters: pluck() returns a Collection, and
                    // ->options() takes a plain array.
                    SelectField::make('product_id')
                        ->label('Product')
                        ->options(fn () => Product::pluck('name', 'id')->all())
                        ->required(),
                    NumberField::make('quantity')->min(1)->required(),
                    MoneyField::make('unit_price')->min(0)->required(),
                ])),
        ];
    }
}
```

This gives the Order's View page an "Order items" tab: a sorted, paginated
table of line items with inline create ("Add"). There is no row-level Edit
or Delete - a simple relation does not have one, per the table above. If line
items ever need their own View/Edit pages, independent permissions, or a
searchable product picker over a catalogue too large to ship inline, that is
the point to switch to `->resource(OrderItemResource::class)` instead of
`->related()`/`->form()`.

## Infolists

The dedicated view page can declare entries instead of reusing every table
column:

```php
use Alxtexh\Panel\Actions\Action;
use Alxtexh\Panel\Infolists\BadgeEntry;
use Alxtexh\Panel\Infolists\CodeEntry;
use Alxtexh\Panel\Infolists\ColorEntry;
use Alxtexh\Panel\Infolists\DateTimeEntry;
use Alxtexh\Panel\Infolists\IconEntry;
use Alxtexh\Panel\Infolists\ImageEntry;
use Alxtexh\Panel\Infolists\KeyValueEntry;
use Alxtexh\Panel\Infolists\MoneyEntry;
use Alxtexh\Panel\Infolists\RepeatableEntry;
use Alxtexh\Panel\Infolists\TextEntry;
use Alxtexh\Panel\Infolists\ViewEntry;

public static function infolist(): array
{
    return [
        TextEntry::make('title'),
        ImageEntry::make('cover'),
        KeyValueEntry::make('meta')->labels('Key', 'Value'),
        ColorEntry::make('accent'),
        CodeEntry::make('snippet')->language('json'),
        RepeatableEntry::make('extras')->schema([
            TextEntry::make('label'),
            TextEntry::make('url'),
        ]),
        IconEntry::make('status')->icons(['published' => 'check'])->colors(['published' => 'success']),
        BadgeEntry::make('status')
            ->colors(['draft' => 'neutral', 'published' => 'success', 'archived' => 'warning'])
            ->defaultColor('neutral'),
        DateTimeEntry::make('created_at'),
        DateTimeEntry::make('published_at')->date(),
        MoneyEntry::make('price')->currency('USD')->divideBy(100),
        ViewEntry::make('preview')->view('invoice-summary'),
        TextEntry::make('email')->action(
            Action::make('copy')->handle(fn ($record) => $record->touch()),
        ),
    ];
}
```

`ViewEntry` names a host-registered Vue view. In the application entry
(for example `resources/js/app.ts`):

```ts
import { registerEntryView } from '@alxtexh-enterprise/panel'
import InvoiceSummary from './infolists/InvoiceSummary.vue'

registerEntryView('invoice-summary', InvoiceSummary)
```

The Vue component receives `node`, `record`, and `value` (`record[key]`).
A missing registration shows a diagnostic on the view page rather than
rendering blank. Empty `infolist()` still falls back to table columns on the
view page.

Click POSTs `{ action }` to `{resource}/{id}/infolist-action`. `Entry::url()` remains a plain link. The view page stays a dedicated page.

### The view page selects its own data

A non-empty `infolist()` drives the view page's own database selection -
independently of `table()`. An entry for an attribute your list never
displays still reaches the view page with its real value; a table column
your infolist never mentions does not leak in just because the list shows it.
Each screen gets exactly what it declares.

**Showing a relationship value on an infolist** uses the same mechanism a
table column does - a real SQL join declared once on `table()->query()`, plus
`->from('other_table.column')` on the entry, aliased back to the entry's own
key:

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([/* … */])
        ->query(fn ($query) => $query
            ->leftJoin('customers', 'customers.id', '=', 'invoices.customer_id'))
        ->keyColumn('invoices.id');
}

public static function infolist(): array
{
    return [
        TextEntry::make('customer_name')->label('Customer')->from('customers.name'),
    ];
}
```

`TextEntry::make('customer.name')` (dot notation, an Eloquent-relation-path
habit) is **not** supported and will not resolve - PanelKit does not walk a
relation per row for an infolist value, which is exactly the N+1 a join
avoids. `->fromRaw($sqlExpression)` is also available on any entry, for a
computed value - see "Computed values" in the columns chapter; the same
alias and raw-SQL-safety rules apply.

**If `table()` already joins another table, qualify any infolist entry whose
key collides with a column name on that joined table** - even one that isn't
itself reading the join. A resource that joins `customers` (for a
`customer_name` entry) and separately declares a plain `BadgeEntry::make('status')`
for its own `status` column will get `SQLSTATE[HY000]: ambiguous column name:
status` on its view page the moment `customers` also has a `status` column -
because the view page's query now runs through that same join. The fix is
the same `->from()` every other qualified entry already uses:
`BadgeEntry::make('status')->from('invoices.status')`. `table()`'s own
columns already need this for the identical reason; an infolist that
previously never ran through the join is the newly-exposed case.

## Header widgets

Any resource can carry stats and charts above its table:

```php
public static function headerWidgets(): array
{
    return [
        StatWidget::make('outstanding', 'Outstanding')
            ->value(fn (): int => Invoice::whereNull('paid_at')->count()),
    ];
}
```

They render as one joined strip, the same shape a dashboard uses. See
[Dashboards and widgets](06-dashboards-and-widgets.md).

## Kanban board (opt-in)

Declare `board()` on a resource. Until you do, `GET {resource}/board` and
`POST {resource}/board-move` answer 404 (routes exist; the actions refuse).

```php
use Alxtexh\Panel\Resources\Board;

public static function board(): ?Board
{
    return Board::make('status')
        ->columns([
            'open' => 'Open',
            'doing' => 'In progress',
            'done' => 'Done',
        ])
        ->title('name')
        ->description('notes');
}
```

That mounts `ResourceKanban` at `{resource}/board` and accepts
`POST {resource}/board-move` with `{ id, column }` against the declared
allowlist. Nested resources use the same paths under the parent prefix
(`/{parent}/{id}/{resource}/board`). Run `php artisan panel:update` so hosts
get the Vite page stub.

## Table chrome Pro (opt-in)

Sticky first column, column resize, and a table/cards toggle stay off until
you ask:

```php
public static function table(Table $table): Table
{
    return $table
        ->stickyFirstColumn()
        ->resizableColumns()
        ->layouts(['table', 'cards'])
        ->columns([/* … */]);
}
```

Widths and layout may also ride in saved views (`ViewState` keys `widths`,
`layout`). Local prefs mirror them under `alxtexhpanel.{key}.widths` /
`.layout`.

## The public API

A resource that answers `documented()` (true by default; return `false` to
opt out) appears in `/api/v1`, with OpenAPI generated from the same declaration.
Tokens are issued by `php artisan panel:api-token` (or the Api keys screen) and
carry their abilities intersected with the resource policy.

```php
public static function documented(): bool
{
    return true; // default; return false to hide from /api/v1 and Scalar
}
```

OpenAPI covers list/create/read/update/delete, bulk and record actions when
declared, import when `importable()`, relation routes from `relations()`, and
bearer auth via `/api/v1` in the generated document. Enable Scalar with
`Panel::apiDocs()` or `apps(['api-docs'])`.
