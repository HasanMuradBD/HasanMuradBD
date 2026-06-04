<?php
namespace App\Services;

use App\Models\DailyTask;
use App\Models\StudyPlan;
use App\Models\StudyPlanDay;

class PlanRebalanceService
{
    /**
     * After a day is missed, redistribute its pending tasks across the
     * next 3 future plan days at reduced estimated time.
     */
    public function rebalanceAfterMiss(StudyPlan $plan, StudyPlanDay $missedDay): void
    {
        $pendingTasks = $missedDay->tasks()->where('status', 'pending')->get();

        if ($pendingTasks->isEmpty()) return;

        // Get the next 3 pending future days
        $futureDays = $plan->days()
            ->where('calendar_date', '>', $missedDay->calendar_date)
            ->where('status', 'pending')
            ->orderBy('day_number')
            ->limit(3)
            ->get();

        if ($futureDays->isEmpty()) return;

        foreach ($pendingTasks as $i => $task) {
            $targetDay = $futureDays[$i % $futureDays->count()];

            // Clone the task onto the target day with reduced time
            DailyTask::create([
                'study_plan_day_id' => $targetDay->id,
                'sequence'          => $targetDay->tasks()->max('sequence') + 1,
                'task_type'         => $task->task_type,
                'title'             => '[Rescheduled] '.$task->title,
                'instructions'      => $task->instructions,
                'duration_minutes'  => (int) ceil($task->duration_minutes * 0.6), // 60% time (focused recovery)
                'linked_test_id'    => $task->linked_test_id,
                'status'            => 'pending',
            ]);

            // Mark original as rescheduled
            $task->update(['status' => 'skipped']);
        }

        // Bump estimated minutes on the receiving days
        foreach ($futureDays as $day) {
            $day->update([
                'estimated_minutes' => $day->tasks()->where('status', 'pending')->sum('duration_minutes'),
            ]);
        }
    }

    /**
     * Manual rebalance triggered by WhatsApp MISSED reply — same logic.
     */
    public function rebalanceToday(StudyPlan $plan): void
    {
        $today = $plan->today();
        if (!$today || $today->status === 'completed') return;

        $today->update(['status' => 'missed', 'missed_reason' => 'whatsapp_reply']);
        $this->rebalanceAfterMiss($plan, $today);
    }
}
