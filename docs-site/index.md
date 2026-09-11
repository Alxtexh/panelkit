---
layout: home

hero:
  name: PanelKit
  text: Laravel + Vue + Inertia administration framework
  tagline: Resources, tables, forms and infolists as declared PHP — rendered by a Vue kit, wired by Inertia. Not Filament, not Livewire.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: AI Blueprint
      link: /ai/

features:
  - title: Page-first CRUD
    details: Create, edit, view and attach are dedicated Inertia pages, not modals and not Livewire components. Every screen is a real, bookmarkable route.
  - title: Declared, not queried
    details: table() and form() build a cached description of a screen. No query runs until a request asks for a row, so nothing is ever built against the wrong tenant.
  - title: Deny-by-default authorization
    details: A resource with no policy is invisible to everybody — the safe failure, not a 500. Every path fails closed, including a null tenant.
  - title: Minor-unit money by default
    details: MoneyColumn, MoneyField and MoneyEntry share one storage convention (12500 = 125.00) so a resource can't drift between screens.
  - title: Generated, not hand-maintained
    details: The AGENTS.md an installed app ships with is written from the running application's own resources, panels and commands — it can't go stale the way a document can.
  - title: Two RelationManager shapes
    details: A read-only list backed by nothing, or a full child Resource with routes, policies and search — chosen deliberately, not defaulted into.
---

## The shortest useful thing

```php
final class InvoiceResource extends Resource
{
    protected static string $model = Invoice::class;
    protected static string $icon = 'file-text';

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('number')->sortable()->searchable(),
            MoneyColumn::make('total')->currency('USD')->sortable(),
            BadgeColumn::make('status'),
            DateColumn::make('dated_at')->sortable(),
        ]);
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextField::make('number')->required(),
            MoneyField::make('total')->required(),
            SelectField::make('status')->options(['draft', 'sent', 'paid']),
            DateField::make('dated_at'),
        ]);
    }
}
```

`php artisan panel:doctor` after registering a policy, and the list, create, edit and view screens all exist with no controller, no route file edit, and no hand-written navigation entry.

## Two rules worth knowing before you start

1. **Nothing is registered by hand.** Resources, pages and their routes are discovered from where the generator commands put them. If a screen is missing, the fix is almost never "add a route" — see [Troubleshooting](/troubleshooting/).
2. **A missing policy denies rather than allows.** `panel:doctor` reports which resource has no policy. That silence is the framework refusing to guess who should see something, not a bug.

PanelKit is domain-neutral: a fresh install is chrome and an empty canvas. The demo application in this repository's `apps/playground` is one fixture built on top of it, not the kit's default shape.
