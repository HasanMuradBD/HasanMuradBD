<?php
namespace Database\Seeders;

use App\Models\DailyTip;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DailyTipSeeder extends Seeder
{
    public function run(): void
    {
        // 30 dated tips starting from today
        $dated = [
            ['type' => 'vocabulary', 'title' => 'Ubiquitous', 'content' => 'Present or found everywhere. Use this in Writing Task 2 to describe widespread phenomena.', 'example' => 'Smartphones have become ubiquitous in modern society.'],
            ['type' => 'grammar',    'title' => 'Passive Voice for Objectivity', 'content' => 'IELTS Writing Task 1 often requires objective description. Use passive voice to sound academic and impartial.', 'example' => 'The data was collected over a five-year period.'],
            ['type' => 'exam_tip',   'title' => 'Read the Question Type First', 'content' => 'Before reading the passage, identify the question type (T/F/NG, matching, completion). It tells you what information to hunt for.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Proliferate', 'content' => 'To increase rapidly in number; multiply. A powerful verb for describing growth trends.', 'example' => 'Social media platforms have proliferated over the past decade.'],
            ['type' => 'grammar',    'title' => 'Cohesive Devices', 'content' => 'Band 7+ essays use a variety of linking words. Go beyond "however" and "therefore" — try "notwithstanding", "consequently", "in stark contrast".', 'example' => null],
            ['type' => 'exam_tip',   'title' => 'The 20-Minute Reading Rule', 'content' => 'Spend no more than 20 minutes on each of the three reading passages. Use a watch or the on-screen timer to track yourself strictly.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Mitigate', 'content' => 'To make less severe or serious. Essential in Task 2 when discussing solutions to problems.', 'example' => 'Governments must act to mitigate the effects of climate change.'],
            ['type' => 'grammar',    'title' => 'Conditionals for Recommendations', 'content' => 'Use third conditional to show hypothetical improvements. It demonstrates grammatical range.', 'example' => 'If stricter regulations had been implemented, pollution levels would have decreased significantly.'],
            ['type' => 'exam_tip',   'title' => 'Spelling Counts in Listening', 'content' => 'A correct answer with a spelling mistake is marked wrong. Practice spelling common IELTS answer words: address, accommodation, percentage, necessary.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Exacerbate', 'content' => 'To make a problem or bad situation worse. Use when discussing compounding issues.', 'example' => 'Poor diet can exacerbate existing health conditions.'],
            ['type' => 'grammar',    'title' => 'Noun Phrases for Complexity', 'content' => 'Replace simple nouns with complex noun phrases to increase grammatical range.', 'example' => 'Instead of "pollution is a problem" → "The escalating levels of urban air pollution represent a significant public health crisis."'],
            ['type' => 'exam_tip',   'title' => 'Transfer Time in Listening', 'content' => 'In the actual IELTS test you get 10 minutes at the end to transfer answers to the answer sheet. Use this time to check spelling, not rewrite answers.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Pragmatic', 'content' => 'Dealing with things sensibly and realistically. Use to describe practical approaches to problems.', 'example' => 'A pragmatic approach to education reform is needed.'],
            ['type' => 'grammar',    'title' => 'Relative Clauses for Precision', 'content' => 'Non-defining relative clauses add information without starting a new sentence, demonstrating syntactic control.', 'example' => 'The government, which introduced the policy in 2010, has yet to evaluate its effectiveness.'],
            ['type' => 'exam_tip',   'title' => 'Paraphrase the Question', 'content' => 'In Writing Task 2, your introduction should paraphrase the question — never copy it directly. Examiners immediately notice and discount copied text.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Inequitable', 'content' => 'Not fair or impartial. Use in Task 2 essays about social justice, education, or healthcare.', 'example' => 'The inequitable distribution of resources remains a global challenge.'],
            ['type' => 'grammar',    'title' => 'Hedging Language for Academic Tone', 'content' => 'Use modal verbs and phrases to soften claims — this is expected in academic writing.', 'example' => 'This may suggest that... / It could be argued that... / There appears to be a correlation...'],
            ['type' => 'exam_tip',   'title' => 'Locate Before You Read', 'content' => 'For sentence completion questions, the answers appear in the text in order. Locate the section, then read carefully rather than re-reading the whole passage.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Pervasive', 'content' => 'Spreading widely through an area or group of people. Similar to ubiquitous but implies gradual spread.', 'example' => 'A pervasive sense of distrust in public institutions has emerged in recent years.'],
            ['type' => 'grammar',    'title' => 'Gerunds vs Infinitives', 'content' => 'Certain verbs take gerunds (enjoy, avoid, consider) and others take infinitives (decide, plan, hope). Mixing them incorrectly costs Band score.', 'example' => 'She avoids eating processed food. / She decided to change her diet.'],
            ['type' => 'exam_tip',   'title' => 'Not Given vs False', 'content' => 'In T/F/NG questions: FALSE means the passage directly contradicts the statement. NOT GIVEN means the passage simply does not mention it. If you\'re unsure, NOT GIVEN is often correct.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Substantiate', 'content' => 'To provide evidence to support a claim. Use in academic writing to sound more scholarly.', 'example' => 'These findings substantiate the claim that regular exercise improves cognitive function.'],
            ['type' => 'grammar',    'title' => 'Cleft Sentences for Emphasis', 'content' => 'Cleft structures add emphasis and demonstrate advanced grammatical control.', 'example' => 'It is the lack of investment in infrastructure that has led to transport failures.'],
            ['type' => 'exam_tip',   'title' => 'Speaking Part 2 Structure', 'content' => 'Use the 1-minute prep time to note: When? Where? Who? Why important? These four questions map directly to any cue card topic and ensure you speak for the full 2 minutes.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Contentious', 'content' => 'Causing or likely to cause controversy. Perfect for introducing debatable topics in Task 2.', 'example' => 'Capital punishment remains a contentious issue in many societies.'],
            ['type' => 'grammar',    'title' => 'Inversion for Formal Emphasis', 'content' => 'Negative inversion creates a formal, emphatic tone highly valued in academic IELTS writing.', 'example' => 'Not only does exercise improve physical health, but it also enhances mental well-being.'],
            ['type' => 'exam_tip',   'title' => 'Listening: Predict Before You Hear', 'content' => 'Use the 30 seconds of reading time before each section to predict answer types — number, name, place, or word. This focuses your attention.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Paradigm', 'content' => 'A typical example or pattern; a world view underlying scientific discipline. Use in advanced academic discussion.', 'example' => 'The internet has shifted the paradigm of information consumption entirely.'],
            ['type' => 'grammar',    'title' => 'Fronted Adverbials', 'content' => 'Starting sentences with adverbial phrases varies sentence structure and boosts your GRA score.', 'example' => 'Despite significant opposition, the policy was successfully implemented. / In recent decades, attitudes towards...'],
            ['type' => 'exam_tip',   'title' => 'Task Achievement Over Length', 'content' => 'Writing 300+ words does not guarantee a high Task Achievement score. A focused, well-argued 260-word essay outperforms an unfocused 350-word one. Quality > quantity.', 'example' => null],
        ];

        // 30 evergreen fallback tips
        $fallbacks = [
            ['type' => 'exam_tip',   'title' => 'Skim Before You Read', 'content' => 'Spend 60 seconds skimming the passage before tackling questions — read headings, first sentences, and any bold text to build a mental map.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Ambiguous', 'content' => 'Open to more than one interpretation. Use to discuss complex issues that lack clear-cut answers.', 'example' => 'The results of the study were ambiguous, making definitive conclusions difficult.'],
            ['type' => 'grammar',    'title' => 'The PEEL Paragraph', 'content' => 'Point → Explain → Evidence → Link. Every body paragraph in Task 2 should follow this structure for maximum coherence marks.', 'example' => null],
            ['type' => 'exam_tip',   'title' => 'Check Word Limits', 'content' => 'Never exceed the word limit in short-answer questions ("no more than 3 words"). Even if your answer is right, it will be marked wrong.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Detrimental', 'content' => 'Causing harm or damage. A stronger, more academic alternative to "bad" or "harmful".', 'example' => 'Excessive screen time can be detrimental to children\'s development.'],
            ['type' => 'grammar',    'title' => 'Articles: A, An, The', 'content' => 'Use "the" for specific/known items; "a/an" for general/first mention; no article for uncountable/abstract nouns in general statements.', 'example' => 'The government announced a new policy. Policy reform is essential.'],
            ['type' => 'exam_tip',   'title' => 'Speaking: Buy Thinking Time', 'content' => 'Pausing briefly and using fillers like "That\'s an interesting question — let me think for a moment" is natural. Silence for 5+ seconds is not.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Alleviate', 'content' => 'To make suffering, deficiency, or a problem less severe. More precise than "reduce" or "help".', 'example' => 'Several measures have been proposed to alleviate urban poverty.'],
            ['type' => 'grammar',    'title' => 'Subject-Verb Agreement', 'content' => 'Collective nouns (government, committee, society) take singular verbs in academic English.', 'example' => 'The government has introduced new legislation. / The committee is reviewing the proposal.'],
            ['type' => 'exam_tip',   'title' => 'Task 1 Overview is Mandatory', 'content' => 'An overview (summary of main trends without specific numbers) is essential for Band 6+. It is NOT an introduction — write it as a separate paragraph.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Imperative', 'content' => 'Of vital importance; essential. Also: giving a command. Use as an adjective in formal writing.', 'example' => 'It is imperative that governments address the climate crisis with urgency.'],
            ['type' => 'grammar',    'title' => 'Comparison Structures', 'content' => 'Task 1 demands accurate comparisons. Practice: "twice as high as", "significantly more than", "marginally lower than", "reached a peak of".', 'example' => 'In 2020, car ownership was three times higher than it had been in 1990.'],
            ['type' => 'exam_tip',   'title' => 'Listening: Follow the Questions', 'content' => 'Questions appear in the same order as the audio. If you miss one, move on — don\'t dwell, or you\'ll miss the next three.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Autonomous', 'content' => 'Having the freedom to govern itself or control its own affairs. Useful for discussions on governance, education, or technology.', 'example' => 'Self-driving vehicles are designed to operate as fully autonomous systems.'],
            ['type' => 'grammar',    'title' => 'Parallel Structure', 'content' => 'Items in a list must use the same grammatical form. Inconsistent parallelism is a common error that lowers GRA scores.', 'example' => 'The policy aims to reduce costs, improve efficiency, and increase transparency. ✓'],
            ['type' => 'exam_tip',   'title' => 'Avoid Memorised Phrases', 'content' => 'Examiners are trained to spot memorised introductions. They lower your Lexical Resource score. Always write naturally about the specific question.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Facilitate', 'content' => 'To make an action or process easier. A versatile academic verb for describing enabling conditions.', 'example' => 'Digital technology has greatly facilitated global communication.'],
            ['type' => 'grammar',    'title' => 'Quantifiers for Data', 'content' => 'Use precise quantifiers in Task 1: "the majority of", "a significant proportion", "roughly a quarter", "approximately 40%".', 'example' => 'The majority of respondents indicated a preference for remote working.'],
            ['type' => 'exam_tip',   'title' => 'Speaking Fluency > Accuracy', 'content' => 'Fluency and coherence is worth 25% of your Speaking score. A naturally flowing answer with minor errors scores higher than a hesitant, grammatically perfect one.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Unprecedented', 'content' => 'Never done or known before. Use to emphasise the novelty or scale of a phenomenon.', 'example' => 'The pandemic caused unprecedented disruption to global supply chains.'],
            ['type' => 'grammar',    'title' => 'Subordinate Clauses', 'content' => 'Complex sentences contain at least one subordinate clause. Aim for a mix of simple, compound, and complex sentences for high GRA marks.', 'example' => 'Although economic growth has slowed, living standards have continued to improve in most regions.'],
            ['type' => 'exam_tip',   'title' => 'Timing: Reading Practice', 'content' => 'Practice reading academic texts for 20 minutes daily — news articles (BBC, The Economist, Science Daily). Speed and comprehension improve together.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Convergence', 'content' => 'The process of coming together from different directions. Useful for data analysis and trend discussion.', 'example' => 'A convergence of economic and social factors contributed to the rise in inequality.'],
            ['type' => 'grammar',    'title' => 'Avoid Contractions', 'content' => 'Never use contractions (don\'t, it\'s, won\'t) in IELTS Writing. They are informal. Always write the full form: do not, it is, will not.', 'example' => null],
            ['type' => 'exam_tip',   'title' => 'Two Sides = Two Body Paragraphs', 'content' => 'For "discuss both views" questions, write one body paragraph per view before giving your opinion in the conclusion. Do not mix both views in one paragraph.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Phenomenon (plural: phenomena)', 'content' => 'A fact or situation that is observed to exist or happen. Note the irregular plural.', 'example' => 'Urbanisation is a global phenomenon affecting developed and developing nations alike.'],
            ['type' => 'grammar',    'title' => 'Reporting Verbs', 'content' => 'Go beyond "says/said". Use: argues, contends, maintains, asserts, acknowledges, posits, claims, demonstrates.', 'example' => 'The author contends that economic growth alone cannot address systemic inequality.'],
            ['type' => 'exam_tip',   'title' => 'Label Reading: Maps and Diagrams', 'content' => 'For diagram/map labelling, the orientation words matter: adjacent to, to the north of, opposite, between X and Y. Learn and practice these spatial prepositions.', 'example' => null],
            ['type' => 'vocabulary', 'title' => 'Holistic', 'content' => 'Characterised by the belief that the parts of something are closely interconnected. Use when discussing comprehensive approaches.', 'example' => 'A holistic approach to healthcare considers physical, mental, and social well-being.'],
            ['type' => 'grammar',    'title' => 'Avoid Repetition with Synonyms', 'content' => 'Using the same word repeatedly lowers your Lexical Resource score. Build synonym banks: increase → rise, surge, escalate, climb, grow, expand.', 'example' => null],
        ];

        $today = Carbon::today();

        foreach ($dated as $i => $tip) {
            DailyTip::firstOrCreate(
                ['target_date' => $today->copy()->addDays($i)->toDateString()],
                array_merge($tip, ['is_fallback' => false])
            );
        }

        foreach ($fallbacks as $tip) {
            DailyTip::firstOrCreate(
                ['title' => $tip['title'], 'is_fallback' => true],
                array_merge($tip, ['target_date' => null, 'is_fallback' => true])
            );
        }
    }
}
