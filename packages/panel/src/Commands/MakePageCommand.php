<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\PanelPages;

/**
 * Generate a panel page, and the one-line Vue file that resolves it.
 *
 * BOTH HALVES OR NEITHER. A page class with no component is a route that
 * resolves to nothing. Flags pick a PHP base; Vue is an empty canvas or a
 * shim over a packaged screen (`--till`, `--device-preview`). Optional
 * merchandising screens are written via `PanelPages::writeOptional()`.
 */
final class MakePageCommand extends Command
{
    protected $signature = 'make:panel-page
                            {name : The page class, e.g. ServerHealth}
                            {--dashboard : Empty canvas; PHP extends DashboardPage; commented StatCard import}
                            {--plan-setup : Empty canvas; PHP extends PlanSetupPage; commented PlanGrid import}
                            {--till : Empty TillPage; Vue shims packaged Till (CatalogTill)}
                            {--catalog : Empty CatalogBrowserPage; writes optional Catalog screen}
                            {--catalog-item : Empty CatalogItemPage; writes optional CatalogItem screen}
                            {--register : Empty CatalogRegisterPage; writes optional CatalogRegister screen}
                            {--signatures : Empty SignatureStudioPage; writes optional Signatures screen}
                            {--device-preview : Empty DevicePreviewPage; Vue shims packaged DevicePreview}
                            {--api-keys : Empty ApiKeysPage; Vue shims packaged ApiKeys}
                            {--api-docs : Empty ApiDocsPage; Vue shims packaged ApiDocs (Scalar)}
                            {--invites : Empty InvitePage; Vue shims packaged Invites}
                            {--feature-flags : Empty FeatureFlagsPage; Vue shims packaged FeatureFlags}
                            {--webhooks : Empty WebhookEndpointsPage; Vue shims packaged Webhooks}
                            {--billing-portal : Empty BillingPortalPage; Vue shims packaged BillingPortal}
                            {--email-templates : Empty EmailTemplatePage; Vue shims packaged EmailTemplates}
                            {--onboarding : Empty OnboardingPage; Vue shims packaged Onboarding}
                            {--media-library : Empty MediaLibraryPage; Vue shims packaged MediaLibrary}
                            {--panel= : The panel this screen belongs to. Defaults to panel.default}
                            {--force : Overwrite an existing class or component}';

    protected $description = 'Create a panel page (a screen that is not a resource)';

    /** @var list<string> */
    private const VARIANTS = [
        'dashboard',
        'plan-setup',
        'till',
        'catalog',
        'catalog-item',
        'register',
        'signatures',
        'device-preview',
        'api-keys',
        'api-docs',
        'invites',
        'feature-flags',
        'webhooks',
        'billing-portal',
        'email-templates',
        'onboarding',
        'media-library',
    ];

