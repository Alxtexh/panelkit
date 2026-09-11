# FileUploadField

`Alxtexh\Panel\Forms\Fields\FileUploadField` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Forms/Fields/FileUploadField.php#L30)

A file, uploaded before the form is submitted.

**Extends:** `Alxtexh\Panel\Forms\Fields\Field`

**Implements:** `Alxtexh\Panel\Schema\Renderable`

## Methods

### `type(): string`

### `accept(array $extensions): self`

Narrow what may be uploaded.

### `image(bool $image = true): self`

Images only, and render a preview.

### `fromLibrary(bool $enabled = true): self`

### `maxKilobytes(int $kilobytes): self`

### `directory(string $directory): self`

The subdirectory under the tenant prefix. Never taken from a request.

### `extensions(): array`

### `limitKilobytes(): int`

### `storageDirectory(): string`

### `transformForStorage(?mixed $value): mixed`

Turn a submitted value into what the column should hold.

### `presentValue(?mixed $value): mixed`

The stored path, described well enough to render.

### `toSchema(): array`

