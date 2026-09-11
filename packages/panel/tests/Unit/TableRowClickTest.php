<?php

declare(strict_types=1);

use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Table;

/**
 * `Table::rowClick()` - OFF by default at the class level (see its own
 * docblock: a table people read in place rather than browse should not have
 * a clickable row), left as the resource's own call. `make:panel-resource
 * --generate` opts a freshly generated resource IN by default instead -
 * see `MakeResourceGenerateTest` for that half.
 */
it('defaults row click off', function () {
    $schema = Table::make()
        ->columns([TextColumn::make('name')])
        ->toSchema();

    expect($schema['rowClick'])->toBeNull();
});

it('opts a row into navigating to view', function () {
    $schema = Table::make()
        ->columns([TextColumn::make('name')])
        ->rowClick('view')
        ->toSchema();

    expect($schema['rowClick'])->toBe('view');
});

it('defaults the mode argument to view', function () {
    $schema = Table::make()
        ->columns([TextColumn::make('name')])
        ->rowClick()
        ->toSchema();

    expect($schema['rowClick'])->toBe('view');
});

it('none explicitly turns row click back off', function () {
    $schema = Table::make()
        ->columns([TextColumn::make('name')])
        ->rowClick('view')
        ->rowClick('none')
        ->toSchema();

    expect($schema['rowClick'])->toBeNull();
});

it('rejects an unknown row-click mode', function () {
    Table::make()->rowClick('open');
})->throws(InvalidArgumentException::class, "[open] is not a row-click mode. Use 'view' or 'none'.");
