<?php

namespace Database\Seeders;

use App\Models\MicroSkill;
use App\Models\Question;
use App\Models\SpeakingPrompt;
use App\Models\Test;
use App\Models\WritingPrompt;
use Illuminate\Database\Seeder;

class DiagnosticTestSeeder extends Seeder
{
    private const PASSAGE = <<<TEXT
High in the Peruvian Andes, carved into near-vertical mountainsides at altitudes exceeding 3,500 metres, lie some of the most sophisticated agricultural structures ever built without mechanised tools. The terraced fields — known in Quechua as andenes — stretch across hundreds of kilometres of Andean terrain, transforming slopes that would otherwise be impossible to cultivate into productive farmland capable of sustaining millions of people. For decades, archaeologists regarded these structures primarily as a response to land scarcity: a civilisation running out of flat ground and improvising upward. More recent research has overturned this interpretation entirely. The andenes were not a workaround. They were a precision-engineered environmental system, and the sophistication of their design continues to astonish contemporary hydrologists and agricultural scientists.

The construction of a single terrace platform followed a layered methodology that modern soil scientists recognise as optimal. Workers first excavated the hillside and installed a retaining wall built from tightly fitted stone, a technique requiring no mortar yet capable of withstanding centuries of seismic activity — a critical requirement in one of the world's most geologically active regions. Behind the wall, successive layers of material were deposited in a specific sequence: coarse gravel at the base for drainage, then a layer of small stones, then topsoil imported from lower elevations, and finally a surface layer of black organic earth enriched with composted vegetation and occasionally with ground seabird guano transported from the Pacific coast. The result was an engineered growing medium far richer than the thin, acidic soils naturally occurring at those altitudes.

The drainage architecture embedded within the terraces solved two simultaneous problems. In the wet season, when rainfall in the high Andes can be both sudden and torrential, the layered substrate directed excess water downward through each terrace and into channels that fed the next level below, preventing the soil saturation and slope collapse that regularly destroys modern hillside agriculture in the same region. In the dry season, the same system operated in reverse: the deep gravel layer retained residual moisture and released it slowly upward through capillary action, extending the growing season by weeks beyond what unmodified mountainside soils would permit. This passive moisture regulation required no human intervention once constructed — it was hydrological engineering embedded permanently into the landscape.

Perhaps the most surprising discovery came from microclimatic measurements conducted at the site of Moray, an unusual complex of concentric circular terraces located in the Sacred Valley near Cusco. Unlike the linear terraces found across most Andean slopes, the circular depressions at Moray descend in rings to a central floor approximately 30 metres below the outermost rim. When researchers from the Pontificia Universidad Católica del Perú installed temperature sensors across the site in the 1990s, they recorded a temperature differential of up to 15 degrees Celsius between the coldest point on the outer rim and the warmest point at the centre — a range equivalent to the climatic difference between distinct altitudinal zones separated by hundreds of metres of elevation. No comparable natural topographical feature produces this effect. The deliberate design of the bowl shape, combined with the orientation of the site relative to prevailing winds and solar angle, creates a series of distinct microclimates within a radius of less than 200 metres.

The leading interpretation among researchers is that Moray functioned as an agricultural research station — the world's oldest known experimental farm. By planting identical crops at different terrace levels, Andean agronomists could observe how varieties responded to different temperature, humidity, and light conditions in a single location and growing season. The Inca Empire's capacity to cultivate over 3,000 varieties of potato and hundreds of varieties of maize is not attributable solely to the diversity of natural Andean environments. It reflects a deliberate programme of crop selection and adaptation, and Moray is the most credible physical evidence of the institutional infrastructure that supported it.

The abandonment of the andenes following the Spanish conquest of the 1530s had consequences that played out across centuries. Colonial administrators, unfamiliar with the maintenance requirements of the terrace system and focused on extracting existing resources rather than sustaining productive infrastructure, allowed the retaining walls to fall into disrepair. Without annual maintenance, walls collapsed, drainage channels silted up, and the carefully constructed soil layers eroded within decades. Lands that had fed a population of roughly twelve million people reverted to scrub. Subsequent centuries of poverty in highland Peru are, in part, a story of this infrastructural collapse. Since the 1980s, restoration programmes — initially led by NGOs and later incorporated into Peruvian government agricultural policy — have rebuilt thousands of hectares of andenes. Restored terraces consistently outperform adjacent unmodified slopes by significant margins: studies in the Colca Valley report yield increases of between 40 and 80 percent for staple crops.

What separates the andenes from other examples of ancient agricultural ingenuity is not merely their scale but their durability of principle. Modern precision agriculture, with its sensor networks, satellite imaging, and computer-modelled soil management, is converging on solutions that Andean engineers encoded in stone and gravel more than six centuries ago. The terrace builders did not leave written records of their methods. What they left was more reliable: a working system, still functional in restored form today, whose performance speaks with more authority than any technical manual.
TEXT;

