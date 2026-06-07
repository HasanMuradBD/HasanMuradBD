import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

export default function AdminUsers({ users }) {
    return (
        <AdminLayout>
            <Head title="Admin — Users" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <Link href={route('admin.dashboard')} className="text-sm text-indigo-600 hover:underline">← Admin</Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Name</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Email</th>
                                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Plans</th>
                                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Attempts</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Registered</th>
                                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.data.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium text-gray-800">{u.name}</td>
                                    <td className="px-4 py-2 text-gray-600">{u.email}</td>
                                    <td className="px-4 py-2 text-right text-gray-600">{u.study_plans_count}</td>
                                    <td className="px-4 py-2 text-right text-gray-600">{u.test_attempts_count}</td>
                                    <td className="px-4 py-2 text-gray-500">{u.created_at}</td>
                                    <td className="px-4 py-2">
                                        {u.onboarding_completed_at
                                            ? <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                                            : <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Onboarding</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    {(users.prev_page_url || users.next_page_url) && (
                        <div className="px-4 py-3 border-t border-gray-100 flex gap-3 text-sm">
                            {users.prev_page_url && <Link href={users.prev_page_url} className="text-indigo-600 hover:underline">← Previous</Link>}
                            {users.next_page_url && <Link href={users.next_page_url} className="text-indigo-600 hover:underline ml-auto">Next →</Link>}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
