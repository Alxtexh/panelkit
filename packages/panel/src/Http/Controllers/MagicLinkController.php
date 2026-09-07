<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Controllers;

use Alxtexh\Panel\Auth\OneTimeCredential;
use Alxtexh\Panel\Mail\AuthPlainMail;
use Alxtexh\Panel\Panel;
use Alxtexh\Panel\PanelManager;
use Alxtexh\Panel\Support\PanelHome;
use Alxtexh\Panel\Support\PanelIdleActivity;
use Alxtexh\Panel\Support\TenantContext;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

/**
 * Passwordless sign-in by emailed link.
 *
 * OFF BY DEFAULT, AND THAT IS THE MOST IMPORTANT LINE IN THIS FILE. A magic link
 * makes the mailbox a complete account takeover path: anybody who can read the
 * email is that person, with nothing between them and a session. No password, no
 * second factor. That is a legitimate trade for some audiences and a bad one for
 * most, so it is a decision an installation makes rather than a default it
 * inherits.
 *
 * IT NEVER SAYS WHETHER THE ADDRESS EXISTS. The response is identical for a
 * known and an unknown address, because the alternative turns this endpoint into
 * a way to enumerate who works at an organisation.
 *
 * THE TENANT COMES FROM THE HOST. `users.email` is unique per tenant now, so an
 * address alone does not identify anybody; a link issued on one organisation's
 * host signs you into that organisation and no other.
 */
final class MagicLinkController extends Controller
{
    public function request(Request $request): RedirectResponse
    {
        $panel = $this->resolvePanel($request);
        abort_unless($this->enabled($panel), 404);

        $validated = $request->validate(['email' => ['required', 'email']]);

        $tenant = app(TenantContext::class)->currentKey();
        $user = $this->findUser($validated['email'], $tenant, $panel);

        if ($user !== null) {
            $token = $this->credential()->issue($validated['email'], $tenant, numeric: false);

            $routeName = $this->consumeRouteName($panel);

            $url = URL::temporarySignedRoute(
                $routeName,
                now()->addMinutes($this->lifetimeMinutes()),
                ['email' => $validated['email'], 'token' => $token],
            );

            Mail::to($this->recipientEmail($user))->send(new AuthPlainMail(
                    heading: 'Sign in to '.$this->organisationLabel($user),
                    body: $url."\n\nThis link works once and expires shortly.",
                    subjectLine: 'Your sign-in link',
                ));
        }

        return back()->with('status', 'If that address has an account here, a sign-in link is on its way.');
    }

    /**
     * Redeem the link.
     *
     * TWO INDEPENDENT CHECKS, and both are required. The signed URL proves the
     * link was issued by this application and has not been tampered with or
     * expired; the stored credential proves it has not already been used.
     */
    public function consume(Request $request): RedirectResponse
    {
        $panel = $this->resolvePanel($request);
        abort_unless($this->enabled($panel), 404);
        abort_unless($request->hasValidSignature(), 401);

        $email = (string) $request->query('email');
        $tenant = app(TenantContext::class)->currentKey();

        if (! $this->credential()->redeem($email, $tenant, (string) $request->query('token'))) {
            return redirect($this->loginUrl($panel))
                ->withErrors(['email' => 'That sign-in link has already been used or has expired.']);
        }

        $user = $this->findUser($email, $tenant, $panel);

        if ($user === null) {
            return redirect($this->loginUrl($panel))
                ->withErrors(['email' => 'That link is no longer valid.']);
        }

        PanelIdleActivity::clearLock($request);
        Auth::guard($this->guard($panel))->login($user);

        $request->session()->regenerate();

        return redirect(PanelIdleActivity::intendedWithoutLock($request, $this->homeUrl($panel)));
    }

    private function enabled(?Panel $panel): bool
    {
        if (! filter_var(config('panel.auth.magic_link', false), FILTER_VALIDATE_BOOLEAN)) {
            return false;
        }

        if ($panel !== null) {
            return $panel->passwordlessActive();
        }

        foreach (app(PanelManager::class)->panels() as $registered) {
            if ($registered->hasPasswordless()) {
                return true;
            }
        }

        return false;
    }

    private function resolvePanel(Request $request): ?Panel
    {
        $id = $request->route()?->defaults['panel'] ?? null;

        if (! is_string($id) || $id === '') {
            return null;
        }

        return app(PanelManager::class)->panel($id);
    }

    private function findUser(string $email, int|string|null $tenant, ?Panel $panel): ?Authenticatable
    {
        $guard = $this->guard($panel);
        $provider = Auth::guard($guard)->getProvider();
        $model = method_exists($provider, 'getModel') ? $provider->getModel() : null;

        if (! is_string($model) || $model === '' || ! is_subclass_of($model, Model::class)) {
            return null;
        }

        $column = config('panel.tenancy.column', 'tenant_id');

        $user = $model::query()
            ->when($tenant !== null && $column !== null, fn ($q) => $q->where($column, $tenant))
            ->where('email', $email)
            ->first();

        return $user instanceof Authenticatable ? $user : null;
    }

    private function credential(): OneTimeCredential
    {
        return new OneTimeCredential(
            (string) config('panel.auth.magic_link_table', 'magic_login_tokens'),
            $this->lifetimeMinutes(),
        );
    }

    private function lifetimeMinutes(): int
    {
        return max(1, (int) config('panel.auth.magic_link_lifetime', 10));
    }

    private function guard(?Panel $panel): string
    {
        return $panel?->getGuard() ?? (string) config('auth.defaults.guard', 'web');
    }

    private function consumeRouteName(?Panel $panel): string
    {
        if ($panel !== null) {
            return $panel->getRouteName().'magic-link.consume';
        }

        return 'magic-link.consume';
    }

    private function loginUrl(?Panel $panel): string
    {
        if ($panel !== null) {
            return '/'.trim(trim($panel->getPath(), '/').'/'.$panel->getLoginSlug(), '/');
        }

        return route('login');
    }

    private function homeUrl(?Panel $panel): string
    {
        if ($panel !== null) {
            return PanelHome::urlFor($panel);
        }

        return PanelHome::urlFor(app(PanelManager::class)->currentPanel())
            ?: '/dashboard';
    }

    private function recipientEmail(Authenticatable $user): string
    {
        if ($user instanceof Model && isset($user->email)) {
            return (string) $user->email;
        }

        return (string) $user->getAuthIdentifier();
    }

    private function organisationLabel(Authenticatable $user): string
    {
        if ($user instanceof Model && method_exists($user, 'tenant')) {
            $tenant = $user->getRelationValue('tenant');
            $name = $tenant instanceof Model ? $tenant->getAttribute('name') : null;

            if (is_string($name) && $name !== '') {
                return $name;
            }
        }

        return 'your account';
    }
}
