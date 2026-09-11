<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Fixtures\Resources;

use Alxtexh\Panel\Actions\Action;
use Alxtexh\Panel\Actions\ActionStep;
use Alxtexh\Panel\Actions\BulkAction;
use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\Forms\Fields\CheckboxField;
use Alxtexh\Panel\Forms\Fields\FileUploadField;
use Alxtexh\Panel\Forms\Fields\MoneyField;
use Alxtexh\Panel\Forms\Fields\RepeaterField;
use Alxtexh\Panel\Forms\Fields\TextField;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Infolists\BadgeEntry;
use Alxtexh\Panel\Infolists\CodeEntry;
use Alxtexh\Panel\Infolists\ColorEntry;
use Alxtexh\Panel\Infolists\DateTimeEntry;
use Alxtexh\Panel\Infolists\IconEntry;
use Alxtexh\Panel\Infolists\ImageEntry;
use Alxtexh\Panel\Infolists\KeyValueEntry;
use Alxtexh\Panel\Infolists\MoneyEntry;
use Alxtexh\Panel\Infolists\RepeatableEntry;
use Alxtexh\Panel\Infolists\TextEntry;
use Alxtexh\Panel\Infolists\ViewEntry;
use Alxtexh\Panel\Comments\Comments;
use Alxtexh\Panel\Resources\Board;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Columns\BadgeColumn;
use Alxtexh\Panel\Tables\Columns\DateColumn;
use Alxtexh\Panel\Tables\Columns\MoneyColumn;
use Alxtexh\Panel\Tables\Columns\SelectColumn;
use Alxtexh\Panel\Tables\Filters\SelectFilter;
use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Columns\TextInputColumn;
use Alxtexh\Panel\Tables\Table;
use Alxtexh\Panel\Widgets\StatWidget;
use Alxtexh\Panel\Workflow\Transition;
use Alxtexh\Panel\Workflow\Workflow;
use Alxtexh\Panel\Resources\RelationManager;
use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Comment;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

/** The tenant-scoped counterpart of `PostResource`. */
final class ArticleResource extends Resource
{
    protected static string $model = Article::class;

    protected static string $panel = 'admin';

    /** @var list<string> */
    public static array $lifecycleEvents = [];

    public static function resetLifecycleEvents(): void
    {
        self::$lifecycleEvents = [];
    }

    public static function beforeValidate(\Illuminate\Http\Request $request): void
    {
        self::$lifecycleEvents[] = 'beforeValidate';
    }

    /** @param array<string, mixed> $data */
    public static function afterValidate(array $data): void
    {
        self::$lifecycleEvents[] = 'afterValidate';
    }

    /** @param array<string, mixed> $data */
    public static function beforeCreate(Model $record, array $data): void
    {
        self::$lifecycleEvents[] = 'beforeCreate';
    }

    /** @param array<string, mixed> $data */
    public static function afterCreate(Model $record, array $data): void
    {
        self::$lifecycleEvents[] = 'afterCreate';
    }

    /** @param array<string, mixed> $data */
    public static function beforeUpdate(Model $record, array $data): void
    {
        self::$lifecycleEvents[] = 'beforeUpdate';
    }

    /** @param array<string, mixed> $data */
    public static function afterUpdate(Model $record, array $data): void
    {
        self::$lifecycleEvents[] = 'afterUpdate';
    }

    public static function beforeDelete(Model $record): void
    {
        self::$lifecycleEvents[] = 'beforeDelete';
    }

    public static function afterDelete(Model $record): void
    {
        self::$lifecycleEvents[] = 'afterDelete';
    }

