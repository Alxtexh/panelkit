<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Feature;

use Alxtexh\Panel\Support\PanelPages;
use Alxtexh\Panel\Tests\TestCase;

/**
 * Fresh-install completeness: empty chrome, settings shell, no demo screens.
 */
final class EmptyCoreInstallTest extends TestCase
{
    public function test_install_app_ts_stub_nests_settings_layout(): void
    {
        $stub = (string) file_get_contents(
            dirname(__DIR__, 2).'/resources/stubs/app.ts.stub'
        );

        $this->assertStringContainsString("from '@alxtexh-enterprise/panel/inertia'", $stub);
        $this->assertStringContainsString('SettingsLayout', $stub);
        $this->assertStringContainsString('layout: (name) =>', $stub);
        $this->assertStringContainsString("name === 'settings/Index'", $stub);
        $this->assertStringContainsString("name.startsWith('settings/')", $stub);
        $this->assertStringContainsString('[PanelLayout, SettingsLayout]', $stub);
        $this->assertStringContainsString('return PanelLayout', $stub);
        $this->assertStringNotContainsString('page.default.layout ??=', $stub);
        $this->assertStringNotContainsString('—', $stub);
    }

    public function test_install_panel_layout_stub_forwards_breadcrumbs(): void
    {
        $stub = (string) file_get_contents(
            dirname(__DIR__, 2).'/resources/stubs/PanelLayout.vue.stub'
        );

        $this->assertStringContainsString('breadcrumbs', $stub);
        $this->assertStringContainsString(':breadcrumbs="breadcrumbs"', $stub);
        $this->assertStringContainsString('PanelShell', $stub);
    }

    public function test_install_dashboard_is_an_empty_canvas(): void
    {
        $install = (string) file_get_contents(
            dirname(__DIR__, 2).'/src/Commands/InstallCommand.php'
        );

        $this->assertStringContainsString('EMPTY ON PURPOSE', $install);
        $this->assertStringNotContainsString('Open orders', $install);
        $this->assertStringNotContainsString('Revenue over time', $install);
        $this->assertStringNotContainsString("type('catalog')", $install);
        $this->assertStringNotContainsString('function shortcuts()', $install);
        $this->assertStringContainsString('return [', $install);
        $this->assertStringNotContainsString('givePermissionTo', $install);
        $this->assertStringNotContainsString('grantsEverything', $install);
        $this->assertStringContainsString('--no-user', $install);
        $this->assertStringContainsString('createFirstUser', $install);
        $this->assertStringContainsString('grants_all', $install);
    }

    public function test_demo_screens_are_optional_not_default(): void
    {
        foreach (['Catalog', 'PlanSetup', 'CatalogItem', 'CatalogRegister', 'Signatures', 'Till', 'DevicePreview', 'Mail', 'Chat'] as $screen) {
            $this->assertNotContains(
                $screen,
                PanelPages::SCREENS,
                "{$screen} must not ship on every install.",
            );
            $this->assertContains($screen, PanelPages::OPTIONAL_SCREENS);
        }

        foreach (['settings/Profile', 'settings/Security', 'settings/Notifications', 'settings/Organisation', 'settings/Index', 'PanelDashboard', 'ResourcePicker'] as $core) {
            $this->assertContains($core, PanelPages::SCREENS);
        }
    }

    public function test_auth_is_on_by_default_with_an_opt_out(): void
    {
        $install = (string) file_get_contents(
            dirname(__DIR__, 2).'/src/Commands/InstallCommand.php'
        );

        $this->assertStringContainsString('{--no-auth', $install);
        $this->assertStringContainsString('shouldScaffoldAuth', $install);
        $this->assertStringContainsString('option(\'no-auth\')', $install);
        $this->assertStringContainsString('scaffoldAuth', $install);
        $auth = (string) file_get_contents(
            dirname(__DIR__, 2).'/src/Commands/Concerns/ScaffoldsPanelAuth.php'
        );

        $this->assertStringContainsString('routes/panel-', $auth);
        $this->assertStringContainsString('PanelAuthController', $auth);
        $this->assertStringContainsString('.login', $auth);
        $this->assertStringContainsString('showLogin', $auth);
    }

