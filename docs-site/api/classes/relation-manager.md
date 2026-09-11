# RelationManager

`Alxtexh\Panel\Resources\RelationManager` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Resources/RelationManager.php#L40)

A related list shown on a record's page - a client's sessions, a router's

## Methods

### `static make(string $key, string $label): self`

### `related(string $model, string $foreignKey): self`

The related model and the column pointing back at the parent.

### `table(Closure $table): self`

The table definition, as a closure.

### `query(Closure $modify): self`

Narrow the relation further - "unpaid invoices", "live sessions".

### `icon(string $icon): self`

### `authorize(string $ability): self`

The policy ability checked on the PARENT before the list is served.

### `resource(string $resource): self`

Dedicated nested resource that owns list/create/edit pages for this relation.

### `form(Closure $form): self`

Create/edit form schema, used when the nested resource has not supplied one.

### `createAbility(string $ability): self`

### `updateAbility(string $ability): self`

### `readOnly(bool $readOnly = true): self`

No inline create, no edit affordance, on THIS tab.

### `hasForm(): bool`

### `formDefinition(): ?Alxtexh\Panel\Forms\Form`

### `canInlineCreate(string $parentResourceClass, Illuminate\Database\Eloquent\Model $parent): bool`

Whether create-from-tab is offered. Edit and view stay on dedicated pages.

### `store(string $parentResourceClass, Illuminate\Database\Eloquent\Model $parent, array $validated): Illuminate\Database\Eloquent\Model`

Persist one related row from the parent record page.

### `getAbility(): string`

### `getModel(): string`

### `nestedResource(): ?string`

### `stampedParentColumn(): ?string`

Foreign key stamped from the parent URL on inline create, never from input.

### `definition(): Alxtexh\Panel\Tables\Table`

### `rows(Illuminate\Http\Request $request, string|int $parentKey): Alxtexh\Panel\Tables\ListResult`

Rows for one parent record.

### `toSchema(): array`