    public function handle(): int
    {
        $name = Str::studly(str_replace(['Page', '.php'], '', (string) $this->argument('name')));
        $class = $name.'Page';
        $slug = Str::kebab($name);

        $directory = app_path('Panel/Pages');
        $path = $directory.'/'.$class.'.php';

        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        if (file_exists($path) && ! $this->option('force')) {
            $this->components->error("app/Panel/Pages/{$class}.php already exists. Use --force to replace it.");

            return self::FAILURE;
        }

        $chosen = [];

        foreach (self::VARIANTS as $flag) {
            if ($this->option($flag)) {
                $chosen[] = $flag;
            }
        }

        if (count($chosen) > 1) {
            $this->components->error('Use only one of --'.implode(', --', self::VARIANTS).'.');

            return self::FAILURE;
        }

        $variant = $chosen[0] ?? 'page';

        try {
            $panel = $this->targetPanel();
        } catch (\RuntimeException $e) {
            $this->components->error($e->getMessage());

            return self::FAILURE;
        }

        file_put_contents($path, match ($variant) {
            'dashboard' => $this->dashboardStub($class, $slug, $name, $panel),
            'plan-setup' => $this->planSetupStub($class, $slug, $name, $panel),
            'till' => $this->tillStub($class, $slug, $name, $panel),
            'catalog' => $this->catalogStub($class, $slug, $name, $panel),
            'catalog-item' => $this->catalogItemStub($class, $slug, $name, $panel),
            'register' => $this->registerStub($class, $slug, $name, $panel),
            'signatures' => $this->signaturesStub($class, $slug, $name, $panel),
            'device-preview' => $this->devicePreviewStub($class, $slug, $name, $panel),
            'api-keys' => $this->apiKeysStub($class, $slug, $name, $panel),
            'api-docs' => $this->apiDocsStub($class, $slug, $name, $panel),
            'invites' => $this->invitesStub($class, $slug, $name, $panel),
            'feature-flags' => $this->featureFlagsStub($class, $slug, $name, $panel),
            'webhooks' => $this->webhooksStub($class, $slug, $name, $panel),
            'billing-portal' => $this->billingPortalStub($class, $slug, $name, $panel),
            'email-templates' => $this->emailTemplatesStub($class, $slug, $name, $panel),
            'onboarding' => $this->onboardingStub($class, $slug, $name, $panel),
            'media-library' => $this->mediaLibraryStub($class, $slug, $name, $panel),
            default => $this->pageStub($class, $slug, $name, $panel),
        });

        $this->components->info("Created app/Panel/Pages/{$class}.php");
        $this->components->twoColumnDetail('Panel', $panel);

        $this->writeComponent($name, $variant);

        if (in_array($variant, ['plan-setup', 'till', 'catalog', 'catalog-item', 'register', 'signatures', 'device-preview', 'api-keys', 'api-docs', 'invites', 'feature-flags', 'webhooks', 'billing-portal', 'email-templates', 'onboarding', 'media-library'], true)) {
            $optional = PanelPages::writeOptional((bool) $this->option('force'));

            if ($optional['written'] !== []) {
                $this->components->info('Wrote optional screens: '.implode(', ', $optional['written']));
            }
        }

        $this->newLine();
        $this->components->info("Visit /{$slug}. Discovery registers it; there is no route to add.");

        /*
         * THE ABILITY IS NAMED, because it is derived and therefore easy to
         * miss. A page defaults to `view_{slug}` and denies anybody without it -
         * which is the safe posture and looks exactly like a broken screen to
         * whoever forgot to grant it.
         */
        $this->line('  It requires the ability `view_'.Str::snake($slug).'`.');
        $this->line('  Run `php artisan panel:permissions sync` to add it to the matrix,');
        $this->line('  or return null from ability() for every signed-in operator.');

        return self::SUCCESS;
    }

    /**
     * The one-line page file, in the same shape `panel:install` writes.
     *
     * Always an empty Vue file. Flags only change the commented import.
     */
    private function writeComponent(string $name, string $hint = 'page'): void
    {
        $directory = resource_path('js/pages');

        if (! is_dir($directory)) {
            $this->components->warn(
                'No resources/js/pages directory, so no component was written. The page will '
                .'render nothing until one exists at '.$name.'.vue'
            );

            return;
        }

        $path = $directory.'/'.$name.'.vue';

        if (file_exists($path) && ! $this->option('force')) {
            $this->components->warn("resources/js/pages/{$name}.vue already exists, keeping yours.");

            return;
        }

        $shim = match ($hint) {
            'till' => 'Till',
            'device-preview' => 'DevicePreview',
            'api-keys' => 'ApiKeys',
            'api-docs' => 'ApiDocs',
            'invites' => 'Invites',
            'feature-flags' => 'FeatureFlags',
            default => null,
        };

        file_put_contents($path, $shim !== null ? PanelPages::stub($shim) : $this->pageVue($name, $hint));

        $this->components->info("Created resources/js/pages/{$name}.vue");
    }

    /**
     * WHICH PANEL THIS SCREEN BELONGS TO.
     *
     * `make:panel-resource` HAS TAKEN `--panel` SINCE IT EXISTED AND THIS DID
     * NOT, which on a multi-panel application put every generated page in the
     * DEFAULT panel - so thirteen platform screens landed in a tenant sidebar
     * and had `panel()` patched into each of them afterwards by a script. That
     * is the exact failure `Pages` warns about in its own docblock.
     *
     * THE PROPERTY IS ALWAYS WRITTEN, even for the default panel. `Page` carries
     * `protected static string $panel = 'admin'` - a literal, not the configured
     * default - so an application that renamed its only panel generated pages
     * declaring one that does not exist: discovered, registered and reachable
     * from nowhere, with no error.
     *
     * THE DIRECTORY DOES NOT CHANGE. Unlike resources, pages are discovered from
     * one place and say which panel they are for, so a second portal's screens
     * live beside the first's and nothing needs a new discovery path.
     */
    private function targetPanel(): string
    {
        $requested = $this->option('panel');
        $id = $requested !== null ? (string) $requested : (string) config('panel.default', 'admin');

        $panels = app(PanelManager::class)->panels();

        if ($requested !== null && ! array_key_exists($id, $panels)) {
            $known = $panels === [] ? 'none are registered' : implode(', ', array_keys($panels));

            throw new \RuntimeException("No panel [{$id}]. Registered: {$known}.");
        }

        return $id;
    }

