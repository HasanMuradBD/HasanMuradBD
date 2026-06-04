import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link href={route('dashboard')} className="text-xl font-bold text-indigo-600">
                                IELTS Master
                            </Link>
                            <div className="hidden md:flex items-center gap-6">
                                <Link href={route('dashboard')} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Dashboard</Link>
                                <Link href={route('analytics.index')} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Analytics</Link>
                                <Link href={route('tests.index')} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Practice Tests</Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 hidden sm:block">{auth?.user?.email}</span>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-gray-500 hover:text-red-600 transition"
                            >
                                Sign out
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}
