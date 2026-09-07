<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Policies;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable;
use Alxtexh\Panel\Models\Ticket;
use Alxtexh\Panel\Support\Abilities;
use Alxtexh\Panel\Support\Ability;
use Alxtexh\Panel\Support\TenantContext;

/**
 * PROMOTED FROM THE REFERENCE APP, with two substitutions and no change of
 * meaning.
 *
 * THE USER IS TWO CONTRACTS, NOT A CLASS. A package cannot name the
 * application's user model, and this policy needs exactly two things of it: an
 * identity, to compare against `opened_by`, and an ability check.
 * `Authenticatable&Authorizable` says that and nothing more.
 *
 * ABILITIES ARE ASKED THE WAY THE REST OF THE PACKAGE ASKS THEM - the
 * application's `hasPermission()` when it has one, `can()` when it does not,
 * and Spatie's team told which organisation to filter by either way. Both
 * halves are load-bearing and both were got wrong once while promoting this
 * file; `Support\Ability` carries the note.
 *
 * Who may read and act on a ticket - roadmap 6.1, written BEFORE any screen.
 *
 * A TICKET IS THE FIRST RECORD TWO SIDES READ UNDER DIFFERENT RULES, and that
 * is the whole reason this policy exists rather than another
 * `TenantResourcePolicy` subclass. Every other record answers one question -
 * is it yours - and a ticket answers two:
 *
 *   THE OPENER ALWAYS READS THEIR OWN. Somebody who raised a ticket can read
 *   it and reply to it even holding no ticket ability at all, because being
 *   the person who asked IS the entitlement. A subscriber portal where the
 *   customer needs a granted permission to see their own support request is
 *   a portal nobody can use.
 *
 *   THE OPERATOR READS THE ORGANISATION'S, without having opened any. That is
 *   an ordinary ability check - `view_any_tickets` and friends - and it is
 *   what a support rota needs.
 *
 * NEITHER READS ANOTHER ORGANISATION'S, ever, and that check comes FIRST.
 * Ordering matters here in a way it does not elsewhere: "the opener always
 * reads their own" is a rule that, evaluated before the tenant boundary,
 * would let a user carried into the wrong tenant context read a ticket
 * across it. Tenant first, then entitlement.
 *
 * CLOSING IS NOT REPLYING. The opener may reply forever and may not resolve;
 * resolution is an operator judgement about whether the problem is fixed, and
 * a customer who can mark their own ticket resolved is a queue that reports
 * success it did not achieve.
 */
final class TicketPolicy
{
    public function viewAny(Authenticatable&Authorizable $user): bool
    {
        // A list is the operator's surface. The opener's own tickets reach
        // them through their own screen, which constrains by `opened_by`
        // rather than relying on this.
        return $this->hasTenant() && $this->may($user, 'viewAny');
    }

    /**
     * MAY YOU OPEN A SCREEN OF YOUR OWN TICKETS - which is a different
     * question from `viewAny`, and the reason the opener's side works at all.
     *
     * `viewAny` asks whether you may list the RESOURCE, and for tickets that
     * means the organisation's: it is the operator's grant. Asking it of a
     * subscriber would leave them unable to open a screen showing nothing but
     * their own requests, which is the portal being useless in the name of
     * security.
     *
     * So this grants the SCREEN and nothing else. What appears on it is
     * settled by `MyTicketResource`'s `constrain()` - the gate says you may
     * look, the query decides at what - and every record request still
     * answers to `view` below.
     */
    public function viewOwn(Authenticatable&Authorizable $user): bool
    {
        return $this->hasTenant();
    }

    public function view(Authenticatable&Authorizable $user, ?Ticket $ticket = null): bool
    {
        if (! $this->hasTenant()) {
            return false;
        }

        if ($ticket === null) {
            return $this->may($user, 'view') || $this->may($user, 'create');
        }

        // TENANT FIRST. See the class note: reversing these two lines is a
        // cross-tenant read that looks like a feature.
        if (! $this->owns($ticket)) {
            return false;
        }

        return $this->opened($user, $ticket) || $this->may($user, 'view');
    }

