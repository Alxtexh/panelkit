<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Fixtures\Resources;

use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Table;
use Alxtexh\Panel\Tests\Fixtures\Models\Note;

/**
 * DELIBERATELY DECLARES `$icon` (the RIGHT property name) HOLDING A NAME
 * PANELKIT DOES NOT CURATE - see `DoctorCommand::checkResourceIconNames()`'s
 * own docblock. `user-cog` is a real, plausible Lucide icon, not a typo -
 * exactly the shape of mistake that check exists to catch, distinct from
 * `MisnamedIconResource`'s wrong-PROPERTY-NAME mistake. Registered,
 * routable, and guarded by nothing, same as `NoteResource` it borrows its
 * model from.
 */
final class UnsupportedIconResource extends Resource
{
    protected static string $model = Note::class;

    protected static string $panel = 'admin';

    protected static string $icon = 'user-cog';

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('body')->from('notes.body')->sortable(),
            ])
            ->keyColumn('notes.id');
    }
}
