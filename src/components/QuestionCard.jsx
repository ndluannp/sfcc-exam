import React, { useState } from 'react';
import { useExam } from '../contexts/ExamContext';
import { getTopicName, getLetter } from '../utils/examUtils';

export default function QuestionCard() {
    const { state, dispatch } = useExam();
    const question = state.questions[state.currentIndex];
    const [showStudyAnswer, setShowStudyAnswer] = useState(false);

    if (!question) return null;

    const userAnswer = state.answers[question.id] || [];
    const isFlagged = state.flagged.includes(question.id);
    const isMultiple = question.type === 'multiple';

    const handleSelect = (letter) => {
        if (isMultiple) {
            const newAnswer = userAnswer.includes(letter)
                ? userAnswer.filter(a => a !== letter)
                : [...userAnswer, letter];
            dispatch({ type: 'SET_ANSWER', payload: { questionId: question.id, answer: newAnswer } });
        } else {
            dispatch({ type: 'SET_ANSWER', payload: { questionId: question.id, answer: [letter] } });
        }
        if (state.studyMode) setShowStudyAnswer(true);
    };

    const handleFlag = () => {
        dispatch({ type: 'TOGGLE_FLAG', payload: question.id });
    };

    const handleClear = () => {
        dispatch({ type: 'CLEAR_ANSWER', payload: question.id });
        setShowStudyAnswer(false);
    };

    const handlePrev = () => {
        setShowStudyAnswer(false);
        if (state.currentIndex > 0) {
            dispatch({ type: 'SET_CURRENT_INDEX', payload: state.currentIndex - 1 });
        }
    };

    const handleNext = () => {
        setShowStudyAnswer(false);
        if (state.currentIndex < state.questions.length - 1) {
            dispatch({ type: 'SET_CURRENT_INDEX', payload: state.currentIndex + 1 });
        }
    };

    // Study mode: check answer correctness
    const isStudyCorrect = state.studyMode && showStudyAnswer
        ? JSON.stringify([...userAnswer].sort()) === JSON.stringify([...question.answer].sort())
        : null;

    return (
        <div className="animate-fade-in">
            {/* Question header */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    Question {state.currentIndex + 1}
                    <span className="text-base font-normal text-gray-400 ml-1">/ {state.questions.length}</span>
                </span>
                <span className="badge-primary">{getTopicName(question.source)}</span>
                <span className={`badge ${isMultiple ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300'}`}>
                    {isMultiple ? '☑ Multiple Choice' : '◉ Single Choice'}
                </span>
                {question._nonScored && (
                    <span className="badge bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500">Non-scored</span>
                )}
                {isFlagged && (
                    <span className="badge-warning">🚩 Flagged</span>
                )}
            </div>

            {/* Question text */}
            <div className="glass-card p-6 mb-6">
                <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                    {question.question}
                </p>
                {isMultiple && (
                    <p className="mt-3 text-sm text-primary-600 dark:text-primary-400 font-medium">
                        ⓘ Select all correct answers (multiple choice)
                    </p>
                )}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
                {question.options.map((opt, idx) => {
                    const letter = getLetter(idx);
                    const isSelected = userAnswer.includes(letter);
                    const isCorrectAnswer = question.answer.includes(letter);

                    let optionStyle = '';
                    if (state.studyMode && showStudyAnswer) {
                        if (isCorrectAnswer) {
                            optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/50';
                        } else if (isSelected && !isCorrectAnswer) {
                            optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 ring-1 ring-rose-500/50';
                        }
                    } else if (isSelected) {
                        optionStyle = 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-1 ring-primary-500/50';
                    }

                    return (
                        <button
                            key={letter}
                            onClick={() => handleSelect(letter)}
                            disabled={state.studyMode && showStudyAnswer}
                            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group ${optionStyle ||
                                'border-gray-200 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-500/30 hover:bg-primary-50/50 dark:hover:bg-primary-950/20'
                                } ${state.studyMode && showStudyAnswer ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                            <span
                                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-200 ${isSelected
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-100 dark:bg-surface-700 text-gray-500 dark:text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 group-hover:text-primary-600'
                                    } ${state.studyMode && showStudyAnswer && isCorrectAnswer ? 'bg-emerald-500 text-white' : ''}
                ${state.studyMode && showStudyAnswer && isSelected && !isCorrectAnswer ? 'bg-rose-500 text-white' : ''}`}
                            >
                                {letter}
                            </span>
                            <span className="flex-1 text-gray-700 dark:text-gray-200 pt-1 text-[15px]">{opt}</span>
                            {state.studyMode && showStudyAnswer && isCorrectAnswer && (
                                <span className="text-emerald-500 text-lg">✓</span>
                            )}
                            {state.studyMode && showStudyAnswer && isSelected && !isCorrectAnswer && (
                                <span className="text-rose-500 text-lg">✗</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Study mode explanation */}
            {state.studyMode && showStudyAnswer && (
                <div className="animate-fade-in space-y-4 mb-6">
                    <div className={`glass-card p-5 border-l-4 ${isStudyCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
                        <div className={`text-lg font-bold mb-2 ${isStudyCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {isStudyCorrect ? '✅ Correct!' : '❌ Incorrect'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Correct answer: <span className="font-bold text-emerald-600 dark:text-emerald-400">{question.answer.join(', ')}</span>
                        </div>
                    </div>

                    {question.explanation && (
                        <div className="glass-card p-5 border-l-4 border-l-blue-500">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Explanation
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{question.explanation}</p>
                        </div>
                    )}

                    {question.tip && (
                        <div className="glass-card p-5 border-l-4 border-l-amber-500">
                            <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Tip
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{question.tip}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={handlePrev}
                    disabled={state.currentIndex === 0}
                    className="btn-secondary disabled:opacity-30"
                    title="Previous (P)"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>

                <button
                    onClick={handleNext}
                    disabled={state.currentIndex === state.questions.length - 1}
                    className="btn-secondary disabled:opacity-30"
                    title="Next (N)"
                >
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <button
                    onClick={handleFlag}
                    className={`btn-secondary ${isFlagged ? 'bg-amber-100 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400' : ''}`}
                    title="Flag for review"
                >
                    {isFlagged ? '🚩 Unflag' : '🏳️ Flag'}
                </button>

                <button onClick={handleClear} className="btn-secondary" title="Clear answer">
                    ✕ Clear
                </button>
            </div>
        </div>
    );
}