    public function run(): void
    {
        // ── Diagnostic Test ──────────────────────────────────────────────────────
        $test = Test::firstOrCreate(
            ['type' => 'diagnostic'],
            [
                'title'               => 'IELTS Master Diagnostic — All Modules',
                'type'                => 'diagnostic',
                'module'              => 'full',
                'academic_or_general' => 'academic',
                'duration_minutes'    => 90,
                'total_questions'     => 33,
                'is_active'           => true,
            ]
        );

        $this->seedReadingQuestions($test);
        $this->seedListeningQuestions($test);
        $this->seedWritingPrompts($test);
        $this->seedSpeakingPrompts($test);

        // ── Module-practice placeholder test (needed by PlanGeneratorService) ───
        Test::firstOrCreate(
            ['type' => 'module_practice', 'title' => 'Reading Practice Drill'],
            [
                'type'             => 'module_practice',
                'module'           => 'reading',
                'duration_minutes' => 20,
                'total_questions'  => 13,
                'is_active'        => true,
            ]
        );

        // ── Full mock placeholder ────────────────────────────────────────────────
        Test::firstOrCreate(
            ['type' => 'full_mock', 'title' => 'Full Mock Exam — Set 1'],
            [
                'type'             => 'full_mock',
                'module'           => 'full',
                'duration_minutes' => 165,
                'total_questions'  => 80,
                'is_active'        => true,
            ]
        );
    }

    private function seedReadingQuestions(Test $test): void
    {
        $tfng     = MicroSkill::where('slug', 'reading_tfng')->first();
        $headings = MicroSkill::where('slug', 'reading_matching_headings')->first();
        $skimming = MicroSkill::where('slug', 'reading_skimming')->first();

        // Matching Headings Q1–Q6
        $headingData = [
            [1, 'ii',   'medium', 'A layered construction process designed to enrich barren highland soil'],
            [2, 'v',    'medium', 'A passive water management system that functioned across two seasons'],
            [3, 'vi',   'hard',   'How a single site revealed an unexpected capacity to manufacture climate'],
            [4, 'iii',  'medium', 'Evidence that ancient farmers conducted systematic crop experimentation'],
            [5, 'i',    'hard',   'The long-term consequences of neglect and the modern effort to restore'],
            [6, 'vii',  'medium', 'The superiority of physical evidence over written documentation'],
        ];

        $headingOptions = "i. The long-term consequences of neglect and the modern effort to restore\nii. A layered construction process designed to enrich barren highland soil\niii. Evidence that ancient farmers conducted systematic crop experimentation\niv. Why the andenes were originally built on such difficult terrain\nv. A passive water management system that functioned across two seasons\nvi. How a single site revealed an unexpected capacity to manufacture climate\nvii. The superiority of physical evidence over written documentation\nviii. The commercial trade networks that supplied terrace construction materials\nix. Statistical proof that restored terraces remain agriculturally viable\nx. A reassessment of what the andenes were actually designed to achieve";

        foreach ($headingData as [$seq, $answer, $difficulty, $qtext]) {
            $q = Question::firstOrCreate(
                ['test_id' => $test->id, 'sequence' => $seq],
                [
                    'test_id'          => $test->id,
                    'module'           => 'reading',
                    'section_number'   => 1,
                    'sequence'         => $seq,
                    'question_type'    => 'matching_headings',
                    'question_text'    => "Choose the correct heading for Paragraph " . chr(64 + $seq) . " from the list of headings below.\n\n{$headingOptions}\n\nParagraph text: {$qtext}",
                    'passage_reference'=> self::PASSAGE,
                    'correct_answer'   => $answer,
                    'answer_explanation' => "The correct heading is {$answer}.",
                    'difficulty'       => $difficulty,
                ]
            );
            $q->microSkills()->syncWithoutDetaching(array_filter([
                $headings?->id,
                $skimming?->id,
            ]));
        }

        // True/False/Not Given Q7–Q13
        $tfngData = [
            [7,  'TRUE',      'medium', 'Modern researchers initially shared the view that the andenes were built because flat agricultural land had become unavailable.',
             'Paragraph A states archaeologists initially regarded these structures as a response to land scarcity.'],
            [8,  'FALSE',     'hard',   'The stone retaining walls of the andenes were constructed using a mortar compound specifically formulated to resist earthquake damage.',
             'Paragraph B states the walls required "no mortar".'],
            [9,  'TRUE',      'medium', 'The drainage layers within each terrace were capable of retaining moisture during periods of low rainfall without requiring human management.',
             'Paragraph C states this passive moisture regulation "required no human intervention once constructed".'],
            [10, 'FALSE',     'hard',   'The temperature difference recorded between the outer rim and central floor of Moray is also found in naturally occurring bowl-shaped landforms of comparable dimensions.',
             'Paragraph D states "No comparable natural topographical feature produces this effect."'],
            [11, 'TRUE',      'hard',   'Researchers believe the variety of crops cultivated by the Inca Empire resulted partly from a formal, institutionally supported programme of agricultural development.',
             'Paragraph E refers to "a deliberate programme" supported by "institutional infrastructure".'],
            [12, 'NOT GIVEN', 'hard',   'The Spanish colonial administration attempted to adapt the andenes system to suit European farming methods but found it technically incompatible.',
             'The passage describes neglect, not an adaptation attempt. No information is given.'],
            [13, 'TRUE',      'easy',   'Crop yields on restored andenes in the Colca Valley have been shown to exceed those on unmodified hillside land in the same area.',
             'Paragraph F states studies report yield increases of 40–80 percent on restored terraces.'],
        ];

        foreach ($tfngData as [$seq, $answer, $difficulty, $qtext, $explanation]) {
            $q = Question::firstOrCreate(
                ['test_id' => $test->id, 'sequence' => $seq],
                [
                    'test_id'          => $test->id,
                    'module'           => 'reading',
                    'section_number'   => 1,
                    'sequence'         => $seq,
                    'question_type'    => 'true_false_not_given',
                    'question_text'    => $qtext,
                    'passage_reference'=> self::PASSAGE,
                    'correct_answer'   => $answer,
                    'answer_explanation' => $explanation,
                    'difficulty'       => $difficulty,
                ]
            );
            $q->microSkills()->syncWithoutDetaching(array_filter([$tfng?->id]));
        }
    }

