<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Inertia\Inertia;
use Inertia\Response;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Support\Ability;
use Alxtexh\Panel\Support\PanelSettings;
use Alxtexh\Panel\Trash\TrashBin;

/**
 * One screen for everything that was deleted.
 *
 * WHY IT IS A SCREEN OF ITS OWN rather than a filter on each list: a delete has
 * to go somewhere a person can find it later WITHOUT remembering which resource
 * it was. "I deleted something yesterday and I need it back" is the actual
 * question, and answering it by asking somebody to guess the right table and
 * then open the right filter is not answering it.
 *
 * IT IS PER PORTAL, like every other panel screen. A reseller's trash contains
 * the reseller portal's resources, not the admin portal's - the bin cannot
 * become the one place where a panel's boundary stops applying.
 *
 * ONE RECORD AT A TIME GOES THROUGH THE EXISTING ROUTES. Restore and
 * force-delete already exist on the record endpoints, policy-checked per record,
 * and duplicating them would mean two endpoints that can disagree about who may
 * resurrect something.
 *
 * A SELECTION DOES NOT, and that is why the bulk endpoints below exist. Emptying
 * a bin one row at a time is forty requests and forty confirmations, so people
 * either do not do it or write a script - and the second is worse. They call the
 * SAME policy per record rather than checking once for the set: a selection is a
 * list of records, and "may this person restore these forty" is forty questions
 * whatever the interface suggests.
 */
final class TrashController extends Controller
{
    /**
     * Restore a selection.
     *
     * CHECKED PER RECORD, not once for the resource. A policy may permit
     * restoring your own records and not somebody else's, and a bulk endpoint
     * that asked the class-level question would quietly widen that.
     *
     * PARTIAL SUCCESS IS REPORTED HONESTLY. Some of a selection may be refused,
     * and the response says how many were restored rather than claiming the
     * whole set - a bulk action that reports success for records it skipped is
     * how somebody finds out weeks later that four of them never came back.
     */
    public function restore(Request $request, TrashBin $bin): RedirectResponse
    {
        [$class, $records] = $this->selection($request, $bin);

        $restored = 0;

        foreach ($records as $record) {
            if (! $class::can('restore', $record)) {
                continue;
            }

            if (! method_exists($record, 'restore')) {
                continue;
            }

            $record->restore();
            $restored++;
        }

        return back()->with('success', $this->outcome($restored, count($records), 'restored'));
    }

    /**
     * Delete a selection permanently.
     *
     * THE ONE ACT IN THE PANEL WITH NO UNDO, which is why it has its own ability
     * rather than sharing `delete` - plenty of roles should be able to remove a
     * record without being able to destroy one. The confirmation is the screen's
     * job; this is the gate.
     */
    public function destroy(Request $request, TrashBin $bin): RedirectResponse
    {
        [$class, $records] = $this->selection($request, $bin);

        $deleted = 0;

        foreach ($records as $record) {
            if (! $class::can('forceDelete', $record)) {
                continue;
            }

            $record->forceDelete();
            $deleted++;
        }

        return back()->with('success', $this->outcome($deleted, count($records), 'permanently deleted'));
    }

    /**
     * How long the bin keeps things.
     *
     * AN OPERATIONAL DECISION RATHER THAN A DEPLOYMENT ONE. Whoever runs the
     * panel knows how long their people take to notice a mistake, and that
     * answer should not need a deploy - so it is a setting, defaulting to
     * config and clamped between a week and a month by `TrashBin` itself.
     *
     * BEHIND `manage_backups`, the existing ability for "may destroy and restore
     * data at the installation level". Retention is the same category of
     * decision: shortening it destroys records sooner, and the person who may do
     * that is the person who may already restore over a live database.
     */
    public function updateSettings(Request $request, PanelSettings $settings): RedirectResponse
    {
        abort_unless(Ability::allows($request->user(), 'manage_backups'), 403);

        $validated = $request->validate([
            'days' => [
                'required',
                'integer',
                'between:'.TrashBin::MINIMUM_DAYS.','.TrashBin::MAXIMUM_DAYS,
            ],
        ]);

        $settings->put('trash.retention_days', (int) $validated['days'], (string) $request->user()?->getKey());

        return back()->with('success', 'Deleted records are now kept for '.$validated['days'].' days.');
    }

