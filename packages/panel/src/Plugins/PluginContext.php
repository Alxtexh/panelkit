<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Plugins;

use Closure;
use InvalidArgumentException;
use Alxtexh\Panel\Panel;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Pages\Page;
use Alxtexh\Panel\Resources\Resource;
use Alxtexh\Panel\Widgets\ChartWidget;
use Alxtexh\Panel\Widgets\StatWidget;
use Alxtexh\Panel\Widgets\TableWidget;

/**
 * What a plugin is allowed to do to a panel.
 *
 * AN ADD-ONLY SURFACE, and that is the whole design. The obvious API would hand
 * the plugin the `Panel` itself, which is also an API where installing a package
 * can change the guard, the tenancy context or the middleware stack - so a
 * billing plugin could turn off tenant scoping, and the symptom would be one
 * organisation seeing another's records with nothing in the diff to explain it.
 * Everything here appends; nothing here reconfigures.
 *
 * THE PANEL IS READABLE, because a plugin legitimately needs to know where it
 * has landed - the path to build a link, the id to key a setting, whether the
 * context is central so it can register a different screen. Reading is not the
 * dangerous half.
 */
final class PluginContext
{
    /** @var list<class-string<Resource>> */
    private array $resources = [];

    /** @var list<array{title: string, href: string, icon: string, group: string|null}> */
    private array $pages = [];

    /** @var list<StatWidget|ChartWidget|TableWidget> */
    private array $widgets = [];

    /** @var list<class-string<Page>> */
    private array $pageClasses = [];

    /** @var list<Closure> */
    private array $routes = [];

    /**
     * Markup a plugin injects at a named position - roadmap 4.4.
     *
     * @var list<array{position: string, component: string, props: array<string, mixed>, resources: list<string>|null, version: int}>
     */
    private array $renders = [];

    public function __construct(
        public readonly Panel $panel,
        private readonly PanelManager $manager,
    ) {}

    /**
     * Register resource classes into this panel.
     *
     * THE PANEL COMES FROM HERE, NOT FROM THE CLASS. A resource declares
     * `protected static string $panel` and a plugin cannot know what an
     * installation called its portals - a package hardcoding `'admin'` would
     * land nowhere on an installation whose operator portal is `'isp'`. The
     * manager records the panel this registration happened for, and that
     * overrides the class's own declaration.
     *
     * @param  list<class-string<Resource>>  $classes
     */
    public function resources(array $classes): self
    {
        $this->manager->registerResources($classes, $this->panel->id);

        $this->resources = [...$this->resources, ...$classes];

        return $this;
    }

    /**
     * Add a sidebar navigation entry.
     *
     * THE HREF IS PREFIXED WITH THE PANEL'S PATH here, so a plugin passes
     * `billing/invoices` and gets `/reseller/billing/invoices` on a portal
     * mounted there. A plugin that had to assemble that itself would be a plugin
     * that works in exactly one installation - which is the same bug the export
     * download had, one layer up.
     *
     * THIS DOES NOT REGISTER A ROUTE. For a routable panel screen, use
     * `pageClasses()` instead: the Page class mounts at boot and places itself
     * in the sidebar. Pair `page()` with `routes()` when the handler is not a
     * Page subclass.
     */
    public function page(string $title, string $href, string $icon = 'dot', ?string $group = null): self
    {
        $prefix = rtrim('/'.trim($this->panel->getPath(), '/'), '/');

        $this->pages[] = [
            'title' => $title,
            'href' => $prefix.'/'.ltrim($href, '/'),
            'icon' => $icon,
            'group' => $group,
        ];

        return $this;
    }