    private function seedListeningQuestions(Test $test): void
    {
        $s1 = MicroSkill::where('slug', 'listening_s1_form')->first();
        $s3 = MicroSkill::where('slug', 'listening_s3_mcq')->first();
        $s4 = MicroSkill::where('slug', 'listening_s4_note')->first();

        $listeningQuestions = [
            // Section 1 — form completion (Q14–Q23)
            [14, 1, 'form_completion', 'What is the caller\'s surname?',              'Harrison',          'easy',   $s1?->id,
             'The caller spells out H-A-R-R-I-S-O-N clearly in the audio.'],
            [15, 1, 'form_completion', 'What is the caller\'s email address domain?', 'gmail.com',         'easy',   $s1?->id,
             'The caller states "at gmail dot com".'],
            [16, 1, 'form_completion', 'Which course is the caller enquiring about?', 'Academic Writing',  'medium', $s1?->id,
             'The caller specifically asks about the Academic Writing course.'],
            [17, 1, 'form_completion', 'What day does the caller prefer?',            'Tuesday',           'easy',   $s1?->id,
             'The caller says "I\'d prefer Tuesdays if possible".'],
            [18, 1, 'form_completion', 'What time slot does the caller request?',     'morning',           'easy',   $s1?->id,
             'The caller asks for a morning session.'],
            [19, 1, 'form_completion', 'What is the registration fee mentioned?',     '$75',               'medium', $s1?->id,
             'The receptionist states the registration fee is $75.'],
            [20, 1, 'form_completion', 'What document must the caller bring?',        'passport',          'medium', $s1?->id,
             'The receptionist says "please bring your passport for ID verification".'],
            [21, 1, 'form_completion', 'What is the name of the building?',           'Meridian Centre',   'medium', $s1?->id,
             'The receptionist gives the address as Meridian Centre.'],
            [22, 1, 'form_completion', 'How many weeks does the course run?',         '8',                 'easy',   $s1?->id,
             'The course is described as an 8-week programme.'],
            [23, 1, 'form_completion', 'What payment method is NOT accepted?',        'cash',              'hard',   $s1?->id,
             'The receptionist says "we don\'t accept cash — card or bank transfer only".'],
            // Section 3 — academic discussion MCQ (Q24–Q28)
            [24, 3, 'multiple_choice', 'Why did the students choose urban farming as their research topic?',
             'B',  'medium', $s3?->id,
             'The student mentions it was suggested by their supervisor as an emerging field.'],
            [25, 3, 'multiple_choice', 'What does the professor say is the main challenge of vertical farming?',
             'C',  'hard',   $s3?->id,
             'The professor emphasises energy consumption as the critical barrier to profitability.'],
            [26, 3, 'multiple_choice', 'What do the students agree their report needs more of?',
             'A',  'medium', $s3?->id,
             'Both students agree they need more primary data from local growers.'],
            [27, 3, 'multiple_choice', 'What is the professor\'s view on the students\' methodology?',
             'B',  'hard',   $s3?->id,
             'The professor says the literature review is strong but the survey design needs work.'],
            [28, 3, 'multiple_choice', 'What will the students do next?',
             'A',  'medium', $s3?->id,
             'They agree to visit a local vertical farm before revising the survey.'],
            // Section 4 — academic lecture note completion (Q29–Q33)
            [29, 4, 'note_completion', 'The lecture states that bioluminescence serves primarily as a ________ mechanism in deep-sea organisms.',
             'defence',         'medium', $s4?->id,
             'The lecturer states "primarily a defence mechanism against predation".'],
            [30, 4, 'note_completion', 'Approximately ________ percent of deep-sea species are capable of producing light.',
             '76',              'hard',   $s4?->id,
             'The lecturer cites research showing 76% of deep-sea species exhibit bioluminescence.'],
            [31, 4, 'note_completion', 'The chemical reaction responsible for bioluminescence involves an enzyme called ________.',
             'luciferase',      'hard',   $s4?->id,
             'The lecturer names the enzyme luciferase, spelling it out.'],
            [32, 4, 'note_completion', 'Blue-green light is favoured by deep-sea organisms because it travels furthest through ________ water.',
             'cold',            'medium', $s4?->id,
             'The lecturer explains blue-green light propagates furthest through cold, deep water.'],
            [33, 4, 'note_completion', 'Medical researchers are studying bioluminescence for applications in ________ imaging.',
             'cancer',          'medium', $s4?->id,
             'The lecturer mentions cancer imaging as the primary medical application under research.'],
        ];

        foreach ($listeningQuestions as [$seq, $section, $type, $qtext, $answer, $difficulty, $skillId, $explanation]) {
            $q = Question::firstOrCreate(
                ['test_id' => $test->id, 'sequence' => $seq],
                [
                    'test_id'          => $test->id,
                    'module'           => 'listening',
                    'section_number'   => $section,
                    'sequence'         => $seq,
                    'question_type'    => $type,
                    'question_text'    => $qtext,
                    'passage_reference'=> null,
                    'correct_answer'   => $answer,
                    'answer_explanation' => $explanation,
                    'difficulty'       => $difficulty,
                ]
            );
            if ($skillId) {
                $q->microSkills()->syncWithoutDetaching([$skillId]);
            }
        }
    }

