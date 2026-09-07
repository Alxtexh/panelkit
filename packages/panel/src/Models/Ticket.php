<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Models;

use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Alxtexh\Panel\Audit\Auditable;
use Alxtexh\Panel\Events\TicketOpened;
use Alxtexh\Panel\Models\Concerns\HasStateTransitions;
use Alxtexh\Panel\Models\Scopes\TenantScope;
use Alxtexh\Panel\Support\TenantContext;
use Alxtexh\Panel\Support\TicketTables;

/**
 * A conversation with two ends.
 *
 * PROMOTED FROM THE REFERENCE APP. Three things were application-shaped and are
 * now asked rather than assumed: the table name, the user model, and what
 * happens when a ticket opens - a direct call to one announcer became
 * `TicketOpened`, so an installation can add a webhook without editing a
 * packaged model.
 *
 * WHY A TICKET IS NOT JUST ANOTHER RESOURCE. Every other record in this panel
 * is read by one side: an operator reads clients, a reseller reads plans. A
 * ticket is read by BOTH, under different rules - the person who opened it
 * always reads their own, the operator reads the whole organisation's without
 * having opened any - which is why the policy came first and the screens
 * second.
 *
 * THE THREAD IS `ticket_replies`, NOT THE CHAT TABLE, and that is a reversal
 * of what this note used to say. Pointing at the existing chat thread avoided
 * a second messaging system, which was the right instinct and the wrong call:
 * `chat_messages` records a DIRECTION, not an author, and has no notion of a
 * message the customer may not read. A rota needs both. See the replies
 * migration for the whole argument.
 *
 * AUDITED, because "who closed this and when" is the question every disputed
 * ticket ends in.
 */
#[ScopedBy(TenantScope::class)]
/**
 * THE COLUMNS, SO STATIC ANALYSIS CAN SEE THEM - see `Alerts\Announcement`.
 *
 * `tenant_id` IS NULLABLE, which on this model is load-bearing rather than
 * incidental: a ticket raised against the installation itself belongs to no
 * organisation, and that is the row the superadmin desk exists to answer.
 *
 * THE FIVE TIMESTAMPS ARE ALL NULLABLE AND EACH MEANS "HAS NOT HAPPENED YET" -
 * unresolved, never answered, never read by the desk, never read by the
 * opener. Annotating any of them non-null would push a null into every
 * comparison that asks whether it has.
 *
 * @property int $id
 * @property int|null $tenant_id
 * @property int $opened_by
 * @property int|null $assigned_to
 * @property string $subject
 * @property string $status
 * @property string $priority
 * @property string|null $department
 * @property \Carbon\CarbonImmutable|null $resolved_at
 * @property \Carbon\CarbonImmutable|null $first_response_at
 * @property \Carbon\CarbonImmutable|null $last_reply_at
 * @property \Carbon\CarbonImmutable|null $desk_read_at
 * @property \Carbon\CarbonImmutable|null $opener_read_at
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 */
final class Ticket extends Model
{
    use Auditable;
    use HasStateTransitions;

    public const OPEN = 'open';

    public const PENDING = 'pending';

    public const RESOLVED = 'resolved';

    /** @var array<string, list<string>> */
    protected array $transitions = [
        self::OPEN => [self::PENDING, self::RESOLVED],
        self::PENDING => [self::OPEN, self::RESOLVED],
        self::RESOLVED => [self::OPEN],
    ];

    protected $guarded = [];

    /**
     * ASKED, NOT DECLARED. `tickets` is a name an application might already be
     * using, so the package defaults to `panel_tickets` and an installation
     * that had ticketing before it was promoted points the config at the tables
     * it already has. See `TicketTables`.
     */
    public function getTable(): string
    {
        return TicketTables::tickets();
    }

    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
            'first_response_at' => 'datetime',
            'last_reply_at' => 'datetime',
            'desk_read_at' => 'datetime',
            'opener_read_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        /*
         * STAMPED ON WRITE, so a ticket opened through any path - the portal
         * form, an import, a test - belongs to the organisation that was
         * resolved rather than to whichever one a caller remembered to pass.
         */
        self::creating(static function (self $ticket): void {
            if ($ticket->getAttribute('tenant_id') === null) {
                $ticket->setAttribute('tenant_id', app(TenantContext::class)->currentKey());
            }

            /*
             * AND SO IS THE OPENER, for a sharper reason. `opened_by` is half
             * the policy - it is what "read your own" reads - so a form field
             * for it would be a way to file a complaint under somebody else's
             * name AND to hand that person read access to it. Neither of the
             * two ticket resources exposes one, and this is what makes that
             * true rather than a habit two authors have to keep.
             */
            if ($ticket->getAttribute('opened_by') === null) {
                $ticket->setAttribute('opened_by', Auth::id());
            }
        });

