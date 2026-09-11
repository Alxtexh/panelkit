# ImportController

`Alxtexh\Panel\Http\Controllers\ImportController` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Http/Controllers/ImportController.php#L26)

Opt-in CSV import (Excel optional). Inspect, dry-run, queue, failed-row CSV.

**Extends:** `Illuminate\Routing\Controller`

## Methods

### `inspect(Illuminate\Http\Request $request, string $resource): Illuminate\Http\JsonResponse`

### `store(Illuminate\Http\Request $request, string $resource): Illuminate\Http\JsonResponse`

### `failures(Illuminate\Http\Request $request, string $resource, string $token): Symfony\Component\HttpFoundation\StreamedResponse`

### `retry(Illuminate\Http\Request $request, string $resource, string $token): Illuminate\Http\JsonResponse`