    /**
     * A FORM, because without one the write endpoints answer 404.
     *
     * `RecordController::store` aborts when `formDefinition()->fields()` is
     * empty - deliberately: a resource that declared no form has no create
     * screen, so accepting a POST would be writing through a door the panel
     * never drew. `tenant_id` is absent on purpose; it comes from request
     * context, and a field for it would be a way to file into another
     * organisation.
     */
    public static function form(Form $form): Form
    {
        return $form->autosave()->schema([
            TextField::make('title')
                ->required()
                ->live()
                ->afterStateUpdated(static function (mixed $state, callable $set): void {
                    if ($state === 'lock-status') {
                        $set('status', 'draft');
                    }
                }),
            TextField::make('slug')
                ->prefixAction(
                    Action::make('upper')->action(static function (callable $get, callable $set): void {
                        $set('slug', strtoupper((string) $get('slug')));
                    }),
                )
                ->suffixAction(
                    Action::make('generate')->action(static function (callable $get, callable $set): void {
                        $set('slug', Str::slug((string) $get('title')));
                    }),
                ),
            TextField::make('status')
                ->hidden(static fn (array $values): bool => ($values['title'] ?? '') === 'hide-status')
                ->disabled(static fn (array $values): bool => ($values['title'] ?? '') === 'lock-status'),
            /*
             * AN UPLOAD FIELD, so the upload endpoints have a declared target.
             * `accept()` is the allowlist those endpoints check a filename
             * against - without a declared field there is nothing to refuse
             * an undeclared one BY, and the refusal is the property worth
             * testing.
             */
            FileUploadField::make('attachment')->accept(['pdf', 'txt'])->maxKilobytes(64),
            /*
             * SAME COLUMN AS `MoneyColumn::make('price')` BELOW AND
             * `MoneyEntry::make('price')` in `infolist()` - the three-way
             * agreement pass exists to prove exactly this: `articles.price`
             * is minor units (cents), and List/View/Edit must all read that
             * one stored integer the same way.
             */
            MoneyField::make('price')->currency('$'),
            RepeaterField::make('comments')
                ->relationship('comments')
                ->schema([
                    TextField::make('body')->required(),
                    TextField::make('status'),
                ]),
        ]);
    }

    public static function importable(): bool
    {
        return true;
    }

    /**
     * Opt-in board for HTTP Pest coverage of /board and /board-move.
     */
    public static function board(): ?Board
    {
        return Board::make('status')
            ->columns([
                'draft' => 'Draft',
                'published' => 'Published',
                'archived' => 'Archived',
            ])
            ->title('title');
    }

    /** Opt-in comments for Pest coverage of /comments routes. */
    public static function comments(): ?Comments
    {
        return Comments::make();
    }

    public static function infolist(): array
    {
        return [
            TextEntry::make('title')
                ->url('https://example.test/articles')
                ->action(
                    Action::make('copy')
                        ->label('Copy')
                        ->authorize('update')
                        ->mutate(['status' => 'copied']),
                ),
            IconEntry::make('status')
                ->icons([
                    'draft' => 'dot',
                    'published' => 'check',
                    'archived' => 'x',
                ])
                ->colors([
                    'draft' => 'neutral',
                    'published' => 'success',
                    'archived' => 'warning',
                ])
                ->labels([
                    'draft' => 'Draft',
                    'published' => 'Published',
                    'archived' => 'Archived',
                ]),
            ImageEntry::make('cover')->fallbackFrom('title'),
            KeyValueEntry::make('meta')->labels('Key', 'Value'),
            ColorEntry::make('accent'),
            CodeEntry::make('snippet')->language('json'),
            RepeatableEntry::make('extras')->schema([
                TextEntry::make('label'),
                TextEntry::make('url'),
            ]),
            BadgeEntry::make('status')
                ->colors([
                    'draft' => 'neutral',
                    'published' => 'success',
                    'archived' => 'warning',
                ])
                ->defaultColor('neutral'),
            /*
             * QUALIFIED, unlike most entries here, because `tenants` (joined
             * for `tenant_name` below) ALSO has a `created_at` column - the
             * exact ambiguity `Column::from()`'s own docblock exists to name,
             * now real the moment an infolist and a join share a query. Every
             * OTHER entry above stays bare: none of `title`/`status`/`cover`/
             * `meta`/`accent`/`snippet`/`extras`/`price` exist on `tenants`.
             */
            DateTimeEntry::make('created_at')->from('articles.created_at'),
            MoneyEntry::make('price')->currency('USD')->divideBy(100),
            ViewEntry::make('title')->label('Title preview')->view('article-title-preview'),
            /*
             * THE DOCUMENTED WAY TO SHOW A RELATIONSHIP VALUE ON AN INFOLIST:
             * a real SQL join (declared once, on `table()`'s own `->query()`
             * below - the same join a List column would use) plus `from()`,
             * the identical mechanism `Column::from()` already has, now
             * shared via `HasQualifiedSource`. `TextEntry::make('tenant.name')`
             * (dot notation) is deliberately NOT what this is - PanelKit does
             * not walk Eloquent relations per row for an infolist value; see
             * `HasQualifiedSource`'s own docblock for why a join stays a join
             * rather than becoming an N+1.
             *
             * ABSENT FROM `table()->columns()` ON PURPOSE - this is also the
             * infolist/table decoupling regression case: before the fix, a
             * View page's selection WAS the table's, so an entry for a value
             * the list never displays rendered an em dash despite the value
             * (and now the join) genuinely existing.
             */
            TextEntry::make('tenant_name')->label('Tenant')->from('tenants.name'),
        ];
    }

