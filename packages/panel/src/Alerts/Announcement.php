<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Alerts;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Alxtexh\Panel\Documents\DocumentBranding;
use Alxtexh\Panel\Support\TenantContext;

/**
 * A notice somebody wrote, addressed to everybody in an organisation.
 *
 * IT SITS AT THE TOP OF THE DASHBOARD, not on a page of its own. A page called
 * Announcements is a page nobody opens - so the notice everybody needed to read
 * is the one nobody read, which is the entire reason this is a banner.
 *
 * DISMISSING IT DOES NOT DESTROY IT. Closing a banner records that THIS person
 * has read it and writes them a notification, so the thing they just dismissed
 * is still in the bell where they can find it again. A dismissal that deleted
 * the notice would let the first person to click × hide it from the whole
 * organisation; one that simply vanished would lose the announcement for
 * whoever closed it by reflex, which is most people.
 *
 * TENANT-SCOPED LIKE EVERYTHING ELSE, with the usual rule: no tenant means no
 * rows rather than all of them.
 *
 * THE COLUMNS ARE LISTED BELOW SO STATIC ANALYSIS CAN SEE THEM.
 *
 * ELOQUENT RESOLVES ATTRIBUTES AT RUNTIME through `__get`, so every
 * `$announcement->title` in this package was an "access to an undefined
 * property" to phpstan - 93 of them across the package, the single largest
 * category of finding in its baseline. The properties are real; nothing could
 * see them.
 *
 * ANNOTATING THE MODEL FIXES ITS CONSUMERS TOO, which is why this is the first
 * one done: `AnnouncementDelivery` reads six of these fields and every read was
 * its own finding.
 *
 * NULLABILITY IS COPIED FROM THE MIGRATION, not guessed. A `?string` that is
 * really `string` costs a null check nobody needs; a `string` that is really
 * nullable is a null reaching code that cannot take one - which is the bug this
 * annotation is supposed to help find, reintroduced by the annotation itself.
 *
 * `starts_at`/`ends_at` ARE `CarbonImmutable` BECAUSE `$casts` SAYS `datetime`,
 * and the booleans likewise - the cast is the source of truth for the type, not
 * the column.
 *
 * @property int $id
 * @property int $tenant_id
 * @property string $title
 * @property string|null $body
 * @property string $severity
 * @property string $display
 * @property string|null $action_label
 * @property string|null $action_url
 * @property \Carbon\CarbonImmutable|null $starts_at
 * @property \Carbon\CarbonImmutable|null $ends_at
 * @property bool $notify_bell
 * @property bool $notify_telegram
 * @property int|null $created_by
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 */
final class Announcement extends Model
{
    public const DANGER = 'danger';

    public const WARNING = 'warning';

    public const INFO = 'info';

    public const SUCCESS = 'success';

    /** Persists until dismissed - for anything with a consequence. */
    public const BANNER = 'banner';

    /** Transient - for something pleasant nobody needs to act on. */
    public const TOAST = 'toast';

    protected $table = 'panel_announcements';

    protected $guarded = [];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        // Roadmap 5.4: which transports this notice rides beyond the
        // banner. Delivery happens once, on create - see AnnouncementDelivery.
        'notify_bell' => 'boolean',
        'notify_telegram' => 'boolean',
    ];

    protected static function booted(): void
    {
        /*
         * SCOPED ON READ AND STAMPED ON WRITE, so neither a query nor a create
         * can forget. `null` denies rather than matching everything - the same
         * rule every other scope in this panel follows, and the one that makes a
         * misconfigured resolver show an empty dashboard rather than every
         * organisation's notices at once.
         */
        self::addGlobalScope('tenant', static function (Builder $builder): void {
            $context = app(TenantContext::class);

            if (! $context->shouldScopeByColumn()) {
                return;
            }

            $builder->where(
                $builder->getModel()->getTable().'.tenant_id',
                $context->currentKey() ?? -1,
            );
        });

        self::creating(static function (self $announcement): void {
            if ($announcement->getAttribute('tenant_id') === null) {
                $announcement->setAttribute('tenant_id', app(TenantContext::class)->currentKey());
            }
        });
    }

    /** @return HasMany<AnnouncementDismissal, $this> */
    public function dismissals(): HasMany
    {
        return $this->hasMany(AnnouncementDismissal::class, 'announcement_id');
    }

    /**
     * Notices that are true now and this person has not closed.
     *
     * THE WINDOW IS PART OF THE QUERY. `starts_at` lets somebody write Monday's
     * notice on Friday; `ends_at` is what stops last month's maintenance window
     * sitting on the dashboard forever, because nobody ever goes back to delete
     * one.
     *
     * @return Collection<int, self>
     */
    public static function activeFor(int|string $userId): Collection
    {
        return self::query()
            ->where(fn (Builder $q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', now()))
            ->where(fn (Builder $q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', now()))
            ->whereDoesntHave('dismissals', fn (Builder $q) => $q->where('user_id', (string) $userId))
            ->orderByRaw("case severity when 'danger' then 0 when 'warning' then 1 else 2 end")
            ->latest('id')
            ->limit(5)
            ->get();
    }

    /**
     * Tokens `body` may contain, drawn from what a banner actually knows -
     * not a per-record field the way an invoice's `@customer` is, because an
     * announcement has no record of its own. What it does have is who is
     * reading it and which organisation it was written for, so those are the
     * two names on offer.
     *
     * THE SAME MAP DRIVES THREE THINGS FROM ONE DECLARATION: the chip strip
     * under the field (via `->chips()` on the `body` field in
     * `AnnouncementResource`), the substitution in `substitute()` below, and
     * `panel:doctor`'s check for a token that does not exist - the same
     * three-way reuse `DocumentKind::variables()` already gets for templates.
     *
     * @return array<string, string>
     */
    public static function variables(): array
    {
        return [
            '@user' => "The reader's name",
            '@organisation' => 'The organisation this announcement was written for',
        ];
    }

    /**
     * Replace this announcement's tokens for one specific reader.
     *
     * AN UNKNOWN TOKEN IS PRINTED AS WRITTEN, not blanked - the same choice
     * `DocumentRenderer` makes, for the same reason: a banner that silently
     * ate "@expiry" would read as finished prose with a word missing, which
     * is a worse failure than "@expiry" being visibly wrong.
     */
    public static function substitute(string $text, ?Authenticatable $user): string
    {
        $name = ($user !== null && isset($user->name)) ? (string) $user->name : 'there';

        return strtr($text, [
            '@user' => $name,
            '@organisation' => app()->bound(DocumentBranding::class)
                ? app(DocumentBranding::class)->company()
                : (string) config('app.name', 'Panel'),
        ]);
    }

    /** @return array<string, mixed> */
    public function toBanner(?Authenticatable $user = null): array
    {
        return [
            'id' => $this->getKey(),
            'title' => $this->title,
            'body' => $this->body === null ? null : self::substitute($this->body, $user),
            'severity' => $this->severity,
            'display' => $this->display,
            'actionLabel' => $this->action_label,
            'actionUrl' => $this->action_url,
        ];
    }
}
