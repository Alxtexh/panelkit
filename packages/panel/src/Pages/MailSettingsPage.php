<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Pages;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\MailConnectionProbe;
use Alxtexh\Panel\Support\SmtpSettings;

/**
 * The outgoing mail server this installation sends through, and a way to
 * prove it before trusting it. Off until a panel calls `->mailSettings()`.
 *
 * A FORM OVER `SmtpSettings`, exactly as `AssistantSettingsController` is a
 * form over `AiCredentials` - see that class for why the password field is
 * always empty on render.
 *
 * TWO ACTIONS, TWO DIFFERENT THINGS. `save` persists; `test` sends a real
 * message with whatever the form currently holds and reports what happened,
 * without touching what is stored. An administrator who mistypes a password
 * finds out from "Test" before "Save" commits it - testing what was last
 * saved would mean save-test-fix-save-test, discovering the mistake only
 * after it is already live.
 */
class MailSettingsPage extends Page
{
    protected static string $icon = 'mail';

    public static function shouldShowInNavigation(): bool
    {
        return false;
    }

    public static function uri(): string
    {
        return 'settings/smtp';
    }

    public static function label(): string
    {
        return 'SMTP';
    }

    public static function ability(): ?string
    {
        return 'manage_mail_settings';
    }

    /**
     * ABSENT until this portal opted in. A customer panel must not inherit
     * the operator panel's mail-server settings screen.
     */
    public static function isEnabled(): bool
    {
        $panel = app(PanelManager::class)->panel(static::panel());

        return $panel?->offersMailSettings() ?? false;
    }

    public static function component(): string
    {
        return 'settings/Smtp';
    }

    public static function heading(): ?string
    {
        return 'SMTP';
    }

    public static function description(): ?string
    {
        return 'The mail server this installation sends through.';
    }

    /**
     * @return array<string, string|null>
     */
    public static function actions(): array
    {
        return [
            'save' => 'manage_mail_settings',
            'test' => 'manage_mail_settings',
        ];
    }

    public static function actionMethods(): array
    {
        return [
            'save' => 'put',
            'test' => 'post',
        ];
    }

    public static function actionUris(): array
    {
        return [
            // An empty suffix puts `save` on the page's own URI - the
            // ordinary `PUT /settings/smtp`.
            'save' => '',
            'test' => 'test',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function data(Request $request): array
    {
        $settings = app(SmtpSettings::class);

        return [
            'routes' => [
                'test' => static::pageHref().'/test',
            ],
            'config' => $settings->config(),
            'maskedPassword' => $settings->maskedPassword(),
            'configured' => $settings->configured(),
        ];
    }

    public static function save(Request $request): RedirectResponse
    {
        $validated = static::validated($request);

        app(SmtpSettings::class)->set($validated, auth()->user()?->name);

        return back()->with('success', 'SMTP settings saved.');
    }

    public static function test(Request $request): JsonResponse
    {
        $validated = static::validated($request);
        $settings = app(SmtpSettings::class);

        // Blank means "whatever is already saved" - the same rule `save`
        // uses, so testing the form immediately after opening it (before
        // typing a new password) tests the real, currently-active one
        // rather than sending unauthenticated and reporting a confusing
        // failure.
        $password = $validated['password'] !== '' ? $validated['password'] : $settings->password();

        $to = auth()->user()?->email;
        abort_if($to === null, 422, 'Your account has no email address to send a test to.');

        $result = app(MailConnectionProbe::class)->send([...$validated, 'password' => $password], $to);

        return response()->json($result);
    }

    /**
     * @return array{host: string, port: int, encryption: string|null, username: string|null, password: string, from_address: string, from_name: string}
     */
    protected static function validated(Request $request): array
    {
        $data = $request->validate([
            'host' => ['required', 'string', 'max:255'],
            'port' => ['required', 'integer', 'min:1', 'max:65535'],
            'encryption' => ['nullable', Rule::in(['tls', 'ssl'])],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'max:512'],
            'from_address' => ['required', 'email', 'max:255'],
            'from_name' => ['required', 'string', 'max:255'],
        ]);

        return [
            'host' => $data['host'],
            'port' => (int) $data['port'],
            'encryption' => $data['encryption'] ?? null,
            'username' => $data['username'] ?? null,
            'password' => $data['password'] ?? '',
            'from_address' => $data['from_address'],
            'from_name' => $data['from_name'],
        ];
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
