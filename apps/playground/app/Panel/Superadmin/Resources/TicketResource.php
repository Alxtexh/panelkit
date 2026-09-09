<?php

declare(strict_types=1);

namespace App\Panel\Superadmin\Resources;

use Alxtexh\Panel\Actions\RecordAction;
use Alxtexh\Panel\Models\Ticket;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Tables\Columns\BadgeColumn;
use Alxtexh\Panel\Tables\Columns\DateColumn;
use Alxtexh\Panel\Tables\Columns\TextColumn;
use Alxtexh\Panel\Tables\Filters\SelectFilter;
use Alxtexh\Panel\Tables\Table;

/**
 * Every tenant's tickets, in one list.
 *
 * THE CROSS-TENANT VIEW IS THE FEATURE, and central context is what makes it
 * safe to have: this panel applies no tenant scoping, so the desk sees the
 * whole installation - which is what a desk is. The same resource in a
 * tenant-facing portal would be the leak the panel split exists to prevent,
 * and it is not reachable from one: a resource belongs to its panel.
 *
 * `tenant_id` IS A COLUMN HERE AND NOWHERE ELSE. In every tenant portal it
 * would be redundant (everything is yours); in the one place that sees
 * everybody, whose ticket this is becomes the first question.
 */
final class TicketResource extends Resource
{
    protected static string $model = Ticket::class;

    protected static ?string $purpose = 'Every ticket on the installation, whichever tenant raised it.';

    protected static string $panel = 'superadmin';

    /**
     * The packaged desk already owns [tickets] - keys are global because they
     * are URL segments and ability names - and `all-tickets` is the truer name
     * anyway: that list is one portal's queue, this one is everybody's.
     */
    public static function key(): string
    {
        return 'all-tickets';
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
                    ->link(fn (array $row): string => '/superadmin/all-tickets/'.$row['id']),
            ])
            ->columns([
                TextColumn::make('subject')->sortable()->searchable()->locked(),
                TextColumn::make('tenant_id')->label('Tenant')->sortable(),
                BadgeColumn::make('status')->colors([
                    'open' => 'warning',
                    'pending' => 'info',
                    'resolved' => 'success',
                    'closed' => 'muted',
                ]),
                BadgeColumn::make('priority')->colors([
                    'low' => 'muted',
                    'normal' => 'info',
                    'high' => 'warning',
                    'urgent' => 'danger',
                ]),
                DateColumn::make('created_at')->label('Raised')->sortable(),
                DateColumn::make('last_reply_at')->label('Last reply')->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options(['open', 'pending', 'resolved', 'closed']),
                SelectFilter::make('priority')->options(['low', 'normal', 'high', 'urgent']),
            ])
            ->tabs('tickets.status', ['open', 'pending', 'resolved', 'closed'])
            ->defaultSort('created_at', 'desc');
    }
}
