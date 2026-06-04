<?php
namespace App\Services;

use App\Models\StudyPlan;
use App\Models\StudyPlanDay;
use App\Models\DailyTask;
use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\User;

class PlanGeneratorService
{
    // Module rotation priorities based on gap size (largest gap gets more days)
    private const MODULE_THEMES = [
        'reading'   => ['True/False/Not Given Drills', 'Matching Headings', 'Sentence Completion', 'Skimming & Scanning Speed'],
        'listening' => ['Section 1 & 2 Practice', 'Section 3 Academic', 'Section 4 Lectures', 'Note Completion Focus'],
        'writing'   => ['Task 1 Data Description', 'Task 2 Argument Structure', 'Cohesion & Cohesion', 'Lexical Resource Expansion'],
        'speaking'  => ['Part 1 Fluency', 'Part 2 Cue Card', 'Part 3 Extended Response', 'Pronunciation & Intonation'],
    ];

    public function generateFromDiagnostic(User $user, TestAttempt $diagnostic): StudyPlan
    {
        // Cancel any existing active plan
        $user->studyPlans()->where('status', 'active')->update(['status' => 'abandoned']);

        $daysUntilExam = max(1, $user->daysUntilExam());
        $totalDays     = min($daysUntilExam, 90); // cap at 90

        // Calculate gaps per module
        $gaps = $this->calculateGaps($user, $diagnostic);

        $plan = StudyPlan::create([
            'user_id'               => $user->id,
            'status'                => 'active',
            'generated_from'        => 'diagnostic',
            'diagnostic_attempt_id' => $diagnostic->id,
            'start_date'            => today(),
            'exam_date'             => $user->exam_date,
            'total_days'            => $totalDays,
        ]);

        $this->generateDays($plan, $gaps, $totalDays);

        return $plan;
    }

    public function generateGeneric(User $user): StudyPlan
    {
        $user->studyPlans()->where('status', 'active')->update(['status' => 'abandoned']);

        $daysUntilExam = max(1, $user->daysUntilExam());
        $totalDays     = min($daysUntilExam, 90);

        $plan = StudyPlan::create([
            'user_id'        => $user->id,
            'status'         => 'active',
            'generated_from' => 'manual',
            'start_date'     => today(),
            'exam_date'      => $user->exam_date,
            'total_days'     => $totalDays,
        ]);

        // Equal distribution with full mocks every 7 days
        $gaps = ['reading' => 1.5, 'listening' => 1.5, 'writing' => 1.5, 'speaking' => 1.5];
        $this->generateDays($plan, $gaps, $totalDays);

        return $plan;
    }

    private function calculateGaps(User $user, TestAttempt $diagnostic): array
    {
        $diagnostic->load('sections');
        $gaps = [];

        foreach (['reading', 'listening', 'writing', 'speaking'] as $module) {
            $targetKey   = "target_band_{$module}";
            $target      = $user->$targetKey ?? $user->target_band;
            $actual      = (float) optional($diagnostic->sections->firstWhere('module', $module))->band_score ?? 5.0;
            $gaps[$module] = max(0, $target - $actual);
        }

        return $gaps;
    }

    private function generateDays(StudyPlan $plan, array $gaps, int $totalDays): void
    {
        $moduleQueue = $this->buildModuleQueue($gaps, $totalDays);
        $drillTest   = Test::where('type', 'module_practice')->where('is_active', true)->first();
        $mockTest    = Test::where('type', 'full_mock')->where('is_active', true)->first();

        for ($day = 1; $day <= $totalDays; $day++) {
            $isFullMock = ($day % 7 === 0);
            $module     = $isFullMock ? 'full_mock' : ($moduleQueue[$day - 1] ?? 'mixed');
            $themePool  = !$isFullMock ? self::MODULE_THEMES[$module] ?? ['General Practice'] : [];
            $theme      = $isFullMock ? 'Full Mock Exam' : ($themePool[array_rand($themePool)]);

            $planDay = StudyPlanDay::create([
                'study_plan_id'    => $plan->id,
                'day_number'       => $day,
                'calendar_date'    => today()->addDays($day - 1),
                'focus_module'     => $module,
                'focus_theme'      => $theme,
                'estimated_minutes'=> $isFullMock ? 165 : 60,
            ]);

            if ($isFullMock && $mockTest) {
                DailyTask::create([
                    'study_plan_day_id' => $planDay->id,
                    'sequence'          => 1,
                    'task_type'         => 'timed_test',
                    'title'             => 'Full Mock Exam — 2h45m',
                    'duration_minutes'  => 165,
                    'linked_test_id'    => $mockTest->id,
                ]);
            } else {
                $this->createDailyTasks($planDay, $module, $theme, $drillTest);
            }
        }
    }

    private function createDailyTasks($planDay, string $module, string $theme, ?object $drillTest): void
    {
        $tasks = [
            ['sequence' => 1, 'task_type' => 'timed_test',        'title' => "{$theme} — Timed Drill",         'duration_minutes' => 30, 'linked_test_id' => $drillTest?->id],
            ['sequence' => 2, 'task_type' => 'self_mark',          'title' => 'Self-mark against Band descriptor', 'duration_minutes' => 15],
            ['sequence' => 3, 'task_type' => 'vocabulary_review',  'title' => 'Vocabulary spaced repetition',    'duration_minutes' => 15],
        ];

        foreach ($tasks as $task) {
            DailyTask::create(array_merge($task, ['study_plan_day_id' => $planDay->id]));
        }
    }

    private function buildModuleQueue(array $gaps, int $totalDays): array
    {
        $total     = array_sum($gaps) ?: 4;
        $modules   = [];

        foreach ($gaps as $module => $gap) {
            $weight  = $gap / $total;
            $count   = (int) round($weight * $totalDays);
            $modules = array_merge($modules, array_fill(0, max(1, $count), $module));
        }

        shuffle($modules);
        return array_slice($modules, 0, $totalDays);
    }
}
