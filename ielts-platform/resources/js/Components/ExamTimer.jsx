import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useExamStore } from '@/store/examStore';

export default function ExamTimer({ attemptId }) {
    const { timeRemaining, timerActive, tick, markSubmitted, answers } = useExamStore();

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    const fmt = (n) => String(n).padStart(2, '0');

    const isWarning = timeRemaining <= 300; // last 5 mins

    useEffect(() => {
        if (!timerActive) return;
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [timerActive, tick]);

    useEffect(() => {
        if (timeRemaining === 0 && !useExamStore.getState().submitted) {
            markSubmitted();
            router.post(route('test-attempts.submit', attemptId), {
                answers: useExamStore.getState().answers,
                timed_out: true,
            });
        }
    }, [timeRemaining]);

    return (
        <div className={`flex items-center gap-2 font-mono text-lg font-bold px-4 py-2 rounded-lg ${
            isWarning ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-indigo-100 text-indigo-700'
        }`}>
            <span>⏱</span>
            <span>{hours > 0 ? `${fmt(hours)}:` : ''}{fmt(minutes)}:{fmt(seconds)}</span>
        </div>
    );
}
