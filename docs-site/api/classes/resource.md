# Resource

`Alxtexh\Panel\Resources\Resource` &middot; `abstract-class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Resources/Resource.php#L59)

A panel resource. One subclass per screen, and no Vue at all.

## Configuration properties

| Property | Type |
| --- | --- |
| `$model` | `string` |
| `$icon` | `string` |
| `$purpose` | `?string` |
| `$group` | `?string` |
| `$cluster` | `?string` |
| `$parent` | `?string` |
| `$parentColumn` | `?string` |
| `$relationship` | `?string` |
| `$sort` | `?int` |
| `$panel` | `string` |
| `$module` | `?string` |
| `$feature` | `?string` |

## Methods

### `static panel(): string`

WHERE IT WAS REGISTERED BEATS WHAT IT DECLARES, and that order matters

### `static baseUrl(string $suffix = ''): string`

This resource's own URL, carrying the panel's path.

### `static budgetMs(): ?int`

What this resource's screens may cost, in milliseconds - roadmap 7.6.

### `static table(Alxtexh\Panel\Tables\Table $table): Alxtexh\Panel\Tables\Table`

Declarative definition. MUST NOT query.

### `static workflow(): ?Alxtexh\Panel\Workflow\Workflow`

Optional workflow on a status column. Off by default.

### `static resolvedWorkflow(): ?Alxtexh\Panel\Workflow\Workflow`

The effective workflow: DB override when present, PHP default otherwise.

### `static form(Alxtexh\Panel\Forms\Form $form): Alxtexh\Panel\Forms\Form`

Optional write form. A resource without one is read-only.

### `static beforeValidate(Illuminate\Http\Request $request): void`

Prepare a record request before its form rules run.

### `static afterValidate(array $data): void`

### `static beforeCreate(Illuminate\Database\Eloquent\Model $record, array $data): void`

### `static afterCreate(Illuminate\Database\Eloquent\Model $record, array $data): void`

### `static beforeUpdate(Illuminate\Database\Eloquent\Model $record, array $data): void`

### `static afterUpdate(Illuminate\Database\Eloquent\Model $record, array $data): void`

### `static beforeDelete(Illuminate\Database\Eloquent\Model $record): void`

### `static afterDelete(Illuminate\Database\Eloquent\Model $record): void`

### `static formDefinition(): Alxtexh\Panel\Forms\Form`

### `static infolist(): array`

Optional layout for the VIEW page.

### `static recordTitle(Illuminate\Database\Eloquent\Model $record): ?string`

The attribute that best identifies a record to a human - shown as the

### `static feature(): ?string`

### `static module(): ?string`

### `static isAccessible(): bool`

Request-time gate for plan modules. Feature flags still use `isEnabled()`

### `static isEnabled(): bool`

Whether this resource is enabled for the acting tenant.

### `static importable(): string|bool`

Whether records may be brought in in BULK, from a file.

### `static excelImport(): bool`

Accept .xlsx/.xls in the import dialog.

### `static importForm(): Alxtexh\Panel\Forms\Form`

### `static isWritable(): bool`

Whether a create or edit PAGE can be rendered at all.

### `static hasWritableColumns(): bool`

Whether any write path exists - a form OR an editable column.

### `static can(string $ability, Illuminate\Database\Eloquent\Model|string|null $record = NULL): bool`

Authorization. DENIES BY DEFAULT.

### `static permissions(): array`

Permission booleans for the UI. Never a gate (spec S9 item 3).

### `static relations(): array`

Related lists shown as tabs on the record page.

### `static relation(string $key): ?Alxtexh\Panel\Resources\RelationManager`

### `static key(): string`

URL segment and schema key, e.g. `clients`.

### `static label(): string`

### `static pluralLabel(): string`

### `static icon(): string`

### `static group(): ?string`

### `static indexMetrics(): array`

Stat strip above this resource's index. Deferred through `WidgetSet`.

### `static headerWidgets(): array`

### `static footerWidgets(): array`

Widgets below this resource's index - see `Page::footerWidgets()` for

### `static resolvedIndexWidgets(): array`

### `static lenses(): array`

Nova-style alternate index views. Empty means the default table only.

### `static board(): ?Alxtexh\Panel\Resources\Board`

Opt-in Kanban board. Null (default) means the board actions 404.

### `static comments(): ?Alxtexh\Panel\Comments\Comments`

Opt-in record comments. Null (default) means comment routes 404 and the

### `static hasComments(): bool`

### `static canComment(Illuminate\Database\Eloquent\Model $record = NULL): bool`

May the current user post a comment on this record?

### `static configure(): Alxtexh\Panel\Resources\ResourceConfigurator`

Fluent per-resource overrides for page vs modal CRUD.

### `static formPresentation(): array`

### `static resolveLens(string $key): ?Alxtexh\Panel\Resources\Lens`

### `static resolvedLenses(): array`

### `static cluster(): ?string`

### `static parentResource(): ?string`

### `static parentColumn(): string`

The foreign key column that points at the parent record.

### `static relationship(): ?string`

BelongsToMany method on the parent model, or null for HasMany nested resources.

### `static pivotColumns(): array`

Extra columns on the pivot table itself - a role, an `expires_at` - for a

### `static infolistAction(string $key): ?Alxtexh\Panel\Actions\Action`

An infolist entry action by key, or null.

### `static purpose(): ?string`

### `static showsInNavigation(): bool`

Whether this resource appears in the navigation.

### `static navigationSort(): int`

### `static documented(): bool`

Whether this resource belongs in the API reference.

### `static model(): string`

### `static modifySearchQuery(Illuminate\Database\Eloquent\Builder $query, string $term): void`

### `static searchResultLimit(): int`

How many rows this resource may put in the palette.

### `static searchSubtitleColumn(): ?string`

The column that tells two same-titled results apart, or null to let the

### `static searchSort(): int`

Where this resource's results sit among the palette's groups.

### `static searchWeight(): float`

How strongly this resource's rows count for command palette ranking.

### `static definition(): Alxtexh\Panel\Tables\Table`

### `static schema(string $panelId = NULL): array`

The cached, tenant-independent half of the contract.

### `static actions(): array`

The actions this resource supports at all.

### `static data(Illuminate\Http\Request $request, Alxtexh\Panel\Tables\Table $definition = NULL): Alxtexh\Panel\Tables\ListResult`

Rows, filter options and counts. Never cached, always tenant-scoped.

