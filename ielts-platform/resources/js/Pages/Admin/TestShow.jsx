import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';

function QBadge({ type }) {
    return (
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
            {type.replace(/_/g, ' ')}
        </span>
    );
}

function DiffBadge({ difficulty }) {
    const colors = { easy: 'text-emerald-600 bg-emerald-50', medium: 'text-amber-600 bg-amber-50', hard: 'text-red-600 bg-red-50' };
    return <span className={`text-xs px-2 py-0.5 rounded-full ${colors[difficulty] ?? 'bg-gray-50 text-gray-500'}`}>{difficulty}</span>;
}

export default function AdminTestShow({ test }) {
    return (
        <AppLayout>
            <Head title={`Admin — ${test.title}`} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <Link href={route('admin.tests')} className="text-sm text-indigo-600 hover:underline">← Tests</Link>
                        <h1 className="text-xl font-bold text-gray-900 mt-1">{test.title}</h1>
                        <p className="text-sm text-gray-500">{test.module} · {test.type.replace(/_/g,' ')} · {test.duration_minutes}m</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${test.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {test.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700">Questions ({test.questions.length})</h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Q#</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Type</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Question (truncated)</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Answer</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Difficulty</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">Skills</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {test.questions.map(q => (
                                <tr key={q.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-gray-500">{q.sequence}</td>
                                    <td className="px-4 py-2"><QBadge type={q.question_type} /></td>
                                    <td className="px-4 py-2 text-gray-700 max-w-xs truncate">{q.question_text.split('\n')[0]}</td>
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
            </div>
        </AppLayout>
    );
}
