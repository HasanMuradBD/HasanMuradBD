<?php
namespace App\Http\Controllers;

use App\Models\DailyTask;
use App\Models\StudyPlanDay;
use Illuminate\Http\Request;

class DailyTaskController extends Controller
{
    public function complete(Request $request, DailyTask $task)
    {
        // Ensure task belongs to authenticated user's plan
        $this->authorize('update', $task);

        $task->update(['status' => 'completed', 'completed_at' => now()]);

        // Check if all tasks for the day are done → mark day complete
        $day = $task->day;
        if ($day->tasks()->where('status', '!=', 'completed')->doesntExist()) {
            $day->update(['status' => 'completed', 'completed_at' => now()]);
        }

        return back()->with('success', 'Task marked complete.');
    }
}
