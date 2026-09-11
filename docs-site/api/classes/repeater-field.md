# RepeaterField

`Alxtexh\Panel\Forms\Fields\RepeaterField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/RepeaterField.php#L35)

A repeating group of fields, stored as a JSON array of objects.

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `type(): string`

### `schema(array $fields): self`

The shape of one row.

### `relationship(string $name): self`

Store rows in a declared parent relation instead of a JSON column.

### `isRelationship(): bool`

### `relationshipName(): ?string`

### `minItems(int $min): self`

### `maxItems(int $max): self`

### `itemLabel(string $label): self`

What one row is called, for the add button and the row headings.

### `collapsible(bool $collapsible = true): self`

Let a row fold down to one line - its ordinal, and the first child's

### `addable(bool $addable = true): self`

Hide the "Add" control. A row count that only ever shrinks - an

### `deletable(bool $deletable = true): self`

Hide each row's own remove control. An append-only history - once a

### `cloneable(bool $cloneable = true): self`

Offer a "duplicate this row" control next to remove/reorder. For the

### `table(bool $table = true): self`

Render rows as a `<table>` - one column per child field, one row per

### `children(): array`

### `additionalRules(): array`

Each child's own rules, applied to every row.

### `transformForStorage(?mixed $value): mixed`

Keep only declared child keys, and drop rows that are entirely empty.

### `rowsForStorage(?mixed $value, bool $preserveIds = true): array`

### `valuesFrom(Illuminate\Database\Eloquent\Model $record): array`

Hydrate a relationship into the same row shape the client submits.

### `toSchema(): array`

### `childOptions(): array`

Child option lists, resolved when the DATA payload is assembled.

