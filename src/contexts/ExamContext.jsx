import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';

const ExamContext = createContext(null);

const INITIAL_STATE = {
    screen: 'start',         // start | exam | result | review
    theme: 'dark',
    allQuestions: [],
    loading: true,

    // Exam config
    mode: 'full',            // full | topic | random | retry
    selectedTopics: [],
    shuffleQuestions: true,
    shuffleAnswers: false,
    studyMode: false,

    // Exam state
    questions: [],
    currentIndex: 0,
    answers: {},             // { questionId: ['A', 'B'] }
    flagged: [],
    timeRemaining: 105 * 60, // 105 minutes in seconds
    startTime: null,
    timePerQuestion: {},     // { questionId: secondsSpent }
    examStarted: false,

    // Results
    result: null,

    // History
    wrongQuestionIds: [],
    examHistory: [],
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_QUESTIONS':
            return { ...state, allQuestions: action.payload, loading: false };

        case 'SET_THEME':
            return { ...state, theme: action.payload };

        case 'START_EXAM':
            return {
                ...state,
                screen: 'exam',
                questions: action.payload.questions,
                mode: action.payload.mode,
                studyMode: action.payload.studyMode || false,
                currentIndex: 0,
                answers: {},
                flagged: [],
                timeRemaining: action.payload.mode === 'full' ? 105 * 60 : (action.payload.questions.length * 105),
                startTime: Date.now(),
                timePerQuestion: {},
                examStarted: true,
                result: null,
            };

        case 'SET_CURRENT_INDEX':
            return { ...state, currentIndex: action.payload };

        case 'TOGGLE_ANSWER': {
            const { questionId, letter, isMultiple } = action.payload;
            const currentAnswer = state.answers[questionId] || [];
            let newAnswer;
            if (isMultiple) {
                newAnswer = currentAnswer.includes(letter)
                    ? currentAnswer.filter(a => a !== letter)
                    : [...currentAnswer, letter];
            } else {
                newAnswer = [letter];
            }
            return {
                ...state,
                answers: { ...state.answers, [questionId]: newAnswer },
            };
        }

        case 'SET_ANSWER': {
            const { questionId, answer } = action.payload;
            return {
                ...state,
                answers: { ...state.answers, [questionId]: answer },
            };
        }

        case 'CLEAR_ANSWER': {
            const newAnswers = { ...state.answers };
            delete newAnswers[action.payload];
            return { ...state, answers: newAnswers };
        }

        case 'TOGGLE_FLAG': {
            const qId = action.payload;
            const flagged = state.flagged.includes(qId)
                ? state.flagged.filter(id => id !== qId)
                : [...state.flagged, qId];
            return { ...state, flagged };
        }

        case 'TICK_TIMER':
            return {
                ...state,
                timeRemaining: Math.max(0, state.timeRemaining - 1),
            };

        case 'UPDATE_TIME_PER_QUESTION': {
            const { questionId, time } = action.payload;
            return {
                ...state,
                timePerQuestion: {
                    ...state.timePerQuestion,
                    [questionId]: (state.timePerQuestion[questionId] || 0) + time,
                },
            };
        }

        case 'SUBMIT_EXAM':
            return {
                ...state,
                screen: 'result',
                result: action.payload,
                examStarted: false,
            };

        case 'SET_WRONG_IDS':
            return { ...state, wrongQuestionIds: action.payload };

        case 'SHOW_REVIEW':
            return { ...state, screen: 'review' };

        case 'BACK_TO_START':
            return {
                ...state,
                screen: 'start',
                questions: [],
                currentIndex: 0,
                answers: {},
                flagged: [],
                examStarted: false,
                result: null,
                timeRemaining: 105 * 60,
            };

        case 'RESTORE_EXAM':
            return { ...state, ...action.payload, loading: false };

        default:
            return state;
    }
}

