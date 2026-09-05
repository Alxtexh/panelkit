<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Actions;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Alxtexh\Panel\Support\OperationMetrics;

/**
 * Progress for a queued bulk action or export.
 *
 * EVERY READ IS OWNER-CHECKED. A status token is an unguessable string, but
 * "unguessable" is not an authorization model - it is a delay. The record
 * carries the id of the user who started the work and `get()` returns null for
 * anyone else, so a leaked token in a shared log or a copied URL still cannot
 * be used to watch someone else's job or reach the export it produced.
 *
 * Cache rather than a table, because progress is genuinely ephemeral: it is
 * read for the seconds a job runs and never again. The TTL is the cleanup, and
 * losing a status record costs a re-run rather than data - the mutation itself
 * lives in the database, not here.
 */
final class JobStatus
{
    public const PENDING = 'pending';

    public const RUNNING = 'running';

    public const DONE = 'done';

    public const FAILED = 'failed';

    public const CANCELED = 'canceled';

    /** Long enough to outlive any job a panel should be running synchronously. */
    private const TTL = 3600;

    public static function token(): string
    {
        return (string) Str::uuid();
    }

    /**
     * Start work once for an owner, operation kind, and optional retry key.
     * The callback runs only when this call actually creates the job.
     */
    public static function startFor(
        int|string $ownerId,
        string $kind,
        ?string $idempotencyKey = null,
        ?callable $onStarted = null,
        ?string $fingerprint = null,
    ): string
    {
        $idempotencyKey = trim((string) $idempotencyKey);

        if ($idempotencyKey === '') {
            $token = self::token();
            self::start($token, $ownerId, $kind);
            if ($onStarted !== null) {
                try {
                    $onStarted($token);
                } catch (\Throwable $exception) {
                    self::fail($token, $exception->getMessage());
                    throw $exception;
                }
            }

            return $token;
        }

        $indexKey = self::idempotencyKey($ownerId, $kind, $idempotencyKey);

        // Cache::lock makes the check-and-create atomic on Redis, database,
        // file, and array stores. Without it, two workers retrying together
        // could both observe a missing index and dispatch duplicate work.
        return Cache::lock($indexKey.':lock', 10)->block(5, function () use (
            $indexKey,
            $ownerId,
            $kind,
            $onStarted,
            $fingerprint,
        ): string {
            $existing = Cache::get($indexKey);

            if (is_array($existing) && isset($existing['token'])) {
                $existingToken = (string) $existing['token'];

                if ($fingerprint !== null && ($existing['fingerprint'] ?? null) !== $fingerprint) {
                    throw new ConflictHttpException('This idempotency key was already used for a different request.');
                }

                if (self::get($existingToken, $ownerId) !== null) {
                    return $existingToken;
                }
            } elseif (is_string($existing) && self::get($existing, $ownerId) !== null) {
                // Read indexes written by older versions during the rollout.
                return $existing;
            }

            $token = self::token();
            self::start($token, $ownerId, $kind, $fingerprint);
            Cache::put($indexKey, ['token' => $token, 'fingerprint' => $fingerprint], self::TTL);

            if ($onStarted !== null) {
                try {
                    $onStarted($token);
                } catch (\Throwable $exception) {
                    self::fail($token, $exception->getMessage());
                    Cache::forget($indexKey);
                    throw $exception;
                }
            }

            return $token;
        });
    }

    public static function start(string $token, int|string $ownerId, string $kind, ?string $fingerprint = null): void
    {
        self::put($token, [
            'status' => self::PENDING,
            'kind' => $kind,
            'operation' => $kind,
            'owner' => (string) $ownerId,
            'done' => 0,
            'total' => null,
            'progress' => 0,
            'message' => null,
            'error' => null,
            'failure' => null,
            'file' => null,
            'fingerprint' => $fingerprint,
            'cursor' => null,
            'startedAt' => now()->toIso8601String(),
            'finishedAt' => null,
        ]);

        OperationMetrics::record($kind, 'started', ['owner' => (string) $ownerId, 'token' => $token]);
    }

    public static function progress(string $token, int $done, ?int $total = null): void
    {
        $state = self::raw($token);

        if ($state === null) {
            return;
        }

        self::put($token, [
            ...$state,
            'status' => self::RUNNING,
            'done' => $done,
            'total' => $total ?? $state['total'],
            'progress' => ($total ?? $state['total']) > 0
                ? min(100, (int) round(($done / (int) ($total ?? $state['total'])) * 100))
                : null,
        ]);

    }

