import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';

/* ── Module definitions ──────────────────────────────────────────────────── */
const MODULES = [
    {
        key:   'reading',
        name:  'Reading',
        icon:  '📖',
        desc:  'Master Skimming, Scanning, and Academic Passages',
        cta:   'Start Reading Test',
        accent: {
            ring:   'hover:border-blue-300',
            iconBg: 'bg-blue-50',
            badge:  'bg-blue-50 text-blue-700',
            bar:    'from-blue-500 to-blue-400',
            btn:    'bg-blue-600 hover:bg-blue-700',
        },
    },
    {
        key:   'listening',
        name:  'Listening',
        icon:  '🎧',
        desc:  'Train for sections 1–4 with real audio simulation',
        cta:   'Start Listening Test',
        accent: {
            ring:   'hover:border-violet-300',
            iconBg: 'bg-violet-50',
            badge:  'bg-violet-50 text-violet-700',
            bar:    'from-violet-500 to-violet-400',
            btn:    'bg-violet-600 hover:bg-violet-700',
        },
    },
    {
        key:   'writing',
        name:  'Writing',
        icon:  '✏️',
        desc:  'Practice Task 1 and Task 2 with a live word counter',
        cta:   'Start Writing Test',
        accent: {
            ring:   'hover:border-amber-300',
            iconBg: 'bg-amber-50',
            badge:  'bg-amber-50 text-amber-700',
            bar:    'from-amber-500 to-amber-400',
            btn:    'bg-amber-500 hover:bg-amber-600',
        },
    },
    {
        key:   'speaking',
        name:  'Speaking',
        icon:  '🎤',
        desc:  'Simulate real examiner interview prompts and record responses',
        cta:   'Start Speaking Test',
        accent: {
            ring:   'hover:border-rose-300',
            iconBg: 'bg-rose-50',
            badge:  'bg-rose-50 text-rose-700',
            bar:    'from-rose-500 to-rose-400',
            btn:    'bg-rose-600 hover:bg-rose-700',
        },
    },
];

/* ── Single module card ──────────────────────────────────────────────────── */
function ModuleCard({ module, data }) {
    const a = module.accent;
    const count     = data?.count ?? 0;
    const firstTest = data?.first_test ?? null;
    const available = count > 0 && firstTest;

    const { post, processing } = useForm({ test_id: firstTest?.id });

    const start = (e) => {
        e.preventDefault();
        if (!available) return;
        post(route('test-attempts.start'));
    };

    return (
        <div className={`group relative bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 ${a.ring} hover:shadow-lg flex flex-col`}>
            {/* Top accent bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${a.bar}`} />

            <div className="p-6 flex flex-col flex-1">
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${a.iconBg} flex items-center justify-center text-3xl`}>
                        {module.icon}
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${a.badge}`}>
                        {count > 0
                            ? `${count} test${count !== 1 ? 's' : ''} available`
                            : 'Coming soon'}
                    </span>
                </div>

                {/* Title + description */}
                <h2 className="text-lg font-bold text-gray-900 mb-1">{module.name}</h2>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{module.desc}</p>

                {/* Meta line */}
                {available && (
                    <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
                        <span>⏱</span>
                        Next: <span className="font-medium text-gray-600 truncate">{firstTest.title}</span>
                        <span className="text-gray-300">·</span>
                        {firstTest.duration_minutes} min
                    </p>
                )}

                {/* CTA */}
                <button
                    onClick={start}
                    disabled={!available || processing}
                    className={`mt-5 w-full text-white text-sm font-semibold py-3 rounded-xl transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed ${available ? a.btn : ''}`}
                >
                    {processing ? 'Starting…' : available ? module.cta : 'No tests yet'}
                </button>
            </div>
        </div>
    );
}

/* ── Hub page ────────────────────────────────────────────────────────────── */
export default function PracticeTests({ modules = {} }) {
    const totalTests = MODULES.reduce((sum, m) => sum + (modules[m.key]?.count ?? 0), 0);

    return (
        <AppLayout>
            <Head title="Practice Tests" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Practice Tests</h1>
                    <p className="text-gray-500 mt-2">
                        Choose a module to begin a focused, exam-accurate practice session.
                        {totalTests > 0 && (
                            <span className="text-gray-400"> &nbsp;· {totalTests} tests ready across all modules</span>
                        )}
                    </p>
                </div>

                {/* Module grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {MODULES.map((module) => (
                        <ModuleCard key={module.key} module={module} data={modules[module.key]} />
                    ))}
                </div>

                {/* Empty-state hint */}
                {totalTests === 0 && (
                    <div className="mt-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl py-10">
                        <p className="text-4xl mb-2">📭</p>
                        <p className="text-gray-600 font-medium">No active tests yet.</p>
                        <p className="text-sm text-gray-400 mt-1">
                            New practice tests are added regularly — check back soon.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
