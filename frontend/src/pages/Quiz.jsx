import React, { useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import { TechIcon } from '../components/TechIcon';
import { playTactilePop, playSuccessChime, playTickSound } from '../utils/sound';

const Quiz = () => {
  const navigate = useNavigate();
  const {
    questions,
    selectedCategory,
    currentQuestion,
    score,
    timer,
    isQuizEnd,
    isSubmitting,
    quizResults,
    streak,
    lastEarnedXp,
    handleAnswer,
    handleNextQuestions,
    handleRestartQuiz,
  } = useContext(QuizContext);

  useEffect(() => {
    if (timer > 0 && timer <= 3 && !isQuizEnd && !isSubmitting) {
      playTickSound();
    }
  }, [timer, isQuizEnd, isSubmitting]);

  useEffect(() => {
    if (isQuizEnd) {
      playSuccessChime();
    }
  }, [isQuizEnd]);

  const onAnswer = useCallback((opt) => {
    playTactilePop();
    handleAnswer(opt);
  }, [handleAnswer]);

  const onNext = useCallback(() => {
    playTactilePop();
    handleNextQuestions();
  }, [handleNextQuestions]);

  // Keyboard navigation [A-D] or [1-4]
  useEffect(() => {
    if (isQuizEnd || isSubmitting || !questions || questions.length === 0) return;

    const currentQ = questions[currentQuestion];
    if (!currentQ) return;

    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      const options = currentQ.options;

      if (key === 'A' || key === '1') {
        if (options[0]) onAnswer(options[0]);
      } else if (key === 'B' || key === '2') {
        if (options[1]) onAnswer(options[1]);
      } else if (key === 'C' || key === '3') {
        if (options[2]) onAnswer(options[2]);
      } else if (key === 'D' || key === '4') {
        if (options[3]) onAnswer(options[3]);
      } else if (e.key === 'Enter') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, isQuizEnd, isSubmitting, onAnswer, onNext, questions]);

  // Submitting state
  if (isSubmitting) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-zinc-100 bg-[#09090b]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-transparent mb-3" />
        <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
          Evaluating Answers Server-Side...
        </p>
      </div>
    );
  }

  // Loading questions state
  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6 text-zinc-100 bg-[#09090b]">
        <p className="font-mono text-xs text-zinc-400">
          Loading {selectedCategory} questions...
        </p>
      </div>
    );
  }

  // Results Screen
  if (isQuizEnd) {
    const isPerfect = score === questions.length && questions.length > 0;
    const gainedXp = lastEarnedXp || score * 10 + (isPerfect ? 50 : 20);

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 bg-[#09090b] text-zinc-100">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-2">
            Assessment Completed
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 mb-2">
            Round Summary
          </h2>

          <div className="my-3 flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
            <span className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-300">
              Track: {selectedCategory}
            </span>
            <span className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-emerald-400 font-semibold">
              +⚡ {gainedXp} XP
            </span>
            <span className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-amber-400 font-semibold">
              🔥 {streak || 1}d Streak
            </span>
          </div>

          <div className="my-6 flex items-baseline justify-center gap-2 font-mono">
            <span className="text-5xl font-extrabold text-zinc-100">{score}</span>
            <span className="text-xl text-zinc-500">/ {questions.length}</span>
          </div>

          <p className="text-sm text-zinc-400 mb-6">
            {isPerfect
              ? 'Verified 100% score! Certificate unlocked in your dashboard.'
              : `You scored ${Math.round((score / questions.length) * 100)}%. Score 10/10 to unlock your credential.`}
          </p>

          <div className="flex justify-center gap-3 mb-10">
            <button
              onClick={() => {
                playTactilePop();
                handleRestartQuiz();
              }}
              className="btn-primary"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                playTactilePop();
                navigate('/dashboard');
              }}
              className="btn-secondary"
            >
              View Dashboard
            </button>
          </div>

          {/* Answer Breakdown */}
          <div className="text-left border border-zinc-800 bg-[#121215] rounded-xl p-5 sm:p-6 shadow-sm">
            <h3 className="font-semibold text-sm text-zinc-200 mb-4 flex items-center justify-between font-mono">
              <span>Answer Breakdown &amp; Concepts</span>
              <span className="text-zinc-500 text-xs">{score}/{questions.length} Correct</span>
            </h3>

            <div className="space-y-3.5">
              {quizResults.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    ans.isCorrect
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-rose-500/20 bg-rose-500/5'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2 font-mono text-xs">
                    <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300 font-bold">
                      Q{idx + 1}
                    </span>
                    <span className="font-sans text-sm font-medium text-zinc-200">
                      {ans.question}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-xs pl-1">
                    <p className="text-emerald-400">
                      <span className="text-zinc-500 mr-2">Correct:</span>
                      {ans.correctAnswer}
                    </p>
                    <p className={ans.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                      <span className="text-zinc-500 mr-2">Your Answer:</span>
                      {ans.selectedAnswer ?? 'Timed Out'}
                    </p>
                  </div>

                  {ans.explanation && (
                    <div className="mt-3 p-2.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 leading-relaxed font-sans">
                      <span className="font-mono text-zinc-300 font-semibold mr-1">Concept:</span>
                      {ans.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Question View
  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;

  const { question, options } = currentQ;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center p-4 sm:p-6 bg-[#09090b] text-zinc-100">
      <div className="w-full max-w-xl space-y-4">
        {/* Top Header */}
        <div className="flex justify-between items-center font-mono text-xs text-zinc-400 px-1">
          <span className="flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-zinc-300">
            <TechIcon name={selectedCategory} className="w-3.5 h-3.5 opacity-80" />
            <span>{selectedCategory} Blitz</span>
          </span>
          <span>
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-zinc-800 bg-[#121215] p-6 sm:p-7 shadow-sm">
          {/* Timer and Progress */}
          <div className="flex items-center justify-between gap-4 mb-6 font-mono text-xs">
            <div className="flex-1">
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/60">
                <div
                  className="h-full bg-zinc-200 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div
              className={`rounded border px-2.5 py-0.5 font-bold ${
                timer <= 3
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 animate-pulse'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-300'
              }`}
            >
              ⏱ {timer}s
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg font-semibold text-zinc-100 text-left mb-6 leading-relaxed">
            {question}
          </h2>

          {/* Options */}
          <div className="space-y-2.5">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onAnswer(opt)}
                className="quiz-option-card group"
              >
                <span className="kbd mr-3">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-xs sm:text-sm font-medium text-zinc-300 group-hover:text-zinc-100 flex-1 leading-snug">
                  {opt}
                </span>
              </button>
            ))}
          </div>

          {/* Footer Controls */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between font-mono text-xs text-zinc-500">
            <span className="hidden sm:inline text-[11px]">
              Press keys [A-D] or [1-4]
            </span>
            <button
              onClick={onNext}
              className="ml-auto rounded border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition"
            >
              {currentQuestion === questions.length - 1 ? 'Submit Round →' : 'Skip →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
