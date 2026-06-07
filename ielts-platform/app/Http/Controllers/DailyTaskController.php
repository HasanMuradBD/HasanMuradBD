<?php
namespace App\Http\Controllers;

use App\Models\DailyTask;
use App\Models\StudyPlanDay;
use Illuminate\Http\Request;

class DailyTaskController extends Controller
{
    public function complete(Request $request, DailyTask $task)
    {
        abort_if($task->day->plan->user_id !== $request->user()->id, 403);

        $task->update(['status' => 'completed', 'completed_at' => now()]);

        // Check if all tasks for the day are done → mark day complete
        $day = $task->day;
        if ($day->tasks()->where('status', '!=', 'completed')->doesntExist()) {
            $day->update(['status' => 'completed', 'completed_at' => now()]);
        }

        return back()->with('success', 'Task marked complete.');
    }
}