    /**
     * WIDGETS ABOVE THE LIST - `Resource::headerWidgets()`.
     *
     * One open and one ability-gated, so both halves of `WidgetSet`'s
     * permission rule are assertable: a widget nobody may see must be neither
     * sent nor RESOLVED, since resolving it would run its query for somebody
     * forbidden to read the answer.
     *
     * @return list<StatWidget>
     */
    public static function headerWidgets(): array
    {
        return [
            StatWidget::make('total', 'Total')
                ->value(static fn (): int => Article::query()->count()),

            StatWidget::make('secret', 'Secret')
                ->ability('see_secret_stat')
                ->value(static fn (): int => throw new \RuntimeException(
                    'A hidden widget was resolved for somebody who may not see it.',
                )),
        ];
    }

    /**
     * WIDGETS BELOW THE LIST - `Resource::footerWidgets()`.
     *
     * A DIFFERENT KEY FROM THE HEADER ROW's, on purpose: the two rows are
     * namespaced under different prop prefixes (`header`/`footer`), and a
     * shared key would still pass a test that only checked "is this key
     * present somewhere" without proving the two never collide.
     *
     * @return list<StatWidget>
     */
    public static function footerWidgets(): array
    {
        return [
            StatWidget::make('drafts', 'Drafts')
                ->value(static fn (): int => Article::query()->where('status', 'draft')->count()),
        ];
    }

    /**
     * A CHILD TABLE ON THE RECORD PAGE.
     *
     * `relations()` is the declared allowlist the relation endpoint checks a
     * URL segment against - the segment is caller-supplied, so an endpoint
     * that loaded any named relation would let a URL walk this model's
     * relationship graph.
     *
     * @return list<RelationManager>
     */
    public static function relations(): array
    {
        return [
            RelationManager::make('comments', 'Comments')
                ->related(Comment::class, 'comments.article_id')
                ->resource(CommentResource::class)
                ->table(fn (Table $table): Table => $table
                    ->columns([
                        TextColumn::make('body')->from('comments.body')->sortable(),
                        // Sortable, because it is the default sort - the same
                        // refusal the parent table taught: `ListQuery` will not
                        // accept a default that is not in the allowlist.
                        DateColumn::make('created_at')->from('comments.created_at')->sortable()->withTime(),
                    ])
                    ->keyColumn('comments.id')
                    ->alsoSelect(['comments.id'])),
            RelationManager::make('tags', 'Tags')
                ->resource(TagResource::class)
                ->table(fn (Table $table): Table => $table
                    ->columns([
                        TextColumn::make('name')->from('tags.name')->sortable(),
                        DateColumn::make('created_at')->from('tags.created_at')->sortable()->withTime(),
                    ])
                    ->keyColumn('tags.id')
                    ->alsoSelect(['tags.id'])),
        ];
    }

