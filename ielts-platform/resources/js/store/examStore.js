import { create } from 'zustand';

export const useExamStore = create((set, get) => ({
    attemptId: null,
    answers: {},          // { [questionId]: userAnswer }
    flagged: new Set(),   // questionIds flagged for review
    timeRemaining: 0,     // seconds
    timerActive: false,
    currentSection: 1,
    submitted: false,

    init: (attemptId, durationSeconds) => set({
        attemptId,
        timeRemaining: durationSeconds,
        timerActive: true,
        answers: {},
        flagged: new Set(),
        submitted: false,
    }),

    setAnswer: (questionId, value) =>
        set(state => ({ answers: { ...state.answers, [questionId]: value } })),

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

    setSection: (n) => set({ currentSection: n }),

    markSubmitted: () => set({ submitted: true, timerActive: false }),
}));
