<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\PanelIdleActivity;
use Symfony\Component\HttpFoundation\Response;

/**
 * Holds a locked session on the lock screen.
 *
 * WHAT THIS IS FOR is the person standing at an unattended desk. It is not a
 * security boundary against anyone holding the session cookie: the session is
 * still valid. Real protection for an unattended machine is the operating
 * system's screen lock.
 *
 * A LOCKED SESSION WITH NO USER MUST NOT TRAP. If the auth entry has gone
 * (concurrent logout, a store that dropped that key and not this one), the
 * lock screen has nobody to check a password against and reports every unlock
 * as wrong, and even `/login` bounces back unless this passes through and
 * clears the stale flag.
 */
final class EnsurePanelIsUnlocked
{
    public const SESSION_KEY = PanelIdleActivity::LOCKED_AT;

    public function handle(Request $request, Closure $next): Response
    {
        /*
         * IMPORTED LANDINGS ARE STANDALONE PUBLIC DOCUMENTS.
         *
         * The playground serves compiled React landing applications under
         * `/panelkit/landings/*`. They intentionally sit outside the panel
         * shell and its authentication/idle-lock boundary. Applying this
         * middleware to their HTML, client-side routes, or assets can redirect
         * a locked session into a route that only exists in the imported app
         * (for example `/app/login`), leaving a white React shell. The host's
         * real `/login` and panel routes remain protected by their normal
         * middleware; this exemption is limited to the namespaced static
         * landing surface.
        */
        if ($request->is('panelkit/landings/*')) {
            return $next($request);
        }

        if (! $request->hasSession() || ! PanelIdleActivity::isLocked($request)) {
            return $next($request);
        }

        $panel = app(PanelManager::class)->currentPanel();
        $guard = $panel?->getGuard();
        $user = $guard === null ? $request->user() : $request->user($guard);

        if ($user === null) {
            PanelIdleActivity::clearLock($request);

            return $next($request);
        }

        if (PanelIdleActivity::isExempt($request)) {
            return $next($request);
        }

        if ($panel === null) {
            return $next($request);
        }

        return PanelIdleActivity::deny($request, $panel);
    }
}