    private function pageStub(string $class, string $slug, string $name, string $panel): string
    {
        return <<<PHP
        <?php

        declare(strict_types=1);

        namespace App\\Panel\\Pages;

        use Illuminate\\Http\\Request;
        use Alxtexh\\Panel\\Pages\\Page;

        /**
         * A custom panel screen for {$name}. Add its purpose and data contract
         * here when the screen is introduced to the application.
         */
        final class {$class} extends Page
        {
            protected static string \$panel = '{$panel}';

            protected static string \$icon = 'file';

            protected static ?string \$group = null;

            public static function component(): string
            {
                return '{$name}';
            }

            /**
             * MAY QUERY, unlike a resource's table() and form(). This runs per
             * request for one signed-in person and returns their data.
             *
             * @return array<string, mixed>
             */
            public static function data(Request \$request): array
            {
                return [];
            }

            /*
             * Endpoints this page owns, each with its own ability - seeing and
             * doing are different grants. The handler is a static method here
             * named for the action.
             *
             * public static function actions(): array
             * {
             *     return ['save' => 'manage_{$slug}'];
             * }
             */
        }

        PHP;
    }

    private function dashboardStub(string $class, string $slug, string $name, string $panel): string
    {
        return <<<PHP
        <?php

        declare(strict_types=1);

        namespace App\\Panel\\Pages;

        use Alxtexh\\Panel\\Pages\\DashboardPage;
        use Alxtexh\\Panel\\Widgets\\ChartWidget;
        use Alxtexh\\Panel\\Widgets\\StatWidget;

        /**
         * A dashboard for {$name}. Document the operational question it answers
         * before adding widgets so the first screen remains intentionally small.
         *
         * The Vue file is an empty canvas. Import StatCard / ChartCard, or
         * return 'PanelDashboard' from component() to use the packaged screen.
         */
        final class {$class} extends DashboardPage
        {
            protected static string \$panel = '{$panel}';

            protected static ?string \$group = null;

            public static function component(): string
            {
                return '{$name}';
            }

            /**
             * WIDGETS RESOLVE ONE AT A TIME, each in its own deferred prop, so
             * the layout arrives before any query has run and one slow
             * aggregate delays only itself.
             *
             * @return list<StatWidget>
             */
            public static function stats(): array
            {
                return [
                    // StatWidget::make('clients', 'Clients')
                    //     ->value(fn (): int => Client::query()->count())
                    //     ->ability('view_commercial_widgets'),
                ];
            }

            /** @return list<ChartWidget> */
            public static function charts(): array
            {
                return [
                    // ChartWidget::make('signups', 'Sign-ups')
                    //     ->type('line')
                    //     ->withPeriods()
                    //     ->data(fn (\$period, \$now): array => [...]),
                ];
            }
        }

        PHP;
    }

    private function pageVue(string $name, string $hint = 'catalog'): string
    {
        $example = match ($hint) {
            'dashboard' => 'StatCard, ChartCard',
            'plan-setup' => 'PlanGrid, PlanEditor',
            'catalog' => 'CatalogGrid, CatalogBrowser',
            'catalog-item' => 'CatalogItemView',
            'register' => 'CatalogRegister',
            'signatures' => 'SignatureStudio',
            'api-keys' => 'ApiKeys',
            'api-docs' => 'ApiDocs',
            'invites' => 'Invites',
            'webhooks' => 'Webhooks',
            'feature-flags' => 'FeatureFlags',
            'billing-portal' => 'BillingPortal',
            'email-templates' => 'EmailTemplates',
            'onboarding' => 'Onboarding',
            'media-library' => 'MediaLibrary',
            default => 'CatalogGrid',
        };

        return <<<VUE
        <script setup lang="ts">
        /*
         * Empty canvas. Import what you need from `@alxtexh-enterprise/panel`:
         *
         *   import { {$example} } from '@alxtexh-enterprise/panel'
         *   import { AppPageFooter } from '@alxtexh-enterprise/panel'
         *
         * Put AppPageFooter at the bottom of this file when the panel did not
         * call ->pageFooter(true). The shell already renders one if it did.
         *
         * PAGE_SHELL_STACK fills the main content area. Do not wrap panel pages
         * in max-w-* + mx-auto unless the screen is intentionally narrow
         * (login, onboarding, marketing).
         *
         * Props come from `{$name}Page::data()`.
         */
        import { Head } from '@inertiajs/vue3'
        import { PAGE_SHELL_STACK } from '@alxtexh-enterprise/panel'

        defineProps<{
            pageHeading?: string
            pageDescription?: string | null
        }>()
        </script>

        <template>
            <Head :title="pageHeading ?? '{$name}'" />

            <div :class="PAGE_SHELL_STACK">
                <header v-if="pageHeading">
                    <h1 class="text-2xl font-semibold tracking-tight">{{ pageHeading }}</h1>
                    <p v-if="pageDescription" class="mt-1 text-sm text-muted-foreground">
                        {{ pageDescription }}
                    </p>
                </header>
            </div>
        </template>
        VUE;
    }

