import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

const QUESTION_TYPES = [
    'true_false_not_given', 'yes_no_not_given', 'multiple_choice',
    'matching_headings', 'matching_information', 'sentence_completion',
    'summary_completion', 'short_answer', 'note_completion',
    'form_completion', 'diagram_labelling', 'map_labelling',
];

function QBadge({ type }) {
    return <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{type.replace(/_/g, ' ')}</span>;
}

function DiffBadge({ difficulty }) {
    const colors = { easy: 'text-emerald-600 bg-emerald-50', medium: 'text-amber-600 bg-amber-50', hard: 'text-red-600 bg-red-50' };
    return <span className={`text-xs px-2 py-0.5 rounded-full ${colors[difficulty] ?? 'bg-gray-50 text-gray-500'}`}>{difficulty}</span>;
}

function AddQuestionPanel({ test }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        question_type: 'true_false_not_given',
        question_text: '',
        correct_answer: '',
        difficulty: 'medium',
        section_number: '1',
        passage: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.tests.add-question', test.id), {
            onSuccess: () => { reset(); setOpen(false); },
        });
    };

    if (!open) {
        return (
            <button onClick={() => setOpen(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 border border-indigo-200 hover:border-indigo-400 px-4 py-2 rounded-lg transition">
                + Add Question
            </button>
        );
    }

    return (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-indigo-900">Add Question to "{test.title}"</h3>
                <button onClick={() => setOpen(false)} className="text-indigo-400 hover:text-indigo-700 text-xl leading-none">×</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                        <select value={data.question_type} onChange={e => setData('question_type', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                            {QUESTION_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Difficulty</label>
                        <select value={data.difficulty} onChange={e => setData('difficulty', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Section #</label>
                        <input type="number" min="1" max="4" value={data.section_number}
                            onChange={e => setData('section_number', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Question Text <span className="text-red-500">*</span></label>
                    <textarea rows={4} value={data.question_text} onChange={e => setData('question_text', e.target.value)}
                        placeholder="Full question text..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
                    {errors.question_text && <p className="text-red-500 text-xs mt-1">{errors.question_text}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Correct Answer <span className="text-red-500">*</span></label>
                    <input type="text" value={data.correct_answer} onChange={e => setData('correct_answer', e.target.value)}
                        placeholder="e.g. TRUE, iv, B, growth hormone"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    {errors.correct_answer && <p className="text-red-500 text-xs mt-1">{errors.correct_answer}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Passage Override
                        <span className="text-gray-400 font-normal ml-1">(leave blank to reuse existing passage)</span>
                    </label>
                    <textarea rows={3} value={data.passage} onChange={e => setData('passage', e.target.value)}
                        placeholder="Paste new/additional passage text only if different from existing..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50">
                        {processing ? 'Adding...' : 'Add Question'}
                    </button>
                    <button type="button" onClick={() => setOpen(false)}
                        className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function AdminTestShow({ test, flash }) {
    return (
        <AdminLayout title={test.title}>
            <Head title={`${test.title} — Admin`} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
                        ✓ {flash.success}
                    </div>
                )}

                {/* Meta */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500 capitalize">{test.module}</span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-500 capitalize">{test.type.replace(/_/g,' ')}</span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-500">{test.duration_minutes} min</span>
                        </div>
                        <p className="text-sm text-gray-600">{test.questions.length} questions · {test.writing_prompts?.length ?? 0} writing prompts · {test.speaking_prompts?.length ?? 0} speaking prompts</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${test.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {test.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <Link href={route('admin.tests.toggle', test.id)} method="post" as="button"
                            className="text-xs text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 px-3 py-1.5 rounded-lg transition">
                            Toggle
                        </Link>
                    </div>
                </div>

                {/* Questions table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-700">Questions ({test.questions.length})</h2>
                        <AddQuestionPanel test={test} />
                    </div>
                    {test.questions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {['Q#', 'Type', 'Question (truncated)', 'Answer', 'Diff', 'Skills'].map(h => (
                                            <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-2">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {test.questions.map(q => (
                                        <tr key={q.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 text-gray-500 font-mono text-xs">{q.sequence}</td>
                                            <td className="px-4 py-2"><QBadge type={q.question_type} /></td>
                                            <td className="px-4 py-2 text-gray-700 max-w-xs truncate text-xs">{q.question_text.split('\n')[0]}</td>
                                            <td className="px-4 py-2 font-mono text-xs text-indigo-700">{q.correct_answer}</td>
                                            <td className="px-4 py-2"><DiffBadge difficulty={q.difficulty} /></td>
                                            <td className="px-4 py-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {q.micro_skills?.map(s => (
                                                        <span key={s.id} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{s.name}</span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-12">No questions yet. Add the first one above.</p>
                    )}
                </div>

                {/* Writing prompts */}
                {test.writing_prompts?.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">Writing Prompts</h2>
                        <div className="space-y-4">
                            {test.writing_prompts.map(p => (
                                <div key={p.id} className="border border-gray-100 rounded-lg p-4">
                                    <span className="text-xs font-bold text-indigo-600 uppercase">{p.task_number.replace('_', ' ')}</span>
                                    <p className="text-sm text-gray-700 mt-2">{p.prompt_text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
