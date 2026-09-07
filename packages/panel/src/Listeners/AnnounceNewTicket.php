<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Listeners;

use Alxtexh\Panel\Alerts\Telegram;
use Alxtexh\Panel\Events\TicketOpened;

/**
 * Tell the desk when somebody opens a ticket - roadmap 6.5.
 *
 * A QUEUE NOBODY IS WATCHING IS A QUEUE WITH A RESPONSE TIME OF ONE WORKING
 * DAY, whatever the dashboard says. Out of hours especially, the difference
 * between a customer waiting twenty minutes and waiting until morning is
 * whether anything told a human. That is the whole feature.
 *
 * URGENT ONLY, BY DEFAULT, and this is the decision that makes it survive.
 * An alert on every ticket becomes noise within a week, and a channel people
 * mute is worse than no channel - it is a channel everybody BELIEVES is
 * working. So the threshold is configurable and starts where it can be
 * trusted. See `panel.ticketing.alert_priorities`.
 *
 * IT NEVER THROWS AND NEVER BLOCKS THE WRITE. `Telegram::send` returns false
 * rather than raising - a customer's ticket must be saved whether or not a
 * chat API answered. A failed notification is a notification somebody misses;
 * a failed save is a complaint that vanished.
 */
final class AnnounceNewTicket
{
    public function handle(TicketOpened $event): void
    {
        $ticket = $event->ticket;

        if (! in_array($ticket->priority, self::priorities(), true)) {
            return;
        }

        if (! Telegram::configured()) {
            return;
        }

        /*
         * THE SUBJECT AND NOTHING ELSE FROM THE BODY. A ticket's first
         * message can contain an address, an account number or a password
         * somebody pasted, and a chat group is a place messages are forwarded
         * from. The alert says what happened and where to look at it; the
         * content stays behind the panel's authentication.
         */
        Telegram::send(sprintf(
            "🎫 New %s ticket #%d\n%s\n\nOpened by %s",
            $ticket->priority,
            $ticket->getKey(),
            $ticket->subject,
            $ticket->opener?->name ?? 'someone',
        ));
    }

    /** @return list<string> */
    private static function priorities(): array
    {
        $priorities = [];

        foreach ((array) config('panel.ticketing.alert_priorities', ['urgent']) as $priority) {
            if (is_string($priority) && $priority !== '') {
                $priorities[] = $priority;
            }
        }

        return $priorities;
    }
}
