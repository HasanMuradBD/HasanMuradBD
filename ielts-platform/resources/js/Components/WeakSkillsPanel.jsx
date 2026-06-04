const MODULE_COLORS = {
    reading:   'bg-blue-100 text-blue-700',
    listening: 'bg-purple-100 text-purple-700',
    writing:   'bg-amber-100 text-amber-700',
    speaking:  'bg-red-100 text-red-700',
};

export default function WeakSkillsPanel({ weakSkills }) {
    if (!weakSkills || weakSkills.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Focus Areas</h3>
                <p className="text-xs text-gray-400">Complete a test to see your weak areas.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Focus Areas</h3>
            <div className="space-y-3">
                {weakSkills.map((skill, idx) => (
                    <div key={idx}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${MODULE_COLORS[skill.module] ?? 'bg-gray-100 text-gray-600'}`}>
                                    {skill.module}
                                </span>
                                <span className="text-xs font-medium text-gray-800 truncate max-w-[140px]">{skill.name}</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-600 shrink-0">
                                Band {skill.band ?? '—'} · {skill.accuracy}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                                className="h-1.5 rounded-full bg-red-400"
                                style={{ width: `${Math.min(skill.accuracy, 100)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
