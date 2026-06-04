<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    protected $fillable = ['title','type','module','academic_or_general','duration_minutes','total_questions','is_active'];
    protected $casts = ['is_active'=>'boolean'];
    public function questions() { return $this->hasMany(Question::class); }
    public function writingPrompts() { return $this->hasMany(WritingPrompt::class); }
    public function speakingPrompts() { return $this->hasMany(SpeakingPrompt::class); }
    public function attempts() { return $this->hasMany(TestAttempt::class); }
}