    public function test_install_treats_npm_as_optional_and_publishes_kit_assets(): void
    {
        $install = (string) file_get_contents(
            dirname(__DIR__, 2).'/src/Commands/InstallCommand.php'
        );

        $this->assertStringContainsString('publishKitAssets', $install);
        $this->assertStringContainsString('npm install && npm run build is optional', $install);
        $this->assertStringContainsString('public/vendor/panel', $install);
        $this->assertStringContainsString('panel:permissions', $install);
        $this->assertStringContainsString('syncPermissions', $install);
        $this->assertStringContainsString('wireSharePanelProps', $install);
        $this->assertStringNotContainsString('Add a `tenant_id` column', $install);
    }

    public function test_empty_sidebar_is_the_no_user_path_not_the_default(): void
    {
        $install = (string) file_get_contents(
            dirname(__DIR__, 2).'/src/Commands/InstallCommand.php'
        );

        $this->assertStringContainsString('Without a first user (`--no-user`) the sidebar is empty', $install);
        $this->assertStringContainsString('deny-by-default, not a broken install', $install);
        $this->assertStringContainsString('make:panel-recipe Invoices', $install);
        $this->assertStringContainsString('Get started card', $install);
    }

    public function test_published_tenancy_default_is_none(): void
    {
        $config = (string) file_get_contents(
            dirname(__DIR__, 2).'/config/panel.php'
        );

        $this->assertStringContainsString("env('PANEL_TENANCY_MODE', 'none')", $config);
        $this->assertStringNotContainsString("env('PANEL_TENANCY_MODE', 'column')", $config);
    }

    public function test_install_help_names_the_filament_gap_flags(): void
    {
        $this->artisan('panel:install', ['--help' => true])
            ->expectsOutputToContain('--no-auth')
            ->expectsOutputToContain('--no-user')
            ->expectsOutputToContain('--name')
            ->expectsOutputToContain('--email')
            ->expectsOutputToContain('--password')
            ->assertSuccessful();
    }

    /**
     * A scripted `panel:install --email=admin@fresh.test --password=secret`
     * creates that exact user in createFirstUser(). The local-dev login
     * prefill must default to the SAME credentials, or first login fails
     * against an account (`admin@example.com`) the install never made.
     */
    /**
     * `createDefaultPanel()` mounts every fresh install's panel at `path('')`
     * - `/` - and `PanelRoutes` deliberately does not claim `/` for a
     * root-mounted panel (its own comment: that portal IS the application,
     * so `/` is the host's to decide). A stock Laravel skeleton's own
     * `routes/web.php` still claims `GET /` for `welcome.blade.php` though,
     * and Laravel's router matches whichever registered first. Found running
     * an actual fresh install and reading what `/` rendered: the documented
     * golden path (`composer require`, `panel:install`, visit `/login`)
     * silently landed a first visit to `/` on Laravel's default welcome page
     * instead of the panel, with `panel:doctor` finding nothing wrong -
     * and simply deleting that stock route (an earlier attempt) traded it
     * for a 404, since nothing else answers `/` for a root-mounted panel by
     * that same deliberate design.
     */
    public function test_install_repoints_the_stock_welcome_route_when_the_panel_owns_root(): void
    {
        $install = (string) file_get_contents(
            dirname(__DIR__, 2).'/src/Commands/InstallCommand.php'
        );

        $this->assertStringContainsString('repointStockWelcomeRoute', $install);
        $this->assertStringContainsString(
            "\$this->createDefaultPanel();\n        \$this->repointStockWelcomeRoute();",
            $install,
            'repointStockWelcomeRoute must run right after the panel is created, so it always '
            .'sees the provider it just wrote.',
        );

        // ONLY THE EXACT, UNMODIFIED STOCK ROUTE - a file with anything else
        // added is one a developer wrote something into.
        $this->assertStringContainsString("return view('welcome');", $install);
        $this->assertStringContainsString('trim($contents) !== trim($stock)', $install);

        // AND ONLY WHEN THE PANEL ACTUALLY OWNS ROOT - a provider repointed
        // to a different path must not have its sibling route file touched.
        $this->assertStringContainsString('"->path(\'\')"', $install);

        // A REDIRECT, NOT A BLANK FILE - the 404 an earlier attempt produced.
        $this->assertStringContainsString("Route::redirect('/', '/login');", $install);
    }

