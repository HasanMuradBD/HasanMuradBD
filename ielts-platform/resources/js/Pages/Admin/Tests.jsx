import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

const MODULE_BADGE = {
    reading:   'bg-blue-100 text-blue-700',
    listening: 'bg-purple-100 text-purple-700',
    writing:   'bg-amber-100 text-amber-700',
    speaking:  'bg-red-100 text-red-700',
    full:      'bg-gray-100 text-gray-700',
};

export default function AdminTests({ tests }) {
    const toggle = (test) => {
        router.post(route('admin.tests.toggle', test.id), {}, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Admin — Tests" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Test Bank</h1>
                    <Link href={route('admin.dashboard')} className="text-sm text-indigo-600 hover:underline">← Admin</Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Title</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Module</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Type</th>
                                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Questions</th>
                                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Duration</th>
                                <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tests.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{t.title}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${MODULE_BADGE[t.module] ?? MODULE_BADGE.full}`}>{t.module}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 capitalize">{t.type.replace(/_/g,' ')}</td>
                                    <td className="px-4 py-3 text-right text-gray-600">{t.questions_count}</td>
                                    <td className="px-4 py-3 text-right text-gray-600">{t.duration_minutes}m</td>
                                    <td className="px-4 py-3 text-center">
                                        {t.is_active
                                            ? <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                                            : <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Inactive</span>}
                                    </td>
                                    <td className="px-4 py-3 text-right flex gap-2 justify-end">
                                        <Link href={route('admin.tests.show', t.id)} className="text-xs text-indigo-600 hover:underline">View</Link>
                                        <button onClick={() => toggle(t)} className="text-xs text-gray-500 hover:text-gray-700">
                                            {t.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
