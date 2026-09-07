<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers\Ticketing;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Alxtexh\Panel\Models\Ticket;
use Alxtexh\Panel\Models\TicketReply;

/**
 * Reading and writing a ticket's thread.
 *
 * ITS OWN CONTROLLER RATHER THAN A RELATION MANAGER, because a thread is not
 * a related LIST. A relation manager renders rows with columns and actions,
 * which is right for a subscriber's sessions and wrong for a conversation:
 * what is needed here is who said what, in order, with the desk's private
 * notes marked as such.
 *
 * THE VISIBILITY RULE IS ENFORCED HERE AND ONLY REACHES THE CLIENT AS DATA
 * THE READER IS ENTITLED TO. No internal note is ever serialised into a page
 * an opener receives - not hidden with a flag for the front end to respect,
 * not sent and filtered in a computed property. A note the browser never
 * received cannot be revealed by a devtools tab.
 */
final class TicketThreadController extends Controller
{
    /**
     * How many messages a thread returns at once.
     *
     * Matched to the relation panels' cap rather than chosen afresh: two
     * different ceilings for "how much of a long list arrives at once" is a
     * number somebody has to look up twice and will eventually set
     * differently for no reason.
     */
    private const MAX_REPLIES = 300;

    /**
     * The thread as this reader may see it.
     *
     * @return array{capped: bool, total: int, replies: list<array<string, mixed>>, canReply: bool, canNote: bool}
     */
    public static function thread(Ticket $ticket): array
    {
        $seesInternal = Gate::allows('note', $ticket);

        /*
         * CAPPED, AND THE READER IS TOLD - the same conclusion the relation
         * panels reached (roadmap G.7), for the same reason.
         *
         * A thread is unbounded in principle: a ticket reopened weekly for a
         * year is a page that gets slower every month and one nobody notices
         * getting slower, because it degrades for one customer at a time. The
         * cap is on the MOST RECENT, because a conversation is read from the
         * bottom - the last exchange is what somebody opened it for, and the
         * first message is already the subject at the top of the page.
         *
         * `capped` travels with the payload so the screen can SAY so. Silently
         * showing the last two hundred of four hundred is the version that
         * loses an argument: somebody scrolls up, does not find what they were
         * promised, and concludes the ticket was edited.
         */
        $query = $ticket->replies()
            ->visibleTo($seesInternal)
            ->with('author:id,name');

        $total = (clone $query)->count();

        $replies = $query
            ->reorder('created_at', 'desc')
            ->limit(self::MAX_REPLIES)
            ->get()
            ->reverse()
            ->values();

        $replyRows = [];
        foreach ($replies as $reply) {
            $replyRows[] = [
                'id' => $reply->id,
                'body' => $reply->body,
                'internal' => $reply->isInternal(),
                'author' => $reply->author?->name ?? 'Removed user',
                'fromOpener' => (string) $reply->author_id === (string) $ticket->opened_by,
                'at' => $reply->created_at?->toDayDateTimeString(),
            ];
        }

        return [
            'capped' => $total > self::MAX_REPLIES,
            'total' => $total,
            'replies' => $replyRows,

            'canReply' => Gate::allows('reply', $ticket),
            'canNote' => $seesInternal,
        ];
    }

    /**
     * FETCHED SEPARATELY FROM THE RECORD, like a relation panel. A ticket with
     * two hundred messages must not put two hundred messages in front of the
     * record somebody opened the page to read.
     */
    public function show(Ticket $ticket): JsonResponse
    {
        Gate::authorize('view', $ticket);

        /*
         * OPENING THE THREAD IS READING IT, and this is the only honest place
         * to say so - a "mark as read" button is a chore nobody performs, and
         * a badge that only clears when somebody remembers is a badge people
         * learn to ignore.
         *
         * WHICH SIDE IS DECIDED BY THE POLICY, not by which URL was used. The
         * same person can hold both roles; what marks the desk's copy read is
         * being entitled to the desk's view of it.
         */
        $ticket->markRead(Gate::allows('note', $ticket) ? 'desk' : 'opener');

        return response()->json(self::thread($ticket));
    }

    public function store(Request $request, Ticket $ticket): RedirectResponse
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
            'visibility' => ['required', Rule::in([TicketReply::PUBLIC, TicketReply::INTERNAL])],
        ]);

        /*
         * TWO GATES, PICKED BY WHAT IS BEING WRITTEN, and never one gate for
         * both. Adding to the conversation and writing in the desk's private
         * margin are different acts by different people; authorising a note
         * as though it were a reply would let the person who opened the
         * ticket write - and then read - the notes about themselves.
         */
        $ability = $data['visibility'] === TicketReply::INTERNAL ? 'note' : 'reply';

        Gate::authorize($ability, $ticket);

        $ticket->addReply($data['body'], $data['visibility']);

        return back();
    }
}
