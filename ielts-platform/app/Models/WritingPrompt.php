<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class WritingPrompt extends Model
{
    protected $fillable = ['test_id','task_number','prompt_text','data_description','band_7_model_answer','band_8_model_answer','time_allowed_minutes','word_target_min'];
    public function test() { return $this->belongsTo(Test::class); }
}
