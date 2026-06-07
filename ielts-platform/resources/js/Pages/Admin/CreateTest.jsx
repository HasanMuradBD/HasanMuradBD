import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

const QUESTION_TYPES = [
    'true_false_not_given', 'yes_no_not_given', 'multiple_choice',
    'matching_headings', 'matching_information', 'sentence_completion',
    'summary_completion', 'short_answer', 'note_completion',
    'form_completion', 'diagram_labelling', 'map_labelling',
];

const EMPTY_QUESTION = {
    question_type: 'true_false_not_given',
    question_text: '',
    correct_answer: '',
    difficulty: 'medium',
    section_number: '1',
    micro_skill_ids: [],
};

function FlashBanner({ flash }) {
    if (!flash?.success) return null;
    return (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
            ✓ {flash.success}
        </div>
    );
}

function Field({ label, required, children, hint }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    );
}

function QuestionRow({ q, index, microSkills, onChange, onRemove }) {
    const update = (key, val) => onChange(index, { ...q, [key]: val });

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 relative">
            <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">Q{index + 1}</span>
                <button type="button" onClick={() => onRemove(index)}
                    className="text-gray-400 hover:text-red-500 transition text-lg leading-none">×</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Question Type</label>
                    <select value={q.question_type} onChange={e => update('question_type', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        {QUESTION_TYPES.map(t => (
                            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Difficulty</label>
                        <select value={q.difficulty} onChange={e => update('difficulty', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Section #</label>
                        <input type="number" min="1" max="4" value={q.section_number}
                            onChange={e => update('section_number', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Question Text <span className="text-red-500">*</span></label>
                <textarea rows={3} value={q.question_text}
                    onChange={e => update('question_text', e.target.value)}
                    placeholder="Enter the full question, including any options or heading lists..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y" />
            </div>

            <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Correct Answer <span className="text-red-500">*</span></label>
                <input type="text" value={q.correct_answer}
                    onChange={e => update('correct_answer', e.target.value)}
                    placeholder="e.g. TRUE, ii, B, growth hormone"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            {microSkills.length > 0 && (
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Micro-Skills (optional)</label>
                    <div className="flex flex-wrap gap-2">
                        {microSkills.map(s => {
                            const selected = q.micro_skill_ids.includes(s.id);
                            return (
                                <button key={s.id} type="button"
                                    onClick={() => update('micro_skill_ids',
                                        selected ? q.micro_skill_ids.filter(id => id !== s.id) : [...q.micro_skill_ids, s.id]
                                    )}
                                    className={`text-xs px-2.5 py-1 rounded-full border transition ${
                                        selected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                                    }`}>
                                    {s.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CreateTest({ microSkills, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        type: 'module_practice',
        module: 'reading',
        academic_or_general: 'academic',
        duration_minutes: '20',
        passage: '',
        questions: [{ ...EMPTY_QUESTION }],
    });

    const addQuestion = () => setData('questions', [...data.questions, { ...EMPTY_QUESTION }]);

    const updateQuestion = (i, updated) => {
        const qs = [...data.questions];
        qs[i] = updated;
        setData('questions', qs);
    };

    const removeQuestion = (i) => setData('questions', data.questions.filter((_, idx) => idx !== i));

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.content.store-test'));
    };

    const needsPassage = ['reading', 'listening'].includes(data.module);

    return (
        <AdminLayout title="Create New Test">
            <Head title="Create Test — Admin" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FlashBanner flash={flash} />

                <form onSubmit={submit} className="space-y-8">
                    {/* Test metadata */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                        <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">Test Details</h2>

                        <Field label="Title" required>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                placeholder="e.g. Reading Practice Test 2 — Urban Migration"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </Field>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Field label="Type" required>
                                <select value={data.type} onChange={e => setData('type', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="module_practice">Module Practice</option>
                                    <option value="mini_drill">Mini Drill</option>
                                    <option value="full_mock">Full Mock</option>
                                    <option value="diagnostic">Diagnostic</option>
                                </select>
                            </Field>

                            <Field label="Module" required>
                                <select value={data.module} onChange={e => setData('module', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="reading">Reading</option>
                                    <option value="listening">Listening</option>
                                    <option value="writing">Writing</option>
                                    <option value="speaking">Speaking</option>
                                    <option value="full">Full (all modules)</option>
                                </select>
                            </Field>

                            <Field label="Academic / General">
                                <select value={data.academic_or_general} onChange={e => setData('academic_or_general', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="academic">Academic</option>
                                    <option value="general">General Training</option>
                                </select>
                            </Field>

                            <Field label="Duration (mins)" required>
                                <input type="number" min="1" max="300" value={data.duration_minutes}
                                    onChange={e => setData('duration_minutes', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </Field>
                        </div>
                    </div>

                    {/* Passage */}
                    {needsPassage && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-5">
                                Reading Passage
                                <span className="text-xs font-normal text-gray-400 ml-2">(shared across all questions in this test)</span>
                            </h2>
                            <textarea rows={14} value={data.passage}
                                onChange={e => setData('passage', e.target.value)}
                                placeholder="Paste the full passage text here. Use paragraph labels (A., B., etc.) on their own lines for matching-headings questions."
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-y" />
                        </div>
                    )}

                    {/* Questions */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
                            <h2 className="text-base font-semibold text-gray-900">
                                Questions
                                <span className="ml-2 text-xs font-normal text-gray-400">({data.questions.length} added)</span>
                            </h2>
                            <button type="button" onClick={addQuestion}
                                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition">
                                + Add Question
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.questions.map((q, i) => (
                                <QuestionRow key={i} q={q} index={i}
                                    microSkills={microSkills.filter(s => s.module === data.module || data.module === 'full')}
                                    onChange={updateQuestion}
                                    onRemove={removeQuestion} />
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-4">
                        <button type="button" onClick={() => window.history.back()}
                            className="text-sm text-gray-500 hover:text-gray-800 transition">Cancel</button>
                        <button type="submit" disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition disabled:opacity-50">
                            {processing ? 'Creating...' : `Create Test with ${data.questions.length} Question${data.questions.length !== 1 ? 's' : ''}`}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
