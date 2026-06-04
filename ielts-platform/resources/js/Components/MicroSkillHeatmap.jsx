const moduleColors = {
    reading:   { bg: 'bg-blue-50',   text: 'text-blue-700',   bar: 'bg-blue-400'   },
    listening: { bg: 'bg-green-50',  text: 'text-green-700',  bar: 'bg-green-400'  },
    writing:   { bg: 'bg-amber-50',  text: 'text-amber-700',  bar: 'bg-amber-400'  },
    speaking:  { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-400' },
};

function AccuracyBar({ accuracy }) {
    const color = accuracy >= 75 ? 'bg-green-500' : accuracy >= 55 ? 'bg-amber-500' : 'bg-red-500';
    return (
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
            <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${accuracy}%` }} />
        </div>
    );
}

export default function MicroSkillHeatmap({ skills = [] }) {
    if (!skills.length) {
        return <p className="text-sm text-gray-400 text-center py-8">No skill data yet. Complete practice tests to see your micro-skill breakdown.</p>;
    }

    const grouped = skills.reduce((acc, s) => {
        (acc[s.module] ??= []).push(s);
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(grouped).map(([module, moduleSkills]) => {
                const c = moduleColors[module] ?? moduleColors.reading;
                return (
                    <div key={module} className={`${c.bg} rounded-lg p-4`}>
                        <h3 className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-3`}>{module}</h3>
                        <div className="space-y-3">
                            {moduleSkills.sort((a,b) => a.accuracy - b.accuracy).map((s, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-700 truncate max-w-[180px]">{s.skill}</span>
                                        <span className={`text-xs font-bold ${s.accuracy >= 75 ? 'text-green-600' : s.accuracy >= 55 ? 'text-amber-600' : 'text-red-600'}`}>
                                            {s.accuracy}%
                                        </span>
                                    </div>
                                    <AccuracyBar accuracy={s.accuracy} />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