    /**
     * Register routable Page classes into this plugin's target panel.
     *
     * The registration happens immediately through `PanelManager`, so the
     * panel's route table can also mount them at boot time.
     *
     * @param  list<class-string<Page>>  $classes
     */
    public function pageClasses(array $classes): self
    {
        foreach ($classes as $class) {
            if (! is_subclass_of($class, Page::class)) {
                throw new InvalidArgumentException(
                    'pageClasses() expects a list of Page classes.'
                );
            }
        }

        $this->manager->registerPages($classes, $this->panel->id);

        $this->pageClasses = [...$this->pageClasses, ...$classes];

        return $this;
    }

    /**
     * Add routes inside this panel's group.
     *
     * MOUNTED WITH THE PANEL'S PREFIX, MIDDLEWARE AND NAME ALREADY APPLIED, so a
     * plugin route is authenticated and tenant-scoped exactly like a built-in
     * one. A plugin registering routes in its own service provider would get
     * none of that - and an unauthenticated route into a tenant's records is not
     * a mistake anybody spots in review of a package they did not write.
     *
     * The callback receives the panel, for a plugin that needs to vary.
     *
     * @param  Closure(Panel): void  $routes
     */
    public function routes(Closure $routes): self
    {
        $this->routes[] = $routes;

        return $this;
    }

    /**
     * Register widgets into this plugin's target panel.
     *
     * @param  list<mixed>  $widgets
     */
    public function widgets(array $widgets): self
    {
        $validated = [];
        foreach ($widgets as $widget) {
            if (! ($widget instanceof StatWidget
                || $widget instanceof ChartWidget
                || $widget instanceof TableWidget)) {
                throw new InvalidArgumentException(
                    'widgets() expects a list of StatWidget, ChartWidget, or TableWidget instances.'
                );
            }

            $validated[] = $widget;
        }

        $this->widgets = [...$this->widgets, ...$validated];

        return $this;
    }

    /**
     * Put a component at a named position on screens the panel already owns.
     *
     * WITHOUT THIS A PLUGIN THAT WANTED ONE SENTENCE ON AN EXISTING SCREEN
     * HAD TO FORK THE SCREEN - and a fork is a copy that stops receiving
     * fixes, discovered by a customer. See `RenderHooks` for the positions
     * and for why this takes a component name rather than HTML.
     *
     * THE POSITION IS VALIDATED HERE, at registration, rather than being
     * looked up at render time and quietly matching nothing. A typo that
     * renders nowhere costs somebody an hour of debugging their own code.
     *
     * @param  array<string, mixed>  $props  Serialised into the page payload.
     * @param  list<string>|null  $resources  Resource keys to limit this to; null is everywhere.
     * @param  int  $version  Render-hook contract version; defaults to the current version.
     */
    public function render(
        string $position,
        string $component,
        array $props = [],
        ?array $resources = null,
        int $version = RenderHooks::VERSION,
    ): self {
        if (! RenderHooks::isPosition($position)) {
            throw new InvalidArgumentException(
                "[{$position}] is not a render position. One of: "
                .implode(', ', RenderHooks::positions()).'.'
            );
        }

        $this->renders[] = [
            'position' => $position,
            'component' => $component,
            'props' => $props,
            'resources' => $resources,
            'version' => $version,
        ];

        return $this;
    }

    /** @return list<class-string> */
    public function registeredResources(): array
    {
        return $this->resources;
    }

    /**
     * @return list<class-string<Page>>
     */
    public function registeredPageClasses(): array
    {
        return $this->pageClasses;
    }

    /**
     * @return list<array{position: string, component: string, props: array<string, mixed>, resources: list<string>|null, version: int}>
     */
    public function registeredRenders(): array
    {
        return $this->renders;
    }

    /** @return list<array{title: string, href: string, icon: string, group: string|null}> */
    public function registeredPages(): array
    {
        return $this->pages;
    }

    /**
     * @return list<StatWidget|ChartWidget|TableWidget>
     */
    public function registeredWidgets(): array
    {
        return $this->widgets;
    }

    /** @return list<Closure> */
    public function registeredRoutes(): array
    {
        return $this->routes;
    }
}
