<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Cache per user for 1 hour; busted on new test submission
        $cached = Cache::remember("analytics_{$user->id}", 3600, fn() => $this->buildAnalytics($user));

        return Inertia::render('Analytics/Index', array_merge($cached, [
            'daysUntilExam' => $user->daysUntilExam(),
        ]));
    }

    private function buildAnalytics($user): array
    {
        // Per-module band history (chronological, all completed attempts)
        $bandHistory = $user->testAttempts()
            ->with('sections')
            ->where('status', 'completed')
            ->orderBy('submitted_at')
            ->get()
            ->map(fn($a) => [
                'day'       => (int) $user->created_at->diffInDays($a->submitted_at) + 1,
                'date'      => $a->submitted_at->format('M j'),
                'overall'   => (float) $a->overall_band,
                'reading'   => (float) optional($a->sections->firstWhere('module', 'reading'))->band_score,
                'listening' => (float) optional($a->sections->firstWhere('module', 'listening'))->band_score,
                'writing'   => (float) optional($a->sections->firstWhere('module', 'writing'))->band_score,
                'speaking'  => (float) optional($a->sections->firstWhere('module', 'speaking'))->band_score,
            ]);

        // Latest band per module (for gap cards)
        $latest = $bandHistory->last();
        $moduleBands = $latest ? [
            'reading'   => $latest['reading'],
            'listening' => $latest['listening'],
            'writing'   => $latest['writing'],
            'speaking'  => $latest['speaking'],
        ] : [];

        // Per-module target gaps
        $moduleTargets = [
            'reading'   => $user->target_band_reading   ?? $user->target_band,
            'listening' => $user->target_band_listening ?? $user->target_band,
            'writing'   => $user->target_band_writing   ?? $user->target_band,
            'speaking'  => $user->target_band_speaking  ?? $user->target_band,
        ];

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
                'band'     => $snaps->last()->estimated_band,
                'trend'    => round($snaps->last()->accuracy_pct - $snaps->first()->accuracy_pct, 1),
            ])
            ->values();

        // Error pattern aggregation (last 30 days, exclude nulls)
        $attemptIds = $user->testAttempts()
            ->where('status', 'completed')
            ->where('submitted_at', '>=', now()->subDays(30))
            ->pluck('id');

        $errorPatterns = DB::table('test_responses')
            ->whereIn('test_attempt_id', $attemptIds)
            ->whereNotNull('error_tag')
            ->where('is_correct', false)
            ->select('error_tag', DB::raw('count(*) as count'))
            ->groupBy('error_tag')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(fn($r) => ['tag' => $r->error_tag, 'count' => $r->count]);

        // Weekly summary (last 7 days: attempts, avg band, questions answered)
        $weeklyAttempts = $user->testAttempts()
            ->with('sections')
            ->where('status', 'completed')
            ->where('submitted_at', '>=', now()->subDays(6)->startOfDay())
            ->orderBy('submitted_at')
            ->get();

        $weeklySummary = [
            'attempts'           => $weeklyAttempts->count(),
            'avg_band'           => $weeklyAttempts->count()
                ? round($weeklyAttempts->avg('overall_band'), 1)
                : null,
            'questions_answered' => DB::table('test_responses')
                ->whereIn('test_attempt_id', $weeklyAttempts->pluck('id'))
                ->count(),
            'accuracy'           => (function() use ($weeklyAttempts) {
                $ids = $weeklyAttempts->pluck('id');
                $total   = DB::table('test_responses')->whereIn('test_attempt_id', $ids)->count();
                $correct = DB::table('test_responses')->whereIn('test_attempt_id', $ids)->where('is_correct', true)->count();
                return $total > 0 ? round(($correct / $total) * 100, 1) : null;
            })(),
        ];

        // Recent attempts (last 10)
        $recentAttempts = $user->testAttempts()
            ->with(['test', 'sections'])
            ->whereIn('status', ['completed', 'timed_out'])
            ->orderByDesc('submitted_at')
            ->limit(10)
            ->get()
            ->map(fn($a) => [
                'id'           => $a->id,
                'test_title'   => $a->test->title,
                'module'       => $a->test->module,
                'submitted_at' => $a->submitted_at->format('M j, Y'),
                'overall_band' => $a->overall_band,
                'status'       => $a->status,
                'is_diagnostic'=> $a->is_diagnostic,
            ]);

        return [
            'bandHistory'    => $bandHistory,
            'skillData'      => $skillData,
            'errorPatterns'  => $errorPatterns,
            'moduleBands'    => $moduleBands,
            'moduleTargets'  => $moduleTargets,
            'weeklySummary'  => $weeklySummary,
            'recentAttempts' => $recentAttempts,
            'target'         => $user->target_band,
        ];
    }
}
