<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Alxtexh\Panel\Actions\BulkAction;
use Alxtexh\Panel\Actions\BulkRunner;
use Alxtexh\Panel\Actions\ExportedFile;
use Alxtexh\Panel\Actions\JobStatus;
use Alxtexh\Panel\Jobs\ExportRecords;
use Alxtexh\Panel\Jobs\RunBulkAction;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Resources\Resource;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Bulk mutations and exports.
 *
 * THE INLINE / QUEUED SPLIT IS DECIDED BY WHETHER THE SET IS BOUNDED, not by a
 * row-count guess:
 *
 *   explicit ids       bounded by what a person can tick on screen → inline,
 *                      because a round trip that finishes in 40 ms should not
 *                      be handed to a worker and then polled for.
 *   select-all-matching unbounded → queued, because it can be the whole table.
 *
 * Counting first to choose would mean a full `COUNT(*)` on a filtered set
 * before doing any work, which is the blocking count §10 rejects everywhere
 * else in this codebase.
 *
 * NOTHING ABOUT WHAT AN ACTION DOES COMES FROM THE REQUEST. The client sends a
 * key; the mutation lives in the resource definition. This is the difference
 * between a bulk action and an arbitrary-write endpoint.
 */
final class BulkController extends Controller
{
    /** An explicit selection cannot exceed this; beyond it, select-all is the tool. */
    private const MAX_EXPLICIT_IDS = 1000;

    /**
     * How many explicitly-selected rows may still run inside the web request.
     *
     * THE ACTION DECIDES FIRST, because cost is a property of what the action
     * DOES rather than of how many rows were ticked: two hundred rows through
     * a handler that sends a message is slower than a thousand through a
     * column update. `BulkAction::queueThreshold()` is how an action says so.
     *
     * THE DEFAULT IS DELIBERATELY BELOW `MAX_EXPLICIT_IDS`, so the queued path
     * is reachable from an ordinary selection rather than only from
     * select-all. A threshold nobody crosses is a threshold nobody has tested,
     * which is the failure shape this codebase has paid for repeatedly.
     */
    private function queueThreshold(BulkAction $action): int
    {
        return $action->getQueueThreshold()
            ?? max(1, (int) config('panel.bulk.queue_threshold', 250));
    }

    public function run(Request $request, string $resource, BulkRunner $runner): JsonResponse
    {
        $class = $this->guard($resource);

        $validated = $request->validate([
            'action' => ['required', 'string', 'max:64'],
            'all' => ['sometimes', 'boolean'],
            'ids' => ['sometimes', 'array', 'max:'.self::MAX_EXPLICIT_IDS],
            'ids.*' => ['required'],
            'idempotencyKey' => ['sometimes', 'nullable', 'string', 'max:128'],
        ]);

        $definition = $class::definition();
        $action = $definition->bulkAction($validated['action']);

        if ($action === null || ! $action->isRunnable()) {
            throw new NotFoundHttpException("No bulk action [{$validated['action']}] on [{$resource}].");
        }

        // Deny-by-default: the ability is declared by the action and resolved
        // against the resource policy, exactly like a single-record write.
        abort_unless($class::can($action->getAbility()), 403);

        /*
         * WHAT THE ACTION'S FORM COLLECTED, validated against the DECLARATION
         * and reduced to its own keys - the same allow-list a record action
         * gets, and it matters more here: these values land on every row in the
         * selection rather than on one.
         */
        $data = $this->actionInput($request, $action);

        $all = (bool) ($validated['all'] ?? false);
        $ids = $this->ids($validated);

        if (! $all && $ids === []) {
            return response()->json(['message' => 'Nothing was selected.'], 422);
        }

        /*
         * THE THIRD CASE, WHICH USED TO FALL THROUGH TO "INLINE".
         *
         * The bounded/unbounded split above is right and was not the whole
         * rule: a selection can be BOUNDED AND STILL TOO BIG. A thousand rows
         * is the cap on what the client may send, and a thousand rows through
         * a handler that touches a relation or sends a message is not a 40ms
         * round trip - it is a request that runs until the web server's
         * timeout kills it halfway, leaving a partial write and a 504 with no
         * record of how far it got.
         *
         * STILL NOT A `COUNT(*)`. The count is `count($ids)` - a number
         * already in hand, which is why this can be decided without the
         * blocking count this codebase rejects everywhere else.
         *
         * PAST THE THRESHOLD THE IDS TRAVEL WITH THE JOB, unlike the
         * select-all case where the filters do. The set is explicit, so
         * re-deriving it from filters would apply the action to a different
         * set than the one that was ticked.
         */
        $queued = $all || count($ids) > $this->queueThreshold($action);

        if ($queued) {
            $token = JobStatus::startFor(
                $this->actorId(),
                "bulk:{$resource}:{$action->key}",
                $this->idempotencyKey($request, $validated),
                function (string $token) use ($resource, $action, $request, $data, $all, $ids): void {
                    RunBulkAction::dispatch(
                        $resource,
                        $action->key,
                        $this->filterParameters($request),
                        $this->actorId(),
                        $token,
                        $data,
                        $all ? [] : $ids,
                    );
                },
                $this->fingerprint([
                    'resource' => $resource,
                    'action' => $action->key,
                    'all' => $all,
                    'ids' => $ids,
                    'filters' => $this->filterParameters($request),
                    'data' => $data,
                ]),
            );

            $state = JobStatus::get($token, $this->actorId());

            return response()->json([
                'status' => $state['status'] ?? JobStatus::PENDING,
                'token' => $token,
            ]);
        }

        $list = $definition->toListQuery($class::model());

        $affected = $runner->run(
            $action,
            $list->matching($request, $ids),
            $class::model(),
            $list->keyColumnName(),
            null,
            $data,
            $action->authorizesIndividualRecords()
                ? static fn ($record): bool => $class::can($action->getAbility(), $record)
                : null,
        );

        return response()->json(['status' => JobStatus::DONE, 'affected' => $affected]);
    }

