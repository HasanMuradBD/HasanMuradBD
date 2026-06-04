import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';

function StatCard({ label, value, color = 'indigo' }) {
    const colors = {
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
    };
    return (
        <div className={`border rounded-xl p-5 ${colors[color]}`}>
            <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
    );
}

export default function AdminDashboard({ stats, recentUsers }) {
    return (
        <AppLayout>
            <Head title="Admin" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex gap-3">
                        {[
                            { label: 'Tests', href: route('admin.tests') },
                            { label: 'Questions', href: route('admin.questions') },
                            { label: 'Micro-Skills', href: route('admin.micro-skills') },
                            { label: 'Users', href: route('admin.users') },
                        ].map(l => (
                            <Link key={l.label} href={l.href} className="text-sm text-indigo-600 hover:underline font-medium">{l.label}</Link>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total users"       value={stats.users}        color="indigo" />
                    <StatCard label="Active plans"      value={stats.active_plans} color="emerald" />
                    <StatCard label="Completed tests"   value={stats.attempts}     color="blue" />
                    <StatCard label="Active test banks" value={stats.tests}        color="amber" />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Registrations</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs font-medium text-gray-500 pb-2">Name</th>
                                    <th className="text-left text-xs font-medium text-gray-500 pb-2">Email</th>
                                    <th className="text-left text-xs font-medium text-gray-500 pb-2">Registered</th>
                                    <th className="text-left text-xs font-medium text-gray-500 pb-2">Trial ends</th>
                                    <th className="text-left text-xs font-medium text-gray-500 pb-2">Onboarded</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentUsers.map(u => (
                                    <tr key={u.id}>
                                        <td className="py-2 font-medium text-gray-800">{u.name}</td>
                                        <td className="py-2 text-gray-600">{u.email}</td>
                                        <td className="py-2 text-gray-500">{u.created_at}</td>
                                        <td className="py-2 text-gray-500">{u.trial_ends_at ?? '—'}</td>
                                        <td className="py-2">
                                            {u.onboarding_completed_at
                                                ? <span className="text-emerald-600 font-medium">✓ Yes</span>
                                                : <span className="text-gray-400">Pending</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
