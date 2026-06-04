import { Head, Link } from '@inertiajs/react';

const features = [
    '30-day personalised study plan, auto-generated from your diagnostic',
    'Full computer-delivered mock tests — Reading, Listening, Writing, Speaking',
    'Daily WhatsApp coaching: reminders, micro-quizzes, progress reports',
    'Granular analytics: per-skill accuracy, band trajectory, error patterns',
    'Unlimited practice tests across all 13 IELTS question types',
    'Model answers at Band 7 and Band 8 for all Writing prompts',
];

export default function SubscriptionIndex({ trialExpired, user }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 flex items-center justify-center p-4">
            <Head title="Subscribe — IELTS Master" />

            <div className="w-full max-w-lg">
                {trialExpired && (
                    <div className="bg-red-500/20 border border-red-400 text-red-200 rounded-xl p-4 mb-6 text-center">
                        <p className="font-semibold">Your 7-day free trial has ended.</p>
                        <p className="text-sm mt-1 text-red-300">Subscribe to keep your progress and continue your plan.</p>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 px-8 py-8 text-center text-white">
                        <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-2">IELTS Master Pro</p>
                        <div className="flex items-end justify-center gap-1">
                            <span className="text-5xl font-bold">$10</span>
                            <span className="text-indigo-200 mb-2">/month</span>
                        </div>
                        <p className="text-indigo-200 text-sm mt-2">Cancel anytime. No contracts.</p>
                    </div>

                    {/* Features */}
                    <div className="px-8 py-6">
                        <ul className="space-y-3">
                            {features.map((f, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="px-8 pb-8">
                        <Link
                            href={route('subscription.checkout')}
                            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-semibold py-3.5 rounded-xl transition text-lg"
                        >
                            Subscribe Now →
                        </Link>
                        <p className="text-center text-xs text-gray-400 mt-3">
                            Secure payment via Stripe. Cancel from your billing portal anytime.
                        </p>
                        {!trialExpired && (
                            <div className="text-center mt-4">
                                <Link href={route('dashboard')} className="text-sm text-indigo-600 hover:underline">
                                    ← Back to dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
