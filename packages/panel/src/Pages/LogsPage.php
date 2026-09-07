<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Pages;

use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\LogReader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Read-only application log tail. OFF until `Panel::logTail()` / `apps(['logs'])`.
 *
 * Ability-gated with `view_operations`. Files come from an allow-list (default:
 * `storage/logs/*.log` basenames only). No arbitrary path from the client.
 */
class LogsPage extends Page
{
    protected static string $icon = 'scroll-text';

    protected static ?string $group = 'Operations';

    protected static ?int $sort = 25;

    public static function uri(): string
    {
        return 'apps/logs';
    }

    public static function label(): string
    {
        return 'Logs';
    }

    public static function component(): string
    {
        return 'Logs';
    }

    public static function isEnabled(): bool
    {
        $panel = app(PanelManager::class)->panel(static::panel());

        return $panel !== null && $panel->offersApp('logs');
    }

    public static function ability(): ?string
    {
        return 'view_operations';
    }

    public static function heading(): ?string
    {
        return 'Logs';
    }

    public static function description(): ?string
    {
        return 'The last part of each file. Reading only.';
    }

    /**
     * @return array<string, string|null>
     */
    public static function actions(): array
    {
        return [
            'tail' => 'view_operations',
        ];
    }

    public static function actionUris(): array
    {
        return [
            'tail' => 'tail',
        ];
    }

    public static function actionMethods(): array
    {
        return [
            'tail' => 'get',
        ];
    }

    /**
     * @return array{
     *     routes: array{logs: string, tail: string},
     *     files: list<array{name: string, bytes: int, at: string}>,
     *     tail: array{name: string|null, lines: list<string>, truncated: bool},
     *     query: string,
     *     tier: string,
     *     pollSeconds: int
     * }
     */
    public static function data(Request $request): array
    {
        $reader = self::reader();
        $file = self::requestedFile($request);

        return [
            'routes' => [
                'logs' => self::pageHref(),
                'tail' => self::pageHref().'/tail',
            ],
            'files' => $reader->files(),
            'tail' => $reader->tail(
                $file,
                lines: max(50, min(2000, (int) $request->query('lines', 300))),
                needle: (string) $request->query('q', ''),
                tier: self::requestedTier($request),
            ),
            'query' => (string) $request->query('q', ''),
            'tier' => self::requestedTier($request),
            'pollSeconds' => 5,
        ];
    }

    public static function tail(Request $request): JsonResponse
    {
        $reader = self::reader();
        $file = self::requestedFile($request);

        return response()->json($reader->tail(
            $file,
            lines: max(50, min(2000, (int) $request->query('lines', 300))),
            needle: (string) $request->query('q', ''),
            tier: self::requestedTier($request),
        ));
    }

    private static function reader(): LogReader
    {
        $panel = app(PanelManager::class)->panel(static::panel());

        return new LogReader(
            allowlist: $panel?->getLogTailAllowlist(),
        );
    }

    private static function requestedFile(Request $request): ?string
    {
        $fromQuery = $request->query('file');

        if (is_string($fromQuery) && $fromQuery !== '') {
            return $fromQuery;
        }

        $panel = app(PanelManager::class)->panel(static::panel());

        return $panel?->getLogTailDefault();
    }

    /** One of `error`, `warning`, `info`, `debug`, or empty for every level. */
    private static function requestedTier(Request $request): string
    {
        $tier = (string) $request->query('tier', '');

        return in_array($tier, ['error', 'warning', 'info', 'debug'], true) ? $tier : '';
    }

    protected static function pageHref(): string
    {
        $path = '/'.trim(static::uri(), '/');
        $prefix = app(PanelManager::class)->currentPanel()?->getPath()
            ?? app(PanelManager::class)->panel(static::panel())?->getPath()
            ?? '';

        if ($prefix !== '' && $prefix !== '/') {
            $path = rtrim($prefix, '/').$path;
        }

        if (! str_starts_with($path, '/')) {
            $path = '/'.$path;
        }

        return $path;
    }
}
