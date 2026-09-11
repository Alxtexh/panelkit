# Lens

`Alxtexh\Panel\Resources\Lens` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Resources/Lens.php#L18)

An alternate index over one resource: a scoped query and optional table overrides.

## Methods

### `static make(string $key, string $label): self`

### `query(Closure $query): self`

### `table(Closure $table): self`

### `applyTable(Alxtexh\Panel\Tables\Table $table): Alxtexh\Panel\Tables\Table`

### `applyQuery(Illuminate\Database\Eloquent\Builder $query): void`

### `toSchema(): array`

