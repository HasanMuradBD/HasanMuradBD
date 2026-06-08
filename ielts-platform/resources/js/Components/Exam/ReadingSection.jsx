import { useState, useCallback } from 'react';
import { useExamStore } from '@/store/examStore';

function PassageRenderer({ passage, phrase }) {
    if (!passage) return <p className="text-gray-500 italic text-sm">No passage available.</p>;
    if (!phrase) {
        return <span className="text-gray-300 text-sm leading-8 whitespace-pre-line font-serif">{passage}</span>;
    }
    const lower = passage.toLowerCase();
    const lowerPhrase = phrase.toLowerCase();
    const parts = [];
    let last = 0, idx;
    while ((idx = lower.indexOf(lowerPhrase, last)) !== -1) {
        if (idx > last) parts.push({ t: passage.slice(last, idx), hl: false });
        parts.push({ t: passage.slice(idx, idx + phrase.length), hl: true });
        last = idx + phrase.length;
    }
    if (last < passage.length) parts.push({ t: passage.slice(last), hl: false });
    return (
        <span className="text-gray-300 text-sm leading-8 whitespace-pre-line font-serif">
            {parts.map((p, i) =>
                p.hl
                    ? <mark key={i} className="bg-yellow-400/25 text-yellow-100 rounded-sm">{p.t}</mark>
                    : <span key={i}>{p.t}</span>
            )}
        </span>
    );
}

function QuestionItem({ question }) {
    const { answers, setAnswer, flagged, toggleFlag } = useExamStore();
    const answer  = answers[question.id] ?? '';
    const isFl    = flagged.has(question.id);
    const done    = answer.trim().length > 0;
    const isTF    = ['true_false_not_given','yes_no_not_given'].includes(question.question_type);
    const isChoice= ['matching_headings','multiple_choice','matching_information'].includes(question.question_type);
    const isText  = ['sentence_completion','summary_completion','note_completion','short_answer','form_completion','diagram_labelling','map_labelling'].includes(question.question_type);
    const tfOpts  = question.question_type === 'true_false_not_given' ? ['TRUE','FALSE','NOT GIVEN'] : ['YES','NO','NOT GIVEN'];

    return (
        <div id={`rq-${question.id}`}
            className={`p-4 rounded-xl border mb-3 scroll-mt-2 transition ${
                isFl  ? 'border-amber-500/60 bg-amber-950/20'
                : done ? 'border-green-700/40 bg-green-950/10'
                : 'border-gray-700 bg-gray-800/50'
            }`}>
            <div className="flex items-start gap-3 mb-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${done ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    {question.sequence}
                </span>
                <p className="text-gray-200 text-sm leading-relaxed flex-1">{question.question_text}</p>
                <button onClick={() => toggleFlag(question.id)}
                    className={`flex-shrink-0 text-xs px-2 py-1 rounded border transition ${isFl ? 'border-amber-500 text-amber-400 bg-amber-950/30' : 'border-gray-600 text-gray-500 hover:border-amber-500 hover:text-amber-400'}`}>
                    {isFl ? '⚑' : '⚐'}
                </button>
            </div>
            {isTF && (
                <div className="flex flex-wrap gap-2">
                    {tfOpts.map(opt => (
                        <button key={opt} onClick={() => setAnswer(question.id, opt)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${answer === opt ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-gray-600 text-gray-400 hover:border-indigo-400 hover:text-indigo-300'}`}>
                            {opt}
                        </button>
                    ))}
                </div>
            )}
            {isChoice && (
                <input type="text" value={answer} onChange={e => setAnswer(question.id, e.target.value.toUpperCase())}
                    placeholder={question.question_type === 'matching_headings' ? 'e.g. iv' : 'e.g. A'}
                    className="w-28 bg-gray-700/80 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:border-indigo-400 outline-none uppercase placeholder-gray-600" maxLength={5} />
            )}
            {isText && (
                <input type="text" value={answer} onChange={e => setAnswer(question.id, e.target.value)}
                    placeholder="Your answer (max 3 words)"
                    className="w-full bg-gray-700/80 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:border-indigo-400 outline-none placeholder-gray-600" />
            )}
        </div>
    );
}

function QuestionNavigator({ questions }) {
    const { answers, flagged } = useExamStore();
    const doneCount = questions.filter(q => (answers[q.id] ?? '').trim()).length;
    return (
        <div className="flex-shrink-0 border-t border-gray-700 bg-gray-800/80 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Navigator</span>
                <span className="text-xs text-green-400">{doneCount}/{questions.length} answered</span>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
                {questions.map(q => {
                    const done = (answers[q.id] ?? '').trim().length > 0;
                    const isFl = flagged.has(q.id);
                    return (
                        <button key={q.id}
                            onClick={() => document.getElementById(`rq-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                            className={`w-8 h-8 text-xs font-bold rounded-lg border transition ${isFl ? 'bg-amber-600/30 border-amber-500 text-amber-300' : done ? 'bg-green-600/30 border-green-600 text-green-300' : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-indigo-400'}`}>
                            {q.sequence}
                        </button>
                    );
                })}
                <span className="text-xs text-gray-600 ml-2">
                    <span className="inline-block w-2.5 h-2.5 rounded bg-green-600/30 border border-green-600 mr-1" />Done
                    <span className="inline-block w-2.5 h-2.5 rounded bg-amber-600/30 border border-amber-500 mx-1 ml-3" />Flagged
                </span>
            </div>
        </div>
    );
}

export default function ReadingSection({ questions }) {
    const [phrase, setPhrase] = useState('');
    const passage = questions[0]?.passage_reference ?? '';

    const handleMouseUp = useCallback(() => {
        const sel = window.getSelection()?.toString().trim();
        if (sel && sel.length >= 3 && sel.length <= 200) setPhrase(sel);
    }, []);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex flex-1 overflow-hidden min-h-0">
                <div className="w-1/2 flex flex-col overflow-hidden border-r border-gray-700 select-text">
                    <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-700/60 bg-gray-800/50 flex-shrink-0">
                        <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">Reading Passage</span>
                        {phrase && (
                            <button onClick={() => setPhrase('')} className="text-xs text-amber-400 hover:text-amber-300 transition">
                                ✕ Clear highlight
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-6" onMouseUp={handleMouseUp}>
                        <PassageRenderer passage={passage} phrase={phrase} />
                    </div>
                    {phrase && (
                        <div className="flex-shrink-0 px-4 py-2 bg-yellow-950/30 border-t border-yellow-700/30 text-xs text-yellow-300 truncate">
                            Highlighted: <span className="font-medium">"{phrase}"</span>
                        </div>
                    )}
                </div>
                <div className="w-1/2 flex flex-col overflow-hidden">
                    <div className="px-5 py-2.5 border-b border-gray-700/60 bg-gray-800/50 flex-shrink-0">
                        <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                            Questions {questions[0]?.sequence ?? 1}–{questions[questions.length - 1]?.sequence ?? questions.length}
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5">
                        {questions.map(q => <QuestionItem key={q.id} question={q} />)}
                    </div>
                </div>
            </div>
            <QuestionNavigator questions={questions} />
        </div>
    );
}
