<?php

declare(strict_types=1);

namespace App\Panel\Superadmin\Resources;

use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\Forms\Fields\CheckboxField;
use Alxtexh\Panel\Forms\Fields\NumberField;
use Alxtexh\Panel\Forms\Fields\SelectField;
use Alxtexh\Panel\Forms\Fields\TextareaField;
use Alxtexh\Panel\Forms\Fields\TextField;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Models\ContentEntry;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Columns\BadgeColumn;
use Alxtexh\Panel\Tables\Columns\DateColumn;
use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Filters\SelectFilter;
use Alxtexh\Panel\Tables\Table;

/**
 * The editor for Help, FAQ and What's-new.
 *
 * ONE RESOURCE FOR THREE SCREENS, because the rows are one shape wearing
 * three labels - see the migration on `panel_content_entries`. What each
 * field MEANS per kind is written on the field itself, which is what an
 * operator reads.
 *
 * Changes land on the next request: the model flushes the content cache on
 * every save, and `EditableContent` re-registers on every panel request.
 * There is no publish step to forget.
 */
final class ContentEntryResource extends Resource
{
    protected static string $model = ContentEntry::class;

    protected static ?string $purpose = 'The Help, FAQ and What\'s-new content every portal reads, edited rather than deployed.';

    protected static string $panel = 'superadmin';

    public static function form(Form $form): Form
    {
        return $form->columns(2)->schema([
            SelectField::make('kind')
                ->options([
                    ContentEntry::KIND_FAQ => 'FAQ question',
                    ContentEntry::KIND_ARTICLE => 'Help article',
                    ContentEntry::KIND_RELEASE => "What's-new release",
                    ContentEntry::KIND_ABOUT => 'About',
                ])
                ->required()
                ->help('Which screen this feeds.'),
            TextField::make('category')
                ->help('FAQ: the question group. Article: the help tab key. Release: the date, as people should read it.'),
            TextField::make('title')
                ->required()
                ->help('FAQ: the question. Article: the title. Release: the version.'),
            TextareaField::make('body')
                ->help('FAQ: the answer. Article: the body. Release: the one-line highlight.'),
            NumberField::make('sort')
                ->help('Lower first, within its kind.'),
            CheckboxField::make('published')
                ->help('Unpublished rows stay here and reach no screen.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            // Browsed, then opened - see ClientResource's own note on why
            // this is declared per resource rather than default. rowClick
            // alone only arms the click; the row still needs a real 'view'
            // RecordAction below to have somewhere to send it.
            ->rowClick('view')
            ->recordActions([
                RecordAction::make('view', 'View')
                    ->icon('eye')
                    ->color('primary')
                    ->authorize('view')
                    ->link(fn (array $row): string => '/superadmin/content-entries/'.$row['id']),
            ])
            ->columns([
                BadgeColumn::make('kind')->colors([
                    ContentEntry::KIND_FAQ => 'info',
                    ContentEntry::KIND_ARTICLE => 'success',
                    ContentEntry::KIND_RELEASE => 'warning',
                    ContentEntry::KIND_ABOUT => 'info',
                ]),
                TextColumn::make('category')->sortable()->searchable(),
                TextColumn::make('title')->sortable()->searchable()->locked(),
                BadgeColumn::make('published')->colors(['1' => 'success', '' => 'danger']),
                TextColumn::make('sort')->sortable(),
                DateColumn::make('updated_at')->label('Edited')->sortable(),
            ])
            ->filters([
                SelectFilter::make('kind')->options([
                    ContentEntry::KIND_FAQ,
                    ContentEntry::KIND_ARTICLE,
                    ContentEntry::KIND_RELEASE,
                    ContentEntry::KIND_ABOUT,
                ]),
            ])
            ->defaultSort('sort', 'asc');
    }
}
