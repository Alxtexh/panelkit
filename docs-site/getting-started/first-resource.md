# Your first resource

This walks through building a `Customer` resource from a plain Eloquent
model, by hand, so each generated piece is understood rather than taken on
faith. If you just want a working screen immediately, use
[`make:panel-recipe`](/getting-started/quick-start) instead.

## 1. Start from the model, not the screen

```php
Schema::create('customers', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

Look at the actual columns before designing anything — see
[Model the data first](/ai/resources) for the full reasoning this drives.

## 2. Generate a starting point

```bash
php artisan make:panel-resource Customer --generate
```

`--generate` reads the table above and writes a first-draft `Table`/`Form`:
`name` and `email` become searchable/sortable text columns and fields,
`is_active` becomes a toggle. Review what it produced — it's a strong draft,
not a final answer.

## 3. Register a policy

```php
final class CustomerPolicy extends TenantResourcePolicy {}
```

`make:panel-resource` already wrote this stub. Nothing shows up at `/customers`
without it — a resource with no policy is invisible to everyone, on purpose.
See [Authorization](/authorization/).

## 4. Sync permissions and check your work

```bash
php artisan panel:permissions sync
php artisan panel:doctor
```

## 5. Visit it

`/customers` — list, with search and sort already working. Click through to
Create, Edit, and View — all real, dedicated pages, none of them modals.

## What you didn't have to do

- Write a controller.
- Edit `routes/web.php`.
- Add a sidebar entry by hand — `$icon`/`$group`/`$sort` on the class did
  that.
- Write CSS for the list, form, or badges — the design tokens in
  [Customization](/customization/) are shared by every resource.

## Next steps for this resource

- Add a `MoneyColumn`/`MoneyField` if `Customer` ever carries a balance —
  read the [money guide](/money/) first.
- Add a related list (orders this customer has placed) via a
  [RelationManager](/relation-managers/).
- Add a dedicated View page layout with [Infolists](/infolists/) once the
  detail page needs more than the table already shows.
