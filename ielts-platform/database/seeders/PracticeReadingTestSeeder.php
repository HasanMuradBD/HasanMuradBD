<?php
namespace Database\Seeders;

use App\Models\MicroSkill;
use App\Models\Question;
use App\Models\Test;
use App\Models\WritingPrompt;
use Illuminate\Database\Seeder;

/**
 * Practice Reading Test 1 — "The Science of Sleep"
 * Covers: Matching Headings, Matching Information, True/False/Not Given,
 * Sentence Completion, Summary Completion, Short Answer, Multiple Choice
 */
class PracticeReadingTestSeeder extends Seeder
{
    private const PASSAGE = <<<'PASSAGE'
The Science of Sleep

A. For most of human history, sleep was considered a passive and largely uneventful state — a nightly retreat from the active business of living. Scientists now know that the sleeping brain is anything but dormant. During the hours we spend unconscious, the brain cycles through a series of distinct stages, each serving vital functions that cannot be achieved during wakefulness. The consequences of neglecting sleep, research increasingly shows, extend far beyond simple tiredness.

B. The architecture of a typical night's sleep consists of repeated cycles, each lasting roughly 90 minutes, and each comprising both non-rapid eye movement (NREM) sleep and rapid eye movement (REM) sleep. NREM sleep is itself divided into three stages, progressing from light sleep in Stage 1 to the deep, restorative slow-wave sleep of Stage 3. REM sleep, characterised by the rapid movement of the eyes beneath closed lids, is the stage most associated with vivid dreaming. Crucially, the proportion of each stage shifts across the night: the early cycles are dominated by slow-wave sleep, while REM becomes increasingly prevalent as morning approaches.

C. One of the most striking discoveries of modern sleep science is the role of sleep in memory consolidation. During slow-wave sleep, the hippocampus — a brain region central to forming new memories — repeatedly replays the events of the day, transferring information to the neocortex for long-term storage. REM sleep, meanwhile, appears to strengthen the emotional and procedural dimensions of memory: the *how* of a skill and the *feeling* attached to an experience. Studies have shown that students who sleep after learning new material retain up to 40% more information the following day than those who remain awake.

D. Sleep also plays a critical role in the body's metabolic and immune systems. During deep sleep, the pituitary gland releases the majority of its daily quota of growth hormone, which drives cellular repair and muscle recovery. Simultaneously, the immune system ramps up its activity, producing cytokines — proteins that target infection and inflammation. Chronic sleep deprivation has been linked to elevated levels of cortisol, the stress hormone, which suppresses immune function and is associated with increased risk of cardiovascular disease, obesity, and type 2 diabetes.

E. Perhaps the most recently discovered function of sleep is its role in neural housekeeping. Researchers at the University of Rochester demonstrated in 2013 that the brain's glymphatic system — a network of channels surrounding blood vessels — becomes nearly ten times more active during sleep than during wakefulness. Cerebrospinal fluid is pumped through these channels, flushing out metabolic waste products, including beta-amyloid, a protein whose accumulation in the brain is strongly associated with Alzheimer's disease. This finding has led some neuroscientists to describe sleep as the brain's nightly 'cleaning cycle'.

F. The amount of sleep individuals need varies with age. Newborns may sleep up to 17 hours a day, driven in part by the explosive neural development of infancy. School-age children typically require 9–11 hours, while teenagers — whose circadian rhythms shift to favour later sleep and wake times as a result of hormonal changes — need 8–10 hours but frequently get far less due to early school start times. Adults generally require 7–9 hours, though a small genetic minority can function optimally on 6 hours or less. The elderly often experience fragmented sleep and reduced slow-wave sleep, though their total sleep need does not diminish as dramatically as was once assumed.

G. Despite the clear evidence for sleep's importance, modern societies appear structurally opposed to adequate rest. Artificial light — particularly the blue-wavelength light emitted by smartphones and computer screens — suppresses melatonin secretion and delays the onset of sleep. The 24-hour economy demands shift work from a significant portion of the workforce, chronically misaligning biological clocks with working schedules. And a cultural narrative that prizes busyness and equates long hours with dedication continues to stigmatise the very act of prioritising sleep. Public health researchers argue that addressing the 'sleep epidemic' will require not just individual behaviour change, but systemic reforms to working hours, school start times, and urban lighting.
PASSAGE;

