# SelectField

`Alxtexh\Panel\Forms\Fields\SelectField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/SelectField.php#L31)

A single-choice field.

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `options(Closure|array $options): static`

### `resolvedOptionMap(): array`

### `searchable(Closure $query = NULL): static`

Fetch options on demand instead of rendering them all.

### `isSearchable(): bool`

### `relationship(string $model, string $titleAttribute, Closure $modifyQuery = NULL): static`

Options from a related Eloquent model (BelongsTo picker).

### `morphTo(array $types): static`

MorphTo picker: a type and an id, with scoped Exists validation.

### `tableSelect(string $resource, string $titleAttribute = NULL): static`

Dedicated picker page that reuses ListQuery. Not a modal.

### `createOption(array $fields, Closure $using = NULL): static`

Create a related row from a small form, then pick it.

### `createOptionLabel(string $label): static`

### `createOptionActionLabel(string $label): static`

### `typeSelectToggleButtons(bool $condition = true): static`

Draw the MorphTo type picker as toggle buttons instead of a select.

### `canCreateOption(): bool`

### `createOptionSchema(): array`

### `createRelated(array $input): array`

### `isMorphTo(): bool`

### `pickerResource(): ?string`

### `search(string $term, array $form = array (
)): array`

Options for a search term. Only meaningful on a searchable field.

### `type(): string`

### `additionalRules(): array`

### `valuesFrom(Illuminate\Database\Eloquent\Model $record): array`

### `expandStorage(?mixed $value): ?array`

### `toSchema(): array`

### `resolveOptions(): array`

### `resolveCurrentOption(?mixed $value): ?array`

The CURRENT VALUE's own label, for an Edit page.

