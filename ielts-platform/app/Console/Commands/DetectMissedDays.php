<?php
namespace App\Console\Commands;

use App\Models\StudyPlanDay;
use App\Services\PlanRebalanceService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class DetectMissedDays extends Command
{
    protected $signature   = 'plans:detect-missed';
    protected $description = 'Mark yesterday\'s incomplete plan days as missed and flag for rebalance';

    public function handle(PlanRebalanceService $rebalancer): void
    {
        $yesterday = Carbon::yesterday()->toDateString();

        $missed = StudyPlanDay::where('calendar_date', $yesterday)
            ->where('status', 'pending')
            ->whereHas('plan', fn($q) => $q->where('status', 'active'))
            ->with('plan.user')
            ->get();

        $this->info("Found {$missed->count()} missed days on {$yesterday}.");

        foreach ($missed as $day) {
            $day->update(['status' => 'missed']);
            $rebalancer->rebalanceAfterMiss($day->plan, $day);
        }

        $this->info('Missed day detection complete.');
    }
}
