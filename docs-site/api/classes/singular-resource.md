# SingularResource

`Alxtexh\Panel\Resources\SingularResource` &middot; `abstract-class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Resources/SingularResource.php#L33)

A screen with ONE record and no list - roadmap 4.3.

## Configuration properties

| Property | Type |
| --- | --- |
| `$icon` | `string` |
| `$group` | `?string` |
| `$purpose` | `?string` |
| `$panel` | `string` |

## Methods

### `static form(Alxtexh\Panel\Forms\Form $form): Alxtexh\Panel\Forms\Form`

The form over the one record. Same declaration language as a resource.

### `static values(): array`

The current values, shaped for the form's fields.

### `static save(array $validated): void`

Persist a validated, sanitized submission. Storage is yours.

### `static ability(): ?string`

The ability that gates this screen, or null for any signed-in member.

### `static key(): string`

`BillingSettingsResource` becomes `billing-settings`.

### `static label(): string`

### `static icon(): string`

### `static group(): ?string`

### `static purpose(): ?string`

### `static panel(): string`

### `static links(): array`

Places to go from this screen - normally the thing it configures.

### `static formDefinition(): Alxtexh\Panel\Forms\Form`

