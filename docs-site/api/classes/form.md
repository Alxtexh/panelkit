# Form

`Alxtexh\Panel\Forms\Form` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Form.php#L30)

Declarative form definition.

## Methods

### `static make(): self`

### `schema(array $nodes): self`

### `appendFields(array $fields, string $sectionLabel = 'Custom fields'): self`

Adds fields under their own section rather than replacing the form -

### `columns(int $columns): self`

### `autosave(int $milliseconds = 1000): self`

Opt into version-aware local draft recovery for this form.

### `fields(): array`

Every field, at any nesting depth.

### `toSchema(array $values = NULL): array`

Structure only, safe to cache. Never resolves an option closure.

### `resolveOptions(): array`

Tenant-varying option lists, for the data payload.

### `currentValueOptions(array $values): array`

Each searchable relationship field's CURRENT value, resolved to a

### `rules(): array`

### `sanitize(array $input): array`

Reduce request input to the fields this form declares.

### `valuesFor(Illuminate\Database\Eloquent\Model $record): array`

Current values for editing.

