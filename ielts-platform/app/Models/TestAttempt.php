<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TestAttempt extends Model
{
    protected $fillable = [
        'user_id','test_id','daily_task_id','status','started_at',
        'submitted_at','time_taken_seconds','overall_band','is_diagnostic','writing_texts',
    ];
    protected $casts = [
        'started_at'=>'datetime','submitted_at'=>'datetime',
        'is_diagnostic'=>'boolean','overall_band'=>'decimal:1',
        'writing_texts'=>'array',
    ];
    public function user() { return $this->belongsTo(User::class); }
    public function test() { return $this->belongsTo(Test::class); }
    public function sections() { return $this->hasMany(TestAttemptSection::class); }
    public function responses() { return $this->hasMany(TestResponse::class); }
}
