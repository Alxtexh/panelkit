# Entry

`Alxtexh\Panel\Infolists\Entry` &middot; `abstract-class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Infolists/Entry.php#L24)

A labelled value on a dedicated view page.

**Extends:** `Alxtexh\Panel\Schema\Component`

**Uses:** `Alxtexh\Panel\Support\HasQualifiedSource`

## Methods

### `static make(string $key): static`

### `component(): string`

### `label(string $label): static`

### `url(string $url): static`

Optional href. The client renders the value as a link; the server never

### `action(Alxtexh\Panel\Actions\Action $action): static`

Click POSTs `{ action }` to `{resource}/{id}/infolist-action`.

### `getAction(): ?Alxtexh\Panel\Actions\Action`

### `type(): string`

### `dependsOn(): array`

Extra record keys this entry needs selected beyond its own `key`.

### `toSchema(): array`

### `from(string $column): static`

Qualified database column when it differs from the key.

### `fromRaw(string $expression): static`

A value the DATABASE computes, rather than a column it stores.

### `selectExpression(): Illuminate\Contracts\Database\Query\Expression|string`

How this value appears in the SELECT list - aliased to its own key.

