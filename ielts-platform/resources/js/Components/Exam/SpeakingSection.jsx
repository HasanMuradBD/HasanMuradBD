import { useState, useRef } from 'react';
import { useExamStore } from '@/store/examStore';

const PART_META = {
    part_1: { label: 'Part 1', desc: 'Introduction & interview — familiar topics', duration: 240, prep: 0 },
    part_2: { label: 'Part 2', desc: 'Individual long turn — cue card task',       duration: 120, prep: 60 },
    part_3: { label: 'Part 3', desc: 'Two-way discussion — abstract topics',        duration: 240, prep: 0 },
};

function SpeakingPart({ prompt, partKey, isActive, onDone }) {
    const { setAnswer } = useExamStore();
    const meta = PART_META[partKey] ?? { label: partKey, desc: '', duration: 120, prep: 0 };

    const [phase, setPhase]     = useState('locked');  // locked | ready | prep | recording | done
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef(null);
    const recRef   = useRef(null);
    const chunks   = useRef([]);

    // Unlock when isActive becomes true
    if (isActive && phase === 'locked') setPhase('ready');

    const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    const tick = (from, onZero) => {
        setTimeLeft(from);
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { clearInterval(timerRef.current); onZero(); return 0; }
                return t - 1;
            });
        }, 1000);
    };

    const beginRecording = async () => {
        setPhase('recording');
        tick(meta.duration, () => recRef.current?.stop());
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const rec = new MediaRecorder(stream);
            recRef.current = rec;
            chunks.current = [];
            rec.ondataavailable = e => chunks.current.push(e.data);
            rec.onstop = () => {
                stream.getTracks().forEach(t => t.stop());
                setAnswer(partKey, `[recorded:${partKey}]`);
                clearInterval(timerRef.current);
                setPhase('done');
                onDone?.();
            };
            rec.start();
        } catch {
            setAnswer(partKey, '[mic_unavailable]');
            clearInterval(timerRef.current);
            setPhase('done');
            onDone?.();
        }
    };

    const startPrep = () => {
        if (meta.prep === 0) { beginRecording(); return; }
        setPhase('prep');
        tick(meta.prep, beginRecording);
    };

    const stopEarly = () => {
        clearInterval(timerRef.current);
        recRef.current?.stop();
    };

    const phaseColor = {
        locked:    'border-gray-700/50 bg-gray-800/30 opacity-50',
        ready:     'border-indigo-600/50 bg-gray-800',
        prep:      'border-amber-600/50 bg-amber-950/10',
        recording: 'border-red-600/50 bg-red-950/10',
        done:      'border-green-700/50 bg-green-950/10',
    };

    return (
        <div className={`border rounded-xl p-5 transition-all ${phaseColor[phase]}`}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${
                        phase === 'recording' ? 'text-red-400'
                        : phase === 'prep'      ? 'text-amber-400'
                        : phase === 'done'      ? 'text-green-400'
                        : phase === 'locked'    ? 'text-gray-600'
                        : 'text-indigo-400'
                    }`}>{meta.label}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{meta.desc}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    {(phase === 'prep' || phase === 'recording') && (
                        <p className={`font-mono text-xl font-bold tabular-nums ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : phase === 'prep' ? 'text-amber-400' : 'text-white'}`}>
                            {fmt(timeLeft)}
                        </p>
                    )}
                    {phase === 'done' && <span className="text-green-400 text-sm font-medium">✓ Recorded</span>}
                    {phase === 'locked' && <span className="text-gray-600 text-sm">🔒</span>}
                </div>
            </div>

            {/* Cue card */}
            {prompt?.cue_card_notes && (
                <div className="bg-yellow-950/30 border border-yellow-700/40 rounded-lg p-4 mb-4">
                    <p className="text-yellow-200 text-sm font-semibold mb-2">{prompt.topic}</p>
                    <p className="text-xs text-yellow-300/60 mb-1 font-medium">You should say:</p>
                    <pre className="text-yellow-100/80 text-xs leading-5 whitespace-pre-wrap font-sans">{prompt.cue_card_notes}</pre>
                </div>
            )}

            {/* Follow-up questions */}
            {prompt?.follow_up_questions?.length > 0 && (
                <div className="mb-4 space-y-2">
                    {prompt.follow_up_questions.map((q, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-indigo-400 font-bold flex-shrink-0">{i + 1}.</span>
                            <span className="text-gray-300">{q}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Prompt text fallback */}
            {!prompt?.cue_card_notes && prompt?.prompt_text && (
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{prompt.prompt_text}</p>
            )}

            {/* Phase banners */}
            {phase === 'prep' && (
                <div className="flex items-center gap-2 bg-amber-950/30 rounded-lg px-3 py-2 mb-4 text-xs text-amber-200">
                    ⏱ Preparation time — organise your ideas before recording begins
                </div>
            )}
            {phase === 'recording' && (
                <div className="flex items-center gap-2 bg-red-950/30 rounded-lg px-3 py-2 mb-4">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping flex-shrink-0" />
                    <span className="text-xs text-red-300 font-medium">Recording — speak clearly and at a natural pace</span>
                </div>
            )}

            {/* Actions */}
            {phase === 'ready' && (
                <button onClick={startPrep}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
                    {meta.prep > 0 ? '📋 Start Preparation (1 min)' : '🎤 Start Recording'}
                </button>
            )}
            {phase === 'prep' && (
                <button onClick={() => { clearInterval(timerRef.current); beginRecording(); }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
                    🎤 Start Recording Now
                </button>
            )}
            {phase === 'recording' && (
                <button onClick={stopEarly}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
                    ⏹ Stop Early
                </button>
            )}
        </div>
    );
}

export default function SpeakingSection({ test }) {
    const prompts = test.speaking_prompts ?? [];
    const [done, setDone] = useState(new Set());

    const isActive = (partKey, idx) => {
        if (idx === 0) return true;
        return done.has(prompts[idx - 1]?.part_number);
    };

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="bg-indigo-900/20 border border-indigo-700/40 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🎙</span>
                    <div>
                        <p className="text-sm font-semibold text-indigo-200 mb-0.5">Speaking Module</p>
                        <p className="text-xs text-indigo-300/70">
                            Complete parts in order. Part 2 includes 1-minute preparation before recording.
                            Allow microphone access when prompted. Speak naturally and fluently.
                        </p>
                    </div>
                </div>

                {prompts.length > 0 ? (
                    prompts.map((p, i) => (
                        <SpeakingPart
                            key={p.id}
                            prompt={p}
                            partKey={p.part_number}
                            isActive={isActive(p.part_number, i)}
                            onDone={() => setDone(prev => new Set([...prev, p.part_number]))}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <p className="text-4xl mb-3">🎤</p>
                        <p className="font-medium">No speaking prompts available for this test.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