    /**
     * The values a bulk action's form collected.
     *
     * IDENTICAL IN SHAPE TO THE RECORD VERSION, deliberately: rules from the
     * declaration, `sanitize()` to drop everything else, and an action with no
     * form ignores input entirely. A second, subtly different allow-list would
     * be the one that turns out to be weaker.
     *
     * @return array<string, mixed>
     */
    private function actionInput(Request $request, BulkAction $action): array
    {
        $form = $action->formDefinition();

        if ($form === null) {
            return [];
        }

        $validated = validator(
            (array) $request->input('data', []),
            $form->rules(),
        )->validate();

        return $form->sanitize($validated);
    }

    /** Export the current filtered view. Always queued (addendum C). */
    public function export(Request $request, string $resource): JsonResponse
    {
        $class = $this->guard($resource);

        abort_unless($class::can('viewAny'), 403);

        $validated = $request->validate([
            'all' => ['sometimes', 'boolean'],
            'ids' => ['sometimes', 'array', 'max:'.self::MAX_EXPLICIT_IDS],
            'ids.*' => ['required'],
            'idempotencyKey' => ['sometimes', 'nullable', 'string', 'max:128'],
        ]);

        $ids = $this->ids($validated);
        $token = JobStatus::startFor(
            $this->actorId(),
            "export:{$resource}",
            $this->idempotencyKey($request, $validated),
            function (string $token) use ($resource, $request, $validated, $ids): void {
                ExportRecords::dispatch(
                    $resource,
                    $this->filterParameters($request),
                    ($validated['all'] ?? false) ? null : ($ids === [] ? null : $ids),
                    $this->actorId(),
                    $token,
                    $this->downloadPath($resource, $token),
                );
            },
            $this->fingerprint([
                'resource' => $resource,
                'all' => (bool) ($validated['all'] ?? false),
                'ids' => $ids,
                'filters' => $this->filterParameters($request),
            ]),
        );

        $state = JobStatus::get($token, $this->actorId());

        return response()->json([
            'status' => $state['status'] ?? JobStatus::PENDING,
            'token' => $token,
        ]);
    }

    /** Progress for a queued job. Owner-checked, so a leaked token is inert. */
    public function status(Request $request, string $resource, string $token): JsonResponse
    {
        $this->guard($resource);

        $state = JobStatus::get($token, $this->actorId());

        if ($state === null) {
            throw new NotFoundHttpException('No such job.');
        }

        return response()->json([
            'status' => $state['status'],
            'done' => $state['done'],
            'total' => $state['total'],
            'error' => $state['error'],
            'downloadable' => $state['file'] !== null,
            'download' => $state['file'] === null ? null : $this->downloadPath($resource, $token),
            'importable' => $state['importable'] ?? $state['total'],
            'failed' => $state['failed'] ?? 0,
            'failures' => $state['failures'] ?? [],
            'truncated' => $state['truncated'] ?? false,
            'written' => $state['written'] ?? $state['done'],
        ]);
    }

