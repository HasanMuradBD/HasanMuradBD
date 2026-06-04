<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TestAttemptSection extends Model
{
    protected $fillable = [
        'test_attempt_id','module','raw_score','band_score',
        'band_task_achievement','band_coherence_cohesion','band_lexical_resource','band_grammatical_range',
        'band_fluency_coherence','band_lexical_resource_sp','band_grammatical_range_sp','band_pronunciation',
        'marked_by','marked_at','notes',
    ];
    protected $casts = ['marked_at'=>'datetime'];
    public function attempt() { return $this->belongsTo(TestAttempt::class,'test_attempt_id'); }
}
