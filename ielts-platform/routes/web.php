<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\AnalyticsController;
use Illuminate\Support\Facades\Route;

// Stripe webhooks — no CSRF, no auth
Route::post('/stripe/webhook', '\Laravel\Cashier\Http\Controllers\WebhookController@handleWebhook')
    ->name('cashier.webhook');

// WhatsApp inbound webhook — no CSRF
Route::get('/whatsapp/webhook', [\App\Http\Controllers\WhatsApp\InboundController::class, 'verify'])
    ->name('whatsapp.verify');
Route::post('/whatsapp/webhook', [\App\Http\Controllers\WhatsApp\InboundController::class, 'handle'])
    ->name('whatsapp.inbound');

// Auth views — Fortify handles the POST routes automatically
Route::middleware('guest')->group(function () {
    // Fortify handles: GET /login, POST /login, GET /register, POST /register,
    // GET /forgot-password, POST /forgot-password, GET /reset-password, POST /reset-password
});

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    // Email verification (Fortify handles POST /email/verification-notification)
    Route::get('/email/verify', fn() => inertia('Auth/VerifyEmail', ['status' => session('status')]))
        ->name('verification.notice');

    // Subscription (accessible without active subscription — user may need to subscribe)
    Route::get('/subscribe', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::get('/subscribe/checkout', [SubscriptionController::class, 'checkout'])->name('subscription.checkout');
    Route::get('/billing/portal', [SubscriptionController::class, 'portal'])->name('subscription.portal');

    // Onboarding — accessible before plan exists, but after auth+subscription
    Route::middleware([\App\Http\Middleware\EnforceSubscription::class])->group(function () {
        Route::get('/onboarding', [\App\Http\Controllers\OnboardingController::class, 'show'])->name('onboarding');
        Route::post('/onboarding/skip', [\App\Http\Controllers\OnboardingController::class, 'skip'])->name('onboarding.skip');
    });

    // Protected platform routes — require active trial or subscription
    Route::middleware([\App\Http\Middleware\EnforceSubscription::class])->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
        Route::get('/tests', fn() => inertia('Exam/TestList'))->name('tests.index');

        // Daily task completion
        Route::patch('/daily-tasks/{task}/complete', [\App\Http\Controllers\DailyTaskController::class, 'complete'])
            ->name('daily-tasks.complete');

        // Test attempt lifecycle
        Route::post('/test-attempts', [\App\Http\Controllers\TestAttemptController::class, 'store'])
            ->name('test-attempts.start');
        Route::get('/test-attempts/{attempt}', [\App\Http\Controllers\TestAttemptController::class, 'show'])
            ->name('test-attempts.show');
        Route::post('/test-attempts/{attempt}/submit', [\App\Http\Controllers\TestAttemptController::class, 'submit'])
            ->name('test-attempts.submit')
            ->middleware('throttle:10,1');  // max 10 submit attempts per minute per user
        Route::get('/test-attempts/{attempt}/review', [\App\Http\Controllers\TestAttemptController::class, 'review'])
            ->name('test-attempts.review');

        // Profile
        Route::get('/profile', fn() => inertia('Profile/Index'))->name('profile.index');
    });
});

// Admin panel — requires auth + ADMIN_EMAILS env var
Route::middleware(['auth', \App\Http\Middleware\RequireAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/',              [\App\Http\Controllers\Admin\AdminController::class, 'dashboard']) ->name('dashboard');
    Route::get('/tests',         [\App\Http\Controllers\Admin\AdminController::class, 'tests'])     ->name('tests');
    Route::get('/tests/{test}',  [\App\Http\Controllers\Admin\AdminController::class, 'testShow'])  ->name('tests.show');
    Route::post('/tests/{test}/toggle', [\App\Http\Controllers\Admin\AdminController::class, 'toggleTest'])->name('tests.toggle');
    Route::get('/questions',     [\App\Http\Controllers\Admin\AdminController::class, 'questions']) ->name('questions');
    Route::get('/micro-skills',  [\App\Http\Controllers\Admin\AdminController::class, 'microSkills'])->name('micro-skills');
    Route::get('/users',         [\App\Http\Controllers\Admin\AdminController::class, 'users'])     ->name('users');
});
