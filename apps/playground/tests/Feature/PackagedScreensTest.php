<?php

declare(strict_types=1);

namespace Tests\Feature;

use Alxtexh\Panel\Support\PanelPages;
use Alxtexh\Panel\Support\UserRoles;
use Tests\TestCase;

/**
 * The PHP half names a screen; something has to render it.
 *
 * THE FAILURE THIS EXISTS TO CATCH ALREADY HAPPENED, and it was invisible from
 * inside this repository. `alxtexh-enterprise/panel` answers five requests with
 * `Inertia::render('ResourceIndex')` and friends - and shipped no Vue at all.
 * Every one of those screens rendered perfectly here, because THIS application
 * happened to have a file of that name in `resources/js/pages`. A fresh
 * `composer require alxtexh-enterprise/panel` got routes that resolved to components that
 * did not exist: a white page and a console error naming a file the developer
 * had never heard of, on the first screen they opened.
 *
 * Nothing caught it. The suite passed, `panel:doctor` was clean, the build was
 * clean, and the playground was green - because the playground was quietly
 * supplying the missing half.
 *
 * SO THE TEST READS THE PACKAGE, NOT THE APPLICATION. It walks the render calls
 * in `packages/panel/src`, and for each one demands a component in
 * `@alxtexh-enterprise/panel/inertia`. An application may still override any screen - that is
 * what the one-line page file is for - but it can no longer be the only place
 * the screen exists.
 *
 * IT IS A SOURCE-LEVEL TEST because there is no runtime seam: PHP cannot see a
 * Vue file, Vue cannot see a controller, and the string between them is checked
 * by nothing. Reading both sides is the only place the two can be compared.
 */
final class PackagedScreensTest extends TestCase
{
    /** Where the two halves live, from this application. */
    private const PANEL_SRC = __DIR__.'/../../../../packages/panel/src';

    private const SCREENS = __DIR__.'/../../../../packages/ui/inertia/pages';

