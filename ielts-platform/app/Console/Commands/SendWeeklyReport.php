<?php
namespace App\Console\Commands;

use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SendWeeklyReport extends Command
{
    protected $signature   = 'whatsapp:weekly-report';
    protected $description = 'Send weekly progress report via WhatsApp to opted-in users';

    public function handle(WhatsAppService $whatsapp): void
    {
        $users = User::where('whatsapp_opted_in', true)
            ->whereNotNull('phone_e164')
            ->whereNotNull('onboarding_completed_at')
            ->get();

        foreach ($users as $user) {
            $report = $this->buildReport($user);
            if (!$report) continue;

            $whatsapp->sendText($user->phone_e164, $report);
        }

        $this->info("Weekly report dispatched to {$users->count()} users.");
    }

    private function buildReport(User $user): ?string
    {
        $attempts = $user->testAttempts()
            ->with('sections')
            ->where('status', 'completed')
            ->where('submitted_at', '>=', now()->subDays(7)->startOfDay())
            ->orderBy('submitted_at')
            ->get();

        $plan = $user->activePlan;
        if (!$plan && $attempts->isEmpty()) return null;

        $lines = ["📊 *Your Weekly IELTS Report*\n"];

        // Study plan adherence
        if ($plan) {
            $days = $plan->days()
                ->whereBetween('calendar_date', [now()->subDays(6)->toDateString(), now()->toDateString()])
                ->get();

            $completed = $days->where('status', 'completed')->count();
            $total     = $days->count();
            $pct       = $total > 0 ? round(($completed / $total) * 100) : 0;

            $lines[] = "✅ Study adherence: {$completed}/{$total} days ({$pct}%)";
        }

        // Test performance
        if ($attempts->isNotEmpty()) {
            $avgBand = round($attempts->avg('overall_band'), 1);
            $lines[] = "📝 Tests completed: {$attempts->count()}";
            $lines[] = "🎯 Avg band this week: {$avgBand}";

            // Best band this week
            $best = $attempts->sortByDesc('overall_band')->first();
            if ($best?->overall_band) {
                $lines[] = "🏆 Best score: Band {$best->overall_band} ({$best->test->title ?? 'Practice test'})";
            }

            // Module breakdown (latest attempt)
            $last = $attempts->last();
            if ($last?->sections->isNotEmpty()) {
                $parts = $last->sections->map(fn($s) => ucfirst($s->module).': '.$s->band_score)->implode(' | ');
                $lines[] = "📈 Latest: {$parts}";
            }
        } else {
            $lines[] = "📝 No tests completed this week — try to fit in at least one practice session.";
        }

        // Days until exam
        $daysLeft = $user->daysUntilExam();
        if ($daysLeft !== null) {
            $lines[] = "\n⏳ {$daysLeft} days until your exam.";
        }

        // Motivational close
        $closes = [
            "Keep going — consistency is your superpower.",
            "One more week closer. You've got this.",
            "Every practice session is a step toward your target band.",
        ];
        $lines[] = "\n" . $closes[array_rand($closes)];
        $lines[] = "\nSee full analytics: ".config('app.url')."/analytics";

        return implode("\n", $lines);
    }
}
