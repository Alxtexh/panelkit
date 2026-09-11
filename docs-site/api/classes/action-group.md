# ActionGroup

`Alxtexh\Panel\Actions\ActionGroup` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Actions/ActionGroup.php#L29)

A labelled section of record actions.

## Methods

### `static make(string $label): self`

### `actions(array $actions): self`

### `icon(string $icon): self`

### `getActions(): array`

### `toArrayFor(array $attributes, callable $allows): ?array`

The group as the client sees it, already filtered for this record.