    public function index(Request $request, TrashBin $bin, PanelManager $panels): Response
    {
        $panel = $panels->currentPanel();

        $groups = $bin->groups($panel?->id);

        /*
         * WHICH TAB, FROM THE REQUEST, AND VALIDATED AGAINST THE TABS - roadmap
         * 5.2.
         *
         * The screen used to pick the tab client-side out of a payload that
         * already held every resource's rows. Paging needs the server to know
         * which resource is on screen, so the choice moves into the URL - which
         * also makes a tab linkable and survive a reload, the same properties
         * every other list already has.
         *
         * A KEY THAT IS NOT A TAB FALLS BACK TO THE FIRST rather than 404ing. A
         * resource can empty while somebody is looking at it - they restored the
         * last row, or the pruner ran - and answering "not found" for a screen
         * that plainly exists is worse than showing them what is left.
         */
        $keys = array_column($groups, 'key');
        $requested = (string) $request->query('resource', '');
        $resource = in_array($requested, $keys, true) ? $requested : ($keys[0] ?? null);

        $page = $resource === null
            ? ['records' => [], 'nextCursor' => null]
            : $bin->records($resource, (string) $request->query('cursor', '') ?: null, $panel?->id);

        return Inertia::render('Trash', [
            'groups' => $groups,

            // The tab on screen, so a reload and a shared link both land back
            // on it rather than on whichever resource happens to be first.
            'resource' => $resource,

            // So the pagination control's "showing 26-50" arithmetic uses the
            // server's page size rather than a number the client restates.
            'perPage' => TrashBin::PER_PAGE,

            ...$page,

            /*
             * THE PORTAL PREFIX TRAVELS WITH THE PAGE. Restore posts to
             * `{prefix}/{resource}/{id}/restore`, and a client that assembled
             * that itself would be right in the portal mounted at the root and
             * wrong in every other - the same bug the export download had.
             */
            'prefix' => '/'.trim((string) ($panel?->getPath() ?? ''), '/'),

            /*
             * THE DEADLINE IS STATED, not implied. A bin whose contents vanish
             * on a schedule nobody published is a bin people learn not to rely
             * on - and the number here is the one the pruner actually uses.
             */
            'retentionDays' => TrashBin::retentionDays(),

            /*
             * THE BOUNDS TRAVEL WITH THE PAGE so the control cannot offer a
             * value the server will refuse. A form whose range disagrees with
             * the validator is one that reports a mistake the person could not
             * have avoided.
             */
            'retentionRange' => [
                'min' => TrashBin::MINIMUM_DAYS,
                'max' => TrashBin::MAXIMUM_DAYS,
            ],

            'canConfigure' => (bool) Ability::allows(request()->user(), 'manage_backups'),
        ]);
    }

    /**
     * The records a bulk request names, still scoped and still trashed.
     *
     * THE IDS ARE A FILTER OVER WHAT THIS PERSON CAN ALREADY SEE, never a list
     * of what to act on. The query runs through the model, so the tenant scope
     * applies and another organisation's ids simply match nothing - the same
     * property the bulk endpoints on the tables have.
     *
     * @return array{0: class-string<\Alxtexh\Panel\Resources\Resource>, 1: Collection<int, \Illuminate\Database\Eloquent\Model>}
     */
    private function selection(Request $request, TrashBin $bin): array
    {
        $validated = $request->validate([
            'resource' => ['required', 'string'],
            'ids' => ['required', 'array', 'max:500'],
            'ids.*' => ['required'],
        ]);

        $resources = $bin->resources(app(PanelManager::class)->currentPanel()?->id);

        $class = $resources[$validated['resource']] ?? null;

        // Not in this panel's bin: unknown key, hard-deleting resource, or
        // another portal's. All three are "no such thing here".
        abort_if($class === null, 404);

        abort_unless($class::can('viewAny'), 403);

        $model = $class::model();
        $query = $model::query();
        $deletedAt = $bin->deletedColumnFor($model);

        $records = $query
            // `onlyTrashed()` is installed as an Eloquent builder macro by
            // SoftDeletingScope, so `method_exists()` cannot detect it. The
            // resource has already been filtered to SoftDeletes models above;
            // use the explicit scope predicate here so restore works for
            // custom builders and remains visible to static analysis.
            ->withoutGlobalScope(SoftDeletingScope::class)
            ->whereNotNull($deletedAt)
            ->whereIn((new $model)->getKeyName(), $validated['ids'])
            ->get();

        return [$class, $records];
    }

    /**
     * What to tell somebody when part of a selection was refused.
     *
     * A BULK ACTION THAT REPORTS SUCCESS FOR RECORDS IT SKIPPED is how somebody
     * finds out weeks later that four of them never came back.
     */
    private function outcome(int $done, int $asked, string $verb): string
    {
        if ($done === $asked) {
            return $done.' record(s) '.$verb.'.';
        }

        return $done.' of '.$asked.' record(s) '.$verb.'; the rest were refused by their policy.';
    }
}
