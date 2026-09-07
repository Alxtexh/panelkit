<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Support\Facades\DB;
use Alxtexh\Panel\Alerts\Telegram;

/**
 * Turns the monitoring page's snapshot into history and alerts - roadmap 5.3.
 *
 * "DISK AT 91%" USED TO BE A FACT ONLY THE PERSON LOOKING AT THE SCREEN
 * KNEW, at the moment they happened to look. This runs on the scheduler
 * instead: every sample is a row (yesterday becomes visible), and a metric
 * CROSSING its threshold is a Telegram message (nobody has to be looking).
 *
 * ALERTS FIRE ON THE CROSSING, NOT THE STATE. Comparing each sample to the
 * PREVIOUS one means "disk went from 89% to 91%" sends one message, and the
 * next fifty samples above the line send none - a threshold that alerts on
 * every breach-side sample is a channel people mute by Thursday. The
 * recovery edge sends too ("back under"), because an alert whose all-clear
 * never arrives leaves somebody checking a dashboard that is already fine.
 *
 * THE PREVIOUS ROW IS THE STATE. No flags table, no cache entry: the last
 * sample already says which side of the line the world was on, and state
 * that cannot drift from the data is state nobody has to reconcile.
 *
 * THRESHOLDS COME FROM CONFIG with defaults that suit a small host. They are
 * deliberately not per-tenant - these are host metrics, and the host is
 * shared.
 */
final class MonitorSampler
{
    private const TABLE = 'panel_monitor_samples';

    /** Samples older than this are pruned on every run. */
    private const KEEP_DAYS = 7;

    public function __construct(private readonly HealthReport $report) {}

    /**
     * Measure, store, prune, and alert on any threshold crossed since the
     * previous sample. Returns the stored row.
     *
     * @return array<string, mixed>
     */
    public function sample(): array
    {
        $health = $this->report->all();

        $row = [
            'cpu_pct' => $health['cpu']['percent'] ?? null,
            'memory_pct' => $health['memory']['percent'] ?? null,
            'disk_pct' => $health['disk']['percent'] ?? null,
            'queue_waiting' => $health['queue']['pending'] ?? null,
            'failed_jobs' => $health['queue']['failed'] ?? null,
            'db_ms' => $health['database']['latency_ms'] ?? null,
        ];

        $previous = DB::table(self::TABLE)->latest('created_at')->latest('id')->first();

        DB::table(self::TABLE)->insert([...$row, 'created_at' => now()]);

        DB::table(self::TABLE)->where('created_at', '<', now()->subDays(self::KEEP_DAYS))->delete();

        $this->alertOnCrossings($previous ? (array) $previous : null, $row);

        return $row;
    }

    /**
     * The last day of samples, oldest first, for the monitoring page's
     * trend strip.
     *
     * @return list<array<string, mixed>>
     */
    public function history(int $hours = 24): array
    {
        $rows = DB::table(self::TABLE)
            ->where('created_at', '>=', now()->subHours($hours))
            ->orderBy('created_at')
            ->get(['cpu_pct', 'memory_pct', 'disk_pct', 'queue_waiting', 'failed_jobs', 'db_ms', 'created_at'])
            ->map(static fn (object $row): array => (array) $row)
            ->all();

        $history = [];
        foreach ($rows as $row) {
            $history[] = $row;
        }

        return $history;
    }

    /** @return array<string, int> metric => threshold */
    public static function thresholds(): array
    {
        return [
            'disk_pct' => (int) config('panel.monitoring.thresholds.disk_pct', 90),
            'memory_pct' => (int) config('panel.monitoring.thresholds.memory_pct', 90),
            'failed_jobs' => (int) config('panel.monitoring.thresholds.failed_jobs', 1),
        ];
    }

    /**
     * @param  array<string, mixed>|null  $previous
     * @param  array<string, mixed>  $current
     */
    private function alertOnCrossings(?array $previous, array $current): void
    {
        $labels = [
            'disk_pct' => ['Disk usage', '%'],
            'memory_pct' => ['Memory usage', '%'],
            'failed_jobs' => ['Failed jobs', ''],
        ];

        foreach (self::thresholds() as $metric => $threshold) {
            $now = $current[$metric] ?? null;

            if ($now === null) {
                continue;
            }

            /*
             * A missing previous sample counts as BELOW the line: the very
             * first sample on a host already past its threshold should say
             * so, rather than waiting for a second breach that may be weeks
             * of silence away.
             */
            $was = $previous[$metric] ?? null;
            $wasOver = $was !== null && (int) $was >= $threshold;
            $isOver = (int) $now >= $threshold;

            [$label, $unit] = $labels[$metric];

            if ($isOver && ! $wasOver) {
                Telegram::send(sprintf(
                    '⚠ %s is at %s%s (threshold %s%s) on %s.',
                    $label, $now, $unit, $threshold, $unit, config('app.name'),
                ));
            }

            if (! $isOver && $wasOver) {
                Telegram::send(sprintf(
                    '✓ %s is back under its threshold at %s%s on %s.',
                    $label, $now, $unit, config('app.name'),
                ));
            }
        }
    }
}
