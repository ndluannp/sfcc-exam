import React, { useState, useEffect, useCallback } from 'react';
import { useExam } from '../contexts/ExamContext';
import { calculateScore } from '../utils/examUtils';
import Timer from './Timer';
import SidebarNavigator from './SidebarNavigator';
import QuestionCard from './QuestionCard';
import ThemeToggle from './ThemeToggle';

export default function ExamPage() {
    const { state, dispatch } = useExam();
    const [showSidebar, setShowSidebar] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const answeredCount = Object.keys(state.answers).length;
    const progress = state.questions.length > 0
        ? Math.round((answeredCount / state.questions.length) * 100)
        : 0;

    const handleSubmit = useCallback(() => {
        const result = calculateScore(state.questions, state.answers);
        result.timePerQuestion = state.timePerQuestion;
        result.mode = state.mode;

        const wrongIds = result.details.filter(d => !d.isCorrect).map(d => d.id);
        const prevWrongIds = state.wrongQuestionIds || [];
        const mergedWrongIds = [...new Set([...prevWrongIds, ...wrongIds])];
        dispatch({ type: 'SET_WRONG_IDS', payload: mergedWrongIds });
        dispatch({ type: 'SUBMIT_EXAM', payload: result });
    }, [state.questions, state.answers, state.timePerQuestion, state.mode, state.wrongQuestionIds, dispatch]);

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e) => {
            if (showConfirm) return;
            const key = e.key.toUpperCase();

            // A-H for option selection
            if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].includes(key)) {
                const q = state.questions[state.currentIndex];
                if (!q) return;
                const optIdx = key.charCodeAt(0) - 65;
                if (optIdx < q.options.length) {
                    dispatch({
                        type: 'TOGGLE_ANSWER',
                        payload: { questionId: q.id, letter: key, isMultiple: q.type === 'multiple' },
                    });
                }
            }

            if (key === 'N' && state.currentIndex < state.questions.length - 1) {
                dispatch({ type: 'SET_CURRENT_INDEX', payload: state.currentIndex + 1 });
            }
            if (key === 'P' && state.currentIndex > 0) {
                dispatch({ type: 'SET_CURRENT_INDEX', payload: state.currentIndex - 1 });
            }
            if (key === 'F') {
                const q = state.questions[state.currentIndex];
                if (q) dispatch({ type: 'TOGGLE_FLAG', payload: q.id });
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [state.currentIndex, state.questions, state.answers, showConfirm, dispatch]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Bar */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-4 py-3">
                <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                    <div className="flex items-center gap-4">
                        {/* Mobile sidebar toggle */}
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="lg:hidden btn-secondary px-2.5 py-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="hidden sm:block">
                            <h1 className="text-sm font-bold text-gray-800 dark:text-white">SFCC Developer Exam</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {state.mode === 'full' ? 'Full Exam' : state.mode === 'topic' ? 'Practice by Topic' : state.mode === 'retry' ? 'Retry Wrong' : 'Random 60'}
                                {state.studyMode && ' · Study Mode'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Progress */}
                        <div className="hidden md:flex items-center gap-3">
                            <div className="w-32 h-2 bg-gray-200 dark:bg-surface-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tabular-nums">
                                {answeredCount}/{state.questions.length}
                            </span>
                        </div>

                        <Timer />

                        <ThemeToggle />

                        {/* Submit */}
                        {!state.studyMode && (
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="btn-danger text-sm px-4 py-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="hidden sm:inline">Submit</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile progress */}
                <div className="md:hidden mt-2">
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:block w-64 border-r border-gray-200 dark:border-white/5 bg-white/50 dark:bg-surface-900/50 overflow-y-auto">
                    <SidebarNavigator />
                </aside>

                {/* Sidebar - Mobile */}
                {showSidebar && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                            onClick={() => setShowSidebar(false)}
                        ></div>
                        <aside className="fixed top-0 left-0 z-50 w-72 h-full bg-white dark:bg-surface-900 shadow-2xl lg:hidden animate-slide-in-left overflow-y-auto">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5">
                                <span className="font-semibold text-gray-800 dark:text-white">Navigator</span>
                                <button onClick={() => setShowSidebar(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <SidebarNavigator />
                        </aside>
                    </>
                )}

                {/* Question area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
                    <QuestionCard />
                </main>
            </div>

            {/* Submit Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card p-6 md:p-8 max-w-md w-full animate-slide-up">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Submit Exam?</h3>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Answered</span>
                                <span className="font-semibold text-gray-800 dark:text-white">{answeredCount} / {state.questions.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Unanswered</span>
                                <span className="font-semibold text-amber-600 dark:text-amber-400">{state.questions.length - answeredCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Flagged</span>
                                <span className="font-semibold text-amber-600 dark:text-amber-400">{state.flagged.length}</span>
                            </div>
                        </div>

                        {state.questions.length - answeredCount > 0 && (
                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm mb-6">
                                ⚠️ You have {state.questions.length - answeredCount} unanswered questions.
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="btn-secondary flex-1"
                            >
                                Continue Exam
                            </button>
                            <button
                                onClick={() => { setShowConfirm(false); handleSubmit(); }}
                                className="btn-danger flex-1"
                            >
                                Submit Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
