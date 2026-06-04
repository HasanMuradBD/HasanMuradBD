<?php
namespace App\Services;

use App\Models\MicroSkill;
use App\Models\SkillSnapshot;
use App\Models\TestResponse;
use Illuminate\Support\Facades\DB;

class SkillSnapshotService
{
    public function refreshForUser(int $userId): void
    {
        $today = now()->toDateString();

        // Get all micro-skills that have questions the user has answered
        $skillIds = DB::table('question_skill_tags')
            ->join('test_responses', 'question_skill_tags.question_id', '=', 'test_responses.question_id')
            ->join('test_attempts', 'test_responses.test_attempt_id', '=', 'test_attempts.id')
            ->where('test_attempts.user_id', $userId)
            ->whereNotNull('test_responses.is_correct')
            ->distinct()
            ->pluck('question_skill_tags.micro_skill_id');

        foreach ($skillIds as $skillId) {
            $stats = DB::table('test_responses')
                ->join('test_attempts', 'test_responses.test_attempt_id', '=', 'test_attempts.id')
                ->join('question_skill_tags', 'test_responses.question_id', '=', 'question_skill_tags.question_id')
                ->where('test_attempts.user_id', $userId)
                ->where('question_skill_tags.micro_skill_id', $skillId)
                ->whereNotNull('test_responses.is_correct')
                ->selectRaw('COUNT(*) as total, SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct')
                ->first();

            if (!$stats || $stats->total === 0) continue;

            $accuracy = round(($stats->correct / $stats->total) * 100, 2);

            SkillSnapshot::updateOrCreate(
                ['user_id' => $userId, 'micro_skill_id' => $skillId, 'snapshot_date' => $today],
                [
                    'attempts_count' => $stats->total,
                    'correct_count'  => $stats->correct,
                    'accuracy_pct'   => $accuracy,
                    'estimated_band' => $this->accuracyToBand($accuracy),
                    'computed_at'    => now(),
                ]
            );
        }
    }

    private function accuracyToBand(float $accuracy): float
    {
        return match(true) {
            $accuracy >= 95 => 9.0,
            $accuracy >= 88 => 8.5,
            $accuracy >= 83 => 8.0,
            $accuracy >= 77 => 7.5,
            $accuracy >= 72 => 7.0,
            $accuracy >= 65 => 6.5,
            $accuracy >= 57 => 6.0,
            $accuracy >= 50 => 5.5,
            $accuracy >= 42 => 5.0,
            $accuracy >= 35 => 4.5,
            $accuracy >= 27 => 4.0,
            default         => 3.5,
        };
    }
}
