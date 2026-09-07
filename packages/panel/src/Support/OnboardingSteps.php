<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Route;
use Alxtexh\Panel\Pages\ApiKeysPage;
use Alxtexh\Panel\Pages\BillingPortalPage;
use Alxtexh\Panel\Pages\InvitePage;
use Alxtexh\Panel\Panel;
use Alxtexh\Panel\PanelManager;

/**
 * First-run setup steps for an empty panel, in order, each with a real href.
 *
 * ONE SOURCE. `OnboardingPage::steps()` and the dashboard guide both read this,
 * so a host override on `Panel::onboardingSteps()` cannot drift between the
 * dedicated page and the card sign-in lands on.
 *
 * FIRST TIME ONLY. Completing every step, or Skip remaining, writes
 * `panel_onboarding_done` (cookie) and `appearance.onboardingDone` (account)
 * so the next login does not reopen the guide. What's new can reset it.
 *
 * DEFAULTS ARE KIT CHROME. Organisation, settings, security, roles, directory,
 * backups. No clients, routers, or vertical copy. Apps-only screens appear
 * only when `Panel::apps()` enabled them.
 *
 * OFF UNLESS THE PANEL ASKS FOR IT. `Panel::onboarding()` is off by default -
 * see its own docblock - so `items()` returns nothing for a panel that never
 * called it, same as it does once every step is done or the guide was
 * skipped.
 */
final class OnboardingSteps
{
    public const COOKIE = 'panel_onboarding_done';

    public const APPEARANCE_KEY = 'onboardingDone';

    /**
     * @return list<array{key: string, label: string, done: bool, href: string|null, description?: string, actionLabel?: string}>
     */
    public static function items(?Request $request = null): array
    {
        $request ??= request();

        if (self::isDone($request)) {
            return [];
        }

        $panel = app(PanelManager::class)->currentPanel()
            ?? app(PanelManager::class)->panel((string) config('panel.default', 'admin'));

        if ($panel === null || ! $panel->offersOnboarding()) {
            return [];
        }

        $defaults = self::chrome($panel);
        $resolver = $panel->onboardingStepsResolver();
        $steps = $resolver instanceof \Closure ? $resolver($defaults) : $defaults;

        $kept = [];

        foreach ($steps as $step) {
            if (! is_array($step) || ($step['key'] ?? '') === '' || ($step['label'] ?? '') === '') {
                continue;
            }

            $href = $step['href'] ?? null;

            if (! is_string($href) || $href === '') {
                continue;
            }

            $kept[] = [
                'key' => (string) $step['key'],
                'label' => (string) $step['label'],
                'done' => (bool) ($step['done'] ?? false),
                'href' => $href,
                'description' => (string) ($step['description'] ?? ''),
                'actionLabel' => (string) ($step['actionLabel'] ?? __('panel::onboarding.open')),
            ];
        }

        $undone = array_values(array_filter($kept, static fn (array $step): bool => ! $step['done']));

        if ($kept !== [] && $undone === []) {
            self::persistDone($request);

            return [];
        }

        return $kept;
    }

    /**
     * Shape the dashboard SetupChecklist renders: title, detail, href, button.
     *
     * @return list<array{key: string, title: string, detail: string, done: bool, href: string|null, actionLabel: string}>
     */
    public static function dashboardItems(?Request $request = null): array
    {
        return array_map(static fn (array $step): array => [
            'key' => $step['key'],
            'title' => $step['label'],
            'detail' => $step['description'] ?? '',
            'done' => $step['done'],
            'href' => $step['href'],
            'actionLabel' => $step['actionLabel'] ?? __('panel::onboarding.open'),
        ], self::items($request));
    }

    public static function isDone(?Request $request = null): bool
    {
        $request ??= request();

        $user = $request->user();
        $appearanceValue = $user instanceof Model ? $user->getAttribute('appearance') : null;
        $appearance = is_array($appearanceValue) ? $appearanceValue : [];
        $cookieValue = $request->cookie(self::COOKIE);
        $cookieDone = is_string($cookieValue) && $cookieValue === '1';

        /*
         * THE ACCOUNT WINS WHEN IT HAS AN OPINION. A skipped guide writes both
         * the cookie and appearance. Replay from What's new, or a demo reset of
         * `appearance.onboardingDone`, must show the card even if this browser
         * still has `panel_onboarding_done=1`. Cookie-only still hides it when
         * appearance has not been stored yet.
         */
        if (array_key_exists(self::APPEARANCE_KEY, $appearance)) {
            $done = $appearance[self::APPEARANCE_KEY] === true;

            if (! $done && $cookieDone) {
                cookie()->queue(self::doneCookie(false));
            }

            return $done;
        }

        return $cookieDone;
    }

    public static function persistDone(?Request $request = null): void
    {
        $request ??= request();
        $user = $request->user();

        if (! $user instanceof Model) {
            return;
        }

        $currentValue = $user->getAttribute('appearance');
        $current = is_array($currentValue) ? $currentValue : [];
        $user->setAttribute('appearance', [...$current, self::APPEARANCE_KEY => true]);
        $user->save();
    }

    public static function persistOpen(?Request $request = null): void
    {
        $request ??= request();
        $user = $request->user();

        if (! $user instanceof Model) {
            return;
        }

        $currentValue = $user->getAttribute('appearance');
        $current = is_array($currentValue) ? $currentValue : [];
        $user->setAttribute('appearance', [...$current, self::APPEARANCE_KEY => false]);
        $user->save();
    }

