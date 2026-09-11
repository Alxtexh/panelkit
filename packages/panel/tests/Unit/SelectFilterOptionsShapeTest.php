<?php

declare(strict_types=1);

use Alxtexh\Panel\Tables\Filters\SelectFilter;

it('accepts a plain list of value strings', function () {
    $filter = SelectFilter::make('status')->options(['draft', 'sent', 'paid']);

    expect($filter->resolvedOptions())->toBe(['draft', 'sent', 'paid'])
        ->and($filter->allowedValues())->toBe(['draft', 'sent', 'paid']);
});

it('accepts a list of value/label pairs', function () {
    $filter = SelectFilter::make('status')->options([
        ['value' => 'draft', 'label' => 'Draft'],
        ['value' => 'sent', 'label' => 'Sent'],
    ]);

    expect($filter->allowedValues())->toBe(['draft', 'sent']);
});

it('accepts an empty list', function () {
    $filter = SelectFilter::make('status')->options([]);

    expect($filter->resolvedOptions())->toBe([]);
});

it('accepts a closure that resolves to a list', function () {
    $filter = SelectFilter::make('status')->options(fn (): array => ['draft', 'sent']);

    expect($filter->resolvedOptions())->toBe(['draft', 'sent']);
});

/**
 * THE SHAPE EVERY DOC EXAMPLE USES: `SelectField::options()` on the sibling
 * form field class takes a `value => label` map, it is the same method name
 * on a class in the same package, and docs/04-columns-and-filters.md's own
 * canonical examples call `SelectFilter::make('status')->options(['paid' =>
 * 'Paid', ...])` - so this is the natural, documented shape, not a mistake to
 * guard against. It used to be rejected: passed through uncaught, the string
 * keys would have survived into the JSON payload as an object rather than an
 * array, and `TableToolbar.vue`'s `(filter.options ?? []).map(...)` would
 * throw "options.map is not a function" in the browser. Normalising the map
 * into the list-of-{value,label} shape here - rather than forwarding it
 * raw, and rather than rejecting it - keeps that crash structurally
 * impossible while making the documented call actually work.
 */
it('accepts a value => label map and normalises it to the list shape', function () {
    $filter = SelectFilter::make('status')->options([
        'draft' => 'Draft',
        'sent' => 'Sent',
    ]);

    $resolved = $filter->resolvedOptions();

    expect(array_is_list($resolved))->toBeTrue()
        ->and($resolved)->toBe([
            ['value' => 'draft', 'label' => 'Draft'],
            ['value' => 'sent', 'label' => 'Sent'],
        ])
        ->and($filter->allowedValues())->toBe(['draft', 'sent']);
});

it('normalises a map returned from a closure the same way', function () {
    $filter = SelectFilter::make('status')->options(fn (): array => ['draft' => 'Draft']);

    expect($filter->resolvedOptions())->toBe([
        ['value' => 'draft', 'label' => 'Draft'],
    ]);
});
