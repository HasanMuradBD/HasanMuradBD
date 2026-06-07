import { Link } from '@inertiajs/react';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-bold text-indigo-600 mb-2">IELTSLine</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            AI-powered IELTS preparation that adapts to your weaknesses and gets you to your target band score.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>
                                <Link href={route('dashboard')} className="hover:text-indigo-600 transition">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href={route('analytics.index')} className="hover:text-indigo-600 transition">
                                    Analytics
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@ieltsline.com" className="hover:text-indigo-600 transition">
                                    Contact Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Company</h4>
                        <address className="not-italic text-sm text-gray-500 leading-relaxed">
                            <p className="font-medium text-gray-600">MRH Murad LLC</p>
                            <p>7901 4th St N STE</p>
                            <p>St. Petersburg, FL 33702</p>
                            <p>United States</p>
                        </address>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                    <p>© {year} IELTSLine. All rights reserved.</p>
                    <p>
                        Developed by{' '}
                        <a
                            href="https://setupline.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-500 hover:text-indigo-700 font-medium transition"
                        >
                            Setupline
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
