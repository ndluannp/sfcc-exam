import React, { useState, useMemo } from 'react';
import { useExam } from '../contexts/ExamContext';
import { getTopicName, getLetter } from '../utils/examUtils';
import ThemeToggle from './ThemeToggle';

export default function ReviewPage() {
    const { state, dispatch } = useExam();
    const result = state.result;
    const [filter, setFilter] = useState('all'); // all | wrong | correct
    const [expandedId, setExpandedId] = useState(null);

    const filtered = useMemo(() => {
        if (!result) return [];
        if (filter === 'wrong') return result.details.filter(d => !d.isCorrect);
        if (filter === 'correct') return result.details.filter(d => d.isCorrect);
        return result.details;
    }, [result, filter]);

    if (!result) return null;

    const wrongCount = result.details.filter(d => !d.isCorrect).length;
    const correctCount = result.details.filter(d => d.isCorrect).length;

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => dispatch({ type: 'BACK_TO_START' })}
                        className="btn-secondary"
                    >
                        ← Back to Home
                    </button>
                    <ThemeToggle />
                </div>

                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2 animate-fade-in">
                    📖 Answer Review
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Score: {result.percentage}% · {result.correct}/{result.total} correct
                </p>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        { id: 'all', label: `All (${result.details.length})` },
                        { id: 'wrong', label: `Wrong (${wrongCount})`, color: 'text-rose-600 dark:text-rose-400' },
                        { id: 'correct', label: `Correct (${correctCount})`, color: 'text-emerald-600 dark:text-emerald-400' },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${filter === f.id
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-gray-100 dark:bg-surface-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-surface-700/80'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Questions */}
                <div className="space-y-4">
                    {filtered.map((detail, idx) => {
                        const isExpanded = expandedId === detail.id;
                        return (
                            <div
                                key={detail.id}
                                className={`glass-card overflow-hidden transition-all duration-300 border-l-4 ${detail.isCorrect ? 'border-l-emerald-500' : 'border-l-rose-500'
                                    }`}
                            >
                                {/* Question header - clickable */}
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : detail.id)}
                                    className="w-full p-5 text-left flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${detail.isCorrect
                                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
                                            : 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400'
                                        }`}>
                                        {detail.isCorrect ? '✓' : '✗'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                Q{result.details.indexOf(detail) + 1}
                                            </span>
                                            <span className="badge-primary text-[10px]">{getTopicName(detail.source)}</span>
                                        </div>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                                            {detail.question}
                                        </p>
                                        <div className="flex flex-wrap gap-3 mt-2 text-xs">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Your: <span className={`font-bold ${detail.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                    {detail.userAnswer.length > 0 ? detail.userAnswer.join(', ') : '(no answer)'}
                                                </span>
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Correct: <span className="font-bold text-emerald-600 dark:text-emerald-400">{detail.answer.join(', ')}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Expanded detail */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 animate-fade-in">
                                        <hr className="mb-4 border-gray-200 dark:border-white/5" />

                                        {/* Options review */}
                                        <div className="space-y-2 mb-4">
                                            {detail.options.map((opt, oIdx) => {
                                                const letter = getLetter(oIdx);
                                                const isUserSelected = detail.userAnswer.includes(letter);
                                                const isCorrectOption = detail.answer.includes(letter);

                                                let bgStyle = '';
                                                if (isCorrectOption) {
                                                    bgStyle = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/30';
                                                } else if (isUserSelected) {
                                                    bgStyle = 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/30';
                                                } else {
                                                    bgStyle = 'bg-gray-50 dark:bg-surface-800/50 border-gray-200 dark:border-white/5';
                                                }

                                                return (
                                                    <div key={letter} className={`flex items-start gap-3 p-3 rounded-xl border ${bgStyle}`}>
                                                        <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold ${isCorrectOption
                                                                ? 'bg-emerald-500 text-white'
                                                                : isUserSelected
                                                                    ? 'bg-rose-500 text-white'
                                                                    : 'bg-gray-200 dark:bg-surface-700 text-gray-500'
                                                            }`}>
                                                            {letter}
                                                        </span>
                                                        <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                                                        {isCorrectOption && <span className="text-emerald-500 text-sm">✓ Correct</span>}
                                                        {isUserSelected && !isCorrectOption && <span className="text-rose-500 text-sm">✗ Your answer</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Explanation */}
                                        {detail.explanation && (
                                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 mb-3">
                                                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Explanation
                                                </h4>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{detail.explanation}</p>
                                            </div>
                                        )}

                                        {/* Tip */}
                                        {detail.tip && (
                                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20">
                                                <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                    Tip
                                                </h4>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{detail.tip}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <div className="text-4xl mb-3">🎯</div>
                        <p>No questions to show for this filter.</p>
                    </div>
                )}

                {/* Bottom actions */}
                <div className="flex flex-wrap gap-3 justify-center mt-8 pt-8 border-t border-gray-200 dark:border-white/5">
                    <button
                        onClick={() => dispatch({ type: 'BACK_TO_START' })}
                        className="btn-primary"
                    >
                        🏠 Back to Home
                    </button>
                    {wrongCount > 0 && (
                        <button
                            onClick={() => dispatch({ type: 'BACK_TO_START' })}
                            className="btn-warning"
                        >
                            🔄 Retry Wrong Questions ({wrongCount})
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
