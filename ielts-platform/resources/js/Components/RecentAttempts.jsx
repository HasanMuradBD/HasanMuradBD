import { Link } from '@inertiajs/react';

const MODULE_BADGE = {
    reading:   'bg-blue-100 text-blue-700',
    listening: 'bg-purple-100 text-purple-700',
    writing:   'bg-amber-100 text-amber-700',
    speaking:  'bg-red-100 text-red-700',
    full:      'bg-gray-100 text-gray-700',
};

export default function RecentAttempts({ attempts }) {
    if (!attempts || attempts.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Recent Tests</h2>
                <p className="text-sm text-gray-400 text-center py-6">No tests completed yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Tests</h2>
            <div className="divide-y divide-gray-100">
                {attempts.map(a => (
                    <div key={a.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${MODULE_BADGE[a.module] ?? MODULE_BADGE.full}`}>
                                {a.is_diagnostic ? 'Diagnostic' : a.module}
                            </span>
                            <span className="text-sm text-gray-800 truncate">{a.test_title}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-gray-400">{a.submitted_at}</span>
                            {a.overall_band ? (
                                <span className="text-sm font-bold text-indigo-600 w-10 text-right">
                                    {a.overall_band}
                                </span>
                            ) : (
                                <span className="text-xs text-gray-400 w-10 text-right">—</span>
                            )}
                            <Link
                                href={`/test-attempts/${a.id}/review`}
                                className="text-xs text-indigo-600 hover:underline"
                            >
                                Review
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
