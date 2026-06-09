import React, { useState, useMemo } from 'react';
import { useExam } from '../contexts/ExamContext';
import { getUniqueTopics, selectQuestions, shuffleArray, shuffleOptions } from '../utils/examUtils';
import ThemeToggle from './ThemeToggle';
import { getTranslation } from '../utils/translations';

export default function StartScreen() {
    const { state, dispatch } = useExam();
    const [mode, setMode] = useState(state.mode === 'retry' ? 'retry' : 'full');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [shuffleQ, setShuffleQ] = useState(true);
    const [shuffleA, setShuffleA] = useState(false);
    const [studyMode, setStudyMode] = useState(false);
    const [questionCount, setQuestionCount] = useState(60);
    const [customCount, setCustomCount] = useState('');

    const topics = useMemo(() => getUniqueTopics(state.allQuestions), [state.allQuestions]);

    const toggleTopic = (id) => {
        setSelectedTopics(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleStart = () => {
        if (state.allQuestions.length === 0) return;

        const count = mode === 'full' ? 60 : questionCount;
        let questions = selectQuestions(state.allQuestions, mode, {
            topics: selectedTopics,
            wrongIds: state.wrongQuestionIds,
            count,
        });

        if (shuffleA) {
            questions = questions.map(q => shuffleOptions(q));
        }

        if (questions.length === 0) {
            alert(getTranslation(state.language, 'no_questions'));
            return;
        }

        dispatch({
            type: 'START_EXAM',
            payload: { questions, mode, studyMode },
        });
    };

    const maxAvailable = useMemo(() => {
        if (mode === 'retry') {
            const allIdsSet = new Set(state.allQuestions.map(q => String(q.id)));
            return (state.wrongQuestionIds || []).filter(id => allIdsSet.has(String(id))).length;
        }
        if (mode === 'topic') {
            if (selectedTopics.length === 0) return state.allQuestions.length;
            return state.allQuestions.filter(q => selectedTopics.includes(q.source)).length;
        }
        return state.allQuestions.length;
    }, [mode, selectedTopics, state.allQuestions, state.wrongQuestionIds]);

    const estimatedQuestions = useMemo(() => {
        if (mode === 'full') return Math.min(65, state.allQuestions.length);
        if (mode === 'retry') return maxAvailable;
        return Math.min(questionCount, maxAvailable);
    }, [mode, questionCount, maxAvailable, state.allQuestions]);

    const validRetryCount = useMemo(() => {
        const allIdsSet = new Set(state.allQuestions.map(q => String(q.id)));
        return (state.wrongQuestionIds || []).filter(id => allIdsSet.has(String(id))).length;
    }, [state.allQuestions, state.wrongQuestionIds]);

    if (state.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading questions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    {/* Title left on desktop */}
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800 dark:text-white">☁️ SFCC Developer Exam</span>
                    </div>
                    {/* Controls right */}
                    <div className="flex items-center gap-3 ml-auto">
                        {/* Language Selector */}
                        <div className="flex rounded-xl bg-gray-100 dark:bg-surface-800 p-0.5 border border-gray-200 dark:border-white/5 text-xs">
                            <button
                                onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'en' })}
                                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                                    state.language === 'en'
                                        ? 'bg-white dark:bg-surface-700 text-gray-800 dark:text-white shadow-sm font-semibold'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: 'vi' })}
                                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                                    state.language === 'vi'
                                        ? 'bg-white dark:bg-surface-700 text-gray-800 dark:text-white shadow-sm font-semibold'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                VI
                            </button>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
                        ☁️ Salesforce Certification
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                        <span className="gradient-text">{getTranslation(state.language, 'b2c_title')}</span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
                        {getTranslation(state.language, 'practice_exam')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                        {state.allQuestions.length} {getTranslation(state.language, 'questions_available')} · 105 {getTranslation(state.language, 'minutes')} · 65% {getTranslation(state.language, 'passing_score')}
                    </p>
                </div>

                {/* Mode selection */}
                <div className="glass-card p-6 md:p-8 mb-6 animate-slide-up">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        {getTranslation(state.language, 'exam_mode')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { 
                                id: 'full', 
                                icon: '📝', 
                                title: getTranslation(state.language, 'full_exam'), 
                                desc: getTranslation(state.language, 'full_exam_desc') 
                            },
                            { 
                                id: 'random', 
                                icon: '🎲', 
                                title: getTranslation(state.language, 'random_exam'), 
                                desc: getTranslation(state.language, 'random_exam_desc') 
                            },
                            { 
                                id: 'topic', 
                                icon: '📚', 
                                title: getTranslation(state.language, 'practice_topic'), 
                                desc: getTranslation(state.language, 'practice_topic_desc') 
                            },
                            { 
                                id: 'retry', 
                                icon: '🔄', 
                                title: getTranslation(state.language, 'review_wrong'), 
                                desc: getTranslation(state.language, 'review_wrong_desc', { count: validRetryCount }) 
                            },
                        ].map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                disabled={m.id === 'retry' && validRetryCount === 0}
                                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${mode === m.id
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-1 ring-primary-500/30'
                                    : 'border-gray-200 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-500/30'
                                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{m.icon}</span>
                                    <div>
                                        <div className="font-semibold text-gray-800 dark:text-white">{m.title}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{m.desc}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Topic selection */}
                {mode === 'topic' && (
                    <div className="glass-card p-6 md:p-8 mb-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            📚 {getTranslation(state.language, 'select_topics')}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {topics.map(t => (
                                <label
                                    key={t.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${selectedTopics.includes(t.id)
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 font-semibold'
                                        : 'border-gray-200 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-500/20'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedTopics.includes(t.id)}
                                        onChange={() => toggleTopic(t.id)}
                                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{t.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{t.count} {getTranslation(state.language, 'questions')}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Question count selector */}
                {mode !== 'full' && mode !== 'retry' && (
                    <div className="glass-card p-6 md:p-8 mb-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            🔢 {getTranslation(state.language, 'num_questions')}
                            <span className="text-sm font-normal text-gray-400">({maxAvailable} {getTranslation(state.language, 'available')})</span>
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {[10, 20, 30, 40, 60, 100].filter(n => n <= maxAvailable).map(n => (
                                <button
                                    key={n}
                                    onClick={() => { setQuestionCount(n); setCustomCount(''); }}
                                    className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${questionCount === n && !customCount
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300'
                                        : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-primary-300'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                onClick={() => { setQuestionCount(maxAvailable); setCustomCount(''); }}
                                className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${questionCount === maxAvailable && !customCount
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300'
                                    : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-primary-300'
                                    }`}
                            >
                                {getTranslation(state.language, 'all')} ({maxAvailable})
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{getTranslation(state.language, 'custom')}:</span>
                            <input
                                type="number"
                                min="1"
                                max={maxAvailable}
                                value={customCount}
                                placeholder={String(questionCount)}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setCustomCount(val);
                                    const num = parseInt(val, 10);
                                    if (num > 0 && num <= maxAvailable) setQuestionCount(num);
                                }}
                                className="w-24 px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-surface-800 text-gray-800 dark:text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 outline-none transition-all"
                            />
                            <input
                                type="range"
                                min="1"
                                max={maxAvailable}
                                value={questionCount}
                                onChange={(e) => { setQuestionCount(parseInt(e.target.value, 10)); setCustomCount(''); }}
                                className="flex-1 h-2 rounded-full appearance-none bg-gray-200 dark:bg-surface-700 accent-primary-500 cursor-pointer"
                            />
                        </div>
                    </div>
                )}

                {/* Options */}
                <div className="glass-card p-6 md:p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        ⚙️ {getTranslation(state.language, 'options')}
                    </h3>
                    <div className="space-y-3">
                        {[
                            { id: 'shuffleQ', label: getTranslation(state.language, 'shuffle_questions'), checked: shuffleQ, onChange: () => setShuffleQ(!shuffleQ) },
                            { id: 'shuffleA', label: getTranslation(state.language, 'shuffle_answers'), checked: shuffleA, onChange: () => setShuffleA(!shuffleA) },
                            { id: 'studyMode', label: getTranslation(state.language, 'study_mode'), checked: studyMode, onChange: () => setStudyMode(!studyMode) },
                        ].map(opt => (
                            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${opt.checked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-surface-700'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${opt.checked ? 'translate-x-5' : ''}`}></div>
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Exam History */}
                <div className="glass-card p-6 md:p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-white/5 pb-3">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            ⏱️ {getTranslation(state.language, 'exam_history')}
                        </h3>
                        {state.examHistory && state.examHistory.length > 0 && (
                            <button
                                onClick={() => {
                                    if (window.confirm(getTranslation(state.language, 'confirm_clear_history'))) {
                                        dispatch({ type: 'CLEAR_HISTORY' });
                                    }
                                }}
                                className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1"
                            >
                                🗑️ {getTranslation(state.language, 'btn_clear_history')}
                            </button>
                        )}
                    </div>

                    {!state.examHistory || state.examHistory.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                            {getTranslation(state.language, 'history_empty')}
                        </p>
                    ) : (
                        <div className="overflow-x-auto max-h-80 overflow-y-auto pr-1">
                            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-surface-800/50 sticky top-0">
                                    <tr>
                                        <th scope="col" className="px-3 py-2.5">{getTranslation(state.language, 'history_date')}</th>
                                        <th scope="col" className="px-3 py-2.5">{getTranslation(state.language, 'exam_mode')}</th>
                                        <th scope="col" className="px-3 py-2.5">{getTranslation(state.language, 'history_score')}</th>
                                        <th scope="col" className="px-3 py-2.5">{getTranslation(state.language, 'history_result')}</th>
                                        <th scope="col" className="px-3 py-2.5 text-right">{getTranslation(state.language, 'history_actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                    {state.examHistory.map((item) => {
                                        const dateObj = new Date(item.date);
                                        const formattedDate = dateObj.toLocaleDateString(state.language === 'vi' ? 'vi-VN' : 'en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        });

                                        let modeName = '';
                                        if (item.mode === 'full') modeName = getTranslation(state.language, 'full_exam');
                                        else if (item.mode === 'random') modeName = getTranslation(state.language, 'random_exam');
                                        else if (item.mode === 'topic') modeName = getTranslation(state.language, 'practice_topic');
                                        else if (item.mode === 'retry') modeName = getTranslation(state.language, 'review_wrong');

                                        const scorePercentage = item.result?.percentage ?? 0;
                                        const passed = item.result?.passed ?? false;

                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-3 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap font-mono text-xs">
                                                    {formattedDate}
                                                </td>
                                                <td className="px-3 py-3 whitespace-nowrap text-xs">
                                                    <span className="badge-primary">{modeName}</span>
                                                </td>
                                                <td className="px-3 py-3 font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                                    {scorePercentage}% ({item.result?.correct}/{item.result?.total})
                                                </td>
                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                        passed
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                                                    }`}>
                                                        {passed
                                                            ? getTranslation(state.language, 'passed')
                                                            : getTranslation(state.language, 'failed')
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 text-right whitespace-nowrap text-xs font-semibold">
                                                    <button
                                                        onClick={() => dispatch({ type: 'VIEW_HISTORY_RESULT', payload: item })}
                                                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 transition-colors"
                                                    >
                                                        {getTranslation(state.language, 'btn_review_answers')}
                                                    </button>
                                                    <button
                                                        onClick={() => dispatch({ type: 'DELETE_HISTORY_ITEM', payload: item.id })}
                                                        className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                                    >
                                                        {getTranslation(state.language, 'btn_delete')}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Start button */}
                <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {estimatedQuestions > 0
                            ? getTranslation(state.language, 'questions_loaded', { count: estimatedQuestions })
                            : getTranslation(state.language, 'no_questions')
                        }
                    </div>
                    <button
                        onClick={handleStart}
                        disabled={estimatedQuestions === 0}
                        className="btn-primary text-lg px-12 py-4 rounded-2xl"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {getTranslation(state.language, 'start_exam')}
                    </button>

                    {/* Keyboard shortcuts hint */}
                    <div className="mt-8 text-xs text-gray-400 dark:text-gray-500">
                        <p className="font-medium mb-1">⌨️ {getTranslation(state.language, 'kb_shortcuts')}</p>
                        <p>{getTranslation(state.language, 'kb_desc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
