<?php

declare(strict_types=1);

namespace App\Panel\Resources;

use App\Models\Plan;
use App\Panel\Clusters\NetworkCluster;
use Alxtexh\Panel\Actions\BulkAction;
use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\Forms\Fields\CheckboxField;
use Alxtexh\Panel\Forms\Fields\HiddenField;
use Alxtexh\Panel\Forms\Fields\NumberField;
use Alxtexh\Panel\Forms\Fields\TextField;
use Alxtexh\Panel\Forms\Form;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Schema\Section;
use Alxtexh\Panel\Tables\Columns\BadgeColumn;
use Alxtexh\Panel\Tables\Columns\DateColumn;
use Alxtexh\Panel\Tables\Columns\MoneyColumn;
use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Filters\BooleanFilter;
use Alxtexh\Panel\Tables\Filters\QueryBuilderFilter;
use Alxtexh\Panel\Tables\Table;

final class PlanResource extends Resource
{
    protected static string $model = Plan::class;

    protected static string $icon = 'package';

    protected static ?string $purpose = 'The catalogue of plans subscribers can be sold.';

    // A cluster member, not a group entry - the sidebar says "Network" once
    // and this screen is reached from its sub-navigation. Roadmap 4.1.
    protected static ?string $cluster = NetworkCluster::class;

    protected static ?int $sort = 30;

