<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequireAdmin
{
    private const ADMIN_EMAILS = [];  // Populated via ADMIN_EMAILS env var

    public function handle(Request $request, Closure $next): mixed
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        $adminEmails = array_filter(
            array_map('trim', explode(',', env('ADMIN_EMAILS', '')))
        );

        if (!in_array($user->email, $adminEmails, true)) {
            abort(403, 'Admin access required.');
        }

        return $next($request);
    }
}
