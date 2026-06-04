<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TestResponse extends Model
{
    protected $fillable = [
        'test_attempt_id','question_id','user_answer','is_correct',
        'time_spent_seconds','flagged_for_review','error_tag',
    ];
    protected $casts = ['is_correct'=>'boolean','flagged_for_review'=>'boolean'];
    public function attempt() { return $this->belongsTo(TestAttempt::class,'test_attempt_id'); }
    public function question() { return $this->belongsTo(Question::class); }
}
