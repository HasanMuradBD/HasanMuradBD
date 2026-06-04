import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';
import DailyMissionCard from '@/Components/DailyMissionCard';
import BandTrajectoryChart from '@/Components/BandTrajectoryChart';
import TrialBanner from '@/Components/TrialBanner';
import WeekStatsBar from '@/Components/WeekStatsBar';
import WeakSkillsPanel from '@/Components/WeakSkillsPanel';
import UpcomingDays from '@/Components/UpcomingDays';

function ExamCountdown({ daysUntilExam, examDate }) {
    if (!daysUntilExam) return null;
    const urgency = daysUntilExam <= 7 ? 'text-red-600 bg-red-50 border-red-200'
        : daysUntilExam <= 14 ? 'text-amber-600 bg-amber-50 border-amber-200'
        : 'text-indigo-600 bg-indigo-50 border-indigo-200';

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${urgency}`}>
            <span className="text-base">📅</span>
            {daysUntilExam === 0 ? 'Exam today — good luck!' : `${daysUntilExam} day${daysUntilExam === 1 ? '' : 's'} until your exam`}
        </div>
    );
}

function PlanProgress({ plan }) {
    if (!plan) return null;
    const pct = Math.round((plan.current_day / plan.total_days) * 100);
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-xs">
                <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-gray-500 shrink-0">Day {plan.current_day}/{plan.total_days}</span>
        </div>
    );
}

export default function Dashboard({ plan, todayTasks, bandHistory, weekStats, weakSkills, trialDaysLeft, daysUntilExam }) {
    const { auth } = usePage().props;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <AppLayout>
            <Head title="Dashboard" />

            {trialDaysLeft !== null && trialDaysLeft <= 3 && (
                <TrialBanner daysLeft={trialDaysLeft} />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {greeting}, {auth.user.name.split(' ')[0]}
                        </h1>
                        {plan && <PlanProgress plan={plan} />}
                    </div>
                    <ExamCountdown daysUntilExam={daysUntilExam} />
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column — mission + chart */}
                    <div className="lg:col-span-2 space-y-6">
                        <DailyMissionCard tasks={todayTasks} plan={plan} />
                        <BandTrajectoryChart history={bandHistory} target={auth.user.target_band} />
                        <WeekStatsBar weekStats={weekStats} />
                    </div>

                    {/* Right column — sidebar */}
                    <div className="space-y-6">
                        <WeakSkillsPanel weakSkills={weakSkills} />
                        <UpcomingDays upcoming={plan?.upcoming} />

                        {/* Quick links */}
                        {!plan && (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-center">
                                <p className="text-sm text-indigo-700 font-medium mb-3">No study plan yet</p>
                                <a
                                    href="/onboarding"
                                    className="inline-block bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Start Diagnostic Test
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