    public function cancel(Request $request, string $resource, string $token): JsonResponse
    {
        $this->guard($resource);

        if (! JobStatus::cancel($token, $this->actorId())) {
            throw new NotFoundHttpException('No cancelable job.');
        }

        return response()->json(['status' => JobStatus::CANCELED, 'token' => $token]);
    }

    /**
     * Download a finished export.
     *
     * The path is derived from the TOKEN alone and the token is owner-checked,
     * so there is no user-controlled component in the filename and nothing to
     * traverse with.
     */
    public function download(Request $request, string $resource, string $token): StreamedResponse
    {
        $class = $this->guard($resource);

        abort_unless($class::can('viewAny'), 403);

        /*
         * READ FROM THE TABLE, NOT FROM THE CACHE.
         *
         * This used to resolve the file through `JobStatus`, whose entries last
         * an hour. The CSV lasts until it is pruned, and the "your export is
         * ready" notification lasts until somebody reads it - so the ordinary
         * case of opening that notification the next morning was a 404 page for
         * a file sitting on disk. Ownership now lives exactly as long as the
         * bytes do; see `ExportedFile`.
         */
        $export = ExportedFile::find($token, $this->actorId());

        if ($export === null) {
            throw new NotFoundHttpException('No such export.');
        }

        $disk = Storage::disk($export['disk']);

        if (! $disk->exists($export['path'])) {
            throw new NotFoundHttpException('That export has expired.');
        }

        return $disk->download($export['path'], $class::key().'-'.now()->format('Y-m-d').'.csv');
    }

    /**
     * The parameters that describe the current view.
     *
     * Only the query string - a body cannot smuggle a filter the table never
     * offered, and pagination is dropped because a bulk action applies to the
     * whole filtered set rather than to the visible page.
     *
     * @return array<string, mixed>
     */
    private function filterParameters(Request $request): array
    {
        return array_diff_key($request->query(), array_flip(['cursor', 'page', 'per_page']));
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return list<int|string>
     */
    private function ids(array $validated): array
    {
        return array_values(array_filter(
            array_map(
                static fn ($id): int|string => is_numeric($id) ? (int) $id : (string) $id,
                (array) ($validated['ids'] ?? []),
            ),
            static fn ($id): bool => $id !== '' && $id !== 0,
        ));
    }

    private function actorId(): int|string
    {
        $id = Auth::id();

        abort_if($id === null, 401);

        return $id;
    }

    /** @param array<string, mixed> $validated */
    private function idempotencyKey(Request $request, array $validated): ?string
    {
        return isset($validated['idempotencyKey'])
            ? (string) $validated['idempotencyKey']
            : ($request->header('Idempotency-Key') ?: null);
    }

    /** @param array<string, mixed> $payload */
    private function fingerprint(array $payload): string
    {
        $normalize = function (mixed $value) use (&$normalize): mixed {
            if (! is_array($value)) {
                return $value;
            }

            $keys = array_keys($value);
            sort($keys);
            $normalized = [];

            foreach ($keys as $key) {
                $normalized[$key] = $normalize($value[$key]);
            }

            return $normalized;
        };

        return hash('sha256', json_encode($normalize($payload), JSON_THROW_ON_ERROR));
    }

    /** @return class-string<resource> */
    /**
     * Where this export will be downloadable from, including the portal prefix.
     *
     * BUILT FROM THE CURRENT PANEL rather than from the resource key alone. The
     * same resource is served at `/clients` in one portal and
     * `/reseller/clients` in another, so a path assembled without the prefix is
     * correct in exactly one of them - and it was being written into a
     * permanently stored notification.
     */
    private function downloadPath(string $resource, string $token): string
    {
        $prefix = app(PanelManager::class)->currentPanel()?->getPath() ?? '';

        return '/'.trim($prefix.'/'.$resource.'/jobs/'.$token.'/download', '/');
    }

    private function guard(string $resource): string
    {
        $class = app(PanelManager::class)->resource($resource);

        if ($class === null || ! $class::isEnabled()) {
            throw new NotFoundHttpException("No panel resource registered for [{$resource}].");
        }

        abort_unless($class::isAccessible(), 403);

        return $class;
    }
}
