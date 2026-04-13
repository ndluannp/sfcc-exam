import React from 'react';
import { useExam } from './contexts/ExamContext';
import StartScreen from './components/StartScreen';
import ExamPage from './components/ExamPage';
import ResultPage from './components/ResultPage';
import ReviewPage from './components/ReviewPage';

export default function App() {
    const { state } = useExam();

    switch (state.screen) {
        case 'exam':
            return <ExamPage />;
        case 'result':
            return <ResultPage />;
        case 'review':
            return <ReviewPage />;
        default:
            return <StartScreen />;
    }
}
