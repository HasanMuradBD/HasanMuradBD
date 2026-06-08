import { Head, router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { useExamStore } from '@/store/examStore';
import ExamTimer from '@/Components/ExamTimer';
import ReadingSection from '@/Components/Exam/ReadingSection';
import ListeningSection from '@/Components/Exam/ListeningSection';
import WritingSection from '@/Components/Exam/WritingSection';
import SpeakingSection from '@/Components/Exam/SpeakingSection';

export default function Attempt({ attempt, test, duration }) {
    const { init, submitted, answers, flagged, currentSection, setSection } = useExamStore();
    const submitInProgress = useRef(false);

    useEffect(() => {
        init(attempt.id, duration);
    }, []);

    // Group questions by module (fall back to test.module when question.module is null)
    const byModule = (test.questions ?? []).reduce((acc, q) => {
        const mod = q.module ?? test.module;
        (acc[mod] ??= []).push(q);
        return acc;
    }, {});

    // Writing/Speaking tests have no questions — derive modules from test.module directly
    const modules = Object.keys(byModule).length > 0
        ? Object.keys(byModule)
        : (test.module === 'full'
            ? ['reading', 'listening', 'writing', 'speaking']
            : [test.module].filter(Boolean));

    const activeModule = modules[currentSection - 1] ?? modules[0];
    const questions = byModule[activeModule] ?? [];

    const handleSubmit = (timedOut = false) => {
        if (submitInProgress.current || submitted) return;
        submitInProgress.current = true;
        const s = useExamStore.getState();
        router.post(route('test-attempts.submit', attempt.id), {
            answers:       s.answers,
            writing_texts: s.writingTexts,
            timed_out:     timedOut,
        });
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="text-5xl mb-4">⏳</div>
                    <p className="text-xl font-semibold">Submitting your answers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col" style={{ userSelect: 'none' }}>
            <Head title={`${test.title} — IELTSLine`} />

            {/* Exam Top Bar */}
            <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <span className="text-white font-bold text-sm">IELTSLine</span>
                    <span className="text-gray-400 text-sm">|</span>
                    <span className="text-gray-300 text-sm">{test.title}</span>
                </div>
                <ExamTimer attemptId={attempt.id} />
                <button
                    onClick={handleSubmit}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
                >
                    Submit Test
                </button>
            </header>

            {/* Module tabs */}
            {modules.length > 1 && (
                <div className="bg-gray-800 border-b border-gray-700 px-4 flex gap-1 flex-shrink-0">
                    {modules.map((mod, i) => (
                        <button
                            key={mod}
                            onClick={() => setSection(i + 1)}
                            className={`px-4 py-2.5 text-sm font-medium capitalize transition border-b-2 ${
                                currentSection === i + 1
                                    ? 'border-indigo-400 text-indigo-300'
                                    : 'border-transparent text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            {mod}
                            {byModule[mod] && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                                    byModule[mod].filter(q => useExamStore.getState().answers[q.id]).length === byModule[mod].length
                                        ? 'bg-green-700 text-green-200'
                                        : 'bg-gray-700 text-gray-300'
                                }`}>
                                    {byModule[mod].filter(q => useExamStore.getState().answers[q.id]).length}/{byModule[mod].length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Exam Content */}
            <main className="flex-1 overflow-hidden">
                {activeModule === 'reading' && <ReadingSection questions={questions} />}
                {activeModule === 'listening' && <ListeningSection questions={questions} test={test} />}
                {activeModule === 'writing' && <WritingSection questions={questions} test={test} />}
                {activeModule === 'speaking' && <SpeakingSection questions={questions} test={test} />}
            </main>
        </div>
    );
}
