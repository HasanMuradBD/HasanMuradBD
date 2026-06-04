<?php
namespace App\Services;

use App\Models\MicroSkill;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Derives a user's challenge profile from their skill snapshot data.
 *
 * Each of the 6 root causes gets a severity score (0–100) computed by
 * averaging the accuracy of all micro-skills mapped to that cause.
 * Low accuracy = high severity = the user has this problem.
 */
class ChallengeProfileService
{
    // Accuracy threshold below which a cause is considered "active"
    private const THRESHOLD = 65.0;

    // Ordered severity labels
    private const SEVERITY = [
        ['min' => 0,  'max' => 40, 'label' => 'Critical',  'color' => 'red'],
        ['min' => 40, 'max' => 55, 'label' => 'Serious',   'color' => 'orange'],
        ['min' => 55, 'max' => 65, 'label' => 'Moderate',  'color' => 'amber'],
        ['min' => 65, 'max' => 80, 'label' => 'Mild',      'color' => 'yellow'],
        ['min' => 80, 'max' => 100,'label' => 'Strong',    'color' => 'green'],
    ];

    // Human-readable metadata per cause
    private const CAUSE_META = [
        'cause_vocabulary'    => [
            'title'       => 'Limited Vocabulary Range',
            'icon'        => '📖',
            'description' => 'You are losing marks because your word choice is too narrow or imprecise.',
            'fixes'       => [
                'Learn 5 topic-specific collocations per day (not individual words)',
                'Practise paraphrasing exam questions without repeating the original words',
                'Read one IELTS-level article daily and record 3 new collocations',
            ],
            'affects'     => ['reading', 'writing', 'speaking'],
        ],
        'cause_grammar'       => [
            'title'       => 'Weak Grammar Foundation',
            'icon'        => '✏️',
            'description' => 'Grammar errors are reducing your Grammatical Range & Accuracy score across Writing and Speaking.',
            'fixes'       => [
                'Target one grammar structure per week — study it, then use it in practice writing',
                'Review the 10 most common IELTS grammar errors (articles, tense consistency, subject-verb agreement)',
                'Self-edit your writing specifically for grammar before submitting',
            ],
            'affects'     => ['writing', 'speaking'],
        ],
        'cause_exposure'      => [
            'title'       => 'Lack of Exposure to Authentic English',
            'icon'        => '🎧',
            'description' => 'Limited exposure to natural, varied English is affecting your Listening comprehension and Speaking naturalness.',
            'fixes'       => [
                'Listen to 20 minutes of authentic English daily (BBC, TED, podcasts)',
                'Practise with recordings of different accents — British, Australian, American, Canadian',
                'Shadow native speakers: listen, pause, repeat with the same rhythm',
            ],
            'affects'     => ['listening', 'speaking'],
        ],
        'cause_timed'         => [
            'title'       => 'Insufficient Practice Under Timed Conditions',
            'icon'        => '⏱️',
            'description' => 'You know the material but underperform when the clock is running.',
            'fixes'       => [
                'Always practise Reading and Listening with a strict timer — never without',
                'Allocate exactly 20 minutes per Reading passage (3 passages, 60 minutes total)',
                'In your study sessions, simulate exam silence and no dictionary',
            ],
            'affects'     => ['reading', 'listening', 'writing'],
        ],
        'cause_memorised'     => [
            'title'       => 'Over-reliance on Memorised Answers',
            'icon'        => '🧠',
            'description' => 'Scripted or memorised responses are hurting your Speaking fluency score and Reading answer selection.',
            'fixes'       => [
                'Practise Speaking by answering questions you have never prepared for',
                'In Reading, commit to your first instinct — don\'t change answers without a clear reason',
                'Record yourself speaking and listen back for robotic or unnatural patterns',
            ],
            'affects'     => ['speaking', 'reading'],
        ],
        'cause_question_type' => [
            'title'       => 'Poor Understanding of Question Types & Criteria',
            'icon'        => '📋',
            'description' => 'You are not consistently applying the correct strategy for each question format.',
            'fixes'       => [
                'Study the examiner\'s instructions for each question type (what "not given" really means)',
                'Complete at least 2 full practice tests specifically focusing on your weakest question type',
                'Read IELTS band descriptors — know exactly what Band 7 looks like vs Band 6',
            ],
            'affects'     => ['reading', 'listening', 'writing', 'speaking'],
        ],
    ];

