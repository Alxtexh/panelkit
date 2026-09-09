<?php

declare(strict_types=1);

namespace App\Demo\Panel\Resources;

use App\Demo\Models\Router;
use App\Panel\Clusters\NetworkCluster;
use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\Forms\Fields\MapField;
use Alxtexh\Panel\Forms\Fields\SelectField;
use Alxtexh\Panel\Forms\Fields\TextField;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Schema\Step;
use Alxtexh\Panel\Schema\Wizard;
use Alxtexh\Panel\Tables\Columns\DateColumn;
use Alxtexh\Panel\Tables\Columns\IconColumn;
use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Filters\SelectFilter;
use Alxtexh\Panel\Tables\Grouping\Group;
use Alxtexh\Panel\Tables\Table;

final class RouterResource extends Resource
{
    protected static string $model = Router::class;

    protected static string $icon = 'router';

    protected static ?string $purpose = 'The network hardware that serves connections, and its live state.';

    // A cluster member, not a group entry - the sidebar says "Network" once
    // and this screen is reached from its sub-navigation. Roadmap 4.1.
    protected static ?string $cluster = NetworkCluster::class;

    protected static ?int $sort = 20;

    /**
     * Onboarding a router, as an ordered wizard rather than one long form.
     *
     * A WIZARD BECAUSE THE STEPS DEPEND ON EACH OTHER. You cannot say how a
     * router is reached before saying what it is, and asking for monitoring
     * preferences before either is how somebody abandons the form. That
     * dependency is the only thing that justifies a wizard over tabs - a form
     * you dip into should be tabs.
     *
     * The reference application measures this exact screen at ~967 ms per step
     * in the system being replaced, because each step was a full server render.
     * Here every step is already in the payload and advancing is local.
     */
    public static function form(Form $form): Form
    {
        return $form->schema([
            Wizard::make()->steps([
                Step::make('Identity')
                    ->description('What this device is called')
                    ->schema([
                        TextField::make('name')->required()->placeholder('Nairobi West NAS-1'),
                        SelectField::make('model')->required()->options([
                            'RB750' => 'MikroTik RB750',
                            'RB4011' => 'MikroTik RB4011',
                            'CCR1009' => 'MikroTik CCR1009',
                            'other' => 'Other',
                        ]),
                    ]),

                Step::make('Connection')
                    ->description('How the panel reaches it')
                    ->schema([
                        TextField::make('ip_address')->label('IP address')->required()
                            ->placeholder('10.0.0.1'),

                        /*
                         * CONDITIONAL, and the condition is enforced on BOTH
                         * sides from this one declaration.
                         *
                         * The client hides the control when the model is not
                         * "other"; the server turns the same condition into
                         * `required_if:model,other`, so a request claiming
                         * `model=other` must supply this whatever the browser
                         * chose to draw. Neither half can drift, because there
                         * is only one declaration.
                         */
                        TextField::make('model_other')->label('Model name')->required()
                            ->visibleWhen('model', 'other')
                            ->help('Only needed when the model is not in the list.'),
                    ]),

                Step::make('Location')
                    ->description('Where it sits, for the network coverage map')
                    ->schema([
                        MapField::make('location')
                            ->defaultCenter(-1.286389, 36.817223)
                            ->zoom(12)
                            ->help('Click the map to drop a pin, or drag the existing one.'),
                    ]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            // Give narrow screens a deliberate card presentation instead of
            // forcing a wide network table into horizontal scrolling.
            ->layouts(['table', 'cards'])
            ->stickyFirstColumn()
            ->resizableColumns()
            /*
             * Clustered by status: online routers together, then degraded, then
             * offline - which is how anyone triaging a network reads this list.
             *
             * Grouping is an ORDERING, not an aggregation: rows arrive already
             * clustered and the client inserts a heading wherever the value
             * changes. The cost is one extra ORDER BY term, and the price is
             * that the group column must lead an index - see the note in
             * ClientResource for what happens on a large table when it does not.
             */
            ->groupBy(Group::make('status')->collapsible()->label('Status'))
            ->groups([
                Group::make('status')->collapsible()->label('Status'),
                Group::make('created_at')->date()->label('Created date'),
            ])
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
                    ->link(fn (array $row): string => '/routers/'.$row['id']),
            ])
            ->columns([
                TextColumn::make('name')->from('routers.name')->sortable()->searchable()->locked(),
                TextColumn::make('ip_address')->from('routers.ip_address')->label('IP address')
                    ->searchable()->copyable()->mono(),
                TextColumn::make('model')->from('routers.model')->muted(),
                // An icon, not a badge: reachability is scanned down the
                // column rather than read row by row.
                IconColumn::make('status')->from('routers.status')->sortable()
                    ->icons(['online' => 'wifi', 'offline' => 'wifi-off', 'degraded' => 'alert'])
                    ->colors(['online' => 'success', 'offline' => 'danger', 'degraded' => 'warning'])
                    ->labels(['online' => 'Online', 'offline' => 'Offline', 'degraded' => 'Degraded']),
                DateColumn::make('last_seen_at')->from('routers.last_seen_at')->label('Last seen')->sortable(),
                DateColumn::make('created_at')->from('routers.created_at')->sortable()->muted(),
            ])
            ->filters([
                SelectFilter::make('status')->column('routers.status')
                    ->options(['online', 'degraded', 'offline']),
                // Data-derived options, resolved lazily from a TENANT-SCOPED
                // query - never at schema-build time, and never cached into the
                // schema, because they are tenant data (addendum Part A).
                SelectFilter::make('model')->column('routers.model')
                    ->options(fn (): array => Router::query()->toBase()
                        ->select('model')->whereNotNull('model')
                        ->distinct()->orderBy('model')->pluck('model')->all()),
            ])
            ->tabs('routers.status', ['online', 'degraded', 'offline'])
            ->keyColumn('routers.id')
            ->alsoSelect(['routers.id'])
            ->defaultSort('created_at', 'desc');
    }
}
