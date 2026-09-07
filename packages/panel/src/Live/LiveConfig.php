<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Live;

use RuntimeException;

/**
 * How a resource stays fresh - the TRANSPORT only.
 *
 * WHY THIS EXISTS. An earlier version hardcoded Laravel Echo, which meant live
 * updates required a Reverb process before anything moved on screen, and an app
 * that did not want one got nothing. That is a dependency masquerading as a
 * feature.
 *
 * The patching rules in §8 - patch never replace, key by id, batch, do not
 * re-sort, pause when hidden, heal on reconnect - are entirely independent of
 * how a change ARRIVES. So the transport is a driver and the rules are shared.
 *
 *   DRIVER_NONE       Off. A list is as fresh as its last request.
 *
 *   DRIVER_POLL       The default, because it works everywhere with no infra.
 *                     NOT the polling §8 warns about: that warning is about
 *                     re-rendering a component server-side per viewer per tick.
 *                     This asks one lean indexed question - "which of these
 *                     visible ids changed since T" - and returns only changed
 *                     fields. Cost is a keyed index scan, not a render.
 *
 *   DRIVER_BROADCAST  Reverb, Pusher, Ably. True push, constant server cost
 *                     regardless of viewer count. Needs a running process, which
 *                     is why it is opt-in rather than assumed.
 *
 * Upgrading is a config change. No resource, page or component knows which
 * driver is active.
 */
final class LiveConfig
{
    public const DRIVER_NONE = 'none';

    public const DRIVER_POLL = 'poll';

    public const DRIVER_BROADCAST = 'broadcast';

    /**
     * Use the broadcaster if there is one, and poll if there is not.
     *
     * NEVER SURVIVES `fromConfig()`. It is a question, not a driver: it is
     * answered here and what leaves is `poll` or `broadcast`, so nothing
     * downstream - the client, the platform report, doctor - has to know the
     * word or repeat the reasoning.
     */
    public const DRIVER_AUTO = 'auto';

    /**
     * @param  string  $driver  none|poll|broadcast
     * @param  int  $intervalMs  Poll interval. Ignored by other drivers.
     * @param  int  $batchMs  Coalescing window, shared by every driver (§8 rule 4).
     * @param  string|null  $channel  Broadcast channel. MUST be tenant-scoped and private.
     * @param  list<string>  $events  Broadcast event names to listen for.
     */
    public function __construct(
        public readonly string $driver,
        public readonly int $intervalMs = 10_000,
        public readonly int $batchMs = 250,
        public readonly ?string $channel = null,
        public readonly array $events = [],
        public readonly bool $pauseWhenHidden = true,
    ) {
        if (! in_array($driver, [self::DRIVER_NONE, self::DRIVER_POLL, self::DRIVER_BROADCAST], true)) {
            throw new RuntimeException("Unknown live-update driver [{$driver}].");
        }

        if ($driver === self::DRIVER_BROADCAST && $channel === null) {
            /*
             * A broadcast driver with no channel would silently listen to
             * nothing - the classic failure this project is built against: no
             * error, a table that simply never updates, and an operator who
             * trusts it.
             */
            throw new RuntimeException(
                'The broadcast driver requires a channel. It must be private and tenant-scoped: '
                .'a public or tenant-agnostic channel is a cross-tenant leak that server-side '
                .'query scoping cannot catch.'
            );
        }

        if ($driver === self::DRIVER_POLL && $intervalMs < 1000) {
            throw new RuntimeException(
                "A poll interval of {$intervalMs}ms is a denial of service against your own database. "
                .'Use the broadcast driver if you need sub-second freshness.'
            );
        }
    }

    public static function off(): self
    {
        return new self(self::DRIVER_NONE);
    }

    public static function poll(int $intervalMs = 10_000): self
    {
        return new self(self::DRIVER_POLL, intervalMs: $intervalMs);
    }

    /** @param list<string> $events */
    public static function broadcast(string $channel, array $events): self
    {
        return new self(self::DRIVER_BROADCAST, channel: $channel, events: $events);
    }

