import { Head, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 flex items-center justify-center p-4">
            <Head title="Verify Email" />
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-5xl mb-4">📧</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h1>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                    We've sent a verification link to your email address.
                    Click the link to activate your account and start your 7-day trial.
                </p>

                {status === 'verification-link-sent' && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">
                        A new verification link has been sent.
                    </div>
                )}

                <button
                    onClick={() => post(route('verification.send'))}
                    disabled={processing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                >
                    {processing ? 'Sending...' : 'Resend verification email'}
                </button>

                <form method="POST" action={route('logout')} className="mt-4">
                    <input type="hidden" name="_token" value={document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''} />
                    <button type="submit" className="text-sm text-gray-500 hover:text-red-600 transition">
                        Sign out
                    </button>
                </form>
            </div>
        </div>
    );
}
