# ReplicateAction

`Alxtexh\Panel\Actions\ReplicateAction` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Actions/ReplicateAction.php#L42)

Duplicate a record.

## Methods

### `static make(string $key = 'replicate'): self`

### `label(string $label): self`

### `except(array $columns): self`

Columns to leave off the copy - the unique ones, usually.

### `then(Closure $then): self`

Adjust the copy before it is saved.

### `confirm(string $message): self`

### `toAction(): Alxtexh\Panel\Actions\RecordAction`

Build the record action this configures.

