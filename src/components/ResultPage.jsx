import React, { useMemo } from 'react';
import { useExam } from '../contexts/ExamContext';
import { formatTime, getTopicName } from '../utils/examUtils';
import ThemeToggle from './ThemeToggle';

export default function ResultPage() {
    const { state, dispatch } = useExam();
    const result = state.result;

    const stats = useMemo(() => {
        if (!result) return null;

        // Time stats
        const totalTime = result.timePerQuestion
            ? Object.values(result.timePerQuestion).reduce((a, b) => a + b, 0)
            : 0;
        const avgTime = result.total > 0 ? Math.round(totalTime / result.total) : 0;

        // Topic accuracy
        const topicStats = {};
        result.details.forEach(d => {
            const topic = getTopicName(d.source);
            if (!topicStats[topic]) {
                topicStats[topic] = { correct: 0, total: 0 };
            }
            topicStats[topic].total++;
            if (d.isCorrect) topicStats[topic].correct++;
        });

        const weakTopics = Object.entries(topicStats)
            .map(([name, s]) => ({ name, accuracy: Math.round((s.correct / s.total) * 100), ...s }))
            .sort((a, b) => a.accuracy - b.accuracy);

        return { totalTime, avgTime, weakTopics };
    }, [result]);

    if (!result) return null;

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-end mb-6">
                    <ThemeToggle />
                </div>

                {/* Score Card */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 ${result.passed
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30'
                            : 'bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30'
                        }`}>
                        <div className="text-center text-white">
                            <div className="text-3xl font-extrabold">{result.percentage}%</div>
                            <div className="text-xs font-medium opacity-90">
                                {result.passed ? 'PASSED' : 'FAILED'}
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                        {result.passed ? (
                            <span className="text-emerald-600 dark:text-emerald-400">🎉 Congratulations!</span>
                        ) : (
                            <span className="text-rose-600 dark:text-rose-400">Keep Practicing! 💪</span>
                        )}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {result.passed
                            ? 'You have passed the practice exam.'
                            : `You need ${result.passingScore}% to pass. Keep studying!`
                        }
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
                    {[
                        { label: 'Correct', value: result.correct, color: 'text-emerald-600 dark:text-emerald-400', icon: '✅' },
                        { label: 'Wrong', value: result.wrong, color: 'text-rose-600 dark:text-rose-400', icon: '❌' },
                        { label: 'Total', value: result.total, color: 'text-primary-600 dark:text-primary-400', icon: '📝' },
                        { label: 'Avg Time', value: stats ? `${stats.avgTime}s` : '-', color: 'text-cyan-600 dark:text-cyan-400', icon: '⏱️' },
                    ].map(s => (
                        <div key={s.label} className="glass-card p-5 text-center">
                            <div className="text-2xl mb-1">{s.icon}</div>
                            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Score bar */}
                <div className="glass-card p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Score</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-white">{result.percentage}%</span>
                    </div>
                    <div className="relative w-full h-4 bg-gray-200 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${result.passed
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                    : 'bg-gradient-to-r from-rose-500 to-pink-500'
                                }`}
                            style={{ width: `${result.percentage}%` }}
                        ></div>
                        {/* Passing line */}
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-gray-800 dark:bg-white"
                            style={{ left: `${result.passingScore}%` }}
                            title={`Passing: ${result.passingScore}%`}
                        >
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                {result.passingScore}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topic Accuracy */}
                {stats && stats.weakTopics.length > 0 && (
                    <div className="glass-card p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            📊 Topic Accuracy
                        </h3>
                        <div className="space-y-3">
                            {stats.weakTopics.map(t => (
                                <div key={t.name}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 mr-3">{t.name}</span>
                                        <span className={`text-sm font-bold ${t.accuracy >= 80 ? 'text-emerald-600 dark:text-emerald-400'
                                                : t.accuracy >= 65 ? 'text-amber-600 dark:text-amber-400'
                                                    : 'text-rose-600 dark:text-rose-400'
                                            }`}>
                                            {t.accuracy}% ({t.correct}/{t.total})
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 dark:bg-surface-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${t.accuracy >= 80 ? 'bg-emerald-500'
                                                    : t.accuracy >= 65 ? 'bg-amber-500'
                                                        : 'bg-rose-500'
                                                }`}
                                            style={{ width: `${t.accuracy}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <button
                        onClick={() => dispatch({ type: 'SHOW_REVIEW' })}
                        className="btn-primary"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Review Answers
                    </button>

                    {result.wrong > 0 && (
                        <button
                            onClick={() => dispatch({ type: 'BACK_TO_START' })}
                            className="btn-warning"
                        >
                            🔄 Retry Wrong Questions
                        </button>
                    )}

                    <button
                        onClick={() => dispatch({ type: 'BACK_TO_START' })}
                        className="btn-secondary"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
