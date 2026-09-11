<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Fixtures\Resources;

use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Table;
use Alxtexh\Panel\Tests\Fixtures\Models\Note;

/**
 * DELIBERATELY DECLARES $navigationIcon, Filament's property name, not
 * PanelKit's - see `DoctorCommand::checkNavigationIconPropertyName()`'s own
 * docblock. Exists only to prove that check fires; registered, routable,
 * and guarded by nothing, same as `NoteResource` it borrows its model from.
 */
final class MisnamedIconResource extends Resource
{
    protected static string $model = Note::class;

    protected static string $panel = 'admin';

    /** @phpstan-ignore-next-line property.unused - the mistake under test */
    protected static ?string $navigationIcon = 'receipt';

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('body')->from('notes.body')->sortable(),
            ])
            ->keyColumn('notes.id');
    }
}
