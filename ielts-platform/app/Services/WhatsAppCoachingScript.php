<?php
namespace App\Services;

/**
 * Day-specific WhatsApp coaching scripts for Days 1–30.
 *
 * Each day has a 'morning' message (educational tip + task preview),
 * an optional 'quiz' (used by midday if the day qualifies), and
 * a 'milestone' banner for weekly checkpoints.
 */
class WhatsAppCoachingScript
{
    // Days with a mini-quiz (quiz answer stored in cache by the morning dispatcher)
    private const QUIZ_DAYS = [3, 6, 10, 13, 17, 20, 24, 27];

    // Day-specific educational openers for morning messages
    private const DAY_TIPS = [
        1  => "Today is Day 1 — the day you commit. Research shows candidates who track *daily* progress score 0.5 bands higher than those who don't.",
        2  => "Quick tip: In IELTS Reading, skim the *questions first*, then scan the passage. You'll save 3–5 minutes per section.",
        3  => "Collocations matter more than rare vocabulary. 'carry out research' scores higher than 'do research' at Band 7+.",
        4  => "True/False/Not Given: 'Not Given' means the text is simply silent — not that it's false. Many candidates lose marks here.",
        5  => "In Writing Task 2, examiners spend ~2 minutes on your essay. Your *opening sentence* and *topic sentences* carry 60% of the impression.",
        6  => "Listening Section 4 (academic monologue) is the hardest. The key: predict the answer type before the audio starts.",
        7  => "Week 1 complete — you've built the habit. The candidates who reach Band 7 are the ones still here on Day 7.",
        8  => "The 'umbrella' technique in Speaking Part 2: name your topic → give 3 specific details → loop back to the opening. Fluency, not perfection.",
        9  => "In Reading, if you can't find the answer in 90 seconds, mark your best guess and move on. Time is the silent enemy.",
        10 => "Cohesive devices (However / Furthermore / As a result) should be *varied*. Using 'however' 6 times in one essay signals a Band 5 range.",
        11 => "Paraphrasing in Writing Task 1: change at least 3 of every 5 words in the question prompt. Direct copying scores zero for LR.",
        12 => "Speaking Part 3 rewards abstract thinking. Practise phrases: 'It depends on the context…', 'Generally speaking…', 'There are two sides to this.'",
        13 => "Matching Headings: read the first and last sentence of each paragraph — the heading is almost always signalled there.",
        14 => "Two weeks in. Your diagnostic band is your *baseline*, not your ceiling. Every session from here is upward movement.",
        15 => "Writing Task 1 (Academic): describe the *overall trend* in your overview paragraph. Examiners skip to overview first.",
        16 => "Listening: if you miss an answer, don't panic — the audio keeps playing. Immediately focus on the *next* question.",
        17 => "Spelling errors in Listening and Reading cost full marks. 'Accomodation' (wrong) vs 'accommodation' (right) — this is Band 6 vs Band 7.",
        18 => "In Speaking, 3-second pauses are fine if you fill them with 'That's an interesting question…' or 'Let me think about that…'",
        19 => "Reading tip: the answers always appear in the *same order* in the passage as the questions (for most question types). Scan sequentially.",
        20 => "Three weeks of consistent study. Your brain has now started to automate the test patterns. Trust the process.",
        21 => "Writing Task 2 structure: Introduction → Body 1 (position/argument 1) → Body 2 (counter/argument 2) → Conclusion. Simple beats clever.",
        22 => "For Note Completion in Listening: always check the word limit in the instruction. '...NO MORE THAN TWO WORDS' is a trap many miss.",
        23 => "Speaking fluency tip: connect your ideas with 'which means that…' or 'the reason for this is…' — it signals coherent thinking.",
        24 => "In Reading, 'Yes/No/Not Given' tests the *writer's view*. 'True/False/Not Given' tests *factual information*. They require different mindsets.",
        25 => "One week to go (if 30-day plan). The examiners are not looking for perfection — they're looking for *communication* at the target band level.",
        26 => "Writing vocabulary: avoid 'very' and 'really'. Replace: 'very important' → 'crucial', 'very big' → 'substantial'. Immediately Band 6 → Band 7.",
        27 => "Listening Section 3: two or more speakers discussing an academic topic. The key traps are *distractor* answers — listen for corrections.",
        28 => "Two days out (if 30-day plan): don't cram. Light revision only. Your consolidation happens *during sleep* — rest is preparation.",
        29 => "Tomorrow is your final practice session. Focus on the module with the biggest gap. One targeted hour > four unfocused hours.",
        30 => "Day 30 — final prep complete. You have done the work. Walk into your exam knowing the structure, trusting your preparation. 🎯",
    ];

