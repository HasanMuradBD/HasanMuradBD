<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'test_id','module','section_number','sequence','question_type',
        'question_text','passage_reference','correct_answer','answer_explanation','difficulty',
    ];
    public function test() { return $this->belongsTo(Test::class); }
    public function microSkills() { return $this->belongsToMany(MicroSkill::class,'question_skill_tags'); }
    public function responses() { return $this->hasMany(TestResponse::class); }
}
