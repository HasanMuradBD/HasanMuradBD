<?php
namespace App\Http\Controllers;

use App\Models\DailyTask;
use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\TestResponse;
use App\Services\BandCalculatorService;
use App\Services\SkillSnapshotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TestAttemptController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'test_id'       => 'required|exists:tests,id',
            'daily_task_id' => 'nullable|exists:daily_tasks,id',
        ]);

        $attempt = TestAttempt::create([
            'user_id'       => $request->user()->id,
            'test_id'       => $data['test_id'],
            'daily_task_id' => $data['daily_task_id'] ?? null,
            'is_diagnostic' => Test::find($data['test_id'])->type === 'diagnostic',
            'started_at'    => now(),
            'status'        => 'in_progress',
        ]);

        return redirect()->route('test-attempts.show', $attempt);
    }

    public function show(Request $request, TestAttempt $attempt)
    {
        abort_if($attempt->user_id !== $request->user()->id, 403);

        $test = $attempt->test()
            ->with([
                'questions'       => fn($q) => $q->with('microSkills')->orderBy('sequence'),
                'writingPrompts'  => fn($q) => $q->orderBy('task_number'),
                'speakingPrompts' => fn($q) => $q->orderBy('part_number'),
            ])
            ->firstOrFail();

        return Inertia::render('Exam/Attempt', [
            'attempt'  => $attempt,
            'test'     => $test,
            'duration' => $test->duration_minutes * 60,
        ]);
    }

    public function submit(Request $request, TestAttempt $attempt)
    {
        abort_if($attempt->user_id !== $request->user()->id, 403);

        if ($attempt->status !== 'in_progress') {
            return back()->withErrors(['attempt' => 'This attempt is already submitted.']);
        }

        $data = $request->validate([
            'answers'       => 'nullable|array',
            'writing_texts' => 'nullable|array',
            'timings'       => 'nullable|array',
            'timed_out'     => 'nullable|boolean',
        ]);

        $questions = $attempt->test->questions()->get()->keyBy('id');

        $responses = [];
        foreach (($data['answers'] ?? []) as $questionId => $answer) {
            $question = $questions->get($questionId);
            if (!$question) continue;

            $isCorrect = strtolower(trim($answer)) === strtolower(trim($question->correct_answer));

            $responses[] = [
                'test_attempt_id'    => $attempt->id,
                'question_id'        => $questionId,
                'user_answer'        => $answer,
                'is_correct'         => $isCorrect,
                'time_spent_seconds' => $data['timings'][$questionId] ?? null,
                'flagged_for_review' => false,
                'error_tag'          => null,
            ];
        }

        // Bulk insert responses (one query instead of N)
        if ($responses) {
            TestResponse::insert($responses);
        }

        $status = $request->boolean('timed_out') ? 'timed_out' : 'completed';

        $attempt->update([
            'status'             => $status,
            'submitted_at'       => now(),
            'time_taken_seconds' => now()->diffInSeconds($attempt->started_at),
            'writing_texts'      => !empty($data['writing_texts']) ? $data['writing_texts'] : null,
        ]);

        // Calculate and store bands
        app(BandCalculatorService::class)->calculate($attempt);

        // Refresh skill snapshots
        app(SkillSnapshotService::class)->refreshForUser($attempt->user_id);

        // Bust analytics cache for this user
        Cache::forget("analytics_{$attempt->user_id}");

        // If this was the diagnostic, auto-generate the study plan and complete onboarding
        if ($attempt->is_diagnostic) {
            $user = $request->user()->fresh();
            app(\App\Services\PlanGeneratorService::class)->generateFromDiagnostic($user, $attempt->fresh());
            $user->update(['onboarding_completed_at' => now()]);
        }

        return redirect()->route('test-attempts.review', $attempt);
    }

    public function review(Request $request, TestAttempt $attempt)
    {
        abort_if($attempt->user_id !== $request->user()->id, 403);

        $attempt->load([
            'test:id,title,module,type,duration_minutes',
            'sections',
            'responses' => fn($q) => $q->with('question.microSkills')->orderBy('question_id'),
        ]);

        return Inertia::render('Exam/Review', [
            'attempt' => $attempt,
        ]);
    }
}
