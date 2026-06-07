<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class DailyTip extends Model
{
    protected $fillable = ['type', 'title', 'content', 'example', 'target_date', 'is_fallback'];

    protected $casts = ['target_date' => 'date', 'is_fallback' => 'boolean'];

    public static function forToday(): array
    {
        $tip = static::where('target_date', Carbon::today()->toDateString())->first()
            ?? static::where('is_fallback', true)->inRandomOrder()->first();

        if ($tip) {
            return $tip->only(['type', 'title', 'content', 'example']);
        }

        // Hardcoded safety fallback — always shows something
        return [
            'type'    => 'exam_tip',
            'title'   => 'Skim Before You Read',
            'content' => 'In IELTS Reading, spend 60 seconds skimming the passage headings and first sentences before tackling questions. This mental map saves significant time.',
            'example' => null,
        ];
    }
}
