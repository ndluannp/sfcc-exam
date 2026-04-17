/**
 * Exam utility functions
 */

// Map source filenames to readable topic names
const SOURCE_TOPIC_MAP = {
    'Questions_20260403.md': 'General Practice',
    'b2c_dev_exam_set1.md': 'Set 1 - B2C Commerce Setup',
    'b2c_dev_exam_set2.md': 'Set 2 - Working with B2C Sites',
    'b2c_dev_exam_set3_hard.md': 'Set 3 - Advanced Development',
    'b2c_dev_exam_set4.md': 'Set 4 - Application Development',
    'b2c_dev_exam_set9.md': 'Set 9 - Data Management',
    'b2c_dev_exam_set10.md': 'Set 10 - OCAPI & Integrations',
    'b2c_dev_exam_set11.md': 'Set 11 - Jobs & Services',
    'b2c_dev_exam_set12.md': 'Set 12 - Search & Navigation',
    'b2c_dev_exam_set13.md': 'Set 13 - Performance & Security',
    'b2c_dev_exam_set14.md': 'Set 14 - Debugging & Testing',
    'QA_1.html': 'QA 1 - Platform Events & Async Apex',
    'QA_2.html': 'QA 2 - Apex Integration & Testing',
    'QA_3.html': 'QA 3 - JavaScript Fundamentals',
    'QA_4.html': 'QA 4 - LWC Basics',
    'QA_5.html': 'QA 5 - Aura Components',
    'QA_6.html': 'QA 6 - Data Modeling & Security',
    'QA_7.html': 'QA 7 - Comprehensive Practice',
};

export function getTopicName(source) {
    return SOURCE_TOPIC_MAP[source] || source;
}

export function getUniqueTopics(questions) {
    const topics = [...new Set(questions.map(q => q.source))];
    return topics.map(src => ({
        id: src,
        name: getTopicName(src),
        count: questions.filter(q => q.source === src).length,
    }));
}

// Fisher-Yates shuffle
export function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function shuffleOptions(question) {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const indexed = question.options.map((opt, i) => ({
        originalLabel: labels[i],
        text: opt,
    }));
    const shuffled = shuffleArray(indexed);
    const newAnswer = question.answer.map(ans => {
        const originalIdx = labels.indexOf(ans);
        const newIdx = shuffled.findIndex(s => s.originalLabel === labels[originalIdx]);
        return labels[newIdx];
    });
    return {
        ...question,
        options: shuffled.map(s => s.text),
        answer: newAnswer,
        _optionMap: shuffled.map(s => s.originalLabel),
    };
}

export function selectQuestions(allQuestions, mode, options = {}) {
    const { topics = [], wrongIds = [], count = 60 } = options;

    // Deduplicate by ID
    const seen = new Set();
    let pool = allQuestions.filter(q => {
        if (seen.has(q.id)) return false;
        seen.add(q.id);
        return true;
    });

    if (mode === 'topic' && topics.length > 0) {
        pool = pool.filter(q => topics.includes(q.source));
    }

    if (mode === 'retry') {
        const wrongIdsSet = new Set((wrongIds || []).map(id => String(id)));
        pool = pool.filter(q => wrongIdsSet.has(String(q.id)));
    }

    pool = shuffleArray(pool);

    if (mode === 'full') {
        const scored = pool.slice(0, Math.min(count, pool.length));
        const scoredIds = new Set(scored.map(q => q.id));
        const remaining = pool.filter(q => !scoredIds.has(q.id));
        const nonScored = remaining.slice(0, 5).map(q => ({ ...q, _nonScored: true }));
        return shuffleArray([...scored, ...nonScored]);
    }

    if (mode === 'random') {
        return pool.slice(0, Math.min(count, pool.length));
    }

    return pool;
}

export function calculateScore(questions, answers) {
    const scoredQuestions = questions.filter(q => !q._nonScored);
    let correct = 0;
    let wrong = 0;
    const details = [];

    scoredQuestions.forEach(q => {
        const userAnswer = answers[q.id] || [];
        const isCorrect = arraysEqual(
            [...userAnswer].sort(),
            [...q.answer].sort()
        );
        if (isCorrect) correct++;
        else wrong++;
        details.push({
            ...q,
            userAnswer,
            isCorrect,
        });
    });

    const total = scoredQuestions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passingScore = 65;

    return {
        correct,
        wrong,
        total,
        percentage,
        passed: percentage >= passingScore,
        passingScore,
        details,
    };
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
}

export function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function getLetterIndex(letter) {
    return letter.charCodeAt(0) - 65; // A=0, B=1, ...
}

export function getLetter(index) {
    return String.fromCharCode(65 + index);
}
