# ImpersonateAction

`Alxtexh\Panel\Actions\ImpersonateAction` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Actions/ImpersonateAction.php#L42)

Sign in as this record, for however long "the customer says the page is

## Methods

### `static make(string $key = 'impersonate'): self`

### `label(string $label): self`

### `confirm(string $message): self`

Pass null to drop the confirmation dialog entirely.

### `toAction(): Alxtexh\Panel\Actions\RecordAction`

Build the record action this configures.

