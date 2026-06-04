import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Components/AppLayout';
import DailyMissionCard from '@/Components/DailyMissionCard';
import BandTrajectoryChart from '@/Components/BandTrajectoryChart';
import TrialBanner from '@/Components/TrialBanner';

export default function Dashboard({ plan, todayTasks, bandHistory, trialDaysLeft }) {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            {trialDaysLeft !== null && trialDaysLeft <= 3 && (
                <TrialBanner daysLeft={trialDaysLeft} />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Good morning, {auth.user.name.split(' ')[0]} 👋
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <DailyMissionCard tasks={todayTasks} plan={plan} />
                    </div>
                    <div>
                        <BandTrajectoryChart history={bandHistory} target={auth.user.target_band} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