    private function planSetupStub(string $class, string $slug, string $name, string $panel): string
    {
        return <<<PHP
        <?php

        declare(strict_types=1);

        namespace App\\Panel\\Pages;

        use Illuminate\\Http\\Request;
        use Alxtexh\\Panel\\Pages\\PlanSetupPage;

        /**
         * Subscription plans for this product. Persist via your own Plan model.
         *
         * Register modules on the panel with Module::make(). modules() and
         * limits() default from that registry. SaaS apps MUST set
         * ModuleRegistry::grants() from the active plan.
         */
        final class {$class} extends PlanSetupPage
        {
            protected static string \$panel = '{$panel}';

            protected static ?string \$group = null;

            public static function component(): string
            {
                return '{$name}';
            }

            public static function ability(): ?string
            {
                return null;
            }

            public static function plans(Request \$request): array
            {
                return [];
            }

            public static function persist(array \$plan): void
            {
                // Save to your Plan model. perk values of -1 mean Unlimited.
            }

            public static function forget(string \$id): void
            {
            }
        }

        PHP;
    }

    private function tillStub(string $class, string $slug, string $name, string $panel): string
    {
        return <<<PHP
        <?php

        declare(strict_types=1);

        namespace App\\Panel\\Pages;

        use Alxtexh\\Panel\\Pages\\TillPage;

        /**
         * A till. Fill items() (and optional facets() / taxRate()). Tax defaults to 0.
         */
        final class {$class} extends TillPage
        {
            protected static string \$panel = '{$panel}';

            protected static ?string \$group = null;

            public static function component(): string
            {
                return '{$name}';
            }

            public static function ability(): ?string
            {
                return null;
            }
        }

        PHP;
    }

    private function catalogStub(string $class, string $slug, string $name, string $panel): string
    {
        return <<<PHP
        <?php

        declare(strict_types=1);

        namespace App\\Panel\\Pages;

        use Alxtexh\\Panel\\Pages\\CatalogBrowserPage;

        /**
         * A merchandising grid. Fill tabs().
         */
        final class {$class} extends CatalogBrowserPage
        {
            protected static string \$panel = '{$panel}';

            protected static ?string \$group = null;

            public static function component(): string
            {
                return '{$name}';
            }

            public static function ability(): ?string
            {
                return null;
            }

            public static function tabs(): array
            {
                return [];
            }
        }

        PHP;
    }

    private function catalogItemStub(string $class, string $slug, string $name, string $panel): string
    {
        return <<<PHP
        <?php

        declare(strict_types=1);

        namespace App\\Panel\\Pages;

        use Alxtexh\\Panel\\Pages\\CatalogItemPage;

        /**
         * One catalog item. Hide it from the sidebar; the grid is the way in.
         */
        final class {$class} extends CatalogItemPage
        {
            protected static string \$panel = '{$panel}';

            public static function uri(): string
            {
                return 'catalog/{key}';
            }

            public static function component(): string
            {
                return '{$name}';
            }

            public static function ability(): ?string
            {
                return null;
            }

            public static function find(string \$key): ?array
            {
                return null;
            }
        }

        PHP;
    }

