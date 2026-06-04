<?php

namespace Database\Seeders;

use App\Models\MicroSkill;
use Illuminate\Database\Seeder;

class MicroSkillSeeder extends Seeder
{
    // Root cause slugs — these are the 6 underlying causes from research
    public const ROOT_CAUSES = [
        'cause_vocabulary'   => ['name' => 'Limited Vocabulary Range',                       'module' => 'reading'],
        'cause_grammar'      => ['name' => 'Weak Grammar Foundation',                        'module' => 'writing'],
        'cause_exposure'     => ['name' => 'Lack of Exposure to Authentic English',          'module' => 'listening'],
        'cause_timed'        => ['name' => 'Insufficient Practice Under Timed Conditions',   'module' => 'reading'],
        'cause_memorised'    => ['name' => 'Over-reliance on Memorised Answers',             'module' => 'speaking'],
        'cause_question_type'=> ['name' => 'Poor Understanding of Question Types & Criteria','module' => 'reading'],
    ];

    public function run(): void
    {
        // Module parent nodes
        $parentDefs = [
            ['module' => 'reading',   'name' => 'Reading',   'slug' => 'reading'],
            ['module' => 'listening', 'name' => 'Listening', 'slug' => 'listening'],
            ['module' => 'writing',   'name' => 'Writing',   'slug' => 'writing'],
            ['module' => 'speaking',  'name' => 'Speaking',  'slug' => 'speaking'],
        ];

        $parents = [];
        foreach ($parentDefs as $def) {
            $parents[$def['slug']] = MicroSkill::firstOrCreate(['slug' => $def['slug']], $def);
        }

        // Root-cause parent nodes (cross-module meta-skills)
        $causeDefs = [
            ['module' => 'reading',   'name' => 'Limited Vocabulary Range',                        'slug' => 'cause_vocabulary'],
            ['module' => 'writing',   'name' => 'Weak Grammar Foundation',                         'slug' => 'cause_grammar'],
            ['module' => 'listening', 'name' => 'Lack of Exposure to Authentic English',           'slug' => 'cause_exposure'],
            ['module' => 'reading',   'name' => 'Insufficient Practice Under Timed Conditions',    'slug' => 'cause_timed'],
            ['module' => 'speaking',  'name' => 'Over-reliance on Memorised Answers',              'slug' => 'cause_memorised'],
            ['module' => 'reading',   'name' => 'Poor Understanding of Question Types & Criteria', 'slug' => 'cause_question_type'],
        ];

        $causes = [];
        foreach ($causeDefs as $def) {
            $causes[$def['slug']] = MicroSkill::firstOrCreate(['slug' => $def['slug']], $def);
        }

        $children = [
            // ── LISTENING specific challenges ──────────────────────────────
            ['module' => 'listening', 'name' => 'Fast Speech Comprehension',      'slug' => 'l_fast_speech',       'parent' => 'listening', 'cause' => 'cause_exposure'],
            ['module' => 'listening', 'name' => 'Accent Variation (British/AUS)',  'slug' => 'l_accent',            'parent' => 'listening', 'cause' => 'cause_exposure'],
            ['module' => 'listening', 'name' => 'Sustained Concentration',         'slug' => 'l_concentration',     'parent' => 'listening', 'cause' => 'cause_timed'],
            ['module' => 'listening', 'name' => 'Spelling & Number Recognition',   'slug' => 'l_spelling',          'parent' => 'listening', 'cause' => 'cause_vocabulary'],
            ['module' => 'listening', 'name' => 'Simultaneous Listen & Write',     'slug' => 'l_multitask',         'parent' => 'listening', 'cause' => 'cause_timed'],
            // original listening skills
            ['module' => 'listening', 'name' => 'Section 1 Form Completion',       'slug' => 'listening_s1_form',   'parent' => 'listening', 'cause' => null],
            ['module' => 'listening', 'name' => 'Section 2 MCQ',                   'slug' => 'listening_s2_mcq',    'parent' => 'listening', 'cause' => null],
            ['module' => 'listening', 'name' => 'Section 3 Academic MCQ',          'slug' => 'listening_s3_mcq',    'parent' => 'listening', 'cause' => 'cause_question_type'],
            ['module' => 'listening', 'name' => 'Section 4 Note Completion',       'slug' => 'listening_s4_note',   'parent' => 'listening', 'cause' => null],
            ['module' => 'listening', 'name' => 'Map/Plan Labelling',              'slug' => 'listening_map',       'parent' => 'listening', 'cause' => 'cause_question_type'],
            ['module' => 'listening', 'name' => 'Sentence Completion',             'slug' => 'listening_sentence_comp', 'parent' => 'listening', 'cause' => null],

            // ── READING specific challenges ────────────────────────────────
            ['module' => 'reading',   'name' => 'Time Management Under Exam Conditions', 'slug' => 'r_time_management',   'parent' => 'reading', 'cause' => 'cause_timed'],
            ['module' => 'reading',   'name' => 'Locating Specific Information Quickly',  'slug' => 'r_locate_info',       'parent' => 'reading', 'cause' => 'cause_timed'],
            ['module' => 'reading',   'name' => 'Unfamiliar Vocabulary & Paraphrasing',   'slug' => 'r_vocab_paraphrase',  'parent' => 'reading', 'cause' => 'cause_vocabulary'],
            ['module' => 'reading',   'name' => 'T/F/NG vs Y/N/NG Distinction',           'slug' => 'r_tfng_ynng',         'parent' => 'reading', 'cause' => 'cause_question_type'],
            ['module' => 'reading',   'name' => 'Resisting Answer Overthinking',           'slug' => 'r_overthinking',      'parent' => 'reading', 'cause' => 'cause_memorised'],
            // original reading skills
            ['module' => 'reading',   'name' => 'True/False/Not Given',            'slug' => 'reading_tfng',              'parent' => 'reading', 'cause' => 'cause_question_type'],
            ['module' => 'reading',   'name' => 'Yes/No/Not Given',                'slug' => 'reading_ynng',              'parent' => 'reading', 'cause' => 'cause_question_type'],
            ['module' => 'reading',   'name' => 'Matching Headings',               'slug' => 'reading_matching_headings', 'parent' => 'reading', 'cause' => 'cause_question_type'],
            ['module' => 'reading',   'name' => 'Matching Information',            'slug' => 'reading_matching_info',     'parent' => 'reading', 'cause' => 'cause_question_type'],
            ['module' => 'reading',   'name' => 'Matching Features',               'slug' => 'reading_matching_features', 'parent' => 'reading', 'cause' => 'cause_question_type'],
            ['module' => 'reading',   'name' => 'Multiple Choice',                 'slug' => 'reading_mcq',               'parent' => 'reading', 'cause' => 'cause_question_type'],
            ['module' => 'reading',   'name' => 'Sentence Completion',             'slug' => 'reading_sentence_comp',     'parent' => 'reading', 'cause' => null],
            ['module' => 'reading',   'name' => 'Summary Completion',              'slug' => 'reading_summary_comp',      'parent' => 'reading', 'cause' => null],
            ['module' => 'reading',   'name' => 'Short Answer',                    'slug' => 'reading_short_answer',      'parent' => 'reading', 'cause' => null],
            ['module' => 'reading',   'name' => 'Diagram Labelling',               'slug' => 'reading_diagram',           'parent' => 'reading', 'cause' => 'cause_question_type'],
            ['module' => 'reading',   'name' => 'Skimming for Gist',               'slug' => 'reading_skimming',          'parent' => 'reading', 'cause' => 'cause_timed'],
            ['module' => 'reading',   'name' => 'Scanning for Detail',             'slug' => 'reading_scanning',          'parent' => 'reading', 'cause' => 'cause_timed'],

            // ── WRITING specific challenges ────────────────────────────────
            ['module' => 'writing',   'name' => 'Idea Generation Speed',           'slug' => 'w_idea_generation',   'parent' => 'writing', 'cause' => 'cause_timed'],
            ['module' => 'writing',   'name' => 'Logical Essay Organisation',       'slug' => 'w_organisation',      'parent' => 'writing', 'cause' => 'cause_question_type'],
            ['module' => 'writing',   'name' => 'Vocabulary Range & Precision',     'slug' => 'w_vocabulary',        'parent' => 'writing', 'cause' => 'cause_vocabulary'],
            ['module' => 'writing',   'name' => 'Grammar Accuracy',                 'slug' => 'w_grammar_accuracy',  'parent' => 'writing', 'cause' => 'cause_grammar'],
            ['module' => 'writing',   'name' => 'Task Address & Topic Relevance',   'slug' => 'w_task_address',      'parent' => 'writing', 'cause' => 'cause_question_type'],
            ['module' => 'writing',   'name' => 'Coherence & Cohesion',             'slug' => 'w_coherence',         'parent' => 'writing', 'cause' => 'cause_grammar'],
            // original writing skills
            ['module' => 'writing',   'name' => 'Task Achievement (T1)',            'slug' => 'writing_ta_t1',       'parent' => 'writing', 'cause' => 'cause_question_type'],
            ['module' => 'writing',   'name' => 'Task Achievement (T2)',            'slug' => 'writing_ta_t2',       'parent' => 'writing', 'cause' => 'cause_question_type'],
            ['module' => 'writing',   'name' => 'Coherence & Cohesion (Band)',      'slug' => 'writing_cc',          'parent' => 'writing', 'cause' => 'cause_grammar'],
            ['module' => 'writing',   'name' => 'Lexical Resource',                 'slug' => 'writing_lr',          'parent' => 'writing', 'cause' => 'cause_vocabulary'],
            ['module' => 'writing',   'name' => 'Grammatical Range & Accuracy',     'slug' => 'writing_gra',         'parent' => 'writing', 'cause' => 'cause_grammar'],

            // ── SPEAKING specific challenges ───────────────────────────────
            ['module' => 'speaking',  'name' => 'Confidence Under Exam Pressure',   'slug' => 's_confidence',        'parent' => 'speaking', 'cause' => 'cause_timed'],
            ['module' => 'speaking',  'name' => 'Answer Development & Detail',      'slug' => 's_development',       'parent' => 'speaking', 'cause' => 'cause_memorised'],
            ['module' => 'speaking',  'name' => 'Rapid Lexical Retrieval',          'slug' => 's_lexical_retrieval', 'parent' => 'speaking', 'cause' => 'cause_vocabulary'],
            ['module' => 'speaking',  'name' => 'Vocabulary Sophistication',        'slug' => 's_vocab_range',       'parent' => 'speaking', 'cause' => 'cause_vocabulary'],
            ['module' => 'speaking',  'name' => 'Pronunciation Clarity',            'slug' => 's_pronunciation',     'parent' => 'speaking', 'cause' => 'cause_exposure'],
            ['module' => 'speaking',  'name' => 'Hesitation & Fluency Control',     'slug' => 's_hesitation',        'parent' => 'speaking', 'cause' => 'cause_memorised'],
            // original speaking skills
            ['module' => 'speaking',  'name' => 'Fluency & Coherence',              'slug' => 'speaking_fc',         'parent' => 'speaking', 'cause' => 'cause_exposure'],
            ['module' => 'speaking',  'name' => 'Lexical Resource',                 'slug' => 'speaking_lr',         'parent' => 'speaking', 'cause' => 'cause_vocabulary'],
            ['module' => 'speaking',  'name' => 'Grammatical Range & Accuracy',     'slug' => 'speaking_gra',        'parent' => 'speaking', 'cause' => 'cause_grammar'],
            ['module' => 'speaking',  'name' => 'Pronunciation',                    'slug' => 'speaking_pronunciation', 'parent' => 'speaking', 'cause' => 'cause_exposure'],
        ];

        foreach ($children as $child) {
            $parentSkill = $parents[$child['parent']];
            MicroSkill::firstOrCreate(
                ['slug' => $child['slug']],
                [
                    'module'          => $child['module'],
                    'name'            => $child['name'],
                    'slug'            => $child['slug'],
                    'parent_skill_id' => $parentSkill->id,
                ]
            );
        }
    }
}
