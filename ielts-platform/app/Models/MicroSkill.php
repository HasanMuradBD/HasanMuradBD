<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class MicroSkill extends Model
{
    protected $fillable = ['module','name','slug','description','parent_skill_id'];
    public function parent() { return $this->belongsTo(MicroSkill::class,'parent_skill_id'); }
    public function children() { return $this->hasMany(MicroSkill::class,'parent_skill_id'); }
    public function questions() { return $this->belongsToMany(Question::class,'question_skill_tags'); }
    public function snapshots() { return $this->hasMany(SkillSnapshot::class); }
}
