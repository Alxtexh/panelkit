<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Tests\Fixtures\Providers;

use Alxtexh\Panel\Panel;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Tests\Fixtures\Models\Article;
use Alxtexh\Panel\Tests\Fixtures\Models\Comment;
use Alxtexh\Panel\Tests\Fixtures\Models\Post;
use Alxtexh\Panel\Tests\Fixtures\Models\Tag;
use Alxtexh\Panel\Tests\Fixtures\Policies\ArticlePolicy;
use Alxtexh\Panel\Tests\Fixtures\Policies\CommentPolicy;
use Alxtexh\Panel\Tests\Fixtures\Policies\PostPolicy;
use Alxtexh\Panel\Tests\Fixtures\Policies\TagPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/**
 * A panel that exists only to be tested against.
 *
 * THE EQUIVALENT OF FILAMENT'S `tests/src/Fixtures/Providers`, which carries a
 * provider per scenario - tenancy, slugs, domains, SPA, each menu arrangement -
 * so a behaviour is exercised by a panel configured FOR it rather than by
 * whichever panel the demo happened to declare.
 *
 * ROOT PATH, `web` GUARD, NO TENANCY. The reference app's admin panel declares
 * tenant context, database transactions, verified-email middleware and five
 * portals' worth of neighbours; a test running through it inherits all of that,
 * so a failure has many candidate causes. This declares the least a panel can
 * and still route a resource.
 */
final class FixturePanelProvider extends ServiceProvider
{
    public function boot(PanelManager $panels): void
    {
        Gate::policy(Post::class, PostPolicy::class);
        Gate::policy(Article::class, ArticlePolicy::class);
        Gate::policy(Comment::class, CommentPolicy::class);
        Gate::policy(Tag::class, TagPolicy::class);

        /*
         * A `login` ROUTE, because `auth:web` redirects to one by name and a
         * host without it throws "Route [login] not defined" - which reads as
         * the panel being broken rather than as the guest being turned away.
         * Every real host has one; the fixture needs the name, not the screen.
         */
        Route::get('/login', static fn () => 'login')->name('login');

        $panels->registerPanel(
            Panel::make('admin')
                ->path('')
                ->routeName('panel')
                ->guard('web')
                ->middleware(['web'])
                ->authMiddleware(['auth:web'])
                ->idleLock(false)
                /*
                 * DISCOVERED FROM A DIRECTORY, not handed a class list, because
                 * that is the path a real installation takes - `panel.discover`
                 * or a panel's own directory, and `make:panel-resource` writes
                 * into one. A fixture registered by a route nobody else uses
                 * would test a mechanism no consumer runs.
                 */
                ->discoverResources(
                    __DIR__.'/../Resources',
                    'Alxtexh\\Panel\\Tests\\Fixtures\\Resources',
                )
                ->discoverPages(
                    __DIR__.'/../Pages',
                    'Alxtexh\\Panel\\Tests\\Fixtures\\Pages',
                )
                ->feedback(),
        );

        /*
         * A SECOND PORTAL, at its own prefix and with its own resource
         * directory. One panel cannot demonstrate separation: the property
         * under test is that a resource belongs to exactly one portal and is
         * not addressable from another, which needs two to state at all.
         */
        $panels->registerPanel(
            Panel::make('second')
                ->path('second')
                ->routeName('second')
                ->guard('web')
                ->middleware(['web'])
                ->authMiddleware(['auth:web'])
                ->login()
                ->passwordless()
                ->registration()
                ->apps(['billing-portal'])
                ->discoverResources(
                    __DIR__.'/../Second',
                    'Alxtexh\\Panel\\Tests\\Fixtures\\Second',
                )
                ->discoverPages(
                    __DIR__.'/../Pages',
                    'Alxtexh\\Panel\\Tests\\Fixtures\\Pages',
                ),
        );

    }
}