    private function registerStub(string $class, string $slug, string $name, string $panel): string
    {
        return <<<PHP
        <?php

        declare(strict_types=1);

        namespace App\\Panel\\Pages;

        use Alxtexh\\Panel\\Pages\\CatalogRegisterPage;

        /**
         * Catalog cards plus a register table. Fill cards() and rows().
         */
        final class {$class} extends CatalogRegisterPage
        {
            protected static string \$panel = '{$panel}';

            protected static ?string \$group = null;

            public static function component(): string
            {
                return '{$name}';
            }

            public static function ability(): ?string
            {
                return null;
            }

            public static function cards(): array
            {
                return [];
            }

            public static function rows(): array
            {
                return [];
            }
        }

        PHP;
    }

    private function signaturesStub(string $class, string $slug, string $name, string $panel): string
    {
        return <<<PHP
        <?php

        declare(strict_types=1);

        namespace App\\Panel\\Pages;

        use Alxtexh\\Panel\\Pages\\SignatureStudioPage;

        /**
         * Signature pad and document preview. Fill documents().
         */
        final class {$class} extends SignatureStudioPage
        {
            protected static string \$panel = '{$panel}';

            protected static ?string \$group = null;

            public static function component(): string
            {
                return '{$name}';
            }

            public static function ability(): ?string
            {
                return null;
            }

            public static function documents(): array
            {
                return [];
            }
        }

        PHP;
    }

    private function devicePreviewStub(string $class, string $slug, string $name, string $panel): string
    {
        return <<<PHP
        <?php

        declare(strict_types=1);

        namespace App\\Panel\\Pages;

        use Alxtexh\\Panel\\Pages\\DevicePreviewPage;

        /**
         * The panel inside a device frame. Override previewUrl() if the host home is not enough.
         */
        final class {$class} extends DevicePreviewPage
        {
            protected static string \$panel = '{$panel}';

            protected static ?string \$group = null;

            public static function component(): string
            {
                return '{$name}';
            }

            public static function ability(): ?string
            {
                return null;
            }
        }

        PHP;
    }

    private function apiKeysStub(string $class, string $slug, string $name, string $panel): string
    {
        return $this->extendsPageStub($class, $name, $panel, 'ApiKeysPage', 'API keys for the public API.');
    }

    private function apiDocsStub(string $class, string $slug, string $name, string $panel): string
    {
        return $this->extendsPageStub($class, $name, $panel, 'ApiDocsPage', 'Scalar API reference for this panel.');
    }

    private function invitesStub(string $class, string $slug, string $name, string $panel): string
    {
        return $this->extendsPageStub($class, $name, $panel, 'InvitePage', 'Pending team invites.');
    }

    private function featureFlagsStub(string $class, string $slug, string $name, string $panel): string
    {
        return $this->extendsPageStub($class, $name, $panel, 'FeatureFlagsPage', 'Feature flags for this organisation.');
    }

    private function webhooksStub(string $class, string $slug, string $name, string $panel): string
    {
        return $this->extendsPageStub($class, $name, $panel, 'WebhookEndpointsPage', 'Outbound webhook endpoints.');
    }

    private function billingPortalStub(string $class, string $slug, string $name, string $panel): string
    {
        return $this->extendsPageStub($class, $name, $panel, 'BillingPortalPage', 'Subscription and invoices.');
    }

    private function emailTemplatesStub(string $class, string $slug, string $name, string $panel): string
    {
        return $this->extendsPageStub($class, $name, $panel, 'EmailTemplatePage', 'Transactional email templates.');
    }

    private function onboardingStub(string $class, string $slug, string $name, string $panel): string
    {
        return $this->extendsPageStub($class, $name, $panel, 'OnboardingPage', 'First-run onboarding steps.');
    }

    private function mediaLibraryStub(string $class, string $slug, string $name, string $panel): string
    {
        return $this->extendsPageStub($class, $name, $panel, 'MediaLibraryPage', 'Shared media files.');
    }

    private function extendsPageStub(
        string $class,
        string $name,
        string $panel,
        string $base,
        string $description,
    ): string {
        return <<<PHP
        <?php

        declare(strict_types=1);

        namespace App\\Panel\\Pages;

        use Alxtexh\\Panel\\Pages\\{$base};

        /** {$description} Enable with `Panel::apps([...])` on the portal. */
        final class {$class} extends {$base}
        {
            protected static string \$panel = '{$panel}';

            public static function component(): string
            {
                return '{$name}';
            }

            public static function ability(): ?string
            {
                return null;
            }
        }

        PHP;
    }
}
