import React, { useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../context/QuizContext';
import { TechIcon, TrophyIcon, FlameIcon } from '../components/TechIcon';
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

  // Play tick sound when timer reaches critical last 3 seconds
  useEffect(() => {
    if (timer > 0 && timer <= 3 && !isQuizEnd && !isSubmitting) {
      playTickSound();
    }
  }, [timer, isQuizEnd, isSubmitting]);

  // Play success sound when quiz finishes
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

  // Keyboard Navigation: Press 1-4 or A-D to pick answer, Enter to advance
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

  // Submitting loading state
  if (isSubmitting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-white bg-[#090d16]">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-cyan-400 border-t-transparent mb-4" />
        <p className="font-mono text-sm font-semibold uppercase tracking-wider text-cyan-300 animate-pulse">
          Evaluating Answers Server-Side...
        </p>
      </div>
    );
  }

  // Loading questions state
  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-white bg-[#090d16]">
        <p className="font-mono text-base font-semibold text-cyan-300 animate-pulse">
          Loading {selectedCategory} questions...
        </p>
      </div>
    );
  }

  // Quiz end / server-verified review
  if (isQuizEnd) {
    const isPerfect = score === questions.length && questions.length > 0;
    const gainedXp = lastEarnedXp || score * 10 + (isPerfect ? 50 : 20);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-white bg-[#090d16]">
        <div className="w-full max-w-3xl flex flex-col items-center text-center">
          <p className="font-mono text-xs uppercase tracking-widest font-semibold text-cyan-300 mb-2">
            Verified Round Summary
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Quiz Completed!
          </h2>

          <div className="my-2 flex flex-wrap items-center justify-center gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 font-mono text-xs font-semibold text-slate-300">
              <TechIcon name={selectedCategory} className="w-3.5 h-3.5" />
              <span>Track: <span className="text-cyan-300">{selectedCategory}</span></span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 font-mono text-xs font-bold text-cyan-300">
              <span>+⚡ {gainedXp} XP</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 font-mono text-xs font-bold text-amber-300">
              <FlameIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>{streak || 1}d Streak Active</span>
            </div>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="font-mono text-5xl sm:text-6xl font-extrabold text-emerald-400">
              {score}
            </span>
            <span className="font-mono text-2xl font-bold text-slate-400">
              / {questions.length}
            </span>
          </div>

          <p className="text-sm font-medium text-slate-300 mb-6">
            {isPerfect
              ? '🎉 Outstanding! 100% score verified on server. Credential unlocked!'
              : `You scored ${Math.round((score / questions.length) * 100)}%. Score 10/10 to unlock your permanent certificate.`}
          </p>

          {isPerfect ? (
            <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-6 text-center max-w-md">
              <div className="flex justify-center mb-2">
                <TrophyIcon className="w-8 h-8 text-amber-400" />
              </div>
              <p className="font-bold text-base text-emerald-300">
                Official Certificate Awarded!
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Your authenticated credential is now permanently linked to your profile.
              </p>
              <button
                onClick={() => {
                  playTactilePop();
                  navigate('/dashboard');
                }}
                className="mt-4 btn-tactile-primary px-6 py-2.5 text-xs uppercase tracking-wider font-bold"
              >
                View In Dashboard →
              </button>
            </div>
          ) : (
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center">
              <p className="text-sm font-medium text-slate-300">
                Score 10/10 to unlock your permanent certificate stored in your account.
              </p>
            </div>
          )}

          <button
            onClick={() => {
              playTactilePop();
              handleRestartQuiz();
            }}
            className="btn-tactile-white px-8 py-3 text-sm font-bold mb-8 shadow-md"
          >
            Play Again
          </button>

          <div className="w-full text-left p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0e1424] shadow-xl">
            <h3 className="font-bold text-xl text-white mb-6 tracking-tight flex items-center justify-between">
              <span>Verified Answer Breakdown &amp; Concepts</span>
              <span className="font-mono text-xs font-normal text-slate-400">
                {score} of {questions.length} Correct
              </span>
            </h3>
            <div className="space-y-4">
              {quizResults.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-xl border ${
                    ans.isCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-rose-500/30 bg-rose-500/5'
                  }`}
                >
                  <div className="flex items-start gap-2.5 mb-2">
                    <span className="font-mono text-xs font-bold text-cyan-300 rounded-md bg-cyan-400/10 px-2 py-0.5 border border-cyan-400/20 flex-shrink-0 mt-0.5">
                      Q{idx + 1}
                    </span>
                    <p className="font-semibold text-sm sm:text-base text-slate-100">
                      {ans.question}
                    </p>
                  </div>

                  <div className="mt-3 space-y-1 font-mono text-xs sm:text-sm pl-2">
                    <p className="text-emerald-400">
                      <span className="font-bold uppercase tracking-wider text-emerald-300/80 mr-2">
                        Correct:
                      </span>
                      {ans.correctAnswer}
                    </p>
                    <p className={ans.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                      <span className="font-bold uppercase tracking-wider text-slate-400 mr-2">
                        Your Pick:
                      </span>
                      {ans.selectedAnswer ?? 'Not Answered (Timed Out)'}
                    </p>
                  </div>

                  {/* Educational Concept Callout */}
                  {ans.explanation && (
                    <div className="mt-3.5 p-3 rounded-lg bg-cyan-950/30 border border-cyan-400/20 text-xs text-cyan-100/90 leading-relaxed">
                      <span className="font-bold text-cyan-300 mr-1.5 font-mono uppercase tracking-wider">
                        💡 Key Concept:
                      </span>
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

  // Destructure current question
  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;

  const { question, options } = currentQ;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-[#090d16] text-white">
      {/* Top Metadata Header */}
      <div className="flex justify-between items-center w-full max-w-2xl mb-4 px-1 font-mono text-xs font-semibold uppercase tracking-wider">
        <span className="text-cyan-300 flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1">
          <TechIcon name={selectedCategory} className="w-3.5 h-3.5" />
          <span>{selectedCategory}</span>
        </span>
        <span className="text-slate-400">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-2xl p-6 sm:p-8 bg-[#0f172a] rounded-2xl shadow-2xl border-2 border-white/10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-6 text-white tracking-tight leading-snug">
          {question}
        </h2>

        {/* Timer & Progress */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 font-mono text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 font-mono text-sm font-bold transition-colors ${
              timer <= 3
                ? 'border-rose-500/50 bg-rose-500/20 text-rose-300 animate-pulse'
                : 'border-amber-400/30 bg-amber-400/10 text-amber-300'
            }`}
          >
            <span>⏱</span>
            <span>{timer}s</span>
          </div>
        </div>

        {/* Answer Options with Tactile 3D Buttons & Keyboard Hints */}
        <div className="grid grid-cols-1 gap-3">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(opt)}
              className="btn-tactile-option group"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 font-mono text-xs font-bold text-cyan-300 group-hover:border-cyan-300 group-hover:bg-cyan-300 group-hover:text-slate-950 transition">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="ml-3.5 font-medium text-sm sm:text-base text-slate-100 group-hover:text-white leading-snug flex-1">
                {opt}
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] text-slate-500 group-hover:text-cyan-300/80 uppercase">
                [{String.fromCharCode(65 + i)}]
              </span>
            </button>
          ))}
        </div>

        {/* Next / Skip and Keyboard Instruction Hint */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="hidden sm:inline font-mono text-slate-500 text-[11px]">
            Press keys [A-D] or [1-4] to select · Enter to advance
          </span>
          <button
            onClick={onNext}
            className="ml-auto rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            {currentQuestion === questions.length - 1 ? 'Finish & Submit →' : 'Skip →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
