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

        $plan       = $user->activePlan;
        $todayTasks = collect();
        $planData   = null;
        $weekStats  = null;

        if ($plan) {
            $today = $plan->today();

            $todayTasks = $today
                ? $today->tasks()->with('linkedTest')->orderBy('sequence')->get()
                : collect();

            // Week stats: completed vs total days in last 7
            $weekDays = $plan->days()
                ->whereBetween('calendar_date', [now()->subDays(6)->toDateString(), now()->toDateString()])
                ->get();

            $weekStats = [
                'completed' => $weekDays->where('status', 'completed')->count(),
                'missed'    => $weekDays->where('status', 'missed')->count(),
                'total'     => $weekDays->count(),
            ];

            // Upcoming 3 days (excluding today)
            $upcoming = $plan->days()
                ->where('calendar_date', '>', today()->toDateString())
                ->where('status', 'pending')
                ->orderBy('calendar_date')
                ->limit(3)
                ->get()
                ->map(fn($d) => [
                    'day_number'   => $d->day_number,
                    'calendar_date'=> $d->calendar_date->format('D, M j'),
                    'focus_theme'  => $d->focus_theme,
                    'focus_module' => $d->focus_module,
                    'estimated_minutes' => $d->estimated_minutes,
                ]);

            $planData = [
                'id'            => $plan->id,
                'current_day'   => $plan->currentDayNumber(),
                'total_days'    => $plan->total_days,
                'exam_date'     => $plan->exam_date->toDateString(),
                'today_theme'   => $today?->focus_theme ?? 'Rest Day',
                'today_module'  => $today?->focus_module,
                'today_status'  => $today?->status ?? 'pending',
                'upcoming'      => $upcoming,
            ];
        }

        // Band history for trajectory chart (per module)
        $bandHistory = $user->testAttempts()
            ->with('sections')
            ->where('status', 'completed')
            ->orderBy('submitted_at')
            ->get()
            ->map(fn($a) => [
                'day'       => (int) $user->created_at->diffInDays($a->submitted_at) + 1,
                'band'      => (float) $a->overall_band,
                'reading'   => (float) optional($a->sections->firstWhere('module', 'reading'))->band_score,
                'listening' => (float) optional($a->sections->firstWhere('module', 'listening'))->band_score,
                'writing'   => (float) optional($a->sections->firstWhere('module', 'writing'))->band_score,
                'speaking'  => (float) optional($a->sections->firstWhere('module', 'speaking'))->band_score,
            ]);

        // Top 3 weakest micro-skills (lowest accuracy, last 30 days)
        $weakSkills = $user->skillSnapshots()
            ->with('microSkill')
            ->where('snapshot_date', '>=', now()->subDays(30))
            ->orderBy('accuracy_pct')
            ->limit(3)
            ->get()
            ->map(fn($s) => [
                'name'     => $s->microSkill->name,
                'module'   => $s->microSkill->module,
                'accuracy' => $s->accuracy_pct,
                'band'     => $s->estimated_band,
            ]);

        return Inertia::render('Dashboard/Index', [
            'plan'          => $planData,
            'todayTasks'    => $todayTasks,
            'bandHistory'   => $bandHistory,
            'weekStats'     => $weekStats,
            'weakSkills'    => $weakSkills,
            'trialDaysLeft' => $user->isOnTrial() ? $user->trialDaysLeft() : null,
            'daysUntilExam' => $user->daysUntilExam(),
        ]);
    }
}
