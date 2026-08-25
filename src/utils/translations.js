/**
 * Application translations for English and Vietnamese
 */
export const translations = {
    en: {
        // App Header
        app_title: "SFCC Developer Exam",
        
        // Language Selector
        lang_en: "English",
        lang_vi: "Tiếng Việt",
        lang_ja: "日本語",

        // Bank Selection
        bank_source: "Question Bank",
        bank_1_title: "Question Bank (Bank 1)",
        bank_2_title: "Exam Questions (Bank 2)",
        bank_3_title: "Exam Questions (Bank 3)",

        // Start Screen
        loading_questions: "Loading questions...",
        b2c_title: "B2C Commerce Cloud",
        practice_exam: "Developer Practice Exam",
        questions_available: "questions available",
        minutes: "minutes",
        passing_score: "passing score",
        exam_mode: "Exam Mode",
        full_exam: "Full Exam",
        full_exam_desc: "60 scored + 5 non-scored questions, 105 min",
        random_exam: "Random",
        random_exam_desc: "Customizable random questions from all sets",
        practice_topic: "Practice by Topic",
        practice_topic_desc: "Select specific topic sets",
        review_wrong: "Review Wrong Answers",
        review_wrong_desc: "Retry {count} wrong questions",
        select_topics: "Select Topics",
        questions: "questions",
        num_questions: "Number of Questions",
        available: "available",
        all: "All",
        custom: "Custom",
        options: "Options",
        shuffle_questions: "Shuffle question order",
        shuffle_answers: "Shuffle answer order",
        study_mode: "Study mode (show answer immediately after selecting)",
        questions_loaded: "{count} questions will be loaded",
        no_questions: "No questions available for this selection",
        start_exam: "Start Exam",
        kb_shortcuts: "Keyboard Shortcuts (during exam)",
        kb_desc: "A/B/C/D = select option · N = next · P = previous · F = flag",
        
        // Exam Page
        answered: "Answered",
        unanswered: "Unanswered",
        flagged: "Flagged",
        submit: "Submit",
        submit_confirm_title: "Submit Exam?",
        submit_confirm_warning: "You have {count} unanswered questions.",
        continue_exam: "Continue Exam",
        submit_now: "Submit Now",
        
        // Result Page
        passed: "PASSED",
        failed: "FAILED",
        congrats: "🎉 Congratulations!",
        keep_practicing: "Keep Practicing! 💪",
        passed_desc: "You have passed the practice exam.",
        failed_desc: "You need {score}% to pass. Keep studying!",
        stats_correct: "Correct",
        stats_wrong: "Wrong",
        stats_total: "Total",
        stats_avg_time: "Avg Time",
        topic_accuracy: "Topic Accuracy",
        btn_review_answers: "Review Answers",
        btn_retry_wrong: "Retry Wrong Questions",
        btn_back_home: "Back to Home",
        
        // Review Page
        review_title: "Answer Review",
        review_subtitle: "Score: {percentage}% · {correct}/{total} correct",
        filter_all: "All ({count})",
        filter_wrong: "Wrong ({count})",
        filter_correct: "Correct ({count})",
        collapse_all: "Collapse All",
        expand_all: "Expand All",
        no_filter_results: "No questions to show for this filter.",
        btn_retry_wrong_count: "Retry Wrong Questions ({count})",
        explanation: "Explanation",
        tip: "Tip",
        correct_label: "Correct",
        your_answer_label: "Your answer",
        prev_incorrect_label: "Your previous incorrect answer",
        
        // Exam History
        exam_history: "Exam History",
        history_date: "Date",
        history_score: "Score",
        history_time: "Time",
        history_result: "Result",
        history_actions: "Actions",
        history_empty: "No exam history found. Try a test to see your history here!",
        btn_clear_history: "Clear History",
        btn_delete: "Delete",
        confirm_clear_history: "Are you sure you want to clear all exam history?",
    },
    vi: {
        // App Header
        app_title: "Luyện thi SFCC Developer",
        
        // Language Selector
        lang_en: "English",
        lang_vi: "Tiếng Việt",
        lang_ja: "日本語",

        // Bank Selection
        bank_source: "Ngân hàng câu hỏi",
        bank_1_title: "Ngân Hàng Câu Hỏi",
        bank_2_title: "Câu Hỏi Đề Thi",
        bank_3_title: "Câu Hỏi Đề Thi 2",

        // Start Screen
        loading_questions: "Đang tải câu hỏi...",
        b2c_title: "B2C Commerce Cloud",
        practice_exam: "Bài kiểm tra thử Developer",
        questions_available: "câu hỏi có sẵn",
        minutes: "phút",
        passing_score: "điểm đạt",
        exam_mode: "Chế độ thi",
        full_exam: "Thi đầy đủ",
        full_exam_desc: "60 câu tính điểm + 5 câu không tính điểm, 105 phút",
        random_exam: "Ngẫu nhiên",
        random_exam_desc: "Tùy chỉnh số câu hỏi ngẫu nhiên từ tất cả các bộ",
        practice_topic: "Luyện theo chủ đề",
        practice_topic_desc: "Chọn các bộ câu hỏi theo chủ đề cụ thể",
        review_wrong: "Xem lại câu sai",
        review_wrong_desc: "Làm lại {count} câu đã trả lời sai",
        select_topics: "Chọn chủ đề",
        questions: "câu hỏi",
        num_questions: "Số lượng câu hỏi",
        available: "có sẵn",
        all: "Tất cả",
        custom: "Tự chọn",
        options: "Cấu hình",
        shuffle_questions: "Trộn thứ tự câu hỏi",
        shuffle_answers: "Trộn thứ tự đáp án",
        study_mode: "Chế độ học (hiển thị đáp án ngay khi chọn)",
        questions_loaded: "{count} câu hỏi sẽ được tải",
        no_questions: "Không có câu hỏi nào phù hợp với lựa chọn",
        start_exam: "Bắt đầu thi",
        kb_shortcuts: "Phím tắt (trong khi thi)",
        kb_desc: "A/B/C/D = chọn đáp án · N = câu sau · P = câu trước · F = đánh dấu",
        
        // Exam Page
        answered: "Đã trả lời",
        unanswered: "Chưa trả lời",
        flagged: "Đã đánh dấu",
        submit: "Nộp bài",
        submit_confirm_title: "Nộp bài thi?",
        submit_confirm_warning: "Bạn còn {count} câu hỏi chưa trả lời.",
        continue_exam: "Làm tiếp",
        submit_now: "Nộp ngay",
        
        // Result Page
        passed: "ĐẠT",
        failed: "KHÔNG ĐẠT",
        congrats: "🎉 Xin chúc mừng!",
        keep_practicing: "Hãy tiếp tục cố gắng! 💪",
        passed_desc: "Bạn đã vượt qua bài kiểm tra thử.",
        failed_desc: "Bạn cần đạt {score}% để vượt qua. Hãy tiếp tục học nhé!",
        stats_correct: "Đúng",
        stats_wrong: "Sai",
        stats_total: "Tổng số câu",
        stats_avg_time: "T.gian TB",
        topic_accuracy: "Tỷ lệ đúng theo chủ đề",
        btn_review_answers: "Xem lại đáp án",
        btn_retry_wrong: "Thi lại các câu sai",
        btn_back_home: "Quay lại trang chủ",
        
        // Review Page
        review_title: "Xem lại đáp án",
        review_subtitle: "Điểm số: {percentage}% · Đúng {correct}/{total} câu",
        filter_all: "Tất cả ({count})",
        filter_wrong: "Sai ({count})",
        filter_correct: "Đúng ({count})",
        collapse_all: "Thu gọn tất cả",
        expand_all: "Mở rộng tất cả",
        no_filter_results: "Không có câu hỏi nào khớp với bộ lọc.",
        btn_retry_wrong_count: "Thi lại các câu sai ({count})",
        explanation: "Giải thích",
        tip: "Mẹo",
        correct_label: "Đúng",
        your_answer_label: "Đáp án của bạn",
        prev_incorrect_label: "Đáp án không chính xác trước đó của bạn",
        
        // Exam History
        exam_history: "Lịch sử thi thử",
        history_date: "Ngày thi",
        history_score: "Điểm số",
        history_time: "Thời gian",
        history_result: "Kết quả",
        history_actions: "Hành động",
        history_empty: "Chưa có lịch sử thi thử nào. Hãy làm một bài thi để thấy lịch sử ở đây!",
        btn_clear_history: "Xóa toàn bộ lịch sử",
        btn_delete: "Xóa",
        confirm_clear_history: "Bạn có chắc chắn muốn xóa toàn bộ lịch sử thi thử?",
    },
    ja: {
        // App Header
        app_title: "SFCCデベロッパー試験対策",
        
        // Language Selector
        lang_en: "English",
        lang_vi: "Tiếng Việt",
        lang_ja: "日本語",
        
        // Bank Selection
        bank_source: "問題バンク",
        bank_1_title: "問題バンク (バンク1)",
        bank_2_title: "試験問題 (バンク2)",
        bank_3_title: "試験問題 (バンク3)",

        // Start Screen
        loading_questions: "質問を読み込んでいます...",
        b2c_title: "B2C Commerce Cloud",
        practice_exam: "デベロッパー模擬試験",
        questions_available: "問の質問が利用可能",
        minutes: "分",
        passing_score: "合格基準",
        exam_mode: "試験モード",
        full_exam: "本番形式試験",
        full_exam_desc: "採点対象60問 ＋ 採点対象外5問、105分",
        random_exam: "ランダム",
        random_exam_desc: "すべてのセットからランダムに出題数をカスタマイズ",
        practice_topic: "分野別練習",
        practice_topic_desc: "特定のトピックを選択して練習",
        review_wrong: "間違えた問題の復習",
        review_wrong_desc: "間違えた {count} 問に再挑戦",
        select_topics: "トピックの選択",
        questions: "問",
        num_questions: "問題数",
        available: "利用可能",
        all: "すべて",
        custom: "カスタム",
        options: "オプション",
        shuffle_questions: "問題の順序をシャッフル",
        shuffle_answers: "選択肢の順序をシャッフル",
        study_mode: "学習モード（選択直後に正解を表示）",
        questions_loaded: "{count} 問が読み込まれます",
        no_questions: "選択された条件に該当する問題はありません",
        start_exam: "試験開始",
        kb_shortcuts: "キーボードショートカット（試験中）",
        kb_desc: "A/B/C/D = 選択肢の選択 · N = 次へ · P = 前へ · F = フラグ",
        
        // Exam Page
        answered: "回答済み",
        unanswered: "未回答",
        flagged: "フラグ付き",
        submit: "提出",
        submit_confirm_title: "試験を提出しますか？",
        submit_confirm_warning: "未回答の問題が {count} 問あります。",
        continue_exam: "試験を続ける",
        submit_now: "今すぐ提出",
        
        // Result Page
        passed: "合格",
        failed: "不合格",
        congrats: "🎉 おめでとうございます！",
        keep_practicing: "あきらめずに練習を続けましょう！ 💪",
        passed_desc: "模擬試験に合格しました。",
        failed_desc: "合格には {score}% が必要です。勉強を続けましょう！",
        stats_correct: "正解数",
        stats_wrong: "不正解数",
        stats_total: "総問題数",
        stats_avg_time: "平均時間",
        topic_accuracy: "分野別正解率",
        btn_review_answers: "回答を確認する",
        btn_retry_wrong: "間違えた問題に再挑戦",
        btn_back_home: "ホームに戻る",
        
        // Review Page
        review_title: "回答レビュー",
        review_subtitle: "スコア: {percentage}% · 正解 {correct}/{total}",
        filter_all: "すべて ({count})",
        filter_wrong: "不正解 ({count})",
        filter_correct: "正解 ({count})",
        collapse_all: "すべて折りたたむ",
        expand_all: "すべて展開",
        no_filter_results: "このフィルターに該当する問題はありません。",
        btn_retry_wrong_count: "間違えた問題に再挑戦 ({count})",
        explanation: "解説",
        tip: "ヒント",
        correct_label: "正解",
        your_answer_label: "あなたの回答",
        prev_incorrect_label: "前回の不正解回答",
        
        // Exam History
        exam_history: "試験履歴",
        history_date: "日付",
        history_score: "スコア",
        history_time: "時間",
        history_result: "結果",
        history_actions: "アクション",
        history_empty: "試験履歴がありません。試験を受けて履歴を残しましょう！",
        btn_clear_history: "履歴をクリア",
        btn_delete: "削除",
        confirm_clear_history: "本当にすべての試験履歴をクリアしますか？",
    }
};

/**
 * Hook or function to get translated text with dynamic placeholders replaced
 */
export function getTranslation(lang, key, placeholders = {}) {
    const locale = translations[lang] || translations.en;
    let text = locale[key] || translations.en[key] || key;
    
    Object.keys(placeholders).forEach(placeholder => {
        text = text.replace(`{${placeholder}}`, placeholders[placeholder]);
    });
    
    return text;
}
