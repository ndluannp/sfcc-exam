import React, { useEffect, useRef, useCallback } from 'react';
import { useExam } from '../contexts/ExamContext';
import { formatTime, calculateScore } from '../utils/examUtils';

export default function Timer() {
    const { state, dispatch } = useExam();
    const intervalRef = useRef(null);
    const audioRef = useRef(null);
    const warnedRef = useRef(false);

    const handleSubmit = useCallback(() => {
        if (!state.examStarted) return;
        const result = calculateScore(state.questions, state.answers);
        result.timePerQuestion = state.timePerQuestion;
        result.mode = state.mode;

        // Save wrong IDs
        const wrongIds = result.details
            .filter(d => !d.isCorrect)
            .map(d => d.id);
        dispatch({ type: 'SET_WRONG_IDS', payload: wrongIds });
        dispatch({ type: 'SUBMIT_EXAM', payload: result });
    }, [state.examStarted, state.questions, state.answers, state.timePerQuestion, state.mode, dispatch]);

    useEffect(() => {
        if (!state.examStarted || state.screen !== 'exam') return;

        intervalRef.current = setInterval(() => {
            dispatch({ type: 'TICK_TIMER' });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [state.examStarted, state.screen, dispatch]);

    // Auto submit at 0
    useEffect(() => {
        if (state.timeRemaining <= 0 && state.examStarted) {
            handleSubmit();
        }
    }, [state.timeRemaining, state.examStarted, handleSubmit]);

    // Warning sound at 5 minutes
    useEffect(() => {
        if (state.timeRemaining === 300 && !warnedRef.current && state.examStarted) {
            warnedRef.current = true;
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 800;
                gain.gain.value = 0.3;
                osc.start();
                setTimeout(() => { osc.stop(); ctx.close(); }, 500);
            } catch (e) { /* audio not available */ }
        }
    }, [state.timeRemaining, state.examStarted]);

    const minutes = Math.floor(state.timeRemaining / 60);
    const isUrgent = state.timeRemaining <= 300;
    const isCritical = state.timeRemaining <= 60;

    return (
        <div
            className={`flex items-center gap-2 font-mono text-lg font-bold tabular-nums transition-colors duration-300 ${isCritical
                    ? 'text-rose-500 animate-pulse'
                    : isUrgent
                        ? 'text-amber-500'
                        : 'text-gray-700 dark:text-gray-200'
                }`}
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatTime(state.timeRemaining)}</span>
        </div>
    );
}
