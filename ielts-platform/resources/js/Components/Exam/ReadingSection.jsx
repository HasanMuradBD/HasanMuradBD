import { useState } from 'react';
import { useExamStore } from '@/store/examStore';

function QuestionItem({ question, index }) {
    const { answers, setAnswer, flagged, toggleFlag } = useExamStore();
    const answer = answers[question.id] ?? '';
    const isFlagged = flagged.has(question.id);

    const tfngOptions = ['TRUE', 'FALSE', 'NOT GIVEN'];
    const ynngOptions = ['YES', 'NO', 'NOT GIVEN'];

    return (
        <div className={`p-4 rounded-lg border mb-3 ${isFlagged ? 'border-amber-400 bg-amber-950/30' : 'border-gray-700 bg-gray-800'}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-indigo-400 font-bold text-sm flex-shrink-0">Q{question.sequence}</span>
                <p className="text-gray-200 text-sm flex-1">{question.question_text}</p>
                <button
                    onClick={() => toggleFlag(question.id)}
                    className={`flex-shrink-0 text-xs px-2 py-1 rounded border transition ${
                        isFlagged ? 'border-amber-400 text-amber-400' : 'border-gray-600 text-gray-500 hover:border-amber-400 hover:text-amber-400'
                    }`}
                >
                    {isFlagged ? '⚑ Flagged' : '⚐ Flag'}
                </button>
            </div>

            {/* True/False/Not Given */}
            {(question.question_type === 'true_false_not_given' || question.question_type === 'yes_no_not_given') && (
                <div className="flex gap-2">
                    {(question.question_type === 'true_false_not_given' ? tfngOptions : ynngOptions).map(opt => (
                        <button
                            key={opt}
                            onClick={() => setAnswer(question.id, opt)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded border transition ${
                                answer === opt
                                    ? 'bg-indigo-600 border-indigo-400 text-white'
                                    : 'border-gray-600 text-gray-400 hover:border-indigo-400 hover:text-indigo-300'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}

            {/* Matching Headings / MCQ */}
            {(question.question_type === 'matching_headings' || question.question_type === 'multiple_choice') && (
                <input
                    type="text"
                    value={answer}
                    onChange={e => setAnswer(question.id, e.target.value.toUpperCase())}
                    placeholder={question.question_type === 'matching_headings' ? 'Enter heading number (i–x)' : 'Enter option (A/B/C/D)'}
                    className="w-24 bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-1.5 focus:border-indigo-400 outline-none uppercase"
                    maxLength={3}
                />
            )}

            {/* Short answer / Completion types */}
            {['sentence_completion','summary_completion','note_completion','short_answer','form_completion','diagram_labelling','map_labelling'].includes(question.question_type) && (
                <input
                    type="text"
                    value={answer}
                    onChange={e => setAnswer(question.id, e.target.value)}
                    placeholder="Your answer"
                    className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded px-3 py-1.5 focus:border-indigo-400 outline-none"
                />
            )}
        </div>
    );
}

export default function ReadingSection({ questions }) {
    const [highlighted, setHighlighted] = useState('');
    const passage = questions[0]?.passage_reference ?? '';

    const handleMouseUp = () => {
        const sel = window.getSelection()?.toString().trim();
        if (sel) setHighlighted(sel);
    };

    return (
        <div className="h-full flex overflow-hidden">
            {/* Left: Reading Passage */}
            <div className="w-1/2 h-full overflow-y-auto p-6 border-r border-gray-700 select-text">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">Reading Passage</div>
                <div
                    className="text-gray-300 text-sm leading-7 whitespace-pre-line font-serif"
                    onMouseUp={handleMouseUp}
                    dangerouslySetInnerHTML={{
                        __html: highlighted
                            ? passage.replace(
                                highlighted,
                                `<mark class="bg-yellow-300/30 text-yellow-200 rounded px-0.5">${highlighted}</mark>`
                              )
                            : passage
                    }}
                />
            </div>

            {/* Right: Questions */}
            <div className="w-1/2 h-full overflow-y-auto p-6">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">
                    Questions 1–{questions.length}
                </div>
                {questions.map((q, i) => (
                    <QuestionItem key={q.id} question={q} index={i} />
                ))}
            </div>
        </div>
    );
}
