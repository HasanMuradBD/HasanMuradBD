import { useRef, useState, useEffect } from 'react';
import { useExamStore } from '@/store/examStore';

/* ──────────────────────────────────────────────────────────────────────────
   STICKY TOP AUDIO PLAYER
   - Plays exactly ONCE (MAX_PLAYS = 1)
   - Progress bar is display-only (never seekable); no pause exposed
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
            <button
                onClick={play}
                disabled={!canPlay}
                className="flex-shrink-0 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition"
            >
                {phase === 'playing'
                    ? <><span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Playing</>
                    : phase === 'ended' ? '✓ Complete' : '▶ Play Audio'}
            </button>
            <div className="flex-1">
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-500 h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{fmt(currentTime)}</span>
                    <span className={plays >= MAX_PLAYS ? 'text-red-400' : 'text-amber-400'}>
                        {!audioUrl ? 'No audio attached'
                            : plays >= MAX_PLAYS ? '⛔ Plays once only — used'
                            : '⚠ This audio plays once only'}
                    </span>
                    <span>{duration ? fmt(duration) : '--:--'}</span>
                </div>
            </div>
        </div>
    );
}

/* ── Render-category classification ──────────────────────────────────────── */
const DROPDOWN_TYPES = ['matching_headings', 'matching_information', 'matching_features', 'map_labelling', 'diagram_labelling'];

function categoryOf(type) {
    if (type === 'multiple_choice') return 'mc';
    if (DROPDOWN_TYPES.includes(type)) return 'matching';
    return 'completion'; // form / note / sentence / summary / short_answer
}

const INSTRUCTIONS = {
    completion: 'Complete the notes below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
    mc:         'Choose the correct letter, A, B or C.',
    matching:   'Choose your answer from the dropdown for each item.',
};

const BLANK_RE = /\[_+\]|_{4,}|\{answer\}/i;

/* ── Field-level inputs (no card wrappers) ───────────────────────────────── */

function blankInput(value, onChange) {
    return (
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="inline-block align-baseline mx-1 w-40 bg-gray-800 border-b-2 border-indigo-400/70 text-white text-sm px-2 py-0.5 rounded-t focus:border-indigo-400 focus:bg-gray-700 outline-none"
        />
    );
}

/* One completion row: "<num>  Label: [input] (hint)" rendered inline. */
function CompletionRow({ question }) {
    const { answers, setAnswer } = useExamStore();
    const value = answers[question.id] ?? '';
    const onChange = v => setAnswer(question.id, v);
    const text = question.question_text ?? '';

    let body;
    if (BLANK_RE.test(text)) {
        const [before, after] = text.split(BLANK_RE);
        body = <>{before}{blankInput(value, onChange)}{after}</>;
    } else {
        body = <>{text} {blankInput(value, onChange)}</>;
    }

    return (
        <div className="flex items-baseline gap-3 py-1.5">
            <span className="flex-shrink-0 w-6 text-right text-sm font-semibold text-indigo-400">{question.sequence}</span>
            <span className="text-gray-200 text-[0.95rem] leading-relaxed">{body}</span>
        </div>
    );
}

