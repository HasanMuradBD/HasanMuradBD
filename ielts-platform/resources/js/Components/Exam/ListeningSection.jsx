import { useRef, useState } from 'react';
import { useExamStore } from '@/store/examStore';

function ListeningQuestion({ question }) {
    const { answers, setAnswer, flagged, toggleFlag } = useExamStore();
    const answer = answers[question.id] ?? '';
    const isFlagged = flagged.has(question.id);

    return (
        <div className={`p-4 rounded-lg border mb-3 ${isFlagged ? 'border-amber-400 bg-amber-950/30' : 'border-gray-700 bg-gray-800'}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-indigo-400 font-bold text-sm flex-shrink-0">Q{question.sequence}</span>
                <p className="text-gray-200 text-sm flex-1">{question.question_text}</p>
                <button
                    onClick={() => toggleFlag(question.id)}
                    className={`flex-shrink-0 text-xs px-2 py-1 rounded border transition ${
                        isFlagged ? 'border-amber-400 text-amber-400' : 'border-gray-600 text-gray-500 hover:border-amber-400'
                    }`}
                >
                    {isFlagged ? '⚑' : '⚐'}
                </button>
            </div>

            {question.question_type === 'multiple_choice' ? (
                <div className="flex gap-2">
                    {['A','B','C','D'].map(opt => (
                        <button key={opt} onClick={() => setAnswer(question.id, opt)}
                            className={`w-10 h-10 text-sm font-bold rounded-lg border transition ${
                                answer === opt ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-gray-600 text-gray-400 hover:border-indigo-400'
                            }`}>
                            {opt}
                        </button>
                    ))}
                </div>
            ) : (
                <input type="text" value={answer} onChange={e => setAnswer(question.id, e.target.value)}
                    placeholder="Write your answer"
                    className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-1.5 focus:border-indigo-400 outline-none" />
            )}
        </div>
    );
}

export default function ListeningSection({ questions }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [audioStarted, setAudioStarted] = useState(false);

    // Group by section
    const sections = questions.reduce((acc, q) => {
        const s = q.section_number ?? 1;
        (acc[s] ??= []).push(q);
        return acc;
    }, {});

    const handlePlay = () => {
        if (!audioRef.current) return;
        if (!audioStarted) setAudioStarted(true);
        // Real implementation: audioRef.current.play();
        setPlaying(true);
    };

    return (
        <div className="h-full flex overflow-hidden">
            {/* Left: Audio player */}
            <div className="w-2/5 h-full flex flex-col border-r border-gray-700 p-6">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-medium">Audio Track</div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-4">
                    <div className="text-center mb-6">
                        <div className={`text-5xl mb-2 ${playing ? 'animate-pulse' : ''}`}>
                            {playing ? '🔊' : '🎧'}
                        </div>
                        <p className="text-sm text-gray-400">
                            {audioStarted ? 'Audio playing — listen carefully' : 'Click play to begin. Audio plays once only.'}
                        </p>
                    </div>

                    {/* Fake audio progress bar */}
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mb-4">
                        <div className="bg-indigo-500 h-1.5 rounded-full w-0 transition-all duration-1000"
                             style={{ width: playing ? '35%' : '0%' }} />
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={handlePlay}
                            disabled={audioStarted}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium text-sm transition"
                        >
                            {audioStarted ? 'Playing...' : '▶ Play'}
                        </button>
                    </div>

                    <p className="text-xs text-amber-400 text-center mt-4">
                        ⚠ Audio plays once. No rewind in IELTS exam conditions.
                    </p>
                </div>

                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-xs text-gray-400">
                    <p className="font-medium text-gray-300 mb-2">Exam instructions:</p>
                    <ul className="space-y-1">
                        <li>• Write answers as you listen</li>
                        <li>• Spelling must be correct</li>
                        <li>• Maximum 3 words per answer unless stated</li>
                        <li>• Numbers can be written as figures</li>
                    </ul>
                </div>
            </div>

            {/* Right: Questions by section */}
            <div className="w-3/5 h-full overflow-y-auto p-6">
                {Object.entries(sections).map(([sectionNum, sectionQs]) => (
                    <div key={sectionNum} className="mb-8">
                        <div className="text-xs text-indigo-400 uppercase tracking-widest font-medium mb-3">
                            Section {sectionNum} — Questions {sectionQs[0].sequence}–{sectionQs[sectionQs.length - 1].sequence}
                        </div>
                        {sectionQs.map(q => <ListeningQuestion key={q.id} question={q} />)}
                    </div>
                ))}
            </div>
        </div>
    );
}
