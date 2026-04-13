import React from 'react';
import { useExam } from '../contexts/ExamContext';

export default function ThemeToggle() {
    const { state, dispatch } = useExam();
    const isDark = state.theme === 'dark';

    return (
        <button
            onClick={() => dispatch({ type: 'SET_THEME', payload: isDark ? 'light' : 'dark' })}
            className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-surface-700 border border-gray-300 dark:border-white/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white dark:bg-primary-500 shadow-md transition-all duration-300 flex items-center justify-center text-sm ${isDark ? 'left-7' : 'left-0.5'
                    }`}
            >
                {isDark ? '🌙' : '☀️'}
            </div>
        </button>
    );
}