    private const QUIZ_BANK = [
        3  => [
            'question'    => "Quick quiz 🧠\n\nWhich sentence uses the better collocation?\n\n1️⃣ She did a research on climate change.\n2️⃣ She conducted research on climate change.\n3️⃣ She made a research on climate change.",
            'correct'     => '2',
            'explanation' => "'Conduct research' is the standard academic collocation. 'Do' is informal, and 'make research' is incorrect in English.",
        ],
        6  => [
            'question'    => "Quick quiz 🧠\n\nIn Listening, a question says 'Write NO MORE THAN TWO WORDS'. The answer you hear is 'large modern library'. What should you write?\n\n1️⃣ large modern library\n2️⃣ modern library\n3️⃣ library",
            'correct'     => '2',
            'explanation' => "'Modern library' is 2 words and matches the audio. 'Large modern library' is 3 words (over the limit). 'Library' alone misses the key descriptor.",
        ],
        10 => [
            'question'    => "Quick quiz 🧠\n\nWhich transition is best for introducing a *contrasting* idea in Writing Task 2?\n\n1️⃣ Furthermore\n2️⃣ Nevertheless\n3️⃣ In addition",
            'correct'     => '2',
            'explanation' => "'Nevertheless' signals contrast/concession. 'Furthermore' and 'In addition' both add supporting ideas — wrong function here.",
        ],
        13 => [
            'question'    => "Quick quiz 🧠\n\nFor Matching Headings, where should you look *first* in each paragraph?\n\n1️⃣ The middle sentences\n2️⃣ The first and last sentences\n3️⃣ Every sentence equally",
            'correct'     => '2',
            'explanation' => "In academic writing, the topic sentence (first) and concluding sentence (last) carry the paragraph's main idea — which is what the heading summarises.",
        ],
        17 => [
            'question'    => "Quick quiz 🧠\n\nWhich spelling is correct for IELTS?\n\n1️⃣ accomodation\n2️⃣ acommodation\n3️⃣ accommodation",
            'correct'     => '3',
            'explanation' => "'Accommodation' — two c's, two m's. This is one of the most common spelling errors in IELTS Listening and costs full marks.",
        ],
        20 => [
            'question'    => "Quick quiz 🧠\n\nA Reading passage states: 'Some scientists believe the findings may suggest a link between X and Y.' A T/F/NG question says: 'Scientists have proven the link between X and Y.'\n\nAnswer:\n\n1️⃣ True\n2️⃣ False\n3️⃣ Not Given",
            'correct'     => '2',
            'explanation' => "'May suggest' is speculative — the passage does not claim proof. The question's claim ('have proven') directly contradicts the passage's hedging language.",
        ],
        24 => [
            'question'    => "Quick quiz 🧠\n\nYou read: 'The author argues that technology has fundamentally changed how we communicate.' A Y/N/NG question says: 'The author believes these changes have been positive.'\n\nAnswer:\n\n1️⃣ Yes\n2️⃣ No\n3️⃣ Not Given",
            'correct'     => '3',
            'explanation' => "The passage states a *fact* (communication has changed) but makes no judgment about whether this is positive or negative. The opinion is simply not stated.",
        ],
        27 => [
            'question'    => "Quick quiz 🧠\n\nIn Speaking Part 2, you have 1 minute to prepare. The best strategy is:\n\n1️⃣ Write full sentences to read from\n2️⃣ Write 3–4 bullet-point memory cues\n3️⃣ Memorise an answer you prepared before",
            'correct'     => '2',
            'explanation' => "Bullet cues keep your speech *natural* and prevent the robotic delivery that penalties fluency. Memorised speeches are also detectable and scored down.",
        ],
    ];

    public function getMorningTip(int $dayNum): string
    {
        $tip = self::DAY_TIPS[$dayNum] ?? null;

        if (!$tip) {
            // Generic tip for days beyond 30 (extended plans)
            $bucket = (($dayNum - 1) % 4);
            $generics = [
                "Consistency compounds. Every session makes the next one easier.",
                "Focus on your weakest question type today — targeted practice beats general revision.",
                "Read one IELTS band descriptor today. Knowing what examiners look for is half the battle.",
                "Simulate exam conditions: no dictionary, strict time limit. Your brain adapts to pressure through repetition.",
            ];
            $tip = $generics[$bucket];
        }

        return $tip;
    }

    /**
     * Returns a challenge-specific tip overlay if the user has an active cause.
     * Called every 3rd day to surface targeted advice based on their actual data.
     */
    public function getChallengeNudge(int $dayNum, array $topCauses): ?string
    {
        if (empty($topCauses) || $dayNum % 3 !== 0) return null;

        // Rotate through top causes based on day
        $cause = $topCauses[($dayNum / 3 - 1) % count($topCauses)];

        return match($cause) {
            'cause_vocabulary'    => "📖 *Your vocab data:* You're losing marks on paraphrasing. Today, after your drill, write 5 collocations from the passage in new sentences.",
            'cause_grammar'       => "✏️ *Your grammar data:* Your responses show tense inconsistency. Review your written output today specifically for that — one structure at a time.",
            'cause_exposure'      => "🎧 *Your listening data:* Unfamiliar accents are slowing you down. Tonight, listen to 10 minutes of BBC Radio 4 — just for exposure, no pressure.",
            'cause_timed'         => "⏱️ *Your timing data:* You're spending too long per question. Today, set a 90-second timer per Reading question and commit.",
            'cause_memorised'     => "🧠 *Your speaking data:* Your answers are sounding scripted. Practise answering 3 questions you've never prepared for — raw and real.",
            'cause_question_type' => "📋 *Your accuracy data:* Question type errors are costing you. Before today's drill, re-read the examiner instructions for your weakest type.",
            default               => null,
        };
    }

    public function hasQuiz(int $dayNum): bool
    {
        return in_array($dayNum, self::QUIZ_DAYS);
    }

    public function getQuiz(int $dayNum): ?array
    {
        return self::QUIZ_BANK[$dayNum] ?? null;
    }

    public function getMilestone(int $dayNum, int $totalDays): ?string
    {
        return match(true) {
            $dayNum === 7               => "🏅 One week down.",
            $dayNum === 14              => "🏅 Two weeks down. Halfway.",
            $dayNum === 21              => "🏅 Three weeks. The final push.",
            $dayNum === $totalDays - 1  => "🔔 Tomorrow is your last scheduled session.",
            $dayNum === $totalDays      => "✅ Plan complete. You're ready.",
            default                     => null,
        };
    }
}
