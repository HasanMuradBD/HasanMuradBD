import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const NAV_LINKS = [
    { label: 'Dashboard',      routeName: 'dashboard' },
    { label: 'Analytics',      routeName: 'analytics.index' },
    { label: 'Practice Tests', routeName: 'tests.index' },
];

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <Link href={route('dashboard')} className="text-xl font-bold text-indigo-600">
                                IELTS Master
                            </Link>
                            {/* Desktop nav */}
                            <div className="hidden md:flex items-center gap-6">
                                {NAV_LINKS.map(l => (
                                    <Link
                                        key={l.routeName}
                                        href={route(l.routeName)}
                                        className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Desktop right */}
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm text-gray-400">{auth?.user?.email}</span>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-gray-500 hover:text-red-600 transition"
                            >
                                Sign out
                            </Link>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
                            onClick={() => setMobileOpen(o => !o)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile drawer */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-1">
                        {NAV_LINKS.map(l => (
                            <Link
                                key={l.routeName}
                                href={route(l.routeName)}
                                className="block py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                                onClick={() => setMobileOpen(false)}
                            >
                                {l.label}
                            </Link>
                        ))}
                        <div className="border-t border-gray-100 mt-2 pt-2">
                            <p className="text-xs text-gray-400 mb-1">{auth?.user?.email}</p>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-red-600 hover:underline"
                                onClick={() => setMobileOpen(false)}
                            >
                                Sign out
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
            <main>{children}</main>
        </div>
    );
}
