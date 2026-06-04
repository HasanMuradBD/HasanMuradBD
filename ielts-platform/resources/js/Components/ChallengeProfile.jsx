import { useState } from 'react';

const COLOR_CLASSES = {
    red:    { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700',    bar: 'bg-red-500'    },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700',bar: 'bg-orange-500' },
    amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500'  },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700',bar: 'bg-yellow-400'},
    green:  { bg: 'bg-emerald-50',border: 'border-emerald-200',badge: 'bg-emerald-100 text-emerald-700',bar: 'bg-emerald-500'},
    gray:   { bg: 'bg-gray-50',   border: 'border-gray-200',   badge: 'bg-gray-100 text-gray-500',   bar: 'bg-gray-300'   },
};

const MODULE_PILL = {
    reading:   'bg-blue-100 text-blue-700',
    listening: 'bg-purple-100 text-purple-700',
    writing:   'bg-amber-100 text-amber-700',
    speaking:  'bg-red-100 text-red-700',
};

function CauseCard({ cause }) {
    const [expanded, setExpanded] = useState(false);
    const c = COLOR_CLASSES[cause.color] ?? COLOR_CLASSES.gray;
    const hasData = cause.accuracy !== null;

    return (
        <div className={`${c.bg} border ${c.border} rounded-xl p-4 transition-all`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">{cause.icon}</span>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-tight">{cause.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {cause.affects.map(m => (
                                <span key={m} className={`text-xs px-1.5 py-0.5 rounded-full ${MODULE_PILL[m] ?? 'bg-gray-100 text-gray-500'}`}>
                                    {m}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {cause.severity && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
                            {cause.severity}
                        </span>
                    )}
                    {!hasData && (
                        <span className="text-xs text-gray-400">No data yet</span>
                    )}
                </div>
            </div>

            {hasData && (
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Skill accuracy</span>
                        <span className="font-medium">{cause.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full ${c.bar} transition-all`}
                            style={{ width: `${Math.min(cause.accuracy, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {cause.active && (
                <>
                    <p className="text-xs text-gray-600 mt-3">{cause.description}</p>
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="text-xs text-indigo-600 hover:underline mt-2 font-medium"
                    >
                        {expanded ? 'Hide fixes ▲' : 'Show fixes ▼'}
                    </button>
                    {expanded && (
                        <ul className="mt-2 space-y-1.5">
                            {cause.fixes.map((fix, i) => (
                                <li key={i} className="flex gap-2 text-xs text-gray-700">
                                    <span className="text-indigo-400 shrink-0">→</span>
                                    <span>{fix}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default function ChallengeProfile({ profile }) {
    if (!profile || profile.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Your Challenge Profile</h2>
                <p className="text-sm text-gray-400 text-center py-6">
                    Complete your diagnostic test to generate your personalised challenge profile.
                </p>
            </div>
        );
    }

    const active = profile.filter(c => c.active);
    const inactive = profile.filter(c => !c.active);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Your Challenge Profile</h2>
                {active.length > 0 && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        {active.length} active issue{active.length > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {active.length > 0 && (
                <>
                    <p className="text-xs text-gray-500 mb-3">
                        These root causes are actively costing you marks. Click each card to see targeted fixes.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {active.map(c => <CauseCard key={c.slug} cause={c} />)}
                    </div>
                </>
            )}

            {inactive.length > 0 && (
                <>
                    {active.length > 0 && (
                        <p className="text-xs text-gray-400 font-medium mb-2 mt-2">STRENGTHS</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {inactive.map(c => <CauseCard key={c.slug} cause={c} />)}
                    </div>
                </>
            )}
        </div>
    );
}