    /**
     * @return list<string>
     */
    private function renderedPageNames(): array
    {
        $names = [];

        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator(self::PANEL_SRC, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($files as $file) {
            if ($file->getExtension() !== 'php') {
                continue;
            }

            preg_match_all(
                "/Inertia::render\(\s*'([A-Za-z0-9\/]+)'/",
                (string) file_get_contents($file->getPathname()),
                $matches,
            );

            foreach ($matches[1] as $name) {
                $names[$name] = true;
            }
        }

        return array_keys($names);
    }

    /**
     * EVERY SCREEN THE PACKAGE RENDERS, THE PACKAGE SHIPS.
     *
     * The one assertion that would have caught the original gap, and the one
     * that keeps catching it: a sixth `Inertia::render` added to the PHP half
     * without a component beside it fails here rather than in a consumer's
     * browser.
     */
    public function test_every_screen_the_php_half_renders_is_shipped_as_a_component(): void
    {
        $names = $this->renderedPageNames();

        // A floor, so a broken pattern cannot pass by matching nothing.
        $this->assertGreaterThanOrEqual(5, count($names), 'No rendered page names were found to check.');

        foreach ($names as $name) {
            $this->assertFileExists(
                self::SCREENS.'/'.$name.'.vue',
                "The panel renders [{$name}], which @alxtexh-enterprise/panel/inertia does not ship. A fresh install "
                .'of the package gets a route that resolves to nothing: a white page, in the browser, '
                .'with a console error naming a file the developer has never seen.',
            );
        }
    }

    /** And exports it, so an application can import it by name. */
    public function test_the_package_exports_every_screen_it_ships(): void
    {
        $index = (string) file_get_contents(self::SCREENS.'/../index.ts');

        foreach ($this->renderedPageNames() as $name) {
            $this->assertStringContainsString(
                "./pages/{$name}.vue",
                $index,
                "[{$name}] is shipped but not exported from the package entry point.",
            );
        }
    }

    /**
     * AND A PAGE FILE IS WRITTEN FOR EVERY ONE.
     *
     * ONE LIST, READ BY BOTH COMMANDS. It used to live inside `panel:install`,
     * which made it invisible to `panel:update` - and a screen written by the
     * installer and not the updater is a route that resolves to nothing for
     * everybody who upgraded rather than installed fresh. That is not
     * hypothetical: `settings/Roles` shipped exactly that way.
     */
    public function test_a_page_file_is_written_for_every_screen(): void
    {
        /** @var list<string> $installed */
        $installed = PanelPages::SCREENS;

        foreach ($this->renderedPageNames() as $name) {
            $this->assertContains(
                $name,
                $installed,
                "panel:install writes no page file for [{$name}], so a fresh install cannot resolve it.",
            );
        }
    }

    /**
     * THIS APPLICATION STILL RESOLVES EACH ONE.
     *
     * The package half being present is necessary and not sufficient: Inertia's
     * Vite plugin globs `resources/js/pages`, so a screen with no file here is
     * one this application cannot resolve however complete the package is. That
     * file is also the override point, so its CONTENTS are deliberately not
     * asserted - only that something answers to the name.
     */
    public function test_this_application_has_a_page_file_for_every_screen(): void
    {
        foreach ($this->renderedPageNames() as $name) {
            $this->assertFileExists(
                resource_path("js/pages/{$name}.vue"),
                "Nothing in resources/js/pages answers to [{$name}], so the panel renders a page "
                .'Inertia cannot resolve.',
            );
        }
    }

    /**
     * AND EVERY ONE OF THOSE FILES HAS A TEMPLATE.
     *
     * THIS IS NOT A STYLE RULE. The obvious way to write a one-line page file is
     *
     *     export { default } from '@alxtexh-enterprise/panel/pages/ResourceIndex.vue'
     *
     * which type-checks, builds, and emits a chunk containing the entire real
     * component - and renders NOTHING. An SFC with no `<template>` block
     * compiles to a component with no render function, so Vue mounts it and
     * draws an empty comment node.
     *
     * The only symptom is a blank page under a working header. `vue-tsc` is
     * silent, the build is silent, and a PRODUCTION build is silent in the
     * browser too - the warning that names the cause, "Component is missing
     * template or render function", exists only in a development build. It was
     * found by installing into a fresh application and looking at the screen.
     *
     * A text assertion is crude and it is the only place this is checkable
     * without a browser. It costs nothing and it catches the exact mistake.
     */
    public function test_every_page_file_renders_something(): void
    {
        foreach ($this->renderedPageNames() as $name) {
            $contents = (string) file_get_contents(resource_path("js/pages/{$name}.vue"));

            $this->assertStringContainsString(
                '<template>',
                $contents,
                "resources/js/pages/{$name}.vue has no template block, so it compiles to a component "
                .'with no render function and draws an empty page. A re-export of another component '
                .'is not enough - wrap it.',
            );
        }
    }

    /**
     * THE INSTALLER WRITES THE SCREENS INTO A FRESH LARAVEL APP.
     *
     * It did not, and this is the largest thing that has been wrong here.
     * `resources/js/pages` comes from a STARTER KIT, not from `laravel/laravel`
     * - so in a fresh application the directory does not exist when
     * `panel:install` reaches this step, and the writer returned early with a
     * warning. Not one packaged screen was written: no ResourceIndex, no
     * dashboard, no error page.
     *
     * NOTHING FAILED. The install reported success. Every server-side check
     * passed, because they all ask the SERVER: `/customers` really does answer
     * 302, `/dashboard` really does name its component in the Inertia payload.
     * Inertia resolves a page by globbing that directory in the BROWSER, so the
     * panel was blank for anybody who opened it, and the only evidence was one
     * warning in the middle of the install output.
     *
     * ASSERTED AGAINST A TEMPORARY RESOURCE ROOT, so it exercises the real
     * `write()` on a directory that genuinely does not exist rather than on this
     * application, which has had one since the beginning - which is exactly why
     * the gap survived.
     */
    public function test_it_creates_the_pages_directory_in_an_application_that_has_none(): void
    {
        $base = sys_get_temp_dir().'/alxtexhpanel-pages-'.bin2hex(random_bytes(4));
        $resources = $base.'/resources';

        mkdir($resources.'/js', 0755, true);
        file_put_contents($resources.'/js/app.ts', '// the bootstrap panel:install publishes');

        $original = base_path();
        app()->setBasePath($base);

        try {
            $this->assertDirectoryDoesNotExist($resources.'/js/pages', 'Fixture assumption.');

            $result = PanelPages::write();

            $this->assertNotNull($result['directory'], 'The writer gave up on a Vue Inertia app.');
            $this->assertContains('ResourceIndex', $result['written']);
            $this->assertFileExists($resources.'/js/pages/ResourceIndex.vue');
            $this->assertFileExists($resources.'/js/pages/errors/Error.vue');
            $this->assertFileDoesNotExist($resources.'/js/pages/landing/Composed.vue');
        } finally {
            app()->setBasePath($original);
            exec('rm -rf '.escapeshellarg($base));
        }
    }

    /**
     * AND IT STILL DECLINES WHEN THE APPLICATION IS NOT VUE.
     *
     * The early return was right about its own question - writing Vue files into
     * a React or Blade application would be guessing. What was wrong was asking
     * it AFTER `panel:install` had already published the Vue bootstrap.
     */
    public function test_it_still_declines_when_there_is_no_vue_bootstrap(): void
    {
        $base = sys_get_temp_dir().'/alxtexhpanel-nopages-'.bin2hex(random_bytes(4));

        mkdir($base.'/resources/js', 0755, true);

        $original = base_path();
        app()->setBasePath($base);

        try {
            $this->assertNull(PanelPages::write()['directory']);
            $this->assertDirectoryDoesNotExist($base.'/resources/js/pages');
        } finally {
            app()->setBasePath($original);
            exec('rm -rf '.escapeshellarg($base));
        }
    }

    /**
     * THE TRAIT WITHOUT WHICH THE PANEL DENIES EVERYTHING.
     *
     * `spatie/laravel-permission` is a hard dependency: the tables migrate,
     * `panel:permissions sync` creates every ability and an Administrator role
     * that holds them all, and each of those reports success. But a stock
     * `laravel/laravel` `User` does not use `HasRoles`, so it has no
     * `assignRole()` and no `hasPermission()` - the role exists and nobody can
     * hold it, and every screen refuses the person who owns the installation.
     * Nothing throws and nothing logs.
     *
     * AGAINST THE HELPER, NOT AGAINST `panel:install`. The first version of
     * this test ran the installer with a temporary base path, and
     * `Application::setBasePath()` does not move `configPath` - so
     * `publishConfig()` wrote the package's default config OVER this
     * application's, and sixty-five tests failed for reasons that had nothing
     * to do with roles. A test that damages the repository it is testing is
     * worse than no test.
     */
    public function test_the_trait_is_added_to_a_stock_user_model(): void
    {
        $stock = <<<'PHP'
        <?php

        namespace App\Models;

        use Illuminate\Foundation\Auth\User as Authenticatable;
        use Illuminate\Notifications\Notifiable;

        class User extends Authenticatable
        {
            use Notifiable;

            protected $fillable = ['name', 'email', 'password'];
        }

        PHP;

        $this->assertFalse(UserRoles::present($stock), 'Fixture assumption: a stock model has none.');

        $updated = UserRoles::add($stock);

        $this->assertNotNull($updated, 'A stock Laravel user model must be a shape this can edit.');
        $this->assertStringContainsString(UserRoles::IMPORT, $updated);
        $this->assertStringContainsString('    '.UserRoles::TRAIT, $updated);

        // The trait goes INSIDE the class, not beside the imports.
        $this->assertGreaterThan(
            strpos($updated, 'class User extends'),
            strpos($updated, '    '.UserRoles::TRAIT),
        );
    }

    /** And a model that already has it is returned untouched. */
    public function test_a_model_that_already_holds_roles_is_left_alone(): void
    {
        $already = file_get_contents(app_path('Models/User.php'));

        $this->assertTrue(UserRoles::present($already), 'Fixture assumption: this app has the trait.');
        $this->assertSame($already, UserRoles::add($already));
    }

    /**
     * AN UNFAMILIAR SHAPE IS REPORTED, NOT GUESSED AT. Rewriting somebody's user
     * model on a pattern that did not match is worse than telling them what to
     * write - `panel:install` prints the two lines and moves on.
     */
    public function test_an_unfamiliar_model_is_declined_rather_than_mangled(): void
    {
        $this->assertNull(UserRoles::add("<?php\n\nreturn 'not a class at all';\n"));
    }

    /**
     * And the path resolver only claims what it can actually resolve.
     *
     * SEPARATORS ARE NORMALISED BEFORE COMPARING, because on Windows the two
     * sides spell the same file differently and both are right. `app_path()`
     * joins with a backslash and then appends the forward slash it was handed
     * - `...\app\Models/User.php` - while the resolver builds with forward
     * slashes throughout. Windows opens either; asserting on the punctuation
     * failed a correct resolver on one operating system.
     */
    public function test_it_resolves_only_models_under_the_app_namespace(): void
    {
        $normalise = static fn (?string $p): ?string => $p === null
            ? null
            : str_replace('\\', '/', $p);

        $this->assertSame(
            $normalise(app_path('Models/User.php')),
            $normalise(UserRoles::pathFor('App\\Models\\User', app_path())),
        );

        $this->assertNull(UserRoles::pathFor('Vendor\\Package\\User', app_path()));
        $this->assertNull(UserRoles::pathFor('App\\Models\\NoSuchModel', app_path()));
    }
}
