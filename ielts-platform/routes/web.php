<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

// Auth
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/forgot-password', fn() => redirect()->route('login'))->name('password.request');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Subscription (accessible without active subscription)
    Route::get('/subscribe', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::get('/subscribe/checkout', [SubscriptionController::class, 'checkout'])->name('subscription.checkout');
    Route::get('/billing/portal', [SubscriptionController::class, 'portal'])->name('subscription.portal');

    // Protected routes — require active trial or subscription
    Route::middleware(\App\Http\Middleware\EnforceSubscription::class)->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/analytics', fn() => inertia('Analytics/Index'))->name('analytics.index');
        Route::get('/tests', fn() => inertia('Exam/TestList'))->name('tests.index');
    });
});