    private function seedWritingPrompts(Test $test): void
    {
        WritingPrompt::firstOrCreate(
            ['test_id' => $test->id, 'task_number' => 'task_1'],
            [
                'prompt_text'         => 'The bar chart below shows the percentage of people in four age groups who used the internet daily in a particular country in 2005 and 2015. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
                'data_description'    => 'Bar chart: Daily internet use by age group (18–30, 31–45, 46–60, 61+) comparing 2005 and 2015. Notable trend: 18–30 group increased from 52% to 89%; 61+ group increased from 4% to 28%.',
                'time_allowed_minutes'=> 20,
                'word_target_min'     => 150,
                'band_7_model_answer' => 'The bar chart illustrates the proportion of individuals across four age brackets who accessed the internet on a daily basis in 2005 and 2015. Overall, all age groups recorded significant increases over the decade, with younger cohorts consistently showing higher usage rates. The 18 to 30 age group demonstrated the most dramatic growth, rising from 52% to 89% — an increase of 37 percentage points. This group maintained the highest rate throughout. By contrast, those aged 61 and over had the lowest figures in both years, though their usage nearly septupled from just 4% to 28%. The 31 to 45 cohort increased from 41% to 74%, while the 46 to 60 group grew from 22% to 51%, surpassing the 50% mark for the first time. In conclusion, while internet adoption grew across all demographics, the largest relative gains were seen among older age groups, suggesting a narrowing of the digital divide between 2005 and 2015.',
            ]
        );

        WritingPrompt::firstOrCreate(
            ['test_id' => $test->id, 'task_number' => 'task_2'],
            [
                'prompt_text'         => 'Some people believe that universities should focus on providing academic knowledge and theoretical understanding. Others feel that universities should prepare students for the world of work by emphasising practical skills. Discuss both these views and give your own opinion.',
                'time_allowed_minutes'=> 40,
                'word_target_min'     => 250,
                'band_7_model_answer' => 'The debate over whether higher education should prioritise theoretical knowledge or practical skills is one that has intensified as graduate employment rates have come under scrutiny. Both positions have considerable merit, and a balanced approach is arguably the most defensible. Advocates of the academic model argue that universities are uniquely positioned to foster critical thinking, analytical reasoning, and intellectual curiosity — qualities that no vocational training can replicate. A philosophy or history graduate, for instance, develops the capacity to evaluate complex arguments, a skill that proves valuable across numerous professional contexts. Moreover, foundational theoretical knowledge in fields such as medicine or engineering underpins the safe application of any practical technique. On the other hand, employers frequently report that graduates lack the practical competencies required from day one of employment. Communication, project management, data analysis, and professional conduct are skills that classroom study rarely develops adequately. Universities that incorporate internships, live projects, and industry partnerships demonstrably improve graduate employability outcomes. In my view, these two objectives are not mutually exclusive. The most effective universities integrate theoretical rigour with structured practical experience — delivering graduates who can both think independently and perform competently. Treating them as competing priorities is a false dichotomy that serves neither students nor the societies that fund higher education.',
            ]
        );
    }

