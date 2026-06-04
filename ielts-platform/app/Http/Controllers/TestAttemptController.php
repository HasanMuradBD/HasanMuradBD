<?php
namespace App\Http\Controllers;

use App\Models\DailyTask;
use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\TestResponse;
use App\Services\BandCalculatorService;
use App\Services\SkillSnapshotService;
use Illuminate\Http\Request;
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

        $test = $attempt->test()->with('questions')->first();

        return Inertia::render('Exam/Attempt', [
            'attempt'  => $attempt,
            'test'     => $test,
            'duration' => $test->duration_minutes * 60,
        ]);
    }

    public function submit(Request $request, TestAttempt $attempt)
    {
        $this->authorize('update', $attempt);

        if ($attempt->status !== 'in_progress') {
            return back()->withErrors(['attempt' => 'This attempt is already submitted.']);
        }

        $data = $request->validate([
            'answers'    => 'required|array',
            'timings'    => 'nullable|array',
            'timed_out'  => 'nullable|boolean',
        ]);

        // Persist each response
        foreach ($data['answers'] as $questionId => $answer) {
            $question = $attempt->test->questions->find($questionId);
            if (!$question) continue;

            $isCorrect = strtolower(trim($answer)) === strtolower(trim($question->correct_answer));

            TestResponse::create([
                'test_attempt_id'    => $attempt->id,
                'question_id'        => $questionId,
                'user_answer'        => $answer,
                'is_correct'         => $isCorrect,
                'time_spent_seconds' => $data['timings'][$questionId] ?? null,
            ]);
        }

        $status = $request->boolean('timed_out') ? 'timed_out' : 'completed';

        $attempt->update([
            'status'           => $status,
            'submitted_at'     => now(),
            'time_taken_seconds' => now()->diffInSeconds($attempt->started_at),
        ]);

        // Calculate and store bands
        app(BandCalculatorService::class)->calculate($attempt);

        // Refresh skill snapshots asynchronously
        app(SkillSnapshotService::class)->refreshForUser($attempt->user_id);

        return redirect()->route('test-attempts.review', $attempt);
    }

    public function review(Request $request, TestAttempt $attempt)
    {
        $this->authorize('view', $attempt);

        $attempt->load(['test', 'sections', 'responses.question.microSkills']);

        return Inertia::render('Exam/Review', [
            'attempt' => $attempt,
        ]);
    }
}
