<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Ticketing;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\Forms\Fields\SelectField;
use Alxtexh\Panel\Forms\Fields\TextField;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Forms\Rules\ExistsInScope;
use Alxtexh\Panel\Comments\Comments;
use Alxtexh\Panel\Models\Ticket;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Columns\BadgeColumn;
use Alxtexh\Panel\Tables\Columns\DateColumn;
use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Filters\SelectFilter;
use Alxtexh\Panel\Tables\Table;
use Alxtexh\Panel\Workflow\Transition;
use Alxtexh\Panel\Workflow\Workflow;

/**
 * THE QUEUE - the operator's end of a ticket, roadmap 6.3.
 *
 * The counterpart is `MyTicketResource`, and the pair is the point: one model,
 * one policy, two screens that differ in what they show and what they let you
 * do. This one lists the WHOLE ORGANISATION'S tickets, which is what a support
 * rota needs and what `view_any_tickets` grants. The other lists the signed-in
 * person's own, and grants nothing because being the person who asked is the
 * entitlement.
 *
 * WHAT ONLY THIS SIDE HAS: assignment and resolution. Both are operator
 * judgements - who picks this up, and whether the problem is actually fixed -
 * and `TicketPolicy` refuses them to an opener however the request arrives, so
 * the absence of the controls here is a courtesy rather than the enforcement.
 *
 * NO DELETE ACTION ON THE ROW, deliberately, even for somebody holding
 * `delete_tickets`. Deleting a ticket destroys the record of a complaint, and
 * the one-click affordance for that does not belong beside Resolve, which is
 * the button people are reaching for.
 */
final class TicketResource extends Resource
{
    /**
     * The application's user model, asked rather than named.
     *
     * The assignee picker lists operators and the rule checks one exists in
     * scope; both need the class, and a package importing `App\Models\User`
     * would fatal in every application that calls it something else.
     *
     * @return class-string<Model>
     */
    private static function userModel(): string
    {
        $model = config('auth.providers.users.model');

        return is_string($model) && is_subclass_of($model, Model::class) ? $model : Model::class;
    }

    protected static string $model = Ticket::class;

    protected static string $icon = 'mail';

    protected static ?string $purpose = 'Everything this organisation has been asked, oldest unresolved first.';

    protected static ?string $group = 'Organisation';

    protected static ?int $sort = 20;

    public static function key(): string
    {
        return 'tickets';
    }

    public static function label(): string
    {
        return 'Ticket';
    }

    /**
     * NO IMPORT. A queue is filled by people asking for help, not by an
     * operator uploading a spreadsheet of complaints - see
     * `Resource::importable()`. Import is opt-in; this override keeps the
     * queue closed even if a later default change tries to reopen it.
     */
    public static function importable(): bool
    {
        return false;
    }

    public static function workflow(): Workflow
    {
        return Workflow::make('status')
            ->model(Ticket::class)
            ->group('Status')
            ->states([
                Ticket::OPEN => ['label' => 'Open', 'color' => 'warning'],
                Ticket::PENDING => ['label' => 'Waiting on the customer', 'color' => 'neutral'],
                Ticket::RESOLVED => ['label' => 'Resolved', 'color' => 'success'],
            ])
            ->transitions([
                Transition::make('resolve', 'Mark resolved')
                    ->from([Ticket::OPEN, Ticket::PENDING])
                    ->to(Ticket::RESOLVED)
                    ->authorize('resolve')
                    ->icon('check')
                    ->color('success')
                    ->confirm('Mark this ticket resolved? It stops accepting replies.'),

                Transition::make('waiting', 'Waiting on customer')
                    ->from([Ticket::OPEN])
                    ->to(Ticket::PENDING)
                    ->authorize('resolve')
                    ->icon('clock'),

                Transition::make('reopen', 'Reopen')
                    ->from([Ticket::RESOLVED])
                    ->to(Ticket::OPEN)
                    ->authorize('resolve')
                    ->icon('refresh')
                    ->color('warning'),
            ]);
    }

    public static function comments(): Comments
    {
        return Comments::make()->label('Internal notes');
    }

