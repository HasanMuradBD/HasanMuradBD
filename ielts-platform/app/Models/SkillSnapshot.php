<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class SkillSnapshot extends Model
{
    protected $fillable = [
        'user_id','micro_skill_id','snapshot_date','attempts_count',
        'correct_count','accuracy_pct','estimated_band','computed_at',
    ];
    protected $casts = ['snapshot_date'=>'date','computed_at'=>'datetime','estimated_band'=>'decimal:1'];
    public function user() { return $this->belongsTo(User::class); }
    public function microSkill() { return $this->belongsTo(MicroSkill::class); }
}
