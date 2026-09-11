# Forms inside actions

Most real actions need a value before they can do anything — a reason, an
amount, a plan, a department. `->form()` collects it inline, without writing
a dedicated screen for a one-field prompt.

```php
RecordAction::make('change-plan', 'Change plan')
    ->authorize('update')
    ->form(fn (Form $form): Form => $form->schema([
        SelectField::make('plan_id')->required()
            ->searchable(fn (string $t): array => Plan::where('name', 'like', $t.'%')
                ->limit(25)->pluck('name', 'id')->all())
            ->rule(ExistsInScope::of(Plan::class)),

        TextareaField::make('note')->rule('max:280'),
    ]))
    ->handle(fn (Client $client, array $data) => $client->moveTo($data['plan_id']));
```

## `form()` pairs with `handle()` — never `mutate()`

A `mutate()` array is fixed at definition time and has nowhere to put what a
person typed. Declaring both `form()` and `mutate()` on the same action
throws immediately, rather than silently ignoring one of them.

## The schema is the security boundary

The endpoint validates the submission against **this exact declaration** and
drops every key it doesn't name. A request carrying an extra `status` field
alongside the declared `plan_id` has that extra key discarded before it
reaches your `handle()` closure — never assume `$data` might contain
something you didn't declare, because the framework already stripped it.

## No request needed to open the modal

The form's schema travels with the action inside the list payload, so the
modal opens instantly with no round-trip — the request only happens on
submit.

## The same pattern on `BulkAction`

```php
BulkAction::make('move-plan', 'Move to plan')
    ->authorize('update')
    ->form(fn (Form $form): Form => $form->schema([
        SelectField::make('plan_id')->required()->rule(ExistsInScope::of(Plan::class)),
    ]))
    ->handle(fn (Collection $records, array $data) => $records->each->update(['plan_id' => $data['plan_id']]));
```

Asked **once** for the whole selection — see [Bulk actions](/actions/bulk-actions)
for chunking and queueing behavior once the handler actually runs.
