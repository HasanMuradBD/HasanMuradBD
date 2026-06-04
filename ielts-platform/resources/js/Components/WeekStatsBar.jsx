export default function WeekStatsBar({ weekStats }) {
    if (!weekStats) return null;

    const { completed, missed, total } = weekStats;
    const pending = total - completed - missed;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">This Week</h3>
            <div className="flex gap-1 mb-3">
                {Array.from({ length: total }).map((_, i) => {
                    let color = 'bg-gray-100';
                    if (i < completed) color = 'bg-emerald-500';
                    else if (i < completed + missed) color = 'bg-red-400';
                    return <div key={i} className={`flex-1 h-3 rounded-sm ${color}`} />;
                })}
                {total === 0 && <span className="text-xs text-gray-400">No study days yet</span>}
            </div>
            <div className="flex gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />
                    {completed} completed
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-red-400 inline-block" />
                    {missed} missed
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-gray-100 border border-gray-200 inline-block" />
                    {pending} pending
                </span>
            </div>
        </div>
    );
}
