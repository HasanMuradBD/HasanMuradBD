<?php

namespace Database\Seeders;

use App\Models\MicroSkill;
use Illuminate\Database\Seeder;

class MicroSkillSeeder extends Seeder
{
    public function run(): void
    {
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

        $children = [
            // Reading
            ['module' => 'reading',   'name' => 'True/False/Not Given',          'slug' => 'reading_tfng',             'parent' => 'reading'],
            ['module' => 'reading',   'name' => 'Yes/No/Not Given',              'slug' => 'reading_ynng',             'parent' => 'reading'],
            ['module' => 'reading',   'name' => 'Matching Headings',             'slug' => 'reading_matching_headings','parent' => 'reading'],
            ['module' => 'reading',   'name' => 'Matching Information',          'slug' => 'reading_matching_info',    'parent' => 'reading'],
            ['module' => 'reading',   'name' => 'Matching Features',             'slug' => 'reading_matching_features','parent' => 'reading'],
            ['module' => 'reading',   'name' => 'Multiple Choice',               'slug' => 'reading_mcq',              'parent' => 'reading'],
            ['module' => 'reading',   'name' => 'Sentence Completion',           'slug' => 'reading_sentence_comp',    'parent' => 'reading'],
            ['module' => 'reading',   'name' => 'Summary Completion',            'slug' => 'reading_summary_comp',     'parent' => 'reading'],
            ['module' => 'reading',   'name' => 'Short Answer',                  'slug' => 'reading_short_answer',     'parent' => 'reading'],
            ['module' => 'reading',   'name' => 'Diagram Labelling',             'slug' => 'reading_diagram',          'parent' => 'reading'],
            ['module' => 'reading',   'name' => 'Skimming for Gist',             'slug' => 'reading_skimming',         'parent' => 'reading'],
            ['module' => 'reading',   'name' => 'Scanning for Detail',           'slug' => 'reading_scanning',         'parent' => 'reading'],
            // Listening
            ['module' => 'listening', 'name' => 'Section 1 Form Completion',     'slug' => 'listening_s1_form',        'parent' => 'listening'],
            ['module' => 'listening', 'name' => 'Section 2 MCQ',                 'slug' => 'listening_s2_mcq',         'parent' => 'listening'],
            ['module' => 'listening', 'name' => 'Section 3 Academic MCQ',        'slug' => 'listening_s3_mcq',         'parent' => 'listening'],
            ['module' => 'listening', 'name' => 'Section 4 Note Completion',     'slug' => 'listening_s4_note',        'parent' => 'listening'],
            ['module' => 'listening', 'name' => 'Map/Plan Labelling',            'slug' => 'listening_map',            'parent' => 'listening'],
            ['module' => 'listening', 'name' => 'Sentence Completion',           'slug' => 'listening_sentence_comp',  'parent' => 'listening'],
            // Writing
            ['module' => 'writing',   'name' => 'Task Achievement (T1)',         'slug' => 'writing_ta_t1',            'parent' => 'writing'],
            ['module' => 'writing',   'name' => 'Task Achievement (T2)',         'slug' => 'writing_ta_t2',            'parent' => 'writing'],
            ['module' => 'writing',   'name' => 'Coherence & Cohesion',          'slug' => 'writing_cc',               'parent' => 'writing'],
            ['module' => 'writing',   'name' => 'Lexical Resource',              'slug' => 'writing_lr',               'parent' => 'writing'],
            ['module' => 'writing',   'name' => 'Grammatical Range & Accuracy',  'slug' => 'writing_gra',              'parent' => 'writing'],
            // Speaking
            ['module' => 'speaking',  'name' => 'Fluency & Coherence',           'slug' => 'speaking_fc',              'parent' => 'speaking'],
            ['module' => 'speaking',  'name' => 'Lexical Resource',              'slug' => 'speaking_lr',              'parent' => 'speaking'],
            ['module' => 'speaking',  'name' => 'Grammatical Range & Accuracy',  'slug' => 'speaking_gra',             'parent' => 'speaking'],
            ['module' => 'speaking',  'name' => 'Pronunciation',                 'slug' => 'speaking_pronunciation',   'parent' => 'speaking'],
        ];

        foreach ($children as $child) {
            MicroSkill::firstOrCreate(
                ['slug' => $child['slug']],
                [
                    'module'          => $child['module'],
                    'name'            => $child['name'],
                    'slug'            => $child['slug'],
                    'parent_skill_id' => $parents[$child['parent']]->id,
                ]
            );
        }
    }
}
