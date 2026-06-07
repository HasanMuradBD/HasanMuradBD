import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

const TYPE_COLORS = {
    vocabulary: 'bg-violet-100 text-violet-700',
    grammar:    'bg-emerald-100 text-emerald-700',
    exam_tip:   'bg-amber-100 text-amber-700',
};

const TYPE_LABELS = {
    vocabulary: 'Vocabulary',
    grammar:    'Grammar',
    exam_tip:   'Exam Tip',
};

function FlashBanner({ flash }) {
    if (!flash?.success) return null;
    return (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
            ✓ {flash.success}
        </div>
    );
}

function TipRow({ tip, onDelete }) {
    const today = new Date().toISOString().split('T')[0];
    const isToday  = tip.target_date === today;
    const isPast   = tip.target_date && tip.target_date < today;
    const isFuture = tip.target_date && tip.target_date > today;

    return (
        <tr className={`border-b border-gray-50 ${isToday ? 'bg-indigo-50' : ''}`}>
            <td className="py-3 pr-4 w-32">
                {tip.target_date ? (
                    <span className={`text-xs font-mono ${isToday ? 'text-indigo-700 font-bold' : isPast ? 'text-gray-400' : 'text-gray-700'}`}>
                        {isToday ? '📅 Today' : tip.target_date}
                    </span>
                ) : (
                    <span className="text-xs text-gray-400 italic">evergreen</span>
                )}
            </td>
            <td className="py-3 pr-4 w-28">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[tip.type]}`}>
                    {TYPE_LABELS[tip.type]}
                </span>
            </td>
            <td className="py-3 pr-4">
                <p className="text-sm font-semibold text-gray-900">{tip.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{tip.content}</p>
            </td>
            <td className="py-3 w-20 text-right">
                <button onClick={() => onDelete(tip.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition px-2 py-1 rounded hover:bg-red-50">
                    Delete
                </button>
            </td>
        </tr>
    );
}

export default function TipManager({ tips, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type:        'vocabulary',
        title:       '',
        content:     '',
        example:     '',
        target_date: '',
        is_fallback: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.tips.store'), {
            onSuccess: () => reset(),
        });
    };

    const deleteTip = (id) => {
        if (!confirm('Delete this tip?')) return;
        router.delete(route('admin.tips.delete', id));
    };

    const dated    = tips.filter(t => t.target_date && !t.is_fallback).sort((a, b) => a.target_date.localeCompare(b.target_date));
    const fallback = tips.filter(t => t.is_fallback || !t.target_date);

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    return (
        <AdminLayout title="Daily Tips Manager">
            <Head title="Tips Manager — Admin" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <FlashBanner flash={flash} />

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left: Add tip form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-20">
                            <h2 className="text-base font-semibold text-gray-900 mb-5">Schedule a New Tip</h2>
                            <form onSubmit={submit} className="space-y-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
                                    <select value={data.type} onChange={e => setData('type', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="vocabulary">📚 Word of the Day</option>
                                        <option value="grammar">✏️ Grammar Tip</option>
                                        <option value="exam_tip">🎯 Exam Strategy</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                        placeholder={data.type === 'vocabulary' ? 'e.g. Ubiquitous' : 'e.g. Use inversion for emphasis'}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content <span className="text-red-500">*</span></label>
                                    <textarea rows={4} value={data.content} onChange={e => setData('content', e.target.value)}
                                        placeholder="Explanation, definition, or tip..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                                </div>

                                {data.type === 'vocabulary' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Example sentence</label>
                                        <input type="text" value={data.example} onChange={e => setData('example', e.target.value)}
                                            placeholder="e.g. Smartphones have become ubiquitous..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                                    <input type="date" value={data.target_date} min={today}
                                        onChange={e => setData('target_date', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    {errors.target_date && <p className="text-red-500 text-xs mt-1">{errors.target_date}</p>}
                                </div>

                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" checked={data.is_fallback}
                                        onChange={e => setData('is_fallback', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600" />
                                    Save as evergreen fallback
                                    <span className="text-xs text-gray-400">(shown when no tip is scheduled)</span>
                                </label>

                                <button type="submit" disabled={processing}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
                                    {processing ? 'Saving...' : 'Schedule Tip'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Tip list */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Scheduled tips */}
                        <div className="bg-white rounded-2xl border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-gray-900">Scheduled Tips</h2>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{dated.length} total</span>
                            </div>
                            <div className="px-6 py-2">
                                {dated.length === 0 ? (
                                    <p className="text-sm text-gray-400 py-6 text-center">No scheduled tips yet.</p>
                                ) : (
                                    <table className="w-full">
                                        <tbody>
                                            {dated.map(t => <TipRow key={t.id} tip={t} onDelete={deleteTip} />)}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Fallback tips */}
                        <div className="bg-white rounded-2xl border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-gray-900">Evergreen Fallbacks</h2>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{fallback.length} total</span>
                            </div>
                            <div className="px-6 py-2">
                                {fallback.length === 0 ? (
                                    <p className="text-sm text-gray-400 py-6 text-center">No fallback tips yet.</p>
                                ) : (
                                    <table className="w-full">
                                        <tbody>
                                            {fallback.map(t => <TipRow key={t.id} tip={t} onDelete={deleteTip} />)}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