/* Compact multiple choice: prompt then inline A/B/C radio chips. */
function McRow({ question }) {
    const { answers, setAnswer } = useExamStore();
    const value = answers[question.id] ?? '';
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const raw = question.options ?? [];
    const choices = raw.length
        ? raw.map((o, i) => typeof o === 'string' ? { value: letters[i], label: o } : { value: o.value ?? letters[i], label: o.label ?? o.value })
        : letters.slice(0, 3).map(l => ({ value: l, label: '' }));

    return (
        <div className="flex items-baseline gap-3 py-2.5">
            <span className="flex-shrink-0 w-6 text-right text-sm font-semibold text-indigo-400">{question.sequence}</span>
            <div className="flex-1">
                <p className="text-gray-200 text-[0.95rem] leading-relaxed mb-1.5">{question.question_text}</p>
                <div className="flex flex-col gap-1">
                    {choices.map(c => {
                        const sel = value === c.value;
                        return (
                            <button
                                key={c.value}
                                onClick={() => setAnswer(question.id, c.value)}
                                className="flex items-center gap-2.5 text-left text-sm group"
                            >
                                <span className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[0.7rem] font-bold transition ${
                                    sel ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-gray-500 text-gray-400 group-hover:border-indigo-400'
                                }`}>
                                    {c.value}
                                </span>
                                <span className={sel ? 'text-white' : 'text-gray-300 group-hover:text-white'}>{c.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* Compact matching row: "<num>  item .......... [select]" */
function MatchingRow({ question }) {
    const { answers, setAnswer } = useExamStore();
    const value = answers[question.id] ?? '';
    const opts = (question.options ?? []).map(o => typeof o === 'string' ? { value: o, label: o } : o);

    return (
        <div className="flex items-center gap-3 py-1.5">
            <span className="flex-shrink-0 w-6 text-right text-sm font-semibold text-indigo-400">{question.sequence}</span>
            <span className="text-gray-200 text-[0.95rem] flex-1 min-w-0 truncate">{question.question_text}</span>
            <select
                value={value}
                onChange={e => setAnswer(question.id, e.target.value)}
                className="flex-shrink-0 bg-gray-800 border border-gray-600 text-white text-sm rounded-md px-2.5 py-1.5 focus:border-indigo-400 outline-none"
            >
                <option value="">— Select —</option>
                {opts.map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}

/* ── One instruction group (consecutive questions of the same category) ──── */
function QuestionGroup({ category, questions }) {
    const first = questions[0].sequence;
    const last  = questions[questions.length - 1].sequence;
    const range = first === last ? `Question ${first}` : `Questions ${first}–${last}`;

    const Row = category === 'mc' ? McRow : category === 'matching' ? MatchingRow : CompletionRow;

    return (
        <div className="mb-7">
            <div className="mb-2">
                <p className="text-sm font-bold text-white">{range}</p>
                <p className="text-xs text-gray-400 italic">{INSTRUCTIONS[category]}</p>
            </div>
            <div className={category === 'completion' ? 'border-l-2 border-gray-700 pl-3' : ''}>
                {questions.map(q => <Row key={q.id} question={q} />)}
            </div>
        </div>
    );
}

/* Split a section's questions into consecutive same-category groups. */
function groupBySection(questions) {
    const groups = [];
    for (const q of questions) {
        const cat = categoryOf(q.question_type);
        const tail = groups[groups.length - 1];
        if (tail && tail.category === cat) tail.questions.push(q);
        else groups.push({ category: cat, questions: [q] });
    }
    return groups;
}

/* ── Section layout ──────────────────────────────────────────────────────── */
export default function ListeningSection({ questions, test }) {
    const audioUrl = test.audio_file_path ?? test.audio_url ?? null;

    const sections = questions.reduce((acc, q) => {
        const s = q.section_number ?? 1;
        (acc[s] ??= []).push(q);
        return acc;
    }, {});

    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-900">
            <div className="sticky top-0 z-10 flex-shrink-0">
                <StickyAudioPlayer audioUrl={audioUrl} />
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Continuous exam sheet */}
                <div className="max-w-3xl mx-auto my-6 bg-gray-800/40 rounded-xl border border-gray-700/60 px-8 py-7">
                    {Object.entries(sections).map(([sec, qs], idx) => (
                        <div key={sec} className={idx > 0 ? 'mt-8 pt-8 border-t border-gray-700/60' : ''}>
                            <h2 className="text-indigo-300 font-bold tracking-wide mb-5">
                                Section {sec}
                                <span className="text-gray-500 font-normal text-sm ml-2">
                                    · Questions {qs[0].sequence}–{qs[qs.length - 1].sequence}
                                </span>
                            </h2>
                            {groupBySection(qs).map((g, i) => (
                                <QuestionGroup key={i} category={g.category} questions={g.questions} />
                            ))}
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
