import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QuizContext } from '../context/QuizContext'

const Quiz = () => {
  const navigate = useNavigate()
  const {
    questions,
    selectedCategory,
    currentQuestion,
    score,
    timer,
    isTimeUp,
    isQuizEnd,
    userAnswers,
    handleAnswer,
    handleNextQuestions,
    handleRestartQuiz,
  } = useContext(QuizContext)

  // auto-advance when time is up
  useEffect(() => {
    if (isTimeUp) handleNextQuestions()
  }, [isTimeUp, handleNextQuestions])

  // loading state
  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-white">
        <p className="font-mono text-base font-semibold text-cyan-300 animate-pulse">
          Loading {selectedCategory} questions...
        </p>
      </div>
    )
  }

  // quiz end / review
  if (isQuizEnd) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white">
        <div className="w-full max-w-3xl flex flex-col items-center text-center">
          <p className="font-mono text-xs uppercase tracking-widest font-semibold text-cyan-300 mb-2">
            Round Summary
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Quiz Completed!
          </h2>
          <div className="my-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
            Track: <span className="text-cyan-300">{selectedCategory}</span>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="font-mono text-5xl font-extrabold text-emerald-400">
              {score}
            </span>
            <span className="font-mono text-2xl font-bold text-slate-400">
              / {questions.length}
            </span>
          </div>

          <p className="text-sm font-medium text-slate-300 mb-6">
            {score === questions.length
              ? '🎉 Outstanding! Perfect score achieved!'
              : `You scored ${Math.round((score / questions.length) * 100)}%. Keep practicing to unlock the certificate!`}
          </p>

          {score === questions.length ? (
            <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-4 text-center">
              <p className="font-semibold text-sm sm:text-base text-emerald-300">
                Certificate Unlocked for {selectedCategory}!
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-3 rounded-full bg-emerald-400 px-6 py-2 font-mono text-xs uppercase tracking-wider font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                View In Dashboard →
              </button>
            </div>
          ) : (
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center">
              <p className="text-sm font-medium text-slate-300">
                Score full marks to unlock your {selectedCategory} certificate.
              </p>
            </div>
          )}

          <button
            onClick={handleRestartQuiz}
            className="rounded-xl bg-white px-7 py-3 font-semibold text-sm sm:text-base text-slate-950 transition hover:bg-slate-200 mb-8 shadow-md"
          >
            Restart Quiz
          </button>

          <div className="w-full text-left p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0d1228] shadow-xl">
            <h3 className="font-bold text-xl text-white mb-6 tracking-tight">
              Review Your Answers
            </h3>
            <div className="space-y-4">
              {userAnswers.map((ans, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-white/10 bg-white/5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-cyan-300 rounded-md bg-cyan-400/10 px-2 py-0.5 border border-cyan-400/20">
                      Q{idx + 1}
                    </span>
                    <p className="font-semibold text-base text-slate-100">
                      {ans.question}
                    </p>
                  </div>
                  <div className="mt-3 space-y-1.5 font-mono text-xs sm:text-sm pl-2">
                    <p className="text-emerald-400">
                      <span className="font-bold uppercase tracking-wider text-emerald-300/80 mr-2">
                        Correct:
                      </span>
                      {ans.correctAnswer}
                    </p>
                    <p className={ans.selectedAnswer === ans.correctAnswer ? 'text-emerald-400' : 'text-rose-400'}>
                      <span className="font-bold uppercase tracking-wider text-slate-400 mr-2">
                        Your Pick:
                      </span>
                      {ans.selectedAnswer ?? 'Not Answered'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // destructure current question
  const { question, options } = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-r from-[#13072e] to-[#3f2182] text-white">
      {/* Top Metadata Header */}
      <div className="flex justify-between items-center w-full max-w-3xl mb-5 px-1 font-mono text-xs font-semibold uppercase tracking-wider">
        <span className="text-cyan-300 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1">
          {selectedCategory}
        </span>
        <span className="text-slate-300">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-3xl p-6 sm:p-8 bg-[#1a1330] rounded-2xl shadow-2xl border border-white/10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center mb-6 text-white tracking-tight leading-snug">
          {question}
        </h2>

        {/* Timer & Progress */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 font-mono text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 font-mono text-sm font-bold text-amber-300">
            <span>⏱</span>
            <span>{timer}s</span>
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="group flex w-full items-center gap-3.5 rounded-xl border border-white/10 bg-white/5 p-4 text-left font-medium text-sm sm:text-base text-slate-100 transition hover:border-cyan-300/60 hover:bg-white/10 active:scale-[0.99]"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 font-mono text-xs font-bold text-cyan-300 group-hover:border-cyan-300 group-hover:bg-cyan-300 group-hover:text-slate-950 transition">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="leading-snug">{opt}</span>
            </button>
          ))}
        </div>

        {/* Skip to Next */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNextQuestions}
            className="rounded-lg border border-white/20 bg-white/5 px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Skip Question →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz
