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
    handleRestartQuiz
  } = useContext(QuizContext)

  // auto-advance when time is up
  useEffect(() => {
    if (isTimeUp) handleNextQuestions()
  }, [isTimeUp, handleNextQuestions])

  // loading state
  if (!questions || questions.length === 0) {
    return <p className="text-center text-xl">Loading {selectedCategory} questions...</p>
  }

  // quiz end / review
  if (isQuizEnd) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white">
        <h2 className="text-4xl font-bold mb-4">Quiz Finished</h2>
        <p className="text-2xl mb-6">
          Your Score: {score} / {questions.length}
        </p>
        <p className="mb-6 text-lg text-cyan-300">
          Track: {selectedCategory}
        </p>
        {score === questions.length ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-4 text-center">
            <p className="text-lg font-semibold text-emerald-300">
              Certificate unlocked for {selectedCategory}.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 rounded-full bg-emerald-400 px-5 py-2 font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              View In Dashboard
            </button>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
            <p className="text-base text-slate-300">
              Score full marks to unlock your {selectedCategory} certificate.
            </p>
          </div>
        )}
        <button
          onClick={handleRestartQuiz}
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-8 rounded-lg mb-8 transform hover:scale-105 transition"
        >
          Restart Quiz
        </button>

        <div className="w-full max-w-4xl p-6 rounded-lg bg-[#1a1330] shadow-lg overflow-auto">
          <h3 className="text-2xl font-semibold mb-4">Review Your Answers</h3>
          <div className="space-y-6">
            {userAnswers.map((ans, idx) => (
  <div key={idx} className="p-4 border rounded-lg">
    <p className="font-bold mb-2">
      Q{idx + 1}: {ans.question}
    </p>
    <p className="mb-1">
      <span className="font-semibold text-green-500">
        Correct Answer:
      </span>{" "}
      {ans.correctAnswer}
    </p>
    <p>
      <span className="font-semibold text-red-500">
        Your Answer:
      </span>{" "}
      {ans.selectedAnswer ?? "Not Answered"}
    </p>
  </div>
))}
          </div>
        </div>
      </div>
    )
  }

  // destructure current question
  const { question, options } = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-r from-[#13072e] to-[#3f2182] text-white">
      {/* Progress Info */}
      <div className="flex justify-between w-full max-w-3xl mb-6">
        <p className="text-lg font-bold">
          Total Questions: {questions.length}
        </p>
        <p className="text-lg font-bold">
          {selectedCategory} Question: {currentQuestion + 1}
        </p>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-3xl p-8 bg-[#1a1330] rounded-xl shadow-lg border">
        <h2 className="text-3xl font-bold text-center mb-4">{question}</h2>

        <p className="text-xl text-center mb-6">
          Time Left:{' '}
          <span className="text-red-500 font-semibold">{timer}</span>
        </p>

        <div className="w-full mb-6">
          {/* Outer track */}
          <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
            {/* Inner fill */}
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Label */}
          <div className="text-center text-white font-semibold mt-1">
            {Math.round(progress)}% Completed
          </div>
        </div>


        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="w-full py-3 px-6 bg-indigo-500 hover:bg-green-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition"
            >
              {opt}
            </button>
          ))}

          {/* Skip to Next */}
          <button
            onClick={handleNextQuestions}
            className="mt-4 border border-white text-white py-2 px-4 rounded-md hover:bg-blue-500 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz
