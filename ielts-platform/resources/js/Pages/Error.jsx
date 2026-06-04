import { Head, Link } from '@inertiajs/react';

const ERROR_COPY = {
    403: { emoji: '🔒', title: 'Access Denied', body: "You don't have permission to view this page." },
    404: { emoji: '🔍', title: 'Page Not Found', body: "We couldn't find what you were looking for." },
    419: { emoji: '⏱️', title: 'Session Expired', body: 'Your session has expired. Please refresh the page.' },
    429: { emoji: '🚦', title: 'Too Many Requests', body: 'You are making requests too quickly. Please wait a moment.' },
    500: { emoji: '⚙️', title: 'Server Error', body: 'Something went wrong on our end. Please try again shortly.' },
    503: { emoji: '🛠️', title: 'Maintenance', body: "We're performing scheduled maintenance. We'll be back shortly." },
};

export default function Error({ status }) {
    const { emoji, title, body } = ERROR_COPY[status] ?? ERROR_COPY[500];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <Head title={`${status} — ${title}`} />
            <div className="text-center max-w-md">
                <div className="text-7xl mb-6">{emoji}</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{status}</h1>
                <h2 className="text-xl font-semibold text-gray-700 mb-3">{title}</h2>
                <p className="text-gray-500 mb-8">{body}</p>
                <div className="flex gap-3 justify-center">
                    <Link
                        href="/"
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                        Go to Dashboard
                    </Link>
                    {status !== 419 && (
                        <button
                            onClick={() => window.history.back()}
                            className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
                        >
                            Go Back
                        </button>
                    )}
                    {status === 419 && (
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
                        >
                            Refresh
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-8">
                    IELTS Master · Need help?{' '}
                    <a href="mailto:support@ieltsmaster.com" className="underline">Contact support</a>
                </p>
            </div>
        </div>
    );
}
