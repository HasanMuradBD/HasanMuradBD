<?php
namespace App\Policies;

use App\Models\DailyTask;
use App\Models\User;

class DailyTaskPolicy
{
    public function update(User $user, DailyTask $task): bool
    {
        return $task->day->plan->user_id === $user->id;
    }
}
