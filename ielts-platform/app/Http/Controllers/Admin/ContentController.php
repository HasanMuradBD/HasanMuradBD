<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyTip;
use App\Models\MicroSkill;
use App\Models\Question;
use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ContentController extends Controller
{
    // ── Create Test ────────────────────────────────────────────────────────────

    public function createTest(): \Inertia\Response
    {
        return Inertia::render('Admin/CreateTest', [
            'microSkills' => MicroSkill::orderBy('module')->orderBy('name')->get(['id', 'name', 'module', 'slug']),
        ]);
    }

    public function storeTest(Request $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validate([
            'title'               => 'required|string|max:255',
            'type'                => 'required|in:diagnostic,module_practice,full_mock,mini_drill',
            'module'              => 'required|in:reading,listening,writing,speaking,full',
            'academic_or_general' => 'required|in:academic,general',
            'duration_minutes'    => 'required|integer|min:1|max:300',
            'passage'             => 'nullable|string',
            'questions'           => 'nullable|array',
            'questions.*.question_type'  => 'required_with:questions|string',
            'questions.*.question_text'  => 'required_with:questions|string',
            'questions.*.correct_answer' => 'required_with:questions|string|max:500',
            'questions.*.difficulty'     => 'nullable|in:easy,medium,hard',
            'questions.*.section_number' => 'nullable|integer|min:1',
            'questions.*.micro_skill_ids'=> 'nullable|array',
        ]);

        $test = Test::create([
            'title'               => $data['title'],
            'type'                => $data['type'],
            'module'              => $data['module'],
            'academic_or_general' => $data['academic_or_general'],
            'duration_minutes'    => (int) $data['duration_minutes'],
            'total_questions'     => count($data['questions'] ?? []),
            'is_active'           => true,
        ]);

        foreach ($data['questions'] ?? [] as $i => $q) {
            $question = Question::create([
                'test_id'           => $test->id,
                'module'            => $data['module'],
                'section_number'    => (int) ($q['section_number'] ?? 1),
                'sequence'          => $i + 1,
                'question_type'     => $q['question_type'],
                'question_text'     => $q['question_text'],
                'passage_reference' => $data['passage'] ?? null,
                'correct_answer'    => $q['correct_answer'],
                'difficulty'        => $q['difficulty'] ?? 'medium',
            ]);

            if (!empty($q['micro_skill_ids'])) {
                $question->microSkills()->sync($q['micro_skill_ids']);
            }
        }

        // Keep total_questions accurate
        $test->update(['total_questions' => $test->questions()->count()]);

        return redirect()->route('admin.tests.show', $test)
            ->with('success', "Test "{$test->title}" created with {$test->total_questions} question(s).");
    }

    // ── Add Question to existing test ─────────────────────────────────────────

    public function addQuestion(Request $request, Test $test): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validate([
            'question_type'   => 'required|string',
            'question_text'   => 'required|string',
            'correct_answer'  => 'required|string|max:500',
            'difficulty'      => 'nullable|in:easy,medium,hard',
            'section_number'  => 'nullable|integer|min:1',
            'passage'         => 'nullable|string',
            'micro_skill_ids' => 'nullable|array',
        ]);

        $maxSeq = $test->questions()->max('sequence') ?? 0;

        $question = Question::create([
            'test_id'           => $test->id,
            'module'            => $test->module === 'full' ? 'reading' : $test->module,
            'section_number'    => (int) ($data['section_number'] ?? 1),
            'sequence'          => $maxSeq + 1,
            'question_type'     => $data['question_type'],
            'question_text'     => $data['question_text'],
            'passage_reference' => $data['passage'] ?? $test->questions()->whereNotNull('passage_reference')->value('passage_reference'),
            'correct_answer'    => $data['correct_answer'],
            'difficulty'        => $data['difficulty'] ?? 'medium',
        ]);

        if (!empty($data['micro_skill_ids'])) {
            $question->microSkills()->sync($data['micro_skill_ids']);
        }

        $test->update(['total_questions' => $test->questions()->count()]);

        return back()->with('success', "Question #{$question->sequence} added to "{$test->title}".");
    }

    // ── Daily Tips ────────────────────────────────────────────────────────────

    public function tipsIndex(): \Inertia\Response
    {
        $tips = DailyTip::orderByRaw('COALESCE(target_date, "9999-12-31") ASC')
            ->orderBy('is_fallback', 'asc')
            ->get();

        return Inertia::render('Admin/TipManager', ['tips' => $tips]);
    }

    public function storeTip(Request $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validate([
            'type'        => 'required|in:vocabulary,grammar,exam_tip',
            'title'       => 'required|string|max:255',
            'content'     => 'required|string',
            'example'     => 'nullable|string|max:500',
            'target_date' => 'nullable|date|unique:daily_tips,target_date',
            'is_fallback' => 'nullable|boolean',
        ]);

        $tip = DailyTip::create([
            'type'        => $data['type'],
            'title'       => $data['title'],
            'content'     => $data['content'],
            'example'     => $data['example'] ?? null,
            'target_date' => !empty($data['target_date']) ? Carbon::parse($data['target_date'])->toDateString() : null,
            'is_fallback' => (bool) ($data['is_fallback'] ?? false),
        ]);

        return back()->with('success', "Tip "{$tip->title}" saved" . ($tip->target_date ? " for {$tip->target_date}." : " as evergreen fallback."));
    }

    public function deleteTip(DailyTip $tip): \Illuminate\Http\RedirectResponse
    {
        $title = $tip->title;
        $tip->delete();
        return back()->with('success', "Tip "{$title}" deleted.");
    }
}
