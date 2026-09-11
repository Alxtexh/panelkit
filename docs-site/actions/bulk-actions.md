# Bulk actions

A [`BulkAction`](/api/classes/bulk-action) runs against a selection rather
than a single record. Like `RecordAction`, it has two shapes:

## `mutate()` — one UPDATE for the whole selection

```php
BulkAction::make('archive', 'Archive')
    ->authorize('update')
    ->mutate(['status' => 'archived']);
```

Runs as a single batched `UPDATE`, not one query per selected row.

## `handle()` — per-record or per-chunk logic

```php
BulkAction::make('export', 'Export')
    ->handle(fn (Collection $records) => Export::rowsFor($records));
```

## Authorization modes

```php
BulkAction::make('delete', 'Delete')
    ->destructive()
    ->authorize('delete')                  // checked per record (default)
    ->authorizeAny()                       // OR: allowed if the actor can act on ANY of the selection
    ->authorizeIndividualRecords();        // explicit: filter the selection to only records the actor can act on
```

Default behavior checks the ability against every record in the selection —
an operator without `delete` on even one selected record has the whole bulk
action refused, not silently partially applied.

## Requesting input once for the whole selection

```php
BulkAction::make('move-plan', 'Move to plan')
    ->authorize('update')
    ->form(fn (Form $form): Form => $form->schema([
        SelectField::make('plan_id')->required()->rule(ExistsInScope::of(Plan::class)),
    ]))
    ->handle(fn (Collection $records, array $data) => $records->each->update(['plan_id' => $data['plan_id']]));
```

This is the whole reason "move these forty records to a plan" is a bulk
action rather than forty individual clicks — the form asks **once** for the
entire selection. Values are validated **before** the job is queued, so a
"select all matching" run that would fail on `plan_id` fails immediately in
the response the operator is reading, not later in a worker's log.

`->slideOver()` renders the form in a side panel instead of a centered modal
— useful when the form has more than a couple of fields.

## Large selections: chunking and queuing

```php
BulkAction::make('recalculate', 'Recalculate totals')
    ->chunkSize(500)
    ->queueThreshold(1000)   // selections larger than this are queued, not run inline
    ->handle(fn (Collection $records) => $records->each->recalculateTotal());
```

The handler runs once per **chunk**, not once per record — plan accordingly
if your closure has per-call overhead. Selections above the queue threshold
run as a background job with `JobStatus` tracking (see [Actions overview](/actions/#background-work-jobstatus)),
so a bulk action against thousands of rows doesn't hold the request open.

## Confirmation

```php
BulkAction::make('delete', 'Delete')->destructive()->requiresConfirmation();
```

Same modal mechanism as `RecordAction` — never `window.confirm()`.
