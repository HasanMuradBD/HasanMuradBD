<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Per-module band history
        $bandHistory = $user->testAttempts()
            ->with('sections')
            ->where('status', 'completed')
            ->orderBy('submitted_at')
            ->get()
            ->map(fn($a) => [
                'day'       => (int) $user->created_at->diffInDays($a->submitted_at) + 1,
                'overall'   => (float) $a->overall_band,
                'reading'   => (float) optional($a->sections->firstWhere('module','reading'))->band_score,
                'listening' => (float) optional($a->sections->firstWhere('module','listening'))->band_score,
                'writing'   => (float) optional($a->sections->firstWhere('module','writing'))->band_score,
                'speaking'  => (float) optional($a->sections->firstWhere('module','speaking'))->band_score,
            ]);

        // Micro-skill accuracy snapshots (last 30 days)
        $skillData = $user->skillSnapshots()
            ->with('microSkill')
            ->where('snapshot_date', '>=', now()->subDays(30))
            ->orderBy('snapshot_date')
            ->get()
            ->groupBy('micro_skill_id')
            ->map(fn($snaps) => [
                'skill'    => $snaps->first()->microSkill->name,
                'module'   => $snaps->first()->microSkill->module,
                'accuracy' => round($snaps->avg('accuracy_pct'), 1),
                'trend'    => $snaps->last()->accuracy_pct - $snaps->first()->accuracy_pct,
            ])
            ->values();

        return Inertia::render('Analytics/Index', [
            'bandHistory'   => $bandHistory,
            'skillData'     => $skillData,
            'target'        => $user->target_band,
            'daysUntilExam' => $user->daysUntilExam(),
        ]);
    }
}
