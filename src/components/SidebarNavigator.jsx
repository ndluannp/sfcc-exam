import React from 'react';
import { useExam } from '../contexts/ExamContext';

export default function SidebarNavigator() {
    const { state, dispatch } = useExam();
    const { questions, currentIndex, answers, flagged } = state;

    const getStatus = (q, idx) => {
        if (idx === currentIndex) return 'current';
        if (flagged.includes(q.id)) return 'flagged';
        if (answers[q.id] && answers[q.id].length > 0) return 'answered';
        return 'unanswered';
    };

    const statusColors = {
        current: 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-400/50 scale-110',
        answered: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
        flagged: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
        unanswered: 'bg-gray-100 dark:bg-surface-700/50 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5',
    };

    const answeredCount = Object.keys(answers).length;
    const flaggedCount = flagged.length;

    return (
        <div className="flex flex-col h-full">
            {/* Stats */}
            <div className="p-4 border-b border-gray-200 dark:border-white/5">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Question Navigator
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <span className="text-gray-600 dark:text-gray-400">Answered: {answeredCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span className="text-gray-600 dark:text-gray-400">Remaining: {questions.length - answeredCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="text-gray-600 dark:text-gray-400">Flagged: {flaggedCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
                        <span className="text-gray-600 dark:text-gray-400">Current</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-5 gap-1.5">
                    {questions.map((q, idx) => {
                        const status = getStatus(q, idx);
                        return (
                            <button
                                key={q.id}
                                onClick={() => dispatch({ type: 'SET_CURRENT_INDEX', payload: idx })}
                                className={`w-full aspect-square flex items-center justify-center text-xs font-semibold rounded-lg border transition-all duration-200 hover:scale-105 ${statusColors[status]}`}
                                title={`Question ${idx + 1} - ${status}`}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
