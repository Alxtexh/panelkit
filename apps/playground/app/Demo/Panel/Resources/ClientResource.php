<?php

declare(strict_types=1);

namespace App\Demo\Panel\Resources;

use App\Demo\Models\Client;
use App\Demo\Models\ClientSession;
use App\Models\Plan;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Alxtexh\Panel\Actions\ActionGroup;
use Alxtexh\Panel\Actions\BulkAction;
use Alxtexh\Panel\Actions\ModalFooterAction;
use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\Actions\ReplicateAction;
use Alxtexh\Panel\Forms\Fields\DateField;
use Alxtexh\Panel\Forms\Fields\FileUploadField;
use Alxtexh\Panel\Forms\Fields\KeyValueField;
use Alxtexh\Panel\Forms\Fields\MultiSelectField;
use Alxtexh\Panel\Forms\Fields\RadioField;
use Alxtexh\Panel\Forms\Fields\RepeaterField;
use Alxtexh\Panel\Forms\Fields\RichEditorField;
use Alxtexh\Panel\Forms\Fields\SelectField;
use Alxtexh\Panel\Forms\Fields\TextareaField;
use Alxtexh\Panel\Forms\Fields\TextField;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Forms\Rules\ExistsInScope;
use Alxtexh\Panel\Resources\RelationManager;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Schema\Callout;
use Alxtexh\Panel\Schema\Fieldset;
use Alxtexh\Panel\Schema\Section;
use Alxtexh\Panel\Schema\Tab;
use Alxtexh\Panel\Schema\Tabs;
use Alxtexh\Panel\Tables\Columns\BadgeColumn;
use Alxtexh\Panel\Tables\Columns\DateColumn;
use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Filters\DateRangeFilter;
use Alxtexh\Panel\Tables\Filters\MultiSelectFilter;
use Alxtexh\Panel\Tables\Filters\SelectFilter;
use Alxtexh\Panel\Tables\Table;
use Alxtexh\Panel\Widgets\StatWidget;

/**
 * PHASE 4 - the whole Clients screen. No Vue.
 *
 * Colours are SEMANTIC (`success`, `danger`), never CSS classes. Vue decides
 * what those look like; a class string authored here would be invisible to the
 * CSS scanner and silently purged (antipatterns §6.1).
 */
final class ClientResource extends Resource
{
    /**
     * TWO COUNTS ABOVE THE SUBSCRIBER LIST.
     *
     * THE WORKED EXAMPLE FOR `Resource::headerWidgets()`, and it exists partly
     * to BE one: a feature with no consumer in the reference app is a feature
     * nobody has looked at, which is the failure shape this codebase has paid
     * for repeatedly. The row is also genuinely useful here - "how many are
     * expired" is the first question anybody opening this screen asks, and the
     * alternative was reading it off the dashboard and navigating back.
     *
     * THE COUNTS ARE SCOPED BY THE TENANT SCOPE, not by a `where` written here.
     * `Client` carries it, so these are this organisation's subscribers exactly
     * as the list below them is - and a count that disagreed with the list it
     * sits above would be worse than no count.
     *
     * DEFERRED BY `WidgetSet`, so a COUNT over a quarter of a million rows does
     * not sit in front of the ten on screen. Same rule as the dashboard, from
     * the same place.
     *
     * @return list<StatWidget>
     */
    public static function headerWidgets(): array
    {
        return [
            StatWidget::make('clients_active', 'Active')
                ->description('Subscribers in good standing')
                ->value(static fn (): int => Client::query()->where('status', 'active')->count()),

            StatWidget::make('clients_expired', 'Expired')
                ->description('Past their expiry date')
                ->value(static fn (): int => Client::query()->where('status', 'expired')->count()),
        ];
    }