    public static function workflow(): Workflow
    {
        return Workflow::make('status')
            ->model(Article::class)
            ->states([
                'draft' => ['label' => 'Draft', 'color' => 'neutral'],
                'published' => ['label' => 'Published', 'color' => 'success'],
                'archived' => ['label' => 'Archived', 'color' => 'warning'],
            ])
            ->transitions([
                Transition::make('publish', 'Publish')
                    ->from(['draft'])
                    ->to('published')
                    ->authorize('update'),
                Transition::make('archive', 'Archive')
                    ->from(['draft', 'published'])
                    ->to('archived')
                    ->authorize('update'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')->from('articles.title')->sortable()->searchable(),
                /*
                 * EDITABLE, so the inline-cell endpoint has something it is
                 * ALLOWED to write - and `title` above stays non-editable so
                 * the same endpoint has something it must REFUSE. One of each
                 * is what makes that guard assertable.
                 *
                 * Searchable too, so a term can be asserted to match words
                 * spread across DIFFERENT columns rather than only within one.
                 */
                SelectColumn::make('status')
                    ->from('articles.status')
                    ->options(['draft' => 'Draft', 'published' => 'Published', 'archived' => 'Archived'])
                    ->sortable()
                    ->searchable(),
                /*
                 * A SECOND EDITABLE COLUMN, of the free-text kind - so the
                 * inline-cell endpoint's per-column `castValue()` dispatch is
                 * exercised for `TextInputColumn` too, not only `SelectColumn`.
                 */
                TextInputColumn::make('slug')
                    ->from('articles.slug')
                    ->rules(['nullable', 'max:20', 'alpha_dash']),
                /*
                 * A DISPLAY BADGE next to the writable select, so the cell
                 * endpoint can be asserted to refuse a pill that was never
                 * opted into a resolver.
                 */
                BadgeColumn::make('kind')
                    ->from('articles.status')
                    ->colors([
                        'draft' => 'neutral',
                        'published' => 'success',
                        'archived' => 'warning',
                    ]),
                BadgeColumn::make('workflow')
                    ->from('articles.status')
                    ->colors([
                        'draft' => 'neutral',
                        'published' => 'success',
                        'archived' => 'warning',
                    ])
                    ->resolver(),
                DateColumn::make('created_at')->from('articles.created_at')->sortable()->withTime(),
                /*
                 * SAME COLUMN AS `MoneyField::make('price')` above and
                 * `MoneyEntry::make('price')` in `infolist()` - see the
                 * field's own comment for why all three read one column.
                 */
                MoneyColumn::make('price')->from('articles.price')->currency('USD'),
            ])
            /*
             * A DECLARED FILTER, which is the allowlist the query string is
             * checked against. Anything not declared here must be ignored
             * rather than applied - otherwise a query parameter is a WHERE
             * clause the resource never offered.
             */
            ->filters([
                SelectFilter::make('status')
                    ->column('articles.status')
                    ->options(['draft', 'published', 'archived']),
            ])
            /*
             * THE JOIN `infolist()`'s `tenant_name` entry reads through - see
             * that entry's own comment. Declared once here, the same as a
             * List column's join would be; `ResourceController::show()`
             * applies it for the View page too, only the SELECTED VALUES
             * differ between the two screens.
             */
            ->query(static fn ($query) => $query->leftJoin('tenants', 'tenants.id', '=', 'articles.tenant_id'))
            ->keyColumn('articles.id')
            /*
             * DECLARED ACTIONS, because the endpoint only runs what the
             * resource offered - that refusal is the property under test, and
             * it cannot be asserted against a resource that declares none.
             */
            ->recordActions([
                RecordAction::make('publish', 'Publish')
                    ->authorize('update')
                    ->transitionTo('published', 'status', Article::class),

                RecordAction::make('archive', 'Archive')
                    ->authorize('update')
                    ->transitionTo('archived', 'status', Article::class),

                RecordAction::make('publish-wizard', 'Publish with steps')
                    ->authorize('update')
                    ->steps([
                        ActionStep::make('Details', 'details')
                            ->submitLabel('Continue')
                            ->form(static function (Form $form): Form {
                                return $form->schema([
                                    TextField::make('reason')
                                        ->required()
                                        ->rule('max:120'),
                                ]);
                            })
                            ->onExecute(static function (Article $article, array $data): array {
                                $reason = trim((string) ($data['reason'] ?? ''));

                                return ['reason' => $reason];
                            }),
                        ActionStep::make('Confirm', 'confirm')
                            ->describe('Confirm the change')
                            ->submitLabel('Publish')
                            ->form(static function (Form $form): Form {
                                return $form->schema([
                                    CheckboxField::make('confirm')->rule('accepted'),
                                ]);
                            })
                            ->onExecute(static function (Article $article, array $data): array {
                                return ['confirmed' => true];
                            }),
                    ])
                    ->handle(static function (Article $article, array $data): array {
                        $custom = $article->custom ?? [];
                        $custom['reason'] = $data['reason'] ?? null;
                        $custom['confirmed'] = $data['confirmed'] ?? null;

                        $article->forceFill([
                            'status' => 'published',
                            'custom' => $custom,
                        ])->save();

                        return [
                            'reason' => $data['reason'] ?? null,
                            'confirmed' => $data['confirmed'] ?? null,
                        ];
                    }),
            ])
            ->bulkActions([
                BulkAction::make('publish', 'Publish')
                    ->authorize('update')
                    ->mutate(['status' => 'published']),
            ]);
    }
}