        /*
         * THE DESK IS TOLD, AFTER the row exists - roadmap 6.5.
         *
         * `created`, not `creating`: an alert naming ticket #0 because the id
         * had not been assigned yet is an alert nobody can act on. And it
         * cannot block the save - see the listener's own note.
         */
        self::created(static function (self $ticket): void {
            TicketOpened::dispatch($ticket);
        });

        /*
         * `resolved_at` FOLLOWS THE STATUS, in one place. Two writers - a
         * status change here, a timestamp set there - is how a "resolved"
         * ticket ends up with no resolution time and a reopened one keeps its
         * old one, and both make the resolution report quietly wrong.
         */
        self::saving(static function (self $ticket): void {
            if (! $ticket->isDirty('status')) {
                return;
            }

            $ticket->setAttribute(
                'resolved_at',
                $ticket->getAttribute('status') === self::RESOLVED ? now() : null,
            );
        });
    }

    /**
     * THE USER MODEL IS THE APPLICATION'S, and the package does not know its
     * name. `auth.providers.users.model` does; importing `App\Models\User`
     * would work in exactly one application and fatal in every other.
     */
    private static function userModel(): string
    {
        return (string) config('auth.providers.users.model');
    }

    /** @return BelongsTo<Model, $this> - see `TicketReply::author()`. */
    public function opener(): BelongsTo
    {
        return $this->belongsTo(self::userModel(), 'opened_by');
    }

    /** @return BelongsTo<Model, $this> - see `TicketReply::author()`. */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(self::userModel(), 'assigned_to');
    }

    /**
     * The thread, oldest first - which is how a conversation reads.
     *
     * @return HasMany<TicketReply, $this>
     */
    public function replies(): HasMany
    {
        return $this->hasMany(TicketReply::class)->oldest();
    }

    /**
     * Has this side got unread messages waiting?
     *
     * COMPARED AGAINST `last_reply_at`, so it needs no query - the list page
     * already selects both columns, and a per-row "are there newer replies"
     * lookup is the N+1 that a NEW badge is not worth.
     *
     * A TICKET WITH NO REPLIES IS UNREAD FOR THE DESK, because the SUBJECT is
     * the first message. A queue that only badges tickets somebody has
     * replied to would leave every brand-new ticket looking attended to,
     * which is precisely backwards.
     */
    public function isUnreadFor(string $side): bool
    {
        $readAt = $side === 'desk' ? $this->desk_read_at : $this->opener_read_at;

        if ($readAt === null) {
            return $side === 'desk' || $this->last_reply_at !== null;
        }

        /*
         * `gte`, NOT `gt`, and the second matters. Timestamps here are stored
         * to the second, so a reply arriving in the same second as somebody
         * opening the thread is indistinguishable from one arriving just
         * before it - and the two readings fail in opposite directions. A
         * badge that lingers is noise; a badge that never appears is a
         * customer's reply nobody saw. So the comparison fails towards
         * showing it, and the next read clears it.
         */
        return $this->last_reply_at !== null && $this->last_reply_at->gte($readAt);
    }

    /**
     * Mark this side as caught up.
     *
     * `saveQuietly`, DELIBERATELY. Opening a ticket is not an edit of it -
     * auditing "read the ticket" would bury the changes that matter under a
     * line per page view, and `updated_at` moving on a read would make the
     * queue re-sort itself because somebody looked.
     */
    public function markRead(string $side): void
    {
        $column = $side === 'desk' ? 'desk_read_at' : 'opener_read_at';

        $this->forceFill([$column => now()])->saveQuietly();
    }

    /**
     * Record a message on this ticket and move the ticket's own clocks.
     *
     * ONE PLACE, because three columns have to agree and they are the three a
     * support desk is measured on. Written as a method rather than a model
     * event on `TicketReply` so that the ordering is visible: the reply is
     * saved first, and the ticket only claims a first response once one
     * exists.
     *
     * `first_response_at` COUNTS ONLY PUBLIC REPLIES BY SOMEBODY OTHER THAN
     * THE OPENER. An internal note is not an answer - nobody outside the desk
     * can see it - and a customer replying to their own ticket is not the desk
     * responding. Counting either would make the response-time report flatter
     * than the truth, which is the direction nobody questions.
     *
     * @param  list<array<string, mixed>>  $attachments
     */
    public function addReply(string $body, string $visibility, ?int $authorId = null, array $attachments = []): TicketReply
    {
        $authorId ??= Auth::id();

        $reply = $this->replies()->create([
            'author_id' => $authorId,
            'visibility' => $visibility,
            'body' => $body,
            'attachments' => $attachments === [] ? null : $attachments,
        ]);

        $this->setAttribute('last_reply_at', $reply->created_at);

        if ($this->getAttribute('first_response_at') === null
            && $visibility === TicketReply::PUBLIC
            && (string) $authorId !== (string) $this->getAttribute('opened_by')) {
            $this->setAttribute('first_response_at', $reply->created_at);
        }

        $this->save();

        return $reply;
    }
}
