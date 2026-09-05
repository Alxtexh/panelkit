<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

/**
 * The screens this package renders, and the one-line files that resolve them.
 *
 * WHY THIS IS NOT INSIDE `InstallCommand` ANY MORE. `panel:update` needs the
 * same list, and a second copy of it is the exact failure this list exists to
 * prevent: a screen added to the PHP half, written by one command and not the
 * other, is a route that resolves to nothing for everybody who upgraded rather
 * than installed fresh.
 *
 * That is not hypothetical. `settings/Roles` shipped in 0.2.0 with no update
 * command in existence, so every 0.1.0 installation that ran `composer update`
 * got a routed permission matrix and no page file for it.
 */
final class PanelPages
{
    /**
     * The screens this package renders, and nothing else.
     *
     * KEPT BESIDE THE `Inertia::render` CALLS THAT NAME THEM. A screen added to
     * the PHP half without a line here is a route that resolves to nothing, so
     * the panel's own test walks the render calls and this list together.
     */
    public const SCREENS = [
        'ResourceIndex',
        'ResourceKanban',
        'ResourceWorkflow',
        'ResourceForm',
        'ResourceView',
        'ResourceAttach',
        'ResourcePicker',
        'Trash',
        'PanelHome',

        /*
         * THE WIDGET HOST. `StatWidget` and `ChartWidget` shipped with nowhere
         * to render; `DashboardPage` routes this and this draws them.
         */
        'PanelDashboard',
        'Changelog',
        'Environment',
        'Sitemap',

        /*
         * THE FULL-SCREEN SETUP WIZARD. `SetupWizardController` is a plain
         * controller, not a `Page` subclass, so it renders with a literal
         * `Inertia::render('SetupWizard', ...)` the same way `PanelDashboard`
         * above does - which is exactly what keeps this list and the render
         * calls honest against each other. `Panel::setupWizard()` gates
         * whether the ROUTE does anything useful; the stub still has to
         * exist so a host that never calls it gets a 404 from the
         * controller, not a Vite resolution error from a missing file.
         */
        'SetupWizard',

        /*
         * THE SIGN-IN SCREENS, mirrored even in an application that has not run
         * `make:panel --auth` yet.
         *
         * WHY UNCONDITIONALLY. The invariant this list exists to hold is that
         * every name the PHP half renders has a file Inertia can glob - and the
         * failure when it does not is a white page with a console error naming
         * a file nobody has heard of. Making these conditional would mean an
         * installation that turns auth on LATER gets that failure, and one that
         * upgrades into a changed auth screen gets it silently.
         *
         * AN EXISTING FILE IS NEVER OVERWRITTEN, which is what makes this safe
         * beside Breeze or Jetstream: they put their own `auth/Login.vue` in the
         * same place, and the writer leaves whatever is already there alone.
         */
        /*
         * `panel/auth/*`, NOT `auth/*`, AND THAT DISTINCTION IS THE WHOLE
         * POINT.
         *
         * IT USED TO BE `auth/Login` AND IT COLLIDED. The note above says an
         * existing file is never overwritten, which is what makes this safe
         * beside Breeze or Jetstream - and the consequence nobody drew was
         * that the portal then RENDERED Breeze's screen. Inertia resolves a
         * name against the application's own pages, so a panel's sign-in got a
         * component written for the application's controller, with a different
         * prop contract: the packaged controller sends `socialProviders` as a
         * list of objects, the reference app's screen expected a map and
         * captioned its button with raw JSON, and the panel's configured
         * heading was dropped. Nothing errored, because a page that renders is
         * a page that looks like it works.
         *
         * Under a name no application owns, the packaged controller and the
         * packaged component are guaranteed to agree - so `make:panel --auth`
         * produces a working, panel-branded sign-in on a host that has its own
         * `auth/Login`, which it previously could not.
         */
        'panel/auth/Login',
        'panel/auth/ForgotPassword',
        'panel/auth/ResetPassword',
        /*
         * THE LOGIN-DOOR CHALLENGE. Security already enrols TOTP; this is the
         * screen that asks for the code after password. Same component as
         * Fortify's `auth/TwoFactorChallenge`, under a name no starter kit owns.
         */
        'panel/auth/TwoFactorChallenge',
        'panel/auth/Register',
        'panel/auth/VerifyEmail',
        /*
         * LOCK SCREEN lives under `auth/` (not `panel/auth/`) because the
         * session lock is a signed-in interrupt, not a guest portal. Still a
         * packaged screen that must have a page file on every install.
         */
        'auth/LockScreen',

        /*
         * NESTED NAMES, because the server renders `documents/Templates` and a
         * page name is a path. The writer creates the directory; the component
         * identifier is the basename, since `documents/Templates` is not a
         * legal JavaScript name.
         */
        /*
         * THE INSTALLATION'S OWN HEALTH. Routed by `PanelRoutes` for any panel
         * that still offers `operations`; the page files are written
         * unconditionally, for the same reason the auth screens are - a panel
         * that turns them on later would otherwise get a white page naming a
         * file nobody has heard of.
         */
        /*
         * THE ERROR SCREENS. They were moved into `@alxtexh-enterprise/panel/inertia` and
         * exported, and then reachable by nobody: no page file and nothing
         * rendering them, so a fresh installation still got Laravel's defaults.
         * A moved screen with nothing routing to it is not a shipped screen.
         */
        'errors/Error',

        'settings/Assistant',
        'operations/Backups',
        'operations/BackupSettings',
        'operations/Logs',
        'operations/Monitoring',

        'documents/Templates',
        'documents/TemplateDesigner',
        'documents/DocumentPrint',

        /*
         * THE TICKET ANALYSIS SCREEN. Routed by `TicketingPlugin` and only when
         * an installation has named an operator panel - but the page file has
         * to exist either way, because `panel:install` cannot know today what
         * `config/panel.php` will say tomorrow, and a screen whose route
         * appears later with no component is the white page this whole class
         * was written to prevent.
         */
        'TicketAnalysis',

        /*
         * THE PERMISSION MATRIX, nested for the same reason. The package now
         * ships the roles system - model, migration, reconciler - and a matrix
         * nobody can open is a permission system nobody can operate.
         */
        'settings/Roles',

        /*
         * THE ACCOUNT'S OWN SCREENS, and the reason they arrived late is worth
         * keeping. `ManagePasskeys`, `ManageTwoFactor`, `TwoFactorSetupModal`,
         * `TwoFactorRecoveryCodes` and `DeleteUser` all shipped in the npm
         * package from 0.6 - correct, tested, exported, and mounted by NOTHING
         * outside the reference application. Every installation downloaded a
         * working passkey manager and had no page on which to see it.
         *
         * That is the same failure as `errors/Error` above and as
         * `PkLandingSections` before it: a component in `node_modules` that no
         * route renders is, from the outside, a feature that was never built.
         */
        'settings/Profile',
        'settings/Security',
        'settings/Notifications',

        /*
         * THE HELP CENTRE. Generic by construction - `HelpCentre` ships articles
         * about the panel itself and the application adds its own, so a fresh
         * install opens on something useful rather than on an empty shelf or on
         * an ISP's articles about fibre plans.
         */
        'UserManagement',
        'settings/Workspaces',
        'settings/Organisation',
        'settings/Index',
        'BillingSuspended',
        /*
         * PAYMENTS STAYS WRITTEN: `Panel::paymentSettings()` mounts the route
         * later, and a white page then is the failure this list exists to stop.
         * The screen is OFF until the host opts in; it is not a demo default.
         */
        'settings/Payments',
        /*
         * SMTP, the same reasoning - `Panel::mailSettings()` mounts
         * `/settings/smtp` later. Missing here until a fresh-install smoke
         * test found the white page directly: `MailSettingsPage::component()`
         * is a method return, not a literal `Inertia::render('...')` call, so
         * nothing scanning for the literal string would have caught it either
         * - see `PanelPageComponentCoverageTest`, added alongside this line.
         */
        'settings/Smtp',

        'support/Help',
        'support/Faq',
        'support/About',
    ];

