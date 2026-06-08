import { useRef, useState, useEffect } from 'react';
import { useExamStore } from '@/store/examStore';

/* ──────────────────────────────────────────────────────────────────────────
   STICKY TOP AUDIO PLAYER
   - Plays exactly ONCE (MAX_PLAYS = 1)
   - No scrub bar interaction: progress bar is display-only, never seekable
   - No pause control exposed once playing — matches real IELTS conditions
   ────────────────────────────────────────────────────────────────────────── */
function StickyAudioPlayer({ audioUrl }) {
    const audioRef = useRef(null);
    const [phase, setPhase]             = useState('idle');  // idle | playing | ended
    const [plays, setPlays]             = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration]       = useState(0);
    const MAX_PLAYS = 1;

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        const onMeta  = () => setDuration(el.duration || 0);
        const onTime  = () => setCurrentTime(el.currentTime);
        const onPlay  = () => setPhase('playing');
        const onEnded = () => { setPhase('ended'); setPlays(n => n + 1); };
        el.addEventListener('loadedmetadata', onMeta);
        el.addEventListener('timeupdate', onTime);
        el.addEventListener('play', onPlay);
        el.addEventListener('ended', onEnded);
        return () => {
            el.removeEventListener('loadedmetadata', onMeta);
            el.removeEventListener('timeupdate', onTime);
            el.removeEventListener('play', onPlay);
            el.removeEventListener('ended', onEnded);
        };
    }, []);

    const play = () => {
        if (!audioRef.current || plays >= MAX_PLAYS || phase === 'playing') return;
        audioRef.current.play().catch(() => {});
    };

    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    const pct = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
    const canPlay = audioUrl && plays < MAX_PLAYS && phase !== 'playing';

    return (
        <div className="bg-gray-800 border-b border-gray-700 px-5 py-3 flex items-center gap-4">
            {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

            {/* Play button */}
            <button
                onClick={play}
                disabled={!canPlay}
                className="flex-shrink-0 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition"
            >
                {phase === 'playing'
                    ? <><span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Playing</>
                    : phase === 'ended' ? '✓ Complete' : '▶ Play Audio'}
            </button>

            {/* Display-only progress bar (NOT seekable) */}
            <div className="flex-1">
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{fmt(currentTime)}</span>
                    <span className={plays >= MAX_PLAYS ? 'text-red-400' : 'text-amber-400'}>
                        {!audioUrl
                            ? 'No audio attached'
                            : plays >= MAX_PLAYS
                                ? '⛔ Plays once only — used'
                                : '⚠ This audio plays once only'}
                    </span>
                    <span>{duration ? fmt(duration) : '--:--'}</span>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────────────────────────────────
   INLINE BLANK RENDERER
   Splits question_text on a blank marker and drops an inline input where the
   blank is. Markers accepted: "[____]", "____" (4+ underscores), or "{answer}".
   If no marker is found, the input renders after the prompt text.
   ────────────────────────────────────────────────────────────────────────── */
const BLANK_RE = /\[_+\]|_{4,}|\{answer\}/i;

function InlineCompletion({ question, value, onChange }) {
    const text = question.question_text ?? '';
    const hasBlank = BLANK_RE.test(text);

    const InputBox = (
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="answer"
            className="inline-block align-baseline mx-1 min-w-[8rem] bg-gray-700/80 border-b-2 border-indigo-400 text-white text-sm rounded-t px-2 py-0.5 focus:bg-gray-700 outline-none placeholder-gray-600"
        />
    );

    if (!hasBlank) {
        return (
            <span className="text-gray-200 text-sm leading-relaxed">
                {text} {InputBox}
            </span>
        );
    }

    const [before, after] = text.split(BLANK_RE);
    return (
        <span className="text-gray-200 text-sm leading-relaxed">
            {before}{InputBox}{after}
        </span>
    );
}

/* ──────────────────────────────────────────────────────────────────────────
   MATCHING / LABELLING DROPDOWN
   Uses question.options. Each option may be a string or {value,label}.
   ────────────────────────────────────────────────────────────────────────── */
function MatchingSelect({ question, value, onChange }) {
    const opts = (question.options ?? []).map(o =>
        typeof o === 'string' ? { value: o, label: o } : o
    );
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:border-indigo-400 outline-none min-w-[12rem]"
        >
            <option value="">— Select —</option>
            {opts.map((o, i) => (
                <option key={i} value={o.value}>{o.label}</option>
            ))}
        </select>
    );
}

/* ──────────────────────────────────────────────────────────────────────────
   MULTIPLE CHOICE
   Uses question.options for the choice text; falls back to bare A–D letters.
   ────────────────────────────────────────────────────────────────────────── */
function MultipleChoice({ question, value, onChange }) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const raw = question.options ?? [];

    // Build [{value, label}] — pair each option with a letter for the answer key.
    const choices = raw.length
        ? raw.map((o, i) => typeof o === 'string'
            ? { value: letters[i], label: o }
            : { value: o.value ?? letters[i], label: o.label ?? o.value })
        : letters.slice(0, 4).map(l => ({ value: l, label: l }));

    return (
        <div className="space-y-2">
            {choices.map(c => {
                const selected = value === c.value;
                return (
                    <button
                        key={c.value}
                        onClick={() => onChange(c.value)}
                        className={`w-full flex items-center gap-3 text-left text-sm rounded-lg border px-3 py-2.5 transition ${
                            selected
                                ? 'bg-indigo-600 border-indigo-400 text-white'
                                : 'border-gray-600 text-gray-300 hover:border-indigo-400 hover:text-indigo-200'
                        }`}
                    >
                        <span className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                            selected ? 'bg-white text-indigo-700' : 'bg-gray-700 text-gray-400'
                        }`}>
                            {c.value}
                        </span>
                        {c.label}
                    </button>
                );
            })}
        </div>
    );
}

/* ── Single question row ─────────────────────────────────────────────────── */
const DROPDOWN_TYPES = ['matching_headings', 'matching_information', 'matching_features', 'map_labelling', 'diagram_labelling'];

function ListeningQuestion({ question }) {
    const { answers, setAnswer, flagged, toggleFlag } = useExamStore();
    const answer = answers[question.id] ?? '';
    const isFl   = flagged.has(question.id);
    const done   = String(answer).trim().length > 0;

    const isMC       = question.question_type === 'multiple_choice';
    const isDropdown = DROPDOWN_TYPES.includes(question.question_type);

    const onChange = v => setAnswer(question.id, v);

    return (
        <div
            id={`lq-${question.id}`}
            className={`p-4 rounded-xl border mb-3 transition ${
                isFl ? 'border-amber-500/60 bg-amber-950/20'
                     : done ? 'border-green-700/40 bg-green-950/10'
                            : 'border-gray-700 bg-gray-800/50'
            }`}
        >
            <div className="flex items-start gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                    done ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                    {question.sequence}
                </span>

                <div className="flex-1">
                    {isMC ? (
                        <>
                            <p className="text-gray-200 text-sm leading-relaxed mb-3">{question.question_text}</p>
                            <MultipleChoice question={question} value={answer} onChange={onChange} />
                        </>
                    ) : isDropdown ? (
                        <div className="flex items-center gap-3 flex-wrap">
                            <p className="text-gray-200 text-sm leading-relaxed flex-1 min-w-[10rem]">{question.question_text}</p>
                            <MatchingSelect question={question} value={answer} onChange={onChange} />
                        </div>
                    ) : (
                        // form / note / sentence / summary / short-answer completion
                        <InlineCompletion question={question} value={answer} onChange={onChange} />
                    )}
                </div>

                <button
                    onClick={() => toggleFlag(question.id)}
                    className={`flex-shrink-0 text-xs px-2 py-1 rounded border transition ${
                        isFl ? 'border-amber-500 text-amber-400'
                             : 'border-gray-600 text-gray-500 hover:border-amber-500 hover:text-amber-400'
                    }`}
                >
                    {isFl ? '⚑' : '⚐'}
                </button>
            </div>
        </div>
    );
}

/* ── Listening section layout ────────────────────────────────────────────── */
export default function ListeningSection({ questions, test }) {
    const audioUrl = test.audio_file_path ?? test.audio_url ?? null;

    const sections = questions.reduce((acc, q) => {
        const s = q.section_number ?? 1;
        (acc[s] ??= []).push(q);
        return acc;
    }, {});

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* STICKY TOP: audio player */}
            <div className="sticky top-0 z-10 flex-shrink-0">
                <StickyAudioPlayer audioUrl={audioUrl} />
            </div>

            {/* Scrollable question sheet */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-5 py-6">
                    {Object.entries(sections).map(([sec, qs]) => (
                        <div key={sec} className="mb-8">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-indigo-400 uppercase tracking-widest font-bold">Section {sec}</span>
                                <span className="text-xs text-gray-500">
                                    · Questions {qs[0].sequence}–{qs[qs.length - 1].sequence}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.
                            </p>
                            {qs.map(q => <ListeningQuestion key={q.id} question={q} />)}
                        </div>
                    ))}

                    {questions.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            <p className="text-4xl mb-3">🎧</p>
                            <p>No questions loaded for this listening test yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
