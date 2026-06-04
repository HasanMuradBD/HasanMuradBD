import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';

const moduleColor = {
    reading:   'indigo',
    listening: 'green',
    writing:   'amber',
    speaking:  'purple',
};

function BandBadge({ band, module }) {
    const c = moduleColor[module] ?? 'gray';
    const colors = {
        indigo: 'bg-indigo-900/40 text-indigo-300 border-indigo-700',
        green:  'bg-green-900/40 text-green-300 border-green-700',
        amber:  'bg-amber-900/40 text-amber-300 border-amber-700',
        purple: 'bg-purple-900/40 text-purple-300 border-purple-700',
        gray:   'bg-gray-800 text-gray-300 border-gray-600',
    };
    return (
        <div className={`rounded-xl border p-4 text-center ${colors[c]}`}>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">{module}</p>
            <p className="text-4xl font-bold">{band ?? '—'}</p>
            <p className="text-xs opacity-60 mt-1">Band score</p>
        </div>
    );
}

function ResponseRow({ response }) {
    const isCorrect = response.is_correct;
    const isNull = isCorrect === null;

    return (
        <div className={`p-4 rounded-lg border mb-2 ${
            isNull ? 'border-gray-700 bg-gray-800' :
            isCorrect ? 'border-green-700 bg-green-900/20' : 'border-red-700 bg-red-900/20'
        }`}>
            <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 font-bold text-sm ${
                    isNull ? 'text-gray-500' : isCorrect ? 'text-green-400' : 'text-red-400'
                }`}>
                    {isNull ? '—' : isCorrect ? '✓' : '✗'} Q{response.question?.sequence}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 mb-2 leading-relaxed">{response.question?.question_text}</p>
                    <div className="flex flex-wrap gap-4 text-xs">
                        <span className="text-gray-400">
                            Your answer: <span className="font-medium text-white">{response.user_answer || '(blank)'}</span>
                        </span>
                        {!isNull && !isCorrect && (
                            <span className="text-gray-400">
                                Correct: <span className="font-medium text-green-400">{response.question?.correct_answer}</span>
                            </span>
                        )}
                    </div>
                    {response.question?.answer_explanation && !isNull && !isCorrect && (
                        <p className="text-xs text-gray-500 mt-2 italic">{response.question.answer_explanation}</p>
                    )}
                    {response.question?.micro_skills?.length > 0 && (
                        <div className="flex gap-1 mt-2">
                            {response.question.micro_skills.map(s => (
                                <span key={s.id} className="text-xs bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-700">
                                    {s.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Review({ attempt }) {
    const responses = attempt.responses ?? [];
    const sections  = attempt.sections ?? [];

    const correct = responses.filter(r => r.is_correct).length;
    const total   = responses.filter(r => r.is_correct !== null).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : null;

    return (
        <AppLayout>
            <Head title="Test Results" />
            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {attempt.is_diagnostic ? '🔬 Diagnostic Results' : '📋 Test Results'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {attempt.test?.title} &nbsp;·&nbsp;
                        {attempt.time_taken_seconds ? `${Math.round(attempt.time_taken_seconds / 60)} min` : '—'}
                        {attempt.status === 'timed_out' && <span className="ml-2 text-amber-600 font-medium">⏱ Timed out</span>}
                    </p>
                </div>

                {/* Overall band */}
                {attempt.overall_band && (
                    <div className="bg-indigo-600 rounded-2xl p-6 text-white text-center mb-6">
                        <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-1">Overall Band</p>
                        <p className="text-7xl font-bold">{attempt.overall_band}</p>
                        {accuracy !== null && (
                            <p className="text-indigo-200 text-sm mt-2">{correct}/{total} correct ({accuracy}%)</p>
                        )}
                    </div>
                )}

                {/* Per-module bands */}
                {sections.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {sections.map(s => (
                            <BandBadge key={s.id} band={s.band_score} module={s.module} />
                        ))}
                    </div>
                )}

                {/* Diagnostic next step */}
                {attempt.is_diagnostic && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
                        <h3 className="text-green-800 font-bold mb-2">✅ Your 30-day study plan has been generated!</h3>
                        <p className="text-green-700 text-sm">
                            Based on your diagnostic results, we've built a personalised schedule targeting your weakest modules first.
                        </p>
                        <Link href={route('dashboard')} className="inline-block mt-3 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
                            See My Study Plan →
                        </Link>
                    </div>
                )}

                {/* Answer review */}
                {responses.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Answer Review</h2>
                        {responses
                            .sort((a, b) => (a.question?.sequence ?? 0) - (b.question?.sequence ?? 0))
                            .map(r => <ResponseRow key={r.id} response={r} />)
                        }
                    </div>
                )}

                <div className="mt-8 flex gap-4">
                    <Link href={route('dashboard')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition">
                        Go to Dashboard
                    </Link>
                    <Link href={route('analytics.index')} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition">
                        View Analytics
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