    /**
     * `make:panel` creates BOTH `Panel/Admin/Resources` and
     * `Panel/Admin/Widgets` unconditionally
     * (`MakePanelCommand::ensureDirectory()`), each seeded with a
     * `.gitkeep` file so the empty directory survives a git clone.
     * `createDefaultPanel()` went through two rounds of this same bug:
     *
     *   1. It first `rmdir()`'d only `Resources` before `Panel/Admin`
     *      itself - `rmdir()` silently refuses a non-empty directory (the
     *      leading `@` swallows the warning), so with `Widgets` still
     *      inside, `Panel/Admin` was never actually removed.
     *   2. Adding a second `rmdir()` for `Widgets`, in the right order,
     *      STILL left all three directories on disk - the `.gitkeep` file
     *      inside each made every `rmdir()` a no-op regardless of order.
     *      Caught by actually re-running a tagged release's `panel:install`
     *      in a fresh app and finding `Panel/Admin/{Resources,Widgets}/
     *      .gitkeep` still there, not by reading the source a second time.
     *
     * A fresh install was left with decoy directories nothing discovers
     * (`Panel/Resources`/`Panel/Widgets`, which `AdminPanelProvider` is
     * repointed to just above, are the real ones) sitting beside them.
     */
    public function test_install_removes_both_decoy_admin_directories_and_their_gitkeep_files(): void
    {
        $install = (string) file_get_contents(
            dirname(__DIR__, 2).'/src/Commands/InstallCommand.php'
        );

        $unlinkResources = strpos($install, "@unlink(app_path('Panel/Admin/Resources/.gitkeep'));");
        $unlinkWidgets = strpos($install, "@unlink(app_path('Panel/Admin/Widgets/.gitkeep'));");
        $resources = strpos($install, "@rmdir(app_path('Panel/Admin/Resources'));");
        $widgets = strpos($install, "@rmdir(app_path('Panel/Admin/Widgets'));");
        $parent = strpos($install, "@rmdir(app_path('Panel/Admin'));");

        $this->assertNotFalse($unlinkResources, 'InstallCommand must remove Resources/.gitkeep before rmdir() can succeed.');
        $this->assertNotFalse($unlinkWidgets, 'InstallCommand must remove Widgets/.gitkeep before rmdir() can succeed.');
        $this->assertNotFalse($resources, 'InstallCommand must still remove the decoy Resources directory.');
        $this->assertNotFalse($widgets, 'InstallCommand must also remove the decoy Widgets directory.');
        $this->assertNotFalse($parent, 'InstallCommand must still remove the now-empty decoy Panel/Admin directory.');

        // ORDER MATTERS: each .gitkeep before its own directory's rmdir(),
        // and both directories before their parent's - or an rmdir() still
        // finds something inside and silently fails again.
        $this->assertTrue($unlinkResources < $resources, '.gitkeep must be removed before Resources itself.');
        $this->assertTrue($unlinkWidgets < $widgets, '.gitkeep must be removed before Widgets itself.');
        $this->assertTrue($resources < $parent && $widgets < $parent, 'Both decoy directories must be removed before their parent.');
    }

    public function test_local_auth_prefill_defaults_to_the_first_user_flags(): void
    {
        $install = (string) file_get_contents(
            dirname(__DIR__, 2).'/src/Commands/InstallCommand.php'
        );

        $this->assertStringContainsString(
            "\$email = \$this->option('email');",
            $install,
            'writeLocalAuthPrefill must read --email instead of hardcoding admin@example.com.',
        );
        $this->assertStringContainsString(
            "\$password = \$this->option('password');",
            $install,
            'writeLocalAuthPrefill must read --password instead of hardcoding a default.',
        );
        $this->assertStringContainsString('addcslashes($email', $install);
        $this->assertStringContainsString('addcslashes($password', $install);
    }
}
