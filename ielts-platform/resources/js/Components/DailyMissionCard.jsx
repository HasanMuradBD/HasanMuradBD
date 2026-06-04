import { Link, router } from '@inertiajs/react';

const taskIcons = {
    timed_test:          '📋',
    self_mark:           '✏️',
    vocabulary_review:   '📚',
    descriptor_study:    '🎯',
    error_log_review:    '🔍',
};

function TaskRow({ task }) {
    const completed = task.status === 'completed';

    const handleComplete = () => {
        router.patch(route('daily-tasks.complete', task.id), {}, { preserveScroll: true });
    };

    return (
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${
            completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        }`}>
            <span className="text-xl shrink-0">{taskIcons[task.task_type] || '📝'}</span>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                </p>
                <p className="text-xs text-gray-400">{task.duration_minutes} min</p>
            </div>
            {completed ? (
                <span className="text-green-500 text-lg shrink-0">✓</span>
            ) : task.linked_test && task.linked_test.id ? (
                <Link
                    href={route('test-attempts.start')}
                    method="post"
                    data={{ test_id: task.linked_test.id, daily_task_id: task.id }}
                    as="button"
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition shrink-0"
                >
                    Start
                </Link>
            ) : (
                <button
                    onClick={handleComplete}
                    className="text-xs bg-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition shrink-0"
                >
                    Done
                </button>
            )}
        </div>
    );
}

export default function DailyMissionCard({ tasks = [], plan }) {
    if (!plan) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-2">No active study plan</h2>
                <p className="text-gray-500 text-sm mb-4">
                    Complete your diagnostic test to generate your personalised 30-day schedule.
                </p>
                <Link
                    href={route('onboarding')}
                    className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                    Start Diagnostic Test →
                </Link>
            </div>
        );
    }

    const completed = tasks.filter(t => t.status === 'completed').length;
    const allDone   = tasks.length > 0 && completed === tasks.length;

    const statusColor = {
        completed:   'bg-green-50 border-green-200 text-green-700',
        missed:      'bg-red-50 border-red-200 text-red-700',
        in_progress: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        pending:     'bg-gray-50 border-gray-200 text-gray-600',
    }[plan.today_status] ?? 'bg-gray-50 border-gray-200 text-gray-600';

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-1 gap-2">
                <h2 className="text-lg font-bold text-gray-800">
                    Day {plan.current_day} of {plan.total_days}
                </h2>
                <span className={`text-xs font-medium px-2 py-1 rounded-full border shrink-0 ${statusColor}`}>
                    {plan.today_status}
                </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
                Focus: <span className="font-medium text-gray-700">{plan.today_theme}</span>
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5">
                <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%` }}
                />
            </div>

            {tasks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No tasks scheduled for today.</p>
            ) : (
                <div className="space-y-3">
                    {tasks.map(task => <TaskRow key={task.id} task={task} />)}
                </div>
            )}

            {allDone && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-green-700 font-medium text-sm">🎉 All tasks done! Check your analytics.</p>
                </div>
            )}
        </div>
    );
}
