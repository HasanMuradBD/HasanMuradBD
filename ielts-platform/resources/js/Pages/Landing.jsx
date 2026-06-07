import { Head, Link } from '@inertiajs/react';

/* ─── tiny reusable helpers ─────────────────────────────────────── */
function CheckIcon() {
    return (
        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

function StarRating() {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

/* ─── data ───────────────────────────────────────────────────────── */
const FEATURES = [
    {
        icon: '🎯',
        title: 'AI-Powered Diagnostic',
        body: 'Take a 20-minute adaptive test and instantly see exactly which micro-skills are holding your band score back.',
    },
    {
        icon: '📅',
        title: 'Personalised Study Plan',
        body: 'A day-by-day schedule built around your exam date and weak areas — not a generic textbook syllabus.',
    },
    {
        icon: '📖',
        title: 'Full Exam Simulation',
        body: 'Computer-delivered Reading, Listening, Writing, and Speaking tests that mirror the real IELTS experience.',
    },
    {
        icon: '📊',
        title: 'Live Band Analytics',
        body: 'Track your trajectory per module. See your accuracy improve week over week with skill-level heatmaps.',
    },
    {
        icon: '💬',
        title: 'WhatsApp Coach',
        body: 'Daily nudges, quick vocabulary drills, and progress check-ins delivered to your phone — no app needed.',
    },
    {
        icon: '🔄',
        title: 'Adaptive Re-scheduling',
        body: 'Missed a day? The plan automatically rebalances so you still hit your target band before exam day.',
    },
];

const STEPS = [
    { step: '01', title: 'Take the Diagnostic', body: 'A quick 20-min test maps your current band and pinpoints every weak skill.' },
    { step: '02', title: 'Get Your Plan', body: 'We generate a daily schedule up to your exam date — Reading, Listening, Writing, Speaking.' },
    { step: '03', title: 'Train Daily', body: 'Complete bite-sized tasks. Practise with real exam-style questions. Review your errors.' },
    { step: '04', title: 'Track & Improve', body: 'Watch your band score rise on the analytics dashboard as your skills sharpen.' },
];

const PLANS = [
    {
        name: 'Free Trial',
        price: '$0',
        period: '15 days',
        highlight: false,
        cta: 'Start Free Trial',
        href: '/register',
        features: [
            'Full diagnostic test',
            'Personalised 15-day plan',
            'Reading & Listening practice',
            'Band analytics dashboard',
            'WhatsApp daily nudges',
        ],
    },
    {
        name: 'Monthly',
        price: '$10',
        period: 'per month',
        highlight: true,
        badge: 'Most Popular',
        cta: 'Get Started',
        href: '/register',
        features: [
            'Everything in Free Trial',
            'Unlimited practice tests',
            'Full mock exams (all 4 modules)',
            'Writing & Speaking prompts',
            'Adaptive plan rebalancing',
            'Priority WhatsApp support',
        ],
    },
    {
        name: 'Band 7+ Bundle',
        price: '$25',
        period: '3 months',
        highlight: false,
        cta: 'Commit to Band 7',
        href: '/register',
        features: [
            'Everything in Monthly',
            '3 months access',
            'Save $5 vs monthly',
            'Exclusive band 7+ strategy sessions',
            'Model answers for Writing tasks',
        ],
    },
];

const TESTIMONIALS = [
    {
        name: 'Farhan R.',
        score: 'Band 7.5 → Achieved',
        body: 'I was stuck at 6.5 for two attempts. IELTSLine\'s diagnostic showed my Reading skimming was the bottleneck. Four weeks later — 7.5. Unreal.',
    },
    {
        name: 'Anika S.',
        score: 'Band 8.0 → Achieved',
        body: 'The daily WhatsApp reminders kept me consistent when work got busy. The plan adjusted itself around my missed days. I couldn\'t have done it without this.',
    },
    {
        name: 'Mehedi H.',
        score: 'Band 7.0 → Achieved',
        body: 'Every other prep I tried was just PDFs. IELTSLine felt like a real coach — it knew exactly what I needed to work on each day.',
    },
];

const FAQS = [
    {
        q: 'Is this suitable for both Academic and General Training?',
        a: 'Yes. The platform covers both IELTS pathways. During onboarding you select your test type and all content is tailored accordingly.',
    },
    {
        q: 'What happens after my 15-day trial?',
        a: 'Your data and study plan are saved. You can subscribe for $10/month to continue where you left off — no data is lost.',
    },
    {
        q: 'Do I need to install anything?',
        a: 'No. IELTSLine is fully browser-based. Mobile apps are coming soon, but the web app works perfectly on any device.',
    },
    {
        q: 'How accurate is the band score prediction?',
        a: 'Our algorithm maps to the official IELTS raw-score band tables published by British Council / IDP. Writing and Speaking use self-marking with detailed rubrics.',
    },
    {
        q: 'Can I cancel at any time?',
        a: 'Yes. Cancel any time from your billing portal — no questions asked, no lock-in periods.',
    },
];

/* ─── component ─────────────────────────────────────────────────── */
export default function Landing() {
    return (
        <>
            <Head title="Achieve Your Target Band Score">
                <meta name="description" content="IELTSLine is the #1 personalised IELTS preparation platform. AI diagnostic, adaptive study plans, full exam simulation, and a WhatsApp coach — from $10/month." />
                <meta property="og:title" content="IELTSLine — Achieve Your Target Band Score" />
                <meta property="og:description" content="Personalised IELTS prep with AI diagnostics, daily study plans, and real exam simulation. Start free for 15 days." />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            <div className="bg-white text-gray-900 font-sans">

                {/* ── NAV ── */}
                <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <a href="/" className="text-xl font-bold text-indigo-600 tracking-tight">IELTSLine</a>
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
                            <a href="#how-it-works" className="hover:text-indigo-600 transition">How It Works</a>
                            <a href="#pricing" className="hover:text-indigo-600 transition">Pricing</a>
                            <a href="#faq" className="hover:text-indigo-600 transition">FAQ</a>
                        </nav>
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">Sign In</Link>
                            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                                Free Trial →
                            </Link>
                        </div>
                    </div>
                </header>

                {/* ── HERO ── */}
                <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white pt-24 pb-32 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-indigo-700/50 border border-indigo-500/40 rounded-full px-4 py-1.5 text-sm text-indigo-200 mb-8">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            15-day free trial — no credit card required
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                            Hit Your IELTS Target Band.<br />
                            <span className="text-indigo-300">Guaranteed Progress.</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto mb-10">
                            IELTSLine combines an AI diagnostic, a personalised daily study plan, full computer-delivered exam simulation, and a WhatsApp coach — everything a physical training centre offers, for $10/month.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-base px-8 py-4 rounded-xl shadow-lg transition"
                            >
                                Start Free 15-Day Trial
                            </Link>
                            <a
                                href="#how-it-works"
                                className="border border-indigo-400 text-indigo-100 hover:bg-indigo-800 font-semibold text-base px-8 py-4 rounded-xl transition"
                            >
                                See How It Works ↓
                            </a>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-indigo-300">
                            <span>✓ Band score prediction</span>
                            <span>✓ Adaptive study plan</span>
                            <span>✓ Real exam simulation</span>
                            <span>✓ WhatsApp coach</span>
                        </div>
                    </div>
                </section>

                {/* ── SOCIAL PROOF BAR ── */}
                <section className="bg-indigo-50 border-y border-indigo-100 py-8 px-4">
                    <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-12 text-center">
                        {[
                            { stat: '12,000+', label: 'Students trained' },
                            { stat: '94%', label: 'Improved their band' },
                            { stat: '4.9/5', label: 'Average rating' },
                            { stat: '6 weeks', label: 'Average to band goal' },
                        ].map(({ stat, label }) => (
                            <div key={label}>
                                <p className="text-3xl font-extrabold text-indigo-700">{stat}</p>
                                <p className="text-sm text-gray-500 mt-1">{label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── FEATURES ── */}
                <section id="features" className="py-24 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                                Everything You Need to Reach Band 7+
                            </h2>
                            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                                No more scattered YouTube videos and PDF downloads. IELTSLine is a complete end-to-end preparation system.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {FEATURES.map(({ icon, title, body }) => (
                                <div key={title} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition">
                                    <div className="text-4xl mb-4">{icon}</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── HOW IT WORKS ── */}
                <section id="how-it-works" className="py-24 px-4 bg-indigo-50">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">How IELTSLine Works</h2>
                            <p className="text-lg text-gray-500">From sign-up to exam day in four clear steps.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {STEPS.map(({ step, title, body }) => (
                                <div key={step} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                                    <div className="text-4xl font-extrabold text-indigo-100 mb-3">{step}</div>
                                    <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── PRICING ── */}
                <section id="pricing" className="py-24 px-4 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                            <p className="text-lg text-gray-500">Start free. Upgrade when you're ready. Cancel anytime.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {PLANS.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`rounded-2xl p-8 flex flex-col ${
                                        plan.highlight
                                            ? 'bg-indigo-600 text-white shadow-2xl ring-2 ring-indigo-400 scale-105'
                                            : 'bg-gray-50 text-gray-900'
                                    }`}
                                >
                                    {plan.badge && (
                                        <span className="self-start bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
                                            {plan.badge}
                                        </span>
                                    )}
                                    <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                                    <div className="flex items-end gap-1 mb-1">
                                        <span className="text-4xl font-extrabold">{plan.price}</span>
                                        <span className={`text-sm mb-1 ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>/{plan.period}</span>
                                    </div>

                                    <ul className="mt-6 space-y-3 flex-1">
                                        {plan.features.map((f) => (
                                            <li key={f} className="flex items-start gap-2 text-sm">
                                                <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-indigo-200' : 'text-indigo-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className={plan.highlight ? 'text-indigo-100' : 'text-gray-600'}>{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <a
                                        href={plan.href}
                                        className={`mt-8 block text-center font-bold py-3 rounded-xl transition ${
                                            plan.highlight
                                                ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                        {plan.cta}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── TESTIMONIALS ── */}
                <section className="py-24 px-4 bg-gray-50">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Real Students, Real Results</h2>
                            <p className="text-lg text-gray-500">Thousands of learners have already hit their target band with IELTSLine.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {TESTIMONIALS.map(({ name, score, body }) => (
                                <div key={name} className="bg-white rounded-2xl p-6 shadow-sm">
                                    <StarRating />
                                    <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6">"{body}"</p>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{name}</p>
                                        <p className="text-indigo-600 text-xs font-medium">{score}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section id="faq" className="py-24 px-4 bg-white">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        </div>

                        <div className="space-y-6">
                            {FAQS.map(({ q, a }) => (
                                <div key={q} className="border border-gray-200 rounded-xl p-6">
                                    <h3 className="font-bold text-gray-900 mb-2">{q}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FINAL CTA ── */}
                <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white py-24 px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
                            Your Exam Date Is Coming.<br />Start Preparing Today.
                        </h2>
                        <p className="text-indigo-200 text-lg mb-10">
                            Join thousands of IELTS candidates who replaced expensive coaching centres with IELTSLine and hit their target band in weeks.
                        </p>
                        <Link
                            href="/register"
                            className="inline-block bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-lg px-10 py-4 rounded-xl shadow-xl transition"
                        >
                            Start Your Free 15-Day Trial →
                        </Link>
                        <p className="text-indigo-300 text-sm mt-4">No credit card required. Cancel anytime.</p>
                    </div>
                </section>

                {/* ── FOOTER ── */}
                <footer className="bg-gray-900 text-gray-400 py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                            <div>
                                <h4 className="text-white font-bold text-lg mb-4">IELTSLine</h4>
                                <p className="text-sm leading-relaxed">
                                    The #1 personalised IELTS preparation platform. Adaptive plans, real exam simulation, and a WhatsApp coach.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Platform</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#features" className="hover:text-white transition">Features</a></li>
                                    <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                                    <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                                    <li><a href="/register" className="hover:text-white transition">Start Free Trial</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Account</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="/login" className="hover:text-white transition">Sign In</a></li>
                                    <li><a href="/register" className="hover:text-white transition">Create Account</a></li>
                                    <li><a href="/forgot-password" className="hover:text-white transition">Reset Password</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Company</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><span>MRH Murad LLC</span></li>
                                    <li><span>7901 4th St N STE</span></li>
                                    <li><span>St. Petersburg, FL 33702</span></li>
                                    <li><a href="mailto:support@ieltsline.com" className="hover:text-white transition">support@ieltsline.com</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                            <p>© {new Date().getFullYear()} IELTSLine · MRH Murad LLC. All rights reserved.</p>
                            <p>Developed by <a href="https://setupline.com" className="text-indigo-400 hover:text-indigo-300 transition" target="_blank" rel="noopener noreferrer">Setupline</a></p>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
