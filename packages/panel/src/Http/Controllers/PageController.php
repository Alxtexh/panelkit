<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Alxtexh\Panel\Widgets;
use Inertia\Response;
use Alxtexh\Panel\Pages\Page;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\Ability;

/**
 * Serves every declared page, and the endpoints those pages own.
 *
 * ONE CONTROLLER FOR ALL OF THEM, exactly as `ResourceController` serves every
 * resource. The alternative - a controller per page - is what the panel had
 * before, and it meant the routing, the authorising and the rendering were
 * rewritten per screen with nothing checking that any of them matched.
 *
 * IT IS DELIBERATELY THIN. Everything interesting is on the page class, because
 * that is the thing an application writes; this resolves a slug, checks a grant
 * and hands over.
 */
final class PageController extends Controller
{
    public function show(Request $request): Response
    {
        $class = $this->resolve($this->slugFor($request));

        abort_unless($class::isAccessible(), 403);

        $this->authorise($class::ability());

        $payload = array_merge(
            $class::data($request),
            [
                /*
                 * THE PAGE DESCRIBES ITS OWN HEADER, so the component does not
                 * repeat what the class already declares. A heading typed into
                 * the Vue file is a second copy of the label that drifts from
                 * the sidebar entry the moment either is edited.
                 */
                'pageHeading' => $class::heading() ?? $class::label(),
                'pageDescription' => $class::description(),

                /*
                 * WIDGETS ON A CUSTOM PAGE - see `Page::headerWidgets()`.
                 *
                 * The same set, the same permission rule and the same single
                 * deferred group as a resource list and the dashboard, because
                 * they are the same question asked on a third screen. Empty
                 * contributes no keys at all, so a page that declares none is
                 * byte-identical to before.
                 */
                ...Widgets\WidgetSet::props($class::headerWidgets(), $request->user()),

                /*
                 * WIDGETS BELOW THE PAGE'S OWN CONTENT - see
                 * `Page::footerWidgets()`. Same rules, same deferred group,
                 * namespaced under `footer` instead of `header` so the two
                 * rows' props never collide.
                 */
                ...Widgets\WidgetSet::props($class::footerWidgets(), $request->user(), 'footer'),

                /*
                 * A custom page is not a resource, so hooks here are the
                 * unscoped ("everywhere") ones - `dashboard.before/after` for
                 * `DashboardPage`, and any position a plugin registered with
                 * no resource list. Inert data on a page that mounts no
                 * `RenderHook` for a position it doesn't use.
                 */
                'renderHooks' => app(PanelManager::class)->renderHooks(null),
            ],
        );

        $layout = $class::layoutSchema();

        if ($layout !== null) {
            $payload['pageLayout'] = $layout;
        }

        if (array_key_exists('save', $class::actions())) {
            $payload['saveHref'] = $this->pageActionUrl($class, 'save');
            $payload['saveMethod'] = strtolower($class::actionMethods()['save'] ?? 'post');
        }

        /*
         * EVERY DECLARED ACTION GETS A STABLE URL PROP. A page with a draft
         * and a publish button used to need a hand-built route prop even
         * though the page registry already owned the action and its ability.
         * Keeping this here makes publish/preview workflows reusable for any
         * page without teaching the client a second routing convention.
         */
        foreach (array_keys($class::actions()) as $action) {
            $key = $action.'Href';

            if (! array_key_exists($key, $payload)) {
                $payload[$key] = $this->pageActionUrl($class, $action);
            }

            $payload[$action.'Method'] = strtolower($class::actionMethods()[$action] ?? 'post');
        }

        return Inertia::render($class::component(), $payload);
    }

    /**
     * @param  class-string<Page>  $class
     */
    private function pageActionUrl(string $class, string $action): string
    {
        $suffix = $class::actionUris()[$action] ?? $action;
        $uri = $suffix === ''
            ? $class::uri()
            : rtrim($class::uri(), '/').'/'.$suffix;

        $panel = app(PanelManager::class)->currentPanel();
        $prefix = trim((string) ($panel?->getPath() ?? ''), '/');
        $path = ($prefix !== '' ? '/'.$prefix : '').'/'.ltrim($uri, '/');

        return url($path);
    }

    /**
     * An endpoint a page declared.
     *
     * THE ACTION'S OWN ABILITY IS CHECKED, not the page's. Seeing and doing are
     * different grants: whoever reads the backup screen is not automatically
     * whoever restores over the live database. A mechanism that checked only the
     * page's ability would make every action on a readable page reachable by
     * everyone who can read it, silently, which is worse than having no
     * mechanism because it looks like it is enforcing something.
     *
     * THE PAGE'S OWN ABILITY IS CHECKED TOO. An action is on a page; somebody
     * who cannot open the page has no business posting to it, whatever else they
     * hold.
     */
    public function action(Request $request): mixed
    {
        $class = $this->resolve($this->slugFor($request));

        abort_unless($class::isAccessible(), 403);

        $action = (string) ($request->route()->defaults['action'] ?? '');

        $declared = $class::actions();

        abort_unless(array_key_exists($action, $declared), 404);
        abort_unless(method_exists($class, $action), 404);

        $this->authorise($class::ability());
        $this->authorise($declared[$action]);

        return $class::$action($request);
    }

    /**
     * Which page this route is for, READ FROM THE ROUTE'S DEFAULTS.
     *
     * NOT A CONTROLLER ARGUMENT, and that is not a style preference - it is
     * what works. The slug is attached with `->defaults('page', ...)` because it
     * is not a URL segment; a page may declare a URI with parameters of its own
     * (`user-management/{tab?}`), and relying on Laravel to bind a non-URI
     * default to a typed method argument by name produced a 404 on the first
     * page converted, from a route that `route:list` showed as registered.
     *
     * Reading the default directly is deterministic, survives `route:cache`
     * (unlike a closure), and cannot be confused by a page that happens to name
     * a URI parameter the same thing.
     */
    private function slugFor(Request $request): string
    {
        return (string) ($request->route()->defaults['page'] ?? '');
    }

    /** @return class-string<Page> */
    private function resolve(string $slug): string
    {
        $class = app(PanelManager::class)->page($slug);

        abort_if($class === null, 404);

        return $class;
    }

    /**
     * ABILITY, NOT POLICY - the difference from a resource.
     *
     * `Resource::can()` asks the Gate for a policy registered against a model,
     * and denies entirely when there is none. A page has no model, so there is
     * nothing to write a policy for; the ability name is checked against the
     * permission system directly, which is the pattern already carrying the
     * panel-level grants.
     *
     * NULL MEANS EVERY SIGNED-IN OPERATOR, and it has to be said out loud in the
     * class to mean that - the default `ability()` is derived from the slug, so
     * a page is protected by having been written rather than by somebody
     * remembering to protect it.
     */
    private function authorise(?string $ability): void
    {
        if ($ability === null) {
            return;
        }

        $user = request()->user();

        abort_if($user === null, 403);
        abort_unless(
            Ability::allows($user, $ability),
            403,
        );
    }
}