    /**
     * Anybody signed into an organisation may ask it something - up to a
     * point.
     *
     * THE LIMIT IS HERE, IN THE POLICY, so it covers every path into a
     * ticket: the portal form, the API, an import, anything added later. A
     * check in one controller is a check the next entry point does not have,
     * and the next entry point is the one an integration uses.
     *
     * IT IS NOT SPAM FILTERING, and the difference matters. Every ticket here
     * comes from somebody signed into a tenant, so there is no anonymous
     * submitter to block by keyword or address - that would be theatre. What
     * this catches is a broken integration or somebody hammering a form
     * because nothing appeared to happen, either of which fills a queue
     * nobody can then work through.
     *
     * DELIBERATELY GENEROUS. A person having a genuinely bad day may open
     * several in an hour, and refusing them is refusing the customer who most
     * needs help. The limits are set where only a machine reaches them.
     */
    /**
     * ONE QUERY, NOT TWO. This runs on every request that computes the
     * header quick-create menu (`PanelQuickCreate::build()` calls
     * `can('create')` on every registered resource, Ticket included) - not
     * only on an actual ticket-creation attempt. Two separate `count()`
     * calls here were two separate "New ticket" nav-visibility queries on
     * every page, tenant-wide performance tests included, for a check that
     * ends up allowed the overwhelming majority of the time. `SUM(CASE
     * WHEN ...)` (portable across sqlite/mysql/pgsql, unlike `FILTER`) gets
     * both windows' counts from one query over the wider (daily) range,
     * since the hourly window is always inside it.
     */
    public function create(Authenticatable&Authorizable $user): bool
    {
        if (! $this->hasTenant()) {
            return false;
        }

        $hourLimit = (int) config('panel.ticketing.max_per_hour', 10);
        $dayLimit = (int) config('panel.ticketing.max_per_day', 30);

        // Zero or less turns a limit OFF rather than blocking everything -
        // an installation writing 0 means "no cap", never "no tickets".
        if ($hourLimit <= 0 && $dayLimit <= 0) {
            return true;
        }

        $hourAgo = now()->subHour();
        $dayAgo = now()->subDay();

        $counts = Ticket::query()
            ->where('opened_by', $user->getAuthIdentifier())
            ->where('created_at', '>=', $dayAgo)
            ->selectRaw(
                'count(*) as daily, sum(case when created_at >= ? then 1 else 0 end) as hourly',
                [$hourAgo],
            )
            ->first();

        if ($hourLimit > 0 && (int) $counts->getAttribute('hourly') >= $hourLimit) {
            return false;
        }

        return $dayLimit <= 0 || (int) $counts->getAttribute('daily') < $dayLimit;
    }

    /**
     * Editing the RECORD - subject, priority, assignment - is operator work.
     * The opener's way to add to a ticket is the conversation, not this.
     */
    public function update(Authenticatable&Authorizable $user, ?Ticket $ticket = null): bool
    {
        if (! $this->hasTenant()) {
            return false;
        }

        if ($ticket !== null && ! $this->owns($ticket)) {
            return false;
        }

        return $this->may($user, 'update');
    }

    /**
     * REPLYING IS ITS OWN QUESTION, and it is the one the opener passes.
     *
     * Not folded into `update`, because they are different acts with
     * different audiences: adding a message is what the conversation is for,
     * changing the record is administration. A resolved ticket is closed to
     * both - reopening is an operator action, so a reply after resolution
     * cannot silently revive it.
     */
    public function reply(Authenticatable&Authorizable $user, Ticket $ticket): bool
    {
        if (! $this->hasTenant() || ! $this->owns($ticket)) {
            return false;
        }

        if ($ticket->status === Ticket::RESOLVED) {
            return false;
        }

        return $this->opened($user, $ticket) || $this->may($user, 'update');
    }

