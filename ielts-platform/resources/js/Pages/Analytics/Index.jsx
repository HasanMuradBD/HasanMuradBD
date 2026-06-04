import { Head } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';
import BandTrajectoryChart from '@/Components/BandTrajectoryChart';
import MicroSkillHeatmap from '@/Components/MicroSkillHeatmap';
import ErrorPatternChart from '@/Components/ErrorPatternChart';
import ModuleGapCards from '@/Components/ModuleGapCards';
import WeeklySummaryCard from '@/Components/WeeklySummaryCard';
import RecentAttempts from '@/Components/RecentAttempts';

export default function AnalyticsIndex({
    bandHistory, skillData, errorPatterns,
    moduleBands, moduleTargets, weeklySummary,
    recentAttempts, target, daysUntilExam,
}) {
    return (
        <AppLayout>
            <Head title="Analytics" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    {daysUntilExam != null && (
                        <span className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-full">
                            📅 {daysUntilExam === 0 ? 'Exam today' : `${daysUntilExam} days to exam`}
                        </span>
                    )}
                </div>

                {/* Weekly summary stats */}
                <WeeklySummaryCard summary={weeklySummary} />

                {/* Module gap cards */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">Current Band vs. Target</h2>
                    <ModuleGapCards moduleBands={moduleBands} moduleTargets={moduleTargets} />
                </div>

                {/* Band trajectory + error patterns side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">Band Trajectory</h2>
                        <BandTrajectoryChart history={bandHistory} target={target} />
                    </div>
                    <ErrorPatternChart patterns={errorPatterns} />
                </div>

                {/* Micro-skill heatmap */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Micro-Skill Accuracy — Last 30 Days</h2>
                    <MicroSkillHeatmap skills={skillData} />
                </div>

                {/* Skill trend table */}
                {skillData.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">Skill Trends</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-medium text-gray-500 pb-2">Skill</th>
                                        <th className="text-left text-xs font-medium text-gray-500 pb-2">Module</th>
                                        <th className="text-right text-xs font-medium text-gray-500 pb-2">Accuracy</th>
                                        <th className="text-right text-xs font-medium text-gray-500 pb-2">Band</th>
                                        <th className="text-right text-xs font-medium text-gray-500 pb-2">Trend (30d)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[...skillData].sort((a, b) => a.accuracy - b.accuracy).map((s, i) => (
                                        <tr key={i}>
                                            <td className="py-2 text-gray-800">{s.skill}</td>
                                            <td className="py-2 text-gray-500 capitalize">{s.module}</td>
                                            <td className={`py-2 text-right font-medium ${s.accuracy >= 75 ? 'text-emerald-600' : s.accuracy >= 55 ? 'text-amber-600' : 'text-red-600'}`}>
                                                {s.accuracy}%
                                            </td>
                                            <td className="py-2 text-right text-gray-700">{s.band ?? '—'}</td>
                                            <td className={`py-2 text-right font-medium ${s.trend > 0 ? 'text-emerald-600' : s.trend < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                {s.trend > 0 ? `+${s.trend}` : s.trend === 0 ? '—' : s.trend}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Recent attempts */}
                <RecentAttempts attempts={recentAttempts} />
            </div>
        </AppLayout>
    );
}
