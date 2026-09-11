# Actions

PanelKit has three action-shaped classes that are easy to confuse — they
share vocabulary (`make()`, `authorize()`, `icon()`) but serve different
places in the UI:

| Class | Lives on | Purpose |
|---|---|---|
| [`RecordAction`](/api/classes/record-action) | A table row, or a View page | One record: confirm, mutate, or run a handler |
| [`BulkAction`](/api/classes/bulk-action) | The table's selection toolbar | Many records at once |
| [`Action`](/api/classes/action) | An infolist entry, a form affix, or a `Notification` | A smaller, non-table action surface |

See [Record actions](/actions/record-actions), [Bulk actions](/actions/bulk-actions),
and [Forms inside actions](/actions/forms-in-actions) for each in depth.

## The shared shape

All three support `->authorize($ability)` (checked before the action even
renders, and again before it runs — never trust that a rendered menu item
implies permission), `->icon()`, and a destructive/confirmation pair
(`->destructive()`, `->confirm('message')`) for anything that can't be
undone.

## `ActionGroup`

Groups several `RecordAction`s under one labelled section inside a row's
action menu — a plain section, not a nested submenu. An empty group (every
action inside it failed its own `authorize()` check) renders as nothing, not
an empty header.

## Two shipped, ready-to-use actions

```php
use Alxtexh\Panel\Actions\ImpersonateAction;
use Alxtexh\Panel\Actions\ReplicateAction;

$table->recordActions([
    ImpersonateAction::make()->toAction(),
    ReplicateAction::make()->except(['reference_number'])->toAction(),
]);
```

[`ImpersonateAction`](/api/classes/impersonate-action) wires a `RecordAction`
to the impersonation service directly — see [Authentication](/authentication/#impersonation).
[`ReplicateAction`](/api/classes/replicate-action) wires one to
`Model::replicate()`, always authorized as `create` (not `update`) since it
produces a new record, and always stamps a fresh tenant rather than copying
the original's.

## Background work: `JobStatus`

Long-running bulk actions and exports run through
[`JobStatus`](/api/classes/job-status) — a cache-backed, owner-checked
progress tracker (`start`, `progress`, `finish`, `fail`, `cancel`,
`isCanceled`, `get`). This is one of the few classes pinned in PanelKit's own
backward-compatibility floor (`docs/public-api.json`), so it's safe to depend
on directly if you're building custom queued work outside a `BulkAction`.