    /**
     * The catalogue is editable, and this form is where two field types finally
     * got a consumer.
     *
     * WHY IT DID NOT EXIST BEFORE. Plans were a read-only list - which is an odd
     * thing for a catalogue, since somebody has to add the next package - and
     * the absence went unnoticed because a resource with no `form()` simply
     * inherits the base's empty one. Nothing fails. The create button just leads
     * to a screen with no controls on it.
     *
     * `CheckboxField` AND `HiddenField` HAD NO CONSUMER ANYWHERE, and both were
     * broken because of it:
     *
     *   - `HiddenField` overrode `label()` as a getter when the parent declares
     *     it as a setter, which PHP refuses to load. Every screen declaring one
     *     would have died at construction. No screen declared one.
     *   - Both were "tested" by unit tests asserting the schema they return,
     *     which is the author checking their own arithmetic.
     *
     * The pattern has now cost this project four defects, and the lesson each
     * time is the same: A TYPE WITH A UNIT TEST AND NO CONSUMER HAS BEEN LOOKED
     * AT ONCE, BY THE PERSON WHO WROTE IT.
     */
    public static function form(Form $form): Form
    {
        return $form->schema([
            Section::make('Package')
                ->description('What this plan offers, and what it costs.')
                ->schema([
                    TextField::make('name')->required()->placeholder('Home 20'),

                    /*
                     * THE UNIT IS IN THE LABEL, because a field has no
                     * `suffix()`. `TextColumn::suffix()` exists and reads a
                     * column's value; writing the same call here was a guess
                     * from the table side of the API, and it fatals on the first
                     * construction rather than rendering oddly.
                     */
                    NumberField::make('speed_mbps')->label('Speed (Mbps)')->required()->min(1),

                    /*
                     * MINOR UNITS, and the field says so rather than dividing.
                     *
                     * `MoneyColumn` reads this column as an integer count of the
                     * smallest unit, which is the whole reason it cannot drift
                     * the way a float does. A form that accepted major units
                     * here would have to multiply on the way in and divide on
                     * the way out, and the two roundings are where the missing
                     * cent comes from.
                     */
                    NumberField::make('price_cents')
                        ->label('Price')
                        ->required()
                        ->help('In cents. 250000 is KES 2,500.00.'),

                    /*
                     * A CHECKBOX, NOT A TOGGLE, and the difference is what the
                     * control promises.
                     *
                     * A switch reads as something that takes effect when you
                     * flick it - that is what a switch does everywhere else in
                     * an interface. This one does nothing until Save, so a
                     * checkbox is the honest control: it states a value the form
                     * will submit rather than an action already taken.
                     */
                    CheckboxField::make('is_active')
                        ->label('Available to sell')
                        ->help('An inactive plan stays on existing accounts and cannot be chosen for new ones.'),
                ]),

            /*
             * THE ORDER IS CARRIED, NEVER TYPED.
             *
             * `->reorderable('position')` below means this column is set by
             * DRAGGING A ROW - it is the catalogue's chosen sequence, which
             * follows no property of the plan. Showing it as a number would
             * offer two ways to set one thing that disagree the moment somebody
             * uses the second.
             *
             * It cannot simply be left out either: a form that omits it submits
             * nothing for `position`, and an edit would either reset the
             * ordering or fail on the NOT NULL. So the value travels with the
             * form and stays invisible.
             *
             * THIS IS NOT A SECURITY BOUNDARY. The field is in the page source
             * and anybody can change it before submitting. That is acceptable
             * for a display order and would not be for anything else - the
             * field's own docblock is emphatic about this, because it is the
             * mistake the type invites.
             */
            HiddenField::make('position'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            /*
             * A catalogue has a chosen order - the sequence a sales page lists
             * packages in - which follows no property of the rows and so cannot
             * be sorted into existence. Declaring this also makes `position`
             * the default sort, because dragging while ordered by name moves a
             * row somewhere you cannot see the effect of.
             */
            ->reorderable('position')
            // A catalogue is browsed, then opened - see ClientResource's own
            // note on why this is declared per resource rather than default.
            // rowClick alone only arms the click; the row still needs a real
            // 'view' RecordAction below to have somewhere to send it.
            ->rowClick('view')
            ->recordActions([
                RecordAction::make('view', 'View')
                    ->icon('eye')
                    ->color('primary')
                    ->authorize('view')
                    ->link(fn (array $row): string => '/plans/'.$row['id']),
            ])
            ->columns([
                TextColumn::make('name')->from('plans.name')->sortable()->searchable()->locked(),
                TextColumn::make('speed_mbps')->from('plans.speed_mbps')->label('Speed')->sortable()->suffix('Mbps'),
                /*
                 * NO FOOTER TOTALS HERE, deliberately.
                 *
                 * This table is a CATALOGUE - a list of what may be sold - and
                 * the arithmetic over it is meaningless. "Total: KES 2,800,000"
                 * is the sum of ten price tags, which is not revenue, not
                 * outstanding, not anything anybody would act on. The average
                 * speed of the plans on offer is the same kind of number: real
                 * arithmetic over rows that are not quantities.
                 *
                 * `Summarizer` stays in the framework because a footer total is
                 * genuinely right for rows that ARE quantities - invoices,
                 * payments, usage. Putting one here just because the column
                 * held a number was the mistake.
                 */
                /*
                 * A `MoneyColumn` OVER THE RAW MINOR UNITS, which is what the
                 * type is for - and what nothing in this application used
                 * until now.
                 *
                 * That gap is why a real bug survived: `MoneyColumn` had unit
                 * tests asserting its schema and NO SCREEN ANYWHERE RENDERED
                 * ONE, so nobody noticed that the record page did not format
                 * it at all. The list showed a currency; the record page for
                 * the same row showed `250000`.
                 *
                 * A column type with tests and no consumer is a type nobody
                 * has actually looked at.
                 */
                MoneyColumn::make('price_cents')->label('Price')->currency('KES')->sortable(),
                // A switch, so retiring a plan is one click from the list.
                /*
                 * A BADGE, NOT A SWITCH.
                 *
                 * An inline toggle turns a row into a control: one mis-click
                 * while scanning a list retires a plan customers are being sold,
                 * with no confirmation and nothing to undo it with. It also
                 * makes the state ambiguous - a switch invites you to change it,
                 * so the column stops reading as "this is how things are" and
                 * starts reading as "set this".
                 *
                 * Retiring a plan is a deliberate act, so it goes through the
                 * selection and the bulk menu, where it is chosen rather than
                 * brushed against.
                 */
                BadgeColumn::make('is_active')->from('plans.is_active')->label('Status')
                    ->labels([1 => 'Available', 0 => 'Retired'])
                    ->colors([1 => 'success', 0 => 'muted'])
                    ->defaultColor('muted'),
                DateColumn::make('created_at')->from('plans.created_at')->sortable()->muted(),
            ])
            ->filters([
                // Three states: unset, true, false. `false` is an applied value.
                BooleanFilter::make('active')->label('Availability')->column('plans.is_active')
                    ->labels('Active', 'Inactive'),
                /*
                 * A CONSUMER FOR THE QUERY BUILDER, which shipped without one.
                 *
                 * It takes no configuration: the fields it offers are derived
                 * from the filters above, so this line adds a nested and/or
                 * tree over `active` and nothing else. Adding a filter widens
                 * it; removing one narrows it; there is no second list.
                 *
                 * It is here rather than nowhere because a filter with a
                 * server half, twelve tests and no screen declaring it is a
                 * feature that exists in the package and not for an operator -
                 * which is exactly what it was until this line.
                 */
                QueryBuilderFilter::make('advanced')->label('Advanced query'),
            ])
            ->keyColumn('plans.id')
            // `price` is computed, so the underlying columns must be selected
            // explicitly - the column list alone would not include them.
            ->alsoSelect(['plans.id', 'plans.price_cents', 'plans.is_active'])
            ->transform(function (array $row): array {
                $row['price'] = number_format((int) $row['price_cents'] / 100, 2);
                $row['is_active'] = (bool) $row['is_active'];

                return $row;
            })
            /*
             * `position`, not `created_at`.
             *
             * `reorderable()` already sets this, and it is repeated here so the
             * pairing is visible: dragging only makes sense while the table is
             * ordered by the column being dragged, so a resource that declares
             * one and then overrides the other has silently disabled its own
             * handles.
             */
            /*
             * Retiring a plan lives HERE, not in a switch on the row.
             *
             * The selection makes it deliberate: you choose the rows, then
             * choose the act, and the confirmation names what is about to
             * happen. A toggle in the list is the same change with none of
             * those steps.
             */
            ->bulkActions([
                BulkAction::make('activate', 'Make available')
                    ->icon('check')
                    ->authorize('update')
                    ->mutate(['is_active' => true]),

                BulkAction::make('retire', 'Retire')
                    ->icon('archive')
                    ->authorize('update')
                    ->mutate(['is_active' => false])
                    ->requiresConfirmation('Retire these plans? They stay on existing subscriptions but cannot be sold.'),
            ])
            ->defaultSort('position', 'asc');
    }
}