    /**
     * Read from config, so an application chooses once for every resource.
     *
     * A resource can still override, but the common case is one decision in one
     * place - and moving from poll to Reverb should not touch any resource.
     */
    public static function fromConfig(): self
    {
        $driver = self::resolveDriver((string) config('panel.live.driver', self::DRIVER_AUTO));

        return new self(
            driver: $driver,
            intervalMs: (int) config('panel.live.interval_ms', 10_000),
            batchMs: (int) config('panel.live.batch_ms', 250),
            channel: config('panel.live.channel'),
            events: self::eventList(config('panel.live.events', [])),
            pauseWhenHidden: (bool) config('panel.live.pause_when_hidden', true),
        );
    }

    /** @return list<string> */
    private static function eventList(mixed $events): array
    {
        $out = [];

        foreach (is_array($events) ? $events : [] as $event) {
            if (is_string($event) && $event !== '') {
                $out[] = $event;
            }
        }

        return $out;
    }

    /**
     * `auto` decided: broadcast when this application really has a broadcaster.
     *
     * CONFIGURED IS NOT RUNNING, and that is the whole risk in choosing for
     * somebody. `BROADCAST_CONNECTION=reverb` says a connection is DEFINED; it
     * does not say a Reverb process is up. Polling degrades - a slow tick is a
     * slow tick - and broadcast does not: with nothing listening, a list is
     * silently static and looks identical to one where nothing changed.
     *
     * So the test is deliberately strict. Laravel's own defaults (`null`,
     * `log`) mean no, an unknown connection name means no, and a connection
     * whose credentials are blank means no - a `.env` that names `pusher` and
     * carries no key is one somebody has not finished, and answering `yes` to
     * it turns their panel static.
     *
     * ANYTHING EXPLICIT WINS. `PANEL_LIVE_DRIVER=poll` on a machine with Reverb
     * running is a legitimate choice, and this must not overrule it.
     */
    public static function resolveDriver(string $configured): string
    {
        if ($configured !== self::DRIVER_AUTO) {
            return $configured;
        }

        $connection = (string) config('broadcasting.default', 'null');

        if (in_array($connection, ['null', 'log', ''], true)) {
            return self::DRIVER_POLL;
        }

        $settings = (array) config("broadcasting.connections.{$connection}", []);

        if ($settings === []) {
            return self::DRIVER_POLL;
        }

        /*
         * THE CREDENTIAL THAT PROVES IT IS SET UP, per driver. Reverb and
         * Pusher both need a key; Ably needs a key; a redis connection needs
         * nothing beyond the redis config Laravel already validates.
         */
        $needsKey = in_array($settings['driver'] ?? $connection, ['reverb', 'pusher', 'ably'], true);

        if ($needsKey && blank($settings['key'] ?? null)) {
            return self::DRIVER_POLL;
        }

        /*
         * AND A CHANNEL, WHICH ONLY THE APPLICATION CAN NAME.
         *
         * This condition is not a nicety; without it `auto` is a crash. The
         * constructor REFUSES the broadcast driver with no channel - by design,
         * because a public or tenant-agnostic channel is a cross-tenant leak
         * that server-side scoping cannot catch - so an application with Reverb
         * configured and no `panel.live.channel` would have every screen that
         * builds a `LiveConfig` throw a 500. It did, the moment this was
         * written, across ten tests.
         *
         * A broadcaster is evidence the application broadcasts SOMETHING. The
         * channel is the only evidence that it broadcasts THIS.
         */
        if (blank(config('panel.live.channel'))) {
            return self::DRIVER_POLL;
        }

        return self::DRIVER_BROADCAST;
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'driver' => $this->driver,
            'intervalMs' => $this->intervalMs,
            'batchMs' => $this->batchMs,
            'channel' => $this->channel,
            'events' => $this->events,
            'pauseWhenHidden' => $this->pauseWhenHidden,
        ];
    }
}
