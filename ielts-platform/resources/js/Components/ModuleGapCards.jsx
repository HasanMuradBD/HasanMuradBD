const MODULE_STYLE = {
    reading:   { icon: '📖', bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   bar: 'bg-blue-500'   },
    listening: { icon: '🎧', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', bar: 'bg-purple-500' },
    writing:   { icon: '✍️', bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  bar: 'bg-amber-500'  },
    speaking:  { icon: '🎤', bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    bar: 'bg-red-500'    },
};

function GapBar({ current, target }) {
    if (!current) return <div className="text-xs text-gray-400 mt-2">No score yet</div>;
    const pct = Math.min((current / 9) * 100, 100);
    const targetPct = Math.min((target / 9) * 100, 100);
    const gap = Math.max(0, target - current);
    const gapColor = gap === 0 ? 'text-emerald-600' : gap <= 0.5 ? 'text-amber-600' : 'text-red-600';

    return (
        <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-gray-800 text-lg leading-none">{current}</span>
                <span className={`font-medium ${gapColor}`}>
                    {gap === 0 ? '✓ On target' : `−${gap.toFixed(1)} from target`}
                </span>
            </div>
            <div className="relative w-full bg-gray-100 rounded-full h-2">
                <div className="absolute h-2 rounded-full bg-gray-300" style={{ width: `${targetPct}%` }} />
                <div className="absolute h-2 rounded-full bg-current" style={{ width: `${pct}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-gray-500 rounded" style={{ left: `${targetPct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                <span>0</span>
                <span>Target {target}</span>
                <span>9</span>
            </div>
        </div>
    );
}

export default function ModuleGapCards({ moduleBands, moduleTargets }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['reading', 'listening', 'writing', 'speaking'].map(m => {
                const s = MODULE_STYLE[m];
                return (
                    <div key={m} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{s.icon}</span>
                            <span className={`text-xs font-bold uppercase tracking-wide ${s.text}`}>{m}</span>
                        </div>
                        <GapBar current={moduleBands[m]} target={moduleTargets[m]} />
                    </div>
                );
            })}
        </div>
    );
}
