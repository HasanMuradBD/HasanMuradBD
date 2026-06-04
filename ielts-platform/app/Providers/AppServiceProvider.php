<?php

namespace App\Providers;

use App\Models\DailyTask;
use App\Models\TestAttempt;
use App\Policies\DailyTaskPolicy;
use App\Policies\TestAttemptPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Gate::policy(TestAttempt::class, TestAttemptPolicy::class);
        Gate::policy(DailyTask::class, DailyTaskPolicy::class);
    }
}