    /**
     * Opt-in merchandising / studio screens. Routes stay OFF until the host
     * calls `apps()` or subclasses the page base. `write()` / `panel:update`
     * still emit the Vue stubs so enabling an app later cannot 500 on a missing
     * Vite manifest entry. Call `writeOptional()` alone when you only need these.
     */
    public const OPTIONAL_SCREENS = [
        'Catalog',
        'PlanSetup',
        'Subscription',
        'CatalogItem',
        'CatalogRegister',
        'Signatures',
        'Till',
        'DevicePreview',
        'Mail',
        'Chat',
        'ApiKeys',
        'ApiDocs',
        'Logs',
        'Showcase',
        'Invites',
        'FeatureFlags',
        'Onboarding',
        'BillingPortal',
        'Webhooks',
        'EmailTemplates',
        'MediaLibrary',
        'PanelPage',
    ];

    /**
     * Write any screen file that is not already there.
     *
     * RETURNS WHAT HAPPENED RATHER THAN PRINTING IT, because two commands need
     * the same facts and say different things about them. On an install, three
     * files kept is "you already have these". On an UPDATE it is the interesting
     * half: a screen written today is one the new version routes and the old one
     * did not, and a consumer who never sees that line gets a white page on a
     * route that used to 404.
     *
     * @return array{written: list<string>, skipped: list<string>, directory: ?string}
     */
    /**
     * Packaged screens with no file in `resources/js/pages`.
     *
     * SEPARATE FROM `write()` BECAUSE ASKING IS NOT FIXING. `panel:doctor`
     * reports and never writes, and the case worth reporting is precisely the
     * one where somebody upgraded with composer and did not run `panel:update`:
     * the route answers, the component cannot be resolved, and Inertia renders
     * a blank page under a working header. Nothing errors server-side, so the
     * only signal is a screen that looks unfinished.
     *
     * @return list<string> Screen names, e.g. `panel/Changelog`.
     */
    public static function missing(): array
    {
        $directory = resource_path('js/pages');

        if (! is_dir($directory)) {
            return [];
        }

        return array_values(array_filter(
            [...self::SCREENS, ...self::OPTIONAL_SCREENS],
            static fn (string $screen): bool => ! file_exists($directory.'/'.$screen.'.vue'),
        ));
    }