    public function run(): void
    {
        // Create the practice test
        $test = Test::firstOrCreate(
            ['title' => 'Practice Reading Test 1 — The Science of Sleep'],
            [
                'type'                 => 'module_practice',
                'module'               => 'reading',
                'academic_or_general'  => 'academic',
                'duration_minutes'     => 60,
                'total_questions'      => 13,
                'is_active'            => true,
            ]
        );

        if ($test->questions()->exists()) return; // already seeded

        $skills = MicroSkill::whereIn('slug', [
            'reading_matching_headings',
            'reading_matching_info',
            'reading_tfng',
            'reading_sentence_comp',
            'reading_summary_comp',
            'reading_short_answer',
            'reading_mcq',
            'reading_skimming',
            'reading_scanning',
        ])->get()->keyBy('slug');

        $questions = [
            // --- MATCHING HEADINGS (Q1–5, Paragraphs B–F) ---
            [
                'section_number'   => 1,
                'sequence'         => 1,
                'question_type'    => 'matching_headings',
                'question_text'    => "The reading passage has seven paragraphs, A–G.\nChoose the correct heading for paragraphs B–F from the list of headings below.\n\nList of Headings:\ni.   The glymphatic cleaning system\nii.  Why modern life undermines sleep\niii. Sleep requirements across the lifespan\niv.  The structure of a night's sleep\nv.   Memory consolidation during sleep\nvi.  Hormonal and immune benefits\nvii. Early scientific misconceptions\nviii.The role of REM in skill learning\n\nParagraph B",
                'correct_answer'   => 'iv',
                'answer_explanation' => "Paragraph B describes the architecture of a night's sleep — the 90-minute cycles, NREM stages, and REM — making heading iv ('The structure of a night's sleep') correct.",
                'difficulty'       => 'medium',
                'skills'           => ['reading_matching_headings', 'reading_skimming'],
            ],
            [
                'section_number'   => 1,
                'sequence'         => 2,
                'question_type'    => 'matching_headings',
                'question_text'    => "Paragraph C",
                'correct_answer'   => 'v',
                'answer_explanation' => "Paragraph C focuses on how the hippocampus replays memories during slow-wave sleep and REM strengthens procedural/emotional memory — heading v.",
                'difficulty'       => 'medium',
                'skills'           => ['reading_matching_headings', 'reading_skimming'],
            ],
            [
                'section_number'   => 1,
                'sequence'         => 3,
                'question_type'    => 'matching_headings',
                'question_text'    => "Paragraph D",
                'correct_answer'   => 'vi',
                'answer_explanation' => "Paragraph D covers growth hormone release, immune cytokines, and the consequences of sleep deprivation on metabolism — heading vi.",
                'difficulty'       => 'medium',
                'skills'           => ['reading_matching_headings', 'reading_skimming'],
            ],
            [
                'section_number'   => 1,
                'sequence'         => 4,
                'question_type'    => 'matching_headings',
                'question_text'    => "Paragraph E",
                'correct_answer'   => 'i',
                'answer_explanation' => "Paragraph E describes the glymphatic system flushing beta-amyloid — heading i ('The glymphatic cleaning system').",
                'difficulty'       => 'hard',
                'skills'           => ['reading_matching_headings', 'reading_skimming'],
            ],
            [
                'section_number'   => 1,
                'sequence'         => 5,
                'question_type'    => 'matching_headings',
                'question_text'    => "Paragraph F",
                'correct_answer'   => 'iii',
                'answer_explanation' => "Paragraph F discusses how sleep needs differ by age group from newborns to the elderly — heading iii.",
                'difficulty'       => 'easy',
                'skills'           => ['reading_matching_headings', 'reading_skimming'],
            ],

            // --- TRUE / FALSE / NOT GIVEN (Q6–9) ---
            [
                'section_number'   => 2,
                'sequence'         => 6,
                'question_type'    => 'true_false_not_given',
                'question_text'    => "Do the following statements agree with the information given in the reading passage?\nWrite TRUE, FALSE, or NOT GIVEN.\n\nSlow-wave sleep is more prevalent in the early part of the night than in the later part.",
                'correct_answer'   => 'TRUE',
                'answer_explanation' => "Paragraph B states: 'the early cycles are dominated by slow-wave sleep, while REM becomes increasingly prevalent as morning approaches.' Directly confirmed.",
                'difficulty'       => 'easy',
                'skills'           => ['reading_tfng', 'reading_scanning'],
            ],
            [
                'section_number'   => 2,
                'sequence'         => 7,
                'question_type'    => 'true_false_not_given',
                'question_text'    => "Students who study and then sleep retain exactly twice as much information as those who remain awake.",
                'correct_answer'   => 'FALSE',
                'answer_explanation' => "Paragraph C says 'up to 40% more' — not twice as much (100% more). The statement overstates the claim, making it FALSE.",
                'difficulty'       => 'medium',
                'skills'           => ['reading_tfng', 'reading_scanning'],
            ],
            [
                'section_number'   => 2,
                'sequence'         => 8,
                'question_type'    => 'true_false_not_given',
                'question_text'    => "The glymphatic system was studied by researchers at Harvard University.",
                'correct_answer'   => 'FALSE',
                'answer_explanation' => "Paragraph E attributes the 2013 study to the University of Rochester, not Harvard. FALSE.",
                'difficulty'       => 'easy',
                'skills'           => ['reading_tfng', 'reading_scanning'],
            ],
            [
                'section_number'   => 2,
                'sequence'         => 9,
                'question_type'    => 'true_false_not_given',
                'question_text'    => "The elderly require substantially less sleep than younger adults.",
                'correct_answer'   => 'FALSE',
                'answer_explanation' => "Paragraph F states their 'total sleep need does not diminish as dramatically as was once assumed' — contradicting the idea of substantially less sleep. FALSE.",
                'difficulty'       => 'hard',
                'skills'           => ['reading_tfng', 'reading_scanning'],
            ],

            // --- SENTENCE COMPLETION (Q10–11) ---
            [
                'section_number'   => 3,
                'sequence'         => 10,
                'question_type'    => 'sentence_completion',
                'question_text'    => "Complete the sentences below using NO MORE THAN TWO WORDS from the passage.\n\nDuring deep sleep, the pituitary gland releases ________, which supports cellular repair and muscle recovery.",
                'correct_answer'   => 'growth hormone',
                'answer_explanation' => "Paragraph D: 'the pituitary gland releases the majority of its daily quota of growth hormone, which drives cellular repair and muscle recovery.'",
                'difficulty'       => 'easy',
                'skills'           => ['reading_sentence_comp', 'reading_scanning'],
            ],
            [
                'section_number'   => 3,
                'sequence'         => 11,
                'question_type'    => 'sentence_completion',
                'question_text'    => "Blue-wavelength light emitted by screens suppresses ________ and delays the onset of sleep.",
                'correct_answer'   => 'melatonin secretion',
                'answer_explanation' => "Paragraph G: 'the blue-wavelength light emitted by smartphones and computer screens — suppresses melatonin secretion and delays the onset of sleep.'",
                'difficulty'       => 'medium',
                'skills'           => ['reading_sentence_comp', 'reading_scanning'],
            ],

            // --- MULTIPLE CHOICE (Q12) ---
            [
                'section_number'   => 4,
                'sequence'         => 12,
                'question_type'    => 'multiple_choice',
                'question_text'    => "Choose the correct letter, A, B, C or D.\n\nAccording to paragraph E, the significance of the glymphatic system is that it\n\nA  supplies oxygen to neurons during sleep.\nB  removes harmful proteins that are linked to Alzheimer's disease.\nC  regulates the release of growth hormone.\nD  transfers memories from the hippocampus to the neocortex.",
                'correct_answer'   => 'B',
                'answer_explanation' => "Paragraph E: the glymphatic system flushes out 'beta-amyloid, a protein whose accumulation in the brain is strongly associated with Alzheimer's disease.' A=wrong (oxygen not mentioned), C=wrong (growth hormone is pituitary, paragraph D), D=wrong (memory transfer, paragraph C).",
                'difficulty'       => 'medium',
                'skills'           => ['reading_mcq', 'reading_scanning'],
            ],

            // --- SHORT ANSWER (Q13) ---
            [
                'section_number'   => 4,
                'sequence'         => 13,
                'question_type'    => 'short_answer',
                'question_text'    => "Answer the question below using NO MORE THAN THREE WORDS from the passage.\n\nWhat do researchers call the proteins produced by the immune system during deep sleep that target infection and inflammation?",
                'correct_answer'   => 'cytokines',
                'answer_explanation' => "Paragraph D: 'the immune system ramps up its activity, producing cytokines — proteins that target infection and inflammation.'",
                'difficulty'       => 'medium',
                'skills'           => ['reading_short_answer', 'reading_scanning'],
            ],
        ];

        foreach ($questions as $qData) {
            $skillSlugs = $qData['skills'];
            unset($qData['skills']);

            $question = $test->questions()->create(array_merge($qData, [
                'module'            => 'reading',
                'passage_reference' => self::PASSAGE,
            ]));

            foreach ($skillSlugs as $slug) {
                if ($skill = $skills->get($slug)) {
                    $question->microSkills()->attach($skill->id);
                }
            }
        }
    }
}
