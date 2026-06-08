import { create } from 'zustand';

export const useExamStore = create((set) => ({
    attemptId:      null,
    answers:        {},       // { [questionId]: string } — Reading / Listening
    writingTexts:   {},       // { [taskKey]: string }    — Writing tasks
    flagged:        new Set(),
    timeRemaining:  0,
    timerActive:    false,
    currentSection: 1,
    submitted:      false,

    init: (attemptId, durationSeconds) => set({
        attemptId,
        timeRemaining:  durationSeconds,
        timerActive:    true,
        answers:        {},
        writingTexts:   {},
        flagged:        new Set(),
        submitted:      false,
        currentSection: 1,
    }),

    setAnswer: (questionId, value) =>
        set(state => ({ answers: { ...state.answers, [questionId]: value } })),

    setWritingText: (taskKey, text) =>
        set(state => ({ writingTexts: { ...state.writingTexts, [taskKey]: text } })),

    toggleFlag: (questionId) =>
        set(state => {
            const flagged = new Set(state.flagged);
            flagged.has(questionId) ? flagged.delete(questionId) : flagged.add(questionId);
            return { flagged };
        }),

    tick: () =>
        set(state => {
            if (state.timeRemaining <= 1) return { timeRemaining: 0, timerActive: false };
            return { timeRemaining: state.timeRemaining - 1 };
        }),

    setSection:    (n) => set({ currentSection: n }),
    markSubmitted: ()  => set({ submitted: true, timerActive: false }),
}));
