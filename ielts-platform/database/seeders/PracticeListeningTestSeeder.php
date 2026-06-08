<?php
namespace Database\Seeders;

use App\Models\Question;
use App\Models\Test;
use Illuminate\Database\Seeder;

/**
 * Practice Listening Test 1 — exercises every question renderer in
 * ListeningSection.jsx: form/note completion (inline blanks), multiple
 * choice (option cards) and matching (dropdown selects), across Sections 1–4.
 *
 * Audio: set $test->audio_file_path to a public URL. A SoundHelix sample is
 * used so the play-once player works out of the box; replace via the admin
 * panel with your own recording stored at /storage/audio/.
 */
class PracticeListeningTestSeeder extends Seeder
{
    public function run(): void
    {
        $test = Test::firstOrCreate(
            ['title' => 'Practice Listening Test 1 — Campus & Travel'],
            [
                'type'                => 'module_practice',
                'module'              => 'listening',
                'academic_or_general' => 'academic',
                'duration_minutes'    => 40,
                'total_questions'     => 10,
                'is_active'           => true,
                'audio_file_path'     => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            ]
        );

        // Backfill audio path if the row pre-existed without one.
        if (!$test->audio_file_path) {
            $test->update(['audio_file_path' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3']);
        }

        if ($test->questions()->exists()) return; // already seeded

        $questions = [
            // ── SECTION 1 — Form / Note completion (inline blanks) ──────────
            [
                'section_number' => 1, 'sequence' => 1,
                'question_type'  => 'form_completion',
                'question_text'  => 'Name of applicant: Sarah [____]',
                'correct_answer' => 'Thompson',
                'answer_explanation' => 'The applicant spells out her surname T-H-O-M-P-S-O-N.',
                'difficulty'     => 'easy',
            ],
            [
                'section_number' => 1, 'sequence' => 2,
                'question_type'  => 'form_completion',
                'question_text'  => 'Membership type: [____] (individual / family / student)',
                'correct_answer' => 'student',
                'answer_explanation' => 'She asks for the student rate as she is enrolled at the university.',
                'difficulty'     => 'easy',
            ],
            [
                'section_number' => 1, 'sequence' => 3,
                'question_type'  => 'note_completion',
                'question_text'  => 'Monthly fee: £[____]',
                'correct_answer' => '25/twenty-five',
                'answer_explanation' => 'The student rate is quoted as twenty-five pounds per month.',
                'difficulty'     => 'medium',
            ],

            // ── SECTION 2 — Multiple choice (option cards) ──────────────────
            [
                'section_number' => 2, 'sequence' => 4,
                'question_type'  => 'multiple_choice',
                'question_text'  => 'The orientation tour will begin at the —',
                'options'        => ['main library entrance', 'student union building', 'sports centre car park'],
                'correct_answer' => 'B',
                'answer_explanation' => 'The guide says to meet outside the student union building.',
                'difficulty'     => 'medium',
            ],
            [
                'section_number' => 2, 'sequence' => 5,
                'question_type'  => 'multiple_choice',
                'question_text'  => 'How long does the full campus tour last?',
                'options'        => ['about 45 minutes', 'about 1 hour', 'about 90 minutes'],
                'correct_answer' => 'C',
                'answer_explanation' => 'The tour is described as lasting roughly an hour and a half.',
                'difficulty'     => 'medium',
            ],
            [
                'section_number' => 2, 'sequence' => 6,
                'question_type'  => 'multiple_choice',
                'question_text'  => 'Students should bring —',
                'options'        => ['photo identification', 'a printed timetable', 'a laptop computer'],
                'correct_answer' => 'A',
                'answer_explanation' => 'Photo ID is required to collect the campus card.',
                'difficulty'     => 'easy',
            ],

            // ── SECTION 3 — Matching (dropdown selects) ─────────────────────
            [
                'section_number' => 3, 'sequence' => 7,
                'question_type'  => 'matching_information',
                'question_text'  => 'Tutorial — Research methods',
                'options'        => ['Dr Evans', 'Dr Patel', 'Professor Lin', 'Ms Okafor'],
                'correct_answer' => 'Dr Patel',
                'answer_explanation' => 'Dr Patel is named as the tutor leading the research-methods session.',
                'difficulty'     => 'medium',
            ],
            [
                'section_number' => 3, 'sequence' => 8,
                'question_type'  => 'matching_information',
                'question_text'  => 'Workshop — Academic writing',
                'options'        => ['Dr Evans', 'Dr Patel', 'Professor Lin', 'Ms Okafor'],
                'correct_answer' => 'Ms Okafor',
                'answer_explanation' => 'Ms Okafor runs the academic-writing workshop.',
                'difficulty'     => 'medium',
            ],
            [
                'section_number' => 3, 'sequence' => 9,
                'question_type'  => 'matching_features',
                'question_text'  => 'Lecture — Statistics',
                'options'        => ['Dr Evans', 'Dr Patel', 'Professor Lin', 'Ms Okafor'],
                'correct_answer' => 'Professor Lin',
                'answer_explanation' => 'Professor Lin delivers the statistics lecture.',
                'difficulty'     => 'hard',
            ],

            // ── SECTION 4 — Sentence completion (inline blank) ──────────────
            [
                'section_number' => 4, 'sequence' => 10,
                'question_type'  => 'sentence_completion',
                'question_text'  => 'The lecturer argues that the most important factor in language retention is regular [____].',
                'correct_answer' => 'practice',
                'answer_explanation' => 'The lecture concludes that consistent practice matters more than innate talent.',
                'difficulty'     => 'medium',
            ],
        ];

        foreach ($questions as $qData) {
            $test->questions()->create(array_merge($qData, ['module' => 'listening']));
        }
    }
}
