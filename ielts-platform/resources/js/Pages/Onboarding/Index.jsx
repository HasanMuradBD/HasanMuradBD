import { Head, router, useForm } from '@inertiajs/react';

export default function OnboardingIndex({ user, daysUntilExam, diagnosticTest }) {
    const { post, processing } = useForm();
    const name = user.name.split(' ')[0];

    const startDiagnostic = () => {
        router.post(route('test-attempts.start'), {
            test_id: diagnosticTest.id,
        });
    };

    const skipDiagnostic = () => post(route('onboarding.skip'));

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 flex items-center justify-center p-4">
            <Head title="Welcome — Let's Build Your Plan" />

            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">🎯</div>
                    <h1 className="text-3xl font-bold text-white">Welcome, {name}.</h1>
                    <p className="text-indigo-200 mt-2 text-lg">
                        Your exam is in <span className="font-bold text-white">{daysUntilExam} days</span>.
                        Your target is <span className="font-bold text-white">Band {user.target_band}</span>.
                    </p>
                </div>

                {/* Plan cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Diagnostic option */}
                    <div className="bg-white rounded-2xl p-6 border-2 border-indigo-400 shadow-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">🔬</span>
                            <h2 className="text-lg font-bold text-gray-900">Start Diagnostic First</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            Take a 90-minute diagnostic test across all 4 modules. We'll use your
                            results to build a personalised plan that targets your exact weak points —
                            not a generic schedule.
                        </p>
                        <div className="bg-indigo-50 rounded-lg p-3 mb-4 text-xs space-y-1">
                            <p className="text-indigo-700 font-medium">What happens after:</p>
                            <p className="text-indigo-600">✓ Your baseline band score per module</p>
                            <p className="text-indigo-600">✓ Gap analysis vs. your target</p>
                            <p className="text-indigo-600">✓ Auto-generated {daysUntilExam}-day schedule</p>
                        </div>
                        <div className="text-xs text-gray-400 mb-4">
                            ⏱ {diagnosticTest?.duration_minutes} minutes &nbsp;·&nbsp; {diagnosticTest?.total_questions} questions
                        </div>
                        <button
                            onClick={startDiagnostic}
                            disabled={processing}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
                        >
                            Start Diagnostic Now →
                        </button>
                    </div>

                    {/* Skip option */}
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">📅</span>
                            <h2 className="text-lg font-bold text-white">Skip to Generic Plan</h2>
                        </div>
                        <p className="text-sm text-indigo-200 mb-4 leading-relaxed">
                            We'll generate a balanced study schedule based on your exam date and
                            target band. You can always take the diagnostic later from your dashboard.
                        </p>
                        <div className="bg-white/10 rounded-lg p-3 mb-4 text-xs space-y-1">
                            <p className="text-white/70 font-medium">What you'll miss:</p>
                            <p className="text-white/50">✗ No per-module gap analysis</p>
                            <p className="text-white/50">✗ Equal time on all modules (may be inefficient)</p>
                            <p className="text-white/50">✗ No baseline band score to track progress from</p>
                        </div>
                        <div className="text-xs text-indigo-300 mb-4">Recommended only if you have less than 5 days to exam</div>
                        <button
                            onClick={skipDiagnostic}
                            disabled={processing}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition border border-white/30 disabled:opacity-50"
                        >
                            Generate Generic Plan
                        </button>
                    </div>
                </div>

                <p className="text-center text-indigo-300 text-xs">
                    Your 7-day free trial is active. No payment required today.
                </p>
            </div>
        </div>
    );
}
