import { Link, usePage } from '@inertiajs/react';

const NAV = [
    { label: 'Overview',     routeName: 'admin.dashboard' },
    { label: 'Users',        routeName: 'admin.users' },
    { label: 'Tests',        routeName: 'admin.tests' },
    { label: 'Questions',    routeName: 'admin.questions' },
    { label: 'Micro-Skills', routeName: 'admin.micro-skills' },
    { label: '+ New Test',   routeName: 'admin.content.create-test', highlight: true },
    { label: '📅 Tips',      routeName: 'admin.tips.index' },
];

export default function AdminLayout({ children, title }) {
    const { url } = usePage();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top bar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-6">
                    <Link href={route('admin.dashboard')} className="text-sm font-bold text-indigo-600 shrink-0">
                        IELTSLine Admin
                    </Link>
                    <nav className="flex items-center gap-1 overflow-x-auto">
                        {NAV.map(({ label, routeName, highlight }) => {
                            const href = route(routeName);
                            const active = url.startsWith(new URL(href, window.location.origin).pathname);
                            return (
                                <Link
                                    key={routeName}
                                    href={href}
                                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                        highlight
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : active
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="ml-auto shrink-0">
                        <Link href={route('dashboard')} className="text-xs text-gray-400 hover:text-gray-700 transition">
                            ← Student view
                        </Link>
                    </div>
                </div>
            </header>

            {/* Page heading */}
            {title && (
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                    </div>
                </div>
            )}

            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
