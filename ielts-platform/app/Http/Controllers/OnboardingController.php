<?php
namespace App\Http\Controllers;

use App\Models\Test;
use App\Services\PlanGeneratorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        // Already onboarded → redirect to dashboard
        if ($user->onboarding_completed_at) {
            return redirect()->route('dashboard');
        }

        $diagnostic = Test::where('type', 'diagnostic')->where('is_active', true)->first();

        return Inertia::render('Onboarding/Index', [
            'user'           => $user->only('name', 'exam_date', 'target_band', 'trial_ends_at'),
            'daysUntilExam'  => $user->daysUntilExam(),
            'diagnosticTest' => $diagnostic?->only('id', 'title', 'duration_minutes', 'total_questions'),
        ]);
    }

    public function skip(Request $request)
    {
        $user = $request->user();
        $user->update(['onboarding_completed_at' => now()]);

        app(PlanGeneratorService::class)->generateGeneric($user->fresh());

        return redirect()->route('dashboard');
    }
}
