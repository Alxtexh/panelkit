# Vue extension points

Three module-scope registries in the client package are how PHP-declared
schema types resolve to actual Vue components. There is no `registerColumn`
or `registerAction` — only these three.

## `registerFieldControl`

```ts
import { registerFieldControl } from '@alxtexh-enterprise/panel'

registerFieldControl('slug', SlugFieldControl)
```

Looked up by a `Field` subclass's `type()` string, checked **before** the
kit's own built-in control list — so registering a control for an existing
type (`'text'`, `'select'`) replaces the built-in one. Registering the same
type twice silently replaces the previous registration with no warning,
deliberately, so Vite HMR re-running a plugin's entry point on every save
doesn't produce a console warning storm. The control receives `field`,
`modelValue`, `disabled`, `errors`, and `options` as props, and emits a plain
`update:modelValue` — an ordinary `v-model` contract.

An option-bearing field also needs `resolveOptions()` overridden on the PHP
side — a control with no options source renders with nothing to choose from
and reports no error.

## `registerEntryView`

The infolist counterpart, for a `ViewEntry`:

```php
ViewEntry::make('summary')->view('OrderSummary'),
```

```ts
import { registerEntryView } from '@alxtexh-enterprise/panel'

registerEntryView('OrderSummary', OrderSummaryView)
```

Same pattern as `registerFieldControl`: no Blade, no class names in the
schema, no markup generated in PHP.

## Render hooks

Add a component to a screen you don't own, at a named position, instead of
forking it:

```php
$context->render(
    RenderHooks::LIST_BEFORE_TABLE,
    'TrialNotice',                 // resolved by the HOST APPLICATION's own registry
    ['daysLeft' => 3],
    ['clients'],                   // scoped to this resource key only; omit for every screen
);
```

```ts
import { registerRenderHookComponent } from '@alxtexh-enterprise/panel'

registerRenderHookComponent('TrialNotice', TrialNotice)
```

Twelve named positions exist (`Alxtexh\Panel\Plugins\RenderHooks`):

| Position | Where |
|---|---|
| `LIST_BEFORE_HEADER` | Above the page title on a resource list |
| `LIST_BEFORE_TABLE` | Between the list header and the table |
| `LIST_AFTER_TABLE` | Below the table |
| `LIST_ROW_ACTIONS_BEFORE` / `_AFTER` | Beside a row's own action menu — the only **per-row** positions; the component receives that row as a `row` prop |
| `FORM_BEFORE` / `FORM_AFTER` | Above/below a record's create/edit form |
| `VIEW_BEFORE` / `VIEW_AFTER` | Above/below a record's read-only detail — the built-in ticketing plugin mounts its conversation thread at `VIEW_AFTER` |
| `DASHBOARD_BEFORE` / `DASHBOARD_AFTER` | Top/bottom of the dashboard, around the widgets |
| `SHELL_FEEDBACK` | Panel-wide chrome, not tied to one screen |

A hook renders a **component name and props, never HTML** — the panel is an
Inertia app, and a raw HTML string sent from the server can't be hydrated or
escaped consistently. This is also why the host application's own registry
resolves the name, not the plugin that declared the hook: a component name
supplied straight from the server would let a plugin mount anything already
in the client bundle, which is not a boundary a string constant can enforce
on its own.

An unresolved position name is refused at registration (`PluginContext::render()`
validates against `RenderHooks::isPosition()`); an unresolved *component*
name — one nothing has registered on the client — renders nothing, silently,
so a plugin's own markup never becomes an error on somebody else's screen.
