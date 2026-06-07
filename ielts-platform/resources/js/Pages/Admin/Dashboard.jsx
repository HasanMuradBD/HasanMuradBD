import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Components/AdminLayout';

function StatCard({ label, value, color = 'indigo', sub }) {
    const colors = {
        indigo:  'bg-indigo-50  border-indigo-200  text-indigo-700',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        amber:   'bg-amber-50   border-amber-200   text-amber-700',
        blue:    'bg-blue-50    border-blue-200    text-blue-700',
        violet:  'bg-violet-50  border-violet-200  text-violet-700',
        rose:    'bg-rose-50    border-rose-200    text-rose-700',
    };
    return (
        <div className={`border rounded-2xl p-5 ${colors[color]}`}>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-60">{label}</p>
            <p className="text-4xl font-extrabold mt-2">{value}</p>
            {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
        </div>
    );
}

export default function AdminDashboard({ stats, recentUsers }) {
    return (
        <AdminLayout title="Overview">
            <Head title="Admin Dashboard" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard label="Total Users"    value={stats.users}        color="indigo"  />
                    <StatCard label="Active Plans"   value={stats.active_plans} color="emerald" />
                    <StatCard label="Tests Done"     value={stats.attempts}     color="blue"    />
                    <StatCard label="Test Banks"     value={stats.tests}        color="amber"   />
                    <Link href={route('admin.content.create-test')}
                        className="border-2 border-dashed border-indigo-300 rounded-2xl p-5 flex flex-col items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition group">
                        <span className="text-2xl mb-1">+</span>
                        <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-800">New Test</span>
                    </Link>
                    <Link href={route('admin.tips.index')}
                        className="border-2 border-dashed border-violet-300 rounded-2xl p-5 flex flex-col items-center justify-center hover:border-violet-500 hover:bg-violet-50 transition group">
                        <span className="text-2xl mb-1">📅</span>
                        <span className="text-xs font-semibold text-violet-600 group-hover:text-violet-800">Manage Tips</span>
                    </Link>
                </div>

                {/* Quick nav */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'All Tests',    href: route('admin.tests'),       icon: '📋', desc: 'View & toggle test banks' },
                        { label: 'All Questions',href: route('admin.questions'),   icon: '❓', desc: 'Browse question library' },
                        { label: 'Micro-Skills', href: route('admin.micro-skills'),icon: '🎯', desc: 'Skill taxonomy' },
                        { label: 'All Users',    href: route('admin.users'),       icon: '👤', desc: 'User accounts & plans' },
                    ].map(({ label, href, icon, desc }) => (
                        <Link key={label} href={href}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition">
                            <div className="text-xl mb-2">{icon}</div>
                            <p className="text-sm font-semibold text-gray-900">{label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent registrations */}
                <div className="bg-white rounded-2xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700">Recent Registrations</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    {['Name', 'Email', 'Registered', 'Trial ends', 'Status'].map(h => (
                                        <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                                        <td className="px-5 py-3 text-gray-600">{u.email}</td>
                                        <td className="px-5 py-3 text-gray-500 text-xs">{u.created_at?.split('T')[0]}</td>
                                        <td className="px-5 py-3 text-gray-500 text-xs">{u.trial_ends_at?.split('T')[0] ?? '—'}</td>
                                        <td className="px-5 py-3">
                                            {u.onboarding_completed_at
                                                ? <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Onboarded</span>
                                                : <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Pending</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-3 border-t border-gray-50">
                        <Link href={route('admin.users')} className="text-xs text-indigo-600 hover:underline">View all users →</Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
