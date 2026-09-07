<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Pages;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Alxtexh\Panel\Api\ApiToken;
use Alxtexh\Panel\Notifications\Notification;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\Abilities;
use Alxtexh\Panel\Support\TenantContext;

/**
 * API keys for the public API. Wraps `ApiToken`. OFF until `apps(['api-keys'])`.
 *
 * Override `keys()`, `issue()`, and `revoke()` to use your own store. Defaults
 * read and write `panel_api_tokens` for the current tenant.
 */
class ApiKeysPage extends Page
{
    protected static string $icon = 'key';

    protected static ?string $group = 'Developer';

    public static function uri(): string
    {
        return 'apps/api-keys';
    }

    public static function label(): string
    {
        return 'API keys';
    }

    public static function component(): string
    {
        return 'ApiKeys';
    }

    public static function isEnabled(): bool
    {
        $panel = app(PanelManager::class)->panel(static::panel());

        return $panel !== null && $panel->offersApp('api-keys');
    }

    public static function actions(): array
    {
        return [
            'create' => 'manage_api_keys',
            'destroy' => 'manage_api_keys',
        ];
    }

    public static function actionUris(): array
    {
        return [
            'create' => 'create',
            'destroy' => 'destroy',
        ];
    }

    /**
     * @return list<array{id: int|string, name: string, prefix: string, abilities: list<string>, last_used_at: ?string, expires_at: ?string}>
     */
    public static function keys(Request $request): array
    {
        $tenantId = app(TenantContext::class)->currentKey();

        if ($tenantId === null) {
            return [];
        }

        $keys = [];

        foreach (ApiToken::query()
            ->where('tenant_id', $tenantId)
            ->orderByDesc('id')
            ->get() as $token) {
            $keys[] = [
                'id' => $token->id,
                'name' => $token->name,
                'prefix' => $token->prefix,
                'abilities' => $token->abilities,
                'last_used_at' => $token->last_used_at?->toIso8601String(),
                'expires_at' => $token->expires_at?->toIso8601String(),
            ];
        }

        return $keys;
    }

    /**
     * @param  array{name: string, abilities: list<string>}  $input
     * @return array{plaintext: string}
     */
    public static function issue(array $input): array
    {
        $tenantId = app(TenantContext::class)->currentKey();
        $user = auth()->user();

        abort_if($tenantId === null || $user === null, 403);

        $issued = ApiToken::issue(
            $tenantId,
            (int) $user->getAuthIdentifier(),
            $input['name'],
            $input['abilities'],
        );

        return ['plaintext' => $issued['plaintext']];
    }

    public static function revoke(string $id): void
    {
        $tenantId = app(TenantContext::class)->currentKey();

        abort_if($tenantId === null, 403);

        ApiToken::query()
            ->where('tenant_id', $tenantId)
            ->whereKey($id)
            ->delete();
    }

    /**
     * @return array<string, mixed>
     */
    public static function data(Request $request): array
    {
        $base = static::pageHref();

        return [
            'keys' => static::keys($request),
            'abilityOptions' => Abilities::all(),
            'plaintext' => session('api_token_plaintext'),
            'createHref' => $base.'/create',
            'destroyHref' => $base.'/destroy',
        ];
    }

    public static function create(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'abilities' => ['required', 'array', 'min:1'],
            'abilities.*' => ['string', 'max:120'],
        ]);

        /** @var array{name: string, abilities: list<string>} $input */
        $input = [
            'name' => $validated['name'],
            'abilities' => array_map('strval', $validated['abilities']),
        ];

        $result = static::issue($input);

        Notification::make()->title('API key created')->success()->send();

        return back()->with('api_token_plaintext', $result['plaintext']);
    }

    public static function destroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => ['required'],
        ]);

        static::revoke((string) $validated['id']);

        Notification::make()->title('API key revoked')->success()->send();

        return back();
    }

    protected static function pageHref(): string
    {
        $path = '/'.trim(static::navigationPath(), '/');
        $prefix = app(PanelManager::class)->currentPanel()?->getPath() ?? '';

        if ($prefix !== '' && $prefix !== '/') {
            $path = rtrim($prefix, '/').$path;
        }

        if (! str_starts_with($path, '/')) {
            $path = '/'.$path;
        }

        return $path;
    }
}