    public static function doneCookie(bool $done = true): \Symfony\Component\HttpFoundation\Cookie
    {
        return cookie(self::COOKIE, $done ? '1' : '0', 60 * 24 * 365, '/', null, false, false, false, 'lax');
    }

    /**
     * Feedback CTA and optional replay of the setup guide, for What's new.
     *
     * @return array{feedbackAction: string|null, onboardingReset: string|null}
     */
    public static function whatsNewProps(?Request $request = null): array
    {
        $request ??= request();
        $panel = app(PanelManager::class)->currentPanel();

        $feedback = $panel !== null
            && $panel->offersFeedback()
            && Route::has($panel->getRouteName().'feedback')
                ? route($panel->getRouteName().'feedback')
                : null;

        $reset = $panel !== null && Route::has($panel->getRouteName().'onboarding.reset')
            ? route($panel->getRouteName().'onboarding.reset')
            : null;

        return [
            'feedbackAction' => $feedback,
            'onboardingReset' => self::isDone($request) ? $reset : null,
        ];
    }

    /**
     * Kit chrome that actually exists on this panel. No vertical merchandising.
     *
     * @return list<array{key: string, label: string, done: bool, href: string|null, description: string, actionLabel: string}>
     */
    public static function chrome(Panel $panel): array
    {
        $open = __('panel::onboarding.open');
        $steps = [];

        $usersHref = $panel->offersApp('invites')
            ? (self::url($panel, 'pages.invite') ?? self::path($panel, InvitePage::uri()))
            : self::url($panel, 'pages.user-management', ['tab' => 'users']);

        if ($usersHref !== null) {
            $steps[] = self::step(
                $panel->offersApp('invites') ? 'invite' : 'users',
                $panel->offersApp('invites')
                    ? __('panel::onboarding.steps.invite.label')
                    : __('panel::onboarding.steps.users.label'),
                $panel->offersApp('invites')
                    ? __('panel::onboarding.steps.invite.description')
                    : __('panel::onboarding.steps.users.description'),
                $usersHref,
                $open,
            );
        }

        $organisation = self::url($panel, 'pages.organisation');

        if ($organisation !== null) {
            $steps[] = self::step(
                'organisation',
                __('panel::onboarding.steps.organisation.label'),
                __('panel::onboarding.steps.organisation.description'),
                $organisation,
                $open,
            );
        }

        $security = self::url($panel, 'security')
            ?? self::url($panel, 'settings.security')
            ?? self::url($panel, 'profile')
            ?? self::url($panel, 'settings.profile');

        if ($security !== null) {
            $steps[] = self::step(
                'security',
                __('panel::onboarding.steps.security.label'),
                __('panel::onboarding.steps.security.description'),
                $security,
                $open,
            );
        }

        if ($panel->offers('roles')) {
            $roles = self::url($panel, 'roles');

            if ($roles !== null) {
                $steps[] = self::step(
                    'roles',
                    __('panel::onboarding.steps.roles.label'),
                    __('panel::onboarding.steps.roles.description'),
                    $roles,
                    $open,
                );
            }
        }

        $settings = self::url($panel, 'settings.index');

        if ($settings !== null) {
            $steps[] = self::step(
                'settings',
                __('panel::onboarding.steps.settings.label'),
                __('panel::onboarding.steps.settings.description'),
                $settings,
                $open,
            );
        }

        $directory = self::url($panel, 'pages.directory');

        if ($directory !== null) {
            $steps[] = self::step(
                'directory',
                __('panel::onboarding.steps.directory.label'),
                __('panel::onboarding.steps.directory.description'),
                $directory,
                $open,
            );
        }

        if ($panel->offers('operations')) {
            $backups = OperationsNav::urls($panel)['backups'] ?? null;

            if (is_string($backups) && $backups !== '') {
                $steps[] = self::step(
                    'backups',
                    __('panel::onboarding.steps.backups.label'),
                    __('panel::onboarding.steps.backups.description'),
                    $backups,
                    $open,
                );
            }
        }

        if ($panel->offersApp('api-keys')) {
            $href = self::url($panel, 'pages.api-keys') ?? self::path($panel, ApiKeysPage::uri());

            $steps[] = self::step(
                'api-keys',
                __('panel::onboarding.steps.api_keys.label'),
                __('panel::onboarding.steps.api_keys.description'),
                $href,
                $open,
            );
        }

        if ($panel->offersApp('billing-portal')) {
            $href = self::url($panel, 'pages.billing-portal') ?? self::path($panel, BillingPortalPage::uri());

            $steps[] = self::step(
                'billing-portal',
                __('panel::onboarding.steps.billing.label'),
                __('panel::onboarding.steps.billing.description'),
                $href,
                $open,
            );
        }

        return $steps;
    }

    /**
     * @param  array<string, mixed>  $parameters
     */
    private static function url(Panel $panel, string $suffix, array $parameters = []): ?string
    {
        $name = $panel->getRouteName().$suffix;

        return Route::has($name) ? route($name, $parameters) : null;
    }

    private static function path(Panel $panel, string $uri): string
    {
        $base = '/'.trim($panel->getPath(), '/');

        if ($base === '/') {
            return '/'.ltrim($uri, '/');
        }

        return $base.'/'.ltrim($uri, '/');
    }

    /**
     * @return array{key: string, label: string, done: bool, href: string, description: string, actionLabel: string}
     */
    private static function step(string $key, string $label, string $description, string $href, string $actionLabel): array
    {
        return [
            'key' => $key,
            'label' => $label,
            'done' => false,
            'href' => $href,
            'description' => $description,
            'actionLabel' => $actionLabel,
        ];
    }
}
