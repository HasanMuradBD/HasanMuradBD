const TYPE_META = {
    vocabulary: {
        label: 'Word of the Day',
        icon: '📚',
        gradient: 'from-violet-600 to-indigo-600',
        badge: 'bg-violet-100 text-violet-700',
        accent: 'text-violet-600',
        border: 'border-violet-100',
    },
    grammar: {
        label: 'Grammar Tip',
        icon: '✏️',
        gradient: 'from-emerald-600 to-teal-600',
        badge: 'bg-emerald-100 text-emerald-700',
        accent: 'text-emerald-600',
        border: 'border-emerald-100',
    },
    exam_tip: {
        label: 'Exam Strategy',
        icon: '🎯',
        gradient: 'from-amber-500 to-orange-500',
        badge: 'bg-amber-100 text-amber-700',
        accent: 'text-amber-600',
        border: 'border-amber-100',
    },
};

export default function DailyTipCard({ tip }) {
    if (!tip) return null;

    const meta = TYPE_META[tip.type] ?? TYPE_META.exam_tip;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className={`rounded-2xl border ${meta.border} bg-white overflow-hidden shadow-sm`}>
            {/* Coloured header strip */}
            <div className={`bg-gradient-to-r ${meta.gradient} px-5 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <span className="text-lg">{meta.icon}</span>
                    <span className="text-white text-xs font-bold uppercase tracking-widest">{meta.label}</span>
                </div>
                <span className="text-white/70 text-xs">{today}</span>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
                <h3 className={`text-base font-bold mb-2 ${meta.accent}`}>{tip.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tip.content}</p>

                {tip.example && (
                    <div className={`mt-3 pl-3 border-l-2 ${meta.border.replace('border-', 'border-l-').replace('100', '400')}`}>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-medium">Example</p>
                        <p className="text-gray-500 text-sm italic">"{tip.example}"</p>
                    </div>
                )}

                {/* Type badge */}
                <div className="mt-4">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${meta.badge}`}>
                        {meta.label}
                    </span>
                </div>
            </div>
        </div>
    );
}
