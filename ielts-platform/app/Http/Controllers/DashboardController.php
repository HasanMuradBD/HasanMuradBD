<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->onboarding_completed_at) {
            return redirect()->route('onboarding');
        }

        $plan = $user->activePlan;
        $todayTasks = [];
        $planData = null;

        if ($plan) {
            $today = $plan->today();
            $todayTasks = $today?->tasks()->with('linkedTest')->orderBy('sequence')->get() ?? collect();
            $planData = [
                'id'           => $plan->id,
                'current_day'  => $plan->currentDayNumber(),
                'total_days'   => $plan->total_days,
                'exam_date'    => $plan->exam_date->toDateString(),
                'today_theme'  => $today?->focus_theme ?? 'Rest Day',
            ];
        }

        $bandHistory = $user->testAttempts()
            ->whereNotNull('overall_band')
            ->where('status', 'completed')
            ->orderBy('submitted_at')
            ->get()
            ->map(fn($a) => [
                'day'  => (int) $user->created_at->diffInDays($a->submitted_at) + 1,
                'band' => (float) $a->overall_band,
            ]);

        return Inertia::render('Dashboard/Index', [
            'plan'          => $planData,
            'todayTasks'    => $todayTasks,
            'bandHistory'   => $bandHistory,
            'trialDaysLeft' => $user->isOnTrial() ? $user->trialDaysLeft() : null,
        ]);
    }
}
