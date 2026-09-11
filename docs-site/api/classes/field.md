# Field

`Alxtexh\Panel\Forms\Fields\Field` &middot; `abstract-class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/Field.php#L30)

A form field.

**Implements:** `Alxtexh\Panel\Schema\Renderable`

**Uses:** `Alxtexh\Panel\Forms\Fields\HasAffixes`

## Methods

### `static make(string $key): static`

### `type(): string`

### `label(string $label): static`

### `required(bool $required = true): static`

### `help(string $help): static`

### `placeholder(string $placeholder): static`

### `disabled(Closure|bool $disabled = true): static`

### `hidden(Closure|bool $hidden = true): static`

Hide this field. A Closure is evaluated on `{resource}/form-state`

### `afterStateUpdated(Closure $callback): static`

Run after this live() field changes, before the schema patch is built.

### `isHidden(array $values = array (
)): bool`

### `isDisabled(array $values = array (
)): bool`

### `applyAfterStateUpdated(array $values): array`

### `live(bool $live = true): static`

Ask the server for option and schema patches after this field changes.

### `isLive(): bool`

### `rule(...object|string $rules): static`

Additional rules, merged with the ones the type implies.

### `span(int $span): static`

### `resolvedLabel(): string`

### `isRequired(): bool`

### `rules(): array`

The Laravel validation rules for this field.

### `visibleWhen(string $field, ?mixed $value): static`

Show this field only when another field holds a given value.

### `visibilityCondition(): ?array`

### `chips(array $chips): static`

Tokens the client can insert into this field, drawn from wherever the

### `additionalRules(): array`

Rules for keys OTHER than this field's own.

### `toSchema(): array`

Structure only. Never resolves an option closure.

### `valuesFrom(Illuminate\Database\Eloquent\Model $record): array`

Current form values for this field, read from the record.

### `expandStorage(?mixed $value): ?array`

Extra columns to write instead of `$this->key`, or null to keep the default.

### `presentValue(?mixed $value): mixed`

Turn a stored value into what the FORM should show.

### `transformForStorage(?mixed $value): mixed`

Turn a validated value into what the column should hold.

### `omitsFromStorage(?mixed $value): bool`

Whether this value should be left out of the write entirely.

### `absentMeans(): mixed`

What an ABSENT key means for this field, if anything.

### `resolveOptions(): ?array`

Tenant-varying options, resolved when the DATA payload is assembled.

### `prefix(string $prefix): static`

### `suffix(string $suffix): static`

### `prefixIcon(string $icon): static`

### `suffixIcon(string $icon): static`

### `prefixAction(Alxtexh\Panel\Actions\Action|array|null $action): static`

### `suffixAction(Alxtexh\Panel\Actions\Action|array|null $action): static`

### `hint(string $hint): static`

### `hintIcon(string $icon): static`

### `hintAction(Alxtexh\Panel\Actions\Action|array|null $action): static`

### `copyable(bool $copyable = true): static`

A suffix copy action for the current value, like Filament's copyable hint.

### `affixAction(string $key): ?Alxtexh\Panel\Actions\Action`

The named POST action on this field, if the request named one.

