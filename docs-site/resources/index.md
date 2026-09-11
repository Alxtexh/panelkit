# Creating resources

A `Resource` is one PHP class that declares everything about a model's admin
screens: its table, its form, its navigation identity, its lifecycle hooks,
and (optionally) its own infolist. Nothing about it is registered anywhere
else — no route file, no manual navigation entry, no controller.

```bash
php artisan make:panel-resource Invoice --generate
```

`--generate` introspects the model's actual database table (via
`Schema::getColumns()`) and writes a first draft: it picks column types from
the schema (a `*_id` column becomes a `SelectField` relationship picker if a
matching model exists; an enum-shaped or `status`/`type`/`state`-named column
becomes a `BadgeColumn` + `SelectField` + `SelectFilter`; a boolean becomes a
toggle; a date-typed or `_at`-suffixed column becomes a `DateColumn`), detects
soft-deletes and adds a `TrashedFilter`, and detects likely child tables to
suggest a RelationManager. Review what it generates — this is a strong first
draft, not a final answer.

Every `make:panel-resource` call also writes a policy stub (extending
`TenantResourcePolicy`), a model factory, and a contract test — review the
policy especially, since an unreviewed stub is a real grant.

## The shape of a resource

```php
namespace App\Panel\Resources;

use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Table;
use Alxtexh\Panel\Forms\Form;

final class InvoiceResource extends Resource
{
    protected static string $model = Invoice::class;
    protected static string $icon = 'file-text';
    protected static ?string $group = 'Billing';
    protected static ?int $sort = 10;

    public static function table(Table $table): Table { /* ... */ }
    public static function form(Form $form): Form { /* ... */ }
}
```

## Resource configuration

The properties you'll reach for most:

| Property | Type | Meaning |
|---|---|---|
| `$model` | `string` | The Eloquent model class this resource is for |
| `$icon` | `string` | Sidebar icon name — see [Navigation](/navigation/) |
| `$group` | `?string` | Sidebar group label |
| `$sort` | `?int` | Order within its group |
| `$cluster` | `?string` | Groups several resources under one shared sub-navigation — see below |
| `$parent` | `?string` | Nests this resource under another — see [Nested resources](/resources/nested-resources) |
| `$parentColumn` | `?string` | Foreign key column for a nested (HasMany) resource |
| `$relationship` | `?string` | BelongsToMany method name, for a nested BelongsToMany resource |
| `$module` | `?string` | Ties this resource to a plan-gated module — see the [AI Blueprint's SaaS section](/ai/saas-blueprint) |

::: warning Never `$navigationIcon`, `$navigationGroup`, `$navigationSort`
Those are Filament property names. PanelKit's own `panel:doctor` specifically
checks for and flags the Filament spelling — it is not merely unsupported,
it is a documented, actively-detected mistake.
:::

### Clustering resources under one sidebar entry

Use a `Cluster` when several resources are facets of *one* subject and should
share a sub-navigation, rather than sitting as independent peers:

```php
final class NetworkCluster extends Cluster
{
    protected static string $icon = 'router';
}

// on each member resource:
protected static ?string $cluster = NetworkCluster::class;
```

## Record titles

Override `recordTitle(Model $record): ?string` when the base class's own
fallback columns (`name`, `title`, `full_name`, `subject`, `number`, `code`,
`label`, `email` — checked in that order) don't identify a record well. This
is what shows in breadcrumbs, the command palette, and anywhere else a record
needs a human-readable label.

## Row navigation

```php
$table->rowClick('view')
```

Makes a whole row clickable, navigating to the record's View (or Edit) page,
rather than requiring a dedicated action button per row.

## CRUD lifecycle hooks

All optional, all `static`, all no-ops unless overridden:

```php
public static function beforeValidate(Request $request): void { /* mutate the request before rules run */ }
public static function afterValidate(array $data): void { }
public static function beforeCreate(Model $record, array $data): void { }
public static function afterCreate(Model $record, array $data): void { }
public static function beforeUpdate(Model $record, array $data): void { }
public static function afterUpdate(Model $record, array $data): void { }
public static function beforeDelete(Model $record): void { }
public static function afterDelete(Model $record): void { }
```

## Custom queries

`table()` and `form()` build a **cached description**, not a live query —
see [Philosophy](/getting-started/philosophy). When a column or field needs
data from a relationship, qualify it explicitly:

```php
TextColumn::make('customer_name')->from('customers.name'),
```

Never join or modify the base query with data that depends on the current
request inside `table()`/`form()` themselves — that runs once and gets
cached for every subsequent viewer. Request-scoped filtering belongs in a
`SelectFilter` closure or the resource's authorization layer, not in the
table/form definition.

## Read-only resources

A resource with no `form()` override is read-only — there is no requirement
to declare a form just to get a working list and view.

## Authorization

```php
final class InvoicePolicy extends TenantResourcePolicy {}
```

A resource with **no policy registered is invisible to everyone** — not an
error, a deny. `panel:doctor` reports which resources have no policy. See
[Authorization](/authorization/).

## Beyond the basics

The `Resource` base class has a larger surface than the everyday one above —
Kanban boards (`board()`), alternate index views (`lenses()`), opt-in record
comments (`comments()`), command-palette search weighting
(`searchWeight()`, `searchSort()`), and a resource-level `workflow()` for
status transitions. These are real, shipped features, but they're niche
enough that misusing them by copying an example without reading the actual
method signatures would do more harm than good. See the generated
[API reference](/api/classes/resource) for their exact, current signatures
before reaching for one.
