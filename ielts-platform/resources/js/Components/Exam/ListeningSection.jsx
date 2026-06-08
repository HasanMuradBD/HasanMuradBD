import { useRef, useState, useEffect } from 'react';
import { useExamStore } from '@/store/examStore';

function AudioPlayer({ audioUrl }) {
    const audioRef = useRef(null);
    const [phase, setPhase]         = useState('idle');   // idle | playing | paused | ended
    const [plays, setPlays]         = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration]   = useState(0);
    const MAX_PLAYS = 1;

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        const onMeta  = () => setDuration(el.duration);
        const onTime  = () => setCurrentTime(el.currentTime);
        const onPlay  = () => setPhase('playing');
        const onPause = () => setPhase(p => p !== 'ended' ? 'paused' : p);
        const onEnded = () => { setPhase('ended'); setPlays(n => n + 1); };
        el.addEventListener('loadedmetadata', onMeta);
        el.addEventListener('timeupdate', onTime);
        el.addEventListener('play', onPlay);
        el.addEventListener('pause', onPause);
        el.addEventListener('ended', onEnded);
        return () => {
            el.removeEventListener('loadedmetadata', onMeta);
            el.removeEventListener('timeupdate', onTime);
            el.removeEventListener('play', onPlay);
            el.removeEventListener('pause', onPause);
            el.removeEventListener('ended', onEnded);
        };
    }, []);

    const play = () => {
        if (!audioRef.current || plays >= MAX_PLAYS) return;
        audioRef.current.play();
    };

    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    const pct = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
    const canPlay = audioUrl && plays < MAX_PLAYS && phase !== 'playing';

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

            <div className="text-center mb-4">
                <div className={`text-4xl mb-2 ${phase === 'playing' ? 'animate-pulse' : ''}`}>
                    {phase === 'ended' ? '✅' : phase === 'playing' ? '🔊' : '🎧'}
                </div>
                <p className="text-sm text-gray-300 font-medium">
                    {!audioUrl         ? 'No audio file attached to this test'
                    : phase === 'idle'    ? 'Click Play when ready to begin'
                    : phase === 'playing' ? 'Listening — write answers now'
                    : phase === 'paused'  ? 'Audio paused'
                    :                      'Audio complete'}
                </p>
            </div>

            {audioUrl && (
                <div className="mb-4">
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1.5">
                        <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{fmt(currentTime)}</span>
                        <span>{duration ? fmt(duration) : '--:--'}</span>
                    </div>
                </div>
            )}

            <button onClick={play} disabled={!canPlay}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition">
                {phase === 'playing' ? (
                    <><span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Playing...</>
                ) : phase === 'ended' ? '✓ Complete' : '▶ Play Audio'}
            </button>

            <p className={`text-xs text-center mt-3 ${plays >= MAX_PLAYS ? 'text-red-400' : 'text-amber-400'}`}>
                {plays >= MAX_PLAYS ? '⛔ Audio limit reached (1/1 play used)' : '⚠ Plays once only — IELTS exam conditions'}
            </p>
        </div>
    );
}

function ListeningQuestion({ question }) {
    const { answers, setAnswer, flagged, toggleFlag } = useExamStore();
    const answer = answers[question.id] ?? '';
    const isFl   = flagged.has(question.id);
    const done   = answer.trim().length > 0;

    return (
        <div id={`lq-${question.id}`}
            className={`p-4 rounded-xl border mb-3 transition ${isFl ? 'border-amber-500/60 bg-amber-950/20' : done ? 'border-green-700/40 bg-green-950/10' : 'border-gray-700 bg-gray-800/50'}`}>
            <div className="flex items-start gap-3 mb-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${done ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    {question.sequence}
                </span>
                <p className="text-gray-200 text-sm leading-relaxed flex-1">{question.question_text}</p>
                <button onClick={() => toggleFlag(question.id)}
                    className={`flex-shrink-0 text-xs px-2 py-1 rounded border transition ${isFl ? 'border-amber-500 text-amber-400' : 'border-gray-600 text-gray-500 hover:border-amber-500 hover:text-amber-400'}`}>
                    {isFl ? '⚑' : '⚐'}
                </button>
            </div>
            {question.question_type === 'multiple_choice' ? (
                <div className="flex gap-2">
                    {['A','B','C','D'].map(opt => (
                        <button key={opt} onClick={() => setAnswer(question.id, opt)}
                            className={`w-10 h-10 text-sm font-bold rounded-lg border transition ${answer === opt ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-gray-600 text-gray-400 hover:border-indigo-400 hover:text-indigo-300'}`}>
                            {opt}
                        </button>
                    ))}
                </div>
            ) : (
                <input type="text" value={answer} onChange={e => setAnswer(question.id, e.target.value)}
                    placeholder="Write your answer (max 3 words)"
                    className="w-full bg-gray-700/80 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:border-indigo-400 outline-none placeholder-gray-600" />
            )}
        </div>
    );
}

export default function ListeningSection({ questions, test }) {
    const audioUrl = test.audio_file_path ?? test.audio_url ?? null;
    const sections = questions.reduce((acc, q) => {
        const s = q.section_number ?? 1;
        (acc[s] ??= []).push(q);
        return acc;
    }, {});

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-2/5 flex flex-col gap-4 border-r border-gray-700 p-5 overflow-y-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">Audio Track</span>
                <AudioPlayer audioUrl={audioUrl} />
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-xs text-gray-400 space-y-1.5">
                    <p className="font-semibold text-gray-300 mb-2">Exam instructions</p>
                    <p>• Write answers as you listen</p>
                    <p>• Spelling counts — check carefully</p>
                    <p>• Max 3 words per answer unless stated</p>
                    <p>• Numbers may be written as figures</p>
                    <p>• Transfer time given at end of section</p>
                </div>
            </div>
            <div className="w-3/5 overflow-y-auto p-5">
                {Object.entries(sections).map(([sec, qs]) => (
                    <div key={sec} className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-indigo-400 uppercase tracking-widest font-bold">Section {sec}</span>
                            <span className="text-xs text-gray-500">· Questions {qs[0].sequence}–{qs[qs.length - 1].sequence}</span>
                        </div>
                        {qs.map(q => <ListeningQuestion key={q.id} question={q} />)}
                    </div>
                ))}
                {questions.length === 0 && (
                    <div className="text-center py-16 text-gray-500">
                        <p className="text-4xl mb-3">🎧</p>
                        <p>No questions loaded. Listen to the audio and check back.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
