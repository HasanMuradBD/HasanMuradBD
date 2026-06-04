<?php
namespace App\Services;

use App\Models\TestAttempt;
use App\Models\TestAttemptSection;

class BandCalculatorService
{
    // Official IELTS Reading Academic raw-score → band table
    private const READING_BANDS = [
        39 => 9.0, 38 => 8.5, 37 => 8.0, 36 => 7.5,
        35 => 7.0, 34 => 7.0, 33 => 6.5, 32 => 6.5,
        31 => 6.0, 30 => 6.0, 29 => 6.0, 28 => 5.5,
        27 => 5.5, 26 => 5.0, 25 => 5.0, 24 => 5.0,
        23 => 4.5, 22 => 4.5, 21 => 4.0, 20 => 4.0,
        19 => 3.5, 18 => 3.5, 17 => 3.0, 16 => 3.0,
    ];

    // Official IELTS Listening raw-score → band table
    private const LISTENING_BANDS = [
        40 => 9.0, 39 => 9.0, 38 => 8.5, 37 => 8.5,
        36 => 8.0, 35 => 8.0, 34 => 7.5, 33 => 7.5,
        32 => 7.0, 31 => 7.0, 30 => 6.5, 29 => 6.5,
        28 => 6.0, 27 => 6.0, 26 => 6.0, 25 => 5.5,
        24 => 5.5, 23 => 5.0, 22 => 5.0, 21 => 5.0,
        20 => 4.5, 19 => 4.5, 18 => 4.0, 17 => 4.0,
    ];

    public function calculate(TestAttempt $attempt): void
    {
        $attempt->load('test.questions', 'responses');
        $moduleScores = [];

        // Score Reading and Listening from correct/wrong responses
        foreach (['reading', 'listening'] as $module) {
            $questions = $attempt->test->questions->where('module', $module);
            if ($questions->isEmpty()) continue;

            $correct = $attempt->responses
                ->whereIn('question_id', $questions->pluck('id'))
                ->where('is_correct', true)
                ->count();

            $table = $module === 'reading' ? self::READING_BANDS : self::LISTENING_BANDS;
            $band  = $this->lookupBand($correct, $table);

            TestAttemptSection::updateOrCreate(
                ['test_attempt_id' => $attempt->id, 'module' => $module],
                ['raw_score' => $correct, 'band_score' => $band, 'marked_by' => 'system', 'marked_at' => now()]
            );

            $moduleScores[] = $band;
        }

        // Writing and Speaking default to null until self/instructor marked
        $allSections = $attempt->sections()->pluck('band_score')->filter()->values();

        if ($allSections->isNotEmpty()) {
            $overall = $this->roundToNearestHalf($allSections->average());
            $attempt->update(['overall_band' => $overall]);
        }
    }

    private function lookupBand(int $raw, array $table): float
    {
        if (isset($table[$raw])) return $table[$raw];
        // Interpolate downward for any score below the lowest defined
        $min = min(array_keys($table));
        return $raw >= $min ? ($table[$min] ?? 1.0) : 1.0;
    }

    private function roundToNearestHalf(float $value): float
    {
        return round($value * 2) / 2;
    }
}
