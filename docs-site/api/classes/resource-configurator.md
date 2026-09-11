# ResourceConfigurator

`Alxtexh\Panel\Resources\ResourceConfigurator` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Resources/ResourceConfigurator.php#L15)

Per-resource presentation choices: dedicated pages or modals for CRUD.

## Methods

### `static for(string $resourceClass): self`

### `createUsing(string $mode): self`

### `editUsing(string $mode): self`

### `viewUsing(string $mode): self`

### `lenses(array $lenses): self`

Nova-style alternate index views over the same resource.

### `static formsFor(string $resourceClass, string $panelDefault = self::MODE_PAGE): array`

### `static resolvedLenses(string $resourceClass): array`

### `static findLens(string $resourceClass, string $key): ?Alxtexh\Panel\Resources\Lens`

### `static flush(): void`