    public static function write(bool $force = false): array
    {
        /*
         * OPTIONAL SCREENS ARE WRITTEN TOO. Routes for Catalog / ApiKeys / etc.
         * stay OFF until `apps()` or a page subclass opts in, but the Vue stub
         * must exist beforehand: `app.blade.php` asks Vite for
         * `resources/js/pages/{component}.vue`, and a missing file is a
         * ViteException rather than an empty canvas. Stubs do not put screens
         * in the sidebar; missing stubs put white pages on every enabled app.
         */
        $required = self::writeScreens(self::SCREENS, $force);
        $optional = self::writeScreens(self::OPTIONAL_SCREENS, $force);

        if ($required['directory'] === null) {
            return $required;
        }

        return [
            'written' => [...$required['written'], ...$optional['written']],
            'skipped' => [...$required['skipped'], ...$optional['skipped']],
            'directory' => $required['directory'],
        ];
    }

    /**
     * Write Catalog / PlanSetup / Signatures page files when the host opts
     * into those page bases. Directory is a default screen. Safe to call
     * repeatedly; never overwrites unless `$force`.
     *
     * @return array{written: list<string>, skipped: list<string>, directory: ?string}
     */
    public static function writeOptional(bool $force = false): array
    {
        return self::writeScreens(self::OPTIONAL_SCREENS, $force);
    }

