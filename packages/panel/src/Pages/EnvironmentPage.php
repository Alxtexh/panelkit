<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Pages;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Alxtexh\Panel\Support\EnvFile;

/**
 * The environment screen - a handful of named settings, not a text editor.
 *
 * IT HIDES ITSELF UNLESS AN INSTALLATION ASKS FOR IT. `panel.env.editable` is
 * empty by default, so the screen does not exist until somebody names the keys
 * they want reachable. A framework that shipped this switched on would be
 * shipping a browser-accessible way to change an application's secrets to
 * everybody who installed it.
 *
 * SEEING AND SAVING ARE SEPARATE GRANTS. Reading which integrations are
 * configured is an ordinary operations question; changing a live API key is not.
 */
final class EnvironmentPage extends Page
{
    protected static string $icon = 'settings';

    protected static ?string $group = 'Settings';

    public static function slug(): string
    {
        return 'environment';
    }

    public static function label(): string
    {
        return 'Environment';
    }

    public static function ability(): string
    {
        return 'view_environment';
    }

    public static function actions(): array
    {
        return ['update' => 'manage_environment'];
    }

    public static function actionMethods(): array
    {
        return ['update' => 'put'];
    }

    public static function actionUris(): array
    {
        // The save sits on the page's own address.
        return ['update' => ''];
    }

    /**
     * NOT PRESENT AT ALL unless keys are declared editable. A routed screen
     * saying "nothing is editable" is a dead end reachable from no menu.
     */
    public static function isEnabled(): bool
    {
        return EnvFile::isEditable();
    }

    public static function component(): string
    {
        return 'Environment';
    }

    public static function heading(): string
    {
        return 'Environment';
    }

    public static function description(): string
    {
        return 'Settings that live in .env. Secrets are never shown; leave one blank to keep it.';
    }

    public static function data(Request $request): array
    {
        return [
            'entries' => EnvFile::entries(),
            'writable' => EnvFile::isEditable(),
            'cached' => app()->configurationIsCached(),
        ];
    }

    public static function update(Request $request): RedirectResponse
    {
        /*
         * VALIDATED AS STRINGS AND NOTHING ELSE. Every value written here ends
         * up in a file the application parses at boot, so an array or a nested
         * structure has no meaning and no business being accepted.
         */
        $validated = $request->validate([
            'values' => ['required', 'array'],
            'values.*' => ['nullable', 'string', 'max:2048'],
        ]);

        $result = EnvFile::apply($validated['values']);

        return $result['ok']
            ? back()->with('success', $result['message'])
            : back()->withErrors(['values' => $result['message']]);
    }
}
