<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/** Add conservative browser hardening to every Panel-managed response. */
final class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        /*
         * ONE SAFE CORRELATION ID PER REQUEST. A proxy or browser may send an
         * ID so an operator can follow a request across services, but accepting
         * arbitrary header bytes would make it unsafe to reflect into a
         * response header or a log line. Invalid and overlong values are
         * replaced rather than truncated, so two requests can never appear to
         * be the same operation by accident.
         */
        $requestId = $request->headers->get('X-Request-ID');

        if (! is_string($requestId) || preg_match('/\A[a-zA-Z0-9._:-]{1,128}\z/', $requestId) !== 1) {
            $requestId = (string) Str::uuid();
        }

        $request->attributes->set('request_id', $requestId);
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->set('X-Request-ID', $requestId);

        $csp = config('panel.security.content_security_policy');

        if (is_string($csp) && trim($csp) !== '') {
            $response->headers->set('Content-Security-Policy', trim($csp));
        }

        return $response;
    }
}