    private function seedSpeakingPrompts(Test $test): void
    {
        SpeakingPrompt::firstOrCreate(
            ['test_id' => $test->id, 'part_number' => 'part_1'],
            [
                'topic'               => 'Daily Routines & Technology',
                'prompt_text'         => 'The examiner will ask you general questions about yourself and familiar topics.',
                'follow_up_questions' => [
                    'What time do you usually wake up in the morning?',
                    'Do you prefer to study in the morning or at night? Why?',
                    'How often do you use your phone during the day?',
                    'Do you think people rely too much on technology today?',
                    'What do you usually do to relax after a busy day?',
                ],
                'time_allowed_seconds'=> 300,
            ]
        );

        SpeakingPrompt::firstOrCreate(
            ['test_id' => $test->id, 'part_number' => 'part_2'],
            [
                'topic'               => 'A skill you would like to learn',
                'prompt_text'         => 'Describe a skill you would like to learn in the future.',
                'cue_card_notes'      => "You should say:\n• what the skill is\n• why you want to learn it\n• how you would go about learning it\nand explain how this skill would benefit your life.",
                'time_allowed_seconds'=> 120,
                'band_7_model_transcript' => "One skill I've always wanted to develop is the ability to play the piano. I became interested in it when I was around twelve years old and heard a live performance at a community concert — I was genuinely moved by how one instrument could convey such a range of emotion. As for why I want to learn it now, I think it would provide a meaningful creative outlet. My daily routine is quite structured and mentally demanding, so having something purely expressive to return to would be genuinely valuable. In terms of how I'd learn, I'd probably begin with a combination of online tutorials — there are some excellent platforms with structured beginner programmes — and then find a local teacher once I had the basics down. I believe having a human instructor is important for correcting technique early, before bad habits become entrenched. As for the benefits, beyond the obvious cognitive advantages — research does suggest that learning an instrument improves memory and concentration — I think the discipline of practising a difficult skill from scratch would remind me that progress is incremental. That's a lesson that tends to get forgotten in professional life.",
            ]
        );

        SpeakingPrompt::firstOrCreate(
            ['test_id' => $test->id, 'part_number' => 'part_3'],
            [
                'topic'               => 'Learning & Education',
                'prompt_text'         => 'The examiner will ask further questions related to the topic in Part 2.',
                'follow_up_questions' => [
                    'Do you think it is easier to learn new skills when you are young or when you are older?',
                    'How has the way people learn skills changed in recent years?',
                    'What role should governments play in helping adults learn new skills?',
                    'Some people say that schools focus too much on academic subjects. Do you agree?',
                    'How important is it for people to continue learning throughout their lives?',
                ],
                'time_allowed_seconds'=> 300,
            ]
        );
    }
}