    /**
     * Persist a resumable execution checkpoint alongside normal progress.
     *
     * Checkpoints are deliberately opaque to the status endpoint: jobs decide
     * what their cursor means, while the owner still gets one consistent
     * lifecycle envelope. The bounded list prevents a long-running job from
     * turning its status record into an unbounded payload.
     *
     * @param  array<int|string>  $processed
     */
    public static function checkpoint(string $token, array $processed): void
    {
        $state = self::raw($token);

        if ($state === null) {
            return;
        }

        $state['checkpoint'] = array_values(array_slice(array_unique($processed, SORT_REGULAR), -100_000));
        self::put($token, $state);
    }

    /** Persist the last committed cursor for a resumable keyset scan. */
    public static function cursor(string $token, int|string|null $cursor): void
    {
        $state = self::raw($token);

        if ($state === null) {
            return;
        }

        self::put($token, [
            ...$state,
            'cursor' => $cursor === null ? null : (string) $cursor,
        ]);
    }

    /** @param array<string, mixed> $extra */
    public static function finish(string $token, array $extra = []): void
    {
        $state = self::raw($token);

        if ($state === null) {
            return;
        }

        self::put($token, [
            ...$state,
            ...$extra,
            'status' => self::DONE,
            'progress' => 100,
            'finishedAt' => now()->toIso8601String(),
        ]);

        OperationMetrics::record((string) ($state['operation'] ?? $state['kind'] ?? 'unknown'), 'completed', [
            'owner' => (string) ($state['owner'] ?? ''),
            'token' => $token,
            'done' => $extra['done'] ?? $state['done'] ?? null,
        ]);
    }

    public static function fail(string $token, string $message): void
    {
        $state = self::raw($token) ?? [
            'owner' => '', 'kind' => 'unknown', 'operation' => 'unknown', 'done' => 0,
            'total' => null, 'progress' => null, 'file' => null,
        ];

        self::put($token, [
            ...$state,
            'status' => self::FAILED,
            'error' => $message,
            'failure' => $message,
            'message' => $message,
            'finishedAt' => now()->toIso8601String(),
        ]);

        OperationMetrics::record((string) ($state['operation'] ?? $state['kind'] ?? 'unknown'), 'failed', [
            'owner' => (string) ($state['owner'] ?? ''),
            'token' => $token,
            'error' => $message,
        ]);
    }

    /** Cancel a live job only when the caller owns its status record. */
    public static function cancel(string $token, int|string $ownerId): bool
    {
        $state = self::get($token, $ownerId);

        if ($state === null || in_array($state['status'], [self::DONE, self::FAILED, self::CANCELED], true)) {
            return false;
        }

        self::put($token, [
            ...$state,
            'status' => self::CANCELED,
            'error' => 'Canceled by the operator.',
            'failure' => null,
            'message' => 'Canceled by the operator.',
            'finishedAt' => now()->toIso8601String(),
        ]);

        OperationMetrics::record((string) ($state['operation'] ?? $state['kind'] ?? 'unknown'), 'canceled', [
            'owner' => (string) $ownerId,
            'token' => $token,
        ]);

        return true;
    }

    public static function isCanceled(string $token): bool
    {
        return (self::raw($token)['status'] ?? null) === self::CANCELED;
    }

    /**
     * The status, but only for the user who started it.
     *
     * @return array<string, mixed>|null
     */
    public static function get(string $token, int|string $ownerId): ?array
    {
        $state = self::raw($token);

        if ($state === null || ! hash_equals((string) $state['owner'], (string) $ownerId)) {
            return null;
        }

        return $state;
    }

    /** @return array<string, mixed>|null */
    private static function raw(string $token): ?array
    {
        /** @var array<string, mixed>|null $state */
        $state = Cache::get(self::key($token));

        return $state;
    }

    /** @param array<string, mixed> $state */
    private static function put(string $token, array $state): void
    {
        Cache::put(self::key($token), $state, self::TTL);
    }

    private static function key(string $token): string
    {
        return "panel:job:{$token}";
    }

    private static function idempotencyKey(int|string $ownerId, string $kind, string $key): string
    {
        return 'panel:job:idempotency:'.hash('sha256', implode('|', [(string) $ownerId, $kind, $key]));
    }
}
