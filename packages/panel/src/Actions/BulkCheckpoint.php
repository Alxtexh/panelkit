<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Actions;

use Illuminate\Support\Facades\DB;

/**
 * Durable exactly-once markers for queued bulk-action chunks.
 *
 * JobStatus is intentionally cache-backed because its progress is ephemeral.
 * A mutation checkpoint is different: it must survive a worker restart and it
 * must commit with the mutation. The unique token/cursor pair makes a retried
 * chunk a no-op after the original transaction committed.
 */
final class BulkCheckpoint
{
    private const TABLE = 'panel_bulk_action_checkpoints';

    /** Claim a chunk inside the caller's transaction. */
    public static function claim(string $token, int|string|null $cursor): bool
    {
        $cursor = (string) $cursor;

        $inserted = DB::table(self::TABLE)->insertOrIgnore([
            'token' => $token,
            'cursor' => $cursor,
            'status' => 'running',
            'selected' => 0,
            'authorized' => 0,
            'affected' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($inserted === 1) {
            return true;
        }

        $existing = DB::table(self::TABLE)
            ->where('token', $token)
            ->where('cursor', $cursor)
            ->lockForUpdate()
            ->first();

        // A committed marker means the mutation is already complete. A stale
        // running marker is safe to reclaim because this method is called in
        // the same transaction that owns the mutation.
        return $existing === null || $existing->status !== 'done';
    }

    /** Complete the marker in the same transaction as the chunk mutation. */
    public static function complete(
        string $token,
        int|string|null $cursor,
        int $selected,
        int $authorized,
        int $affected,
    ): void {
        DB::table(self::TABLE)
            ->where('token', $token)
            ->where('cursor', (string) $cursor)
            ->update([
                'status' => 'done',
                'selected' => $selected,
                'authorized' => $authorized,
                'affected' => $affected,
                'updated_at' => now(),
            ]);
    }

    /** @return array{selected: int, authorized: int, affected: int, skipped: int} */
    public static function totals(string $token): array
    {
        $totals = DB::table(self::TABLE)
            ->where('token', $token)
            ->where('status', 'done')
            ->selectRaw('COALESCE(SUM(selected), 0) as selected')
            ->selectRaw('COALESCE(SUM(authorized), 0) as authorized')
            ->selectRaw('COALESCE(SUM(affected), 0) as affected')
            ->first();

        $selected = (int) ($totals->selected ?? 0);
        $authorized = (int) ($totals->authorized ?? 0);
        $affected = (int) ($totals->affected ?? 0);

        return [
            'selected' => $selected,
            'authorized' => $authorized,
            'affected' => $affected,
            'skipped' => $selected - $authorized,
        ];
    }

    /** Remove markers after a successful operation has been finalized. */
    public static function forget(string $token): void
    {
        DB::table(self::TABLE)->where('token', $token)->delete();
    }
}
