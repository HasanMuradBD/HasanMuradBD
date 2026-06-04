export default function WeeklySummaryCard({ summary }) {
    if (!summary) return null;

    const stats = [
        { label: 'Tests this week', value: summary.attempts, suffix: '' },
        { label: 'Avg band', value: summary.avg_band ?? '—', suffix: '' },
        { label: 'Questions answered', value: summary.questions_answered, suffix: '' },
        { label: 'Accuracy', value: summary.accuracy != null ? `${summary.accuracy}%` : '—', suffix: '' },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">This Week at a Glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(({ label, value }) => (
                    <div key={label} className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">{value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
