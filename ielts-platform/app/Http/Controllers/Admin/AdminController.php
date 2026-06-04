<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MicroSkill;
use App\Models\Question;
use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard(): \Inertia\Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users'        => User::count(),
                'active_plans' => \App\Models\StudyPlan::where('status', 'active')->count(),
                'attempts'     => TestAttempt::where('status', 'completed')->count(),
                'tests'        => Test::where('is_active', true)->count(),
            ],
            'recentUsers' => User::latest()->limit(10)->get(['id', 'name', 'email', 'created_at', 'trial_ends_at', 'onboarding_completed_at']),
        ]);
    }

    public function tests(): \Inertia\Response
    {
        $tests = Test::withCount('questions')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Admin/Tests', ['tests' => $tests]);
    }

    public function testShow(Test $test): \Inertia\Response
    {
        $test->load(['questions.microSkills', 'writingPrompts', 'speakingPrompts']);

        return Inertia::render('Admin/TestShow', ['test' => $test]);
    }

    public function questions(): \Inertia\Response
    {
        $questions = Question::with(['test', 'microSkills'])
            ->orderByDesc('id')
            ->paginate(50);

        return Inertia::render('Admin/Questions', ['questions' => $questions]);
    }

    public function microSkills(): \Inertia\Response
    {
        $skills = MicroSkill::with('children')
            ->whereNull('parent_skill_id')
            ->get();

        return Inertia::render('Admin/MicroSkills', ['skills' => $skills]);
    }

    public function users(): \Inertia\Response
    {
        $users = User::withCount(['testAttempts', 'studyPlans'])
            ->orderByDesc('created_at')
            ->paginate(50);

        return Inertia::render('Admin/Users', ['users' => $users]);
    }

    public function toggleTest(Request $request, Test $test): \Illuminate\Http\RedirectResponse
    {
        $test->update(['is_active' => !$test->is_active]);
        return back()->with('success', "Test {$test->title} " . ($test->is_active ? 'activated' : 'deactivated') . '.');
    }
}
