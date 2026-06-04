<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class StudyPlanDay extends Model
{
    protected $fillable = [
        'study_plan_id','day_number','calendar_date','focus_module',
        'focus_theme','estimated_minutes','status','completed_at','missed_reason',
    ];
    protected $casts = ['calendar_date'=>'date','completed_at'=>'datetime'];
    public function plan() { return $this->belongsTo(StudyPlan::class,'study_plan_id'); }
    public function tasks() { return $this->hasMany(DailyTask::class); }
}