    /**
     * @param  list<string>  $screens
     * @return array{written: list<string>, skipped: list<string>, directory: ?string}
     */
    private static function writeScreens(array $screens, bool $force = false): array
    {
        $directory = resource_path('js/pages');

        /*
         * CREATE IT WHEN THIS IS ALREADY A VUE INERTIA APPLICATION.
         *
         * This used to return early whenever the directory was missing, and in a
         * FRESH LARAVEL APP it always is - `resources/js/pages` comes from a
         * starter kit, not from `laravel/laravel`. So `panel:install` wrote NOT
         * ONE packaged screen: no ResourceIndex, no dashboard, no error page.
         * It printed a warning, the install reported success, every server-side
         * check passed - `/customers` really did answer 302, `/dashboard` really
         * did name its component - and the panel was blank in a browser, because
         * Inertia resolves a page by globbing this directory and there was
         * nothing in it to find.
         *
         * The guard was right about its own question: writing Vue into a React
         * or Blade application would be guessing. But `panel:install` PUBLISHES
         * the Vue bootstrap two steps earlier, so by the time this runs the
         * answer is known - `js/app.ts` is the file it just wrote.
         */
        if (! is_dir($directory)) {
            if (! file_exists(resource_path('js/app.ts'))) {
                return ['written' => [], 'skipped' => [], 'directory' => null];
            }

            mkdir($directory, 0755, true);
        }

        $written = [];
        $skipped = [];

        foreach ($screens as $screen) {
            $path = $directory.'/'.$screen.'.vue';

            if (file_exists($path) && ! $force) {
                $skipped[] = $screen;

                continue;
            }

            // A nested screen name is a path, so its directory may not exist -
            // and `file_put_contents` into a missing directory fails with a
            // warning and no file, which would be a screen that installs
            // silently as nothing.
            $folder = dirname($path);

            if (! is_dir($folder)) {
                mkdir($folder, 0755, true);
            }

            file_put_contents($path, self::stub($screen));

            $written[] = $screen;
        }

        return ['written' => $written, 'skipped' => $skipped, 'directory' => $directory];
    }

    /**
     * A WRAPPER, NOT A RE-EXPORT, and the difference is not stylistic.
     *
     * `export { default } from '@alxtexh-enterprise/panel/pages/X.vue'` is the obvious
     * way to write this. It type-checks, it builds, the chunk it emits contains
     * the whole real component - and the page renders NOTHING. An SFC with no
     * `<template>` block compiles to a component with no render function, so
     * Vue mounts it and draws an empty comment node. In a production build there
     * is no warning at all; the only symptom is a blank page under a working
     * header. It cost an afternoon here, and it would cost a consumer their
     * first impression of the package.
     *
     * `$attrs` CARRIES THE PROPS. Inertia hands page props to this component,
     * which declares none, so they arrive as attributes and are forwarded
     * whole - which is also why `inheritAttrs` is off: without it Vue would
     * apply them a second time to the child's root element, and an object prop
     * rendered as a DOM attribute becomes `records="[object Object]"`.
     */
    public static function stub(string $screen): string
    {
        // `documents/Templates` is a page NAME; the component identifier has to
        // be a legal JavaScript one.
        $component = basename($screen);

        return <<<VUE
        <script setup lang="ts">
        /*
         * The panel's {$component} screen, from @alxtexh-enterprise/panel/inertia.
         *
         * WHY THIS FILE EXISTS: Inertia resolves a page name by globbing this
         * directory, so a screen living in node_modules is one it cannot find.
         *
         * IT IS ALSO WHERE YOU OVERRIDE IT. Point the import at your own
         * component and nothing else has to change.
         *
         * KEEP THE TEMPLATE. An SFC with only a script block renders nothing at
         * all, silently, in a production build.
         */
        import {$component} from '@alxtexh-enterprise/panel/pages/{$screen}.vue'

        defineOptions({ inheritAttrs: false })
        </script>

        <template>
            <!--
                The cast is deliberate. `\$attrs` is `Record<string, unknown>`, so
                the checker cannot see that it holds this screen's props and
                reports every one of them as missing. There is nothing to verify
                either way: these values arrive from the server as JSON and are
                typed where they are USED, inside the packaged component.
            -->
            <{$component} v-bind="(\$attrs as any)" />
        </template>

        VUE;
    }
}
