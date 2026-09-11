# BulkAction

`Alxtexh\Panel\Actions\BulkAction` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Actions/BulkAction.php#L35)

A mutation applied to a selection.

## Methods

### `static make(string $key, string $label): self`

### `icon(string $icon): self`

### `destructive(bool $destructive = true): self`

Renders in a warning tone and always confirms.

### `color(string $color): self`

The tone this action carries in the bulk menu.

### `requiresConfirmation(string $message): self`

### `authorize(string $ability): self`

The policy ability checked before anything is written.

### `authorizeAny(string $ability): self`

Use the collection-level policy ability for this bulk operation.

### `authorizeIndividualRecords(bool $authorize = true): self`

### `authorizesIndividualRecords(): bool`

### `mutate(array $attributes): self`

The attributes to set, as ONE update per chunk.

### `form(Closure $form): self`

Collect input before running - see the property note.

### `formDefinition(): ?Alxtexh\Panel\Forms\Form`

The declared form, or null when this action asks for nothing.

### `slideOver(bool $slideOver = true): self`

Present a form action in PkSlideover instead of the default dense PkModal.

### `handle(Closure $handle): self`

### `chunkSize(int $size): self`

How many records are touched per round trip.

### `queueThreshold(int $rows): self`

HOW MANY EXPLICITLY-SELECTED ROWS THIS ACTION WILL STILL RUN INLINE.

### `getQueueThreshold(): ?int`

### `getAbility(): string`

### `getRecordAbility(): string`

The record-level counterpart of an `*Any` collection ability.

### `getChunkSize(): int`

### `getMutation(): array`

### `getHandler(): ?Closure`

### `requiresHandler(): bool`

A FORM WITH NOWHERE TO SEND WHAT IT COLLECTED is refused, exactly as for

### `isRunnable(): bool`

### `toArray(): array`

The client half. Semantic only - no classes, no colours (§6.1).

