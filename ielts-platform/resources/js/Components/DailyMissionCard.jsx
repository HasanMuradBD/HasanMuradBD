import { Link } from '@inertiajs/react';

const taskIcons = {
    timed_test: '📋',
    self_mark: '✏️',
    vocabulary_review: '📚',
    descriptor_study: '🎯',
    error_log_review: '🔍',
};

export default function DailyMissionCard({ tasks = [], plan }) {
    if (!plan) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-2">No active study plan</h2>
                <p className="text-gray-500 text-sm mb-4">Complete your diagnostic test to generate your personalised 30-day schedule.</p>
                <Link href={route('test-attempts.start', { type: 'diagnostic' })} className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition">
                    Start Diagnostic Test →
                </Link>
            </div>
        );
    }

    const daysLeft = Math.ceil((new Date(plan.exam_date) - new Date()) / (1000 * 60 * 60 * 24));
    const completed = tasks.filter(t => t.status === 'completed').length;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-gray-800">Day {plan.current_day} of {plan.total_days}</h2>
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {daysLeft} days to exam
                </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Focus: <span className="font-medium text-gray-700">{plan.today_theme}</span></p>

            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5">
                <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%` }}
                />
            </div>

            <div className="space-y-3">
                {tasks.map((task, i) => (
                    <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                        task.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                        <span className="text-xl">{taskIcons[task.task_type] || '📝'}</span>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {task.title}
                            </p>
                            <p className="text-xs text-gray-400">{task.duration_minutes} min</p>
                        </div>
                        {task.status === 'completed' ? (
                            <span className="text-green-500 text-lg">✓</span>
                        ) : (
                            <Link
                                href={task.linked_test_id
                                    ? route('test-attempts.start', { task: task.id })
                                    : route('daily-tasks.complete', task.id)}
                                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Start
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {completed === tasks.length && tasks.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-green-700 font-medium text-sm">🎉 All tasks done! See you tomorrow.</p>
                </div>
            )}
        </div>
    );
}
