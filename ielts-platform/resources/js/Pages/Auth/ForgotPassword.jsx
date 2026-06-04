import { Head, useForm, Link } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 flex items-center justify-center p-4">
            <Head title="Reset Password" />
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">IELTS Master</h1>
                    <p className="text-indigo-200 mt-2">Reset your password</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {status && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">{status}</div>}
                    <p className="text-sm text-gray-500 mb-5">Enter your email and we'll send you a link to reset your password.</p>
                    <form onSubmit={e => { e.preventDefault(); post(route('password.email')); }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                                autoFocus
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <button type="submit" disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
                            {processing ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-4">
                        <Link href={route('login')} className="text-indigo-600 hover:underline">← Back to sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
