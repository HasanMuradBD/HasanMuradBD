<?php
namespace App\Http\Controllers;

use App\Services\ChallengeProfileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        try {
            $cached = Cache::remember("analytics_{$user->id}", 3600, fn() => $this->buildAnalytics($user));
        } catch (\Throwable $e) {
            Cache::forget("analytics_{$user->id}");
            $cached = $this->emptyAnalytics($user);
        }

        return Inertia::render('Analytics/Index', array_merge($cached, [
            'daysUntilExam' => $user->daysUntilExam(),
        ]));
    }

    private function buildAnalytics($user): array
    {
        $bandHistory = $user->testAttempts()
            ->with('sections')
            ->where('status', 'completed')
            ->whereNotNull('submitted_at')
            ->orderBy('submitted_at')
            ->get()
            ->map(fn($a) => [
                'day'       => (int) $user->created_at->diffInDays($a->submitted_at) + 1,
                'date'      => $a->submitted_at->format('M j'),
                'overall'   => $a->overall_band ? (float) $a->overall_band : null,
                'reading'   => ($s = $a->sections->firstWhere('module', 'reading'))  ? (float) $s->band_score : null,
                'listening' => ($s = $a->sections->firstWhere('module', 'listening'))? (float) $s->band_score : null,
                'writing'   => ($s = $a->sections->firstWhere('module', 'writing'))  ? (float) $s->band_score : null,
                'speaking'  => ($s = $a->sections->firstWhere('module', 'speaking')) ? (float) $s->band_score : null,
            ]);

        $latest = $bandHistory->last();
        $moduleBands = $latest ? [
            'reading'   => $latest['reading'],
            'listening' => $latest['listening'],
            'writing'   => $latest['writing'],
            'speaking'  => $latest['speaking'],
        ] : [];

        $moduleTargets = [
            'reading'   => $user->target_band_reading   ?? $user->target_band,
            'listening' => $user->target_band_listening ?? $user->target_band,
            'writing'   => $user->target_band_writing   ?? $user->target_band,
            'speaking'  => $user->target_band_speaking  ?? $user->target_band,
        ];

        $skillData = collect();
        try {
            $skillData = $user->skillSnapshots()
                ->with('microSkill')
                ->where('snapshot_date', '>=', now()->subDays(30))
                ->orderBy('snapshot_date')
                ->get()
                ->filter(fn($s) => $s->microSkill !== null)
                ->groupBy('micro_skill_id')
                ->map(fn($snaps) => [
                    'skill'    => $snaps->first()->microSkill->name,
                    'module'   => $snaps->first()->microSkill->module,
                    'accuracy' => round($snaps->avg('accuracy_pct'), 1),
                    'band'     => $snaps->last()->estimated_band,
                    'trend'    => round($snaps->last()->accuracy_pct - $snaps->first()->accuracy_pct, 1),
                ])
                ->values();
        } catch (\Throwable) {}

        $attemptIds = $user->testAttempts()
            ->where('status', 'completed')
            ->whereNotNull('submitted_at')
            ->where('submitted_at', '>=', now()->subDays(30))
            ->pluck('id');

        $errorPatterns = collect();
        try {
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
        } catch (\Throwable) {}

        $weeklyAttempts = $user->testAttempts()
            ->with('sections')
            ->where('status', 'completed')
            ->whereNotNull('submitted_at')
            ->where('submitted_at', '>=', now()->subDays(6)->startOfDay())
            ->orderBy('submitted_at')
            ->get();

        $weekIds = $weeklyAttempts->pluck('id');
        $totalQ   = DB::table('test_responses')->whereIn('test_attempt_id', $weekIds)->count();
        $correctQ = DB::table('test_responses')->whereIn('test_attempt_id', $weekIds)->where('is_correct', true)->count();

        $weeklySummary = [
            'attempts'           => $weeklyAttempts->count(),
            'avg_band'           => $weeklyAttempts->count() ? round($weeklyAttempts->avg('overall_band'), 1) : null,
            'questions_answered' => $totalQ,
            'accuracy'           => $totalQ > 0 ? round(($correctQ / $totalQ) * 100, 1) : null,
        ];

        $recentAttempts = $user->testAttempts()
            ->with(['test:id,title,module', 'sections:id,test_attempt_id,module,band_score'])
            ->whereIn('status', ['completed', 'timed_out'])
            ->whereNotNull('submitted_at')
            ->orderByDesc('submitted_at')
            ->limit(10)
            ->get()
            ->map(fn($a) => [
                'id'            => $a->id,
                'test_title'    => $a->test->title ?? '—',
                'module'        => $a->test->module ?? null,
                'submitted_at'  => $a->submitted_at->format('M j, Y'),
                'overall_band'  => $a->overall_band,
                'status'        => $a->status,
                'is_diagnostic' => $a->is_diagnostic,
            ]);

        $challengeProfile = [];
        try {
            $challengeProfile = app(ChallengeProfileService::class)->buildProfile($user);
        } catch (\Throwable) {}

        return [
            'bandHistory'      => $bandHistory,
            'skillData'        => $skillData,
            'errorPatterns'    => $errorPatterns,
            'moduleBands'      => $moduleBands,
            'moduleTargets'    => $moduleTargets,
            'weeklySummary'    => $weeklySummary,
            'recentAttempts'   => $recentAttempts,
            'challengeProfile' => $challengeProfile,
            'target'           => $user->target_band,
        ];
    }

    private function emptyAnalytics($user): array
    {
        return [
            'bandHistory'      => collect(),
            'skillData'        => collect(),
            'errorPatterns'    => collect(),
            'moduleBands'      => [],
            'moduleTargets'    => [
                'reading'   => $user->target_band,
                'listening' => $user->target_band,
                'writing'   => $user->target_band,
                'speaking'  => $user->target_band,
            ],
            'weeklySummary'    => ['attempts' => 0, 'avg_band' => null, 'questions_answered' => 0, 'accuracy' => null],
            'recentAttempts'   => collect(),
            'challengeProfile' => [],
            'target'           => $user->target_band,
        ];
    }
}
