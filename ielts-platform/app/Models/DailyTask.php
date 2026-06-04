<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class DailyTask extends Model
{
    protected $fillable = [
        'study_plan_day_id','sequence','task_type','title','instructions',
        'duration_minutes','linked_test_id','status','completed_at',
    ];
    protected $casts = ['completed_at'=>'datetime'];
    public function day() { return $this->belongsTo(StudyPlanDay::class,'study_plan_day_id'); }
    public function linkedTest() { return $this->belongsTo(Test::class,'linked_test_id'); }
}
