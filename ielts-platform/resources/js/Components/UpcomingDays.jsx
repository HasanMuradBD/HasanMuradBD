const MODULE_ICONS = {
    reading:   '📖',
    listening: '🎧',
    writing:   '✍️',
    speaking:  '🎤',
    full:      '🏆',
};

export default function UpcomingDays({ upcoming }) {
    if (!upcoming || upcoming.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Coming Up</h3>
            <div className="space-y-3">
                {upcoming.map((day, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <div className="text-xl leading-none mt-0.5">{MODULE_ICONS[day.focus_module] ?? '📚'}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-800">Day {day.day_number} · {day.calendar_date}</span>
                                <span className="text-xs text-gray-400">{day.estimated_minutes}m</span>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{day.focus_theme}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