export function ExamProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const questionTimeRef = useRef(null);

    // Load questions
    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}questions.json`)
            .then(res => res.json())
            .then(data => {
                dispatch({ type: 'SET_QUESTIONS', payload: data });

                // Try restore exam from localStorage
                try {
                    const saved = localStorage.getItem('sfcc_exam_state');
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        if (parsed.examStarted && parsed.questions?.length > 0) {
                            // Trừ thời gian đã trôi khi tắt browser
                            if (parsed.savedAt && parsed.timeRemaining > 0) {
                                const elapsed = Math.floor((Date.now() - parsed.savedAt) / 1000);
                                parsed.timeRemaining = Math.max(0, parsed.timeRemaining - elapsed);
                            }
                            dispatch({ type: 'RESTORE_EXAM', payload: parsed });
                        } else if (parsed.screen === 'result' && parsed.result) {
                            // Restore kết quả thi
                            dispatch({ type: 'RESTORE_EXAM', payload: parsed });
                        }
                    }
                } catch (e) {
                    console.error('Failed to restore exam:', e);
                }

                // Load wrong question IDs
                try {
                    const wrongIds = JSON.parse(localStorage.getItem('sfcc_wrong_ids') || '[]');
                    dispatch({ type: 'SET_WRONG_IDS', payload: wrongIds });
                } catch (e) { /* ignore */ }
            })
            .catch(err => {
                console.error('Failed to load questions:', err);
                dispatch({ type: 'SET_QUESTIONS', payload: [] });
            });
    }, []);

    // Save exam state to localStorage
    useEffect(() => {
        if (state.examStarted) {
            const toSave = {
                screen: state.screen,
                questions: state.questions,
                currentIndex: state.currentIndex,
                answers: state.answers,
                flagged: state.flagged,
                timeRemaining: state.timeRemaining,
                startTime: state.startTime,
                timePerQuestion: state.timePerQuestion,
                examStarted: state.examStarted,
                mode: state.mode,
                studyMode: state.studyMode,
                savedAt: Date.now(), // Timestamp để tính thời gian trôi
            };
            localStorage.setItem('sfcc_exam_state', JSON.stringify(toSave));
        } else if (state.screen === 'result' && state.result) {
            // Lưu cả kết quả để không mất khi tắt browser
            const toSave = {
                screen: state.screen,
                questions: state.questions,
                answers: state.answers,
                result: state.result,
                mode: state.mode,
                examStarted: false,
                savedAt: Date.now(),
            };
            localStorage.setItem('sfcc_exam_state', JSON.stringify(toSave));
        } else {
            localStorage.removeItem('sfcc_exam_state');
        }
    }, [
        state.examStarted, state.screen, state.currentIndex,
        state.answers, state.flagged, state.timeRemaining, state.timePerQuestion,
        state.result,
    ]);

    // Cảnh báo khi đang thi mà tắt browser/tab
    useEffect(() => {
        if (!state.examStarted) return;
        const handler = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [state.examStarted]);

    // Save wrong IDs
    useEffect(() => {
        if (state.wrongQuestionIds.length > 0) {
            localStorage.setItem('sfcc_wrong_ids', JSON.stringify(state.wrongQuestionIds));
        }
    }, [state.wrongQuestionIds]);

    // Theme management
    useEffect(() => {
        const root = document.documentElement;
        if (state.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('sfcc_theme', state.theme);
    }, [state.theme]);

    // Load saved theme
    useEffect(() => {
        const saved = localStorage.getItem('sfcc_theme');
        if (saved) dispatch({ type: 'SET_THEME', payload: saved });
    }, []);

    // Track time per question
    useEffect(() => {
        if (!state.examStarted || state.questions.length === 0) return;
        const q = state.questions[state.currentIndex];
        if (!q) return;

        questionTimeRef.current = Date.now();

        return () => {
            if (questionTimeRef.current) {
                const spent = Math.round((Date.now() - questionTimeRef.current) / 1000);
                dispatch({
                    type: 'UPDATE_TIME_PER_QUESTION',
                    payload: { questionId: q.id, time: spent },
                });
            }
        };
    }, [state.currentIndex, state.examStarted]);

    const value = { state, dispatch };
    return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

export function useExam() {
    const context = useContext(ExamContext);
    if (!context) throw new Error('useExam must be used within ExamProvider');
    return context;
}
