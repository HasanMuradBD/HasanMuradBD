import { Link } from '@inertiajs/react';

export default function TrialBanner({ daysLeft }) {
    const urgent = daysLeft <= 1;
    return (
        <div className={`px-4 py-3 ${urgent ? 'bg-red-600' : 'bg-amber-500'} text-white`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <p className="text-sm font-medium">
                    {daysLeft === 0
                        ? '⚠️ Your free trial expires today.'
                        : `⏳ ${daysLeft} day${daysLeft > 1 ? 's' : ''} left in your free trial.`}
                    {' '}Don't lose your progress.
                </p>
                <Link
                    href={route('subscription.checkout')}
                    className="ml-4 bg-white text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-amber-50 transition flex-shrink-0"
                >
                    Subscribe for $10/mo →
                </Link>
            </div>
        </div>
    );
}
