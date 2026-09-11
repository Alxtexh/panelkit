# RecordAction

`Alxtexh\Panel\Actions\RecordAction` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Actions/RecordAction.php#L54)

A mutation applied to ONE record, from its row menu.

## Methods

### `static make(string $key, string $label): self`

### `icon(string $icon): self`

### `destructive(bool $destructive = true): self`

Renders in the destructive tone and, by convention, asks first.

### `color(string $color): self`

The tone this action carries in the menu.

### `confirm(string $message): self`

### `slideOver(bool $slideOver = true): self`

Present a form action in PkSlideover instead of the default dense PkModal.

### `modalWidth(string $width): self`

How wide the dense modal opens - `sm`, `confirm` (default), `form`,

### `submitLabel(string $label): self`

Replace the primary button's text - defaults to the action's own label.

### `cancelLabel(string $label): self`

Replace "Cancel" - a destructive action might prefer "Never mind", say.

### `extraModalFooterActions(array $actions): self`

Extra link buttons beside Cancel/Submit - "read the docs", "open this

### `keyBindings(array $bindings): self`

Keyboard shortcuts that run this action while its row's menu is open.

### `authorize(string $ability): self`

### `mutate(array $attributes): self`

### `transitionTo(string $state, string $column = 'status', string $model = NULL): self`

Move a workflow column to a fixed state.

### `when(Closure $when): self`

Show and allow this action only when the row matches.

### `form(Closure $form): self`

Collect input before running.

### `formDefinition(): ?Alxtexh\Panel\Forms\Form`

The declared form, or null when this action asks for nothing.

### `steps(array $steps): self`

Declarative, wizard-style action steps.

### `hasSteps(): bool`

### `stepsDefinition(): array`

### `handle(Closure $handle): self`

### `link(Closure $link): self`

A navigation, not a mutation.

### `removesRow(bool $removes = true): self`

Whether the acted-on row leaves the current view.

### `visible(Closure $visible): self`

Hide the action for records it does not apply to.

### `redirect(Closure|string $url): self`

Navigate here after `run()`/`executeWithData()` succeeds, instead of

### `resolveRedirect(Illuminate\Database\Eloquent\Model $record, array $result = array (
)): ?string`

### `isLink(): bool`

### `ability(): string`

### `appliesTo(array $attributes): bool`

### `urlFor(array $attributes): ?string`

### `run(Illuminate\Database\Eloquent\Model $record, array $data = array (
)): ?array`

### `toArray(): array`

Structure only. No record data, no CSS classes (antipatterns §6.1).

### `static defaultIconFor(string $key, string $label = '', bool $destructive = false): ?string`

Semantic icon name for a common key or label when none was declared.

### `executeWithData(Illuminate\Database\Eloquent\Model $record, array $data = array (
)): ?array`

Execute with already-collected and already-step-validated data.

