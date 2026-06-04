<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudyPlan extends Model
{
    protected $fillable = [
        'user_id', 'status', 'generated_from', 'diagnostic_attempt_id',
        'start_date', 'exam_date', 'total_days',
    ];

    protected $casts = [
        'start_date' => 'date',
        'exam_date' => 'date',
    ];

    public function user() { return $this->belongsTo(User::class); }
    public function days() { return $this->hasMany(StudyPlanDay::class); }
    public function today()
    {
        return $this->days()->where('calendar_date', today())->first();
    }
    public function currentDayNumber(): int
    {
        return (int) now()->diffInDays($this->start_date) + 1;
    }
}
