import { Head } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';
import BandTrajectoryChart from '@/Components/BandTrajectoryChart';
import MicroSkillHeatmap from '@/Components/MicroSkillHeatmap';

export default function AnalyticsIndex({ bandHistory, skillData, target, daysUntilExam }) {
    return (
        <AppLayout>
            <Head title="Analytics" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Your Analytics</h1>
                    <span className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-full">
                        {daysUntilExam} days to exam
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">Overall Band Trajectory</h2>
                        <BandTrajectoryChart history={bandHistory} target={target} />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">Module Breakdown</h2>
                        {bandHistory.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {['reading','listening','writing','speaking'].map(m => {
                                    const last = [...bandHistory].reverse().find(h => h[m]);
                                    return (
                                        <div key={m} className="bg-gray-50 rounded-lg p-4 text-center">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{m}</p>
                                            <p className="text-3xl font-bold text-indigo-600">{last?.[m] ?? '—'}</p>
                                            <p className="text-xs text-gray-400 mt-1">target: {target}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-8">Complete your first test to see module scores.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Micro-Skill Accuracy (Last 30 Days)</h2>
                    <MicroSkillHeatmap skills={skillData} />
                </div>
            </div>
        </AppLayout>
    );
}
