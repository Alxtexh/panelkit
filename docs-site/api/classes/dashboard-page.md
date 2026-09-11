# DashboardPage

`Alxtexh\Panel\Pages\DashboardPage` &middot; `abstract-class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Pages/DashboardPage.php#L56)

The host `StatWidget` and `ChartWidget` never had.

**Extends:** `Alxtexh\Panel\Pages\Page`

## Configuration properties

| Property | Type |
| --- | --- |
| `$icon` | `string` |

## Methods

### `static ability(): ?string`

NO ABILITY OF ITS OWN, unlike every other page.

### `static filterDimensions(): array`

The filter dimensions this dashboard offers, beside the date range.

### `static shortcuts(): array`

Dashboard shortcut catalog. Empty means the widget is not drawn.

### `static strip(): ?callable`

The strip of windows above the widgets - today, the week, the month.

### `static stripAbility(): ?string`

The ability required to see the strip, or null for everybody.

### `static strips(): array`

MORE THAN ONE STRIP, when one is not enough.

### `static checklistAbility(): ?string`

The ability required to see the installation's setup checklist.

### `static filters(): Alxtexh\Panel\Widgets\DashboardFilters`

The filters this request is under.

### `static stats(): array`

The counters across the top.

### `static charts(): array`

The charts below them (includes MapWidget / CalendarWidget via unwrap).

### `static tables(): array`

Capped resource lists below the charts.

### `static infoPanel(): ?array`

Optional contextual guidance shown in the shell's right-side info panel.

### `static component(): string`

The packaged screen that draws them.

### `static designs(): array`

Dashboard visual family. The widget contract stays identical across

### `static design(): string`

### `static data(Illuminate\Http\Request $request): array`