    /**
     * ONE COUNT BELOW THE LIST - the worked example for
     * `Resource::footerWidgets()`, same reasoning as the header pair above.
     * Suspended sits here rather than beside Active/Expired: it is the
     * status somebody put there deliberately rather than one time passed,
     * and reads as a closing note on the list rather than a headline count.
     *
     * @return list<StatWidget>
     */
    public static function footerWidgets(): array
    {
        return [
            StatWidget::make('clients_suspended', 'Suspended')
                ->description('Held by an operator, not by expiry')
                ->value(static fn (): int => Client::query()->where('status', 'suspended')->count()),
        ];
    }

    protected static string $model = Client::class;

    protected static string $icon = 'users';

    protected static ?string $purpose = 'Every subscriber on the network, and the plan and status each one has.';

    /**
     * THE ONE PLAYGROUND SCREEN THAT TAKES A SPREADSHEET.
     *
     * Import is opt-in on `Resource`. Subscribers are the case the wizard was
     * built for - a migration of accounts, not a button that appears because
     * this resource happens to have a form.
     */
    public static function importable(): bool
    {
        return true;
    }

    protected static ?string $group = 'Subscribers';

    protected static ?int $sort = 10;

    /**
     * The write form.
     *
     * `tenant_id` is deliberately absent and cannot be added: it is set from
     * the request context, and a form field for it would be a way to move a
     * record into another tenant. sanitize() drops anything not listed here, so
     * mass assignment is closed by construction rather than by remembering a
     * $fillable list.
     */
    /**
     * FIRST IN THE PALETTE. A person is what somebody types a name to find,
     * and the first group is the one arrow-down lands in and Enter opens.
     */
    public static function searchSort(): int
    {
        return -10;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            // The worked example for Tabs::persistInQueryString() - a long
            // edit form somebody switches away from mid-tab and back to
            // (a copy-pasted access code, a phone call) should not reopen
            // on Identity every time.
            Tabs::make()->persistInQueryString('tab')->tabs([
                Tab::make('Identity')->schema([
                    Section::make('Contact')->columns(2)->schema([
                        TextField::make('name')->required()->placeholder('Full name'),
                        TextField::make('phone')->required()->as('tel')->placeholder('+2547...'),
                    ]),
                    Section::make('Access')->description('How this subscriber authenticates.')
                        ->columns(2)->schema([
                            /*
                             * A CONSUMER FOR THE LAYOUT COMPONENTS SHIPPED IN
                             * 0.9.5, which had none.
                             *
                             * `Fieldset` and `Callout` were exported,
                             * unit-tested and declared by no screen anywhere -
                             * the state `MoneyColumn` was in when its
                             * record-page bug survived 1,700 green tests. A
                             * type nobody declares is a type nobody has seen
                             * render.
                             *
                             * A FIELDSET RATHER THAN A NESTED SECTION: a
                             * section inside a section is a card inside a card,
                             * which reads as two things when it is one thing
                             * with a part named. The <legend> also means a
                             * screen reader announces "Access notes, Reason"
                             * rather than "Reason".
                             *
                             * `CheckboxField` AND `HiddenField` ARE NOT HERE,
                             * deliberately. Both submit a value, and every
                             * column on this table is NOT NULL with no default
                             * - so either would need a column invented for it,
                             * and inventing one in the reference app purely to
                             * prove a type renders is worse than saying it has
                             * no consumer yet. A non-column field needs a
                             * subclass overriding `omitsFromStorage()`; that is
                             * the honest way to add one, and it is work rather
                             * than a line.
                             */
                            Fieldset::make('Access notes')->columns(1)->schema([
                                Callout::warning(
                                    'Changing the access code disconnects the subscriber '
                                    .'until their device is reconfigured.'
                                )->title('This takes effect at once'),
                            ]),
                            TextField::make('access_code')->required()->max(32)
                                ->help('Unique within your organisation.'),
                            SelectField::make('status')->required()->options([
                                'active' => 'Active',
                                'expired' => 'Expired',
                                'suspended' => 'Suspended',
                            ]),
                        ]),

                    /*
                     * A REPEATER, not a table, and the reason is worth stating
                     * where somebody will read it before copying the pattern.
                     *
                     * These numbers are always read with the client and never
                     * queried on their own - nobody searches by "the wife's
                     * number". A table would mean a join on every client read
                     * for rows nothing ever filters. The day somebody asks how
                     * many clients have a secondary contact, this becomes a
                     * relation manager and a migration.
                     */
                    Section::make('Other contacts')
                        ->description('Numbers to try when the main one does not answer.')
                        ->collapsible(collapsed: true)
                        ->schema([
                            RepeaterField::make('contacts')
                                ->label('Contacts')
                                ->itemLabel('Contact')
                                ->maxItems(5)
                                // Two numbers for the same person - a
                                // landline and a mobile - are the common
                                // repeat here; starting from a copy beats
                                // retyping the name and relation.
                                ->cloneable()
                                // Three short fields read as one glance
                                // across a row; stacked, each wraps to its
                                // own line for no benefit.
                                ->table()
                                ->schema([
                                    TextField::make('name')->label('Name')->max(80),
                                    TextField::make('phone')->label('Phone')->as('tel')->max(32),
                                    SelectField::make('relation')->label('Relation')->options([
                                        'family' => 'Family',
                                        'work' => 'Work',
                                        'neighbour' => 'Neighbour',
                                        'other' => 'Other',
                                    ]),
                                ]),
                        ]),
                ]),

                Tab::make('Service')->schema([
                    Section::make('Plan')->columns(2)->schema([
                        /*
                         * A RADIO GROUP, not a dropdown, and the difference is
                         * whether reading the options is part of the decision.
                         * There are three, they are short, and which one a
                         * subscriber is on changes how the connection is set up
                         * - hiding them behind a click makes somebody open the
                         * control just to learn what the question is.
                         *
                         * It validates identically: `Rule::in` over the same
                         * declared options, server-side.
                         */
                        RadioField::make('plan_type')->label('Plan type')->required()->inline()->options([
                            'pppoe' => 'PPPoE',
                            'hotspot' => 'Hotspot',
                            'static' => 'Static',
                        ]),
                        // A CLOSURE. Resolved when the form data is assembled,
                        // never while building the cached schema, and
                        // tenant-scoped by the model's global scope.
                        // SEARCHABLE. Plans is small today, but a picker that
                        // renders every option inline stops working the moment
                        // it points at anything that grows - and `exists` is a
                        // stronger check than an in: list built from whatever
                        // the last search happened to return.
                        SelectField::make('plan_id')->label('Plan')
                            ->searchable(fn (string $term): array => Plan::query()
                                ->when($term !== '', fn ($q) => $q->where('name', 'like', $term.'%'))
                                ->orderBy('name')->limit(25)->pluck('name', 'id')->all())
                            // NOT exists:plans,id - that queries the raw table
                            // and confirms another tenant's row. This asks the
                            // model, so the tenant global scope applies.
                            ->rule(ExistsInScope::of(Plan::class)),
                    ]),
                    Section::make('Documents')->collapsible(collapsed: true)->schema([
                        // Uploaded to its own endpoint before the form is
                        // submitted, so a validation error elsewhere on this
                        // form never empties it. The accepted types are checked
                        // against the file's BYTES on the way in, not against
                        // the name or the Content-Type the browser claimed.
                        FileUploadField::make('id_document')->label('ID scan')
                            ->accept(['jpg', 'jpeg', 'png', 'webp', 'pdf'])
                            ->maxKilobytes(4096)
                            ->directory('id-documents')
                            ->help('A photo or scan of the subscriber\'s national ID. Stored privately.'),
                    ]),
                    Section::make('Billing')->collapsible(collapsed: true)->schema([
                        DateField::make('expiry_date')->label('Expires'),
                        // Several values from a short fixed list - the option
                        // list is also the validation rule, and it is enforced
                        // on each MEMBER rather than on the array.
                        MultiSelectField::make('reminder_days')->label('Reminder times')
                            ->placeholder('No reminders')
                            ->help('When to warn this subscriber before their subscription lapses.')
                            ->options([
                                0 => 'At expiry',
                                1 => '1 day before',
                                2 => '2 days before',
                                3 => '3 days before',
                                4 => '4 days before',
                                5 => '5 days before',
                                7 => '7 days before',
                                14 => '14 days before',
                                30 => '30 days before',
                            ]),
                    ]),

                    /*
                     * The escape hatch, and the honest name for it - NOT the
                     * same thing roadmap 5.1's custom fields are. This is
                     * unstructured, per-record, per-key: the operator makes
                     * up a key on the spot, for a one-off note this record
                     * needs and no other one will. A 5.1 custom field is the
                     * opposite - a structured, typed, installation-wide
                     * column ("every client has a Fibre node ID") that
                     * `Resource::customFields()` appends its own labelled
                     * section for, below - which is why this one is named
                     * "Free-form fields" rather than sharing that heading.
                     *
                     * `tenant_id` and `id` are reserved because this blob sits
                     * on the same model as real columns, and code that merges
                     * metadata into an attribute array would otherwise overwrite
                     * the thing identifying the row.
                     */
                    Section::make('Free-form fields')
                        ->description('Anything your process needs that the form above does not cover.')
                        ->collapsible(collapsed: true)
                        ->schema([
                            KeyValueField::make('metadata')
                                ->label('Free-form fields')
                                ->labels('Field', 'Value')
                                ->maxPairs(20)
                                ->reserved(['id', 'tenant_id', 'access_code'])
                                ->help('Letters, numbers, underscores and dashes in field names.'),
                        ]),

                    /*
                     * The one field that stores markup, and therefore the one
                     * that has to be sanitised rather than merely validated.
                     * Whatever the browser produced is parsed against an
                     * allowlist server-side; the toolbar below is a convenience
                     * for whoever is typing, not a constraint on what arrives.
                     */
                    Section::make('Notes')
                        ->description('Anything worth knowing about this subscriber.')
                        ->collapsible(collapsed: true)
                        ->schema([
                            RichEditorField::make('notes')
                                ->label('Notes')
                                ->toolbar(['bold', 'italic', 'heading', 'list', 'link', 'quote'])
                                ->maxLength(20000)
                                ->placeholder('Installation quirks, access instructions, history…'),
                        ]),
                ]),
            ]),
        ]);
    }

    /**
     * The VIEW page layout. Leaves are the same Column objects the table uses,
     * so a value cannot render one way in the list and another here.
     */
    public static function infolist(): array
    {
        return [
            Tabs::make()->tabs([
                Tab::make('Overview')->schema([
                    Section::make('Identity')->columns(2)->schema([
                        TextColumn::make('name'),
                        TextColumn::make('phone'),
                        TextColumn::make('access_code')->label('Access code')->mono(),
                        BadgeColumn::make('status')->colors([
                            'active' => 'success',
                            'expired' => 'danger',
                            'suspended' => 'warning',
                        ]),
                    ]),
                ]),

                Tab::make('Service')->schema([
                    Section::make('Plan')->columns(2)->schema([
                        TextColumn::make('plan_name')->label('Plan'),
                        TextColumn::make('plan_type')->label('Type')->transform('upper'),
                        DateColumn::make('expiry_date')->label('Expires'),
                        DateColumn::make('created_at')->label('Created')->withTime(),
                    ]),
                ]),
            ]),
        ];
    }

    /**
     * A client's sessions, on the client's own page.
     *
     * FETCHED ON DEMAND, NOT EAGER-LOADED. At 5M sessions a busy client has
     * thousands, and `$client->load('sessions')` would read every one to render
     * the ten a person looks at. This runs the same keyset-paginated ListQuery
     * the main tables use, bounded to a page.
     *
     * @return list<RelationManager>
     */
    public static function relations(): array
    {
        return [
            RelationManager::make('sessions', 'Sessions')
                ->related(ClientSession::class, 'client_sessions.client_id')
                ->icon('activity')
                ->table(fn (Table $table): Table => $table
                    ->columns([
                        DateColumn::make('started_at')->label('Started')->withTime()->sortable(),
                        DateColumn::make('ended_at')->label('Ended')->withTime(),
                        BadgeColumn::make('status')->colors([
                            'online' => 'success',
                            'offline' => 'neutral',
                        ]),
                        TextColumn::make('ip_address')->label('IP')->mono(),
                        TextColumn::make('bytes_in')->label('In')->muted(),
                        TextColumn::make('bytes_out')->label('Out')->muted(),
                    ])
                    ->filters([
                        SelectFilter::make('status')->column('client_sessions.status')
                            ->options(['online', 'offline']),
                    ])
                    ->keyColumn('client_sessions.id')
                    ->alsoSelect(['client_sessions.id'])
                    ->defaultSort('started_at', 'desc')),
        ];
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->from('clients.name')->sortable()->searchable()->locked(),
                TextColumn::make('access_code')->from('clients.access_code')->searchable()->copyable()->mono(),
                TextColumn::make('phone')->from('clients.phone')->searchable()->copyable()->muted(),
                /*
                 | A BADGE, not an editable select.
                 |
                 | SelectColumn exists and works, but putting it on `status` put
                 | a form control in every row of the busiest column in the
                 | panel: a list is a READING surface first, and a wall of
                 | dropdowns is harder to scan than a wall of coloured badges -
                 | the value stops being something you take in at a glance and
                 | becomes something you have to read out of a widget.
                 |
                 | Changing many statuses at once is what the bulk actions are
                 | for, and changing one is what the row menu is for.
                 */
                BadgeColumn::make('status')->from('clients.status')->sortable()->colors([
                    'active' => 'success',
                    'expired' => 'danger',
                    'suspended' => 'warning',
                ]),
                TextColumn::make('plan_name')->from('plans.name as plan_name')->label('Plan'),
                TextColumn::make('plan_type')->from('clients.plan_type')->label('Type')->transform('upper')->muted(),
                DateColumn::make('expiry_date')->from('clients.expiry_date')->label('Expires')->sortable(),
                DateColumn::make('created_at')->from('clients.created_at')->sortable()->muted(),
            ])
            ->filters([
                // Multiple at once: "everything that is not healthy" was not
                // expressible with a single-select filter.
                MultiSelectFilter::make('status')->column('clients.status')
                    ->options(['active', 'expired', 'suspended']),
                SelectFilter::make('planType')->label('Plan type')->column('clients.plan_type')
                    ->options(['pppoe', 'hotspot', 'static']),
                // The question a billing panel is actually asked.
                DateRangeFilter::make('expiring')->label('Expiry')->column('clients.expiry_date'),
            ])
            /*
             | Bulk actions.
             |
             | The MUTATION IS DECLARED HERE, server-side. The browser posts
             | `{action: 'suspend'}` and nothing else - it cannot describe an
             | attribute set, so this endpoint can never become a way to write
             | an arbitrary column on rows the operator merely happens to be
             | able to see.
             |
             | Each one is a single UPDATE per chunk, so suspending 60,000
             | expired clients is sixty queries rather than sixty thousand.
             */
            /*
             * The row menu, declared here rather than hardcoded in a Vue file.
             *
             * View and Edit are record actions too - keeping them in the same
             * list is what lets this resource reorder or drop them without
             * anyone editing a template.
             */
            /*
             * NOT GROUPED, and the reason is measured rather than aesthetic.
             *
             * Grouping makes the group column the PRIMARY sort, so the
             * effective order becomes `(status, <chosen sort>, id)`. There is an
             * index for `(tenant, deleted_at, status, created_at, id)`, so
             * grouping plus the default sort is free - 0.2 ms on a million rows.
             * But sorting by anything else while grouped needs an index that
             * does not exist, and the panel falls back to sorting the whole
             * filtered set: sort-by-expiry went from 6 ms to 537 ms, and the
             * performance budget caught it.
             *
             * Making that fast means one composite index per sortable column,
             * which is real write cost and storage on the largest table here -
             * a trade worth making deliberately, for a table where grouping
             * earns it, not by default because the feature exists.
             *
             * Routers is grouped instead: same capability, twenty rows, no
             * index bill. See `RouterResource`.
             */
            /*
             * THE WHOLE ROW OPENS THE SUBSCRIBER, because this is a list people
             * BROWSE - find someone, look at them, come back - and on that job
             * a menu between every glance is the friction.
             *
             * Not every table earns it: the audit log and the invoice lines are
             * read in place, and there a clickable row turns selecting a figure
             * into a navigation. It is declared per resource for that reason.
             */
            ->rowClick('view')
            ->recordActions([
                /*
                 * View and Edit lead the menu, because ORDER IS THE ONLY
                 * PROMOTION LEFT.
                 *
                 * They used to render as icon buttons in the row as well as in
                 * the menu, which put the same two controls on screen twice.
                 * Every action now appears exactly once, so being first is how
                 * the resource says "this is the one run all day" - see
                 * RecordActions.vue for why that trade was taken.
                 */
                RecordAction::make('view', 'View')
                    ->icon('eye')
                    ->color('primary')
                    ->authorize('view')
                    ->link(fn (array $row): string => '/clients/'.$row['id']),

                RecordAction::make('edit', 'Edit')
                    ->icon('pencil')
                    ->color('primary')
                    ->authorize('update')
                    ->link(fn (array $row): string => '/clients/'.$row['id'].'/edit'),

                // The nested sessions screen - roadmap 4.2. The record page's
                // Sessions tab is the glance; this is the whole history, with
                // tabs, filters and a URL that can be pasted into a ticket.
                RecordAction::make('sessions', 'Sessions')
                    ->icon('activity')
                    ->authorize('view')
                    ->link(fn (array $row): string => '/clients/'.$row['id'].'/sessions'),

                /*
                 * A FORM ACTION - roadmap D, and the first real one.
                 *
                 * Moving a subscriber to a different plan is the shape most row
                 * actions in a billing panel actually have: it needs a value
                 * from the operator before it can do anything. Before
                 * `->form()` this was a dedicated screen, or an edit page visit
                 * to change one field.
                 *
                 * THE OPTIONS ARE SEARCHED, NOT LISTED, because a reseller with
                 * two hundred plans should not ship two hundred options to
                 * every row menu on the page. The same field the record form
                 * uses, declared the same way.
                 *
                 * `ExistsInScope`, NOT `exists:plans,id`. The raw rule queries
                 * the table and would confirm the existence of another
                 * organisation's plan; this asks the MODEL, so the tenant
                 * global scope applies and a foreign id is simply invalid.
                 */
                RecordAction::make('change-plan', 'Change plan')
                    ->icon('package')
                    ->authorize('update')
                    // The worked example for RecordAction::extraModalFooterActions() -
                    // "which plans exist and what they cost" is the thing
                    // somebody picking a new one usually wants beside them,
                    // not a second field crammed into this form.
                    ->extraModalFooterActions([
                        ModalFooterAction::make('View all plans')->url('/plans')->color('info'),
                    ])
                    ->form(fn (Form $form): Form => $form->schema([
                        SelectField::make('plan_id')->label('New plan')
                            ->required()
                            ->searchable(fn (string $term): array => Plan::query()
                                ->when($term !== '', fn ($q) => $q->where('name', 'like', $term.'%'))
                                ->orderBy('name')->limit(25)->pluck('name', 'id')->all())
                            ->rule(ExistsInScope::of(Plan::class)),

                        TextareaField::make('note')->label('Why')
                            ->rows(2)
                            ->rule('max:280')
                            ->help('Recorded on the subscriber\'s activity log.'),
                    ]))
                    ->handle(function (Client $client, array $data): void {
                        $client->forceFill(['plan_id' => $data['plan_id']])->save();
                    }),

                ActionGroup::make('Status')->actions([
                    RecordAction::make('suspend', 'Suspend')
                        ->icon('pause')
                        ->color('warning')
                        ->authorize('update')
                        ->mutate(['status' => 'suspended'])
                        ->confirm('Suspend this subscriber? Their connection stops immediately.')
                        // Hidden on rows that are already suspended: an action
                        // that does nothing is worse than one that is absent.
                        ->visible(fn (array $row): bool => ($row['status'] ?? null) !== 'suspended'),

                    RecordAction::make('activate', 'Activate')
                        ->icon('check')
                        ->color('success')
                        ->authorize('update')
                        ->mutate(['status' => 'active'])
                        ->visible(fn (array $row): bool => ($row['status'] ?? null) !== 'active'),
                ]),

                ActionGroup::make('Manage')->actions([
                    // A duplicate is a CREATE, and ReplicateAction is what makes
                    // sure it is authorized as one.
                    ReplicateAction::make()
                        ->label('Duplicate')
                        // Unique in the tenant, so it cannot be copied.
                        ->except(['access_code'])
                        ->then(function ($copy, $original): void {
                            $copy->name = 'Copy of '.$original->name;
                            $copy->access_code = 'AC-'.strtoupper(bin2hex(random_bytes(4)));
                            // A copy starts fresh rather than inheriting a
                            // subscription somebody already paid for.
                            $copy->status = 'suspended';
                            $copy->expiry_date = null;
                        })
                        ->confirm('Create a copy of this subscriber?')
                        ->toAction(),
                ]),
            ])
            ->bulkActions([
                BulkAction::make('activate', 'Activate')
                    ->icon('check')
                    ->color('success')
                    ->authorize('update')
                    ->mutate(['status' => 'active']),

                /*
                 * A BULK FORM ACTION - the shape most selection actions have.
                 *
                 * Moving forty subscribers to a plan is one decision applied
                 * forty times, not forty decisions: the value is collected ONCE
                 * and reused for every chunk the runner walks. Before `->form()`
                 * this was a mutation with the plan hardcoded per action, or a
                 * screen.
                 */
                BulkAction::make('move-plan', 'Move to plan')
                    ->icon('package')
                    ->authorize('update')
                    ->form(fn (Form $form): Form => $form->schema([
                        SelectField::make('plan_id')->label('New plan')
                            ->required()
                            ->searchable(fn (string $term): array => Plan::query()
                                ->when($term !== '', fn ($q) => $q->where('name', 'like', $term.'%'))
                                ->orderBy('name')->limit(25)->pluck('name', 'id')->all())
                            ->rule(ExistsInScope::of(Plan::class)),
                    ]))
                    ->handle(function ($records, array $data): void {
                        foreach ($records as $client) {
                            $client->forceFill(['plan_id' => $data['plan_id']])->save();
                        }
                    }),

                BulkAction::make('suspend', 'Suspend')
                    ->icon('pause')
                    ->color('warning')
                    ->authorize('update')
                    ->requiresConfirmation('Suspend the selected clients? They will lose access immediately.')
                    ->mutate(['status' => 'suspended']),

                BulkAction::make('restore', 'Restore')
                    ->icon('undo')
                    ->color('info')
                    ->authorize('restore')
                    // A soft delete is a column, so restoring many is one
                    // UPDATE per chunk like any other bulk mutation.
                    ->mutate(['deleted_at' => null]),

                BulkAction::make('delete', 'Delete')
                    ->icon('trash')
                    ->destructive()
                    ->authorize('delete')
                    ->authorizeIndividualRecords()
                    // A handler rather than a mutation: deleting through the
                    // models fires the events any listener depends on, which a
                    // bare DELETE would skip silently.
                    ->handle(fn (Collection $records) => $records->each->delete()),
            ])
            // ONE grouped query for every tab count (addendum C1).
            ->tabs('clients.status', ['active', 'expired', 'suspended'])
            // A closure, never executed while building the schema.
            ->query(fn (Builder $q) => $q->leftJoin('plans', 'plans.id', '=', 'clients.plan_id'))
            ->keyColumn('clients.id')
            ->alsoSelect(['clients.id'])
            ->defaultSort('created_at', 'desc');
    }
}
