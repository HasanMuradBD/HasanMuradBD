<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Subscription/Index', [
            'trialExpired' => session('trial_expired'),
            'user'         => $request->user()->only('name','email','trial_ends_at'),
        ]);
    }

    public function checkout(Request $request)
    {
        return $request->user()
            ->newSubscription('default', config('cashier.price_id'))
            ->checkout([
                'success_url' => route('dashboard').'?subscribed=1',
                'cancel_url'  => route('subscription.index'),
            ]);
    }

    public function portal(Request $request)
    {
        return $request->user()->redirectToBillingPortal(route('dashboard'));
    }
}
