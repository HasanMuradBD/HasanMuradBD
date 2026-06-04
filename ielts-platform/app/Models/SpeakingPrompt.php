<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class SpeakingPrompt extends Model
{
    protected $fillable = ['test_id','part_number','topic','prompt_text','follow_up_questions','cue_card_notes','time_allowed_seconds','band_7_model_transcript'];
    protected $casts = ['follow_up_questions'=>'array'];
    public function test() { return $this->belongsTo(Test::class); }
}