    public function buildProfile(User $user): array
    {
        // Get latest accuracy per skill for this user (last 30 days)
        $snapshots = $user->skillSnapshots()
            ->with('microSkill')
            ->where('snapshot_date', '>=', now()->subDays(30))
            ->orderByDesc('snapshot_date')
            ->get()
            ->unique('micro_skill_id');

        if ($snapshots->isEmpty()) {
            return [];
        }

        // Map skill slug → accuracy
        $accuracyBySlug = $snapshots->mapWithKeys(fn($s) => [
            $s->microSkill->slug => (float) $s->accuracy_pct,
        ]);

        // Get the cause slug for each micro-skill from DB
        // (stored as parent_skill_id pointing to a cause_ node)
        $causeMap = $this->buildCauseMap();

        // Accumulate accuracy readings per cause
        $causeAccuracies = [];
        foreach ($accuracyBySlug as $slug => $accuracy) {
            $cause = $causeMap[$slug] ?? null;
            if (!$cause) continue;
            $causeAccuracies[$cause][] = $accuracy;
        }

        $profile = [];
        foreach (self::CAUSE_META as $causeSlug => $meta) {
            $readings = $causeAccuracies[$causeSlug] ?? [];
            $avgAcc   = $readings ? round(array_sum($readings) / count($readings), 1) : null;
            $severity = $this->classifySeverity($avgAcc);

            $profile[] = [
                'slug'        => $causeSlug,
                'title'       => $meta['title'],
                'icon'        => $meta['icon'],
                'description' => $meta['description'],
                'fixes'       => $meta['fixes'],
                'affects'     => $meta['affects'],
                'accuracy'    => $avgAcc,
                'severity'    => $severity['label'] ?? null,
                'color'       => $severity['color'] ?? 'gray',
                'active'      => $avgAcc !== null && $avgAcc < self::THRESHOLD,
            ];
        }

        // Sort: active causes first, then by accuracy ascending (worst first)
        usort($profile, fn($a, $b) => [
            ($b['active'] ? 1 : 0) <=> ($a['active'] ? 1 : 0),
            ($a['accuracy'] ?? 100) <=> ($b['accuracy'] ?? 100),
        ][0] ?? (($a['accuracy'] ?? 100) <=> ($b['accuracy'] ?? 100)));

        return $profile;
    }

    /**
     * Returns the top N active cause slugs for a user — used by PlanGeneratorService
     * to weight themes and by WhatsApp scripts to personalise tips.
     */
    public function topCauses(User $user, int $limit = 3): array
    {
        return collect($this->buildProfile($user))
            ->filter(fn($c) => $c['active'])
            ->pluck('slug')
            ->take($limit)
            ->values()
            ->toArray();
    }

    private function buildCauseMap(): array
    {
        // Map child skill slug → parent cause slug
        // Looks up all micro-skills whose parent_skill_id points to a cause_ node
        $causes = MicroSkill::where('slug', 'like', 'cause_%')->pluck('id', 'slug');
        $causeIdToSlug = $causes->flip()->toArray(); // id => slug

        $childSkills = MicroSkill::whereIn('parent_skill_id', $causes->values())->get(['slug', 'parent_skill_id']);

        $map = [];
        foreach ($childSkills as $skill) {
            $causeSlug = $causeIdToSlug[$skill->parent_skill_id] ?? null;
            if ($causeSlug) {
                $map[$skill->slug] = $causeSlug;
            }
        }
        return $map;
    }

    private function classifySeverity(?float $accuracy): array
    {
        if ($accuracy === null) return ['label' => null, 'color' => 'gray'];
        foreach (self::SEVERITY as $band) {
            if ($accuracy >= $band['min'] && $accuracy < $band['max']) {
                return $band;
            }
        }
        return ['label' => 'Strong', 'color' => 'green'];
    }
}
