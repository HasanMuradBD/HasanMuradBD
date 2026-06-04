<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnforceSubscription
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if ($user->hasAccess()) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Subscription required.'], 402);
        }

        return redirect()->route('subscription.index')
            ->with('trial_expired', true);
    }
}
