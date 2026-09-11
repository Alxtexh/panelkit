# Example: Order → OrderItems → Product

A complete, realistic use of a resource-backed RelationManager: an `Order`
that lists its `OrderItem` rows, each pointing at a `Product` through a
searchable relationship field — exactly the combination that requires the
resource-backed shape, not the simple one.

## The models

```php
// app/Models/Order.php
final class Order extends Model
{
    protected $casts = ['placed_at' => 'datetime'];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}

// app/Models/OrderItem.php
final class OrderItem extends Model
{
    protected $casts = ['unit_price' => 'integer']; // minor units — see the money guide

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
```

## The nested resource: `OrderItemResource`

```php
namespace App\Panel\Resources;

use App\Models\OrderItem;
use App\Models\Product;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Forms\Fields\{NumberField, SelectField};
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Columns\{DateColumn, MoneyColumn, TextColumn};
use Alxtexh\Panel\Tables\Table;

final class OrderItemResource extends Resource
{
    protected static string $model = OrderItem::class;
    protected static ?string $parent = OrderResource::class; // HasMany: parentColumn defaults to order_id

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('product_name')->from('products.name')->sortable(),
            TextColumn::make('quantity')->sortable(),
            MoneyColumn::make('unit_price')->currency('USD')->sortable(),
            DateColumn::make('created_at')->sortable()->muted(),
        ])
            ->query(fn ($query) => $query->join('products', 'products.id', '=', 'order_items.product_id'))
            ->defaultSort('created_at', 'desc');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            SelectField::make('product_id')
                ->relationship(Product::class, 'name')
                ->required(),

            NumberField::make('quantity')->min(1)->required(),
        ]);
    }
}
```

`SelectField::relationship()` here is exactly why this has to be a nested
`Resource` rather than a closure-based simple RelationManager — it's
searchable, and a searchable relationship field needs the `field-options`
endpoint only a routable resource gets.

## Wiring the policy

```php
final class OrderItemPolicy extends TenantResourcePolicy {}
```

Independent from `OrderPolicy` — an operator with full access to orders but
no `update` on order items would be blocked from editing a line item even
while able to edit the order itself, which is a real, intentional
distinction PanelKit lets you express (and one the simple RelationManager
shape can't, since it has no policy of its own).

## The parent: `OrderResource`

```php
namespace App\Panel\Resources;

use App\Models\Order;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Forms\Fields\SelectField;
use Alxtexh\Panel\Resources\RelationManager;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Columns\{BadgeColumn, DateColumn, TextColumn};
use Alxtexh\Panel\Tables\Table;

final class OrderResource extends Resource
{
    protected static string $model = Order::class;
    protected static string $icon = 'shopping-cart';

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('reference')->sortable()->searchable(),
            BadgeColumn::make('status'),
            DateColumn::make('placed_at')->sortable(),
        ])->rowClick('view');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            SelectField::make('customer_id')->relationship(Customer::class, 'name')->required(),
        ]);
    }

    public static function relations(): array
    {
        return [
            RelationManager::make('items', 'Order items')->resource(OrderItemResource::class),
        ];
    }
}
```

## What this gets you, end to end

- `/orders` — the order list.
- `/orders/{id}` — the order's View page, with an **Order items** tab.
- `/orders/{id}/items` — the nested OrderItem list, scoped to that order,
  with its own search/sort/pagination.
- `/orders/{id}/items/create` and `/orders/{id}/items/{itemId}/edit` — real,
  dedicated pages (never modals), each with a searchable Product picker.
- Every write stamps `order_id` from the URL, never from the submitted form
  body — a request can't attach an item to an order it didn't navigate to.
- Deleting an order item requires `delete` on `OrderItemPolicy`, checked
  independently of whatever the actor can do to the order itself.

Generate the scaffolding for this shape directly:

```bash
php artisan make:panel-resource Order --generate
php artisan make:panel-relation-manager OrderResource OrderItem
```

`make:panel-relation-manager` always generates the **resource-backed**
shape — a nested child `Resource` plus the `RelationManager::make()->resource()`
wrapper — since that's the shape with dedicated pages and a real policy to
review. The simple (`->related()`-only) shape is documented and tested but
hand-written only; reach for it when a read-only glance is genuinely all you
need.