    /**
     * MAY YOU WRITE - AND READ - A NOTE THE CUSTOMER NEVER SEES.
     *
     * THE SHARPEST ABILITY IN THIS POLICY, and the reason it is its own
     * method. An internal note says things nobody writes for a customer:
     * "third time this month, escalate", "waive the fee, do not tell them
     * why". A ticketing system that leaks one has done more damage than one
     * that loses a ticket.
     *
     * SO IT IS THE OPERATOR'S GRANT AND NOTHING ELSE - never the opener's,
     * however the request arrives, and no matter that they may read every
     * other line of the same thread. Being the person who asked entitles you
     * to the conversation, not to the desk's private margin notes.
     *
     * READ AND WRITE ARE THE SAME QUESTION HERE, deliberately: anybody
     * entitled to write on the desk's side is on the desk. Splitting them
     * would create a role that can add notes and cannot see the ones already
     * there, which is worse than either.
     *
     * IT IS THE ABILITY ALONE THAT DECIDES, not the ability plus "and you did
     * not open this one". An operator who raises a ticket themselves is still
     * an operator, and the extra clause would have made this stricter than
     * `resolve` - two rules about the same side of the desk disagreeing about
     * where it ends.
     */
    public function note(Authenticatable&Authorizable $user, Ticket $ticket): bool
    {
        return $this->hasTenant()
            && $this->owns($ticket)
            && $this->may($user, 'update');
    }

    /**
     * RESOLUTION IS AN OPERATOR JUDGEMENT. The opener may reply forever and
     * may not close: a customer marking their own ticket resolved is a queue
     * reporting success nobody verified.
     */
    public function resolve(Authenticatable&Authorizable $user, Ticket $ticket): bool
    {
        return $this->hasTenant()
            && $this->owns($ticket)
            && $this->may($user, 'update');
    }

    /**
     * DELETING A TICKET DESTROYS THE RECORD OF A COMPLAINT, so it is the
     * narrowest grant here - never the opener's, whatever else they hold.
     */
    public function delete(Authenticatable&Authorizable $user, ?Ticket $ticket = null): bool
    {
        if (! $this->hasTenant()) {
            return false;
        }

        if ($ticket !== null && ! $this->owns($ticket)) {
            return false;
        }

        return $this->may($user, 'delete');
    }

    public function restore(Authenticatable&Authorizable $user, ?Ticket $ticket = null): bool
    {
        return $this->delete($user, $ticket);
    }

    public function forceDelete(Authenticatable&Authorizable $user, ?Ticket $ticket = null): bool
    {
        return $this->delete($user, $ticket);
    }

    private function hasTenant(): bool
    {
        return app(TenantContext::class)->currentKey() !== null;
    }

    /** The ticket belongs to the organisation this request resolved. */
    private function owns(Ticket $ticket): bool
    {
        $context = app(TenantContext::class);

        // Dedicated-database tenancy: the connection is the boundary and the
        // row carries no tenant column to compare - the same reading
        // `TenantResourcePolicy` takes.
        if (! $context->shouldScopeByColumn()) {
            return $context->isIsolated();
        }

        $key = $context->currentKey();

        return $key !== null && (string) $ticket->tenant_id === (string) $key;
    }

    private function opened(Authenticatable&Authorizable $user, Ticket $ticket): bool
    {
        return (string) $ticket->opened_by === (string) $user->getAuthIdentifier();
    }

    /**
     * DOES THIS PERSON HOLD THE ABILITY - asked through `Support\Ability`,
     * which carries the two notes that matter: why `hasPermission()` is tried
     * before `can()`, and why Spatie's team is set first. Both were got wrong
     * while promoting this file; read that class before changing this line.
     */
    private function may(Authenticatable&Authorizable $user, string $action): bool
    {
        return Ability::held($user, Abilities::name($action, 'tickets'));
    }
}
