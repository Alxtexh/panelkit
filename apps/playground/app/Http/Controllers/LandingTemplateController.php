<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

final class LandingTemplateController extends Controller
{
    public function __invoke(Request $request): View|JsonResponse
    {
        $payload = [
            'brand' => (string) config('panel.landing.brand', config('app.name')),
            'tagline' => (string) config('panel.landing.tagline', ''),
            'loginHref' => '/login',
            'registerHref' => '/register',
            'dashboardHref' => '/dashboard',
            'dataUrl' => '/api/landing-template',
        ];

        if ($request->expectsJson()) {
            return response()->json($payload);
        }

        return view('landing-template', ['landing' => $payload]);
    }
}
