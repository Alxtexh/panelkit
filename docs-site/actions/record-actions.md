# Record actions

A [`RecordAction`](/api/classes/record-action) is a row-menu action or a
View-page action. It has three mutually distinct shapes — pick one:

## `mutate()` — a fixed update

```php
RecordAction::make('archive')
    ->icon('archive')
    ->authorize('update')
    ->confirm('Archive this record?')
    ->mutate(['status' => 'archived']);
```

For a change that's the same every time and needs no input from the operator.

## `handle()` — custom logic

```php
RecordAction::make('suspend')
    ->label('Suspend')->icon('ban')->authorize('update')
    ->confirm('Suspend this account? They lose access immediately.')
    ->handle(fn (Customer $customer) => $customer->update(['status' => 'suspended']));
```

For anything `mutate()`'s flat array can't express — side effects, conditional
logic, calling another service.

## `link()` — navigation, not mutation

```php
RecordAction::make('invoice')->link(fn (array $row): string => "/invoices/{$row['id']}/pdf");
```

For an action that's really just a styled link (open a related resource,
download a file) — it never touches the record.

## Requesting input first: `form()`

See [Forms inside actions](/actions/forms-in-actions) — `form()` pairs with
`handle()` only; declaring both `form()` and `mutate()` on the same action
throws, because a fixed mutation has nowhere to put what the operator typed.

## Visibility vs. authorization

```php
RecordAction::make('reopen')
    ->authorize('update')
    ->visible(fn (array $row): bool => $row['status'] === 'closed');
```

`visible()` receives the **row array** already fetched for the table, not a
re-queried model — this is a deliberate performance choice, so per-row
visibility checks don't add a query per row on top of the list query itself.
`authorize()` is the actual security boundary; `visible()` only decides
whether to show a control that's already going to be re-checked when it runs.

## Confirmation modals

```php
RecordAction::make('delete')
    ->destructive()
    ->confirm('Delete this record? This cannot be undone.')
    ->modalWidth('confirm')
    ->submitLabel('Delete')
    ->extraModalFooterActions([
        ModalFooterAction::make('View audit log')->url($auditUrl),
    ]);
```

Every confirmation is a real modal component (`PkModal`), never
`window.confirm()` — that call is silently suppressed in embedded browsers,
so it would fail invisibly for some operators and not others.

## Multi-step actions

```php
RecordAction::make('close-account')->steps([
    ActionStep::make('Confirm')->describe('This closes the account permanently.'),
    ActionStep::make('Reason')->form(fn (Form $form) => $form->schema([
        TextareaField::make('reason')->required(),
    ]))->onExecute(fn (Model $record, array $data) => $record->close($data['reason'])),
]);
```

`steps()` is mutually exclusive with `form()` — use it only when a later step
genuinely depends on an earlier one; a single-purpose action with one thing
to ask for should use `form()` + `handle()` instead of a one-step wizard.

::: warning
`ActionStep::validate()` is deprecated — use `onExecute()` instead.
:::

## Row transitions

```php
RecordAction::make('mark-paid')->transitionTo('paid', column: 'status');
```

A shorthand for a `mutate()` that also plays well with a resource's declared
`workflow()`, when one exists.
