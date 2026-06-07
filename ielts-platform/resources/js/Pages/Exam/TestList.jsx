import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';

const MODULE_META = {
    reading:   { label: 'Reading',   icon: '📖', color: 'blue',   desc: 'Passages + comprehension questions' },
    listening: { label: 'Listening', icon: '🎧', color: 'violet', desc: 'Audio sections with note-taking' },
    writing:   { label: 'Writing',   icon: '✏️',  color: 'amber',  desc: 'Task 1 + Task 2 timed writing' },
    speaking:  { label: 'Speaking',  icon: '🎤', color: 'rose',   desc: 'Parts 1–3 structured speaking' },
    full:      { label: 'Full Mock', icon: '📋', color: 'indigo', desc: 'All 4 modules — full exam simulation' },
};

const TYPE_LABELS = {
    module_practice: 'Module Practice',
    mini_drill:      'Mini Drill',
    full_mock:       'Full Mock',
    diagnostic:      'Diagnostic',
};

const COLOR_CLASSES = {
    blue:   { badge: 'bg-blue-50 text-blue-700',   border: 'border-blue-200',   btn: 'bg-blue-600 hover:bg-blue-700' },
    violet: { badge: 'bg-violet-50 text-violet-700', border: 'border-violet-200', btn: 'bg-violet-600 hover:bg-violet-700' },
    amber:  { badge: 'bg-amber-50 text-amber-700', border: 'border-amber-200', btn: 'bg-amber-500 hover:bg-amber-600' },
    rose:   { badge: 'bg-rose-50 text-rose-700',   border: 'border-rose-200',   btn: 'bg-rose-600 hover:bg-rose-700' },
    indigo: { badge: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200', btn: 'bg-indigo-600 hover:bg-indigo-700' },
};

function TestCard({ test }) {
    const meta  = MODULE_META[test.module] ?? MODULE_META.reading;
    const color = COLOR_CLASSES[meta.color] ?? COLOR_CLASSES.indigo;
    const { post, processing } = useForm({ test_id: test.id });

    const start = (e) => {
        e.preventDefault();
        post(route('test-attempts.start'));
    };

    return (
        <div className={`bg-white border rounded-xl p-5 flex flex-col gap-3 hover:shadow-sm transition ${color.border}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{meta.icon}</span>
                    <div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.badge}`}>
                            {meta.label}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">{TYPE_LABELS[test.type] ?? test.type}</span>
                    </div>
                </div>
                <span className="text-xs text-gray-400">{test.duration_minutes} min</span>
            </div>

            <div>
                <p className="text-sm font-semibold text-gray-900 leading-snug">{test.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">{test.academic_or_general}</p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-400">
                    {test.questions_count > 0
                        ? `${test.questions_count} question${test.questions_count !== 1 ? 's' : ''}`
                        : 'Writing / Speaking'}
                </span>
                <button
                    onClick={start}
                    disabled={processing}
                    className={`text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition disabled:opacity-50 ${color.btn}`}
                >
                    {processing ? 'Starting…' : 'Start Test'}
                </button>
            </div>
        </div>
    );
}

const ALL_MODULES = ['reading', 'listening', 'writing', 'speaking', 'full'];

export default function TestList({ tests }) {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? tests : tests.filter(t => t.module === filter);

    const grouped = ALL_MODULES.reduce((acc, m) => {
        const list = filtered.filter(t => t.module === m);
        if (list.length) acc[m] = list;
        return acc;
    }, {});

    return (
        <AppLayout>
            <Head title="Practice Tests" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Practice Tests</h1>
                        <p className="text-sm text-gray-500 mt-1">{tests.length} test{tests.length !== 1 ? 's' : ''} available</p>
                    </div>

                    {/* Module filter tabs */}
                    <div className="flex gap-1.5 flex-wrap">
                        {['all', ...ALL_MODULES].map(m => (
                            <button
                                key={m}
                                onClick={() => setFilter(m)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                                    filter === m
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
                                }`}
                            >
                                {m === 'all' ? 'All' : MODULE_META[m]?.icon + ' ' + MODULE_META[m]?.label}
                            </button>
                        ))}
                    </div>
                </div>

                {Object.keys(grouped).length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-3">📭</p>
                        <p className="text-gray-500 font-medium">No tests available yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Check back soon — new tests are added regularly.</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([module, list]) => {
                        const meta = MODULE_META[module];
                        return (
                            <section key={module}>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-lg">{meta.icon}</span>
                                    <h2 className="text-base font-semibold text-gray-800">{meta.label}</h2>
                                    <span className="text-xs text-gray-400">— {meta.desc}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {list.map(test => <TestCard key={test.id} test={test} />)}
                                </div>
                            </section>
                        );
                    })
                )}
            </div>
        </AppLayout>
    );
}