    public static function form(Form $form): Form
    {
        return $form->columns(2)->schema([
            TextField::make('subject')->required(),

            SelectField::make('status')->required()
                ->options([
                    Ticket::OPEN => 'Open',
                    Ticket::PENDING => 'Waiting on the customer',
                    Ticket::RESOLVED => 'Resolved',
                ]),

            SelectField::make('priority')->required()
                ->options(['low' => 'Low', 'normal' => 'Normal', 'urgent' => 'Urgent']),

            /*
             * WHICH DESK, and it is not required. "Not triaged yet" is a real
             * state a queue has to be able to show - forcing a choice at the
             * moment a ticket is filed means whoever files it guesses, and a
             * ticket in the wrong queue is worse than one in no queue, because
             * the wrong queue looks handled.
             */
            SelectField::make('department')->label('Desk')
                ->options((array) config('panel.ticketing.departments', [])),

            /*
             * WHO IS HANDLING IT. Nullable on purpose - unassigned is the
             * normal state of a new ticket, and a queue that cannot express it
             * is a queue that lies about its backlog.
             *
             * `ExistsInScope`, NOT `exists:users,id`: the raw rule queries the
             * table and would happily confirm another organisation's operator,
             * which is a way to assign this ticket outside the tenant.
             */
            SelectField::make('assigned_to')->label('Assigned to')
                ->searchable(fn (string $term): array => self::userModel()::query()
                    ->when($term !== '', fn ($q) => $q->where('name', 'like', $term.'%'))
                    ->orderBy('name')->limit(25)->pluck('name', 'id')->all())
                ->rule(ExistsInScope::of(self::userModel())),
        ]);

        /*
         * `opened_by` IS NOT A FIELD, on either side. It is stamped from the
         * signed-in user when the row is created - see the model - because a
         * form field for it is a way to file a complaint under somebody else's
         * name, and the "read your own" half of the policy is built on it.
         */
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('subject')->from('tickets.subject')
                    ->sortable()->searchable()->locked(),

                /*
                 * NEW, COMPUTED IN THE QUERY rather than per row in PHP.
                 *
                 * The alternative is a "does this ticket have replies newer
                 * than the desk's last read" lookup per row, which is the N+1
                 * a badge is not worth. A CASE in the SELECT costs the same as
                 * reading the two columns it compares.
                 *
                 * A TICKET NOBODY HAS OPENED IS NEW, even with no replies -
                 * the subject IS the first message. A badge that only appeared
                 * once somebody replied would leave every brand-new ticket
                 * looking attended to, which is exactly backwards.
                 */
                BadgeColumn::make('unread')->label('')->fromRaw(
                    '(case when tickets.desk_read_at is null'
                    .' or (tickets.last_reply_at is not null'
                    .' and tickets.last_reply_at >= tickets.desk_read_at)'
                    ." then 'New' else '' end)"
                )->colors(['New' => 'danger']),

                BadgeColumn::make('status')->from('tickets.status')->colors([
                    Ticket::OPEN => 'warning',
                    Ticket::PENDING => 'neutral',
                    Ticket::RESOLVED => 'success',
                ])->resolver(),

                // Muted, not a badge. The desk a ticket belongs to is
                // context for whoever is scanning; the status and priority
                // are the things being scanned FOR, and three badges in a row
                // means none of them stands out.
                TextColumn::make('department')->from('tickets.department')
                    ->label('Desk')->muted(),

                BadgeColumn::make('priority')->from('tickets.priority')->colors([
                    'urgent' => 'danger',
                    'normal' => 'neutral',
                    'low' => 'neutral',
                ])->resolver(),

                // The names, not the ids. A queue that shows `opened_by: 4142`
                // is a queue somebody has to look things up to read.
                TextColumn::make('opener')->from('openers.name')->label('Opened by'),
                TextColumn::make('assignee')->from('assignees.name')->label('Assigned to'),

                DateColumn::make('created_at')->from('tickets.created_at')
                    ->label('Opened')->sortable()->withTime(),
                DateColumn::make('resolved_at')->from('tickets.resolved_at')
                    ->label('Resolved')->sortable()->withTime()->muted(),
            ])
            ->filters([
                SelectFilter::make('priority')->column('tickets.priority')
                    ->options(['low', 'normal', 'urgent']),

                /*
                 * THE FILTER IS THE POINT OF DEPARTMENTS. Routing a ticket to
                 * the network desk achieves nothing on its own; what the desk
                 * needs is to see only theirs, and this is that - saveable as
                 * a view, so somebody on the network rota opens the queue
                 * already narrowed to their own.
                 */
                SelectFilter::make('department')->label('Desk')
                    ->column('tickets.department')
                    ->options(array_keys((array) config('panel.ticketing.departments', []))),
            ])
            ->tabs('tickets.status', [Ticket::OPEN, Ticket::PENDING, Ticket::RESOLVED])
            /*
             * TWO JOINS ONTO THE SAME TABLE, aliased, because a ticket has two
             * people on it and they are rarely the same one. In `query()`
             * rather than `constrain()`: these reach extra columns, they do not
             * narrow the set, and a count drops them.
             */
            ->query(fn (Builder $q) => $q
                ->leftJoin('users as openers', 'openers.id', '=', 'tickets.opened_by')
                ->leftJoin('users as assignees', 'assignees.id', '=', 'tickets.assigned_to'))
            ->recordActions([
                /*
                 * VIEW IS FIRST, AND IT IS WHAT A ROW CLICK FOLLOWS. Clicking
                 * a ticket opens the ticket - with its conversation - which is
                 * the only thing anybody wants from a queue row. The list page
                 * finds this action to decide where a row leads, so removing
                 * it made the rows inert.
                 *
                 * The URL comes from `baseUrl()` rather than a literal,
                 * because this resource is installed by a PLUGIN into whichever
                 * panel an installation nominates - `/tickets/{id}` would be
                 * correct only while that panel is mounted at the root.
                 */
                RecordAction::make('view', 'View')
                    ->icon('eye')->color('primary')->authorize('view')
                    ->link(fn (array $row): string => self::baseUrl((string) $row['id'])),

                RecordAction::make('edit', 'Edit')
                    ->icon('pencil')->authorize('update')
                    ->link(fn (array $row): string => self::baseUrl($row['id'].'/edit')),
            ])
            /*
             * CLICKING A ROW OPENS THE TICKET, which is the only thing anybody
             * wants from a queue row - the record page is where the
             * conversation is, and the conversation is the ticket. It has to
             * be asked for: a table whose records are edited in place would be
             * ruined by a click that navigated away mid-edit, so the default
             * is off and this says otherwise.
             */
            ->rowClick()
            ->keyColumn('tickets.id')
            ->alsoSelect(['tickets.id', 'tickets.status'])
            /*
             * OLDEST FIRST, and this is the one sort default in the panel that
             * is not `created_at desc`. A queue read newest-first buries the
             * person who has been waiting longest under everybody who complained
             * this morning, which is precisely the wrong end to serve.
             */
            ->defaultSort('created_at', 'asc')
            ->perPage(25);
    }
}
