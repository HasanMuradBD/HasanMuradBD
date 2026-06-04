import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';

const MODULE_COLORS = {
    reading:   'bg-blue-100 text-blue-700',
    listening: 'bg-purple-100 text-purple-700',
    writing:   'bg-amber-100 text-amber-700',
    speaking:  'bg-red-100 text-red-700',
};

export default function AdminMicroSkills({ skills }) {
    return (
        <AppLayout>
            <Head title="Admin — Micro-Skills" />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Micro-Skills</h1>
                    <Link href={route('admin.dashboard')} className="text-sm text-indigo-600 hover:underline">← Admin</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skills.map(parent => (
                        <div key={parent.id} className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${MODULE_COLORS[parent.module] ?? 'bg-gray-100 text-gray-600'}`}>
                                    {parent.module}
                                </span>
                                <span className="text-sm font-semibold text-gray-800">{parent.name}</span>
                            </div>
                            <div className="space-y-2">
                                {parent.children?.map(child => (
                                    <div key={child.id} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-700">{child.name}</span>
                                        <span className="text-xs font-mono text-gray-400">{child.slug}</span>
                                    </div>
                                ))}
                                {(!parent.children || parent.children.length === 0) && (
                                    <p className="text-xs text-gray-400">No child skills</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
