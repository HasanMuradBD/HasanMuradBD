<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Cashier\Exceptions\IncompletePayment;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Subscription/Index', [
            'trialExpired' => session('trial_expired'),
            'user'         => $request->user()->only('name', 'email', 'trial_ends_at'),
        ]);
    }

    public function checkout(Request $request)
    {
        try {
            return $request->user()
                ->newSubscription('default', config('cashier.price_id'))
                ->checkout([
                    'success_url' => route('dashboard') . '?subscribed=1',
                    'cancel_url'  => route('subscription.index'),
                ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Stripe checkout failed', [
                'user_id' => $request->user()->id,
                'error'   => $e->getMessage(),
            ]);
            return redirect()->route('subscription.index')
                ->withErrors(['checkout' => 'Unable to start checkout. Please try again or contact support.']);
        }
    }

    public function portal(Request $request)
    {
        try {
            return $request->user()->redirectToBillingPortal(route('dashboard'));
        } catch (\Exception $e) {
            return redirect()->route('dashboard')
                ->withErrors(['billing' => 'Unable to open billing portal. Please try again.']);
        }
    }

    /**
     * Handle Stripe webhook events related to subscriptions.
     * Cashier routes `customer.subscription.*` and `invoice.*` here
     * if the method matches the event name (camelCase).
     */
    public function handleInvoicePaymentFailed(Request $request): void
    {
        // Cashier's WebhookController calls this via event name resolution.
        // Grace period: user retains access for 3 days; Cashier sets `ends_at`.
        // We log and will send a WhatsApp nudge via the queue.
        $customerId = $request->input('data.object.customer');
        $user = \App\Models\User::where('stripe_id', $customerId)->first();

        if ($user && $user->whatsapp_opted_in && $user->phone_e164) {
            \App\Jobs\SendWhatsAppMessage::dispatch(
                $user->phone_e164,
                "⚠️ Your IELTSLine payment failed.\n\nYou have a 3-day grace period before access is restricted.\n\nUpdate your card here: " . route('subscription.portal')
            )->onQueue('whatsapp');
        }
    }
}
